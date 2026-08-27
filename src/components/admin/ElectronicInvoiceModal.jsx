import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { QrCode, FileText, X, Printer } from 'lucide-react';
import { adminStore } from '../../services/adminStore';

export default function ElectronicInvoiceModal({ orderData, onClose, onGenerated }) {
  const [clientName, setClientName] = useState(orderData?.customerName || '');
  const [docType, setDocType] = useState('CC');
  const [docNumber, setDocNumber] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('Medellín, Colombia');
  const [generatedInvoice, setGeneratedInvoice] = useState(null);

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!docNumber || !clientName) return;

    const res = adminStore.generateElectronicInvoice({
      orderId: orderData?.id || 'ORD-GEN',
      tableNum: orderData?.table || 'Barra',
      clientName,
      docType,
      docNumber,
      email,
      address,
      totalCOP: orderData?.totalCOP || 0,
      paymentMethod: orderData?.paymentMethod || 'Efectivo',
      items: orderData?.items || []
    });

    if (res.success) {
      setGeneratedInvoice(res.invoice);
      onGenerated?.(res.invoice);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        className="w-full max-w-xl max-h-[90vh] bg-[#12141e] border border-amber-500/30 rounded-3xl p-6 sm:p-7 text-white space-y-5 shadow-2xl flex flex-col"
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-4 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black uppercase text-white">Factura Electrónica</h2>
              <p className="text-xs text-gray-400">Emisión DIAN con CUFE, código QR y desglose de impoconsumo</p>
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

        {!generatedInvoice ? (
          <form onSubmit={handleGenerate} className="space-y-4 flex-1 overflow-y-auto pr-1">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300 uppercase">Nombre / Razón Social *</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Ej: Juan Pérez o Empresa SAS"
                  required
                  className="w-full bg-[#1a1d2c] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-3 gap-1.5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300 uppercase">Tipo</label>
                  <select
                    value={docType}
                    onChange={(e) => setDocType(e.target.value)}
                    className="w-full bg-[#1a1d2c] border border-white/10 rounded-xl px-2 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="CC">CC</option>
                    <option value="NIT">NIT</option>
                    <option value="CE">CE</option>
                    <option value="PP">PP</option>
                  </select>
                </div>
                <div className="col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-gray-300 uppercase">Número *</label>
                  <input
                    type="text"
                    value={docNumber}
                    onChange={(e) => setDocNumber(e.target.value)}
                    placeholder="Ej: 1037654321"
                    required
                    className="w-full bg-[#1a1d2c] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300 uppercase">Correo Electrónico</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="cliente@correo.com"
                  className="w-full bg-[#1a1d2c] border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300 uppercase">Dirección</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ej: Cra 43A # 1-50"
                  className="w-full bg-[#1a1d2c] border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1 text-xs">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal (Base Imponible):</span>
                <span>${Math.round((orderData?.totalCOP || 0) / 1.08).toLocaleString('es-CO')}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Impoconsumo (8%):</span>
                <span>${((orderData?.totalCOP || 0) - Math.round((orderData?.totalCOP || 0) / 1.08)).toLocaleString('es-CO')}</span>
              </div>
              <div className="flex justify-between font-black text-amber-400 text-sm pt-1 border-t border-white/10">
                <span>Total Factura:</span>
                <span>${(orderData?.totalCOP || 0).toLocaleString('es-CO')} COP</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-amber-500/20"
            >
              Generar Factura Electrónica
            </button>
          </form>
        ) : (
          <div className="space-y-4 flex-1 overflow-y-auto pr-1">
            <div className="p-5 rounded-2xl bg-white text-black space-y-4 font-mono text-xs shadow-inner">
              <div className="text-center border-b border-gray-300 pb-3 space-y-1">
                <h3 className="font-black text-base uppercase">KAL DISCOBAR S.A.S.</h3>
                <p className="text-[10px] text-gray-600">NIT: 901.458.789-2 • IVA Régimen Común</p>
                <p className="text-[10px] font-bold text-amber-700">FACTURA ELECTRÓNICA DE VENTA: {generatedInvoice.invoiceNumber}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <p><span className="font-bold">Cliente:</span> {generatedInvoice.clientName}</p>
                  <p><span className="font-bold">{generatedInvoice.docType}:</span> {generatedInvoice.docNumber}</p>
                </div>
                <div className="text-right">
                  <p><span className="font-bold">Fecha:</span> {new Date(generatedInvoice.createdAt).toLocaleDateString()}</p>
                  <p><span className="font-bold">Medio:</span> {generatedInvoice.paymentMethod}</p>
                </div>
              </div>

              <div className="border-t border-b border-gray-300 py-2 space-y-1">
                {(generatedInvoice.items || []).map((it, idx) => (
                  <div key={idx} className="flex justify-between text-[11px]">
                    <span>{it.quantity || 1}x {it.name || it.title}</span>
                    <span>${((it.price || 0) * (it.quantity || 1)).toLocaleString('es-CO')}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-0.5 text-right text-[11px]">
                <p>Subtotal: ${generatedInvoice.subtotal.toLocaleString('es-CO')}</p>
                <p>Impoconsumo (8%): ${generatedInvoice.impoconsumo.toLocaleString('es-CO')}</p>
                <p className="font-black text-sm pt-1">Total: ${generatedInvoice.totalCOP.toLocaleString('es-CO')} COP</p>
              </div>

              <div className="border-t border-gray-300 pt-3 flex items-center justify-between text-[9px] text-gray-600">
                <div className="space-y-1 max-w-xs">
                  <p className="font-bold text-gray-800">CUFE:</p>
                  <p className="break-all">{generatedInvoice.cufe}</p>
                </div>
                <div className="w-14 h-14 bg-gray-200 border border-gray-400 flex items-center justify-center">
                  <QrCode className="w-10 h-10 text-black" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handlePrint}
                className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                Finalizar
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
