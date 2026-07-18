import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { POSTS } from '../constants/posts';
import NeuralPlayground from './blog/NeuralPlayground';

const PAPER = '#e9e5dc';
const INK = '#111010';

const ctrlBtn = {
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  width: 34, height: 34, borderRadius: '50%',
  background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.25)',
  backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
  cursor: 'pointer', padding: 0, flexShrink: 0,
};

const fmt = (s) => {
  if (!s || isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
};

// ── Video with hover controls ──
const VideoPlayer = ({ item, style }) => {
  const vidRef = useRef(null);
  const wrapRef = useRef(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(true);
  const [hover, setHover] = useState(false);
  const [time, setTime] = useState(0);
  const [dur, setDur] = useState(0);

  useEffect(() => {
    const v = vidRef.current;
    if (!v) return;
    const onTime = () => setTime(v.currentTime);
    const onMeta = () => setDur(v.duration || 0);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    v.addEventListener('timeupdate', onTime);
    v.addEventListener('loadedmetadata', onMeta);
    v.addEventListener('play', onPlay);
    v.addEventListener('pause', onPause);
    return () => {
      v.removeEventListener('timeupdate', onTime);
      v.removeEventListener('loadedmetadata', onMeta);
      v.removeEventListener('play', onPlay);
      v.removeEventListener('pause', onPause);
    };
  }, []);

  const togglePlay = (e) => {
    e?.stopPropagation();
    const v = vidRef.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    const v = vidRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (!v.muted && v.paused) v.play().catch(() => {});
  };

  const seek = (e) => {
    e.stopPropagation();
    const v = vidRef.current;
    if (!v || !dur) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
    v.currentTime = pct * dur;
    setTime(v.currentTime);
  };

  const rewind = (e) => {
    e.stopPropagation();
    const v = vidRef.current;
    if (v) v.currentTime = Math.max(0, v.currentTime - 5);
  };

  const goFullscreen = (e) => {
    e.stopPropagation();
    const el = wrapRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen?.();
    else (el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen)?.call(el);
  };

  const progress = dur ? (time / dur) * 100 : 0;

  return (
    <div
      ref={wrapRef}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ position: 'relative', width: '100%', overflow: 'hidden', borderRadius: 4, background: '#000', ...style }}
    >
      <video
        ref={vidRef}
        src={item.src}
        poster={item.poster}
        autoPlay muted loop playsInline preload="metadata"
        style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover' }}
        onClick={togglePlay}
      />

      <div
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '10px 14px 12px',
          background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)',
          opacity: hover ? 1 : 0, transition: 'opacity 0.3s ease',
          pointerEvents: hover ? 'auto' : 'none',
        }}
      >
        <div
          onClick={seek}
          style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.25)', cursor: 'pointer', marginBottom: 10, position: 'relative' }}
        >
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${progress}%`, background: '#fff', borderRadius: 2 }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={togglePlay} aria-label={playing ? 'Pause' : 'Play'} style={ctrlBtn}>
            {playing ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="#fff"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z"/></svg>
            )}
          </button>

          <button onClick={rewind} aria-label="Rewind 5 seconds" style={ctrlBtn}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="11 17 6 12 11 7" /><polyline points="18 17 13 12 18 7" />
            </svg>
          </button>

          <span className="bl-mono" style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)', letterSpacing: '0.04em', minWidth: 78 }}>
            {fmt(time)} / {fmt(dur)}
          </span>

          <div style={{ flex: 1 }} />

          <button onClick={toggleMute} aria-label={muted ? 'Unmute' : 'Mute'} style={ctrlBtn}>
            {muted ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5 6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
            )}
          </button>

          <button onClick={goFullscreen} aria-label="Fullscreen" style={ctrlBtn}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

const MediaEl = ({ item, style }) =>
  item.type === 'video'
    ? <VideoPlayer item={item} style={style} />
    : <img src={item.src} alt={item.caption || ''} style={{ width: '100%', display: 'block', borderRadius: 4, ...style }} />;

const Figure = ({ block }) => {
  const wide = block.wide;
  return (
    <motion.figure
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={{
        margin: 'clamp(48px,8vh,96px) auto',
        width: wide ? 'min(1080px, calc(100vw - clamp(44px,12vw,160px)))' : '100%',
        marginLeft: wide ? 'calc(50% - min(540px, calc(50vw - clamp(22px,6vw,80px))))' : undefined,
      }}
    >
      <MediaEl item={block} />
      {block.caption && (
        <figcaption
          className="bl-mono"
          style={{ marginTop: 14, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(17,16,16,0.45)' }}
        >
          {block.caption}
        </figcaption>
      )}
    </motion.figure>
  );
};

const Duo = ({ items }) => (
  <motion.div
    initial={{ opacity: 0, y: 26 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    className="bl-duo"
    style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, margin: 'clamp(48px,8vh,96px) 0' }}
  >
    {items.map((it, i) => <MediaEl key={i} item={it} />)}
  </motion.div>
);

const PostBody = ({ blocks }) =>
  blocks.map((b, i) => {
    switch (b.type) {
      case 'heading':
        return (
          <h3 key={i} className="bl-serif" style={{ fontWeight: 400, fontSize: 'clamp(1.5rem,3.4vw,2.1rem)', lineHeight: 1.1, letterSpacing: '-0.01em', margin: 'clamp(50px,8vh,90px) 0 22px' }}>
            {b.text}
          </h3>
        );
      case 'quote':
        return (
          <blockquote key={i} className="bl-serif" style={{ margin: 'clamp(56px,9vh,100px) 0', paddingLeft: 28, borderLeft: `2px solid ${INK}`, fontWeight: 300, fontSize: 'clamp(1.5rem,3.6vw,2.3rem)', lineHeight: 1.28, letterSpacing: '-0.01em', color: INK }}>
            “{b.text}”
            {b.cite && (
              <cite className="bl-mono" style={{ display: 'block', marginTop: 18, fontStyle: 'normal', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(17,16,16,0.45)' }}>
                — {b.cite}
              </cite>
            )}
          </blockquote>
        );
      case 'image':
      case 'video':
        return <Figure key={i} block={b} />;
      case 'duo':
        return <Duo key={i} items={b.items} />;
      case 'interactive':
        if (b.widget === 'neural') return <NeuralPlayground key={i} />;
        return null;
      case 'paragraph':
      default:
        return (
          <p key={i} style={{ fontSize: '1.16rem', lineHeight: 1.9, fontWeight: 300, color: 'rgba(17,16,16,0.86)', marginBottom: 32 }}>
            {b.text}
          </p>
        );
    }
  });

const Blog = ({ onClose, initialPost = null }) => {
  const [openPost, setOpenPost] = useState(initialPost);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      if (document.fullscreenElement) return;
      if (openPost) setOpenPost(null);
      else onClose?.();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openPost, onClose]);

  return (
    <motion.div
      data-lenis-prevent
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9000,
        background: PAPER, color: INK,
        fontFamily: "'DM Sans', sans-serif",
        overflowY: 'scroll',
        overscrollBehavior: 'contain',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&family=DM+Mono:wght@400&family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500&display=swap');

        .bl-serif { font-family: 'Fraunces', Georgia, serif; }
        .bl-mono  { font-family: 'DM Mono', monospace; }
        .bl-wrap  { max-width: 1180px; margin: 0 auto; padding: 0 clamp(22px, 6vw, 80px); }

        .bl-row {
          display: grid;
          grid-template-columns: 64px 1fr auto;
          gap: clamp(20px, 4vw, 56px);
          align-items: baseline;
          padding: clamp(30px, 4vw, 46px) 0;
          border-top: 1px solid rgba(17,16,16,0.14);
          cursor: pointer;
          position: relative;
        }
        .bl-row::after {
          content: '';
          position: absolute; left: 0; bottom: -1px; height: 1px; width: 0;
          background: ${INK};
          transition: width 0.5s cubic-bezier(0.16,1,0.3,1);
        }
        .bl-row:hover::after { width: 100%; }
        .bl-row:hover .bl-title { transform: translateX(10px); }
        .bl-row:hover .bl-arrow { opacity: 1; transform: translate(4px,-4px); }
        .bl-title { transition: transform 0.5s cubic-bezier(0.16,1,0.3,1); }
        .bl-arrow { opacity: 0; transition: opacity 0.4s ease, transform 0.5s cubic-bezier(0.16,1,0.3,1); }
        .bl-num { transition: color 0.4s ease; }
        .bl-row:hover .bl-num { color: ${INK}; }

        .bl-read p:first-of-type::first-letter {
          font-family: 'Fraunces', Georgia, serif;
          float: left; font-size: 4.4em; line-height: 0.74;
          padding: 6px 14px 0 0; font-weight: 400;
        }

        @media (max-width: 720px) {
          .bl-row { grid-template-columns: 1fr; gap: 10px; }
          .bl-num { display: none; }
          .bl-row:hover .bl-title { transform: none; }
          .bl-duo { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Sticky top bar (index) */}
      <div style={{ position: 'sticky', top: 0, zIndex: 10, background: PAPER, borderBottom: '1px solid rgba(17,16,16,0.10)' }}>
        <div className="bl-wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px clamp(22px, 6vw, 80px)' }}>
          <button onClick={onClose} style={btnReset}>
            <span className="bl-mono" style={{ fontSize: 12, letterSpacing: '0.06em' }}>← James Hanzell</span>
          </button>
          <span className="bl-mono" style={{ fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(17,16,16,0.5)' }}>The Journal</span>
          <button onClick={onClose} className="bl-mono" style={{ ...btnReset, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(17,16,16,0.5)' }}>Close</button>
        </div>
      </div>

      {/* Masthead */}
      <div className="bl-wrap" style={{ paddingTop: 'clamp(70px, 12vh, 150px)', paddingBottom: 'clamp(50px, 8vh, 90px)' }}>
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.05 }}
          className="bl-mono" style={{ fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(17,16,16,0.5)', marginBottom: 26 }}
        >
          Notes on process, craft & thought
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          className="bl-serif" style={{ fontWeight: 300, fontSize: 'clamp(2.6rem, 8vw, 6.2rem)', lineHeight: 0.98, letterSpacing: '-0.02em', maxWidth: 900 }}
        >
          The space between building and feeling.
        </motion.h1>
      </div>

      {/* Index list */}
      <div className="bl-wrap" style={{ paddingBottom: 'clamp(90px, 16vh, 180px)' }}>
        {POSTS.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22 + i * 0.09, ease: [0.16, 1, 0.3, 1] }}
            className="bl-row" onClick={() => setOpenPost(p)}
          >
            <span className="bl-mono bl-num" style={{ fontSize: 12, color: 'rgba(17,16,16,0.35)', letterSpacing: '0.06em' }}>
              {String(i + 1).padStart(2, '0')}
            </span>
            <div>
              <div className="bl-mono" style={{ fontSize: 10.5, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(17,16,16,0.42)', marginBottom: 14 }}>
                {p.kicker} — {p.date} — {p.readingTime}
              </div>
              <h2 className="bl-serif bl-title" style={{ fontWeight: 400, fontSize: 'clamp(1.7rem, 3.6vw, 2.8rem)', lineHeight: 1.06, letterSpacing: '-0.01em', marginBottom: 16, display: 'inline-block' }}>
                {p.title}
              </h2>
              <p style={{ fontSize: '1rem', fontWeight: 300, lineHeight: 1.65, color: 'rgba(17,16,16,0.6)', maxWidth: 560 }}>
                {p.excerpt}
              </p>
            </div>
            <span className="bl-arrow bl-serif" style={{ fontSize: '1.6rem', alignSelf: 'center' }}>↗</span>
          </motion.div>
        ))}
        <div style={{ borderTop: '1px solid rgba(17,16,16,0.14)' }} />
      </div>

      {/* Article reader */}
      <AnimatePresence>
        {openPost && (
          <motion.div
            key="reader"
            data-lenis-prevent
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 20, background: PAPER,
              overflowY: 'scroll', overscrollBehavior: 'contain',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            <div style={{ position: 'sticky', top: 0, zIndex: 5, background: PAPER, borderBottom: '1px solid rgba(17,16,16,0.10)' }}>
              <div className="bl-wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px clamp(22px, 6vw, 80px)' }}>
                <button onClick={() => setOpenPost(null)} className="bl-mono" style={{ ...btnReset, fontSize: 12, letterSpacing: '0.06em', color: 'rgba(17,16,16,0.55)' }}>
                  ← Index
                </button>
                <span className="bl-mono" style={{ fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(17,16,16,0.4)' }}>
                  {openPost.kicker}
                </span>
              </div>
            </div>

            {openPost.hero && (
              <div style={{ padding: 'clamp(28px, 5vw, 64px) clamp(22px, 6vw, 80px) 0' }}>
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    maxWidth: 1180, margin: '0 auto', aspectRatio: '16 / 9',
                    overflow: 'hidden', background: '#000', borderRadius: 4,
                  }}
                >
                  <MediaEl item={openPost.hero} style={{ height: '100%' }} />
                </motion.div>
              </div>
            )}

            <article style={{ maxWidth: 720, margin: '0 auto', padding: '0 clamp(22px, 6vw, 40px)' }}>
              <div style={{ paddingTop: 'clamp(56px, 9vh, 110px)' }}>
                <div className="bl-mono" style={{ fontSize: 11, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(17,16,16,0.45)', marginBottom: 26 }}>
                  {openPost.kicker} · {openPost.date} · {openPost.readingTime}
                </div>
                <motion.h1
                  initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="bl-serif" style={{ fontWeight: 400, fontSize: 'clamp(2.2rem, 6vw, 4rem)', lineHeight: 1.02, letterSpacing: '-0.02em', marginBottom: 'clamp(44px, 7vh, 80px)' }}
                >
                  {openPost.title}
                </motion.h1>
              </div>

              <div className="bl-read">
                <PostBody blocks={openPost.blocks || []} />
              </div>

              <div style={{ margin: 'clamp(60px,10vh,110px) 0', height: 1, background: 'rgba(17,16,16,0.16)' }} />
              <button onClick={() => setOpenPost(null)} className="bl-mono" style={{ background: 'none', border: `1px solid rgba(17,16,16,0.3)`, borderRadius: 100, padding: '13px 28px', cursor: 'pointer', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: INK, marginBottom: 'clamp(80px,14vh,160px)' }}>
                ← Back to the index
              </button>
            </article>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const btnReset = { background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0 };

export default Blog;