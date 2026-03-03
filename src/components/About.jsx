import React, { useState } from 'react';
import { motion } from 'framer-motion';

import { gojo, virus, road, james, meal, chess} from '../assets';

const COLS = [
  {
    key: 'L',
    delay: 0.10,
    cards: [
      {
        src: virus,
        tall: true,
      },
      {
        src: road ,
        tall: true,
      },
    ],
  },
  {
    key: 'C',
    delay: 0.00,
    cards: [
      {
        src: gojo,
        isAbout: true, 
        tall: true,  
      },
      {
        src: gojo,
        tall: true,
      },
      {
        src: gojo,
        tall: true,
      }
    ],
  },
  {
    key: 'R',
    delay: 0.16,
    cards: [
      {
        src: meal,
        tall: true
      },
      {
        src: chess,
        tall: true
      },
    ],
  },
];


const BIO = {
  name: 'HEY THERE!',

  description: `I'm James, a student who loves building things that I are fun to build! I'm proud of my ability to learn quickly and think fast on my feet!`,

  skills: [
    'Web Development',
    'AI Engineering',
    'React',
    'Python',
    'Figma',
    'TensorFlow',
  ],

  experience: [
    { role: 'AI Development Intern',    company: 'Ernst & Young (EY)',   date: '2025'      },
    { role: 'Software Engineer Intern', company: 'Metrodata Group',       date: '2024'      },
    { role: 'Software Engineer Intern', company: 'PT. Japfa Comfeed',     date: '2023'      },
    { role: 'Computer Science Student', company: 'University of Toronto', date: 'Currently' },
  ],

  photo: gojo,
};

const ArrowIcon = () => (
  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
    <path
      d="M1 11L11 1M11 1H4M11 1V8"
      stroke="rgba(255,255,255,0.82)"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* ── single gallery card ── */
const Card = ({ src, isAbout, tall, colDelay, idx }) => {
  const [hovered, setHovered] = useState(false);

  const isCenterCard = tall || isAbout !== undefined;
  const h = tall ? 578 : isCenterCard ? 292 : 308;

  return (
    <motion.div
      initial={{ clipPath: 'inset(0 0 100% 0 round 14px)' }}
      animate={{ clipPath: 'inset(0 0 0% 0 round 14px)'   }}
      transition={{
        duration: 1.1,
        delay: colDelay + idx * 0.14,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 5,
        background: '#111',
        cursor: 'pointer',
        height: h,
        flexShrink: 0,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── image: grayscale → color + slow zoom on hover ── */}
      <img
        src={src}
        alt=""
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          filter: hovered
            ? 'grayscale(0%) brightness(1.02)'
            : 'grayscale(100%) brightness(0.80)',
          transform: hovered ? 'scale(1.07)' : 'scale(1)',
          transition:
            'filter 0.75s ease, transform 1.2s cubic-bezier(0.25,0.46,0.45,0.94)',
          pointerEvents: 'none',
          userSelect: 'none',
          willChange: 'transform, filter',
        }}
      />

      {/* ── bottom vignette ── */}
      <div
        style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          height: '50%',
          background:
            'linear-gradient(to top, rgba(0,0,0,0.50) 0%, transparent 100%)',
          opacity: hovered ? 0.85 : 0.40,
          transition: 'opacity 0.4s',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* ── "About Me" badge (center tall card only) ── */}
      {isAbout && (
        <div
          style={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
            zIndex: 5,
            padding: '10px 26px',
            borderRadius: '100px',
            background: 'rgba(18,18,18,0.72)',
            border: '1px solid rgba(255,255,255,0.14)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            fontSize: 14,
            fontWeight: 300,
            color: 'rgba(255,255,255,0.92)',
            letterSpacing: '0.04em',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            opacity: hovered ? 0 : 1,
            transition: 'opacity 0.25s',
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          About Me
        </div>
      )}

      {/* ── "View Casestudy" — slides up on hover ── */}
      <div
        style={{
          position: 'absolute',
          bottom: 12, left: 12, right: 12,
          zIndex: 6,
          borderRadius: '100px',
          background: 'rgba(155,155,155,0.18)',
          border: '1px solid rgba(255,255,255,0.16)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          padding: '13px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          fontSize: 13,
          fontWeight: 300,
          color: 'rgba(255,255,255,0.88)',
          letterSpacing: '0.04em',
          transform: hovered
            ? 'translateY(0)'
            : 'translateY(calc(100% + 16px))',
          opacity: hovered ? 1 : 0,
          transition:
            'transform 0.44s cubic-bezier(0.22,1,0.36,1), opacity 0.30s ease',
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        View Casestudy <ArrowIcon />
      </div>
    </motion.div>
  );
};

/* ── main About component ── */
const About = () => (
  <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,200;9..40,300;9..40,400&display=swap');

      /* 3-col grid — center 1.22× wider, bottom-aligned so center protrudes up */
      .about-gallery {
        display: grid;
        grid-template-columns: 1fr 1.22fr 1fr;
        gap: 6px;
        align-items: end;
        width: 100%;
      }
      .about-col {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      /* Meet James two-col layout */
      .meet-grid {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 72px;
        max-width: 1800px;
        align-items: center;
      }

      /* responsive */
      @media (max-width: 900px) {
        .meet-grid  { grid-template-columns: 1fr !important; gap: 48px !important; }
        .meet-inner { padding: 56px 24px 80px !important; }
      }
      @media (max-width: 600px) {
        .about-gallery { grid-template-columns: 1fr !important; }
      }
    `}</style>

    <section
      id="about"
      style={{ fontFamily: "'DM Sans', sans-serif", background: 'transparent' }}
    >

      {/* ════ GALLERY ════ */}
      <div className="about-gallery">
        {COLS.map(col => (
          <div key={col.key} className="about-col">
            {col.cards.map((card, i) => (
              <Card
                key={i}
                {...card}
                colDelay={col.delay}
                idx={i}
              />
            ))}
          </div>
        ))}
      </div>

      {/* ════ MEET JAMES ════ */}
      <motion.div
        className="meet-inner"
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{
          padding: '72px 64px 100px',
          borderTop: '1px solid rgba(255,255,255,0.055)',
          marginTop: 52,
        }}
      >
        <div className="meet-grid">
          {/* ── left: all text ── */}
          <div>

            {/* Big title */}
            <h2
              style={{
                fontSize: 'clamp(56px, 8vw, 108px)',
                fontWeight: 300,
                color: '#fff',
                letterSpacing: '-0.025em',
                lineHeight: 0.96,
                marginBottom: 28,
                whiteSpace: 'pre-line',
              }}
            >
              {BIO.name}
            </h2>

            {/* Bio paragraph */}
            <p
              style={{
                fontSize: 15,
                fontWeight: 300,
                color: 'rgba(255,255,255,0.48)',
                lineHeight: 1.82,
                maxWidth: 500,
                marginBottom: 34,
              }}
            >
              {BIO.description}
            </p>

            {/* divider */}
            <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', marginBottom: 28 }} />

            {/* skill tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 34 }}>
              {BIO.skills.map(s => (
                <span
                  key={s}
                  style={{
                    fontSize: 12,
                    fontWeight: 300,
                    color: 'rgba(255,255,255,0.64)',
                    padding: '7px 15px',
                    borderRadius: '100px',
                    border: '1px solid rgba(255,255,255,0.10)',
                    background: 'rgba(255,255,255,0.03)',
                    letterSpacing: '0.02em',
                  }}
                >
                  {s}
                </span>
              ))}
            </div>

            {/* divider */}
            <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', marginBottom: 0 }} />

            {/* experience rows */}
            {BIO.experience.map((e, i) => (
              <div
                key={i}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.3fr 1.5fr 0.75fr',
                  padding: '17px 0',
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                  gap: 8,
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 300, color: 'rgba(255,255,255,0.60)' }}>
                  {e.role}
                </span>
                <span style={{ fontSize: 13, fontWeight: 300, color: 'rgba(255,255,255,0.60)' }}>
                  {e.company}
                </span>
                <span style={{ fontSize: 13, fontWeight: 300, color: 'rgba(255,255,255,0.26)', textAlign: 'right' }}>
                  {e.date}
                </span>
              </div>
            ))}

          </div>

          {/* ── right: portrait photo ── */}
          <div
            style={{
              borderRadius: 16,
              overflow: 'hidden',
              aspectRatio: '1/1',
              background: '#111',
              justifySelf: 'end',
            }}
          >
            <img
              src={BIO.photo}
              alt="James William Hanzell"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'right',
                filter: 'grayscale(100%) brightness(0.84)',
                display: 'block',
              }}
            />
          </div>

        </div>
      </motion.div>

    </section>
  </>
);

export default About;