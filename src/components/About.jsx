import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

import { james } from '../assets';

const isMobile = () => typeof window !== 'undefined' && window.innerWidth < 768;

// ── Animated stabilo / highlighter for **bold** segments ──────────────
const Highlight = ({ text, active, baseDelay = 0 }) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  let markIndex = 0;

  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          const idx = markIndex++;
          const delay = active ? baseDelay + idx * 0.18 : 0;

          return (
            <span
              key={i}
              style={{ position: "relative", display: "inline-block", padding: "0 3px", margin: "0 -1px" }}
            >
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: active ? 1 : 0 }}
                transition={{ duration: 0.45, delay, ease: [0.65, 0, 0.35, 1] }}
                style={{
                  position: "absolute", top: "8%", bottom: "4%", left: 0, right: 0,
                  transformOrigin: "left center",
                  background: "linear-gradient(90deg, rgba(212,180,100,0.88) 0%, rgba(225,195,120,0.80) 100%)",
                  boxShadow: "0 0 10px rgba(212,180,100,0.40)",
                  borderRadius: 2, zIndex: 0,
                }}
              />
              <span
                style={{
                  position: "relative", zIndex: 1,
                  color: active ? "#171400" : "rgba(255,255,255,0.48)",
                  fontWeight: 500,
                  transition: `color 0.25s ease ${delay + 0.15}s`,
                }}
              >
                {part.slice(2, -2)}
              </span>
            </span>
          );
        }
        return <React.Fragment key={i}>{part}</React.Fragment>;
      })}
    </>
  );
};

const BIO = {
  name: 'HEY THERE!',
  description: `I'm a Computer Science student at the **University of Toronto** with internships at a **Silicon Valley** startup and **Ernst & Young**. I have a habit of building things nobody asked for but end up wanting. Outside of coding, I also create anime edits and visual content as a creative outlet.`,
  skills: ['Web Development', 'AI Engineering', 'React', 'Python', 'Figma', 'TensorFlow'],
  experience: [
    { role: 'Software Engineer Intern', company: 'Lirvana Labs',          date: '2026 - Present' },
    { role: 'AI Development Intern',    company: 'Ernst & Young (EY)',   date: '2025'      },
    { role: 'Software Engineer Intern', company: 'Metrodata Group',       date: '2024'      },
    { role: 'Software Engineer Intern', company: 'PT. Japfa Comfeed',     date: '2023'      },
    { role: 'Computer Science Student', company: 'University of Toronto', date: 'Currently' },
  ],
  photo: james,
};

const About = () => {
  const [bioActive, setBioActive] = useState(false);
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });

  const bioTextY  = useTransform(scrollYProgress, [0, 1], isMobile() ? [0, 0] : [40, -40]);
  const bioPhotoY = useTransform(scrollYProgress, [0, 1], isMobile() ? [0, 0] : [80, -20]);

  return (
    <>
      <style>{`
.meet-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 100px;
          width: 100%;
          align-items: center;
        }
        .bio-section { padding: 120px 0 100px; }
        .bio-inner   { max-width: 1280px; margin: 0 auto; padding: 0 64px; }

        .exp-row {
          display: grid;
          grid-template-columns: 1.3fr 1.5fr 0.75fr;
          padding: 17px 0;
          border-top: 1px solid rgba(255,255,255,0.06);
          gap: 8px;
          align-items: center;
        }

        @media (max-width: 767px) {
          .meet-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
          .bio-section { padding: 64px 0 60px; }
          .bio-inner   { padding: 0 20px !important; }

          .exp-row {
            grid-template-columns: 1fr 1fr;
            gap: 2px;
          }
          .exp-date {
            grid-column: 1 / -1;
            text-align: left !important;
            font-size: 11px !important;
            color: rgba(255,255,255,0.2) !important;
          }
          .photo-col {
            justify-self: stretch !important;
            max-width: 200px;
          }
        }

        @media (min-width: 768px) and (max-width: 1024px) {
          .meet-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
          .bio-inner { padding: 0 32px !important; }
        }
      `}</style>

      <section
        id="about"
        ref={sectionRef}
        style={{ fontFamily: "'DM Sans', sans-serif", background: 'transparent', overflow: 'hidden' }}
      >
        <motion.div
          id="about-bio"
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="bio-section"
        >
          <div className="bio-inner">
            <div className="meet-grid">

              <motion.div style={{ y: bioTextY }}>
                <h2 style={{
                  fontSize: 'clamp(36px, 8vw, 108px)',
                  fontWeight: 300, color: '#fff',
                  letterSpacing: '-0.025em', lineHeight: 0.96,
                  marginBottom: 28,
                }}>
                  {BIO.name}
                </h2>
                <motion.p
                  onViewportEnter={() => setBioActive(true)}
                  viewport={{ once: true, amount: 0.6 }}
                  style={{
                    fontSize: 15, fontWeight: 300,
                    color: 'rgba(255,255,255,0.48)',
                    lineHeight: 1.9, maxWidth: 500, marginBottom: 34,
                  }}
                >
                  <Highlight text={BIO.description} active={bioActive} baseDelay={0.3} />
                </motion.p>
                <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', marginBottom: 28 }} />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 34 }}>
                  {BIO.skills.map(s => (
                    <span key={s} style={{
                      fontSize: 12, fontWeight: 300,
                      color: 'rgba(255,255,255,0.64)',
                      padding: '7px 15px', borderRadius: '100px',
                      border: '1px solid rgba(255,255,255,0.10)',
                      background: 'rgba(255,255,255,0.03)',
                      letterSpacing: '0.02em',
                    }}>
                      {s}
                    </span>
                  ))}
                </div>
                <div style={{ height: 1, background: 'rgba(255,255,255,0.08)' }} />
                {BIO.experience.map((e, i) => (
                  <div key={i} className="exp-row">
                    <span style={{ fontSize: 13, fontWeight: 300, color: 'rgba(255,255,255,0.60)' }}>{e.role}</span>
                    <span style={{ fontSize: 13, fontWeight: 300, color: 'rgba(255,255,255,0.60)' }}>{e.company}</span>
                    <span className="exp-date" style={{ fontSize: 13, fontWeight: 300, color: 'rgba(255,255,255,0.26)', textAlign: 'right' }}>{e.date}</span>
                  </div>
                ))}
              </motion.div>

              <motion.div
                className="photo-col"
                style={{
                  y: bioPhotoY,
                  borderRadius: 3,
                  overflow: 'hidden',
                  aspectRatio: '4/5',
                  background: '#111',
                  justifySelf: 'end',
                  alignSelf: 'start',
                  marginLeft: '40px',
                  width: '100%',
                  maxWidth: '320px'
                }}
              >
                <img
                  src={BIO.photo}
                  alt="James William Hanzell"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                    display: 'block',
                    filter: 'contrast(1.35) grayscale(50%) brightness(0.84)'
                  }}
                />
              </motion.div>

            </div>
          </div>
        </motion.div>
      </section>
    </>
  );
};

export default About;