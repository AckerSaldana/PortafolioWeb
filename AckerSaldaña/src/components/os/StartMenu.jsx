import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import useBreakpoint from '../../hooks/useBreakpoint';
import { SearchIcon, PowerIcon } from './AppIcons';

const StartMenu = ({ apps, onOpenApp, onShutdown, onClose }) => {
  const { isMobile } = useBreakpoint();
  const [searchQuery, setSearchQuery] = useState('');
  const menuRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    if (menuRef.current) {
      gsap.fromTo(menuRef.current,
        { opacity: 0, scale: 0.96, y: 10 },
        { opacity: 1, scale: 1, y: 0, duration: 0.2, ease: 'power3.out' }
      );
    }
    setTimeout(() => searchRef.current?.focus(), 250);
  }, []);

  // Close on click outside
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target) && !e.target.closest('.start-btn')) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const filteredApps = searchQuery
    ? Object.entries(apps).filter(([, app]) =>
        app.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : Object.entries(apps);

  const recentApps = Object.entries(apps).slice(0, 4);

  return (
    <div
      ref={menuRef}
      className={`start-menu absolute z-[9100] ${
        isMobile
          ? 'bottom-16 left-2 right-2'
          : 'bottom-14 left-1/2 -translate-x-1/2'
      }`}
      style={{
        width: isMobile ? 'auto' : '580px',
        background: 'rgba(44, 44, 44, 0.94)',
        backdropFilter: 'blur(40px) saturate(150%)',
        WebkitBackdropFilter: 'blur(40px) saturate(150%)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        boxShadow: '0 24px 54px rgba(0, 0, 0, 0.35)',
        overflow: 'hidden',
      }}
    >
      {/* Search bar */}
      <div className="p-5 pb-3">
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30">
            <SearchIcon size={16} />
          </div>
          <input
            ref={searchRef}
            placeholder="Type to search"
            className="w-full rounded-full px-9 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none transition-colors"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') onClose();
            }}
          />
        </div>
      </div>

      {/* Pinned section */}
      <div className="px-5 pb-3">
        <div className="flex justify-between items-center mb-3">
          <span className="text-[13px] font-semibold text-white">Pinned</span>
          <button className="text-[11px] text-white/50 hover:text-white/80 px-2 py-1 rounded-md hover:bg-white/8 transition-colors"
            style={{ background: 'rgba(255,255,255,0.04)' }}>
            All apps &gt;
          </button>
        </div>
        <div className={`grid gap-0.5 ${isMobile ? 'grid-cols-4' : 'grid-cols-6'}`}>
          {filteredApps.map(([appId, app]) => {
            const IconComponent = app.icon;
            return (
              <button
                key={appId}
                onClick={() => { onOpenApp(appId); onClose(); }}
                className="flex flex-col items-center gap-1.5 p-3 rounded-md hover:bg-white/8 transition-colors"
              >
                <div className="w-8 h-8 flex items-center justify-center">
                  <IconComponent size={28} />
                </div>
                <span className="text-[11px] text-white/70 truncate max-w-full">{app.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Separator */}
      <div className="border-t border-white/6 mx-4" />

      {/* Recommended section */}
      <div className="px-5 py-3">
        <div className="flex justify-between items-center mb-3">
          <span className="text-[13px] font-semibold text-white">Recommended</span>
          <button className="text-[11px] text-white/50 hover:text-white/80 px-2 py-1 rounded-md hover:bg-white/8 transition-colors"
            style={{ background: 'rgba(255,255,255,0.04)' }}>
            More &gt;
          </button>
        </div>
        <div className={`grid gap-1 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
          {recentApps.map(([appId, app]) => {
            const IconComponent = app.icon;
            return (
              <button
                key={appId}
                onClick={() => { onOpenApp(appId); onClose(); }}
                className="flex items-center gap-3 p-2 rounded-md hover:bg-white/8 transition-colors text-left"
              >
                <div className="w-8 h-8 flex items-center justify-center rounded-md"
                  style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <IconComponent size={20} />
                </div>
                <div className="min-w-0">
                  <div className="text-[12px] text-white/80 truncate">{app.title}</div>
                  <div className="text-[10px] text-white/30">Recently opened</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/6 px-5 py-2.5 flex justify-between items-center"
        style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: 'rgba(96, 205, 255, 0.15)', color: '#60cdff' }}>
            AS
          </div>
          <span className="text-[13px] text-white/80">Acker Saldaña</span>
        </div>
        <button
          onClick={() => { onShutdown(); onClose(); }}
          className="p-2 rounded-md hover:bg-white/8 transition-colors text-white/50 hover:text-white/80"
          title="Shutdown"
        >
          <PowerIcon size={16} />
        </button>
      </div>
    </div>
  );
};

export default StartMenu;
