import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';

const Window = ({
  id,
  title,
  children,
  width = 600,
  height = 400,
  x = 100,
  y = 100,
  isActive,
  onFocus,
  onClose,
  onMinimize,
  zIndex
}) => {
  const windowRef = useRef(null);
  const headerRef = useRef(null);
  const [position, setPosition] = useState({ x, y });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Entrance animation
    gsap.fromTo(
      windowRef.current,
      { opacity: 0, scale: 0.95, y: position.y + 20 },
      { opacity: 1, scale: 1, y: position.y, duration: 0.3, ease: 'power2.out' }
    );
  }, []);

  const handleMouseDown = (e) => {
    if (e.target.closest('.window-controls')) return;

    setIsDragging(true);
    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
    onFocus();
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;

      const newX = e.clientX - dragStart.current.x;
      const newY = e.clientY - dragStart.current.y;

      // Boundary checks
      const maxX = window.innerWidth - width;
      const maxY = window.innerHeight - height - 48; // Account for taskbar

      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, width, height]);

  return (
    <div
      ref={windowRef}
      className={`fixed bg-black/75 backdrop-blur-xl border rounded-lg shadow-2xl flex flex-col font-['JetBrains_Mono'] ${
        isActive ? 'border-white/15' : 'border-white/8'
      }`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: zIndex,
        minWidth: '300px',
        minHeight: '200px',
      }}
      onMouseDown={onFocus}
    >
      {/* Window Header */}
      <div
        ref={headerRef}
        className="h-9 bg-white/5 border-b border-white/8 flex items-center justify-between px-3 cursor-move select-none"
        onMouseDown={handleMouseDown}
      >
        <div className="text-xs text-gray-400 font-semibold tracking-wide">
          {title}
        </div>
        <div className="window-controls flex gap-2">
          <button
            onClick={onMinimize}
            className="w-3 h-3 rounded-full bg-[#febc2e] hover:brightness-110 transition-all"
            title="Minimize"
          />
          <button
            className="w-3 h-3 rounded-full bg-[#28c840] hover:brightness-110 transition-all"
            title="Maximize"
          />
          <button
            onClick={onClose}
            className="w-3 h-3 rounded-full bg-[#ff5f57] hover:brightness-110 transition-all"
            title="Close"
          />
        </div>
      </div>

      {/* Window Body */}
      <div className="flex-1 overflow-hidden relative">
        {children}
      </div>
    </div>
  );
};

export default Window;
