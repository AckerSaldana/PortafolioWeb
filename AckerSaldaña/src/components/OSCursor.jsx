import { useEffect, useState, useRef } from 'react';

const OSCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isClicking, setIsClicking] = useState(false);
  const cursorRef = useRef(null);

  useEffect(() => {
    const updatePosition = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="os-cursor fixed pointer-events-none z-[10000]"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: isClicking ? 'translate(-2px, -2px) scale(0.9)' : 'translate(-2px, -2px)',
        transition: 'transform 0.1s ease',
      }}
    >
      {/* Classic OS pointer shape */}
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Outer glow */}
        <path
          d="M3 3L3 19L9 13L12 19L14 18L11 12L19 12L3 3Z"
          fill="#0affc2"
          fillOpacity="0.3"
          filter="url(#glow)"
        />
        {/* Main pointer */}
        <path
          d="M3 3L3 19L9 13L12 19L14 18L11 12L19 12L3 3Z"
          fill="white"
          stroke="#0affc2"
          strokeWidth="1"
        />
        {/* Inner highlight */}
        <path
          d="M5 5L5 15L9 11L11 15L12 14.5L10 10L15 10L5 5Z"
          fill="#0affc2"
          fillOpacity="0.4"
        />

        {/* Glow filter */}
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
      </svg>
    </div>
  );
};

export default OSCursor;
