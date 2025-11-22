import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

/**
 * Award-winning preloader with dramatic entrance
 * Inspired by Awwwards Site of the Year aesthetics
 */
export default function Preloader({ onComplete }) {
  const preloaderRef = useRef(null);
  const counterRef = useRef(null);
  const textRef = useRef(null);
  const curtainLeftRef = useRef(null);
  const curtainRightRef = useRef(null);
  const orbitRef = useRef(null);

  useEffect(() => {
    // Failsafe: always complete after 4.5 seconds
    const failsafeTimer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 4500);

    // Create master timeline
    const tl = gsap.timeline({
      onComplete: () => {
        clearTimeout(failsafeTimer);
        if (onComplete) onComplete();
      },
    });

    // Animated counter
    const counter = { value: 0 };

    // Stage 1: Counter animation with easing (0-2s)
    tl.to(counter, {
      value: 100,
      duration: 2,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (counterRef.current) {
          const val = Math.floor(counter.value);
          counterRef.current.textContent = val.toString().padStart(2, '0');
        }
      },
    });

    // Orbit rotation (continuous during loading)
    tl.to(
      orbitRef.current,
      {
        rotation: 360,
        duration: 2,
        ease: 'none',
        repeat: -1,
      },
      0
    );

    // Text fade in
    tl.fromTo(
      textRef.current,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
      },
      0.5
    );

    // Stage 2: Pause at 100%
    tl.to({}, { duration: 0.4 });

    // Stage 3: Counter scale out
    tl.to(counterRef.current, {
      scale: 1.5,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.in',
    });

    // Stage 4: Curtain reveal - dramatic split
    tl.to(
      curtainLeftRef.current,
      {
        x: '-100%',
        duration: 1.4,
        ease: 'power4.inOut',
      },
      '-=0.3'
    );

    tl.to(
      curtainRightRef.current,
      {
        x: '100%',
        duration: 1.4,
        ease: 'power4.inOut',
      },
      '<'
    );

    // Stage 5: Final fade
    tl.to(
      preloaderRef.current,
      {
        opacity: 0,
        duration: 0.4,
        ease: 'power2.inOut',
      },
      '-=0.4'
    );

    return () => {
      clearTimeout(failsafeTimer);
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div
      ref={preloaderRef}
      className="fixed inset-0 z-[9999] pointer-events-none"
      style={{ willChange: 'opacity' }}
    >
      {/* Curtain left */}
      <div
        ref={curtainLeftRef}
        className="absolute top-0 left-0 bottom-0 w-1/2 bg-black"
        style={{ willChange: 'transform' }}
      />

      {/* Curtain right */}
      <div
        ref={curtainRightRef}
        className="absolute top-0 right-0 bottom-0 w-1/2 bg-black"
        style={{ willChange: 'transform' }}
      />

      {/* Main content - centered */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative text-center">
          {/* Rotating orbit ring */}
          <div
            ref={orbitRef}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 md:w-56 md:h-56 pointer-events-none"
            style={{ willChange: 'transform' }}
          >
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 200 200"
              className="opacity-20"
            >
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4a9eff" />
                  <stop offset="50%" stopColor="#7b61ff" />
                  <stop offset="100%" stopColor="#4aefff" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Counter */}
          <div
            ref={counterRef}
            className="text-[20vw] md:text-[15vw] lg:text-[12vw] font-black leading-none mb-4"
            style={{
              background: 'linear-gradient(135deg, #4a9eff 0%, #7b61ff 50%, #4aefff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontFamily: 'var(--font-mono)',
              willChange: 'transform, opacity',
            }}
          >
            00
          </div>

          {/* Loading text */}
          <div
            ref={textRef}
            className="text-white/40 text-xs md:text-sm tracking-[0.3em] font-light uppercase"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Loading Experience
          </div>
        </div>
      </div>

      {/* Corner accents */}
      <div className="absolute top-8 left-8 w-12 h-12 border-l border-t border-white/10" />
      <div className="absolute top-8 right-8 w-12 h-12 border-r border-t border-white/10" />
      <div className="absolute bottom-8 left-8 w-12 h-12 border-l border-b border-white/10" />
      <div className="absolute bottom-8 right-8 w-12 h-12 border-r border-b border-white/10" />
    </div>
  );
}
