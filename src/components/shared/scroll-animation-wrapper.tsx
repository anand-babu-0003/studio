
"use client";

import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface ScrollAnimationWrapperProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // in ms
  threshold?: number; // IntersectionObserver threshold
}

export function ScrollAnimationWrapper({ 
  children, 
  className, 
  delay = 0,
  threshold = 0.1 
}: ScrollAnimationWrapperProps) {
  const [isVisible, setIsVisible] = useState(false);
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          } else {
            // Reset when it's not intersecting to allow re-animation
            setIsVisible(false); 
          }
        });
      },
      { threshold } 
    );

    const currentRef = targetRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold]);

  return (
    <div
      ref={targetRef}
      className={cn(
        'scroll-trigger', 
        isVisible && 'animate-scroll-in', 
        className
      )}
      style={{ 
        transitionDelay: isVisible ? `${delay}ms` : '0ms',
        // Ensure opacity resets if not visible to allow fade-in again
        opacity: isVisible ? 1 : 0, 
        // Ensure transform resets if not visible to allow slide-in again
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)', 
      }}
    >
      {children}
    </div>
  );
}
