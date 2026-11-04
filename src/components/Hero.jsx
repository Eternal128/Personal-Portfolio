import React, { useState, useEffect } from 'react';
import { projects } from '../constants';
import { useLenis } from '../context/LenisContext';

const EMAIL = 'james.hanzell@mail.utoronto.ca';

// The three projects at the front of the projects list are the ones the hero
// shows, so it follows whatever is added there without its own copy.
const FEATURED = projects.slice(0, 3);

const firstSentence = (text = '') => text.split(/(?<=[.!?])\s/)[0];

const Hero = ({ heroReady = true }) => {
  const [loaded, setLoaded] = useState(false);
  const [active, setActive] = useState(0);
  const lenis = useLenis();

  // Reveal only once the loader hands off (the singularity pop)
  useEffect(() => {
    if (!heroReady) return;
    const t = setTimeout(() => setLoaded(true), 60);
    return () => clearTimeout(t);
  }, [heroReady]);

  const goToProjects = (e) => {
    const el = document.getElementById('projects');
    if (!el) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(el);
    else el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const current = FEATURED[active];

  return (
    <>
      <style>{`
        .hx {
          position: relative;
          min-height: 100vh; /* taste-skill-ignore: fallback for browsers without svh */
          min-height: 100svh;
          padding: clamp(112px, 15vh, 144px) 0 clamp(56px, 8vh, 88px);
          background: var(--bg);
          color: var(--fg);
          font-family: 'DM Sans', sans-serif;
          overflow: hidden;
        }
        .hx-wrap {
          width: min(1268px, calc(100% - 2 * clamp(20px, 5vw, 32px)));
          margin-inline: auto;
        }

        .hx-title {
          margin: 0;
          font-size: clamp(64px, 12.2vw, 184px);
          font-weight: 800;
          line-height: 0.9;
          letter-spacing: -0.045em;
        }

        .hx-grid {
          display: grid;
          grid-template-columns: 5fr 7fr;
          grid-template-areas: "intro figure" "work figure";
          grid-template-rows: auto 1fr;
          column-gap: clamp(40px, 5vw, 80px);
          row-gap: 48px;
          margin-top: clamp(36px, 5vh, 56px);
        }
        .hx-intro  { grid-area: intro; }
        .hx-figure { grid-area: figure; margin: 0; }
        .hx-work   { grid-area: work; align-self: end; }

        .hx-lead {
          margin: 0;
          max-width: 30ch;
          font-size: clamp(20px, 1.7vw, 24px);
          line-height: 1.35;
          letter-spacing: -0.01em;
        }

        .hx-actions {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 12px 28px;
          margin-top: 32px;
        }
        .hx-btn {
          display: inline-flex;
          align-items: center;
          height: 52px;
          padding: 0 28px;
          border-radius: 999px;
          background: var(--fg);
          color: var(--bg);
          font-size: 16px;
          font-weight: 500;
          text-decoration: none;
          cursor: none;
          transition: transform 0.25s cubic-bezier(0.16,1,0.3,1), opacity 0.2s;
        }
        .hx-btn:hover { opacity: 0.86; transform: translateY(-2px); }
        .hx-btn:active { transform: translateY(0) scale(0.98); }
        .hx-link {
          color: var(--fg);
          font-size: 16px;
          text-decoration: underline;
          text-underline-offset: 5px;
          text-decoration-thickness: 1px;
          cursor: none;
          transition: text-underline-offset 0.2s, opacity 0.2s;
        }
        .hx-link:hover { text-underline-offset: 8px; }
        .hx-btn:focus-visible, .hx-link:focus-visible, .hx-pick:focus-visible {
          outline: 2px solid var(--fg);
          outline-offset: 4px;
        }

        .hx-work-label {
          margin: 0 0 10px;
          font-size: 16px;
          color: rgba(var(--fg-rgb), 0.6);
        }
        .hx-picks { list-style: none; margin: 0; padding: 0; }
        .hx-pick {
          display: block;
          padding: 4px 0;
          background: none;
          border: 0;
          color: var(--fg);
          font: inherit;
          font-size: clamp(20px, 1.7vw, 24px);
          font-weight: 500;
          letter-spacing: -0.01em;
          text-align: left;
          opacity: 0.38;
          cursor: none;
          transition: opacity 0.25s;
        }
        .hx-pick:hover { opacity: 0.75; }
        .hx-pick[aria-pressed="true"] { opacity: 1; }

        .hx-frame {
          position: relative;
          aspect-ratio: 16 / 10;
          overflow: hidden;
          background: rgba(var(--fg-rgb), 0.08);
        }
        .hx-frame img {
          position: absolute;
          inset: clamp(14px, 2.2vw, 32px);
          width: calc(100% - 2 * clamp(14px, 2.2vw, 32px));
          height: calc(100% - 2 * clamp(14px, 2.2vw, 32px));
          object-fit: cover;
          object-position: top center;
          opacity: 0;
          transition: opacity 0.5s ease;
        }
        .hx-frame img.is-on { opacity: 1; }
        .hx-caption {
          margin-top: 16px;
          font-size: 16px;
          line-height: 1.5;
          max-width: 62ch;
        }
        .hx-caption strong { font-weight: 600; }

        @media (prefers-reduced-motion: no-preference) {
          .hx-rise {
            opacity: 0;
            transform: translateY(28px);
            transition: opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1);
            transition-delay: var(--d, 0ms);
          }
          /* The title rises but never fades, so it can be read from the first frame. */
          .hx-title.hx-rise { opacity: 1; }
          .hx.is-ready .hx-rise { opacity: 1; transform: none; }
          .hx-frame img.is-on { animation: hxDrift 14s ease-in-out infinite alternate; }
        }
        @keyframes hxDrift {
          from { transform: scale(1); }
          to   { transform: scale(1.045); }
        }
        @media (prefers-reduced-motion: reduce) {
          .hx-frame img { transition: none; }
          .hx-pick, .hx-btn { transition: none; }
        }

        @media (max-width: 860px) {
          .hx-grid {
            grid-template-columns: 1fr;
            grid-template-areas: "intro" "work" "figure";
            grid-template-rows: auto;
            row-gap: 32px;
          }
          .hx-work { align-self: start; }
          .hx-picks { display: flex; flex-wrap: wrap; gap: 4px 24px; }
        }
      `}</style>

      <section className={`hx${loaded ? ' is-ready' : ''}`} aria-labelledby="hx-title">
        <div className="hx-wrap">
          <h1 id="hx-title" className="hx-title hx-rise">James Hanzell</h1>

          <div className="hx-grid">
            <div className="hx-intro">
              <p className="hx-lead hx-rise" style={{ '--d': '90ms' }}>
                I build software and study Computer Science at the University of Toronto.
                Most recently I interned at Lirvana Labs and EY.
              </p>
              <div className="hx-actions hx-rise" style={{ '--d': '170ms' }}>
                <a className="hx-btn" href="#projects" onClick={goToProjects}>See my projects</a>
                <a className="hx-link" href={`mailto:${EMAIL}`}>Email me</a>
              </div>
            </div>

            <figure className="hx-figure hx-rise" style={{ '--d': '250ms' }}>
              <div className="hx-frame">
                {FEATURED.map((p, i) => (
                  <img
                    key={p.name}
                    src={p.image}
                    alt={i === active ? `${p.name}, project screenshot` : ''}
                    aria-hidden={i === active ? undefined : true}
                    className={i === active ? 'is-on' : undefined}
                    loading={i === 0 ? 'eager' : 'lazy'}
                  />
                ))}
              </div>
              <figcaption className="hx-caption" aria-live="polite">
                <strong>{current.name}.</strong> {firstSentence(current.description)}
              </figcaption>
            </figure>

            <div className="hx-work hx-rise" style={{ '--d': '330ms' }}>
              <p className="hx-work-label" id="hx-work-label">Recent work</p>
              <ul className="hx-picks" aria-labelledby="hx-work-label">
                {FEATURED.map((p, i) => (
                  <li key={p.name}>
                    <button
                      type="button"
                      className="hx-pick"
                      aria-pressed={i === active}
                      onClick={() => setActive(i)}
                      onMouseEnter={() => setActive(i)}
                      onFocus={() => setActive(i)}
                    >
                      {p.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
