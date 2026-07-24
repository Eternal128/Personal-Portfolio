import React, { useRef, useState, useEffect, useCallback } from 'react';

// ── Tiny 2-layer neural net (no libraries) ──────────────────
// input [x, y] to hidden (tanh) to output (sigmoid)
const HIDDEN = 8;
const LR = 0.08;

const randW = (n, m) => Array.from({ length: n }, () =>
  Array.from({ length: m }, () => (Math.random() * 2 - 1) * 0.8));
const randB = (n) => Array.from({ length: n }, () => 0);

const tanh = (x) => Math.tanh(x);
const dtanh = (y) => 1 - y * y;
const sig = (x) => 1 / (1 + Math.exp(-x));

function makeNet() {
  return { W1: randW(HIDDEN, 2), b1: randB(HIDDEN), W2: randW(1, HIDDEN), b2: randB(1) };
}

function forward(net, x) {
  const h = net.W1.map((w, i) => tanh(w[0] * x[0] + w[1] * x[1] + net.b1[i]));
  const o = sig(net.W2[0].reduce((s, w, i) => s + w * h[i], 0) + net.b2[0]);
  return { h, o };
}

function train(net, data) {
  for (const { x, label } of data) {
    const { h, o } = forward(net, x);
    const dO = o - label; // BCE + sigmoid derivative
    for (let i = 0; i < HIDDEN; i++) {
      const gradW2 = dO * h[i];
      const dH = dO * net.W2[0][i] * dtanh(h[i]);
      net.W1[i][0] -= LR * dH * x[0];
      net.W1[i][1] -= LR * dH * x[1];
      net.b1[i]    -= LR * dH;
      net.W2[0][i] -= LR * gradW2;
    }
    net.b2[0] -= LR * dO;
  }
}

const SIZE = 340;
const toModel = (px) => (px / SIZE) * 2 - 1; // pixel → [-1,1]

const NeuralPlayground = () => {
  const canvasRef = useRef(null);
  const netRef = useRef(makeNet());
  const rafRef = useRef(null);
  const [data, setData] = useState([]);
  const [running, setRunning] = useState(false);
  const [brush, setBrush] = useState(1);
  const [epoch, setEpoch] = useState(0);
  const [acc, setAcc] = useState(0);

  const draw = useCallback(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const net = netRef.current;
    const step = 8;
    for (let py = 0; py < SIZE; py += step) {
      for (let px = 0; px < SIZE; px += step) {
        const { o } = forward(net, [toModel(px), toModel(py)]);
        const t = o;
        const r = Math.round(233 - t * 130);
        const g = Math.round(229 - t * 125);
        const b = Math.round(220 - t * 115);
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(px, py, step, step);
      }
    }
    for (const { x, label } of data) {
      const px = ((x[0] + 1) / 2) * SIZE;
      const py = ((x[1] + 1) / 2) * SIZE;
      ctx.beginPath();
      ctx.arc(px, py, 5, 0, Math.PI * 2);
      ctx.fillStyle = label === 1 ? '#111010' : '#c9a24a';
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = 'rgba(233,229,220,0.9)';
      ctx.stroke();
    }
  }, [data]);

  useEffect(() => {
    if (!running) { draw(); return; }
    const tick = () => {
      const net = netRef.current;
      for (let k = 0; k < 3; k++) train(net, data);
      setEpoch((e) => e + 3);
      if (data.length) {
        let correct = 0;
        for (const d of data) {
          const { o } = forward(net, d.x);
          if ((o >= 0.5 ? 1 : 0) === d.label) correct++;
        }
        setAcc(Math.round((correct / data.length) * 100));
      }
      draw();
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [running, data, draw]);

  useEffect(() => { draw(); }, [draw]);

  const addPoint = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * SIZE;
    const py = ((e.clientY - rect.top) / rect.height) * SIZE;
    setData((d) => [...d, { x: [toModel(px), toModel(py)], label: brush }]);
  };

  const reset = () => {
    netRef.current = makeNet();
    setData([]); setEpoch(0); setAcc(0); setRunning(false);
  };

  const seedXOR = () => {
    const pts = [];
    const blob = (cx, cy, label) => {
      for (let i = 0; i < 12; i++)
        pts.push({ x: [cx + (Math.random() - 0.5) * 0.5, cy + (Math.random() - 0.5) * 0.5], label });
    };
    blob(-0.5, -0.5, 1); blob(0.5, 0.5, 1); blob(-0.5, 0.5, 0); blob(0.5, -0.5, 0);
    netRef.current = makeNet();
    setData(pts); setEpoch(0); setAcc(0);
  };

  return (
    <div style={{ margin: 'clamp(48px,8vh,90px) 0', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{
        border: '1px solid rgba(17,16,16,0.16)', borderRadius: 8,
        padding: 'clamp(18px,3vw,28px)', background: 'rgba(17,16,16,0.02)',
      }}>
        <div className="bl-mono" style={{ fontSize: 10.5, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(17,16,16,0.45)', marginBottom: 16 }}>
          Interactive. Neural Net Playground
        </div>

        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <canvas
            ref={canvasRef}
            width={SIZE}
            height={SIZE}
            onClick={addPoint}
            style={{ width: SIZE, maxWidth: '100%', aspectRatio: '1', borderRadius: 6, cursor: 'crosshair', border: '1px solid rgba(17,16,16,0.14)' }}
          />

          <div style={{ flex: 1, minWidth: 220 }}>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: 'rgba(17,16,16,0.72)', marginBottom: 20 }}>
              Click the canvas to drop points, then hit <b>Train</b> and watch an 8-neuron network carve out a decision boundary in real time. Try the XOR preset, it’s the classic “a straight line can’t solve this” problem.
            </p>

            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
              {[{ l: 'Class A', v: 0, c: '#c9a24a' }, { l: 'Class B', v: 1, c: '#111010' }].map((b) => (
                <button key={b.v} onClick={() => setBrush(b.v)} style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 100, cursor: 'pointer',
                  border: brush === b.v ? '1px solid #111010' : '1px solid rgba(17,16,16,0.2)',
                  background: brush === b.v ? 'rgba(17,16,16,0.06)' : 'transparent',
                  fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: '#111010',
                }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: b.c }} />
                  {b.l}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button onClick={() => setRunning((r) => !r)} disabled={!data.length} style={primaryBtn(!data.length)}>
                {running ? '❚❚ Pause' : '▶ Train'}
              </button>
              <button onClick={seedXOR} style={ghostBtn}>XOR preset</button>
              <button onClick={reset} style={ghostBtn}>Reset</button>
            </div>

            <div className="bl-mono" style={{ marginTop: 20, fontSize: 12, color: 'rgba(17,16,16,0.6)', display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              <span>epoch {epoch}</span>
              <span>accuracy {acc}%</span>
              <span>points {data.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const primaryBtn = (disabled) => ({
  padding: '9px 18px', borderRadius: 100, cursor: disabled ? 'not-allowed' : 'pointer',
  border: '1px solid #111010', background: disabled ? 'rgba(17,16,16,0.08)' : '#111010',
  color: disabled ? 'rgba(17,16,16,0.4)' : '#e9e5dc', fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 500,
});
const ghostBtn = {
  padding: '9px 16px', borderRadius: 100, cursor: 'pointer',
  border: '1px solid rgba(17,16,16,0.25)', background: 'transparent',
  color: '#111010', fontFamily: "'DM Sans',sans-serif", fontSize: 12,
};

export default NeuralPlayground;