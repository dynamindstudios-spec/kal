import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Smartphone, Building2, CheckCircle2, ShieldCheck, Lock, Loader2, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function WompiCheckoutModal({
  isOpen,
  onClose,
  totalCOP,
  orderData,
  onSuccess
}) {
  const [method, setMethod] = useState('card'); // 'card' | 'nequi' | 'pse'
  const [cardNumber, setCardNumber] = useState('4000 1234 5678 9010');
  const [cardHolder, setCardHolder] = useState('CLIENTE KAL VIP');
  const [cardExp, setCardExp] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('789');
  const [nequiPhone, setNequiPhone] = useState(orderData?.phone || '313 524 8660');
  const [pseBank, setPseBank] = useState('Bancolombia');

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  if (!isOpen) return null;

  const formattedTotal = Number(totalCOP).toLocaleString('es-CO');

  const handlePay = () => {
    setIsProcessing(true);

    const generatedTx = 'WOMPI-DEMO-' + Math.floor(100000 + Math.random() * 900000);
    setTransactionId(generatedTx);

    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);

      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 }
      });

      setTimeout(() => {
        onSuccess({
          transactionId: generatedTx,
          paymentMethod: `Wompi Demo (${method.toUpperCase()})`,
          amount: totalCOP,
          date: new Date().toISOString()
        });
      }, 1500);
    }, 2200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          className="w-full max-w-md bg-[#0f1117] border border-[#2a2e3d] rounded-3xl p-6 text-white shadow-2xl space-y-5"
        >
          {/* Header Wompi */}
          <div className="flex items-center justify-between border-b border-[#232736] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-black text-sm">
                W
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm tracking-tight text-white">Wompi Pasarela</span>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded border border-amber-500/30">
                    Modo Demo
                  </span>
                </div>
                <span className="text-[10px] text-gray-400 block">
                  Verificación de Pedido para Barra • KAL DISCOBAR
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              disabled={isProcessing}
              className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-all cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Success Screen */}
          {paymentSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-8 text-center space-y-3"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500 text-white mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <CheckCircle2 size={36} strokeWidth={2.5} />
              </div>
              <h4 className="text-lg font-black text-white">¡Pago Aprobado con Wompi!</h4>
              <p className="text-xs text-gray-300">
                Transacción: <strong className="font-mono text-emerald-400">{transactionId}</strong>
              </p>
              <p className="text-xs text-emerald-400 font-semibold">
                Pedido agendado y verificado para entrega en la barra.
              </p>
            </motion.div>
          ) : (
            <>
              {/* Total to pay banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#171b26] to-[#1e2333] border border-[#2c3247] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">
                    Total a pagar en línea
                  </span>
                  <span className="text-2xl font-black text-amber-400">
                    ${formattedTotal} COP
                  </span>
                </div>
                <div className="text-right text-[11px] text-gray-400">
                  <span>Retiro en Barra</span>
                  <span className="block text-white font-bold">{orderData?.customerName || 'Cliente VIP'}</span>
                </div>
              </div>

              {/* Payment Methods Tabs */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'card', label: 'Tarjeta', icon: <CreditCard size={15} /> },
                  { id: 'nequi', label: 'Nequi', icon: <Smartphone size={15} /> },
                  { id: 'pse', label: 'PSE / Banco', icon: <Building2 size={15} /> }
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMethod(m.id)}
                    className={`py-2 px-1 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all border cursor-pointer ${
                      method === m.id
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-transparent shadow'
                        : 'bg-[#141722] text-gray-400 border-[#232736] hover:border-gray-500'
                    }`}
                  >
                    {m.icon}
                    <span>{m.label}</span>
                  </button>
                ))}
              </div>

              {/* Method Dynamic Fields */}
              <div className="space-y-3 p-3.5 rounded-2xl bg-[#141722] border border-[#232736]">
                {method === 'card' && (
                  <div className="space-y-2 text-xs">
                    <div>
                      <label className="text-[10px] text-gray-400 block mb-0.5">Número de Tarjeta (Demo)</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#0b0d13] border border-[#2c3247] text-white font-mono text-xs focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-gray-400 block mb-0.5">Vencimiento</label>
                        <input
                          type="text"
                          value={cardExp}
                          onChange={(e) => setCardExp(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-[#0b0d13] border border-[#2c3247] text-white font-mono text-xs focus:outline-none focus:border-purple-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-400 block mb-0.5">CVV</label>
                        <input
                          type="password"
                          maxLength={4}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-[#0b0d13] border border-[#2c3247] text-white font-mono text-xs focus:outline-none focus:border-purple-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {method === 'nequi' && (
                  <div className="space-y-2 text-xs">
                    <label className="text-[10px] text-gray-400 block mb-0.5">Celular de Cuenta Nequi</label>
                    <input
                      type="tel"
                      value={nequiPhone}
                      onChange={(e) => setNequiPhone(e.target.value)}
                      placeholder="313 524 8660"
                      className="w-full px-3 py-2 rounded-xl bg-[#0b0d13] border border-[#2c3247] text-white font-mono text-xs focus:outline-none focus:border-purple-500"
                    />
                    <span className="text-[10px] text-purple-300 block">
                      💡 En modo demo la aprobación se genera automáticamente al presionar pagar.
                    </span>
                  </div>
                )}

                {method === 'pse' && (
                  <div className="space-y-2 text-xs">
                    <label className="text-[10px] text-gray-400 block mb-0.5">Seleccionar Banco</label>
                    <select
                      value={pseBank}
                      onChange={(e) => setPseBank(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#0b0d13] border border-[#2c3247] text-white text-xs focus:outline-none focus:border-purple-500"
                    >
                      <option value="Bancolombia">Bancolombia</option>
                      <option value="Davivienda">Davivienda</option>
                      <option value="Banco de Bogotá">Banco de Bogotá</option>
                      <option value="BBVA Colombia">BBVA Colombia</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Pay Button */}
              <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={handlePay}
                disabled={isProcessing}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 hover:brightness-110 transition-all cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Procesando pago seguro...</span>
                  </>
                ) : (
                  <>
                    <Lock size={16} />
                    <span>Pagar ${formattedTotal} con Wompi</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </motion.button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-500">
                <ShieldCheck size={13} className="text-emerald-400" />
                <span>Pasarela de pagos encriptada TLS 256-bit • Wompi Sandbox</span>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
