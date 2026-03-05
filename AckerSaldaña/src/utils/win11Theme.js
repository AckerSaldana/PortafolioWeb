/**
 * Windows 11 Dark Theme Design Tokens
 */

export const colors = {
  // Surface colors (Mica-style layering)
  background: '#202020',
  surfaceBase: '#2d2d2d',
  surfaceCard: '#2d2d2d',
  surfaceOverlay: '#383838',
  surfaceFlyout: '#2c2c2c',

  // Acrylic materials
  acrylicBase: 'rgba(32, 32, 32, 0.80)',
  acrylicThin: 'rgba(32, 32, 32, 0.65)',
  acrylicThick: 'rgba(44, 44, 44, 0.90)',

  // Accent
  accent: '#60cdff',
  accentDark: '#0078d4',
  accentSubtle: 'rgba(96, 205, 255, 0.10)',

  // Text
  textPrimary: '#ffffff',
  textSecondary: 'rgba(255, 255, 255, 0.786)',
  textTertiary: 'rgba(255, 255, 255, 0.545)',
  textDisabled: 'rgba(255, 255, 255, 0.364)',

  // Borders
  borderSubtle: 'rgba(255, 255, 255, 0.0837)',
  borderDefault: 'rgba(255, 255, 255, 0.0698)',
  borderControl: 'rgba(255, 255, 255, 0.0578)',

  // System
  systemClose: '#c42b1c',
  systemCloseHover: '#c42b1c',
};

export const radius = {
  small: '4px',
  medium: '8px',
  large: '12px',
  window: '8px',
  overlay: '12px',
};

export const shadows = {
  flyout: '0 8px 32px rgba(0, 0, 0, 0.36)',
  dialog: '0 24px 54px rgba(0, 0, 0, 0.22)',
  tooltip: '0 4px 8px rgba(0, 0, 0, 0.14)',
  window: '0 8px 32px rgba(0, 0, 0, 0.28)',
  windowActive: '0 8px 32px rgba(0, 0, 0, 0.40)',
};

export const motion = {
  fast: 167,
  normal: 250,
  slow: 333,
  easing: 'cubic-bezier(0.1, 0.9, 0.2, 1)',
  easingAccelerate: 'cubic-bezier(0.9, 0.1, 1, 0.2)',
};
