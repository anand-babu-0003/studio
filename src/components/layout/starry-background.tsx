
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

interface Comet {
  id: number;
  initialX: string;
  initialY: string;
  travelX: string; 
  travelY: string; 
  angle: string; 
  animationDuration: string;
  animationDelay: string;
  scale: number;
}

const NUM_STARS = 100;
const NUM_COMETS = 7;

const StarryBackground: React.FC = () => {
  const [stars, setStars] = useState<Star[]>([]);
  const [comets, setComets] = useState<Comet[]>([]);
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
        top: `${Math.random() * 100}%`, // Start stars scattered across the viewport
        size: `${Math.random() * 1.5 + 0.5}px`, // Stars between 0.5px and 2px
        animationDuration: `${Math.random() * 8 + 7}s`, // Fall duration 7-15s
        animationDelay: `${Math.random() * 15}s`,
        opacity: Math.random() * 0.5 + 0.3, // Opacity between 0.3 and 0.8
      });
    }
    setStars(newStars);

    const newComets: Comet[] = [];
    for (let i = 0; i < NUM_COMETS; i++) {
      const angleDeg = Math.random() * 60 + 15; // 15 to 75 degrees from horizontal
      
      // Comets can start from various off-screen positions
      let startX, startY;
      const edge = Math.floor(Math.random() * 3); // 0: top, 1: left, 2: right
      
      switch(edge) {
        case 0: // Top edge
          startX = Math.random() * 100; // vw
          startY = -10; // vh
          break;
        case 1: // Left edge
          startX = -10; // vw
          startY = Math.random() * 80; // vh (avoid starting too low)
          break;
        case 2: // Right edge
          startX = 110; // vw
          startY = Math.random() * 80; // vh
          break;
        default: // Fallback to top
          startX = Math.random() * 100;
          startY = -10;
      }

      // Calculate travel distance to cross the screen
      // Target a point roughly on the opposite side or bottom
      const travelXSign = (startX > 50) ? -1 : 1;
      const travelYSign = 1; // Always downwards

      const travelDistanceX = (Math.random() * 70 + 80) * travelXSign; // Travel 80-150vw horizontally
      const travelDistanceY = (Math.random() * 50 + 100) * travelYSign; // Travel 100-150vh vertically

      newComets.push({
        id: i,
        initialX: `${startX}vw`,
        initialY: `${startY}vh`,
        travelX: `${travelDistanceX}vw`,
        travelY: `${travelDistanceY}vh`,
        angle: `${angleDeg}deg`,
        animationDuration: `${Math.random() * 2.5 + 2}s`, // Comets are faster: 2-4.5s
        animationDelay: `${Math.random() * 10 + 5}s`, // Appear less frequently, min 5s delay
        scale: Math.random() * 0.5 + 0.7, // Scale between 0.7 and 1.2
      });
    }
    setComets(newComets);

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
            top: star.top, // Use this 'top' for the animation to pick up from
            width: star.size,
            height: star.size,
            animationDuration: star.animationDuration,
            animationDelay: star.animationDelay,
            opacity: star.opacity, // Set initial opacity for varied brightness
          }}
        />
      ))}
      {comets.map((comet) => (
        <div
          key={comet.id}
          className="comet"
          style={{
            left: comet.initialX,
            top: comet.initialY,
            transform: `scale(${comet.scale})`, // Apply initial scale
            animationDuration: comet.animationDuration,
            animationDelay: comet.animationDelay,
            ['--comet-travel-x' as string]: comet.travelX,
            ['--comet-travel-y' as string]: comet.travelY,
            ['--comet-angle' as string]: comet.angle,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
};

export default StarryBackground;
