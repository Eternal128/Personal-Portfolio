import { useEffect, useRef, useState, lazy, Suspense } from "react";
import { AnimatePresence } from "framer-motion";

import { SoundProvider } from "./context/SoundContext";
import {
  About, Experience, Feedbacks, Hero,
  Navbar, Tech, Works, StarsCanvas, End, CustomCursor, Loader,
} from './components';
import BlogSection from './components/BlogSection';
import FlightPath from './components/FlightPath';
import { useSoundFX } from './hooks/useSoundFX';
import { POSTS } from './constants/posts';

const Blog = lazy(() => import('./components/Blog'));

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

const getPostById = (id) => POSTS.find((p) => p.id === id);

const getStateFromLocation = () => {
  if (typeof window === 'undefined') return { view: 'home' };

  const hash = window.location.hash || '';

  if (hash === '#blog') {
    return { view: 'blog-index' };
  }

  if (hash.startsWith('#blog/')) {
    const postId = decodeURIComponent(hash.replace('#blog/', ''));
    return { view: 'blog-post', postId };
  }

  return { view: 'home' };
};

const App = () => {
  const [loading, setLoading] = useState(true);
  const [heroReady, setHeroReady] = useState(false);
  const [blogOpen, setBlogOpen] = useState(false);
  const [initialPost, setInitialPost] = useState(null);

  const { navThud, tick } = useSoundFX();
  const lenisRef = useRef(null);

  const applyHistoryState = (state) => {
    if (!state || state.view === 'home') {
      setBlogOpen(false);
      setInitialPost(null);
      return;
    }

    if (state.view === 'blog-index') {
      setBlogOpen(true);
      setInitialPost(null);
      return;
    }

    if (state.view === 'blog-post') {
      const post = getPostById(state.postId);

      setBlogOpen(true);
      setInitialPost(post || null);
    }
  };

  const pushBlogIndexState = () => {
    window.history.pushState(
      { view: 'blog-index' },
      '',
      '#blog'
    );
  };

  const pushBlogPostState = (post) => {
    window.history.pushState(
      { view: 'blog-post', postId: post.id },
      '',
      `#blog/${encodeURIComponent(post.id)}`
    );
  };

  const replaceHomeState = () => {
    window.history.replaceState(
      { view: 'home' },
      '',
      window.location.pathname
    );
  };

  const openBlogList = () => {
    setInitialPost(null);
    setBlogOpen(true);
    pushBlogIndexState();
  };

  const openBlogPost = (post) => {
    setInitialPost(post);
    setBlogOpen(true);
    pushBlogPostState(post);
  };

  const closeBlogToHome = () => {
    setInitialPost(null);
    setBlogOpen(false);
    replaceHomeState();
  };

  // Initialize browser history state + listen to browser back/forward
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const initialState = getStateFromLocation();

    window.history.replaceState(
      initialState,
      '',
      window.location.href
    );

    applyHistoryState(initialState);

    const onPopState = (e) => {
      const state = e.state || { view: 'home' };
      applyHistoryState(state);
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Lenis smooth scroll
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let lenis;
    let rafId;

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

      const raf = (time) => {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      };

      rafId = requestAnimationFrame(raf);
    }).catch(() => {});

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (lenis) lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Pause Lenis + lock main page while Blog overlay is open
  useEffect(() => {
    const lenis = lenisRef.current;

    if (blogOpen) {
      lenis?.stop();
      document.documentElement.style.overflow = 'hidden';
    } else {
      lenis?.start();
      document.documentElement.style.overflow = '';
    }

    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [blogOpen]);

  // Global click sound
  useEffect(() => {
    const handleClick = (e) => {
      const type = findClickable(e.target);

      if (type === 'nav') navThud();
      if (type === 'tick') tick();
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [navThud, tick]);

  return (
    <SoundProvider>
      <>
        <a href="#main-container" className="skip-link">Skip to content</a>

        {/* Stars stay behind the whole site and behind the loader */}
        <div className="fixed inset-0 z-0" style={{ background: '#000' }}>
          <StarsCanvas />
        </div>

        {/* Loader is NOT part of browser history */}
        {loading && (
          <Loader
            onReveal={() => setHeroReady(true)}
            onComplete={() => setLoading(false)}
          />
        )}

        <CustomCursor />

        {/* Main scrollable container */}
        <div
          id="main-container"
          className="relative z-10"
          style={{ background: 'transparent' }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 0,
              pointerEvents: 'none',
            }}
          >
            <FlightPath />
          </div>

          <Navbar />
          <Hero heroReady={heroReady} />
          <About />
          <Experience />
          <Tech />
          <Works />
          <BlogSection
            onOpenBlog={openBlogList}
            onOpenPost={openBlogPost}
          />
          <Feedbacks />
          <End />
        </div>

        {/* Full-screen Blog overlay */}
        <Suspense fallback={null}>
          <AnimatePresence>
            {blogOpen && (
              <Blog
                initialPost={initialPost}
                onClose={closeBlogToHome}
              />
            )}
          </AnimatePresence>
        </Suspense>
      </>
    </SoundProvider>
  );
};

export default App;