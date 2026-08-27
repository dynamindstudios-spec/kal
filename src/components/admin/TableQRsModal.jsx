import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, QrCode, Printer, Copy, Check, Lock, Unlock, ExternalLink, ShieldCheck, RefreshCw, Key, Save } from 'lucide-react';
import { adminStore } from '../../services/adminStore';

export default function TableQRsModal({ isOpen, onClose }) {
  const [copiedTable, setCopiedTable] = useState(null);
  const [tableCodes, setTableCodes] = useState(() => adminStore.getTableCodes());
  const [editingCodeTable, setEditingCodeTable] = useState(null);
  const [tempCodeValue, setTempCodeValue] = useState('');
  const [saveCodeMsg, setSaveCodeMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTableCodes(adminStore.getTableCodes());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentHost = typeof window !== 'undefined' ? window.location.origin : 'https://kaldiscobar.com';

  const tablesData = Array.from({ length: 15 }, (_, i) => i + 1).map((num) => {
    const url = `${currentHost}/?table=${num}`;
    const isLocked = adminStore.isTableLocked(num);
    const pinCode = (tableCodes[num] || `KAL${num}`).toUpperCase();
    const qrImgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}&color=000000&bgcolor=ffffff`;
    return { num, url, isLocked, pinCode, qrImgUrl };
  });

  const handleCopy = (num, url) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopiedTable(num);
      setTimeout(() => setCopiedTable(null), 2500);
    });
  };

  const handleToggleLock = (num) => {
    adminStore.toggleTableLock(num);
    setTableCodes({ ...adminStore.getTableCodes() });
  };

  const handleToggleAll = (lockAll) => {
    adminStore.setAllTablesLocked(lockAll);
    setTableCodes({ ...adminStore.getTableCodes() });
  };

  const handleStartEditCode = (num, currentPin) => {
    setEditingCodeTable(num);
    setTempCodeValue(currentPin);
  };

  const handleSavePinCode = (num) => {
    if (!tempCodeValue.trim()) return;
    const clean = tempCodeValue.trim().toUpperCase();
    adminStore.updateTableSecurityCode(num, clean);
    setTableCodes(adminStore.getTableCodes());
    setEditingCodeTable(null);
    setSaveCodeMsg(`¡PIN de Mesa #${num} actualizado a "${clean}"!`);
    setTimeout(() => setSaveCodeMsg(''), 3000);
  };

  const handlePrintAll = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Permite ventanas emergentes para imprimir los habladores QR.');
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Habladores Permanentes QR - KAL Discobar</title>
        <meta charset="utf-8">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;700;900&display=swap');
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            background: #ffffff;
            color: #000000;
            padding: 20px;
          }
          .grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }
          .card {
            border: 3px solid #000000;
            border-radius: 20px;
            padding: 24px;
            text-align: center;
            page-break-inside: avoid;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            min-height: 480px;
            background: #ffffff;
          }
          .brand {
            font-size: 22px;
            font-weight: 900;
            letter-spacing: 3px;
            text-transform: uppercase;
            color: #000000;
          }
          .subbrand {
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 2px;
            color: #666;
            margin-bottom: 12px;
          }
          .table-title {
            font-size: 32px;
            font-weight: 900;
            margin-bottom: 6px;
            background: #000;
            color: #fff;
            padding: 4px 20px;
            border-radius: 12px;
            display: inline-block;
          }
          .qr-box {
            margin: 14px 0;
            padding: 10px;
            border: 2px dashed #000;
            border-radius: 16px;
            display: inline-block;
          }
          .qr-img {
            width: 200px;
            height: 200px;
            display: block;
          }
          .instructions {
            font-size: 12px;
            font-weight: 700;
            line-height: 1.4;
            max-width: 280px;
            margin-top: 8px;
          }
          .pin-box {
            margin-top: 10px;
            font-size: 12px;
            font-family: monospace;
            font-weight: 900;
            color: #000;
            background: #f0f0f0;
            padding: 6px 16px;
            border-radius: 8px;
            border: 1px solid #ccc;
          }
          @media print {
            body { padding: 0; }
            .grid { gap: 15px; }
            .card { min-height: 440px; border-width: 2px; }
          }
        </style>
      </head>
      <body>
        <div class="grid">
          ${tablesData.map(t => `
            <div class="card">
              <div>
                <div class="brand">KAL DISCOBAR</div>
                <div class="subbrand">VIP NIGHTCLUB & LOUNGE</div>
                <div class="table-title">MESA #${t.num}</div>
              </div>

              <div class="qr-box">
                <img src="${t.qrImgUrl}" class="qr-img" alt="QR Mesa ${t.num}" />
              </div>

              <div>
                <div class="instructions">
                  📱 <strong>Escanea con tu cámara</strong> para abrir la carta digital y ordenar directo a tu mesa.
                </div>
                <div class="pin-box">PIN / CLAVE DE MESA: ${t.pinCode}</div>
              </div>
            </div>
          `).join('')}
        </div>
        <script>
          window.onload = function() {
            setTimeout(function() { window.print(); }, 800);
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const allLocked = tablesData.every(t => t.isLocked);

  return (
    <div className="fixed inset-0 z-[99999] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 15 }}
        className="w-full max-w-4xl max-h-[90vh] bg-[#0d0f18] border border-amber-500/40 rounded-3xl flex flex-col overflow-hidden shadow-2xl"
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-[#141824] to-[#0d0f18] flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <QrCode size={22} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
                <span>Habladores QR & Claves de Mesas (1 al 15)</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                  ✨ Opción 1: Impresión Permanente
                </span>
              </h2>
              <p className="text-xs text-gray-400">
                Imprime una sola vez para acrílicos o madera • Bloquea o cambia contraseñas cuando quieras
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => handleToggleAll(!allLocked)}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                allLocked
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500 hover:text-black'
                  : 'bg-red-500/20 text-red-300 border-red-500/40 hover:bg-red-500 hover:text-white'
              }`}
            >
              {allLocked ? <Unlock size={13} /> : <Lock size={13} />}
              <span>{allLocked ? 'Habilitar Todas' : 'Bloquear Todas'}</span>
            </button>

            <button
              type="button"
              onClick={handlePrintAll}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-black flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
              title="Imprimir todos los habladores permanentes"
            >
              <Printer size={15} />
              <span className="hidden sm:inline">Imprimir Habladores</span>
              <span className="sm:hidden">Imprimir</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white transition-all cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Security Banner & Success Feedback */}
        <div className="px-6 py-2.5 bg-amber-500/10 border-b border-amber-500/20 flex items-center justify-between text-xs text-amber-300 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-amber-400 shrink-0" />
            <span>
              <strong>Control Total en Vivo:</strong> Puedes desactivar mesas con 1 clic para que no hagan pedidos y editar la contraseña/PIN de cada mesa abajo.
            </span>
          </div>
          {saveCodeMsg && (
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-black font-black text-[11px] animate-bounce">
              {saveCodeMsg}
            </span>
          )}
        </div>

        {/* Tables Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tablesData.map((t) => (
            <div
              key={t.num}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                t.isLocked
                  ? 'bg-red-950/20 border-red-500/40 text-gray-400'
                  : 'bg-[#121522] border-white/10 hover:border-amber-500/40 shadow-lg'
              }`}
            >
              {/* Top: Mesa # & Lock Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center ${
                    t.isLocked ? 'bg-red-500/20 text-red-400' : 'bg-amber-500 text-black'
                  }`}>
                    #{t.num}
                  </div>
                  <div>
                    <span className="font-bold text-xs text-white block">Mesa #{t.num}</span>
                    <span className={`text-[10px] font-bold ${t.isLocked ? 'text-red-400' : 'text-emerald-400'}`}>
                      {t.isLocked ? '🔴 Desactivada / Bloqueada' : '🟢 Activa para Pedidos'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleLock(t.num)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                    t.isLocked
                      ? 'bg-red-500 text-white hover:bg-red-400 shadow-md'
                      : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500 hover:text-black border border-emerald-500/40'
                  }`}
                  title={t.isLocked ? 'Habilitar Mesa para Pedidos' : 'Desactivar / Bloquear Mesa'}
                >
                  {t.isLocked ? <Lock size={12} /> : <Unlock size={12} />}
                  <span>{t.isLocked ? 'Bloqueada' : 'Activa'}</span>
                </button>
              </div>

              {/* QR Code Center */}
              <div className="flex items-center justify-center p-2 bg-white rounded-xl shadow-inner">
                <img
                  src={t.qrImgUrl}
                  alt={`QR Mesa ${t.num}`}
                  className="w-32 h-32 object-contain"
                  loading="lazy"
                />
              </div>

              {/* Customizable PIN / Contraseña of this table */}
              <div className="p-2 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-gray-400 flex items-center gap-1">
                    <Key size={11} className="text-amber-400" />
                    <span>PIN / Clave:</span>
                  </span>

                  {editingCodeTable === t.num ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={tempCodeValue}
                        onChange={(e) => setTempCodeValue(e.target.value.toUpperCase())}
                        maxLength={8}
                        className="w-20 px-1.5 py-0.5 bg-[#181a24] border border-amber-400 rounded text-[11px] font-mono font-black text-amber-400 text-center uppercase focus:outline-none"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => handleSavePinCode(t.num)}
                        className="p-1 rounded bg-amber-500 text-black hover:bg-amber-400 cursor-pointer"
                        title="Guardar PIN"
                      >
                        <Save size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingCodeTable(null)}
                        className="p-1 rounded bg-white/10 text-gray-400 hover:text-white cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleStartEditCode(t.num, t.pinCode)}
                      className="text-amber-400 font-mono font-black hover:underline cursor-pointer flex items-center gap-1"
                      title="Haz clic para cambiar la contraseña de esta mesa"
                    >
                      <span>{t.pinCode}</span>
                      <span className="text-[9px] text-gray-500 font-sans font-normal">(Editar)</span>
                    </button>
                  )}
                </div>
              </div>

              {/* URL & Copy Actions */}
              <div className="space-y-1.5 pt-1 border-t border-white/5">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleCopy(t.num, t.url)}
                    className="flex-1 py-1.5 px-2 rounded-xl bg-white/5 hover:bg-amber-500 hover:text-black border border-white/10 text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
                  >
                    {copiedTable === t.num ? (
                      <>
                        <Check size={12} className="text-emerald-400" />
                        <span>¡Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={12} />
                        <span>Copiar Enlace QR</span>
                      </>
                    )}
                  </button>

                  <a
                    href={t.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-gray-300 transition-all"
                    title="Probar enlace"
                  >
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 flex items-center justify-between bg-[#0a0c14] text-xs text-gray-400">
          <span>💡 Habladores permanentes: imprímelos una vez y adminístralos desde este panel.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </motion.div>
    </div>
  );
}
