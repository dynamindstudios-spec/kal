import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { adminStore } from '../services/adminStore';

export default function FloatingSocialButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [socialLinks, setSocialLinks] = useState(adminStore.getSocialLinks());

  useEffect(() => {
    const unsubscribe = adminStore.subscribe(() => {
      setSocialLinks(adminStore.getSocialLinks());
    });
    return unsubscribe;
  }, []);

  const allContactItems = [
    {
      id: 'whatsapp',
      name: 'WhatsApp VIP',
      enabled: socialLinks.whatsappEnabled !== false,
      icon: WhatsAppIcon,
      action: () => {
        const url = `https://wa.me/${socialLinks.whatsappNumber || '573135248660'}?text=${encodeURIComponent(socialLinks.whatsappMessage || '¡Hola KAL DISCOBAR! Quiero reservar una mesa / información VIP.')}`;
        window.open(url, '_blank');
      },
      iconColor: 'text-[#25D366] hover:drop-shadow-[0_0_18px_rgba(37,211,102,1)] hover:scale-125',
      tooltip: 'WhatsApp Reservas VIP'
    },
    {
      id: 'instagram',
      name: 'Instagram Oficial',
      enabled: socialLinks.instagramEnabled !== false,
      icon: InstagramIcon,
      action: () => window.open(socialLinks.instagramUrl || 'https://instagram.com/kaldiscobar', '_blank'),
      iconColor: 'text-[#FF2E93] hover:drop-shadow-[0_0_18px_rgba(255,46,147,1)] hover:scale-125',
      tooltip: '@kaldiscobar'
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      enabled: socialLinks.tiktokEnabled !== false,
      icon: TikTokIcon,
      action: () => window.open(socialLinks.tiktokUrl || 'https://tiktok.com/@kaldiscobar', '_blank'),
      iconColor: 'text-[#00F2FE] hover:drop-shadow-[0_0_18px_rgba(0,242,254,1)] hover:scale-125',
      tooltip: 'TikTok Oficial'
    },
    {
      id: 'facebook',
      name: 'Facebook',
      enabled: socialLinks.facebookEnabled !== false,
      icon: FacebookIcon,
      action: () => window.open(socialLinks.facebookUrl || 'https://facebook.com/kaldiscobar', '_blank'),
      iconColor: 'text-[#1877F2] hover:drop-shadow-[0_0_18px_rgba(24,119,242,1)] hover:scale-125',
      tooltip: 'Facebook Oficial'
    },
    {
      id: 'phone',
      name: 'Llamar al Bar',
      enabled: socialLinks.phoneEnabled !== false,
      icon: PhoneCallIcon,
      action: () => {
        window.location.href = `tel:${socialLinks.phoneNumber || '+573135248660'}`;
      },
      iconColor: 'text-[#FFD700] hover:drop-shadow-[0_0_18px_rgba(255,215,0,1)] hover:scale-125',
      tooltip: 'Línea Directa'
    }
  ];

  const contactItems = allContactItems.filter((it) => it.enabled);

  if (contactItems.length === 0) return null;

  return (
    <div 
      className="fixed bottom-6 left-6 z-40 flex flex-col items-start pointer-events-auto select-none font-sans"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Expanded Floating Neon Social Icons */}
      <AnimatePresence>
        {isOpen && (
          <div className="flex flex-col-reverse items-center gap-3 mb-3.5 pl-1.5">
            {contactItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 25, scale: 0.4 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.4 }}
                  transition={{ 
                    type: 'spring', 
                    stiffness: 450, 
                    damping: 25, 
                    delay: index * 0.035 
                  }}
                  className="relative group flex items-center justify-center"
                >
                  {/* Tooltip to the right */}
                  <span className="absolute left-14 px-3 py-1 rounded-xl bg-black/90 backdrop-blur-md text-xs font-black text-white border border-[var(--accent-color)]/40 shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap tracking-wide">
                    {item.tooltip}
                  </span>

                  {/* Icon Button */}
                  <button
                    onClick={item.action}
                    aria-label={item.name}
                    className={`p-2 transition-all duration-200 active:scale-95 cursor-pointer ${item.iconColor}`}
                  >
                    <Icon className="w-7 h-7 transition-transform" />
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>

      {/* Main Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.10 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="Abrir menú de redes y contacto"
        className="relative group w-14 h-14 rounded-full bg-[#0c0e14]/90 text-[var(--accent-color)] border-2 border-[var(--accent-color)] shadow-[0_0_25px_var(--accent-glow)] hover:shadow-[0_0_35px_var(--accent-glow)] flex items-center justify-center cursor-pointer backdrop-blur-lg transition-all"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <svg className="w-6 h-6 text-[var(--accent-color)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </motion.div>
          ) : (
            <motion.div
              key="cocktail"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              className="flex items-center justify-center text-[var(--accent-color)]"
            >
              <MusicCocktailIcon className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulse indicator */}
        {!isOpen && (
          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[var(--accent-color)] border border-black flex items-center justify-center shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-black animate-ping" />
          </span>
        )}
      </motion.button>
    </div>
  );
}

function WhatsAppIcon({ className = "w-6 h-6", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
      <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
    </svg>
  );
}

function InstagramIcon({ className = "w-6 h-6", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function TikTokIcon({ className = "w-6 h-6", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.86.12V9.42a6.33 6.33 0 0 0-.86-.06 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.58a8.28 8.28 0 0 0 4.77 1.52v-3.41Z"/>
    </svg>
  );
}

function FacebookIcon({ className = "w-6 h-6", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

function PhoneCallIcon({ className = "w-6 h-6", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  );
}

function MusicCocktailIcon({ className = "w-6 h-6", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M8 22h8" />
      <path d="M12 15v7" />
      <path d="M4 4l8 11 8-11H4z" />
      <path d="M18 4l2-2" />
    </svg>
  );
}
