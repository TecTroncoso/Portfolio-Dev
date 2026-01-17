import React, { useEffect, useRef, useState } from 'react';

interface RevealProps {
  children: React.ReactNode;
  width?: 'fit-content' | '100%';
  delay?: number; // Delay in ms
  className?: string;
}

export const Reveal: React.FC<RevealProps> = ({ children, width = '100%', delay = 0, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Safety net: Ensure content becomes visible even if IntersectionObserver fails
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000 + delay);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          clearTimeout(timer);
          if (ref.current) observer.unobserve(ref.current);
        }
      },
      {
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.disconnect();
      clearTimeout(timer);
    };
  }, [delay]);

  return (
    <div
      ref={ref}
      style={{
        width,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(2rem)',
        transition: `opacity 1s cubic-bezier(0.19, 1, 0.22, 1) ${delay}ms, transform 1s cubic-bezier(0.19, 1, 0.22, 1) ${delay}ms`,
        willChange: 'opacity, transform' // Optimize paint
      }}
      className={className}
    >
      {children}
    </div>
  );
};