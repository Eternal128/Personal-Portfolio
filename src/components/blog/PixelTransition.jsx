import React, { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';

// Pixelated reveal that works both directions.
// phase = 'enter'  → blocks start SOLID, fade OUT to reveal what's behind.
// phase = 'cover'  → blocks start transparent, fade IN to cover the screen.
// phase = 'reveal' → blocks start SOLID, fade OUT to reveal what's behind.
const PixelTransition = ({
  cover = '#111010',
  pixel = 30,
  duration = 0.3,
  phase = 'enter',
  onDone,
  zIndex = 9500,
}) => {
  const { cols, rows } = useMemo(() => {
    const w = typeof window !== 'undefined' ? window.innerWidth : 1440;
    const h = typeof window !== 'undefined' ? window.innerHeight : 900;

    return {
      cols: Math.ceil(w / pixel),
      rows: Math.ceil(h / pixel),
    };
  }, [pixel]);

  const total = cols * rows;

  const delays = useMemo(() => {
    return Array.from({ length: total }, (_, i) => {
      const x = i % cols;
      const y = Math.floor(i / cols);

      // Original block/sweep feeling.
      // Top-left starts earlier, bottom-right follows, with slight jitter.
      const sweep = (x + y) / (cols + rows);
      const jitter = Math.random() * 0.25;

      return sweep * 0.4 + jitter;
    });
  }, [total, cols, rows]);

  const maxDelay = useMemo(() => {
    return delays.length ? Math.max(...delays) : 0;
  }, [delays]);

  useEffect(() => {
    if (!onDone) return;

    const t = setTimeout(() => {
      onDone();
    }, (maxDelay + duration) * 1000 + 80);

    return () => clearTimeout(t);
  }, [maxDelay, duration, onDone]);

  // Covering phase: transparent → solid.
  // Enter/reveal phase: solid → transparent.
  const from = phase === 'cover' ? 0 : 1;
  const to = phase === 'cover' ? 1 : 0;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex,
        visibility: 'visible',
        pointerEvents: phase === 'enter' ? 'none' : 'auto',
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
      }}
    >
      {delays.map((delay, i) => (
        <motion.div
          key={`${phase}-${i}`}
          initial={{ opacity: from }}
          animate={{ opacity: to }}
          transition={{
            duration,
            delay,
            ease: [0.76, 0, 0.24, 1],
          }}
          style={{
            background: cover,
            width: '100%',
            height: '100%',
          }}
        />
      ))}
    </div>
  );
};

export default PixelTransition;