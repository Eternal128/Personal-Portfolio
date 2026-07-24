import React, { useRef, useState, useEffect } from 'react';

const STATS = [
  { label: 'Career goals',        value: 919, suffix: '',  note: '794 club + 125 international' },
  { label: 'Career assists',      value: 405, suffix: '+', note: 'all-time leader, surpassed Puskás in 2025' },
  { label: 'Ballon d\u2019Or',    value: 8,   suffix: '',  note: 'record, 3 more than second place' },
  { label: 'World Cup goals',     value: 20,  suffix: '',  note: 'all-time tournament record' },
  { label: 'Goals for Barcelona', value: 672, suffix: '',  note: 'most for a single club, ever' },
  { label: 'Age at 2026 final',   value: 39,  suffix: '',  note: 'first man to play six World Cups' },
];

function useCountUp(target, active, duration = 1400) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = null;
    let raf;
    const step = (t) => {
      if (!start) start = t;
      const p = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration]);
  return val;
}

const StatCard = ({ stat, active, delay }) => {
  const val = useCountUp(stat.value, active, 1200 + delay);
  return (
    <div style={card}>
      <div style={{ fontSize: 'clamp(30px, 4vw, 44px)', fontWeight: 600, color: '#111010', lineHeight: 1 }}>
        {val}{stat.suffix}
      </div>
      <div style={{ fontSize: 12.5, fontWeight: 500, color: 'rgba(17,16,16,0.7)', marginTop: 8 }}>
        {stat.label}
      </div>
      <div style={{ fontSize: 11, color: 'rgba(17,16,16,0.42)', marginTop: 3, lineHeight: 1.4 }}>
        {stat.note}
      </div>
    </div>
  );
};

const MessiStats = () => {
  const ref = useRef(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setActive(true); },
      { threshold: 0.35 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div style={panel} ref={ref}>
      <div className="bl-mono" style={label}>The Numbers, As of July 2026</div>
      <p style={desc}>
        Every figure below is checkable, current as of the 2026 World Cup final. Nothing here is
        projected or rounded up for effect. This is what he actually did.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 14 }}>
        {STATS.map((s, i) => (
          <StatCard key={s.label} stat={s} active={active} delay={i * 120} />
        ))}
      </div>
    </div>
  );
};

const panel = { margin: 'clamp(48px,8vh,90px) 0', fontFamily: "'DM Sans', sans-serif", border: '1px solid rgba(17,16,16,0.16)', borderRadius: 8, padding: 'clamp(18px,3vw,28px)', background: 'rgba(17,16,16,0.02)' };
const label = { fontSize: 10.5, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(17,16,16,0.45)', marginBottom: 16 };
const desc = { fontSize: 14, lineHeight: 1.6, color: 'rgba(17,16,16,0.72)', marginBottom: 20 };
const card = { padding: '18px 16px', borderRadius: 8, border: '1px solid rgba(17,16,16,0.12)', background: '#fff' };

export default MessiStats;