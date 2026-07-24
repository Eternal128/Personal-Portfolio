import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';

// ── Your real Jakarta edge data (node_a, node_b, distance_km) ──
const EDGES = [
  ['A','C',7.8],['A','B',7.3],['B','AT',5.3],['AT','AL',6.1],['AT','AK',8],
  ['AL','AK',5.9],['AL','AM',4.5],['AM','AN',4.6],['AN','AO',3.7],['AN','AQ',5.4],
  ['AN','AS',7.5],['AS','AR',15],['AQ','AR',5.3],['AR','AP',7.6],['AP','Z',5.2],
  ['AR','Z',3.9],['AP','Y',8.2],['AP','AH',6.7],['Z','X',6.1],['Z','W',14],
  ['W','V',2.4],['X','Y',1.6],['Y','V',6.4],['V','T',3.8],['V','U',7.8],
  ['U','T',10],['U','S',4.5],['U','AA',1.4],['Y','AA',6.7],['Y','AH',3.3],
  ['AI','AH',1.7],['AI','AG',6.5],['AG','AA',4.8],['AH','AA',8.4],['AK','AI',7.2],
  ['AK','AP',6.6],['AJ','AI',6.1],['AJ','AE',5.7],['AE','AF',0.7],['AF','AG',4.7],
  ['AD','AA',5.5],['AD','AC',3.3],['AC','AB',1.5],['M','AC',6.3],['M','AB',7.1],
  ['M','N',4.4],['N','S',3.9],['O','N',5.2],['O','AB',7.3],['O','P',5.5],
  ['N','P',4.2],['P','Q',4.6],['Q','R',4.4],['Q','S',6.9],['R','T',5.3],
  ['T','V',3.8],['K','O',9.6],['J','K',3.6],['I','J',6.5],['I','L',4.6],
  ['L','M',5.1],['H','L',7.4],['H','AC',6.3],['H','F',7.0],['F','E',5.8],
  ['F','D',4.5],['C','D',4.8],['D','E',3.7],['B','E',10.0],['D','F',4.5],
  ['C','G',5.2],['G','H',7.7],['H','I',8.5],['J','L',9.6],['F','H',7.0],
  ['E','F',5.8],['AL','AJ',12.0],['E','AJ',5.1],['F','AD',5.5],['AD','AE',3.6],
  ['AS','AQ',8.4],['J','Q',16.0],
];

const NODES = Array.from(new Set(EDGES.flatMap((e) => [e[0], e[1]]))).sort();

// Build adjacency
function buildAdj() {
  const adj = new Map(NODES.map((n) => [n, []]));
  for (const [a, b, w] of EDGES) {
    adj.get(a).push([b, w]);
    adj.get(b).push([a, w]);
  }
  return adj;
}

// ── Dijkstra from a source; returns prev map for path reconstruction ──
function dijkstra(adj, src) {
  const dist = new Map(NODES.map((n) => [n, Infinity]));
  const prev = new Map();
  dist.set(src, 0);
  const visited = new Set();
  const order = []; // for animation
  while (visited.size < NODES.length) {
    let u = null, best = Infinity;
    for (const n of NODES) if (!visited.has(n) && dist.get(n) < best) { best = dist.get(n); u = n; }
    if (u == null) break;
    visited.add(u);
    order.push(u);
    for (const [v, w] of adj.get(u)) {
      if (dist.get(u) + w < dist.get(v)) { dist.set(v, dist.get(u) + w); prev.set(v, u); }
    }
  }
  return { dist, prev, order };
}

function pathTo(prev, src, target) {
  const path = [];
  let cur = target;
  while (cur != null && cur !== src) { path.push(cur); cur = prev.get(cur); }
  if (cur === src) path.push(src);
  return path.reverse();
}

// ── Kruskal MST with union-find; returns MST edge set + build order ──
function kruskal() {
  const parent = new Map(NODES.map((n) => [n, n]));
  const find = (x) => { while (parent.get(x) !== x) { parent.set(x, parent.get(parent.get(x))); x = parent.get(x); } return x; };
  const union = (a, b) => { parent.set(find(a), find(b)); };
  const sorted = [...EDGES].sort((p, q) => p[2] - q[2]);
  const mst = [];
  for (const [a, b, w] of sorted) {
    if (find(a) !== find(b)) { union(a, b); mst.push([a, b, w]); }
  }
  return mst;
}

// ── Deterministic force-ish layout so it looks like a map network ──
function layout(width, height) {
  const pos = new Map();
  // seed on a circle, then relax with edge springs
  NODES.forEach((n, i) => {
    const a = (i / NODES.length) * Math.PI * 2;
    pos.set(n, { x: width / 2 + Math.cos(a) * width * 0.34, y: height / 2 + Math.sin(a) * height * 0.36 });
  });
  for (let iter = 0; iter < 220; iter++) {
    const force = new Map(NODES.map((n) => [n, { x: 0, y: 0 }]));
    // repulsion
    for (let i = 0; i < NODES.length; i++) {
      for (let j = i + 1; j < NODES.length; j++) {
        const pa = pos.get(NODES[i]), pb = pos.get(NODES[j]);
        let dx = pa.x - pb.x, dy = pa.y - pb.y;
        let d2 = dx * dx + dy * dy || 0.01;
        const rep = 2400 / d2;
        const d = Math.sqrt(d2);
        force.get(NODES[i]).x += (dx / d) * rep;
        force.get(NODES[i]).y += (dy / d) * rep;
        force.get(NODES[j]).x -= (dx / d) * rep;
        force.get(NODES[j]).y -= (dy / d) * rep;
      }
    }
    // spring on edges
    for (const [a, b] of EDGES) {
      const pa = pos.get(a), pb = pos.get(b);
      let dx = pb.x - pa.x, dy = pb.y - pa.y;
      const d = Math.sqrt(dx * dx + dy * dy) || 0.01;
      const spring = (d - 70) * 0.02;
      force.get(a).x += (dx / d) * spring;
      force.get(a).y += (dy / d) * spring;
      force.get(b).x -= (dx / d) * spring;
      force.get(b).y -= (dy / d) * spring;
    }
    for (const n of NODES) {
      const p = pos.get(n), f = force.get(n);
      p.x = Math.max(24, Math.min(width - 24, p.x + Math.max(-6, Math.min(6, f.x))));
      p.y = Math.max(24, Math.min(height - 24, p.y + Math.max(-6, Math.min(6, f.y))));
    }
  }
  return pos;
}

const W = 640, H = 460;

const JakartaGraph = () => {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const adj = useMemo(buildAdj, []);
  const pos = useMemo(() => layout(W, H), []);
  const mstEdges = useMemo(kruskal, []);

  const [mode, setMode] = useState('dijkstra'); // 'dijkstra' | 'kruskal'
  const [src, setSrc] = useState('AE');
  const [target, setTarget] = useState('T');
  const [visited, setVisited] = useState(new Set());
  const [pathEdges, setPathEdges] = useState(new Set());
  const [mstShown, setMstShown] = useState(0);
  const [dist, setDist] = useState(null);

  const edgeKey = (a, b) => [a, b].sort().join('-');

  const draw = useCallback(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#f3f0e8';
    ctx.fillRect(0, 0, W, H);

    const mstSet = new Set(mstEdges.slice(0, mstShown).map(([a, b]) => edgeKey(a, b)));

    // edges
    for (const [a, b] of EDGES) {
      const pa = pos.get(a), pb = pos.get(b);
      const k = edgeKey(a, b);
      let color = 'rgba(17,16,16,0.12)', width = 1;
      if (mode === 'kruskal' && mstSet.has(k)) { color = '#c9a24a'; width = 2.6; }
      if (mode === 'dijkstra' && pathEdges.has(k)) { color = '#c9a24a'; width = 3; }
      ctx.strokeStyle = color; ctx.lineWidth = width;
      ctx.beginPath(); ctx.moveTo(pa.x, pa.y); ctx.lineTo(pb.x, pb.y); ctx.stroke();
    }

    // nodes
    for (const n of NODES) {
      const p = pos.get(n);
      const isVisited = mode === 'dijkstra' && visited.has(n);
      const isSrc = n === src, isTgt = n === target;
      ctx.beginPath();
      ctx.arc(p.x, p.y, isSrc || isTgt ? 9 : 6, 0, Math.PI * 2);
      if (isSrc) ctx.fillStyle = '#111010';
      else if (isTgt && mode === 'dijkstra') ctx.fillStyle = '#b4432f';
      else if (isVisited) ctx.fillStyle = '#c9a24a';
      else ctx.fillStyle = '#e9e5dc';
      ctx.fill();
      ctx.lineWidth = 1.5; ctx.strokeStyle = 'rgba(17,16,16,0.5)'; ctx.stroke();

      ctx.fillStyle = 'rgba(17,16,16,0.6)';
      ctx.font = '9px monospace';
      ctx.fillText(n, p.x + 8, p.y - 8);
    }
  }, [pos, mstEdges, mstShown, mode, visited, pathEdges, src, target]);

  useEffect(() => { draw(); }, [draw]);

  const reset = () => {
    cancelAnimationFrame(rafRef.current);
    setVisited(new Set()); setPathEdges(new Set()); setMstShown(0); setDist(null);
  };

  // Animate Dijkstra, reveal visited order, then highlight the path to target
  const runDijkstra = () => {
    reset();
    setMode('dijkstra');
    const { dist: d, prev, order } = dijkstra(adj, src);
    let i = 0;
    const stepVisit = () => {
      i++;
      setVisited(new Set(order.slice(0, i)));
      if (i < order.length) {
        rafRef.current = setTimeout(stepVisit, 90);
      } else {
        // draw final path
        const path = pathTo(prev, src, target);
        const pe = new Set();
        for (let k = 0; k < path.length - 1; k++) pe.add(edgeKey(path[k], path[k + 1]));
        setPathEdges(pe);
        setDist(d.get(target));
      }
    };
    stepVisit();
  };

  // Animate Kruskal, add MST edges one by one, cheapest first
  const runKruskal = () => {
    reset();
    setMode('kruskal');
    let i = 0;
    const step = () => {
      i++;
      setMstShown(i);
      if (i < mstEdges.length) rafRef.current = setTimeout(step, 140);
    };
    step();
  };

  const mstTotal = mstEdges.reduce((s, [, , w]) => s + w, 0).toFixed(1);

  return (
    <div style={panel}>
      <div className="bl-mono" style={label}>Interactive. Jakarta Road Network</div>
      <p style={desc}>
        This is the actual 46 node graph I built for Jakarta. Pick a mode and watch it run.
        Dijkstra spreads out from a source node and locks in the shortest path to your target.
        Kruskal builds the minimum spanning tree, adding the cheapest road at a time without making a loop.
      </p>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14, alignItems: 'center' }}>
        <button onClick={() => setMode('dijkstra')} style={tab(mode === 'dijkstra')}>Dijkstra</button>
        <button onClick={() => setMode('kruskal')} style={tab(mode === 'kruskal')}>Kruskal (MST)</button>

        {mode === 'dijkstra' && (
          <>
            <Select label="from" value={src} onChange={setSrc} />
            <Select label="to" value={target} onChange={setTarget} />
            <button onClick={runDijkstra} style={primaryBtn}>▶ Run Dijkstra</button>
          </>
        )}
        {mode === 'kruskal' && (
          <button onClick={runKruskal} style={primaryBtn}>▶ Build MST</button>
        )}
        <button onClick={reset} style={ghostBtn}>Reset</button>
      </div>

      <canvas ref={canvasRef} width={W} height={H}
        style={{ width: '100%', maxWidth: W, borderRadius: 6, border: '1px solid rgba(17,16,16,0.14)', display: 'block' }} />

      <div className="bl-mono" style={{ marginTop: 14, fontSize: 12.5, color: 'rgba(17,16,16,0.65)', display: 'flex', gap: 22, flexWrap: 'wrap' }}>
        {mode === 'dijkstra' && dist != null && <span>shortest {src} → {target}: <b style={{ color: '#111010' }}>{dist.toFixed(1)} km</b></span>}
        {mode === 'dijkstra' && <span>visited {visited.size}/{NODES.length}</span>}
        {mode === 'kruskal' && <span>MST edges {mstShown}/{mstEdges.length}</span>}
        {mode === 'kruskal' && <span>total tree weight: <b style={{ color: '#111010' }}>{mstTotal} km</b></span>}
      </div>
    </div>
  );
};

const Select = ({ label, value, onChange }) => (
  <label className="bl-mono" style={{ fontSize: 12, color: 'rgba(17,16,16,0.6)', display: 'flex', alignItems: 'center', gap: 6 }}>
    {label}
    <select value={value} onChange={(e) => onChange(e.target.value)}
      style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, padding: '6px 8px', borderRadius: 6, border: '1px solid rgba(17,16,16,0.2)', background: '#fff', color: '#111010' }}>
      {NODES.map((n) => <option key={n} value={n}>{n}</option>)}
    </select>
  </label>
);

const panel = { margin: 'clamp(48px,8vh,90px) 0', fontFamily: "'DM Sans', sans-serif", border: '1px solid rgba(17,16,16,0.16)', borderRadius: 8, padding: 'clamp(18px,3vw,28px)', background: 'rgba(17,16,16,0.02)' };
const label = { fontSize: 10.5, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(17,16,16,0.45)', marginBottom: 16 };
const desc = { fontSize: 14, lineHeight: 1.6, color: 'rgba(17,16,16,0.72)', marginBottom: 20 };
const primaryBtn = { padding: '9px 16px', borderRadius: 100, cursor: 'pointer', border: '1px solid #111010', background: '#111010', color: '#e9e5dc', fontFamily: "'DM Sans',sans-serif", fontSize: 12.5, fontWeight: 500 };
const ghostBtn = { padding: '9px 15px', borderRadius: 100, cursor: 'pointer', border: '1px solid rgba(17,16,16,0.25)', background: 'transparent', color: '#111010', fontFamily: "'DM Sans',sans-serif", fontSize: 12.5 };
const tab = (active) => ({ padding: '8px 15px', borderRadius: 100, cursor: 'pointer', border: active ? '1px solid #111010' : '1px solid rgba(17,16,16,0.22)', background: active ? 'rgba(17,16,16,0.06)' : 'transparent', color: '#111010', fontFamily: "'DM Sans',sans-serif", fontSize: 12.5, fontWeight: active ? 500 : 400 });

export default JakartaGraph;