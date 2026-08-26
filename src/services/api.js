// ==============================================================================
// CLIENT API SERVICE: KAL DISCOBAR & REMOTE CONTROL ENGINE
// ==============================================================================
import { supabase } from './supabaseClient';

const rawApiUrl = import.meta.env.VITE_API_URL || 'https://kal-discobar-backend.onrender.com';
export const API_BASE = rawApiUrl.replace(/\/+$/, '');

/**
 * Consulta el estado de suscripción / pago del sistema (active | unpaid)
 * Doble capa: 1. Render API -> 2. Supabase PostgreSQL Directo (< 150ms)
 */
export async function getSubscriptionStatus() {
  // 1. Consultar a Render Backend
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
    // Fallback silencioso a Supabase
  }

  // 2. Fallback ultrarrápido directo a Supabase Cloud
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('system_settings')
        .select('subscription_status, modules')
        .eq('id', 'global')
        .single();

      if (!error && data) {
        return {
          success: true,
          status: data.subscription_status || 'active',
          modules: data.modules || { menu: data.subscription_status !== 'unpaid', dashboard: data.subscription_status !== 'unpaid' }
        };
      }
    }
  } catch (dbErr) {}

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
