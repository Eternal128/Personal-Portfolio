import React, { useState, useEffect } from 'react';
import { motion, useSpring } from 'framer-motion';

const CustomCursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [hidden, setHidden] = useState(false);

  const cursorX = useSpring(0, { stiffness: 300, damping: 30 });
  const cursorY = useSpring(0, { stiffness: 300, damping: 30 });

  useEffect(() => {
    const updateMousePosition = (e) => {
      cursorX.set(e.clientX - 15);
      cursorY.set(e.clientY - 15);
    };

    const handleMouseOver = (e) => {
      if (e.target.closest('[data-gallery]')) {
        setHidden(true);
        setIsHovering(false);
        return;
      }
      setHidden(false);
      if (
        e.target.tagName === 'A' ||
        e.target.tagName === 'BUTTON' ||
        e.target.onclick ||
        e.target.closest('a') ||
        e.target.closest('button') ||
        window.getComputedStyle(e.target).cursor === 'pointer'
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    document.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY]);

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999]"
      style={{ x: cursorX, y: cursorY, opacity: hidden ? 0 : 1 }}
    >
      <motion.div
        animate={{ scale: isHovering ? 1.4 : 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        style={{
          width: 15,
          height: 15,
          borderRadius: '50%',
          background: '#ffffff',
          opacity: isHovering ? 1 : 1,
          boxShadow:'0 0 8px 2px rgba(255,255,255,0.35), 0 0 18px 4px rgba(255,255,255,0.12)',
          transition: 'box-shadow 0.3s ease, opacity 0.3s ease',
        }}
      />
    </motion.div>
  );
};

export default CustomCursor;