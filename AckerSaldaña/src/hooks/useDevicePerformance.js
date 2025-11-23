import { useState, useEffect, useRef } from 'react';

// Detect mobile IMMEDIATELY (synchronously) to avoid blur flash on mobile
const detectMobile = () => {
  if (typeof window === 'undefined') return false;

  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isAndroid = /Android/i.test(navigator.userAgent);
  const isOtherMobile = /webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  // Detect iPad masquerading as desktop (iPadOS 13+)
  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  const isMacOSWithTouch = /Macintosh/i.test(navigator.userAgent) && isTouchDevice;

  return isIOS || isAndroid || isOtherMobile || isMacOSWithTouch;
};

const useDevicePerformance = () => {
  // Initialize isMobile SYNCHRONOUSLY to prevent blur flash
  const [isMobile] = useState(() => detectMobile());
  const [performance, setPerformance] = useState('high');
  const [fps, setFps] = useState(60);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const performanceRef = useRef('high');
  const isMonitoringRef = useRef(true);

  useEffect(() => {
    // Check device capabilities
    const checkPerformance = () => {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

      if (!gl) {
        setPerformance('low');
        return;
      }

      // Check device memory (if available)
      const memory = navigator.deviceMemory || 4;

      // Check hardware concurrency (CPU cores)
      const cores = navigator.hardwareConcurrency || 4;

      // Check connection type
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      const connectionType = connection?.effectiveType || '4g';

      // Determine performance level
      let detectedPerformance = 'high';
      if (memory < 4 || cores < 4 || connectionType === '2g' || connectionType === '3g') {
        detectedPerformance = 'low';
      } else if (isMobile || memory < 8) {
        detectedPerformance = 'medium';
      }

      setPerformance(detectedPerformance);
      performanceRef.current = detectedPerformance;

      // Cleanup
      canvas.remove();
    };

    checkPerformance();

    // Check for prefers-reduced-motion
    const checkReducedMotion = () => {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);

      // Listen for changes
      const handleChange = (e) => setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener('change', handleChange);

      return () => mediaQuery.removeEventListener('change', handleChange);
    };

    const cleanupReducedMotion = checkReducedMotion();

    // Monitor FPS - check if performance API is available
    // Stop monitoring after 10 seconds to save CPU
    let animationId;
    const monitoringStartTime = Date.now();
    const MONITORING_DURATION = 10000; // 10 seconds

    if (typeof window !== 'undefined' && window.performance && window.performance.now) {
      let frameCount = 0;
      let lastTime = window.performance.now();

      const measureFPS = () => {
        if (!isMonitoringRef.current || Date.now() - monitoringStartTime > MONITORING_DURATION) {
          // Stop monitoring after stabilization period
          if (animationId) {
            cancelAnimationFrame(animationId);
          }
          return;
        }

        frameCount++;
        const currentTime = window.performance.now();

        if (currentTime >= lastTime + 1000) {
          const currentFps = Math.round((frameCount * 1000) / (currentTime - lastTime));
          setFps(currentFps);
          frameCount = 0;
          lastTime = currentTime;

          // Auto-adjust quality based on FPS using ref to avoid stale closure
          if (currentFps < 20 && performanceRef.current !== 'low') {
            setPerformance('low');
            performanceRef.current = 'low';
          } else if (currentFps < 40 && performanceRef.current === 'high') {
            setPerformance('medium');
            performanceRef.current = 'medium';
          }
        }

        animationId = requestAnimationFrame(measureFPS);
      };

      measureFPS();
    } else {
      // Fallback for browsers without performance.now
      let frameCount = 0;
      let lastTime = Date.now();

      const measureFPS = () => {
        if (!isMonitoringRef.current || Date.now() - monitoringStartTime > MONITORING_DURATION) {
          // Stop monitoring after stabilization period
          if (animationId) {
            cancelAnimationFrame(animationId);
          }
          return;
        }

        frameCount++;
        const currentTime = Date.now();

        if (currentTime >= lastTime + 1000) {
          const currentFps = Math.round((frameCount * 1000) / (currentTime - lastTime));
          setFps(currentFps);
          frameCount = 0;
          lastTime = currentTime;

          // Auto-adjust quality based on FPS using ref to avoid stale closure
          if (currentFps < 20 && performanceRef.current !== 'low') {
            setPerformance('low');
            performanceRef.current = 'low';
          } else if (currentFps < 40 && performanceRef.current === 'high') {
            setPerformance('medium');
            performanceRef.current = 'medium';
          }
        }

        animationId = requestAnimationFrame(measureFPS);
      };

      measureFPS();
    }

    return () => {
      isMonitoringRef.current = false;
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      if (cleanupReducedMotion) {
        cleanupReducedMotion();
      }
    };
  }, []); // Empty dependency array - run once on mount

  return { performance, fps, isMobile, prefersReducedMotion };
};

export default useDevicePerformance;