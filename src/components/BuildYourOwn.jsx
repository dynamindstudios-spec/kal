import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ShoppingBag, Check, Wine } from 'lucide-react';
import confetti from 'canvas-confetti';
import { BUILD_YOUR_OWN_DATA, CURRENCIES, UI_TEXT } from '../data/menuData';

export default function BuildYourOwn({ currentCurrency, currentLang, onAddToCart }) {
  const [selectedBottle, setSelectedBottle] = useState(null);
  const [selectedMixer, setSelectedMixer] = useState(null);
  const [selectedSnack, setSelectedSnack] = useState(null);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [dishAdded, setDishAdded] = useState(false);

  const t = UI_TEXT[currentLang] || UI_TEXT.es;
  const currencyObj = CURRENCIES[currentCurrency] || CURRENCIES.COP;

  const toggleExtra = (item) => {
    if (selectedExtras.some((t) => t.id === item.id)) {
      setSelectedExtras(selectedExtras.filter((t) => t.id !== item.id));
    } else {
      setSelectedExtras([...selectedExtras, item]);
    }
  };

  // Compute total COP price
  const totalCOP =
    (selectedBottle ? selectedBottle.priceCOP : 0) +
    (selectedMixer ? selectedMixer.priceCOP : 0) +
    (selectedSnack ? selectedSnack.priceCOP : 0) +
    selectedExtras.reduce((sum, item) => sum + item.priceCOP, 0);

  const convertedTotal = Number(totalCOP * currencyObj.rate).toLocaleString(
    currentCurrency === 'COP' ? 'es-CO' : 'en-US',
    { maximumFractionDigits: currentCurrency === 'COP' ? 0 : 2 }
  );

  const handleCreateCustomBucket = () => {
    if (!selectedBottle) return;

    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 }
    });

    const customBucket = {
      id: 'custom-kal-' + Date.now(),
      name: {
        es: `Balde / Kit Fiesta VIP Kal (${selectedBottle.name.es})`,
        en: `Custom VIP Kal Party Bucket (${selectedBottle.name.en || selectedBottle.name.es})`
      },
      description: {
        es: `Botella: ${selectedBottle.name.es}, Mezclador: ${selectedMixer ? selectedMixer.name.es : 'Ninguno'}, Snack: ${selectedSnack ? selectedSnack.name.es : 'Ninguno'}, Extras: ${selectedExtras.map(e => e.name.es).join(', ') || 'Ninguno'}`,
        en: `Bottle: ${selectedBottle.name.es}, Mixer: ${selectedMixer ? selectedMixer.name.es : 'None'}, Snack: ${selectedSnack ? selectedSnack.name.es : 'None'}, Extras: ${selectedExtras.map(e => e.name.es).join(', ') || 'None'}`
      },
      priceCOP: totalCOP,
      image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80"
    };

    onAddToCart(customBucket);
    setDishAdded(true);
    setTimeout(() => setDishAdded(false), 3000);
  };

  return (
    <div className="w-full space-y-8 glass-panel p-5 sm:p-8 rounded-3xl border border-[var(--surface-border)] shadow-2xl">
      
      {/* Header Banner */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--pill-bg)] border border-[var(--accent-color)] text-xs font-black text-[var(--accent-color)] uppercase tracking-wider">
          <Wine size={16} />
          <span>Experiencia VIP Kal</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black serif-title gold-gradient-text">
          Arma tu Kit / Balde de Fiesta
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] font-medium">
          Selecciona tu botella favorita, mezcladores, snacks y complementos de hielera para tu mesa.
        </p>
      </div>

      {/* STEP 1: Select Bottle */}
      <div className="space-y-3">
        <h3 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-[var(--accent-color)] text-[var(--accent-on)] flex items-center justify-center text-xs font-bold">1</span>
          <span>Selecciona tu Licor / Botella Principal *</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {BUILD_YOUR_OWN_DATA.bottles.map((b) => {
            const isSelected = selectedBottle?.id === b.id;
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => setSelectedBottle(b)}
                className={`p-4 rounded-2xl text-left border transition-all flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-[var(--pill-active)] text-[var(--pill-active-text)] border-[var(--pill-active-border)] shadow-lg scale-[1.02]'
                    : 'bg-[var(--card-bg)] text-[var(--text-primary)] border-[var(--surface-border)] hover:border-[var(--accent-color)]'
                }`}
              >
                <div className="flex items-center gap-3">
                  {b.image ? (
                    <img src={b.image} alt={b.name.es} className="w-12 h-12 object-contain filter drop-shadow shrink-0" />
                  ) : (
                    <span className="text-2xl">{b.icon || '🍾'}</span>
                  )}
                  <div>
                    <p className="text-xs font-black">{b.name.es}</p>
                    <p className="text-[11px] text-[var(--accent-color)] font-extrabold mt-0.5 font-mono">
                      {currencyObj.symbol}{Number(b.priceCOP * currencyObj.rate).toLocaleString('es-CO')}
                    </p>
                  </div>
                </div>
                {isSelected && <Check className="text-[var(--accent-color)]" size={18} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP 2: Select Mixer */}
      <div className="space-y-3 pt-4 border-t border-[var(--surface-border)]">
        <h3 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-[var(--accent-color)] text-[var(--accent-on)] flex items-center justify-center text-xs font-bold">2</span>
          <span>Selecciona tus Mezcladores</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {BUILD_YOUR_OWN_DATA.mixers.map((m) => {
            const isSelected = selectedMixer?.id === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelectedMixer(isSelected ? null : m)}
                className={`p-3.5 rounded-2xl text-left border transition-all flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-[var(--pill-active)] text-[var(--pill-active-text)] border-[var(--pill-active-border)] shadow-md'
                    : 'bg-[var(--card-bg)] text-[var(--text-primary)] border-[var(--surface-border)] hover:border-[var(--accent-color)]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{m.icon}</span>
                  <div>
                    <p className="text-xs font-bold">{m.name.es}</p>
                    <p className="text-[11px] text-[var(--accent-color)] font-extrabold">
                      +${Number(m.priceCOP * currencyObj.rate).toLocaleString('es-CO')} {currentCurrency}
                    </p>
                  </div>
                </div>
                {isSelected && <Check className="text-[var(--accent-color)]" size={18} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP 3: Select Snack & Extras */}
      <div className="space-y-3 pt-4 border-t border-[var(--surface-border)]">
        <h3 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-[var(--accent-color)] text-[var(--accent-on)] flex items-center justify-center text-xs font-bold">3</span>
          <span>Acompañantes & Hielera VIP</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {BUILD_YOUR_OWN_DATA.extras.map((e) => {
            const isSelected = selectedExtras.some((item) => item.id === e.id);
            return (
              <button
                key={e.id}
                type="button"
                onClick={() => toggleExtra(e)}
                className={`p-3.5 rounded-2xl text-left border transition-all flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-[var(--pill-active)] text-[var(--pill-active-text)] border-[var(--pill-active-border)] shadow-md'
                    : 'bg-[var(--card-bg)] text-[var(--text-primary)] border-[var(--surface-border)] hover:border-[var(--accent-color)]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{e.icon}</span>
                  <div>
                    <p className="text-xs font-bold">{e.name.es}</p>
                    <p className="text-[11px] text-[var(--accent-color)] font-extrabold">
                      +${Number(e.priceCOP * currencyObj.rate).toLocaleString('es-CO')} {currentCurrency}
                    </p>
                  </div>
                </div>
                {isSelected && <Check className="text-[var(--accent-color)]" size={18} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Summary Bar & Action Button */}
      <div className="pt-6 border-t border-[var(--surface-border)] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-xs text-[var(--text-muted)] font-medium">Total Kit VIP Kal:</p>
          <p className="text-2xl sm:text-3xl font-black text-[var(--accent-color)]">
            {currencyObj.symbol} {convertedTotal} <span className="text-xs uppercase">{currentCurrency}</span>
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          disabled={!selectedBottle}
          onClick={handleCreateCustomBucket}
          className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl text-sm font-black flex items-center justify-center gap-2 shadow-xl transition-all border ${
            selectedBottle
              ? 'bg-[var(--accent-color)] text-[var(--accent-on)] border-transparent hover:brightness-110 cursor-pointer'
              : 'bg-gray-800 text-gray-500 border-gray-700 cursor-not-allowed'
          }`}
        >
          <ShoppingBag size={18} />
          <span>{dishAdded ? '¡Kit Añadido a la Mesa!' : 'Agregar Kit VIP a la Mesa'}</span>
        </motion.button>
      </div>

    </div>
  );
}
