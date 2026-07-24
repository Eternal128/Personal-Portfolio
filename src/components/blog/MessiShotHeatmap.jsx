import React, { useState, useMemo } from 'react';

function seeded(i) {
  const s = Math.sin(i * 12.9898) * 43758.5453;
  return s - Math.floor(s);
}

// Hotspots built from the published foot split and shot zone percentages for
// his 474 La Liga goals (83% left foot, 13% right foot, 4% headers, 68% from
// inside the box but outside the six yard box). Not literal shot by shot
// tracking data, just those percentages placed on a real pitch.
const CLUSTERS = [
  { cx: 104, cy: 26, rx: 7, ry: 8, foot: 'left', count: 16 },
  { cx: 106, cy: 34, rx: 6, ry: 6, foot: 'left', count: 12 },
  { cx: 105, cy: 46, rx: 6, ry: 7, foot: 'left', count: 10 },
  { cx: 91, cy: 34, rx: 8, ry: 9, foot: 'left', count: 12 },
  { cx: 109, cy: 44, rx: 4, ry: 5, foot: 'right', count: 3 },
  { cx: 117, cy: 40, rx: 3, ry: 6, foot: 'right', count: 5 },
  { cx: 116, cy: 38, rx: 2.5, ry: 5, foot: 'header', count: 2 },
];

const DEEP_HOTSPOT = { cx: 66, cy: 42, weight: 3.5, sx: 14, sy: 16 };

function buildShots() {
  const shots = [];
  let idx = 0;
  CLUSTERS.forEach((c) => {
    for (let k = 0; k < c.count; k++) {
      const ox = (seeded(idx * 2 + 1) * 2 - 1) * c.rx;
      const oy = (seeded(idx * 2 + 2) * 2 - 1) * c.ry;
      shots.push({
        x: Math.min(119, Math.max(61, c.cx + ox)),
        y: Math.min(78, Math.max(2, c.cy + oy)),
        foot: c.foot,
      });
      idx++;
    }
  });
  return shots;
}

const SHOTS = buildShots();

function buildHeatCells() {
  const cols = 24;
  const rows = 16;
  const cellW = 120 / cols;
  const cellH = 80 / rows;
  const hotspots = CLUSTERS.map((c) => ({
    cx: c.cx,
    cy: c.cy,
    weight: c.count,
    sx: c.rx * 1.4,
    sy: c.ry * 1.4,
  }));
  hotspots.push(DEEP_HOTSPOT);

  const cells = [];
  let max = 0;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cx = col * cellW + cellW / 2;
      const cy = row * cellH + cellH / 2;
      let v = 0;
      hotspots.forEach((h) => {
        const dx = cx - h.cx;
        const dy = cy - h.cy;
        v += h.weight * Math.exp(-((dx * dx) / (2 * h.sx * h.sx) + (dy * dy) / (2 * h.sy * h.sy)));
      });
      cells.push({ x: col * cellW, y: row * cellH, w: cellW, h: cellH, v });
      if (v > max) max = v;
    }
  }
  return cells.map((c) => ({ ...c, v: c.v / max }));
}

const HEAT_CELLS = buildHeatCells();

function heatColor(v) {
  const stops = [
    { t: 0, c: [201, 162, 74], a: 0 },
    { t: 0.25, c: [201, 162, 74], a: 0.16 },
    { t: 0.5, c: [201, 140, 62], a: 0.36 },
    { t: 0.75, c: [190, 90, 46], a: 0.58 },
    { t: 1, c: [176, 52, 34], a: 0.82 },
  ];
  let lo = stops[0];
  let hi = stops[stops.length - 1];
  for (let i = 0; i < stops.length - 1; i++) {
    if (v >= stops[i].t && v <= stops[i + 1].t) {
      lo = stops[i];
      hi = stops[i + 1];
      break;
    }
  }
  const span = hi.t - lo.t || 1;
  const f = (v - lo.t) / span;
  const r = lo.c[0] + (hi.c[0] - lo.c[0]) * f;
  const g = lo.c[1] + (hi.c[1] - lo.c[1]) * f;
  const b = lo.c[2] + (hi.c[2] - lo.c[2]) * f;
  const a = lo.a + (hi.a - lo.a) * f;
  return `rgba(${r.toFixed(0)},${g.toFixed(0)},${b.toFixed(0)},${a.toFixed(2)})`;
}

const Pitch = ({ children }) => (
  <svg viewBox="0 0 120 80" width="100%" style={{ display: 'block', background: '#f4f1ea', borderRadius: 6 }}>
    <rect x={0.4} y={0.4} width={119.2} height={79.2} fill="none" stroke="rgba(17,16,16,0.35)" strokeWidth={0.4} />
    <line x1={60} y1={0.4} x2={60} y2={79.6} stroke="rgba(17,16,16,0.35)" strokeWidth={0.4} />
    <circle cx={60} cy={40} r={10.5} fill="none" stroke="rgba(17,16,16,0.35)" strokeWidth={0.4} />
    <circle cx={60} cy={40} r={0.5} fill="rgba(17,16,16,0.35)" />

    <rect x={0.4} y={16.3} width={18.5} height={47.4} fill="none" stroke="rgba(17,16,16,0.35)" strokeWidth={0.4} />
    <rect x={0.4} y={29.2} width={6.3} height={21.6} fill="none" stroke="rgba(17,16,16,0.35)" strokeWidth={0.4} />
    <circle cx={12.6} cy={40} r={0.5} fill="rgba(17,16,16,0.35)" />
    <path d="M 18.9 31.6 A 10.5 10.5 0 0 0 18.9 48.4" fill="none" stroke="rgba(17,16,16,0.35)" strokeWidth={0.4} />
    <rect x={-2} y={35.7} width={2.4} height={8.6} fill="none" stroke="rgba(17,16,16,0.5)" strokeWidth={0.5} />

    <rect x={101.1} y={16.3} width={18.5} height={47.4} fill="none" stroke="rgba(17,16,16,0.35)" strokeWidth={0.4} />
    <rect x={113.3} y={29.2} width={6.3} height={21.6} fill="none" stroke="rgba(17,16,16,0.35)" strokeWidth={0.4} />
    <circle cx={107.4} cy={40} r={0.5} fill="rgba(17,16,16,0.35)" />
    <path d="M 101.1 31.6 A 10.5 10.5 0 0 1 101.1 48.4" fill="none" stroke="rgba(17,16,16,0.35)" strokeWidth={0.4} />
    <rect x={119.6} y={35.7} width={2.4} height={8.6} fill="none" stroke="rgba(17,16,16,0.5)" strokeWidth={0.5} />

    <path d="M 0.4 1.5 A 1.1 1.1 0 0 0 1.5 0.4" fill="none" stroke="rgba(17,16,16,0.35)" strokeWidth={0.4} />
    <path d="M 118.5 0.4 A 1.1 1.1 0 0 0 119.6 1.5" fill="none" stroke="rgba(17,16,16,0.35)" strokeWidth={0.4} />
    <path d="M 0.4 78.5 A 1.1 1.1 0 0 1 1.5 79.6" fill="none" stroke="rgba(17,16,16,0.35)" strokeWidth={0.4} />
    <path d="M 119.6 78.5 A 1.1 1.1 0 0 1 118.5 79.6" fill="none" stroke="rgba(17,16,16,0.35)" strokeWidth={0.4} />

    {children}
  </svg>
);

const ShotDot = ({ shot }) => {
  if (shot.foot === 'header') {
    return (
      <rect
        x={shot.x - 1}
        y={shot.y - 1}
        width={2}
        height={2}
        transform={`rotate(45 ${shot.x} ${shot.y})`}
        fill="none"
        stroke="rgba(17,16,16,0.7)"
        strokeWidth={0.35}
      />
    );
  }
  const fill = shot.foot === 'left' ? '#c9a24a' : '#111010';
  return <circle cx={shot.x} cy={shot.y} r={1.15} fill={fill} fillOpacity={0.82} />;
};

const MessiShotHeatmap = () => {
  const [view, setView] = useState('shots');
  const shots = useMemo(() => SHOTS, []);
  const cells = useMemo(() => HEAT_CELLS, []);

  return (
    <div style={panel}>
      <div className="bl-mono" style={label}>Interactive. Shot Zones and Heat Map</div>
      <p style={desc}>
        Built from the published foot split and shot zone breakdown of his 474 La Liga goals for
        Barcelona, placed on a real pitch. It is a percentage based illustration, not literal
        shot by shot tracking data.
      </p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button onClick={() => setView('shots')} style={view === 'shots' ? primaryBtn : ghostBtn}>
          Shot map
        </button>
        <button onClick={() => setView('heat')} style={view === 'heat' ? primaryBtn : ghostBtn}>
          Heat map
        </button>
      </div>

      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <Pitch>
          {view === 'heat'
            ? cells.map((c, i) => (
                <rect key={i} x={c.x} y={c.y} width={c.w} height={c.h} fill={heatColor(c.v)} />
              ))
            : shots.map((s, i) => <ShotDot key={i} shot={s} />)}
        </Pitch>
      </div>

      {view === 'shots' ? (
        <div style={legendRow}>
          <LegendItem color="#c9a24a" label="Left foot, 83%" />
          <LegendItem color="#111010" label="Right foot, 13%" />
          <LegendItem diamond label="Header, 4%" />
        </div>
      ) : (
        <div style={legendRow}>
          <span style={{ fontSize: 11.5, color: 'rgba(17,16,16,0.5)' }}>Cold</span>
          <div style={heatBar} />
          <span style={{ fontSize: 11.5, color: 'rgba(17,16,16,0.5)' }}>Hot, right half-space and box</span>
        </div>
      )}
    </div>
  );
};

const LegendItem = ({ color, diamond, label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
    {diamond ? (
      <div style={{ width: 8, height: 8, transform: 'rotate(45deg)', border: '1px solid rgba(17,16,16,0.7)' }} />
    ) : (
      <div style={{ width: 9, height: 9, borderRadius: '50%', background: color }} />
    )}
    <span style={{ fontSize: 11.5, color: 'rgba(17,16,16,0.6)' }}>{label}</span>
  </div>
);

const panel = { margin: 'clamp(48px,8vh,90px) 0', fontFamily: "'DM Sans', sans-serif", border: '1px solid rgba(17,16,16,0.16)', borderRadius: 8, padding: 'clamp(18px,3vw,28px)', background: 'rgba(17,16,16,0.02)' };
const label = { fontSize: 10.5, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(17,16,16,0.45)', marginBottom: 16 };
const desc = { fontSize: 14, lineHeight: 1.6, color: 'rgba(17,16,16,0.72)', marginBottom: 20, maxWidth: 640 };
const primaryBtn = { padding: '9px 16px', borderRadius: 100, cursor: 'pointer', border: '1px solid #111010', background: '#111010', color: '#e9e5dc', fontFamily: "'DM Sans',sans-serif", fontSize: 12.5, fontWeight: 500 };
const ghostBtn = { padding: '9px 16px', borderRadius: 100, cursor: 'pointer', border: '1px solid rgba(17,16,16,0.25)', background: 'transparent', color: '#111010', fontFamily: "'DM Sans',sans-serif", fontSize: 12.5 };
const legendRow = { display: 'flex', alignItems: 'center', gap: 18, marginTop: 18, flexWrap: 'wrap' };
const heatBar = { width: 120, height: 8, borderRadius: 4, background: 'linear-gradient(90deg, rgba(201,162,74,0.1), rgba(201,162,74,0.5), rgba(190,90,46,0.7), rgba(176,52,34,0.9))' };

export default MessiShotHeatmap;
