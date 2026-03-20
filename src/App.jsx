import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";

import {
  About, Experience, Feedbacks, Hero,
  Navbar, Tech, Works, StarsCanvas, End, CustomCursor,
} from './components';
import FlightPath from './components/FlightPath';
import { useSoundFX } from './hooks/useSoundFX';

// ── Detect what kind of clickable was hit ──────────────────────
const findClickable = (el, depth = 7) => {
  let cur = el;
  for (let i = 0; i < depth; i++) {
    if (!cur) break;
    const tag = cur.tagName?.toLowerCase();
    if (['a', 'button'].includes(tag)) return 'nav';
    if (cur.getAttribute?.('role') === 'button') return 'nav';
    if (cur.getAttribute?.('data-pill') === 'true') return 'tick';
    if (cur.getAttribute?.('data-gallery') === 'true') return 'nav';
    if (cur.onclick) return 'nav';
    if (window.getComputedStyle(cur).cursor === 'pointer') return 'nav';
    cur = cur.parentElement;
  }
  return null;
};

const App = () => {
  const { navThud, tick } = useSoundFX();

  // Lenis smooth scroll
  useEffect(() => {
    if (typeof window === 'undefined') return;
    let lenis;
    import('lenis').then(({ default: Lenis }) => {
      lenis = new Lenis({
        duration: 1.4,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
      });
      function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
      requestAnimationFrame(raf);
    }).catch(() => {});
    return () => { if (lenis) lenis.destroy(); };
  }, []);

  // Global click sound
  useEffect(() => {
    const handleClick = (e) => {
      const type = findClickable(e.target);
      if (type === 'nav')  navThud();
      if (type === 'tick') tick();
    };
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [navThud, tick]);

  return (
    <BrowserRouter>
      <CustomCursor />

      {/* Fixed star background */}
      <div className="fixed inset-0 z-0" style={{ background: '#000' }}>
        <StarsCanvas />
      </div>

      {/* Grain overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-[1]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          opacity: 0.035,
          mixBlendMode: 'overlay',
        }}
      />

      {/* Main scrollable container */}
      <div id="main-container" className="relative z-10" style={{ background: 'transparent' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
          <FlightPath />
        </div>
        <Navbar />
        <Hero />
        <About />
        <Experience />
        <Tech />
        <Works />
        <Feedbacks />
        <End />
      </div>
    </BrowserRouter>
  );
};

export default App;