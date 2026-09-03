import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface SlideRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  distance?: number;
}

export function SlideReveal({
  children,
  className,
  delay = 0,
  distance = 24,
}: SlideRevealProps) {
  const reduceMotion = useReducedMotion();
  const elementRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(
    () => typeof document === 'undefined' || document.visibilityState !== 'visible',
  );

  useEffect(() => {
    const element = elementRef.current;
    if (!element || reduceMotion || isVisible) return;

    const scrollRoot = element.closest('main');
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsVisible(true);
        observer.disconnect();
      },
      { root: scrollRoot, threshold: 0.16 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [isVisible, reduceMotion]);

  return (
    <motion.div
      ref={elementRef}
      className={className}
      initial={false}
      animate={isVisible || reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: distance }}
      transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
