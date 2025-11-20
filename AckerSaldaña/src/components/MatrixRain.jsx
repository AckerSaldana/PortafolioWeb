import { useEffect, useRef } from 'react';

const MatrixRain = ({ opacity = 0.05, speed = 1, density = 0.7, color = '#00ff00' }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Set canvas size to window size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Matrix characters - a mix of alphanumeric, katakana, and symbols
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const charArray = chars.split('');

    // Column configuration
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);

    // Array to track y position of each column
    const drops = new Array(columns).fill(0);

    // Randomize initial positions for more organic feel
    for (let i = 0; i < drops.length; i++) {
      drops[i] = Math.random() * -100;
    }

    // Speed variation per column for more natural movement
    const speeds = new Array(columns).fill(0).map(() => 0.5 + Math.random() * speed);

    const draw = () => {
      // Semi-transparent black to create fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Set text properties
      ctx.fillStyle = color;
      ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;

      // Draw characters
      for (let i = 0; i < drops.length; i++) {
        // Skip some columns randomly for varied density
        if (Math.random() > density) continue;

        // Random character
        const char = charArray[Math.floor(Math.random() * charArray.length)];

        // X position
        const x = i * fontSize;

        // Y position
        const y = drops[i] * fontSize;

        // Brightness variation - brightest at the head
        const brightness = 0.5 + Math.random() * 0.5;
        ctx.globalAlpha = brightness;

        // Draw character
        ctx.fillText(char, x, y);

        // Reset drop to top randomly after it crosses the screen
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        // Move drop down
        drops[i] += speeds[i];
      }

      ctx.globalAlpha = 1;
      animationRef.current = requestAnimationFrame(draw);
    };

    // Start animation
    draw();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [opacity, speed, density, color]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{
        opacity: opacity,
        mixBlendMode: 'screen',
      }}
    />
  );
};

export default MatrixRain;
