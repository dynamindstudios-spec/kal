import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, AlertTriangle, Check, X } from 'lucide-react';
import { adminStore } from '../../services/adminStore';

export default function RefundsAndDuplicatesModal({ onClose, onSuccess }) {
  const [activeTab, setActiveTab] = useState('duplicates');
  const [duplicates, setDuplicates] = useState(() => adminStore.detectDoubleCharges());
  const [refunds, setRefunds] = useState(() => adminStore.getRefunds());
  const [orders] = useState(() => adminStore.getOrders().filter((o) => o.status === 'billed' || o.isPaid));

  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [refundAmount, setRefundAmount] = useState('');
  const [refundReason, setRefundReason] = useState('Cobro duplicado por datáfono / app');
  const [paymentMethod, setPaymentMethod] = useState('Efectivo');

  const handleSelectDuplicateForRefund = (dup) => {
    setSelectedOrderId(dup.duplicateCandidate.id);
    setRefundAmount(dup.amount);
    setRefundReason('Cobro doble detectado (transacción repetida en ' + dup.diffMinutes + ' min)');
    setPaymentMethod(dup.duplicateCandidate.paymentMethod || 'Efectivo');
    setActiveTab('new_refund');
  };

  const handleProcessRefund = (e) => {
    e.preventDefault();
    if (!selectedOrderId || !refundAmount) return;

    const res = adminStore.processRefund({
      orderId: selectedOrderId,
      amount: parseFloat(refundAmount),
      reason: refundReason,
      paymentMethod,
      cashierName: '👑 admin'
    });

    if (res.success) {
      setRefunds(adminStore.getRefunds());
      setDuplicates(adminStore.detectDoubleCharges());
      setActiveTab('history');
      onSuccess?.();
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        className="w-full max-w-2xl max-h-[90vh] bg-[#12141e] border border-amber-500/30 rounded-3xl p-6 sm:p-7 text-white space-y-5 shadow-2xl flex flex-col"
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-4 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black uppercase text-white">Devoluciones & Cobros Dobles</h2>
              <p className="text-xs text-gray-400">Auditoría automática de duplicados y reintegro de dinero y stock</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-2 bg-[#1a1d2c] p-1.5 rounded-2xl border border-white/5 flex-shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('duplicates')}
            className={'flex-1 py-2 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer flex items-center justify-center gap-2 ' + (activeTab === 'duplicates' ? 'bg-red-600 text-white shadow-md shadow-red-600/30' : 'text-gray-400 hover:text-white')}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Cobros Dobles ({duplicates.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('new_refund')}
            className={'flex-1 py-2 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer ' + (activeTab === 'new_refund' ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20' : 'text-gray-400 hover:text-white')}
          >
            Nueva Devolución
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={'flex-1 py-2 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer ' + (activeTab === 'history' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white')}
          >
            Historial ({refunds.length})
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {activeTab === 'duplicates' && (
            <div className="space-y-3">
              {duplicates.length === 0 ? (
                <div className="text-center py-12 space-y-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
                    <Check className="w-6 h-6" />
                  </div>
                  <p className="font-bold text-white text-sm">No se detectaron cobros dobles sospechosos</p>
                  <p className="text-xs text-gray-500">El sistema monitorea transacciones consecutivas con idéntico valor.</p>
                </div>
              ) : (
                duplicates.map((dup, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-2xl bg-red-950/30 border border-red-500/40 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 text-[10px] font-black uppercase">
                          Alerta de Cobro Doble en {dup.diffMinutes} min
                        </span>
                        <h4 className="font-bold text-white text-sm">
                          {dup.table ? 'Mesa #' + dup.table : 'Barra'} • ${dup.amount.toLocaleString('es-CO')} COP
                        </h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleSelectDuplicateForRefund(dup)}
                        className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-red-600/30"
                      >
                        Hacer Devolución
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-400 bg-black/30 p-2.5 rounded-xl">
                      <div>
                        <p className="text-gray-500">Orden 1 (Original):</p>
                        <p className="font-bold text-white">{dup.primaryOrder.orderNum}</p>
                        <p>{new Date(dup.primaryOrder.billedAt || dup.primaryOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Orden 2 (Duplicada):</p>
                        <p className="font-bold text-red-400">{dup.duplicateCandidate.orderNum}</p>
                        <p>{new Date(dup.duplicateCandidate.billedAt || dup.duplicateCandidate.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'new_refund' && (
            <form onSubmit={handleProcessRefund} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300 uppercase">Seleccionar Orden Facturada *</label>
                <select
                  value={selectedOrderId}
                  onChange={(e) => {
                    setSelectedOrderId(e.target.value);
                    const sel = orders.find((o) => o.id === e.target.value);
                    if (sel) {
                      setRefundAmount(sel.totalCOP);
                      setPaymentMethod(sel.paymentMethod || 'Efectivo');
                    }
                  }}
                  required
                  className="w-full bg-[#1a1d2c] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="">-- Elige la orden a reembolsar --</option>
                  {orders.map((ord) => (
                    <option key={ord.id} value={ord.id}>
                      {ord.orderNum} • {ord.table ? 'Mesa #' + ord.table : 'Barra'} • ${ord.totalCOP.toLocaleString('es-CO')} COP ({ord.paymentMethod || 'N/A'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300 uppercase">Monto a Devolver COP *</label>
                  <input
                    type="number"
                    value={refundAmount}
                    onChange={(e) => setRefundAmount(e.target.value)}
                    required
                    className="w-full bg-[#1a1d2c] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-red-400 font-bold focus:outline-none focus:border-red-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300 uppercase">Medio de Devolución</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full bg-[#1a1d2c] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Efectivo">Efectivo</option>
                    <option value="Transferencia Bancolombia">Bancolombia</option>
                    <option value="Nequi">Nequi</option>
                    <option value="Daviplata">Daviplata</option>
                    <option value="Datáfono / Tarjeta">Datáfono / Tarjeta</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300 uppercase">Motivo de la Devolución *</label>
                <input
                  type="text"
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  placeholder="Ej: Cobro doble, plato cancelado o error"
                  required
                  className="w-full bg-[#1a1d2c] border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-200">
                Al procesar la devolución, el dinero se descontará del cuadre de caja y los licores/bebidas se reintegrarán al stock de inventario.
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-red-600/30"
              >
                Confirmar y Procesar Devolución
              </button>
            </form>
          )}

          {activeTab === 'history' && (
            <div className="space-y-2">
              {refunds.length === 0 ? (
                <div className="text-center py-12 text-gray-500 text-xs">
                  No hay devoluciones registradas en la jornada.
                </div>
              ) : (
                refunds.map((ref) => (
                  <div
                    key={ref.id}
                    className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between text-xs"
                  >
                    <div className="space-y-0.5">
                      <p className="font-bold text-white">{ref.orderNum} • {ref.table ? 'Mesa #' + ref.table : 'Barra'}</p>
                      <p className="text-gray-400 text-[11px]">{ref.reason}</p>
                      <p className="text-[10px] text-gray-500">Por: {ref.cashierName} • {new Date(ref.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                    <span className="font-black text-red-400 text-sm">
                      -${ref.amount.toLocaleString('es-CO')}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
