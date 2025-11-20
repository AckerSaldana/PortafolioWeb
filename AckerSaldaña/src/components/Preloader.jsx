import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { customEases, durations } from '../utils/gsapConfig';
import { splitTextToChars } from '../utils/textAnimations';

/**
 * Sophisticated preloader component with award-winning loading sequence
 * Features: Counter animation, text reveal, progress bar, dramatic exit
 */
export default function Preloader({ onComplete }) {
  const preloaderRef = useRef(null);
  const counterRef = useRef(null);
  const nameRef = useRef(null);
  const progressBarRef = useRef(null);
  const overlayRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Prepare text for character-by-character animation
    if (nameRef.current && !isReady) {
      const text = nameRef.current.textContent;
      nameRef.current.innerHTML = splitTextToChars(text);
      setIsReady(true);
    }
  }, [isReady]);

  useEffect(() => {
    if (!isReady) return;

    // Failsafe: always complete after 4 seconds
    const failsafeTimer = setTimeout(() => {
      console.log('Preloader failsafe triggered');
      if (onComplete) onComplete();
    }, 4000);

    // Create master timeline for loading sequence
    const tl = gsap.timeline({
      onComplete: () => {
        clearTimeout(failsafeTimer);
        if (onComplete) onComplete();
        // Remove from DOM after animation completes
        setTimeout(() => {
          if (preloaderRef.current) {
            preloaderRef.current.remove();
          }
        }, 500);
      },
    });

    // Animated counter object
    const counter = { value: 0 };

    // Step 1: Counter animation (0-100%) - FASTER for testing
    tl.to(counter, {
      value: 100,
      duration: 1.5, // Reduced from 2.5
      ease: 'power2.inOut',
      onUpdate: () => {
        if (counterRef.current) {
          counterRef.current.textContent = Math.floor(counter.value) + '%';
        }
      },
    });

    // Step 2: Progress bar fill (runs simultaneously with counter)
    tl.to(
      progressBarRef.current,
      {
        scaleX: 1,
        duration: 1.5, // Reduced from 2.5
        ease: 'power2.inOut',
      },
      0 // Start at beginning
    );

    // Step 3: Name reveal character by character (starts at 40% of loading)
    tl.fromTo(
      gsap.utils.toArray(`${nameRef.current} .char`),
      {
        opacity: 0,
        y: 30,
        rotationX: -90,
      },
      {
        opacity: 1,
        y: 0,
        rotationX: 0,
        duration: 0.6,
        stagger: 0.03,
        ease: customEases.bounce,
      },
      1 // Start at 1 second
    );

    // Step 4: Pause briefly at 100%
    tl.to({}, { duration: 0.3 });

    // Step 5: Scale up counter before exit
    tl.to(counterRef.current, {
      scale: 1.2,
      opacity: 0,
      duration: 0.4,
      ease: customEases.smooth,
    });

    // Step 6: Exit animation - split screen reveal
    tl.to(
      [overlayRef.current?.children[0], overlayRef.current?.children[1]],
      {
        scaleY: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: customEases.dramatic,
        transformOrigin: 'top',
      },
      '-=0.2'
    );

    // Step 7: Fade out entire preloader
    tl.to(
      preloaderRef.current,
      {
        opacity: 0,
        duration: 0.5,
        ease: customEases.smooth,
      },
      '-=0.3'
    );

    // Cleanup
    return () => {
      clearTimeout(failsafeTimer);
      tl.kill();
    };
  }, [isReady, onComplete]);

  return (
    <div
      ref={preloaderRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-midnight pointer-events-none"
      style={{ willChange: 'opacity' }}
    >
      {/* Split screen overlay for dramatic exit */}
      <div
        ref={overlayRef}
        className="absolute inset-0 flex flex-col"
        style={{ willChange: 'transform' }}
      >
        <div className="flex-1 bg-midnight" style={{ transformOrigin: 'top' }} />
        <div className="flex-1 bg-midnight" style={{ transformOrigin: 'bottom' }} />
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-8">
        {/* Animated counter */}
        <div
          ref={counterRef}
          className="text-6xl md:text-8xl font-bold text-accent mb-8"
          style={{
            fontFamily: 'var(--font-mono)',
            willChange: 'transform, opacity',
          }}
        >
          0%
        </div>

        {/* Name reveal */}
        <div
          ref={nameRef}
          className="text-3xl md:text-5xl font-bold text-pearl mb-12"
          style={{
            fontFamily: 'var(--font-mono)',
            perspective: '1000px',
          }}
        >
          ACKER SALDAÑA
        </div>

        {/* Progress bar container */}
        <div className="w-64 md:w-96 h-1 bg-charcoal rounded-full overflow-hidden mx-auto relative">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/30 to-transparent blur-lg" />

          {/* Progress bar fill */}
          <div
            ref={progressBarRef}
            className="h-full bg-accent rounded-full origin-left"
            style={{
              transform: 'scaleX(0)',
              willChange: 'transform',
              boxShadow: '0 0 20px rgba(74, 158, 255, 0.8)',
            }}
          />
        </div>

        {/* Loading text */}
        <div className="mt-6 text-silver text-sm tracking-widest">
          LOADING EXPERIENCE...
        </div>
      </div>
    </div>
  );
}
