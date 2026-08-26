import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Palette, Filter, RefreshCw, ShoppingBag, ChevronRight, ChevronLeft, Check, HelpCircle } from 'lucide-react';

const TUTORIAL_STEPS = [
  {
    icon: Palette,
    badge: "Paso 1 de 4",
    title: "Personalización & Monedas",
    subtitle: "Adapta la experiencia a tu estilo",
    description: "En la barra superior de navegación puedes cambiar el Tema de color (Blanco, Negro o Crema), seleccionar tu moneda preferida (COP, USD, EUR, MXN, GBP) y cambiar el idioma en tiempo real.",
    color: "from-amber-500 to-orange-500"
  },
  {
    icon: Filter,
    badge: "Paso 2 de 4",
    title: "Filtros Dietéticos & Alérgenos",
    subtitle: "Encuentra la comida ideal para ti",
    description: "Usa la barra lateral izquierda para buscar platillos y filtrar por preferencias como Vegetariano, Vegano, Alto en Proteínas o Sin Gluten. También puedes excluir alérgenos específicos acumulativamente.",
    color: "from-emerald-500 to-teal-500"
  },
  {
    icon: RefreshCw,
    badge: "Paso 3 de 4",
    title: "Tarjetas 3D & Nutrición",
    subtitle: "Información transparente al instante",
    description: "Haz clic en cualquier platillo para hacer girar la tarjeta en 3D (180°). Descubrirás el desglose nutricional completo: Calorías, Proteínas, Grasas, Carbohidratos y Alérgenos presentes.",
    color: "from-blue-500 to-indigo-500"
  },
  {
    icon: ShoppingBag,
    badge: "Paso 4 de 4",
    title: "Tu Pedido en Mesa o Barra",
    subtitle: "Pide directamente a tu mesa o para retirar en barra",
    description: "Añade licores y cócteles a Tu Pedido. Si estás en la discoteca, selecciona 'A la Mesa' e ingresa la clave de 5 dígitos registrada en tu mesa. Si prefieres retirar tú mismo, elige 'En la Barra' e indica tu nombre y tiempo de recogida.",
    color: "from-purple-500 to-pink-500"
  }
];

export default function InteractiveTutorialModal({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const step = TUTORIAL_STEPS[currentStep];
  const Icon = step.icon;

  const handleNext = () => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 20 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          className="relative w-full max-w-lg rounded-3xl glass-panel border border-[var(--surface-border)] bg-[var(--bg-color)] shadow-2xl overflow-hidden p-6 md:p-8 space-y-6 text-center"
        >
          
          {/* Header Step Badge */}
          <div className="flex items-center justify-between border-b border-[var(--surface-border)] pb-3">
            <span className="text-[11px] font-black uppercase tracking-widest text-[var(--accent-color)] flex items-center gap-1.5">
              <HelpCircle size={14} />
              <span>Guía Rápida Interactiva</span>
            </span>

            <span className="px-3 py-1 rounded-full bg-[var(--pill-bg)] text-[var(--text-muted)] text-[10px] font-bold border border-[var(--surface-border)]">
              {step.badge}
            </span>
          </div>

          {/* Icon Badge Header with Animated Glow */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, scale: 0.6, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.6, rotate: 10 }}
              className="flex flex-col items-center justify-center py-2 space-y-3"
            >
              <div className={`w-20 h-20 rounded-3xl bg-gradient-to-tr ${step.color} text-white flex items-center justify-center shadow-2xl shadow-amber-500/20`}>
                <Icon size={40} />
              </div>

              <div>
                <h3 className="text-2xl font-black text-[var(--text-primary)] serif-title">
                  {step.title}
                </h3>
                <p className="text-xs font-semibold text-[var(--accent-color)] mt-0.5">
                  {step.subtitle}
                </p>
              </div>

              <p className="text-xs md:text-sm text-[var(--text-secondary)] leading-relaxed max-w-md">
                {step.description}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Dots Indicator */}
          <div className="flex items-center justify-center gap-2 pt-2">
            {TUTORIAL_STEPS.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`h-2.5 rounded-full transition-all ${
                  index === currentStep
                    ? 'w-8 bg-[var(--accent-color)]'
                    : 'w-2.5 bg-[var(--surface-border)] hover:bg-[var(--text-muted)]'
                }`}
              />
            ))}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-[var(--surface-border)]">
            
            <button
              onClick={onClose}
              className="text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              Omitir Tutorial
            </button>

            <div className="flex items-center gap-2">
              {currentStep > 0 && (
                <button
                  onClick={handlePrev}
                  className="p-3 rounded-2xl bg-[var(--pill-bg)] text-[var(--text-primary)] hover:border-[var(--accent-color)] border border-[var(--surface-border)] transition-all flex items-center gap-1 text-xs font-bold"
                >
                  <ChevronLeft size={16} />
                  <span>Anterior</span>
                </button>
              )}

              <motion.button
                whileTap={{ scale: 0.94 }}
                onClick={handleNext}
                className="px-5 py-3 rounded-2xl bg-[var(--accent-color)] text-[var(--accent-on)] font-extrabold text-xs flex items-center gap-1.5 shadow-lg hover:brightness-110"
              >
                <span>{currentStep === TUTORIAL_STEPS.length - 1 ? '¡Entendido, Empezar!' : 'Siguiente'}</span>
                {currentStep === TUTORIAL_STEPS.length - 1 ? <Check size={16} /> : <ChevronRight size={16} />}
              </motion.button>
            </div>

          </div>

        </motion.div>

      </div>
    </AnimatePresence>
  );
}
