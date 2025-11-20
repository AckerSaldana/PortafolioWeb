import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Global GSAP defaults for award-winning smoothness
gsap.defaults({
  duration: 1,
  ease: 'power3.out',
});

// Custom easing functions for premium feel
export const customEases = {
  smooth: 'power3.out',
  snappy: 'power4.out',
  elastic: 'elastic.out(1, 0.5)',
  bounce: 'back.out(1.7)',
  slowStart: 'power1.in',
  dramatic: 'expo.out',
};

// Animation duration presets
export const durations = {
  instant: 0.3,
  fast: 0.6,
  normal: 1,
  slow: 1.5,
  dramatic: 2,
};

// Common animation configurations
export const animations = {
  fadeIn: {
    opacity: 0,
    y: 30,
    duration: durations.normal,
    ease: customEases.smooth,
  },
  fadeInUp: {
    opacity: 0,
    y: 60,
    duration: durations.normal,
    ease: customEases.dramatic,
  },
  fadeInDown: {
    opacity: 0,
    y: -60,
    duration: durations.normal,
    ease: customEases.dramatic,
  },
  scaleIn: {
    opacity: 0,
    scale: 0.8,
    duration: durations.normal,
    ease: customEases.bounce,
  },
  slideInLeft: {
    opacity: 0,
    x: -100,
    duration: durations.normal,
    ease: customEases.smooth,
  },
  slideInRight: {
    opacity: 0,
    x: 100,
    duration: durations.normal,
    ease: customEases.smooth,
  },
};

// Performance optimizations
export const performanceConfig = {
  force3D: true,
  willChange: 'transform',
};

// ScrollTrigger defaults
ScrollTrigger.defaults({
  toggleActions: 'play none none reverse',
  start: 'top 80%',
  end: 'bottom 20%',
});

// Utility to kill all ScrollTriggers
export const killAllScrollTriggers = () => {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
};

// Utility to refresh all ScrollTriggers
export const refreshScrollTriggers = () => {
  ScrollTrigger.refresh();
};

// Create a master timeline
export const createMasterTimeline = (config = {}) => {
  return gsap.timeline({
    defaults: { ease: customEases.smooth },
    ...config,
  });
};

// Quick animation helper
export const animateElement = (element, animation, config = {}) => {
  return gsap.to(element, {
    ...animation,
    ...performanceConfig,
    ...config,
  });
};

// Stagger configuration presets
export const staggerPresets = {
  fast: 0.05,
  normal: 0.1,
  slow: 0.15,
  dramatic: 0.2,
};

export default gsap;
