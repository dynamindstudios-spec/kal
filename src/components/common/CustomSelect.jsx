import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CustomSelect({
  value,
  onChange,
  options = [],
  placeholder = 'Seleccionar opción...',
  searchable = false,
  className = '',
  disabled = false
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = searchable
    ? options.filter((opt) => {
        const label = typeof opt === 'string' ? opt : (opt.label || opt.name || opt.value || '');
        return label.toLowerCase().includes(searchTerm.toLowerCase());
      })
    : options;

  const selectedOption = options.find((opt) => {
    const optVal = typeof opt === 'string' ? opt : opt.value;
    return optVal === value;
  });

  const selectedLabel = selectedOption
    ? (typeof selectedOption === 'string' ? selectedOption : selectedOption.label || selectedOption.name)
    : placeholder;

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all text-left cursor-pointer border ${
          isOpen
            ? 'bg-[#181c2b] border-amber-400 text-white shadow-[0_0_15px_rgba(245,158,11,0.15)]'
            : 'bg-[#141622] hover:bg-[#1a1d2d] border-white/10 text-gray-200 hover:border-white/20'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <span className={`truncate ${!selectedOption ? 'text-gray-500' : 'text-white font-bold'}`}>
          {selectedLabel}
        </span>
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform duration-200 shrink-0 ml-2 ${
            isOpen ? 'rotate-180 text-amber-400' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-full mt-1.5 z-[999999] bg-[#121420] border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl max-h-60 flex flex-col"
          >
            {searchable && (
              <div className="p-2 border-b border-white/10 shrink-0">
                <div className="relative">
                  <Search size={14} className="text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar..."
                    autoFocus
                    className="w-full bg-[#181b28] border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            )}

            <div className="overflow-y-auto p-1.5 space-y-1 scrollbar-thin scrollbar-thumb-amber-500/20">
              {filteredOptions.length === 0 ? (
                <div className="p-3 text-center text-xs text-gray-500">
                  No se encontraron opciones
                </div>
              ) : (
                filteredOptions.map((opt, idx) => {
                  const optVal = typeof opt === 'string' ? opt : opt.value;
                  const optLabel = typeof opt === 'string' ? opt : (opt.label || opt.name);
                  const isSelected = optVal === value;
                  const subtitle = typeof opt === 'object' ? opt.subtitle : null;

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        onChange(optVal);
                        setIsOpen(false);
                        setSearchTerm('');
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                          : 'hover:bg-white/5 text-gray-300 hover:text-white'
                      }`}
                    >
                      <div className="flex flex-col truncate pr-2">
                        <span className="truncate">{optLabel}</span>
                        {subtitle && <span className="text-[10px] text-gray-500">{subtitle}</span>}
                      </div>
                      {isSelected && <Check size={14} className="text-amber-400 shrink-0" />}
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
