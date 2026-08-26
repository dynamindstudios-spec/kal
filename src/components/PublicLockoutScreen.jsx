import React from 'react';
import { motion } from 'framer-motion';
import { Lock, ShieldAlert, AlertTriangle } from 'lucide-react';

export default function PublicLockoutScreen({ onGoToAdmin }) {
  return (
    <div className="fixed inset-0 z-[99999] min-h-screen bg-gradient-to-b from-[#150404] via-[#200707] to-[#0d0202] text-white flex items-center justify-center p-4 select-none backdrop-blur-2xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-lg p-8 sm:p-10 rounded-3xl bg-black/90 border-2 border-red-500/70 shadow-[0_0_70px_rgba(239,68,68,0.45)] text-center space-y-6"
      >
        {/* Candado con Resplandor Rojo Neón */}
        <div className="relative w-24 h-24 rounded-full bg-red-950/90 border-2 border-red-500 flex items-center justify-center mx-auto text-red-400 shadow-[0_0_35px_rgba(239,68,68,0.65)]">
          <Lock className="w-12 h-12 animate-pulse" />
          <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500 border border-black flex items-center justify-center shadow-md">
            <AlertTriangle className="w-3.5 h-3.5 text-black" />
          </span>
        </div>

        <div className="space-y-3">
          <span className="px-4 py-1 rounded-full bg-red-500/20 border border-red-500/50 text-red-300 text-xs uppercase tracking-widest font-black inline-block">
            Servicio Deshabilitado
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-red-400 uppercase tracking-wide">
            Falta de Pago.
          </h1>
          <p className="text-sm text-gray-300 max-w-md mx-auto leading-relaxed">
            El acceso a esta página web y a todos sus servicios ha sido suspendido temporalmente debido a la falta de registro de pago de la suscripción o desarrollo.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/30 text-left space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-red-300 uppercase tracking-wider font-bold">
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
            <span>Aviso al Administrador</span>
          </div>
          <p className="text-xs text-gray-400 leading-normal">
            Para reactivar este sitio web, por favor regularice el pago correspondiente con su proveedor de desarrollo.
          </p>
        </div>

        {onGoToAdmin && (
          <button
            type="button"
            onClick={onGoToAdmin}
            className="text-xs text-gray-500 hover:text-red-300 transition-colors cursor-pointer pt-2 inline-block underline underline-offset-4"
          >
            Acceso a panel administrativo →
          </button>
        )}
      </motion.div>
    </div>
  );
}
