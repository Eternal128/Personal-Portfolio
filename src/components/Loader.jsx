import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// SVG viewBox is a fixed coordinate space (independent of the box's actual
// rendered/responsive pixel size), so the dash-array perimeter math below
// never needs to know real pixel dimensions.
const BOX_VB = 300;
const BOX_INSET = 1.5;
const BOX_SIDE = BOX_VB - BOX_INSET * 2;
const PERIMETER = BOX_SIDE * 4;

const TAGLINE = 'CODE · CREATE · CONNECT';

// The loader's own canvas is a fixed, theme-independent neutral — a
// deliberate "waiting room" surface distinct from the site itself, not an
// attempt to match dark/light mode. Theme-correctness happens at the one
// moment it actually matters: the box fills with the site's real `--bg`
// right before it zooms to fullscreen, so the handoff into Hero lands on
// the exact right color for whichever theme is active.
const LOADER_BG = '#d1d1ce';
const LOADER_STROKE = 'rgba(23,21,18,0.45)';
const LOADER_TEXT = '#1c1a17';
const LOADER_TEXT_DIM = 'rgba(23,21,18,0.4)';
const LOADER_TEXT_FAINT = 'rgba(23,21,18,0.32)';
const LOADER_CROSSHAIR = 'rgba(23,21,18,0.3)';

const PAUSE_MS = 300;   // beat after the box finishes drawing
const FILL_MS = 550;    // box fill transitions from outline to solid --bg
const CHROME_FADE_S = 0.25; // monogram/tagline/counter fade-out
const ZOOM_DURATION = 0.95; // seconds — the filled box morphing to fullscreen
const ZOOM_EASE = [0.6, 0, 0.9, 1]; // slow start, fast finish
const CROSSHAIR_MARGIN = 14; // px, resting distance outside the box corners
const CROSSHAIR_EXPLODE_MARGIN = 90; // px, how far the marks burst out before settling back
const CROSSHAIR_BURST_S = 0.9; // seconds — near -> exploded -> near
const CROSSHAIR_SPIN_S = 1.2; // seconds per rotation while the box draws
const ZOOM_BUFFER = 1.02; // slight overshoot so no hairline gap at the true viewport edge

// Defined at module scope (not inside Loader's render body) so it keeps a
// stable identity across re-renders — Loader re-renders ~60x/sec while
// `progress` ticks, and a component defined inline would get remounted on
// every single one of those, resetting its animation before it could ever
// finish.
//
// Position is split across two elements: a static outer <span> holds the
// real `left`/`top` (set once, never animated — animating those is a
// layout-triggering property and was the main source of the jank) and
// centers the glyph via a constant `translate(-50%,-50%)`. The inner
// <motion.span> only ever animates `x`/`y` (a transform, GPU-composited)
// as a small delta from that anchor, which is both cheaper and avoids a
// browser bug where a multi-segment `ease` array of named easings (e.g.
// ['easeOut','easeInOut']) crashes Framer Motion's native WAAPI path with
// "not a valid value for easing" — a single numeric bezier applied across
// the whole keyframe sequence sidesteps it entirely.
const Corner = React.memo(({ c, zooming, burstDone, spinning }) => {
  let animateTarget;
  let transitionProps;

  const dxFar = c.xFar - c.xNear;
  const dyFar = c.yFar - c.yNear;
  const dxExplode = c.xExplode - c.xNear;
  const dyExplode = c.yExplode - c.yNear;

  if (zooming) {
    animateTarget = { x: dxFar, y: dyFar, opacity: [1, 1, 0] };
    transitionProps = {
      x: { duration: ZOOM_DURATION, ease: ZOOM_EASE },
      y: { duration: ZOOM_DURATION, ease: ZOOM_EASE },
      opacity: { duration: ZOOM_DURATION, times: [0, 0.7, 1] },
    };
  } else if (!burstDone) {
    animateTarget = {
      x: [0, dxExplode, 0],
      y: [0, dyExplode, 0],
      opacity: 1,
    };
    transitionProps = {
      duration: CROSSHAIR_BURST_S,
      times: [0, 0.55, 1],
      ease: [0.16, 1, 0.3, 1],
    };
  } else {
    animateTarget = { x: 0, y: 0, opacity: 1 };
    transitionProps = { duration: 0.2 };
  }

  return (
    <span style={{ position: 'absolute', left: c.xNear, top: c.yNear, transform: 'translate(-50%,-50%)' }}>
      <motion.span
        className={`loader-crosshair${spinning ? ' spinning' : ''}`}
        style={{ display: 'inline-block' }}
        initial={{ x: 0, y: 0, opacity: 1 }}
        animate={animateTarget}
        transition={transitionProps}
      >
        +
      </motion.span>
    </span>
  );
});

const Loader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhaseState] = useState('drawing'); // drawing | filling | zoom
  const [visible, setVisible] = useState(true);
  const [geo, setGeo] = useState(null);
  const [burstDone, setBurstDone] = useState(false);

  const frameRef = useRef(null);
  const phaseRef = useRef('drawing');
  const completeCalledRef = useRef(false);

  const setPhase = (next) => {
    phaseRef.current = next;
    setPhaseState(next);
  };

  // Measure the box once, then precompute everything the zoom needs: the
  // independent scaleX/scaleY that morph the square into a viewport-flush
  // rectangle (not a uniform scale, which would just overshoot one axis),
  // and the start/end coordinates for each corner mark so they can be
  // animated directly (not inherited via the box's own transform, which
  // would stretch/distort a "+" glyph as the aspect ratio changes).
  useEffect(() => {
    if (!frameRef.current) return;
    const rect = frameRef.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const halfW = Math.max(cx, vw - cx) * ZOOM_BUFFER;
    const halfH = Math.max(cy, vh - cy) * ZOOM_BUFFER;

    const scaleX = (halfW * 2) / rect.width;
    const scaleY = (halfH * 2) / rect.height;

    const corner = (dx, dy) => ({
      xNear: cx + dx * (rect.width / 2 + CROSSHAIR_MARGIN),
      yNear: cy + dy * (rect.height / 2 + CROSSHAIR_MARGIN),
      xExplode: cx + dx * (rect.width / 2 + CROSSHAIR_EXPLODE_MARGIN),
      yExplode: cy + dy * (rect.height / 2 + CROSSHAIR_EXPLODE_MARGIN),
      xFar: cx + dx * (halfW + CROSSHAIR_MARGIN),
      yFar: cy + dy * (halfH + CROSSHAIR_MARGIN),
    });

    setGeo({
      scaleX,
      scaleY,
      tl: corner(-1, -1),
      tr: corner(1, -1),
      bl: corner(-1, 1),
      br: corner(1, 1),
    });
  }, []);

  // Marks appear at the box edges, burst outward, then ease back to the
  // edges — once settled, they spin in place while the box draws.
  useEffect(() => {
    const t = setTimeout(() => setBurstDone(true), CROSSHAIR_BURST_S * 1000);
    return () => clearTimeout(t);
  }, []);

  // Loading counter — also drives the box-draw dashoffset directly below.
  useEffect(() => {
    let start = null;
    let raf;

    const duration = 2400;

    const step = (timestamp) => {
      if (!start) start = timestamp;

      const elapsed = timestamp - start;
      const raw = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - raw, 3);

      setProgress(Math.floor(eased * 100));

      if (raw < 1) {
        raf = requestAnimationFrame(step);
      } else {
        setProgress(100);

        setTimeout(() => {
          if (phaseRef.current === 'drawing') {
            setPhase('filling');
          }
        }, PAUSE_MS);
      }
    };

    raf = requestAnimationFrame(step);

    return () => cancelAnimationFrame(raf);
  }, []);

  // filling → zoom, once the fill transition has visually completed.
  useEffect(() => {
    if (phase !== 'filling') return;
    const t = setTimeout(() => {
      if (phaseRef.current === 'filling') setPhase('zoom');
    }, FILL_MS + 100);
    return () => clearTimeout(t);
  }, [phase]);

  const handleZoomComplete = () => {
    if (phaseRef.current !== 'zoom' || completeCalledRef.current) return;
    completeCalledRef.current = true;
    setVisible(false);
    onComplete?.();
  };

  if (!visible) return null;

  const drawing = phase === 'drawing';
  const zooming = phase === 'zoom';
  const boxComplete = progress >= 100;
  const spinning = drawing && burstDone && !boxComplete;
  const dashOffset = PERIMETER * (1 - progress / 100);

  return (
    <>
      <style>{`
        .loader-root {
          position: fixed;
          inset: 0;
          z-index: 99999;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-family: 'DM Sans', sans-serif;
          overflow: hidden;
          pointer-events: none;
          background: ${LOADER_BG};
        }

        .loader-frame-wrap {
          position: relative;
          width: clamp(220px, 26vw, 320px);
          aspect-ratio: 1 / 1;
        }

        .loader-crosshair {
          font-size: 26px;
          font-weight: 200;
          line-height: 1;
          color: ${LOADER_CROSSHAIR};
          user-select: none;
        }

        .loader-crosshair.spinning {
          animation: loaderCrosshairSpin ${CROSSHAIR_SPIN_S}s linear infinite;
        }

        @keyframes loaderCrosshairSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        .loader-monogram {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: clamp(30px, 5vw, 44px);
          font-weight: 600;
          letter-spacing: -0.02em;
          color: ${LOADER_TEXT};
        }

        .loader-tagline {
          margin-top: 28px;
          text-align: center;
          font-size: 11px;
          font-weight: 400;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: ${LOADER_TEXT_DIM};
        }

        .loader-counter {
          margin-top: 14px;
          text-align: center;
          font-size: 11px;
          font-weight: 300;
          letter-spacing: 0.15em;
          color: ${LOADER_TEXT_FAINT};
        }
      `}</style>

      <div className="loader-root">
        {geo && ['tl', 'tr', 'bl', 'br'].map((m) => (
          <Corner key={m} c={geo[m]} zooming={zooming} burstDone={burstDone} spinning={spinning} />
        ))}

        {/* Box — draws its outline, fills solid with the site's real
            background, then morphs (independent scaleX/scaleY, not a
            uniform scale) into a fullscreen rectangle matching the
            viewport's own aspect ratio. */}
        <motion.div
          ref={frameRef}
          className="loader-frame-wrap"
          initial={{ scaleX: 1, scaleY: 1 }}
          animate={{
            scaleX: zooming && geo ? geo.scaleX : 1,
            scaleY: zooming && geo ? geo.scaleY : 1,
          }}
          transition={{ duration: ZOOM_DURATION, ease: ZOOM_EASE }}
          onAnimationComplete={handleZoomComplete}
        >
          <svg
            viewBox={`0 0 ${BOX_VB} ${BOX_VB}`}
            style={{ width: '100%', height: '100%', display: 'block' }}
          >
            <rect
              x={BOX_INSET}
              y={BOX_INSET}
              width={BOX_SIDE}
              height={BOX_SIDE}
              stroke={LOADER_STROKE}
              strokeWidth={1.5}
              strokeDasharray={PERIMETER}
              strokeDashoffset={dashOffset}
              style={{
                fill: drawing ? 'transparent' : 'var(--bg)',
                transition: `fill ${FILL_MS}ms ease`,
              }}
            />
          </svg>

          <motion.div
            className="loader-chrome"
            style={{ position: 'absolute', inset: 0 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: drawing ? 1 : 0 }}
            transition={{ duration: drawing ? 0.6 : CHROME_FADE_S, delay: drawing ? 0.15 : 0 }}
          >
            <div className="loader-monogram">JH</div>
          </motion.div>
        </motion.div>

        <motion.div
          className="loader-tagline"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: drawing ? 1 : 0, y: drawing ? 0 : 8 }}
          transition={{ duration: drawing ? 0.5 : CHROME_FADE_S, delay: drawing ? 0.25 : 0 }}
        >
          {TAGLINE}
        </motion.div>

        <motion.div
          className="loader-counter"
          initial={{ opacity: 0 }}
          animate={{ opacity: drawing ? 1 : 0 }}
          transition={{ duration: drawing ? 0.5 : CHROME_FADE_S, delay: drawing ? 0.35 : 0 }}
        >
          {String(progress).padStart(2, '0')}%
        </motion.div>
      </div>
    </>
  );
};

export default Loader;
