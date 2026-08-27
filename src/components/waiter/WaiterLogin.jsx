import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { KeyRound, ArrowRight, UtensilsCrossed } from 'lucide-react';
import { adminStore } from '../../services/adminStore';

export default function WaiterLogin({ onLoginSuccess, onReturnToMenu }) {
  const [waiters] = useState(() => adminStore.getWaiters());
  const [selectedWaiterId, setSelectedWaiterId] = useState(waiters[0]?.id || 'mesero-1');
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    const res = adminStore.loginWaiter(selectedWaiterId, pin);
    if (res.success) {
      onLoginSuccess?.(res.waiter);
    } else {
      setErrorMsg(res.message || 'PIN incorrecto (PIN predeterminado: 1234)');
    }
  };

  return (
    <div className="min-h-screen bg-[#090b10] text-white flex flex-col justify-center items-center p-4 relative selection:bg-amber-500 selection:text-black">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md bg-[#111420] border border-amber-500/30 rounded-3xl p-7 sm:p-8 space-y-6 shadow-2xl relative z-10"
      >
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center mx-auto text-amber-400 shadow-lg shadow-amber-500/10">
            <UtensilsCrossed className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black uppercase text-white tracking-wider">
            Portal de Meseros
          </h1>
          <p className="text-xs text-gray-400">
            KAL DISCOBAR • Toma de comandas rápida para servicio en sala
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs font-bold text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
              Seleccionar Mesero / Staff
            </label>
            <div className="grid grid-cols-2 gap-2">
              {waiters.map((w) => (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => setSelectedWaiterId(w.id)}
                  className={'p-3 rounded-2xl border text-left transition-all cursor-pointer ' + (selectedWaiterId === w.id ? 'bg-amber-500/20 border-amber-400 text-white shadow-md shadow-amber-500/10' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white')}
                >
                  <p className="text-xs font-black truncate">{w.name}</p>
                  <p className="text-[10px] text-gray-500">{w.code || 'Staff'}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
              PIN de Acceso Rápido
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                inputMode="numeric"
                maxLength="6"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Ingresa tu PIN (Predeterminado: 1234)"
                required
                className="w-full bg-[#181b28] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-amber-400 placeholder-gray-500 focus:outline-none focus:border-amber-400 font-black tracking-widest text-center"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Iniciar Turno de Servicio</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={onReturnToMenu}
            className="text-xs text-gray-400 hover:text-amber-400 transition-colors cursor-pointer"
          >
            ← Volver a la Carta Principal
          </button>
        </div>
      </motion.div>
    </div>
  );
}
