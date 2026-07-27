import React, { useEffect, useState } from "react";
import { navLinks } from "../constants";
import { useSound } from "../context/SoundContext";
import { useLenis } from "../context/LenisContext";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const { play } = useSound();
  const lenis = useLenis();

  const smoothScrollTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (lenis) lenis.scrollTo(el);
    else el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // All links (including Blog) smooth-scroll to their in-page section.
  const handleNav = (nav, { closeMobile = false } = {}) => {
    play("click");
    setActive(nav.title);
    if (closeMobile) setMenuOpen(false);
    smoothScrollTo(nav.id);
  };

  return (
    <>
      <style>{`
.nav-root {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          display: flex;
          justify-content: center;
          padding: 20px 24px;
          pointer-events: none;
          font-family: 'DM Sans', sans-serif;
        }

        .nav-bar {
          pointer-events: all;
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          max-width: 1100px;
          padding: 12px 16px 12px 20px;
          border-radius: 100px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(8,8,8,0.7);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          transition: background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .nav-bar.scrolled {
          background: rgba(6,6,6,0.88);
          border-color: rgba(255,255,255,0.1);
          box-shadow: 0 8px 32px rgba(0,0,0,0.5);
        }

        .nav-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          flex-shrink: 0;
          cursor: pointer;
        }

        .nav-logo-icon {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .nav-logo-icon svg { width: 14px; height: 14px; }

        .nav-logo-text {
          font-size: 14px;
          font-weight: 300;
          color: rgba(255,255,255,0.85);
          letter-spacing: 0.02em;
          white-space: nowrap;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 2px;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
        }

        .nav-link {
          font-size: 13px;
          font-weight: 300;
          color: rgba(255,255,255,0.45);
          text-decoration: none;
          padding: 7px 14px;
          border-radius: 100px;
          letter-spacing: 0.02em;
          transition: color 0.2s ease, background 0.2s ease;
          white-space: nowrap;
          cursor: pointer;
          background: none;
          border: none;
          font-family: 'DM Sans', sans-serif;
        }

        .nav-link:hover,
        .nav-link.active {
          color: rgba(255,255,255,0.9);
          background: rgba(255,255,255,0.06);
        }

        .nav-cta {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .nav-avail {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          border-radius: 100px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
        }

        .nav-avail-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #6ee99e;
          box-shadow: 0 0 5px rgba(110,233,158,0.8);
          animation: navDotPulse 2s ease-in-out infinite;
          flex-shrink: 0;
        }

        @keyframes navDotPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        .nav-avail span {
          font-size: 12px;
          font-weight: 300;
          color: rgba(255,255,255,0.45);
          letter-spacing: 0.03em;
          white-space: nowrap;
        }

        .nav-contact-btn {
          padding: 8px 18px;
          border-radius: 100px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.82);
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 300;
          letter-spacing: 0.02em;
          cursor: pointer;
          text-decoration: none;
          transition: background 0.2s, border-color 0.2s, color 0.2s;
          white-space: nowrap;
        }

        .nav-contact-btn:hover {
          background: rgba(255,255,255,0.13);
          border-color: rgba(255,255,255,0.2);
          color: #fff;
        }

        .nav-hamburger {
          display: none;
          flex-direction: column;
          gap: 4px;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          background: transparent;
          border: none;
          margin-left: auto;
        }

        .nav-hamburger span {
          display: block;
          width: 18px;
          height: 1px;
          background: rgba(255,255,255,0.6);
          transition: transform 0.2s, opacity 0.2s;
        }

        .nav-mobile-menu {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.96);
          backdrop-filter: blur(20px);
          z-index: 99;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 32px;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }

        .nav-mobile-menu.open {
          opacity: 1;
          pointer-events: all;
        }

        .nav-mobile-close {
          position: absolute;
          top: 28px;
          right: 28px;
          background: none;
          border: none;
          color: rgba(255,255,255,0.5);
          font-size: 24px;
          cursor: pointer;
          font-weight: 200;
        }

        .nav-mobile-link {
          font-size: clamp(28px, 6vw, 48px);
          font-weight: 200;
          color: rgba(255,255,255,0.7);
          text-decoration: none;
          letter-spacing: -0.01em;
          transition: color 0.2s;
          cursor: pointer;
          background: none;
          border: none;
          font-family: 'DM Sans', sans-serif;
        }

        .nav-mobile-link:hover { color: #fff; }

        @media (max-width: 768px) {
          .nav-links { display: none; }
          .nav-avail { display: none; }
          .nav-contact-btn { display: none; }
          .nav-hamburger { display: flex; }
        }
      `}</style>

      {/* Mobile fullscreen menu */}
      <div className={`nav-mobile-menu${menuOpen ? ' open' : ''}`}>
        <button className="nav-mobile-close" aria-label="Close menu" onClick={() => { play("close"); setMenuOpen(false); }}>✕</button>
        {navLinks.map((nav) => (
          <button
            key={nav.id}
            className="nav-mobile-link"
            onClick={() => handleNav(nav, { closeMobile: true })}
          >
            {nav.title}
          </button>
        ))}
      </div>

      <nav className="nav-root">
        <div className={`nav-bar${scrolled ? ' scrolled' : ''}`}>

          {/* Logo */}
          <button
            className="nav-logo"
            style={{ background: 'none', border: 'none' }}
            onClick={() => {
              play("click");
              setActive("");
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <div className="nav-logo-icon">
              <svg viewBox="0 0 14 14" fill="none">
                <rect x="1" y="1" width="5" height="5" rx="1.2" fill="rgba(255,255,255,0.7)" />
                <rect x="8" y="1" width="5" height="5" rx="1.2" fill="rgba(255,255,255,0.4)" />
                <rect x="1" y="8" width="5" height="5" rx="1.2" fill="rgba(255,255,255,0.4)" />
                <rect x="8" y="8" width="5" height="5" rx="1.2" fill="rgba(255,255,255,0.7)" />
              </svg>
            </div>
            <span className="nav-logo-text">James Hanzell</span>
          </button>

          {/* Center links */}
          <div className="nav-links">
            {navLinks.map((nav) => (
              <button
                key={nav.id}
                className={`nav-link${active === nav.title ? ' active' : ''}`}
                onClick={() => handleNav(nav)}
              >
                {nav.title}
              </button>
            ))}
          </div>

          {/* Right side */}
          <div className="nav-cta">
            <div className="nav-avail">
              <div className="nav-avail-dot" />
              <span>Available for work</span>
            </div>
            <button className="nav-hamburger" aria-label="Open menu" onClick={() => { play("click"); setMenuOpen(true); }}>
              <span /><span /><span />
            </button>
          </div>

        </div>
      </nav>
    </>
  );
};

export default Navbar;