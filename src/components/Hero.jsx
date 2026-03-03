import React, { useState, useEffect, useRef } from 'react';

const Hero = () => {
  const [loaded, setLoaded] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Parallax math — only active within the hero viewport
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
  const progress = Math.min(scrollY / vh, 1); // 0 → 1 as hero scrolls out

  // Content drifts up faster than the scroll → feels "floating"
  const contentY = scrollY * 0.45;
  const contentOp = Math.max(0, 1 - progress * 2.2);

  // Orbs move at different depths
  const orb1Y = scrollY * 0.25;
  const orb2Y = scrollY * 0.18;
  const orb3Y = scrollY * 0.32;
  const orb4Y = scrollY * 0.12;

  // Subtle scale-up on the bg layer as it recedes
  const bgScale = 1 + progress * 0.08;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,200;9..40,300;9..40,400&display=swap');

        .mist-hero {
          position: relative;
          width: 100%;
          height: 100vh;
          background: #000;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-family: 'DM Sans', sans-serif;
        }

        .mist-bg-layer {
          position: absolute;
          inset: -10%;
          pointer-events: none;
          will-change: transform;
        }

        .mist-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          pointer-events: none;
          will-change: transform;
        }
        .mist-orb-1 {
          width: 55vw; height: 55vw;
          top: -18vw; left: -12vw;
          background: radial-gradient(ellipse at center,
            rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.07) 40%, transparent 70%);
          animation: mistDrift1 14s ease-in-out infinite alternate;
        }
        .mist-orb-2 {
          width: 60vw; height: 70vw;
          top: -10vw; left: 20vw;
          background: radial-gradient(ellipse 60% 80% at 50% 40%,
            rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.08) 45%, transparent 70%);
          filter: blur(70px);
          animation: mistDrift2 18s ease-in-out infinite alternate;
        }
        .mist-orb-3 {
          width: 50vw; height: 50vw;
          bottom: -15vw; right: -5vw;
          background: radial-gradient(ellipse at center,
            rgba(255,255,255,0.10) 0%, transparent 65%);
          animation: mistDrift3 20s ease-in-out infinite alternate;
        }
        .mist-orb-4 {
          width: 35vw; height: 35vw;
          bottom: 0; left: 5vw;
          background: radial-gradient(ellipse at center,
            rgba(255,255,255,0.07) 0%, transparent 60%);
          filter: blur(100px);
          animation: mistDrift1 22s ease-in-out infinite alternate-reverse;
        }

        @keyframes mistDrift1 {
          from { transform: translate(0, 0) scale(1); }
          to   { transform: translate(3vw, 4vh) scale(1.06); }
        }
        @keyframes mistDrift2 {
          from { transform: translate(0, 0) rotate(-2deg) scale(1); }
          to   { transform: translate(-2vw, 5vh) rotate(2deg) scale(1.04); }
        }
        @keyframes mistDrift3 {
          from { transform: translate(0, 0) scale(1); }
          to   { transform: translate(-4vw, -3vh) scale(1.08); }
        }

        .mist-content {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 0;
          padding: 0 24px;
          will-change: transform, opacity;
        }

        /* Pill */
        .mist-pill {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          backdrop-filter: blur(12px);
          padding: 8px 20px;
          border-radius: 100px;
          margin-bottom: 42px;
          opacity: 0;
          transform: translateY(12px);
          transition: opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s;
        }
        .mist-pill.vis { opacity: 1; transform: translateY(0); }
        .mist-pill-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #fff;
          flex-shrink: 0;
          box-shadow: 0 0 6px rgba(255,255,255,0.8);
          animation: pillPulse 2s ease-in-out infinite;
        }
        @keyframes pillPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.8); }
        }
        .mist-pill span {
          font-size: 13px;
          font-weight: 300;
          color: rgba(255,255,255,0.78);
          letter-spacing: 0.04em;
        }

        /* Name */
        .mist-name {
          font-size: clamp(58px, 9vw, 138px);
          font-weight: 300;
          line-height: 1.03;
          letter-spacing: -0.02em;
          margin: 0;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.9s ease 0.3s, transform 0.9s ease 0.3s;
          background: linear-gradient(
            135deg,
            #ffffff 0%, #e8e8e8 20%, #ffffff 35%,
            #c8c8c8 50%, #ffffff 65%, #d4d4d4 80%, #ffffff 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: platinumShimmer 6s linear infinite;
        }
        .mist-name.vis { opacity: 1; transform: translateY(0); }
        @keyframes platinumShimmer {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }

        /* Sub */
        .mist-sub {
          margin-top: 24px;
          font-size: clamp(14px, 1.3vw, 17px);
          font-weight: 300;
          color: rgba(255,255,255,0.42);
          letter-spacing: 0.01em;
          max-width: 480px;
          line-height: 1.6;
          opacity: 0;
          transform: translateY(12px);
          transition: opacity 0.8s ease 0.54s, transform 0.8s ease 0.54s;
        }
        .mist-sub.vis { opacity: 1; transform: translateY(0); }

        /* CTA */
        .mist-btns {
          display: flex;
          gap: 12px;
          margin-top: 36px;
          opacity: 0;
          transform: translateY(12px);
          transition: opacity 0.8s ease 0.72s, transform 0.8s ease 0.72s;
        }
        .mist-btns.vis { opacity: 1; transform: translateY(0); }

        .mist-btn-primary {
          position: relative;
          padding: 14px 40px;
          border-radius: 100px;
          border: none;
          background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 40%, #252525 60%, #1a1a1a 100%);
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 300;
          letter-spacing: 0.06em;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          box-shadow: 0 0 0 1px rgba(255,255,255,0.08), 0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05);
        }
        .mist-btn-primary::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 100px;
          padding: 1.5px;
          background: linear-gradient(135deg,
            rgba(255,255,255,0.0) 0%, rgba(255,255,255,0.35) 25%,
            rgba(255,255,255,0.0) 50%, rgba(255,255,255,0.15) 75%,
            rgba(255,255,255,0.0) 100%);
          background-size: 300% 300%;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: destination-out;
          mask-composite: exclude;
          animation: borderShimmer 4s linear infinite;
        }
        .mist-btn-primary::after {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: 100px;
          background: transparent;
          box-shadow: 0 0 0px rgba(255,255,255,0);
          transition: box-shadow 3s ease;
          pointer-events: none;
        }
        .mist-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 0 1px rgba(255,255,255,0.2), 0 6px 30px rgba(0,0,0,0.5), 0 0 25px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.08);
        }
        @keyframes borderShimmer {
          0% { background-position: 0% 50%; }
          100% { background-position: 300% 50%; }
        }

        /* Scroll indicator */
        .mist-scrollbar {
          position: absolute;
          bottom: 32px;
          left: 0; right: 0;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.8s ease 1s;
          will-change: opacity;
        }
        .mist-scrollbar.vis { opacity: 1; }
        .mist-sb-line {
          flex: 1;
          max-width: 220px;
          height: 1px;
          background: rgba(255,255,255,0.1);
        }
        .mist-sb-text {
          font-size: 11px;
          font-weight: 300;
          color: rgba(255,255,255,0.28);
          letter-spacing: 0.1em;
          padding: 0 20px;
          white-space: nowrap;
        }
        .mist-scroll-icon {
          width: 24px; height: 40px;
          border: 1.5px solid rgba(255,255,255,0.2);
          border-radius: 12px;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 6px;
          flex-shrink: 0;
        }
        .mist-scroll-dot {
          width: 3px; height: 7px;
          background: rgba(255,255,255,0.45);
          border-radius: 2px;
          animation: mistScrollDrop 2.4s ease-in-out infinite;
        }
        @keyframes mistScrollDrop {
          0%   { transform: translateY(0);    opacity: 1; }
          60%  { transform: translateY(11px); opacity: 0; }
          61%  { transform: translateY(0);    opacity: 0; }
          100% { transform: translateY(0);    opacity: 1; }
        }

        /* Bottom fade — bleeds hero darkness into the next section */
        .hero-fade-bottom {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 280px;
          background: linear-gradient(to bottom, transparent 0%, #000 100%);
          pointer-events: none;
          z-index: 5;
        }
      `}</style>

      <section className="mist-hero" ref={heroRef}>

        {/* Background layer — scales very slightly on scroll for depth */}
        <div
          className="mist-bg-layer"
          style={{ transform: `scale(${bgScale})`, transition: 'transform 0.05s linear' }}
        >
          <div
            className="mist-orb mist-orb-1"
            style={{ transform: `translateY(${orb1Y}px)` }}
          />
          <div
            className="mist-orb mist-orb-2"
            style={{ transform: `translateY(${orb2Y}px)` }}
          />
          <div
            className="mist-orb mist-orb-3"
            style={{ transform: `translateY(${orb3Y}px)` }}
          />
          <div
            className="mist-orb mist-orb-4"
            style={{ transform: `translateY(${orb4Y}px)` }}
          />
        </div>

        {/* Content — drifts up faster than scroll + fades out */}
        <div
          className="mist-content"
          style={{
            transform: `translateY(${-contentY}px)`,
            opacity: contentOp,
          }}
        >
          <div className={`mist-pill${loaded ? ' vis' : ''}`}>
            <div className="mist-pill-dot" />
            <span>Personal Portfolio</span>
          </div>

          <h1 className={`mist-name${loaded ? ' vis' : ''}`}>
            James William<br />Hanzell
          </h1>

          <p className={`mist-sub${loaded ? ' vis' : ''}`}>
            If it's fun, I'm IN!
          </p>

          <div className={`mist-btns${loaded ? ' vis' : ''}`}>
            <a href="#projects" className="mist-btn-primary">See Projects</a>
          </div>
        </div>

        {/* Scroll indicator also fades with content */}
        <div
          className={`mist-scrollbar${loaded ? ' vis' : ''}`}
          style={{ opacity: loaded ? Math.max(0, 1 - progress * 4) : 0 }}
        >
          <div className="mist-sb-line" />
          <span className="mist-sb-text">Scroll down</span>
          <div className="mist-scroll-icon">
            <div className="mist-scroll-dot" />
          </div>
          <span className="mist-sb-text">to see projects</span>
          <div className="mist-sb-line" />
        </div>

        {/* Seamless bottom fade into the rest of the site */}
        <div className="hero-fade-bottom" />
      </section>
    </>
  );
};

export default Hero;