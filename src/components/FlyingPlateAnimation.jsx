import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function FlyingBeerGlassSVG({ size = 48 }) {
  return (
    <div className="relative flex items-center justify-center filter drop-shadow-[0_0_18px_rgba(234,179,8,0.9)]">
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M16 18V56H44V18H16Z" fill="#eab308" fillOpacity="0.4" stroke="#eab308" strokeWidth="3" strokeLinejoin="round" />
        <path d="M44 24H52C55 24 57 26 57 29V43C57 46 55 48 52 48H44" stroke="#eab308" strokeWidth="3" strokeLinecap="round" />
        {/* Foam Splash */}
        <path d="M14 18C14 14 18 12 22 14C24 10 30 10 33 13C37 10 44 12 46 18H14Z" fill="#ffffff" stroke="#fef08a" strokeWidth="2" />
        {/* Bubbles */}
        <circle cx="26" cy="34" r="2" fill="#ffffff" />
        <circle cx="34" cy="42" r="2.5" fill="#ffffff" />
        <circle cx="28" cy="48" r="1.5" fill="#ffffff" />
      </svg>
    </div>
  );
}

export default function FlyingPlateAnimation({ flyingPlates }) {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {flyingPlates.map((plate) => {
          const targetX = window.innerWidth - 70;
          const targetY = window.innerHeight - 70;

          return (
            <motion.div
              key={plate.id}
              initial={{
                x: plate.startX,
                y: plate.startY - 35,
                scale: 1.4,
                opacity: 0,
                rotate: -20
              }}
              animate={{
                x: [plate.startX, plate.startX, (plate.startX + targetX) / 2, targetX],
                y: [plate.startY - 35, plate.startY, Math.min(plate.startY, targetY) - 100, targetY],
                scale: [1.4, 1.2, 0.9, 0.4],
                opacity: [0.9, 1, 1, 0.2],
                rotate: [-20, 0, 180, 360]
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 1.1,
                times: [0, 0.25, 0.65, 1],
                ease: ['easeOut', 'easeInOut', 'cubic-bezier(0.16, 1, 0.3, 1)']
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 backdrop-blur-md border border-[var(--accent-color)] shadow-[0_0_25px_var(--accent-glow)] z-50"
            >
              <FlyingBeerGlassSVG size={44} />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
