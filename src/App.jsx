import { useEffect, useState, lazy, Suspense } from "react";
import { AnimatePresence } from "framer-motion";

import { SoundProvider } from "./context/SoundContext";
import { useLenis } from "./context/LenisContext";
import { useTheme } from "./context/ThemeContext";
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
  const [navReady, setNavReady] = useState(false);
  const [heroReady, setHeroReady] = useState(false);
  const [blogOpen, setBlogOpen] = useState(false);
  const [initialPost, setInitialPost] = useState(null);
  const [starsReady, setStarsReady] = useState(false);
  const [flightPathReady, setFlightPathReady] = useState(false);

  const { navThud, tick } = useSoundFX();
  const lenis = useLenis();
  const { theme } = useTheme();

  // The loader's own root is a fixed, fully opaque full-viewport div from
  // its very first frame (regardless of phase), so nothing behind it is
  // visible until it unmounts at the very end of the zoom — there's no
  // visual cost to delaying purely-decorative background mounts, only a
  // main-thread one to *not* delaying them. Two such mounts were still
  // stuttering the Loader's 2.4s counter even after the ambient-audio and
  // Lenis deferrals:
  //  - StarsCanvas: a full react-three-fiber WebGL scene (context creation
  //    + shader compilation for PointMaterial + first render).
  //  - FlightPath: forces a synchronous `document.body.scrollHeight` layout
  //    reflow of the *entire* page on mount (every section is already in
  //    the DOM at that point), then starts an indefinitely-repeating GSAP
  //    wobble tween that ticks every frame from the moment it mounts.
  // Both are deferred past the counter's window, staggered a bit apart
  // from each other and from Lenis's own 2600ms delay (see LenisContext)
  // so none of these deferred inits land on the same frame and reintroduce
  // the exact jank they're each meant to avoid.
  useEffect(() => {
    const t1 = setTimeout(() => setStarsReady(true), 2900);
    const t2 = setTimeout(() => setFlightPathReady(true), 3200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

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

  // Pause Lenis + lock main page while Blog overlay is open
  useEffect(() => {
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
  }, [blogOpen, lenis]);

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

        {/* Stars stay behind the whole site and behind the loader; fade out
            in light mode since a starfield makes no sense on a light bg. */}
        <div
          className="fixed inset-0 z-0"
          style={{
            background: 'var(--bg)',
            opacity: theme === 'light' ? 0 : 1,
            transition: 'opacity 0.4s ease',
          }}
        >
          {starsReady && <StarsCanvas />}
        </div>

        {/* Loader is NOT part of browser history. Reveal happens AFTER the
            zoom fully completes, not hidden behind it, so the site's own
            components animate in one by one where the user can see it:
            Navbar first, then Hero a beat later. */}
        {loading && (
          <Loader
            onComplete={() => {
              setLoading(false);
              setNavReady(true);
              setTimeout(() => setHeroReady(true), 300);
            }}
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
            {flightPathReady && <FlightPath />}
          </div>

          <Navbar revealed={navReady} />
          <Hero heroReady={heroReady} />
          <About onOpenPost={openBlogPost} />
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