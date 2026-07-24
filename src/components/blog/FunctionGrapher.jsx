import React, { useRef, useState, useEffect, useCallback } from 'react';

// ── Tiny safe math expression parser (no eval) ──────────────
// Supports + - * / ^, parentheses, x, and functions like sin, cos, tan,
// sqrt, abs, exp, log, ln, pi, e. Returns a function f(x).
function compile(expr) {
  const tokens = tokenize(expr);
  let pos = 0;

  const peek = () => tokens[pos];
  const next = () => tokens[pos++];

  function parseExpr() {
    let node = parseTerm();
    while (peek() === '+' || peek() === '-') {
      const op = next();
      const rhs = parseTerm();
      const l = node, r = rhs;
      node = op === '+' ? (x) => l(x) + r(x) : (x) => l(x) - r(x);
    }
    return node;
  }
  function parseTerm() {
    let node = parseFactor();
    while (peek() === '*' || peek() === '/') {
      const op = next();
      const rhs = parseFactor();
      const l = node, r = rhs;
      node = op === '*' ? (x) => l(x) * r(x) : (x) => l(x) / r(x);
    }
    return node;
  }
  function parseFactor() {
    let base = parseUnary();
    if (peek() === '^') {
      next();
      const exp = parseFactor(); // right-assoc
      const b = base;
      return (x) => Math.pow(b(x), exp(x));
    }
    return base;
  }
  function parseUnary() {
    if (peek() === '-') { next(); const n = parseUnary(); return (x) => -n(x); }
    if (peek() === '+') { next(); return parseUnary(); }
    return parsePrimary();
  }
  function parsePrimary() {
    const t = peek();
    if (t === '(') {
      next();
      const node = parseExpr();
      if (next() !== ')') throw new Error('expected )');
      return node;
    }
    if (typeof t === 'string' && FUNCS[t]) {
      next();
      if (next() !== '(') throw new Error('expected ( after ' + t);
      const arg = parseExpr();
      if (next() !== ')') throw new Error('expected )');
      const fn = FUNCS[t];
      return (x) => fn(arg(x));
    }
    if (t === 'x') { next(); return (x) => x; }
    if (t === 'pi') { next(); return () => Math.PI; }
    if (t === 'e') { next(); return () => Math.E; }
    if (typeof t === 'number') { next(); return () => t; }
    throw new Error('unexpected token ' + t);
  }

  const fn = parseExpr();
  if (pos < tokens.length) throw new Error('unexpected trailing input');
  return fn;
}

const FUNCS = {
  sin: Math.sin, cos: Math.cos, tan: Math.tan,
  asin: Math.asin, acos: Math.acos, atan: Math.atan,
  sqrt: Math.sqrt, abs: Math.abs, exp: Math.exp,
  log: (v) => Math.log10 ? Math.log10(v) : Math.log(v) / Math.LN10,
  ln: Math.log, floor: Math.floor, ceil: Math.ceil,
};

function tokenize(s) {
  const out = [];
  let i = 0;
  s = s.replace(/\s+/g, '');
  while (i < s.length) {
    const c = s[i];
    if ('+-*/^()'.includes(c)) { out.push(c); i++; continue; }
    if (/[0-9.]/.test(c)) {
      let num = '';
      while (i < s.length && /[0-9.]/.test(s[i])) num += s[i++];
      out.push(parseFloat(num));
      continue;
    }
    if (/[a-z]/i.test(c)) {
      let word = '';
      while (i < s.length && /[a-z]/i.test(s[i])) word += s[i++].toLowerCase();
      out.push(word);
      continue;
    }
    throw new Error('bad char ' + c);
  }
  return out;
}

// ── Component ───────────────────────────────────────────────
const W = 420, H = 320;

const FunctionGrapher = () => {
  const canvasRef = useRef(null);
  const [expr, setExpr] = useState('sin(x) * x');
  const [error, setError] = useState('');
  const [scale, setScale] = useState(32); // px per unit

  const draw = useCallback(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const cx = W / 2, cy = H / 2;

    // bg
    ctx.fillStyle = '#f3f0e8';
    ctx.fillRect(0, 0, W, H);

    // grid
    ctx.strokeStyle = 'rgba(17,16,16,0.08)';
    ctx.lineWidth = 1;
    for (let gx = cx % scale; gx < W; gx += scale) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke(); }
    for (let gy = cy % scale; gy < H; gy += scale) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke(); }

    // axes
    ctx.strokeStyle = 'rgba(17,16,16,0.35)';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, H); ctx.stroke();

    // curve
    let fn;
    try {
      fn = compile(expr);
      setError('');
    } catch (e) {
      setError(e.message || 'invalid expression');
      return;
    }

    ctx.strokeStyle = '#c9a24a';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    let started = false, lastY = null;
    for (let px = 0; px <= W; px++) {
      const xVal = (px - cx) / scale;
      let yVal;
      try { yVal = fn(xVal); } catch { yVal = NaN; }
      if (!isFinite(yVal)) { started = false; continue; }
      const py = cy - yVal * scale;
      // break line on big jumps (asymptotes)
      if (started && lastY != null && Math.abs(py - lastY) > H) { started = false; }
      if (!started) { ctx.moveTo(px, py); started = true; }
      else ctx.lineTo(px, py);
      lastY = py;
    }
    ctx.stroke();
  }, [expr, scale]);

  useEffect(() => { draw(); }, [draw]);

  return (
    <div style={panel}>
      <div className="bl-mono" style={label}>Interactive. Equation Grapher</div>
      <p style={desc}>
        Type a function of <b>x</b> and it plots live. Try <code style={code}>sin(x) * x</code>,
        <code style={code}>x^2 - 3</code>, or <code style={code}>1 / x</code>. Supports sin, cos,
        tan, sqrt, abs, exp, ln, log, pi, e.
      </p>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 16 }}>
        <span className="bl-serif" style={{ fontSize: 18, color: '#111010' }}>y =</span>
        <input
          value={expr}
          onChange={(e) => setExpr(e.target.value)}
          spellCheck={false}
          style={{ ...input, borderColor: error ? '#b4432f' : 'rgba(17,16,16,0.2)' }}
        />
        <label className="bl-mono" style={{ fontSize: 12, color: 'rgba(17,16,16,0.6)', display: 'flex', alignItems: 'center', gap: 8 }}>
          zoom
          <input type="range" min="12" max="80" step="1" value={scale}
            onChange={(e) => setScale(parseInt(e.target.value))} style={{ accentColor: '#111010' }} />
        </label>
      </div>

      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        style={{ width: '100%', maxWidth: W, borderRadius: 6, border: '1px solid rgba(17,16,16,0.14)', display: 'block' }}
      />

      {error && (
        <div className="bl-mono" style={{ marginTop: 12, fontSize: 12, color: '#b4432f' }}>
          ⚠ {error}
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 16 }}>
        {['sin(x) * x', 'x^2 - 3', '1 / x', 'sin(x) + cos(2 * x)', 'sqrt(abs(x))'].map((ex) => (
          <button key={ex} onClick={() => setExpr(ex)} style={chip}>{ex}</button>
        ))}
      </div>
    </div>
  );
};

const panel = { margin: 'clamp(48px,8vh,90px) 0', fontFamily: "'DM Sans', sans-serif", border: '1px solid rgba(17,16,16,0.16)', borderRadius: 8, padding: 'clamp(18px,3vw,28px)', background: 'rgba(17,16,16,0.02)' };
const label = { fontSize: 10.5, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(17,16,16,0.45)', marginBottom: 16 };
const desc = { fontSize: 14, lineHeight: 1.6, color: 'rgba(17,16,16,0.72)', marginBottom: 20 };
const input = { flex: 1, minWidth: 200, padding: '10px 14px', borderRadius: 8, border: '1px solid rgba(17,16,16,0.2)', background: '#fff', fontFamily: "'DM Mono', monospace", fontSize: 14, color: '#111010', outline: 'none' };
const code = { fontFamily: "'DM Mono', monospace", fontSize: 13, background: 'rgba(17,16,16,0.06)', padding: '1px 6px', borderRadius: 4, margin: '0 3px' };
const chip = { padding: '7px 13px', borderRadius: 100, cursor: 'pointer', border: '1px solid rgba(17,16,16,0.22)', background: 'transparent', color: '#111010', fontFamily: "'DM Mono', monospace", fontSize: 12 };

export default FunctionGrapher;