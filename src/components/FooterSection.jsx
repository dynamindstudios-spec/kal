import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, Instagram, ExternalLink } from 'lucide-react';
import { RESTAURANT_DATA, UI_TEXT } from '../data/menuData';

export default function FooterSection({ currentLang }) {
  const t = UI_TEXT[currentLang] || UI_TEXT.es;

  return (
    <footer className="w-full border-t border-[var(--surface-border)] mt-20 pt-12 pb-8 px-4 md:px-8 glass-panel bg-[var(--surface-bg)] relative z-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        
        {/* LEFT COLUMN: Brand Logo, Tagline & Location Info */}
        <div className="space-y-6">
          
          {/* Logo & Brand Header */}
          <div className="flex items-center gap-4">
            <motion.img 
              whileHover={{ rotate: 8, scale: 1.05 }}
              src={RESTAURANT_DATA.logo} 
              alt="KAL DISCOBAR Logo" 
              className="w-16 h-16 object-contain drop-shadow-xl bg-black/40 p-2 rounded-2xl border border-[var(--surface-border)]"
            />
            <div>
              <h3 className="text-2xl md:text-3xl font-black text-[var(--text-primary)] serif-title leading-none gold-gradient-text">
                {RESTAURANT_DATA.name}
              </h3>
              <p className="text-xs text-[var(--accent-color)] font-semibold uppercase tracking-wider mt-1">
                {RESTAURANT_DATA.slogan[currentLang] || RESTAURANT_DATA.slogan.es}
              </p>
            </div>
          </div>

          <p className="text-xs md:text-sm text-[var(--text-secondary)] leading-relaxed max-w-lg">
            {RESTAURANT_DATA.description[currentLang] || RESTAURANT_DATA.description.es}
          </p>

          {/* Contact & Location Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-[var(--pill-bg)] border border-[var(--surface-border)]">
              <MapPin size={18} className="text-[var(--accent-color)] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[var(--text-primary)] block">Ubicación KAL</span>
                <span className="text-[var(--text-muted)]">{RESTAURANT_DATA.contact.address}, {RESTAURANT_DATA.contact.city}</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-[var(--pill-bg)] border border-[var(--surface-border)]">
              <Clock size={18} className="text-[var(--accent-color)] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[var(--text-primary)] block">Horarios de Atenciòn</span>
                <span className="text-[var(--text-muted)]">Mié-Dom: 5:00 PM – 2:30 AM</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-[var(--pill-bg)] border border-[var(--surface-border)]">
              <Phone size={18} className="text-[var(--accent-color)] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[var(--text-primary)] block">Reservas WhatsApp</span>
                <span className="text-[var(--text-muted)]">+{RESTAURANT_DATA.contact.phone}</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-[var(--pill-bg)] border border-[var(--surface-border)]">
              <Instagram size={18} className="text-[var(--accent-color)] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[var(--text-primary)] block">Instagram Oficial</span>
                <span className="text-[var(--text-muted)]">{RESTAURANT_DATA.contact.instagram}</span>
              </div>
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: Interactive Embedded Location Map */}
        <div className="relative w-full h-[280px] md:h-[320px] rounded-3xl overflow-hidden shadow-2xl border-2 border-[var(--surface-border)] group">
          
          {/* Embedded Google Maps Frame for Armenia, Quindío */}
          <iframe
            title="KAL DISCOBAR Location Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15904.59620786938!2d-75.6706915!3d4.5385627!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e38f51a44c7b805%3A0x6bfa58d4a9f3b5e4!2sBarrio%20Granada%2C%20Armenia%2C%20Quind%C3%ADo!5e0!3m2!1ses!2sco!4v1700000000000!5m2!1ses!2sco"
            width="100%"
            height="100%"
            style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(1.2)' }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full object-cover"
          />

          {/* Map Overlay Badge */}
          <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between p-3 rounded-2xl glass-panel bg-black/80 backdrop-blur-md border border-white/20 text-white shadow-xl">
            <div className="flex items-center gap-2">
              <MapPin size={18} className="text-amber-400 animate-bounce" />
              <div>
                <span className="text-xs font-bold block">KAL DISCOBAR — Barrio Granada</span>
                <span className="text-[10px] text-amber-200/90">Armenia, Quindío</span>
              </div>
            </div>

            <a
              href={`https://wa.me/57${RESTAURANT_DATA.contact.phone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-emerald-500 text-black hover:bg-emerald-400 transition-all font-bold text-xs flex items-center gap-1 shadow"
            >
              <span>WhatsApp</span>
              <ExternalLink size={14} />
            </a>
          </div>

        </div>

      </div>

      {/* Footer Bottom Copyright */}
      <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-[var(--surface-border)] text-center text-xs text-[var(--text-muted)] flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} {RESTAURANT_DATA.name}. Todos los derechos reservados.</p>
        <p className="font-semibold text-[var(--accent-color)]">Vida Nocturna Exótica & Experiencia VIP.</p>
      </div>
    </footer>
  );
}
