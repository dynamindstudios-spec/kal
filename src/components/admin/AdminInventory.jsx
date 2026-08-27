import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Boxes, Wine, Plus, Search, AlertTriangle, ArrowDownRight, 
  ArrowUpRight, History, Check, X, ShieldAlert, Sparkles, 
  PackageCheck, RefreshCw, Layers, Edit3, ShoppingBag
} from 'lucide-react';
import { adminStore } from '../../services/adminStore';

export default function AdminInventory() {
  const [inventory, setInventory] = useState(() => adminStore.getInventory());
  const [logs, setLogs] = useState(() => adminStore.getInventoryLogs());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Formulario de Entrada de Mercancía
  const [entryForm, setEntryForm] = useState({
    itemId: '',
    quantity: '',
    supplier: 'Distribuidor Principal',
    invoiceRef: '',
    costPerUnit: '',
    notes: ''
  });

  useEffect(() => {
    const unsubscribe = adminStore.subscribe(() => {
      setInventory(adminStore.getInventory());
      setLogs(adminStore.getInventoryLogs());
    });
    return () => unsubscribe();
  }, []);

  // Categorías para filtro
  const categories = ['ALL', ...new Set(inventory.map((i) => i.category || 'Otros'))];

  // Filtrar inventario
  const filteredInventory = inventory.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (item.category || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || item.category === selectedCategory;
    if (selectedCategory === 'LOW_STOCK') {
      const isLow = (item.type === 'unit' ? (item.stockUnits || 0) : (item.stockBottles || 0)) <= (item.minStock || 3);
      return matchesSearch && isLow;
    }
    return matchesSearch && matchesCat;
  });

  // Métricas rápidas
  const totalBottles = inventory.reduce((acc, it) => acc + (it.type !== 'unit' ? (it.stockBottles || 0) : 0), 0);
  const totalUnits = inventory.reduce((acc, it) => acc + (it.type === 'unit' ? (it.stockUnits || 0) : 0), 0);
  const lowStockCount = inventory.filter((it) => (it.type === 'unit' ? (it.stockUnits || 0) : (it.stockBottles || 0)) <= (it.minStock || 3)).length;
  
  // Total copas calculadas en todo el inventario de licores y vinos
  const totalEstimatedGlasses = inventory.reduce((acc, it) => {
    if (it.type === 'wine_and_glasses') {
      const glassesInBottles = (it.stockBottles || 0) * Math.floor((it.bottleMl || 750) / (it.glassMl || 150));
      const glassesInOpened = Math.floor((it.openedBottlesMl || 0) / (it.glassMl || 150));
      return acc + glassesInBottles + glassesInOpened;
    }
    if (it.type === 'bottle_and_shots') {
      const shotsInBottles = (it.stockBottles || 0) * Math.floor((it.bottleMl || 750) / (it.shotMl || 50));
      const shotsInOpened = Math.floor((it.openedBottlesMl || 0) / (it.shotMl || 50));
      return acc + shotsInBottles + shotsInOpened;
    }
    return acc;
  }, 0);

  const handleAddStock = (e) => {
    e.preventDefault();
    if (!entryForm.itemId || !entryForm.quantity) return;

    const res = adminStore.addStockEntry({
      itemId: entryForm.itemId,
      quantity: entryForm.quantity,
      supplier: entryForm.supplier,
      invoiceRef: entryForm.invoiceRef,
      costPerUnit: parseFloat(entryForm.costPerUnit) || 0,
      notes: entryForm.notes
    });

    if (res.success) {
      setShowEntryModal(false);
      setEntryForm({
        itemId: '',
        quantity: '',
        supplier: 'Distribuidor Principal',
        invoiceRef: '',
        costPerUnit: '',
        notes: ''
      });
    }
  };

  const handleSaveManualEdit = (e) => {
    e.preventDefault();
    if (!editingItem) return;

    adminStore.updateStockManually(editingItem.id, {
      stockBottles: parseInt(editingItem.stockBottles, 10) || 0,
      stockUnits: parseInt(editingItem.stockUnits, 10) || 0,
      openedBottlesMl: parseInt(editingItem.openedBottlesMl, 10) || 0,
      minStock: parseInt(editingItem.minStock, 10) || 3
    });

    setEditingItem(null);
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER PRINCIPAL */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#10121a] p-5 sm:p-6 rounded-2xl border border-amber-500/20 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Boxes className="w-6 h-6 text-amber-400" />
            <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider">
              Control de Inventario Inteligente
            </h1>
          </div>
          <p className="text-xs text-gray-400">
            Control de botellas, conversión de copas a mililitros y entradas de mercancía
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setShowHistoryModal(true)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            <History className="w-4 h-4 text-amber-400" />
            <span>Kardex / Historial</span>
          </button>

          <button
            type="button"
            onClick={() => setShowEntryModal(true)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Entrada de Mercancía</span>
          </button>
        </div>
      </div>

      {/* KPI METRICS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="bg-[#10121a] p-4 sm:p-5 rounded-2xl border border-amber-500/20 space-y-2">
          <div className="flex items-center justify-between text-gray-400 text-xs font-bold uppercase">
            <span>Botellas en Stock</span>
            <Wine className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {totalBottles} <span className="text-xs font-medium text-amber-400">bot.</span>
          </p>
        </div>

        <div className="bg-[#10121a] p-4 sm:p-5 rounded-2xl border border-amber-500/20 space-y-2">
          <div className="flex items-center justify-between text-gray-400 text-xs font-bold uppercase">
            <span>Copas / Tragos Disp.</span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-purple-300 tracking-tight">
            ~{totalEstimatedGlasses} <span className="text-xs font-medium text-gray-400">copas</span>
          </p>
        </div>

        <div className="bg-[#10121a] p-4 sm:p-5 rounded-2xl border border-amber-500/20 space-y-2">
          <div className="flex items-center justify-between text-gray-400 text-xs font-bold uppercase">
            <span>Cervezas & Latas</span>
            <ShoppingBag className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight">
            {totalUnits} <span className="text-xs font-medium text-gray-400">un.</span>
          </p>
        </div>

        <div className="bg-[#10121a] p-4 sm:p-5 rounded-2xl border border-red-500/30 space-y-2">
          <div className="flex items-center justify-between text-gray-400 text-xs font-bold uppercase">
            <span>Stock Crítico</span>
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-red-400 tracking-tight">
            {lowStockCount} <span className="text-xs font-medium text-gray-400">alertas</span>
          </p>
        </div>
      </div>

      {/* BARRA DE BÚSQUEDA Y FILTROS */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-[#10121a] p-3.5 rounded-2xl border border-white/10">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por licor, cerveza, vino..."
            className="w-full bg-[#181a24] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-amber-400 text-black shadow-md shadow-amber-400/20'
                  : 'bg-white/5 hover:bg-white/10 text-gray-400 border border-white/5'
              }`}
            >
              {cat === 'ALL' ? 'Todos' : cat}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setSelectedCategory('LOW_STOCK')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'LOW_STOCK'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'bg-red-950/40 hover:bg-red-900/50 text-red-300 border border-red-500/30'
            }`}
          >
            <AlertTriangle className="w-3 h-3" />
            <span>Stock Bajo</span>
          </button>
        </div>
      </div>

      {/* TABLA DE INVENTARIO */}
      <div className="bg-[#10121a] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-[11px] font-black text-gray-400 uppercase tracking-wider">
                <th className="py-3.5 px-4">Producto & Categoría</th>
                <th className="py-3.5 px-4">Stock Botellas / Unidades</th>
                <th className="py-3.5 px-4">Cálculo de Copas & Barra</th>
                <th className="py-3.5 px-4">Estado</th>
                <th className="py-3.5 px-4 text-right">Precios (Costo / Venta)</th>
                <th className="py-3.5 px-4 text-center">Ajuste</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {filteredInventory.map((item) => {
                const isUnit = item.type === 'unit';
                const currentStock = isUnit ? (item.stockUnits || 0) : (item.stockBottles || 0);
                const isCritical = currentStock <= (item.minStock || 3);

                // Cálculo de copas y mililitros
                let portionInfo = null;
                if (item.type === 'wine_and_glasses') {
                  const portionMl = item.glassMl || 150;
                  const glassesInOpened = Math.floor((item.openedBottlesMl || 0) / portionMl);
                  portionInfo = {
                    portionLabel: '150ml / copa',
                    openedMl: item.openedBottlesMl || 0,
                    glassesAvailable: glassesInOpened
                  };
                } else if (item.type === 'bottle_and_shots') {
                  const portionMl = item.shotMl || 50;
                  const shotsInOpened = Math.floor((item.openedBottlesMl || 0) / portionMl);
                  portionInfo = {
                    portionLabel: '50ml / trago',
                    openedMl: item.openedBottlesMl || 0,
                    glassesAvailable: shotsInOpened
                  };
                }

                return (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                    
                    {/* PRODUCTO & CATEGORÍA */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <p className="font-bold text-white text-sm">{item.name}</p>
                        <div className="flex items-center gap-2 text-[10px] text-gray-400">
                          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">
                            {item.category}
                          </span>
                          <span>{item.unit}</span>
                        </div>
                      </div>
                    </td>

                    {/* STOCK BOTELLAS / UNIDADES */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-baseline gap-1.5">
                        <span className={`text-lg font-black ${isCritical ? 'text-red-400' : 'text-white'}`}>
                          {currentStock}
                        </span>
                        <span className="text-[10px] text-gray-400 font-medium uppercase">
                          {isUnit ? 'unidades' : 'botellas'}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-500">Mínimo: {item.minStock || 3}</p>
                    </td>

                    {/* CONVERSIÓN DE COPAS / MILILITROS */}
                    <td className="py-3.5 px-4">
                      {portionInfo ? (
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-purple-300">
                              {portionInfo.openedMl} ml en barra
                            </span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-black">
                              ~{portionInfo.glassesAvailable} copas
                            </span>
                          </div>
                          <p className="text-[10px] text-gray-500">
                            Porción: {portionInfo.portionLabel}
                          </p>
                        </div>
                      ) : (
                        <span className="text-[11px] text-gray-500">Venta por unidad completa</span>
                      )}
                    </td>

                    {/* ESTADO */}
                    <td className="py-3.5 px-4">
                      {isCritical ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-black uppercase">
                          <AlertTriangle className="w-2.5 h-2.5" />
                          Stock Bajo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-black uppercase">
                          <Check className="w-2.5 h-2.5" />
                          Disponible
                        </span>
                      )}
                    </td>

                    {/* PRECIOS */}
                    <td className="py-3.5 px-4 text-right space-y-0.5">
                      <p className="font-bold text-amber-400">
                        ${((item.salePriceBottle || item.salePriceUnit || 0)).toLocaleString('es-CO')}
                      </p>
                      {item.costPrice > 0 && (
                        <p className="text-[10px] text-gray-500">
                          Costo: ${(item.costPrice).toLocaleString('es-CO')}
                        </p>
                      )}
                    </td>

                    {/* ACCIONES */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => setEditingItem({ ...item })}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-amber-400 border border-white/10 transition-colors cursor-pointer"
                        title="Ajustar Stock Manualmente"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: ENTRADA DE MERCANCÍA */}
      <AnimatePresence>
        {showEntryModal && (
          <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              className="w-full max-w-lg bg-[#12141e] border border-amber-500/30 rounded-3xl p-6 sm:p-7 text-white space-y-5 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black uppercase text-white">Registrar Entrada de Mercancía</h2>
                    <p className="text-xs text-gray-400">Suma botellas o unidades recibidas directamente al stock</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowEntryModal(false)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddStock} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300 uppercase">Seleccionar Producto *</label>
                  <select
                    value={entryForm.itemId}
                    onChange={(e) => setEntryForm({ ...entryForm, itemId: e.target.value })}
                    required
                    className="w-full bg-[#1a1d2c] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="">-- Elige un licor o bebida --</option>
                    {inventory.map((it) => (
                      <option key={it.id} value={it.id}>
                        {it.name} ({it.type === 'unit' ? `${it.stockUnits || 0} un.` : `${it.stockBottles || 0} bot.`})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-300 uppercase">Cantidad Recibida *</label>
                    <input
                      type="number"
                      min="1"
                      value={entryForm.quantity}
                      onChange={(e) => setEntryForm({ ...entryForm, quantity: e.target.value })}
                      placeholder="Ej: 12"
                      required
                      className="w-full bg-[#1a1d2c] border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-300 uppercase">Costo Unitario COP</label>
                    <input
                      type="number"
                      value={entryForm.costPerUnit}
                      onChange={(e) => setEntryForm({ ...entryForm, costPerUnit: e.target.value })}
                      placeholder="Ej: 160000"
                      className="w-full bg-[#1a1d2c] border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-300 uppercase">Proveedor</label>
                    <input
                      type="text"
                      value={entryForm.supplier}
                      onChange={(e) => setEntryForm({ ...entryForm, supplier: e.target.value })}
                      placeholder="Ej: Dislicores S.A."
                      className="w-full bg-[#1a1d2c] border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-300 uppercase">N° Factura / Remisión</label>
                    <input
                      type="text"
                      value={entryForm.invoiceRef}
                      onChange={(e) => setEntryForm({ ...entryForm, invoiceRef: e.target.value })}
                      placeholder="Ej: FAC-8930"
                      className="w-full bg-[#1a1d2c] border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300 uppercase">Notas / Observaciones</label>
                  <input
                    type="text"
                    value={entryForm.notes}
                    onChange={(e) => setEntryForm({ ...entryForm, notes: e.target.value })}
                    placeholder="Ej: Lote recibido en bodega VIP"
                    className="w-full bg-[#1a1d2c] border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowEntryModal(false)}
                    className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold uppercase transition-all cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
                  >
                    Guardar Entrada
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: AJUSTE MANUAL */}
      <AnimatePresence>
        {editingItem && (
          <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              className="w-full max-w-md bg-[#12141e] border border-amber-500/30 rounded-3xl p-6 text-white space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <h3 className="font-black text-white uppercase text-base">Ajuste de Stock</h3>
                  <p className="text-xs text-amber-400 font-bold">{editingItem.name}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveManualEdit} className="space-y-3.5">
                {editingItem.type === 'unit' ? (
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-300 uppercase">Unidades en Stock</label>
                    <input
                      type="number"
                      value={editingItem.stockUnits || 0}
                      onChange={(e) => setEditingItem({ ...editingItem, stockUnits: e.target.value })}
                      className="w-full bg-[#1a1d2c] border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-400 font-bold"
                    />
                  </div>
                ) : (
                  <>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-300 uppercase">Botellas Completas</label>
                      <input
                        type="number"
                        value={editingItem.stockBottles || 0}
                        onChange={(e) => setEditingItem({ ...editingItem, stockBottles: e.target.value })}
                        className="w-full bg-[#1a1d2c] border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-400 font-bold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-300 uppercase">Mililitros Restantes en Barra</label>
                      <input
                        type="number"
                        value={editingItem.openedBottlesMl || 0}
                        onChange={(e) => setEditingItem({ ...editingItem, openedBottlesMl: e.target.value })}
                        className="w-full bg-[#1a1d2c] border border-white/10 rounded-xl px-4 py-2 text-sm text-purple-300 focus:outline-none focus:border-purple-400 font-bold"
                      />
                    </div>
                  </>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-300 uppercase">Stock Mínimo de Alerta</label>
                  <input
                    type="number"
                    value={editingItem.minStock || 3}
                    onChange={(e) => setEditingItem({ ...editingItem, minStock: e.target.value })}
                    className="w-full bg-[#1a1d2c] border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="flex items-center gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold uppercase transition-all cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Guardar Ajuste
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: HISTORIAL KARDEX */}
      <AnimatePresence>
        {showHistoryModal && (
          <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              className="w-full max-w-2xl max-h-[85vh] bg-[#12141e] border border-amber-500/30 rounded-3xl p-6 text-white space-y-4 shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3 flex-shrink-0">
                <div className="flex items-center gap-2.5">
                  <History className="w-5 h-5 text-amber-400" />
                  <h3 className="font-black text-white uppercase text-base">Kardex / Historial de Movimientos</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowHistoryModal(false)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {logs.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 text-xs">
                    No hay movimientos registrados en el inventario aún.
                  </div>
                ) : (
                  logs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                            log.type === 'ENTRADA' ? 'bg-emerald-500/20 text-emerald-300' :
                            log.type === 'CONSUMO' ? 'bg-amber-500/20 text-amber-300' :
                            log.type === 'REINTEGRO' ? 'bg-blue-500/20 text-blue-300' : 'bg-white/10 text-gray-300'
                          }`}>
                            {log.type}
                          </span>
                          <span className="font-bold text-white">{log.itemName || log.context || 'Movimiento'}</span>
                        </div>
                        <p className="text-gray-400 text-[11px]">{log.details || log.notes || 'Sin detalles'}</p>
                        {log.supplier && (
                          <p className="text-[10px] text-gray-500">Proveedor: {log.supplier} | Ref: {log.invoiceRef || 'S/N'}</p>
                        )}
                      </div>
                      <span className="text-[10px] text-gray-500 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
