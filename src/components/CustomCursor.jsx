import React, { useState, useEffect } from 'react';
import { motion, useSpring } from 'framer-motion';

const CustomCursor = () => {
  const [isHovering, setIsHovering] = useState(false);

  const cursorX = useSpring(0, { stiffness: 300, damping: 30 });
  const cursorY = useSpring(0, { stiffness: 300, damping: 30 });

  const width   = useSpring(15, { stiffness: 220, damping: 26 });
  const height  = useSpring(15, { stiffness: 220, damping: 26 });
  const radius  = useSpring(50, { stiffness: 220, damping: 26 });
  const opacity = useSpring(1,  { stiffness: 220, damping: 26 });
  const scale   = useSpring(1,  { stiffness: 400, damping: 25 });

  useEffect(() => {
    const updateMousePosition = (e) => {
      const zoom = parseFloat(getComputedStyle(document.documentElement).zoom) || 1;
      const x = e.clientX / zoom;
      const y = e.clientY / zoom;
      cursorX.set(x - 8);
      cursorY.set(y - 8);
    };

    const handleMouseOver = (e) => {
      // 1. Pill takes highest priority — show cursor as clickable
      if (e.target.closest('[data-pill]')) {
        width.set(15);
        height.set(15);
        radius.set(50);
        opacity.set(1);
        scale.set(1.4);
        setIsHovering(true);
        return;
      }

      // 2. Inside gallery card (but not pill) — hide cursor
      if (e.target.closest('[data-gallery]')) {
        width.set(48);
        height.set(15);
        radius.set(100);
        opacity.set(0);
        scale.set(1);
        setIsHovering(false);
        return;
      }

      // 3. Everything else — normal cursor logic
      const isClickable =
        e.target.tagName === 'A' ||
        e.target.tagName === 'BUTTON' ||
        e.target.onclick ||
        e.target.closest('a') ||
        e.target.closest('button') ||
        window.getComputedStyle(e.target).cursor === 'pointer';

      width.set(15);
      height.set(15);
      radius.set(50);
      opacity.set(1);
      scale.set(isClickable ? 1.4 : 1);
      setIsHovering(isClickable);
    };

    window.addEventListener('mousemove', updateMousePosition);
    document.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY, width, height, radius, opacity, scale]);

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[100000]"
      style={{ x: cursorX, y: cursorY }}
    >
      <motion.div
        style={{
          width,
          height,
          borderRadius: radius,
          background: '#ffffff',
          opacity,
          scale,
          boxShadow: '0 0 8px 2px rgba(255,255,255,0.35), 0 0 18px 4px rgba(255,255,255,0.12)',
          transition: 'box-shadow 0.3s ease',
        }}
      />
    </motion.div>
  );
};

export default CustomCursor;