import { useEffect, useRef } from 'react';

const CustomCursor = () => {
  const cursorOuterRef = useRef(null);
  const cursorInnerRef = useRef(null);
  const cursorGlowRef = useRef(null);
  const requestRef = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const isPointerRef = useRef(false);
  const isClickingRef = useRef(false);

  useEffect(() => {
    const updateCursor = () => {
      if (cursorOuterRef.current && cursorInnerRef.current && cursorGlowRef.current) {
        const { x, y } = mousePos.current;
        
        // Direct transform for instant response
        cursorOuterRef.current.style.transform = `translate(${x - 16}px, ${y - 16}px)`;
        cursorInnerRef.current.style.transform = `translate(${x - 3}px, ${y - 3}px)`;
        cursorGlowRef.current.style.transform = `translate(${x - 16}px, ${y - 16}px)`;
      }
      
      requestRef.current = requestAnimationFrame(updateCursor);
    };

    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      
      const target = e.target;
      const computedStyle = window.getComputedStyle(target);
      
      // Check if hovering over interactive element
      const isPointer = 
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.onclick || 
        computedStyle.cursor === 'pointer' ||
        target.closest('button') ||
        target.closest('a');
      
      if (isPointer !== isPointerRef.current) {
        isPointerRef.current = isPointer;
        
        if (cursorOuterRef.current && cursorInnerRef.current) {
          if (isPointer) {
            cursorOuterRef.current.classList.add('cursor-hover');
            cursorInnerRef.current.classList.add('cursor-hover');
          } else {
            cursorOuterRef.current.classList.remove('cursor-hover');
            cursorInnerRef.current.classList.remove('cursor-hover');
          }
        }
      }
    };

    const handleMouseDown = () => {
      isClickingRef.current = true;
      if (cursorOuterRef.current && cursorInnerRef.current) {
        cursorOuterRef.current.classList.add('cursor-click');
        cursorInnerRef.current.classList.add('cursor-click');
      }
    };
    
    const handleMouseUp = () => {
      isClickingRef.current = false;
      if (cursorOuterRef.current && cursorInnerRef.current) {
        cursorOuterRef.current.classList.remove('cursor-click');
        cursorInnerRef.current.classList.remove('cursor-click');
      }
    };

    // Start animation loop
    requestRef.current = requestAnimationFrame(updateCursor);

    // Add event listeners with passive option for better performance
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <>
      {/* Outer circle - glow effect */}
      <div
        ref={cursorGlowRef}
        className="cursor-glow"
        style={{
          position: 'fixed',
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9999,
          mixBlendMode: 'screen',
          background: 'radial-gradient(circle, rgba(74, 158, 255, 0.2) 0%, transparent 70%)',
          filter: 'blur(2px)',
          willChange: 'transform',
        }}
      />

      {/* Main cursor ring */}
      <div
        ref={cursorOuterRef}
        className="fixed w-8 h-8 rounded-full border border-[#4a9eff]/60 pointer-events-none z-[10000] mix-blend-difference transition-[border-width,scale] duration-150"
        style={{
          boxShadow: '0 0 10px rgba(74, 158, 255, 0.3)',
          willChange: 'transform',
        }}
      />

      {/* Center dot */}
      <div
        ref={cursorInnerRef}
        className="fixed w-1.5 h-1.5 bg-[#4a9eff] rounded-full pointer-events-none z-[10001] mix-blend-difference transition-[scale,opacity] duration-100"
        style={{
          boxShadow: '0 0 6px rgba(74, 158, 255, 0.6)',
          willChange: 'transform',
        }}
      />

    </>
  );
};

export default CustomCursor;