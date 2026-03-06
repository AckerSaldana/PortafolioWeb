import { useRef, useEffect, useState, useMemo } from 'react';
import gsap from 'gsap';
import useBreakpoint from '../hooks/useBreakpoint';
import { shadows } from '../utils/win11Theme';

const Window = ({
  title,
  icon: IconComponent,
  children,
  width = 600,
  height = 400,
  x = 100,
  y = 100,
  isActive,
  isMinimized = false,
  onFocus,
  onClose,
  onMinimize,
  onMaximize,
  onSnap,
  isMaximized = false,
  snapZone = null,
  zIndex
}) => {
  const windowRef = useRef(null);
  const headerRef = useRef(null);
  const { isMobile, isTablet, windowSize } = useBreakpoint();

  const [position, setPosition] = useState({ x, y });
  const [size, setSize] = useState({ width, height });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState(null);
  const [preMaximizedState, setPreMaximizedState] = useState({ x, y, width, height });
  const [showSnapLayouts, setShowSnapLayouts] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ x: 0, y: 0, width: 0, height: 0, startX: 0, startY: 0 });
  const snapLayoutTimer = useRef(null);
  const prevMinimized = useRef(isMinimized);

  const TASKBAR_HEIGHT = isMobile ? 56 : 48;

  // Snap zone dimension calculator
  const getSnappedDimensions = (zone) => {
    switch (zone) {
      case 'left-half':
        return { x: 4, y: 4, width: (windowSize.width / 2) - 6, height: windowSize.height - TASKBAR_HEIGHT - 8 };
      case 'right-half':
        return { x: (windowSize.width / 2) + 2, y: 4, width: (windowSize.width / 2) - 6, height: windowSize.height - TASKBAR_HEIGHT - 8 };
      case 'top-left':
        return { x: 4, y: 4, width: (windowSize.width / 2) - 6, height: (windowSize.height - TASKBAR_HEIGHT) / 2 - 6 };
      case 'top-right':
        return { x: (windowSize.width / 2) + 2, y: 4, width: (windowSize.width / 2) - 6, height: (windowSize.height - TASKBAR_HEIGHT) / 2 - 6 };
      case 'bottom-left':
        return { x: 4, y: (windowSize.height - TASKBAR_HEIGHT) / 2 + 2, width: (windowSize.width / 2) - 6, height: (windowSize.height - TASKBAR_HEIGHT) / 2 - 6 };
      case 'bottom-right':
        return { x: (windowSize.width / 2) + 2, y: (windowSize.height - TASKBAR_HEIGHT) / 2 + 2, width: (windowSize.width / 2) - 6, height: (windowSize.height - TASKBAR_HEIGHT) / 2 - 6 };
      default:
        return null;
    }
  };

  const dimensions = useMemo(() => {
    if (isMaximized) {
      return { width: windowSize.width, height: windowSize.height - TASKBAR_HEIGHT };
    }
    if (snapZone) {
      const snapped = getSnappedDimensions(snapZone);
      if (snapped) return { width: snapped.width, height: snapped.height };
    }
    if (isMobile) {
      return {
        width: Math.min(windowSize.width - 20, size.width),
        height: Math.min(windowSize.height - 100, size.height),
      };
    } else if (isTablet) {
      return {
        width: Math.min(windowSize.width * 0.85, size.width),
        height: Math.min(windowSize.height * 0.75, size.height),
      };
    }
    return { width: size.width, height: size.height };
  }, [isMobile, isTablet, windowSize.width, windowSize.height, size.width, size.height, isMaximized, snapZone]);

  useEffect(() => {
    if (snapZone) {
      const snapped = getSnappedDimensions(snapZone);
      if (snapped) setPosition({ x: snapped.x, y: snapped.y });
    }
  }, [snapZone]);

  useEffect(() => {
    if (isMaximized) {
      setPreMaximizedState({ x: position.x, y: position.y, width: dimensions.width, height: dimensions.height });
      setPosition({ x: 0, y: 0 });
    } else if (preMaximizedState) {
      setPosition({ x: preMaximizedState.x, y: preMaximizedState.y });
    }
  }, [isMaximized]);

  useEffect(() => {
    if (isMaximized || snapZone) return;
    if (isMobile) {
      setPosition({
        x: (windowSize.width - dimensions.width) / 2,
        y: Math.max(0, (windowSize.height - dimensions.height - TASKBAR_HEIGHT) / 2),
      });
    } else if (isTablet) {
      setPosition(prev => ({
        x: Math.max(0, Math.min(prev.x, windowSize.width - dimensions.width)),
        y: Math.max(0, Math.min(prev.y, windowSize.height - dimensions.height - TASKBAR_HEIGHT)),
      }));
    }
  }, [isMobile, isTablet, windowSize.width, windowSize.height]);

  useEffect(() => {
    gsap.fromTo(windowRef.current,
      { opacity: 0, scale: 0.95, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.25, ease: 'power3.out' }
    );
  }, []);

  // Minimize / restore animation
  useEffect(() => {
    if (!windowRef.current) return;
    if (isMinimized && !prevMinimized.current) {
      gsap.to(windowRef.current, {
        scale: 0.1, opacity: 0, y: windowSize.height,
        duration: 0.25, ease: 'power3.in',
        onComplete: () => { if (windowRef.current) windowRef.current.style.visibility = 'hidden'; }
      });
    } else if (!isMinimized && prevMinimized.current) {
      if (windowRef.current) windowRef.current.style.visibility = 'visible';
      gsap.fromTo(windowRef.current,
        { scale: 0.1, opacity: 0, y: windowSize.height },
        { scale: 1, opacity: 1, y: 0, duration: 0.3, ease: 'power3.out' }
      );
    }
    prevMinimized.current = isMinimized;
  }, [isMinimized]);

  const handleMouseDown = (e) => {
    if (e.target.closest('.window-controls')) return;
    if (isMaximized || snapZone) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    onFocus();
  };

  const handleTouchStart = (e) => {
    if (e.target.closest('.window-controls')) return;
    if (isMaximized || snapZone) return;
    setIsDragging(true);
    const touch = e.touches[0];
    dragStart.current = { x: touch.clientX - position.x, y: touch.clientY - position.y };
    onFocus();
  };

  const handleHeaderDoubleClick = () => {
    if (onMaximize && !isMobile) onMaximize();
  };

  const handleMaxBtnHover = () => {
    if (isMobile) return;
    snapLayoutTimer.current = setTimeout(() => setShowSnapLayouts(true), 400);
  };
  const handleMaxBtnLeave = () => {
    clearTimeout(snapLayoutTimer.current);
    setShowSnapLayouts(false);
  };

  const handleResizeStart = (e, direction) => {
    if (isMaximized || isMobile || snapZone) return;
    e.stopPropagation();
    setIsResizing(true);
    setResizeDirection(direction);
    const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
    resizeStart.current = {
      startX: clientX, startY: clientY,
      x: position.x, y: position.y,
      width: dimensions.width, height: dimensions.height
    };
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        const newX = e.clientX - dragStart.current.x;
        const newY = e.clientY - dragStart.current.y;
        const maxX = windowSize.width - dimensions.width;
        const maxY = windowSize.height - dimensions.height - TASKBAR_HEIGHT;
        setPosition({
          x: Math.max(-dimensions.width + 100, Math.min(newX, maxX + dimensions.width - 100)),
          y: Math.max(0, Math.min(newY, maxY))
        });
      } else if (isResizing) {
        const deltaX = e.clientX - resizeStart.current.startX;
        const deltaY = e.clientY - resizeStart.current.startY;
        const minWidth = 300;
        const minHeight = 200;
        let newWidth = resizeStart.current.width;
        let newHeight = resizeStart.current.height;
        let newX = resizeStart.current.x;
        let newY = resizeStart.current.y;

        if (resizeDirection.includes('e')) newWidth = Math.max(minWidth, resizeStart.current.width + deltaX);
        if (resizeDirection.includes('w')) {
          const widthDelta = resizeStart.current.width - deltaX;
          if (widthDelta >= minWidth) { newWidth = widthDelta; newX = resizeStart.current.x + deltaX; }
        }
        if (resizeDirection.includes('s')) newHeight = Math.max(minHeight, resizeStart.current.height + deltaY);
        if (resizeDirection.includes('n')) {
          const heightDelta = resizeStart.current.height - deltaY;
          if (heightDelta >= minHeight) { newHeight = heightDelta; newY = resizeStart.current.y + deltaY; }
        }

        newX = Math.max(0, Math.min(newX, windowSize.width - newWidth));
        newY = Math.max(0, Math.min(newY, windowSize.height - newHeight - TASKBAR_HEIGHT));
        setSize({ width: newWidth, height: newHeight });
        setPosition({ x: newX, y: newY });
      }
    };

    const handleTouchMove = (e) => {
      if (isDragging) {
        const touch = e.touches[0];
        const newX = touch.clientX - dragStart.current.x;
        const newY = touch.clientY - dragStart.current.y;
        const maxX = windowSize.width - dimensions.width;
        const maxY = windowSize.height - dimensions.height - TASKBAR_HEIGHT;
        setPosition({
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY))
        });
      }
    };

    const handleMouseUp = () => {
      if (isDragging && !isMobile && onSnap) {
        const EDGE = 20;
        if (position.y <= EDGE) {
          onSnap('maximize');
        } else if (position.x <= EDGE) {
          onSnap('left-half');
        } else if (position.x + dimensions.width >= windowSize.width - EDGE) {
          onSnap('right-half');
        }
      }
      setIsDragging(false);
      setIsResizing(false);
      setResizeDirection(null);
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
      setIsResizing(false);
      setResizeDirection(null);
    };

    if (isDragging || isResizing) {
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
  }, [isDragging, isResizing, resizeDirection, dimensions.width, dimensions.height, windowSize, isMobile, position]);

  return (
    <div
      ref={windowRef}
      role="dialog"
      aria-label={title}
      className={`fixed flex flex-col ${isMaximized ? 'rounded-none' : 'rounded-lg'}`}
      style={{
        width: `${dimensions.width}px`,
        height: `${dimensions.height}px`,
        left: `${isMaximized ? 0 : position.x}px`,
        top: `${isMaximized ? 0 : position.y}px`,
        zIndex,
        minWidth: isMobile ? '95vw' : '300px',
        minHeight: isMobile ? '80vh' : '200px',
        touchAction: 'none',
        background: isActive ? 'rgba(32, 32, 32, 0.94)' : 'rgba(32, 32, 32, 0.82)',
        backdropFilter: 'blur(30px) saturate(125%)',
        WebkitBackdropFilter: 'blur(30px) saturate(125%)',
        border: `1px solid ${isActive ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)'}`,
        boxShadow: isActive ? shadows.windowActive : shadows.window,
        overflow: 'hidden',
      }}
      onMouseDown={onFocus}
      onTouchStart={onFocus}
    >
      {/* Title Bar */}
      <div
        ref={headerRef}
        className={`flex items-center justify-between select-none flex-shrink-0 ${
          isMaximized ? 'cursor-default' : 'cursor-move'
        } ${isMobile ? 'h-11' : 'h-8'}`}
        style={{ background: isActive ? 'rgba(45, 45, 45, 0.50)' : 'rgba(45, 45, 45, 0.30)' }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onDoubleClick={handleHeaderDoubleClick}
      >
        <div className="flex items-center gap-2 px-3 min-w-0">
          {IconComponent && <div className="flex-shrink-0"><IconComponent size={isMobile ? 18 : 14} /></div>}
          <span className={`truncate ${isMobile ? 'text-xs' : 'text-[11px]'} ${isActive ? 'text-white/90' : 'text-white/40'}`}
            style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
            {title}
          </span>
        </div>

        <div className="window-controls flex h-full flex-shrink-0">
          <button onClick={onMinimize}
            aria-label="Minimize window"
            className={`flex items-center justify-center hover:bg-white/8 transition-colors duration-100 ${isMobile ? 'w-12' : 'w-[46px]'} h-full`}
            title="Minimize">
            <svg width="10" height="10" viewBox="0 0 10 10">
              <path d="M1 5h8" stroke={isActive ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.4)'} strokeWidth="1"/>
            </svg>
          </button>

          <div className="relative" onMouseEnter={handleMaxBtnHover} onMouseLeave={handleMaxBtnLeave}>
            <button onClick={onMaximize}
              aria-label={isMaximized ? "Restore window" : "Maximize window"}
              className={`flex items-center justify-center hover:bg-white/8 transition-colors duration-100 ${isMobile ? 'w-12' : 'w-[46px]'} h-full`}
              title={isMaximized ? "Restore Down" : "Maximize"}>
              {isMaximized ? (
                <svg width="10" height="10" viewBox="0 0 10 10">
                  <rect x="2.5" y="0" width="7.5" height="7.5" rx="1" fill="none" stroke={isActive ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.4)'} strokeWidth="1"/>
                  <rect x="0" y="2.5" width="7.5" height="7.5" rx="1" fill="rgba(32,32,32,1)" stroke={isActive ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.4)'} strokeWidth="1"/>
                </svg>
              ) : (
                <svg width="10" height="10" viewBox="0 0 10 10">
                  <rect x="0.5" y="0.5" width="9" height="9" rx="1" fill="none" stroke={isActive ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.4)'} strokeWidth="1"/>
                </svg>
              )}
            </button>

            {showSnapLayouts && onSnap && (
              <div className="absolute top-full right-0 mt-1 z-50"
                style={{
                  background: 'rgba(44, 44, 44, 0.95)', backdropFilter: 'blur(30px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '8px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.36)', padding: '12px',
                }}
                onMouseEnter={() => clearTimeout(snapLayoutTimer.current)}
                onMouseLeave={handleMaxBtnLeave}>
                <div className="flex gap-2">
                  {[
                    { id: 'maximize', label: 'Full', render: () => <div className="w-full h-full rounded-sm bg-white/15" /> },
                    { id: 'left-half', label: 'Left Half', render: () => (
                      <div className="flex gap-0.5 w-full h-full">
                        <div className="flex-1 rounded-sm bg-[#60cdff]/30" />
                        <div className="flex-1 rounded-sm bg-white/15" />
                      </div>
                    )},
                    { id: 'right-half', label: 'Right Half', render: () => (
                      <div className="flex gap-0.5 w-full h-full">
                        <div className="flex-1 rounded-sm bg-white/15" />
                        <div className="flex-1 rounded-sm bg-[#60cdff]/30" />
                      </div>
                    )},
                    { id: 'quarters', label: 'Quarters', render: () => (
                      <div className="flex flex-col gap-0.5 w-full h-full">
                        <div className="flex gap-0.5 flex-1">
                          <div className="flex-1 rounded-sm bg-[#60cdff]/30" />
                          <div className="flex-1 rounded-sm bg-white/15" />
                        </div>
                        <div className="flex gap-0.5 flex-1">
                          <div className="flex-1 rounded-sm bg-white/15" />
                          <div className="flex-1 rounded-sm bg-white/15" />
                        </div>
                      </div>
                    )},
                  ].map((layout) => (
                    <button key={layout.id} title={layout.label}
                      onClick={() => {
                        if (layout.id === 'maximize') onMaximize();
                        else if (layout.id === 'quarters') onSnap('top-left');
                        else onSnap(layout.id);
                        setShowSnapLayouts(false);
                      }}
                      className="w-12 h-10 rounded border border-white/10 hover:border-[#60cdff] hover:bg-[#60cdff]/10 transition-all p-1">
                      {layout.render()}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button onClick={onClose}
            aria-label="Close window"
            className={`flex items-center justify-center hover:bg-[#c42b1c] transition-colors duration-100 ${isMobile ? 'w-12' : 'w-[46px]'} h-full ${isMaximized ? '' : 'rounded-tr-lg'}`}
            title="Close">
            <svg width="10" height="10" viewBox="0 0 10 10">
              <path d="M1 1l8 8M9 1l-8 8" stroke={isActive ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.4)'} strokeWidth="1" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-hidden relative"
        onWheel={(e) => e.stopPropagation()}
        style={{ overscrollBehavior: 'contain' }}>
        {children}
      </div>

      {/* Resize Handles */}
      {!isMobile && !isMaximized && !snapZone && (
        <>
          <div className="absolute top-0 left-0 w-3 h-3 cursor-nw-resize" onMouseDown={(e) => handleResizeStart(e, 'nw')} onTouchStart={(e) => handleResizeStart(e, 'nw')} />
          <div className="absolute top-0 right-0 w-3 h-3 cursor-ne-resize" onMouseDown={(e) => handleResizeStart(e, 'ne')} onTouchStart={(e) => handleResizeStart(e, 'ne')} />
          <div className="absolute bottom-0 left-0 w-3 h-3 cursor-sw-resize" onMouseDown={(e) => handleResizeStart(e, 'sw')} onTouchStart={(e) => handleResizeStart(e, 'sw')} />
          <div className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize" onMouseDown={(e) => handleResizeStart(e, 'se')} onTouchStart={(e) => handleResizeStart(e, 'se')} />
          <div className="absolute top-0 left-3 right-3 h-1 cursor-n-resize" onMouseDown={(e) => handleResizeStart(e, 'n')} onTouchStart={(e) => handleResizeStart(e, 'n')} />
          <div className="absolute bottom-0 left-3 right-3 h-1 cursor-s-resize" onMouseDown={(e) => handleResizeStart(e, 's')} onTouchStart={(e) => handleResizeStart(e, 's')} />
          <div className="absolute left-0 top-3 bottom-3 w-1 cursor-w-resize" onMouseDown={(e) => handleResizeStart(e, 'w')} onTouchStart={(e) => handleResizeStart(e, 'w')} />
          <div className="absolute right-0 top-3 bottom-3 w-1 cursor-e-resize" onMouseDown={(e) => handleResizeStart(e, 'e')} onTouchStart={(e) => handleResizeStart(e, 'e')} />
        </>
      )}
    </div>
  );
};

export default Window;
