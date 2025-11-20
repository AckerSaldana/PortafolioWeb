import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

const BootSequence = ({ onComplete }) => {
  const [bootLines, setBootLines] = useState([]);
  const [progress, setProgress] = useState(0);
  const containerRef = useRef(null);
  const progressBarRef = useRef(null);

  const bootMessages = [
    { text: 'PORTFOLIO SYSTEM BOOT v2.0.1', delay: 0 },
    { text: 'Initializing core modules...', delay: 200 },
    { text: '[OK] Memory check completed', delay: 400 },
    { text: '[OK] Loading React framework...', delay: 600 },
    { text: '[OK] Mounting component tree...', delay: 800 },
    { text: '[OK] GSAP animation engine ready', delay: 1000 },
    { text: '[OK] Three.js renderer initialized', delay: 1200 },
    { text: 'Connecting to project database...', delay: 1400 },
    { text: '[OK] Projects loaded successfully', delay: 1600 },
    { text: 'Establishing terminal connection...', delay: 1800 },
    { text: '[OK] Terminal ready', delay: 2000 },
    { text: 'Starting phosphor display...', delay: 2200 },
    { text: '[OK] CRT effects enabled', delay: 2400 },
    { text: '', delay: 2600 },
    { text: 'SYSTEM READY', delay: 2800, special: true },
  ];

  useEffect(() => {
    // Add boot messages sequentially
    bootMessages.forEach((msg, index) => {
      setTimeout(() => {
        setBootLines((prev) => [...prev, msg]);
      }, msg.delay);
    });

    // Progress bar animation
    const progressTl = gsap.timeline();
    progressTl.to(
      {},
      {
        duration: 2.8,
        onUpdate: function () {
          setProgress(Math.floor(this.progress() * 100));
        },
      }
    );

    // Flash effect before completion
    setTimeout(() => {
      if (containerRef.current) {
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.in',
          onComplete: () => {
            if (onComplete) onComplete();
          },
        });
      }
    }, 3000);

    return () => {
      progressTl.kill();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-black z-[200] flex items-center justify-center font-['JetBrains_Mono']"
    >
      {/* Scanline effect */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div
          className="absolute inset-0"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #00ff00 2px, #00ff00 4px)',
          }}
        />
      </div>

      {/* CRT glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0, 255, 0, 0.03) 0%, transparent 70%)',
        }}
      />

      {/* Boot content */}
      <div className="relative z-10 w-full max-w-3xl px-8">
        {/* Header */}
        <div className="mb-8 pb-4 border-b border-[#00ff00]/30">
          <div className="text-[#00ff00] text-2xl mb-2 phosphor-glow-text">
            {'>'} ACKER SALDAÑA PORTFOLIO
          </div>
          <div className="text-[#00ff00]/60 text-sm">
            Copyright (c) 2024 | All rights reserved
          </div>
        </div>

        {/* Boot messages */}
        <div className="space-y-1 mb-8 h-80 overflow-hidden">
          {bootLines.map((line, index) => (
            <div
              key={index}
              className={`text-sm ${
                line.special
                  ? 'text-[#00ff00] text-xl font-bold phosphor-glow-text mt-4'
                  : line.text.includes('[OK]')
                  ? 'text-[#00ff00]'
                  : 'text-[#00ff00]/70'
              }`}
              style={{
                animation: 'fadeIn 0.1s ease-out',
              }}
            >
              {line.text}
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-[#00ff00]/60">
            <span>Loading...</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-2 bg-black border border-[#00ff00]/30 overflow-hidden">
            <div
              ref={progressBarRef}
              className="h-full bg-[#00ff00] phosphor-glow-box transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Blinking cursor */}
        <div className="mt-4 flex items-center gap-2 text-[#00ff00]">
          <span>{'>'}</span>
          <span className="inline-block w-2 h-4 bg-[#00ff00] animate-pulse" />
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(-4px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default BootSequence;
