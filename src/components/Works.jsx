import React, { useState, useEffect, useRef, useCallback } from "react";
import Tilt from 'react-parallax-tilt';
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { styles } from "../styles";
import { github } from "../assets";
import { projects } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";
import { useSound } from "../context/SoundContext";
import { useLenis } from "../context/LenisContext";

gsap.registerPlugin(ScrollTrigger);

// Muted, moody backdrop tones cycling per project — deliberately dark
// variations rather than saturated brand colors, so the rail still reads
// as part of this site's restrained black/gold system, not a bright carousel.
const RAIL_COLORS = ['#0d0d0d', '#15100a', '#0a0e14', '#120a0e', '#0a120e', '#0d0d14'];

const SLIDE_WIDTH = 420;
const SLIDE_GAP = 56;
const CARD_SCROLL_PX = 650; // vertical scroll px consumed per horizontal card step

const ExternalLinkIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 13L13 1M13 1H5M13 1V9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ── Modal ──────────────────────────────────────────────────────
const ProjectModal = ({ project, onClose }) => {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        zIndex: 99998,
        background: 'rgba(0,0,0,0.88)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0,  scale: 1    }}
        exit={{    opacity: 0, y: 14, scale: 0.98  }}
        transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 800,
          maxHeight: '95vh',
          background: '#080808',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 14,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Hero image */}
        <div style={{ position: 'relative', width: '100%', height: 200, flexShrink: 0 }}>
          <img
            src={project.image}
            alt={project.name}
            style={{
              width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: 'center',
              filter: 'brightness(0.6)',
              display: 'block',
            }}
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom, transparent 20%, #080808 100%)',
            pointerEvents: 'none',
          }} />

          {/* Close */}
          <button
            onClick={onClose}
            aria-label="Close project details"
            style={{
              position: 'absolute', top: 14, right: 14,
              width: 32, height: 32, borderRadius: '50%',
              background: 'rgba(0,0,0,0.65)',
              border: '1px solid rgba(255,255,255,0.14)',
              backdropFilter: 'blur(12px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'none', color: 'rgba(255,255,255,0.75)',
              fontSize: 13, lineHeight: 1,
            }}
          >
            ✕
          </button>

          {/* Live badge */}
          {project.live_demo_link && (
            <div style={{
              position: 'absolute', top: 14, left: 14,
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(0,0,0,0.6)',
              border: '1px solid rgba(255,255,255,0.14)',
              backdropFilter: 'blur(12px)',
              borderRadius: 100, padding: '5px 12px',
              fontSize: 10, fontWeight: 300,
              color: 'rgba(255,255,255,0.8)',
              letterSpacing: '0.08em', textTransform: 'uppercase',
              pointerEvents: 'none',
            }}>
              <span style={{
                width: 5, height: 5, borderRadius: '50%',
                background: '#6ee99e',
                boxShadow: '0 0 6px rgba(110,233,158,0.9)',
                animation: 'modalLivePulse 2s ease-in-out infinite',
              }} />
              Live
            </div>
          )}

          {/* Title */}
          <div style={{ position: 'absolute', bottom: 14, left: 22 }}>
            <h2 style={{
              margin: 0,
              fontSize: 'clamp(18px, 3vw, 28px)',
              fontWeight: 300, color: '#fff',
              letterSpacing: '-0.02em', lineHeight: 1,
              fontFamily: "'DM Sans', sans-serif",
            }}>
              {project.name}
            </h2>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '18px 24px 28px', overflowY: 'auto' }}>
          {/* Tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
            {project.tags.map((tag) => (
              <span
                key={tag.name}
                style={{
                  fontSize: 11, fontWeight: 300,
                  color: 'rgba(255,255,255,0.45)',
                  padding: '4px 12px', borderRadius: 100,
                  border: '1px solid rgba(255,255,255,0.09)',
                  background: 'rgba(255,255,255,0.03)',
                  letterSpacing: '0.04em',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                #{tag.name}
              </span>
            ))}
          </div>

          <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 16 }} />

          {/* Description */}
          <p style={{
            fontSize: 14, fontWeight: 300,
            color: 'rgba(255,255,255,0.52)',
            lineHeight: 1.85,
            marginBottom: 24,
            maxWidth: 600,
            fontFamily: "'DM Sans', sans-serif",
          }}>
            {project.description}
          </p>

          {/* Case study: problem / approach / outcome, shown only when a project has them */}
          {(project.problem || project.approach || project.outcome) && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginBottom: 24, maxWidth: 600 }}>
              {[
                ['Problem', project.problem],
                ['Approach', project.approach],
                ['Outcome', project.outcome],
              ].map(([label, text]) => text && (
                <div key={label}>
                  <div style={{
                    fontSize: 10.5, fontWeight: 500,
                    letterSpacing: '0.18em', textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.35)', marginBottom: 6,
                    fontFamily: "'DM Sans', sans-serif",
                  }}>
                    {label}
                  </div>
                  <p style={{
                    fontSize: 13.5, fontWeight: 300,
                    color: 'rgba(255,255,255,0.55)',
                    lineHeight: 1.8,
                    fontFamily: "'DM Sans', sans-serif",
                  }}>
                    {text}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Screenshot gallery, shown only when a project has one */}
          {project.gallery && project.gallery.length > 0 && (
            <div style={{ display: 'flex', gap: 10, overflowX: 'auto', marginBottom: 24 }}>
              {project.gallery.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`${project.name} screenshot ${i + 1}`}
                  style={{ height: 120, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }}
                />
              ))}
            </div>
          )}

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {project.live_demo_link && (
              <a
                href={project.live_demo_link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '10px 22px', borderRadius: 100,
                  background: '#fff', color: '#000',
                  fontSize: 12, fontWeight: 400,
                  letterSpacing: '0.06em', textTransform: 'uppercase',
                  textDecoration: 'none', cursor: 'none',
                  transition: 'opacity 0.2s',
                  fontFamily: "'DM Sans', sans-serif",
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.82'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                View Live Site
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                  <path d="M1 11L11 1M11 1H4M11 1V8" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            )}
            <a
              href={project.source_code_link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '10px 22px', borderRadius: 100,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.11)',
                color: 'rgba(255,255,255,0.65)',
                fontSize: 12, fontWeight: 300,
                letterSpacing: '0.06em', textTransform: 'uppercase',
                textDecoration: 'none', cursor: 'none',
                transition: 'background 0.2s, color 0.2s',
                fontFamily: "'DM Sans', sans-serif",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.10)';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                e.currentTarget.style.color = 'rgba(255,255,255,0.65)';
              }}
            >
              GitHub Repo
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                <path d="M1 11L11 1M11 1H4M11 1V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>
      </motion.div>

      <style>{`
        @keyframes modalLivePulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
      `}</style>
    </motion.div>
  );
};

// ── Project card ──────────────────────────────────────────────
const ProjectCard = ({
  name, description, tags, image,
  source_code_link, live_demo_link, onOpen, ...rest
}) => {
  const openProject = () => onOpen({ name, description, tags, image, source_code_link, live_demo_link, ...rest });

  return (
    <div
      style={{ cursor: 'none', flex: `0 0 ${SLIDE_WIDTH}px` }}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${name}`}
      onClick={openProject}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openProject();
        }
      }}
    >
      <Tilt
        options={{ max: 12, scale: 1, speed: 450 }}
        className='bg-tertiary p-5 rounded-2xl w-full'
      >
        <div className='relative w-full h-[230px]'>
          <img
            src={image}
            alt='project_image'
            className='w-full h-full object-cover rounded-2xl'
          />
          <div className='absolute inset-0 flex justify-end m-3 card-img_hover gap-2'>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); window.open(source_code_link, "_blank"); }}
              className='black-gradient w-10 h-10 rounded-full flex justify-center items-center cursor-pointer'
              style={{ border: 'none', padding: 0 }}
              aria-label={`View source code for ${name} on GitHub`}
              title="View Source Code"
            >
              <img src={github} alt='' className='w-1/2 h-1/2 object-contain' />
            </button>
          </div>
        </div>

        <div className='mt-5'>
          <div className="flex items-start justify-between gap-2">
            <h3 className='text-white font-bold text-[24px]'>{name}</h3>
            {live_demo_link && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); window.open(live_demo_link, "_blank"); }}
                aria-label={`View live demo of ${name}`}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 100, padding: '4px 10px',
                  fontSize: 11, fontWeight: 300,
                  color: 'rgba(255,255,255,0.7)',
                  letterSpacing: '0.06em', whiteSpace: 'nowrap',
                  cursor: 'pointer', marginTop: 4, flexShrink: 0,
                  fontFamily: "'DM Sans', sans-serif",
                  transition: 'background 0.2s, color 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.13)';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
                  e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
                }}
              >
                <span style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: '#6ee99e',
                  boxShadow: '0 0 5px rgba(110,233,158,0.8)',
                  animation: 'modalLivePulse 2s ease-in-out infinite',
                  flexShrink: 0,
                }} />
                Live
              </button>
            )}
          </div>
          <p className='mt-2 text-secondary text-[14px]'>{description}</p>
        </div>

        <div className='mt-4 flex flex-wrap gap-2'>
          {tags.map((tag) => (
            <p key={`${name}-${tag.name}`} className={`text-[14px] ${tag.color}`}>
              #{tag.name}
            </p>
          ))}
        </div>

        {live_demo_link && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); window.open(live_demo_link, "_blank"); }}
            aria-label={`Open live demo of ${name}`}
            style={{
              marginTop: 16,
              width: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 14px', borderRadius: 10,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              cursor: 'pointer',
              transition: 'background 0.2s, border-color 0.2s',
              fontFamily: "'DM Sans', sans-serif",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.16)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 300, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.04em' }}>
              View Live Demo
            </span>
            <ExternalLinkIcon />
          </button>
        )}
      </Tilt>

      <style>{`
        @keyframes modalLivePulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
};

// ── Rail chrome: arrows, counter, tab strip ─────────────────────
const RailControls = ({ activeIndex, count, onPrev, onNext, onJump, names }) => (
  <div style={{
    position: 'absolute', left: 0, right: 0, bottom: 28,
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
    zIndex: 2, pointerEvents: 'none',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, pointerEvents: 'auto' }}>
      <button
        type="button"
        onClick={onPrev}
        disabled={activeIndex === 0}
        aria-label="Previous project"
        style={{
          width: 40, height: 40, borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.14)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: activeIndex === 0 ? 'default' : 'pointer',
          opacity: activeIndex === 0 ? 0.35 : 1,
          color: '#fff', transition: 'opacity 0.2s, background 0.2s',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 1L2 7L9 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>

      <span className="bl-mono" style={{
        fontSize: 12, letterSpacing: '0.18em', color: 'rgba(255,255,255,0.6)',
        fontFamily: "'DM Mono', monospace", minWidth: 56, textAlign: 'center',
      }}>
        {String(activeIndex + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
      </span>

      <button
        type="button"
        onClick={onNext}
        disabled={activeIndex === count - 1}
        aria-label="Next project"
        style={{
          width: 40, height: 40, borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.14)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: activeIndex === count - 1 ? 'default' : 'pointer',
          opacity: activeIndex === count - 1 ? 0.35 : 1,
          color: '#fff', transition: 'opacity 0.2s, background 0.2s',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 1L12 7L5 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
    </div>

    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '6px 18px', maxWidth: '90vw', pointerEvents: 'auto' }}>
      {names.map((name, i) => (
        <button
          key={name}
          type="button"
          onClick={() => onJump(i)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '4px 2px', fontFamily: "'DM Sans', sans-serif",
            fontSize: 12, letterSpacing: '0.02em',
            color: i === activeIndex ? '#fff' : 'rgba(255,255,255,0.35)',
            borderBottom: i === activeIndex ? '1px solid #fff' : '1px solid transparent',
            transition: 'color 0.2s, border-color 0.2s',
          }}
        >
          {name}
        </button>
      ))}
    </div>
  </div>
);

// ── Works ──────────────────────────────────────────────────────
const Works = () => {
  const [activeProject, setActiveProject] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { play } = useSound();
  const lenis = useLenis();

  const pinWrapRef = useRef(null);
  const trackRef = useRef(null);
  const stRef = useRef(null);
  const activeIndexRef = useRef(0);

  const handleOpen  = useCallback((p) => { play("click"); setActiveProject(p); }, [play]);
  const handleClose = useCallback(() => { play("close"); setActiveProject(null); }, [play]);

  const n = projects.length;

  // Horizontal scroll-jack on desktop; native swipe-snap on touch/small screens.
  useEffect(() => {
    const wrap = pinWrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track || n < 2) return;

    const mm = ScrollTrigger.matchMedia({
      '(min-width: 1025px) and (hover: hover)': function () {
        const slideStep = SLIDE_WIDTH + SLIDE_GAP;
        const startX = () => (wrap.offsetWidth - SLIDE_WIDTH) / 2;
        const endX = () => startX() - slideStep * (n - 1);

        gsap.set(track, { x: startX() });

        const tween = gsap.to(track, {
          x: endX,
          ease: 'none',
          scrollTrigger: {
            id: 'works-rail',
            trigger: wrap,
            start: 'top top',
            end: () => '+=' + CARD_SCROLL_PX * (n - 1),
            pin: true,
            scrub: 1,
            snap: 1 / (n - 1),
            invalidateOnRefresh: true,
            anticipatePin: 1,
            onUpdate(self) {
              const idx = Math.round(self.progress * (n - 1));
              if (idx !== activeIndexRef.current) {
                activeIndexRef.current = idx;
                setActiveIndex(idx);
              }
            },
          },
        });

        stRef.current = tween.scrollTrigger;

        return () => {
          stRef.current = null;
          tween.kill();
        };
      },
      '(max-width: 1024px), (hover: none)': function () {
        gsap.set(track, { x: 0 });
        track.style.overflowX = 'auto';
        track.style.scrollSnapType = 'x mandatory';
        Array.from(track.children).forEach((child) => {
          child.style.scrollSnapAlign = 'start';
        });

        const slideStep = SLIDE_WIDTH + SLIDE_GAP;
        const onScroll = () => {
          const idx = Math.round(track.scrollLeft / slideStep);
          if (idx !== activeIndexRef.current) {
            activeIndexRef.current = idx;
            setActiveIndex(idx);
          }
        };
        track.addEventListener('scroll', onScroll, { passive: true });

        return () => {
          stRef.current = null;
          track.removeEventListener('scroll', onScroll);
          track.style.overflowX = '';
          track.style.scrollSnapType = '';
        };
      },
    });

    return () => mm.revert();
  }, [n]);

  const goToIndex = useCallback((i) => {
    const clamped = Math.max(0, Math.min(n - 1, i));
    const st = stRef.current;

    if (st && lenis) {
      const target = st.start + (clamped / (n - 1)) * (st.end - st.start);
      lenis.scrollTo(target, { duration: 1 });
    } else if (trackRef.current) {
      const slide = trackRef.current.children[clamped];
      if (slide) trackRef.current.scrollTo({ left: slide.offsetLeft, behavior: 'smooth' });
    }
  }, [n, lenis]);

  return (
    <section style={{ position: 'relative', padding: 'clamp(60px,10vh,100px) 0 0' }}>
      <span className='hash-span' id="projects" />

      <div style={{ width: '100%', padding: '0 clamp(24px, 6vw, 120px)' }}>
        <motion.div variants={textVariant()} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }}>
          <p className={`${styles.sectionSubText}`}>My work</p>
          <h2 className={`${styles.sectionHeadText}`}>Projects.</h2>
        </motion.div>

        <div className='w-full flex'>
          <motion.p
            variants={fadeIn("", "", 0.1, 1)}
            initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }}
            className='mt-3 text-secondary text-[17px] max-w-3xl leading-[30px]'
          >
            Following projects showcase my work over the years. Each includes links to
            the source code, and some are live and deployed, so you can try them directly!
          </motion.p>
        </div>
      </div>

      <div ref={pinWrapRef} style={{ position: 'relative', height: '100vh', marginTop: 48, overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          background: RAIL_COLORS[activeIndex % RAIL_COLORS.length],
          transition: 'background-color 0.6s ease',
        }} />

        <div
          ref={trackRef}
          style={{
            position: 'relative', zIndex: 1,
            display: 'flex', alignItems: 'center', height: '100%',
            gap: SLIDE_GAP, willChange: 'transform',
          }}
        >
          {projects.map((project, index) => (
            <ProjectCard
              key={`project-${index}`}
              {...project}
              onOpen={handleOpen}
            />
          ))}
        </div>

        <RailControls
          activeIndex={activeIndex}
          count={n}
          onPrev={() => goToIndex(activeIndex - 1)}
          onNext={() => goToIndex(activeIndex + 1)}
          onJump={goToIndex}
          names={projects.map((p) => p.name)}
        />
      </div>

      <AnimatePresence>
        {activeProject && (
          <ProjectModal project={activeProject} onClose={handleClose} />
        )}
      </AnimatePresence>
    </section>
  );
};

export default Works;
