import { useEffect, useRef, useState } from 'react';

export const useIntersectionObserver = (options = {}) => {
  const ref = useRef(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated) {
        setIsIntersecting(true);
        setHasAnimated(true);
      }
    }, {
      threshold: options.threshold || 0.1,
      rootMargin: options.rootMargin || '0px',
      ...options
    });

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [options, hasAnimated]);

  return [ref, isIntersecting];
};