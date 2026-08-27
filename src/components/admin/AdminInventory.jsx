import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Boxes, Wine, Plus, Search, AlertTriangle, ArrowDownRight, 
  ArrowUpRight, History, Check, X, ShieldAlert, Sparkles, 
  PackageCheck, RefreshCw, Layers, Edit3, ShoppingBag, Trash2, KeyRound, FileSpreadsheet
} from 'lucide-react';
import { adminStore } from '../../services/adminStore';
import CustomSelect from '../common/CustomSelect';

export default function AdminInventory() {
  const [inventory, setInventory] = useState(() => adminStore.getInventory());
  const [logs, setLogs] = useState(() => adminStore.getInventoryLogs());
  const [wasteLogs, setWasteLogs] = useState(() => adminStore.getInventoryWasteLogs());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  
  // Modals state
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [showWasteModal, setShowWasteModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showWasteHistoryModal, setShowWasteHistoryModal] = useState(false);
  
  // Manual edit state
  const [editingItem, setEditingItem] = useState(null);
  const [editingPassword, setEditingPassword] = useState('');
  const [editError, setEditError] = useState('');

  // Formulario Entrada de Mercancía
  const [entryForm, setEntryForm] = useState({
    itemId: '',
    quantity: '',
    supplier: 'Distribuidor Principal',
    invoiceRef: '',
    costPerUnit: '',
    notes: ''
  });
  const [entryAdminPassword, setEntryAdminPassword] = useState('');
  const [entryError, setEntryError] = useState('');

  // Formulario Baja de Mercancía / Merma
  const [wasteForm, setWasteForm] = useState({
    itemId: '',
    wasteType: 'bottle', // 'bottle' | 'ml'
    quantity: '1',
    mlAmount: '100',
    reason: 'Rotura o Daño Accidental de Botella',
    notes: '',
    adminPassword: ''
  });
  const [wasteError, setWasteError] = useState('');

  useEffect(() => {
    const unsubscribe = adminStore.subscribe(() => {
      setInventory(adminStore.getInventory());
      setLogs(adminStore.getInventoryLogs());
      setWasteLogs(adminStore.getInventoryWasteLogs());
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

  // Métricas
  const totalBottles = inventory.reduce((acc, it) => acc + (it.type !== 'unit' ? (it.stockBottles || 0) : 0), 0);
  const totalUnits = inventory.reduce((acc, it) => acc + (it.type === 'unit' ? (it.stockUnits || 0) : 0), 0);
  const lowStockCount = inventory.filter((it) => (it.type === 'unit' ? (it.stockUnits || 0) : (it.stockBottles || 0)) <= (it.minStock || 3)).length;
  
  // Total copas estimadas
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

  // Opciones para CustomSelect de Entrada
  const productSelectOptions = inventory.map((it) => ({
    value: it.id,
    label: it.name,
    subtitle: `${it.category} • ${it.type === 'unit' ? `${it.stockUnits || 0} unidades` : `${it.stockBottles || 0} botellas`}`
  }));

  const wasteReasonOptions = [
    { value: 'Rotura o Daño Accidental de Botella', label: '💥 Rotura o Daño Accidental de Botella' },
    { value: 'Botella Picada / Defectuosa / Corcho Dañado', label: '🧪 Botella Picada / Defectuosa / Corcho Dañado' },
    { value: 'Merma de Barra / Derrame en Servicio', label: '🍸 Merma de Barra / Derrame en Servicio' },
    { value: 'Vencimiento o Deterioro de Producto', label: '⏳ Vencimiento o Deterioro de Producto' },
    { value: 'Cortesía Especial Autorizada por Gerencia', label: '🎁 Cortesía Especial Autorizada por Gerencia' },
    { value: 'Otro Motivo Justificado', label: '📝 Otro Motivo Justificado' }
  ];

  // Manejar Entrada de Stock (Requiere Clave Admin)
  const handleAddStock = (e) => {
    e.preventDefault();
    setEntryError('');
    if (!entryForm.itemId || !entryForm.quantity) return;

    if (!entryAdminPassword.trim()) {
      setEntryError('Debes ingresar tu contraseña de administrador para autorizar el ingreso de mercancía.');
      return;
    }

    const res = adminStore.addStockEntry({
      itemId: entryForm.itemId,
      quantity: entryForm.quantity,
      supplier: entryForm.supplier,
      invoiceRef: entryForm.invoiceRef,
      costPerUnit: parseFloat(entryForm.costPerUnit) || 0,
      notes: entryForm.notes,
      adminPassword: entryAdminPassword
    });

    if (res.success) {
      setShowEntryModal(false);
      setEntryAdminPassword('');
      setEntryError('');
      setEntryForm({
        itemId: '',
        quantity: '',
        supplier: 'Distribuidor Principal',
        invoiceRef: '',
        costPerUnit: '',
        notes: ''
      });
    } else {
      setEntryError(res.message || 'Error al ingresar mercancía.');
    }
  };

  // Manejar Baja de Mercancía / Merma
  const handleRecordWaste = (e) => {
    e.preventDefault();
    setWasteError('');

    if (!wasteForm.itemId) {
      setWasteError('Debes seleccionar el producto a dar de baja.');
      return;
    }

    if (!wasteForm.adminPassword) {
      setWasteError('Debes ingresar tu contraseña de administrador para autorizar la baja.');
      return;
    }

    const res = adminStore.recordInventoryWaste({
      itemId: wasteForm.itemId,
      quantity: wasteForm.quantity,
      mlAmount: wasteForm.mlAmount,
      wasteType: wasteForm.wasteType,
      reason: wasteForm.reason,
      notes: wasteForm.notes,
      authorizedBy: 'Administrador',
      adminPassword: wasteForm.adminPassword
    });

    if (res.success) {
      setShowWasteModal(false);
      setWasteForm({
        itemId: '',
        wasteType: 'bottle',
        quantity: '1',
        mlAmount: '100',
        reason: 'Rotura o Daño Accidental de Botella',
        notes: '',
        adminPassword: ''
      });
    } else {
      setWasteError(res.message || 'Error al procesar la baja de inventario.');
    }
  };

  // Abrir Modal de Edición Manual (Lápiz)
  const handleOpenManualEdit = (item) => {
    const initialSalePrice = String(item.type === 'unit' ? (item.salePriceUnit || item.price || 0) : (item.salePriceBottle || item.price || 0));
    const initialCostPrice = String(item.costPrice || 0);
    setEditingItem({
      id: item.id,
      name: item.name,
      type: item.type,
      stockBottles: String(item.stockBottles ?? 0),
      stockUnits: String(item.stockUnits ?? 0),
      openedBottlesMl: String(item.openedBottlesMl ?? 0),
      minStock: String(item.minStock ?? 3),
      salePrice: initialSalePrice,
      costPrice: initialCostPrice,
      initialSalePrice,
      initialCostPrice
    });
    setEditingPassword('');
    setEditError('');
  };

  // Manejar Guardado de Ajuste Manual
  const handleSaveManualEdit = (e) => {
    e.preventDefault();
    setEditError('');

    if (!editingItem) return;

    // Detectar si se modificó el precio de venta o costo
    const isPriceModified = (editingItem.salePrice !== editingItem.initialSalePrice) || 
                            (editingItem.costPrice !== editingItem.initialCostPrice);

    if (isPriceModified && !editingPassword.trim()) {
      setEditError('Se detectó modificación de precio: ingresa tu clave de administrador para autorizar.');
      return;
    }

    const updates = {
      stockBottles: parseInt(editingItem.stockBottles, 10) || 0,
      stockUnits: parseInt(editingItem.stockUnits, 10) || 0,
      openedBottlesMl: parseInt(editingItem.openedBottlesMl, 10) || 0,
      minStock: parseInt(editingItem.minStock, 10) || 3,
      salePrice: parseFloat(editingItem.salePrice) || 0,
      costPrice: parseFloat(editingItem.costPrice) || 0
    };

    const res = adminStore.updateStockManually(editingItem.id, updates, editingPassword);

    if (res.success) {
      setInventory(adminStore.getInventory());
      setEditingItem(null);
      setEditingPassword('');
      setEditError('');
    } else {
      setEditError(res.message || 'Error al guardar ajuste.');
    }
  };

  const selectedWasteItem = inventory.find((i) => i.id === wasteForm.itemId);

  return (
    <div className="space-y-6 font-sans">
      
      {/* HEADER PRINCIPAL (Sin subtítulo, título en una sola línea, botones principales a la derecha y secundarios abajo) */}
      <div className="bg-[#11131c] p-5 sm:p-6 rounded-3xl border border-[#232738] shadow-xl space-y-3.5">
        
        {/* Fila 1: Título en una sola línea + Botones Operativos a la Derecha */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 font-black shrink-0">
              <Boxes className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider whitespace-nowrap">
              Control de Inventario & Botellas
            </h1>
          </div>

          {/* Botones Principales a la Derecha */}
          <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap w-full md:w-auto">
            <button
              type="button"
              onClick={() => {
                setWasteError('');
                setShowWasteModal(true);
              }}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-2xl bg-red-950/60 hover:bg-red-900/70 border border-red-500/40 text-red-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
              title="Dar de baja mercancía por daño o merma"
            >
              <Trash2 size={15} className="text-red-400" />
              <span>Bajar Mercancía / Merma</span>
            </button>

            <button
              type="button"
              onClick={() => setShowEntryModal(true)}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black text-xs font-black flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/10 transition-all cursor-pointer"
            >
              <Plus size={16} strokeWidth={3} />
              <span>Entrada de Mercancía</span>
            </button>
          </div>
        </div>

        {/* Fila 2: Botones de Auditoría e Historial Justo Abajo del Título */}
        <div className="flex items-center gap-2 pt-2 border-t border-white/5 flex-wrap">
          <button
            type="button"
            onClick={() => setShowWasteHistoryModal(true)}
            className="px-3.5 py-2 rounded-xl bg-[#181c29] border border-[#2c3247] hover:border-red-500/50 text-red-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
            title="Ver auditoría de bajas y mermas"
          >
            <ShieldAlert size={14} className="text-red-400" />
            <span>Historial de Bajas</span>
            {wasteLogs.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-red-500 text-white text-[10px] font-black">
                {wasteLogs.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setShowHistoryModal(true)}
            className="px-3.5 py-2 rounded-xl bg-[#181c29] border border-[#2c3247] hover:border-amber-400 text-gray-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
            title="Kardex general de movimientos"
          >
            <History size={14} className="text-amber-400" />
            <span>Kardex General</span>
          </button>
        </div>

      </div>

      {/* KPI METRIC CARDS (Colores refinados y palabras completas abajo a la derecha) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Botellas */}
        <div className="p-5 rounded-3xl bg-[#11131c] border border-amber-500/30 flex flex-col justify-between space-y-3 shadow-lg">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">Botellas en Stock</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
              <Wine size={18} />
            </div>
          </div>
          <div className="flex items-end justify-between pt-1">
            <span className="text-3xl font-black text-amber-400 font-mono tracking-tight">
              {totalBottles}
            </span>
            <span className="text-[11px] font-bold text-gray-400 text-right uppercase tracking-wider">
              Botellas en Stock
            </span>
          </div>
        </div>

        {/* Copas / Tragos Disponibles */}
        <div className="p-5 rounded-3xl bg-[#11131c] border border-[#232738] flex flex-col justify-between space-y-3 shadow-lg">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-300">Copas Disponibles</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center">
              <Sparkles size={18} />
            </div>
          </div>
          <div className="flex items-end justify-between pt-1">
            <span className="text-3xl font-black text-purple-300 font-mono tracking-tight">
              ~{totalEstimatedGlasses}
            </span>
            <span className="text-[11px] font-bold text-gray-400 text-right uppercase tracking-wider">
              Copas / Tragos Estimados
            </span>
          </div>
        </div>

        {/* Cervezas y Unidades */}
        <div className="p-5 rounded-3xl bg-[#11131c] border border-[#232738] flex flex-col justify-between space-y-3 shadow-lg">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">Cervezas & Bebidas</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <ShoppingBag size={18} />
            </div>
          </div>
          <div className="flex items-end justify-between pt-1">
            <span className="text-3xl font-black text-emerald-400 font-mono tracking-tight">
              {totalUnits}
            </span>
            <span className="text-[11px] font-bold text-gray-400 text-right uppercase tracking-wider">
              Unidades Disponibles
            </span>
          </div>
        </div>

        {/* Stock Crítico */}
        <div className="p-5 rounded-3xl bg-[#11131c] border border-red-500/30 flex flex-col justify-between space-y-3 shadow-lg">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider text-red-400">Stock Crítico</span>
            <div className="w-8 h-8 rounded-xl bg-red-500/15 text-red-400 flex items-center justify-center">
              <AlertTriangle size={18} />
            </div>
          </div>
          <div className="flex items-end justify-between pt-1">
            <span className="text-3xl font-black text-red-400 font-mono tracking-tight">
              {lowStockCount}
            </span>
            <span className="text-[11px] font-bold text-gray-400 text-right uppercase tracking-wider">
              Alertas de Reposición
            </span>
          </div>
        </div>
      </div>

      {/* BARRA DE BÚSQUEDA Y CATEGORÍAS */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-[#11131c] p-4 rounded-3xl border border-[#232738]">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por licor, cerveza, vino..."
            className="w-full bg-[#181a24] border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold uppercase whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-amber-400 text-black shadow-md shadow-amber-400/10'
                  : 'bg-white/5 hover:bg-white/10 text-gray-400 border border-white/5'
              }`}
            >
              {cat === 'ALL' ? 'Todos' : cat}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setSelectedCategory('LOW_STOCK')}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold uppercase whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'LOW_STOCK'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                : 'bg-red-950/40 hover:bg-red-900/50 text-red-300 border border-red-500/30'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Stock Bajo</span>
          </button>
        </div>
      </div>

      {/* TABLA DE INVENTARIO */}
      <div className="bg-[#11131c] rounded-3xl border border-[#232738] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-[11px] font-black text-gray-400 uppercase tracking-wider">
                <th className="py-4 px-5">Producto & Categoría</th>
                <th className="py-4 px-5">Stock Actual</th>
                <th className="py-4 px-5">Conversión de Copas / ml</th>
                <th className="py-4 px-5">Estado</th>
                <th className="py-4 px-5 text-right">Precios (Costo / Venta)</th>
                <th className="py-4 px-5 text-center">Ajuste</th>
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
                    <td className="py-4 px-5">
                      <div className="space-y-0.5">
                        <p className="font-bold text-white text-sm">{item.name}</p>
                        <div className="flex items-center gap-2 text-[10px] text-gray-400">
                          <span className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 font-bold">
                            {item.category}
                          </span>
                          <span>{item.unit}</span>
                        </div>
                      </div>
                    </td>

                    {/* STOCK ACTUAL */}
                    <td className="py-4 px-5">
                      <div className="flex items-baseline gap-1.5">
                        <span className={`text-xl font-black font-mono ${isCritical ? 'text-red-400' : 'text-white'}`}>
                          {currentStock}
                        </span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase">
                          {isUnit ? 'unidades' : 'botellas'}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-500">Mínimo sugerido: {item.minStock || 3}</p>
                    </td>

                    {/* CONVERSIÓN DE COPAS / MILILITROS */}
                    <td className="py-4 px-5">
                      {portionInfo ? (
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-purple-300 font-mono">
                              {portionInfo.openedMl} ml en barra
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-black">
                              ~{portionInfo.glassesAvailable} copas
                            </span>
                          </div>
                          <p className="text-[10px] text-gray-500">
                            Porción estándar: {portionInfo.portionLabel}
                          </p>
                        </div>
                      ) : (
                        <span className="text-[11px] text-gray-500">Venta por unidad completa</span>
                      )}
                    </td>

                    {/* ESTADO */}
                    <td className="py-4 px-5">
                      {isCritical ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-black uppercase tracking-wider">
                          <AlertTriangle className="w-3 h-3" />
                          Stock Bajo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-black uppercase tracking-wider">
                          <Check className="w-3 h-3" />
                          Disponible
                        </span>
                      )}
                    </td>

                    {/* PRECIOS */}
                    <td className="py-4 px-5 text-right space-y-0.5">
                      <p className="font-black text-amber-400 font-mono text-sm">
                        ${((item.salePriceBottle || item.salePriceUnit || 0)).toLocaleString('es-CO')}
                      </p>
                      {item.costPrice > 0 && (
                        <p className="text-[10px] text-gray-500 font-mono">
                          Costo: ${(item.costPrice).toLocaleString('es-CO')}
                        </p>
                      )}
                    </td>

                    {/* ACCIONES (Botón de Lápiz) */}
                    <td className="py-4 px-5 text-center">
                      <button
                        type="button"
                        onClick={() => handleOpenManualEdit(item)}
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

      {/* ==================================================== */}
      {/* MODAL: ENTRADA DE MERCANCÍA                         */}
      {/* ==================================================== */}
      <AnimatePresence>
        {showEntryModal && (
          <div className="fixed inset-0 z-[99999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              className="w-full max-w-lg bg-[#11131c] border border-amber-500/30 rounded-3xl p-6 sm:p-7 text-white space-y-5 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
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
                  className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {entryError && (
                <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs font-bold text-center">
                  {entryError}
                </div>
              )}

              <form onSubmit={handleAddStock} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                    Seleccionar Producto / Licor *
                  </label>
                  <CustomSelect
                    value={entryForm.itemId}
                    onChange={(val) => setEntryForm({ ...entryForm, itemId: val })}
                    options={productSelectOptions}
                    placeholder="-- Selecciona un licor o bebida --"
                    searchable={true}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">Cantidad Recibida *</label>
                    <input
                      type="number"
                      min="1"
                      value={entryForm.quantity}
                      onChange={(e) => setEntryForm({ ...entryForm, quantity: e.target.value })}
                      placeholder="Ej: 12"
                      required
                      className="w-full bg-[#181a24] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 font-bold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">Costo Unitario COP</label>
                    <input
                      type="number"
                      value={entryForm.costPerUnit}
                      onChange={(e) => setEntryForm({ ...entryForm, costPerUnit: e.target.value })}
                      placeholder="Ej: 160000"
                      className="w-full bg-[#181a24] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">Proveedor</label>
                    <input
                      type="text"
                      value={entryForm.supplier}
                      onChange={(e) => setEntryForm({ ...entryForm, supplier: e.target.value })}
                      placeholder="Ej: Dislicores S.A."
                      className="w-full bg-[#181a24] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">N° Factura / Remisión</label>
                    <input
                      type="text"
                      value={entryForm.invoiceRef}
                      onChange={(e) => setEntryForm({ ...entryForm, invoiceRef: e.target.value })}
                      placeholder="Ej: FAC-8930"
                      className="w-full bg-[#181a24] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">Notas / Observaciones</label>
                  <input
                    type="text"
                    value={entryForm.notes}
                    onChange={(e) => setEntryForm({ ...entryForm, notes: e.target.value })}
                    placeholder="Ej: Lote recibido en bodega VIP"
                    className="w-full bg-[#181a24] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Clave de Administrador Obligatoria para Entrada */}
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-2">
                  <label className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                    <KeyRound size={14} className="text-amber-400" />
                    <span>Clave de Administrador para Autorizar Ingreso *</span>
                  </label>
                  <input
                    type="password"
                    value={entryAdminPassword}
                    onChange={(e) => setEntryAdminPassword(e.target.value)}
                    placeholder="Ingresa clave del panel"
                    required
                    className="w-full bg-[#141620] border border-amber-500/30 rounded-xl px-4 py-2 text-xs text-amber-400 placeholder-gray-500 focus:outline-none focus:border-amber-400 font-mono font-bold"
                  />
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setShowEntryModal(false)}
                    className="flex-1 py-3 rounded-2xl bg-[#181a24] hover:bg-white/10 text-gray-300 text-xs font-bold uppercase transition-all cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-amber-500/10 cursor-pointer"
                  >
                    Guardar Entrada
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================================================== */}
      {/* MODAL: BAJAR MERCANCÍA / MERMA (Con Clave Admin)    */}
      {/* ==================================================== */}
      <AnimatePresence>
        {showWasteModal && (
          <div className="fixed inset-0 z-[99999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              className="w-full max-w-lg bg-[#11131c] border border-red-500/30 rounded-3xl p-6 sm:p-7 text-white space-y-5 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
                    <Trash2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black uppercase text-white">Bajar Mercancía / Merma</h2>
                    <p className="text-xs text-gray-400">Resta unidades o mililitros por rotura, daño o merma autorizada</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowWasteModal(false)}
                  className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {wasteError && (
                <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs font-bold text-center">
                  {wasteError}
                </div>
              )}

              <form onSubmit={handleRecordWaste} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                    Seleccionar Producto / Licor a Dar de Baja *
                  </label>
                  <CustomSelect
                    value={wasteForm.itemId}
                    onChange={(val) => setWasteForm({ ...wasteForm, itemId: val })}
                    options={productSelectOptions}
                    placeholder="-- Selecciona el producto afectado --"
                    searchable={true}
                  />
                </div>

                {/* Tipo de Descuento (Botellas vs ml) */}
                {selectedWasteItem && selectedWasteItem.type !== 'unit' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                      Tipo de Merma / Baja
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setWasteForm({ ...wasteForm, wasteType: 'bottle' })}
                        className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer ${
                          wasteForm.wasteType === 'bottle'
                            ? 'bg-amber-500 text-black border-transparent shadow'
                            : 'bg-[#181a24] text-gray-400 border-white/10 hover:border-white/20'
                        }`}
                      >
                        🍾 Botellas Completas
                      </button>
                      <button
                        type="button"
                        onClick={() => setWasteForm({ ...wasteForm, wasteType: 'ml' })}
                        className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer ${
                          wasteForm.wasteType === 'ml'
                            ? 'bg-purple-500 text-white border-transparent shadow'
                            : 'bg-[#181a24] text-gray-400 border-white/10 hover:border-white/20'
                        }`}
                      >
                        🧪 Mililitros / Copas de Barra
                      </button>
                    </div>
                  </div>
                )}

                {/* Cantidad a Restar */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                    {wasteForm.wasteType === 'bottle' || selectedWasteItem?.type === 'unit'
                      ? 'Cantidad de Botellas / Unidades a Restar *'
                      : 'Mililitros a Restar del Stock de Barra *'}
                  </label>
                  {wasteForm.wasteType === 'bottle' || selectedWasteItem?.type === 'unit' ? (
                    <input
                      type="number"
                      min="1"
                      value={wasteForm.quantity}
                      onChange={(e) => setWasteForm({ ...wasteForm, quantity: e.target.value })}
                      placeholder="Ej: 1"
                      required
                      className="w-full bg-[#181a24] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-400 font-bold"
                    />
                  ) : (
                    <input
                      type="number"
                      min="10"
                      step="10"
                      value={wasteForm.mlAmount}
                      onChange={(e) => setWasteForm({ ...wasteForm, mlAmount: e.target.value })}
                      placeholder="Ej: 150 (mililitros)"
                      required
                      className="w-full bg-[#181a24] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-purple-300 focus:outline-none focus:border-purple-400 font-bold"
                    />
                  )}
                </div>

                {/* Motivo de la Baja */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                    Motivo / Causa de la Merma *
                  </label>
                  <CustomSelect
                    value={wasteForm.reason}
                    onChange={(val) => setWasteForm({ ...wasteForm, reason: val })}
                    options={wasteReasonOptions}
                    placeholder="Selecciona el motivo"
                  />
                </div>

                {/* Observaciones */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                    Observaciones / Justificación
                  </label>
                  <input
                    type="text"
                    value={wasteForm.notes}
                    onChange={(e) => setWasteForm({ ...wasteForm, notes: e.target.value })}
                    placeholder="Ej: Botella quebrada por accidente durante servicio en mesa 4"
                    className="w-full bg-[#181a24] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* CLAVE DE ADMINISTRADOR OBLIGATORIA */}
                <div className="p-3.5 rounded-2xl bg-red-950/40 border border-red-500/30 space-y-2">
                  <label className="text-xs font-bold text-red-300 uppercase tracking-wider flex items-center gap-1.5">
                    <KeyRound size={14} className="text-red-400" />
                    <span>Autorización: Clave de Administrador *</span>
                  </label>
                  <input
                    type="password"
                    value={wasteForm.adminPassword}
                    onChange={(e) => setWasteForm({ ...wasteForm, adminPassword: e.target.value })}
                    placeholder="Ingresa tu contraseña de panel"
                    required
                    className="w-full bg-[#141620] border border-red-500/40 rounded-xl px-4 py-2.5 text-xs text-amber-400 placeholder-gray-500 focus:outline-none focus:border-red-400 font-mono font-bold"
                  />
                  <p className="text-[10px] text-gray-400">
                    💡 Solo el administrador autorizado puede descontar inventario por concepto de merma.
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-2 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setShowWasteModal(false)}
                    className="flex-1 py-3 rounded-2xl bg-[#181a24] hover:bg-white/10 text-gray-300 text-xs font-bold uppercase transition-all cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-red-600/20 cursor-pointer"
                  >
                    Confirmar Baja
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================================================== */}
      {/* MODAL: HISTORIAL EXCLUSIVO DE BAJAS Y MERMAS        */}
      {/* ==================================================== */}
      <AnimatePresence>
        {showWasteHistoryModal && (
          <div className="fixed inset-0 z-[99999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              className="w-full max-w-2xl max-h-[85vh] bg-[#11131c] border border-red-500/30 rounded-3xl p-6 text-white space-y-4 shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3 flex-shrink-0">
                <div className="flex items-center gap-2.5">
                  <ShieldAlert className="w-5 h-5 text-red-400" />
                  <div>
                    <h3 className="font-black text-white uppercase text-base">Historial de Bajas & Mermas</h3>
                    <p className="text-xs text-gray-400">Registro auditado de pérdidas, roturas y descuentos de stock</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowWasteHistoryModal(false)}
                  className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 scrollbar-thin scrollbar-thumb-white/10">
                {wasteLogs.length === 0 ? (
                  <div className="text-center py-14 text-gray-500 text-xs">
                    No se han registrado bajas de mercancía ni mermas en el inventario.
                  </div>
                ) : (
                  wasteLogs.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl bg-red-950/20 border border-red-500/20 flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2.5 py-0.5 rounded-md bg-red-500/20 text-red-300 text-[10px] font-black uppercase tracking-wider">
                            {item.reason}
                          </span>
                          <span className="font-black text-white text-sm">{item.itemName}</span>
                        </div>
                        <p className="text-gray-300 text-xs font-bold">
                          Descuento: <span className="text-red-400">{item.detail}</span>
                        </p>
                        {item.notes && (
                          <p className="text-gray-400 text-[11px] italic">Justificación: "{item.notes}"</p>
                        )}
                        <p className="text-[10px] text-gray-500">
                          Autorizado por: {item.authorizedBy}
                        </p>
                      </div>
                      <span className="text-[10px] text-gray-400 font-mono whitespace-nowrap">
                        {new Date(item.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================================================== */}
      {/* MODAL: AJUSTE MANUAL (CON CLAVE ADMIN & INPUTS FIX)  */}
      {/* ==================================================== */}
      <AnimatePresence>
        {editingItem && (
          <div className="fixed inset-0 z-[99999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              className="w-full max-w-md bg-[#11131c] border border-amber-500/30 rounded-3xl p-6 text-white space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <h3 className="font-black text-white uppercase text-base">Ajuste de Stock</h3>
                  <p className="text-xs text-amber-400 font-bold">{editingItem.name}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {editError && (
                <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs font-bold text-center">
                  {editError}
                </div>
              )}

              <form onSubmit={handleSaveManualEdit} className="space-y-3.5">
                {editingItem.type === 'unit' ? (
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">Unidades en Stock</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={editingItem.stockUnits}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, '');
                        setEditingItem({ ...editingItem, stockUnits: val });
                      }}
                      placeholder="0"
                      className="w-full bg-[#181a24] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 font-bold font-mono"
                    />
                  </div>
                ) : (
                  <>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">Botellas Completas</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={editingItem.stockBottles}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, '');
                          setEditingItem({ ...editingItem, stockBottles: val });
                        }}
                        placeholder="0"
                        className="w-full bg-[#181a24] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 font-bold font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">Mililitros Restantes en Barra</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={editingItem.openedBottlesMl}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, '');
                          setEditingItem({ ...editingItem, openedBottlesMl: val });
                        }}
                        placeholder="0"
                        className="w-full bg-[#181a24] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-purple-300 focus:outline-none focus:border-purple-400 font-bold font-mono"
                      />
                    </div>
                  </>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">Stock Mínimo de Alerta</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={editingItem.minStock}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      setEditingItem({ ...editingItem, minStock: val });
                    }}
                    placeholder="3"
                    className="w-full bg-[#181a24] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                {/* Precios (Venta y Costo) */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                      Precio Venta ($ COP)
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={editingItem.salePrice}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, '');
                        setEditingItem({ ...editingItem, salePrice: val });
                      }}
                      placeholder="0"
                      className="w-full bg-[#181a24] border border-white/10 rounded-xl px-4 py-2 text-sm text-amber-400 focus:outline-none focus:border-amber-400 font-bold font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                      Costo Unitario ($ COP)
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={editingItem.costPrice}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, '');
                        setEditingItem({ ...editingItem, costPrice: val });
                      }}
                      placeholder="0"
                      className="w-full bg-[#181a24] border border-white/10 rounded-xl px-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-amber-400 font-mono"
                    />
                  </div>
                </div>

                {/* AUTORIZACIÓN CON CONTRASEÑA SOLO SI SE MODIFICA EL PRECIO */}
                {(() => {
                  const isPriceModified = editingItem && ((editingItem.salePrice !== editingItem.initialSalePrice) || (editingItem.costPrice !== editingItem.initialCostPrice));
                  if (!isPriceModified) return null;
                  return (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2"
                    >
                      <label className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                        <KeyRound size={14} className="text-amber-400" />
                        <span>Autorizar Cambio de Precio: Clave Admin *</span>
                      </label>
                      <input
                        type="password"
                        value={editingPassword}
                        onChange={(e) => setEditingPassword(e.target.value)}
                        placeholder="Ingresa clave del panel"
                        required
                        className="w-full bg-[#141620] border border-amber-500/30 rounded-xl px-4 py-2 text-xs text-amber-400 placeholder-gray-500 focus:outline-none focus:border-amber-400 font-mono font-bold"
                      />
                      <p className="text-[10px] text-gray-400">
                        🔒 Se detectó modificación en el precio. Ingresa tu contraseña de administrador para autorizar el cambio.
                      </p>
                    </motion.div>
                  );
                })()}

                <div className="flex items-center gap-2.5 pt-2 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="flex-1 py-2.5 rounded-2xl bg-[#181a24] hover:bg-white/10 text-gray-300 text-xs font-bold uppercase transition-all cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-amber-500/15"
                  >
                    Guardar Ajuste
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================================================== */}
      {/* MODAL: HISTORIAL KARDEX GENERAL                     */}
      {/* ==================================================== */}
      <AnimatePresence>
        {showHistoryModal && (
          <div className="fixed inset-0 z-[99999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              className="w-full max-w-2xl max-h-[85vh] bg-[#11131c] border border-amber-500/30 rounded-3xl p-6 text-white space-y-4 shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3 flex-shrink-0">
                <div className="flex items-center gap-2.5">
                  <History className="w-5 h-5 text-amber-400" />
                  <div>
                    <h3 className="font-black text-white uppercase text-base">Kardex / Historial de Movimientos</h3>
                    <p className="text-xs text-gray-400">Entradas, consumos de mesas, mermas y reintegros</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowHistoryModal(false)}
                  className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-white/10">
                {logs.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 text-xs">
                    No hay movimientos registrados en el inventario aún.
                  </div>
                ) : (
                  logs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                            log.type === 'ENTRADA' ? 'bg-emerald-500/20 text-emerald-300' :
                            log.type === 'CONSUMO' ? 'bg-amber-500/20 text-amber-300' :
                            log.type === 'BAJA_MERMA' ? 'bg-red-500/20 text-red-300' :
                            log.type === 'REINTEGRO' ? 'bg-blue-500/20 text-blue-300' : 'bg-white/10 text-gray-300'
                          }`}>
                            {log.type === 'BAJA_MERMA' ? 'BAJA / MERMA' : log.type}
                          </span>
                          <span className="font-bold text-white">{log.itemName || log.context || 'Movimiento'}</span>
                        </div>
                        <p className="text-gray-400 text-[11px]">{log.details || log.notes || 'Sin detalles'}</p>
                        {log.supplier && (
                          <p className="text-[10px] text-gray-500">Proveedor: {log.supplier} | Ref: {log.invoiceRef || 'S/N'}</p>
                        )}
                      </div>
                      <span className="text-[10px] text-gray-500 font-mono whitespace-nowrap">
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
