import React, { useRef, useState, useCallback } from 'react';

// A simplified, honest illustration of the Quiet Eye effect. Not a
// literal simulation, but a way to feel the difference the research
// describes, a longer, stiller fixation before the shot vs a rushed one.
const QuietEyeDemo = () => {
  const [mode, setMode] = useState(null); // 'rushed' | 'quiet'
  const [phase, setPhase] = useState('idle'); // idle | fixating | shooting | done
  const [outcome, setOutcome] = useState(null); // 'goal' | 'miss'
  const [dotPos, setDotPos] = useState({ x: 50, y: 50 });
  const timers = useRef([]);

  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = []; };

  const run = useCallback((which) => {
    clearTimers();
    setMode(which);
    setOutcome(null);
    setPhase('fixating');

    const fixateMs = which === 'quiet' ? 900 : 220;

    if (which === 'rushed') {
      // Jittery gaze, never settles before firing
      let n = 0;
      const jitter = () => {
        n++;
        setDotPos({ x: 46 + Math.random() * 8, y: 46 + Math.random() * 8 });
        if (n < 4) timers.current.push(setTimeout(jitter, 55));
      };
      jitter();
    } else {
      // Settles quickly and holds, the "quiet" period
      setDotPos({ x: 50, y: 50 });
    }

    timers.current.push(setTimeout(() => {
      setPhase('shooting');
      timers.current.push(setTimeout(() => {
        setPhase('done');
        setOutcome(which === 'quiet' ? 'goal' : (Math.random() < 0.55 ? 'miss' : 'goal'));
      }, 260));
    }, fixateMs));
  }, []);

  const reset = () => {
    clearTimers();
    setMode(null); setPhase('idle'); setOutcome(null); setDotPos({ x: 50, y: 50 });
  };

  return (
    <div style={panel}>
      <div className="bl-mono" style={label}>Interactive. Quiet Eye</div>
      <p style={desc}>
        Joan Vickers' research (and the meta-analysis by Mann et al.) found that elite athletes hold
        a longer, stiller final fixation on the target right before acting, not a faster reaction,
        a longer look. Run both below and watch the dot.
      </p>

      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={frame}>
          <div style={{
            position: 'absolute', left: `${dotPos.x}%`, top: `${dotPos.y}%`,
            transform: 'translate(-50%,-50%)',
            width: phase === 'shooting' ? 10 : 14, height: phase === 'shooting' ? 10 : 14,
            borderRadius: '50%',
            background: mode === 'quiet' ? '#c9a24a' : '#b4432f',
            transition: phase === 'fixating' && mode === 'quiet' ? 'none' : 'width 0.2s, height 0.2s',
            boxShadow: phase === 'fixating' && mode === 'quiet' ? '0 0 0 10px rgba(201,162,74,0.18)' : 'none',
          }} />
          {phase === 'done' && (
            <div style={{
              position: 'absolute', bottom: 10, left: 0, right: 0, textAlign: 'center',
              fontSize: 12.5, fontWeight: 600, color: outcome === 'goal' ? '#3a7a3a' : '#b4432f',
              fontFamily: "'DM Sans', sans-serif",
            }}>
              {outcome === 'goal' ? '⚽ Goal' : '✕ Off target'}
            </div>
          )}
          {phase === 'idle' && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: 'rgba(17,16,16,0.35)', fontFamily: "'DM Sans', sans-serif" }}>
              pick a mode →
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minWidth: 200 }}>
          <button onClick={() => run('rushed')} style={ghostBtn}>Rushed fixation (~0.2s)</button>
          <button onClick={() => run('quiet')} style={primaryBtn}>Quiet eye (~0.9s)</button>
          <button onClick={reset} style={{ ...ghostBtn, opacity: 0.7 }}>Reset</button>
          <p style={{ fontSize: 11.5, color: 'rgba(17,16,16,0.45)', lineHeight: 1.5, marginTop: 6 }}>
            This is illustrative, not a real physics simulation. The actual research measures gaze
            duration with eye-tracking hardware, not outcome probability like this toy does.
          </p>
        </div>
      </div>
    </div>
  );
};

const panel = { margin: 'clamp(48px,8vh,90px) 0', fontFamily: "'DM Sans', sans-serif", border: '1px solid rgba(17,16,16,0.16)', borderRadius: 8, padding: 'clamp(18px,3vw,28px)', background: 'rgba(17,16,16,0.02)' };
const label = { fontSize: 10.5, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(17,16,16,0.45)', marginBottom: 16 };
const desc = { fontSize: 14, lineHeight: 1.6, color: 'rgba(17,16,16,0.72)', marginBottom: 20, maxWidth: 640 };
const frame = { position: 'relative', width: 220, height: 160, borderRadius: 8, border: '1px solid rgba(17,16,16,0.14)', background: '#fff', flexShrink: 0 };
const primaryBtn = { padding: '9px 16px', borderRadius: 100, cursor: 'pointer', border: '1px solid #111010', background: '#111010', color: '#e9e5dc', fontFamily: "'DM Sans',sans-serif", fontSize: 12.5, fontWeight: 500 };
const ghostBtn = { padding: '9px 15px', borderRadius: 100, cursor: 'pointer', border: '1px solid rgba(17,16,16,0.25)', background: 'transparent', color: '#111010', fontFamily: "'DM Sans',sans-serif", fontSize: 12.5 };

export default QuietEyeDemo;