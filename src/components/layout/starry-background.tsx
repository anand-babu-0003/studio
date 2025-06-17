
"use client";

import { useState, useEffect } from 'react';
import type React from 'react';

interface Star {
  id: number;
  left: string;
  top: string;
  size: string;
  animationDuration: string;
  animationDelay: string;
  opacity: number;
}

const NUM_STARS = 200; // Increased from 100

const StarryBackground: React.FC = () => {
  const [stars, setStars] = useState<Star[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const newStars: Star[] = [];
    for (let i = 0; i < NUM_STARS; i++) {
      newStars.push({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`, 
        size: `${Math.random() * 1.5 + 0.5}px`, 
        animationDuration: `${Math.random() * 8 + 7}s`, 
        animationDelay: `${Math.random() * 15}s`,
        opacity: Math.random() * 0.5 + 0.3, 
      });
    }
    setStars(newStars);

  }, [isMounted]);

  if (!isMounted) {
    return null; 
  }

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{
            left: star.left,
            top: star.top, 
            width: star.size,
            height: star.size,
            animationDuration: star.animationDuration,
            animationDelay: star.animationDelay,
            opacity: star.opacity, 
          }}
        />
      ))}
    </div>
  );
};

export default StarryBackground;

