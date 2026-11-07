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
      id: 'instagram',
      name: 'Instagram Oficial',
      enabled: socialLinks.instagramEnabled !== false,
      icon: InstagramIcon,
      action: () => window.open(socialLinks.instagramUrl || 'https://www.instagram.com/kal_discobar?obrf=MjVtZWE5eHdmdTdt', '_blank'),
      iconColor: 'text-[#FF2E93] hover:drop-shadow-[0_0_18px_rgba(255,46,147,1)] hover:scale-125',
      tooltip: '@kal_discobar'
    },
    {
      id: 'maps',
      name: 'Ubicación Google Maps',
      enabled: socialLinks.mapsEnabled !== false,
      icon: GoogleMapsIcon,
      action: () => window.open(socialLinks.mapsUrl || 'https://maps.app.goo.gl/uUVsMMk1dk3iqVKL8', '_blank'),
      iconColor: 'text-[#EA4335] hover:drop-shadow-[0_0_18px_rgba(234,67,53,1)] hover:scale-125',
      tooltip: 'Armenia, Quindío (Google Maps)'
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

function InstagramIcon({ className = "w-6 h-6", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function GoogleMapsIcon({ className = "w-6 h-6", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
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
