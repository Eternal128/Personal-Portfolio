import React, { createContext, useContext, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const LenisContext = createContext(null);

export const LenisProvider = ({ children }) => {
  const [lenis, setLenis] = useState(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let instance;
    let tickerFn;
    let onLoad;
    let cancelled = false;

    // ScrollTrigger.refresh() below has to lay out the whole document (every
    // registered trigger's start/end position), which is real synchronous
    // work. The Loader's box-draw + counter re-render on every rAF tick for
    // its first ~2.7s ('drawing' phase, see Loader.jsx's timing constants),
    // so any heavy task landing in that window visibly freezes the count
    // mid-animation. Nothing on the page is scrollable/interactive behind
    // the fullscreen loader yet anyway, so starting Lenis a beat later (once
    // the counter has stopped ticking) costs nothing and avoids that stutter.
    const START_DELAY_MS = 2600;

    const timer = setTimeout(() => {
      import('lenis').then(({ default: Lenis }) => {
        if (cancelled) return;

        instance = new Lenis({
          duration: 1.4,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smooth: true,
          mouseMultiplier: 1,
          smoothTouch: false,
          touchMultiplier: 1,
          infinite: false,
        });

        // Keep ScrollTrigger's scroll position in lockstep with Lenis, and drive
        // Lenis from the same ticker GSAP uses — without this, pinned sections
        // visibly jitter against Lenis's eased scroll.
        instance.on('scroll', ScrollTrigger.update);
        tickerFn = (time) => instance.raf(time * 1000);
        gsap.ticker.add(tickerFn);
        gsap.ticker.lagSmoothing(0);

        ScrollTrigger.refresh();
        onLoad = () => ScrollTrigger.refresh();
        window.addEventListener('load', onLoad, { once: true });

        setLenis(instance);
      }).catch(() => {});
    }, START_DELAY_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      if (tickerFn) gsap.ticker.remove(tickerFn);
      if (onLoad) window.removeEventListener('load', onLoad);
      if (instance) instance.destroy();
      setLenis(null);
    };
  }, []);

  return (
    <LenisContext.Provider value={lenis}>
      {children}
    </LenisContext.Provider>
  );
};

export const useLenis = () => useContext(LenisContext);
