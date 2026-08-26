import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Flame, Check, Sparkles } from 'lucide-react';
import { UI_TEXT } from '../data/menuData';
import { adminStore } from '../services/adminStore';

export default function SidebarFilter({
  searchQuery,
  setSearchQuery,
  selectedDietary,
  setSelectedDietary,
  selectedAllergens,
  setSelectedAllergens,
  currentLang
}) {
  const t = UI_TEXT[currentLang] || UI_TEXT.es;

  const [intensityFilters, setIntensityFilters] = useState(() => adminStore.getIntensityFilters());
  const [tasteFilters, setTasteFilters] = useState(() => adminStore.getTasteFilters());

  useEffect(() => {
    const unsubscribe = adminStore.subscribe(() => {
      setIntensityFilters(adminStore.getIntensityFilters());
      setTasteFilters(adminStore.getTasteFilters());
    });
    return unsubscribe;
  }, []);

  // Toggle alcohol intensity filter
  const toggleIntensity = (id) => {
    if (selectedDietary.includes(id)) {
      setSelectedDietary(selectedDietary.filter((item) => item !== id));
    } else {
      setSelectedDietary([...selectedDietary, id]);
    }
  };

  // Toggle alcohol taste profile filter (Dulce, Amargo, Seco)
  const toggleTaste = (id) => {
    if (selectedAllergens.includes(id)) {
      setSelectedAllergens(selectedAllergens.filter((item) => item !== id));
    } else {
      setSelectedAllergens([...selectedAllergens, id]);
    }
  };

  return (
    <aside id="spotlight-step-filters" className="w-full lg:w-72 shrink-0 flex flex-col gap-4 md:gap-6 lg:sticky lg:top-[60px] lg:self-start lg:max-h-[calc(100vh-70px)] lg:overflow-y-auto no-scrollbar">
      
      {/* Search Bar Input */}
      <div className="glass-panel p-3 md:p-4 rounded-3xl border border-[var(--surface-border)] shadow-md">
        <div className="relative flex items-center">
          <Search className="absolute left-4 text-[var(--text-muted)] shrink-0" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-11 pr-4 py-2.5 md:py-3 rounded-2xl bg-[var(--pill-bg)] text-[var(--text-primary)] text-sm border border-[var(--surface-border)] focus:outline-none focus:border-[var(--accent-color)] transition-all font-medium placeholder-[var(--text-muted)]"
          />
        </div>
      </div>

      {/* Alcohol Intensity & Taste Profile Panel */}
      <div className="glass-panel p-4 md:p-5 rounded-3xl border border-[var(--surface-border)] shadow-lg flex flex-col gap-3 md:gap-4">
        
        {/* 1. Alcohol Strength / Intensity Section */}
        <h3 className="text-xs md:text-sm font-black text-[var(--accent-color)] uppercase tracking-wider flex items-center gap-2">
          <Flame size={16} />
          <span>Intensidad de Alcohol</span>
        </h3>

        {/* Alcohol Strength Filters List */}
        <div className="flex lg:flex-col gap-2 overflow-x-auto no-scrollbar pb-1 lg:pb-0">
          {intensityFilters.map((item) => {
            const isSelected = selectedDietary.includes(item.id);
            const labelText = typeof item.label === 'object' ? (item.label[currentLang] || item.label.es) : item.label;

            return (
              <motion.button
                key={item.id}
                whileTap={{ scale: 0.96 }}
                onClick={() => toggleIntensity(item.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap lg:whitespace-normal text-left flex items-center justify-between transition-all border shrink-0 lg:shrink cursor-pointer ${
                  isSelected
                    ? 'bg-[var(--pill-active)] text-[var(--pill-active-text)] border-[var(--pill-active-border)] shadow-md scale-[1.02] font-black'
                    : 'bg-[var(--pill-bg)] text-[var(--text-primary)] border-[var(--surface-border)] hover:border-[var(--accent-color)]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">{item.icon}</span>
                  <span>{labelText}</span>
                </div>

                {isSelected && <Check size={14} className="shrink-0 hidden lg:inline" />}
              </motion.button>
            );
          })}
        </div>

        {/* 2. Alcohol Taste Profile Section (Dulce, Amargo, Seco) — Visibles Siempre sin Desplegable */}
        <div className="pt-3 border-t border-[var(--surface-border)] space-y-2.5">
          <h3 className="text-xs md:text-sm font-black text-[var(--accent-color)] uppercase tracking-wider flex items-center gap-2">
            <Sparkles size={16} />
            <span>Perfil de Sabor</span>
          </h3>

          {/* Taste Profile Grid Always Visible */}
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-2 pt-1">
            {tasteFilters.map((item) => {
              const isSelected = selectedAllergens.includes(item.id);
              const labelText = typeof item.label === 'object' ? (item.label[currentLang] || item.label.es) : item.label;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleTaste(item.id)}
                  className={`p-3 rounded-2xl text-xs font-bold flex items-center justify-between transition-all border text-left cursor-pointer ${
                    isSelected
                      ? 'bg-[var(--pill-active)] text-white border-[var(--pill-active-border)] font-black shadow-[0_0_12px_var(--accent-glow)]'
                      : 'bg-[var(--pill-bg)] text-[var(--text-primary)] border-[var(--surface-border)] hover:border-[var(--accent-color)]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{item.icon}</span>
                    <span>{labelText}</span>
                  </div>
                  {isSelected && <Check size={14} className="shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

      </div>

    </aside>
  );
}
