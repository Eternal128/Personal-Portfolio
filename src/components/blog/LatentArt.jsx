import React, { useRef, useEffect, useState, useCallback } from 'react';

// Generative image model: random latent vector → small neural net → RGB per pixel.
// This is the "sample z → decode to image" idea behind generative image models, in miniature.
const SIZE = 300;
const LATENT = 6;

const randVec = (n) => Array.from({ length: n }, () => Math.random() * 2 - 1);
const randMat = (r, c) => Array.from({ length: r }, () => randVec(c));
const tanh = Math.tanh;

function makeDecoder() {
  return {
    l1: randMat(12, LATENT + 4), // +4 = x, y, r, angle features
    l2: randMat(12, 12),
    out: randMat(3, 12),
  };
}
const fwd = (mat, v) => mat.map((row) => tanh(row.reduce((s, w, i) => s + w * v[i], 0)));

const LatentArt = () => {
  const canvasRef = useRef(null);
  const decoderRef = useRef(makeDecoder());
  const [z, setZ] = useState(randVec(LATENT));

  const render = useCallback((latent) => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const img = ctx.createImageData(SIZE, SIZE);
    const dec = decoderRef.current;
    for (let y = 0; y < SIZE; y++) {
      for (let x = 0; x < SIZE; x++) {
        const nx = (x / SIZE) * 2 - 1;
        const ny = (y / SIZE) * 2 - 1;
        const r = Math.sqrt(nx * nx + ny * ny);
        const a = Math.atan2(ny, nx);
        const input = [...latent, nx, ny, r, a];
        const h1 = fwd(dec.l1, input);
        const h2 = fwd(dec.l2, h1);
        const rgb = fwd(dec.out, h2);
        const idx = (y * SIZE + x) * 4;
        img.data[idx]     = Math.floor((rgb[0] + 1) * 127.5);
        img.data[idx + 1] = Math.floor((rgb[1] + 1) * 127.5);
        img.data[idx + 2] = Math.floor((rgb[2] + 1) * 127.5);
        img.data[idx + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
  }, []);

  useEffect(() => { render(z); }, [z, render]);

  const resample = () => setZ(randVec(LATENT));
  const newModel = () => { decoderRef.current = makeDecoder(); setZ(randVec(LATENT)); };

  return (
    <div style={panel}>
      <div className="bl-mono" style={label}>Interactive — Generative Image Model</div>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <canvas ref={canvasRef} width={SIZE} height={SIZE}
          style={{ width: SIZE, maxWidth: '100%', borderRadius: 6, border: '1px solid rgba(17,16,16,0.14)' }} />
        <div style={{ flex: 1, minWidth: 220 }}>
          <p style={desc}>
            Every image here is generated from scratch, no photos involved. A random <b>latent
            vector</b> gets decoded through a small neural net into a color for every pixel. It’s the
            same “sample a point in latent space, decode it into an image” idea behind generative art
            models — just small enough to run instantly in your browser.
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button onClick={resample} style={primaryBtn(false)}>New latent ▸</button>
            <button onClick={newModel} style={ghostBtn}>New model</button>
          </div>
          <div className="bl-mono" style={{ marginTop: 18, fontSize: 12, color: 'rgba(17,16,16,0.55)' }}>
            latent dims: {LATENT} · decoded live
          </div>
        </div>
      </div>
    </div>
  );
};

const panel = { margin: 'clamp(48px,8vh,90px) 0', fontFamily: "'DM Sans', sans-serif", border: '1px solid rgba(17,16,16,0.16)', borderRadius: 8, padding: 'clamp(18px,3vw,28px)', background: 'rgba(17,16,16,0.02)' };
const label = { fontSize: 10.5, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(17,16,16,0.45)', marginBottom: 16 };
const desc = { fontSize: 14, lineHeight: 1.6, color: 'rgba(17,16,16,0.72)', marginBottom: 20 };
const primaryBtn = () => ({ padding: '10px 20px', borderRadius: 100, cursor: 'pointer', border: '1px solid #111010', background: '#111010', color: '#e9e5dc', fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 500 });
const ghostBtn = { padding: '10px 18px', borderRadius: 100, cursor: 'pointer', border: '1px solid rgba(17,16,16,0.25)', background: 'transparent', color: '#111010', fontFamily: "'DM Sans',sans-serif", fontSize: 13 };

export default LatentArt;