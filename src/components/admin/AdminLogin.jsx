import React, { useState } from 'react';
import { Lock, Crown, ArrowRight, AlertCircle, ArrowLeft, ShieldCheck, Sparkles, Eye, EyeOff } from 'lucide-react';
import { adminStore } from '../../services/adminStore';
import { RESTAURANT_DATA } from '../../data/menuData';

export default function AdminLogin({ onLoginSuccess, onReturnToMenu }) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    setError('');

    if (!password || !password.trim()) {
      setError('Por favor ingresa la contraseña.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const res = adminStore.login(password.trim());
      setIsLoading(false);
      if (res.success) {
        onLoginSuccess();
      } else {
        setError('Contraseña incorrecta. Verifica e intenta nuevamente.');
      }
    }, 200);
  };

  return (
    <div className="min-h-screen w-full bg-[#08090d] text-white flex flex-col items-center justify-center p-4 relative font-sans select-none">
      
      {/* Ambient Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Return to Digital Menu */}
      <button
        type="button"
        onClick={onReturnToMenu}
        className="absolute top-6 left-6 flex items-center gap-2 text-xs font-bold text-gray-300 hover:text-white bg-white/10 hover:bg-white/15 px-4 py-2.5 rounded-2xl border border-white/20 transition-all cursor-pointer shadow-lg z-30"
      >
        <ArrowLeft size={16} />
        <span>Volver a la Carta Digital</span>
      </button>

      {/* Login Card */}
      <div className="w-full max-w-sm bg-[#121520] border-2 border-amber-500/30 rounded-3xl p-7 shadow-[0_0_50px_rgba(0,0,0,0.8)] space-y-6 relative z-20">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/20">
            <Crown size={30} className="text-amber-400" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-wider">{RESTAURANT_DATA.name}</h2>
            <span className="text-xs font-black text-amber-400 tracking-wide uppercase">
              Panel Administrativo VIP
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Error Alert */}
          {error && (
            <div className="p-3 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-bold flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* User Field (Fixed Admin) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-300">Usuario</label>
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#181d2c] border border-amber-500/40 text-amber-400">
              <span className="text-xl">👑</span>
              <span className="font-extrabold text-sm text-amber-300 font-mono">admin</span>
            </div>
          </div>

          {/* Password Field (Manual Entry Only) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-300">Contraseña de Acceso</label>
            <div className="relative flex items-center">
              <Lock size={16} className="absolute left-3.5 text-gray-400 pointer-events-none" />
              
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="off"
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa la contraseña"
                className="w-full pl-10 pr-11 py-3.5 rounded-2xl bg-[#0a0c12] border border-[#2e3448] text-white text-xs font-mono font-bold focus:outline-none focus:border-amber-400 transition-all placeholder:text-gray-500 shadow-inner"
              />

              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 p-1.5 text-gray-400 hover:text-white transition-colors cursor-pointer"
                title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-black font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30 hover:brightness-110 active:scale-98 transition-all cursor-pointer disabled:opacity-50 mt-2"
          >
            <Sparkles size={16} />
            <span>{isLoading ? 'Verificando...' : 'Entrar al Dashboard'}</span>
            <ArrowRight size={16} strokeWidth={3} />
          </button>
        </form>

        {/* Security Footer */}
        <div className="pt-2 border-t border-[#1d2230] text-center text-[10px] text-gray-400 flex items-center justify-center gap-1.5">
          <ShieldCheck size={13} className="text-emerald-400" />
          <span>Acceso cifrado para gerencia de KAL DISCOBAR</span>
        </div>
      </div>
    </div>
  );
}
