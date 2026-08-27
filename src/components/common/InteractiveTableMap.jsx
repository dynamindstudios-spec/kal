import React, { useState } from 'react';
import { Lock, Check, Map, Grid } from 'lucide-react';
import { adminStore } from '../../services/adminStore';

// Mathematical table centers aligned with new public/mesas.jpg layout
const TABLE_POSITIONS = [
  // Fila 1 (5 mesas superiores)
  { num: 1, x: 12.5, y: 18.0 },
  { num: 2, x: 31.5, y: 18.5 },
  { num: 3, x: 50.0, y: 18.5 },
  { num: 4, x: 68.5, y: 18.5 },
  { num: 5, x: 87.5, y: 18.5 },
  // Fila 2 (5 zonas intermedias / VIP)
  { num: 6, x: 12.5, y: 50.0 },
  { num: 7, x: 31.5, y: 50.0 },
  { num: 8, x: 50.0, y: 50.0 }, // Zona Central Lounge VIP
  { num: 9, x: 68.5, y: 50.0 },
  { num: 10, x: 87.5, y: 50.0 }, // Suite VIP Circular
  // Fila 3 (5 mesas inferiores)
  { num: 11, x: 12.5, y: 79.0 },
  { num: 12, x: 31.5, y: 79.5 },
  { num: 13, x: 50.0, y: 79.0 },
  { num: 14, x: 68.5, y: 79.5 },
  { num: 15, x: 87.5, y: 79.0 }
];

export default function InteractiveTableMap({
  selectedTable = null,
  selectedTables = null, // Array for multi-select (e.g. reservations)
  onSelectTable,
  isWaiter = false,
  allowLockedSelection = false,
  multiSelect = false
}) {
  const [viewMode, setViewMode] = useState('map'); // 'map' | 'grid'

  const isTableSelected = (num) => {
    if (multiSelect && Array.isArray(selectedTables)) {
      return selectedTables.includes(num);
    }
    return selectedTable === num;
  };

  const handleTableClick = (tableNum, isLocked) => {
    if (isLocked && !allowLockedSelection && !isWaiter) {
      return;
    }
    onSelectTable(tableNum);
  };

  return (
    <div className="space-y-2.5 font-sans w-full select-none">
      {/* Header controls: Switch between Plano VIP and Cuadrícula */}
      <div className="flex items-center justify-between pb-0.5">
        <span className="text-xs font-black uppercase text-gray-300 tracking-wider flex items-center gap-1.5">
          <span>📍</span>
          <span>Plano de Mesas</span>
        </span>

        <div className="flex items-center p-0.5 rounded-xl bg-black/60 border border-white/10 text-[10px] font-bold">
          <button
            type="button"
            onClick={() => setViewMode('map')}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all cursor-pointer ${
              viewMode === 'map'
                ? 'bg-amber-500 text-black shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Map size={11} />
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
            <Grid size={11} />
            <span>Cuadrícula</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: MAPA / PLANO INTERACTIVO CON NUEVA IMAGEN mesas.jpg */}
      {viewMode === 'map' ? (
        <div className="relative w-full rounded-2xl overflow-hidden border border-white/10 bg-[#07080c] shadow-2xl">
          {/* Background Floor Plan Image */}
          <div className="relative w-full aspect-[16/9] sm:aspect-[16/9]">
            <img
              src="/mesas.jpg"
              alt="Plano de Mesas KAL Discobar"
              className="w-full h-full object-cover filter brightness-95"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

            {/* Interactive Pins Overlay */}
            {TABLE_POSITIONS.map((tbl) => {
              const isSelected = isTableSelected(tbl.num);
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
                  <button
                    type="button"
                    onClick={() => handleTableClick(tbl.num, isLocked)}
                    className={`relative flex items-center justify-center transition-all cursor-pointer group ${
                      isLocked ? 'cursor-not-allowed opacity-80' : ''
                    }`}
                  >
                    {/* Compact Table Button Node with Crisp Glowing Border */}
                    <div
                      className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center font-mono font-black text-[10px] sm:text-[11px] transition-all duration-150 ${
                        isSelected
                          ? 'bg-amber-400 text-black border-2 border-white ring-2 ring-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.9)] scale-110 z-20'
                          : isLocked
                          ? 'bg-red-950/90 text-red-300 border border-red-500/70 shadow-[0_0_6px_rgba(239,68,68,0.4)]'
                          : hasOrders
                          ? 'bg-[#0f172a] text-cyan-300 border border-cyan-400/80 shadow-[0_0_6px_rgba(34,211,238,0.5)] hover:border-cyan-300'
                          : 'bg-[#141724]/90 text-white border border-white/30 hover:border-amber-400 hover:text-amber-300 hover:scale-105 shadow-black/80'
                      }`}
                    >
                      {isLocked ? (
                        <Lock size={10} className="text-red-400" />
                      ) : isSelected ? (
                        <Check size={11} strokeWidth={3.5} />
                      ) : (
                        <span>{tbl.num}</span>
                      )}
                    </div>

                    {/* Badge Indicator: Occupied comanda */}
                    {hasOrders && !isSelected && !isLocked && (
                      <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-cyan-400 ring-1 ring-black animate-ping" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Clean Legend at bottom of map */}
          <div className="px-3 py-1.5 bg-[#090b12] border-t border-white/10 flex items-center justify-between text-[9px] text-gray-400 flex-wrap gap-1.5">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-gray-300">
                <span className="w-2 h-2 rounded-full bg-white/30 border border-white/50 inline-block" />
                <span>Disponible</span>
              </span>
              <span className="flex items-center gap-1 text-cyan-300">
                <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
                <span>Ocupada</span>
              </span>
              <span className="flex items-center gap-1 text-amber-300">
                <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                <span>Elegida</span>
              </span>
              <span className="flex items-center gap-1 text-red-400">
                <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                <span>Bloqueada</span>
              </span>
            </div>
            <span className="text-[9px] text-gray-500">
              Mesas 1 al 15
            </span>
          </div>
        </div>
      ) : (
        /* VIEW 2: CUADRÍCULA DE MESAS ALTERNATIVA */
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 max-h-48 overflow-y-auto p-1">
          {Array.from({ length: 15 }, (_, i) => i + 1).map((num) => {
            const isSelected = isTableSelected(num);
            const isLocked = adminStore.isTableLocked(num);
            const session = adminStore.getTableSession(num);
            const hasOrders = session && session.isActive && session.items && session.items.length > 0;

            return (
              <button
                key={num}
                type="button"
                onClick={() => handleTableClick(num, isLocked)}
                className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 text-black border-amber-400 font-black shadow-md shadow-amber-500/20'
                    : isLocked
                    ? 'bg-red-950/40 text-red-400 border-red-500/30 opacity-70 cursor-not-allowed'
                    : hasOrders
                    ? 'bg-[#15233b] text-cyan-300 border-cyan-500/50'
                    : 'bg-[#131520] text-gray-300 border-white/10 hover:border-amber-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-1">
                  {isLocked ? <Lock size={10} /> : null}
                  <span className="font-mono text-xs font-black">M#{num}</span>
                </div>
                <span className="text-[8px] truncate max-w-full">
                  {isLocked ? 'Bloqueada' : isSelected ? 'Elegida' : hasOrders ? 'Ocupada' : 'Libre'}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
