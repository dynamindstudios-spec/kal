import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Instagram, ExternalLink } from 'lucide-react';
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

          {/* Contact & Location Details - ONLY VERIFIED CHANNELS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
            
            <a
              href={RESTAURANT_DATA.contact.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 p-3.5 rounded-2xl bg-[var(--pill-bg)] border border-[var(--surface-border)] hover:border-[var(--accent-color)] hover:bg-[var(--surface-bg)] transition-all group cursor-pointer"
              title="Abrir ubicación en Google Maps"
            >
              <MapPin size={18} className="text-[var(--accent-color)] group-hover:scale-110 shrink-0 mt-0.5 transition-transform" />
              <div>
                <span className="font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-color)] flex items-center gap-1 transition-colors">
                  Ubicación KAL <ExternalLink size={12} className="opacity-70" />
                </span>
                <span className="text-[var(--text-muted)] text-[11px] block mt-0.5">{RESTAURANT_DATA.contact.address}, {RESTAURANT_DATA.contact.city}</span>
              </div>
            </a>

            <a
              href={RESTAURANT_DATA.contact.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 p-3.5 rounded-2xl bg-[var(--pill-bg)] border border-[var(--surface-border)] hover:border-[#FF2E93] hover:bg-[var(--surface-bg)] transition-all group cursor-pointer"
              title="Visitar Instagram oficial de KAL DISCOBAR"
            >
              <Instagram size={18} className="text-[#FF2E93] group-hover:scale-110 shrink-0 mt-0.5 transition-transform" />
              <div>
                <span className="font-bold text-[var(--text-primary)] group-hover:text-[#FF2E93] flex items-center gap-1 transition-colors">
                  Instagram Oficial <ExternalLink size={12} className="opacity-70" />
                </span>
                <span className="text-[var(--text-muted)] text-[11px] block mt-0.5">{RESTAURANT_DATA.contact.instagram}</span>
              </div>
            </a>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[var(--pill-bg)] border border-[var(--surface-border)] sm:col-span-2">
              <Clock size={18} className="text-[var(--accent-color)] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[var(--text-primary)] block">Horarios de Atención VIP</span>
                <span className="text-[var(--text-muted)] text-[11px] block mt-0.5">Miércoles a Domingo: 5:00 PM – 2:30 AM</span>
              </div>
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: Interactive Embedded Location Map */}
        <div className="relative w-full h-[280px] md:h-[320px] rounded-3xl overflow-hidden shadow-2xl border-2 border-[var(--surface-border)] group">
          
          {/* Embedded Google Maps Frame for Armenia, Quindío */}
          <iframe
            title="KAL DISCOBAR Location Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3977.1704265553646!2d-75.6757651!3d4.5422592!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e38f51a44c7b805%3A0x6bfa58d4a9f3b5e4!2sArmenia%2C%20Quind%C3%ADo!5e0!3m2!1ses!2sco!4v1700000000000!5m2!1ses!2sco"
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
              href={RESTAURANT_DATA.contact.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 px-3 rounded-xl bg-amber-500 text-black hover:bg-amber-400 transition-all font-black text-xs flex items-center gap-1.5 shadow shadow-amber-500/30"
              title="Abrir ubicación en Google Maps"
            >
              <span>Ver en Maps</span>
              <ExternalLink size={13} />
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
