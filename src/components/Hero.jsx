import React, { useState, useEffect } from 'react';

const Hero = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);

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

        /* ── MIST LAYER ── */
        /* Three soft fog orbs positioned exactly like the reference:
           top-left, center-right, bottom-left */
        .mist-orb {
          position: absolute;
          border-radius: 50%;
          /* Heavy blur = fog, not glow */
          filter: blur(90px);
          pointer-events: none;
        }

        .mist-orb-1 {
          /* top-left blob — the big dominant one */
          width: 55vw;
          height: 55vw;
          top: -18vw;
          left: -12vw;
          background: radial-gradient(ellipse at center,
            rgba(255,255,255,0.18) 0%,
            rgba(255,255,255,0.07) 40%,
            transparent 70%
          );
          animation: mistDrift1 14s ease-in-out infinite alternate;
        }

        .mist-orb-2 {
          /* center — the brightest, curves like a ribbon */
          width: 60vw;
          height: 70vw;
          top: -10vw;
          left: 20vw;
          background: radial-gradient(ellipse 60% 80% at 50% 40%,
            rgba(255,255,255,0.22) 0%,
            rgba(255,255,255,0.08) 45%,
            transparent 70%
          );
          filter: blur(70px);
          animation: mistDrift2 18s ease-in-out infinite alternate;
        }

        .mist-orb-3 {
          /* bottom-right tail */
          width: 50vw;
          height: 50vw;
          bottom: -15vw;
          right: -5vw;
          background: radial-gradient(ellipse at center,
            rgba(255,255,255,0.10) 0%,
            transparent 65%
          );
          animation: mistDrift3 20s ease-in-out infinite alternate;
        }

        .mist-orb-4 {
          /* subtle bottom-left fill */
          width: 35vw;
          height: 35vw;
          bottom: 0;
          left: 5vw;
          background: radial-gradient(ellipse at center,
            rgba(255,255,255,0.07) 0%,
            transparent 60%
          );
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

        /* ── CONTENT ── */
        .mist-content {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 0;
          padding: 0 24px;
        }

        /* Pill */
        .mist-pill {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
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
          color: #fff;
          line-height: 1.03;
          letter-spacing: -0.02em;
          margin: 0;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.9s ease 0.3s, transform 0.9s ease 0.3s;
        }
        .mist-name.vis { opacity: 1; transform: translateY(0); }

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

        /* Buttons row */
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
          padding: 13px 36px;
          border-radius: 100px;
          border: 1.5px solid rgba(255,255,255,0.5);
          background: transparent;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 300;
          letter-spacing: 0.02em;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
          transition: background 0.2s, border-color 0.2s;
        }
        .mist-btn-primary:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.8);
        }

        /* Scroll bar */
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
      `}</style>

      <section className="mist-hero">

        {/* Mist orbs — pure CSS, no canvas */}
        <div className="mist-orb mist-orb-1" />
        <div className="mist-orb mist-orb-2" />
        <div className="mist-orb mist-orb-3" />
        <div className="mist-orb mist-orb-4" />

        {/* Center content */}
        <div className="mist-content">
          <div className={`mist-pill${loaded ? ' vis' : ''}`}>
            <div className="mist-pill-dot" />
            <span>Personal Portfolio</span>
          </div>

          <h1 className={`mist-name${loaded ? ' vis' : ''}`}>
            James William<br />Hanzell
          </h1>

          <p className={`mist-sub${loaded ? ' vis' : ''}`}>
            I love turning my random ideas into life!
          </p>

          <div className={`mist-btns${loaded ? ' vis' : ''}`}>
            <a href="#projects" className="mist-btn-primary">See Projects</a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className={`mist-scrollbar${loaded ? ' vis' : ''}`}>
          <div className="mist-sb-line" />
          <span className="mist-sb-text">Scroll down</span>
          <div className="mist-scroll-icon">
            <div className="mist-scroll-dot" />
          </div>
          <span className="mist-sb-text">to see projects</span>
          <div className="mist-sb-line" />
        </div>

      </section>
    </>
  );
};

export default Hero;