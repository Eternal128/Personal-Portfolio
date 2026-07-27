import React, { useState, useRef, useEffect, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const mapRange = (v, inMin, inMax, outMin, outMax) => {
  const t = clamp01((v - inMin) / (inMax - inMin));
  return outMin + t * (outMax - outMin);
};

const STATEMENT = `Hey there! I'm James. I'm a Computer Science student at the **University of Toronto**, with internships at a **Silicon Valley** startup and **Ernst & Young**. Outside of code, I create anime edits and visual content as a creative outlet.`;

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

const About = () => {
  const [isPinned, setIsPinned] = useState(true);
  const [progress, setProgress] = useState(0);
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
                  const color = `rgba(255,255,255,${0.15 + reveal * 0.85})`;
                  return (
                    <span
                      key={i}
                      className="ab-token"
                      style={{ color, fontWeight: token.bold ? 600 : 500 }}
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
    </>
  );
};

export default About;
