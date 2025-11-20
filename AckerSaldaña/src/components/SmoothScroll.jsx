import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * SmoothScroll component that wraps the app with Lenis smooth scrolling
 * and integrates it with GSAP ScrollTrigger for award-winning scroll experience
 */
export default function SmoothScroll({ children }) {
  const lenisRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    try {
      // Initialize Lenis with optimal settings for smooth scrolling
      lenisRef.current = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easing for premium feel
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        smoothTouch: false, // Disable on touch devices for better native feel
        touchMultiplier: 2,
        infinite: false,
        autoResize: true,
      });

      // Integrate Lenis with GSAP ScrollTrigger using scrollerProxy
      lenisRef.current.on('scroll', ScrollTrigger.update);

      gsap.ticker.add((time) => {
        lenisRef.current?.raf(time * 1000);
      });

      gsap.ticker.lagSmoothing(0);

      // RequestAnimationFrame loop for Lenis
      function raf(time) {
        lenisRef.current?.raf(time);
        rafRef.current = requestAnimationFrame(raf);
      }

      rafRef.current = requestAnimationFrame(raf);
    } catch (error) {
      console.error('Lenis initialization error:', error);
    }

    // Cleanup function
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      if (lenisRef.current) {
        lenisRef.current.destroy();
      }
      gsap.ticker.remove();
    };
  }, []);

  // Expose Lenis instance globally for programmatic scrolling
  useEffect(() => {
    if (lenisRef.current) {
      window.lenis = lenisRef.current;
    }
    return () => {
      delete window.lenis;
    };
  }, []);

  return <>{children}</>;
}

/**
 * Utility function to scroll to a section smoothly
 * @param {string|HTMLElement} target - Target element or selector
 * @param {Object} options - Scroll options
 */
export const scrollTo = (target, options = {}) => {
  if (!window.lenis) return;

  const {
    offset = 0,
    duration = 1,
    immediate = false,
    lock = false,
    force = false,
    onComplete = null,
  } = options;

  window.lenis.scrollTo(target, {
    offset,
    duration,
    immediate,
    lock,
    force,
    onComplete,
  });
};

/**
 * Utility function to stop smooth scroll
 */
export const stopScroll = () => {
  if (!window.lenis) return;
  window.lenis.stop();
};

/**
 * Utility function to start smooth scroll
 */
export const startScroll = () => {
  if (!window.lenis) return;
  window.lenis.start();
};
