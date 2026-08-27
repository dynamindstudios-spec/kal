import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FileSpreadsheet, X, AlertCircle, Upload, Download, CheckCircle2, Laptop, RefreshCw } from 'lucide-react';
import { adminStore } from '../../services/adminStore';
import CustomSelect from '../common/CustomSelect';

export default function ContingencyModal({ onClose, onSuccess }) {
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [totalCOP, setTotalCOP] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Efectivo');
  const [tableNumber, setTableNumber] = useState('1');
  const [notes, setNotes] = useState('Factura manual por contingencia offline');
  
  const [importStatusMsg, setImportStatusMsg] = useState('');
  const fileInputRef = useRef(null);

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

  // Manejar Registro Individual Manual
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

  // Descargar Plantilla Offline de Escritorio
  const handleDownloadTemplate = () => {
    const text = adminStore.getContingencyTemplateText();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Plantilla_Facturas_Contingencia_KAL.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Subir Archivo de Facturas
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportStatusMsg('');

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (content) {
        const res = adminStore.importContingencyFromText(String(content));
        if (res.success) {
          setImportStatusMsg(res.message);
          setTimeout(() => {
            onSuccess?.(res);
            onClose?.();
          }, 1500);
        } else {
          setImportStatusMsg(res.message || 'Error al procesar el archivo.');
        }
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Sincronizar Cola Local de la Terminal Offline
  const handleSyncLocalQueue = () => {
    try {
      const queue = JSON.parse(localStorage.getItem('kal_contingency_offline_queue')) || [];
      if (queue.length === 0) {
        setImportStatusMsg('No hay facturas pendientes en la App Offline de este equipo.');
        return;
      }
      let text = '';
      queue.forEach((i) => {
        text += `${i.invoiceNumber} | ${i.totalCOP} | ${i.paymentMethod} | ${i.tableNumber} | ${i.notes}\n`;
      });
      const res = adminStore.importContingencyFromText(text);
      if (res.success) {
        setImportStatusMsg(`⚡ ¡${res.message}! Sincronizadas desde la App Offline.`);
        localStorage.removeItem('kal_contingency_offline_queue');
        setTimeout(() => {
          onSuccess?.(res);
          onClose?.();
        }, 1500);
      } else {
        setImportStatusMsg(res.message || 'Error al sincronizar.');
      }
    } catch (e) {
      setImportStatusMsg('Error al leer los datos locales.');
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
              <h2 className="text-lg font-black uppercase text-white">Facturas de Contingencia</h2>
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

        {/* Cargar desde Archivo o Terminal Banner */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".txt,.csv,.json"
          className="hidden"
        />

        <div className="p-3.5 rounded-2xl bg-[#181b28] border border-white/10 space-y-2.5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-amber-300 block uppercase">
                🖥️ Terminal Offline de Escritorio
              </span>
              <p className="text-[11px] text-gray-400">
                Registra talonarios sin internet y sincroniza con 1 clic
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => window.open('/KAL_Contingencia_Offline.html', '_blank')}
                className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                title="Abrir App de Escritorio Offline"
              >
                <Laptop size={13} className="text-amber-400" />
                <span>Abrir App</span>
              </button>
              <button
                type="button"
                onClick={handleSyncLocalQueue}
                className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                title="Sincronizar facturas guardadas en la App Offline"
              >
                <RefreshCw size={13} className="text-emerald-400" />
                <span>Sincronizar</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-white/5 flex-wrap">
            <span className="text-[10px] text-gray-400 font-bold uppercase">O por archivo:</span>
            <button
              type="button"
              onClick={handleDownloadTemplate}
              className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer"
            >
              <Download size={12} className="text-amber-400" />
              <span>Plantilla (.txt)</span>
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-[11px] font-black flex items-center gap-1 transition-all shadow-sm cursor-pointer ml-auto"
            >
              <Upload size={12} />
              <span>Subir Archivo</span>
            </button>
          </div>
        </div>

        {importStatusMsg && (
          <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-center">
            {importStatusMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-2 pt-1">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">O registrar manualmente:</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

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
              💡 Esta factura manual se registrará en el <strong>Informe de Contingencias</strong> y se sumará al totalizado y medios de pago de caja.
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
              className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-amber-500/10 cursor-pointer"
            >
              Registrar en Caja
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
