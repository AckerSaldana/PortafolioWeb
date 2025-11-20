import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { customEases } from '../utils/gsapConfig';

const CodeDisplayGSAP = () => {
  const [typedCode, setTypedCode] = useState('');
  const [currentLine, setCurrentLine] = useState(0);
  const containerRef = useRef(null);
  const codeDisplayRef = useRef(null);
  const cursorRef = useRef(null);
  const holoRef = useRef(null);

  const codeLines = [
    'const student = {',
    '  name: "Acker Saldaña",',
    '  university: "Tecnológico de Monterrey",',
    '  exchange: "University of Hull",',
    '  pursuing: "MSc Advanced Computer Science",',
    '  languages: ["JavaScript", "C++", "Python", "Swift"],',
    '  stack: ["React", "Three.js", "PostgreSQL", "MySQL"],',
    '  passion: "Building bridges between tech & human needs",',
    '  motto: "Continuous learning, inclusive innovation"',
    '};'
  ];

  // Initial entrance animation
  useEffect(() => {
    if (!containerRef.current) return;

    gsap.fromTo(
      containerRef.current,
      {
        opacity: 0,
        scale: 0.95,
        rotateX: 10,
      },
      {
        opacity: 1,
        scale: 1,
        rotateX: 0,
        duration: 0.8,
        ease: customEases.dramatic,
        delay: 0.3,
      }
    );
  }, []);

  // Cursor blink animation
  useEffect(() => {
    if (!cursorRef.current) return;

    gsap.to(cursorRef.current, {
      opacity: 0,
      duration: 0.8,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
    });
  }, []);

  // 3D tilt effect on mouse move
  useEffect(() => {
    if (!codeDisplayRef.current) return;

    const handleMouseMove = (e) => {
      const rect = codeDisplayRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      const rotateX = (mouseY / rect.height) * -15;
      const rotateY = (mouseX / rect.width) * 15;

      gsap.to(codeDisplayRef.current, {
        rotateX,
        rotateY,
        duration: 0.5,
        ease: 'power2.out',
        transformPerspective: 1000,
      });

      // Holographic effect follows mouse
      if (holoRef.current) {
        gsap.to(holoRef.current, {
          x: mouseX * 0.1,
          y: mouseY * 0.1,
          duration: 0.3,
        });
      }
    };

    const handleMouseLeave = () => {
      gsap.to(codeDisplayRef.current, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.5,
        ease: 'power2.out',
      });

      if (holoRef.current) {
        gsap.to(holoRef.current, {
          x: 0,
          y: 0,
          duration: 0.3,
        });
      }
    };

    const element = codeDisplayRef.current;
    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Typing animation effect
  useEffect(() => {
    let lineIndex = 0;
    let charIndex = 0;
    let currentText = '';

    const typeInterval = setInterval(() => {
      if (lineIndex < codeLines.length) {
        if (charIndex < codeLines[lineIndex].length) {
          currentText += codeLines[lineIndex][charIndex];
          setTypedCode(currentText);
          charIndex++;
        } else {
          currentText += '\n';
          lineIndex++;
          charIndex = 0;
          setCurrentLine(lineIndex);
        }
      } else {
        clearInterval(typeInterval);
        setTimeout(() => {
          setTypedCode('');
          setCurrentLine(0);
        }, 3000);
      }
    }, 50);

    return () => clearInterval(typeInterval);
  }, [typedCode === '']);

  return (
    <div ref={containerRef} className="w-full max-w-2xl mx-auto" style={{ perspective: '1000px' }}>
      <div
        ref={codeDisplayRef}
        className="relative bg-gradient-to-br from-[#1a1a1a] via-[#1a1a1a] to-[#0a0a0a] rounded-2xl p-8 font-['JetBrains_Mono'] text-base border border-[#2a2a2a] overflow-hidden"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Holographic border effect */}
        <div
          className="absolute inset-0 rounded-2xl opacity-30 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(74, 158, 255, 0.3), rgba(123, 97, 255, 0.3))',
            padding: '2px',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />

        {/* Animated holographic glow */}
        <div
          ref={holoRef}
          className="absolute inset-0 rounded-2xl opacity-20 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at center, rgba(74, 158, 255, 0.4), transparent 70%)',
            filter: 'blur(20px)',
          }}
        />

        {/* Shimmer effect */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
            animation: 'shimmer 3s ease-in-out infinite',
          }}
        />

        {/* macOS window controls */}
        <div className="flex items-center gap-2 mb-6 relative z-10">
          <div className="w-3 h-3 rounded-full bg-red-500 shadow-lg shadow-red-500/50" />
          <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-lg shadow-yellow-500/50" />
          <div className="w-3 h-3 rounded-full bg-green-500 shadow-lg shadow-green-500/50" />
          <div className="ml-auto text-xs text-gray-500 uppercase tracking-wider">
            Terminal — zsh
          </div>
        </div>

        {/* Code content */}
        <div className="relative h-[360px] overflow-hidden">
          <pre className="text-gray-300 whitespace-pre-wrap leading-relaxed text-sm md:text-base relative z-10">
            <code>{typedCode}</code>
          </pre>

          {/* Cursor */}
          <span
            ref={cursorRef}
            className="inline-block w-2 h-5 bg-[#4a9eff] ml-1 shadow-lg shadow-[#4a9eff]/50"
          />
        </div>

        {/* Scan line effect */}
        <div
          className="absolute inset-0 pointer-events-none opacity-5"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #4a9eff 2px, #4a9eff 4px)',
          }}
        />

        {/* Inner glow */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            boxShadow: 'inset 0 0 60px rgba(74, 158, 255, 0.1)',
          }}
        />
      </div>

      {/* Floating accent elements */}
      <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#4a9eff]/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#7b61ff]/10 rounded-full blur-2xl pointer-events-none" />
    </div>
  );
};

export default CodeDisplayGSAP;
