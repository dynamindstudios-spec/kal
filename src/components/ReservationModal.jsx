import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Calendar, Clock, User, Phone, Mail, FileText, Sparkles, Check, ChevronDown, ChevronLeft, ChevronRight, CheckCircle2, ShieldCheck, Flame, Utensils,
  Heart, Gift, Briefcase, Users, GlassWater, DollarSign
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { adminStore } from '../services/adminStore';
import WompiCheckoutModal from './admin/WompiCheckoutModal';

// SVG Table Icon
function TableIcon({ size = 28, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="8" y="24" width="48" height="6" rx="2" fill="currentColor" opacity="0.8" />
      <path d="M6 26C6 24.8954 6.89543 24 8 24H56C57.1046 24 58 24.8954 58 26V34C58 35.1046 57.1046 36 56 36H50L46 42L42 36H22L18 42L14 36H8C6.89543 36 6 35.1046 6 34V26Z" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="2" />
      <rect x="14" y="36" width="5" height="22" rx="1.5" fill="currentColor" opacity="0.6" />
      <rect x="45" y="36" width="5" height="22" rx="1.5" fill="currentColor" opacity="0.6" />
    </svg>
  );
}

const MONTH_NAMES_ES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const TIME_SLOTS = [
  "17:00 - 19:00 (Apertura & Tarde)",
  "19:00 - 21:00 (Previa & Cócteles)",
  "21:00 - 23:00 (Rumba Nocturna VIP)",
  "23:00 - 01:00 (Pico de Fiesta)",
  "01:00 - 02:30 (Cierre Rumba)"
];

const EVENT_TYPE_OPTIONS = [
  { id: "cumpleanos", label: "Cumpleaños / Aniversario VIP", icon: <Gift size={15} className="text-amber-400" />, desc: "Festejo especial con show y bengalas" },
  { id: "amigos", label: "Mesa de Amigos / Grupo de Rumba", icon: <Users size={15} className="text-purple-400" />, desc: "Ubicación ideal para rumba y botellas" },
  { id: "pareja", label: "Cita / Pareja Nocturna", icon: <Heart size={15} className="text-pink-400" />, desc: "Mesa ambiente cómodo e íntimo" },
  { id: "evento-especial", label: "Show Especial / Pole Dance", icon: <Sparkles size={15} className="text-yellow-400" />, desc: "Mesa preferencial cerca de tarima/DJs" },
  { id: "otro", label: "Reserva VIP Especial", icon: <FileText size={15} className="text-gray-400" />, desc: "Requerimientos de botella o espacio" }
];

// Motion Variants for Entrance Animations
const containerVariants = {
  hidden: { opacity: 0, scale: 0.94, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { 
      duration: 0.35, 
      staggerChildren: 0.07, 
      delayChildren: 0.1 
    }
  },
  exit: { opacity: 0, scale: 0.94, y: 20, transition: { duration: 0.2 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 350, damping: 25 } }
};

// Custom Professional Calendar Picker Component
function CustomCalendarPicker({ selectedDate, onSelectDate }) {
  const [showDropdown, setShowDropdown] = useState(false);
  
  const initialDate = selectedDate ? new Date(selectedDate + 'T00:00:00') : new Date();
  const [currentYear, setCurrentYear] = useState(initialDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth());

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  let firstDayIndex = new Date(currentYear, currentMonth, 1).getDay() - 1;
  if (firstDayIndex < 0) firstDayIndex = 6;

  const selectedDateObj = selectedDate ? new Date(selectedDate + 'T00:00:00') : today;
  const formattedTrigger = selectedDateObj.toLocaleDateString('es-ES', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const handleDayClick = (dayNum) => {
    const monthStr = String(currentMonth + 1).padStart(2, '0');
    const dayStr = String(dayNum).padStart(2, '0');
    const dateFormatted = `${currentYear}-${monthStr}-${dayStr}`;
    onSelectDate(dateFormatted);
    setShowDropdown(false);
  };

  return (
    <div className="relative">
      {/* Trigger Bar: Click anywhere on bar OR arrow to toggle */}
      <button
        type="button"
        onClick={() => setShowDropdown(!showDropdown)}
        className="w-full px-4 py-2.5 rounded-2xl bg-[var(--pill-bg)] border border-[var(--surface-border)] text-xs font-bold text-[var(--text-primary)] flex items-center justify-between hover:border-[var(--accent-color)] transition-all"
      >
        <div className="flex items-center gap-2.5">
          <Calendar size={16} className="text-[var(--accent-color)] shrink-0" />
          <span className="capitalize">{formattedTrigger}</span>
        </div>
        <ChevronDown size={16} className={`text-[var(--text-muted)] transition-transform shrink-0 ${showDropdown ? 'rotate-180 text-[var(--accent-color)]' : ''}`} />
      </button>

      {/* Professional Custom Calendar Dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 right-0 mt-2 p-4 rounded-3xl bg-[var(--bg-color)] border border-[var(--surface-border)] shadow-2xl z-30 space-y-3"
          >
            {/* Header: Month & Year Nav */}
            <div className="flex items-center justify-between pb-2 border-b border-[var(--surface-border)]">
              <button
                type="button"
                onClick={prevMonth}
                className="p-1.5 rounded-xl hover:bg-[var(--pill-bg)] text-[var(--text-primary)] transition-all"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-xs font-black text-[var(--text-primary)] uppercase tracking-wider">
                {MONTH_NAMES_ES[currentMonth]} {currentYear}
              </span>
              <button
                type="button"
                onClick={nextMonth}
                className="p-1.5 rounded-xl hover:bg-[var(--pill-bg)] text-[var(--text-primary)] transition-all"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Weekdays Row */}
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-black text-[var(--text-muted)] uppercase">
              <span>Lu</span>
              <span>Ma</span>
              <span>Mi</span>
              <span>Ju</span>
              <span>Vi</span>
              <span>Sá</span>
              <span>Do</span>
            </div>

            {/* Calendar Days Grid */}
            <div className="grid grid-cols-7 gap-1 text-center">
              {Array.from({ length: firstDayIndex }).map((_, i) => (
                <div key={`empty-${i}`} className="w-8 h-8" />
              ))}

              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const dateToCheck = new Date(currentYear, currentMonth, dayNum);
                dateToCheck.setHours(0, 0, 0, 0);

                const isPast = dateToCheck < today;
                const monthStr = String(currentMonth + 1).padStart(2, '0');
                const dayStr = String(dayNum).padStart(2, '0');
                const dateString = `${currentYear}-${monthStr}-${dayStr}`;
                const isSelected = selectedDate === dateString;

                return (
                  <motion.button
                    key={dayNum}
                    type="button"
                    disabled={isPast}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDayClick(dayNum)}
                    className={`w-8 h-8 rounded-xl text-xs font-bold flex items-center justify-center transition-all mx-auto ${
                      isSelected
                        ? 'bg-[var(--accent-color)] text-[var(--accent-on)] font-black shadow-md scale-105'
                        : isPast
                        ? 'opacity-25 cursor-not-allowed text-[var(--text-muted)]'
                        : 'text-[var(--text-primary)] hover:bg-[var(--pill-bg)] hover:text-[var(--accent-color)]'
                    }`}
                  >
                    {dayNum}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Custom Professional Event Type Picker Component
function CustomEventTypePicker({ selectedType, onSelectType }) {
  const [showDropdown, setShowDropdown] = useState(false);

  const activeOption = EVENT_TYPE_OPTIONS.find((opt) => opt.label === selectedType) || EVENT_TYPE_OPTIONS[0];

  return (
    <div className="relative">
      {/* Trigger Bar */}
      <button
        type="button"
        onClick={() => setShowDropdown(!showDropdown)}
        className="w-full px-3.5 py-2.5 rounded-2xl bg-[var(--pill-bg)] border border-[var(--surface-border)] text-xs font-medium text-[var(--text-primary)] flex items-center justify-between hover:border-[var(--accent-color)] transition-all"
      >
        <div className="flex items-center gap-2 truncate">
          {activeOption.icon}
          <span className="truncate font-bold text-xs">{activeOption.label}</span>
        </div>
        <ChevronDown size={15} className={`text-[var(--text-muted)] transition-transform shrink-0 ${showDropdown ? 'rotate-180 text-[var(--accent-color)]' : ''}`} />
      </button>

      {/* Floating Animated Dropdown Menu */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 right-0 bottom-full mb-2 p-1.5 rounded-3xl bg-[var(--card-bg)] border border-[var(--surface-border)] shadow-2xl z-40 space-y-1 max-h-56 overflow-y-auto"
          >
            {EVENT_TYPE_OPTIONS.map((opt) => {
              const isSelected = selectedType === opt.label;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    onSelectType(opt.label);
                    setShowDropdown(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-2xl transition-all flex items-center justify-between gap-2.5 ${
                    isSelected
                      ? 'bg-[var(--accent-color)] text-[var(--accent-on)] font-black shadow-md'
                      : 'text-[var(--text-primary)] hover:bg-[var(--pill-bg)]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`p-1.5 rounded-xl shrink-0 ${isSelected ? 'bg-black/20' : 'bg-[var(--pill-bg)]'}`}>
                      {opt.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-black truncate">{opt.label}</p>
                      <p className={`text-[10px] truncate ${isSelected ? 'opacity-90' : 'text-[var(--text-muted)]'}`}>
                        {opt.desc}
                      </p>
                    </div>
                  </div>
                  {isSelected && <Check size={14} strokeWidth={3} className="shrink-0" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ReservationModal({ isOpen, onClose, currentLang = 'es' }) {
  const todayStr = new Date().toISOString().split('T')[0];

  // Table selection state
  const [tableCount, setTableCount] = useState(1); // How many tables (1, 2, 3, 4)
  const [selectedTables, setSelectedTables] = useState([1]); // Array of table numbers

  const [reservationDate, setReservationDate] = useState(todayStr);
  const [selectedSlots, setSelectedSlots] = useState(["19:00 - 20:00 (Cena)"]);
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);

  // Form State
  const [fullName, setFullName] = useState('');
  const [docId, setDocId] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [eventType, setEventType] = useState(EVENT_TYPE_OPTIONS[0].label);

  // Status & Animation States
  const [isCooking, setIsCooking] = useState(false);
  const [cookingProgress, setCookingProgress] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [reservationCode, setReservationCode] = useState('');
  const [showWompiModal, setShowWompiModal] = useState(false);
  const [wompiTxId, setWompiTxId] = useState('');

  // Handle table quantity change
  const handleTableCountChange = (count) => {
    setTableCount(count);
    if (selectedTables.length > count) {
      setSelectedTables(selectedTables.slice(0, count));
    }
  };

  // Toggle or select tables according to tableCount limit
  const handleTableClick = (tableNum) => {
    if (selectedTables.includes(tableNum)) {
      if (selectedTables.length === 1) return; // Keep at least 1 table
      setSelectedTables(selectedTables.filter((t) => t !== tableNum));
    } else {
      if (selectedTables.length < tableCount) {
        setSelectedTables([...selectedTables, tableNum]);
      } else {
        setSelectedTables([...selectedTables.slice(1), tableNum]);
      }
    }
  };

  const toggleSlot = (slot) => {
    if (selectedSlots.includes(slot)) {
      if (selectedSlots.length === 1) return; // Keep at least 1 slot
      setSelectedSlots(selectedSlots.filter((s) => s !== slot));
    } else {
      setSelectedSlots([...selectedSlots, slot]);
    }
  };

  const handleSubmitReservation = (e) => {
    e.preventDefault();
    if (!fullName || !phone || !docId) {
      alert("Por favor completa los campos de Nombre, Cédula y Teléfono.");
      return;
    }

    // Open Wompi Sandbox payment modal for the $20.000 COP reservation deposit
    setShowWompiModal(true);
  };

  const handleWompiSuccess = (wompiDetails) => {
    setShowWompiModal(false);
    setWompiTxId(wompiDetails.transactionId);

    const code = 'RES-' + Math.floor(1000 + Math.random() * 9000);
    setReservationCode(code);

    // Register reservation in backend store
    adminStore.addReservation({
      clientName: fullName.trim(),
      phone: phone.trim(),
      date: reservationDate,
      time: selectedSlots.join(', '),
      tableNum: selectedTables[0],
      partySize: selectedTables.length * 4,
      eventType: eventType,
      wompiTransactionId: wompiDetails.transactionId,
      isPaid: true
    });

    // Launch Cooking Animation Scene
    setIsCooking(true);
    setCookingProgress(0);

    const interval = setInterval(() => {
      setCookingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 4;
      });
    }, 90);

    setTimeout(() => {
      setIsCooking(false);
      setIsSuccess(true);
      confetti({ particleCount: 110, spread: 80, origin: { y: 0.6 } });

      // WhatsApp formatted message with Wompi verification
      const waText = `🍾 *NUEVA RESERVA VIP VERIFICADA - KAL DISCOBAR*%0A%0A*Código de Reserva:* ${code}%0A*Titular:* ${fullName.trim()} (Doc: ${docId.trim()})%0A*WhatsApp:* ${phone.trim()}%0A*Fecha:* ${reservationDate}%0A*Horarios:* ${selectedSlots.join(', ')}%0A*Mesas:* ${selectedTables.map(t => `#${t}`).join(', ')}%0A*Evento:* ${eventType}%0A%0A💳 *Abono de Reserva:* $20.000 COP (PAGADO)%0A🔒 *Wompi Demo Ref:* ${wompiDetails.transactionId}`;

      setTimeout(() => {
        window.open(`https://wa.me/573135248660?text=${waText}`, '_blank');
      }, 3000);
    }, 2600);
  };

  const handleReset = () => {
    setIsCooking(false);
    setIsSuccess(false);
    setShowWompiModal(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
        
        {/* Backdrop click */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleReset}
          className="fixed inset-0"
        />

        {/* Modal Window */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="relative z-10 w-full max-w-lg bg-[var(--bg-color)] border border-[var(--surface-border)] rounded-3xl shadow-2xl overflow-hidden my-auto"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="p-5 sm:p-6 border-b border-[var(--surface-border)] flex items-center justify-between bg-[var(--surface-bg)]">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-2xl bg-[var(--pill-bg)] text-[var(--accent-color)] border border-[var(--surface-border)]">
                <Utensils size={20} />
              </div>
              <div>
                <h3 className="text-lg font-black text-[var(--text-primary)] serif-title leading-none">
                  Reservar Mesa
                </h3>
                <p className="text-[11px] text-[var(--text-muted)] font-semibold mt-1">
                  KAL DISCOBAR — Experiencia Nocturna VIP
                </p>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="p-2 rounded-full hover:bg-[var(--pill-bg)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all"
            >
              <X size={20} />
            </button>
          </motion.div>

          {/* Body Content */}
          <div className="p-5 sm:p-6 max-h-[80vh] overflow-y-auto space-y-6">
            
            {isCooking ? (
              /* Animated Cooking Scene */
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="py-10 space-y-6 text-center flex flex-col items-center justify-center"
              >
                {/* Sizzling Frying Pan & Food Animation */}
                <div className="relative w-28 h-28 flex items-center justify-center">
                  
                  {/* Floating Steam Particles */}
                  <motion.div
                    animate={{ y: [-5, -25], opacity: [0.8, 0], scale: [0.8, 1.2] }}
                    transition={{ repeat: Infinity, duration: 1.4, ease: "easeOut" }}
                    className="absolute -top-4 text-xl flex gap-2 pointer-events-none"
                  >
                    <span>♨️</span>
                    <span>💨</span>
                  </motion.div>

                  {/* Pan & Ingredients Bounce */}
                  <motion.div
                    animate={{ rotate: [0, -10, 10, -10, 0], y: [0, -6, 0] }}
                    transition={{ repeat: Infinity, duration: 1.1, ease: "easeInOut" }}
                    className="text-6xl select-none filter drop-shadow-xl"
                  >
                    🍳
                  </motion.div>

                  {/* Sizzling Sparks */}
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="absolute -bottom-1 text-xl"
                  >
                    🔥
                  </motion.div>
                </div>

                <div className="space-y-1 max-w-xs">
                  <h4 className="text-base sm:text-lg font-black text-[var(--text-primary)] serif-title">
                    ¡Reservando tu Mesa! 🍷✨
                  </h4>
                  <p className="text-xs text-[var(--text-muted)] font-medium leading-relaxed">
                    Confirmando {selectedTables.length === 1 ? `la mesa #${selectedTables[0]}` : `las mesas #${selectedTables.join(', #')}`}, notificando al personal y preparando tu llegada...
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="w-full max-w-xs space-y-1.5">
                  <div className="w-full h-3 rounded-full bg-[var(--pill-bg)] border border-[var(--surface-border)] overflow-hidden p-0.5">
                    <motion.div
                      className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full"
                      style={{ width: `${cookingProgress}%` }}
                    />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[var(--accent-color)]">
                    Procesando reserva... {cookingProgress}%
                  </p>
                </div>

              </motion.div>
            ) : isSuccess ? (
              /* Success Confirmation Screen (Fully Theme-Adapted) */
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4 space-y-4"
              >
                {/* Circle Badge adapting to active theme accent color */}
                <div className="w-16 h-16 rounded-full bg-[var(--accent-color)] text-[var(--accent-on)] flex items-center justify-center mx-auto shadow-xl text-3xl animate-bounce border border-white/20">
                  ✨
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-black tracking-widest text-[var(--text-muted)]">Código de Confirmación</span>
                  <p className="text-3xl font-black text-[var(--accent-color)] serif-title">{reservationCode}</p>
                </div>

                {/* Theme-Adaptive Details Card */}
                <div className="p-4.5 rounded-2xl bg-[var(--accent-color)]/10 border border-[var(--accent-color)]/30 text-[var(--text-primary)] text-xs font-bold space-y-2 text-left shadow-md">
                  <p className="font-black flex items-center gap-1.5 text-sm text-[var(--accent-color)]">
                    <CheckCircle2 size={18} className="text-[var(--accent-color)]" /> ¡Reserva Confirmada & Cocina Notificada!
                  </p>
                  <div className="space-y-1.5 text-[11px] text-[var(--text-primary)] font-medium pt-1.5 border-t border-[var(--surface-border)]">
                    <p>
                      <span className="text-[var(--text-muted)]">Mesas Reservadas ({selectedTables.length}):</span> <b className="text-[var(--accent-color)] font-extrabold">{selectedTables.map(t => `#${t}`).join(', ')}</b> a nombre de <b>{fullName}</b> (C.I. {docId}).
                    </p>
                    <p>
                      <span className="text-[var(--text-muted)]">Fecha:</span> <b>{reservationDate}</b> | <span className="text-[var(--text-muted)]">Horarios:</span> <b>{selectedSlots.join(', ')}</b>.
                    </p>
                    <p>
                      <span className="text-[var(--text-muted)]">Evento:</span> <b>{eventType}</b>.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleReset}
                  className="w-full py-3.5 rounded-2xl bg-[var(--accent-color)] text-[var(--accent-on)] font-black text-xs shadow-lg hover:brightness-110 transition-all cursor-pointer"
                >
                  Entendido & Volver al Menú
                </button>
              </motion.div>
            ) : (
              /* Interactive Reservation Form */
              <form onSubmit={handleSubmitReservation} className="space-y-6">
                
                {/* FIRST QUESTION: ¿Cuántas mesas vas a reservar? */}
                <motion.div variants={itemVariants} className="space-y-2.5">
                  <span className="text-xs font-black text-[var(--accent-color)] uppercase tracking-wider block">
                    1. ¿Cuántas mesas deseas reservar?
                  </span>
                  
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map((num) => {
                      const isActive = tableCount === num;
                      return (
                        <motion.button
                          key={num}
                          type="button"
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleTableCountChange(num)}
                          className={`py-2.5 rounded-2xl text-xs font-black transition-all border flex items-center justify-center gap-1.5 ${
                            isActive
                              ? 'bg-[var(--accent-color)] text-[var(--accent-on)] border-transparent shadow-md font-black scale-105'
                              : 'bg-[var(--pill-bg)] text-[var(--text-primary)] border-[var(--surface-border)] hover:border-[var(--accent-color)]'
                          }`}
                        >
                          <TableIcon size={18} className={isActive ? 'text-[var(--accent-on)]' : 'text-[var(--text-secondary)]'} />
                          <span>{num} {num === 1 ? 'Mesa' : 'Mesas'}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>

                {/* 2. SECTION: Interactive Table Picker Grid */}
                <motion.div variants={itemVariants} className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-[var(--accent-color)] uppercase tracking-wider">
                      2. Elige las {tableCount} {tableCount === 1 ? 'Mesa' : 'Mesas'} en la Planta
                    </span>
                    <span className="text-[11px] font-bold text-[var(--text-primary)]">
                      Seleccionadas: <b className="text-[var(--accent-color)]">{selectedTables.map(t => `#${t}`).join(', ')}</b> ({selectedTables.length}/{tableCount})
                    </span>
                  </div>

                  {/* 15 Table Buttons Grid */}
                  <div className="grid grid-cols-5 gap-2 max-h-36 overflow-y-auto p-1.5 bg-[var(--pill-bg)] rounded-2xl border border-[var(--surface-border)]">
                    {Array.from({ length: 15 }, (_, i) => i + 1).map((tableNum) => {
                      const isSelected = selectedTables.includes(tableNum);
                      return (
                        <motion.button
                          key={tableNum}
                          type="button"
                          whileTap={{ scale: 0.92 }}
                          onClick={() => handleTableClick(tableNum)}
                          className={`p-2 rounded-xl text-xs font-black transition-all border flex flex-col items-center justify-center gap-0.5 ${
                            isSelected
                              ? 'bg-[var(--accent-color)] text-[var(--accent-on)] border-transparent shadow-md scale-105'
                              : 'bg-[var(--card-bg)] text-[var(--text-primary)] border-[var(--surface-border)] hover:border-[var(--accent-color)]'
                          }`}
                        >
                          <TableIcon size={18} className={isSelected ? 'text-[var(--accent-on)]' : 'text-[var(--text-secondary)]'} />
                          <span>#{tableNum}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>

                {/* 3. SECTION: Custom Professional Calendar Picker */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <span className="text-xs font-black text-[var(--accent-color)] uppercase tracking-wider block">
                    3. Fecha de la Reserva
                  </span>

                  <CustomCalendarPicker
                    selectedDate={reservationDate}
                    onSelectDate={setReservationDate}
                  />
                </motion.div>

                {/* 4. SECTION: Dropdown / Time selector for Hours with Multi-Select Intervals */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-[var(--accent-color)] uppercase tracking-wider">
                      4. Horario & Duración (Intervalos de 1 Hora)
                    </span>
                    <span className="text-[10px] font-bold text-[var(--text-muted)]">
                      {selectedSlots.length} hora(s) reservada(s)
                    </span>
                  </div>

                  {/* Dropdown Toggle Button */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowTimeDropdown(!showTimeDropdown)}
                      className="w-full px-4 py-2.5 rounded-2xl bg-[var(--pill-bg)] border border-[var(--surface-border)] text-xs font-bold text-[var(--text-primary)] flex items-center justify-between hover:border-[var(--accent-color)] transition-all"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Clock size={16} className="text-[var(--accent-color)] shrink-0" />
                        <span className="truncate">{selectedSlots.join(', ')}</span>
                      </div>
                      <ChevronDown size={16} className={`transition-transform shrink-0 ${showTimeDropdown ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Time Slots List with Checkboxes */}
                    {showTimeDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 p-2 rounded-2xl bg-[var(--card-bg)] border border-[var(--surface-border)] shadow-xl max-h-48 overflow-y-auto space-y-1 z-20 relative"
                      >
                        <p className="text-[10px] text-[var(--text-muted)] font-bold px-2 py-1 italic">
                          Puedes seleccionar varios intervalos para reservar más de 1 hora:
                        </p>
                        {TIME_SLOTS.map((slot) => {
                          const isChecked = selectedSlots.includes(slot);
                          return (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => toggleSlot(slot)}
                              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
                                isChecked
                                  ? 'bg-[var(--accent-color)] text-[var(--accent-on)] shadow-sm'
                                  : 'text-[var(--text-primary)] hover:bg-[var(--pill-bg)]'
                              }`}
                            >
                              <span>{slot}</span>
                              <div className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                                isChecked ? 'bg-white text-black border-white' : 'border-[var(--surface-border)]'
                              }`}>
                                {isChecked && <Check size={12} strokeWidth={3} />}
                              </div>
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </div>
                </motion.div>

                {/* 5. SECTION: Customer Form Fields */}
                <motion.div variants={itemVariants} className="space-y-3 pt-2 border-t border-[var(--surface-border)]">
                  <span className="text-xs font-black text-[var(--accent-color)] uppercase tracking-wider block">
                    5. Datos del Titular & Evento
                  </span>

                  {/* Nombre Completo */}
                  <div className="relative flex items-center">
                    <User size={15} className="absolute left-3.5 text-[var(--text-muted)]" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Nombre Completo del Titular"
                      className="w-full pl-10 pr-3 py-2.5 rounded-2xl bg-[var(--pill-bg)] text-[var(--text-primary)] text-xs border border-[var(--surface-border)] focus:outline-none focus:border-[var(--accent-color)] font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {/* Cédula / Documento */}
                    <div className="relative flex items-center">
                      <ShieldCheck size={15} className="absolute left-3.5 text-[var(--text-muted)]" />
                      <input
                        type="text"
                        required
                        value={docId}
                        onChange={(e) => setDocId(e.target.value)}
                        placeholder="Cédula / Doc. Identidad"
                        className="w-full pl-10 pr-3 py-2.5 rounded-2xl bg-[var(--pill-bg)] text-[var(--text-primary)] text-xs border border-[var(--surface-border)] focus:outline-none focus:border-[var(--accent-color)] font-medium"
                      />
                    </div>

                    {/* Teléfono */}
                    <div className="relative flex items-center">
                      <Phone size={15} className="absolute left-3.5 text-[var(--text-muted)]" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Teléfono / WhatsApp"
                        className="w-full pl-10 pr-3 py-2.5 rounded-2xl bg-[var(--pill-bg)] text-[var(--text-primary)] text-xs border border-[var(--surface-border)] focus:outline-none focus:border-[var(--accent-color)] font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {/* Correo Electrónico */}
                    <div className="relative flex items-center">
                      <Mail size={15} className="absolute left-3.5 text-[var(--text-muted)]" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Correo Electrónico"
                        className="w-full pl-10 pr-3 py-2.5 rounded-2xl bg-[var(--pill-bg)] text-[var(--text-primary)] text-xs border border-[var(--surface-border)] focus:outline-none focus:border-[var(--accent-color)] font-medium"
                      />
                    </div>

                    {/* Custom Professional Event Type Picker */}
                    <CustomEventTypePicker
                      selectedType={eventType}
                      onSelectType={setEventType}
                    />
                  </div>
                </motion.div>

                {/* Notice of $20.000 COP reservation fee */}
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-amber-400 font-bold">
                    <Sparkles size={16} />
                    <span>Abono de Reserva / Cover VIP:</span>
                  </div>
                  <span className="font-mono font-black text-amber-300">$20.000 COP</span>
                </div>

                {/* Submit Button */}
                <motion.button
                  variants={itemVariants}
                  whileTap={{ scale: 0.96 }}
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-[var(--accent-color)] text-[var(--accent-on)] font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl hover:brightness-110 transition-all cursor-pointer"
                >
                  <Utensils size={16} />
                  <span>
                    {selectedTables.length === 1
                      ? `Reservar Mesa #${selectedTables[0]} (Pagar $20.000 con Wompi)`
                      : `Reservar Mesas #${selectedTables.join(', #')} (Pagar $20.000 con Wompi)`}
                  </span>
                </motion.button>

              </form>
            )}

          </div>

        </motion.div>

        {/* WOMPI SANDBOX CHECKOUT MODAL FOR RESERVATION */}
        <WompiCheckoutModal
          isOpen={showWompiModal}
          onClose={() => setShowWompiModal(false)}
          totalCOP={20000}
          orderData={{
            customerName: fullName.trim() || 'Titular Reserva VIP',
            phone: phone.trim()
          }}
          onSuccess={handleWompiSuccess}
        />

      </div>
    </AnimatePresence>
  );
}
