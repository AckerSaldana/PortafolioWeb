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
      setIsPointer(
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.onclick || 
        window.getComputedStyle(target).cursor === 'pointer'
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
      <motion.div
        className="fixed w-8 h-8 rounded-full border-2 border-[#4a9eff] pointer-events-none z-[9999] mix-blend-difference"
        animate={{
          x: mousePosition.x - 16,
          y: mousePosition.y - 16,
          scale: isPointer ? 1.5 : 1,
        }}
        transition={{
          type: "spring",
          damping: 20,
          stiffness: 400,
          mass: 0.5,
        }}
      />
      <motion.div
        className="fixed w-1 h-1 bg-[#4a9eff] rounded-full pointer-events-none z-[9999]"
        animate={{
          x: mousePosition.x - 2,
          y: mousePosition.y - 2,
          scale: isClicking ? 0.5 : 1,
        }}
        transition={{
          type: "spring",
          damping: 30,
          stiffness: 500,
          mass: 0.2,
        }}
      />
    </>
  );
};

export default CustomCursor;