import { DISHES, MENU_CATEGORIES, TABLE_SECURITY_CODES, ALCOHOL_INTENSITY_FILTERS, DRINK_TASTE_FILTERS } from '../data/menuData.js';
import { supabase } from './supabaseClient.js';

const STORAGE_KEYS = {
  AUTH: 'kal_admin_auth',
  ORDERS: 'kal_admin_orders',
  TABLE_SESSIONS: 'kal_admin_table_sessions',
  CASH_REGISTER: 'kal_admin_cash_register',
  CASH_HISTORY: 'kal_admin_cash_history',
  RESERVATIONS: 'kal_admin_reservations',
  DISHES: 'kal_admin_dishes',
  CATEGORIES: 'kal_admin_categories',
  TABLE_CODES: 'kal_admin_table_codes',
  HERO_VIDEOS: 'kal_admin_hero_videos',
  SOCIAL_LINKS: 'kal_admin_social_links',
  INTENSITY_FILTERS: 'kal_admin_intensity_filters',
  TASTE_FILTERS: 'kal_admin_taste_filters',
  VIEW_MODES: 'kal_admin_view_modes',
  SCENES: 'kal_admin_scenes',
  LOADING_SCREEN: 'kal_admin_loading_screen',
  ADMIN_THEME: 'kal_admin_theme_color',
  SUBSCRIPTION_STATUS: 'kal_subscription_status',
  MODULES: 'kal_admin_modules',
};

export const ADMIN_COLOR_THEMES = [
  { id: 'kall-dark', label: 'Dorado Neón VIP 🟡', color: '#ffcc00', light: '#ffe066', glow: 'rgba(255, 204, 0, 0.85)', subtle: 'rgba(255, 204, 0, 0.18)', border: 'rgba(255, 204, 0, 0.55)' },
  { id: 'kall-neon', label: 'Rosa Neón Fucsia 🩷', color: '#ff2d87', light: '#ff66aa', glow: 'rgba(255, 45, 135, 0.85)', subtle: 'rgba(255, 45, 135, 0.18)', border: 'rgba(255, 45, 135, 0.55)' },
  { id: 'kall-purple', label: 'Púrpura Místico 💜', color: '#b537f7', light: '#d074fc', glow: 'rgba(181, 55, 247, 0.85)', subtle: 'rgba(181, 55, 247, 0.18)', border: 'rgba(181, 55, 247, 0.55)' },
  { id: 'kall-emerald', label: 'Verde Esmeralda Neón 💚', color: '#00e676', light: '#69f0ae', glow: 'rgba(0, 230, 118, 0.85)', subtle: 'rgba(0, 230, 118, 0.18)', border: 'rgba(0, 230, 118, 0.55)' },
  { id: 'kall-blood', label: 'Rojo Fuego Neón 🔴', color: '#ff1744', light: '#ff5252', glow: 'rgba(255, 23, 68, 0.85)', subtle: 'rgba(255, 23, 68, 0.18)', border: 'rgba(255, 23, 68, 0.55)' },
  { id: 'kall-cyan', label: 'Cian Eléctrico 🩵', color: '#00e5ff', light: '#18ffff', glow: 'rgba(0, 229, 255, 0.85)', subtle: 'rgba(0, 229, 255, 0.18)', border: 'rgba(0, 229, 255, 0.55)' },
  { id: 'kall-amber', label: 'Naranja Fuego Neón 🧡', color: '#ff6d00', light: '#ff9100', glow: 'rgba(255, 109, 0, 0.85)', subtle: 'rgba(255, 109, 0, 0.18)', border: 'rgba(255, 109, 0, 0.55)' },
  { id: 'kall-lime', label: 'Verde Limón Ácido 🍋', color: '#aeea00', light: '#ccff90', glow: 'rgba(174, 234, 0, 0.85)', subtle: 'rgba(174, 234, 0, 0.18)', border: 'rgba(174, 234, 0, 0.55)' },
  { id: 'kall-violet', label: 'Violeta Luz Negra 🔮', color: '#7c4dff', light: '#b388ff', glow: 'rgba(124, 77, 255, 0.85)', subtle: 'rgba(124, 77, 255, 0.18)', border: 'rgba(124, 77, 255, 0.55)' },
  { id: 'kall-pink', label: 'Verde Láser Neón 🪖', color: '#76ff03', light: '#b2ff59', glow: 'rgba(118, 255, 3, 0.85)', subtle: 'rgba(118, 255, 3, 0.18)', border: 'rgba(118, 255, 3, 0.55)' },
  { id: 'kall-coral', label: 'Coral Lava Volcán 🌋', color: '#ff0055', light: '#ff4081', glow: 'rgba(255, 0, 85, 0.85)', subtle: 'rgba(255, 0, 85, 0.18)', border: 'rgba(255, 0, 85, 0.55)' },
  { id: 'kall-yellow', label: 'Azul Eléctrico Neón 💙', color: '#2979ff', light: '#448aff', glow: 'rgba(41, 121, 255, 0.85)', subtle: 'rgba(41, 121, 255, 0.18)', border: 'rgba(41, 121, 255, 0.55)' }
];

const INITIAL_VIEW_MODES = {
  cards: true,
  compact: true,
  basic: true
};

const INITIAL_SCENES_ENABLED = {
  drinks: true,
  party: true,
  natura: true,
  serpientes: true
};

const INITIAL_HERO_VIDEOS = [
  { id: 'vid-1', title: 'Licores VIP (Principal)', scene: 'drinks', url: '/menu-assets/header licor.mp4', badge: '🍾 MODO LICORES VIP 🔞' },
  { id: 'vid-2', title: 'Fiesta & DJ Show Live', scene: 'bar-show', url: '/menu-assets/header atrevido (1).mp4', badge: '🪩 MODO FIESTA & DJ SHOW LIVE 🔞' },
  { id: 'vid-3', title: 'Natura VIP', scene: 'cobra', url: '/menu-assets/header natura.mp4', badge: '🌿 MODO NATURA VIP 🔞' },
  { id: 'vid-4', title: 'Serpientes VIP', scene: 'serpientes', url: '/menu-assets/fondo serpientes.mp4', badge: '🐍 MODO SERPIENTES VIP 🔞' }
];

const INITIAL_SOCIAL_LINKS = {
  whatsappNumber: '573135248660',
  whatsappMessage: '¡Hola KAL DISCOBAR! Quiero reservar una mesa / información del evento VIP.',
  whatsappEnabled: true,
  instagramUrl: 'https://instagram.com/kaldiscobar',
  instagramEnabled: true,
  tiktokUrl: 'https://tiktok.com/@kaldiscobar',
  tiktokEnabled: true,
  facebookUrl: 'https://facebook.com/kaldiscobar',
  facebookEnabled: true,
  phoneNumber: '+573135248660',
  phoneEnabled: true
};

// Seed initial reservations for demo
const INITIAL_RESERVATIONS = [
  {
    id: 'res-101',
    clientName: 'Alejandro Restrepo',
    phone: '314 620 9944',
    date: new Date().toISOString().split('T')[0],
    time: '21:00 - 23:00 (Rumba Nocturna VIP)',
    tableNum: 4,
    partySize: 6,
    eventType: 'Cumpleaños VIP',
    status: 'active',
    createdAt: new Date().toISOString()
  },
  {
    id: 'res-102',
    clientName: 'Valentina Morales',
    phone: '312 885 1420',
    date: new Date().toISOString().split('T')[0],
    time: '23:00 - 01:00 (Pico de Fiesta)',
    tableNum: 8,
    partySize: 8,
    eventType: 'Mesa de Amigos / Grupo',
    status: 'active',
    createdAt: new Date().toISOString()
  },
  {
    id: 'res-103',
    clientName: 'Daniel Gómez',
    phone: '320 541 7890',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    time: '21:00 - 23:00 (Rumba Nocturna VIP)',
    tableNum: 2,
    partySize: 4,
    eventType: 'Reserva VIP Especial',
    status: 'active',
    createdAt: new Date().toISOString()
  }
];

// Seed initial orders for demo
const INITIAL_ORDERS = [
  {
    id: 'ord-501',
    orderNum: 'MESA-1-842',
    table: 1,
    type: 'table',
    customerName: 'Santiago Londoño',
    phone: '311 456 7890',
    notes: 'Hielo extra en balde y vasos de cristal',
    items: [
      { id: 'l1', name: 'Aguardiente Amarillo de Manzanares', priceCOP: 120000, quantity: 1 },
      { id: 'b1', name: 'Red Bull Energy Drink (Pack 4)', priceCOP: 48000, quantity: 1 }
    ],
    totalCOP: 168000,
    status: 'served', // 'pending' | 'preparing' | 'served' | 'billed'
    paymentMethod: null,
    createdAt: new Date(Date.now() - 3600000 * 1.5).toISOString(),
    isPaid: false
  },
  {
    id: 'ord-502',
    orderNum: 'MESA-3-194',
    table: 3,
    type: 'table',
    customerName: 'Mariana Duque',
    phone: '315 987 6543',
    notes: 'Escarchado con sal marina',
    items: [
      { id: 'w1', name: 'Whisky Buchanan\'s 12 Años', priceCOP: 240000, quantity: 1 },
      { id: 'b2', name: 'Sodas Canada Dry (Pack 4)', priceCOP: 28000, quantity: 1 },
      { id: 's1', name: 'Nachos con Queso & Guacamole VIP', priceCOP: 35000, quantity: 1 }
    ],
    totalCOP: 303000,
    status: 'preparing',
    paymentMethod: null,
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    isPaid: false
  },
  {
    id: 'ord-503',
    orderNum: 'BAR-7712',
    table: 'barra',
    type: 'pickup',
    customerName: 'Camilo Torres',
    phone: '313 524 8660',
    notes: 'Preparación express',
    pickupInterval: '5-10',
    items: [
      { id: 'c1', name: 'Gin Tonic Premium Hendrick\'s', priceCOP: 42000, quantity: 2 }
    ],
    totalCOP: 84000,
    status: 'served',
    paymentMethod: 'Wompi Demo',
    wompiTransactionId: 'WOMPI-APPR-99214',
    createdAt: new Date(Date.now() - 900000).toISOString(),
    isPaid: true
  }
];

class AdminStoreService {
  constructor() {
    this.listeners = new Set();
    this.init();
  }

  init() {
    // 1. Auth Credentials
    if (!localStorage.getItem(STORAGE_KEYS.AUTH)) {
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify({
        user: '👑 admin',
        password: 'KarolN2026@',
        isAuthenticated: false
      }));
    }

    // 2. Table Security Codes
    if (!localStorage.getItem(STORAGE_KEYS.TABLE_CODES)) {
      localStorage.setItem(STORAGE_KEYS.TABLE_CODES, JSON.stringify(TABLE_SECURITY_CODES));
    }

    // 3. Dishes & Categories
    if (!localStorage.getItem(STORAGE_KEYS.DISHES)) {
      localStorage.setItem(STORAGE_KEYS.DISHES, JSON.stringify(DISHES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(MENU_CATEGORIES));
    }

    // 4. Reservations
    if (!localStorage.getItem(STORAGE_KEYS.RESERVATIONS)) {
      localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify([]));
    }

    // 5. Orders
    if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([]));
    }

    // 6. Cash Register State for Today
    const todayStr = new Date().toISOString().split('T')[0];
    if (!localStorage.getItem(STORAGE_KEYS.CASH_REGISTER)) {
      localStorage.setItem(STORAGE_KEYS.CASH_REGISTER, JSON.stringify({
        date: todayStr,
        openedAt: new Date().toISOString(),
        isClosed: false,
        initialFloat: 200000, // $200.000 base de caja
        totalCash: 0,
        totalBancolombia: 0,
        totalNequi: 0,
        totalDaviplata: 0,
        totalDatafono: 0,
        totalWompi: 0
      }));
    }

    if (!localStorage.getItem(STORAGE_KEYS.CASH_HISTORY)) {
      localStorage.setItem(STORAGE_KEYS.CASH_HISTORY, JSON.stringify([]));
    }
  }

  // Subscribe to changes
  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify() {
    this.listeners.forEach((cb) => {
      try {
        cb();
      } catch (err) {
        console.error('Error notifying adminStore subscriber:', err);
      }
    });
  }

  // ----------------------------------------------------
  // AUTHENTICATION & HIDDEN UNPAID USER SUPPORT
  // ----------------------------------------------------
  getAuth() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.AUTH)) || {
        user: '👑 admin',
        password: 'KarolN2026@',
        authorizedPassword: '',
        isSessionRevoked: false,
        isAuthenticated: false,
        role: 'admin' // 'admin' | 'unpaid'
      };
    } catch {
      return { user: '👑 admin', password: 'KarolN2026@', authorizedPassword: '', isSessionRevoked: false, isAuthenticated: false, role: 'admin' };
    }
  }

  setAdminPassword(newPassword, forceLogout = true) {
    const clean = String(newPassword || '').trim();
    if (!clean) return;
    const auth = this.getAuth();
    
    // Revocar si la contraseña cambia o si la contraseña con la que se inició sesión difiere de la nueva
    const passwordChanged = auth.password !== clean;
    const sessionRevoked = auth.isAuthenticated && auth.authorizedPassword && auth.authorizedPassword !== clean && auth.authorizedPassword !== 'PanelPassword1966@';

    if (passwordChanged || sessionRevoked) {
      console.log(`🔒 [adminStore] Contraseña remota actualizada a "${clean}". Activando modal de sesión cerrada...`);
      auth.password = clean;
      if (forceLogout || sessionRevoked) {
        auth.isSessionRevoked = true;
        auth.isAuthenticated = false;
        auth.authorizedPassword = '';
      }
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(auth));
      this.notify();
    }
  }

  // Clave secreta para perfil invisible capado
  static UNPAID_SECRET = 'NoPagoProyecto2026!';

  login(password, username = '') {
    const auth = this.getAuth();
    const cleanPass = String(password || '').trim();
    const cleanUser = String(username || '').trim().toLowerCase();
    const subStatus = this.getSubscriptionStatus();

    // 1. Si el sistema está globalmente bloqueado por falta de pago
    if (subStatus === 'unpaid') {
      auth.isAuthenticated = true;
      auth.role = 'unpaid';
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(auth));
      this.notify();
      return { success: true, role: 'unpaid' };
    }

    // 2. Si se ingresa la clave del usuario invisible capado (sin botones ni rastros visibles)
    if (cleanPass === AdminStoreService.UNPAID_SECRET || cleanUser === 'unpaid' || cleanUser === 'bloqueado' || cleanUser === 'nopago') {
      auth.isAuthenticated = true;
      auth.role = 'unpaid';
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(auth));
      this.notify();
      return { success: true, role: 'unpaid' };
    }

    // 3. Login de Administrador Oficial (Acepta la contraseña activa actual, o la clave maestra de respaldo del owner)
    if (cleanPass === auth.password || cleanPass === 'PanelPassword1966@') {
      auth.isAuthenticated = true;
      auth.authorizedPassword = cleanPass;
      auth.role = 'admin';
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(auth));
      this.notify();
      return { success: true, role: 'admin' };
    }

    return { success: false, message: 'Contraseña incorrecta' };
  }

  logout() {
    const auth = this.getAuth();
    auth.isAuthenticated = false;
    auth.role = 'admin';
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(auth));
    this.notify();
  }

  // ----------------------------------------------------
  // REMOTE SUBSCRIPTION / PAYMENT LOCKOUT STATUS & MODULES
  // ----------------------------------------------------
  getSubscriptionStatus() {
    try {
      return localStorage.getItem(STORAGE_KEYS.SUBSCRIPTION_STATUS) || 'active';
    } catch {
      return 'active';
    }
  }

  setSubscriptionStatus(status) {
    const normalized = (status === 'unpaid' || status === 'inactive' || status === 'bloqueado' || status === 'locked') ? 'unpaid' : 'active';
    const current = this.getSubscriptionStatus();
    const auth = this.getAuth();
    const targetRole = normalized === 'unpaid' ? 'unpaid' : (auth.role === 'unpaid' ? 'admin' : auth.role);

    if (current === normalized && auth.role === targetRole) {
      return normalized;
    }

    localStorage.setItem(STORAGE_KEYS.SUBSCRIPTION_STATUS, normalized);
    auth.role = targetRole;
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(auth));
    
    this.notify();
    return normalized;
  }

  getModules() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.MODULES)) || {
        metrics: true,
        orders: true,
        menu_editor: true,
        reservations: true,
        booking: true,
        payments: true,
        checkout: true,
        whatsapp_agent: true,
        whatsapp: true,
        dashboard: true,
        admin: true,
        menu: true,
        catalog: true
      };
    } catch {
      return {
        metrics: true,
        orders: true,
        menu_editor: true,
        reservations: true,
        booking: true,
        payments: true,
        checkout: true,
        whatsapp_agent: true,
        whatsapp: true,
        dashboard: true,
        admin: true,
        menu: true,
        catalog: true
      };
    }
  }

  setModules(newModules) {
    const current = this.getModules();
    const updated = { ...current, ...newModules };
    const currentStr = JSON.stringify(current);
    const updatedStr = JSON.stringify(updated);
    
    if (currentStr === updatedStr) {
      return current;
    }

    localStorage.setItem(STORAGE_KEYS.MODULES, updatedStr);
    this.notify();
    return updated;
  }

  async checkRemoteStatus(apiBaseUrl = '') {
    // Tier 1: Consultar a Supabase PostgreSQL Cloud directamente (< 150ms)
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
          this.setSubscriptionStatus(dbStatus);
        }

        let parsedMods = null;
        if (modulesRes.status === 'fulfilled' && modulesRes.value.data?.subscription_status) {
          try {
            parsedMods = JSON.parse(modulesRes.value.data.subscription_status);
            if (parsedMods && typeof parsedMods === 'object') {
              this.setModules(parsedMods);
            }
          } catch {}
        }

        if (adminAuthRes.status === 'fulfilled' && adminAuthRes.value.data?.subscription_status) {
          const remoteAdminPass = adminAuthRes.value.data.subscription_status.trim();
          if (remoteAdminPass && remoteAdminPass.length >= 3) {
            this.setAdminPassword(remoteAdminPass, true);
          }
        }

        if (dbStatus === 'unpaid') {
          this.setModules({ menu: false, catalog: false, dashboard: false, admin: false });
        }

        if (globalRes.status === 'fulfilled' || modulesRes.status === 'fulfilled' || adminAuthRes.status === 'fulfilled') {
          return { status: dbStatus, modules: this.getModules() };
        }
      }
    } catch (dbErr) {
      console.warn('Fallback a Backend en Render:', dbErr);
    }

    // Tier 2: Consultar a Backend en Render
    try {
      const defaultUrl = 'https://kal-discobar-backend.onrender.com';
      const url = apiBaseUrl || (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) || defaultUrl;
      const cleanUrl = url.replace(/\/+$/, '');

      const res = await fetch(`${cleanUrl}/api/bookings/admin/subscription-status`, {
        cache: 'no-store',
        headers: { 'Pragma': 'no-cache', 'Cache-Control': 'no-cache' }
      });

      if (res.ok) {
        const data = await res.json();
        if (data) {
          if (data.status) {
            this.setSubscriptionStatus(data.status);
          }
          if (data.modules) {
            this.setModules(data.modules);
          }
          return data;
        }
      }
    } catch (err) {
      console.warn('Fallback a almacenamiento local:', err);
    }

    return { status: this.getSubscriptionStatus(), modules: this.getModules() };
  }

  changePassword(oldPassword, newPassword) {
    const auth = this.getAuth();
    if (auth.password !== oldPassword) {
      return { success: false, message: 'La contraseña actual no coincide.' };
    }
    if (!newPassword || newPassword.trim().length < 4) {
      return { success: false, message: 'La nueva contraseña debe tener al menos 4 caracteres.' };
    }
    auth.password = newPassword.trim();
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(auth));
    this.notify();
    return { success: true };
  }

  resetAllToDefaults(masterPassword) {
    if (!masterPassword || masterPassword.trim() !== '1966@Dynamind') {
      return { success: false, message: 'Contraseña maestra de restablecimiento incorrecta.' };
    }

    // 1. Auth Credentials
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify({
      user: '👑 admin',
      password: 'KarolN2026@',
      isAuthenticated: true
    }));

    // 2. Table Security Codes
    localStorage.setItem(STORAGE_KEYS.TABLE_CODES, JSON.stringify(TABLE_SECURITY_CODES));

    // 3. Dishes & Categories
    localStorage.setItem(STORAGE_KEYS.DISHES, JSON.stringify(DISHES));
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(MENU_CATEGORIES));

    // 4. Reservations & Orders
    localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.TABLE_SESSIONS, JSON.stringify({}));

    // 5. Cash Register & History
    const todayStr = new Date().toISOString().split('T')[0];
    localStorage.setItem(STORAGE_KEYS.CASH_REGISTER, JSON.stringify({
      date: todayStr,
      openedAt: new Date().toISOString(),
      isClosed: false,
      initialFloat: 200000,
      totalCash: 0,
      totalBancolombia: 0,
      totalNequi: 0,
      totalDaviplata: 0,
      totalDatafono: 0,
      totalWompi: 0
    }));
    localStorage.setItem(STORAGE_KEYS.CASH_HISTORY, JSON.stringify([]));

    // 6. Hero Videos & Social Links
    localStorage.setItem(STORAGE_KEYS.HERO_VIDEOS, JSON.stringify(INITIAL_HERO_VIDEOS));
    localStorage.setItem(STORAGE_KEYS.SOCIAL_LINKS, JSON.stringify(INITIAL_SOCIAL_LINKS));

    // 7. Filters & View Modes
    localStorage.setItem(STORAGE_KEYS.INTENSITY_FILTERS, JSON.stringify(ALCOHOL_INTENSITY_FILTERS));
    localStorage.setItem(STORAGE_KEYS.TASTE_FILTERS, JSON.stringify(DRINK_TASTE_FILTERS));
    localStorage.setItem(STORAGE_KEYS.VIEW_MODES, JSON.stringify(INITIAL_VIEW_MODES));
    localStorage.setItem(STORAGE_KEYS.SCENES, JSON.stringify(INITIAL_SCENES_ENABLED));
    localStorage.setItem(STORAGE_KEYS.LOADING_SCREEN, JSON.stringify(true));
    localStorage.setItem(STORAGE_KEYS.ADMIN_THEME, 'kall-dark');

    this.notify();
    return { success: true };
  }

  // ----------------------------------------------------
  // ORDERS & TABLE SESSIONS
  // ----------------------------------------------------
  getOrders() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS)) || [];
    } catch {
      return [];
    }
  }

  addOrder(orderData) {
    const orders = this.getOrders();
    const newOrder = {
      id: 'ord-' + Date.now(),
      orderNum: orderData.orderNum || ('ORD-' + Math.floor(1000 + Math.random() * 9000)),
      table: orderData.table, // Number 1..15 or 'barra'
      type: orderData.type, // 'table' | 'pickup'
      customerName: orderData.customerName || 'Cliente VIP',
      phone: orderData.phone || '',
      notes: orderData.notes || '',
      pickupInterval: orderData.pickupInterval || '',
      items: orderData.items || [],
      totalCOP: orderData.totalCOP || 0,
      status: orderData.status || 'pending', // 'pending' | 'preparing' | 'served' | 'billed'
      paymentMethod: orderData.paymentMethod || null,
      wompiTransactionId: orderData.wompiTransactionId || null,
      createdAt: new Date().toISOString(),
      isPaid: Boolean(orderData.isPaid)
    };

    orders.unshift(newOrder);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));

    // If already paid (e.g. Wompi in Barra), update cash register directly
    if (newOrder.isPaid && newOrder.paymentMethod) {
      this.recordPayment(newOrder.totalCOP, newOrder.paymentMethod);
    }

    this.notify();
    return newOrder;
  }

  updateOrderStatus(orderId, newStatus) {
    const orders = this.getOrders();
    const orderIndex = orders.findIndex((o) => o.id === orderId);
    if (orderIndex >= 0) {
      orders[orderIndex].status = newStatus;
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
      this.notify();
      return true;
    }
    return false;
  }

  // Get active session for a specific table (accumulating orders until billed)
  getTableSession(tableNum) {
    const orders = this.getOrders();
    // Find all non-billed orders for this table
    const tableOrders = orders.filter((o) => o.table === tableNum && o.status !== 'billed');
    const totalAccumulated = tableOrders.reduce((sum, o) => sum + o.totalCOP, 0);

    return {
      tableNum,
      isActive: tableOrders.length > 0,
      orderCount: tableOrders.length,
      orders: tableOrders,
      totalCOP: totalAccumulated,
      customerName: tableOrders[0]?.customerName || '',
      openedAt: tableOrders[tableOrders.length - 1]?.createdAt || null
    };
  }

  // Facturar y Cerrar Sesión de una Mesa -> marca todas sus órdenes como 'billed' y libera la mesa para nuevos comensales
  billAndResetTableSession(tableNum, paymentMethod, billDetails = {}) {
    const orders = this.getOrders();
    let sessionTotal = 0;
    const billedOrderIds = [];

    const updatedOrders = orders.map((ord) => {
      if (ord.table === tableNum && ord.status !== 'billed') {
        sessionTotal += ord.totalCOP;
        billedOrderIds.push(ord.id);
        return {
          ...ord,
          status: 'billed',
          isPaid: true,
          paymentMethod: paymentMethod,
          billedAt: new Date().toISOString(),
          cashierNotes: billDetails.notes || ''
        };
      }
      return ord;
    });

    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updatedOrders));

    // Register income in cash register
    if (sessionTotal > 0) {
      this.recordPayment(sessionTotal, paymentMethod);
    }

    this.notify();

    return {
      success: true,
      tableNum,
      totalPaid: sessionTotal,
      paymentMethod,
      orderCount: billedOrderIds.length,
      billedAt: new Date().toISOString()
    };
  }

  // Reset/Liberar manualmente una mesa
  resetTable(tableNum) {
    const orders = this.getOrders();
    const updated = orders.map((o) => {
      if (o.table === tableNum && o.status !== 'billed') {
        return { ...o, status: 'billed', isPaid: true, paymentMethod: 'Cancelado / Liberado' };
      }
      return o;
    });
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updated));
    this.notify();
  }

  // ----------------------------------------------------
  // CASH REGISTER & METRICS
  // ----------------------------------------------------
  getCashRegister() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.CASH_REGISTER)) || {
        date: new Date().toISOString().split('T')[0],
        openedAt: new Date().toISOString(),
        isClosed: false,
        initialFloat: 200000,
        totalCash: 0,
        totalBancolombia: 0,
        totalNequi: 0,
        totalDaviplata: 0,
        totalDatafono: 0,
        totalWompi: 0
      };
    } catch {
      return {
        date: new Date().toISOString().split('T')[0],
        openedAt: new Date().toISOString(),
        isClosed: false,
        initialFloat: 200000,
        totalCash: 0,
        totalBancolombia: 0,
        totalNequi: 0,
        totalDaviplata: 0,
        totalDatafono: 0,
        totalWompi: 0
      };
    }
  }

  recordPayment(amount, method) {
    const register = this.getCashRegister();
    const normMethod = (method || '').toLowerCase();

    if (normMethod.includes('efectivo')) {
      register.totalCash = (register.totalCash || 0) + amount;
    } else if (normMethod.includes('bancolombia')) {
      register.totalBancolombia = (register.totalBancolombia || 0) + amount;
    } else if (normMethod.includes('nequi')) {
      register.totalNequi = (register.totalNequi || 0) + amount;
    } else if (normMethod.includes('daviplata')) {
      register.totalDaviplata = (register.totalDaviplata || 0) + amount;
    } else if (normMethod.includes('dat') || normMethod.includes('tarjeta')) {
      register.totalDatafono = (register.totalDatafono || 0) + amount;
    } else if (normMethod.includes('wompi')) {
      register.totalWompi = (register.totalWompi || 0) + amount;
    } else {
      register.totalCash = (register.totalCash || 0) + amount;
    }

    localStorage.setItem(STORAGE_KEYS.CASH_REGISTER, JSON.stringify(register));
    this.notify();
  }

  closeCashRegister(closingNotes = '') {
    const register = this.getCashRegister();
    const currentOrders = this.getOrders();
    const currentSessions = {};
    const totalSales = (register.totalCash || 0) +
      (register.totalBancolombia || 0) +
      (register.totalNequi || 0) +
      (register.totalDaviplata || 0) +
      (register.totalDatafono || 0) +
      (register.totalWompi || 0);

    const closedRecord = {
      id: 'cierre-' + Date.now(),
      ...register,
      closedAt: new Date().toISOString(),
      isClosed: true,
      totalSales,
      grandTotalWithFloat: totalSales + (register.initialFloat || 0),
      closingNotes,
      archivedOrders: currentOrders
    };

    // Save to history
    const history = this.getCashHistory();
    history.unshift(closedRecord);
    localStorage.setItem(STORAGE_KEYS.CASH_HISTORY, JSON.stringify(history));

    // Clear active table sessions & shift order history on cash close
    localStorage.setItem(STORAGE_KEYS.TABLE_SESSIONS, JSON.stringify({}));
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([]));

    // Open fresh cash register for next shift / day
    const nextDay = new Date();
    const freshRegister = {
      date: nextDay.toISOString().split('T')[0],
      openedAt: new Date().toISOString(),
      isClosed: false,
      initialFloat: register.initialFloat || 200000,
      totalCash: 0,
      totalBancolombia: 0,
      totalNequi: 0,
      totalDaviplata: 0,
      totalDatafono: 0,
      totalWompi: 0
    };
    localStorage.setItem(STORAGE_KEYS.CASH_REGISTER, JSON.stringify(freshRegister));

    this.notify();
    return closedRecord;
  }

  reopenCashClose(closeId) {
    const history = this.getCashHistory();
    const recordIndex = history.findIndex((rec) => rec.id === closeId || rec.closedAt === closeId);
    if (recordIndex === -1) {
      return { success: false, message: 'No se encontró el registro de cierre.' };
    }

    const record = history[recordIndex];
    const todayStr = new Date().toISOString().split('T')[0];

    // Remove from history
    history.splice(recordIndex, 1);
    localStorage.setItem(STORAGE_KEYS.CASH_HISTORY, JSON.stringify(history));

    // Restore active register with the exact closed values
    const restoredRegister = {
      date: record.date || todayStr,
      openedAt: record.openedAt || new Date().toISOString(),
      isClosed: false,
      initialFloat: record.initialFloat || 200000,
      totalCash: record.totalCash || 0,
      totalBancolombia: record.totalBancolombia || 0,
      totalNequi: record.totalNequi || 0,
      totalDaviplata: record.totalDaviplata || 0,
      totalDatafono: record.totalDatafono || 0,
      totalWompi: record.totalWompi || 0
    };
    localStorage.setItem(STORAGE_KEYS.CASH_REGISTER, JSON.stringify(restoredRegister));

    // Restore archived orders and ensure their dates match today
    if (record.archivedOrders && Array.isArray(record.archivedOrders) && record.archivedOrders.length > 0) {
      const currentOrders = this.getOrders();
      const existingIds = new Set(currentOrders.map((o) => o.id));
      const newToRestore = record.archivedOrders
        .filter((o) => !existingIds.has(o.id))
        .map((ord) => ({
          ...ord,
          createdAt: ord.createdAt || new Date().toISOString()
        }));
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([...newToRestore, ...currentOrders]));
    }

    this.notify();
    return { success: true, message: 'Cierre de caja anulado con éxito. Los valores y pedidos del turno han sido restaurados.' };
  }

  updateCashCloseNotes(closeId, newNotes) {
    const history = this.getCashHistory();
    const record = history.find((rec) => rec.id === closeId || rec.closedAt === closeId);
    if (!record) return { success: false, message: 'No se encontró el registro.' };

    record.closingNotes = newNotes;
    localStorage.setItem(STORAGE_KEYS.CASH_HISTORY, JSON.stringify(history));
    this.notify();
    return { success: true };
  }

  getOrderHistory() {
    return this.getOrders();
  }

  getCashHistory() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.CASH_HISTORY)) || [];
    } catch {
      return [];
    }
  }

  getMetricsForDate(dateStr) {
    const orders = this.getOrders();
    const todayStr = new Date().toISOString().split('T')[0];
    const targetDate = dateStr || todayStr;
    const isToday = targetDate === todayStr;
    const register = this.getCashRegister();

    // Filter orders created or billed on this date (or if viewing today, include all today orders)
    const dateOrders = orders.filter((o) => {
      const ordDate = (o.createdAt || '').split('T')[0];
      const billDate = (o.billedAt || '').split('T')[0];
      if (isToday) {
        return !ordDate || ordDate === todayStr || billDate === todayStr;
      }
      return ordDate === targetDate || billDate === targetDate;
    });

    let totalRevenue = 0;
    let tableRevenue = 0;
    let barRevenue = 0;
    const paymentBreakdown = {
      efectivo: 0,
      bancolombia: 0,
      nequi: 0,
      daviplata: 0,
      datafono: 0,
      wompi: 0
    };
    const productStats = {};

    dateOrders.forEach((ord) => {
      const ordTotal = ord.totalCOP || 0;
      totalRevenue += ordTotal;
      if (ord.type === 'pickup' || ord.table === 'barra') {
        barRevenue += ordTotal;
      } else {
        tableRevenue += ordTotal;
      }

      const method = (ord.paymentMethod || '').toLowerCase();
      if (method.includes('bancolombia')) paymentBreakdown.bancolombia += ordTotal;
      else if (method.includes('nequi')) paymentBreakdown.nequi += ordTotal;
      else if (method.includes('daviplata')) paymentBreakdown.daviplata += ordTotal;
      else if (method.includes('dat') || method.includes('tarjeta')) paymentBreakdown.datafono += ordTotal;
      else if (method.includes('wompi')) paymentBreakdown.wompi += ordTotal;
      else paymentBreakdown.efectivo += ordTotal;

      (ord.items || []).forEach((item) => {
        const key = item.name || item.id;
        if (!productStats[key]) {
          productStats[key] = { name: item.name, quantity: 0, revenue: 0 };
        }
        productStats[key].quantity += item.quantity || 1;
        productStats[key].revenue += (item.priceCOP || 0) * (item.quantity || 1);
      });
    });

    // If viewing today, sync and ensure all live Cash Register totals are fully preserved
    if (isToday && register) {
      paymentBreakdown.efectivo = Math.max(paymentBreakdown.efectivo, register.totalCash || 0);
      paymentBreakdown.bancolombia = Math.max(paymentBreakdown.bancolombia, register.totalBancolombia || 0);
      paymentBreakdown.nequi = Math.max(paymentBreakdown.nequi, register.totalNequi || 0);
      paymentBreakdown.daviplata = Math.max(paymentBreakdown.daviplata, register.totalDaviplata || 0);
      paymentBreakdown.datafono = Math.max(paymentBreakdown.datafono, register.totalDatafono || 0);
      paymentBreakdown.wompi = Math.max(paymentBreakdown.wompi, register.totalWompi || 0);

      const regTotalSales = (register.totalCash || 0) +
        (register.totalBancolombia || 0) +
        (register.totalNequi || 0) +
        (register.totalDaviplata || 0) +
        (register.totalDatafono || 0) +
        (register.totalWompi || 0);

      if (regTotalSales > totalRevenue) {
        totalRevenue = regTotalSales;
      }
    }

    const topProducts = Object.values(productStats)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    const avgTicket = dateOrders.length > 0 ? Math.round(totalRevenue / dateOrders.length) : (totalRevenue > 0 ? totalRevenue : 0);

    return {
      date: targetDate,
      totalRevenue,
      tableRevenue,
      barRevenue,
      orderCount: dateOrders.length,
      avgTicket,
      paymentBreakdown,
      topProducts,
      orders: dateOrders
    };
  }

  // ----------------------------------------------------
  // RESERVATIONS
  // ----------------------------------------------------
  getReservations() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.RESERVATIONS)) || [];
    } catch {
      return [];
    }
  }

  addReservation(resData) {
    const reservations = this.getReservations();
    const newRes = {
      id: 'res-' + Date.now(),
      clientName: resData.clientName || 'Cliente VIP',
      phone: resData.phone || '',
      date: resData.date || new Date().toISOString().split('T')[0],
      time: resData.time || '21:00 - 23:00 (Rumba Nocturna VIP)',
      tableNum: Number(resData.tableNum) || 1,
      partySize: Number(resData.partySize) || 4,
      eventType: resData.eventType || 'Reserva VIP',
      status: 'active',
      createdAt: new Date().toISOString()
    };
    reservations.unshift(newRes);
    localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(reservations));
    this.notify();
    return newRes;
  }

  releaseReservation(id) {
    const reservations = this.getReservations();
    const updated = reservations.map((r) => {
      if (r.id === id) {
        return { ...r, status: 'completed', releasedAt: new Date().toISOString() };
      }
      return r;
    });
    localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(updated));
    this.notify();
  }

  deleteReservation(id) {
    const reservations = this.getReservations();
    const filtered = reservations.filter((r) => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(filtered));
    this.notify();
  }

  // ----------------------------------------------------
  // MENU CUSTOMIZATION & TABLE CODES
  // ----------------------------------------------------
  getDishes() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.DISHES)) || DISHES;
    } catch {
      return DISHES;
    }
  }

  saveDish(dishData) {
    const dishes = this.getDishes();
    if (dishData.id) {
      const idx = dishes.findIndex((d) => d.id === dishData.id);
      if (idx >= 0) {
        dishes[idx] = { ...dishes[idx], ...dishData };
      } else {
        dishes.unshift(dishData);
      }
    } else {
      const newId = 'dish-' + Date.now();
      dishes.unshift({ ...dishData, id: newId });
    }
    localStorage.setItem(STORAGE_KEYS.DISHES, JSON.stringify(dishes));
    this.notify();
  }

  updateDishPrice(dishId, newPriceCOP) {
    const dishes = this.getDishes();
    const idx = dishes.findIndex((d) => d.id === dishId);
    if (idx >= 0) {
      dishes[idx].priceCOP = Number(newPriceCOP);
      localStorage.setItem(STORAGE_KEYS.DISHES, JSON.stringify(dishes));
      this.notify();
      return true;
    }
    return false;
  }

  deleteDish(dishId) {
    const dishes = this.getDishes();
    const filtered = dishes.filter((d) => d.id !== dishId);
    localStorage.setItem(STORAGE_KEYS.DISHES, JSON.stringify(filtered));
    this.notify();
  }

  getCategories() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES)) || MENU_CATEGORIES;
    } catch {
      return MENU_CATEGORIES;
    }
  }

  saveCategories(categories) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    this.notify();
  }

  getTableSecurityCodes() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.TABLE_CODES)) || TABLE_SECURITY_CODES;
    } catch {
      return TABLE_SECURITY_CODES;
    }
  }

  updateTableSecurityCode(tableNum, newCode) {
    const codes = this.getTableSecurityCodes();
    codes[tableNum] = (newCode || '').trim().toUpperCase();
    localStorage.setItem(STORAGE_KEYS.TABLE_CODES, JSON.stringify(codes));
    this.notify();
    return true;
  }

  // ----------------------------------------------------
  // HERO BACKGROUND VIDEOS
  // ----------------------------------------------------
  getHeroVideos() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.HERO_VIDEOS)) || INITIAL_HERO_VIDEOS;
    } catch {
      return INITIAL_HERO_VIDEOS;
    }
  }

  saveHeroVideo(videoData) {
    const videos = this.getHeroVideos();
    if (videoData.id) {
      const idx = videos.findIndex((v) => v.id === videoData.id);
      if (idx >= 0) {
        videos[idx] = { ...videos[idx], ...videoData };
      } else {
        videos.unshift(videoData);
      }
    } else {
      const newVideo = {
        id: 'vid-' + Date.now(),
        title: videoData.title || 'Video Hero Personalizado',
        scene: videoData.scene || 'drinks',
        url: videoData.url || '',
        badge: videoData.badge || '🍾 MODO VIP 🔞'
      };
      videos.unshift(newVideo);
    }
    localStorage.setItem(STORAGE_KEYS.HERO_VIDEOS, JSON.stringify(videos));
    this.notify();
  }

  deleteHeroVideo(videoId) {
    const videos = this.getHeroVideos();
    const filtered = videos.filter((v) => v.id !== videoId);
    localStorage.setItem(STORAGE_KEYS.HERO_VIDEOS, JSON.stringify(filtered));
    this.notify();
  }

  // ----------------------------------------------------
  // SOCIAL MEDIA LINKS
  // ----------------------------------------------------
  getSocialLinks() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.SOCIAL_LINKS)) || INITIAL_SOCIAL_LINKS;
    } catch {
      return INITIAL_SOCIAL_LINKS;
    }
  }

  saveSocialLinks(linksData) {
    const updated = { ...this.getSocialLinks(), ...linksData };
    localStorage.setItem(STORAGE_KEYS.SOCIAL_LINKS, JSON.stringify(updated));
    this.notify();
  }

  // ----------------------------------------------------
  // ALCOHOL INTENSITY FILTERS
  // ----------------------------------------------------
  getIntensityFilters() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.INTENSITY_FILTERS)) || ALCOHOL_INTENSITY_FILTERS;
    } catch {
      return ALCOHOL_INTENSITY_FILTERS;
    }
  }

  saveIntensityFilters(filters) {
    localStorage.setItem(STORAGE_KEYS.INTENSITY_FILTERS, JSON.stringify(filters));
    this.notify();
  }

  // ----------------------------------------------------
  // TASTE PROFILE FILTERS
  // ----------------------------------------------------
  getTasteFilters() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.TASTE_FILTERS)) || DRINK_TASTE_FILTERS;
    } catch {
      return DRINK_TASTE_FILTERS;
    }
  }

  saveTasteFilters(filters) {
    localStorage.setItem(STORAGE_KEYS.TASTE_FILTERS, JSON.stringify(filters));
    this.notify();
  }

  // ----------------------------------------------------
  // VIEW MODES SETTINGS (ENABLE / DISABLE)
  // ----------------------------------------------------
  getViewModesSettings() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.VIEW_MODES)) || INITIAL_VIEW_MODES;
    } catch {
      return INITIAL_VIEW_MODES;
    }
  }

  saveViewModesSettings(settings) {
    const updated = { ...this.getViewModesSettings(), ...settings };
    localStorage.setItem(STORAGE_KEYS.VIEW_MODES, JSON.stringify(updated));
    this.notify();
  }

  // ----------------------------------------------------
  // BACKGROUND SCENES SETTINGS (ENABLE / DISABLE)
  // ----------------------------------------------------
  getScenesSettings() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.SCENES)) || INITIAL_SCENES_ENABLED;
    } catch {
      return INITIAL_SCENES_ENABLED;
    }
  }

  saveScenesSettings(settings) {
    const updated = { ...this.getScenesSettings(), ...settings };
    localStorage.setItem(STORAGE_KEYS.SCENES, JSON.stringify(updated));
    this.notify();
  }

  // ----------------------------------------------------
  // MENU LOADING SCREEN SETTING (ENABLE / DISABLE)
  // ----------------------------------------------------
  getLoadingScreenEnabled() {
    try {
      const val = localStorage.getItem(STORAGE_KEYS.LOADING_SCREEN);
      return val === null ? true : JSON.parse(val);
    } catch {
      return true;
    }
  }

  toggleLoadingScreen(forcedValue) {
    const current = this.getLoadingScreenEnabled();
    const nextVal = typeof forcedValue === 'boolean' ? forcedValue : !current;
    localStorage.setItem(STORAGE_KEYS.LOADING_SCREEN, JSON.stringify(nextVal));
    this.notify();
    return nextVal;
  }

  // ----------------------------------------------------
  // ADMIN ACCENT COLOR THEME
  // ----------------------------------------------------
  getAdminTheme() {
    try {
      return localStorage.getItem(STORAGE_KEYS.ADMIN_THEME) || 'kall-dark';
    } catch {
      return 'kall-dark';
    }
  }

  setAdminTheme(themeId) {
    localStorage.setItem(STORAGE_KEYS.ADMIN_THEME, themeId);
    this.notify();
  }

  // ----------------------------------------------------
  // MASTER FACTORY RESET (RESETS DATA TO 0 WITHOUT CHANGING PASSWORD)
  // ----------------------------------------------------
  resetAllToDefaults(password) {
    const cleanPass = String(password || '').trim();
    const auth = this.getAuth();

    // Validar contraseña (Acepta contraseña activa, o clave maestra de respaldo)
    const isValid = cleanPass === auth.password || cleanPass === 'KarolN2026@' || cleanPass === 'PanelPassword1966@' || cleanPass === '1966@Dynamind';
    if (!isValid) {
      return { success: false, message: 'Clave de autorización incorrecta.' };
    }

    // PRESERVAR LA CONTRASEÑA ACTUAL Y CREDENCIALES
    const preservedPassword = auth.password || 'KarolN2026@';

    // 1. Resetear Datos del Menú y Catálogo a valores iniciales
    localStorage.removeItem(STORAGE_KEYS.DISHES);
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    localStorage.removeItem(STORAGE_KEYS.TABLE_CODES);
    localStorage.removeItem(STORAGE_KEYS.HERO_VIDEOS);
    localStorage.removeItem(STORAGE_KEYS.SOCIAL_LINKS);
    localStorage.removeItem(STORAGE_KEYS.INTENSITY_FILTERS);
    localStorage.removeItem(STORAGE_KEYS.TASTE_FILTERS);
    localStorage.removeItem(STORAGE_KEYS.VIEW_MODES);
    localStorage.removeItem(STORAGE_KEYS.SCENES);

    // 2. Resetear Operaciones, Pedidos, Mesas, Arqueos y Reservas a 0
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.TABLE_SESSIONS);
    localStorage.removeItem(STORAGE_KEYS.CASH_REGISTER);
    localStorage.removeItem(STORAGE_KEYS.CASH_HISTORY);
    localStorage.removeItem(STORAGE_KEYS.RESERVATIONS);

    // 3. Restaurar sesión autenticada con la MISMA CONTRASEÑA GUARDADA
    const newAuth = {
      user: auth.user || '👑 admin',
      password: preservedPassword,
      isAuthenticated: true,
      role: 'admin'
    };
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(newAuth));

    this.notify();
    return { success: true, message: 'Dashboard y métricas restablecidos a 0 manteniendo tu contraseña.' };
  }
}

export const adminStore = new AdminStoreService();
