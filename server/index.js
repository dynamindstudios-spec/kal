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
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    subscriptionStatus: systemSubscriptionStatus,
    timestamp: new Date().toISOString()
  });
});

// ==============================================================================
// 2. ENDPOINTS DE ESTADO DE SUSCRIPCIÓN (CONTROL REMOTO)
// ==============================================================================

// Consultar estado actual (Público para el Frontend y el Menú)
app.get('/api/admin/subscription-status', (req, res) => {
  res.json({
    success: true,
    status: systemSubscriptionStatus,
    message: systemSubscriptionStatus === 'unpaid' ? 'No se registró pago.' : 'Servicio activo.'
  });
});

// Modificar estado remotamente (Requiere clave maestra ADMIN_SECRET)
app.post('/api/admin/set-subscription-status', (req, res) => {
  const { status, key } = req.body;
  const authHeader = req.headers['x-admin-key'] || req.headers['authorization'];

  const providedKey = key || authHeader?.replace(/^Bearer\s+/i, '');

  if (providedKey !== ADMIN_SECRET) {
    return res.status(403).json({
      success: false,
      error: 'No autorizado. Clave de administración incorrecta.'
    });
  }

  systemSubscriptionStatus = (status === 'unpaid' || status === 'inactive' || status === 'bloqueado') ? 'unpaid' : 'active';

  res.json({
    success: true,
    status: systemSubscriptionStatus,
    message: systemSubscriptionStatus === 'unpaid'
      ? 'Sistema bloqueado remotamente por falta de pago.'
      : 'Servicio reactivado exitosamente.'
  });
});

// ==============================================================================
// 3. ENDPOINT DE AUTENTICACIÓN / LOGIN
// ==============================================================================
app.post('/api/admin/login', (req, res) => {
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
