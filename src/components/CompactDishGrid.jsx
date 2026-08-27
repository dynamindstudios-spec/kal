import React from 'react';
import { motion } from 'framer-motion';
import { CURRENCIES } from '../data/menuData';

export default function CompactDishGrid({
  dishes,
  currentCurrency,
  currentLang,
  onSelectDish
}) {
  const currencyObj = CURRENCIES[currentCurrency] || CURRENCIES.COP;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {dishes.map((dish) => {
        const convertedPrice = Number(dish.priceCOP * currencyObj.rate).toLocaleString(
          currentCurrency === 'COP' || currentCurrency === 'CLP' || currentCurrency === 'ARS' ? 'es-CO' : 'en-US',
          { maximumFractionDigits: currentCurrency === 'COP' || currentCurrency === 'CLP' || currentCurrency === 'ARS' ? 0 : 2 }
        );

        const convertedOriginalPrice = dish.originalPriceCOP && dish.originalPriceCOP > dish.priceCOP ? Number(dish.originalPriceCOP * currencyObj.rate).toLocaleString(
          currentCurrency === 'COP' || currentCurrency === 'CLP' || currentCurrency === 'ARS' ? 'es-CO' : 'en-US',
          { maximumFractionDigits: currentCurrency === 'COP' || currentCurrency === 'CLP' || currentCurrency === 'ARS' ? 0 : 2 }
        ) : null;

        const isTransparent = dish.image && dish.image.includes('/licores_sin_fondo/');

        return (
          <motion.div
            key={dish.id}
            whileHover={{ scale: 1.02 }}
            onClick={() => onSelectDish && onSelectDish(dish)}
            className="glass-panel p-3 rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] flex items-center justify-between gap-3 shadow-md hover:border-[var(--accent-color)] transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-14 h-14 rounded-xl bg-black/50 border border-[var(--surface-border)] shrink-0 flex items-center justify-center p-1 overflow-hidden relative">
                <img
                  src={dish.image}
                  alt={dish.name[currentLang] || dish.name.es}
                  className={`w-full h-full ${isTransparent ? 'object-contain filter drop-shadow' : 'object-cover rounded-lg'} group-hover:scale-105 transition-transform`}
                />
                {dish.discountPercentage && (
                  <span className="absolute top-0.5 right-0.5 px-1 py-0.2 rounded bg-red-600 text-white font-black text-[8px]">
                    -{dish.discountPercentage}%
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-black text-[var(--text-primary)] truncate group-hover:text-[var(--accent-color)] transition-colors">
                  {dish.name[currentLang] || dish.name.es}
                </h4>
                <div className="flex items-baseline gap-1.5 mt-0.5 flex-wrap">
                  <p className="text-[11px] font-extrabold text-[var(--accent-color)] font-mono">
                    {currencyObj.symbol}{convertedPrice}
                  </p>
                  {convertedOriginalPrice && (
                    <span className="text-[10px] text-gray-400 line-through font-mono font-bold">
                      {currencyObj.symbol}{convertedOriginalPrice}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
