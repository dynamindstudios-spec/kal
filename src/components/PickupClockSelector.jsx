import React from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

const PICKUP_INTERVALS = [
  { min: 15, label: "en 15 min", angle: 90 },
  { min: 30, label: "en 30 min", angle: 180 },
  { min: 45, label: "en 45 min", angle: 270 },
  { min: 60, label: "en 60 min", angle: 360 }
];

export default function PickupClockSelector({ selectedInterval, setSelectedInterval }) {
  const activeObj = PICKUP_INTERVALS.find((i) => i.min === selectedInterval) || PICKUP_INTERVALS[0];

  return (
    <div className="p-4 rounded-2xl glass-panel border border-[var(--surface-border)] space-y-4">
      <div className="flex items-center gap-2">
        <Clock className="text-amber-500" size={18} />
        <span className="text-xs font-bold text-[var(--accent-color)] uppercase tracking-wider">
          Tiempo Estimado de Recogida
        </span>
      </div>

      {/* Luxury Radial Clock Dial Visualizer */}
      <div className="relative w-36 h-36 mx-auto rounded-full glass-panel border-4 border-[var(--surface-border)] flex items-center justify-center shadow-xl my-2">
        {/* Clock Center Pin */}
        <div className="w-4 h-4 rounded-full bg-amber-500 z-20 shadow-md" />

        {/* Animated Clock Hand */}
        <motion.div
          animate={{ rotate: activeObj.angle }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="absolute w-1 h-14 bg-gradient-to-t from-amber-500 to-amber-300 rounded-full origin-bottom bottom-1/2 left-1/2 -translate-x-1/2 z-10 shadow"
        />

        {/* Clock Number Markers */}
        <span className="absolute top-2 text-[10px] font-black text-[var(--text-muted)]">60</span>
        <span className="absolute right-2 text-[10px] font-black text-[var(--text-muted)]">15</span>
        <span className="absolute bottom-2 text-[10px] font-black text-[var(--text-muted)]">30</span>
        <span className="absolute left-2 text-[10px] font-black text-[var(--text-muted)]">45</span>
      </div>

      {/* 4 Interval Buttons */}
      <div className="grid grid-cols-2 gap-2">
        {PICKUP_INTERVALS.map((item) => {
          const isSelected = selectedInterval === item.min;

          return (
            <motion.button
              key={item.min}
              whileTap={{ scale: 0.94 }}
              onClick={() => setSelectedInterval(item.min)}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                isSelected
                  ? 'bg-amber-500 text-zinc-950 border-amber-400 font-black shadow-md scale-105'
                  : 'bg-[var(--pill-bg)] text-[var(--text-primary)] border-[var(--surface-border)] hover:border-amber-400'
              }`}
            >
              <span>⏱️</span>
              <span>{item.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
