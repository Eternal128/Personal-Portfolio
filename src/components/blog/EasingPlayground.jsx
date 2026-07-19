import React, { useRef, useState, useEffect } from 'react';

// The same easing math I use to pace an edit — expressed as code.
const EASINGS = {
  linear: (t) => t,
  'ease-in (cubic)': (t) => t * t * t,
  'ease-out (cubic)': (t) => 1 - Math.pow(1 - t, 3),
  'ease-in-out': (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  'impact (back-out)': (t) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
  bounce: (t) => {
    const n1 = 7.5625, d1 = 2.75;
    if (t < 1 / d1) return n1 * t * t;
    if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
    if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
    return n1 * (t -= 2.625 / d1) * t + 0.984375;
  },
};

const W = 420, H = 200, DUR = 1400;

const EasingPlayground = () => {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const [name, setName] = useState('impact (back-out)');
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);

  // draw the curve + moving dot
  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const pad = 24;
    const ease = EASINGS[name];

    ctx.fillStyle = '#f3f0e8';
    ctx.fillRect(0, 0, W, H);

    // grid box
    ctx.strokeStyle = 'rgba(17,16,16,0.15)';
    ctx.strokeRect(pad, pad, W - pad * 2, H - pad * 2);

    // curve
    ctx.strokeStyle = '#c9a24a';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    for (let i = 0; i <= 100; i++) {
      const t = i / 100;
      const v = ease(t);
      const px = pad + t * (W - pad * 2);
      const py = H - pad - v * (H - pad * 2);
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.stroke();

    // current point on curve
    const v = ease(progress);
    const px = pad + progress * (W - pad * 2);
    const py = H - pad - v * (H - pad * 2);
    ctx.beginPath();
    ctx.arc(px, py, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#111010';
    ctx.fill();

    // vertical time marker
    ctx.strokeStyle = 'rgba(17,16,16,0.25)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(px, pad); ctx.lineTo(px, H - pad); ctx.stroke();
  }, [name, progress]);

  const play = () => {
    if (playing) return;
    setPlaying(true);
    const start = performance.now();
    const loop = (now) => {
      const t = Math.min((now - start) / DUR, 1);
      setProgress(t);
      if (t < 1) rafRef.current = requestAnimationFrame(loop);
      else setPlaying(false);
    };
    rafRef.current = requestAnimationFrame(loop);
  };

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  const eased = EASINGS[name](progress);

  return (
    <div style={panel}>
      <div className="bl-mono" style={label}>Interactive — Easing / Pacing Lab</div>
      <p style={desc}>
        This is where my two worlds overlap. Every time I pace an edit, I’m really just choosing an
        easing curve — how fast a moment arrives and how hard it lands. Pick one, hit play, and watch
        the timing I’d feel in an edit become the timing you’d write in code.
      </p>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        {Object.keys(EASINGS).map((k) => (
          <button key={k} onClick={() => { setName(k); setProgress(0); }} style={{
            ...chip,
            border: name === k ? '1px solid #111010' : '1px solid rgba(17,16,16,0.22)',
            background: name === k ? 'rgba(17,16,16,0.06)' : 'transparent',
          }}>{k}</button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <canvas ref={canvasRef} width={W} height={H}
          style={{ width: '100%', maxWidth: W, borderRadius: 6, border: '1px solid rgba(17,16,16,0.14)' }} />

        {/* the thing being animated — like a clip hitting its mark */}
        <div style={{ flex: 1, minWidth: 180 }}>
          <div style={{ height: 8, borderRadius: 4, background: 'rgba(17,16,16,0.1)', position: 'relative', marginBottom: 18 }}>
            <div style={{
              position: 'absolute', top: '50%', left: `${eased * 100}%`,
              width: 22, height: 22, borderRadius: 6, background: '#c9a24a',
              transform: 'translate(-50%,-50%)', boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
            }} />
          </div>
          <button onClick={play} disabled={playing} style={primaryBtn(playing)}>
            {playing ? 'Playing…' : '▶ Play'}
          </button>
          <div className="bl-mono" style={{ marginTop: 16, fontSize: 12, color: 'rgba(17,16,16,0.6)' }}>
            t = {progress.toFixed(2)} → eased = {eased.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
};

const panel = { margin: 'clamp(48px,8vh,90px) 0', fontFamily: "'DM Sans', sans-serif", border: '1px solid rgba(17,16,16,0.16)', borderRadius: 8, padding: 'clamp(18px,3vw,28px)', background: 'rgba(17,16,16,0.02)' };
const label = { fontSize: 10.5, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(17,16,16,0.45)', marginBottom: 16 };
const desc = { fontSize: 14, lineHeight: 1.6, color: 'rgba(17,16,16,0.72)', marginBottom: 20 };
const chip = { padding: '7px 13px', borderRadius: 100, cursor: 'pointer', color: '#111010', fontFamily: "'DM Mono', monospace", fontSize: 12 };
const primaryBtn = (disabled) => ({ padding: '10px 20px', borderRadius: 100, cursor: disabled ? 'not-allowed' : 'pointer', border: '1px solid #111010', background: disabled ? 'rgba(17,16,16,0.08)' : '#111010', color: disabled ? 'rgba(17,16,16,0.4)' : '#e9e5dc', fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 500 });

export default EasingPlayground;