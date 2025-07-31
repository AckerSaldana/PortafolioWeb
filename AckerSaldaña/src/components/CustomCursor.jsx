import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      const target = e.target;
      const computedStyle = window.getComputedStyle(target);
      
      // Check if hovering over interactive element
      setIsPointer(
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.onclick || 
        computedStyle.cursor === 'pointer' ||
        target.closest('button') ||
        target.closest('a')
      );
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <>
      {/* Outer circle - glow effect */}
      <motion.div
        className="fixed w-8 h-8 rounded-full pointer-events-none z-[9999] mix-blend-screen"
        animate={{
          x: mousePosition.x - 16,
          y: mousePosition.y - 16,
          scale: isPointer ? 1.5 : isClicking ? 0.9 : 1,
        }}
        transition={{
          type: "spring",
          damping: 30,
          stiffness: 400,
          mass: 0.5,
        }}
      >
        <div 
          className="w-full h-full rounded-full"
          style={{
            background: isPointer 
              ? 'radial-gradient(circle, rgba(74, 158, 255, 0.3) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(74, 158, 255, 0.2) 0%, transparent 70%)',
            filter: 'blur(2px)',
          }}
        />
      </motion.div>

      {/* Main cursor ring */}
      <motion.div
        className="fixed w-8 h-8 rounded-full border border-[#4a9eff]/60 pointer-events-none z-[10000] mix-blend-difference"
        animate={{
          x: mousePosition.x - 16,
          y: mousePosition.y - 16,
          scale: isPointer ? 1.5 : isClicking ? 0.8 : 1,
          borderWidth: isPointer ? '2px' : '1px',
        }}
        transition={{
          type: "spring",
          damping: 25,
          stiffness: 400,
          mass: 0.5,
        }}
        style={{
          boxShadow: '0 0 10px rgba(74, 158, 255, 0.3)',
        }}
      />

      {/* Center dot */}
      <motion.div
        className="fixed w-1.5 h-1.5 bg-[#4a9eff] rounded-full pointer-events-none z-[10001] mix-blend-difference"
        animate={{
          x: mousePosition.x - 3,
          y: mousePosition.y - 3,
          scale: isClicking ? 0.5 : 1,
          opacity: isPointer ? 0.8 : 1,
        }}
        transition={{
          type: "spring",
          damping: 35,
          stiffness: 500,
          mass: 0.2,
        }}
        style={{
          boxShadow: '0 0 6px rgba(74, 158, 255, 0.6)',
        }}
      />
    </>
  );
};

export default CustomCursor;