import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Check, ChevronDown } from 'lucide-react';
import { ADMIN_COLOR_THEMES, adminStore } from '../../services/adminStore';

export default function AdminColorThemePicker({ currentThemeId, onThemeChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const activeTheme = ADMIN_COLOR_THEMES.find((th) => th.id === currentThemeId) || ADMIN_COLOR_THEMES[0];

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleSelect = (themeId) => {
    adminStore.setAdminTheme(themeId);
    if (onThemeChange) {
      onThemeChange(themeId);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative inline-flex items-center" ref={containerRef}>
      {/* Circle Only Button Beside the Clock */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full border border-white/40 hover:border-white/90 hover:scale-115 transition-transform duration-200 cursor-pointer shadow-md shrink-0"
        style={{
          backgroundColor: activeTheme.color,
          boxShadow: `0 0 10px ${activeTheme.glow}`
        }}
        title={`Color de acento activo: ${activeTheme.label}`}
      />

      {/* Popover Swatches Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute left-1/2 -translate-x-1/2 sm:left-auto sm:right-0 sm:translate-x-0 mt-2 z-50 w-52 p-3 rounded-2xl bg-[#11131c] border border-[#272b3b] shadow-2xl space-y-2.5 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-1.5 px-0.5">
              <span className="text-[10px] font-black uppercase text-gray-300 tracking-wider">
                Color de Acento
              </span>
              <span className="text-[9px] font-mono text-gray-500 font-bold">12 Colores</span>
            </div>

            {/* Grid of 12 Swatches */}
            <div className="grid grid-cols-4 gap-2">
              {ADMIN_COLOR_THEMES.map((th) => {
                const isSelected = th.id === activeTheme.id;
                return (
                  <button
                    key={th.id}
                    type="button"
                    onClick={() => handleSelect(th.id)}
                    className={`group relative flex flex-col items-center justify-center p-1.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white/15 border-white shadow-md'
                        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/30'
                    }`}
                    title={th.label}
                  >
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 shadow"
                      style={{
                        backgroundColor: th.color,
                        boxShadow: isSelected ? `0 0 12px ${th.glow}` : 'none'
                      }}
                    >
                      {isSelected && <Check size={11} strokeWidth={3} className="text-black" />}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
