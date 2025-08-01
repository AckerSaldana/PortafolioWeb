import { useEffect, useRef } from 'react';
import './CSSTerminal.css';

const CSSTerminal = ({ tint = '#00ff00' }) => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawMatrix();
    };
    
    // Matrix rain effect
    const fontSize = 14;
    const columns = Math.floor(window.innerWidth / fontSize);
    const drops = Array(columns).fill(1);
    
    const matrix = '01';
    
    const drawMatrix = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = tint;
      ctx.font = fontSize + 'px JetBrains Mono';
      
      for (let i = 0; i < drops.length; i++) {
        const text = matrix[Math.floor(Math.random() * matrix.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };
    
    const interval = setInterval(drawMatrix, 35);
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [tint]);
  
  return (
    <div className="css-terminal-container">
      <canvas ref={canvasRef} className="css-terminal-canvas" />
      
      {/* Scanlines */}
      <div className="css-terminal-scanlines" />
      
      {/* Glow effect */}
      <div className="css-terminal-glow" style={{ 
        boxShadow: `inset 0 0 100px ${tint}20` 
      }} />
      
      {/* Flicker effect */}
      <div className="css-terminal-flicker" />
    </div>
  );
};

export default CSSTerminal;