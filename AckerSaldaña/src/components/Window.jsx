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
  onMaximize,
  isMaximized = false,
  zIndex
}) => {
  const windowRef = useRef(null);
  const headerRef = useRef(null);
  const { isMobile, isTablet, windowSize } = useBreakpoint();

  // State declarations - MUST come before useMemo
  const [position, setPosition] = useState({ x, y });
  const [size, setSize] = useState({ width, height });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState(null);
  const [preMaximizedState, setPreMaximizedState] = useState({ x, y, width, height });
  const dragStart = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ x: 0, y: 0, width: 0, height: 0, startX: 0, startY: 0 });

  // Calculate responsive dimensions (memoized for performance)
  const dimensions = useMemo(() => {
    // If maximized, use full viewport
    if (isMaximized) {
      return {
        width: windowSize.width,
        height: windowSize.height - 48, // Account for taskbar
      };
    }

    if (isMobile) {
      // Near full-screen on mobile
      return {
        width: Math.min(windowSize.width - 20, size.width),
        height: Math.min(windowSize.height - 100, size.height),
      };
    } else if (isTablet) {
      // Percentage-based on tablet
      return {
        width: Math.min(windowSize.width * 0.85, size.width),
        height: Math.min(windowSize.height * 0.75, size.height),
      };
    }
    // Desktop: use current size
    return { width: size.width, height: size.height };
  }, [isMobile, isTablet, windowSize.width, windowSize.height, size.width, size.height, isMaximized]);

  // Adjust position when maximized state changes
  useEffect(() => {
    if (isMaximized) {
      // Store current state before maximizing
      setPreMaximizedState({
        x: position.x,
        y: position.y,
        width: dimensions.width,
        height: dimensions.height
      });
      // Move to top-left when maximized
      setPosition({ x: 0, y: 0 });
    } else {
      // Restore previous position when un-maximizing
      if (preMaximizedState) {
        setPosition({ x: preMaximizedState.x, y: preMaximizedState.y });
      }
    }
  }, [isMaximized]);

  // Adjust position when window size changes (responsive)
  useEffect(() => {
    if (isMaximized) return; // Don't adjust if maximized

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
    if (isMaximized) return; // Prevent dragging when maximized

    setIsDragging(true);
    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
    onFocus();
  };

  const handleTouchStart = (e) => {
    if (e.target.closest('.window-controls')) return;
    if (isMaximized) return; // Prevent dragging when maximized

    setIsDragging(true);
    const touch = e.touches[0];
    dragStart.current = {
      x: touch.clientX - position.x,
      y: touch.clientY - position.y
    };
    onFocus();
  };

  // Double-click header to maximize/restore
  const handleHeaderDoubleClick = () => {
    if (onMaximize && !isMobile) {
      onMaximize();
    }
  };

  // Resize handlers
  const handleResizeStart = (e, direction) => {
    if (isMaximized || isMobile) return;

    e.stopPropagation();
    setIsResizing(true);
    setResizeDirection(direction);

    const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;

    resizeStart.current = {
      startX: clientX,
      startY: clientY,
      x: position.x,
      y: position.y,
      width: dimensions.width,
      height: dimensions.height
    };
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        const newX = e.clientX - dragStart.current.x;
        const newY = e.clientY - dragStart.current.y;

        // Boundary checks
        const maxX = windowSize.width - dimensions.width;
        const maxY = windowSize.height - dimensions.height - 48; // Account for taskbar
        const minY = 0;

        setPosition({
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(minY, Math.min(newY, maxY))
        });
      } else if (isResizing) {
        const deltaX = e.clientX - resizeStart.current.startX;
        const deltaY = e.clientY - resizeStart.current.startY;

        const minWidth = isMobile ? 300 : 300;
        const minHeight = isMobile ? 200 : 200;

        let newWidth = resizeStart.current.width;
        let newHeight = resizeStart.current.height;
        let newX = resizeStart.current.x;
        let newY = resizeStart.current.y;

        // Handle resize based on direction
        if (resizeDirection.includes('e')) {
          newWidth = Math.max(minWidth, resizeStart.current.width + deltaX);
        }
        if (resizeDirection.includes('w')) {
          const widthDelta = resizeStart.current.width - deltaX;
          if (widthDelta >= minWidth) {
            newWidth = widthDelta;
            newX = resizeStart.current.x + deltaX;
          }
        }
        if (resizeDirection.includes('s')) {
          newHeight = Math.max(minHeight, resizeStart.current.height + deltaY);
        }
        if (resizeDirection.includes('n')) {
          const heightDelta = resizeStart.current.height - deltaY;
          if (heightDelta >= minHeight) {
            newHeight = heightDelta;
            newY = resizeStart.current.y + deltaY;
          }
        }

        // Boundary checks
        newX = Math.max(0, Math.min(newX, windowSize.width - newWidth));
        newY = Math.max(0, Math.min(newY, windowSize.height - newHeight - 48));

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
        const maxY = windowSize.height - dimensions.height - 48;
        const minY = 0;

        setPosition({
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(minY, Math.min(newY, maxY))
        });
      }
    };

    const handleMouseUp = () => {
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
  }, [isDragging, isResizing, resizeDirection, dimensions.width, dimensions.height, windowSize, isMobile]);

  return (
    <div
      ref={windowRef}
      className={`fixed bg-black/75 backdrop-blur-xl border shadow-2xl flex flex-col font-['JetBrains_Mono'] ${
        isMaximized ? 'rounded-none' : 'rounded-lg'
      } ${
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
        className={`bg-white/5 border-b border-white/8 flex items-center justify-between px-3 select-none ${
          isMaximized ? 'cursor-default' : 'cursor-move'
        } ${
          isMobile ? 'h-12' : 'h-9'
        }`}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onDoubleClick={handleHeaderDoubleClick}
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
            onClick={onMaximize}
            className={`rounded-full bg-[#28c840] hover:brightness-110 transition-all ${
              isMobile ? 'w-8 h-8' : 'w-3 h-3'
            }`}
            title={isMaximized ? "Restore" : "Maximize"}
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
      <div
        className="flex-1 overflow-hidden relative"
        onWheel={(e) => e.stopPropagation()}
        style={{ overscrollBehavior: 'contain' }}
      >
        {children}
      </div>

      {/* Resize Handles - Only show on desktop when not maximized */}
      {!isMobile && !isMaximized && (
        <>
          {/* Corner handles */}
          <div
            className="absolute top-0 left-0 w-3 h-3 cursor-nw-resize"
            onMouseDown={(e) => handleResizeStart(e, 'nw')}
            onTouchStart={(e) => handleResizeStart(e, 'nw')}
          />
          <div
            className="absolute top-0 right-0 w-3 h-3 cursor-ne-resize"
            onMouseDown={(e) => handleResizeStart(e, 'ne')}
            onTouchStart={(e) => handleResizeStart(e, 'ne')}
          />
          <div
            className="absolute bottom-0 left-0 w-3 h-3 cursor-sw-resize"
            onMouseDown={(e) => handleResizeStart(e, 'sw')}
            onTouchStart={(e) => handleResizeStart(e, 'sw')}
          />
          <div
            className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize"
            onMouseDown={(e) => handleResizeStart(e, 'se')}
            onTouchStart={(e) => handleResizeStart(e, 'se')}
          />

          {/* Edge handles */}
          <div
            className="absolute top-0 left-3 right-3 h-1 cursor-n-resize"
            onMouseDown={(e) => handleResizeStart(e, 'n')}
            onTouchStart={(e) => handleResizeStart(e, 'n')}
          />
          <div
            className="absolute bottom-0 left-3 right-3 h-1 cursor-s-resize"
            onMouseDown={(e) => handleResizeStart(e, 's')}
            onTouchStart={(e) => handleResizeStart(e, 's')}
          />
          <div
            className="absolute left-0 top-3 bottom-3 w-1 cursor-w-resize"
            onMouseDown={(e) => handleResizeStart(e, 'w')}
            onTouchStart={(e) => handleResizeStart(e, 'w')}
          />
          <div
            className="absolute right-0 top-3 bottom-3 w-1 cursor-e-resize"
            onMouseDown={(e) => handleResizeStart(e, 'e')}
            onTouchStart={(e) => handleResizeStart(e, 'e')}
          />
        </>
      )}
    </div>
  );
};

export default Window;
