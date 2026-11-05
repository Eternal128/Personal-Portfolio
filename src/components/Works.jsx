import React, { useState, useEffect, useRef, useCallback } from "react";
import Tilt from 'react-parallax-tilt';
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { styles } from "../styles";
import { github } from "../assets";
import { projects } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";
import { useSound } from "../context/SoundContext";
import { useLenis } from "../context/LenisContext";
import { useTheme } from "../context/ThemeContext";

gsap.registerPlugin(ScrollTrigger);

// Muted, moody backdrop tones cycling per project — deliberately dark
// variations rather than saturated brand colors, so the rail still reads
// as part of this site's restrained black/gold system, not a bright carousel.
// Light mode gets the same idea in pale tints, so the cards and controls stay readable.
const RAIL_COLORS = {
  dark:  ['#0d0d0d', '#15100a', '#0a0e14', '#120a0e', '#0a120e', '#0d0d14'],
  light: ['#ebe8e1', '#ede7dd', '#e4e8ec', '#ece4e7', '#e3eae5', '#e6e6ec'],
};

const SLIDE_WIDTH = 420;
const CARD_HEIGHT = 520; // every card the same height; long descriptions clamp to 3 lines
const SLIDE_GAP = 56;
const CARD_SCROLL_PX = 650; // vertical scroll px consumed per horizontal card step

const ExternalLinkIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 13L13 1M13 1H5M13 1V9" stroke="var(--fg)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ── Modal ──────────────────────────────────────────────────────
// Tag names are stored lowercase for the cards ("#nextjs"); the sheet shows
// them as proper names.
const TAG_LABELS = {
  nextjs: 'Next.js', typescript: 'TypeScript', javascript: 'JavaScript', react: 'React',
  tailwind: 'Tailwind', threejs: 'Three.js', 'three js': 'Three.js', python: 'Python',
  tensorflow: 'TensorFlow', sanity: 'Sanity', ai: 'AI', llm: 'LLM', postgres: 'Postgres',
  leaflet: 'Leaflet', zustand: 'Zustand', java: 'Java', php: 'PHP',
};
const tagLabel = (name) => TAG_LABELS[name] || name.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

const SHEET_SPRING = { type: 'spring', stiffness: 320, damping: 32, mass: 0.9 };
const EASE_OUT = [0.16, 1, 0.3, 1];
const EASE_IN = [0.4, 0, 1, 1];

const ArrowUpRight = () => (
  <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path d="M1.5 10.5 10.5 1.5M10.5 1.5H4M10.5 1.5V8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ProjectModal = ({ project, onClose }) => {
  const closeRef = useRef(null);
  const lenis = useLenis();
  const reduce = useReducedMotion();
  const [isPhone] = useState(() => typeof window !== 'undefined' && window.matchMedia('(max-width: 640px)').matches);
  const [shot, setShot] = useState(0);
  const images = project.gallery && project.gallery.length ? project.gallery : [project.image];

  useEffect(() => {
    const opener = document.activeElement;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    lenis?.stop();
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      lenis?.start();
      if (opener && opener.focus) opener.focus({ preventScroll: true });
    };
  }, [onClose, lenis]);

  // Desktop: the sheet springs up from slightly below and smaller. Phone: it
  // slides up from the bottom edge. Reduced motion: opacity only.
  const sheet = reduce
    ? { hidden: { opacity: 0 }, shown: { opacity: 1, transition: { duration: 0.2 } }, exit: { opacity: 0, transition: { duration: 0.15 } } }
    : isPhone
      ? { hidden: { y: '100%' }, shown: { y: 0, transition: { ...SHEET_SPRING, staggerChildren: 0.05, delayChildren: 0.12 } }, exit: { y: '100%', transition: { duration: 0.28, ease: EASE_IN } } }
      : {
          hidden: { opacity: 0, y: 40, scale: 0.96 },
          shown: { opacity: 1, y: 0, scale: 1, transition: { ...SHEET_SPRING, opacity: { duration: 0.25 }, staggerChildren: 0.05, delayChildren: 0.12 } },
          exit: { opacity: 0, y: 24, scale: 0.98, transition: { duration: 0.2, ease: EASE_IN } },
        };
  const item = reduce
    ? { hidden: { opacity: 1 }, shown: { opacity: 1 } }
    : { hidden: { opacity: 0, y: 14 }, shown: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE_OUT } } };

  const study = [['Problem', project.problem], ['Approach', project.approach], ['Outcome', project.outcome]].filter(([, t]) => t);

  return (
    <motion.div
      className="ps-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      <style>{`
        .ps-backdrop {
          position: fixed; inset: 0; z-index: 99998;
          display: flex; align-items: center; justify-content: center;
          padding: 24px;
          background: rgba(var(--bg-rgb), 0.72);
          backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
          font-family: 'DM Sans', sans-serif;
        }
        .ps-sheet {
          position: relative;
          width: min(1080px, 100%);
          max-height: 90vh;
          display: flex; flex-direction: column;
          border-radius: 24px;
          background: var(--surface-solid);
          color: var(--fg);
          overflow: hidden;
        }
        .ps-body {
          display: grid; grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr);
          gap: 40px; align-items: start;
          overflow-y: auto; padding: 28px; overscroll-behavior: contain;
        }
        .ps-info { padding: 10px 44px 8px 0; }
        .ps-text { margin-top: 28px; }
        .ps-close {
          position: absolute; top: 16px; right: 16px; z-index: 2;
          width: 36px; height: 36px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          border: 0; background: rgba(var(--fg-rgb), 0.10); color: var(--fg);
          cursor: none; transition: background-color 0.2s;
        }
        .ps-close:hover { background: rgba(var(--fg-rgb), 0.18); }
        .ps-shot {
          position: relative; aspect-ratio: 16 / 10; overflow: hidden;
          border-radius: 14px; background: rgba(var(--fg-rgb), 0.05);
        }
        .ps-shot img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: top center; display: block; }
        .ps-thumbs { display: flex; gap: 10px; margin-top: 12px; overflow-x: auto; }
        .ps-thumb {
          flex: 0 0 auto; height: 96px; aspect-ratio: 16 / 10; padding: 0; border: 0;
          border-radius: 10px; overflow: hidden; background: none; cursor: none;
          opacity: 0.45; transition: opacity 0.2s;
        }
        .ps-thumb:hover { opacity: 0.8; }
        .ps-thumb[aria-pressed="true"] { opacity: 1; }
        .ps-thumb img { width: 100%; height: 100%; object-fit: cover; object-position: top center; display: block; }
        .ps-title { margin: 0; color: var(--fg); font-size: clamp(34px, 3.6vw, 48px); font-weight: 300; letter-spacing: -0.025em; line-height: 1.05; }
        .ps-tagline { margin: 10px 0 0; font-size: 21px; line-height: 1.35; color: rgba(var(--fg-rgb), 0.85); }
        .ps-tags { margin: 16px 0 0; font-size: 15px; color: rgba(var(--fg-rgb), 0.56); }
        .ps-actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 28px; }
        .ps-btn {
          display: inline-flex; align-items: center; gap: 8px;
          height: 44px; padding: 0 22px; border-radius: 980px;
          font-size: 15px; font-weight: 500; text-decoration: none; cursor: none;
          transition: opacity 0.2s, background-color 0.2s, transform 0.2s;
        }
        .ps-btn:active { transform: scale(0.98); }
        .ps-btn-primary { background: var(--fg); color: var(--bg); }
        .ps-btn-primary:hover { opacity: 0.86; }
        .ps-btn-secondary { background: rgba(var(--fg-rgb), 0.08); color: var(--fg); }
        .ps-btn-secondary:hover { background: rgba(var(--fg-rgb), 0.14); }
        .ps-close:focus-visible, .ps-thumb:focus-visible, .ps-btn:focus-visible { outline: 2px solid var(--fg); outline-offset: 3px; }
        .ps-text p { margin: 0; font-size: 17px; line-height: 1.6; color: rgba(var(--fg-rgb), 0.82); }
        .ps-text h3 { margin: 24px 0 6px; font-size: 17px; font-weight: 500; color: var(--fg); }
        @media (max-width: 640px) {
          .ps-backdrop { align-items: flex-end; padding: 0; }
          .ps-sheet { max-height: 92vh; border-radius: 24px 24px 0 0; }
          .ps-body { grid-template-columns: 1fr; gap: 24px; padding: 20px 20px 32px; }
          .ps-info { padding: 0; }
          .ps-thumb { height: 72px; }
        }
      `}</style>

      <motion.div
        className="ps-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ps-title"
        variants={sheet}
        initial="hidden"
        animate="shown"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
      >
        <button ref={closeRef} type="button" className="ps-close" onClick={onClose} aria-label="Close project details">
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
            <path d="M1.5 1.5l9 9M10.5 1.5l-9 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>

        <div className="ps-body" data-lenis-prevent>
          <motion.div className="ps-media" variants={item}>
            <div className="ps-shot">
              <AnimatePresence initial={false}>
                <motion.img
                  key={images[shot]}
                  src={images[shot]}
                  alt={`${project.name} screenshot ${shot + 1}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduce ? 0 : 0.35 }}
                />
              </AnimatePresence>
            </div>
            {images.length > 1 && (
              <div className="ps-thumbs" role="group" aria-label={`${project.name} screenshots`}>
                {images.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    className="ps-thumb"
                    aria-pressed={i === shot}
                    aria-label={`Show screenshot ${i + 1}`}
                    onClick={() => setShot(i)}
                  >
                    <img src={src} alt="" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          <div className="ps-info">
            <motion.div variants={item}>
              <h2 id="ps-title" className="ps-title">{project.name}</h2>
              {project.tagline && <p className="ps-tagline">{project.tagline}</p>}
              <p className="ps-tags">{project.tags.map((t) => tagLabel(t.name)).join(' · ')}</p>
              {(project.live_demo_link || project.source_code_link) && (
                <div className="ps-actions">
                  {project.live_demo_link && (
                    <a className="ps-btn ps-btn-primary" href={project.live_demo_link} target="_blank" rel="noopener noreferrer">
                      View live site <ArrowUpRight />
                    </a>
                  )}
                  {project.source_code_link && (
                    <a className="ps-btn ps-btn-secondary" href={project.source_code_link} target="_blank" rel="noopener noreferrer">
                      GitHub <ArrowUpRight />
                    </a>
                  )}
                </div>
              )}
            </motion.div>

            <motion.div className="ps-text" variants={item}>
              <p>{project.description}</p>
              {study.map(([label, text]) => (
                <React.Fragment key={label}>
                  <h3>{label}</h3>
                  <p>{text}</p>
                </React.Fragment>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>
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
      className="works-card"
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
        style={{ height: CARD_HEIGHT, display: 'flex', flexDirection: 'column' }}
      >
        <div className='relative w-full h-[230px]'>
          <img
            src={image}
            alt='project_image'
            className='w-full h-full object-cover rounded-2xl'
          />
          {source_code_link && (
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
          )}
        </div>

        <div className='mt-5'>
          <div className="flex items-start justify-between gap-2">
            <h3 className='font-bold text-[24px]' style={{ color: 'var(--fg)' }}>{name}</h3>
            {live_demo_link && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); window.open(live_demo_link, "_blank"); }}
                aria-label={`View live demo of ${name}`}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  background: 'rgba(var(--fg-rgb),0.07)',
                  border: '1px solid rgba(var(--fg-rgb),0.12)',
                  borderRadius: 100, padding: '4px 10px',
                  fontSize: 11, fontWeight: 300,
                  color: 'rgba(var(--fg-rgb),0.7)',
                  letterSpacing: '0.06em', whiteSpace: 'nowrap',
                  cursor: 'pointer', marginTop: 4, flexShrink: 0,
                  fontFamily: "'DM Sans', sans-serif",
                  transition: 'background 0.2s, color 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(var(--fg-rgb),0.13)';
                  e.currentTarget.style.color = 'var(--fg)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(var(--fg-rgb),0.07)';
                  e.currentTarget.style.color = 'rgba(var(--fg-rgb),0.7)';
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
          <p
            className='mt-2 text-secondary text-[14px]'
            style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.5 }}
          >
            {description}
          </p>
        </div>

        <div className='mt-4 flex flex-wrap gap-2' style={{ maxHeight: 21, overflow: 'hidden' }}>
          {tags.map((tag) => (
            <p key={`${name}-${tag.name}`} className={`text-[14px] ${tag.color}`}>
              #{tag.name}
            </p>
          ))}
        </div>

        {live_demo_link ? (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); window.open(live_demo_link, "_blank"); }}
            aria-label={`Open live demo of ${name}`}
            style={{
              marginTop: 'auto',
              width: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 14px', borderRadius: 10,
              background: 'rgba(var(--fg-rgb),0.04)',
              border: '1px solid rgba(var(--fg-rgb),0.08)',
              cursor: 'pointer',
              transition: 'background 0.2s, border-color 0.2s',
              fontFamily: "'DM Sans', sans-serif",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(var(--fg-rgb),0.08)';
              e.currentTarget.style.borderColor = 'rgba(var(--fg-rgb),0.16)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(var(--fg-rgb),0.04)';
              e.currentTarget.style.borderColor = 'rgba(var(--fg-rgb),0.08)';
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 300, color: 'rgba(var(--fg-rgb),0.6)', letterSpacing: '0.04em' }}>
              View Live Demo
            </span>
            <ExternalLinkIcon />
          </button>
        ) : (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); openProject(); }}
            aria-label={`Open the ${name} details`}
            style={{
              marginTop: 'auto',
              width: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 14px', borderRadius: 10,
              background: 'rgba(var(--fg-rgb),0.04)',
              border: '1px solid rgba(var(--fg-rgb),0.08)',
              cursor: 'pointer',
              transition: 'background 0.2s, border-color 0.2s',
              fontFamily: "'DM Sans', sans-serif",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(var(--fg-rgb),0.08)';
              e.currentTarget.style.borderColor = 'rgba(var(--fg-rgb),0.16)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(var(--fg-rgb),0.04)';
              e.currentTarget.style.borderColor = 'rgba(var(--fg-rgb),0.08)';
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 300, color: 'rgba(var(--fg-rgb),0.6)', letterSpacing: '0.04em' }}>
              View Details
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
          background: 'rgba(var(--fg-rgb),0.06)',
          border: '1px solid rgba(var(--fg-rgb),0.14)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: activeIndex === 0 ? 'default' : 'pointer',
          opacity: activeIndex === 0 ? 0.35 : 1,
          color: 'var(--fg)', transition: 'opacity 0.2s, background 0.2s',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 1L2 7L9 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>

      <span className="bl-mono" style={{
        fontSize: 12, letterSpacing: '0.18em', color: 'rgba(var(--fg-rgb),0.6)',
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
          background: 'rgba(var(--fg-rgb),0.06)',
          border: '1px solid rgba(var(--fg-rgb),0.14)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: activeIndex === count - 1 ? 'default' : 'pointer',
          opacity: activeIndex === count - 1 ? 0.35 : 1,
          color: 'var(--fg)', transition: 'opacity 0.2s, background 0.2s',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 1L12 7L5 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
    </div>

    <div className="works-index" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '6px 18px', maxWidth: '90vw', pointerEvents: 'auto' }}>
      {names.map((name, i) => (
        <button
          key={name}
          type="button"
          onClick={() => onJump(i)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '4px 2px', fontFamily: "'DM Sans', sans-serif",
            fontSize: 12, letterSpacing: '0.02em',
            color: i === activeIndex ? 'var(--fg)' : 'rgba(var(--fg-rgb),0.35)',
            borderBottom: i === activeIndex ? '1px solid var(--fg)' : '1px solid transparent',
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
  const { theme } = useTheme();
  const rail = RAIL_COLORS[theme] || RAIL_COLORS.dark;
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

        // Cards are narrower than SLIDE_WIDTH on phones, so measure the real step.
        const slideStep = () => (track.children[0]?.offsetWidth || SLIDE_WIDTH) + SLIDE_GAP;
        const onScroll = () => {
          const idx = Math.round(track.scrollLeft / slideStep());
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
      const pad = parseFloat(getComputedStyle(trackRef.current).scrollPaddingLeft) || 0;
      if (slide) trackRef.current.scrollTo({ left: slide.offsetLeft - pad, behavior: 'smooth' });
    }
  }, [n, lenis]);

  return (
    <section style={{ position: 'relative', padding: 'clamp(60px,10vh,100px) 0 0' }}>
      <style>{`
        /* Phones: cards fill the width with a 20px margin and sit at the top of
           the rail; the long project-name index gives way to swipe + arrows. */
        @media (max-width: 1024px), (hover: none) {
          .works-track { scroll-padding-inline: 20px; }
          .works-card:first-child { margin-left: 20px; }
          .works-card:last-child { margin-right: 20px; }
        }
        @media (max-width: 640px) {
          .works-track { align-items: flex-start !important; padding-top: 24px; }
          .works-card { flex-basis: calc(100vw - 40px) !important; }
          .works-index { display: none !important; }
        }
      `}</style>
      <span className='hash-span' id="projects" />

      <div style={{ width: '100%', padding: '0 clamp(24px, 6vw, 120px)' }}>
        <motion.div variants={textVariant()} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }}>
          <p className={`${styles.sectionSubText}`}>My work</p>
          <h2 className={`${styles.sectionHeadText}`} style={{ color: 'var(--fg)' }}>Projects.</h2>
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
          background: rail[activeIndex % rail.length],
          transition: 'background-color 0.6s ease',
        }} />

        <div
          ref={trackRef}
          className="works-track"
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
