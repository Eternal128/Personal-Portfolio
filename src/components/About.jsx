import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { createPortal } from 'react-dom';

import { gojo, virus, road, james, meal, chess, about, music, machine, project, roomie, quietspace } from '../assets';

const CARDS = [
  { src: roomie,      liveHref: 'https://puter.com/app/roomie',          repoHref: 'https://github.com/Eternal128/roomie.git',         label: 'Roomie',                  isLive: true },
  { src: quietspace,  liveHref: 'https://quietspace-zeta.vercel.app/',   repoHref: 'https://github.com/Eternal128/quietspace',         label: 'QuietSpace',              isLive: true },
  { src: chess,       href: 'https://github.com/akashngb/gamegrid',                                                                    label: 'Arcade Games Using Java'                },
  { src: about,       href: '#about-bio', label: 'About Me', isAbout: true },
  { src: music,       href: 'https://github.com/Eternal128/CSC111-Project-2',                                                          label: 'Spotify Recommendation'                 },
  { src: project,     href: 'https://github.com/Eternal128/Personal-Portfolio',                                                        label: 'Portfolio Website'                      },
  { src: meal,        href: 'https://github.com/Eternal128/meal-app',                                                                  label: 'Meal App'                               },
  { src: machine,     href: 'https://github.com/Eternal128/machine-learning-projects',                                                 label: 'Machine Learning Projects'              },
  { src: gojo,        href: 'https://tiktok.com/@eternalglazer',                                                                       label: 'TikTok Edits'                           },
];

const isMobile = () => typeof window !== 'undefined' && window.innerWidth < 768;

const AnimatedPill = ({ children, hovered, repoHref, liveHref, isLive, pos, onPillEnter, onPillLeave }) => {
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLive && repoHref) {
      window.open(repoHref, '_blank', 'noopener,noreferrer');
    }
  };

  const handleMouseOver = (e) => {
    e.stopPropagation();
    if (isLive && onPillEnter) onPillEnter();
  };

  const handleMouseOut = () => {
    if (isLive && onPillLeave) onPillLeave();
  };

  return (
    <>
      <div
        data-pill="true"
        onClick={isLive ? handleClick : undefined}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
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
        pointerEvents: isLive ? 'all' : 'none',
        cursor: isLive ? 'none' : 'none',
      }}
    >
      <span>{children}</span>
      <div style={{ position: 'relative', width: 14, height: 14, overflow: 'hidden', flexShrink: 0 }}>
        <motion.div
          animate={{ x: hovered ? 14 : 0, y: hovered ? -14 : 0, opacity: hovered ? 0 : 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <path d="M1 11L11 1M11 1H4M11 1V8" stroke="rgba(255,255,255,0.85)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
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
    </>
  );
};

const CursorLabel = ({ label, x, y }) =>
  createPortal(
    <div style={{
      position: 'fixed', left: x, top: y,
      transform: 'translate(-50%, -50%)',
      zIndex: 99999, pointerEvents: 'none',
      borderRadius: '100px',
      background: 'rgba(8,8,8,0.72)',
      border: '1px solid rgba(255,255,255,0.12)',
      backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
      padding: '8px 18px', fontSize: 11, fontWeight: 300,
      color: 'rgba(255,255,255,0.85)', letterSpacing: '0.08em',
      textTransform: 'uppercase', whiteSpace: 'nowrap',
      fontFamily: "'DM Sans', sans-serif",
    }}>
      {label}
    </div>,
    document.body
  );

const ParallaxCard = ({ children, speed = 0 }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], isMobile() ? [0, 0] : [speed * -1, speed]);
  return <motion.div ref={ref} style={{ y }}>{children}</motion.div>;
};

const Card = ({ src, href, liveHref, repoHref, label, animDelay, isAbout, isLive }) => {
  const [hovered, setHovered] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [pillHovered, setPillHovered] = useState(false);

  const handleMouseMove = (e) => setPos({ x: e.clientX, y: e.clientY });

  const handleAboutClick = (e) => {
    if (isAbout) {
      e.preventDefault();
      document.getElementById('about-bio')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Live site cards: body click opens site, pill opens repo
  if (isLive) {
    return (
      <motion.div
        data-gallery="true"
        initial={{ clipPath: 'inset(0 0 100% 0 round 10px)' }}
        animate={{ clipPath: 'inset(0 0 0% 0 round 10px)' }}
        transition={{ duration: 0.75, delay: animDelay * 0.6, ease: [0.16, 1, 0.3, 1] }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onMouseMove={handleMouseMove}
        onClick={(e) => {
          if (e.target.closest('[data-pill]')) return;
          window.open(liveHref, '_blank', 'noopener,noreferrer');
        }}
        style={{
          position: 'relative', display: 'block', overflow: 'hidden',
          borderRadius: 3, background: '#111',
          aspectRatio: '1 / 1', width: '100%',
          textDecoration: 'none', flexShrink: 0,
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
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.45), transparent)',
          opacity: hovered ? 1 : 0.5,
          transition: 'opacity 0.4s ease',
          pointerEvents: 'none', zIndex: 1,
        }} />

        {/* Live badge */}
        <div style={{
          position: 'absolute', top: 10, left: 10, zIndex: 7,
          display: 'inline-flex', alignItems: 'center', gap: 5,
          background: 'rgba(0,0,0,0.55)',
          border: '1px solid rgba(255,255,255,0.14)',
          backdropFilter: 'blur(12px)',
          borderRadius: 100,
          padding: '5px 10px',
          fontSize: 10, fontWeight: 300,
          color: 'rgba(255,255,255,0.8)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          fontFamily: "'DM Sans', sans-serif",
          pointerEvents: 'none',
        }}>
          <span style={{
            width: 5, height: 5, borderRadius: '50%',
            background: '#6ee99e',
            boxShadow: '0 0 5px rgba(110,233,158,0.9)',
            flexShrink: 0,
            animation: 'livePulse 2s ease-in-out infinite',
          }} />
          Live
        </div>

        {hovered && !pillHovered && <CursorLabel label={label.toUpperCase()} x={pos.x} y={pos.y} />}
        <AnimatedPill hovered={hovered} repoHref={repoHref} liveHref={liveHref} isLive={true} pos={pos} onPillEnter={() => setPillHovered(true)} onPillLeave={() => setPillHovered(false)}>
          View Github Repo
        </AnimatedPill>

        <style>{`
          @keyframes livePulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.4; }
          }
        `}</style>
      </motion.div>
    );
  }

  // Default card — unchanged behaviour
  const isExternal = href.startsWith('http');
  return (
    <motion.a
      data-gallery="true"
      href={href}
      onClick={handleAboutClick}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      initial={{ clipPath: 'inset(0 0 100% 0 round 10px)' }}
      animate={{ clipPath: 'inset(0 0 0% 0 round 10px)' }}
      transition={{ duration: 0.75, delay: animDelay * 0.6, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      style={{
        position: 'relative', display: 'block', overflow: 'hidden',
        borderRadius: 3, background: '#111',
        aspectRatio: '1 / 1', width: '100%',
        textDecoration: 'none', flexShrink: 0,
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
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%',
        background: 'linear-gradient(to top, rgba(0,0,0,0.45), transparent)',
        opacity: hovered ? 1 : 0.5,
        transition: 'opacity 0.4s ease',
        pointerEvents: 'none', zIndex: 1,
      }} />
      {hovered && <CursorLabel label={label} x={pos.x} y={pos.y} />}
      {!isAbout && <AnimatedPill hovered={hovered}>View Github Repo</AnimatedPill>}
    </motion.a>
  );
};

const GalleryGrid = () => (
  <>
    <style>{`
      .gallery-wrapper { width: 100%; padding: 80px 48px 0; }
      .gallery-inner { position: relative; width: 100%; overflow: visible; padding: 0 24px; }
      .gallery-grid {
        display: grid;
        grid-template-columns: 1fr 1.2fr 1fr;
        gap: 6px;
        align-items: center;
        width: 100%;
      }
      .gallery-col-center { transform: translateY(-28px); }

      @media (max-width: 767px) {
        .gallery-wrapper { padding: 40px 12px 0; }
        .gallery-inner { padding: 0; }
        .gallery-grid { grid-template-columns: 1fr 1fr; gap: 6px; }
        .gallery-col-center { transform: none !important; }
      }
    `}</style>
    <div className="gallery-wrapper">
      <div className="gallery-inner">
        <div style={{ maxWidth: 2000, margin: '0 auto' }}>
          <div className="gallery-grid">
            <ParallaxCard speed={30}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[0,1,2].map(i => (
                  <Card
                    key={i}
                    src={CARDS[i].src}
                    href={CARDS[i].href}
                    liveHref={CARDS[i].liveHref}
                    repoHref={CARDS[i].repoHref}
                    label={CARDS[i].label}
                    isLive={CARDS[i].isLive}
                    animDelay={0.04 + i * 0.06}
                  />
                ))}
              </div>
            </ParallaxCard>

            <ParallaxCard speed={50}>
              <div className="gallery-col-center" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[3,4,5].map((i,idx) => (
                  <Card key={i} src={CARDS[i].src} href={CARDS[i].href} label={CARDS[i].label} isAbout={CARDS[i].isAbout} animDelay={idx * 0.06} />
                ))}
              </div>
            </ParallaxCard>

            <ParallaxCard speed={30}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[6,7,8].map((i,idx) => (
                  <Card key={i} src={CARDS[i].src} href={CARDS[i].href} label={CARDS[i].label} animDelay={0.08 + idx * 0.06} />
                ))}
              </div>
            </ParallaxCard>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ display: 'flex', justifyContent: 'center', marginTop: 36 }}
          >
            <a
              href="#projects"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13, fontWeight: 300,
                color: 'rgba(255,255,255,0.55)',
                letterSpacing: '0.08em', textTransform: 'uppercase',
                textDecoration: 'underline',
                textDecorationColor: 'rgba(255,255,255,0.25)',
                textUnderlineOffset: '4px',
                transition: 'color 0.2s ease, text-decoration-color 0.2s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = 'rgba(255,255,255,0.9)';
                e.currentTarget.style.textDecorationColor = 'rgba(255,255,255,0.6)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = 'rgba(255,255,255,0.55)';
                e.currentTarget.style.textDecorationColor = 'rgba(255,255,255,0.25)';
              }}
            >
              See all projects
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  </>
);

const BIO = {
  name: 'HEY THERE!',
  description: `I'm a Computer Science student at the University of Toronto with internship experience at Ernst & Young, Metrodata Group, and PT. Japfa Comfeed. I have a habit of building things nobody asked for but end up wanting. Outside of coding, I also create anime edits and visual content as a creative outlet.`,
  skills: ['Web Development', 'AI Engineering', 'React', 'Python', 'Figma', 'TensorFlow'],
  experience: [
    { role: 'AI Development Intern',    company: 'Ernst & Young (EY)',   date: '2025'      },
    { role: 'Software Engineer Intern', company: 'Metrodata Group',       date: '2024'      },
    { role: 'Software Engineer Intern', company: 'PT. Japfa Comfeed',     date: '2023'      },
    { role: 'Computer Science Student', company: 'University of Toronto', date: 'Currently' },
  ],
  photo: james,
};

const About = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });

  const galleryY  = useTransform(scrollYProgress, [0, 1], isMobile() ? [0, 0] : [60, -60]);
  const bioTextY  = useTransform(scrollYProgress, [0, 1], isMobile() ? [0, 0] : [40, -40]);
  const bioPhotoY = useTransform(scrollYProgress, [0, 1], isMobile() ? [0, 0] : [80, -20]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,200;9..40,300;9..40,400&display=swap');

        .meet-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 72px;
          width: 100%;
          align-items: start;
        }
        .bio-section { padding: 72px 0 100px; }
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
          .bio-section { padding: 40px 0 60px; }
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
        <motion.div style={{ y: galleryY }}>
          <GalleryGrid />
        </motion.div>

        <motion.div
          id="about-bio"
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="bio-section"
          style={{ borderTop: '1px solid rgba(255,255,255,0.055)', marginTop: 52 }}
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
                <p style={{
                  fontSize: 15, fontWeight: 300,
                  color: 'rgba(255,255,255,0.48)',
                  lineHeight: 1.82, maxWidth: 500, marginBottom: 34,
                }}>
                  {BIO.description}
                </p>
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
                  aspectRatio: '1/1',
                  background: '#111',
                  justifySelf: 'end',
                }}
              >
                <img
                  src={BIO.photo}
                  alt="James William Hanzell"
                  style={{
                    width: '100%', height: '100%',
                    objectFit: 'cover', objectPosition: 'right',
                    filter: 'grayscale(100%) brightness(0.84)',
                    display: 'block',
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