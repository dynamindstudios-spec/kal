import React from 'react';
import { motion } from 'framer-motion';
import { CURRENCIES, MENU_CATEGORIES } from '../data/menuData';

export default function BasicDishList({
  dishes,
  currentCurrency,
  currentLang,
  onSelectDish
}) {
  const currencyObj = CURRENCIES[currentCurrency] || CURRENCIES.COP;
  const categoriesToRender = MENU_CATEGORIES.filter((c) => c.id !== 'all' && c.id !== 'build-your-own');

  return (
    <div className="w-full space-y-8 pb-12">
      {categoriesToRender.map((cat) => {
        const categoryDishes = dishes.filter((d) => d.category === cat.id);
        if (categoryDishes.length === 0) return null;

        return (
          <div key={cat.id} className="space-y-4">
            
            {/* Elegant Header */}
            <div className="border-b border-[var(--surface-border)] pb-2 flex items-center justify-between">
              <h2 className="text-xl md:text-2xl font-black text-[var(--text-primary)] serif-title tracking-tight">
                {cat.name[currentLang] || cat.name.es}
              </h2>
              <span className="text-xs font-bold text-[var(--accent-color)] uppercase tracking-widest">
                Menú Tradicional
              </span>
            </div>

            {/* Basic List Rows (Clean layout without quick + button) */}
            <div className="space-y-3">
              {categoryDishes.map((dish) => {
                const formattedPrice = Number(dish.priceCOP * currencyObj.rate).toLocaleString(
                  currentCurrency === 'COP' || currentCurrency === 'CLP' || currentCurrency === 'ARS' ? 'es-CO' : 'en-US',
                  { maximumFractionDigits: currentCurrency === 'COP' || currentCurrency === 'CLP' || currentCurrency === 'ARS' ? 0 : 2 }
                );

                const formattedOriginalPrice = dish.originalPriceCOP && dish.originalPriceCOP > dish.priceCOP ? Number(dish.originalPriceCOP * currencyObj.rate).toLocaleString(
                  currentCurrency === 'COP' || currentCurrency === 'CLP' || currentCurrency === 'ARS' ? 'es-CO' : 'en-US',
                  { maximumFractionDigits: currentCurrency === 'COP' || currentCurrency === 'CLP' || currentCurrency === 'ARS' ? 0 : 2 }
                ) : null;

                return (
                  <motion.div
                    key={dish.id}
                    whileHover={{ scale: 1.005, x: 2 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => onSelectDish && onSelectDish(dish)}
                    className="p-4 rounded-2xl glass-panel border border-[var(--surface-border)] bg-[var(--surface-bg)] shadow-md hover:border-[var(--accent-color)] cursor-pointer group transition-all"
                  >
                    <div className="flex items-center justify-between gap-3">
                      
                      {/* Name & Dotted Leader Line & Discount Badge */}
                      <div className="flex-1 min-w-0 flex items-baseline gap-2 flex-wrap">
                        <h3 className="text-sm md:text-base font-extrabold text-[var(--text-primary)] line-clamp-1 group-hover:text-[var(--accent-color)] transition-colors">
                          {dish.name[currentLang] || dish.name.es}
                        </h3>
                        {dish.discountPercentage ? (
                          <span className="px-1.5 py-0.5 rounded-full bg-red-600 text-white font-black text-[9px] uppercase">
                            -{dish.discountPercentage}% OFF
                          </span>
                        ) : (dish.isAvailable === false || dish.available === false || dish.stockQty === 0) ? (
                          <span className="px-1.5 py-0.5 rounded-full bg-red-950/80 border border-red-500/40 text-red-300 font-black text-[8px] uppercase">
                            AGOTADO
                          </span>
                        ) : null}
                        <div className="flex-1 border-b border-dotted border-[var(--surface-border)] opacity-60 hidden sm:block" />
                      </div>

                      {/* Price Tag */}
                      <div className="flex items-baseline gap-2 shrink-0">
                        <span className="text-sm md:text-base font-black text-[var(--accent-color)] font-mono">
                          {currencyObj.symbol}{formattedPrice}
                        </span>
                        {formattedOriginalPrice && (
                          <span className="text-xs text-gray-400 line-through font-mono font-bold">
                            {currencyObj.symbol}{formattedOriginalPrice}
                          </span>
                        )}
                      </div>

                    </div>
                  </motion.div>
                );
              })}
            </div>

          </div>
        );
      })}
    </div>
  );
}
