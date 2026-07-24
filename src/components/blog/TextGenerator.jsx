import React, { useState, useMemo, useRef } from 'react';

// A small character-level generative model.
// Same principle as an LLM, learn P(next char given context), then sample with temperature.
const ORDER = 3; // context window (chars)

const CORPUS = `the model does not think. it predicts. every character is a guess conditioned on the ones before it. we call this generation but it is really just very confident autocomplete. temperature is how much risk it takes. low temperature is safe and repetitive. high temperature is chaos and surprise. somewhere in between is where it feels alive. i trained this on my own words so it sounds a little like me. it learns nothing about meaning only about what tends to follow what.`;

function buildModel(text, order) {
  const table = {};
  for (let i = 0; i < text.length - order; i++) {
    const ctx = text.slice(i, i + order);
    const next = text[i + order];
    (table[ctx] ||= {});
    table[ctx][next] = (table[ctx][next] || 0) + 1;
  }
  return table;
}

function sampleNext(dist, temperature) {
  const entries = Object.entries(dist);
  if (!entries.length) return null;
  // apply temperature to counts
  const weights = entries.map(([, c]) => Math.pow(c, 1 / Math.max(temperature, 0.01)));
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < entries.length; i++) {
    r -= weights[i];
    if (r <= 0) return entries[i][0];
  }
  return entries[entries.length - 1][0];
}

const TextGenerator = () => {
  const model = useMemo(() => buildModel(CORPUS, ORDER), []);
  const [seed, setSeed] = useState('the model');
  const [temp, setTemp] = useState(0.75);
  const [out, setOut] = useState('');
  const [busy, setBusy] = useState(false);
  const timer = useRef(null);

  const generate = () => {
    if (busy) return;
    setBusy(true);
    let text = (seed || 'the ').toLowerCase();
    let ctx = text.slice(-ORDER).padStart(ORDER, ' ');
    setOut(text);
    let count = 0;
    const MAX = 240;

    const stepChar = () => {
      const dist = model[ctx] || model[Object.keys(model)[0]];
      const ch = sampleNext(dist, temp);
      if (!ch || count >= MAX) { setBusy(false); return; }
      text += ch;
      ctx = text.slice(-ORDER);
      setOut(text);
      count++;
      timer.current = setTimeout(stepChar, 16); // typewriter feel
    };
    stepChar();
  };

  return (
    <div style={panel}>
      <div className="bl-mono" style={label}>Interactive. Generative Text Model</div>

      <p style={desc}>
        This is a real generative model, just a tiny one. It learned which characters tend to
        follow which, then it <b>samples</b> the next one over and over, exactly how a language
        model autocompletes. Give it a seed, set the temperature, and let it hallucinate.
      </p>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 16 }}>
        <input
          value={seed}
          onChange={(e) => setSeed(e.target.value)}
          placeholder="seed text…"
          style={input}
        />
        <label className="bl-mono" style={{ fontSize: 12, color: 'rgba(17,16,16,0.6)', display: 'flex', alignItems: 'center', gap: 8 }}>
          temp {temp.toFixed(2)}
          <input type="range" min="0.2" max="1.4" step="0.01" value={temp}
            onChange={(e) => setTemp(parseFloat(e.target.value))} style={{ accentColor: '#111010' }} />
        </label>
        <button onClick={generate} disabled={busy} style={primaryBtn(busy)}>
          {busy ? 'Generating…' : 'Generate ▸'}
        </button>
      </div>

      <div style={{
        minHeight: 120, borderRadius: 6, border: '1px solid rgba(17,16,16,0.14)',
        background: 'rgba(17,16,16,0.02)', padding: '16px 18px',
        fontSize: 15, lineHeight: 1.7, color: 'rgba(17,16,16,0.85)',
        whiteSpace: 'pre-wrap',
      }}>
        {out || <span style={{ color: 'rgba(17,16,16,0.3)' }}>output appears here…</span>}
        {busy && <span style={{ opacity: 0.5 }}>▋</span>}
      </div>
    </div>
  );
};

const panel = { margin: 'clamp(48px,8vh,90px) 0', fontFamily: "'DM Sans', sans-serif", border: '1px solid rgba(17,16,16,0.16)', borderRadius: 8, padding: 'clamp(18px,3vw,28px)', background: 'rgba(17,16,16,0.02)' };
const label = { fontSize: 10.5, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(17,16,16,0.45)', marginBottom: 16 };
const desc = { fontSize: 14, lineHeight: 1.6, color: 'rgba(17,16,16,0.72)', marginBottom: 20 };
const input = { flex: 1, minWidth: 200, padding: '10px 14px', borderRadius: 100, border: '1px solid rgba(17,16,16,0.2)', background: 'transparent', fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: '#111010', outline: 'none' };
const primaryBtn = (disabled) => ({ padding: '10px 20px', borderRadius: 100, cursor: disabled ? 'not-allowed' : 'pointer', border: '1px solid #111010', background: disabled ? 'rgba(17,16,16,0.08)' : '#111010', color: disabled ? 'rgba(17,16,16,0.4)' : '#e9e5dc', fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 500 });

export default TextGenerator;