import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { RESTAURANT_DATA } from '../data/menuData';

export default function LoadingScreen({ onFinish }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            if (onFinish) onFinish();
          }, 500);
          return 100;
        }
        return prev + 1;
      });
    }, 45);

    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[100] w-full h-full bg-black flex flex-col items-center justify-between p-6 sm:p-10 select-none overflow-hidden"
    >
      {/* Full-Screen Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover scale-105 opacity-80 z-0"
      >
        <source src="/video carga.mp4" type="video/mp4" />
      </video>

      {/* Scrim Overlay Gradient & Neon Ambient Laser Glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/40 z-10" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-[var(--accent-color)]/20 blur-[140px] pointer-events-none z-10" />

      {/* TOP: Brand Badge */}
      <div className="relative z-20 w-full max-w-md mx-auto flex items-center justify-between">
        <span className="px-3.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-[var(--accent-color)] text-[10px] sm:text-xs font-black text-[var(--accent-color)] uppercase tracking-widest shadow-[0_0_15px_var(--accent-glow)] flex items-center gap-1.5">
          <Sparkles size={13} />
          <span>ARMENIA, QUINDÍO VIP</span>
        </span>

        <span className="text-xs font-mono font-bold text-gray-400">
          🔞 +18 EXCLUSIVO
        </span>
      </div>

      {/* CENTER: KAL Logo & Animated Title */}
      <div className="relative z-20 flex flex-col items-center text-center max-w-md mx-auto my-auto space-y-4">
        {/* Pulsing Logo */}
        <motion.div
          animate={{ scale: [0.95, 1.05, 0.95] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          className="relative"
        >
          <div className="absolute inset-0 rounded-full bg-[var(--accent-color)]/40 blur-2xl pointer-events-none" />
          <img
            src={RESTAURANT_DATA.logo}
            alt="KAL DISCOBAR"
            className="w-32 h-32 sm:w-44 sm:h-44 object-contain relative z-10 filter drop-shadow-[0_0_30px_var(--accent-glow)]"
          />
        </motion.div>

        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-black serif-title neon-title-gold tracking-tight drop-shadow-2xl">
            {RESTAURANT_DATA.name}
          </h1>
          <p className="text-xs sm:text-sm font-black text-[var(--accent-color)] uppercase tracking-widest font-mono drop-shadow">
            CARTA DIGITAL VIP & NIGHTCLUB
          </p>
        </div>
      </div>

      {/* BOTTOM: Automatic Neon Progress Bar */}
      <div className="relative z-20 w-full max-w-md mx-auto space-y-2 text-center pb-4">
        <div className="flex items-center justify-between text-[11px] font-mono font-bold text-gray-300">
          <span>{progress >= 100 ? '¡CARGANDO CARTA DIGITAL!' : 'INICIANDO EXPERIENCIA VIP...'}</span>
          <span className="text-[var(--accent-color)]">{progress}%</span>
        </div>

        <div className="w-full h-2 rounded-full bg-white/15 overflow-hidden border border-white/20 p-0.5 backdrop-blur-md">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[var(--accent-color)] via-pink-500 to-[var(--accent-color)] shadow-[0_0_15px_var(--accent-glow)]"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
      </div>
    </motion.div>
  );
}
