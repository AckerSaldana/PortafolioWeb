import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * ScrollProgress component - shows page scroll progress
 * Fixed bar at top of screen that fills as user scrolls
 */
export default function ScrollProgress() {
  const progressRef = useRef(null);

  useEffect(() => {
    if (!progressRef.current) {
      console.warn('[ScrollProgress] progressRef is not set');
      return;
    }

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      if (!progressRef.current) return;

      try {
        // Create scroll-linked progress animation
        const progressTween = gsap.to(progressRef.current, {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: document.body,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.3,
            invalidateOnRefresh: true,
          },
        });

        // Store the timeline for cleanup
        return () => {
          if (progressTween) {
            progressTween.kill();
          }
        };
      } catch (error) {
        console.error('[ScrollProgress] Error creating animation:', error);
      }
    }, 100);

    // Cleanup
    return () => {
      clearTimeout(timeoutId);
      // Clean up ScrollTriggers more carefully
      const triggers = ScrollTrigger.getAll();
      triggers.forEach(trigger => {
        if (trigger.vars?.trigger === document.body) {
          trigger.kill();
        }
      });
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[9998] h-1 bg-charcoal/30 pointer-events-none">
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/20 to-transparent blur-md" />

      {/* Progress bar */}
      <div
        ref={progressRef}
        className="h-full bg-accent origin-left"
        style={{
          transform: 'scaleX(0)',
          willChange: 'transform',
          boxShadow: '0 0 15px rgba(74, 158, 255, 0.6)',
        }}
      />
    </div>
  );
}
