// ==============================================================================
// CLIENT API SERVICE: KAL DISCOBAR & REMOTE CONTROL ENGINE
// ==============================================================================

const rawApiUrl = import.meta.env.VITE_API_URL || 'https://kal-discobar-backend.onrender.com';
export const API_BASE = rawApiUrl.replace(/\/+$/, '');

/**
 * Consulta el estado de suscripción / pago del sistema (active | unpaid)
 */
export async function getSubscriptionStatus() {
  try {
    const res = await fetch(`${API_BASE}/api/bookings/admin/subscription-status`, {
      cache: 'no-store',
      headers: { 'Pragma': 'no-cache', 'Cache-Control': 'no-cache' }
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('[API] Fallback al backend Render:', err);
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
