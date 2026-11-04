import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects } from '../constants';
import { heroShots } from '../assets/hero';
import { useLenis } from '../context/LenisContext';

gsap.registerPlugin(ScrollTrigger);

// The three projects at the front of the projects list are the ones the hero
// shows, so it follows whatever is added there without its own copy.
const FEATURED = projects.slice(0, 3);

const firstSentence = (text = '') => text.split(/(?<=[.!?])\s/)[0];
const taglineOf = (p) => p.tagline || firstSentence(p.description);
const shotOf = (p) => heroShots[p.name] || { src: p.image, srcSet: undefined, width: 1440, height: 900 };

const Chevron = () => (
  <svg className="ah-chev" width="8" height="12" viewBox="0 0 8 12" aria-hidden="true">
    <path d="M1.5 1.5 6 6l-4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Hero = ({ heroReady = true }) => {
  const [loaded, setLoaded] = useState(false);
  const [active, setActive] = useState(0);
  const lenis = useLenis();
  const sectionRef = useRef(null);
  const deviceRef = useRef(null);
  const imgRefs = useRef([]);
  const requestRef = useRef(0);

  // Reveal only once the loader hands off (the singularity pop)
  useEffect(() => {
    if (!heroReady) return;
    const t = setTimeout(() => setLoaded(true), 60);
    return () => clearTimeout(t);
  }, [heroReady]);

  // The laptop grows to full size over the first 400px of scroll. No pin, so it
  // never interferes with the About section's pin directly below.
  useEffect(() => {
    const device = deviceRef.current;
    const section = sectionRef.current;
    if (!device || !section) return;
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(device, { scale: 0.9, y: 24 }, {
        scale: 1,
        y: 0,
        ease: 'none',
        scrollTrigger: { trigger: section, start: 'top top', end: '+=400', scrub: true },
      });
    });
    return () => mm.revert();
  }, []);

  // Switch only once the next screenshot is decoded, so the screen never shows
  // an empty frame. A newer pick cancels an older one still decoding.
  const select = (i) => {
    if (i === active) return;
    const id = ++requestRef.current;
    const img = imgRefs.current[i];
    const ready = img && img.decode ? img.decode().catch(() => {}) : Promise.resolve();
    ready.then(() => { if (requestRef.current === id) setActive(i); });
  };

  const scrollToId = (id) => (e) => {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(el);
    else el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const current = FEATURED[active];

  return (
    <>
      <style>{`
        .ah {
          position: relative;
          padding: clamp(120px, 17vh, 160px) 0 clamp(72px, 10vh, 112px);
          background: var(--bg);
          color: var(--fg);
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "DM Sans", "Helvetica Neue", sans-serif;
          text-align: center;
          overflow: hidden;
          --ah-blue: #0071e3;
          --ah-blue-hover: #0077ed;
          --ah-link: #2997ff;
          --ah-muted: rgba(var(--fg-rgb), 0.56);
          --ah-track: #1d1d1f;
          --ah-thumb: #424245;
          --ah-alu: #2e2e30;
          --ah-alu-edge: #1f1f21;
        }
        :root[data-theme="light"] .ah {
          --ah-link: #0066cc;
          --ah-track: #e8e8ed;
          --ah-thumb: #ffffff;
          --ah-alu: #e3e4e6;
          --ah-alu-edge: #c4c5c8;
        }
        .ah-head { width: min(860px, calc(100% - 40px)); margin-inline: auto; }

        .ah-title {
          margin: 0;
          font-size: clamp(48px, 6.2vw, 88px);
          font-weight: 600;
          line-height: 1.05;
          letter-spacing: -0.015em;
        }
        .ah-tagline {
          margin: 10px 0 0;
          font-size: clamp(22px, 2.3vw, 32px);
          font-weight: 500;
          line-height: 1.2;
          letter-spacing: -0.01em;
          text-wrap: balance;
        }
        .ah-sub {
          margin: 14px auto 0;
          max-width: 46ch;
          font-size: 17px;
          line-height: 1.47;
          color: var(--ah-muted);
          text-wrap: balance;
        }

        .ah-actions {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          gap: 14px 32px;
          margin-top: 28px;
        }
        .ah-btn {
          display: inline-flex;
          align-items: center;
          height: 44px;
          padding: 0 22px;
          border-radius: 980px;
          background: var(--ah-blue);
          color: #fff;
          font-size: 17px;
          text-decoration: none;
          cursor: none;
          transition: background-color 0.2s, transform 0.2s;
        }
        .ah-btn:hover { background: var(--ah-blue-hover); }
        .ah-btn:active { transform: scale(0.98); }
        .ah-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: var(--ah-link);
          font-size: 17px;
          text-decoration: none;
          background: none;
          border: 0;
          padding: 0;
          font-family: inherit;
          cursor: none;
        }
        .ah-link:hover { text-decoration: underline; text-underline-offset: 3px; }
        .ah-chev { transition: transform 0.2s; }
        .ah-link:hover .ah-chev { transform: translateX(2px); }
        .ah-btn:focus-visible, .ah-link:focus-visible, .ah-seg:focus-visible {
          outline: 2px solid var(--ah-link);
          outline-offset: 3px;
        }

        /* Laptop */
        .ah-stage { margin: clamp(40px, 6vh, 56px) auto 0; width: min(1100px, 94vw); }
        .ah-device { transform-origin: 50% 0; will-change: transform; }
        .ah-lid {
          position: relative;
          width: 86%;
          margin: 0 auto;
          padding: 1.9% 1.9% 2.3%;
          border-radius: clamp(10px, 1.8vw, 22px) clamp(10px, 1.8vw, 22px) 0 0;
          background: #0b0b0c;
          box-shadow: inset 0 0 0 1.5px #333336;
        }
        .ah-notch {
          position: absolute;
          top: 1.9%;
          left: 50%;
          width: 13%;
          height: 3.2%;
          transform: translateX(-50%);
          border-radius: 0 0 8px 8px;
          background: #0b0b0c;
          z-index: 2;
        }
        .ah-screen {
          position: relative;
          aspect-ratio: 16 / 10;
          overflow: hidden;
          border-radius: clamp(4px, 0.7vw, 9px) clamp(4px, 0.7vw, 9px) 0 0;
          background: #161618;
        }
        .ah-screen img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top center;
          opacity: 0;
          transition: opacity 0.4s ease;
        }
        .ah-screen img.is-on { opacity: 1; }
        .ah-base {
          position: relative;
          height: clamp(9px, 1.4vw, 17px);
          border-radius: 0 0 50% 50% / 0 0 100% 100%;
          background: var(--ah-alu);
          border-top: 2px solid var(--ah-alu-edge);
        }
        .ah-base::before {
          content: "";
          position: absolute;
          top: 0;
          left: 50%;
          width: 15%;
          height: 45%;
          transform: translateX(-50%);
          border-radius: 0 0 10px 10px;
          background: var(--ah-alu-edge);
        }
        .ah-shadow {
          width: 88%;
          height: clamp(14px, 2vw, 26px);
          margin: -6px auto 0;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.45);
          filter: blur(16px);
        }

        /* Segmented control */
        .ah-picker {
          display: inline-flex;
          gap: 2px;
          margin-top: clamp(36px, 5vh, 48px);
          padding: 3px;
          border-radius: 980px;
          background: var(--ah-track);
        }
        .ah-seg {
          min-width: 92px;
          height: 36px;
          padding: 0 18px;
          border: 0;
          border-radius: 980px;
          background: transparent;
          color: var(--fg);
          font: inherit;
          font-size: 15px;
          cursor: none;
          opacity: 0.72;
          transition: background-color 0.25s, opacity 0.25s;
        }
        .ah-seg:hover { opacity: 1; }
        .ah-seg[aria-pressed="true"] {
          background: var(--ah-thumb);
          opacity: 1;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.18);
        }
        .ah-caption {
          margin: 18px auto 0;
          max-width: 56ch;
          font-size: 17px;
          line-height: 1.47;
        }
        .ah-caption strong { font-weight: 600; }
        .ah-caption .ah-link { margin-left: 10px; }

        @media (prefers-reduced-motion: no-preference) {
          .ah-rise {
            opacity: 0;
            transform: translateY(24px);
            transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1);
            transition-delay: var(--d, 0ms);
          }
          /* The title rises but never fades, so it can be read from the first frame. */
          .ah-title.ah-rise { opacity: 1; }
          .ah.is-ready .ah-rise { opacity: 1; transform: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ah-screen img, .ah-seg, .ah-btn, .ah-chev { transition: none; }
        }
        @media (max-width: 600px) {
          .ah-seg { min-width: 0; padding: 0 14px; }
          .ah-caption .ah-link { display: flex; justify-content: center; margin: 6px 0 0; }
        }
      `}</style>

      <section ref={sectionRef} className={`ah${loaded ? ' is-ready' : ''}`} aria-labelledby="ah-title">
        <div className="ah-head">
          <h1 id="ah-title" className="ah-title ah-rise">James Hanzell</h1>
          <p className="ah-tagline ah-rise" style={{ '--d': '80ms' }}>Software for the way students work.</p>
          <p className="ah-sub ah-rise" style={{ '--d': '140ms' }}>
            Computer Science at the University of Toronto. Interning at Lirvana Labs, previously EY.
          </p>
          <div className="ah-actions ah-rise" style={{ '--d': '200ms' }}>
            <a className="ah-btn" href="#projects" onClick={scrollToId('projects')}>See projects</a>
            <a className="ah-link" href="#contact" onClick={scrollToId('contact')}>Get in touch <Chevron /></a>
          </div>
        </div>

        <div className="ah-stage ah-rise" style={{ '--d': '280ms' }}>
          <figure className="ah-device" ref={deviceRef} style={{ margin: 0 }}>
            <div className="ah-lid">
              <span className="ah-notch" aria-hidden="true" />
              <div className="ah-screen">
                {FEATURED.map((p, i) => {
                  const shot = shotOf(p);
                  // The first screenshot loads at once; the others wait for the
                  // loader to hand off so they never compete with it.
                  const show = i === 0 || heroReady;
                  return (
                    <img
                      key={p.name}
                      ref={(el) => { imgRefs.current[i] = el; }}
                      src={show ? shot.src : undefined}
                      srcSet={show ? shot.srcSet : undefined}
                      sizes="(max-width: 1100px) 82vw, 900px"
                      width={shot.width}
                      height={shot.height}
                      alt={i === active ? `${p.name}, project screenshot` : ''}
                      aria-hidden={i === active ? undefined : true}
                      className={i === active ? 'is-on' : undefined}
                      fetchpriority={i === 0 ? 'high' : 'low'}
                      decoding="async"
                    />
                  );
                })}
              </div>
            </div>
            <div className="ah-base" aria-hidden="true" />
            <div className="ah-shadow" aria-hidden="true" />
          </figure>

          <div className="ah-picker" role="group" aria-label="Recent projects">
            {FEATURED.map((p, i) => (
              <button
                key={p.name}
                type="button"
                className="ah-seg"
                aria-pressed={i === active}
                onClick={() => select(i)}
              >
                {p.name}
              </button>
            ))}
          </div>

          <p className="ah-caption" aria-live="polite">
            <strong>{current.name}.</strong> {taglineOf(current)}
            {current.live_demo_link ? (
              <a className="ah-link" href={current.live_demo_link} target="_blank" rel="noopener noreferrer">
                Visit site <Chevron />
              </a>
            ) : (
              <a className="ah-link" href="#projects" onClick={scrollToId('projects')}>
                See project <Chevron />
              </a>
            )}
          </p>
        </div>
      </section>
    </>
  );
};

export default Hero;
