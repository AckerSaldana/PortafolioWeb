/**
 * Mobile Animation Utilities using Web Animations API
 * Provides JavaScript control with CSS-level performance
 *
 * Web Animations API Benefits:
 * - Native browser API (like CSS animations)
 * - GPU-accelerated by default
 * - Full JavaScript control (play, pause, reverse, cancel)
 * - Promise-based (async/await support)
 * - Better performance than GSAP on mobile devices
 */

/**
 * Animation configuration presets
 */
export const animationConfig = {
  durations: {
    instant: 100,
    fast: 400,
    normal: 600,
    slow: 800,
    dramatic: 1000
  },
  easings: {
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
    smoothIn: 'cubic-bezier(0.4, 0, 1, 1)',
    smoothOut: 'cubic-bezier(0, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    elastic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
  }
};

/**
 * Fade in and slide up animation
 * @param {HTMLElement} element - Element to animate
 * @param {Object} options - Animation options
 * @returns {Animation} Web Animation instance
 */
export function fadeInUp(element, options = {}) {
  const {
    duration = animationConfig.durations.normal,
    easing = animationConfig.easings.smooth,
    delay = 0,
    distance = 30
  } = options;

  const keyframes = [
    {
      opacity: 0,
      transform: `translateY(${distance}px)`,
      offset: 0
    },
    {
      opacity: 1,
      transform: 'translateY(0)',
      offset: 1
    }
  ];

  const timing = {
    duration,
    easing,
    delay,
    fill: 'forwards'
  };

  return element.animate(keyframes, timing);
}

/**
 * Fade in and slide from left
 * @param {HTMLElement} element - Element to animate
 * @param {Object} options - Animation options
 * @returns {Animation} Web Animation instance
 */
export function fadeInLeft(element, options = {}) {
  const {
    duration = animationConfig.durations.normal,
    easing = animationConfig.easings.smooth,
    delay = 0,
    distance = 30
  } = options;

  const keyframes = [
    {
      opacity: 0,
      transform: `translateX(-${distance}px)`,
      offset: 0
    },
    {
      opacity: 1,
      transform: 'translateX(0)',
      offset: 1
    }
  ];

  const timing = {
    duration,
    easing,
    delay,
    fill: 'forwards'
  };

  return element.animate(keyframes, timing);
}

/**
 * Fade in and slide from right
 * @param {HTMLElement} element - Element to animate
 * @param {Object} options - Animation options
 * @returns {Animation} Web Animation instance
 */
export function fadeInRight(element, options = {}) {
  const {
    duration = animationConfig.durations.normal,
    easing = animationConfig.easings.smooth,
    delay = 0,
    distance = 30
  } = options;

  const keyframes = [
    {
      opacity: 0,
      transform: `translateX(${distance}px)`,
      offset: 0
    },
    {
      opacity: 1,
      transform: 'translateX(0)',
      offset: 1
    }
  ];

  const timing = {
    duration,
    easing,
    delay,
    fill: 'forwards'
  };

  return element.animate(keyframes, timing);
}

/**
 * Scale in animation
 * @param {HTMLElement} element - Element to animate
 * @param {Object} options - Animation options
 * @returns {Animation} Web Animation instance
 */
export function scaleIn(element, options = {}) {
  const {
    duration = animationConfig.durations.normal,
    easing = animationConfig.easings.smooth,
    delay = 0,
    fromScale = 0.95,
    toScale = 1
  } = options;

  const keyframes = [
    {
      opacity: 0,
      transform: `scale(${fromScale})`,
      offset: 0
    },
    {
      opacity: 1,
      transform: `scale(${toScale})`,
      offset: 1
    }
  ];

  const timing = {
    duration,
    easing,
    delay,
    fill: 'forwards'
  };

  return element.animate(keyframes, timing);
}

/**
 * Rotate in animation
 * @param {HTMLElement} element - Element to animate
 * @param {Object} options - Animation options
 * @returns {Animation} Web Animation instance
 */
export function rotateIn(element, options = {}) {
  const {
    duration = animationConfig.durations.normal,
    easing = animationConfig.easings.smooth,
    delay = 0,
    fromRotation = -5,
    toRotation = 0
  } = options;

  const keyframes = [
    {
      opacity: 0,
      transform: `rotate(${fromRotation}deg) scale(0.95)`,
      offset: 0
    },
    {
      opacity: 1,
      transform: `rotate(${toRotation}deg) scale(1)`,
      offset: 1
    }
  ];

  const timing = {
    duration,
    easing,
    delay,
    fill: 'forwards'
  };

  return element.animate(keyframes, timing);
}

/**
 * Simple fade in
 * @param {HTMLElement} element - Element to animate
 * @param {Object} options - Animation options
 * @returns {Animation} Web Animation instance
 */
export function fadeIn(element, options = {}) {
  const {
    duration = animationConfig.durations.fast,
    easing = animationConfig.easings.smooth,
    delay = 0
  } = options;

  const keyframes = [
    { opacity: 0, offset: 0 },
    { opacity: 1, offset: 1 }
  ];

  const timing = {
    duration,
    easing,
    delay,
    fill: 'forwards'
  };

  return element.animate(keyframes, timing);
}

/**
 * Stagger animation for multiple elements
 * Animates elements sequentially with a delay
 * @param {HTMLElement[]} elements - Array of elements to animate
 * @param {Function} animationFn - Animation function to apply
 * @param {Object} options - Animation options
 * @returns {Animation[]} Array of Animation instances
 */
export function staggerIn(elements, animationFn = fadeInUp, options = {}) {
  const {
    staggerDelay = 100,
    ...animationOptions
  } = options;

  return elements.map((element, index) => {
    if (!element) return null;

    return animationFn(element, {
      ...animationOptions,
      delay: (animationOptions.delay || 0) + (index * staggerDelay)
    });
  }).filter(Boolean);
}

/**
 * Button press animation (scale down)
 * @param {HTMLElement} element - Button element
 * @param {Object} options - Animation options
 * @returns {Animation} Web Animation instance
 */
export function buttonPress(element, options = {}) {
  const {
    duration = animationConfig.durations.instant,
    easing = animationConfig.easings.smoothOut,
    scale = 0.97
  } = options;

  const keyframes = [
    { transform: 'scale(1)', offset: 0 },
    { transform: `scale(${scale})`, offset: 1 }
  ];

  const timing = {
    duration,
    easing,
    fill: 'forwards'
  };

  return element.animate(keyframes, timing);
}

/**
 * Button release animation (scale back to normal)
 * @param {HTMLElement} element - Button element
 * @param {Object} options - Animation options
 * @returns {Animation} Web Animation instance
 */
export function buttonRelease(element, options = {}) {
  const {
    duration = animationConfig.durations.fast,
    easing = animationConfig.easings.bounce
  } = options;

  const keyframes = [
    { transform: 'scale(0.97)', offset: 0 },
    { transform: 'scale(1)', offset: 1 }
  ];

  const timing = {
    duration,
    easing,
    fill: 'forwards'
  };

  return element.animate(keyframes, timing);
}

/**
 * Pulse animation for highlighting elements
 * @param {HTMLElement} element - Element to pulse
 * @param {Object} options - Animation options
 * @returns {Animation} Web Animation instance
 */
export function pulse(element, options = {}) {
  const {
    duration = animationConfig.durations.slow,
    easing = animationConfig.easings.smooth,
    iterations = 1,
    maxScale = 1.05
  } = options;

  const keyframes = [
    { transform: 'scale(1)', offset: 0 },
    { transform: `scale(${maxScale})`, offset: 0.5 },
    { transform: 'scale(1)', offset: 1 }
  ];

  const timing = {
    duration,
    easing,
    iterations,
    fill: 'forwards'
  };

  return element.animate(keyframes, timing);
}

/**
 * Shake animation for error states
 * @param {HTMLElement} element - Element to shake
 * @param {Object} options - Animation options
 * @returns {Animation} Web Animation instance
 */
export function shake(element, options = {}) {
  const {
    duration = animationConfig.durations.fast,
    intensity = 10
  } = options;

  const keyframes = [
    { transform: 'translateX(0)', offset: 0 },
    { transform: `translateX(-${intensity}px)`, offset: 0.25 },
    { transform: `translateX(${intensity}px)`, offset: 0.5 },
    { transform: `translateX(-${intensity}px)`, offset: 0.75 },
    { transform: 'translateX(0)', offset: 1 }
  ];

  const timing = {
    duration,
    easing: 'ease-in-out',
    fill: 'forwards'
  };

  return element.animate(keyframes, timing);
}

/**
 * Check if prefers-reduced-motion is enabled
 * @returns {boolean}
 */
export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Wrapper that respects prefers-reduced-motion
 * If reduced motion is preferred, returns instant animation
 * @param {Function} animationFn - Animation function
 * @param {HTMLElement} element - Element to animate
 * @param {Object} options - Animation options
 * @returns {Animation} Web Animation instance
 */
export function respectMotionPreference(animationFn, element, options = {}) {
  if (prefersReducedMotion()) {
    return fadeIn(element, {
      ...options,
      duration: 10 // Almost instant
    });
  }

  return animationFn(element, options);
}

/**
 * Utility to cancel all animations on an element
 * @param {HTMLElement} element - Element with animations
 */
export function cancelAnimations(element) {
  const animations = element.getAnimations();
  animations.forEach(animation => animation.cancel());
}

/**
 * Utility to finish all animations on an element
 * @param {HTMLElement} element - Element with animations
 */
export function finishAnimations(element) {
  const animations = element.getAnimations();
  animations.forEach(animation => animation.finish());
}

/**
 * Utility to pause all animations on an element
 * @param {HTMLElement} element - Element with animations
 */
export function pauseAnimations(element) {
  const animations = element.getAnimations();
  animations.forEach(animation => animation.pause());
}

/**
 * Utility to play all animations on an element
 * @param {HTMLElement} element - Element with animations
 */
export function playAnimations(element) {
  const animations = element.getAnimations();
  animations.forEach(animation => animation.play());
}
