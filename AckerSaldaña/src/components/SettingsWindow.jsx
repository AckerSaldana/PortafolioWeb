import { useState } from 'react';
import { PaletteIcon, AboutIcon } from './os/AppIcons';

const WALLPAPER_PRESETS = [
  { name: 'Dark Blue Bloom', value: 'radial-gradient(ellipse at 30% 20%, #1a3a5c 0%, #0d1b2a 35%, #0a0e17 60%, #060608 100%)' },
  { name: 'Purple Aurora', value: 'radial-gradient(ellipse at 50% 0%, #2d1b69 0%, #1a0a3e 40%, #0a0612 70%, #060608 100%)' },
  { name: 'Teal Depths', value: 'radial-gradient(ellipse at 70% 80%, #0a3d3d 0%, #0d2b2b 35%, #0a1717 60%, #060608 100%)' },
  { name: 'Sunset Ember', value: 'radial-gradient(ellipse at 20% 80%, #5c2a1a 0%, #2a1510 35%, #170a07 60%, #060608 100%)' },
  { name: 'Emerald', value: 'radial-gradient(ellipse at 40% 30%, #1a5c3a 0%, #0d2a1b 35%, #0a170e 60%, #060608 100%)' },
  { name: 'Midnight Rose', value: 'radial-gradient(ellipse at 60% 40%, #4a1a4a 0%, #2a0d2a 35%, #170a17 60%, #060608 100%)' },
  { name: 'Ocean Blue', value: 'radial-gradient(ellipse at 50% 50%, #1a2a5c 0%, #0d1535 35%, #0a0e1f 60%, #060608 100%)' },
  { name: 'Solid Dark', value: 'linear-gradient(180deg, #1a1a2e 0%, #0a0a0f 100%)' },
];

const ACCENT_COLORS = [
  { name: 'Blue', value: '#60cdff' },
  { name: 'Purple', value: '#b4a0ff' },
  { name: 'Pink', value: '#ff6b9d' },
  { name: 'Teal', value: '#0affc2' },
  { name: 'Orange', value: '#ffb900' },
  { name: 'Red', value: '#ff4d4d' },
  { name: 'Green', value: '#47d147' },
  { name: 'White', value: '#e0e0e0' },
];

const MonitorIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="2" y="3" width="20" height="14" rx="2" stroke="#999" strokeWidth="1.5"/>
    <path d="M8 21h8M12 17v4" stroke="#999" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const InfoIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="#999" strokeWidth="1.5"/>
    <path d="M12 16v-4M12 8h.01" stroke="#999" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const Toggle = ({ checked, onChange }) => (
  <button
    onClick={() => onChange(!checked)}
    className="relative w-10 h-5 rounded-full transition-colors duration-200"
    style={{ background: checked ? '#60cdff' : 'rgba(255,255,255,0.15)' }}
  >
    <div
      className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200"
      style={{ transform: checked ? 'translateX(22px)' : 'translateX(2px)' }}
    />
  </button>
);

const tabs = [
  { id: 'personalization', label: 'Personalization', icon: PaletteIcon },
  { id: 'display', label: 'Display', icon: MonitorIcon },
  { id: 'about', label: 'About', icon: InfoIcon },
];

const SettingsWindow = ({ settings, onSettingsChange }) => {
  const [activeTab, setActiveTab] = useState('personalization');

  const wallpaper = settings?.wallpaper || WALLPAPER_PRESETS[0].value;
  const accentColor = settings?.accentColor || '#60cdff';
  const showWidgets = settings?.showWidgets !== false;

  const handleWallpaperChange = (value) => {
    onSettingsChange?.({ ...settings, wallpaper: value });
  };

  const handleAccentChange = (value) => {
    onSettingsChange?.({ ...settings, accentColor: value });
  };

  const handleWidgetsToggle = (value) => {
    onSettingsChange?.({ ...settings, showWidgets: value });
  };

  const renderPersonalization = () => (
    <div>
      <h2 className="text-lg font-semibold text-white mb-1">Background</h2>
      <p className="text-xs text-white/40 mb-4">Choose your desktop wallpaper</p>

      <div className="grid grid-cols-4 gap-2 mb-6">
        {WALLPAPER_PRESETS.map((preset) => (
          <button
            key={preset.name}
            onClick={() => handleWallpaperChange(preset.value)}
            className="group relative rounded-lg overflow-hidden transition-all duration-200"
            style={{
              border: wallpaper === preset.value ? '2px solid #60cdff' : '2px solid rgba(255,255,255,0.08)',
              height: '64px',
            }}
          >
            <div className="absolute inset-0" style={{ background: preset.value }} />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            {wallpaper === preset.value && (
              <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#60cdff] flex items-center justify-center">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5l2 2 4-4" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="text-[10px] text-white/30 mb-1">
        {WALLPAPER_PRESETS.find(p => p.value === wallpaper)?.name || 'Custom'}
      </div>
    </div>
  );

  const renderDisplay = () => (
    <div>
      <h2 className="text-lg font-semibold text-white mb-1">Display</h2>
      <p className="text-xs text-white/40 mb-6">Customize your desktop appearance</p>

      {/* Accent color */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-white/80 mb-3">Accent color</h3>
        <div className="flex gap-2 flex-wrap">
          {ACCENT_COLORS.map((color) => (
            <button
              key={color.name}
              onClick={() => handleAccentChange(color.value)}
              className="w-8 h-8 rounded-full transition-all duration-200"
              style={{
                background: color.value,
                boxShadow: accentColor === color.value
                  ? `0 0 0 2px #202020, 0 0 0 4px ${color.value}`
                  : 'none',
                transform: accentColor === color.value ? 'scale(1.1)' : 'scale(1)',
              }}
              title={color.name}
            />
          ))}
        </div>
      </div>

      {/* Widget toggles */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-white/80">Widgets</h3>
        <div className="flex items-center justify-between py-2 px-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)' }}>
          <div>
            <div className="text-sm text-white/80">Show desktop widgets</div>
            <div className="text-xs text-white/40">Clock and quick links on the desktop</div>
          </div>
          <Toggle checked={showWidgets} onChange={handleWidgetsToggle} />
        </div>
      </div>
    </div>
  );

  const renderAbout = () => {
    const browserInfo = (() => {
      const ua = navigator.userAgent;
      if (ua.includes('Chrome')) return 'Chrome';
      if (ua.includes('Firefox')) return 'Firefox';
      if (ua.includes('Safari')) return 'Safari';
      return 'Unknown';
    })();

    return (
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">About</h2>

        {/* Branding */}
        <div className="flex items-center gap-4 mb-6 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1a3a5c, #0d1b2a)' }}>
            <span className="text-xl font-light text-white" style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
              P<span className="text-[#60cdff] font-semibold">OS</span>
            </span>
          </div>
          <div>
            <div className="text-white font-semibold text-lg">PortfolioOS</div>
            <div className="text-white/40 text-xs">Version 1.0.0</div>
          </div>
        </div>

        {/* System info */}
        <div className="space-y-0 rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
          {[
            ['Device', navigator.platform || 'Unknown'],
            ['Browser', browserInfo],
            ['Resolution', `${window.screen.width} x ${window.screen.height}`],
            ['Viewport', `${window.innerWidth} x ${window.innerHeight}`],
            ['Cores', navigator.hardwareConcurrency || 'Unknown'],
            ['Memory', navigator.deviceMemory ? `${navigator.deviceMemory} GB` : 'Unknown'],
          ].map(([label, value], i) => (
            <div key={label} className={`flex items-center justify-between px-4 py-2.5 ${i > 0 ? 'border-t border-white/5' : ''}`}>
              <span className="text-xs text-white/50">{label}</span>
              <span className="text-xs text-white/80">{value}</span>
            </div>
          ))}
        </div>

        {/* Links */}
        <div className="mt-6 flex gap-3">
          <a
            href="https://github.com/AckerSaldana"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#60cdff] hover:underline"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/acker-salda%C3%B1a-452351318/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#60cdff] hover:underline"
          >
            LinkedIn
          </a>
          <a
            href="mailto:codeasdf@outlook.com"
            className="text-xs text-[#60cdff] hover:underline"
          >
            Email
          </a>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex" style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      {/* Sidebar */}
      <div className="w-[180px] flex-shrink-0 border-r border-white/6 p-3 pt-4 space-y-0.5">
        <div className="text-xs font-semibold text-white/30 uppercase tracking-wider px-3 mb-3">Settings</div>
        {tabs.map((tab) => {
          const IconComp = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors duration-150 ${
                activeTab === tab.id
                  ? 'bg-white/10 text-white'
                  : 'text-white/50 hover:bg-white/5 hover:text-white/70'
              }`}
            >
              <IconComp size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5" style={{ overscrollBehavior: 'contain' }}>
        {activeTab === 'personalization' && renderPersonalization()}
        {activeTab === 'display' && renderDisplay()}
        {activeTab === 'about' && renderAbout()}
      </div>
    </div>
  );
};

export default SettingsWindow;
