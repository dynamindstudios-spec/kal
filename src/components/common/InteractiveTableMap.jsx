import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Check, UtensilsCrossed, Sparkles, Map, Grid, User } from 'lucide-react';
import { adminStore } from '../../services/adminStore';

// Exact proportional coordinates matching public/mesas.jpg
const TABLE_POSITIONS = [
  // Fila 1 (5 mesas superiores)
  { num: 1, x: 16, y: 22, label: 'Mesa 1' },
  { num: 2, x: 33, y: 22, label: 'Mesa 2' },
  { num: 3, x: 50, y: 22, label: 'Mesa 3' },
  { num: 4, x: 67, y: 22, label: 'Mesa 4' },
  { num: 5, x: 84, y: 22, label: 'Mesa 5' },
  // Fila 2 (5 mesas intermedias)
  { num: 6, x: 16, y: 45, label: 'Mesa 6' },
  { num: 7, x: 33, y: 45, label: 'Mesa 7' },
  { num: 8, x: 50, y: 45, label: 'Mesa 8' },
  { num: 9, x: 67, y: 45, label: 'Mesa 9' },
  { num: 10, x: 84, y: 45, label: 'Mesa 10' },
  // Fila 3 (3 mesas en L)
  { num: 11, x: 16, y: 68, label: 'Mesa 11' },
  { num: 12, x: 35, y: 70, label: 'Mesa 12' },
  { num: 13, x: 50, y: 68, label: 'Mesa 13' },
  // Fila 4 (Esquina inferior)
  { num: 14, x: 16, y: 88, label: 'Mesa 14' },
  { num: 15, x: 50, y: 88, label: 'Mesa 15 / VIP' }
];

export default function InteractiveTableMap({
  selectedTable,
  onSelectTable,
  isWaiter = false,
  allowLockedSelection = false
}) {
  const [viewMode, setViewMode] = useState('map'); // 'map' | 'grid'
  const [hoveredTable, setHoveredTable] = useState(null);

  const handleTableClick = (tableNum, isLocked) => {
    if (isLocked && !allowLockedSelection && !isWaiter) {
      return;
    }
    onSelectTable(tableNum);
  };

  return (
    <div className="space-y-3 font-sans w-full">
      {/* Header controls: Switch between Plano VIP and Cuadrícula */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-black uppercase text-amber-400 tracking-wider">
            📍 Selecciona tu Ubicación
          </span>
          {selectedTable && (
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold">
              Mesa #{selectedTable}
            </span>
          )}
        </div>

        <div className="flex items-center p-0.5 rounded-xl bg-black/50 border border-white/10 text-[11px] font-bold">
          <button
            type="button"
            onClick={() => setViewMode('map')}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all cursor-pointer ${
              viewMode === 'map'
                ? 'bg-amber-500 text-black shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Map size={12} />
            <span>Plano VIP</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-amber-500 text-black shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Grid size={12} />
            <span>Cuadrícula</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: MAPA / PLANO INTERACTIVO CON mesas.jpg */}
      {viewMode === 'map' ? (
        <div className="relative w-full rounded-2xl overflow-hidden border border-white/10 bg-[#0a0a0f] shadow-2xl select-none">
          {/* Background Floor Plan Image */}
          <div className="relative w-full aspect-[4/3] sm:aspect-[16/11]">
            <img
              src="/mesas.jpg"
              alt="Plano de Mesas KAL Discobar"
              className="w-full h-full object-cover opacity-90 filter brightness-95"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

            {/* Interactive Pins Overlay */}
            {TABLE_POSITIONS.map((tbl) => {
              const isSelected = selectedTable === tbl.num;
              const isLocked = adminStore.isTableLocked(tbl.num);
              const session = adminStore.getTableSession(tbl.num);
              const hasOrders = session && session.isActive && session.items && session.items.length > 0;

              return (
                <div
                  key={tbl.num}
                  style={{
                    position: 'absolute',
                    left: `${tbl.x}%`,
                    top: `${tbl.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  className="z-10"
                >
                  <motion.button
                    type="button"
                    whileHover={{ scale: isLocked ? 1.05 : 1.18 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => handleTableClick(tbl.num, isLocked)}
                    onMouseEnter={() => setHoveredTable(tbl.num)}
                    onMouseLeave={() => setHoveredTable(null)}
                    className={`relative group flex items-center justify-center transition-all cursor-pointer ${
                      isLocked ? 'cursor-not-allowed opacity-75' : ''
                    }`}
                  >
                    {/* Pulsing halo when selected */}
                    {isSelected && (
                      <motion.div
                        layoutId="activeMapTableGlow"
                        initial={{ scale: 0.8, opacity: 0.8 }}
                        animate={{ scale: [1, 1.35, 1], opacity: [0.9, 0.4, 0.9] }}
                        transition={{ repeat: Infinity, duration: 1.8 }}
                        className="absolute -inset-3 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 blur-sm pointer-events-none"
                      />
                    )}

                    {/* Table Button Node */}
                    <div
                      className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full flex flex-col items-center justify-center font-mono font-black text-[10px] sm:text-xs transition-all shadow-lg border-2 ${
                        isSelected
                          ? 'bg-amber-500 text-black border-white shadow-amber-500/80 ring-4 ring-amber-400/40 z-20'
                          : isLocked
                          ? 'bg-red-950/90 text-red-300 border-red-500/80 shadow-red-500/30'
                          : hasOrders
                          ? 'bg-[#15233b] text-cyan-300 border-cyan-400/80 shadow-cyan-500/30'
                          : 'bg-[#121420]/90 text-white border-white/30 hover:border-amber-400 hover:text-amber-300 shadow-black/80'
                      }`}
                    >
                      {isLocked ? (
                        <Lock size={12} className="text-red-400" />
                      ) : isSelected ? (
                        <Check size={14} strokeWidth={3.5} />
                      ) : (
                        <span>{tbl.num}</span>
                      )}
                    </div>

                    {/* Badge Indicator: Occupied or Locked */}
                    {hasOrders && !isSelected && !isLocked && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 ring-2 ring-black animate-ping" />
                    )}

                    {/* Floating Tooltip info on hover / selection */}
                    {(hoveredTable === tbl.num || isSelected) && (
                      <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 pointer-events-none z-30 whitespace-nowrap px-2 py-0.5 rounded-md bg-black/90 border border-white/20 text-[9px] font-bold text-white shadow-xl backdrop-blur-md">
                        {isLocked ? (
                          <span className="text-red-400">🔒 Bloqueada</span>
                        ) : isSelected ? (
                          <span className="text-amber-400">✨ Seleccionada (#{tbl.num})</span>
                        ) : hasOrders ? (
                          <span className="text-cyan-300">
                            {isWaiter ? `$${Number(session.totalCOP).toLocaleString('es-CO')}` : 'Ocupada'}
                          </span>
                        ) : (
                          <span>Mesa #{tbl.num}</span>
                        )}
                      </div>
                    )}
                  </motion.button>
                </div>
              );
            })}
          </div>

          {/* Quick Legend at bottom of map */}
          <div className="px-3 py-2 bg-[#0d0f1a] border-t border-white/10 flex items-center justify-between text-[10px] text-gray-400 flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-gray-300">
                <span className="w-2.5 h-2.5 rounded-full bg-white/20 border border-white/40 inline-block" />
                <span>Disponible</span>
              </span>
              <span className="flex items-center gap-1 text-cyan-300">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" />
                <span>Ocupada / Comanda</span>
              </span>
              <span className="flex items-center gap-1 text-red-400">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
                <span>Bloqueada</span>
              </span>
            </div>
            <span className="text-[9px] text-amber-400/80 italic">
              💡 Toca el número de tu mesa en el plano
            </span>
          </div>
        </div>
      ) : (
        /* VIEW 2: CUADRÍCULA DE MESAS ALTERNATIVA */
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 max-h-56 overflow-y-auto p-1">
          {Array.from({ length: 15 }, (_, i) => i + 1).map((num) => {
            const isSelected = selectedTable === num;
            const isLocked = adminStore.isTableLocked(num);
            const session = adminStore.getTableSession(num);
            const hasOrders = session && session.isActive && session.items && session.items.length > 0;

            return (
              <motion.button
                key={num}
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={() => handleTableClick(num, isLocked)}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 text-black border-amber-400 font-black shadow-lg shadow-amber-500/20'
                    : isLocked
                    ? 'bg-red-950/40 text-red-400 border-red-500/30 opacity-70 cursor-not-allowed'
                    : hasOrders
                    ? 'bg-[#15233b] text-cyan-300 border-cyan-500/50'
                    : 'bg-[#131520] text-gray-300 border-white/10 hover:border-amber-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-1">
                  {isLocked ? <Lock size={12} /> : null}
                  <span className="font-mono text-xs font-black">M#{num}</span>
                </div>
                <span className="text-[9px] truncate max-w-full">
                  {isLocked ? 'Bloqueada' : isSelected ? 'Elegida' : hasOrders ? 'Ocupada' : 'Libre'}
                </span>
              </motion.button>
            );
          })}
        </div>
      )}
    </div>
  );
}
