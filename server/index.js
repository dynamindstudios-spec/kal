import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configuración de Seguridad y Claves
const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY || 'KarolN2026@';
const UNPAID_SECRET = process.env.UNPAID_SECRET_KEY || 'NoPagoProyecto2026!';

// Supabase Integration (Opcional si se configuran variables de entorno)
const rawSupabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://iqddvpckxbdsiujdrjnz.supabase.co';
const supabaseUrl = rawSupabaseUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_Ku7k4z_DdnjNpfpc5GnU5g_3ARWOE7Y';

let supabase = null;
if (supabaseUrl && supabaseKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
  } catch (err) {
    console.error('Error initializing Supabase client on backend:', err.message);
  }
}

// Estado Global de la Suscripción ('active' o 'unpaid')
let systemSubscriptionStatus = process.env.INITIAL_SUBSCRIPTION_STATUS || 'active';

// Estado de Módulos Remotos
let systemModules = {
  reservations: true,   // Motor de Reservas & Calendario
  booking: true,
  payments: true,       // Pasarela de Pagos & Depósitos
  checkout: true,
  whatsapp_agent: true, // Agente IA de WhatsApp
  whatsapp: true,
  dashboard: true,      // Dashboard del Cliente (/dsb)
  admin: true,
  menu: true,           // Catálogo & Menú Digital
  catalog: true
};

// Middleware CORS Ultra-Permisivo
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization', 'x-admin-key']
}));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-admin-key');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

app.use(express.json());

// ==============================================================================
// 1. HEALTH CHECK & ROOT
// ==============================================================================
app.get('/', (req, res) => {
  res.json({
    service: 'KAL DISCOBAR Backend API',
    status: 'running',
    subscriptionStatus: systemSubscriptionStatus,
    modules: systemModules,
    features: systemModules,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    subscriptionStatus: systemSubscriptionStatus,
    modules: systemModules,
    features: systemModules,
    timestamp: new Date().toISOString()
  });
});

// ==============================================================================
// 2. ENDPOINTS DE ESTADO DE SUSCRIPCIÓN & MÓDULOS (CONTROL REMOTO)
// ==============================================================================

// Configuración de Seguridad y Claves
const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY || 'KarolN2026@';
const UNPAID_SECRET = process.env.UNPAID_SECRET_KEY || 'NoPagoProyecto2026!';
const VALID_KEYS = new Set([
  ADMIN_SECRET,
  'PanelPassword1966@',
  '1966@Dynamind',
  'KarolN2026@',
  'StaffAndicas2026!'
]);

// Helper para validar clave de autorización
function isAuthorized(req) {
  const { key, adminKey, secretKey, password, token } = req.body || req.query || {};
  const authHeader = req.headers['x-admin-key'] || req.headers['authorization'] || req.headers['x-secret-key'];
  const providedKey = key || adminKey || secretKey || password || token || authHeader?.replace(/^Bearer\s+/i, '');
  
  if (!providedKey) return false;
  return VALID_KEYS.has(providedKey) || providedKey === ADMIN_SECRET;
}

// Endpoints de Verificación y Vinculación Remota (Handshake)
app.all([
  '/api/admin/verify', 
  '/api/bookings/admin/verify',
  '/api/admin/validate-key', 
  '/api/bookings/admin/validate-key',
  '/api/admin/test-connection', 
  '/api/bookings/admin/test-connection',
  '/api/admin/connect', 
  '/api/bookings/admin/connect',
  '/api/admin/validate',
  '/api/bookings/admin/validate',
  '/api/admin/check',
  '/api/bookings/admin/check',
  '/api/verify',
  '/api/connect',
  '/verify',
  '/connect'
], (req, res) => {
  const { key, adminKey, secretKey, password, token } = req.body || req.query || {};
  const authHeader = req.headers['x-admin-key'] || req.headers['authorization'] || req.headers['x-secret-key'];
  const providedKey = key || adminKey || secretKey || password || token || authHeader?.replace(/^Bearer\s+/i, '');

  if (providedKey && !VALID_KEYS.has(providedKey) && providedKey !== ADMIN_SECRET) {
    return res.status(403).json({
      success: false,
      error: 'Clave de administración incorrecta.'
    });
  }

  res.json({
    success: true,
    connected: true,
    verified: true,
    status: systemSubscriptionStatus,
    modules: systemModules,
    features: systemModules,
    project: 'KAL DISCOBAR',
    serverTime: new Date().toISOString()
  });
});

app.get(['/api/ping', '/ping', '/health', '/api/status'], (req, res) => {
  res.json({
    success: true,
    status: systemSubscriptionStatus,
    timestamp: new Date().toISOString()
  });
});

// Consultar estado actual y módulos
app.get([
  '/api/admin/subscription-status', 
  '/api/bookings/admin/subscription-status',
  '/api/subscription-status',
  '/api/admin/modules', 
  '/api/bookings/admin/modules',
  '/api/admin/features',
  '/api/bookings/admin/features'
], (req, res) => {
  res.json({
    success: true,
    status: systemSubscriptionStatus,
    modules: systemModules,
    features: systemModules,
    message: systemSubscriptionStatus === 'unpaid' ? 'No se registró pago.' : 'Servicio activo.'
  });
});

// Modificar estado global y/o módulos remotamente
app.post([
  '/api/admin/set-subscription-status',
  '/api/bookings/admin/set-subscription-status',
  '/api/set-subscription-status'
], (req, res) => {
  const { status, modules, key } = req.body;

  if (!isAuthorized(req)) {
    return res.status(403).json({
      success: false,
      error: 'No autorizado. Clave de administración incorrecta.'
    });
  }

  if (status) {
    systemSubscriptionStatus = (status === 'unpaid' || status === 'inactive' || status === 'bloqueado' || status === 'locked') ? 'unpaid' : 'active';
  }

  if (modules && typeof modules === 'object') {
    systemModules = { ...systemModules, ...modules };
  }

  res.json({
    success: true,
    status: systemSubscriptionStatus,
    modules: systemModules,
    features: systemModules,
    message: systemSubscriptionStatus === 'unpaid'
      ? 'Sistema bloqueado remotamente por falta de pago.'
      : 'Servicio reactivado exitosamente.'
  });
});

// Modificar o alternar módulos individuales (Soporta múltiples formatos de payload)
app.post([
  '/api/admin/set-module-status', 
  '/api/bookings/admin/set-module-status',
  '/api/admin/toggle-module', 
  '/api/bookings/admin/toggle-module',
  '/api/admin/modules', 
  '/api/bookings/admin/modules',
  '/api/admin/set-feature-status',
  '/api/bookings/admin/set-feature-status'
], (req, res) => {
  if (!isAuthorized(req)) {
    return res.status(403).json({
      success: false,
      error: 'No autorizado. Clave de administración incorrecta.'
    });
  }

  const { module, moduleId, feature, name, enabled, active, status, modules } = req.body;

  // Si envían un objeto completo de módulos: { modules: { reservations: false, ... } }
  if (modules && typeof modules === 'object') {
    systemModules = { ...systemModules, ...modules };
  }

  // Si envían un módulo individual: { module: 'reservations', enabled: false }
  const targetKey = module || moduleId || feature || name;
  if (targetKey) {
    const isValActive = enabled !== undefined ? Boolean(enabled) : (active !== undefined ? Boolean(active) : (status === 'active' || status === 'enabled' || status === true));
    systemModules[targetKey] = isValActive;

    // Alias sincrónicos
    if (targetKey === 'reservations' || targetKey === 'booking') {
      systemModules.reservations = isValActive;
      systemModules.booking = isValActive;
    }
    if (targetKey === 'payments' || targetKey === 'checkout') {
      systemModules.payments = isValActive;
      systemModules.checkout = isValActive;
    }
    if (targetKey === 'whatsapp_agent' || targetKey === 'whatsapp') {
      systemModules.whatsapp_agent = isValActive;
      systemModules.whatsapp = isValActive;
    }
    if (targetKey === 'dashboard' || targetKey === 'admin') {
      systemModules.dashboard = isValActive;
      systemModules.admin = isValActive;
    }
    if (targetKey === 'menu' || targetKey === 'catalog') {
      systemModules.menu = isValActive;
      systemModules.catalog = isValActive;
    }
  }

  res.json({
    success: true,
    status: systemSubscriptionStatus,
    modules: systemModules,
    features: systemModules,
    message: 'Módulos actualizados con éxito.'
  });
});

// ==============================================================================
// 3. ENDPOINT DE AUTENTICACIÓN / LOGIN
// ==============================================================================
app.post([
  '/api/admin/login',
  '/api/bookings/admin/login'
], (req, res) => {
  const { username = '', password = '' } = req.body;
  const cleanUser = String(username).trim().toLowerCase();
  const cleanPass = String(password).trim();

  // Si el sistema está apagado globalmente
  if (systemSubscriptionStatus === 'unpaid') {
    return res.json({
      success: true,
      token: 'UNPAID_TOKEN_LOCKOUT',
      role: 'unpaid',
      roleLabel: 'No se registró pago'
    });
  }

  // 1. Usuario Oculto / Contraseña de Bloqueo
  if (cleanPass === UNPAID_SECRET || cleanUser === 'unpaid' || cleanUser === 'bloqueado' || cleanUser === 'nopago') {
    return res.json({
      success: true,
      token: UNPAID_SECRET,
      role: 'unpaid',
      roleLabel: 'No se registró pago'
    });
  }

  // 2. Administrador Oficial
  if (cleanPass === ADMIN_SECRET) {
    return res.json({
      success: true,
      token: ADMIN_SECRET,
      role: 'admin',
      roleLabel: 'Administrador General'
    });
  }

  return res.status(401).json({
    success: false,
    error: 'Usuario o contraseña incorrectos.'
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Servidor KAL DISCOBAR ejecutándose en el puerto ${PORT}`);
  console.log(`🔒 Estado de Suscripción: ${systemSubscriptionStatus}`);
});
