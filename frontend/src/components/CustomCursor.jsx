import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // High performance spring physics
  const springDot = { stiffness: 1500, damping: 45 };
  const springRing = { stiffness: 350, damping: 25 };

  const dotX = useSpring(cursorX, springDot);
  const dotY = useSpring(cursorY, springDot);
  const ringX = useSpring(cursorX, springRing);
  const ringY = useSpring(cursorY, springRing);

  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Disable on touch / mobile screens
    if (typeof window === 'undefined' || window.innerWidth < 1024 || 'ontouchstart' in window) {
      return;
    }

    const onMouseMove = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      const target = e.target;
      const isInteractive = target && target.closest && target.closest('a, button, input, textarea, select, [role="button"], .hover-cursor');
      setIsHovered(!!isInteractive);
    };

    const onMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [cursorX, cursorY, isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* High-visibility glowing inner dot */}
      <motion.div
        className="fixed top-0 left-0 w-3 h-3 bg-accent-electric rounded-full pointer-events-none z-[9999] shadow-glow-cyan"
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isHovered ? 2 : 1,
        }}
        transition={{ type: 'spring', stiffness: 600, damping: 30 }}
      />

      {/* Smooth trailing outer ring */}
      <motion.div
        className="fixed top-0 left-0 w-9 h-9 border border-accent-cyan/60 rounded-full pointer-events-none z-[9999]"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isHovered ? 1.6 : 1,
          borderColor: isHovered ? 'rgba(0, 240, 255, 0.9)' : 'rgba(6, 182, 212, 0.4)',
          backgroundColor: isHovered ? 'rgba(6, 182, 212, 0.15)' : 'rgba(6, 182, 212, 0.02)',
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      />
    </>
  );
}
