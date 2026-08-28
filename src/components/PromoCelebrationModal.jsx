import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Flame, X } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PromoCelebrationModal({
  isOpen,
  onClose,
  promotion,
  onExploreMenu
}) {
  useEffect(() => {
    if (!isOpen || !promotion?.active) return;

    // Disparar ráfaga de fuegos artificiales / confeti multidireccional continuo
    const duration = 3500;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 35, spread: 360, ticks: 70, zIndex: 9999999 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 60 * (timeLeft / duration);

      // Lanzar fuegos artificiales desde los lados y centro
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.35), y: Math.random() * 0.4 },
        colors: ['#ffcc00', '#ff2d87', '#00e5ff', '#b537f7', '#ffffff', '#ff9900']
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.65, 0.9), y: Math.random() * 0.4 },
        colors: ['#ffcc00', '#ff2d87', '#00e5ff', '#b537f7', '#ffffff', '#ff9900']
      });
    }, 220);

    return () => clearInterval(interval);
  }, [isOpen, promotion]);

  const percentage = Number(promotion?.percentage) || 20;
  const title = promotion?.title || '🔥 ¡PROMOCIÓN VIP EN VIVO!';
  const bannerText = promotion?.bannerText || 'Aprovecha precios especiales en licores y cócteles por tiempo limitado.';

  return (
    <AnimatePresence>
      {isOpen && promotion?.active && (
        <div className="fixed inset-0 z-[999999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          
          {/* Glow de fondo animado */}
          <div className="absolute w-80 h-80 rounded-full bg-[var(--accent-color,#ffcc00)]/25 blur-3xl pointer-events-none animate-pulse" />

          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-[#0f111a] border-2 border-[var(--accent-color,#ffcc00)] rounded-3xl p-6 sm:p-8 text-center text-white space-y-5 shadow-[0_0_60px_rgba(255,204,0,0.4)] overflow-hidden"
          >
            {/* Destello decorativo superior */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-24 bg-[var(--accent-color,#ffcc00)]/30 rounded-full blur-2xl pointer-events-none" />

            {/* Botón Cerrar */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-all cursor-pointer z-20"
              title="Cerrar ventana"
            >
              <X size={18} />
            </button>

            {/* Ícono Festivo Animado */}
            <motion.div
              animate={{ 
                rotate: [0, -12, 12, -12, 0],
                scale: [1, 1.12, 1] 
              }}
              transition={{ repeat: Infinity, duration: 2.2 }}
              className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-[var(--accent-color,#ffcc00)] to-amber-300 p-0.5 shadow-xl flex items-center justify-center text-black"
            >
              <div className="w-full h-full rounded-[22px] bg-[#11131c] flex items-center justify-center text-3xl">
                🎉
              </div>
            </motion.div>

            {/* Badge de Alerta en Vivo */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 text-[11px] font-black uppercase tracking-widest animate-pulse">
              <Flame size={14} className="text-red-500 fill-red-500" />
              <span>Descuento en Vivo Activado</span>
            </div>

            {/* Título Principal */}
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
                {title}
              </h2>
              <div className="text-4xl sm:text-5xl font-black font-mono text-[var(--accent-color,#ffcc00)] drop-shadow-[0_0_20px_rgba(255,204,0,0.7)] pt-1">
                -{percentage}% OFF
              </div>
            </div>

            {/* Descripción / Mensaje */}
            <p className="text-xs sm:text-sm text-gray-300 font-medium leading-relaxed px-2">
              {bannerText}
            </p>

            {/* Botón de Acción */}
            <div className="pt-2">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={() => {
                  if (onExploreMenu) onExploreMenu();
                  onClose();
                }}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[var(--accent-color,#ffcc00)] via-amber-400 to-amber-500 text-black font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-[var(--accent-color,#ffcc00)]/25 hover:brightness-110 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles size={16} />
                <span>🍹 ¡Aprovechar Descuento Ahora!</span>
              </motion.button>
            </div>

            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              ✨ Los precios en la carta y carrito ya han sido rebajados automáticamente ✨
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
