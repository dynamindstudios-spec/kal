import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, UtensilsCrossed, Store, Check, Plus, X, Printer, 
  DollarSign, Clock, User, Phone, CheckCircle2, AlertCircle, 
  CreditCard, Smartphone, Building2, Calendar, Users, RotateCcw, FileSpreadsheet, ShieldAlert, Trash2, FileText, Sparkles, RefreshCw, History, Search, ArrowUpRight
} from 'lucide-react';
import { adminStore } from '../../services/adminStore';
import ReceiptModal from './ReceiptModal';
import ContingencyModal from './ContingencyModal';
import RefundsAndDuplicatesModal from './RefundsAndDuplicatesModal';
import ElectronicInvoiceModal from './ElectronicInvoiceModal';

export default function AdminOrdersAndTables() {
  const [activeSubTab, setActiveSubTab] = useState('live'); // 'live' | 'reservations' | 'history'
  const [orders, setOrders] = useState(() => adminStore.getOrders());
  const [reservations, setReservations] = useState(() => adminStore.getReservations());
  const [selectedTableForModal, setSelectedTableForModal] = useState(null);
  const [selectedDetailItem, setSelectedDetailItem] = useState(null);

  // History Tab Filters State
  const [historyFilter, setHistoryFilter] = useState('all'); // 'all' | 'table' | 'bar'
  const [historySearch, setHistorySearch] = useState('');

  // Billing Modal State
  const [showBillModal, setShowBillModal] = useState(false);
  const [billingTable, setBillingTable] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('Efectivo');
  const [billNotes, setBillNotes] = useState('');
  const [lastBilledData, setLastBilledData] = useState(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [showContingencyModal, setShowContingencyModal] = useState(false);
  const [showRefundsModal, setShowRefundsModal] = useState(false);
  const [showElectronicModal, setShowElectronicModal] = useState(false);
  const [orderForElectronic, setOrderForElectronic] = useState(null);
  const [doubleChargesCount, setDoubleChargesCount] = useState(() => adminStore.detectDoubleCharges().length);

  // New Reservation Modal State
  const [showNewResModal, setShowNewResModal] = useState(false);
  const [newResClient, setNewResClient] = useState('');
  const [newResPhone, setNewResPhone] = useState('');
  const [newResDate, setNewResDate] = useState(new Date().toISOString().split('T')[0]);
  const [newResTime, setNewResTime] = useState('21:00 - 23:00 (Rumba Nocturna VIP)');
  const [newResTable, setNewResTable] = useState(1);
  const [newResSize, setNewResSize] = useState(4);
  const [newResEvent, setNewResEvent] = useState('Reserva VIP');

  // Sync with store
  useEffect(() => {
    const unsubscribe = adminStore.subscribe(() => {
      setOrders(adminStore.getOrders());
      setReservations(adminStore.getReservations());
    });
    return unsubscribe;
  }, []);

  // Handle table billing and instant reset
  const handleConfirmBilling = () => {
    if (!billingTable) return;

    const session = adminStore.getTableSession(billingTable);
    const result = adminStore.billAndResetTableSession(billingTable, selectedPaymentMethod, {
      notes: billNotes
    });

    if (result.success) {
      setLastBilledData({
        orderNum: `FAC-MESA-${billingTable}-${Math.floor(100 + Math.random() * 900)}`,
        table: billingTable,
        customerName: session.customerName || 'Cliente VIP',
        items: session.orders.flatMap((o) => o.items || []),
        totalCOP: result.totalPaid,
        paymentMethod: selectedPaymentMethod,
        date: result.billedAt
      });
      setShowBillModal(false);
      setShowReceiptModal(true);
      setBillingTable(null);
      setBillNotes('');
    }
  };

  const handleCreateReservation = (e) => {
    e.preventDefault();
    if (!newResClient.trim()) return;

    adminStore.addReservation({
      clientName: newResClient.trim(),
      phone: newResPhone.trim(),
      date: newResDate,
      time: newResTime,
      tableNum: Number(newResTable),
      partySize: Number(newResSize),
      eventType: newResEvent
    });

    setShowNewResModal(false);
    setNewResClient('');
    setNewResPhone('');
  };

  // Bar Pickup Orders
  const barOrders = orders.filter((o) => o.table === 'barra' || o.type === 'pickup');
  const activeBarOrders = barOrders.filter((o) => o.status !== 'billed');

  return (
    <div className="space-y-6">
      
      {/* Sub-Tab Selector Header */}
      <div className="flex items-center justify-between p-2 rounded-2xl bg-[#11131c] border border-[#232738]">
        <div className="flex items-center gap-2">
          
          <button
            onClick={() => setActiveSubTab('live')}
            className={`px-4 sm:px-5 py-2.5 rounded-xl font-black text-xs flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'live'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <UtensilsCrossed size={16} />
            <span>Pedidos en Vivo & Mesas</span>
          </button>

          <button
            onClick={() => setActiveSubTab('reservations')}
            className={`px-4 sm:px-5 py-2.5 rounded-xl font-black text-xs flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'reservations'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Calendar size={16} />
            <span>Reserva de Mesas ({reservations.filter((r) => r.status === 'active').length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('history')}
            className={`px-4 sm:px-5 py-2.5 rounded-xl font-black text-xs flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'history'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <History size={16} />
            <span>Historial de Pedidos ({orders.length})</span>
          </button>

        </div>

        
        {/* ACTION BUTTONS: Contingency & Refunds */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowContingencyModal(true)}
            className="px-3.5 py-2 rounded-xl bg-[#1a1e2d] hover:bg-[#22283c] border border-amber-500/30 text-amber-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
            title="Registrar factura manual de talonario offline"
          >
            <FileSpreadsheet size={14} className="text-amber-400" />
            <span className="hidden sm:inline">Factura Contingencia</span>
          </button>

          <button
            type="button"
            onClick={() => setShowRefundsModal(true)}
            className={`px-3.5 py-2 rounded-xl border font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md ${
              doubleChargesCount > 0
                ? 'bg-red-950/80 border-red-500 text-red-300 animate-pulse'
                : 'bg-[#1a1e2d] hover:bg-[#22283c] border-white/10 text-gray-300'
            }`}
            title="Auditoría de cobros dobles y devoluciones"
          >
            <RotateCcw size={14} className={doubleChargesCount > 0 ? 'text-red-400' : 'text-gray-400'} />
            <span className="hidden sm:inline">Devoluciones</span>
            {doubleChargesCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-red-500 text-white text-[10px] font-black">
                {doubleChargesCount}
              </span>
            )}
          </button>
        </div>

        {activeSubTab === 'reservations' && (
          <button
            onClick={() => setShowNewResModal(true)}
            className="px-4 py-2 rounded-xl bg-white/10 text-white font-bold text-xs hover:bg-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={14} />
            <span>Nueva Reserva ($20.000 COP)</span>
          </button>
        )}
      </div>

      {/* ---------------------------------------------------- */}
      {/* SUB-TAB 1: LIVE ORDERS & TABLES                     */}
      {/* ---------------------------------------------------- */}
      {activeSubTab === 'live' && (
        <div className="space-y-6">
          
          {/* BAR MOSTADOR QUICK CARD */}
          <div className="p-5 rounded-3xl bg-gradient-to-r from-[#141824] to-[#1c2233] border border-indigo-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center text-xl">
                🍸
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-white">Mostrador / Barra KAL</h3>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/40">
                    Pasarela Wompi Demo Activa
                  </span>
                </div>
                <span className="text-xs text-gray-400">
                  {activeBarOrders.length} pedidos activos para reclamar en barra • Toca para ver detalles
                </span>
              </div>
            </div>

            {/* List of active Bar Orders */}
            <div className="flex items-center gap-2 overflow-x-auto py-1">
              {activeBarOrders.length === 0 ? (
                <span className="text-xs text-gray-500 italic">No hay pedidos pendientes en barra</span>
              ) : (
                activeBarOrders.map((ord) => (
                  <div
                    key={ord.id}
                    onClick={() => setSelectedDetailItem({ type: 'bar', order: ord })}
                    className="p-2.5 rounded-2xl bg-[#0e111a] border border-indigo-500/30 hover:border-indigo-400 transition-all min-w-[200px] text-xs space-y-1 cursor-pointer"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-mono font-bold text-indigo-400">{ord.orderNum}</span>
                      <span className="text-[10px] font-black text-emerald-400">PAGADO (WOMPI)</span>
                    </div>
                    <p className="font-bold text-white truncate">{ord.customerName}</p>
                    <p className="text-[10px] text-gray-400 truncate">
                      {ord.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                    </p>
                    <div className="flex justify-between items-center pt-1 border-t border-white/10 text-[10px]">
                      <span className="font-black text-amber-400">${Number(ord.totalCOP).toLocaleString('es-CO')}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          adminStore.updateOrderStatus(ord.id, 'billed');
                        }}
                        className="px-2 py-0.5 rounded bg-emerald-500 text-black font-black text-[10px] hover:bg-emerald-400 cursor-pointer"
                      >
                        Entregar
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 15 TABLES GRID */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black uppercase text-gray-400 tracking-wider flex items-center gap-2">
                <span>📍</span>
                <span>Estado de Mesas en Vivo (1 a 15)</span>
              </h3>
              <span className="text-xs text-gray-500">Toca cualquier mesa para ver la información y comanda</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
              {Array.from({ length: 15 }, (_, i) => i + 1).map((tableNum) => {
                const session = adminStore.getTableSession(tableNum);
                const hasActiveOrders = session.isActive;

                return (
                  <motion.div
                    key={tableNum}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => {
                      if (hasActiveOrders) {
                        setSelectedDetailItem({ type: 'table', tableNum, session });
                      }
                    }}
                    className={`p-4 rounded-3xl border transition-all flex flex-col justify-between space-y-3 cursor-pointer ${
                      hasActiveOrders
                        ? 'bg-gradient-to-b from-[#181c2b] to-[#121520] border-amber-500/50 shadow-lg shadow-amber-500/10'
                        : 'bg-[#11131c] border-[#232738] text-gray-400'
                    }`}
                  >
                    {/* Top Row: Table # and Total */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center ${
                          hasActiveOrders ? 'bg-amber-500 text-black' : 'bg-white/5 text-gray-400'
                        }`}>
                          #{tableNum}
                        </div>
                        <span className="font-bold text-xs text-white">Mesa #{tableNum}</span>
                      </div>

                      {hasActiveOrders && (
                        <span className="font-mono text-xs font-black text-amber-400">
                          ${Number(session.totalCOP).toLocaleString('es-CO')}
                        </span>
                      )}
                    </div>


                    {/* Middle: Customer / Summary info */}
                    <div className="space-y-0.5">
                      {hasActiveOrders ? (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-200 truncate block">
                              {session.customerName || 'Cliente VIP'}
                            </span>
                            {session.waiterName && (
                              <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40">
                                👨‍🍳 {session.waiterName.split(' ')[0]}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-gray-400 block">
                            {session.orderCount} pedido(s) acumulado(s)
                          </span>
                        </>
                      ) : (
                        <div className="py-2 text-center text-xs text-gray-600 font-medium">
                          Disponible ($0 COP)
                        </div>
                      )}
                    </div>

                    {/* Bottom Actions */}
                    <div className="pt-2 border-t border-white/5 flex gap-1.5" onClick={(e) => e.stopPropagation()}>
                      {hasActiveOrders ? (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              setBillingTable(tableNum);
                              setShowBillModal(true);
                            }}
                            className="flex-1 py-1.5 rounded-xl bg-amber-500 text-black font-black text-[11px] hover:bg-amber-400 transition-all flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <DollarSign size={13} />
                            <span>Cobrar</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              const sess = adminStore.getTableSession(tableNum);
                              setLastBilledData({
                                orderNum: `COM-MESA-${tableNum}`,
                                table: tableNum,
                                customerName: sess.customerName || 'Cliente VIP',
                                items: sess.orders.flatMap((o) => o.items || []),
                                totalCOP: sess.totalCOP,
                                paymentMethod: 'Comanda Activa (Sin Cobrar)',
                                date: new Date().toISOString()
                              });
                              setShowReceiptModal(true);
                            }}
                            className="p-1.5 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all cursor-pointer"
                            title="Imprimir Comanda"
                          >
                            <Printer size={14} />
                          </button>

                          <button
                            type="button"
                            onClick={() => adminStore.resetTable(tableNum)}
                            className="p-1.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all cursor-pointer"
                            title="Resetear Mesa Directo"
                          >
                            <RefreshCw size={14} />
                          </button>
                        </>
                      ) : (
                        <span className="text-[10px] text-gray-600 block text-center w-full py-1">
                          Esperando clientes
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* SUB-TAB 2: TABLE RESERVATIONS                      */}
      {/* ---------------------------------------------------- */}
      {activeSubTab === 'reservations' && (
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-[#11131c] border border-[#232738] space-y-4">
            <div className="flex items-center justify-between border-b border-[#232738] pb-3">
              <div>
                <h3 className="text-base font-black text-white">Listado de Reservas Programadas</h3>
                <span className="text-xs text-gray-400">Control de asistencia y asignación de mesas VIP</span>
              </div>
              <span className="text-xs font-bold text-amber-400">
                {reservations.length} registradas en total
              </span>
            </div>

            {reservations.length === 0 ? (
              <div className="py-16 text-center text-gray-500 text-xs">
                No hay reservas registradas en el sistema.
              </div>
            ) : (
              <div className="space-y-2.5">
                {reservations.map((res) => {
                  const isCompleted = res.status === 'completed';
                  return (
                    <div
                      key={res.id}
                      className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                        isCompleted
                          ? 'bg-[#0c0e14] border-[#1d202e] opacity-60'
                          : 'bg-[#161924] border-[#292e42]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 ${
                          isCompleted ? 'bg-gray-800 text-gray-400' : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          #{res.tableNum}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-sm text-white truncate">{res.clientName}</span>
                            <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                              {res.eventType || 'Reserva VIP'}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mt-0.5">
                            <span className="flex items-center gap-1"><Calendar size={12} /> {res.date}</span>
                            <span className="flex items-center gap-1"><Clock size={12} /> {res.time}</span>
                            <span className="flex items-center gap-1"><Users size={12} /> {res.partySize} personas</span>
                            <span className="flex items-center gap-1"><Phone size={12} /> {res.phone}</span>
                          </div>
                        </div>
                      </div>

                      {/* Release Table Button */}
                      <div className="flex items-center gap-2 shrink-0">
                        {!isCompleted ? (
                          <button
                            onClick={() => adminStore.releaseReservation(res.id)}
                            className="px-3.5 py-2 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                            title="Liberar mesa al retirarse los comensales"
                          >
                            <X size={14} />
                            <span>Liberar Mesa</span>
                          </button>
                        ) : (
                          <span className="text-[11px] font-bold text-gray-500 flex items-center gap-1">
                            <CheckCircle2 size={14} className="text-emerald-500" />
                            <span>Mesa Liberada</span>
                          </span>
                        )}

                        <button
                          onClick={() => adminStore.deleteReservation(res.id)}
                          className="p-2 rounded-xl hover:bg-white/10 text-gray-500 hover:text-red-400 transition-all cursor-pointer"
                          title="Eliminar registro"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* SUB-TAB 3: HISTORIAL DE PEDIDOS (MESA VS BARRA)     */}
      {/* ---------------------------------------------------- */}
      {activeSubTab === 'history' && (() => {
        const filteredHistory = orders.filter((ord) => {
          const isBar = ord.type === 'pickup' || ord.table === 'barra';
          if (historyFilter === 'table' && isBar) return false;
          if (historyFilter === 'bar' && !isBar) return false;

          if (historySearch.trim() !== '') {
            const q = historySearch.toLowerCase();
            const client = (ord.customerName || '').toLowerCase();
            const num = (ord.orderNum || '').toLowerCase();
            const tbl = String(ord.table || '').toLowerCase();
            const itemsMatch = (ord.items || []).some((it) => (it.name || '').toLowerCase().includes(q));
            return client.includes(q) || num.includes(q) || tbl.includes(q) || itemsMatch;
          }
          return true;
        });

        const tableOrdersCount = orders.filter((o) => o.type !== 'pickup' && o.table !== 'barra').length;
        const barOrdersCount = orders.filter((o) => o.type === 'pickup' || o.table === 'barra').length;
        const totalTurnoCOP = orders.reduce((sum, o) => sum + (o.totalCOP || 0), 0);

        return (
          <div className="space-y-5">
            
            {/* Shift Notice Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#141724] to-[#1a1f30] border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg shrink-0">
                  📜
                </div>
                <div>
                  <h4 className="font-black text-white text-sm">Historial de Comandas & Pedidos del Turno</h4>
                  <span className="text-gray-400 text-[11px]">
                    Este registro se archiva y se limpia automáticamente cada vez que se realiza el <b>Cierre de Caja</b>.
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Total del Turno</span>
                  <span className="text-sm font-black text-amber-400 font-mono">
                    ${Number(totalTurnoCOP).toLocaleString('es-CO')} COP
                  </span>
                </div>
              </div>
            </div>

            {/* Filters & Search Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-3xl bg-[#11131c] border border-[#232738]">
              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto py-1">
                <button
                  onClick={() => setHistoryFilter('all')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    historyFilter === 'all'
                      ? 'bg-amber-500 text-black font-black shadow-md shadow-amber-500/20'
                      : 'bg-[#161924] text-gray-400 hover:text-white border border-[#262a3c]'
                  }`}
                >
                  Todos los Pedidos ({orders.length})
                </button>

                <button
                  onClick={() => setHistoryFilter('table')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    historyFilter === 'table'
                      ? 'bg-amber-500 text-black font-black shadow-md shadow-amber-500/20'
                      : 'bg-[#161924] text-gray-400 hover:text-white border border-[#262a3c]'
                  }`}
                >
                  <span>🍽️ Pedidos a Mesa ({tableOrdersCount})</span>
                </button>

                <button
                  onClick={() => setHistoryFilter('bar')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    historyFilter === 'bar'
                      ? 'bg-indigo-500 text-white font-black shadow-md shadow-indigo-500/20'
                      : 'bg-[#161924] text-gray-400 hover:text-white border border-[#262a3c]'
                  }`}
                >
                  <span>🍸 Pedidos a la Barra ({barOrdersCount})</span>
                </button>
              </div>

              {/* Search */}
              <div className="relative flex items-center w-full sm:w-72">
                <Search size={15} className="absolute left-3.5 text-gray-500" />
                <input
                  type="text"
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  placeholder="Buscar por cliente, orden o mesa..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0a0c12] border border-[#232738] text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Orders History List */}
            {filteredHistory.length === 0 ? (
              <div className="p-12 rounded-3xl bg-[#11131c] border border-[#232738] text-center space-y-3">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-white/5 flex items-center justify-center text-3xl">
                  📜
                </div>
                <h4 className="font-black text-white text-base">Sin pedidos en este filtro</h4>
                <p className="text-xs text-gray-400 max-w-sm mx-auto">
                  No hay pedidos registrados para este filtro en el turno actual o la caja fue recién cerrada.
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-3xl bg-[#11131c] border border-[#232738] space-y-3">
                <div className="grid grid-cols-12 text-[10px] font-black uppercase text-gray-500 px-3 py-2 border-b border-[#232738]">
                  <span className="col-span-4 sm:col-span-3">Origen & Orden</span>
                  <span className="col-span-4 sm:col-span-3">Titular / Cliente</span>
                  <span className="hidden sm:block sm:col-span-3">Productos & Pago</span>
                  <span className="col-span-4 sm:col-span-3 text-right">Total & Acciones</span>
                </div>

                <div className="space-y-2">
                  {filteredHistory.map((ord) => {
                    const isBar = ord.type === 'pickup' || ord.table === 'barra';
                    const items = ord.items || [];
                    const itemsText = items.map((it) => `${it.quantity || 1}x ${it.name}`).join(', ');
                    const dateFormatted = new Date(ord.createdAt || ord.billedAt || Date.now()).toLocaleTimeString('es-CO', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    });

                    return (
                      <div
                        key={ord.id}
                        className="grid grid-cols-12 items-center p-3.5 rounded-2xl bg-[#161924] border border-[#262a3c] hover:border-gray-600 transition-all gap-2 text-xs"
                      >
                        {/* Origin & Order # */}
                        <div className="col-span-4 sm:col-span-3 flex items-center gap-2.5 min-w-0">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                            isBar ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}>
                            {isBar ? '🍸' : `#${ord.table}`}
                          </div>
                          <div className="min-w-0">
                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full inline-block mb-0.5 ${
                              isBar ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            }`}>
                              {isBar ? 'Barra Express' : `Mesa #${ord.table}`}
                            </span>
                            <span className="font-mono text-gray-300 font-bold block truncate text-[11px]">
                              {ord.orderNum}
                            </span>
                          </div>
                        </div>

                        {/* Customer & Time */}
                        <div className="col-span-4 sm:col-span-3 min-w-0">
                          <span className="font-extrabold text-white block truncate">
                            {ord.customerName || 'Cliente VIP'}
                          </span>
                          <span className="text-[10px] text-gray-400 flex items-center gap-1 font-mono">
                            <Clock size={11} className="text-amber-400" />
                            <span>{dateFormatted}</span>
                            {ord.phone && <span>• {ord.phone}</span>}
                          </span>
                        </div>

                        {/* Products & Payment Method */}
                        <div className="hidden sm:block sm:col-span-3 min-w-0">
                          <span className="text-gray-300 block truncate text-[11px] font-medium" title={itemsText}>
                            {itemsText || 'Productos VIP'}
                          </span>
                          <span className="text-[10px] font-mono text-emerald-400 block truncate">
                            {ord.wompiTransactionId
                              ? `💳 Wompi: ${ord.wompiTransactionId}`
                              : `💵 ${ord.paymentMethod || 'Efectivo'}`}
                          </span>
                        </div>

                        {/* Total & Action Buttons */}
                        <div className="col-span-4 sm:col-span-3 flex items-center justify-end gap-2">
                          <span className="font-mono font-black text-amber-400 text-xs sm:text-sm">
                            ${Number(ord.totalCOP).toLocaleString('es-CO')}
                          </span>

                          <button
                            type="button"
                            onClick={() => {
                              if (isBar) {
                                setSelectedDetailItem({ type: 'bar', order: ord });
                              } else {
                                const sess = adminStore.getTableSession(ord.table);
                                setSelectedDetailItem({ type: 'table', tableNum: ord.table, session: sess });
                              }
                            }}
                            className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition-all cursor-pointer shrink-0"
                            title="Ver Comanda Completa"
                          >
                            <FileText size={14} />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setLastBilledData({
                                orderNum: ord.orderNum,
                                table: ord.table,
                                customerName: ord.customerName || 'Cliente VIP',
                                items: ord.items || [],
                                totalCOP: ord.totalCOP,
                                paymentMethod: ord.wompiTransactionId ? 'Wompi Demo' : (ord.paymentMethod || 'Efectivo'),
                                date: ord.createdAt || new Date().toISOString()
                              });
                              setShowReceiptModal(true);
                            }}
                            className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition-all cursor-pointer shrink-0"
                            title="Imprimir Ticket"
                          >
                            <Printer size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        );
      })()}

      {/* ---------------------------------------------------- */}
      {/* MODAL: FACTURACIÓN Y RESETEO DE MESA                 */}
      {/* ---------------------------------------------------- */}
      <AnimatePresence>
        {showBillModal && billingTable && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              className="w-full max-w-md bg-[#12141c] border border-[#2a2e3f] rounded-3xl p-6 text-white shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[#2a2e3f] pb-3">
                <div className="flex items-center gap-2 text-amber-400">
                  <DollarSign size={20} />
                  <div>
                    <h3 className="text-base font-black text-white">Facturar y Resetear Mesa #{billingTable}</h3>
                    <span className="text-[10px] text-gray-400">Cierre de comanda para nuevos comensales</span>
                  </div>
                </div>
                <button onClick={() => setShowBillModal(false)} className="p-1 rounded-full hover:bg-white/10 text-gray-400">
                  <X size={18} />
                </button>
              </div>

              {/* Bill Details */}
              {(() => {
                const session = adminStore.getTableSession(billingTable);
                return (
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-[#171b26] border border-[#2a2e3f] space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Cliente / Titular:</span>
                        <span className="font-bold text-white">{session.customerName || 'Cliente VIP'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total de Pedidos:</span>
                        <span className="font-bold text-white">{session.orderCount} comandas acumuladas</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-white/10 text-base font-black text-amber-400">
                        <span>Total a Facturar:</span>
                        <span>${Number(session.totalCOP).toLocaleString('es-CO')} COP</span>
                      </div>
                    </div>

                    {/* Payment Method Selector */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-300 block">
                        Selecciona el Medio de Pago Recibido:
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: 'Efectivo', label: '💵 Efectivo' },
                          { id: 'Transferencia Bancolombia', label: '🏦 Bancolombia' },
                          { id: 'Nequi', label: '📱 Nequi' },
                          { id: 'Daviplata', label: '📲 Daviplata' },
                          { id: 'Datáfono / Tarjeta', label: '💳 Datáfono' }
                        ].map((m) => (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => setSelectedPaymentMethod(m.id)}
                            className={`p-2.5 rounded-xl border text-xs font-bold text-left flex items-center justify-between transition-all cursor-pointer ${
                              selectedPaymentMethod === m.id
                                ? 'bg-amber-500 text-black border-transparent shadow'
                                : 'bg-[#171b26] text-gray-300 border-[#2a2e3f] hover:border-gray-500'
                            }`}
                          >
                            <span>{m.label}</span>
                            {selectedPaymentMethod === m.id && <Check size={14} strokeWidth={3} />}
                          </button>
                        ))}
                      </div>
                    </div>

                    
                      {/* Electronic Invoice Trigger */}
                      <button
                        type="button"
                        onClick={() => {
                          const sess = adminStore.getTableSession(billingTable);
                          setOrderForElectronic({
                            id: `ORD-MESA-${billingTable}`,
                            table: billingTable,
                            customerName: sess.customerName || 'Cliente VIP',
                            totalCOP: sess.totalCOP,
                            paymentMethod: selectedPaymentMethod,
                            items: sess.orders.flatMap((o) => o.items || [])
                          });
                          setShowElectronicModal(true);
                        }}
                        className="w-full py-2.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <FileText size={14} />
                        <span>Generar Factura Electrónica (DIAN / CUFE)</span>
                      </button>

                    {/* Notice */}
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300">
                      💡 Al confirmar el cobro, la Mesa #{billingTable} se reseteará a $0 COP automáticamente y quedará libre para el próximo grupo.
                    </div>

                    {/* Actions */}
                    <div className="pt-2 border-t border-[#2a2e3f] flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowBillModal(false)}
                        className="px-4 py-2.5 rounded-xl bg-[#171b26] text-gray-400 text-xs font-bold hover:text-white"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={handleConfirmBilling}
                        className="px-5 py-2.5 rounded-xl bg-amber-500 text-black font-black text-xs hover:bg-amber-400 shadow-lg shadow-amber-500/20 flex items-center gap-1.5"
                      >
                        <Check size={15} strokeWidth={3} />
                        <span>Confirmar Cobro & Resetear</span>
                      </button>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ---------------------------------------------------- */}
      {/* MODAL: NUEVA RESERVA                                 */}
      {/* ---------------------------------------------------- */}
      <AnimatePresence>
        {showNewResModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              className="w-full max-w-md bg-[#12141c] border border-[#2a2e3f] rounded-3xl p-6 text-white shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[#2a2e3f] pb-3">
                <div className="flex items-center gap-2 text-amber-400">
                  <Calendar size={18} />
                  <h3 className="text-base font-black text-white">Crear Nueva Reserva VIP</h3>
                </div>
                <button onClick={() => setShowNewResModal(false)} className="p-1 rounded-full hover:bg-white/10 text-gray-400">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateReservation} className="space-y-3 text-xs">
                <div>
                  <label className="text-gray-400 block mb-1 font-bold">Nombre del Cliente *</label>
                  <input
                    type="text"
                    required
                    value={newResClient}
                    onChange={(e) => setNewResClient(e.target.value)}
                    placeholder="Ej: Laura Ramírez"
                    className="w-full p-2.5 rounded-xl bg-[#0a0c12] border border-[#2a2e3f] text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-gray-400 block mb-1 font-bold">Teléfono / WhatsApp</label>
                    <input
                      type="tel"
                      value={newResPhone}
                      onChange={(e) => setNewResPhone(e.target.value)}
                      placeholder="312 456 7890"
                      className="w-full p-2.5 rounded-xl bg-[#0a0c12] border border-[#2a2e3f] text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 block mb-1 font-bold">Mesa Asignada</label>
                    <select
                      value={newResTable}
                      onChange={(e) => setNewResTable(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-[#0a0c12] border border-[#2a2e3f] text-white focus:outline-none focus:border-amber-400"
                    >
                      {Array.from({ length: 15 }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>Mesa #{n}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-gray-400 block mb-1 font-bold">Fecha</label>
                    <input
                      type="date"
                      value={newResDate}
                      onChange={(e) => setNewResDate(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-[#0a0c12] border border-[#2a2e3f] text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 block mb-1 font-bold">N° Personas</label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={newResSize}
                      onChange={(e) => setNewResSize(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-[#0a0c12] border border-[#2a2e3f] text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-gray-400 block mb-1 font-bold">Horario de Reserva</label>
                  <select
                    value={newResTime}
                    onChange={(e) => setNewResTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#0a0c12] border border-[#2a2e3f] text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="19:00 - 21:00 (Previa & Cócteles)">19:00 - 21:00 (Previa & Cócteles)</option>
                    <option value="21:00 - 23:00 (Rumba Nocturna VIP)">21:00 - 23:00 (Rumba Nocturna VIP)</option>
                    <option value="23:00 - 01:00 (Pico de Fiesta)">23:00 - 01:00 (Pico de Fiesta)</option>
                  </select>
                </div>

                <div className="pt-3 border-t border-[#2a2e3f] flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowNewResModal(false)}
                    className="px-4 py-2.5 rounded-xl bg-[#171b26] text-gray-400 font-bold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-amber-500 text-black font-black hover:bg-amber-400 shadow"
                  >
                    Crear Reserva
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ---------------------------------------------------- */}
      {/* MODAL: DETALLES COMPLETOS DE PEDIDO / COMANDA       */}
      {/* ---------------------------------------------------- */}
      <AnimatePresence>
        {selectedDetailItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 15 }}
              className="w-full max-w-lg bg-[#12141c] border border-[#2a2e3f] rounded-3xl p-6 text-white shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#2a2e3f] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 font-black text-base">
                    {selectedDetailItem.type === 'bar' ? '🍸' : `#${selectedDetailItem.tableNum}`}
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white">
                      {selectedDetailItem.type === 'bar'
                        ? `Pedido en Barra (${selectedDetailItem.order.orderNum})`
                        : `Comanda en Mesa #${selectedDetailItem.tableNum}`}
                    </h3>
                    <span className="text-[10px] text-gray-400">
                      {selectedDetailItem.type === 'bar' ? 'Entrega express en mostrador' : 'Consumo acumulado en mesa'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedDetailItem(null)}
                  className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Order Content Info */}
              {(() => {
                const isBar = selectedDetailItem.type === 'bar';
                const items = isBar
                  ? selectedDetailItem.order.items || []
                  : (selectedDetailItem.session.orders || []).flatMap((o) => o.items || []);
                const total = isBar
                  ? selectedDetailItem.order.totalCOP
                  : selectedDetailItem.session.totalCOP;
                const client = isBar
                  ? selectedDetailItem.order.customerName
                  : selectedDetailItem.session.customerName;
                const phone = isBar ? selectedDetailItem.order.phone : '';
                const notes = isBar
                  ? selectedDetailItem.order.notes
                  : (selectedDetailItem.session.orders || []).map((o) => o.notes).filter(Boolean).join(' • ');

                return (
                  <div className="space-y-4 text-xs">
                    {/* Meta info banner */}
                    <div className="grid grid-cols-2 gap-2 p-3.5 rounded-2xl bg-[#171b26] border border-[#2a2e3f]">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-gray-400 block">Titular</span>
                        <span className="font-extrabold text-white">{client || 'Cliente VIP'}</span>
                      </div>
                      {phone && (
                        <div>
                          <span className="text-[10px] uppercase font-bold text-gray-400 block">Teléfono / WhatsApp</span>
                          <span className="font-mono text-gray-200">{phone}</span>
                        </div>
                      )}
                      {notes && (
                        <div className="col-span-2 pt-1.5 border-t border-white/5">
                          <span className="text-[10px] uppercase font-bold text-amber-400 block">Instrucciones Especiales</span>
                          <span className="text-gray-300 italic">{notes}</span>
                        </div>
                      )}
                      {isBar && selectedDetailItem.order.wompiTransactionId && (
                        <div className="col-span-2 pt-1.5 border-t border-white/5 flex items-center justify-between">
                          <span className="text-[10px] uppercase font-bold text-emerald-400">Verificación Wompi Demo</span>
                          <span className="font-mono font-black text-emerald-300">
                            {selectedDetailItem.order.wompiTransactionId}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Itemized list */}
                    <div className="space-y-2">
                      <span className="text-xs font-black uppercase text-gray-400 tracking-wider block">
                        Artículos en la Comanda ({items.length})
                      </span>
                      <div className="p-3 rounded-2xl bg-[#171b26] border border-[#2a2e3f] space-y-2 max-h-48 overflow-y-auto">
                        {items.map((item, idx) => {
                          const itemSub = (item.priceCOP || 0) * (item.quantity || 1);
                          return (
                            <div key={idx} className="flex items-center justify-between py-1 border-b border-white/5 last:border-0">
                              <div className="flex items-center gap-2">
                                <span className="w-5 h-5 rounded-lg bg-amber-500/20 text-amber-400 font-bold text-[10px] flex items-center justify-center">
                                  {item.quantity}x
                                </span>
                                <span className="font-bold text-gray-200">{item.name}</span>
                              </div>
                              <span className="font-black text-white font-mono">
                                ${Number(itemSub).toLocaleString('es-CO')}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Total */}
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-[#171b26] to-[#1e2333] border border-amber-500/30 flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-300">Total a Pagar:</span>
                      <span className="text-xl font-black text-amber-400">
                        ${Number(total).toLocaleString('es-CO')} COP
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="pt-2 border-t border-[#2a2e3f] flex flex-wrap items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedDetailItem(null)}
                        className="px-4 py-2.5 rounded-xl bg-[#171b26] text-gray-400 hover:text-white font-bold"
                      >
                        Cerrar
                      </button>

                      {/* Print button */}
                      <button
                        type="button"
                        onClick={() => {
                          setLastBilledData({
                            orderNum: isBar ? selectedDetailItem.order.orderNum : `COM-MESA-${selectedDetailItem.tableNum}`,
                            table: isBar ? 'barra' : selectedDetailItem.tableNum,
                            customerName: client || 'Cliente VIP',
                            items,
                            totalCOP: total,
                            paymentMethod: isBar ? 'Wompi Demo' : 'Comanda en Vivo',
                            date: new Date().toISOString()
                          });
                          setSelectedDetailItem(null);
                          setShowReceiptModal(true);
                        }}
                        className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold flex items-center gap-1.5"
                      >
                        <Printer size={15} />
                        <span>Imprimir Comanda</span>
                      </button>

                      {!isBar && (
                        <button
                          type="button"
                          onClick={() => {
                            const tNum = selectedDetailItem.tableNum;
                            setSelectedDetailItem(null);
                            setBillingTable(tNum);
                            setShowBillModal(true);
                          }}
                          className="px-5 py-2.5 rounded-xl bg-amber-500 text-black font-black hover:bg-amber-400 shadow-lg shadow-amber-500/20 flex items-center gap-1.5"
                        >
                          <DollarSign size={15} />
                          <span>Cobrar & Resetear Mesa</span>
                        </button>
                      )}

                      {isBar && (
                        <button
                          type="button"
                          onClick={() => {
                            adminStore.updateOrderStatus(selectedDetailItem.order.id, 'billed');
                            setSelectedDetailItem(null);
                          }}
                          className="px-5 py-2.5 rounded-xl bg-emerald-500 text-black font-black hover:bg-emerald-400 shadow-lg flex items-center gap-1.5"
                        >
                          <Check size={15} strokeWidth={3} />
                          <span>Marcar Entregado</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* POS RECEIPT PRINT MODAL */}
      <ReceiptModal
        isOpen={showReceiptModal}
        onClose={() => setShowReceiptModal(false)}
        billData={lastBilledData}
      />

      {/* CONTINGENCY INVOICE MODAL */}
      {showContingencyModal && (
        <ContingencyModal
          onClose={() => setShowContingencyModal(false)}
          onSuccess={() => {
            setOrders(adminStore.getOrders());
          }}
        />
      )}

      {/* REFUNDS AND DUPLICATES MODAL */}
      {showRefundsModal && (
        <RefundsAndDuplicatesModal
          onClose={() => setShowRefundsModal(false)}
          onSuccess={() => {
            setOrders(adminStore.getOrders());
            setDoubleChargesCount(adminStore.detectDoubleCharges().length);
          }}
        />
      )}

      {/* ELECTRONIC INVOICE MODAL */}
      {showElectronicModal && (
        <ElectronicInvoiceModal
          orderData={orderForElectronic}
          onClose={() => setShowElectronicModal(false)}
        />
      )}


    </div>
  );
}
