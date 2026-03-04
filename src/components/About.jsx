import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { createPortal } from 'react-dom';

import { gojo, virus, road, james, meal, chess, about, music, machine, project } from '../assets';

const CARDS = [
  { src: virus, href: '#projects', label: 'COVID-19 X-Ray Classification' },
  { src: road,  href: '#projects', label: 'Jakarta Route Optimization Using Dijkstra and Kruskal\'s Algorithm' },
  { src: chess, href: '#projects', label: 'Arcade Games Using Java' },
  { src: about,  href: '#about',    label: 'About Me', isAbout: true },   
  { src: music,  href: '#projects', label: 'Spotify Recommendation' },
  { src: project, href: '#projects', label: 'Portfolio website' },
  { src: meal,  href: '#projects', label: 'Meal App' },
  { src: machine,  href: '#projects', label: 'Machine Learning Projects' },
  { src: gojo,  href: '#projects', label: 'Tiktok Edits' },
];

// Animated diagonal arrow pill — arrow flies top-right on hover, new one enters from bottom-left
const AnimatedPill = ({ children }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'absolute', bottom: 10, left: 10, right: 10, zIndex: 6,
        borderRadius: 8,
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.12)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        padding: '10px 16px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: 11, fontWeight: 300,
        color: 'rgba(255,255,255,0.7)', letterSpacing: '0.1em',
        textTransform: 'uppercase',
        fontFamily: "'DM Sans', sans-serif",
        overflow: 'hidden',
      }}
    >
      <span>{children}</span>
      {/* Arrow container — clips two arrows, one exits top-right, one enters from bottom-left */}
      <div style={{ position: 'relative', width: 14, height: 14, overflow: 'hidden', flexShrink: 0 }}>
        {/* Exiting arrow */}
        <motion.div
          animate={{ x: hovered ? 14 : 0, y: hovered ? -14 : 0, opacity: hovered ? 0 : 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <path d="M1 11L11 1M11 1H4M11 1V8" stroke="rgba(255,255,255,0.85)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
        {/* Entering arrow */}
        <motion.div
          animate={{ x: hovered ? 0 : -14, y: hovered ? 0 : 14, opacity: hovered ? 1 : 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <path d="M1 11L11 1M11 1H4M11 1V8" stroke="rgba(255,255,255,0.85)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </div>
    </div>
  );
};

const CursorLabel = ({ label, x, y }) =>
  createPortal(
    <div style={{
      position: 'fixed',
      left: x,
      top: y,
      transform: 'translate(-50%, calc(-100% - 12px))',
      zIndex: 99999,
      pointerEvents: 'none',
      borderRadius: '100px',
      background: 'rgba(8,8,8,0.72)',
      border: '1px solid rgba(255,255,255,0.12)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      padding: '8px 18px',
      fontSize: 11,
      fontWeight: 300,
      color: 'rgba(255,255,255,0.85)',
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      whiteSpace: 'nowrap',
      fontFamily: "'DM Sans', sans-serif",
    }}>
      {label}
    </div>,
    document.body
  );

// ─── PARALLAX CARD WRAPPER ────────────────────────────────────────────────────
const ParallaxCard = ({ children, speed = 0 }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [speed * -1, speed]);

  return (
    <motion.div ref={ref} style={{ y }}>
      {children}
    </motion.div>
  );
};

const Card = ({ src, href, label, animDelay, isAbout }) => {
  const [hovered, setHovered] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    setPos({ x: e.clientX, y: e.clientY });
  };

  const handleAboutClick = (e) => {
    if (isAbout) {
      e.preventDefault();
      document.getElementById('about-bio')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.a
      data-gallery="true"
      href={href}
      onClick={handleAboutClick}
      initial={{ clipPath: 'inset(0 0 100% 0 round 10px)' }}
      animate={{ clipPath: 'inset(0 0 0% 0 round 10px)' }}
      transition={{ duration: 0.75, delay: animDelay * 0.6, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      style={{
        position: 'relative', display: 'block', overflow: 'hidden',
        borderRadius: 3, background: '#111',
        aspectRatio: '1 / 1',
        width: '100%', textDecoration: 'none', flexShrink: 0,
        cursor: 'none',
      }}
    >
      <img src={src} alt="" style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        objectFit: 'cover', objectPosition: 'center',
        filter: hovered ? 'grayscale(0%) brightness(0.95)' : 'grayscale(100%) brightness(0.72)',
        transform: hovered ? 'scale(1.04)' : 'scale(1)',
        transition: 'filter 0.4s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        pointerEvents: 'none',
      }} />

      {/* bottom vignette */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%',
        background: 'linear-gradient(to top, rgba(0,0,0,0.45), transparent)',
        opacity: hovered ? 1 : 0.5,
        transition: 'opacity 0.4s ease',
        pointerEvents: 'none', zIndex: 1,
      }} />

      {/* Cursor label */}
      {hovered && <CursorLabel label={label} x={pos.x} y={pos.y} />}

      {/* Bottom pill — no pill for About Me card, animated arrow pill for others */}
      {!isAbout && (
        <AnimatedPill>View Github Repo</AnimatedPill>
      )}
    </motion.a>
  );
};

// ─── GALLERY GRID ─────────────────────────────────────────────────────────────
// Each column gets a different parallax speed for depth
const GalleryGrid = () => (
  <div style={{ width: '100%', padding: '80px 48px 0' }}>
    <div style={{ position: 'relative', width: '100%', overflow: 'visible', padding: '0 24px' }}>
      <div style={{ maxWidth: 2000, margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.2fr 1fr',
          gap: 6,
          alignItems: 'center',
          width: '100%',
        }}>
          {/* LEFT — slowest parallax */}
          <ParallaxCard speed={30}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[0,1,2].map(i => (
                <Card key={i} src={CARDS[i].src} href={CARDS[i].href} label={CARDS[i].label} animDelay={0.04 + i * 0.06} />
              ))}
            </div>
          </ParallaxCard>

          {/* CENTER — medium parallax + vertical offset */}
          <ParallaxCard speed={50}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, transform: 'translateY(-28px)' }}>
              {[3,4,5].map((i,idx) => (
                <Card key={i} src={CARDS[i].src} href={CARDS[i].href} label={CARDS[i].label} isAbout={CARDS[i].isAbout} animDelay={idx * 0.06} />
              ))}
            </div>
          </ParallaxCard>

          {/* RIGHT — fastest parallax */}
          <ParallaxCard speed={30}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[6,7,8].map((i,idx) => (
                <Card key={i} src={CARDS[i].src} href={CARDS[i].href} label={CARDS[i].label} animDelay={0.08 + idx * 0.06} />
              ))}
            </div>
          </ParallaxCard>
        </div>
      </div>
    </div>
  </div>
);

// ─── BIO DATA ─────────────────────────────────────────────────────────────────
const BIO = {
  name: 'HEY THERE!',
  description: `I'm James, a student who loves building things that are fun to build! I'm proud of my ability to learn quickly and think fast on my feet!`,
  skills: ['Web Development', 'AI Engineering', 'React', 'Python', 'Figma', 'TensorFlow'],
  experience: [
    { role: 'AI Development Intern',    company: 'Ernst & Young (EY)',    date: '2025'      },
    { role: 'Software Engineer Intern', company: 'Metrodata Group',        date: '2024'      },
    { role: 'Software Engineer Intern', company: 'PT. Japfa Comfeed',      date: '2023'      },
    { role: 'Computer Science Student', company: 'University of Toronto',  date: 'Currently' },
  ],
  photo: james,
};

// ─── ABOUT SECTION ────────────────────────────────────────────────────────────
const About = () => (
  <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,200;9..40,300;9..40,400&display=swap');
      .meet-grid {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 72px;
        max-width: 1800px;
        align-items: center;
      }
      @media (max-width: 900px) {
        .meet-grid  { grid-template-columns: 1fr !important; gap: 48px !important; }
        .meet-inner { padding: 56px 24px 80px !important; }
      }
    `}</style>

    <section id="about" style={{ fontFamily: "'DM Sans', sans-serif", background: 'transparent' }}>

      <GalleryGrid />

      {/* ── id here so the "About Me" card can scroll to it ── */}
      <motion.div
        id="about-bio"
        className="meet-inner"
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{ padding: '72px 64px 100px', borderTop: '1px solid rgba(255,255,255,0.055)', marginTop: 52 }}
      >
        <div className="meet-grid">
          <div>
            <h2 style={{ fontSize: 'clamp(56px, 8vw, 108px)', fontWeight: 300, color: '#fff', letterSpacing: '-0.025em', lineHeight: 0.96, marginBottom: 28, whiteSpace: 'pre-line' }}>
              {BIO.name}
            </h2>
            <p style={{ fontSize: 15, fontWeight: 300, color: 'rgba(255,255,255,0.48)', lineHeight: 1.82, maxWidth: 500, marginBottom: 34 }}>
              {BIO.description}
            </p>
            <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', marginBottom: 28 }} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 34 }}>
              {BIO.skills.map(s => (
                <span key={s} style={{ fontSize: 12, fontWeight: 300, color: 'rgba(255,255,255,0.64)', padding: '7px 15px', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.10)', background: 'rgba(255,255,255,0.03)', letterSpacing: '0.02em' }}>
                  {s}
                </span>
              ))}
            </div>
            <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', marginBottom: 0 }} />
            {BIO.experience.map((e, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.3fr 1.5fr 0.75fr', padding: '17px 0', borderTop: '1px solid rgba(255,255,255,0.06)', gap: 8, alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 300, color: 'rgba(255,255,255,0.60)' }}>{e.role}</span>
                <span style={{ fontSize: 13, fontWeight: 300, color: 'rgba(255,255,255,0.60)' }}>{e.company}</span>
                <span style={{ fontSize: 13, fontWeight: 300, color: 'rgba(255,255,255,0.26)', textAlign: 'right' }}>{e.date}</span>
              </div>
            ))}
          </div>

          <div style={{ borderRadius: 10, overflow: 'hidden', aspectRatio: '1/1', background: '#111', justifySelf: 'end' }}>
            <img src={BIO.photo} alt="James William Hanzell" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'right', filter: 'grayscale(100%) brightness(0.84)', display: 'block' }} />
          </div>
        </div>
      </motion.div>
    </section>
  </>
);

export default About;