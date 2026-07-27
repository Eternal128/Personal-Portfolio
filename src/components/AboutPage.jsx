import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import { james } from '../assets';

const FACTS = [
  { label: 'Location', value: 'Toronto, Ontario' },
  { label: 'Education', value: 'B.Sc Computer Science, University of Toronto' },
  { label: 'Currently', value: 'Available for work' },
];

const AboutPage = ({ onClose }) => {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <motion.div
      data-lenis-prevent
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 900,
        background: 'var(--surface-solid)',
        color: 'var(--fg)',
        fontFamily: "'DM Sans', sans-serif",
        overflowY: 'auto',
        overscrollBehavior: 'contain',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {/* Sticky top bar */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 5,
          background: 'rgba(var(--surface-solid-rgb),0.85)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(var(--fg-rgb),0.08)',
        }}
      >
        <div
          style={{
            maxWidth: 1000,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '22px clamp(22px, 6vw, 64px)',
          }}
        >
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'rgba(var(--fg-rgb),0.6)',
              fontSize: 12,
              letterSpacing: '0.06em',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            ← Back
          </button>

          <button
            onClick={onClose}
            aria-label="Close about page"
            style={{
              width: 34, height: 34, borderRadius: '50%',
              border: '1px solid rgba(var(--fg-rgb),0.15)', background: 'none',
              color: 'rgba(var(--fg-rgb),0.6)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 15, lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: 'clamp(56px, 9vh, 110px) clamp(22px, 6vw, 64px) clamp(80px, 14vh, 160px)' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 340px) 1fr',
            gap: 'clamp(32px, 6vw, 72px)',
            alignItems: 'start',
          }}
          className="about-page-grid"
        >
          {/* Photo */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <Tilt
              options={{ max: 8, scale: 1.015, speed: 400, glare: true, 'max-glare': 0.12 }}
              style={{
                width: '100%',
                aspectRatio: '4 / 5.2',
                borderRadius: 12,
                overflow: 'hidden',
                boxShadow: '0 30px 80px rgba(0,0,0,0.45)',
              }}
            >
              <img
                src={james}
                alt="James William Hanzell"
                style={{
                  width: '100%', height: '100%',
                  objectFit: 'cover', objectPosition: 'center',
                  display: 'block',
                  filter: 'contrast(1.3) grayscale(60%) brightness(0.92)',
                }}
              />
            </Tilt>
          </motion.div>

          {/* Bio */}
          <div>
            <motion.span
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              style={{
                display: 'block',
                fontSize: 11, fontWeight: 300,
                color: 'rgba(var(--fg-rgb),0.35)',
                letterSpacing: '0.22em', textTransform: 'uppercase',
                marginBottom: 14,
              }}
            >
              Who I am
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontSize: 'clamp(2rem, 5vw, 3.4rem)',
                fontWeight: 300,
                lineHeight: 1.05,
                letterSpacing: '-0.02em',
                marginBottom: 'clamp(24px, 4vh, 40px)',
              }}
            >
              Hey, I'm James.
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
              style={{ display: 'flex', flexDirection: 'column', gap: 18, marginBottom: 'clamp(32px, 5vh, 52px)' }}
            >
              <p style={{ fontSize: 16, fontWeight: 300, lineHeight: 1.85, color: 'rgba(var(--fg-rgb),0.65)' }}>
                I'm a Computer Science student at the University of Toronto, and I've spent my internships
                building things at a Silicon Valley startup and at Ernst & Young — everything from
                student-facing product features to AI-driven internal tooling.
              </p>
              <p style={{ fontSize: 16, fontWeight: 300, lineHeight: 1.85, color: 'rgba(var(--fg-rgb),0.65)' }}>
                I like problems that force me to actually understand what's happening underneath, whether
                that's proving why an algorithm breaks or figuring out why a piece of code someone
                shipped years ago works the way it does. Outside of school and work, I create anime edits
                and visual content — a completely different kind of craft, but one that scratches the same
                itch for pacing, rhythm, and getting the small details right.
              </p>
              <p style={{ fontSize: 16, fontWeight: 300, lineHeight: 1.85, color: 'rgba(var(--fg-rgb),0.65)' }}>
                I'm always happy to talk shop, collaborate, or just meet new people — feel free to reach
                out.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{
                display: 'flex', flexDirection: 'column', gap: 16,
                borderTop: '1px solid rgba(var(--fg-rgb),0.08)',
                paddingTop: 24,
              }}
            >
              {FACTS.map((f) => (
                <div key={f.label} style={{ display: 'flex', gap: 20, alignItems: 'baseline' }}>
                  <span style={{
                    width: 90, flexShrink: 0,
                    fontSize: 10.5, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase',
                    color: 'rgba(212,180,100,0.8)',
                  }}>
                    {f.label}
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 300, color: 'rgba(var(--fg-rgb),0.7)' }}>
                    {f.value}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 700px) {
          .about-page-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default AboutPage;
