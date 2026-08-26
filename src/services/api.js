// ==============================================================================
// CLIENT API SERVICE: KAL DISCOBAR & REMOTE CONTROL ENGINE
// ==============================================================================
import { supabase } from './supabaseClient.js';

const rawApiUrl = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) || 'https://kal-discobar-backend.onrender.com';
export const API_BASE = rawApiUrl.replace(/\/+$/, '');

/**
 * Consulta el estado de suscripción / pago del sistema (active | unpaid)
 * Doble capa: 1. Render API -> 2. Supabase PostgreSQL Directo (< 150ms)
 */
export async function getSubscriptionStatus() {
  // 1. Supabase Cloud (< 150ms) - Consulta instantánea en paralelo
  try {
    if (supabase) {
      const [globalRes, modulesRes, adminAuthRes] = await Promise.allSettled([
        supabase.from('system_settings').select('subscription_status').eq('id', 'global').single(),
        supabase.from('system_settings').select('subscription_status').eq('id', 'modules').maybeSingle(),
        supabase.from('system_settings').select('subscription_status').eq('id', 'admin_auth').maybeSingle()
      ]);

      let dbStatus = 'active';
      if (globalRes.status === 'fulfilled' && globalRes.value.data) {
        dbStatus = globalRes.value.data.subscription_status || 'active';
      }

      let parsedModules = null;
      if (modulesRes.status === 'fulfilled' && modulesRes.value.data?.subscription_status) {
        try {
          parsedModules = JSON.parse(modulesRes.value.data.subscription_status);
        } catch {}
      }

      let remoteAdminPassword = null;
      if (adminAuthRes.status === 'fulfilled' && adminAuthRes.value.data?.subscription_status) {
        remoteAdminPassword = adminAuthRes.value.data.subscription_status.trim();
      }

      if (dbStatus === 'unpaid' || parsedModules || remoteAdminPassword) {
        const isLocked = dbStatus === 'unpaid';
        return {
          success: true,
          status: dbStatus,
          adminPassword: remoteAdminPassword,
          modules: {
            metrics: parsedModules?.metrics !== false,
            orders: parsedModules?.orders !== false,
            menu_editor: parsedModules?.menu_editor !== false,
            menu: !isLocked,
            catalog: !isLocked,
            dashboard: !isLocked,
            admin: !isLocked,
            ...(parsedModules || {})
          }
        };
      }
    }
  } catch (dbErr) {
    console.warn('[API] Error consultando Supabase:', dbErr);
  }

  // 2. Consultar a Render Backend
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);
    const res = await fetch(`${API_BASE}/api/bookings/admin/subscription-status`, {
      signal: controller.signal,
      cache: 'no-store',
      headers: { 'Pragma': 'no-cache', 'Cache-Control': 'no-cache' }
    });
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      if (data && data.status) {
        return data;
      }
    }
  } catch (err) {
    // Fallback silencioso
  }

  return { success: false, status: 'active' };
}

/**
 * Modifica el estado de suscripción / pago del sistema remotamente (active | unpaid)
 */
export async function setSubscriptionStatusAdmin(status, adminKey = 'KarolN2026@') {
  try {
    const res = await fetch(`${API_BASE}/api/bookings/admin/set-subscription-status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': adminKey,
      },
      body: JSON.stringify({ status, key: adminKey }),
    });
    return await res.json();
  } catch (err) {
    console.error('[API] Error actualizando estado:', err);
    return { success: false };
  }
}

/**
 * Actualiza la contraseña del usuario Administrador remotamente
 */
export async function updateAdminPasswordRemote(newPassword, adminKey = 'PanelPassword1966@') {
  try {
    const res = await fetch(`${API_BASE}/api/bookings/admin/update-admin-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': adminKey,
      },
      body: JSON.stringify({ password: newPassword, newPassword, key: adminKey }),
    });
    return await res.json();
  } catch (err) {
    console.error('[API] Error actualizando contraseña admin:', err);
    return { success: false, error: err.message };
  }
}
