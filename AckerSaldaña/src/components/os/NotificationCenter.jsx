import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import useBreakpoint from '../../hooks/useBreakpoint';

const NotificationCenter = ({ isOpen, onClose, time }) => {
  const { isMobile } = useBreakpoint();
  const panelRef = useRef(null);

  useEffect(() => {
    if (!panelRef.current) return;
    gsap.to(panelRef.current, {
      x: isOpen ? 0 : (isMobile ? 0 : 380),
      y: isMobile ? (isOpen ? 0 : '100%') : 0,
      duration: 0.3,
      ease: 'power3.out',
    });
  }, [isOpen, isMobile]);

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) onClose();
    };
    setTimeout(() => document.addEventListener('mousedown', handler), 100);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, onClose]);

  const today = time || new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
  const monthName = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div
      ref={panelRef}
      className={`fixed z-[8999] ${
        isMobile
          ? 'bottom-14 left-0 right-0 h-[60vh] rounded-t-xl'
          : 'top-0 right-0 bottom-12 w-[380px]'
      }`}
      style={{
        transform: isMobile ? 'translateY(100%)' : 'translateX(380px)',
        background: 'rgba(44, 44, 44, 0.92)',
        backdropFilter: 'blur(40px) saturate(150%)',
        WebkitBackdropFilter: 'blur(40px) saturate(150%)',
        borderLeft: isMobile ? 'none' : '1px solid rgba(255, 255, 255, 0.06)',
        borderTop: isMobile ? '1px solid rgba(255, 255, 255, 0.06)' : 'none',
        boxShadow: '-8px 0 32px rgba(0, 0, 0, 0.20)',
      }}
    >
      {/* Mini Calendar */}
      <div className="p-4">
        <div className="text-[13px] font-semibold text-white mb-3">{monthName}</div>
        <div className="grid grid-cols-7 gap-0.5 text-center">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
            <div key={day} className="text-[10px] text-white/30 py-1">{day}</div>
          ))}
          {Array.from({ length: firstDay }, (_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const isToday = day === today.getDate();
            return (
              <div
                key={day}
                className={`text-[11px] py-1.5 rounded-full ${
                  isToday
                    ? 'bg-[#60cdff] text-black font-bold'
                    : 'text-white/60 hover:bg-white/8'
                }`}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-t border-white/6 mx-4" />

      {/* Notifications */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <span className="text-[13px] font-semibold text-white">Notifications</span>
          <button className="text-[11px] text-white/40 hover:text-white/60 transition-colors">
            Clear all
          </button>
        </div>

        <div className="space-y-2">
          <div className="p-3 rounded-lg transition-colors hover:bg-white/5"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.04)' }}>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-md flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                style={{ background: 'rgba(96, 205, 255, 0.15)', color: '#60cdff' }}>
                i
              </div>
              <div className="min-w-0">
                <div className="text-[12px] text-white/80 font-medium">Welcome</div>
                <div className="text-[11px] text-white/40 mt-0.5">Portfolio OS loaded successfully</div>
                <div className="text-[10px] text-white/25 mt-1">Just now</div>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg transition-colors hover:bg-white/5"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.04)' }}>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-md flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                style={{ background: 'rgba(40, 200, 64, 0.15)', color: '#28c840' }}>
                !
              </div>
              <div className="min-w-0">
                <div className="text-[12px] text-white/80 font-medium">Tip</div>
                <div className="text-[11px] text-white/40 mt-0.5">Try Alt+Tab to switch between windows</div>
                <div className="text-[10px] text-white/25 mt-1">1 min ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;
