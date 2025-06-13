'use client';

import { useState, useEffect, useRef } from 'react';

interface UseScrollAnimationProps {
  threshold?: number;
  rootMargin?: string;
}

export const useScrollAnimation = ({
  threshold = 0.1,
  rootMargin = '0px 0px -100px 0px'
}: UseScrollAnimationProps = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold, rootMargin]);

  return { ref, isVisible };
};
