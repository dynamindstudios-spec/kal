import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { RESTAURANT_DATA } from '../data/menuData';
import { adminStore } from '../services/adminStore';

const SCENE_VIDEOS = {
  'drinks': '/menu-assets/header licor.mp4',
  'bar-show': '/menu-assets/header atrevido (1).mp4',
  'party': '/menu-assets/header atrevido (1).mp4',
  'cobra': '/menu-assets/header natura.mp4',
  'natura': '/menu-assets/header natura.mp4',
  'serpientes': '/menu-assets/fondo serpientes.mp4',
  'disco': '/menu-assets/fondo serpientes.mp4'
};

const SCENE_BADGES = {
  'drinks': '🍾 MODO LICORES VIP 🔞',
  'bar-show': '🪩 MODO FIESTA & DJ SHOW LIVE 🔞',
  'party': '🪩 MODO FIESTA & DJ SHOW LIVE 🔞',
  'cobra': '🌿 MODO NATURA VIP 🔞',
  'natura': '🌿 MODO NATURA VIP 🔞',
  'serpientes': '🐍 MODO SERPIENTES VIP 🔞',
  'disco': '🐍 MODO SERPIENTES VIP 🔞'
};

export default function HeroSection({ currentLang, backgroundScene = 'drinks' }) {
  const videoRef = useRef(null);
  const [heroVideos, setHeroVideos] = useState(adminStore.getHeroVideos());

  useEffect(() => {
    const unsubscribe = adminStore.subscribe(() => {
      setHeroVideos(adminStore.getHeroVideos());
    });
    return unsubscribe;
  }, []);

  // Find if a custom hero video matches current scene
  const matchedCustomVideo = heroVideos.find((v) => v.scene === backgroundScene);
  const activeVideo = matchedCustomVideo?.url || SCENE_VIDEOS[backgroundScene] || SCENE_VIDEOS.drinks;
  const activeBadge = matchedCustomVideo?.badge || SCENE_BADGES[backgroundScene] || SCENE_BADGES.drinks;

  // Auto-play and re-load video smoothly when scene changes or video changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  }, [backgroundScene, activeVideo]);

  // Shrink Hero height on scroll
  const { scrollY } = useScroll();
  const heroHeight = useTransform(scrollY, [0, 400], ['540px', '220px']);
  const logoScale = useTransform(scrollY, [0, 400], [1, 0.7]);
  const textOpacity = useTransform(scrollY, [0, 250], [1, 0]);

  const isSerpientes = backgroundScene === 'serpientes' || backgroundScene === 'disco';

  return (
    <motion.div
      style={{ height: heroHeight }}
      className={`relative w-full overflow-hidden transition-all duration-300 shadow-2xl z-10 ${
        isSerpientes ? 'bg-transparent' : 'bg-[var(--bg-color)]'
      }`}
    >
      {/* Dynamic Background Video Player depending on Theme Scene */}
      {!isSerpientes && (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          key={activeVideo}
          className="absolute inset-0 w-full h-full object-cover scale-105 opacity-85 transition-opacity duration-700"
        >
          <source src={activeVideo} type="video/mp4" />
        </video>
      )}

      {/* Scrim Overlay Gradient */}
      <div className={`absolute inset-0 ${
        isSerpientes ? 'bg-gradient-to-t from-black/85 via-black/30 to-black/50' : 'bg-gradient-to-t from-[var(--bg-color)] via-black/50 to-black/30'
      }`} />

      {/* Hero Content */}
      <div className="relative z-10 w-full h-full max-w-7xl mx-auto px-4 md:px-8 flex flex-col items-center justify-center text-center text-white">
        
        {/* Dynamic Badge per Mode */}
        <motion.div
          key={activeBadge}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-2 inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-500/20 border border-pink-500/60 text-pink-300 text-[11px] font-black tracking-widest uppercase shadow-[0_0_15px_rgba(236,72,153,0.5)] animate-pulse"
        >
          <span>{activeBadge}</span>
        </motion.div>

        {/* KAL DISCOBAR Logo */}
        <motion.div
          style={{ scale: logoScale }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-2"
        >
          <img
            src={RESTAURANT_DATA.logo}
            alt="KAL DISCOBAR Logo"
            className="w-36 h-36 md:w-48 md:h-48 object-contain filter drop-shadow-[0_0_35px_var(--accent-glow)]"
          />
        </motion.div>

        {/* Title & Tagline */}
        <motion.div style={{ opacity: textOpacity }} className="max-w-2xl space-y-2">
          <h1 className="text-3xl md:text-5xl font-black serif-title tracking-tight neon-title-gold drop-shadow-2xl">
            {RESTAURANT_DATA.name}
          </h1>

          <p className="text-xs md:text-sm font-black text-[var(--accent-color)] uppercase tracking-widest drop-shadow filter drop-shadow-[0_0_10px_var(--accent-glow)]">
            {RESTAURANT_DATA.slogan[currentLang] || RESTAURANT_DATA.slogan.es}
          </p>

          <p className="text-xs md:text-sm text-gray-200 leading-relaxed drop-shadow max-w-xl mx-auto font-medium">
            {RESTAURANT_DATA.description[currentLang] || RESTAURANT_DATA.description.es}
          </p>

          <div className="inline-block mt-2 px-3.5 py-1 rounded-full bg-black/80 border border-white/20 text-[11px] text-amber-200 font-bold tracking-wide backdrop-blur-md">
            📍 {RESTAURANT_DATA.contact.address} — {RESTAURANT_DATA.contact.city}
          </div>
        </motion.div>

      </div>

      {/* Smooth Professional Bottom Neon Blur & Gradient Boundary Line */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent via-[var(--bg-color)]/70 to-[var(--bg-color)] pointer-events-none z-20 backdrop-blur-[1px]" />
      <div className="absolute bottom-0 left-0 right-0 z-30 h-1.5 bg-gradient-to-r from-transparent via-[var(--accent-color)] to-transparent shadow-[0_0_30px_var(--accent-glow)] filter drop-shadow-[0_0_15px_var(--accent-color)]" />
    </motion.div>
  );
}
