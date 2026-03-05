import { useState, useEffect } from 'react';
import useBreakpoint from '../../hooks/useBreakpoint';

const ClockWidget = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-xl p-4"
      style={{
        background: 'rgba(44, 44, 44, 0.60)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        width: '180px',
      }}>
      <div className="text-3xl font-light text-white tracking-tight"
        style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
      <div className="text-[11px] text-white/40 mt-1">
        {time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
      </div>
    </div>
  );
};

const QuickLinksWidget = () => {
  const links = [
    { name: 'GitHub', url: 'https://github.com/AckerSaldana', color: '#f0f0f0' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/acker-salda%C3%B1a-452351318/', color: '#0a66c2' },
    { name: 'Email', url: 'mailto:codeasdf@outlook.com', color: '#60cdff' },
  ];

  return (
    <div className="rounded-xl p-4"
      style={{
        background: 'rgba(44, 44, 44, 0.60)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        width: '180px',
      }}>
      <div className="text-[11px] text-white/40 mb-2 font-medium">Quick Links</div>
      <div className="space-y-1.5">
        {links.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[12px] text-white/60 hover:text-white transition-colors py-1 px-1 rounded hover:bg-white/5"
          >
            <div className="w-2 h-2 rounded-full" style={{ background: link.color }} />
            {link.name}
          </a>
        ))}
      </div>
    </div>
  );
};

const DesktopWidgets = () => {
  const { isMobile } = useBreakpoint();

  if (isMobile) return null;

  return (
    <div className="absolute top-4 right-4 flex flex-col gap-3 z-[5]">
      <ClockWidget />
      <QuickLinksWidget />
    </div>
  );
};

export default DesktopWidgets;
