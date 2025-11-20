import { useState, useEffect } from 'react';

/**
 * Breakpoint definitions matching Tailwind's default breakpoints
 */
export const BREAKPOINTS = {
  mobile: 0,      // 0-767px
  tablet: 768,    // 768-1023px
  desktop: 1024,  // 1024-1439px
  wide: 1440,     // 1440px+
};

/**
 * Hook to detect current breakpoint for responsive layouts
 * Returns current breakpoint name and utilities
 */
const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState('desktop');
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  });

  useEffect(() => {
    const getBreakpoint = (width) => {
      if (width < BREAKPOINTS.tablet) return 'mobile';
      if (width < BREAKPOINTS.desktop) return 'tablet';
      if (width < BREAKPOINTS.wide) return 'desktop';
      return 'wide';
    };

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      setWindowSize({ width, height });
      setBreakpoint(getBreakpoint(width));
    };

    // Set initial breakpoint
    handleResize();

    // Add resize listener with debounce
    let timeoutId;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 150);
    };

    window.addEventListener('resize', debouncedResize);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', debouncedResize);
    };
  }, []);

  // Utility functions for common checks
  const isMobile = breakpoint === 'mobile';
  const isTablet = breakpoint === 'tablet';
  const isDesktop = breakpoint === 'desktop' || breakpoint === 'wide';
  const isWide = breakpoint === 'wide';
  const isTabletOrMobile = isMobile || isTablet;
  const isDesktopOrWide = isDesktop || isWide;

  return {
    breakpoint,
    windowSize,
    isMobile,
    isTablet,
    isDesktop,
    isWide,
    isTabletOrMobile,
    isDesktopOrWide,
  };
};

export default useBreakpoint;
