import React from 'react';
import { motion, useScroll, useTransform, MotionConfig } from 'framer-motion';

/* ==========================================================================
   1. MODO LICORES (DRINKS) SPECTACULAR MICRO-ANIMATED VECTOR LOGOS
   ========================================================================== */

function AnimatedPouringBottle({ size = 72, color = "var(--accent-color)", animateIcons = true }) {
  return (
    <div className="relative flex items-center justify-center">
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        animate={animateIcons ? { rotate: [-5, -32, -5] } : false}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        className="filter drop-shadow-[0_0_18px_var(--accent-glow)]"
        style={{ color }}
      >
        <path d="M30 10H46V22L54 30V70H22V30L30 22V10Z" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
        <path d="M30 15H46M22 42H54M22 56H54" stroke="currentColor" strokeWidth="3" opacity="0.9" />
        <rect x="28" y="44" width="18" height="12" rx="2" fill="currentColor" fillOpacity="0.45" stroke="currentColor" strokeWidth="2.5" />
      </motion.svg>

      {animateIcons && (
        <motion.svg
          width={size * 0.6}
          height={size * 0.8}
          viewBox="0 0 40 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute top-8 -right-4 pointer-events-none filter drop-shadow-[0_0_12px_var(--accent-glow)]"
          style={{ color }}
        >
          <motion.path
            d="M10 0 C10 15, 22 30, 22 60"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            animate={{ strokeDashoffset: [40, 0] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
            strokeDasharray="20 10"
          />
        </motion.svg>
      )}
    </div>
  );
}

function AnimatedOverflowingBeer({ size = 72, color = "var(--accent-color)", animateIcons = true }) {
  return (
    <div className="relative flex flex-col items-center">
      {animateIcons && (
        <motion.div
          animate={{ y: [-2, -18], opacity: [1, 0], scale: [0.6, 1.2] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
          className="absolute -top-4 text-xs select-none pointer-events-none filter drop-shadow-[0_0_8px_var(--accent-color)]"
        >
          🫧✨
        </motion.div>
      )}

      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        animate={animateIcons ? { scale: [1, 1.07, 1], y: [0, -4, 0] } : false}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        className="filter drop-shadow-[0_0_18px_var(--accent-glow)]"
        style={{ color }}
      >
        <path d="M20 24V72H56V24H20Z" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
        <path d="M56 32H66C70 32 72 35 72 39V55C72 59 70 62 66 62H56" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        <path d="M22 36H54V70H22V36Z" fill="currentColor" fillOpacity="0.4" />
        <motion.path
          d="M16 24C16 18 22 14 28 17C31 11 40 11 44 15C50 11 58 15 60 24H16Z"
          fill="currentColor"
          fillOpacity="0.85"
          stroke="currentColor"
          strokeWidth="3.5"
          animate={animateIcons ? { y: [-1, 3, -1] } : false}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.svg>
    </div>
  );
}

function AnimatedFlamingShot({ size = 68, color = "var(--accent-color)", animateIcons = true }) {
  return (
    <div className="relative flex flex-col items-center justify-center">
      <motion.svg
        width={size * 0.6}
        height={size * 0.6}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        animate={animateIcons ? { scale: [0.85, 1.35, 0.9], y: [0, -5, 0] } : false}
        transition={{ duration: 0.75, repeat: Infinity, ease: "easeInOut" }}
        className="filter drop-shadow-[0_0_16px_var(--accent-color)]"
        style={{ color }}
      >
        <path d="M20 4C20 4 28 12 28 22C28 27.5 24.4 32 20 32C15.6 32 12 27.5 12 22C12 16 16 12 20 4Z" fill="currentColor" stroke="currentColor" strokeWidth="2" />
      </motion.svg>

      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="filter drop-shadow-[0_0_16px_var(--accent-glow)] -mt-2"
        style={{ color }}
      >
        <path d="M16 12L22 56H42L48 12H16Z" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
        <path d="M19 26H45" stroke="currentColor" strokeWidth="3" opacity="0.9" />
        <path d="M22 26L42 26V52H22V26Z" fill="currentColor" fillOpacity="0.4" />
      </motion.svg>
    </div>
  );
}

function AnimatedCocktailShaker({ size = 70, color = "var(--accent-color)", animateIcons = true }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      animate={animateIcons ? { rotate: [-15, 15, -15], scale: [0.96, 1.05, 0.96] } : false}
      transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      className="filter drop-shadow-[0_0_16px_var(--accent-glow)]"
      style={{ color }}
    >
      <path d="M14 18L40 48L66 18H14Z" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
      <path d="M40 48V72M26 72H54" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <circle cx="50" cy="28" r="5.5" fill="currentColor" />
      <path d="M26 32L54 32" stroke="currentColor" strokeWidth="3" opacity="0.9" />
    </motion.svg>
  );
}

function AnimatedPoppingChampagne({ size = 74, color = "var(--accent-color)", animateIcons = true }) {
  return (
    <div className="relative flex flex-col items-center justify-center">
      {animateIcons && (
        <motion.div
          animate={{ y: [-2, -26], opacity: [1, 0], scale: [0.7, 1.5] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
          className="absolute -top-7 text-2xl filter drop-shadow-[0_0_14px_var(--accent-color)] select-none pointer-events-none"
        >
          ✨🍾
        </motion.div>
      )}

      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        animate={animateIcons ? { y: [0, -5, 0] } : false}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        className="filter drop-shadow-[0_0_16px_var(--accent-glow)]"
        style={{ color }}
      >
        <path d="M34 6H46V20L58 32V74H22V32L34 20V6Z" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
        <path d="M34 12H46M28 42H52" stroke="currentColor" strokeWidth="3" opacity="0.9" />
        <rect x="30" y="44" width="20" height="14" rx="2" fill="currentColor" fillOpacity="0.45" stroke="currentColor" strokeWidth="2.5" />
      </motion.svg>
    </div>
  );
}

/* ==========================================================================
   2. MODO FIESTA (PARTY) SPECTACULAR MICRO-ANIMATED VECTOR LOGOS
   ========================================================================== */

function AnimatedDjConsole({ size = 82, color = "var(--accent-color)", animateIcons = true }) {
  return (
    <motion.div
      animate={animateIcons ? { y: [0, -6, 0], scale: [0.97, 1.04, 0.97] } : false}
      transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      className="filter drop-shadow-[0_0_22px_var(--accent-glow)] flex flex-col items-center"
      style={{ color }}
    >
      <svg width={size} height={size * 0.8} viewBox="0 0 90 70" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="5" y="20" width="80" height="45" rx="6" stroke="currentColor" strokeWidth="4.5" fill="currentColor" fillOpacity="0.25" />
        <motion.circle
          cx="26"
          cy="42"
          r="14"
          stroke="currentColor"
          strokeWidth="3.5"
          animate={animateIcons ? { rotate: 360 } : false}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
        />
        <circle cx="26" cy="42" r="4.5" fill="currentColor" />
        <motion.circle
          cx="64"
          cy="42"
          r="14"
          stroke="currentColor"
          strokeWidth="3.5"
          animate={animateIcons ? { rotate: -360 } : false}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
        />
        <circle cx="64" cy="42" r="4.5" fill="currentColor" />
        <motion.rect x="41" y="28" width="3" height="12" fill="currentColor" animate={animateIcons ? { scaleY: [0.3, 1, 0.2] } : false} transition={{ duration: 0.5, repeat: Infinity }} />
        <motion.rect x="45" y="28" width="3" height="12" fill="currentColor" animate={animateIcons ? { scaleY: [0.9, 0.2, 1] } : false} transition={{ duration: 0.4, repeat: Infinity }} />
        <motion.rect x="49" y="28" width="3" height="12" fill="currentColor" animate={animateIcons ? { scaleY: [0.2, 0.8, 0.4] } : false} transition={{ duration: 0.6, repeat: Infinity }} />
        <motion.path
          d="M22 18C22 6 68 6 68 18"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          animate={animateIcons ? { y: [0, -2, 0] } : false}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
      </svg>
    </motion.div>
  );
}

function AnimatedPartyHat({ size = 76, color = "var(--accent-color)", animateIcons = true }) {
  return (
    <div className="relative flex flex-col items-center">
      {animateIcons && (
        <motion.div
          animate={{ y: [-2, -20], opacity: [1, 0], scale: [0.7, 1.4] }}
          transition={{ duration: 1.3, repeat: Infinity }}
          className="absolute -top-6 text-xl filter drop-shadow-[0_0_10px_white] select-none pointer-events-none"
        >
          ✨🪅
        </motion.div>
      )}

      <motion.svg
        width={size}
        height={size * 1.1}
        viewBox="0 0 70 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        animate={animateIcons ? { rotate: [-10, 10, -10], y: [0, -6, 0] } : false}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        className="filter drop-shadow-[0_0_20px_var(--accent-glow)]"
        style={{ color }}
      >
        <circle cx="35" cy="10" r="6" fill="currentColor" opacity="0.95" />
        <path d="M35 14L10 70H60L35 14Z" stroke="currentColor" strokeWidth="4.5" fill="currentColor" fillOpacity="0.3" strokeLinejoin="round" />
        <path d="M25 38L35 44L45 38" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18 56L35 62L52 56" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="35" cy="28" r="3.5" fill="currentColor" />
        <circle cx="26" cy="50" r="3.5" fill="currentColor" />
        <circle cx="44" cy="50" r="3.5" fill="currentColor" />
      </motion.svg>
    </div>
  );
}

function AnimatedPartyWhistle({ size = 78, color = "var(--accent-color)", animateIcons = true }) {
  return (
    <div className="relative flex items-center justify-center">
      {animateIcons && (
        <motion.div
          animate={{ x: [0, 15, 0], scale: [0.8, 1.3, 0.8], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.2, repeat: Infinity }}
          className="absolute -right-4 -top-2 text-base filter drop-shadow-[0_0_10px_var(--accent-color)] select-none pointer-events-none"
        >
          🎉⭐
        </motion.div>
      )}

      <motion.svg
        width={size * 1.1}
        height={size * 0.8}
        viewBox="0 0 85 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        animate={animateIcons ? { scaleX: [1, 1.2, 1], rotate: [-4, 4, -4] } : false}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        className="filter drop-shadow-[0_0_20px_var(--accent-glow)]"
        style={{ color }}
      >
        <rect x="6" y="24" width="22" height="16" rx="4" stroke="currentColor" strokeWidth="4" fill="currentColor" fillOpacity="0.4" />
        <line x1="6" y1="32" x2="28" y2="32" stroke="currentColor" strokeWidth="3" />
        <path d="M28 32C45 32 55 18 65 24C75 30 75 46 65 48C55 50 48 38 56 32" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" fill="currentColor" fillOpacity="0.25" />
      </motion.svg>
    </div>
  );
}

function AnimatedDiscoBall({ size = 80, color = "var(--accent-color)", animateIcons = true }) {
  return (
    <div className="relative flex items-center justify-center">
      <motion.div
        animate={animateIcons ? { rotate: 360 } : false}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="filter drop-shadow-[0_0_24px_var(--accent-glow)]"
        style={{ color }}
      >
        <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="40" y1="0" x2="40" y2="12" stroke="currentColor" strokeWidth="4" />
          <circle cx="40" cy="14" r="3.5" fill="currentColor" />
          <circle cx="40" cy="46" r="30" stroke="currentColor" strokeWidth="4.5" fill="currentColor" fillOpacity="0.2" />
          <ellipse cx="40" cy="46" rx="30" ry="12" stroke="currentColor" strokeWidth="2.8" strokeDasharray="5 3" />
          <ellipse cx="40" cy="46" rx="30" ry="22" stroke="currentColor" strokeWidth="2.2" strokeDasharray="5 3" />
          <line x1="40" y1="16" x2="40" y2="76" stroke="currentColor" strokeWidth="2.8" strokeDasharray="5 3" />
          <line x1="20" y1="24" x2="20" y2="68" stroke="currentColor" strokeWidth="2.2" strokeDasharray="5 3" />
          <line x1="60" y1="24" x2="60" y2="68" stroke="currentColor" strokeWidth="2.2" strokeDasharray="5 3" />
        </svg>
      </motion.div>

      {animateIcons && (
        <motion.span
          animate={{ scale: [0.8, 1.5, 0.8], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.4, repeat: Infinity }}
          className="absolute -top-4 -right-3 text-xl filter drop-shadow-[0_0_14px_white] select-none pointer-events-none"
        >
          ✨🪩
        </motion.span>
      )}
    </div>
  );
}

function AnimatedPartySpeaker({ size = 78, color = "var(--accent-color)", animateIcons = true }) {
  return (
    <div className="relative flex items-center justify-center">
      <motion.svg
        width={size}
        height={size * 1.1}
        viewBox="0 0 70 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        animate={animateIcons ? { scale: [0.94, 1.12, 0.94] } : false}
        transition={{ duration: 0.75, repeat: Infinity, ease: "easeInOut" }}
        className="filter drop-shadow-[0_0_22px_var(--accent-glow)]"
        style={{ color }}
      >
        <rect x="10" y="6" width="50" height="68" rx="6" stroke="currentColor" strokeWidth="4.5" fill="currentColor" fillOpacity="0.25" />
        <circle cx="35" cy="22" r="7.5" stroke="currentColor" strokeWidth="3.5" fill="currentColor" fillOpacity="0.5" />
        <motion.circle
          cx="35"
          cy="52"
          r="16"
          stroke="currentColor"
          strokeWidth="4"
          animate={animateIcons ? { r: [13, 19, 13] } : false}
          transition={{ duration: 0.75, repeat: Infinity }}
        />
        <circle cx="35" cy="52" r="6" fill="currentColor" />
        <line x1="16" y1="12" x2="54" y2="12" stroke="currentColor" strokeWidth="2.5" opacity="0.7" />
      </motion.svg>
    </div>
  );
}

function AnimatedStageSpotlight({ size = 78, color = "var(--accent-color)", animateIcons = true }) {
  return (
    <motion.div
      animate={animateIcons ? { rotate: [-18, 18, -18] } : false}
      transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      className="filter drop-shadow-[0_0_24px_var(--accent-glow)]"
      style={{ color }}
    >
      <svg width={size} height={size * 1.1} viewBox="0 0 70 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 6H48M35 6V16" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M20 16H50L58 40H12L20 16Z" stroke="currentColor" strokeWidth="4.5" fill="currentColor" fillOpacity="0.45" strokeLinejoin="round" />
        <circle cx="35" cy="40" r="14" fill="currentColor" fillOpacity="0.7" stroke="currentColor" strokeWidth="3" />
        <motion.path
          d="M14 40L2 78H68L56 40Z"
          fill="currentColor"
          fillOpacity="0.25"
          animate={animateIcons ? { opacity: [0.15, 0.6, 0.15] } : false}
          transition={{ duration: 1.4, repeat: Infinity }}
        />
      </svg>
    </motion.div>
  );
}

function AnimatedPartyMicrophone({ size = 74, color = "var(--accent-color)", animateIcons = true }) {
  return (
    <div className="relative flex flex-col items-center">
      {animateIcons && (
        <motion.span
          animate={{ y: [-2, -20], opacity: [1, 0], scale: [0.8, 1.4] }}
          transition={{ duration: 1.3, repeat: Infinity }}
          className="absolute -top-6 text-xl filter drop-shadow-[0_0_12px_var(--accent-color)] select-none pointer-events-none"
        >
          🎤🎶
        </motion.span>
      )}

      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 64 74"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        animate={animateIcons ? { rotate: [-8, 8, -8] } : false}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        className="filter drop-shadow-[0_0_20px_var(--accent-glow)]"
        style={{ color }}
      >
        <rect x="22" y="6" width="20" height="26" rx="10" stroke="currentColor" strokeWidth="4" fill="currentColor" fillOpacity="0.45" />
        <line x1="22" y1="19" x2="42" y2="19" stroke="currentColor" strokeWidth="3" />
        <path d="M16 22C16 38 48 38 48 22" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        <line x1="32" y1="36" x2="32" y2="62" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
        <line x1="20" y1="62" x2="44" y2="62" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
      </motion.svg>
    </div>
  );
}

/* ==========================================================================
   3. MODO NATURA (100% PURE NATURE SPECTACULAR MICRO-ANIMATED VECTOR LOGOS)
   ========================================================================== */

function AnimatedPalmTree({ size = 84, color = "var(--accent-color)", animateIcons = true }) {
  return (
    <motion.div
      animate={animateIcons ? { rotate: [-5, 5, -5] } : false}
      transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
      className="filter drop-shadow-[0_0_24px_var(--accent-glow)]"
      style={{ color }}
    >
      <svg width={size} height={size * 1.1} viewBox="0 0 80 90" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M40 85C38 60 46 40 40 25" stroke="currentColor" strokeWidth="5.5" strokeLinecap="round" />
        <path d="M38 70C36 55 44 42 38 28" stroke="currentColor" strokeWidth="3" opacity="0.6" />
        <circle cx="37" cy="24" r="4.5" fill="currentColor" />
        <circle cx="43" cy="24" r="4.5" fill="currentColor" />
        <path d="M40 25C25 15 10 18 4 30" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" fill="currentColor" fillOpacity="0.25" />
        <path d="M40 25C55 15 70 18 76 30" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" fill="currentColor" fillOpacity="0.25" />
        <path d="M40 25C30 10 20 4 32 0" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M40 25C50 10 60 4 48 0" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M40 25C22 28 12 40 18 52" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        <path d="M40 25C58 28 68 40 62 52" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      </svg>
    </motion.div>
  );
}

function AnimatedNeonRose({ size = 78, color = "var(--accent-color)", animateIcons = true }) {
  return (
    <div className="relative flex flex-col items-center">
      {animateIcons && (
        <motion.div
          animate={{ y: [0, 18], opacity: [1, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeIn" }}
          className="absolute -top-4 text-xs select-none pointer-events-none filter drop-shadow-[0_0_10px_var(--accent-color)]"
        >
          🌹🍃
        </motion.div>
      )}

      <motion.svg
        width={size}
        height={size * 1.1}
        viewBox="0 0 74 84"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        animate={animateIcons ? { scale: [0.94, 1.08, 0.94], rotate: [-4, 4, -4] } : false}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        className="filter drop-shadow-[0_0_22px_var(--accent-glow)]"
        style={{ color }}
      >
        <path d="M37 6C20 6 12 22 20 34C28 46 46 46 54 34C62 22 54 6 37 6Z" stroke="currentColor" strokeWidth="4.5" fill="currentColor" fillOpacity="0.35" />
        <path d="M37 14C28 14 24 22 28 28C32 34 42 34 46 28C50 22 46 14 37 14Z" stroke="currentColor" strokeWidth="3.5" fill="currentColor" fillOpacity="0.55" />
        <path d="M37 20C34 20 32 23 34 25C36 27 40 27 40 25C40 23 38 20 37 20Z" stroke="currentColor" strokeWidth="3" fill="currentColor" />
        <path d="M37 40V80" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M37 54C25 54 18 46 18 46C18 46 24 60 37 60" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="3.5" strokeLinejoin="round" />
        <path d="M37 64C49 64 56 56 56 56C56 56 50 70 37 70" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="3.5" strokeLinejoin="round" />
      </motion.svg>
    </div>
  );
}

function AnimatedJungleLeaves({ size = 78, color = "var(--accent-color)", animateIcons = true }) {
  return (
    <div className="relative flex flex-col items-center">
      {animateIcons && (
        <motion.svg
          width={size * 0.4}
          height={size * 0.4}
          viewBox="0 0 30 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          animate={{ y: [0, 20], opacity: [1, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeIn" }}
          className="absolute -top-4 filter drop-shadow-[0_0_10px_white]"
          style={{ color }}
        >
          <circle cx="15" cy="10" r="4.5" fill="currentColor" />
        </motion.svg>
      )}

      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 74 74"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        animate={animateIcons ? { scale: [0.96, 1.07, 0.96] } : false}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="filter drop-shadow-[0_0_22px_var(--accent-glow)]"
        style={{ color }}
      >
        <path
          d="M37 6C20 6 8 22 8 42C8 58 22 68 37 68C52 68 66 58 66 42C66 22 54 6 37 6Z"
          stroke="currentColor"
          strokeWidth="4.5"
          fill="currentColor"
          fillOpacity="0.3"
          strokeLinejoin="round"
        />
        <path d="M37 6V68" stroke="currentColor" strokeWidth="4" />
        <path d="M37 24L16 16M37 36L12 34M37 48L18 52" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M37 24L58 16M37 36L62 34M37 48L56 52" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
      </motion.svg>
    </div>
  );
}

function AnimatedExoticOrchid({ size = 78, color = "var(--accent-color)", animateIcons = true }) {
  return (
    <div className="relative flex items-center justify-center">
      {animateIcons && (
        <motion.span
          animate={{ scale: [0.8, 1.4, 0.8], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          className="absolute -top-3 -right-2 text-base filter drop-shadow-[0_0_10px_white] select-none pointer-events-none"
        >
          ✨🌺
        </motion.span>
      )}

      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 74 74"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        animate={animateIcons ? { scale: [0.94, 1.1, 0.94], rotate: [0, 6, -6, 0] } : false}
        transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
        className="filter drop-shadow-[0_0_22px_var(--accent-glow)]"
        style={{ color }}
      >
        <path d="M37 10C37 10 24 24 24 37C24 50 37 64 37 64C37 64 50 50 50 37C50 24 37 10 37 10Z" stroke="currentColor" strokeWidth="4" fill="currentColor" fillOpacity="0.35" />
        <path d="M10 37C10 37 24 24 37 24C50 24 64 37 64 37C64 37 50 50 37 50C24 50 10 37 10 37Z" stroke="currentColor" strokeWidth="4" fill="currentColor" fillOpacity="0.35" />
        <circle cx="37" cy="37" r="8.5" fill="currentColor" />
      </motion.svg>
    </div>
  );
}

function AnimatedWaterDrop({ size = 74, color = "var(--accent-color)", animateIcons = true }) {
  return (
    <motion.div
      animate={animateIcons ? { y: [0, -7, 0], scale: [0.95, 1.09, 0.95] } : false}
      transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      className="filter drop-shadow-[0_0_20px_var(--accent-glow)]"
      style={{ color }}
    >
      <svg width={size} height={size * 1.1} viewBox="0 0 64 74" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M32 6C32 6 10 36 10 50C10 62.1 19.8 72 32 72C44.2 72 54 62.1 54 50C54 36 32 6 32 6Z" stroke="currentColor" strokeWidth="4.5" fill="currentColor" fillOpacity="0.4" />
        <path d="M22 42C20 46 20 54 26 58" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" opacity="0.85" />
      </svg>
    </motion.div>
  );
}

/* ==========================================================================
   NATURA CUSTOM PNG MASKED & COLOR-ADAPTIVE ANIMATED COMPONENTS
   ========================================================================== */

function NaturaPngIcon1({ size = 105, color = "var(--accent-color)", animateIcons = true }) {
  return (
    <motion.div
      animate={animateIcons ? { y: [-4, 6, -4], rotate: [-4, 4, -4], scale: [0.96, 1.05, 0.96] } : false}
      transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
      className="relative flex items-center justify-center filter drop-shadow-[0_0_22px_var(--accent-glow)]"
      style={{ width: size, height: size }}
    >
      <div
        className="w-full h-full"
        style={{
          backgroundColor: color,
          WebkitMaskImage: `url("/natura/Gemini_Generated_Image_6hw5ke6hw5ke6hw5-Photoroom.png")`,
          maskImage: `url("/natura/Gemini_Generated_Image_6hw5ke6hw5ke6hw5-Photoroom.png")`,
          WebkitMaskSize: 'contain',
          maskSize: 'contain',
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center',
          maskPosition: 'center'
        }}
      />
    </motion.div>
  );
}

function NaturaPngIcon2({ size = 105, color = "var(--accent-color)", animateIcons = true }) {
  return (
    <motion.div
      animate={animateIcons ? { scale: [0.92, 1.1, 0.92], rotate: [0, 8, -8, 0] } : false}
      transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
      className="relative flex items-center justify-center filter drop-shadow-[0_0_22px_var(--accent-glow)]"
      style={{ width: size, height: size }}
    >
      <div
        className="w-full h-full"
        style={{
          backgroundColor: color,
          WebkitMaskImage: `url("/natura/Gemini_Generated_Image_buds92buds92buds-Photoroom.png")`,
          maskImage: `url("/natura/Gemini_Generated_Image_buds92buds92buds-Photoroom.png")`,
          WebkitMaskSize: 'contain',
          maskSize: 'contain',
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center',
          maskPosition: 'center'
        }}
      />
    </motion.div>
  );
}

function NaturaPngIcon3({ size = 105, color = "var(--accent-color)", animateIcons = true }) {
  return (
    <motion.div
      animate={animateIcons ? { y: [0, -8, 0], scale: [1, 1.08, 1] } : false}
      transition={{ duration: 2.9, repeat: Infinity, ease: "easeInOut" }}
      className="relative flex items-center justify-center filter drop-shadow-[0_0_22px_var(--accent-glow)]"
      style={{ width: size, height: size }}
    >
      <div
        className="w-full h-full"
        style={{
          backgroundColor: color,
          WebkitMaskImage: `url("/natura/Gemini_Generated_Image_lfh85wlfh85wlfh8-Photoroom.png")`,
          maskImage: `url("/natura/Gemini_Generated_Image_lfh85wlfh85wlfh8-Photoroom.png")`,
          WebkitMaskSize: 'contain',
          maskSize: 'contain',
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center',
          maskPosition: 'center'
        }}
      />
    </motion.div>
  );
}

function NaturaPngIcon4({ size = 105, color = "var(--accent-color)", animateIcons = true }) {
  return (
    <motion.div
      animate={animateIcons ? { rotate: [-6, 6, -6], scale: [0.94, 1.06, 0.94] } : false}
      transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
      className="relative flex items-center justify-center filter drop-shadow-[0_0_22px_var(--accent-glow)]"
      style={{ width: size, height: size }}
    >
      <div
        className="w-full h-full"
        style={{
          backgroundColor: color,
          WebkitMaskImage: `url("/natura/Gemini_Generated_Image_lv2orglv2orglv2o-Photoroom-Photoroom.png")`,
          maskImage: `url("/natura/Gemini_Generated_Image_lv2orglv2orglv2o-Photoroom-Photoroom.png")`,
          WebkitMaskSize: 'contain',
          maskSize: 'contain',
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center',
          maskPosition: 'center'
        }}
      />
    </motion.div>
  );
}

function NaturaPngIcon5({ size = 105, color = "var(--accent-color)", animateIcons = true }) {
  return (
    <motion.div
      animate={animateIcons ? { y: [-5, 5, -5], scale: [0.95, 1.08, 0.95], rotate: [-3, 3, -3] } : false}
      transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      className="relative flex items-center justify-center filter drop-shadow-[0_0_22px_var(--accent-glow)]"
      style={{ width: size, height: size }}
    >
      <div
        className="w-full h-full"
        style={{
          backgroundColor: color,
          WebkitMaskImage: `url("/natura/Gemini_Generated_Image_3jkhy83jkhy83jkh-Photoroom.png")`,
          maskImage: `url("/natura/Gemini_Generated_Image_3jkhy83jkhy83jkh-Photoroom.png")`,
          WebkitMaskSize: 'contain',
          maskSize: 'contain',
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center',
          maskPosition: 'center'
        }}
      />
    </motion.div>
  );
}

/* ==========================================================================
   ULTRA-DENSELY PACKED SCENE POSITIONS STARTING FROM TOP 100PX & 180PX
   ON THE FAR OUTER LATERAL GUTTERS (left 0.3% - 1.5% and right 0.3% - 1.5%)
   OUTSIDE THE CARDS, FILTERS AND HEADER!
   ========================================================================== */

const DRINKS_SCENE_ITEMS = [
  // TOP GUTTER LATERAL ICONS (Outside the video header & category bar)
  { Comp: AnimatedPouringBottle, top: '100px', left: '0.4%', size: 72, speed: 0.12 },
  { Comp: AnimatedOverflowingBeer, top: '100px', right: '0.4%', size: 72, speed: 0.09 },
  { Comp: AnimatedPoppingChampagne, top: '220px', left: '1.2%', size: 74, speed: 0.11 },
  { Comp: AnimatedFlamingShot, top: '220px', right: '1.2%', size: 68, speed: 0.14 },
  { Comp: AnimatedCocktailShaker, top: '340px', left: '0.4%', size: 70, speed: 0.08 },
  { Comp: AnimatedPouringBottle, top: '340px', right: '0.4%', size: 72, speed: 0.13 },
  { Comp: AnimatedOverflowingBeer, top: '460px', left: '1.5%', size: 72, speed: 0.10 },
  { Comp: AnimatedPoppingChampagne, top: '460px', right: '1.5%', size: 74, speed: 0.09 },

  // MAIN BODY GUTTER LATERAL ICONS (Outside the dish cards and sidebar filters)
  { Comp: AnimatedFlamingShot, top: '580px', left: '0.4%', size: 68, speed: 0.14 },
  { Comp: AnimatedCocktailShaker, top: '580px', right: '0.4%', size: 70, speed: 0.08 },
  { Comp: AnimatedPoppingChampagne, top: '700px', left: '1.2%', size: 74, speed: 0.11 },
  { Comp: AnimatedPouringBottle, top: '700px', right: '1.2%', size: 72, speed: 0.13 },
  { Comp: AnimatedOverflowingBeer, top: '820px', left: '0.4%', size: 72, speed: 0.10 },
  { Comp: AnimatedCocktailShaker, top: '820px', right: '0.4%', size: 70, speed: 0.12 },
  { Comp: AnimatedFlamingShot, top: '940px', left: '1.5%', size: 68, speed: 0.11 },
  { Comp: AnimatedPoppingChampagne, top: '940px', right: '1.5%', size: 74, speed: 0.09 },
  { Comp: AnimatedPouringBottle, top: '1060px', left: '0.4%', size: 72, speed: 0.12 },
  { Comp: AnimatedOverflowingBeer, top: '1060px', right: '0.4%', size: 72, speed: 0.10 },
  { Comp: AnimatedCocktailShaker, top: '1180px', left: '1.2%', size: 70, speed: 0.14 },
  { Comp: AnimatedFlamingShot, top: '1180px', right: '1.2%', size: 68, speed: 0.11 },
  { Comp: AnimatedPoppingChampagne, top: '1300px', left: '0.4%', size: 74, speed: 0.13 },
  { Comp: AnimatedPouringBottle, top: '1300px', right: '0.4%', size: 72, speed: 0.09 },
  { Comp: AnimatedOverflowingBeer, top: '1420px', left: '1.5%', size: 72, speed: 0.12 },
  { Comp: AnimatedCocktailShaker, top: '1420px', right: '1.5%', size: 70, speed: 0.10 },
  { Comp: AnimatedFlamingShot, top: '1540px', left: '0.4%', size: 68, speed: 0.11 },
  { Comp: AnimatedPoppingChampagne, top: '1540px', right: '0.4%', size: 74, speed: 0.09 },
  { Comp: AnimatedPouringBottle, top: '1660px', left: '1.2%', size: 72, speed: 0.13 },
  { Comp: AnimatedOverflowingBeer, top: '1660px', right: '1.2%', size: 72, speed: 0.08 },
  { Comp: AnimatedCocktailShaker, top: '1780px', left: '0.4%', size: 70, speed: 0.12 },
  { Comp: AnimatedFlamingShot, top: '1780px', right: '0.4%', size: 68, speed: 0.10 },
  { Comp: AnimatedPoppingChampagne, top: '1900px', left: '1.5%', size: 74, speed: 0.11 },
  { Comp: AnimatedPouringBottle, top: '1900px', right: '1.5%', size: 72, speed: 0.14 }
];

const PARTY_SCENE_ITEMS = [
  // TOP GUTTER LATERAL ICONS
  { Comp: AnimatedDjConsole, top: '100px', left: '0.4%', size: 82, speed: 0.11 },
  { Comp: AnimatedDiscoBall, top: '100px', right: '0.4%', size: 80, speed: 0.08 },
  { Comp: AnimatedPartyHat, top: '220px', left: '1.2%', size: 76, speed: 0.13 },
  { Comp: AnimatedPartyWhistle, top: '220px', right: '1.2%', size: 78, speed: 0.10 },
  { Comp: AnimatedPartySpeaker, top: '340px', left: '0.4%', size: 78, speed: 0.12 },
  { Comp: AnimatedStageSpotlight, top: '340px', right: '0.4%', size: 78, speed: 0.09 },
  { Comp: AnimatedPartyMicrophone, top: '460px', left: '1.5%', size: 74, speed: 0.11 },
  { Comp: AnimatedDjConsole, top: '460px', right: '1.5%', size: 82, speed: 0.10 },

  // MAIN BODY GUTTER LATERAL ICONS
  { Comp: AnimatedDiscoBall, top: '580px', left: '0.4%', size: 80, speed: 0.13 },
  { Comp: AnimatedPartyHat, top: '580px', right: '0.4%', size: 76, speed: 0.08 },
  { Comp: AnimatedPartyWhistle, top: '700px', left: '1.2%', size: 78, speed: 0.12 },
  { Comp: AnimatedPartySpeaker, top: '700px', right: '1.2%', size: 78, speed: 0.09 },
  { Comp: AnimatedStageSpotlight, top: '820px', left: '0.4%', size: 78, speed: 0.14 },
  { Comp: AnimatedPartyMicrophone, top: '820px', right: '0.4%', size: 74, speed: 0.10 },
  { Comp: AnimatedDjConsole, top: '940px', left: '1.5%', size: 82, speed: 0.11 },
  { Comp: AnimatedDiscoBall, top: '940px', right: '1.5%', size: 80, speed: 0.09 },
  { Comp: AnimatedPartyHat, top: '1060px', left: '0.4%', size: 76, speed: 0.12 },
  { Comp: AnimatedPartyWhistle, top: '1060px', right: '0.4%', size: 78, speed: 0.10 },
  { Comp: AnimatedPartySpeaker, top: '1180px', left: '1.2%', size: 78, speed: 0.13 },
  { Comp: AnimatedStageSpotlight, top: '1180px', right: '1.2%', size: 78, speed: 0.09 },
  { Comp: AnimatedPartyMicrophone, top: '1300px', left: '0.4%', size: 74, speed: 0.11 },
  { Comp: AnimatedDjConsole, top: '1300px', right: '0.4%', size: 82, speed: 0.08 },
  { Comp: AnimatedDiscoBall, top: '1420px', left: '1.5%', size: 80, speed: 0.12 },
  { Comp: AnimatedPartyHat, top: '1420px', right: '1.5%', size: 76, speed: 0.10 },
  { Comp: AnimatedPartyWhistle, top: '1540px', left: '0.4%', size: 78, speed: 0.13 },
  { Comp: AnimatedPartySpeaker, top: '1540px', right: '0.4%', size: 78, speed: 0.09 },
  { Comp: AnimatedStageSpotlight, top: '1660px', left: '1.2%', size: 78, speed: 0.14 },
  { Comp: AnimatedPartyMicrophone, top: '1660px', right: '1.2%', size: 74, speed: 0.10 },
  { Comp: AnimatedDjConsole, top: '1780px', left: '0.4%', size: 82, speed: 0.11 },
  { Comp: AnimatedDiscoBall, top: '1780px', right: '0.4%', size: 80, speed: 0.08 },
  { Comp: AnimatedPartyHat, top: '1900px', left: '1.5%', size: 76, speed: 0.12 },
  { Comp: AnimatedPartyWhistle, top: '1900px', right: '1.5%', size: 78, speed: 0.10 }
];

const NATURA_SCENE_ITEMS = [
  // TOP GUTTER LATERAL ICONS (Exclusively User Natura PNG Icons 1..5)
  { Comp: NaturaPngIcon1, top: '100px', left: '0.4%', size: 110, speed: 0.12 },
  { Comp: NaturaPngIcon2, top: '100px', right: '0.4%', size: 106, speed: 0.09 },
  { Comp: NaturaPngIcon5, top: '220px', left: '1.2%', size: 108, speed: 0.13 },
  { Comp: NaturaPngIcon3, top: '220px', right: '1.2%', size: 108, speed: 0.10 },
  { Comp: NaturaPngIcon4, top: '340px', left: '0.4%', size: 106, speed: 0.11 },
  { Comp: NaturaPngIcon1, top: '340px', right: '0.4%', size: 110, speed: 0.12 },
  { Comp: NaturaPngIcon2, top: '460px', left: '1.5%', size: 106, speed: 0.10 },
  { Comp: NaturaPngIcon5, top: '460px', right: '1.5%', size: 108, speed: 0.13 },

  // MAIN BODY GUTTER LATERAL ICONS (Exclusively User Natura PNG Icons 1..5)
  { Comp: NaturaPngIcon3, top: '580px', left: '0.4%', size: 108, speed: 0.11 },
  { Comp: NaturaPngIcon4, top: '580px', right: '0.4%', size: 106, speed: 0.09 },
  { Comp: NaturaPngIcon1, top: '700px', left: '1.2%', size: 110, speed: 0.12 },
  { Comp: NaturaPngIcon2, top: '700px', right: '1.2%', size: 106, speed: 0.10 },
  { Comp: NaturaPngIcon5, top: '820px', left: '0.4%', size: 108, speed: 0.14 },
  { Comp: NaturaPngIcon3, top: '820px', right: '0.4%', size: 108, speed: 0.11 },
  { Comp: NaturaPngIcon4, top: '940px', left: '1.5%', size: 106, speed: 0.12 },
  { Comp: NaturaPngIcon1, top: '940px', right: '1.5%', size: 110, speed: 0.09 },
  { Comp: NaturaPngIcon2, top: '1060px', left: '0.4%', size: 106, speed: 0.13 },
  { Comp: NaturaPngIcon5, top: '1060px', right: '0.4%', size: 108, speed: 0.10 },
  { Comp: NaturaPngIcon3, top: '1180px', left: '1.2%', size: 108, speed: 0.11 },
  { Comp: NaturaPngIcon4, top: '1180px', right: '1.2%', size: 106, speed: 0.09 },
  { Comp: NaturaPngIcon1, top: '1300px', left: '0.4%', size: 110, speed: 0.12 },
  { Comp: NaturaPngIcon2, top: '1300px', right: '0.4%', size: 106, speed: 0.08 },
  { Comp: NaturaPngIcon5, top: '1420px', left: '1.5%', size: 108, speed: 0.13 },
  { Comp: NaturaPngIcon3, top: '1420px', right: '1.5%', size: 108, speed: 0.10 },
  { Comp: NaturaPngIcon4, top: '1540px', left: '0.4%', size: 106, speed: 0.11 },
  { Comp: NaturaPngIcon1, top: '1540px', right: '0.4%', size: 110, speed: 0.14 },
  { Comp: NaturaPngIcon2, top: '1660px', left: '1.2%', size: 106, speed: 0.10 },
  { Comp: NaturaPngIcon5, top: '1660px', right: '1.2%', size: 108, speed: 0.12 },
  { Comp: NaturaPngIcon3, top: '1780px', left: '0.4%', size: 108, speed: 0.11 },
  { Comp: NaturaPngIcon4, top: '1780px', right: '0.4%', size: 106, speed: 0.09 },
  { Comp: NaturaPngIcon1, top: '1900px', left: '1.5%', size: 110, speed: 0.13 },
  { Comp: NaturaPngIcon2, top: '1900px', right: '1.5%', size: 106, speed: 0.08 }
];

const MODE_LABELS = {
  'drinks': '🍾 MODO LICORES',
  'bar-show': '🪩 MODO FIESTA',
  'party': '🪩 MODO FIESTA',
  'cobra': '🌿 MODO NATURA',
  'natura': '🌿 MODO NATURA'
};

export default function FloatingFoodBackground({
  animateIcons = true,
  scene = 'drinks',
  isMuted = true
}) {
  const { scrollY } = useScroll();
  const serpientesVideoRef = React.useRef(null);

  const isSerpientesMode = scene === 'serpientes' || scene === 'disco';

  React.useEffect(() => {
    if (serpientesVideoRef.current && isSerpientesMode) {
      serpientesVideoRef.current.muted = isMuted;
      serpientesVideoRef.current.load();
      serpientesVideoRef.current.play().catch(() => {
        if (serpientesVideoRef.current) {
          serpientesVideoRef.current.muted = true;
          serpientesVideoRef.current.play().catch(() => {});
        }
      });
    }
  }, [isMuted, scene, isSerpientesMode]);

  // MODO SERPIENTES: Video inmersivo a pantalla completa sin íconos flotantes
  if (isSerpientesMode) {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none bg-black">
        {/* Full-Screen Immersive Serpientes Video Layer */}
        <video
          ref={serpientesVideoRef}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          preload="auto"
          src="/menu-assets/fondo serpientes.mp4"
          key="serpientes-video-bg"
          className="fixed inset-0 w-full h-full object-cover opacity-90 z-0"
        >
          <source src="/menu-assets/fondo serpientes.mp4" type="video/mp4" />
          <source src="/menu-assets/fondo-serpientes.mp4" type="video/mp4" />
        </video>

        {/* Ambient Dark Obsidian Gradient Vignette for optimal menu readability */}
        <div className="fixed inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/50 pointer-events-none z-10" />
      </div>
    );
  }

  let activeItems = DRINKS_SCENE_ITEMS;
  if (scene === 'bar-show' || scene === 'party') {
    activeItems = PARTY_SCENE_ITEMS;
  } else if (scene === 'cobra' || scene === 'natura') {
    activeItems = NATURA_SCENE_ITEMS;
  }

  const activeLabel = MODE_LABELS[scene] || MODE_LABELS.drinks;

  return (
    <MotionConfig reducedMotion={animateIcons ? "never" : "always"}>
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-10 select-none">
        
        {/* Active Floating Mode Pill Badge on Side Gutter */}
        <div
          className="fixed top-24 right-4 z-30 pointer-events-none hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/90 border border-[var(--accent-color)] text-[var(--accent-color)] text-[11px] font-black tracking-wider uppercase shadow-[0_0_18px_var(--accent-glow)] backdrop-blur-md"
        >
          <span>{activeLabel}</span>
        </div>

        {/* Ambient Laser Spotlights in Theme Color */}
        <div className="absolute top-1/4 left-1/4 w-[650px] h-[650px] rounded-full bg-[var(--accent-color)]/22 blur-[160px] pointer-events-none" />
        <div className="absolute bottom-1/3 right-10 w-[600px] h-[600px] rounded-full bg-[var(--accent-glow)]/25 blur-[160px] pointer-events-none" />

        {/* Densely Packed Scene Elements along far outer screen edges */}
        {activeItems.map((item, idx) => {
          const yTranslate = useTransform(scrollY, [0, 3000], [0, item.speed * 250]);

          const positionStyles = {
            position: 'absolute',
            top: item.top,
            ...(item.left ? { left: item.left } : {}),
            ...(item.right ? { right: item.right } : {})
          };

          const ItemComponent = item.Comp;

          return (
            <motion.div
              key={`${scene}-${idx}`}
              initial={false}
              animate={false}
              style={{
                ...positionStyles,
                y: animateIcons ? yTranslate : 0
              }}
              className="pointer-events-none filter drop-shadow-[0_0_15px_var(--accent-glow)]"
            >
              <ItemComponent size={item.size} animateIcons={animateIcons} />
            </motion.div>
          );
        })}
      </div>
    </MotionConfig>
  );
}
