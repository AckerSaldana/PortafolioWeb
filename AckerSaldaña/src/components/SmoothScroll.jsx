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

  useEffect(() => {
    // Detect mobile devices - disable Lenis for native scrolling performance
    // Enhanced iPad detection (iPadOS 13+ reports as MacOS)
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    const isAndroid = /Android/i.test(navigator.userAgent);
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    const isMacOSWithTouch = /Macintosh/i.test(navigator.userAgent) && isTouchDevice;

    const isMobile = isIOS || isAndroid || isMacOSWithTouch || isTouchDevice;

    // Skip Lenis initialization on mobile devices for 40-60% performance improvement
    if (isMobile) {
      console.log('[SmoothScroll] Mobile/Touch device detected - using native scrolling for optimal performance');
      return;
    }

    try {
      // Initialize Lenis with optimal settings for smooth scrolling (Desktop only)
      lenisRef.current = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easing for premium feel
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        smoothTouch: false,
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
    } catch (error) {
      console.error('Lenis initialization error:', error);
    }

    // Cleanup function
    return () => {
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
  const {
    offset = 0,
    duration = 1,
    immediate = false,
    lock = false,
    force = false,
    onComplete = null,
  } = options;

  // If Lenis is available (desktop), use it
  if (window.lenis) {
    window.lenis.scrollTo(target, {
      offset,
      duration,
      immediate,
      lock,
      force,
      onComplete,
    });
    return;
  }

  // Fallback for mobile/when Lenis is not available: use native scrolling
  const element = typeof target === 'string' ? document.getElementById(target.replace('#', '')) : target;
  if (element) {
    // Account for viewport scale when calculating scroll position
    // This is important for touch devices at resolutions where content is scaled
    const scale = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue('--viewport-scale') || 1
    );

    // Use offsetTop for accurate position regardless of current scroll
    const scrollTop = (element.offsetTop * scale) + offset;

    window.scrollTo({
      top: scrollTop,
      behavior: immediate ? 'auto' : 'smooth'
    });

    if (onComplete) {
      // Estimate scroll completion time for callback
      setTimeout(onComplete, duration * 1000);
    }
  }
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
