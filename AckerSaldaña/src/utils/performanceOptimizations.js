/**
 * Performance Optimization Utilities
 * Best practices and helpers for maintaining 60fps on mobile devices
 */

/**
 * Strategic will-change management
 * will-change should be added BEFORE animation starts and removed AFTER it ends
 * Improper use can hurt performance more than help
 *
 * Usage:
 * const cleanup = applyWillChange(element, 'transform, opacity');
 * // ... run your animation ...
 * cleanup(); // Remove will-change after animation completes
 */

/**
 * Apply will-change to an element
 * @param {HTMLElement} element - Element to optimize
 * @param {string} properties - Properties that will change (e.g., 'transform, opacity')
 * @returns {Function} Cleanup function to remove will-change
 */
export function applyWillChange(element, properties = 'transform') {
  if (!element) return () => {};

  element.style.willChange = properties;

  // Return cleanup function
  return () => {
    if (element) {
      element.style.willChange = 'auto';
    }
  };
}

/**
 * Apply will-change before animation, remove after
 * Wraps an animation function with automatic will-change management
 * @param {HTMLElement} element - Element to animate
 * @param {Function} animationFn - Animation function that returns a promise or animation
 * @param {string} properties - Properties that will change
 * @returns {Promise} Promise that resolves when animation completes
 */
export async function animateWithWillChange(element, animationFn, properties = 'transform, opacity') {
  if (!element) return;

  // Apply will-change before animation
  const cleanup = applyWillChange(element, properties);

  try {
    // Run animation
    const animation = await animationFn();

    // If Web Animations API, wait for finish
    if (animation && animation.finished) {
      await animation.finished;
    }

    // Remove will-change after animation
    cleanup();
  } catch (error) {
    // Ensure cleanup even on error
    cleanup();
    throw error;
  }
}

/**
 * Batch DOM reads and writes using requestAnimationFrame
 * Prevents layout thrashing by separating reads from writes
 *
 * Usage:
 * batchDOMOperations({
 *   read: () => {
 *     const height = element.offsetHeight;
 *     return { height };
 *   },
 *   write: ({ height }) => {
 *     element.style.height = `${height * 2}px`;
 *   }
 * });
 */
export function batchDOMOperations({ read, write }) {
  requestAnimationFrame(() => {
    const readData = read ? read() : null;

    if (write) {
      requestAnimationFrame(() => {
        write(readData);
      });
    }
  });
}

/**
 * Debounce function for expensive operations
 * Limits how often a function can run
 * @param {Function} func - Function to debounce
 * @param {number} wait - Milliseconds to wait
 * @returns {Function} Debounced function
 */
export function debounce(func, wait = 100) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for scroll/resize handlers
 * Ensures function runs at most once per interval
 * @param {Function} func - Function to throttle
 * @param {number} limit - Milliseconds between calls
 * @returns {Function} Throttled function
 */
export function throttle(func, limit = 100) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Check if an element is in viewport
 * More performant than IntersectionObserver for one-time checks
 * @param {HTMLElement} element - Element to check
 * @param {number} offset - Offset in pixels (negative = trigger earlier)
 * @returns {boolean} True if element is in viewport
 */
export function isInViewport(element, offset = 0) {
  if (!element) return false;

  const rect = element.getBoundingClientRect();
  return (
    rect.top >= offset &&
    rect.left >= offset &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) - offset &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth) - offset
  );
}

/**
 * GPU acceleration hints
 * Forces hardware acceleration for smoother animations
 * @param {HTMLElement} element - Element to accelerate
 */
export function enableGPUAcceleration(element) {
  if (!element) return;

  element.style.backfaceVisibility = 'hidden';
  element.style.WebkitBackfaceVisibility = 'hidden';
  element.style.transform = 'translateZ(0)';
  element.style.WebkitTransform = 'translateZ(0)';
  element.style.perspective = '1000px';
  element.style.WebkitPerspective = '1000px';
}

/**
 * Passive event listener helper
 * Improves scroll performance by 10-30%
 * @param {HTMLElement} element - Element to attach listener to
 * @param {string} event - Event name
 * @param {Function} handler - Event handler
 * @param {Object} options - Additional options
 * @returns {Function} Cleanup function
 */
export function addPassiveListener(element, event, handler, options = {}) {
  if (!element) return () => {};

  const listenerOptions = { passive: true, ...options };
  element.addEventListener(event, handler, listenerOptions);

  return () => {
    element.removeEventListener(event, handler, listenerOptions);
  };
}

/**
 * Performance monitoring decorator
 * Logs performance of expensive operations
 * @param {Function} fn - Function to monitor
 * @param {string} label - Label for performance logs
 * @returns {Function} Wrapped function
 */
export function measurePerformance(fn, label = 'Operation') {
  return function (...args) {
    const start = performance.now();
    const result = fn(...args);
    const end = performance.now();

    if (end - start > 16) { // Longer than 1 frame (60fps = 16.67ms)
      console.warn(`⚠️ ${label} took ${(end - start).toFixed(2)}ms (frame budget: 16ms)`);
    }

    return result;
  };
}

/**
 * Memory-efficient array operations
 * Use for large lists to prevent memory bloat
 * @param {Array} arr - Array to chunk
 * @param {number} size - Chunk size
 * @returns {Array} Array of chunks
 */
export function chunkArray(arr, size = 100) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

/**
 * Process large datasets in chunks to avoid blocking UI
 * @param {Array} items - Items to process
 * @param {Function} processor - Function to process each item
 * @param {number} chunkSize - Items per chunk
 * @returns {Promise} Promise that resolves when all items processed
 */
export function processInChunks(items, processor, chunkSize = 100) {
  return new Promise((resolve) => {
    const chunks = chunkArray(items, chunkSize);
    let currentChunk = 0;

    const processNextChunk = () => {
      if (currentChunk >= chunks.length) {
        resolve();
        return;
      }

      const chunk = chunks[currentChunk];
      chunk.forEach(processor);
      currentChunk++;

      requestAnimationFrame(processNextChunk);
    };

    processNextChunk();
  });
}

/**
 * Best Practices Documentation
 *
 * 1. ANIMATIONS:
 *    - Only animate: transform, opacity
 *    - Avoid: width, height, top, left, margin, padding
 *    - Use will-change strategically (add before, remove after)
 *    - Prefer CSS animations/transitions over JavaScript
 *    - Use Web Animations API for JavaScript control
 *
 * 2. EVENT LISTENERS:
 *    - Use passive: true for scroll/touch events
 *    - Throttle scroll handlers (100ms minimum)
 *    - Debounce resize handlers (200ms minimum)
 *    - Remove listeners in cleanup
 *
 * 3. DOM OPERATIONS:
 *    - Batch reads and writes (separate RAF calls)
 *    - Cache element references
 *    - Use IntersectionObserver instead of scroll listeners
 *    - Avoid layout thrashing (read then write, not interleaved)
 *
 * 4. MOBILE-SPECIFIC:
 *    - Target 60fps (16.67ms per frame)
 *    - Reduce particle counts (1/4 of desktop)
 *    - Disable expensive effects (blur, shadows) on low-end devices
 *    - Use lower resolution textures/images
 *    - Test on real devices, not just emulators
 *
 * 5. MEMORY:
 *    - Cancel animations on unmount
 *    - Clear timeouts and intervals
 *    - Remove event listeners
 *    - Nullify large objects when done
 *
 * 6. ACCESSIBILITY:
 *    - Respect prefers-reduced-motion
 *    - Provide alternative navigation (not just gestures)
 *    - Maintain 44px minimum touch targets
 *    - Test with screen readers
 */

export const PERFORMANCE_BEST_PRACTICES = {
  FRAME_BUDGET_MS: 16.67, // 60fps
  THROTTLE_SCROLL_MS: 100,
  DEBOUNCE_RESIZE_MS: 200,
  MIN_TOUCH_TARGET_PX: 44,
  MOBILE_PARTICLE_RATIO: 0.25, // 1/4 of desktop
  CHUNK_SIZE: 100,
};
