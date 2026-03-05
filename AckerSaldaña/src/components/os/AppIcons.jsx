/**
 * Windows 11-style SVG App Icons
 */

export const TerminalIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="2" y="3" width="20" height="18" rx="3" fill="#1e1e1e" stroke="#4d4d4d" strokeWidth="1"/>
    <path d="M7 9l3 3-3 3" stroke="#60cdff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13 15h4" stroke="#60cdff" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

export const ProjectsIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M3 7c0-1.1.9-2 2-2h4l2 2h8c1.1 0 2 .9 2 2v8c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V7z" fill="#FFB900" stroke="#E6A700" strokeWidth="0.5"/>
    <path d="M3 9h18v8c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V9z" fill="#FFC83D"/>
  </svg>
);

export const AboutIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="8" r="4" fill="#60cdff"/>
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill="#60cdff" opacity="0.6"/>
    <rect x="2" y="2" width="20" height="20" rx="4" stroke="#60cdff" strokeWidth="1" opacity="0.3"/>
  </svg>
);

export const SkillsIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="3" y="14" width="4" height="7" rx="1" fill="#60cdff"/>
    <rect x="10" y="9" width="4" height="12" rx="1" fill="#0078d4"/>
    <rect x="17" y="4" width="4" height="17" rx="1" fill="#005a9e"/>
    <path d="M5 13l5-4 5 2 4-5" stroke="#60cdff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
  </svg>
);

export const ContactIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="2" y="4" width="20" height="16" rx="3" fill="#0078d4"/>
    <path d="M2 7l10 6 10-6" stroke="#60cdff" strokeWidth="1.5" strokeLinejoin="round"/>
    <rect x="2" y="4" width="20" height="16" rx="3" stroke="#60cdff" strokeWidth="0.5" opacity="0.3"/>
  </svg>
);

export const GalleryIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="2" y="3" width="20" height="18" rx="3" fill="#2d2d2d" stroke="#4d4d4d" strokeWidth="0.5"/>
    <circle cx="8" cy="9" r="2.5" fill="#FFB900"/>
    <path d="M2 16l5-5 3 3 4-4 8 7v1c0 1.66-1.34 3-3 3H5c-1.66 0-3-1.34-3-3v-2z" fill="#28c840" opacity="0.7"/>
  </svg>
);

export const SettingsIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" stroke="#999" strokeWidth="1.5"/>
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" stroke="#999" strokeWidth="1.5"/>
  </svg>
);

export const SearchIcon = ({ size = 20, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
    <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M13 13l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const Win11Logo = ({ size = 20, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
    <rect x="1" y="1" width="8" height="8" rx="1.5" fill="#60cdff"/>
    <rect x="11" y="1" width="8" height="8" rx="1.5" fill="#60cdff" opacity="0.8"/>
    <rect x="1" y="11" width="8" height="8" rx="1.5" fill="#60cdff" opacity="0.8"/>
    <rect x="11" y="11" width="8" height="8" rx="1.5" fill="#60cdff" opacity="0.6"/>
  </svg>
);

export const WifiIcon = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
    <path d="M1 6c3.6-3.5 10.4-3.5 14 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.4"/>
    <path d="M3.5 8.5c2.5-2.5 6.5-2.5 9 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
    <path d="M6 11c1.1-1.1 2.9-1.1 4 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <circle cx="8" cy="13" r="1" fill="currentColor"/>
  </svg>
);

export const SpeakerIcon = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
    <path d="M2 6h2l4-3v10L4 10H2a1 1 0 01-1-1V7a1 1 0 011-1z" fill="currentColor" opacity="0.8"/>
    <path d="M11 5c1.3 1.3 1.3 4.7 0 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M13 3c2.2 2.5 2.2 7.5 0 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
  </svg>
);

export const BellIcon = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
    <path d="M8 1a4 4 0 00-4 4v3l-1.5 2h11L12 8V5a4 4 0 00-4-4z" stroke="currentColor" strokeWidth="1.2"/>
    <path d="M6 13a2 2 0 004 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

export const PowerIcon = ({ size = 18, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" fill="none" className={className}>
    <path d="M9 1v7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M4.5 4.2A7 7 0 109 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const RefreshIcon = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
    <path d="M14 8A6 6 0 114 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M4 1v3h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const PaletteIcon = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
    <path d="M8 1a7 7 0 00-1 13.9c.6.1 1-.4 1-1v-.5c0-.7.6-1.2 1.2-1 .4.1.8.1 1.3 0A3 3 0 0012 4.5 7 7 0 008 1z" stroke="currentColor" strokeWidth="1.2"/>
    <circle cx="5" cy="6" r="1" fill="#ff5f57"/>
    <circle cx="8" cy="4.5" r="1" fill="#febc2e"/>
    <circle cx="11" cy="6" r="1" fill="#28c840"/>
    <circle cx="5" cy="9.5" r="1" fill="#60cdff"/>
  </svg>
);
