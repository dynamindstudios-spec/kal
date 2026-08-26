import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, UtensilsCrossed, Settings, Key, LogOut, 
  ExternalLink, Crown, Clock, Calendar, RotateCcw, Ban
} from 'lucide-react';
import { adminStore, ADMIN_COLOR_THEMES } from '../../services/adminStore';
import { RESTAURANT_DATA } from '../../data/menuData';
import AdminMetrics from './AdminMetrics';
import AdminOrdersAndTables from './AdminOrdersAndTables';
import AdminMenuSettings from './AdminMenuSettings';
import ChangePasswordModal from './ChangePasswordModal';
import ResetDefaultsModal from './ResetDefaultsModal';
import AdminColorThemePicker from './AdminColorThemePicker';

export default function AdminDashboard({ onLogout, onReturnToMenu }) {
  const [activeModules, setActiveModules] = useState(() => adminStore.getModules());
  const [activeSection, setActiveSection] = useState(() => {
    const mods = adminStore.getModules();
    if (mods.metrics !== false) return 'metrics';
    if (mods.orders !== false) return 'orders';
    if (mods.menu_editor !== false && mods.settings !== false) return 'settings';
    return 'metrics';
  });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [adminThemeId, setAdminThemeId] = useState(() => adminStore.getAdminTheme());
  const [currentTime, setCurrentTime] = useState(new Date());

  // Live Clock & Theme / Modules Sync
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    const unsubscribe = adminStore.subscribe(() => {
      setAdminThemeId(adminStore.getAdminTheme());
      const currentMods = adminStore.getModules();
      setActiveModules(currentMods);
    });
    return () => {
      clearInterval(timer);
      unsubscribe();
    };
  }, []);

  const isMetricsEnabled = activeModules.metrics !== false;
  const isOrdersEnabled = activeModules.orders !== false;
  const isMenuEditorEnabled = activeModules.menu_editor !== false && activeModules.settings !== false;

  // Auto-switch to available module if current section gets disabled
  useEffect(() => {
    if (activeSection === 'metrics' && !isMetricsEnabled) {
      if (isOrdersEnabled) setActiveSection('orders');
      else if (isMenuEditorEnabled) setActiveSection('settings');
    } else if (activeSection === 'orders' && !isOrdersEnabled) {
      if (isMetricsEnabled) setActiveSection('metrics');
      else if (isMenuEditorEnabled) setActiveSection('settings');
    } else if (activeSection === 'settings' && !isMenuEditorEnabled) {
      if (isMetricsEnabled) setActiveSection('metrics');
      else if (isOrdersEnabled) setActiveSection('orders');
    }
  }, [isMetricsEnabled, isOrdersEnabled, isMenuEditorEnabled, activeSection]);

  const auth = adminStore.getAuth();
  const subStatus = adminStore.getSubscriptionStatus();
  const isUnpaid = auth.role === 'unpaid' || subStatus === 'unpaid' || activeModules.dashboard === false || activeModules.admin === false;

  // ----------------------------------------------------
  // LOCKED PANEL VIEW IF UNPAID
  // ----------------------------------------------------
  if (isUnpaid) {
    return (
      <div className="min-h-screen bg-[#150404] text-white flex items-center justify-center p-4 select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="w-full max-w-lg p-8 sm:p-10 rounded-3xl bg-black/90 border-2 border-red-500 text-center space-y-6 shadow-[0_0_60px_rgba(239,68,68,0.4)]"
        >
          <div className="w-20 h-20 rounded-full bg-red-950/90 border-2 border-red-500 flex items-center justify-center mx-auto text-red-400 shadow-[0_0_30px_rgba(239,68,68,0.5)]">
            <Ban className="w-10 h-10 animate-pulse" />
          </div>

          <div className="space-y-2">
            <span className="px-3.5 py-1 rounded-full bg-red-500/20 border border-red-500/50 text-red-300 text-xs uppercase font-black tracking-widest inline-block">
              Acceso Suspendido
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-red-400 uppercase tracking-wide">
              No se registró pago.
            </h1>
            <p className="text-sm text-gray-300 leading-relaxed max-w-md mx-auto">
              El acceso a las funciones de este panel administrativo se encuentra deshabilitado. No cuenta con permisos para ver datos ni realizar modificaciones.
            </p>
          </div>

          {/* ÚNICA ACCIÓN: Cerrar Sesión */}
          <button
            type="button"
            onClick={onLogout}
            className="w-full py-3.5 rounded-2xl bg-red-700 hover:bg-red-600 text-white font-bold uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-red-700/30"
          >
            Cerrar Sesión
          </button>
        </motion.div>
      </div>
    );
  }

  const currentThemeObj = ADMIN_COLOR_THEMES.find((th) => th.id === adminThemeId) || ADMIN_COLOR_THEMES[0];
  const themeCustomProperties = {
    '--adm-accent': currentThemeObj.color,
    '--adm-accent-light': currentThemeObj.light,
    '--adm-glow': currentThemeObj.glow,
    '--adm-subtle': currentThemeObj.subtle,
    '--adm-border': currentThemeObj.border
  };

  const timeFormatted = currentTime.toLocaleTimeString('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  const dateFormatted = currentTime.toLocaleDateString('es-CO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div
      style={themeCustomProperties}
      className="admin-theme-scope min-h-screen bg-[#090b10] text-gray-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black transition-colors duration-300"
    >
      
      {/* ---------------------------------------------------- */}
      {/* TOP HEADER BAR                                      */}
      {/* ---------------------------------------------------- */}
      <header className="h-16 px-4 sm:px-6 bg-[#0e1017] border-b border-[#212534] flex items-center justify-between sticky top-0 z-40">
        
        {/* Left: Brand / Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 font-black shadow-lg shadow-amber-500/10">
            <Crown size={22} />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-black text-white uppercase tracking-wider">
              {RESTAURANT_DATA.name}
            </h1>
            <span className="text-[10px] text-gray-400 hidden sm:block">
              Sistema de Gestión, Caja & Pedidos en Vivo
            </span>
          </div>
        </div>

        {/* Center: Live Date, Time & Compact Theme Color Picker */}
        <div className="hidden md:flex items-center gap-2.5 text-xs text-gray-300">
          <Calendar size={14} className="text-amber-400" />
          <span className="capitalize font-medium text-gray-200">{dateFormatted}</span>
          <span className="text-gray-600">|</span>
          <span className="font-mono font-bold text-amber-400">{timeFormatted}</span>
          
          <div className="pl-1 border-l border-white/10 ml-1">
            <AdminColorThemePicker
              currentThemeId={adminThemeId}
              onThemeChange={setAdminThemeId}
            />
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2">
          
          {/* Mobile Theme Picker */}
          <div className="md:hidden">
            <AdminColorThemePicker
              currentThemeId={adminThemeId}
              onThemeChange={setAdminThemeId}
            />
          </div>

          {/* Return to Digital Menu */}
          <button
            onClick={onReturnToMenu}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            title="Ver Carta Digital de Clientes"
          >
            <ExternalLink size={14} />
            <span className="hidden sm:inline">Ver Carta Digital</span>
          </button>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 transition-all cursor-pointer"
            title="Cerrar Sesión de Administrador"
          >
            <LogOut size={16} />
          </button>

        </div>
      </header>

      {/* ---------------------------------------------------- */}
      {/* BODY LAYOUT: LEFT SIDEBAR + MAIN CONTENT             */}
      {/* ---------------------------------------------------- */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* Left Sidebar Navigation */}
        <aside className="w-full md:w-64 bg-[#0c0e14] border-r border-[#1e2230] p-4 flex flex-row md:flex-col gap-2 shrink-0 overflow-x-auto md:overflow-visible">
          
          {/* Navigation Item 1: Metrics & Cash Register */}
          {isMetricsEnabled && (
            <button
              onClick={() => setActiveSection('metrics')}
              className={`w-full p-3.5 rounded-2xl text-left flex items-center gap-3 transition-all cursor-pointer shrink-0 ${
                activeSection === 'metrics'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-black font-black shadow-lg shadow-amber-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-[#141722]'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                activeSection === 'metrics' ? 'bg-black/20 text-black' : 'bg-white/5 text-amber-400'
              }`}>
                <BarChart3 size={18} />
              </div>
              <div>
                <span className="text-xs font-extrabold block leading-tight">Métricas y Caja</span>
                <span className="text-[10px] opacity-75 hidden md:block">Ingresos & Arqueo Diario</span>
              </div>
            </button>
          )}

          {/* Navigation Item 2: Live Orders, Tables & Reservations */}
          {isOrdersEnabled && (
            <button
              onClick={() => setActiveSection('orders')}
              className={`w-full p-3.5 rounded-2xl text-left flex items-center gap-3 transition-all cursor-pointer shrink-0 ${
                activeSection === 'orders'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-black font-black shadow-lg shadow-amber-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-[#141722]'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                activeSection === 'orders' ? 'bg-black/20 text-black' : 'bg-white/5 text-amber-400'
              }`}>
                <UtensilsCrossed size={18} />
              </div>
              <div>
                <span className="text-xs font-extrabold block leading-tight">Pedidos & Mesas</span>
                <span className="text-[10px] opacity-75 hidden md:block">Mesas 1-15 & Reservas</span>
              </div>
            </button>
          )}

          {/* Navigation Item 3: Menu Customization & Security */}
          {isMenuEditorEnabled && (
            <button
              onClick={() => setActiveSection('settings')}
              className={`w-full p-3.5 rounded-2xl text-left flex items-center gap-3 transition-all cursor-pointer shrink-0 ${
                activeSection === 'settings'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-black font-black shadow-lg shadow-amber-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-[#141722]'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                activeSection === 'settings' ? 'bg-black/20 text-black' : 'bg-white/5 text-amber-400'
              }`}>
                <Settings size={18} />
              </div>
              <div>
                <span className="text-xs font-extrabold block leading-tight">Configuración Menú</span>
                <span className="text-[10px] opacity-75 hidden md:block">Precios, Platos & Claves</span>
              </div>
            </button>
          )}

          {/* Dedicated Change Password Button at Bottom of Sidebar */}
          <div className="mt-auto pt-4 border-t border-[#1e2230] space-y-2">
            <button
              type="button"
              onClick={() => setShowPasswordModal(true)}
              className="w-full p-3 rounded-2xl bg-[#141722] hover:bg-[#1c2130] border border-[#232738] hover:border-amber-500/40 text-amber-400 hover:text-amber-300 text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer"
            >
              <div className="w-7 h-7 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-400">
                <Key size={14} />
              </div>
              <span className="text-xs font-extrabold text-white">Cambiar Contraseña</span>
            </button>

            {/* Secret Master Factory Reset Button */}
            <button
              type="button"
              onClick={() => setShowResetModal(true)}
              className="w-full p-3 rounded-2xl bg-[#181114] hover:bg-[#24151b] border border-red-500/30 hover:border-red-500/60 text-red-400 hover:text-red-300 text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer"
            >
              <div className="w-7 h-7 rounded-xl bg-red-500/15 flex items-center justify-center text-red-400">
                <RotateCcw size={14} />
              </div>
              <span className="text-xs font-extrabold text-red-200">Restablecer por Defecto</span>
            </button>
          </div>

        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl">
          <AnimatePresence mode="wait">
            {activeSection === 'metrics' && isMetricsEnabled && (
              <motion.div
                key="metrics-section"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <AdminMetrics />
              </motion.div>
            )}

            {activeSection === 'orders' && isOrdersEnabled && (
              <motion.div
                key="orders-section"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <AdminOrdersAndTables />
              </motion.div>
            )}

            {activeSection === 'settings' && isMenuEditorEnabled && (
              <motion.div
                key="settings-section"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <AdminMenuSettings />
              </motion.div>
            )}

            {!isMetricsEnabled && !isOrdersEnabled && !isMenuEditorEnabled && (
              <div className="p-12 rounded-3xl bg-[#0e1017] border border-amber-500/30 text-center space-y-4 max-w-lg mx-auto my-12">
                <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
                  <Ban size={32} />
                </div>
                <h3 className="text-lg font-bold text-white">Módulos Deshabilitados</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Todas las secciones de administración (Métricas, Pedidos y Menú) han sido suspendidas temporalmente desde la central de la agencia.
                </p>
              </div>
            )}
          </AnimatePresence>
        </main>

      </div>

      {/* CHANGE PASSWORD MODAL */}
      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />

      {/* FACTORY RESET TO DEFAULTS MODAL */}
      <ResetDefaultsModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
      />

    </div>
  );
}
