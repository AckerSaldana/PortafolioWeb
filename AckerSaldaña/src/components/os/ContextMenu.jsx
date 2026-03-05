import { useRef, useEffect } from 'react';

const ContextMenu = ({ x, y, items, onClose }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) onClose();
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('contextmenu', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('contextmenu', handler);
    };
  }, [onClose]);

  // Adjust position to stay in viewport
  useEffect(() => {
    if (!menuRef.current) return;
    const rect = menuRef.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    if (rect.right > vw) menuRef.current.style.left = `${vw - rect.width - 8}px`;
    if (rect.bottom > vh) menuRef.current.style.top = `${vh - rect.height - 8}px`;
  }, [x, y]);

  return (
    <div
      ref={menuRef}
      className="fixed z-[9500]"
      style={{
        left: x,
        top: y,
        background: 'rgba(44, 44, 44, 0.94)',
        backdropFilter: 'blur(30px) saturate(125%)',
        WebkitBackdropFilter: 'blur(30px) saturate(125%)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '8px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.36)',
        minWidth: '200px',
        padding: '4px',
      }}
    >
      {items.map((item, i) => (
        item.separator ? (
          <div key={i} className="border-t border-white/6 my-1 mx-2" />
        ) : (
          <button
            key={i}
            onClick={() => { item.onClick(); onClose(); }}
            className="w-full flex items-center gap-3 px-3 py-1.5 rounded-md text-[12px] text-white/70 hover:bg-white/8 hover:text-white transition-colors text-left"
            style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}
          >
            {item.icon && (
              <div className="w-4 flex items-center justify-center text-white/50">
                {typeof item.icon === 'function' ? <item.icon size={14} /> : item.icon}
              </div>
            )}
            <span className="flex-1">{item.label}</span>
            {item.shortcut && (
              <span className="text-[10px] text-white/25 ml-4">{item.shortcut}</span>
            )}
          </button>
        )
      ))}
    </div>
  );
};

export default ContextMenu;
