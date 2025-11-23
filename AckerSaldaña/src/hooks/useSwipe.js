import { useEffect, useRef, useState } from 'react';

/**
 * useSwipe hook for detecting swipe gestures on touch devices
 * Provides touch-based navigation with visual feedback
 *
 * @param {Object} options - Configuration options
 * @param {number} options.minSwipeDistance - Minimum distance in pixels to trigger swipe (default: 50)
 * @param {number} options.minSwipeVelocity - Minimum velocity to trigger swipe (default: 0.3)
 * @param {Function} options.onSwipeLeft - Callback for left swipe
 * @param {Function} options.onSwipeRight - Callback for right swipe
 * @param {Function} options.onSwipeUp - Callback for up swipe
 * @param {Function} options.onSwipeDown - Callback for down swipe
 * @param {boolean} options.preventDefaultTouchmoveEvent - Prevent default touchmove behavior (default: false)
 * @returns {Object} - { ref, swipeDirection, swipeProgress }
 */
export default function useSwipe(options = {}) {
  const {
    minSwipeDistance = 50,
    minSwipeVelocity = 0.3,
    onSwipeLeft = null,
    onSwipeRight = null,
    onSwipeUp = null,
    onSwipeDown = null,
    preventDefaultTouchmoveEvent = false
  } = options;

  const elementRef = useRef(null);
  const touchStartRef = useRef(null);
  const touchMoveRef = useRef(null);
  const touchStartTimeRef = useRef(null);

  const [swipeDirection, setSwipeDirection] = useState(null); // 'left' | 'right' | 'up' | 'down' | null
  const [swipeProgress, setSwipeProgress] = useState(0); // 0-1 value representing swipe progress
  const [isSwiping, setIsSwiping] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleTouchStart = (e) => {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      };
      touchStartTimeRef.current = Date.now();
      setIsSwiping(true);
      setSwipeDirection(null);
      setSwipeProgress(0);
    };

    const handleTouchMove = (e) => {
      if (!touchStartRef.current) return;

      if (preventDefaultTouchmoveEvent) {
        e.preventDefault();
      }

      touchMoveRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      };

      const deltaX = touchMoveRef.current.x - touchStartRef.current.x;
      const deltaY = touchMoveRef.current.y - touchStartRef.current.y;
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      // Determine primary direction
      if (absX > absY) {
        // Horizontal swipe
        const direction = deltaX > 0 ? 'right' : 'left';
        setSwipeDirection(direction);
        setSwipeProgress(Math.min(1, absX / (minSwipeDistance * 2)));
      } else {
        // Vertical swipe
        const direction = deltaY > 0 ? 'down' : 'up';
        setSwipeDirection(direction);
        setSwipeProgress(Math.min(1, absY / (minSwipeDistance * 2)));
      }
    };

    const handleTouchEnd = (e) => {
      if (!touchStartRef.current || !touchMoveRef.current) {
        setIsSwiping(false);
        setSwipeProgress(0);
        setSwipeDirection(null);
        return;
      }

      const deltaX = touchMoveRef.current.x - touchStartRef.current.x;
      const deltaY = touchMoveRef.current.y - touchStartRef.current.y;
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      const touchEndTime = Date.now();
      const touchDuration = touchEndTime - touchStartTimeRef.current;
      const velocity = Math.max(absX, absY) / touchDuration;

      // Check if swipe meets minimum requirements
      if (absX > absY) {
        // Horizontal swipe
        if (absX >= minSwipeDistance && velocity >= minSwipeVelocity) {
          if (deltaX > 0) {
            // Swipe right
            if (onSwipeRight) {
              onSwipeRight({ distance: absX, velocity, duration: touchDuration });
            }
          } else {
            // Swipe left
            if (onSwipeLeft) {
              onSwipeLeft({ distance: absX, velocity, duration: touchDuration });
            }
          }
        }
      } else {
        // Vertical swipe
        if (absY >= minSwipeDistance && velocity >= minSwipeVelocity) {
          if (deltaY > 0) {
            // Swipe down
            if (onSwipeDown) {
              onSwipeDown({ distance: absY, velocity, duration: touchDuration });
            }
          } else {
            // Swipe up
            if (onSwipeUp) {
              onSwipeUp({ distance: absY, velocity, duration: touchDuration });
            }
          }
        }
      }

      // Reset state
      touchStartRef.current = null;
      touchMoveRef.current = null;
      touchStartTimeRef.current = null;
      setIsSwiping(false);
      setSwipeProgress(0);

      // Clear swipe direction after a short delay for visual feedback
      setTimeout(() => {
        setSwipeDirection(null);
      }, 300);
    };

    const handleTouchCancel = () => {
      touchStartRef.current = null;
      touchMoveRef.current = null;
      touchStartTimeRef.current = null;
      setIsSwiping(false);
      setSwipeProgress(0);
      setSwipeDirection(null);
    };

    // Add touch event listeners
    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: !preventDefaultTouchmoveEvent });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });
    element.addEventListener('touchcancel', handleTouchCancel, { passive: true });

    // Cleanup
    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
      element.removeEventListener('touchcancel', handleTouchCancel);
    };
  }, [
    minSwipeDistance,
    minSwipeVelocity,
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    preventDefaultTouchmoveEvent
  ]);

  return {
    ref: elementRef,
    swipeDirection,
    swipeProgress,
    isSwiping
  };
}

/**
 * useSwipeHorizontal - Simplified hook for horizontal swiping only
 * Perfect for carousels and galleries
 */
export function useSwipeHorizontal(options = {}) {
  const {
    onSwipeLeft,
    onSwipeRight,
    ...restOptions
  } = options;

  return useSwipe({
    ...restOptions,
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp: null,
    onSwipeDown: null
  });
}

/**
 * useSwipeVertical - Simplified hook for vertical swiping only
 * Perfect for lists and scrollable content
 */
export function useSwipeVertical(options = {}) {
  const {
    onSwipeUp,
    onSwipeDown,
    ...restOptions
  } = options;

  return useSwipe({
    ...restOptions,
    onSwipeLeft: null,
    onSwipeRight: null,
    onSwipeUp,
    onSwipeDown
  });
}
