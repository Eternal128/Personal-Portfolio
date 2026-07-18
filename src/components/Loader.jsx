import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  roomie, quietspace, editor, virus, road,
  meal, chess, about, music, machine, covid,
} from '../assets';

const ORBIT_SECONDS = 75;
const RADIUS_X = 360;
const RADIUS_Y = 240;
const COLLAPSE_MS = 900;
const SPIN_BOOST = 9; // how many times faster it spins at full collapse

const IMAGE_TILES = [
  { type: 'image', src: about,      label: 'About Me' },
  { type: 'image', src: roomie,     label: 'Roomie — AI Design Tool' },
  { type: 'image', src: quietspace, label: 'QuietSpace' },
  { type: 'image', src: virus,      label: 'COVID-19 X-Ray Classification' },
  { type: 'image', src: road,       label: 'Jakarta Route Optimization' },
  { type: 'image', src: editor,     label: 'Editing Portfolio' },
  { type: 'image', src: chess,      label: 'Arcade Game — Java' },
  { type: 'image', src: music,      label: 'Spotify Music Recommender' },
  { type: 'image', src: meal,       label: 'Meal App' },
  { type: 'image', src: machine,    label: 'Machine Learning Projects' },
  { type: 'image', src: covid,      label: 'X-Ray Deep Learning' },
];

const VIDEO_TILES = [
  { type: 'video', src: 'https://res.cloudinary.com/daetzwh6x/video/upload/v1774021264/4_Raws_-_Toji_Fushiguro_oyvmqf.mp4', label: '4 Raws — Toji Fushiguro' },
  { type: 'video', src: 'https://res.cloudinary.com/daetzwh6x/video/upload/v1773972756/the_strongest_ebutvq.mp4',           label: 'The Strongest — Gojo Satoru' },
  { type: 'video', src: 'https://res.cloudinary.com/daetzwh6x/video/upload/v1773972350/toji_mograph_hbqmsu.mov',            label: 'Les Instrumental — Toji (1.8M views)' },
  { type: 'video', src: 'https://res.cloudinary.com/daetzwh6x/video/upload/v1773972392/toji_ofjtmn.mov',                    label: '21 Savage SFX — Toji' },
  { type: 'video', src: 'https://res.cloudinary.com/daetzwh6x/video/upload/v1773972454/toji_creed_x2zutr.mov',              label: 'Dame & Creed SFX — Toji' },
];

function interleave(images, videos) {
  const out = [];
  const gap = Math.floor(images.length / videos.length) || 1;
  let vi = 0;
  for (let i = 0; i < images.length; i++) {
    out.push(images[i]);
    if ((i + 1) % gap === 0 && vi < videos.length) out.push(videos[vi++]);
  }
  while (vi < videos.length) out.push(videos[vi++]);
  return out;
}

const MEDIA = interleave(IMAGE_TILES, VIDEO_TILES);
const TILES = MEDIA.map((m, i) => ({
  ...m,
  w: 240 + (i % 3) * 40,
  rJitter: 0.9 + ((i * 41) % 22) / 100,
}));

const GRAY = 'grayscale(90%) brightness(0.84) contrast(1.7)';
const COLOR = 'grayscale(0%) brightness(1)';

const easeInCubic = (t) => t * t * t;

const Loader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState('assembling'); // assembling | enter | exiting
  const [visible, setVisible] = useState(true);

  const tileRefs = useRef([]);
  const mediaRefs = useRef([]);
  const capRefs = useRef([]);
  const saturnRef = useRef(null);
  const rafRef = useRef(null);
  const angleRef = useRef(0);

  const exitStartRef = useRef(null);
  const phaseRef = useRef('assembling');
  const doneRef = useRef(false); // ← fire onComplete only ONCE
  useEffect(() => { phaseRef.current = phase; }, [phase]);

  // Loading counter
  useEffect(() => {
    let start = null;
    const duration = 2400;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const raw = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - raw, 3);
      setProgress(Math.floor(eased * 100));
      if (raw < 1) requestAnimationFrame(step);
      else {
        setProgress(100);
        setTimeout(() => setPhase('enter'), 200);
      }
    };
    requestAnimationFrame(step);
  }, []);

  // Orbit + fast-spin collapse-into-center on exit
  useEffect(() => {
    let last = performance.now();
    const loop = (now) => {
      const dt = (now - last) / 1000;
      last = now;

      // Collapse progress 0→1 during exit
      let collapse = 0;
      if (phaseRef.current === 'exiting') {
        if (exitStartRef.current == null) exitStartRef.current = now;
        collapse = Math.min((now - exitStartRef.current) / COLLAPSE_MS, 1);
      }
      const pull = easeInCubic(collapse); // 0 = orbit pos, 1 = center

      // Spin speeds up dramatically as it collapses inward
      const spinMultiplier = 1 + pull * SPIN_BOOST;
      angleRef.current += ((2 * Math.PI) / ORBIT_SECONDS) * dt * spinMultiplier;

      const n = TILES.length;
      for (let i = 0; i < n; i++) {
        const el = tileRefs.current[i];
        if (!el) continue;
        const t = TILES[i];
        const theta = angleRef.current + (i / n) * Math.PI * 2;
        // radius shrinks with pull → collapses inward, oval shape preserved
        const rx = RADIUS_X * t.rJitter * (1 - pull);
        const ry = RADIUS_Y * t.rJitter * (1 - pull);
        const x = Math.cos(theta) * rx;
        const y = Math.sin(theta) * ry;

        const scale = 1 - pull * 0.95;
        el.style.transform =
          `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${scale})`;
        el.style.opacity = String(1 - pull);
      }

      // Saturn collapses + fades in sync
      if (saturnRef.current) {
        if (phaseRef.current === 'exiting') {
          const s = Math.max(1 - pull, 0);
          saturnRef.current.style.transform = `scale(${s})`;
          saturnRef.current.style.opacity = String(s);
        } else {
          saturnRef.current.style.transform = 'scale(1)';
          saturnRef.current.style.opacity = '1';
        }
      }

      // When collapse finishes, unmount + fire onComplete exactly once
      if (phaseRef.current === 'exiting' && collapse >= 1 && !doneRef.current) {
        doneRef.current = true;
        setVisible(false);
        onComplete && onComplete();
      }

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const enter = (i) => {
    if (phaseRef.current === 'exiting') return;
    const wrap = tileRefs.current[i];
    const media = mediaRefs.current[i];
    const cap = capRefs.current[i];
    if (wrap) wrap.style.zIndex = 100;
    if (media) media.style.filter = COLOR;
    if (cap) { cap.style.opacity = 1; cap.style.transform = 'translateY(0)'; }
  };
  const leave = (i) => {
    const wrap = tileRefs.current[i];
    const media = mediaRefs.current[i];
    const cap = capRefs.current[i];
    if (wrap) wrap.style.zIndex = 10 + i;
    if (media) media.style.filter = GRAY;
    if (cap) { cap.style.opacity = 0; cap.style.transform = 'translateY(6px)'; }
  };

  const handleEnter = () => {
    if (phaseRef.current === 'exiting') return;
    setPhase('exiting');
    // no setTimeout here — the rAF loop unmounts when collapse hits 1
  };

  return (
    <>
      <style>{`
        @keyframes loaderClickPulse {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0.55; }
        }
      `}</style>

      {visible && (
        <div
          onClick={handleEnter}
          style={{
            position: 'fixed', inset: 0, background: '#000',
            zIndex: 99999, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontFamily: "'DM Sans', sans-serif",
            overflow: 'hidden',
            cursor: 'pointer',
          }}
        >
          {/* Zero-size point at true screen center */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', width: 0, height: 0 }}>
            {TILES.map((t, i) => (
              <div
                key={i}
                ref={(el) => (tileRefs.current[i] = el)}
                onMouseEnter={() => enter(i)}
                onMouseLeave={() => leave(i)}
                style={{
                  position: 'absolute',
                  left: 0, top: 0,
                  width: `${t.w}px`,
                  aspectRatio: '16 / 9',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 10 + i,
                  cursor: 'pointer',
                  willChange: 'transform, opacity',
                }}
              >
                <div style={{
                  width: '100%', height: '100%',
                  overflow: 'hidden',
                  boxShadow: '0 14px 40px rgba(0,0,0,0.6)',
                  position: 'relative',
                }}>
                  {t.type === 'video' ? (
                    <video
                      ref={(el) => (mediaRefs.current[i] = el)}
                      src={t.src}
                      muted loop autoPlay playsInline preload="metadata"
                      style={{
                        width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                        filter: GRAY, transition: 'filter 0.35s ease',
                      }}
                    />
                  ) : (
                    <img
                      ref={(el) => (mediaRefs.current[i] = el)}
                      src={t.src}
                      alt=""
                      style={{
                        width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                        filter: GRAY, transition: 'filter 0.35s ease',
                      }}
                    />
                  )}

                  <div
                    ref={(el) => (capRefs.current[i] = el)}
                    style={{
                      position: 'absolute', left: 0, right: 0, bottom: 0,
                      padding: '10px 12px',
                      background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)',
                      opacity: 0, transform: 'translateY(6px)',
                      transition: 'opacity 0.3s ease, transform 0.3s ease',
                      pointerEvents: 'none',
                    }}
                  >
                    <span style={{
                      fontSize: 11, fontWeight: 400, letterSpacing: '0.04em',
                      color: '#fff', display: 'flex', alignItems: 'center', gap: 6,
                    }}>
                      {t.type === 'video' && (
                        <span style={{
                          fontSize: 8, letterSpacing: '0.12em', textTransform: 'uppercase',
                          color: 'rgba(212,180,100,0.95)', border: '1px solid rgba(212,180,100,0.5)',
                          borderRadius: 3, padding: '1px 5px',
                        }}>Edit</span>
                      )}
                      {t.label}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Saturn */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none', zIndex: 200,
          }}>
            <div ref={saturnRef} style={{ willChange: 'transform, opacity' }}>
              <svg width="34" height="16" viewBox="0 0 34 16" fill="none">
                <ellipse cx="17" cy="8" rx="9" ry="7.5" fill="#ffffff" />
                <ellipse cx="17" cy="8" rx="16" ry="4.5" fill="none" stroke="#ffffff" strokeWidth="1.4" />
              </svg>
            </div>
          </div>

          {/* Click prompt */}
          <AnimatePresence>
            {phase !== 'exiting' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                style={{
                  position: 'absolute', bottom: 28, left: 0, right: 0,
                  display: 'flex', justifyContent: 'center', pointerEvents: 'none', zIndex: 200,
                }}
              >
                <span style={{
                  fontSize: 11, fontWeight: 500, letterSpacing: '0.32em',
                  textTransform: 'uppercase', color: '#ffffff',
                  animation: 'loaderClickPulse 2.2s ease-in-out infinite',
                }}>
                  Click anywhere to start
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Progress % */}
          <div style={{
            position: 'absolute', bottom: 32, right: 32, zIndex: 200,
            fontSize: 10, fontWeight: 300, color: 'rgba(255,255,255,0.25)',
            letterSpacing: '0.15em',
          }}>
            {phase === 'assembling' ? `${progress}%` : ''}
          </div>
        </div>
      )}
    </>
  );
};

export default Loader;