import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, X, Sliders, LayoutGrid, List, Layers, Sparkles, Palette, DollarSign, ChevronDown, Globe } from 'lucide-react';
import { UI_TEXT, CURRENCIES, LANGUAGES } from '../data/menuData';
import { getFlagComponent } from './FlagIcons';
import { adminStore } from '../services/adminStore';

// Reusable Sliding Toggle Switch Component
const ToggleSwitch = ({ checked = true, onChange }) => {
  const isChecked = Boolean(checked);
  return (
    <button
      type="button"
      onClick={() => onChange && onChange(!isChecked)}
      className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 flex items-center shrink-0 shadow-inner cursor-pointer ${
        isChecked ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-rose-600'
      }`}
      title={isChecked ? 'Activado' : 'Desactivado'}
    >
      <motion.div
        animate={{ x: isChecked ? 24 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="w-4 h-4 rounded-full bg-white shadow-md"
      />
    </button>
  );
};

export default function SettingsDrawer({
  isOpen,
  onClose,
  viewMode,
  setViewMode,
  showBackgroundIcons = true,
  setShowBackgroundIcons,
  animateBackgroundIcons = true,
  setAnimateBackgroundIcons,
  showSidebarFilters = true,
  setShowSidebarFilters,
  backgroundScene = 'drinks',
  setBackgroundScene,
  currentTheme = 'kall-dark',
  setTheme,
  currentCurrency = 'COP',
  setCurrency,
  currentLang = 'es',
  setLang
}) {
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  if (!isOpen) return null;

  const t = UI_TEXT[currentLang] || UI_TEXT.es;
  const activeCurrencyObj = CURRENCIES[currentCurrency] || CURRENCIES.COP;
  const activeLangObj = LANGUAGES[currentLang] || LANGUAGES.es;

  // 12 Ultra-Vibrant Party Neon Theme Swatches
  const themes = [
    { id: 'kall-dark', label: 'Dorado VIP 🟡', color: '#eab308' },
    { id: 'kall-neon', label: 'Rosa Neón 🩷', color: '#ec4899' },
    { id: 'kall-purple', label: 'Púrpura Místico 💜', color: '#a855f7' },
    { id: 'kall-emerald', label: 'Verde Esmeralda 💚', color: '#10b981' },
    { id: 'kall-blood', label: 'Rojo Infierno 🔴', color: '#ef4444' },
    { id: 'kall-cyan', label: 'Cian Eléctrico 🩵', color: '#06b6d4' },
    { id: 'kall-amber', label: 'Ámbar Atardecer 🧡', color: '#f97316' },
    { id: 'kall-lime', label: 'Verde Limón Ácido 🍋', color: '#84cc16' },
    { id: 'kall-violet', label: 'Violeta Luz Negra 🔮', color: '#7c3aed' },
    { id: 'kall-pink', label: 'Verde Militar Fluorescente 🪖', color: '#65a30d' },
    { id: 'kall-coral', label: 'Coral Lava Volcán 🌋', color: '#ff3366' },
    { id: 'kall-yellow', label: 'Azul Oscuro Fluorescente 💙', color: '#2563eb' }
  ];

  const enabledViewModes = adminStore.getViewModesSettings();
  const enabledScenes = adminStore.getScenesSettings();

  const scenes = [
    { id: 'drinks', label: 'Modo Licores VIP', icon: '🍾', desc: 'Botellas, cócteles & copas neón flotantes' },
    { id: 'party', label: 'Modo Fiesta', icon: '🪩', desc: 'Bola Disco, Consola DJ & Parlantes neón' },
    { id: 'natura', label: 'Modo Natura', icon: '🌿', desc: 'Cobras exóticas, Palmeras & Jungla' },
    { id: 'serpientes', label: 'Modo Serpientes', icon: '🐍', desc: 'Video inmersivo fondo serpientes, atmósfera oscura & audio' }
  ].filter((sc) => enabledScenes[sc.id] !== false);

  const isSerpientesMode = backgroundScene === 'serpientes' || backgroundScene === 'disco';

  const allModes = [
    { id: 'cards', label: t.cardsMode, icon: <Layers size={18} />, desc: t.cardsModeDesc },
    { id: 'compact', label: t.compactMode, icon: <LayoutGrid size={18} />, desc: t.compactModeDesc },
    { id: 'basic', label: t.basicMode, icon: <List size={18} />, desc: t.basicModeDesc }
  ].filter((m) => enabledViewModes[m.id] !== false);

  const activeThemeObj = themes.find((th) => th.id === currentTheme) || themes[0];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-md flex justify-end">
        
        {/* Backdrop click to close */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0"
        />

        {/* Settings Drawer Panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
          className="relative z-10 w-full max-w-xs sm:max-w-[340px] h-full bg-black/95 border-l border-[var(--surface-border)] shadow-2xl flex flex-col justify-between"
        >
          {/* Header */}
          <div className="p-4.5 sm:p-5 border-b border-[var(--surface-border)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings className="text-[var(--accent-color)]" size={20} />
              <h3 className="text-base font-black text-white">{t.settingsTitle}</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body Options */}
          <div className="flex-1 overflow-y-auto p-4.5 sm:p-5 space-y-5">
            
            {/* 1. IDIOMA DE LA CARTA (Trasladado desde la Navbar, sin modificar aspecto) */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-black text-[var(--accent-color)] uppercase tracking-wider flex items-center gap-2">
                <Globe size={16} />
                <span>Idioma de la Carta</span>
              </h4>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                  className="w-full p-3 rounded-2xl bg-white/5 border border-white/15 text-white text-xs font-black flex items-center justify-between hover:border-[var(--accent-color)] transition-all cursor-pointer shadow-md"
                >
                  <div className="flex items-center gap-2.5">
                    {getFlagComponent(activeLangObj.code, 22)}
                    <span className="text-sm font-bold">{activeLangObj.name}</span>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-300 text-gray-400 ${
                      isLangDropdownOpen ? 'rotate-180 text-[var(--accent-color)]' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isLangDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-0 right-0 top-full mt-2 z-50 bg-black/95 border border-[var(--surface-border)] rounded-2xl shadow-2xl max-h-56 overflow-y-auto p-1.5 space-y-1 no-scrollbar backdrop-blur-xl"
                    >
                      {Object.values(LANGUAGES).map((langObj) => {
                        const isSelected = currentLang === langObj.code;
                        return (
                          <button
                            key={langObj.code}
                            type="button"
                            onClick={() => {
                              setLang && setLang(langObj.code);
                              setIsLangDropdownOpen(false);
                            }}
                            className={`w-full p-2.5 rounded-xl text-left text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[var(--accent-color)] text-[var(--accent-on)] font-black shadow-md'
                                : 'text-gray-300 hover:bg-white/10 hover:text-white'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              {getFlagComponent(langObj.code, 20)}
                              <span>{langObj.name}</span>
                            </div>
                            <span className="font-mono text-[11px] uppercase opacity-80">{langObj.code}</span>
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* 2. MONEDA DE PAGO INTERNACIONAL (10 Divisas) */}
            <div className="space-y-2.5 pt-4 border-t border-[var(--surface-border)]">
              <h4 className="text-xs font-black text-gray-300 uppercase tracking-wider flex items-center gap-2">
                <DollarSign size={16} className="text-[var(--accent-color)]" />
                <span>Moneda de Pago (10 Divisas)</span>
              </h4>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
                  className="w-full p-3 rounded-2xl bg-white/5 border border-white/15 text-white text-xs font-black flex items-center justify-between hover:border-[var(--accent-color)] transition-all cursor-pointer shadow-md"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{activeCurrencyObj.flag}</span>
                    <span className="text-sm">{activeCurrencyObj.label}</span>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-300 text-gray-400 ${
                      isCurrencyDropdownOpen ? 'rotate-180 text-[var(--accent-color)]' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isCurrencyDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-0 right-0 top-full mt-2 z-50 bg-black/95 border border-[var(--surface-border)] rounded-2xl shadow-2xl max-h-56 overflow-y-auto p-1.5 space-y-1 no-scrollbar backdrop-blur-xl"
                    >
                      {Object.values(CURRENCIES).map((curr) => {
                        const isSelected = currentCurrency === curr.code;
                        return (
                          <button
                            key={curr.code}
                            type="button"
                            onClick={() => {
                              setCurrency && setCurrency(curr.code);
                              setIsCurrencyDropdownOpen(false);
                            }}
                            className={`w-full p-2.5 rounded-xl text-left text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[var(--accent-color)] text-[var(--accent-on)] font-black shadow-md'
                                : 'text-gray-300 hover:bg-white/10 hover:text-white'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="text-lg">{curr.flag}</span>
                              <span>{curr.label}</span>
                            </div>
                            <span className="font-mono text-[11px] opacity-80">{curr.code}</span>
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* 3. COLOR DE TEMA DE NEÓN (12 Opciones en Círculos Sin Letras con Borde Blanco) — Oculto en Modo Serpientes */}
            {!isSerpientesMode && (
              <div className="space-y-3 pt-4 border-t border-[var(--surface-border)]">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-gray-200 uppercase tracking-wider flex items-center gap-2">
                    <Palette size={16} className="text-[var(--accent-color)]" />
                    <span>Color de Tema Neón (12 Opciones)</span>
                  </h4>
                  <span className="text-[11px] font-bold font-mono text-[var(--accent-color)] truncate max-w-[110px]">
                    {activeThemeObj.label}
                  </span>
                </div>

                {/* Grid of Circular Color Swatches — No Letters, White Border, Pure Glow */}
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 grid grid-cols-6 gap-2.5 items-center justify-items-center">
                  {themes.map((th) => {
                    const isSelected = currentTheme === th.id;
                    return (
                      <motion.button
                        key={th.id}
                        type="button"
                        whileHover={{ scale: 1.25 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setTheme && setTheme(th.id)}
                        className={`w-9 h-9 rounded-full border-2 border-white transition-all cursor-pointer relative flex items-center justify-center ${
                          isSelected
                            ? 'scale-125 z-10 shadow-2xl ring-2 ring-white/50'
                            : 'opacity-80 hover:opacity-100'
                        }`}
                        style={{
                          backgroundColor: th.color,
                          boxShadow: isSelected ? `0 0 20px ${th.color}` : `0 0 6px ${th.color}66`
                        }}
                        title={th.label}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* 4. ESCENAS DE AMBIENTE DEL FONDO (4 MODOS COMPLETOS) */}
            <div className="space-y-2.5 pt-4 border-t border-[var(--surface-border)]">
              <h4 className="text-xs font-black text-[var(--accent-color)] uppercase tracking-wider flex items-center gap-2">
                <Sparkles size={16} />
                <span>Ambiente de Fondo</span>
              </h4>

              <div className="grid grid-cols-1 gap-2">
                {scenes.map((sc) => {
                  const isSelected = backgroundScene === sc.id || 
                    (sc.id === 'party' && (backgroundScene === 'party' || backgroundScene === 'bar-show')) || 
                    (sc.id === 'natura' && (backgroundScene === 'cobra' || backgroundScene === 'natura')) ||
                    (sc.id === 'serpientes' && (backgroundScene === 'serpientes' || backgroundScene === 'disco'));
                  
                  const isSerpientesButton = sc.id === 'serpientes';

                  return (
                    <button
                      key={sc.id}
                      type="button"
                      onClick={() => setBackgroundScene && setBackgroundScene(sc.id)}
                      className={`w-full p-3 rounded-2xl text-left transition-all border flex items-center gap-3 cursor-pointer relative overflow-hidden ${
                        isSerpientesButton
                          ? isSelected
                            ? 'border-2 border-white bg-white/20 text-white shadow-[0_0_25px_rgba(255,255,255,0.9)] ring-2 ring-white/60 font-black'
                            : 'border-2 border-white/80 bg-black/60 text-white hover:border-white shadow-[0_0_18px_rgba(255,255,255,0.4)]'
                          : isSelected
                            ? 'bg-[var(--pill-active)] text-white border-[var(--pill-active-border)] shadow-[0_0_15px_var(--accent-glow)] font-black'
                            : 'bg-white/5 text-gray-300 border-white/10 hover:border-[var(--accent-color)]'
                      }`}
                    >
                      <span className="text-2xl">{sc.icon}</span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-extrabold truncate">{sc.label}</p>
                          {isSerpientesButton && (
                            <span className="px-1.5 py-0.2 rounded bg-white text-black font-black text-[9px] uppercase tracking-wider">
                              Exclusivo
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-gray-400 truncate">{sc.desc}</p>
                      </div>

                      {/* Exclusive Star Badge for Modo Serpientes */}
                      {isSerpientesButton && (
                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/20 border border-white text-white text-[11px] font-black shrink-0 shadow-[0_0_14px_rgba(255,255,255,0.8)]">
                          <span className="text-yellow-300 text-sm animate-pulse">⭐</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. VISTA DE MENÚ (CARDS / COMPACT / BASIC) */}
            <div className="space-y-2.5 pt-4 border-t border-[var(--surface-border)]">
              <h4 className="text-xs font-black text-gray-300 uppercase tracking-wider flex items-center gap-2">
                <Sliders size={16} className="text-[var(--accent-color)]" />
                <span>{t.viewModeTitle}</span>
              </h4>

              <div className="grid grid-cols-1 gap-2">
                {allModes.map((mode) => {
                  const isSelected = viewMode === mode.id;
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setViewMode(mode.id)}
                      className={`w-full p-3 rounded-2xl text-left transition-all border flex items-center gap-3 cursor-pointer ${
                        isSelected
                          ? 'bg-[var(--pill-active)] text-white border-[var(--pill-active-border)] shadow-[0_0_15px_var(--accent-glow)] font-black'
                          : 'bg-white/5 text-gray-300 border-white/10 hover:border-[var(--accent-color)]'
                      }`}
                    >
                      <span className="p-2 rounded-xl bg-white/10 text-white shrink-0">
                        {mode.icon}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-extrabold truncate">{mode.label}</p>
                        <p className="text-[10px] text-gray-400 truncate">{mode.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 6. INTERRUPTORES DE ELEMENTOS FLOTANTES — Ocultos en Modo Serpientes */}
            <div className="space-y-3 pt-4 border-t border-[var(--surface-border)]">
              {!isSerpientesMode && (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-extrabold text-white">Íconos de Fondo</p>
                      <p className="text-[10px] text-gray-400">Mostrar ambientación neón</p>
                    </div>
                    <ToggleSwitch
                      checked={showBackgroundIcons}
                      onChange={(val) => {
                        if (setShowBackgroundIcons) setShowBackgroundIcons(val);
                        if (setAnimateBackgroundIcons) setAnimateBackgroundIcons(val);
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-extrabold text-white">Animación Flotante</p>
                      <p className="text-[10px] text-gray-400">Movimiento continuo 60 FPS</p>
                    </div>
                    <ToggleSwitch
                      checked={animateBackgroundIcons}
                      onChange={(val) => {
                        if (setAnimateBackgroundIcons) setAnimateBackgroundIcons(val);
                      }}
                    />
                  </div>
                </>
              )}

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-extrabold text-white">Barra de Filtros</p>
                  <p className="text-[10px] text-gray-400">Mostrar panel lateral</p>
                </div>
                <ToggleSwitch
                  checked={showSidebarFilters}
                  onChange={(val) => setShowSidebarFilters && setShowSidebarFilters(val)}
                />
              </div>
            </div>

          </div>

          {/* Footer Close Button */}
          <div className="p-4 border-t border-[var(--surface-border)] bg-white/5">
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-[var(--accent-color)] text-[var(--accent-on)] text-xs font-black uppercase tracking-wider shadow-lg hover:brightness-110 transition-all cursor-pointer"
            >
              Aplicar Cambios VIP
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
