import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  UtensilsCrossed, LogOut, Check, Search, Plus, Minus, 
  Trash2, Send, ShoppingBag
} from 'lucide-react';
import { adminStore } from '../../services/adminStore';

export default function WaiterApp({ waiterSession, onLogout, onReturnToMenu }) {
  const [selectedTable, setSelectedTable] = useState(null);
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [notes, setNotes] = useState('');
  const [step, setStep] = useState('select_table');
  const [orders, setOrders] = useState(() => adminStore.getOrders());
  const [dishes, setDishes] = useState(() => adminStore.getDishes());

  useEffect(() => {
    const unsubscribe = adminStore.subscribe(() => {
      setOrders(adminStore.getOrders());
      setDishes(adminStore.getDishes());
    });
    return () => unsubscribe();
  }, []);

  const categories = ['ALL', ...new Set(dishes.map((d) => d.category || 'Otros'))];

  const filteredDishes = dishes.filter((dish) => {
    const name = (dish.name || dish.title || '').toLowerCase();
    const cat = (dish.category || '').toLowerCase();
    const matchesSearch = name.includes(searchTerm.toLowerCase()) || cat.includes(searchTerm.toLowerCase());
    const matchesCat = activeTab === 'ALL' || dish.category === activeTab;
    return matchesSearch && matchesCat;
  });

  const handleSelectTable = (tableNum) => {
    setSelectedTable(tableNum);
    const session = adminStore.getTableSession(tableNum);
    if (session.isActive && session.items.length > 0) {
      setCart(session.items.map((it) => ({ ...it })));
    } else {
      setCart([]);
    }
    setNotes('');
    setStep('menu');
  };

  const handleAddToCart = (dish) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === dish.id);
      if (existing) {
        return prev.map((item) => (item.id === dish.id ? { ...item, quantity: (item.quantity || 1) + 1 } : item));
      }
      return [...prev, { ...dish, quantity: 1 }];
    });
  };

  const handleUpdateQty = (dishId, delta) => {
    setCart((prev) => {
      return prev.map((it) => {
        if (it.id === dishId) {
          const newQty = (it.quantity || 1) + delta;
          return newQty > 0 ? { ...it, quantity: newQty } : null;
        }
        return it;
      }).filter(Boolean);
    });
  };

  const handleRemoveItem = (dishId) => {
    setCart((prev) => prev.filter((it) => it.id !== dishId));
  };

  const cartTotal = cart.reduce((sum, it) => sum + (it.price || 0) * (it.quantity || 1), 0);
  const cartItemCount = cart.reduce((sum, it) => sum + (it.quantity || 1), 0);

  const handleSendOrder = () => {
    if (!selectedTable || cart.length === 0) return;

    adminStore.updateTableOrderItems(selectedTable, cart, waiterSession);
    setStep('success');
    setTimeout(() => {
      setStep('select_table');
      setSelectedTable(null);
      setCart([]);
      setNotes('');
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-[#090b10] text-white flex flex-col justify-between pb-10">
      
      <div className="bg-[#111420] border-b border-amber-500/20 px-4 py-3 sticky top-0 z-50 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-black">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-xs font-black uppercase text-white tracking-wider">
                {waiterSession?.name || 'Mesero en Sala'}
              </p>
            </div>
            <p className="text-[10px] text-gray-400">
              {selectedTable ? 'Mesa #' + selectedTable : 'Seleccionando Mesa'} • KAL DISCOBAR
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {step === 'menu' && (
            <button
              type="button"
              onClick={() => setStep('select_table')}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold uppercase transition-all cursor-pointer border border-white/10"
            >
              Cambiar Mesa
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              adminStore.logoutWaiter();
              onLogout?.();
            }}
            className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-all cursor-pointer"
            title="Cerrar Turno"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 space-y-6">

        {step === 'select_table' && (
          <div className="space-y-5">
            <div className="text-center space-y-1">
              <h2 className="text-xl font-black uppercase tracking-wider text-white">
                Selecciona la Mesa para Tomar Comanda
              </h2>
              <p className="text-xs text-gray-400">
                Toca cualquier mesa libre u ocupada para armar o modificar el pedido en vivo
              </p>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 sm:gap-4">
              {Array.from({ length: 15 }, (_, i) => i + 1).map((tableNum) => {
                const session = adminStore.getTableSession(tableNum);
                const isOccupied = session.isActive;

                return (
                  <motion.button
                    key={tableNum}
                    type="button"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleSelectTable(tableNum)}
                    className={'p-4 rounded-2xl border text-center transition-all cursor-pointer space-y-2 flex flex-col items-center justify-center ' + (isOccupied ? 'bg-amber-950/30 border-amber-500/60 shadow-lg shadow-amber-500/10 text-amber-300' : 'bg-[#111420] border-emerald-500/40 text-emerald-400 hover:border-emerald-400')}
                  >
                    <div className={'w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg ' + (isOccupied ? 'bg-amber-500 text-black' : 'bg-emerald-500/20 text-emerald-300')}>
                      {tableNum}
                    </div>

                    <div className="space-y-0.5">
                      <p className="text-[11px] font-black uppercase">
                        {isOccupied ? 'Ocupada' : 'Libre'}
                      </p>
                      {isOccupied && (
                        <p className="text-[10px] text-amber-200 font-bold">
                          ${session.totalCOP.toLocaleString('es-CO')}
                        </p>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}

        {step === 'menu' && (
          <div className="space-y-4">
            
            <div className="bg-[#111420] p-4 rounded-2xl border border-amber-500/30 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase">
                  Comanda en Proceso
                </span>
                <h3 className="text-lg font-black text-white uppercase">Mesa #{selectedTable}</h3>
              </div>

              {cart.length > 0 && (
                <button
                  type="button"
                  onClick={() => setStep('review')}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20 cursor-pointer flex items-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Ver Comanda ({cartItemCount}) • ${cartTotal.toLocaleString('es-CO')}</span>
                </button>
              )}
            </div>

            <div className="space-y-2.5">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar trago, botella, cerveza..."
                  className="w-full bg-[#111420] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveTab(cat)}
                    className={'px-3 py-1.5 rounded-xl text-xs font-bold uppercase whitespace-nowrap transition-all cursor-pointer ' + (activeTab === cat ? 'bg-amber-400 text-black shadow-md shadow-amber-400/20' : 'bg-[#111420] text-gray-400 border border-white/10 hover:text-white')}
                  >
                    {cat === 'ALL' ? 'Todos' : cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredDishes.map((dish) => {
                const inCartItem = cart.find((it) => it.id === dish.id);
                const qty = inCartItem?.quantity || 0;

                return (
                  <div
                    key={dish.id}
                    className="p-3.5 rounded-2xl bg-[#111420] border border-white/10 flex items-center justify-between gap-3 hover:border-amber-500/40 transition-all"
                  >
                    <div className="space-y-1 flex-1 min-w-0">
                      <p className="font-bold text-white text-xs truncate">{dish.name || dish.title}</p>
                      <p className="text-[11px] font-black text-amber-400">${(dish.price || 0).toLocaleString('es-CO')}</p>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {qty > 0 ? (
                        <div className="flex items-center gap-1.5 bg-[#181b28] p-1 rounded-xl border border-white/10">
                          <button
                            type="button"
                            onClick={() => handleUpdateQty(dish.id, -1)}
                            className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 flex items-center justify-center cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-black text-white w-4 text-center">{qty}</span>
                          <button
                            type="button"
                            onClick={() => handleUpdateQty(dish.id, 1)}
                            className="w-7 h-7 rounded-lg bg-amber-500 hover:bg-amber-400 text-black flex items-center justify-center cursor-pointer font-bold"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleAddToCart(dish)}
                          className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Agregar</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {step === 'review' && (
          <div className="max-w-xl mx-auto space-y-5 bg-[#111420] border border-amber-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase">
                  Revisión de Comanda
                </span>
                <h2 className="text-xl font-black uppercase text-white">Mesa #{selectedTable}</h2>
              </div>
              <button
                type="button"
                onClick={() => setStep('menu')}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold uppercase transition-all cursor-pointer"
              >
                + Agregar Más
              </button>
            </div>

            <div className="space-y-2 divide-y divide-white/5">
              {cart.map((item) => (
                <div key={item.id} className="pt-2 flex items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <p className="font-bold text-white truncate">{item.name || item.title}</p>
                    <p className="text-[10px] text-gray-400">${(item.price || 0).toLocaleString('es-CO')} c/u</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 bg-[#181b28] p-1 rounded-xl border border-white/10">
                      <button
                        type="button"
                        onClick={() => handleUpdateQty(item.id, -1)}
                        className="w-6 h-6 rounded-lg bg-white/5 text-gray-300 flex items-center justify-center cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-black text-white w-4 text-center">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => handleUpdateQty(item.id, 1)}
                        className="w-6 h-6 rounded-lg bg-amber-500 text-black flex items-center justify-center cursor-pointer font-bold"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="font-black text-amber-400 w-20 text-right">
                      ${((item.price || 0) * (item.quantity || 1)).toLocaleString('es-CO')}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-1 text-gray-500 hover:text-red-400 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-bold text-gray-300 uppercase">Observaciones de la Mesa</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ej: Tragos sin hielo, botella fría para brindar"
                className="w-full bg-[#181b28] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between">
              <span className="text-xs text-gray-400 font-bold uppercase">Total a Cargar a la Mesa:</span>
              <span className="text-xl font-black text-amber-400">${cartTotal.toLocaleString('es-CO')} COP</span>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep('menu')}
                className="flex-1 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-300 font-bold text-xs uppercase transition-all cursor-pointer"
              >
                Volver
              </button>

              <button
                type="button"
                onClick={handleSendOrder}
                className="flex-2 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-black font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/20 cursor-pointer flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Confirmar & Enviar Comanda</span>
              </button>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="max-w-md mx-auto py-16 text-center space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-400 shadow-xl shadow-emerald-500/20"
            >
              <Check className="w-10 h-10" />
            </motion.div>
            <h2 className="text-2xl font-black uppercase text-white">¡Comanda Enviada con Éxito!</h2>
            <p className="text-xs text-gray-400">
              La orden para la Mesa #{selectedTable} ya está visible en barra y cocina en el Dashboard central.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
