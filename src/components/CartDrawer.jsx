import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Plus, Minus, ShoppingBag, Sparkles, UtensilsCrossed, Store, Check, 
  Utensils, Coffee, Cake, ChefHat, User, Phone, FileText, Lock, CheckCircle2, 
  XCircle, Key, Info, HelpCircle, ShieldCheck, Clock, Wine
} from 'lucide-react';
import confetti from 'canvas-confetti';
import AnimatedPriceCounter from './AnimatedPriceCounter';
import { CURRENCIES, UI_TEXT, TABLE_SECURITY_CODES } from '../data/menuData';
import { adminStore } from '../services/adminStore';
import WompiCheckoutModal from './admin/WompiCheckoutModal';
import InteractiveTableMap from './common/InteractiveTableMap';

// SVG Icon of a Table with Tablecloth
function TableclothIcon({ size = 48, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="8" y="24" width="48" height="6" rx="2" fill="#c5a059" />
      <path d="M6 26C6 24.8954 6.89543 24 8 24H56C57.1046 24 58 24.8954 58 26V34C58 35.1046 57.1046 36 56 36H50L46 42L42 36H22L18 42L14 36H8C6.89543 36 6 35.1046 6 34V26Z" fill="#f8f6f0" stroke="#8c3a2b" strokeWidth="2" />
      <path d="M12 36L14 40L16 36M26 36L28 40L30 36M40 36L42 40L44 36" stroke="#8c3a2b" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="14" y="36" width="5" height="22" rx="1.5" fill="#574c45" />
      <rect x="45" y="36" width="5" height="22" rx="1.5" fill="#574c45" />
      <path d="M30 18H34V24H30V18Z" fill="#c5a059" />
      <circle cx="32" cy="14" r="3" fill="#e8927c" />
    </svg>
  );
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  currentCurrency,
  currentLang
}) {
  // Order Fulfillment Type: 'table' (A la Mesa) | 'pickup' (En la Barra)
  const [orderType, setOrderType] = useState('table');
  
  // Table Order State
  const [selectedTable, setSelectedTable] = useState(1);
  const [tableCodeInput, setTableCodeInput] = useState('');
  const [tableCodeError, setTableCodeError] = useState(false);
  const [showTableModal, setShowTableModal] = useState(false);
  const [showTableCodesInModal, setShowTableCodesInModal] = useState(false);
  const [tableValidatedSuccess, setTableValidatedSuccess] = useState(false);

  // Common Form Fields State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedPickupInterval, setSelectedPickupInterval] = useState('15-20');
  const [formValidationError, setFormValidationError] = useState('');
  const [showWompiModal, setShowWompiModal] = useState(false);

  // Checkout & Animated Progress State
  const [isProcessing, setIsProcessing] = useState(false);
  const [cookingProgress, setCookingProgress] = useState(0);
  const [checkedOut, setCheckedOut] = useState(false);
  const [generatedOrderNum, setGeneratedOrderNum] = useState('');

  const t = UI_TEXT[currentLang] || UI_TEXT.es;
  const currencyObj = CURRENCIES[currentCurrency] || CURRENCIES.COP;

  const totalCOP = cartItems.reduce((sum, item) => sum + item.dish.priceCOP * item.quantity, 0);
  const convertedTotal = Number(totalCOP * currencyObj.rate).toLocaleString(
    currentCurrency === 'COP' || currentCurrency === 'CLP' || currentCurrency === 'ARS' ? 'es-CO' : 'en-US',
    { maximumFractionDigits: currentCurrency === 'COP' || currentCurrency === 'CLP' || currentCurrency === 'ARS' ? 0 : 2 }
  );

  // Leer parámetros de URL si el cliente escaneó el QR físico
  React.useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlTable = params.get('table') || params.get('t') || params.get('mesa');
      const urlToken = params.get('token') || params.get('k') || params.get('pin');
      if (urlTable) {
        const tNum = parseInt(urlTable, 10);
        if (tNum >= 1 && tNum <= 15) {
          setSelectedTable(tNum);
          if (urlToken) {
            setTableCodeInput(urlToken);
            const val = adminStore.validateTableAccess(tNum, urlToken);
            if (val && val.valid) {
              setTableValidatedSuccess(true);
            }
          }
        }
      }
    } catch {}
  }, []);

  // Verificar si la mesa seleccionada está bloqueada en el bar
  const isSelectedTableLocked = adminStore.isTableLocked(selectedTable);
  const tableAccessResult = adminStore.validateTableAccess(selectedTable, tableCodeInput);
  const isTableCodeValid = Boolean(tableAccessResult && tableAccessResult.valid && !isSelectedTableLocked);
  const tableCodes = adminStore.getTableCodes();
  const expectedCode = tableCodes[selectedTable] || TABLE_SECURITY_CODES[selectedTable] || '';

  // Reset errors when changing table or code
  const handleTableSelect = (num) => {
    setSelectedTable(num);
    setTableCodeError(false);
    setFormValidationError('');
    setTableValidatedSuccess(false);
    setTableCodeInput('');
  };

  const selectedTableOccupInfo = adminStore.getTableOccupationInfo(selectedTable);
  const isSelectedTableOccupiedByWaiter = Boolean(selectedTableOccupInfo && selectedTableOccupInfo.isOccupied && selectedTableOccupInfo.source === 'waiter');

  const handleConfirmTableModal = () => {
    if (isSelectedTableLocked) {
      setTableCodeError(true);
      setFormValidationError(`🚫 La Mesa #${selectedTable} está bloqueada para pedidos digitales.`);
      return;
    }

    if (selectedTableOccupInfo.isOccupied) {
      if (selectedTableOccupInfo.source === 'waiter') {
        setTableCodeError(true);
        setFormValidationError(
          `🚫 La Mesa #${selectedTable} está siendo atendida presencialmente por el mesero (${selectedTableOccupInfo.waiterName || 'Staff'}). Para pedir más productos o bebidas, solicítalo directamente a tu mesero.`
        );
        return;
      } else if (selectedTableOccupInfo.source === 'reservation') {
        setTableCodeError(true);
        setFormValidationError(
          `🚫 La Mesa #${selectedTable} tiene una reserva VIP asignada (${selectedTableOccupInfo.customerName}).`
        );
        return;
      }
    }

    if (isTableCodeValid) {
      setTableCodeError(false);
      setFormValidationError('');
      setTableValidatedSuccess(true);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.5 }
      });
      setTimeout(() => {
        setTableValidatedSuccess(false);
        setShowTableModal(false);
      }, 500);
    } else {
      setTableCodeError(true);
      setTableValidatedSuccess(false);
    }
  };

  const executeOrderDispatch = (wompiDetails = null) => {
    setIsProcessing(true);
    setCookingProgress(0);

    let orderNum = '';
    if (orderType === 'pickup') {
      orderNum = `BAR-${Math.floor(1000 + Math.random() * 9000)}`;
    } else {
      orderNum = `MESA-${selectedTable}-${Math.floor(100 + Math.random() * 900)}`;
    }
    setGeneratedOrderNum(orderNum);

    // Register order in backend store
    adminStore.addOrder({
      orderNum,
      table: orderType === 'pickup' ? 'barra' : selectedTable,
      type: orderType,
      customerName: fullName.trim() || (orderType === 'pickup' ? 'Cliente en Barra' : `Cliente Mesa #${selectedTable}`),
      phone: phone.trim(),
      notes: notes.trim(),
      pickupInterval: selectedPickupInterval,
      items: cartItems.map((item) => ({
        id: item.dish.id,
        name: item.dish.name[currentLang] || item.dish.name.es,
        priceCOP: item.dish.priceCOP,
        quantity: item.quantity
      })),
      totalCOP,
      status: orderType === 'pickup' ? 'served' : 'pending',
      paymentMethod: wompiDetails ? wompiDetails.paymentMethod : null,
      wompiTransactionId: wompiDetails ? wompiDetails.transactionId : null,
      isPaid: Boolean(wompiDetails)
    });

    const interval = setInterval(() => {
      setCookingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 4;
      });
    }, 85);

    setTimeout(() => {
      setIsProcessing(false);
      setCheckedOut(true);

      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.5 }
      });

      // Format WhatsApp Order Message for KAL DISCOBAR (3135248660)
      const itemsList = cartItems
        .map(item => `• ${item.quantity}x ${item.dish.name[currentLang] || item.dish.name.es} ($${Number(item.dish.priceCOP * item.quantity).toLocaleString('es-CO')})`)
        .join('%0A');
      
      let fulfillmentDetail = '';
      if (orderType === 'table') {
        fulfillmentDetail = `📍 Servicio a la Mesa #${selectedTable}%0A🔑 *Clave Validada:* ${expectedCode}%0A👤 *Titular:* ${fullName.trim() || 'Cliente en Mesa'}%0A📝 *Notas:* ${notes.trim() || 'Ninguna'}`;
      } else {
        const timeMap = {
          '5-10': 'Inmediato (5-10 min)',
          '15-20': 'En 15-20 min',
          '30': 'En 30 min',
          '45': 'En 45+ min'
        };
        const timeLabel = timeMap[selectedPickupInterval] || 'En 15-20 min';
        const wompiCodeStr = wompiDetails ? `%0A💳 *Pago Wompi Demo:* ${wompiDetails.transactionId} (APROBADO)` : '';
        fulfillmentDetail = `🍸 Retirar en la Barra%0A👤 *Cliente:* ${fullName.trim() || 'Cliente en Barra'}%0A📱 *WhatsApp:* ${phone.trim() || 'No especificado'}%0A⏱️ *Tiempo:* ${timeLabel}${wompiCodeStr}%0A📝 *Notas:* ${notes.trim() || 'Ninguna'}`;
      }

      const waText = `🍾 *NUEVO PEDIDO DIGITAL - KAL DISCOBAR*%0A%0A*Orden #:* ${orderNum}%0A*Modalidad:* ${fulfillmentDetail}%0A%0A*Detalle del Pedido:*%0A${itemsList}%0A%0A*Total:* $${Number(totalCOP).toLocaleString('es-CO')} COP`;
      
      setTimeout(() => {
        window.open(`https://wa.me/573135248660?text=${waText}`, '_blank');
        onClearCart();
        setCheckedOut(false);
        onClose();
      }, 3500);
    }, 2500);
  };

  const handleCheckout = () => {
    setFormValidationError('');

    // If order type is Table, require the security code to be valid
    if (orderType === 'table') {
      const occupInfo = adminStore.getTableOccupationInfo(selectedTable);
      if (occupInfo.isOccupied) {
        if (occupInfo.source === 'waiter') {
          setFormValidationError(
            `🚫 La Mesa #${selectedTable} está siendo atendida presencialmente por el mesero (${occupInfo.waiterName || 'Staff'}). Para pedir más productos o bebidas, solicítalo directamente a tu mesero.`
          );
          return;
        } else if (occupInfo.source === 'reservation') {
          setFormValidationError(
            `🚫 La Mesa #${selectedTable} tiene una reserva VIP asignada (${occupInfo.customerName}).`
          );
          return;
        }
      }

      if (!isTableCodeValid) {
        setTableCodeError(true);
        setShowTableModal(true);
        setFormValidationError(
          currentLang === 'en'
            ? `⚠️ Please select your table and enter the security code.`
            : `⚠️ Por favor selecciona tu mesa e ingresa el código de seguridad.`
        );
        return;
      }
      executeOrderDispatch();
    } else {
      // If order type is Bar (pickup), user required online payment verification via Wompi Demo
      if (!fullName.trim()) {
        setFormValidationError(
          currentLang === 'en'
            ? '⚠️ Please enter your name for pickup at the bar.'
            : '⚠️ Por favor ingresa el nombre de quien reclama en la barra.'
        );
        return;
      }
      setShowWompiModal(true);
    }
  };

  const handleWompiSuccess = (wompiDetails) => {
    setShowWompiModal(false);
    executeOrderDispatch(wompiDetails);
  };

  const categorizedItems = {
    mains: cartItems.filter((i) => i.dish.category === 'licores' || i.dish.category === 'cervezas'),
    drinks: cartItems.filter((i) => i.dish.category === 'cocteles' || i.dish.category === 'mezcladores'),
    desserts: cartItems.filter((i) => i.dish.category === 'snacks'),
    custom: cartItems.filter((i) => i.dish.id.startsWith('custom-'))
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm flex justify-end">
        
        {/* Backdrop click to close */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0"
        />

        {/* Drawer Window */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
          className="relative z-10 w-full max-w-lg h-full bg-[var(--bg-color)] border-l border-[var(--surface-border)] shadow-2xl flex flex-col justify-between"
        >
          {/* Header ("Tu Canasta de Rumba") */}
          <div className="p-4 sm:p-6 border-b border-[var(--surface-border)] flex items-center justify-between bg-[var(--surface-bg)]">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-[var(--accent-color)]/15 border border-[var(--accent-color)]/30 flex items-center justify-center text-[var(--accent-color)] shadow">
                <ShoppingBag size={20} />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-[var(--text-primary)] serif-title leading-tight">
                  {t.yourOrder}
                </h3>
                <span className="text-[11px] font-semibold text-[var(--accent-color)]">
                  KAL DISCOBAR • Menú Digital VIP
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[var(--pill-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all cursor-pointer"
              title="Cerrar Canasta"
            >
              <X size={20} />
            </button>
          </div>

          {/* Cart Content: Scrollable Items & Fulfillment Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            
            {/* Animated Progress Scene when Order is Processing */}
            {isProcessing ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="py-12 space-y-6 text-center flex flex-col items-center justify-center"
              >
                {/* Sizzling / Shaking Cocktail & Party Animation */}
                <div className="relative w-28 h-28 flex items-center justify-center">
                  
                  {/* Floating Steam / Sparkles Particles */}
                  <motion.div
                    animate={{ y: [-5, -25], opacity: [0.9, 0], scale: [0.8, 1.3] }}
                    transition={{ repeat: Infinity, duration: 1.3, ease: "easeOut" }}
                    className="absolute -top-4 text-2xl flex gap-2 pointer-events-none"
                  >
                    <span>✨</span>
                    <span>🍾</span>
                  </motion.div>

                  {/* Shaker / Cocktail Bounce */}
                  <motion.div
                    animate={{ rotate: [0, -15, 15, -15, 0], y: [0, -8, 0] }}
                    transition={{ repeat: Infinity, duration: 1.0, ease: "easeInOut" }}
                    className="text-6xl select-none filter drop-shadow-xl"
                  >
                    🍸
                  </motion.div>

                  {/* Sizzling Glow Accent */}
                  <motion.div
                    animate={{ scale: [1, 1.25, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="absolute -bottom-1 text-2xl"
                  >
                    🔥
                  </motion.div>
                </div>

                <div className="space-y-1.5 max-w-xs">
                  <h4 className="text-xl font-black text-[var(--text-primary)] serif-title">
                    ¡Alistando tu Pedido! 🍸🍾
                  </h4>
                  <p className="text-xs text-[var(--text-secondary)] font-medium leading-relaxed">
                    {orderType === 'table'
                      ? `Enviando la orden a la Mesa #${selectedTable} y notificando al personal de servicio...`
                      : `Alistando la orden para ${fullName.trim() || 'el cliente'} en la barra...`}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="w-full max-w-xs space-y-2">
                  <div className="w-full h-3.5 rounded-full bg-[var(--pill-bg)] border border-[var(--surface-border)] overflow-hidden p-0.5 shadow-inner">
                    <motion.div
                      className="h-full bg-gradient-to-r from-amber-500 via-pink-500 to-emerald-500 rounded-full"
                      style={{ width: `${cookingProgress}%` }}
                    />
                  </div>
                  <p className="text-[11px] font-black uppercase tracking-widest text-[var(--accent-color)]">
                    Procesando comanda... {cookingProgress}%
                  </p>
                </div>

              </motion.div>
            ) : checkedOut ? (
              
              /* Order Completed Success Screen */
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10 flex flex-col items-center justify-center p-6 rounded-3xl glass-panel border border-emerald-500/30 bg-emerald-500/10 shadow-2xl space-y-4"
              >
                <div className="w-20 h-20 rounded-full bg-emerald-500 text-white flex items-center justify-center text-3xl shadow-xl animate-bounce">
                  ✨
                </div>

                {generatedOrderNum && (
                  <div className="px-5 py-2.5 rounded-2xl bg-[var(--pill-bg)] border border-[var(--accent-color)] inline-block shadow">
                    <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest block">{t.orderNum}</span>
                    <span className="text-2xl font-black text-[var(--accent-color)]">{generatedOrderNum}</span>
                  </div>
                )}

                <h4 className="text-xl font-black text-[var(--text-primary)] serif-title">
                  {orderType === 'table' ? t.orderTaken : t.orderRegistered}
                </h4>

                <p className="text-sm font-bold text-emerald-500 leading-relaxed max-w-xs">
                  {orderType === 'table' 
                    ? `${t.successTableMsg} #${selectedTable}. 🍾🥂`
                    : `${t.successPickupMsg.replace('{min}', selectedPickupInterval === '5-10' ? '5-10' : selectedPickupInterval === '15-20' ? '15-20' : selectedPickupInterval)} 🍸`}
                </p>

                <p className="text-xs text-[var(--text-secondary)] italic pt-2">
                  {t.thankYou}
                </p>

                <div className="p-3 rounded-2xl bg-black/40 border border-white/10 text-[11px] text-gray-300 w-full max-w-xs text-center space-y-1">
                  <span className="font-bold text-emerald-400 block">📲 Abriendo WhatsApp...</span>
                  <span>Te redirigiremos automáticamente para enviar los detalles al WhatsApp de KAL DISCOBAR.</span>
                </div>
              </motion.div>

            ) : cartItems.length === 0 ? (
              
              /* Empty Cart State */
              <div className="text-center py-20 text-[var(--text-muted)] space-y-3">
                <div className="w-20 h-20 mx-auto rounded-full bg-[var(--pill-bg)] border border-[var(--surface-border)] flex items-center justify-center opacity-70">
                  <ShoppingBag size={40} className="text-[var(--accent-color)]" />
                </div>
                <h4 className="text-base font-bold text-[var(--text-primary)]">{t.emptyCart}</h4>
                <p className="text-xs text-[var(--text-secondary)] max-w-xs mx-auto">
                  Explora la carta de licores, cócteles y snacks para armar tu pedido VIP.
                </p>
              </div>

            ) : (
              
              /* Cart Items List Render */
              <div className="space-y-6">
                
                {/* 🍾 LICORES & CERVEZAS */}
                {categorizedItems.mains.length > 0 && (
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-xs font-black text-[var(--accent-color)] uppercase tracking-wider border-b border-[var(--surface-border)] pb-1.5">
                      <Wine size={16} />
                      <span>{t.mainsDrinks} ({categorizedItems.mains.length})</span>
                    </div>
                    {categorizedItems.mains.map(({ dish, quantity }) => renderCartRow(dish, quantity))}
                  </div>
                )}

                {/* 🍸 CÓCTELES & MEZCLADORES */}
                {categorizedItems.drinks.length > 0 && (
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-xs font-black text-[var(--accent-color)] uppercase tracking-wider border-b border-[var(--surface-border)] pb-1.5">
                      <Coffee size={16} />
                      <span>{t.beverages} ({categorizedItems.drinks.length})</span>
                    </div>
                    {categorizedItems.drinks.map(({ dish, quantity }) => renderCartRow(dish, quantity))}
                  </div>
                )}

                {/* 🍫 CONFITERÍA & SNACKS */}
                {categorizedItems.desserts.length > 0 && (
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-xs font-black text-[var(--accent-color)] uppercase tracking-wider border-b border-[var(--surface-border)] pb-1.5">
                      <Cake size={16} />
                      <span>{t.desserts} ({categorizedItems.desserts.length})</span>
                    </div>
                    {categorizedItems.desserts.map(({ dish, quantity }) => renderCartRow(dish, quantity))}
                  </div>
                )}

                {/* 🎨 KITS VIP PERSONALIZADOS */}
                {categorizedItems.custom.length > 0 && (
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-xs font-black text-[var(--accent-color)] uppercase tracking-wider border-b border-[var(--surface-border)] pb-1.5">
                      <ChefHat size={16} />
                      <span>{t.customCreations} ({categorizedItems.custom.length})</span>
                    </div>
                    {categorizedItems.custom.map(({ dish, quantity }) => renderCartRow(dish, quantity))}
                  </div>
                )}

                {/* ORDER FULFILLMENT CONFIGURATION AREA */}
                <div className="pt-4 border-t-2 border-[var(--surface-border)] space-y-4">
                  
                  {/* Title & Mode Selector (A la Mesa vs En la Barra) */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-black text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles size={14} className="text-[var(--accent-color)]" />
                        <span>1. ¿Cómo deseas recibir tu pedido?</span>
                      </label>
                      <span className="text-[10px] font-bold text-[var(--accent-color)] bg-[var(--pill-bg)] px-2 py-0.5 rounded-full border border-[var(--surface-border)]">
                        2 Opciones Disponibles
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      
                      {/* Opción 1: A la Mesa */}
                      <button
                        type="button"
                        onClick={() => {
                          setOrderType('table');
                          setFormValidationError('');
                        }}
                        className={`p-3.5 rounded-2xl border text-left flex flex-col gap-1 transition-all cursor-pointer relative overflow-hidden ${
                          orderType === 'table'
                            ? 'bg-[var(--accent-color)] text-[var(--accent-on)] border-transparent shadow-lg scale-[1.02]'
                            : 'bg-[var(--pill-bg)] text-[var(--text-primary)] border-[var(--surface-border)] hover:border-[var(--accent-color)]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <UtensilsCrossed size={18} />
                            <span className="text-xs font-black uppercase tracking-wide">A la Mesa</span>
                          </div>
                          {orderType === 'table' && (
                            <div className="w-5 h-5 rounded-full bg-black/20 flex items-center justify-center text-xs">
                              <Check size={13} strokeWidth={3} />
                            </div>
                          )}
                        </div>
                        <span className="text-[10px] opacity-85 leading-tight">
                          Servicio directo a tu Mesa #{selectedTable}
                        </span>
                      </button>

                      {/* Opción 2: En la Barra */}
                      <button
                        type="button"
                        onClick={() => {
                          setOrderType('pickup');
                          setFormValidationError('');
                        }}
                        className={`p-3.5 rounded-2xl border text-left flex flex-col gap-1 transition-all cursor-pointer relative overflow-hidden ${
                          orderType === 'pickup'
                            ? 'bg-[var(--accent-color)] text-[var(--accent-on)] border-transparent shadow-lg scale-[1.02]'
                            : 'bg-[var(--pill-bg)] text-[var(--text-primary)] border-[var(--surface-border)] hover:border-[var(--accent-color)]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <Store size={18} />
                            <span className="text-xs font-black uppercase tracking-wide">En la Barra</span>
                          </div>
                          {orderType === 'pickup' && (
                            <div className="w-5 h-5 rounded-full bg-black/20 flex items-center justify-center text-xs">
                              <Check size={13} strokeWidth={3} />
                            </div>
                          )}
                        </div>
                        <span className="text-[10px] opacity-85 leading-tight">
                          Reclamar y retirar en el mostrador
                        </span>
                      </button>

                    </div>
                  </div>

                  {/* FORM FIELDS FOR 'A LA MESA' */}
                  <AnimatePresence mode="wait">
                    {orderType === 'table' && (
                      <motion.div
                        key="table-form-fields"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="space-y-4 p-4 rounded-3xl glass-panel border border-[var(--surface-border)] bg-[var(--surface-bg)]/80"
                      >
                        
                        {/* 2.1 Botón / Tarjeta: Elegir Mesa */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                              <span>📍</span>
                              <span>Mesa y Clave de Seguridad *</span>
                            </label>
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg border ${
                              isSelectedTableOccupiedByWaiter
                                ? 'text-orange-400 bg-orange-500/15 border-orange-500/30'
                                : isTableCodeValid
                                ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                                : 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                            }`}>
                              {isSelectedTableOccupiedByWaiter
                                ? 'Mesa en Atención por Mesero 🤵'
                                : isTableCodeValid
                                ? 'Mesa Validada ✅'
                                : 'Mesa Sin Validar ⚠️'}
                            </span>
                          </div>

                          {isSelectedTableOccupiedByWaiter ? (
                            <div className="p-3 rounded-2xl bg-orange-500/15 border border-orange-500/30 text-orange-300 text-xs font-bold flex items-center gap-2">
                              <AlertTriangle size={16} className="text-orange-400 shrink-0" />
                              <span>
                                Esta mesa está siendo atendida presencialmente por el mesero ({selectedTableOccupInfo.waiterName || 'Staff'}). Para agregar productos, solicítalo directamente a tu mesero.
                              </span>
                            </div>
                          ) : (
                            <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                              {isTableCodeValid
                                ? `Ubicación lista: tu orden será entregada en la Mesa #${selectedTable}.`
                                : 'Presiona "Elegir Mesa" para seleccionar tu mesa e ingresar la clave de seguridad:'}
                            </p>
                          )}

                          {/* Interactive Card with "Elegir Mesa" button */}
                          <div className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 shadow-sm ${
                            isSelectedTableOccupiedByWaiter
                              ? 'bg-orange-950/20 border-orange-500/40'
                              : isTableCodeValid
                              ? 'bg-emerald-500/10 border-emerald-500/30'
                              : 'bg-[var(--pill-bg)] border-[var(--surface-border)] hover:border-[var(--accent-color)]'
                          }`}>
                            <div className="flex items-center gap-3 min-w-0">
                              <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 shadow-sm ${
                                isSelectedTableOccupiedByWaiter
                                  ? 'bg-orange-500 text-white font-black'
                                  : isTableCodeValid
                                  ? 'bg-emerald-500 text-white font-black'
                                  : 'bg-[var(--accent-color)]/20 text-[var(--accent-color)]'
                              }`}>
                                {isSelectedTableOccupiedByWaiter ? '🤵' : isTableCodeValid ? <Check size={22} strokeWidth={3} /> : '🪑'}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs sm:text-sm font-black text-[var(--text-primary)] truncate">
                                    Mesa #{selectedTable}
                                  </span>
                                  {isSelectedTableOccupiedByWaiter ? (
                                    <span className="text-[10px] font-bold text-orange-400 bg-orange-500/20 px-1.5 py-0.5 rounded">
                                      Atendida por Mesero
                                    </span>
                                  ) : isTableCodeValid ? (
                                    <span className="text-[10px] font-mono font-black text-emerald-400 bg-emerald-500/20 px-1.5 py-0.2 rounded">
                                      {expectedCode}
                                    </span>
                                  ) : (
                                    <span className="text-[10px] font-bold text-amber-400">
                                      (Requiere clave)
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] text-[var(--text-secondary)] block truncate">
                                  {isSelectedTableOccupiedByWaiter
                                    ? 'Comanda abierta por mesero'
                                    : isTableCodeValid
                                    ? 'Ubicación y clave validadas'
                                    : 'Abre la ventana para elegir'}
                                </span>
                              </div>
                            </div>

                            {/* Botón Elegir Mesa / Cambiar Mesa */}
                            <motion.button
                              type="button"
                              whileTap={{ scale: 0.94 }}
                              whileHover={{ scale: 1.02 }}
                              onClick={() => {
                                setShowTableModal(true);
                                setTableCodeError(false);
                                setFormValidationError('');
                              }}
                              className={`px-3.5 py-2.5 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow ${
                                isTableCodeValid
                                  ? 'bg-[var(--surface-bg)] text-[var(--text-primary)] border border-[var(--surface-border)] hover:border-[var(--accent-color)]'
                                  : 'bg-[var(--accent-color)] text-[var(--accent-on)] shadow-[0_0_15px_var(--accent-glow)]'
                              }`}
                            >
                              <Sparkles size={13} />
                              <span>{isTableCodeValid ? 'Cambiar Mesa' : 'Elegir Mesa'}</span>
                            </motion.button>
                          </div>
                        </div>

                        {/* 2.2 Nombre del Titular / Quien Pide */}
                        <div className="space-y-1.5 pt-2 border-t border-[var(--surface-border)]">
                          <label className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                            <User size={14} className="text-[var(--accent-color)]" />
                            <span>Nombre o Apodo de quien pide (Opcional)</span>
                          </label>
                          <p className="text-[11px] text-[var(--text-secondary)]">
                            ¿A nombre de quién entregará el mesero la orden en tu mesa?
                          </p>
                          <div className="relative flex items-center">
                            <User size={15} className="absolute left-3 text-[var(--text-muted)]" />
                            <input
                              type="text"
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              placeholder="Ej: Juan Pérez / Mesa VIP"
                              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[var(--pill-bg)] text-[var(--text-primary)] text-xs border border-[var(--surface-border)] focus:outline-none focus:border-[var(--accent-color)]"
                            />
                          </div>
                        </div>

                        {/* 2.3 Notas o Peticiones Especiales para Mesero */}
                        <div className="space-y-1.5 pt-2 border-t border-[var(--surface-border)]">
                          <label className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                            <FileText size={14} className="text-[var(--accent-color)]" />
                            <span>Indicaciones o Notas Especiales (Opcional)</span>
                          </label>
                          <p className="text-[11px] text-[var(--text-secondary)]">
                            Hielo extra en balde, cristalería adicional, servilletas, etc.
                          </p>
                          <div className="relative flex items-center">
                            <FileText size={15} className="absolute left-3 text-[var(--text-muted)]" />
                            <input
                              type="text"
                              value={notes}
                              onChange={(e) => setNotes(e.target.value)}
                              placeholder="Ej: Balde con hielo extra, vasos de cristal, sin limón..."
                              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[var(--pill-bg)] text-[var(--text-primary)] text-xs border border-[var(--surface-border)] focus:outline-none focus:border-[var(--accent-color)]"
                            />
                          </div>
                        </div>

                      </motion.div>
                    )}

                    {/* FORM FIELDS FOR 'EN LA BARRA' */}
                    {orderType === 'pickup' && (
                      <motion.div
                        key="pickup-form-fields"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="space-y-4 p-4 rounded-3xl glass-panel border border-[var(--surface-border)] bg-[var(--surface-bg)]/80"
                      >
                        
                        {/* 2.1 Nombre de quien retira */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                            <User size={14} className="text-[var(--accent-color)]" />
                            <span>Nombre del Cliente para Llamarte en Barra *</span>
                          </label>
                          <p className="text-[11px] text-[var(--text-secondary)]">
                            Te llamaremos por este nombre cuando tus tragos estén preparados:
                          </p>
                          <div className="relative flex items-center">
                            <User size={15} className="absolute left-3 text-[var(--text-muted)]" />
                            <input
                              type="text"
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              placeholder="Ej: Carlos Gómez"
                              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[var(--pill-bg)] text-[var(--text-primary)] text-xs border border-[var(--surface-border)] focus:outline-none focus:border-[var(--accent-color)]"
                            />
                          </div>
                        </div>

                        {/* 2.2 Celular / WhatsApp de Contacto */}
                        <div className="space-y-1.5 pt-2 border-t border-[var(--surface-border)]">
                          <label className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                            <Phone size={14} className="text-[var(--accent-color)]" />
                            <span>Celular / WhatsApp de Contacto (Opcional)</span>
                          </label>
                          <p className="text-[11px] text-[var(--text-secondary)]">
                            Para notificarte por WhatsApp si hay alguna novedad con tus bebidas:
                          </p>
                          <div className="relative flex items-center">
                            <Phone size={15} className="absolute left-3 text-[var(--text-muted)]" />
                            <input
                              type="tel"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              placeholder="Ej: 313 524 8660"
                              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[var(--pill-bg)] text-[var(--text-primary)] text-xs border border-[var(--surface-border)] focus:outline-none focus:border-[var(--accent-color)]"
                            />
                          </div>
                        </div>

                        {/* 2.3 Tiempo Estimado para Recoger */}
                        <div className="space-y-2 pt-2 border-t border-[var(--surface-border)]">
                          <label className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                            <Clock size={14} className="text-amber-400" />
                            <span>¿En cuánto tiempo pasarás por la barra?</span>
                          </label>
                          <p className="text-[11px] text-[var(--text-secondary)]">
                            Selecciona el tiempo estimado para tener tus bebidas frías y listas:
                          </p>

                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { id: '5-10', label: '⚡ Inmediato (5-10 min)', sub: 'Preparación express' },
                              { id: '15-20', label: '⏱️ En 15-20 min', sub: 'Tiempo estándar' },
                              { id: '30', label: '⏳ En 30 min', sub: 'Alistado programado' },
                              { id: '45', label: '🕒 En 45+ min', sub: 'Para más tarde' }
                            ].map((opt) => {
                              const isSelected = selectedPickupInterval === opt.id;
                              return (
                                <button
                                  key={opt.id}
                                  type="button"
                                  onClick={() => setSelectedPickupInterval(opt.id)}
                                  className={`p-2.5 rounded-xl border text-left flex flex-col gap-0.5 transition-all cursor-pointer ${
                                    isSelected
                                      ? 'bg-[var(--accent-color)] text-[var(--accent-on)] border-transparent shadow font-black'
                                      : 'bg-[var(--pill-bg)] text-[var(--text-primary)] border-[var(--surface-border)] hover:border-[var(--accent-color)]'
                                  }`}
                                >
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="font-bold">{opt.label}</span>
                                    {isSelected && <Check size={12} strokeWidth={3} />}
                                  </div>
                                  <span className="text-[9px] opacity-80">{opt.sub}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* 2.4 Notas para el Bartender */}
                        <div className="space-y-1.5 pt-2 border-t border-[var(--surface-border)]">
                          <label className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                            <Sparkles size={14} className="text-[var(--accent-color)]" />
                            <span>Indicaciones para el Bartender (Opcional)</span>
                          </label>
                          <p className="text-[11px] text-[var(--text-secondary)]">
                            Preferencias de preparación, escarchado, tipo de hielo o mezcla:
                          </p>
                          <div className="relative flex items-center">
                            <Sparkles size={15} className="absolute left-3 text-[var(--text-muted)]" />
                            <input
                              type="text"
                              value={notes}
                              onChange={(e) => setNotes(e.target.value)}
                              placeholder="Ej: Tragos bien fríos, escarchado con sal y limón, poco hielo..."
                              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[var(--pill-bg)] text-[var(--text-primary)] text-xs border border-[var(--surface-border)] focus:outline-none focus:border-[var(--accent-color)]"
                            />
                          </div>
                        </div>

                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* FORM VALIDATION ERROR ALERT */}
                  {formValidationError && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-2xl bg-red-500/15 border border-red-500/40 text-red-400 text-xs font-bold flex items-center gap-2 shadow"
                    >
                      <XCircle size={18} className="text-red-400 shrink-0" />
                      <span>{formValidationError}</span>
                    </motion.div>
                  )}

                </div>

              </div>

            )}

          </div>

          {/* Footer Checkout Summary & WhatsApp Dispatch */}
          {!checkedOut && !isProcessing && cartItems.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-[var(--surface-border)] bg-[var(--surface-bg)] space-y-3.5 shadow-2xl">
              
              {/* Total Price Display with Animated Price Counter */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-black text-[var(--text-muted)] uppercase tracking-wider block">
                    {t.totalPrice}
                  </span>
                  <span className="text-[10px] text-[var(--text-secondary)]">
                    {cartItems.reduce((sum, item) => sum + item.quantity, 0)} productos en total
                  </span>
                </div>
                <AnimatedPriceCounter value={convertedTotal} symbol={currencyObj.symbol} />
              </div>

              {/* Checkout Button to Send WhatsApp */}
              <motion.button
                whileTap={{ scale: 0.96 }}
                whileHover={{ scale: 1.01 }}
                onClick={handleCheckout}
                className="w-full py-4 rounded-2xl bg-[var(--accent-color)] text-[var(--accent-on)] font-black text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-[0_0_25px_var(--accent-glow)] hover:brightness-110 transition-all cursor-pointer"
              >
                <Sparkles size={20} className="animate-pulse" />
                <span>{t.checkout}</span>
              </motion.button>

              <p className="text-[10px] text-center text-[var(--text-muted)] flex items-center justify-center gap-1">
                <span>🔒 Pedido directo y seguro vía WhatsApp a KAL DISCOBAR</span>
              </p>
            </div>
          )}

        </motion.div>

        {/* POPUP MODAL: ELEGIR MESA Y VALIDAR CLAVE */}
        <AnimatePresence>
          {showTableModal && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 15 }}
                className="w-full max-w-md p-5 sm:p-6 rounded-3xl glass-panel border border-[var(--surface-border)] bg-[var(--bg-color)] shadow-2xl space-y-4"
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between border-b border-[var(--surface-border)] pb-3">
                  <div className="flex items-center gap-2.5 text-[var(--accent-color)]">
                    <div className="w-9 h-9 rounded-xl bg-[var(--accent-color)]/15 border border-[var(--accent-color)]/30 flex items-center justify-center text-lg shadow">
                      🪑
                    </div>
                    <div>
                      <h4 className="text-base font-black text-[var(--text-primary)] serif-title leading-tight">
                        Elegir Mesa y Clave de Seguridad
                      </h4>
                      <span className="text-[10px] text-[var(--accent-color)] font-semibold">
                        KAL DISCOBAR • Servicio a la Mesa VIP
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowTableModal(false)}
                    className="p-1.5 rounded-full hover:bg-[var(--pill-bg)] text-[var(--text-muted)] hover:text-white cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Instructions */}
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Toca el número de tu mesa física (1 al 15) e ingresa el código de 5 caracteres que aparece en el hablador o tarjeta de tu mesa:
                </p>

                {/* 1. Selector de Mesa Interactivo con Plano de KAL */}
                <div className="space-y-2">
                  <InteractiveTableMap
                    selectedTable={selectedTable}
                    onSelectTable={handleTableSelect}
                    isWaiter={false}
                  />
                </div>

                {/* 2. Security Code Input */}
                <div className="space-y-2 pt-2 border-t border-[var(--surface-border)]">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                      <Lock size={14} className="text-amber-400" />
                      <span>2. Clave o Token de Mesa #{selectedTable} *</span>
                    </label>
                  </div>

                  {isSelectedTableLocked ? (
                    <div className="p-3 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-bold flex items-center gap-2">
                      <Lock size={16} className="shrink-0 text-red-400" />
                      <span>🚫 Esta mesa está bloqueada para pedidos digitales. Consulta con un mesero.</span>
                    </div>
                  ) : (
                    <>
                      <div className="relative flex items-center">
                        <Key size={15} className="absolute left-3 text-[var(--text-muted)]" />
                        <input
                          type="text"
                          maxLength={10}
                          value={tableCodeInput}
                          onChange={(e) => {
                            setTableCodeInput(e.target.value);
                            setTableCodeError(false);
                            setFormValidationError('');
                          }}
                          placeholder="Ingresa clave del hablador o token QR"
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[var(--pill-bg)] text-[var(--text-primary)] text-xs border border-[var(--surface-border)] focus:outline-none focus:border-[var(--accent-color)] font-mono uppercase font-bold tracking-widest placeholder:text-gray-500 placeholder:normal-case placeholder:tracking-normal"
                        />
                      </div>

                      {/* Realtime Badges */}
                      {isTableCodeValid ? (
                        <motion.div
                          initial={{ opacity: 0, y: -2 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2 shadow-sm"
                        >
                          <CheckCircle2 size={16} className="shrink-0 text-emerald-400" />
                          <span>✅ Mesa #{selectedTable} verificada correctamente.</span>
                        </motion.div>
                      ) : tableCodeError ? (
                        <motion.div
                          initial={{ opacity: 0, x: -4 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="p-2.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-bold flex items-center gap-2 shadow-sm"
                        >
                          <XCircle size={16} className="shrink-0 text-red-400" />
                          <span>Código o token incorrecto para Mesa #{selectedTable}. Consulta el hablador físico.</span>
                        </motion.div>
                      ) : (
                        <span className="text-[10px] text-[var(--text-muted)] block italic">
                          💡 Revisa el hablador en tu mesa física o escanea el QR con tu cámara.
                        </span>
                      )}
                    </>
                  )}
                </div>

                {/* Footer Buttons */}
                <div className="pt-2 border-t border-[var(--surface-border)] flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowTableModal(false)}
                    className="px-4 py-2.5 rounded-xl bg-[var(--pill-bg)] text-[var(--text-secondary)] text-xs font-bold hover:text-[var(--text-primary)] transition-all cursor-pointer border border-[var(--surface-border)]"
                  >
                    Cerrar
                  </button>

                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.95 }}
                    onClick={handleConfirmTableModal}
                    className="px-5 py-2.5 rounded-xl bg-[var(--accent-color)] text-[var(--accent-on)] text-xs font-black flex items-center gap-1.5 shadow-[0_0_15px_var(--accent-glow)] hover:brightness-110 transition-all cursor-pointer"
                  >
                    <Check size={15} strokeWidth={3} />
                    <span>Guardar Mesa #{selectedTable}</span>
                  </motion.button>
                </div>

              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* WOMPI DEMO CHECKOUT MODAL FOR BAR ORDERS */}
        <WompiCheckoutModal
          isOpen={showWompiModal}
          onClose={() => setShowWompiModal(false)}
          totalCOP={totalCOP}
          orderData={{
            customerName: fullName.trim() || 'Cliente en Barra',
            phone: phone.trim()
          }}
          onSuccess={handleWompiSuccess}
        />

      </div>
    </AnimatePresence>
  );

  function renderCartRow(dish, quantity) {
    const itemPrice = Number(dish.priceCOP * currencyObj.rate * quantity).toLocaleString(
      currentCurrency === 'COP' || currentCurrency === 'CLP' || currentCurrency === 'ARS' ? 'es-CO' : 'en-US',
      { maximumFractionDigits: currentCurrency === 'COP' || currentCurrency === 'CLP' || currentCurrency === 'ARS' ? 0 : 2 }
    );

    return (
      <motion.div
        key={dish.id}
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="flex items-center justify-between p-3.5 rounded-2xl glass-panel border border-[var(--surface-border)] gap-3 bg-[var(--surface-bg)]/60"
      >
        <img
          src={dish.image}
          alt={dish.name[currentLang] || dish.name.es}
          className="w-14 h-14 object-cover rounded-xl shrink-0 border border-white/10"
        />

        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-bold text-[var(--text-primary)] truncate">
            {dish.name[currentLang] || dish.name.es}
          </h4>
          <p className="text-xs font-extrabold text-[var(--accent-color)] mt-1">
            {currencyObj.symbol}{itemPrice}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[var(--pill-bg)] p-1 rounded-xl border border-[var(--surface-border)]">
          <button
            onClick={() => onUpdateQuantity(dish.id, quantity - 1)}
            className="p-1 rounded-lg hover:bg-black/30 text-[var(--text-primary)] cursor-pointer"
            title="Disminuir"
          >
            <Minus size={14} />
          </button>

          <span className="text-xs font-black px-1.5 text-[var(--text-primary)]">{quantity}</span>

          <button
            onClick={() => onUpdateQuantity(dish.id, quantity + 1)}
            className="p-1 rounded-lg hover:bg-black/30 text-[var(--text-primary)] cursor-pointer"
            title="Aumentar"
          >
            <Plus size={14} />
          </button>
        </div>
      </motion.div>
    );
  }
}
