import { useEffect, useRef, useState, useMemo } from 'react';

export const useIntersectionObserver = (options = {}) => {
  const ref = useRef(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const hasAnimatedRef = useRef(false);

  // Memoize options to prevent observer recreation on every render
  // Only recreate if specific option values change
  const threshold = options.threshold ?? 0.1;
  const rootMargin = options.rootMargin ?? '0px';
  const root = options.root;

  // Memoize the observer options object
  const observerOptions = useMemo(() => ({
    threshold,
    rootMargin,
    root,
  }), [threshold, rootMargin, root]);

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(([entry]) => {
      // Use ref instead of state to avoid dependency and re-creation
      if (entry.isIntersecting && !hasAnimatedRef.current) {
        setIsIntersecting(true);
        hasAnimatedRef.current = true;

        // Once animated, we can disconnect the observer to save resources
        observer.disconnect();
      }
    }, observerOptions);

    observer.observe(currentRef);

    return () => {
      observer.disconnect();
    };
  }, [observerOptions]); // Only recreate when memoized options change

  return [ref, isIntersecting];
};