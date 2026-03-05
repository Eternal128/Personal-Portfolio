import React, { useState, useEffect } from 'react';
import { motion, useSpring } from 'framer-motion';

const CustomCursor = () => {
  const [isHovering, setIsHovering] = useState(false);

  // Get the current zoom level so we can correct mouse coordinates
  const getZoom = () => {
    return parseFloat(document.documentElement.style.zoom) ||
      window.devicePixelRatio && document.documentElement.getAttribute('style')?.match(/zoom:\s*([\d.]+)/)?.[1] ||
      1;
  };

  // Position springs
  const cursorX = useSpring(0, { stiffness: 300, damping: 30 });
  const cursorY = useSpring(0, { stiffness: 300, damping: 30 });

  // Shape springs
  const width   = useSpring(15, { stiffness: 220, damping: 26 });
  const height  = useSpring(15, { stiffness: 220, damping: 26 });
  const radius  = useSpring(50, { stiffness: 220, damping: 26 });
  const opacity = useSpring(1,  { stiffness: 220, damping: 26 });
  const scale   = useSpring(1,  { stiffness: 400, damping: 25 });

  useEffect(() => {
    const updateMousePosition = (e) => {
      // When CSS zoom is applied, clientX/Y are in unzoomed coords.
      // Divide by zoom to get the correct position in the zoomed layout.
      const zoom = parseFloat(getComputedStyle(document.documentElement).zoom) || 1;
      const x = e.clientX / zoom;
      const y = e.clientY / zoom;

      // Subtract half the cursor size (7.5 ≈ 8) to center it
      cursorX.set(x - 8);
      cursorY.set(y - 8);
    };

    const handleMouseOver = (e) => {
      if (e.target.closest('[data-gallery]')) {
        width.set(48);
        height.set(15);
        radius.set(100);
        opacity.set(0);
        scale.set(1);
        setIsHovering(false);
        return;
      }

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
      className="fixed top-0 left-0 pointer-events-none z-[9999]"
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