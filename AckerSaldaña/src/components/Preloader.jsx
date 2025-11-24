import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * Elegant minimal preloader
 * Clean typography and subtle animations
 */
export default function Preloader({ onComplete }) {
  const preloaderRef = useRef(null);
  const counterRef = useRef(null);
  const progressBarRef = useRef(null);
  const curtainRef = useRef(null);

  useEffect(() => {
    // Failsafe: always complete after 3.5 seconds
    const failsafeTimer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 3500);

    // Create master timeline
    const tl = gsap.timeline({
      onComplete: () => {
        clearTimeout(failsafeTimer);
        if (onComplete) onComplete();
      },
    });

    // Animated counter
    const counter = { value: 0 };

    // Stage 1: Counter and progress animation (0-2s)
    tl.to(counter, {
      value: 100,
      duration: 2,
      ease: 'power1.inOut',
      onUpdate: () => {
        if (counterRef.current) {
          const val = Math.floor(counter.value);
          counterRef.current.textContent = val.toString().padStart(3, '0');
        }
      },
    });

    // Progress bar animation (synced with counter)
    tl.to(
      progressBarRef.current,
      {
        scaleX: 1,
        duration: 2,
        ease: 'power1.inOut',
      },
      0
    );

    // Stage 2: Brief pause at 100%
    tl.to({}, { duration: 0.3 });

    // Stage 3: Fade out content
    tl.to([counterRef.current, progressBarRef.current], {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.in',
    });

    // Stage 4: Curtain slide up
    tl.to(
      curtainRef.current,
      {
        y: '-100%',
        duration: 1,
        ease: 'power3.inOut',
      },
      '-=0.2'
    );

    // Stage 5: Final fade
    tl.to(
      preloaderRef.current,
      {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.inOut',
      },
      '-=0.3'
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
      {/* Single curtain */}
      <div
        ref={curtainRef}
        className="absolute inset-0 bg-black"
        style={{ willChange: 'transform' }}
      />

      {/* Main content - centered */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-8">
        {/* Counter */}
        <div
          ref={counterRef}
          className="text-[15vw] md:text-[10vw] lg:text-[8vw] font-light leading-none text-white/90 tabular-nums"
          style={{
            fontFamily: 'var(--font-mono)',
            willChange: 'opacity',
            letterSpacing: '0.05em',
          }}
        >
          000
        </div>

        {/* Progress bar */}
        <div className="w-32 md:w-48 h-px bg-white/10 relative overflow-hidden">
          <div
            ref={progressBarRef}
            className="absolute inset-0 bg-white/80 origin-left"
            style={{
              willChange: 'transform',
              transform: 'scaleX(0)'
            }}
          />
        </div>
      </div>
    </div>
  );
}
