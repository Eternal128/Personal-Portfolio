import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

const CustomCursor = () => {
  const cursorX = useSpring(0, { stiffness: 300, damping: 30 });
  const cursorY = useSpring(0, { stiffness: 300, damping: 30 });

  const width   = useSpring(15, { stiffness: 220, damping: 26 });
  const height  = useSpring(15, { stiffness: 220, damping: 26 });
  const radius  = useSpring(50, { stiffness: 220, damping: 26 });
  const opacity = useSpring(1,  { stiffness: 220, damping: 26 });
  const scale   = useSpring(1,  { stiffness: 400, damping: 25 });

  const [label, setLabel] = useState('');

  useEffect(() => {
    const updateMousePosition = (e) => {
      const zoom = parseFloat(getComputedStyle(document.documentElement).zoom) || 1;
      const x = e.clientX / zoom;
      const y = e.clientY / zoom;
      // Offset by half the CURRENT (possibly mid-transition) size so the
      // cursor stays centered on the pointer whether it's the small 15px
      // dot or the bigger 76px labeled circle, instead of a fixed offset
      // tuned only for the dot.
      cursorX.set(x - width.get() / 2);
      cursorY.set(y - height.get() / 2);
    };

    const handleMouseOver = (e) => {
      // 1. Pill takes highest priority — show cursor as clickable
      if (e.target.closest('[data-pill]')) {
        width.set(15);
        height.set(15);
        radius.set(50);
        opacity.set(1);
        scale.set(1.4);
        setLabel('');
        return;
      }

      // 2. Inside gallery card (but not pill) — hide cursor
      if (e.target.closest('[data-gallery]')) {
        width.set(48);
        height.set(15);
        radius.set(100);
        opacity.set(0);
        scale.set(1);
        setLabel('');
        return;
      }

      // 3. Elements that want a bigger, labeled cursor (e.g. "Click")
      //    instead of a hover preview/tooltip.
      const labelEl = e.target.closest('[data-cursor-label]');
      if (labelEl) {
        width.set(76);
        height.set(76);
        radius.set(50);
        opacity.set(1);
        scale.set(1);
        setLabel(labelEl.getAttribute('data-cursor-label'));
        return;
      }

      // 4. Everything else — normal cursor logic
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
      setLabel('');
    };

    window.addEventListener('mousemove', updateMousePosition);
    document.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY, width, height, radius, opacity, scale]);

  return (
    // A single element carries position (fixed + left/top), z-index, size,
    // and mix-blend-mode all at once. Splitting these across a positioning
    // wrapper + an inner blended child (as this used to be written) silently
    // breaks the invert effect: a `position:fixed` + z-index ANCESTOR
    // creates its own stacking context, which cuts `mix-blend-mode:
    // difference` off from ever seeing the real page behind it — it just
    // renders as a flat, un-inverted white circle instead. Confirmed by
    // isolated testing; keeping everything on one element avoids that.
    <motion.div
      className="fixed pointer-events-none z-[100000]"
      style={{
        left: cursorX,
        top: cursorY,
        width,
        height,
        borderRadius: radius,
        // Labeled ("Click") state inverts whatever is underneath instead of
        // drawing a flat theme-colored circle — a solid white fill with
        // mix-blend-mode: difference always inverts the backdrop's real
        // pixels regardless of which theme (or what content) is behind the
        // cursor at that moment.
        background: label ? '#ffffff' : 'var(--fg)',
        mixBlendMode: label ? 'difference' : 'normal',
        opacity,
        scale,
        boxShadow: label ? 'none' : '0 0 8px 2px rgba(var(--fg-rgb),0.35), 0 0 18px 4px rgba(var(--fg-rgb),0.12)',
        transition: 'box-shadow 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <motion.span
        animate={{ opacity: label ? 1 : 0 }}
        transition={{ duration: 0.15 }}
        style={{
          // Painted as a normal (non-blended) opaque layer on top of the
          // already-inverted circle, so the label stays legible no matter
          // what color the invert happens to produce underneath it.
          position: 'relative',
          mixBlendMode: 'normal',
          color: 'var(--bg)',
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: '0.04em',
          fontFamily: "'DM Sans', sans-serif",
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </motion.span>
    </motion.div>
  );
};

export default CustomCursor;