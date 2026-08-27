import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileSpreadsheet, X, AlertCircle } from 'lucide-react';
import { adminStore } from '../../services/adminStore';
import CustomSelect from '../common/CustomSelect';

export default function ContingencyModal({ onClose, onSuccess }) {
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [totalCOP, setTotalCOP] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Efectivo');
  const [tableNumber, setTableNumber] = useState('1');
  const [notes, setNotes] = useState('Factura manual por contingencia offline');

  const paymentOptions = [
    { value: 'Efectivo', label: '💵 Efectivo' },
    { value: 'Transferencia Bancolombia', label: '🏦 Bancolombia' },
    { value: 'Nequi', label: '📱 Nequi' },
    { value: 'Daviplata', label: '📲 Daviplata' },
    { value: 'Datáfono / Tarjeta', label: '💳 Datáfono / Tarjeta' }
  ];

  const tableOptions = [
    { value: 'barra', label: '🍸 Mostrador de Barra' },
    ...Array.from({ length: 15 }, (_, i) => ({
      value: String(i + 1),
      label: `🛎️ Mesa #${i + 1}`
    }))
  ];

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
    <div className="fixed inset-0 z-[99999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        className="w-full max-w-lg bg-[#11131c] border border-amber-500/30 rounded-3xl p-6 sm:p-7 text-white space-y-5 shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black uppercase text-white">Factura de Contingencia</h2>
              <p className="text-xs text-gray-400">Registro de talonario físico offline para caja</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">N° Talonario / Factura *</label>
              <input
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                placeholder="Ej: TAL-0452"
                required
                className="w-full bg-[#181a24] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 font-bold font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">Monto Total COP *</label>
              <input
                type="number"
                value={totalCOP}
                onChange={(e) => setTotalCOP(e.target.value)}
                placeholder="Ej: 180000"
                required
                className="w-full bg-[#181a24] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-amber-400 focus:outline-none focus:border-amber-400 font-black text-base font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">Medio de Pago</label>
              <CustomSelect
                value={paymentMethod}
                onChange={(val) => setPaymentMethod(val)}
                options={paymentOptions}
                placeholder="Seleccionar medio de pago"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">Mesa o Barra</label>
              <CustomSelect
                value={tableNumber}
                onChange={(val) => setTableNumber(val)}
                options={tableOptions}
                placeholder="Seleccionar ubicación"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">Motivo / Observaciones</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej: Falla temporal de red wifi"
              className="w-full bg-[#181a24] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2.5 text-xs text-amber-200">
            <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              💡 Esta factura manual se registrará en el <strong>Informe de Contingencias</strong> y se sumará al cuadre diario de caja.
            </p>
          </div>

          <div className="flex items-center gap-3 pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl bg-[#181a24] hover:bg-white/10 text-gray-300 text-xs font-bold uppercase transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              Registrar en Caja
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
