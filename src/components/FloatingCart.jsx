import React from 'react';
import { motion } from 'framer-motion';

// Inverted Party Drink Basket Icon: Black fills & White accents
function DrinkBasketSVG({ className = "" }) {
  return (
    <div className="relative flex items-center justify-center">
      {/* Sparkles Pop Out on Hover */}
      <span className="absolute -top-6 text-sm opacity-0 group-hover:opacity-100 group-hover:-translate-y-2.5 transition-all duration-300 select-none pointer-events-none filter drop-shadow-[0_0_8px_white]">
        ✨🍾✨
      </span>

      <svg width="40" height="40" viewBox="0 0 64 70" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* Basket Handle in Black */}
        <path d="M16 32C16 16 48 16 48 32" stroke="#000000" strokeWidth="3.5" strokeLinecap="round" />

        {/* Bottles inside basket (Inverted: Black body, White outlines & details) */}
        <g className="transition-transform duration-300 ease-out group-hover:-translate-y-7 group-hover:scale-110">
          {/* Left Whiskey Bottle */}
          <path d="M16 12H24V20L28 24V40H12V24L16 20V12Z" fill="#000000" stroke="#000000" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M18 14H22V19H18V14Z" fill="#ffffff" />
          <rect x="14" y="26" width="12" height="10" rx="1" fill="#000000" stroke="#ffffff" strokeWidth="1.2" />

          {/* Center Champagne Bottle */}
          <path d="M28 4H36V16L42 22V40H22V22L28 16V4Z" fill="#000000" stroke="#000000" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M30 6H34V14H30V6Z" fill="#ffffff" />
          <rect x="25" y="24" width="14" height="12" rx="1.5" fill="#000000" stroke="#ffffff" strokeWidth="1.2" />

          {/* Right Cocktail Glass */}
          <path d="M38 18L42 38H50L54 18H38Z" fill="#000000" stroke="#000000" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M40 22L43 35H49L52 22H40Z" fill="#000000" opacity="0.9" />
          {/* Cocktail straw in White */}
          <line x1="46" y1="12" x2="43" y2="28" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
        </g>

        {/* Basket / Bucket Base (Inverted: Black bucket with White accent lines) */}
        <path
          d="M10 30H54L48 64H16L10 30Z"
          fill="#000000"
          stroke="#000000"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        <path
          d="M12 32H52L46 62H18L12 32Z"
          fill="#000000"
          stroke="#ffffff"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path d="M15 42H49M18 53H46" stroke="#ffffff" strokeWidth="2.8" strokeLinecap="round" opacity="0.9" />
      </svg>
    </div>
  );
}

export default function FloatingCart({ cartCount, onOpenCart }) {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-center">
      {/* Floating Drink Basket Cart Button */}
      <motion.button
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.9 }}
        onClick={onOpenCart}
        className="relative p-4 rounded-full bg-[var(--accent-color)] text-black font-extrabold shadow-[0_0_30px_var(--accent-glow)] border-2 border-white/30 hover:border-white transition-all flex flex-col items-center justify-center group cursor-pointer"
        title="Ver Canasta de Pedido"
      >
        <DrinkBasketSVG />

        {cartCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-black w-7 h-7 rounded-full flex items-center justify-center border-2 border-black shadow-lg shadow-red-600/50 animate-bounce"
          >
            {cartCount}
          </motion.span>
        )}
      </motion.button>
    </div>
  );
}
