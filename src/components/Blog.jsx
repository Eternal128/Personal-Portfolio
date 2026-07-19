import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { POSTS } from '../constants/posts';
import NeuralPlayground from './blog/NeuralPlayground';
import TextGenerator from './blog/TextGenerator';
import LatentArt from './blog/LatentArt';
import FunctionGrapher from './blog/FunctionGrapher';
import EasingPlayground from './blog/EasingPlayground';
import JakartaGraph from './blog/JakartaGraph';
import PixelTransition from './blog/PixelTransition';

const PAPER = '#e9e5dc';
const INK = '#111010';

const ctrlBtn = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 34,
  height: 34,
  borderRadius: '50%',
  background: 'rgba(0,0,0,0.4)',
  border: '1px solid rgba(255,255,255,0.25)',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)',
  cursor: 'pointer',
  padding: 0,
  flexShrink: 0,
};

const btnReset = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: 'inherit',
  padding: 0,
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

    if (!v.muted && v.paused) {
      v.play().catch(() => {});
    }
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

    if (document.fullscreenElement) {
      document.exitFullscreen?.();
    } else {
      (el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen)?.call(el);
    }
  };

  const progress = dur ? (time / dur) * 100 : 0;

  return (
    <div
      ref={wrapRef}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        borderRadius: 4,
        background: '#000',
        ...style,
      }}
    >
      <video
        ref={vidRef}
        src={item.src}
        poster={item.poster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          objectFit: 'cover',
        }}
        onClick={togglePlay}
      />

      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '10px 14px 12px',
          background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)',
          opacity: hover ? 1 : 0,
          transition: 'opacity 0.3s ease',
          pointerEvents: hover ? 'auto' : 'none',
        }}
      >
        <div
          onClick={seek}
          style={{
            height: 4,
            borderRadius: 2,
            background: 'rgba(255,255,255,0.25)',
            cursor: 'pointer',
            marginBottom: 10,
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: `${progress}%`,
              background: '#fff',
              borderRadius: 2,
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={togglePlay} aria-label={playing ? 'Pause' : 'Play'} style={ctrlBtn}>
            {playing ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="#fff">
                <rect x="6" y="5" width="4" height="14" rx="1" />
                <rect x="14" y="5" width="4" height="14" rx="1" />
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="#fff">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          <button onClick={rewind} aria-label="Rewind 5 seconds" style={ctrlBtn}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="11 17 6 12 11 7" />
              <polyline points="18 17 13 12 18 7" />
            </svg>
          </button>

          <span
            className="bl-mono"
            style={{
              fontSize: 11,
              color: 'rgba(255,255,255,0.85)',
              letterSpacing: '0.04em',
              minWidth: 78,
            }}
          >
            {fmt(time)} / {fmt(dur)}
          </span>

          <div style={{ flex: 1 }} />

          <button onClick={toggleMute} aria-label={muted ? 'Unmute' : 'Mute'} style={ctrlBtn}>
            {muted ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 5 6 9H2v6h4l5 4V5z" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 5 6 9H2v6h4l5 4V5z" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </svg>
            )}
          </button>

          <button onClick={goFullscreen} aria-label="Fullscreen" style={ctrlBtn}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 3H5a2 2 0 0 0-2 2v3" />
              <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
              <path d="M3 16v3a2 2 0 0 0 2 2h3" />
              <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

const MediaEl = ({ item, style }) =>
  item.type === 'video' ? (
    <VideoPlayer item={item} style={style} />
  ) : (
    <img
      src={item.src}
      alt={item.caption || ''}
      style={{
        width: '100%',
        display: 'block',
        borderRadius: 4,
        ...style,
      }}
    />
  );

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
          style={{
            marginTop: 14,
            fontSize: 11,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'rgba(17,16,16,0.45)',
          }}
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
    style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 14,
      margin: 'clamp(48px,8vh,96px) 0',
    }}
  >
    {items.map((it, i) => (
      <MediaEl key={i} item={it} />
    ))}
  </motion.div>
);

// ── Syntax-highlighted code block with copy button ──
const CODE_THEME = {
  keyword: '#c678dd',
  string: '#98c379',
  number: '#d19a66',
  comment: '#6b7280',
  func: '#61afef',
  builtin: '#e5c07b',
  punct: '#abb2bf',
  base: '#e9e5dc',
};

const KEYWORDS = {
  javascript: /\b(const|let|var|function|return|if|else|for|while|of|in|new|class|import|from|export|default|continue|break|await|async|=>)\b/,
  python: /\b(import|from|as|def|return|if|elif|else|for|while|in|not|and|or|is|None|True|False|class|lambda|with|print)\b/,
};

const BUILTINS = /\b(Math|Map|Set|Infinity|performance|requestAnimationFrame|console|pd|nx|float|DataFrame|Graph)\b/;

function highlight(code, lang = 'javascript') {
  const kw = KEYWORDS[(lang || '').toLowerCase()] || KEYWORDS.javascript;

  const master = new RegExp(
    [
      (lang || '').toLowerCase() === 'python'
        ? '(#[^\\n]*)'
        : '(\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/)',
      '(`(?:\\\\.|[^`\\\\])*`|"(?:\\\\.|[^"\\\\])*"|\'(?:\\\\.|[^\'\\\\])*\')',
      '(\\b\\d+(?:\\.\\d+)?\\b)',
      '([A-Za-z_$][\\w$]*)(?=\\s*\\()',
      '([A-Za-z_$][\\w$]*)',
      '([{}()\\[\\].,;:+\\-*/=<>!&|^%]+)',
    ].join('|'),
    'g'
  );

  const out = [];
  let last = 0;
  let m;
  let key = 0;

  while ((m = master.exec(code)) !== null) {
    if (m.index > last) {
      out.push(<span key={key++}>{code.slice(last, m.index)}</span>);
    }

    const [full, comment, string, number, fn, ident, punct] = m;
    let color = CODE_THEME.base;

    if (comment) color = CODE_THEME.comment;
    else if (string) color = CODE_THEME.string;
    else if (number) color = CODE_THEME.number;
    else if (fn) color = kw.test(fn)
      ? CODE_THEME.keyword
      : BUILTINS.test(fn)
        ? CODE_THEME.builtin
        : CODE_THEME.func;
    else if (ident) color = kw.test(ident)
      ? CODE_THEME.keyword
      : BUILTINS.test(ident)
        ? CODE_THEME.builtin
        : CODE_THEME.base;
    else if (punct) color = CODE_THEME.punct;

    out.push(
      <span key={key++} style={{ color }}>
        {full}
      </span>
    );

    last = m.index + full.length;
  }

  if (last < code.length) {
    out.push(<span key={key++}>{code.slice(last)}</span>);
  }

  return out;
}

const codeDot = (c) => ({
  width: 11,
  height: 11,
  borderRadius: '50%',
  background: c,
  display: 'inline-block',
});

const CodeBlock = ({ block }) => {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard?.writeText(block.code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      style={{
        margin: 'clamp(44px,7vh,84px) 0',
        borderRadius: 8,
        overflow: 'hidden',
        border: '1px solid rgba(0,0,0,0.4)',
        boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px',
          background: '#181a1f',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ display: 'flex', gap: 6, marginRight: 6 }}>
            <span style={codeDot('#ff5f56')} />
            <span style={codeDot('#ffbd2e')} />
            <span style={codeDot('#27c93f')} />
          </span>

          <span
            className="bl-mono"
            style={{
              fontSize: 11.5,
              color: 'rgba(233,229,220,0.65)',
            }}
          >
            {block.filename || block.lang || 'code'}
          </span>
        </div>

        <button
          onClick={copy}
          className="bl-mono"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: copied ? 'rgba(39,201,63,0.15)' : 'rgba(255,255,255,0.06)',
            border: `1px solid ${copied ? 'rgba(39,201,63,0.5)' : 'rgba(255,255,255,0.12)'}`,
            color: copied ? '#27c93f' : 'rgba(233,229,220,0.7)',
            borderRadius: 6,
            padding: '5px 11px',
            fontSize: 11,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          {copied ? (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#27c93f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Copied
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>

      <pre
        className="bl-mono"
        style={{
          margin: 0,
          padding: '18px 20px',
          background: '#0f1115',
          fontSize: 13,
          lineHeight: 1.7,
          overflowX: 'auto',
          color: CODE_THEME.base,
        }}
      >
        <code>{highlight(block.code, block.lang)}</code>
      </pre>
    </motion.div>
  );
};

const PostBody = ({ blocks }) =>
  blocks.map((b, i) => {
    switch (b.type) {
      case 'heading':
        return (
          <h3
            key={i}
            className="bl-serif"
            style={{
              fontWeight: 400,
              fontSize: 'clamp(1.5rem,3.4vw,2.1rem)',
              lineHeight: 1.1,
              letterSpacing: '-0.01em',
              margin: 'clamp(50px,8vh,90px) 0 22px',
              color: INK,
            }}
          >
            {b.text}
          </h3>
        );

      case 'quote':
        return (
          <blockquote
            key={i}
            className="bl-serif"
            style={{
              margin: 'clamp(56px,9vh,100px) 0',
              paddingLeft: 28,
              borderLeft: `2px solid ${INK}`,
              fontWeight: 300,
              fontSize: 'clamp(1.5rem,3.6vw,2.3rem)',
              lineHeight: 1.28,
              letterSpacing: '-0.01em',
              color: INK,
            }}
          >
            “{b.text}”
            {b.cite && (
              <cite
                className="bl-mono"
                style={{
                  display: 'block',
                  marginTop: 18,
                  fontStyle: 'normal',
                  fontSize: 11,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'rgba(17,16,16,0.45)',
                }}
              >
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

      case 'code':
        return <CodeBlock key={i} block={b} />;

      case 'interactive':
        if (b.widget === 'neural') return <NeuralPlayground key={i} />;
        if (b.widget === 'textgen') return <TextGenerator key={i} />;
        if (b.widget === 'latentart') return <LatentArt key={i} />;
        if (b.widget === 'grapher') return <FunctionGrapher key={i} />;
        if (b.widget === 'easing') return <EasingPlayground key={i} />;
        if (b.widget === 'jakarta') return <JakartaGraph key={i} />;
        return null;

      case 'paragraph':
      default:
        return (
          <p
            key={i}
            style={{
              fontSize: '1.16rem',
              lineHeight: 1.9,
              fontWeight: 300,
              color: 'rgba(17,16,16,0.86)',
              marginBottom: 32,
            }}
          >
            {b.text}
          </p>
        );
    }
  });
  
const Blog = ({ onClose, initialPost = null }) => {
  const [openPost, setOpenPost] = useState(initialPost);

  // Prevents initial blog enter transition from replaying
  // after switching between index/article.
  const [initialTransitionDone, setInitialTransitionDone] = useState(false);

  // Closing whole blog overlay:
  // null → 'cover' → 'reveal'
  const [closePhase, setClosePhase] = useState(null);

  // Switching inside blog:
  // null → 'cover-post' → 'reveal-post'
  // null → 'cover-index' → 'reveal-index'
  const [articlePhase, setArticlePhase] = useState(null);
  const pendingPostRef = useRef(null);

  const transitionActive = Boolean(closePhase || articlePhase);

  // Sync local article state with App.jsx browser back/forward state.
  // When Chrome back changes initialPost, this updates the open article.
  useEffect(() => {
    setOpenPost(initialPost);
    pendingPostRef.current = null;
    setArticlePhase(null);
  }, [initialPost?.id]);

  const beginClose = () => {
    if (transitionActive) return;
    setClosePhase('cover');
  };

  const openPostWithPixels = (post) => {
    if (transitionActive) return;

    pendingPostRef.current = post;

    // Add article to browser history:
    // blog index → blog post
    window.history.pushState(
      { view: 'blog-post', postId: post.id },
      '',
      `#blog/${encodeURIComponent(post.id)}`
    );

    setArticlePhase('cover-post');
  };

  const backToIndexWithPixels = () => {
    if (transitionActive) return;

    // Move current URL/state back to the blog index.
    // This keeps the browser URL in sync when using the custom "Index" button.
    window.history.replaceState(
      { view: 'blog-index' },
      '',
      '#blog'
    );

    setArticlePhase('cover-index');
  };

  const handleArticleCovered = () => {
    if (articlePhase === 'cover-post') {
      setOpenPost(pendingPostRef.current);
      setArticlePhase('reveal-post');
      return;
    }

    if (articlePhase === 'cover-index') {
      setOpenPost(null);
      setArticlePhase('reveal-index');
    }
  };

  const handleArticleRevealDone = () => {
    pendingPostRef.current = null;
    setArticlePhase(null);
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      if (document.fullscreenElement) return;

      if (openPost) {
        backToIndexWithPixels();
      } else {
        beginClose();
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openPost, closePhase, articlePhase]);

  const revealing = closePhase === 'reveal';

  return (
    <motion.div
      data-lenis-prevent
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 1 }}
      transition={{ duration: 0.2, ease: [0.76, 0, 0.24, 1] }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9000,
        background: revealing ? 'transparent' : PAPER,
        color: INK,
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
          position: absolute;
          left: 0;
          bottom: -1px;
          height: 1px;
          width: 0;
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
          float: left;
          font-size: 4.4em;
          line-height: 0.74;
          padding: 6px 14px 0 0;
          font-weight: 400;
        }

        @media (max-width: 720px) {
          .bl-row { grid-template-columns: 1fr; gap: 10px; }
          .bl-num { display: none; }
          .bl-row:hover .bl-title { transform: none; }
          .bl-duo { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Blog content hidden only during final reveal to main page */}
      <div style={{ visibility: revealing ? 'hidden' : 'visible' }}>
        {/* Sticky top bar */}
        <div
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 10,
            background: PAPER,
            borderBottom: '1px solid rgba(17,16,16,0.10)',
          }}
        >
          <div
            className="bl-wrap"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '20px clamp(22px, 6vw, 80px)',
            }}
          >
            <button onClick={beginClose} style={btnReset}>
              <span className="bl-mono" style={{ fontSize: 12, letterSpacing: '0.06em' }}>
                ← James Hanzell
              </span>
            </button>

            <span
              className="bl-mono"
              style={{
                fontSize: 11,
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: 'rgba(17,16,16,0.5)',
              }}
            >
              The Journal
            </span>

            <button
              onClick={beginClose}
              className="bl-mono"
              style={{
                ...btnReset,
                fontSize: 11,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'rgba(17,16,16,0.5)',
              }}
            >
              Close
            </button>
          </div>
        </div>

        {/* Masthead */}
        <div
          className="bl-wrap"
          style={{
            paddingTop: 'clamp(70px, 12vh, 150px)',
            paddingBottom: 'clamp(50px, 8vh, 90px)',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="bl-mono"
            style={{
              fontSize: 11,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'rgba(17,16,16,0.5)',
              marginBottom: 26,
            }}
          >
            Notes on process, craft & thought
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="bl-serif"
            style={{
              fontWeight: 300,
              fontSize: 'clamp(2.6rem, 8vw, 6.2rem)',
              lineHeight: 0.98,
              letterSpacing: '-0.02em',
              maxWidth: 900,
              color: INK,
            }}
          >
            The space between building and feeling.
          </motion.h1>
        </div>

        {/* Index list */}
        <div
          className="bl-wrap"
          style={{
            paddingBottom: 'clamp(90px, 16vh, 180px)',
          }}
        >
          {POSTS.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.22 + i * 0.09,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="bl-row"
              onClick={() => openPostWithPixels(p)}
            >
              <span
                className="bl-mono bl-num"
                style={{
                  fontSize: 12,
                  color: 'rgba(17,16,16,0.35)',
                  letterSpacing: '0.06em',
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>

              <div>
                <div
                  className="bl-mono"
                  style={{
                    fontSize: 10.5,
                    letterSpacing: '0.24em',
                    textTransform: 'uppercase',
                    color: 'rgba(17,16,16,0.42)',
                    marginBottom: 14,
                  }}
                >
                  {p.kicker} — {p.date} — {p.readingTime}
                </div>

                <h2
                  className="bl-serif bl-title"
                  style={{
                    color: INK,
                    fontWeight: 400,
                    fontSize: 'clamp(1.7rem, 3.6vw, 2.8rem)',
                    lineHeight: 1.06,
                    letterSpacing: '-0.01em',
                    marginBottom: 16,
                    display: 'inline-block',
                  }}
                >
                  {p.title}
                </h2>

                <p
                  style={{
                    fontSize: '1rem',
                    fontWeight: 300,
                    lineHeight: 1.65,
                    color: 'rgba(17,16,16,0.6)',
                    maxWidth: 560,
                  }}
                >
                  {p.excerpt}
                </p>
              </div>

              <span
                className="bl-arrow bl-serif"
                style={{
                  fontSize: '1.6rem',
                  alignSelf: 'center',
                  color: INK,
                }}
              >
                ↗
              </span>
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 20,
                background: PAPER,
                overflowY: 'scroll',
                overscrollBehavior: 'contain',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              <div
                style={{
                  position: 'sticky',
                  top: 0,
                  zIndex: 5,
                  background: PAPER,
                  borderBottom: '1px solid rgba(17,16,16,0.10)',
                }}
              >
                <div
                  className="bl-wrap"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '20px clamp(22px, 6vw, 80px)',
                  }}
                >
                  <button
                    onClick={backToIndexWithPixels}
                    className="bl-mono"
                    style={{
                      ...btnReset,
                      fontSize: 12,
                      letterSpacing: '0.06em',
                      color: 'rgba(17,16,16,0.55)',
                    }}
                  >
                    ← Index
                  </button>

                  <span
                    className="bl-mono"
                    style={{
                      fontSize: 11,
                      letterSpacing: '0.3em',
                      textTransform: 'uppercase',
                      color: 'rgba(17,16,16,0.4)',
                    }}
                  >
                    {openPost.kicker}
                  </span>
                </div>
              </div>

              {openPost.hero && (
                <div
                  style={{
                    padding: 'clamp(28px, 5vw, 64px) clamp(22px, 6vw, 80px) 0',
                  }}
                >
                  {openPost.hero.type === 'interactive' ? (
                    <div style={{ maxWidth: 1180, margin: '0 auto' }}>
                      <PostBody blocks={[openPost.hero]} />
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      style={{
                        maxWidth: 1180,
                        margin: '0 auto',
                        aspectRatio: '16 / 9',
                        overflow: 'hidden',
                        background: '#000',
                        borderRadius: 4,
                      }}
                    >
                      <MediaEl item={openPost.hero} style={{ height: '100%' }} />
                    </motion.div>
                  )}
                </div>
              )}

              <article
                style={{
                  maxWidth: 720,
                  margin: '0 auto',
                  padding: '0 clamp(22px, 6vw, 40px)',
                }}
              >
                <div style={{ paddingTop: 'clamp(56px, 9vh, 110px)' }}>
                  <div
                    className="bl-mono"
                    style={{
                      fontSize: 11,
                      letterSpacing: '0.24em',
                      textTransform: 'uppercase',
                      color: 'rgba(17,16,16,0.45)',
                      marginBottom: 26,
                    }}
                  >
                    {openPost.kicker} · {openPost.date} · {openPost.readingTime}
                  </div>

                  <motion.h1
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="bl-serif"
                    style={{
                      fontWeight: 400,
                      fontSize: 'clamp(2.2rem, 6vw, 4rem)',
                      lineHeight: 1.02,
                      letterSpacing: '-0.02em',
                      marginBottom: 'clamp(44px, 7vh, 80px)',
                      color: INK,
                    }}
                  >
                    {openPost.title}
                  </motion.h1>
                </div>

                <div className="bl-read">
                  <PostBody blocks={openPost.blocks || []} />
                </div>

                <div
                  style={{
                    margin: 'clamp(60px,10vh,110px) 0',
                    height: 1,
                    background: 'rgba(17,16,16,0.16)',
                  }}
                />

                <button
                  onClick={backToIndexWithPixels}
                  className="bl-mono"
                  style={{
                    background: 'none',
                    border: `1px solid rgba(17,16,16,0.3)`,
                    borderRadius: 100,
                    padding: '13px 28px',
                    cursor: 'pointer',
                    fontSize: 11,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: INK,
                    marginBottom: 'clamp(80px,14vh,160px)',
                  }}
                >
                  ← Back to the index
                </button>
              </article>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Pixel transitions ── */}

      {/* Initial blog overlay reveal — runs ONCE only */}
      {!initialTransitionDone && !closePhase && !articlePhase && (
        <PixelTransition
          cover={INK}
          pixel={30}
          duration={0.3}
          phase="enter"
          zIndex={9500}
          onDone={() => setInitialTransitionDone(true)}
        />
      )}

      {/* Blog index → article OR article → index */}
      {(articlePhase === 'cover-post' || articlePhase === 'cover-index') && (
        <PixelTransition
          cover={INK}
          pixel={30}
          duration={0.3}
          phase="cover"
          zIndex={9600}
          onDone={handleArticleCovered}
        />
      )}

      {(articlePhase === 'reveal-post' || articlePhase === 'reveal-index') && (
        <PixelTransition
          cover={INK}
          pixel={30}
          duration={0.3}
          phase="reveal"
          zIndex={9600}
          onDone={handleArticleRevealDone}
        />
      )}

      {/* Close whole blog overlay → reveal main page */}
      {closePhase === 'cover' && (
        <PixelTransition
          cover={INK}
          pixel={30}
          duration={0.3}
          phase="cover"
          zIndex={9700}
          onDone={() => setClosePhase('reveal')}
        />
      )}

      {closePhase === 'reveal' && (
        <PixelTransition
          cover={INK}
          pixel={30}
          duration={0.3}
          phase="reveal"
          zIndex={9700}
          onDone={() => onClose?.()}
        />
      )}
    </motion.div>
  );
};

export default Blog;