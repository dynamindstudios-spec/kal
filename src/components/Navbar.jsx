import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Calendar, Volume2, VolumeX, Sparkles, Flame } from 'lucide-react';
import { UI_TEXT } from '../data/menuData';

export default function Navbar({
  currentLang = 'es',
  backgroundScene = 'drinks',
  isMuted = true,
  setIsMuted,
  onOpenSettings,
  onOpenReservation,
  promotion = null,
  onOpenPromoCelebration
}) {
  const t = UI_TEXT[currentLang] || UI_TEXT.es;
  const isSerpientesMode = backgroundScene === 'serpientes' || backgroundScene === 'disco';
  const hasPromo = Boolean(promotion?.active && Number(promotion?.percentage) > 0);

  return (
    <header id="spotlight-step-navbar" className="fixed top-0 left-0 right-0 z-50 w-full backdrop-blur-2xl bg-black/95 border-b border-[var(--surface-border)] shadow-[0_4px_30px_rgba(0,0,0,0.95)] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-4 md:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-3">
        
        {/* LEFT: KAL Discobar Logo & Title */}
        <div className="flex items-center gap-2 shrink-0">
          <motion.div
            whileHover={{ scale: 1.05 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="cursor-pointer group flex items-center gap-2 relative p-0.5 sm:p-1"
            title="KAL Discobar"
          >
            {/* Rotating Sparkle Accent */}
            <motion.span
              animate={{ rotate: 360, scale: [0.8, 1.2, 0.8] }}
              transition={{ rotate: { duration: 8, repeat: Infinity, ease: 'linear' }, scale: { duration: 1.8, repeat: Infinity } }}
              className="absolute -top-1 -right-1 text-xs select-none pointer-events-none"
            >
              ✨
            </motion.span>

            <img
              src="/logo_kal_discobar.jpg"
              alt="KAL Discobar"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=100&q=80";
              }}
              className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full object-cover border border-amber-400/60 shadow-[0_0_15px_var(--accent-glow)] relative z-10 transition-transform duration-300 group-hover:scale-105"
            />
            <div className="flex flex-col text-left">
              <span className="text-xs sm:text-sm md:text-base font-black tracking-wider uppercase gradient-text leading-tight">
                KAL DISCOBAR
              </span>
              <span className="text-[9px] sm:text-[10px] text-gray-300 font-semibold tracking-widest leading-none flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                VIP DISCOTECA
              </span>
            </div>
          </motion.div>
        </div>

        {/* CENTER: Banner Promocional exactamente entre KAL DISCOBAR y RESERVA VIP (Arriba del Hero) */}
        {hasPromo ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => {
              if (onOpenPromoCelebration) onOpenPromoCelebration();
            }}
            className="flex-1 max-w-xl mx-2 sm:mx-4 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-red-950 via-[#1c0f18] to-amber-950 border border-amber-400/50 shadow-[0_0_20px_rgba(255,204,0,0.3)] flex items-center justify-between gap-2 cursor-pointer group hover:brightness-115 transition-all overflow-hidden"
            title="Toca para ver la celebración con fuegos artificiales y detalles de la promoción"
          >
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-amber-500 to-red-500 flex items-center justify-center text-xs shadow-md shrink-0 animate-pulse">
                🔥
              </div>
              <div className="flex flex-col text-left min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs sm:text-sm font-black text-amber-300 uppercase tracking-wide truncate group-hover:text-amber-200">
                    {promotion.title || '¡PROMOCIÓN VIP EN VIVO!'}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-red-600 to-amber-600 text-white font-black text-[10px] sm:text-[11px] uppercase tracking-wider shadow-sm shrink-0 border border-white/20 animate-bounce">
                    -{promotion.percentage}% OFF
                  </span>
                </div>
                {promotion.bannerText && (
                  <span className="text-[10px] sm:text-[11px] text-gray-300 font-medium truncate hidden md:block">
                    {promotion.bannerText}
                  </span>
                )}
              </div>
            </div>

            <div className="shrink-0 hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[10px] font-black uppercase tracking-wider group-hover:bg-amber-500 group-hover:text-black transition-all">
              <Sparkles size={12} />
              <span>Ver Promo</span>
            </div>
          </motion.div>
        ) : (
          <div className="flex-1 max-w-xl mx-2 flex items-center justify-center">
            {setIsMuted && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMuted(!isMuted)}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-md ${
                  isMuted
                    ? 'bg-white/5 hover:bg-white/10 text-gray-400 border border-white/10'
                    : 'bg-[var(--accent-color)] text-black border border-[var(--accent-color)] shadow-[0_0_15px_var(--accent-glow)] animate-pulse'
                }`}
                title={isMuted ? 'Activar música ambiente' : 'Silenciar música ambiente'}
              >
                {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                <span className="hidden sm:inline text-[11px] font-extrabold uppercase">
                  {isMuted ? 'Música Off' : 'Música On'}
                </span>
              </motion.button>
            )}
          </div>
        )}

        {/* RIGHT: Reservation Button & Settings */}
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 shrink-0">
          
          {/* Reservation Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenReservation}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black text-xs sm:text-sm font-black tracking-wide shadow-lg shadow-amber-500/20 transition-all uppercase cursor-pointer"
          >
            <Calendar size={15} strokeWidth={2.5} />
            <span className="hidden sm:inline">{t.reservations}</span>
            <span className="sm:hidden text-[11px]">Reserva</span>
          </motion.button>

          {/* Settings Drawer Button */}
          <motion.button
            whileHover={{ scale: 1.05, rotate: 45 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenSettings}
            className="p-2 sm:p-2.5 rounded-2xl bg-white/5 hover:bg-white/15 text-gray-200 hover:text-white border border-white/10 transition-all cursor-pointer shadow-md"
            title={t.settings}
            aria-label="Abrir panel de configuración"
          >
            <Settings size={18} />
          </motion.button>

        </div>

      </div>
    </header>
  );
}
