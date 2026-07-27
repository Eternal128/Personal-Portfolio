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

    import('lenis').then(({ default: Lenis }) => {
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

    return () => {
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
