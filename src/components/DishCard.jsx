import React from 'react';
import { motion } from 'framer-motion';
import { CURRENCIES, ALCOHOL_INTENSITY_FILTERS, DRINK_STYLE_FILTERS } from '../data/menuData';

export default function DishCard({
  dish,
  currentCurrency,
  currentLang,
  onSelectDish
}) {
  const currencyObj = CURRENCIES[currentCurrency] || CURRENCIES.COP;
  const convertedPrice = Number(dish.priceCOP * currencyObj.rate).toLocaleString(
    currentCurrency === 'COP' || currentCurrency === 'CLP' || currentCurrency === 'ARS' ? 'es-CO' : 'en-US',
    { maximumFractionDigits: currentCurrency === 'COP' || currentCurrency === 'CLP' || currentCurrency === 'ARS' ? 0 : 2 }
  );

  const isTransparentBottle = dish.image && dish.image.includes('/licores_sin_fondo/');

  const handleOpenModal = () => {
    if (onSelectDish) {
      onSelectDish(dish);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      onClick={handleOpenModal}
      className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden glass-panel border border-[var(--card-border)] bg-[var(--card-bg)] shadow-lg hover:shadow-2xl cursor-pointer group flex flex-col justify-between"
    >
      {/* Background / Bottle Image */}
      {isTransparentBottle ? (
        <div className="absolute inset-0 flex items-center justify-center p-4 z-0 bg-gradient-to-b from-[#08080c]/60 via-black/40 to-[#08080c]/90 overflow-hidden">
          
          {/* Intense Theme Glow Flare Core / Destello Luminous Core */}
          <div
            className="absolute w-36 h-36 sm:w-44 sm:h-44 rounded-full pointer-events-none blur-2xl transition-all duration-700 group-hover:scale-125"
            style={{
              backgroundColor: 'var(--accent-color)',
              opacity: 0.55,
              boxShadow: '0 0 50px var(--accent-glow)'
            }}
          />

          {/* Wide Radiant Ambient Halo / Resplandor Neón */}
          <div
            className="absolute w-56 h-56 sm:w-68 sm:h-68 rounded-full pointer-events-none blur-3xl transition-transform duration-700 group-hover:scale-130"
            style={{
              background: 'radial-gradient(circle, var(--accent-color) 0%, var(--accent-glow) 35%, transparent 70%)',
              opacity: 0.7
            }}
          />

          <img
            src={dish.image}
            alt={dish.name[currentLang] || dish.name.es}
            className="relative z-10 max-h-[82%] max-w-[82%] object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.98)] group-hover:scale-110 transition-transform duration-500 ease-out"
            loading="eager"
          />
        </div>
      ) : (
        <img
          src={dish.image}
          alt={dish.name[currentLang] || dish.name.es}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1000&q=85";
          }}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out z-0"
          loading="eager"
        />
      )}

      {/* TOP ROW: Left Badges (Alcohol Intensity & Drink Flavor Style) */}
      <div className="relative z-20 p-2.5 sm:p-4 flex items-start justify-between gap-1.5 pointer-events-none">
        <div className="flex flex-wrap gap-1 max-w-[85%]">
          {dish.tags?.map((tagId) => {
            const opt = ALCOHOL_INTENSITY_FILTERS.find((o) => o.id === tagId);
            if (!opt) return null;
            return (
              <span
                key={tagId}
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-black/75 backdrop-blur-md border border-amber-400/50 flex items-center justify-center text-[10px] sm:text-xs shadow-md"
                title={opt.label[currentLang] || opt.label.es}
              >
                {opt.icon}
              </span>
            );
          })}

          {dish.styles?.map((styleId) => {
            const styleObj = DRINK_STYLE_FILTERS.find((s) => s.id === styleId);
            if (!styleObj || !styleObj.icon) return null;
            return (
              <span
                key={styleId}
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-black/75 backdrop-blur-md border border-pink-400/50 flex items-center justify-center text-[10px] sm:text-xs shadow-md"
                title={styleObj.label[currentLang] || styleObj.label.es}
              >
                {styleObj.icon}
              </span>
            );
          })}
        </div>
      </div>

      {/* BOTTOM BOX: Title & Price */}
      <div className="relative z-20 p-3 sm:p-4 m-1.5 sm:m-3 rounded-2xl glass-panel border border-[var(--surface-border)] bg-[var(--surface-bg)] shadow-xl backdrop-blur-md flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="text-xs sm:text-sm font-black text-[var(--text-primary)] line-clamp-1 leading-snug">
            {dish.name[currentLang] || dish.name.es}
          </h3>

          <div className="mt-0.5 flex items-center gap-1">
            <span className="text-xs sm:text-base font-black text-[var(--accent-color)] font-mono">
              {currencyObj.symbol}{convertedPrice}
            </span>
          </div>
        </div>
      </div>

    </motion.div>
  );
}
