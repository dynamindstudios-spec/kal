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
const VALID_KEYS = new Set([
  ADMIN_SECRET,
  'PanelPassword1966@',
  '1966@Dynamind',
  'KarolN2026@',
  'StaffAndicas2026!',
  'NoPagoProyecto2026!',
  'NoPagoAndicas2026!'
]);

// Supabase Integration (Opcional)
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

// Cargar estado persistente desde Supabase al iniciar
if (supabase) {
  supabase
    .from('system_settings')
    .select('subscription_status, modules')
    .eq('id', 'global')
    .single()
    .then(({ data, error }) => {
      if (!error && data) {
        if (data.subscription_status) {
          systemSubscriptionStatus = data.subscription_status;
          console.log(`🔒 [Supabase Boot] Estado cargado: ${systemSubscriptionStatus}`);
        }
        if (data.modules && typeof data.modules === 'object') {
          systemModules = { ...systemModules, ...data.modules };
          console.log('🔒 [Supabase Boot] Módulos cargados:', systemModules);
        }
      }
    })
    .catch((err) => {
      console.warn('Nota Supabase boot:', err.message);
    });
}

// Middleware CORS Ultra-Permisivo
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization', 'x-admin-key', 'x-secret-key']
}));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-admin-key, x-secret-key');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Detailed Request Logger
app.use((req, res, next) => {
  console.log(`📡 [${new Date().toLocaleTimeString('es-CO')}] ${req.method} ${req.originalUrl || req.url}`, {
    headers: {
      'x-admin-key': req.headers['x-admin-key'],
      'authorization': req.headers['authorization'],
      'x-secret-key': req.headers['x-secret-key']
    },
    body: req.body,
    query: req.query
  });
  next();
});

// ==============================================================================
// ROUTER PRINCIPAL DE ADMINISTRACIÓN Y CONTROL REMOTO
// ==============================================================================
const adminRouter = express.Router();

// 1. Handshake & Verificación de Conexión
adminRouter.all(['/verify', '/validate-key', '/test-connection', '/connect', '/validate', '/check'], (req, res) => {
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

// 2. Consulta de Estado de Suscripción y Módulos
adminRouter.get(['/subscription-status', '/modules', '/features', '/status'], (req, res) => {
  res.json({
    success: true,
    status: systemSubscriptionStatus,
    modules: systemModules,
    features: systemModules,
    message: systemSubscriptionStatus === 'unpaid' ? 'No se registró pago.' : 'Servicio activo.'
  });
});

// 3. Modificación de Estado Global (active / unpaid)
adminRouter.all(['/set-subscription-status', '/subscription-status/set'], async (req, res) => {
  const body = req.body || {};
  const query = req.query || {};
  const data = { ...query, ...body };
  const { status, action, state, enabled, active, modules } = data;

  console.log('⚡ [SET-SUBSCRIPTION-STATUS CALL]:', data);

  // Normalizar cualquier valor que signifique desactivar / no pago
  const isUnpaid = 
    status === 'unpaid' || status === 'inactive' || status === 'bloqueado' || status === 'locked' || status === 'disabled' || status === false || status === 'false' ||
    action === 'disable' || action === 'lock' || action === 'suspend' || action === 'unpaid' ||
    state === 'unpaid' || state === 'inactive' || state === 'disabled' || state === false || state === 'false' ||
    enabled === false || enabled === 'false' ||
    active === false || active === 'false';

  systemSubscriptionStatus = isUnpaid ? 'unpaid' : 'active';

  // Si envían módulos
  if (modules && typeof modules === 'object') {
    systemModules = { ...systemModules, ...modules };
  }

  if (isUnpaid) {
    systemModules.menu = false;
    systemModules.catalog = false;
    systemModules.dashboard = false;
    systemModules.admin = false;
  } else if (status === 'active' || action === 'enable' || enabled === true || active === true) {
    systemModules.menu = true;
    systemModules.catalog = true;
    systemModules.dashboard = true;
    systemModules.admin = true;
  }

  // Persistir en Supabase si está disponible
  if (supabase) {
    try {
      await supabase.from('system_settings').upsert({
        id: 'global',
        subscription_status: systemSubscriptionStatus,
        updated_at: new Date().toISOString()
      });
    } catch (e) {
      console.warn('Nota Supabase system_settings:', e.message);
    }
  }

  return res.json({
    success: true,
    status: systemSubscriptionStatus,
    modules: systemModules,
    features: systemModules,
    message: isUnpaid ? 'Sistema bloqueado por falta de pago.' : 'Servicio reactivado exitosamente.'
  });
});

// 4. Modificación de Módulos Individuales
adminRouter.all(['/set-module-status', '/toggle-module', '/set-feature-status', '/modules/toggle', '/modules/set', '/modules'], async (req, res) => {
  const body = req.body || {};
  const query = req.query || {};
  const data = { ...query, ...body };
  const { module, moduleId, feature, name, enabled, active, status, modules } = data;

  console.log('⚡ [SET-MODULE-STATUS CALL]:', data);

  if (modules && typeof modules === 'object') {
    systemModules = { ...systemModules, ...modules };
  }

  const targetKey = module || moduleId || feature || name;
  if (targetKey) {
    const isValActive = enabled !== undefined ? (enabled === true || enabled === 'true' || enabled === 1 || enabled === '1') :
                        active !== undefined ? (active === true || active === 'true' || active === 1 || active === '1') :
                        status !== undefined ? (status === 'active' || status === 'enabled' || status === true || status === 'true') : true;

    systemModules[targetKey] = isValActive;

    if (targetKey === 'menu' || targetKey === 'catalog') {
      systemModules.menu = isValActive;
      systemModules.catalog = isValActive;
      if (!isValActive) {
        systemSubscriptionStatus = 'unpaid';
      } else {
        systemSubscriptionStatus = 'active';
      }
    }
    if (targetKey === 'dashboard' || targetKey === 'admin') {
      systemModules.dashboard = isValActive;
      systemModules.admin = isValActive;
    }
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
  }

  return res.json({
    success: true,
    status: systemSubscriptionStatus,
    modules: systemModules,
    features: systemModules,
    message: 'Módulos actualizados con éxito.'
  });
});

// 5. Login
adminRouter.post('/login', (req, res) => {
  const { username = '', password = '' } = req.body;
  const cleanUser = String(username).trim().toLowerCase();
  const cleanPass = String(password).trim();

  if (systemSubscriptionStatus === 'unpaid') {
    return res.json({
      success: true,
      token: 'UNPAID_TOKEN_LOCKOUT',
      role: 'unpaid',
      roleLabel: 'No se registró pago'
    });
  }

  if (cleanPass === UNPAID_SECRET || cleanUser === 'unpaid' || cleanUser === 'bloqueado' || cleanUser === 'nopago') {
    return res.json({
      success: true,
      token: UNPAID_SECRET,
      role: 'unpaid',
      roleLabel: 'No se registró pago'
    });
  }

  if (VALID_KEYS.has(cleanPass)) {
    return res.json({
      success: true,
      token: cleanPass,
      role: 'admin',
      roleLabel: 'Administrador General'
    });
  }

  return res.status(401).json({
    success: false,
    error: 'Usuario o contraseña incorrectos.'
  });
});

// Registrar el router bajo TODOS los prefijos posibles
app.use('/api/bookings/admin', adminRouter);
app.use('/api/admin', adminRouter);
app.use('/api/bookings', adminRouter);
app.use('/api', adminRouter);
app.use('/bookings/admin', adminRouter);
app.use('/admin', adminRouter);

// Health check global
app.get(['/', '/api/health', '/health', '/api/ping', '/ping'], (req, res) => {
  res.json({
    status: 'ok',
    service: 'KAL DISCOBAR Backend API',
    subscriptionStatus: systemSubscriptionStatus,
    modules: systemModules,
    features: systemModules,
    timestamp: new Date().toISOString()
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Servidor KAL DISCOBAR ejecutándose en el puerto ${PORT}`);
  console.log(`🔒 Estado de Suscripción: ${systemSubscriptionStatus}`);
});
