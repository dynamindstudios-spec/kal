import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UI_TEXT } from '../data/menuData';

export default function CategoryFilter({
  activeCategory,
  setActiveCategory,
  currentLang
}) {
  const isConfiteria = activeCategory === 'confiteria' || activeCategory === 'snacks';
  const isAll = activeCategory === 'all';
  
  const [mainTab, setMainTab] = useState(
    isAll ? 'all' : isConfiteria ? 'confiteria' : 'bebidas'
  );

  const t = UI_TEXT[currentLang] || UI_TEXT.es;

  const drinkSubcategories = [
    { id: 'all-drinks', label: '🍹 Todas las Bebidas' },
    { id: 'licores', label: '🍾 Licores & Botellas' },
    { id: 'cocteles', label: '🍸 Cócteles & Autor' },
    { id: 'cervezas', label: '🍺 Cervezas & Frías' },
    { id: 'mezcladores', label: '🥤 Mezcladores & Refrescos' },
    { id: 'build-your-own', label: '🪣 Arma tu Balde VIP' }
  ];

  const handleSelectMainTab = (tabKey) => {
    setMainTab(tabKey);
    if (tabKey === 'all') {
      setActiveCategory('all');
    } else if (tabKey === 'confiteria') {
      setActiveCategory('snacks');
    } else {
      setActiveCategory('all-drinks');
    }
  };

  return (
    <div id="spotlight-step-categories" className="w-full mb-5 p-2.5 sm:p-3.5 rounded-3xl bg-black/90 border border-[var(--surface-border)] shadow-2xl backdrop-blur-2xl text-[var(--text-primary)] space-y-2.5">
      
      {/* 1. TOP PRIMARY CATEGORY BUTTONS: TODAS (SIN FILTROS), CONFITERÍA & BEBIDAS */}
      <div className="grid grid-cols-3 gap-1.5 sm:gap-2 p-1 rounded-full bg-white/5 border border-white/10">
        
        {/* TODAS (SIN FILTROS) BUTTON */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => handleSelectMainTab('all')}
          className={`py-2 px-2 sm:px-4 rounded-full text-xs font-bold sm:font-black tracking-wide uppercase transition-all flex items-center justify-center gap-1 cursor-pointer border ${
            mainTab === 'all'
              ? 'bg-[var(--pill-active)] text-white border-[var(--pill-active-border)] shadow-[0_0_18px_var(--accent-glow)] scale-[1.01]'
              : 'bg-transparent text-gray-300 border-transparent hover:bg-white/10 hover:text-white'
          }`}
          title="Ver toda la carta sin filtros"
        >
          <span className="text-sm sm:text-base">✨</span>
          <span className="text-[10px] sm:text-xs">Todas</span>
        </motion.button>

        {/* CONFITERÍA & SNACKS BUTTON */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => handleSelectMainTab('confiteria')}
          className={`py-2 px-2 sm:px-4 rounded-full text-xs font-bold sm:font-black tracking-wide uppercase transition-all flex items-center justify-center gap-1 cursor-pointer border ${
            mainTab === 'confiteria'
              ? 'bg-[var(--pill-active)] text-white border-[var(--pill-active-border)] shadow-[0_0_18px_var(--accent-glow)] scale-[1.01]'
              : 'bg-transparent text-gray-300 border-transparent hover:bg-white/10 hover:text-white'
          }`}
          title="Ver confitería y snacks"
        >
          <span className="text-sm sm:text-base">🍬</span>
          <span className="text-[10px] sm:text-xs">Confitería</span>
        </motion.button>

        {/* BEBIDAS & LICORES BUTTON */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => handleSelectMainTab('bebidas')}
          className={`py-2 px-2 sm:px-4 rounded-full text-xs font-bold sm:font-black tracking-wide uppercase transition-all flex items-center justify-center gap-1 cursor-pointer border ${
            mainTab === 'bebidas'
              ? 'bg-[var(--pill-active)] text-white border-[var(--pill-active-border)] shadow-[0_0_18px_var(--accent-glow)] scale-[1.01]'
              : 'bg-transparent text-gray-300 border-transparent hover:bg-white/10 hover:text-white'
          }`}
          title="Ver bebidas y licores"
        >
          <span className="text-sm sm:text-base">🍾</span>
          <span className="text-[10px] sm:text-xs">Bebidas</span>
        </motion.button>

      </div>

      {/* 2. SUBCATEGORIES DISPLAYED TOGETHER WHEN BEBIDAS IS SELECTED */}
      <AnimatePresence mode="wait">
        {mainTab === 'bebidas' && (
          <motion.div
            key="bebidas-subcategories"
            initial={{ opacity: 0, y: -6, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -6, filter: 'blur(8px)' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="pt-2 border-t border-[var(--surface-border)]"
          >
            {/* Flex Wrap Container displaying compact rounded-full subcategory buttons */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 sm:gap-2">
              {drinkSubcategories.map((sub) => {
                const isActive = activeCategory === sub.id || (sub.id === 'all-drinks' && activeCategory === 'bebidas');

                return (
                  <motion.button
                    key={sub.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveCategory(sub.id)}
                    className={`px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-bold transition-all cursor-pointer border ${
                      isActive
                        ? 'bg-[var(--pill-active)] text-white border-[var(--pill-active-border)] shadow-[0_0_12px_var(--accent-glow)] font-extrabold scale-105'
                        : 'bg-white/5 text-gray-300 border-white/10 hover:border-[var(--accent-color)] hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {sub.label}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
