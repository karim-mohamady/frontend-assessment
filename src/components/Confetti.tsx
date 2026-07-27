import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface Particle {
  id: number;
  x: number[];
  y: number[];
  rotate: number[];
  scale: number[];
  opacity: number[];
  color: string;
  size: number;
  borderRadius: string;
  delay: number;
  duration: number;
  shape: 'circle' | 'rect' | 'triangle' | 'curve';
}

interface ConfettiProps {
  trigger?: boolean;
}

export const Confetti: React.FC<ConfettiProps> = ({ trigger = true }) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!trigger) return;

    const colors = [
      '#f59e0b', // Amber/Gold
      '#10b981', // Emerald
      '#6366f1', // Indigo
      '#3b82f6', // Blue
      '#ec4899', // Pink
      '#8b5cf6', // Purple
      '#ef4444', // Red
      '#06b6d4', // Cyan
    ];

    const generateParticles = (count: number, side: 'left' | 'right'): Particle[] => {
      return Array.from({ length: count }).map((_, i) => {
        const id = side === 'left' ? i : i + count;
        const isLeft = side === 'left';

        // Custom trajectories forming elegant gravity parabolic curves
        // For left cannon, shoot upwards-rightwards (positive x)
        // For right cannon, shoot upwards-leftwards (negative x)
        const initAngleRange = isLeft 
          ? (Math.random() * 45 + 15) * (Math.PI / 180) // 15 to 60 deg
          : (Math.random() * 45 + 120) * (Math.PI / 180); // 120 to 165 deg

        const velocity = Math.random() * 400 + 400; // velocity magnitude
        const vx = Math.cos(initAngleRange) * velocity;
        const vy = -Math.sin(initAngleRange) * velocity; // negative is upwards

        // Middle control point (the peak of the parabola)
        const peakX = vx * 0.4;
        const peakY = vy * 0.4;

        // Final drift point with gravity and air resistance
        const finalX = vx * 1.1 + (Math.random() - 0.5) * 150;
        const finalY = window.innerHeight + 100; // falls off screen

        const rotateTarget1 = Math.random() * 720 - 360;
        const rotateTarget2 = rotateTarget1 + Math.random() * 1080 - 540;

        const size = Math.random() * 10 + 6; // 6px to 16px
        const shapeVal = Math.random();
        let shape: 'circle' | 'rect' | 'triangle' | 'curve' = 'rect';
        let borderRadius = '2px';

        if (shapeVal < 0.25) {
          shape = 'circle';
          borderRadius = '50%';
        } else if (shapeVal < 0.5) {
          shape = 'triangle';
        } else if (shapeVal < 0.7) {
          shape = 'curve';
        }

        return {
          id,
          x: [0, peakX, finalX],
          y: [0, peakY, finalY],
          rotate: [0, rotateTarget1, rotateTarget2],
          scale: [0, 1.2, 0.4],
          opacity: [1, 1, 0],
          color: colors[Math.floor(Math.random() * colors.length)],
          size,
          borderRadius,
          delay: Math.random() * 0.25,
          duration: Math.random() * 1.5 + 2.5, // 2.5s to 4s
          shape
        };
      });
    };

    // Spawn 50 particles from the left and 50 from the right
    const leftParticles = generateParticles(45, 'left');
    const rightParticles = generateParticles(45, 'right');

    setParticles([...leftParticles, ...rightParticles]);

    // Clean up particles after 6 seconds to optimize memory
    const timer = setTimeout(() => {
      setParticles([]);
    }, 6000);

    return () => clearTimeout(timer);
  }, [trigger]);

  if (!trigger || particles.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden w-screen h-screen">
      {/* Left Cannon Base */}
      <div className="absolute left-[2%] bottom-[-20px]" />
      
      {/* Right Cannon Base */}
      <div className="absolute right-[2%] bottom-[-20px]" />

      {particles.map((p) => {
        const isLeft = p.id < 45;
        const startStyle = isLeft 
          ? { left: '2%', bottom: '0%' } 
          : { right: '2%', bottom: '0%' };

        return (
          <motion.div
            key={p.id}
            initial={{ x: 0, y: 0, scale: 0, opacity: 1, rotate: 0 }}
            animate={{
              x: p.x,
              y: p.y,
              rotate: p.rotate,
              scale: p.scale,
              opacity: p.opacity,
            }}
            transition={{
              duration: p.duration,
              ease: [0.1, 0.8, 0.25, 1], // Custom overshoot easing
              delay: p.delay,
            }}
            style={{
              position: 'absolute',
              ...startStyle,
              width: `${p.size}px`,
              height: `${p.shape === 'rect' ? p.size * 1.6 : p.size}px`,
              backgroundColor: p.shape === 'triangle' || p.shape === 'curve' ? 'transparent' : p.color,
              borderRadius: p.borderRadius,
            }}
          >
            {p.shape === 'triangle' && (
              <svg viewBox="0 0 10 10" width="100%" height="100%" fill={p.color}>
                <polygon points="5,0 10,10 0,10" />
              </svg>
            )}
            {p.shape === 'curve' && (
              <svg viewBox="0 0 10 10" width="100%" height="100%" fill="none" stroke={p.color} strokeWidth="2">
                <path d="M0,5 Q5,0 10,5" />
              </svg>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};
