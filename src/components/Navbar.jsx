import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Calendar, Volume2, VolumeX } from 'lucide-react';
import { UI_TEXT } from '../data/menuData';

export default function Navbar({
  currentLang = 'es',
  backgroundScene = 'drinks',
  isMuted = true,
  setIsMuted,
  onOpenSettings,
  onOpenReservation
}) {
  const t = UI_TEXT[currentLang] || UI_TEXT.es;
  const isSerpientesMode = backgroundScene === 'serpientes' || backgroundScene === 'disco';

  return (
    <header id="spotlight-step-navbar" className="fixed top-0 left-0 right-0 z-50 w-full backdrop-blur-2xl bg-black/95 border-b border-[var(--surface-border)] shadow-[0_4px_30px_rgba(0,0,0,0.95)] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-4 md:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-3">
        
        {/* Left: KAL Discobar Logo */}
        <div className="flex items-center gap-2">
          <motion.div
            whileHover={{ scale: 1.05 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="cursor-pointer group flex items-center gap-2 relative p-0.5 sm:p-1"
            title="KAL Discobar"
          >
            {/* Pulsing Fluorescent Neon Aura Ring behind logo */}
            <motion.div
              animate={{ scale: [0.95, 1.15, 0.95], opacity: [0.5, 0.9, 0.5] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0 rounded-full bg-[var(--accent-color)]/30 blur-md pointer-events-none"
            />

            {/* Rotating Sparkle Accent */}
            <motion.span
              animate={{ rotate: 360, scale: [0.8, 1.2, 0.8] }}
              transition={{ rotate: { duration: 8, repeat: Infinity, ease: 'linear' }, scale: { duration: 1.8, repeat: Infinity } }}
              className="absolute -top-1 -right-1 text-xs filter drop-shadow-[0_0_8px_var(--accent-color)] pointer-events-none select-none"
            >
              ✨
            </motion.span>

            <img
              src="/logo.png"
              alt="KAL Discobar Logo"
              className="h-10 sm:h-12 md:h-16 w-auto object-contain relative z-10 filter drop-shadow-[0_0_20px_var(--accent-glow)] transition-transform group-hover:scale-105"
            />
            <span className="font-black text-sm sm:text-base md:text-xl uppercase tracking-wider text-[var(--accent-color)] serif-title drop-shadow-[0_0_14px_var(--accent-glow)] font-mono">
              KAL Discobar
            </span>
          </motion.div>
        </div>

        {/* Right Controls: Sound Toggle (in Serpientes Mode), VIP Reservation & Settings Drawer */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          
          {/* SOUND MUTE / UNMUTE TOGGLE (Visible exclusively in Modo Serpientes) */}
          {isSerpientesMode && (
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => setIsMuted && setIsMuted(!isMuted)}
              className={`px-3 py-1.5 sm:py-2 rounded-full border text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-lg cursor-pointer ${
                isMuted
                  ? 'bg-white/10 text-gray-300 border-white/20 hover:border-white/50'
                  : 'bg-emerald-500 text-white border-emerald-400 shadow-[0_0_18px_rgba(16,185,129,0.9)]'
              }`}
              title={isMuted ? "Activar Sonido del Video Disco" : "Silenciar Video Disco"}
            >
              {isMuted ? (
                <>
                  <VolumeX size={15} />
                  <span className="hidden xs:inline text-[10px] font-mono">Audio OFF</span>
                </>
              ) : (
                <>
                  <Volume2 size={15} className="animate-pulse" />
                  <span className="hidden xs:inline text-[10px] font-mono">Audio ON</span>
                </>
              )}
            </motion.button>
          )}

          {/* DYNAMIC THEME VIP TABLE RESERVATION BUTTON */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenReservation}
            style={{
              backgroundColor: 'var(--accent-color)',
              color: 'var(--accent-on)',
              boxShadow: '0 0 20px var(--accent-glow)'
            }}
            className="relative px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-black text-xs sm:text-sm tracking-wider uppercase flex items-center gap-1.5 sm:gap-2 transition-all duration-300 border border-white/40 hover:brightness-110 cursor-pointer overflow-hidden group shadow-lg"
            title="Reservar Mesa VIP en KAL Discobar"
          >
            {/* Inner Pulsing Aura Ring */}
            <motion.span
              animate={{ opacity: [0.4, 0.9, 0.4], scale: [0.98, 1.05, 0.98] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute inset-0 rounded-full border-2 border-white/60 pointer-events-none"
            />

            <Calendar size={15} className="shrink-0 animate-bounce" />
            <span className="relative z-10 font-mono font-black text-[11px] sm:text-xs">
              Reserva VIP
            </span>
          </motion.button>

          {/* Settings Drawer Trigger Button */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onOpenSettings}
            className="p-2 sm:p-2.5 rounded-full bg-white/10 text-white hover:bg-[var(--accent-color)] hover:text-[var(--accent-on)] border border-white/20 transition-all cursor-pointer shadow-md"
            title="Configuración VIP & Estilos"
          >
            <Settings size={18} />
          </motion.button>

        </div>

      </div>
    </header>
  );
}
