import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AnimatedPriceCounter({ value, symbol }) {
  return (
    <div className="inline-flex items-center overflow-hidden font-black text-2xl text-[var(--accent-color)]">
      <span>{symbol}</span>
      <AnimatePresence mode="wait">
        <motion.span
          key={value}
          initial={{ y: 14, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -14, opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="inline-block"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
