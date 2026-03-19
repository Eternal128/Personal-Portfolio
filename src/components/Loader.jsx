import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Loader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState('counting'); // counting | reveal | done

  useEffect(() => {
    // Simulate asset loading with a smooth counter
    let start = null;
    const duration = 2200;

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const raw = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - raw, 3);
      setProgress(Math.floor(eased * 100));

      if (raw < 1) {
        requestAnimationFrame(step);
      } else {
        setProgress(100);
        setTimeout(() => setPhase('reveal'), 300);
        setTimeout(() => {
          setPhase('done');
          if (onComplete) onComplete();
        }, 1400);
      }
    };
    requestAnimationFrame(step);
  }, [onComplete]);

  if (phase === 'done') return null;

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          style={{
            position: 'fixed',
            inset: 0,
            background: '#000',
            zIndex: 99999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'DM Sans', sans-serif",
            overflow: 'hidden',
          }}
        >
          {/* Progress bar */}
          <div style={{
            position: 'absolute',
            bottom: 0, left: 0, right: 0,
            height: 1,
            background: 'rgba(255,255,255,0.08)',
          }}>
            <motion.div
              style={{
                height: '100%',
                background: 'rgba(255,255,255,0.5)',
                originX: 0,
              }}
              animate={{ scaleX: progress / 100 }}
              transition={{ ease: 'linear', duration: 0.1 }}
            />
          </div>

          {/* Counter */}
          <AnimatePresence mode="wait">
            {phase === 'counting' && (
              <motion.div
                key="counter"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                style={{
                  fontSize: 'clamp(64px, 12vw, 160px)',
                  fontWeight: 200,
                  color: '#fff',
                  letterSpacing: '-0.04em',
                  lineHeight: 1,
                  mixBlendMode: 'difference',
                  userSelect: 'none',
                }}
              >
                {String(progress).padStart(2, '0')}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Staggered reveal text */}
          <AnimatePresence>
            {phase === 'reveal' && (
              <motion.div
                key="reveal"
                style={{ textAlign: 'center', overflow: 'hidden' }}
              >
                {['James', 'William', 'Hanzell'].map((word, i) => (
                  <div key={word} style={{ overflow: 'hidden' }}>
                    <motion.div
                      initial={{ y: '110%', opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{
                        delay: i * 0.1,
                        duration: 0.7,
                        ease: [0.76, 0, 0.24, 1],
                      }}
                      style={{
                        fontSize: 'clamp(32px, 6vw, 80px)',
                        fontWeight: 200,
                        color: '#fff',
                        letterSpacing: '-0.025em',
                        lineHeight: 1.1,
                      }}
                    >
                      {word}
                    </motion.div>
                  </div>
                ))}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  style={{
                    marginTop: 16,
                    fontSize: 11,
                    fontWeight: 300,
                    color: 'rgba(255,255,255,0.4)',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                  }}
                >
                  Portfolio · 2025
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Corner label */}
          <div style={{
            position: 'absolute',
            bottom: 32, left: 32,
            fontSize: 10,
            fontWeight: 300,
            color: 'rgba(255,255,255,0.25)',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
          }}>
            Loading
          </div>
          <div style={{
            position: 'absolute',
            bottom: 32, right: 32,
            fontSize: 10,
            fontWeight: 300,
            color: 'rgba(255,255,255,0.25)',
            letterSpacing: '0.15em',
          }}>
            {progress}%
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Loader;