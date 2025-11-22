import { useRef, useEffect, useState, useMemo } from 'react';
import gsap from 'gsap';
import useBreakpoint from '../hooks/useBreakpoint';

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
  const { isMobile, isTablet, windowSize } = useBreakpoint();

  // Calculate responsive dimensions (memoized for performance)
  const dimensions = useMemo(() => {
    if (isMobile) {
      // Near full-screen on mobile
      return {
        width: Math.min(windowSize.width - 20, width),
        height: Math.min(windowSize.height - 100, height),
      };
    } else if (isTablet) {
      // Percentage-based on tablet
      return {
        width: Math.min(windowSize.width * 0.85, width),
        height: Math.min(windowSize.height * 0.75, height),
      };
    }
    // Desktop: use provided dimensions
    return { width, height };
  }, [isMobile, isTablet, windowSize.width, windowSize.height, width, height]);

  const [position, setPosition] = useState({ x, y });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  // Adjust position when window size changes (responsive)
  useEffect(() => {
    if (isMobile) {
      // Center on mobile
      setPosition({
        x: (windowSize.width - dimensions.width) / 2,
        y: Math.max(0, (windowSize.height - dimensions.height - 48) / 2),
      });
    } else if (isTablet) {
      // Adjust position to fit in viewport
      setPosition(prev => ({
        x: Math.max(0, Math.min(prev.x, windowSize.width - dimensions.width)),
        y: Math.max(0, Math.min(prev.y, windowSize.height - dimensions.height - 48)),
      }));
    }
  }, [isMobile, isTablet, windowSize.width, windowSize.height]);

  useEffect(() => {
    // Entrance animation
    gsap.fromTo(
      windowRef.current,
      { opacity: 0, scale: 0.95, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: 'power2.out' }
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

  const handleTouchStart = (e) => {
    if (e.target.closest('.window-controls')) return;

    setIsDragging(true);
    const touch = e.touches[0];
    dragStart.current = {
      x: touch.clientX - position.x,
      y: touch.clientY - position.y
    };
    onFocus();
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;

      const newX = e.clientX - dragStart.current.x;
      const newY = e.clientY - dragStart.current.y;

      // Boundary checks
      const maxX = windowSize.width - dimensions.width;
      const maxY = windowSize.height - dimensions.height - 48; // Account for taskbar
      const minY = 0; // Allow windows to reach the top of the viewport

      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(minY, Math.min(newY, maxY))
      });
    };

    const handleTouchMove = (e) => {
      if (!isDragging) return;

      const touch = e.touches[0];
      const newX = touch.clientX - dragStart.current.x;
      const newY = touch.clientY - dragStart.current.y;

      // Boundary checks
      const maxX = windowSize.width - dimensions.width;
      const maxY = windowSize.height - dimensions.height - 48;
      const minY = 0; // Allow windows to reach the top of the viewport

      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(minY, Math.min(newY, maxY))
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, dimensions.width, dimensions.height, windowSize]);

  return (
    <div
      ref={windowRef}
      className={`fixed bg-black/75 backdrop-blur-xl border rounded-lg shadow-2xl flex flex-col font-['JetBrains_Mono'] ${
        isActive ? 'border-white/15' : 'border-white/8'
      }`}
      style={{
        width: `${dimensions.width}px`,
        height: `${dimensions.height}px`,
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: zIndex,
        minWidth: isMobile ? '95vw' : '300px',
        minHeight: isMobile ? '80vh' : '200px',
        touchAction: 'none', // Prevent default touch behaviors
      }}
      onMouseDown={onFocus}
      onTouchStart={onFocus}
    >
      {/* Window Header */}
      <div
        ref={headerRef}
        className={`bg-white/5 border-b border-white/8 flex items-center justify-between px-3 cursor-move select-none ${
          isMobile ? 'h-12' : 'h-9'
        }`}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div className={`text-gray-400 font-semibold tracking-wide ${isMobile ? 'text-sm' : 'text-xs'}`}>
          {title}
        </div>
        <div className="window-controls flex gap-2">
          <button
            onClick={onMinimize}
            className={`rounded-full bg-[#febc2e] hover:brightness-110 transition-all ${
              isMobile ? 'w-8 h-8' : 'w-3 h-3'
            }`}
            title="Minimize"
          />
          <button
            className={`rounded-full bg-[#28c840] hover:brightness-110 transition-all ${
              isMobile ? 'w-8 h-8' : 'w-3 h-3'
            }`}
            title="Maximize"
          />
          <button
            onClick={onClose}
            className={`rounded-full bg-[#ff5f57] hover:brightness-110 transition-all ${
              isMobile ? 'w-8 h-8' : 'w-3 h-3'
            }`}
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
