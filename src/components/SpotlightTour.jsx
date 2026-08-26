import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, X } from 'lucide-react';

const SPOTLIGHT_STEPS = [
  {
    step: 1,
    elementId: "spotlight-step-navbar",
    title: "Paso 1 de 3: Barra de Navegación",
    subtitle: "Controles & Configuraciones",
    description: "En la barra superior puedes acceder a este tutorial (?), cambiar el Tema de color, elegir tu Moneda, cambiar el Idioma o abrir el panel de Ajustes.",
    badge: "1. Navbar & Ajustes"
  },
  {
    step: 2,
    elementId: "spotlight-step-filters",
    title: "Paso 2 de 3: Panel de Filtros",
    subtitle: "Buscador, Dietas & Alérgenos",
    description: "Busca platillos por nombre y filtra según tus necesidades dietéticas (Vegetariano, Vegano, Sin Gluten) o desglosa la lista de alérgenos.",
    badge: "2. Buscador & Filtros"
  },
  {
    step: 3,
    elementId: "spotlight-step-categories",
    title: "Paso 3 de 3: Categorías del Menú",
    subtitle: "Navega entre Secciones",
    description: "Selecciona entre las distintas categorías (Pastas, Entrantes, Postres, Bebidas) o elige 'Crea tu Pasta/Pizza' para armar tu propia receta.",
    badge: "3. Categorías de la Carta"
  }
];

export default function SpotlightTour({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [rect, setRect] = useState(null);

  useEffect(() => {
    if (!isOpen) return;

    const measureTarget = () => {
      const stepObj = SPOTLIGHT_STEPS[currentStep];
      const el = document.getElementById(stepObj.elementId);
      if (el) {
        if (currentStep === 0) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        setTimeout(() => {
          const r = el.getBoundingClientRect();
          setRect({
            top: r.top - 6,
            left: r.left - 6,
            width: r.width + 12,
            height: r.height + 12
          });
        }, 150);
      }
    };

    measureTarget();
    window.addEventListener('resize', measureTarget);
    window.addEventListener('scroll', measureTarget);

    return () => {
      window.removeEventListener('resize', measureTarget);
      window.removeEventListener('scroll', measureTarget);
    };
  }, [isOpen, currentStep]);

  if (!isOpen) return null;

  const currentObj = SPOTLIGHT_STEPS[currentStep];

  const handleNextStep = () => {
    if (currentStep < SPOTLIGHT_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  // Card dynamic positioning helper
  const getCardStyle = () => {
    if (!rect) return { top: '30%', left: '50%', transform: 'translate(-50%, -50%)' };

    const isDesktop = window.innerWidth >= 768;

    if (currentStep === 0) {
      return {
        top: `${Math.min(window.innerHeight - 260, rect.top + rect.height + 16)}px`,
        left: '50%',
        transform: 'translateX(-50%)'
      };
    }

    if (currentStep === 1) {
      if (isDesktop && rect.left + rect.width + 380 <= window.innerWidth) {
        return {
          top: `${Math.max(80, Math.min(window.innerHeight - 300, rect.top))}px`,
          left: `${rect.left + rect.width + 16}px`
        };
      }
      return {
        top: `${Math.min(window.innerHeight - 260, rect.top + rect.height + 16)}px`,
        left: '50%',
        transform: 'translateX(-50%)'
      };
    }

    // Step 3 (Categories)
    return {
      top: `${Math.min(window.innerHeight - 260, rect.top + rect.height + 16)}px`,
      left: '50%',
      transform: 'translateX(-50%)'
    };
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden select-none pointer-events-auto">
        
        {/* Transparent Backdrop with Click-to-Next */}
        <div 
          className="absolute inset-0 bg-transparent cursor-pointer"
          onClick={handleNextStep}
        />

        {/* Dynamic Highlight Spotlight Box with exact target bounding rect & 9999px cutout shadow */}
        {rect && (
          <motion.div
            key={`spotlight-${currentStep}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
            style={{
              position: 'fixed',
              top: `${Math.max(2, rect.top)}px`,
              left: `${Math.max(2, rect.left)}px`,
              width: `${rect.width}px`,
              height: `${rect.height}px`
            }}
            className="z-50 rounded-3xl border-2 border-[var(--accent-color)] pointer-events-none shadow-[0_0_0_9999px_rgba(0,0,0,0.78)] transition-all duration-300"
          >
            <div className="absolute -top-3 left-4 px-3 py-0.5 rounded-full bg-[var(--accent-color)] text-[var(--accent-on)] font-black text-[10px] uppercase tracking-widest shadow-md">
              {currentObj.badge}
            </div>
          </motion.div>
        )}

        {/* Interactive Floating Card */}
        <div 
          style={getCardStyle()}
          className="fixed z-[60] w-full max-w-sm sm:max-w-md p-2 transition-all duration-300"
        >
          <motion.div
            key={`card-${currentStep}`}
            initial={{ opacity: 0, y: 15, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.92 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            className="p-5 sm:p-6 rounded-3xl glass-panel border border-[var(--surface-border)] bg-[var(--bg-color)] shadow-2xl space-y-3.5 text-center"
          >
            {/* Header Badge */}
            <div className="flex items-center justify-between border-b border-[var(--surface-border)] pb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-[var(--accent-color)]">
                Guía de Inicio Interactiva
              </span>
              <button
                onClick={onClose}
                className="p-1 rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                title="Omitir Guía"
              >
                <X size={16} />
              </button>
            </div>

            {/* Title & Subtitle */}
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-black text-[var(--text-primary)] serif-title leading-snug">
                {currentObj.title}
              </h3>
              <p className="text-xs font-bold text-[var(--accent-color)]">
                {currentObj.subtitle}
              </p>
            </div>

            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              {currentObj.description}
            </p>

            {/* Step Indicators & Action Button */}
            <div className="pt-3 border-t border-[var(--surface-border)] flex items-center justify-between">
              
              {/* Dots */}
              <div className="flex items-center gap-1.5">
                {SPOTLIGHT_STEPS.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-2 rounded-full transition-all ${
                      idx === currentStep ? 'w-6 bg-[var(--accent-color)]' : 'w-2 bg-[var(--surface-border)]'
                    }`}
                  />
                ))}
              </div>

              {/* Click to Next Step */}
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={handleNextStep}
                className="px-4 py-2 rounded-2xl bg-[var(--accent-color)] text-[var(--accent-on)] font-black text-xs flex items-center gap-1.5 shadow-xl hover:brightness-110"
              >
                <span>{currentStep === SPOTLIGHT_STEPS.length - 1 ? '¡Entendido!' : 'Siguiente'}</span>
                {currentStep === SPOTLIGHT_STEPS.length - 1 ? <Check size={16} /> : <ArrowRight size={16} />}
              </motion.button>

            </div>

          </motion.div>
        </div>

      </div>
    </AnimatePresence>
  );
}
