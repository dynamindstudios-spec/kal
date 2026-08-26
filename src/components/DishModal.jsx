import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Check, Wine, Sparkles } from 'lucide-react';
import { CURRENCIES, UI_TEXT, ALCOHOL_INTENSITY_FILTERS, DRINK_STYLE_FILTERS } from '../data/menuData';

function getDishModalImage(dish, selectedCap, selectedPresentation) {
  if (!dish) return '';
  const dishId = dish.id || '';
  const capId = selectedCap?.id || 'azul'; // 'roja' | 'azul' | 'verde'
  const presId = selectedPresentation?.id || 'bottle'; // 'quarter' | 'half' | 'bottle' | 'garrafa'

  // 1. Aguardiente Antioqueño
  if (dishId.includes('antioqueno')) {
    if (capId === 'roja') {
      if (presId === 'garrafa') return '/licores_sin_fondo/Aguardiente_Antioqueno_Tapa_Roja_1.75L_Garrafa.png';
      if (presId === 'half') return '/licores_sin_fondo/Aguardiente_Antioqueno_Tapa_Roja_500ml_Media.png';
      if (presId === 'quarter') return '/licores_sin_fondo/Aguardiente_Antioqueno_Tapa_Roja_375ml_Caneca.png';
      return '/licores_sin_fondo/Aguardiente_Antioqueno_Tapa_Roja_750ml_Botella.png';
    } else if (capId === 'verde') {
      if (presId === 'garrafa') return '/licores_sin_fondo/Aguardiente_Antioqueno_Tapa_Verde_1.75L_Garrafa.png';
      if (presId === 'half') return '/licores_sin_fondo/Aguardiente_Antioqueno_Tapa_Verde_500ml_Media.png';
      if (presId === 'quarter') return '/licores_sin_fondo/Aguardiente_Antioqueno_Tapa_Verde_375ml_Caneca.png';
      return '/licores_sin_fondo/Aguardiente_Antioqueno_Tapa_Verde_750ml_Botella.png';
    } else {
      // Azul
      if (presId === 'garrafa') return '/licores_sin_fondo/Aguardiente_Antioqueno_Tapa_Azul_1.75L_Garrafa.png';
      if (presId === 'half') return '/licores_sin_fondo/Aguardiente_Antioqueno_Tapa_Azul_500ml_Media.png';
      if (presId === 'quarter') return '/licores_sin_fondo/Aguardiente_Antioqueno_Tapa_Azul_375ml_Caneca.png';
      return '/licores_sin_fondo/Aguardiente_Antioqueno_Tapa_Azul_750ml_Botella.png';
    }
  }

  // 2. Aguardiente Amarillo Manzanares
  if (dishId.includes('amarillo')) {
    if (presId === 'garrafa') return '/licores_sin_fondo/Aguardiente_Amarillo_Manzanares_1.75L_Garrafa.png';
    if (presId === 'half') return '/licores_sin_fondo/Aguardiente_Amarillo_Manzanares_500ml_Media.png';
    if (presId === 'quarter') return '/licores_sin_fondo/Aguardiente_Amarillo_Manzanares_375ml_Caneca.png';
    return '/licores_sin_fondo/Aguardiente_Amarillo_Manzanares_750ml_Botella.png';
  }

  // 3. Aguardiente Néctar
  if (dishId.includes('nectar') && !dishId.includes('verde')) {
    if (presId === 'garrafa') return '/licores_sin_fondo/Aguardiente_Nectar_Rojo_1.75L_Garrafa.png';
    if (presId === 'half') return '/licores_sin_fondo/Aguardiente_Nectar_Rojo_500ml_Media.png';
    if (presId === 'quarter') return '/licores_sin_fondo/Aguardiente_Nectar_Rojo_375ml_Caneca.png';
    return '/licores_sin_fondo/Aguardiente_Nectar_Rojo_750ml_Botella.png';
  }

  // 4. Ron Viejo de Caldas (3 Años)
  if (dishId.includes('caldas-3')) {
    if (presId === 'garrafa') return '/licores_sin_fondo/Ron_Viejo_de_Caldas_3_Anos_1.75L_Garrafa.png';
    if (presId === 'half') return '/licores_sin_fondo/Ron_Viejo_de_Caldas_3_Anos_500ml_Media.png';
    if (presId === 'quarter') return '/licores_sin_fondo/Ron_Viejo_de_Caldas_3_Anos_375ml_Caneca.png';
    return '/licores_sin_fondo/Ron_Viejo_de_Caldas_3_Anos_750ml_Botella.png';
  }

  // 5. Ron Medellín Añejo
  if (dishId.includes('medellin')) {
    if (presId === 'garrafa') return '/licores_sin_fondo/Ron_Medellin_Anejo_3_Anos_1.75L_Garrafa.png';
    if (presId === 'half') return '/licores_sin_fondo/Ron_Medellin_Anejo_3_Anos_500ml_Media.png';
    if (presId === 'quarter') return '/licores_sin_fondo/Ron_Medellin_Anejo_3_Anos_375ml_Caneca.png';
    return '/licores_sin_fondo/Ron_Medellin_Anejo_3_Anos_750ml_Botella.png';
  }

  // 6. Old Parr 12 Años
  if (dishId.includes('old-parr')) {
    if (presId === 'garrafa') return '/licores_sin_fondo/Whisky_Old_Parr_12_Anos_1L_Garrafa.png';
    if (presId === 'half' || presId === 'quarter') return '/licores_sin_fondo/Whisky_Old_Parr_12_Anos_375ml_Media.png';
    return '/licores_sin_fondo/Whisky_Old_Parr_12_Anos_750ml_Botella.png';
  }

  // 7. Buchanan's 12
  if (dishId.includes('buchanans-12') || dishId === 'whisky-buchanans-12') {
    if (presId === 'garrafa') return '/licores_sin_fondo/Whisky_Buchanans_12_Anos_1L_Garrafa.png';
    if (presId === 'half' || presId === 'quarter') return '/licores_sin_fondo/Whisky_Buchanans_12_Anos_375ml_Media.png';
    return '/licores_sin_fondo/Whisky_Buchanans_12_Anos_750ml_Botella.png';
  }

  // 8. Johnnie Walker Black
  if (dishId.includes('johnnie-black')) {
    if (presId === 'garrafa') return '/licores_sin_fondo/Johnnie_Walker_Black_Label_1L_Garrafa.png';
    if (presId === 'half' || presId === 'quarter') return '/licores_sin_fondo/Johnnie_Walker_Black_Label_375ml_Media.png';
    return '/licores_sin_fondo/Johnnie_Walker_Black_Label_750ml_Botella.png';
  }

  // 9. Johnnie Walker Red
  if (dishId.includes('johnnie-red')) {
    if (presId === 'garrafa') return '/licores_sin_fondo/Johnnie_Walker_Red_Label_1L_Garrafa.png';
    if (presId === 'half' || presId === 'quarter') return '/licores_sin_fondo/Johnnie_Walker_Red_Label_375ml_Media.png';
    return '/licores_sin_fondo/Johnnie_Walker_Red_Label_750ml_Botella.png';
  }

  // 10. Jack Daniel's No. 7
  if (dishId.includes('jack-daniels') && !dishId.includes('honey')) {
    if (presId === 'garrafa') return '/licores_sin_fondo/Jack_Daniels_Old_No_7_1L_Garrafa.png';
    if (presId === 'half' || presId === 'quarter') return '/licores_sin_fondo/Jack_Daniels_Old_No_7_375ml_Media.png';
    return '/licores_sin_fondo/Jack_Daniels_Old_No_7_750ml_Botella.png';
  }

  // 11. Vodka Absolut
  if (dishId.includes('absolut')) {
    if (presId === 'garrafa') return '/licores_sin_fondo/Vodka_Absolut_Original_1L_Garrafa.png';
    if (presId === 'half' || presId === 'quarter') return '/licores_sin_fondo/Vodka_Absolut_Original_375ml_Media.png';
    return '/licores_sin_fondo/Vodka_Absolut_Original_750ml_Botella.png';
  }

  // 12. Vodka Smirnoff
  if (dishId.includes('smirnoff')) {
    if (presId === 'garrafa') return '/licores_sin_fondo/Vodka_Smirnoff_Red_No_21_1L_Garrafa.png';
    if (presId === 'half' || presId === 'quarter') return '/licores_sin_fondo/Vodka_Smirnoff_Red_No_21_375ml_Media.png';
    return '/licores_sin_fondo/Vodka_Smirnoff_Red_No_21_750ml_Botella.png';
  }

  return dish.image;
}

export default function DishModal({ dish, onClose, currentCurrency, currentLang, onAddToCart, onTriggerFlyingPlate }) {
  if (!dish) return null;

  // Aguardiente Bottle Cap Swatch Options (Only for Aguardiente Antioqueño, strictly NOT for Amarillo de Manzanares)
  const isAguardienteAntioqueno = (dish.id.includes('antioqueno') || dish.name.es.toLowerCase().includes('antioqueño')) &&
    !dish.id.includes('amarillo') &&
    !dish.name.es.toLowerCase().includes('amarillo') &&
    !dish.id.includes('nectar');
  
  const capOptions = [
    { id: 'roja', label: 'Tapa Roja', spec: 'Tradicional 29°', color: '#ef4444', glow: 'rgba(239,68,68,0.9)', badge: '🔴 Tapa Roja' },
    { id: 'azul', label: 'Tapa Azul', spec: 'Sin Azúcar 29°', color: '#3b82f6', glow: 'rgba(59,130,246,0.9)', badge: '🔵 Tapa Azul' },
    { id: 'verde', label: 'Tapa Verde', spec: 'Sin Azúcar Suave 24°', color: '#10b981', glow: 'rgba(16,185,129,0.9)', badge: '🟢 Tapa Verde' }
  ];

  // Bottle Size Presentation Options
  const isLiquorCategory = dish.category === 'licores' || dish.category === 'mezcladores';

  const presentations = [
    { id: 'quarter', label: '1/4 Caneca', ml: '375ml', multiplier: 0.5, icon: '🧪' },
    { id: 'half', label: 'Media Botella', ml: '500ml', multiplier: 0.68, icon: '🏺' },
    { id: 'bottle', label: 'Botella Estándar', ml: '750ml - 1L', multiplier: 1.0, icon: '🍾' },
    { id: 'garrafa', label: 'Garrafa', ml: '1.75L - 2L', multiplier: 2.1, icon: '🪣' }
  ];

  const [selectedCap, setSelectedCap] = useState(capOptions[1]); // Default to Tapa Azul
  const [selectedPresentation, setSelectedPresentation] = useState(presentations[2]); // Default to Botella Estándar
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const t = UI_TEXT[currentLang] || UI_TEXT.es;
  const currencyObj = CURRENCIES[currentCurrency] || CURRENCIES.COP;

  // Calculate Unit Price based on selected Presentation
  const basePriceCOP = dish.priceCOP;
  const unitPriceCOP = isLiquorCategory ? Math.round(basePriceCOP * selectedPresentation.multiplier) : basePriceCOP;
  const totalPriceCOP = unitPriceCOP * quantity;

  const formattedTotalPrice = Number(totalPriceCOP * currencyObj.rate).toLocaleString(
    currentCurrency === 'COP' || currentCurrency === 'CLP' || currentCurrency === 'ARS' ? 'es-CO' : 'en-US',
    { maximumFractionDigits: currentCurrency === 'COP' || currentCurrency === 'CLP' || currentCurrency === 'ARS' ? 0 : 2 }
  );

  // Dynamic Image calculated based on bottle presentation & cap color
  const activeModalImage = getDishModalImage(dish, selectedCap, selectedPresentation);
  const isTransparentPng = activeModalImage && activeModalImage.includes('/licores_sin_fondo/');

  const handleAddToCart = (e) => {
    let optionSuffix = [];
    if (isAguardienteAntioqueno) optionSuffix.push(selectedCap.badge);
    if (isLiquorCategory) optionSuffix.push(selectedPresentation.label);

    const fullNameWithSpecs = optionSuffix.length > 0
      ? `${dish.name.es} (${optionSuffix.join(' - ')})`
      : dish.name.es;

    let finalDish = {
      ...dish,
      image: activeModalImage,
      priceCOP: unitPriceCOP,
      name: { ...dish.name, es: fullNameWithSpecs, en: fullNameWithSpecs }
    };

    if (onTriggerFlyingPlate) {
      const rect = e.currentTarget.getBoundingClientRect();
      onTriggerFlyingPlate({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    }

    for (let i = 0; i < quantity; i++) {
      onAddToCart(finalDish);
    }

    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 800);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
        
        {/* Backdrop click to close */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0"
        />

        {/* Modal Window: Split Side-by-Side Layout (Left: Image, Right: Details & Options) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative z-10 w-full max-w-3xl md:max-w-4xl rounded-3xl glass-panel border border-[var(--surface-border)] bg-[var(--bg-color)] shadow-2xl overflow-hidden text-[var(--text-primary)] max-h-[92vh] flex flex-col md:flex-row"
        >
          {/* Close Button Top Right */}
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 z-30 w-9 h-9 rounded-full bg-black/70 text-white flex items-center justify-center backdrop-blur-md hover:bg-black transition-all border border-white/20 cursor-pointer shadow-lg"
            title="Cerrar detalles"
          >
            <X size={18} />
          </button>

          {/* LEFT SIDE: PRODUCT IMAGE */}
          <div className="relative w-full md:w-1/2 h-64 sm:h-72 md:h-auto min-h-[260px] md:min-h-[440px] shrink-0 overflow-hidden bg-gradient-to-b from-[#08080c]/90 via-black/60 to-[#08080c]/95 flex items-center justify-center p-4 sm:p-6">
            
            {/* Dynamic Exclusive Bottle Glow Burst / Destello Luminous Core */}
            {isTransparentPng && (
              <>
                {/* Intense Core Neon Flare */}
                <div
                  className="absolute w-44 h-44 sm:w-60 sm:h-60 rounded-full pointer-events-none blur-2xl animate-pulse"
                  style={{
                    backgroundColor: 'var(--accent-color)',
                    opacity: 0.6,
                    boxShadow: '0 0 70px var(--accent-glow)'
                  }}
                />

                {/* Wide Ambient Radial Aura */}
                <div
                  className="absolute w-64 h-64 sm:w-80 sm:h-80 rounded-full pointer-events-none blur-3xl"
                  style={{
                    background: 'radial-gradient(circle, var(--accent-color) 0%, var(--accent-glow) 35%, transparent 70%)',
                    opacity: 0.75
                  }}
                />
              </>
            )}

            <motion.img
              key={activeModalImage}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              src={activeModalImage}
              alt={dish.name[currentLang] || dish.name.es}
              className={isTransparentPng ? "relative z-10 max-h-[85%] max-w-[85%] object-contain filter drop-shadow-[0_25px_45px_rgba(0,0,0,0.98)]" : "w-full h-full object-cover"}
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-color)] via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-[var(--bg-color)] pointer-events-none z-10 opacity-60" />

            {/* Top-Left VIP Badge Overlay */}
            <div className="absolute top-4 left-4 z-20">
              <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-[var(--accent-color)] text-[10px] font-black text-[var(--accent-color)] uppercase tracking-wider shadow-lg flex items-center gap-1.5">
                <Sparkles size={12} />
                <span>KAL DISCOBAR VIP</span>
              </span>
            </div>
          </div>

          {/* RIGHT SIDE: DETAILS & INTERACTIVE OPTIONS */}
          <div className="w-full md:w-1/2 p-4 sm:p-6 overflow-y-auto flex flex-col justify-between space-y-4 no-scrollbar">
            
            {/* Header Title & Description */}
            <div>
              <h2 className="text-xl sm:text-2xl font-black serif-title gold-gradient-text leading-tight">
                {dish.name[currentLang] || dish.name.es}
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1.5 leading-relaxed">
                {dish.description[currentLang] || dish.description.es}
              </p>
            </div>

            {/* SECCIÓN 1: SELECCIÓN DE TAPAS DE COLORES (Únicamente para Aguardiente Antioqueño) */}
            {isAguardienteAntioqueno && (
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-gray-200 uppercase tracking-wider flex items-center gap-1.5">
                    <span>🍼</span>
                    <span>Tapa de Aguardiente Antioqueño</span>
                  </h4>
                  <span className="text-[11px] font-bold text-[var(--accent-color)] font-mono">
                    {selectedCap.badge}
                  </span>
                </div>

                {/* Pure PNG Bottle Cap Silhouettes (No circular background buttons) */}
                <div className="flex items-center justify-around gap-4 pt-1">
                  {capOptions.map((cap) => {
                    const isSelected = selectedCap.id === cap.id;
                    return (
                      <button
                        key={cap.id}
                        type="button"
                        onClick={() => setSelectedCap(cap)}
                        className={`relative cursor-pointer transition-all flex flex-col items-center gap-1.5 group ${
                          isSelected ? 'scale-115 z-10' : 'opacity-65 hover:opacity-100'
                        }`}
                      >
                        {/* Pure Bottle Cap PNG Image Container (No Background Circle Button) */}
                        <div
                          className="w-12 h-12 sm:w-14 sm:h-14 relative transition-all"
                          style={{
                            filter: isSelected
                              ? `drop-shadow(0 0 16px ${cap.glow}) drop-shadow(0 0 4px white)`
                              : 'drop-shadow(0 4px 6px rgba(0,0,0,0.6))'
                          }}
                        >
                          <div
                            className="w-full h-full"
                            style={{
                              backgroundColor: cap.color,
                              WebkitMaskImage: `url("/tapas.png")`,
                              maskImage: `url("/tapas.png")`,
                              WebkitMaskSize: 'contain',
                              maskSize: 'contain',
                              WebkitMaskRepeat: 'no-repeat',
                              maskRepeat: 'no-repeat',
                              WebkitMaskPosition: 'center',
                              maskPosition: 'center'
                            }}
                          />

                          {isSelected && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white text-black text-[10px] font-black flex items-center justify-center shadow-lg border border-black/20 z-10">
                              ✓
                            </span>
                          )}
                        </div>

                        <span className={`text-[11px] font-extrabold ${isSelected ? 'text-white' : 'text-gray-400'}`}>
                          {cap.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SECCIÓN 2: PRESENTACIÓN DE BOTELLA / LITAJE (Tarjetas Segmentadas) */}
            {isLiquorCategory && (
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-gray-200 uppercase tracking-wider flex items-center gap-1.5">
                    <Wine size={14} className="text-[var(--accent-color)]" />
                    <span>Litaje / Presentación</span>
                  </h4>
                  <span className="text-[11px] font-mono font-bold text-[var(--accent-color)]">
                    {selectedPresentation.ml}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {presentations.map((pres) => {
                    const isSelected = selectedPresentation.id === pres.id;
                    return (
                      <button
                        key={pres.id}
                        type="button"
                        onClick={() => setSelectedPresentation(pres)}
                        className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 cursor-pointer ${
                          isSelected
                            ? 'bg-[var(--pill-active)] text-white border-[var(--pill-active-border)] shadow-[0_0_12px_var(--accent-glow)] font-black'
                            : 'bg-white/5 text-gray-300 border-white/10 hover:border-[var(--accent-color)]'
                        }`}
                      >
                        <span className="text-lg">{pres.icon}</span>
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] font-extrabold truncate">{pres.label}</p>
                          <p className="text-[9px] text-gray-400 font-mono">{pres.ml}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Selector & Price Summary */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Precio Total</p>
                <p className="text-xl sm:text-2xl font-black text-[var(--accent-color)] font-mono drop-shadow">
                  {currencyObj.symbol} {formattedTotalPrice}
                </p>
              </div>

              {/* Stepper Quantity (+ / -) */}
              <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/5 border border-white/15">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Minus size={14} />
                </button>
                <span className="w-6 text-center font-mono font-black text-sm text-white">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Add to Cart CTA Button */}
            <button
              type="button"
              onClick={handleAddToCart}
              style={{
                backgroundColor: added ? '#10b981' : 'var(--accent-color)',
                color: added ? '#ffffff' : 'var(--accent-on)',
                boxShadow: added ? '0 0 25px rgba(16,185,129,0.8)' : '0 0 25px var(--accent-glow)'
              }}
              className="w-full py-3.5 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer hover:brightness-110 shadow-xl"
            >
              {added ? (
                <>
                  <Check size={18} />
                  <span>¡Añadido al Pedido VIP!</span>
                </>
              ) : (
                <>
                  <span>Añadir al Pedido</span>
                  <span>—</span>
                  <span className="font-mono">{currencyObj.symbol} {formattedTotalPrice}</span>
                </>
              )}
            </button>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
