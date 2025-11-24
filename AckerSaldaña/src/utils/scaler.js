import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * ResponsiveScaler - Maintains exact proportions across screen sizes
 *
 * Scales the entire application based on a design base size (1920x1080)
 * while maintaining exact proportions. Works with GSAP ScrollTrigger and Lenis.
 *
 * @class ResponsiveScaler
 */
export class ResponsiveScaler {
  /**
   * @param {Object} options - Configuration options
   * @param {HTMLElement} options.wrapper - The wrapper element to scale
   * @param {number} options.designWidth - Base design width (default: 1920)
   * @param {number} options.designHeight - Base design height (default: 1080)
   * @param {number} options.minScale - Minimum scale limit (default: 0.3)
   * @param {number} options.maxScale - Maximum scale limit (default: 1.0, recommended: 1.0 to prevent upscaling)
   * @param {number} options.mobileBreakpoint - Disable scaling below this width (default: 768)
   * @param {number} options.debounceDelay - Resize debounce delay in ms (default: 150)
   * @param {boolean} options.centerContent - Center content when extra space (default: true)
   * @param {Function} options.onScale - Callback after scaling (optional)
   */
  constructor(options = {}) {
    this.wrapper = options.wrapper;
    this.designWidth = options.designWidth || 1920;
    this.designHeight = options.designHeight || 1080;
    this.minScale = options.minScale || 0.3;
    this.maxScale = options.maxScale !== undefined ? options.maxScale : 1.0; // Default to 1.0 to prevent upscaling
    this.mobileBreakpoint = options.mobileBreakpoint || 768;
    this.debounceDelay = options.debounceDelay || 150;
    this.centerContent = options.centerContent !== false;
    this.onScale = options.onScale || null;

    this.currentScale = 1;
    this.resizeTimeout = null;
    this.isInitialized = false;

    if (!this.wrapper) {
      console.warn('ResponsiveScaler: No wrapper element provided');
      return;
    }

    this.init();
  }

  /**
   * Initialize the scaler
   */
  init() {
    if (this.isInitialized) return;

    // Set wrapper styles for scaling
    this.wrapper.style.transformOrigin = 'top left';
    this.wrapper.style.width = `${this.designWidth}px`;
    this.wrapper.style.position = 'relative';

    // Initial scale calculation
    this.updateScale(false); // No animation on init

    // Listen to window resize
    window.addEventListener('resize', this.handleResize.bind(this));

    // Listen to orientation change (mobile/tablet)
    if (window.screen?.orientation) {
      window.screen.orientation.addEventListener('change', this.handleResize.bind(this));
    }

    this.isInitialized = true;
  }

  /**
   * Handle window resize with debouncing
   */
  handleResize() {
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => {
      this.updateScale(true); // With animation
    }, this.debounceDelay);
  }

  /**
   * Calculate and apply scale
   * @param {boolean} animate - Whether to animate the scale change
   */
  updateScale(animate = true) {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Disable scaling on mobile - use responsive design instead
    if (viewportWidth < this.mobileBreakpoint) {
      this.removeScale(animate);
      return;
    }

    // Calculate scale based on width only for horizontal scaling
    // This allows content to scroll vertically naturally
    let scale = viewportWidth / this.designWidth;

    // Clamp to min/max limits
    scale = Math.max(this.minScale, Math.min(this.maxScale, scale));

    // Calculate horizontal offset for centering (usually 0 when scaling by width)
    const scaledWidth = this.designWidth * scale;
    const offsetX = this.centerContent ? (viewportWidth - scaledWidth) / 2 : 0;
    const offsetY = 0; // No vertical offset - allow natural scrolling

    this.currentScale = scale;

    // Set CSS custom property for viewport height correction
    // This allows vh units to work correctly with scaling
    // Usage: height: calc(100vh / var(--viewport-scale))
    document.documentElement.style.setProperty('--viewport-scale', scale.toString());

    // Apply scale with GSAP for smooth animation
    if (animate) {
      gsap.to(this.wrapper, {
        scale: scale,
        x: offsetX,
        y: offsetY,
        duration: 0.3,
        ease: 'power2.out',
        onComplete: () => {
          this.adjustWrapperHeight(scale);
          this.refreshScrollTrigger();
          this.refreshLenis();
          if (this.onScale) {
            this.onScale(scale, offsetX, offsetY);
          }
        }
      });
    } else {
      gsap.set(this.wrapper, {
        scale: scale,
        x: offsetX,
        y: offsetY
      });
      // Adjust wrapper height and refresh ScrollTrigger
      setTimeout(() => {
        this.adjustWrapperHeight(scale);
        this.refreshScrollTrigger();
        this.refreshLenis();
      }, 100);
    }
  }

  /**
   * Adjust wrapper height to match scaled content
   * CRITICAL: Prevents empty space by setting wrapper height to actualScaledHeight
   * @param {number} scale - Current scale factor
   */
  adjustWrapperHeight(scale) {
    if (!this.wrapper) return;

    // Get the natural content height (before any height constraints)
    // We need to temporarily remove height constraints to get true content height
    const originalHeight = this.wrapper.style.height;
    this.wrapper.style.height = 'auto';

    // Get the actual content height
    const contentHeight = this.wrapper.scrollHeight;

    // Calculate the scaled height (visual height after transform)
    const scaledHeight = contentHeight * scale;

    // Set wrapper to the scaled height to eliminate empty space
    this.wrapper.style.height = `${scaledHeight}px`;

    // Store for reference
    document.documentElement.style.setProperty('--scaled-height', `${scaledHeight}px`);

    console.log(`[ResponsiveScaler] Scale: ${scale.toFixed(2)}, Content: ${contentHeight}px, Scaled: ${scaledHeight}px`);
  }

  /**
   * Remove scaling (for mobile)
   * @param {boolean} animate - Whether to animate the removal
   */
  removeScale(animate = true) {
    // Reset viewport scale variable for mobile
    document.documentElement.style.setProperty('--viewport-scale', '1');

    if (animate) {
      gsap.to(this.wrapper, {
        scale: 1,
        x: 0,
        y: 0,
        duration: 0.3,
        ease: 'power2.out',
        onComplete: () => {
          this.wrapper.style.width = '100%';
          this.wrapper.style.height = 'auto'; // Reset height on mobile
          this.refreshScrollTrigger();
          this.refreshLenis();
        }
      });
    } else {
      gsap.set(this.wrapper, {
        scale: 1,
        x: 0,
        y: 0
      });
      this.wrapper.style.width = '100%';
      this.wrapper.style.height = 'auto'; // Reset height on mobile
    }

    this.currentScale = 1;
  }

  /**
   * Refresh GSAP ScrollTrigger after scaling
   */
  refreshScrollTrigger() {
    if (ScrollTrigger) {
      ScrollTrigger.refresh();
    }
  }

  /**
   * Refresh Lenis smooth scroll after scaling
   */
  refreshLenis() {
    if (window.lenis) {
      window.lenis.resize();
    }
  }

  /**
   * Get current scale value
   * @returns {number} Current scale
   */
  getScale() {
    return this.currentScale;
  }

  /**
   * Manually trigger a scale update
   * @param {boolean} animate - Whether to animate
   */
  refresh(animate = true) {
    this.updateScale(animate);
  }

  /**
   * Destroy the scaler and remove event listeners
   */
  destroy() {
    window.removeEventListener('resize', this.handleResize.bind(this));
    if (window.screen?.orientation) {
      window.screen.orientation.removeEventListener('change', this.handleResize.bind(this));
    }

    // Reset wrapper styles
    gsap.set(this.wrapper, {
      scale: 1,
      x: 0,
      y: 0,
      clearProps: 'transform'
    });
    this.wrapper.style.width = '';
    this.wrapper.style.transformOrigin = '';
    this.wrapper.style.position = '';

    this.isInitialized = false;
  }
}

export default ResponsiveScaler;
