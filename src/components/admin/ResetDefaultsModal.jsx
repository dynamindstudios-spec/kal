import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, RotateCcw, AlertTriangle, CheckCircle2, Eye, EyeOff, ShieldAlert } from 'lucide-react';
import { adminStore } from '../../services/adminStore';

export default function ResetDefaultsModal({ isOpen, onClose }) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!password || !password.trim()) {
      setErrorMsg('Por favor ingresa la clave de autorización.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const res = adminStore.resetAllToDefaults(password.trim());
      setIsLoading(false);
      if (res.success) {
        setSuccessMsg('¡Dashboard y métricas restablecidos a 0 exitosamente!');
        setTimeout(() => {
          setPassword('');
          setSuccessMsg('');
          setErrorMsg('');
          onClose();
          window.location.reload();
        }, 900);
      } else {
        setErrorMsg(res.message || 'Contraseña incorrecta.');
      }
    }, 300);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          className="w-full max-w-md bg-[#140e11] border border-red-500/40 text-white rounded-3xl p-6 shadow-[0_0_50px_rgba(239,68,68,0.2)] space-y-4 relative"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-red-500/20 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400">
                <RotateCcw size={20} />
              </div>
              <div>
                <h3 className="text-base font-black text-white">Restablecer Todo por Defecto</h3>
                <span className="text-[10px] text-red-300 font-bold uppercase tracking-wider">Modo de Pruebas & Fábrica</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white cursor-pointer transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Feedback Alerts */}
            {errorMsg && (
              <div className="p-3 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-bold flex items-center gap-2">
                <AlertTriangle size={16} className="shrink-0 text-red-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 size={16} className="shrink-0 text-emerald-400" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Warning Message */}
            <div className="p-3.5 rounded-2xl bg-[#1c1216] border border-red-500/20 flex items-start gap-2.5 text-xs text-gray-300">
              <ShieldAlert size={18} className="text-red-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Esta acción restaurará de forma permanente la carta, precios, categorías, filtros, videos, redes sociales, comandas, mesas y arqueos a su configuración inicial.
              </p>
            </div>

            {/* Secret Authorization Password Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300">Clave Maestra de Autorización *</label>
              <div className="relative flex items-center">
                <Lock size={16} className="absolute left-3.5 text-gray-400 pointer-events-none" />
                
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="off"
                  autoFocus
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa la clave de autorización"
                  className="w-full pl-10 pr-11 py-3 rounded-2xl bg-[#0a0709] border border-red-500/30 text-white text-xs font-mono font-bold focus:outline-none focus:border-red-400 transition-all placeholder:text-gray-600"
                />

                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 p-1 text-gray-400 hover:text-white transition-colors cursor-pointer"
                  title={showPassword ? 'Ocultar clave' : 'Ver clave'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold cursor-pointer transition-all"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-black text-xs shadow-lg shadow-red-600/30 flex items-center gap-2 cursor-pointer disabled:opacity-50 transition-all"
              >
                <RotateCcw size={14} />
                <span>{isLoading ? 'Restableciendo...' : 'Restablecer por Defecto'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
