import React from 'react';

// Crisp HD SVG Flag Icons for All Languages

export function ColombiaFlag({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size * 0.75} viewBox="0 0 36 27" fill="none" xmlns="http://www.w3.org/2000/svg" className={`rounded-sm shadow-sm border border-white/20 shrink-0 ${className}`}>
      <rect width="36" height="13.5" fill="#FCD116" />
      <rect y="13.5" width="36" height="6.75" fill="#003893" />
      <rect y="20.25" width="36" height="6.75" fill="#CE1126" />
    </svg>
  );
}

export function USAFlag({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size * 0.75} viewBox="0 0 36 27" fill="none" xmlns="http://www.w3.org/2000/svg" className={`rounded-sm shadow-sm border border-white/20 shrink-0 ${className}`}>
      <rect width="36" height="27" fill="#B22234" />
      <path d="M0 4.15H36M0 8.3H36M0 12.45H36M0 16.6H36M0 20.75H36M0 24.9H36" stroke="#FFFFFF" strokeWidth="2" />
      <rect width="16" height="14.5" fill="#3C3B6E" />
      <circle cx="4" cy="4" r="0.9" fill="#FFFFFF" />
      <circle cx="12" cy="4" r="0.9" fill="#FFFFFF" />
      <circle cx="8" cy="7.2" r="0.9" fill="#FFFFFF" />
      <circle cx="4" cy="10.5" r="0.9" fill="#FFFFFF" />
      <circle cx="12" cy="10.5" r="0.9" fill="#FFFFFF" />
    </svg>
  );
}

export function FranceFlag({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size * 0.75} viewBox="0 0 36 27" fill="none" xmlns="http://www.w3.org/2000/svg" className={`rounded-sm shadow-sm border border-white/20 shrink-0 ${className}`}>
      <rect width="12" height="27" fill="#002395" />
      <rect x="12" width="12" height="27" fill="#FFFFFF" />
      <rect x="24" width="12" height="27" fill="#ED2939" />
    </svg>
  );
}

export function ItalyFlag({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size * 0.75} viewBox="0 0 36 27" fill="none" xmlns="http://www.w3.org/2000/svg" className={`rounded-sm shadow-sm border border-white/20 shrink-0 ${className}`}>
      <rect width="12" height="27" fill="#009246" />
      <rect x="12" width="12" height="27" fill="#FFFFFF" />
      <rect x="24" width="12" height="27" fill="#CE2B37" />
    </svg>
  );
}

export function GermanyFlag({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size * 0.75} viewBox="0 0 36 27" fill="none" xmlns="http://www.w3.org/2000/svg" className={`rounded-sm shadow-sm border border-white/20 shrink-0 ${className}`}>
      <rect width="36" height="9" fill="#000000" />
      <rect y="9" width="36" height="9" fill="#DD0000" />
      <rect y="18" width="36" height="9" fill="#FFCC00" />
    </svg>
  );
}

export function PortugalFlag({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size * 0.75} viewBox="0 0 36 27" fill="none" xmlns="http://www.w3.org/2000/svg" className={`rounded-sm shadow-sm border border-white/20 shrink-0 ${className}`}>
      <rect width="14" height="27" fill="#046A38" />
      <rect x="14" width="22" height="27" fill="#DA291C" />
      <circle cx="14" cy="13.5" r="4.5" fill="#FFC72C" />
      <rect x="12" y="11" width="4" height="5" fill="#DA291C" rx="1" />
    </svg>
  );
}

export function RussiaFlag({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size * 0.75} viewBox="0 0 36 27" fill="none" xmlns="http://www.w3.org/2000/svg" className={`rounded-sm shadow-sm border border-white/20 shrink-0 ${className}`}>
      <rect width="36" height="9" fill="#FFFFFF" />
      <rect y="9" width="36" height="9" fill="#0039A6" />
      <rect y="18" width="36" height="9" fill="#D52B1E" />
    </svg>
  );
}

export function getFlagComponent(code, size = 18) {
  switch (code) {
    case 'es':
      return <ColombiaFlag size={size} />;
    case 'en':
      return <USAFlag size={size} />;
    case 'fr':
      return <FranceFlag size={size} />;
    case 'it':
      return <ItalyFlag size={size} />;
    case 'de':
      return <GermanyFlag size={size} />;
    case 'pt':
      return <PortugalFlag size={size} />;
    case 'ru':
      return <RussiaFlag size={size} />;
    default:
      return <ColombiaFlag size={size} />;
  }
}
