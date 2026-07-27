import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { experiences } from '../constants';

gsap.registerPlugin(ScrollTrigger);

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const mapRange = (v, inMin, inMax, outMin, outMax) => {
  const t = clamp01((v - inMin) / (inMax - inMin));
  return outMin + t * (outMax - outMin);
};

const readableTextOn = (hex) => {
  const c = hex.replace('#', '');
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? '#171400' : '#fff';
};

const SILICON_VALLEY_JOB = experiences.find((e) => e.company_name === 'Lirvana Labs');
const EY_JOB = experiences.find((e) => e.company_name === 'Ernst & Young (EY)');
const ANIME_EDIT_VIDEO = 'https://res.cloudinary.com/daetzwh6x/video/upload/v1773972350/toji_mograph_hbqmsu.mov';

// Tokens whose hover should trigger the cursor-following preview.
const HOVER_TOKENS = {
  'Silicon Valley': 'silicon',
  'Ernst & Young.': 'ey',
  'anime edits': 'anime',
};

const STATEMENT = `Hey there! I'm James. I'm a Computer Science student at the **University of Toronto**, with internships at a **Silicon Valley** startup and **Ernst & Young.** I'm always happy to learn new things and connect with new people! Outside of code, I create **anime edits** and visual content as a creative outlet.`;

// Splits the statement into tokens — a **bold phrase** reveals as one unit,
// everything else reveals word by word.
const useTokens = (text) => useMemo(() => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  const out = [];
  parts.forEach((part) => {
    if (!part) return;
    if (part.startsWith('**') && part.endsWith('**')) {
      out.push({ text: part.slice(2, -2), bold: true });
    } else {
      part.split(/\s+/).filter(Boolean).forEach((w) => out.push({ text: w, bold: false }));
    }
  });
  return out;
}, [text]);

// Cursor-following preview box — same spring-follow mechanic as the
// Experience section's hover card (gsap.quickTo on left/top, scale-in via
// framer-motion), swapping content based on which token is hovered.
const CursorPreview = ({ hovered }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const xTo = gsap.quickTo(containerRef.current, 'left', { duration: 0.6, ease: 'power3' });
    const yTo = gsap.quickTo(containerRef.current, 'top', { duration: 0.6, ease: 'power3' });
    const handler = (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  const active = hovered !== null;

  return (
    <motion.div
      ref={containerRef}
      initial={{ scale: 0 }}
      animate={{ scale: active ? 1 : 0 }}
      transition={{ duration: 0.4, ease: active ? [0.16, 1, 0.3, 1] : [0.6, 0, 0.8, 0.2] }}
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        transform: 'translate(-50%, -50%)',
        zIndex: 60,
        pointerEvents: 'none',
      }}
    >
      {hovered === 'silicon' && SILICON_VALLEY_JOB && (
        <JobCard job={SILICON_VALLEY_JOB} stack="Next.js · TypeScript · React · Rust" />
      )}

      {hovered === 'ey' && EY_JOB && (
        <JobCard job={EY_JOB} stack="Python · Azure AI · Selenium · Postman" />
      )}

      {hovered === 'anime' && (
        <div style={{
          width: 280, aspectRatio: '16 / 9', borderRadius: 16, overflow: 'hidden',
          boxShadow: '0 24px 60px rgba(0,0,0,0.55)', background: 'var(--bg)',
        }}>
          <video
            src={ANIME_EDIT_VIDEO}
            autoPlay muted loop playsInline
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      )}
    </motion.div>
  );
};

const JobCard = ({ job, stack }) => (
  <div style={{
    width: 240, borderRadius: 16, overflow: 'hidden',
    background: job.iconBg,
    boxShadow: '0 24px 60px rgba(0,0,0,0.55)',
    padding: 20, display: 'flex', flexDirection: 'column', gap: 12,
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <img src={job.icon} alt="" style={{ width: 36, height: 36, objectFit: 'contain' }} />
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: readableTextOn(job.iconBg), fontFamily: "'DM Sans', sans-serif" }}>
          {job.company_name}
        </div>
        <div style={{ fontSize: 11, fontWeight: 300, color: readableTextOn(job.iconBg), opacity: 0.7, fontFamily: "'DM Sans', sans-serif" }}>
          {job.title}
        </div>
      </div>
    </div>
    <div style={{ fontSize: 11, color: readableTextOn(job.iconBg), opacity: 0.6, fontFamily: "'DM Sans', sans-serif" }}>
      {stack}
    </div>
  </div>
);

const About = () => {
  const [isPinned, setIsPinned] = useState(true);
  const [progress, setProgress] = useState(0);
  const [hoveredToken, setHoveredToken] = useState(null);
  const wrapRef = useRef(null);
  const tokens = useTokens(STATEMENT);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const mm = ScrollTrigger.matchMedia({
      '(min-width: 768px)': function () {
        setIsPinned(true);

        const st = ScrollTrigger.create({
          id: 'about-pin',
          trigger: wrap,
          start: 'top top',
          end: () => '+=' + window.innerHeight * 2.2,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate(self) {
            setProgress(self.progress);
          },
        });

        return () => st.kill();
      },
      '(max-width: 767px)': function () {
        setIsPinned(false);
        setProgress(0);
      },
    });

    return () => mm.revert();
  }, []);

  const n = tokens.length;

  return (
    <>
      <style>{`
        .ab-pin { position: relative; }
        .ab-pin-inner {
          width: 100%;
          min-height: 100vh;
          display: flex;
          align-items: center;
          padding: 0 clamp(24px, 6vw, 120px);
        }
        .ab-statement {
          max-width: 1100px;
          margin: 0 auto;
          font-size: clamp(26px, 3.6vw, 52px);
          font-weight: 500;
          line-height: 1.4;
          letter-spacing: -0.01em;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          text-align: center;
          column-gap: 0.32em;
          row-gap: 0.1em;
        }
        .ab-token { transition: color 0.05s linear; }

        @media (max-width: 767px) {
          .ab-pin-inner { min-height: 0; padding: 64px clamp(24px, 6vw, 60px); }
          .ab-statement { font-size: clamp(22px, 6vw, 32px); }
        }
      `}</style>

      <section id="about" style={{ fontFamily: "'DM Sans', sans-serif", background: 'transparent' }}>
        <div className="ab-pin" ref={wrapRef}>
          <div className="ab-pin-inner">
            <div style={{ width: '100%' }}>
              <p className="ab-statement">
                {tokens.map((token, i) => {
                  const reveal = isPinned ? mapRange(progress, i / n, (i + 1) / n, 0, 1) : 1;
                  const color = `rgba(var(--fg-rgb),${0.15 + reveal * 0.85})`;
                  const hoverKey = HOVER_TOKENS[token.text];
                  return (
                    <span
                      key={i}
                      className="ab-token"
                      style={{
                        color,
                        fontWeight: token.bold ? 600 : 500,
                        cursor: hoverKey ? 'pointer' : undefined,
                      }}
                      onMouseEnter={hoverKey ? () => setHoveredToken(hoverKey) : undefined}
                      onMouseLeave={hoverKey ? () => setHoveredToken(null) : undefined}
                    >
                      {token.text}
                    </span>
                  );
                })}
              </p>
            </div>
          </div>
        </div>
      </section>

      <CursorPreview hovered={hoveredToken} />
    </>
  );
};

export default About;
