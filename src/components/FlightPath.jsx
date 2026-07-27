import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

// ── Generate randomised curvy path ──────────────────────────────
function generatePath(width, height) {
  const segments = 12;
  const margin   = width * 0.08;
  const points   = [];

  // Seeded rand for stability
  let s = 137;
  const rand = () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const y = t * height;
    // Alternate left / right / centre zones
    let x;
    const zone = i % 3;
    if (zone === 0)      x = margin + rand() * width * 0.2;
    else if (zone === 1) x = width * 0.72 + rand() * width * 0.18;
    else                 x = width * 0.35 + rand() * width * 0.28;
    points.push({ x, y });
  }

  let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0  = points[i];
    const p1  = points[i + 1];
    const midY = ((p0.y + p1.y) / 2).toFixed(1);
    const cp1x = (p0.x + (rand() - 0.5) * width * 0.55).toFixed(1);
    const cp2x = (p1.x + (rand() - 0.5) * width * 0.55).toFixed(1);
    d += ` C ${cp1x} ${midY}, ${cp2x} ${midY}, ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`;
  }
  return d;
}

// ── Particle ─────────────────────────────────────────────────────
const Particle = React.memo(({ x, y, onDone }) => {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const angle = Math.random() * Math.PI * 2;
    const dist  = 6 + Math.random() * 12;
    gsap.fromTo(el,
      { opacity: 0.9, scale: 1, x: 0, y: 0 },
      {
        opacity: 0, scale: 0,
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        duration: 0.5 + Math.random() * 0.5,
        ease: 'power2.out',
        onComplete: onDone,
      }
    );
  }, [onDone]);

  return (
    <div ref={ref} style={{
      position: 'fixed',
      left: x, top: y,
      width: 3, height: 3,
      borderRadius: '50%',
      background: '#fff',
      boxShadow: '0 0 5px rgba(255,255,255,0.9)',
      pointerEvents: 'none',
      zIndex: 9,
      transform: 'translate(-50%,-50%)',
    }} />
  );
});

// ── Main ──────────────────────────────────────────────────────────
const FlightPath = () => {
  const rocketRef      = useRef(null);
  const wobbleTween    = useRef(null);
  const lastDir        = useRef(1);
  const lastProg       = useRef(0);

  const [particles, setParticles] = useState([]);
  const [dims, setDims]           = useState({ w: 0, h: 0 });

  const removeParticle = useCallback((id) => {
    setParticles(p => p.filter(x => x.id !== id));
  }, []);

  const spawnParticles = useCallback((sx, sy) => {
    setParticles(prev => [
      ...prev.slice(-20),
      ...Array.from({ length: 3 }, () => ({
        id: Math.random().toString(36).slice(2),
        x: sx, y: sy,
      })),
    ]);
  }, []);

  // Measure on mount + after fonts/images load
  useEffect(() => {
    const measure = () => {
      requestAnimationFrame(() => {
        setDims({
          w: window.innerWidth,
          h: document.body.scrollHeight,
        });
      });
    };
    measure();
    window.addEventListener('resize', measure);
    // Re-measure after everything settles
    const t = setTimeout(measure, 800);
    // Also re-measure whenever pinned sections elsewhere on the page insert or
    // resize their scroll spacers, since that changes document.body.scrollHeight
    // out from under this path.
    ScrollTrigger.addEventListener('refresh', measure);
    return () => {
      window.removeEventListener('resize', measure);
      clearTimeout(t);
      ScrollTrigger.removeEventListener('refresh', measure);
    };
  }, []);

  const pathD = useMemo(() => {
    if (!dims.w || !dims.h) return '';
    return generatePath(dims.w, dims.h);
  }, [dims.w, dims.h]);

  useEffect(() => {
    if (!rocketRef.current || !pathD || !dims.h) return;

    const rocket = rocketRef.current;

    // Kill previous
    ScrollTrigger.getAll()
      .filter(st => st.vars?.id === 'rocket-path')
      .forEach(st => st.kill());
    if (wobbleTween.current) wobbleTween.current.kill();

    // Reset
    gsap.set(rocket, { xPercent: -50, yPercent: -50 });

    // Subtle scale wobble so it breathes
    wobbleTween.current = gsap.to(rocket, {
      scaleX: 1.12,
      duration: 1.6,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });

    // Scroll-scrubbed motion along path
    gsap.to(rocket, {
      ease: 'none',
      motionPath: {
        path: '#rocket-svg-path',
        align: '#rocket-svg-path',
        autoRotate: true,
        alignOrigin: [0.5, 0.5],
      },
      scrollTrigger: {
        id: 'rocket-path',
        trigger: '#main-container',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.8,
        onUpdate(self) {
          const dir  = self.direction;
          const prog = self.progress;

          // Flip when reversing
          if (dir !== lastDir.current) {
            lastDir.current = dir;
            gsap.to(rocket, {
              scaleY: dir === 1 ? 1 : -1,
              duration: 0.3,
              ease: 'power2.inOut',
            });
          }

          // Particles while moving
          if (Math.abs(prog - lastProg.current) > 0.0003) {
            const rect = rocket.getBoundingClientRect();
            spawnParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);
          }
          lastProg.current = prog;
        },
      },
    });

    return () => {
      ScrollTrigger.getAll()
        .filter(st => st.vars?.id === 'rocket-path')
        .forEach(st => st.kill());
      if (wobbleTween.current) wobbleTween.current.kill();
    };
  }, [pathD, dims.h, spawnParticles]);

  if (!pathD) return null;

  return (
    <>
      {/* Particles render at fixed screen coords */}
      {particles.map(p => (
        <Particle key={p.id} x={p.x} y={p.y} onDone={() => removeParticle(p.id)} />
      ))}

      {/* SVG — invisible, only used as a motion path target for GSAP */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: 'absolute',
          top: 0, left: 0,
          width: dims.w,
          height: dims.h,
          overflow: 'visible',
          pointerEvents: 'none',
          zIndex: 0,
          opacity: 0,
        }}
        viewBox={`0 0 ${dims.w} ${dims.h}`}
      >
        <path
          id="rocket-svg-path"
          d={pathD}
          fill="none"
        />
      </svg>

      {/* Rocket — absolute, GSAP moves it */}
      <div
        ref={rocketRef}
        style={{
          position: 'absolute',
          top: 0, left: 0,
          zIndex: 1,
          pointerEvents: 'none',
          width: 22, height: 22,
          filter: 'drop-shadow(0 0 7px rgba(255,255,255,0.85)) drop-shadow(0 0 16px rgba(255,255,255,0.3))',
        }}
      >
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
          <path d="M12 2C12 2 7 7 7 13C7 16.31 9.69 19 13 19C13 19 13 21 12 22C13 22 16 20 16 19C16 19 17 18.5 17 17C17 16 16 15 16 15C16.5 14 17 13 17 13C17 7 12 2 12 2Z" fill="white" opacity="0.95" />
          <circle cx="12" cy="11" r="1.5" fill="#000" opacity="0.55" />
          <path d="M7 13C7 13 5 14 5 16C5 17 6 17 7 16.5L7 13Z" fill="white" opacity="0.7" />
          <path d="M17 13C17 13 19 14 19 16C19 17 18 17 17 16.5L17 13Z" fill="white" opacity="0.7" />
          <path d="M10.5 19C10.5 19 10 21 12 22C14 21 13.5 19 13.5 19" stroke="rgba(255,160,40,0.9)" strokeWidth="1.2" strokeLinecap="round" fill="rgba(255,120,20,0.4)" />
        </svg>
      </div>


    </>
  );
};

export default FlightPath;