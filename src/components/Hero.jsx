import React, { useState, useEffect } from 'react';
import Tilt from 'react-parallax-tilt';
import { james } from '../assets';

// Fraction of one viewport height scrolled before the whole frame is faded out.
const CONTENT_FADE_VH = 0.45;

const WORDS = ['James', 'William', 'Hanzell'];
const REPEAT = 5;

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
          background: #000;
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
        .h3-row {
          display: flex;
          overflow: hidden;
          white-space: nowrap;
        }
        .h3-row span {
          flex-shrink: 0;
          font-size: clamp(52px, 13vw, 200px);
          font-weight: 800;
          letter-spacing: -0.02em;
          color: #fff;
          padding-right: clamp(20px, 3vw, 56px);
          line-height: 1;
        }
        .h3-row-1 span, .h3-row-3 span { opacity: 0.94; }
        .h3-row-2 { transform: translateX(clamp(-80px, -6vw, -30px)); }
        .h3-row-2 span { opacity: 0.5; }

        .h3-photo-wrap {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
          pointer-events: none;
        }
        .h3-photo {
          pointer-events: auto;
          width: clamp(200px, 20vw, 320px);
          aspect-ratio: 4 / 5.2;
          border-radius: 2px;
          overflow: hidden;
          box-shadow: 0 30px 80px rgba(0,0,0,0.6);
          -webkit-mask-image: linear-gradient(to bottom, #000 78%, transparent 100%);
          mask-image: linear-gradient(to bottom, #000 78%, transparent 100%);
        }
        .h3-photo img {
          width: 100%; height: 100%;
          object-fit: cover; object-position: center;
          display: block;
          filter: contrast(1.3) grayscale(60%) brightness(0.92);
        }

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
          {WORDS.map((word, i) => (
            <div key={word} className={`h3-row h3-row-${i + 1}`}>
              {Array.from({ length: REPEAT }).map((_, j) => (
                <span key={j}>{word.toUpperCase()}</span>
              ))}
            </div>
          ))}
        </div>

        <div className="h3-photo-wrap">
          <Tilt
            options={{ max: 10, scale: 1.02, speed: 400, glare: true, 'max-glare': 0.15 }}
            className="h3-photo"
          >
            <img src={james} alt="James William Hanzell" />
          </Tilt>
        </div>
      </section>
    </>
  );
};

export default Hero;
