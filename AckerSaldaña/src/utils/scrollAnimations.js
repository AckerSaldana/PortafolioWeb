import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { customEases, durations, staggerPresets } from './gsapConfig';

/**
 * Create a fade-in animation on scroll
 * @param {HTMLElement|string} element - Element or selector
 * @param {Object} options - ScrollTrigger and animation options
 * @returns {gsap.core.Timeline}
 */
export const fadeInOnScroll = (element, options = {}) => {
  const {
    trigger = element,
    start = 'top 80%',
    end = 'bottom 20%',
    scrub = false,
    markers = false,
    y = 50,
    duration = durations.normal,
    ease = customEases.smooth,
  } = options;

  return gsap.fromTo(
    element,
    {
      opacity: 0,
      y,
    },
    {
      opacity: 1,
      y: 0,
      duration: scrub ? undefined : duration,
      ease,
      scrollTrigger: {
        trigger,
        start,
        end,
        scrub,
        markers,
        toggleActions: 'play none none reverse',
      },
      force3D: true,
    }
  );
};

/**
 * Create a parallax effect on scroll
 * @param {HTMLElement|string} element - Element or selector
 * @param {Object} options - Parallax options
 * @returns {gsap.core.Tween}
 */
export const parallaxOnScroll = (element, options = {}) => {
  const {
    trigger = element,
    start = 'top bottom',
    end = 'bottom top',
    yPercent = 50,
    markers = false,
  } = options;

  return gsap.fromTo(
    element,
    {
      yPercent: -yPercent,
    },
    {
      yPercent: yPercent,
      ease: 'none',
      scrollTrigger: {
        trigger,
        start,
        end,
        scrub: 1,
        markers,
      },
      force3D: true,
    }
  );
};

/**
 * Create a scale animation on scroll
 * @param {HTMLElement|string} element - Element or selector
 * @param {Object} options - Scale options
 * @returns {gsap.core.Tween}
 */
export const scaleOnScroll = (element, options = {}) => {
  const {
    trigger = element,
    start = 'top 80%',
    end = 'bottom 20%',
    fromScale = 0.8,
    toScale = 1,
    scrub = false,
    markers = false,
  } = options;

  return gsap.fromTo(
    element,
    {
      scale: fromScale,
      opacity: 0,
    },
    {
      scale: toScale,
      opacity: 1,
      scrollTrigger: {
        trigger,
        start,
        end,
        scrub,
        markers,
        toggleActions: 'play none none reverse',
      },
      force3D: true,
    }
  );
};

/**
 * Pin an element while scrolling
 * @param {HTMLElement|string} element - Element or selector
 * @param {Object} options - Pin options
 * @returns {ScrollTrigger}
 */
export const pinElement = (element, options = {}) => {
  const {
    start = 'top top',
    end = '+=100%',
    pinSpacing = true,
    markers = false,
  } = options;

  return ScrollTrigger.create({
    trigger: element,
    start,
    end,
    pin: true,
    pinSpacing,
    markers,
  });
};

/**
 * Create a horizontal scroll section
 * @param {HTMLElement|string} container - Container element
 * @param {HTMLElement|string} itemsSelector - Items to scroll horizontally
 * @param {Object} options - Horizontal scroll options
 * @returns {gsap.core.Timeline}
 */
export const horizontalScroll = (container, itemsSelector, options = {}) => {
  const {
    start = 'top top',
    end = '+=300%',
    markers = false,
  } = options;

  const items = gsap.utils.toArray(itemsSelector);
  const containerEl = typeof container === 'string' ? document.querySelector(container) : container;

  if (!items.length || !containerEl) return;

  const totalWidth = items.reduce((acc, item) => acc + item.offsetWidth, 0);
  const scrollDistance = totalWidth - window.innerWidth;

  return gsap.to(items, {
    x: -scrollDistance,
    ease: 'none',
    scrollTrigger: {
      trigger: containerEl,
      start,
      end,
      scrub: 1,
      pin: true,
      anticipatePin: 1,
      markers,
    },
  });
};

/**
 * Create a staggered fade-in animation for multiple elements
 * @param {string|NodeList|Array} elements - Elements to animate
 * @param {Object} options - Animation options
 * @returns {gsap.core.Timeline}
 */
export const staggerFadeIn = (elements, options = {}) => {
  const {
    trigger,
    start = 'top 80%',
    y = 50,
    stagger = staggerPresets.normal,
    duration = durations.normal,
    ease = customEases.smooth,
    markers = false,
  } = options;

  const items = gsap.utils.toArray(elements);

  return gsap.fromTo(
    items,
    {
      opacity: 0,
      y,
    },
    {
      opacity: 1,
      y: 0,
      duration,
      stagger,
      ease,
      scrollTrigger: {
        trigger: trigger || items[0],
        start,
        markers,
        toggleActions: 'play none none reverse',
      },
      force3D: true,
    }
  );
};

/**
 * Create a reveal animation using clip-path
 * @param {HTMLElement|string} element - Element or selector
 * @param {Object} options - Reveal options
 * @returns {gsap.core.Tween}
 */
export const revealOnScroll = (element, options = {}) => {
  const {
    trigger = element,
    start = 'top 80%',
    direction = 'bottom', // 'bottom', 'top', 'left', 'right'
    duration = durations.dramatic,
    ease = customEases.dramatic,
    markers = false,
  } = options;

  const clipPaths = {
    bottom: { from: 'inset(0 0 100% 0)', to: 'inset(0 0 0% 0)' },
    top: { from: 'inset(100% 0 0 0)', to: 'inset(0% 0 0 0)' },
    left: { from: 'inset(0 100% 0 0)', to: 'inset(0 0% 0 0)' },
    right: { from: 'inset(0 0 0 100%)', to: 'inset(0 0 0 0%)' },
  };

  const clip = clipPaths[direction] || clipPaths.bottom;

  return gsap.fromTo(
    element,
    {
      clipPath: clip.from,
    },
    {
      clipPath: clip.to,
      duration,
      ease,
      scrollTrigger: {
        trigger,
        start,
        markers,
        toggleActions: 'play none none reverse',
      },
    }
  );
};

/**
 * Create a scroll-linked progress animation
 * @param {HTMLElement|string} element - Element to animate (e.g., a progress bar)
 * @param {Object} options - Progress options
 * @returns {gsap.core.Tween}
 */
export const scrollProgress = (element, options = {}) => {
  const {
    trigger,
    start = 'top top',
    end = 'bottom bottom',
    property = 'scaleX',
    from = 0,
    to = 1,
    markers = false,
  } = options;

  return gsap.fromTo(
    element,
    {
      [property]: from,
    },
    {
      [property]: to,
      ease: 'none',
      scrollTrigger: {
        trigger: trigger || document.body,
        start,
        end,
        scrub: 0.3,
        markers,
      },
    }
  );
};

/**
 * Create a batch animation for multiple elements with ScrollTrigger
 * @param {string} selector - CSS selector for elements
 * @param {Object} animationOptions - GSAP animation properties
 * @param {Object} scrollOptions - ScrollTrigger options
 */
export const batchAnimate = (selector, animationOptions = {}, scrollOptions = {}) => {
  const {
    start = 'top 85%',
    end = 'bottom 15%',
    interval = 0.1,
  } = scrollOptions;

  ScrollTrigger.batch(selector, {
    start,
    end,
    interval,
    onEnter: (batch) => {
      gsap.fromTo(
        batch,
        {
          opacity: 0,
          y: 50,
          ...animationOptions.from,
        },
        {
          opacity: 1,
          y: 0,
          duration: durations.normal,
          ease: customEases.smooth,
          stagger: staggerPresets.normal,
          force3D: true,
          ...animationOptions.to,
        }
      );
    },
    onLeave: (batch) => {
      if (scrollOptions.onLeave) {
        gsap.to(batch, scrollOptions.onLeave);
      }
    },
    onEnterBack: (batch) => {
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        duration: durations.fast,
      });
    },
    onLeaveBack: (batch) => {
      if (scrollOptions.onLeaveBack) {
        gsap.to(batch, scrollOptions.onLeaveBack);
      }
    },
  });
};

/**
 * Create a rotating element on scroll
 * @param {HTMLElement|string} element - Element or selector
 * @param {Object} options - Rotation options
 * @returns {gsap.core.Tween}
 */
export const rotateOnScroll = (element, options = {}) => {
  const {
    trigger = element,
    start = 'top bottom',
    end = 'bottom top',
    rotation = 360,
    markers = false,
  } = options;

  return gsap.fromTo(
    element,
    {
      rotation: 0,
    },
    {
      rotation,
      ease: 'none',
      scrollTrigger: {
        trigger,
        start,
        end,
        scrub: 1,
        markers,
      },
      force3D: true,
    }
  );
};

/**
 * Create color change animation on scroll
 * @param {HTMLElement|string} element - Element or selector
 * @param {Object} options - Color options
 * @returns {gsap.core.Tween}
 */
export const colorChangeOnScroll = (element, options = {}) => {
  const {
    trigger = element,
    start = 'top center',
    end = 'bottom center',
    fromColor,
    toColor,
    property = 'backgroundColor',
    markers = false,
  } = options;

  return gsap.fromTo(
    element,
    {
      [property]: fromColor,
    },
    {
      [property]: toColor,
      ease: 'none',
      scrollTrigger: {
        trigger,
        start,
        end,
        scrub: 1,
        markers,
      },
    }
  );
};

/**
 * Create a counter animation on scroll
 * @param {HTMLElement|string} element - Element or selector
 * @param {Object} options - Counter options
 */
export const animateCounter = (element, options = {}) => {
  const {
    trigger = element,
    start = 'top 80%',
    from = 0,
    to = 100,
    duration = durations.dramatic,
    ease = customEases.smooth,
    suffix = '',
    prefix = '',
  } = options;

  const el = typeof element === 'string' ? document.querySelector(element) : element;
  if (!el) return;

  const obj = { value: from };

  return gsap.to(obj, {
    value: to,
    duration,
    ease,
    scrollTrigger: {
      trigger,
      start,
      toggleActions: 'play none none reverse',
    },
    onUpdate: () => {
      el.textContent = prefix + Math.round(obj.value) + suffix;
    },
  });
};

/**
 * Utility to check if reduced motion is preferred
 * @returns {boolean}
 */
export const prefersReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Apply scroll animations with reduced motion support
 * @param {Function} animationFn - Animation function to execute
 * @param {any} fallback - Fallback value if reduced motion is preferred
 */
export const withReducedMotion = (animationFn, fallback = null) => {
  if (prefersReducedMotion()) {
    return fallback;
  }
  return animationFn();
};
