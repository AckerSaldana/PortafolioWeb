import { useEffect, useRef } from 'react';
import { ResponsiveScaler } from '../utils/scaler';

/**
 * useResponsiveScaler Hook
 *
 * React hook to integrate ResponsiveScaler with React components
 * Automatically handles initialization and cleanup
 *
 * @param {Object} options - Scaler configuration options
 * @param {number} options.designWidth - Base design width (default: 1920)
 * @param {number} options.designHeight - Base design height (default: 1080)
 * @param {number} options.minScale - Minimum scale limit (default: 0.3)
 * @param {number} options.maxScale - Maximum scale limit (default: 1.0, recommended: 1.0 to prevent upscaling on large screens)
 * @param {number} options.mobileBreakpoint - Disable scaling below this width (default: 768)
 * @param {number} options.debounceDelay - Resize debounce delay in ms (default: 150)
 * @param {boolean} options.centerContent - Center content when extra space (default: true)
 * @param {Function} options.onScale - Callback after scaling (optional)
 * @param {boolean} options.enabled - Enable/disable the scaler (default: true)
 * @returns {Object} - { wrapperRef, scalerRef, refresh }
 */
export const useResponsiveScaler = (options = {}) => {
  const wrapperRef = useRef(null);
  const scalerRef = useRef(null);
  const enabled = options.enabled !== false;

  useEffect(() => {
    if (!enabled || !wrapperRef.current) return;

    // Initialize the scaler
    scalerRef.current = new ResponsiveScaler({
      wrapper: wrapperRef.current,
      ...options
    });

    // Cleanup on unmount
    return () => {
      if (scalerRef.current) {
        scalerRef.current.destroy();
        scalerRef.current = null;
      }
    };
  }, [enabled]); // Only re-init if enabled changes

  /**
   * Manually refresh the scaler
   * @param {boolean} animate - Whether to animate the refresh
   */
  const refresh = (animate = true) => {
    if (scalerRef.current) {
      scalerRef.current.refresh(animate);
    }
  };

  /**
   * Get current scale value
   * @returns {number} Current scale
   */
  const getScale = () => {
    if (scalerRef.current) {
      return scalerRef.current.getScale();
    }
    return 1;
  };

  return {
    wrapperRef,
    scalerRef,
    refresh,
    getScale
  };
};

export default useResponsiveScaler;
