import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Key, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { adminStore } from '../../services/adminStore';

export default function ChangePasswordModal({
  isOpen,
  onClose
}) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!oldPassword) {
      setErrorMsg('Ingresa tu contraseña actual.');
      return;
    }
    if (!newPassword || newPassword.length < 4) {
      setErrorMsg('La nueva contraseña debe tener al menos 4 caracteres.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('Las dos nuevas contraseñas no coinciden.');
      return;
    }

    const result = adminStore.changePassword(oldPassword, newPassword);
    if (result.success) {
      setSuccessMsg('¡Contraseña actualizada exitosamente!');
      setTimeout(() => {
        setSuccessMsg('');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        onClose();
      }, 1400);
    } else {
      setErrorMsg(result.message || 'Error al cambiar contraseña.');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.92 }}
          className="w-full max-w-md bg-[#12141c] border border-[#262a38] text-white rounded-3xl p-6 shadow-2xl space-y-4"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#262a38] pb-3">
            <div className="flex items-center gap-2.5 text-amber-400">
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
                <Key size={18} />
              </div>
              <div>
                <h3 className="text-base font-black text-white leading-tight">Cambiar Contraseña de Panel</h3>
                <span className="text-[10px] text-gray-400">Acceso Administrativo VIP</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Feedback Alerts */}
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-bold flex items-center gap-2"
              >
                <AlertCircle size={16} className="shrink-0" />
                <span>{errorMsg}</span>
              </motion.div>
            )}

            {successMsg && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2"
              >
                <CheckCircle2 size={16} className="shrink-0" />
                <span>{successMsg}</span>
              </motion.div>
            )}

            {/* Input 1: Old Password */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-300">Contraseña Actual</label>
              <div className="relative flex items-center">
                <Lock size={15} className="absolute left-3 text-gray-500" />
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Ingresa la contraseña actual"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#0a0c11] border border-[#262a38] text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Input 2: New Password */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-300">Nueva Contraseña</label>
              <div className="relative flex items-center">
                <Key size={15} className="absolute left-3 text-gray-500" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Nueva contraseña (min 4 caracteres)"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#0a0c11] border border-[#262a38] text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Input 3: Repeat New Password */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-300">Repetir Nueva Contraseña</label>
              <div className="relative flex items-center">
                <Key size={15} className="absolute left-3 text-gray-500" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repite la nueva contraseña"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#0a0c11] border border-[#262a38] text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-[#262a38] flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-[#1a1e2b] text-gray-400 hover:text-white text-xs font-bold transition-all cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-amber-500 text-black font-black text-xs hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                Guardar Contraseña
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
