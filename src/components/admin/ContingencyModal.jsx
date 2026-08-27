import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileSpreadsheet, X, AlertCircle } from 'lucide-react';
import { adminStore } from '../../services/adminStore';

export default function ContingencyModal({ onClose, onSuccess }) {
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [totalCOP, setTotalCOP] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Efectivo');
  const [tableNumber, setTableNumber] = useState('1');
  const [notes, setNotes] = useState('Factura manual por contingencia offline');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!totalCOP || parseFloat(totalCOP) <= 0) return;

    const res = adminStore.addContingencyInvoice({
      invoiceNumber: invoiceNumber || ('TAL-' + Math.floor(1000 + Math.random() * 9000)),
      totalCOP: parseFloat(totalCOP),
      paymentMethod,
      tableNumber: tableNumber === 'barra' ? 'Barra' : 'Mesa #' + tableNumber,
      cashierName: '👑 admin',
      notes
    });

    if (res.success) {
      onSuccess?.(res.invoice);
      onClose?.();
    }
  };

  return (
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
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black uppercase text-white">Factura de Contingencia</h2>
              <p className="text-xs text-gray-400">Registro de talonario manual por caída de internet o energía</p>
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300 uppercase">N° Talonario / Factura *</label>
              <input
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                placeholder="Ej: TAL-0452"
                required
                className="w-full bg-[#1a1d2c] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300 uppercase">Monto Total COP *</label>
              <input
                type="number"
                value={totalCOP}
                onChange={(e) => setTotalCOP(e.target.value)}
                placeholder="Ej: 180000"
                required
                className="w-full bg-[#1a1d2c] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-amber-400 focus:outline-none focus:border-amber-400 font-black text-base"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300 uppercase">Medio de Pago</label>
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

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300 uppercase">Mesa o Barra</label>
              <select
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                className="w-full bg-[#1a1d2c] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="barra">Mostrador de Barra</option>
                {Array.from({ length: 15 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>Mesa #{n}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-300 uppercase">Motivo / Observaciones</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej: Falla temporal de red wifi"
              className="w-full bg-[#1a1d2c] border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-200">
            <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <p>Esta factura se sumará automáticamente a las métricas del día y al cuadre final de caja.</p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold uppercase transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              Registrar en Caja
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
