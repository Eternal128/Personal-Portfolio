import React, { useState, useEffect } from 'react';

// Fraction of one viewport height scrolled before the whole frame is faded out.
const CONTENT_FADE_VH = 0.45;

const REPEAT_HALF = 6; // words per half of the marquee track (x2 for a seamless loop)

// Each row's fixed scroll direction — doesn't change with scroll direction.
const ROWS = [
  { word: 'James', duration: 90, reverse: false },
  { word: 'William', duration: 100, reverse: true },
  { word: 'Hanzell', duration: 80, reverse: false },
];

const RowTrack = ({ word, duration, reverse }) => (
  <div
    className="h3-row-track"
    style={{ animationDuration: `${duration}s`, animationDirection: reverse ? 'reverse' : 'normal' }}
  >
    {Array.from({ length: REPEAT_HALF * 2 }).map((_, j) => (
      <span key={j}>{word.toUpperCase()}</span>
    ))}
  </div>
);

const Hero = ({ heroReady = true }) => {
  const [loaded, setLoaded] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // Reveal only once the loader hands off (the singularity pop)
  useEffect(() => {
    if (!heroReady) return;
    const t = setTimeout(() => setLoaded(true), 60);
    return () => clearTimeout(t);
  }, [heroReady]);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
  const progress = Math.min(scrollY / vh, 1);
  const contentOp = 1 - Math.min(progress / CONTENT_FADE_VH, 1);

  return (
    <>
      <style>{`
        .h3-hero {
          position: relative;
          width: 100%;
          height: 100vh;
          background: var(--bg);
          overflow: hidden;
          font-family: 'DM Sans', sans-serif;
        }

        .h3-rows {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: clamp(4px, 1.5vh, 20px);
          will-change: transform, opacity;
        }

        .h3-row { display: flex; overflow: hidden; white-space: nowrap; }
        .h3-row-track { display: flex; width: max-content; animation: h3Marquee linear infinite; }
        @keyframes h3Marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }

        .h3-row span {
          flex-shrink: 0;
          font-size: clamp(52px, 13vw, 200px);
          font-weight: 800;
          letter-spacing: -0.02em;
          color: var(--fg);
          padding-right: clamp(20px, 3vw, 56px);
          line-height: 1;
        }
        .h3-row-1 span, .h3-row-3 span { opacity: 0.94; }
        .h3-row-2 span { opacity: 0.5; }

        @media (max-width: 640px) {
          .h3-row span { font-size: clamp(40px, 16vw, 90px); }
        }
      `}</style>

      <section className="h3-hero">
        <div
          className="h3-rows"
          style={{
            opacity: contentOp,
            transform: `scale(${loaded ? 1 : 1.04})`,
            transition: 'transform 1.2s cubic-bezier(0.16,1,0.3,1), opacity 1s cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          {ROWS.map((row, i) => (
            <div key={row.word} className={`h3-row h3-row-${i + 1}`}>
              <RowTrack {...row} />
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Hero;
