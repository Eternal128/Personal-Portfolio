import { useEffect, useRef, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import { SoundProvider } from "./context/SoundContext";
import {
  About, Experience, Feedbacks, Hero,
  Navbar, Tech, Works, StarsCanvas, End, CustomCursor, Loader,
} from './components';
import BlogSection from './components/BlogSection';
import Blog from './components/Blog';
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
  const [loading, setLoading] = useState(true);
  const [blogOpen, setBlogOpen] = useState(false);
  const [initialPost, setInitialPost] = useState(null);
  const { navThud, tick } = useSoundFX();
  const lenisRef = useRef(null);

  const openBlogList = () => { setInitialPost(null); setBlogOpen(true); };
  const openBlogPost = (post) => { setInitialPost(post); setBlogOpen(true); };

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
        touchMultiplier: 1,
        infinite: false,
      });
      lenisRef.current = lenis;
      function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
      requestAnimationFrame(raf);
    }).catch(() => {});
    return () => { if (lenis) lenis.destroy(); };
  }, []);

  // Pause Lenis + lock the page while the Blog overlay is open,
  // so the overlay (which is data-lenis-prevent) scrolls on its own.
  useEffect(() => {
    const lenis = lenisRef.current;
    if (blogOpen) {
      lenis?.stop();
      document.documentElement.style.overflow = 'hidden';
    } else {
      lenis?.start();
      document.documentElement.style.overflow = '';
    }
    return () => { document.documentElement.style.overflow = ''; };
  }, [blogOpen]);

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
    <SoundProvider>
      <BrowserRouter>
        {loading && <Loader onComplete={() => setLoading(false)} />}
        <CustomCursor />

        {/* Fixed star background */}
        <div className="fixed inset-0 z-0" style={{ background: '#000' }}>
          <StarsCanvas />
        </div>

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
          <BlogSection onOpenBlog={openBlogList} onOpenPost={openBlogPost} />
          <Feedbacks />
          <End />
        </div>

        {/* Full-screen Blog overlay */}
        <AnimatePresence>
          {blogOpen && (
            <Blog initialPost={initialPost} onClose={() => setBlogOpen(false)} />
          )}
        </AnimatePresence>
      </BrowserRouter>
    </SoundProvider>
  );
};

export default App;