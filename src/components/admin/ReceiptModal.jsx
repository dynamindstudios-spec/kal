import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Printer, CheckCircle2 } from 'lucide-react';
import { RESTAURANT_DATA } from '../../data/menuData';

export default function ReceiptModal({
  isOpen,
  onClose,
  billData
}) {
  if (!isOpen || !billData) return null;

  const items = billData.items || [];
  const subtotal = items.reduce((sum, it) => sum + (it.priceCOP || 0) * (it.quantity || 1), 0);
  const total = billData.totalCOP || subtotal;
  const tip10 = Math.round(total * 0.1);
  const dateFormatted = new Date(billData.date || Date.now()).toLocaleString('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.92 }}
          className="w-full max-w-sm bg-white text-black rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
        >
          {/* Header Action Controls (Not printed) */}
          <div className="flex items-center justify-between border-b pb-2 print:hidden">
            <span className="text-xs font-black uppercase text-gray-500 tracking-wider">
              Recibo / Comanda Oficial POS
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-black cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Printable Thermal Receipt Container */}
          <div id="pos-thermal-receipt" className="font-mono text-xs space-y-3 p-2 bg-white text-black">
            
            {/* Business Header */}
            <div className="text-center space-y-0.5 border-b pb-2 border-dashed border-gray-300">
              <h2 className="text-base font-black tracking-wider uppercase">{RESTAURANT_DATA.name}</h2>
              <p className="text-[10px] text-gray-600">NIT: 901.482.719-3 • Régimen Simplificado</p>
              <p className="text-[10px] text-gray-600">Zona Rosa • Armenia, Quindío</p>
              <p className="text-[10px] text-gray-600">Tel / WhatsApp: 313 524 8660</p>
            </div>

            {/* Ticket Info */}
            <div className="text-[11px] space-y-0.5 border-b pb-2 border-dashed border-gray-300">
              <div className="flex justify-between">
                <span>Factura / Ticket:</span>
                <span className="font-black">{billData.orderNum || 'FAC-' + Math.floor(1000 + Math.random() * 9000)}</span>
              </div>
              <div className="flex justify-between">
                <span>Fecha y Hora:</span>
                <span>{dateFormatted}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Ubicación:</span>
                <span>{billData.table === 'barra' ? '🍸 Barra Mostrador' : `🛎️ Mesa #${billData.table}`}</span>
              </div>
              {billData.customerName && (
                <div className="flex justify-between">
                  <span>Cliente:</span>
                  <span className="truncate max-w-[150px]">{billData.customerName}</span>
                </div>
              )}
            </div>

            {/* Itemized Table */}
            <div className="space-y-1 border-b pb-2 border-dashed border-gray-300 text-[11px]">
              <div className="grid grid-cols-12 font-bold text-[10px] uppercase text-gray-500 border-b pb-1">
                <span className="col-span-2">Cant</span>
                <span className="col-span-6">Descripción</span>
                <span className="col-span-4 text-right">Subtotal</span>
              </div>

              {items.map((item, idx) => {
                const itemTotal = (item.priceCOP || 0) * (item.quantity || 1);
                return (
                  <div key={idx} className="grid grid-cols-12 py-0.5">
                    <span className="col-span-2 font-bold">{item.quantity}x</span>
                    <span className="col-span-6 truncate font-medium">{item.name}</span>
                    <span className="col-span-4 text-right font-black">
                      ${Number(itemTotal).toLocaleString('es-CO')}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Totals & Payment Method */}
            <div className="space-y-1 text-xs border-b pb-2 border-dashed border-gray-300">
              <div className="flex justify-between">
                <span>Subtotal Comanda:</span>
                <span>${Number(subtotal).toLocaleString('es-CO')}</span>
              </div>
              <div className="flex justify-between text-gray-500 text-[10px]">
                <span>Propina Sugerida (10%):</span>
                <span>${Number(tip10).toLocaleString('es-CO')}</span>
              </div>
              <div className="flex justify-between font-black text-sm pt-1 border-t border-gray-200">
                <span>TOTAL FACTURADO:</span>
                <span>${Number(total).toLocaleString('es-CO')} COP</span>
              </div>
              <div className="flex justify-between pt-1 text-[11px] font-bold text-emerald-700">
                <span>Medio de Pago:</span>
                <span className="uppercase">{billData.paymentMethod || 'Efectivo'}</span>
              </div>
            </div>

            {/* Footer Notice */}
            <div className="text-center text-[10px] text-gray-500 pt-1 space-y-0.5">
              <p className="font-bold">¡Gracias por celebrar tu noche en KAL DISCOBAR!</p>
              <p>Experiencia VIP • Música & Licores Exclusivos</p>
            </div>

          </div>

          {/* Action Buttons (Not printed) */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t print:hidden">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold text-xs hover:bg-gray-100 transition-all cursor-pointer"
            >
              Cerrar
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="py-2.5 rounded-xl bg-black text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-lg hover:bg-gray-800 transition-all cursor-pointer"
            >
              <Printer size={15} />
              <span>Imprimir Ticket</span>
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
