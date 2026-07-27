import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from 'gsap';
import { experiences } from "../constants";
import { useLenis } from "../context/LenisContext";

// Picks readable text color against an arbitrary iconBg swatch.
const readableTextOn = (hex) => {
  const c = hex.replace('#', '');
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? '#171400' : '#fff';
};

const Highlight = ({ text, active, baseDelay = 0 }) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  let markIndex = 0;

  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          const idx = markIndex++;
          const delay = active ? baseDelay + idx * 0.18 : 0;

          return (
            <span
              key={i}
              style={{
                position: "relative",
                display: "inline-block",
                padding: "0 3px",
                margin: "0 -1px",
              }}
            >
              {/* Highlighter bar — sweeps left to right behind the text */}
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: active ? 1 : 0 }}
                transition={{
                  duration: 0.45,
                  delay,
                  ease: [0.65, 0, 0.35, 1],
                }}
                style={{
                  position: "absolute",
                  top: "8%",
                  bottom: "4%",
                  left: 0,
                  right: 0,
                  transformOrigin: "left center",
                  background: "linear-gradient(90deg, rgba(212,180,100,0.88) 0%, rgba(225,195,120,0.80) 100%)",
                  boxShadow: "0 0 10px rgba(212,180,100,0.40)",
                  borderRadius: 2,
                  zIndex: 0,
                }}
              />
              {/* Text sits above the bar; darkens slightly once the bar arrives */}
              <span
                style={{
                  position: "relative",
                  zIndex: 1,
                  color: active ? "#171400" : "rgba(var(--fg-rgb),0.45)",
                  fontWeight: 500,
                  transition: `color 0.25s ease ${delay + 0.15}s`,
                }}
              >
                {part.slice(2, -2)}
              </span>
            </span>
          );
        }
        return <React.Fragment key={i}>{part}</React.Fragment>;
      })}
    </>
  );
};

// A plain full-width bar per job — just the company name, large, with a
// hover-revealed arrow — matching the reference list pattern (hover dims the
// row and shifts the title/arrow apart; click opens the full detail page,
// which still carries the job title, date, and bullets).
const ExperienceRow = ({ experience, index, onOpen, onHoverChange }) => {
  return (
    <motion.div
      className="exp-row"
      role="button"
      tabIndex={0}
      aria-label={`View details for ${experience.title} at ${experience.company_name}`}
      onClick={onOpen}
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen();
        }
      }}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      style={{ borderTop: index === 0 ? "none" : "1px solid rgba(var(--fg-rgb),0.16)" }}
    >
      <h3 className="exp-row-title">{experience.company_name}</h3>
      <span className="exp-row-arrow">↗</span>
    </motion.div>
  );
};

// Single box that trails the cursor while any row is hovered, sliding an
// internal filmstrip to the hovered job's icon — mirrors the mouse-follow
// project preview pattern (gsap.quickTo spring-follow + scale-in modal).
const CursorPreview = ({ hoveredIndex }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const xTo = gsap.quickTo(containerRef.current, "left", { duration: 0.6, ease: "power3" });
    const yTo = gsap.quickTo(containerRef.current, "top", { duration: 0.6, ease: "power3" });
    const handler = (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  const active = hoveredIndex !== null;
  const displayIndex = hoveredIndex ?? 0;

  return (
    <motion.div
      ref={containerRef}
      className="exp-cursor-preview"
      initial={{ scale: 0 }}
      animate={{ scale: active ? 1 : 0 }}
      transition={{ duration: 0.4, ease: active ? [0.16, 1, 0.3, 1] : [0.6, 0, 0.8, 0.2] }}
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        marginLeft: -180,
        marginTop: -130,
        width: 360,
        height: 260,
        borderRadius: 20,
        overflow: "hidden",
        zIndex: 60,
        pointerEvents: "none",
        boxShadow: "0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(212,180,100,0.08)",
      }}
    >
      <div
        style={{
          position: "absolute",
          height: "100%",
          width: "100%",
          top: `${displayIndex * -100}%`,
          transition: "top 0.5s cubic-bezier(0.76,0,0.24,1)",
        }}
      >
        {experiences.map((exp, i) => (
          <div
            key={i}
            style={{
              height: "100%",
              width: "100%",
              background: exp.iconBg,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
            }}
          >
            <img src={exp.icon} alt="" style={{ width: 68, height: 68, objectFit: "contain" }} />
            <div style={{ textAlign: "center", padding: "0 24px" }}>
              <div style={{ fontSize: 16, fontWeight: 500, color: readableTextOn(exp.iconBg), fontFamily: "'DM Sans', sans-serif", marginBottom: 4 }}>
                {exp.company_name}
              </div>
              <div style={{ fontSize: 12, fontWeight: 300, color: readableTextOn(exp.iconBg), opacity: 0.65, fontFamily: "'DM Sans', sans-serif" }}>
                {exp.title}
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// Full-page takeover shown when a job is clicked, mirroring the site's
// existing full-screen overlay pattern (used by the Blog reader) instead of
// the old in-place "jump to the row you already clicked" scroll.
const ExperienceDetail = ({ experience, index, total, onClose, onPrev, onNext }) => {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, onPrev, onNext]);

  return (
    <motion.div
      data-lenis-prevent
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 900,
        background: "var(--surface-solid)",
        color: "var(--fg)",
        fontFamily: "'DM Sans', sans-serif",
        overflowY: "auto",
        overscrollBehavior: "contain",
        WebkitOverflowScrolling: "touch",
      }}
    >
      {/* Sticky top bar */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 5,
          background: "rgba(var(--surface-solid-rgb),0.85)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(var(--fg-rgb),0.08)",
        }}
      >
        <div
          style={{
            maxWidth: 1000,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "22px clamp(22px, 6vw, 64px)",
          }}
        >
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "rgba(var(--fg-rgb),0.6)",
              fontSize: 12,
              letterSpacing: "0.06em",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            ← Work Experience
          </button>

          <span
            style={{
              fontSize: 11,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "rgba(var(--fg-rgb),0.32)",
            }}
          >
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={onPrev}
              aria-label="Previous role"
              style={{
                width: 34, height: 34, borderRadius: "50%",
                border: "1px solid rgba(var(--fg-rgb),0.15)", background: "none",
                color: "rgba(var(--fg-rgb),0.6)", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              onClick={onNext}
              aria-label="Next role"
              style={{
                width: 34, height: 34, borderRadius: "50%",
                border: "1px solid rgba(var(--fg-rgb),0.15)", background: "none",
                color: "rgba(var(--fg-rgb),0.6)", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "clamp(56px, 9vh, 110px) clamp(22px, 6vw, 64px) clamp(80px, 14vh, 160px)" }}>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 32 }}
        >
          <div
            style={{
              width: 64, height: 64, borderRadius: 16,
              background: experience.iconBg,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <img src={experience.icon} alt="" style={{ width: 34, height: 34, objectFit: "contain" }} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 400, color: "rgba(var(--fg-rgb),0.7)", marginBottom: 4 }}>
              {experience.company_name}
            </div>
            <div style={{ fontSize: 12, fontWeight: 300, color: "rgba(var(--fg-rgb),0.35)", letterSpacing: "0.05em" }}>
              {experience.date}
            </div>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontSize: "clamp(2.2rem, 6vw, 4rem)",
            fontWeight: 300,
            lineHeight: 1.04,
            letterSpacing: "-0.02em",
            marginBottom: "clamp(48px, 8vh, 90px)",
            color: "var(--fg)",
          }}
        >
          {experience.title}
        </motion.h1>

        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          {experience.points.map((point, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.22 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              style={{ display: "flex", gap: 14, alignItems: "flex-start" }}
            >
              <span
                style={{
                  width: 5, height: 5, borderRadius: "50%",
                  background: "rgba(212,180,100,0.7)", marginTop: 10, flexShrink: 0,
                }}
              />
              <p style={{ fontSize: 16, fontWeight: 300, color: "rgba(var(--fg-rgb),0.6)", lineHeight: 1.85 }}>
                <Highlight text={point} active baseDelay={0} />
              </p>
            </motion.div>
          ))}
        </div>

        <button
          onClick={onClose}
          style={{
            marginTop: "clamp(60px, 10vh, 100px)",
            background: "none",
            border: "1px solid rgba(var(--fg-rgb),0.18)",
            borderRadius: 100,
            padding: "13px 28px",
            cursor: "pointer",
            fontSize: 11,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(var(--fg-rgb),0.7)",
          }}
        >
          ← Back to Work Experience
        </button>
      </div>
    </motion.div>
  );
};

const Experience = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [openIndex, setOpenIndex] = useState(null);
  const lenis = useLenis();

  // Pause background scroll while a job's detail page is open, same
  // lock-and-restore approach the Blog overlay uses.
  useEffect(() => {
    if (openIndex !== null) {
      lenis?.stop();
      document.documentElement.style.overflow = 'hidden';
    } else {
      lenis?.start();
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [openIndex, lenis]);

  return (
    <>
      <style>{`
        .exp-row {
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: center;
          gap: 32px;
          padding: clamp(24px, 3.6vh, 38px) 0;
          cursor: pointer;
          transition: opacity 0.3s ease;
        }
        .exp-row:hover { opacity: 0.55; }
        .exp-row-title {
          margin: 0;
          font-size: clamp(22px, 3.2vw, 38px);
          font-weight: 300;
          letter-spacing: -0.01em;
          color: var(--fg);
          transition: transform 0.4s cubic-bezier(0.16,1,0.3,1);
        }
        .exp-row:hover .exp-row-title { transform: translateX(-14px); }
        .exp-row-arrow {
          font-size: 18px;
          color: rgba(var(--fg-rgb),0.4);
          opacity: 0;
          transition: opacity 0.3s ease, transform 0.4s cubic-bezier(0.16,1,0.3,1);
        }
        .exp-row:hover .exp-row-arrow { opacity: 1; transform: translate(6px, -5px); }

        @media (max-width: 767px) {
          .exp-row { padding: 28px 0; }
          .exp-row:hover .exp-row-title, .exp-row:hover .exp-row-arrow { transform: none; }
          .exp-cursor-preview { display: none !important; }
        }
      `}</style>

      <section
        id="work"
        style={{
          background: "transparent",
          padding: "100px 0 40px",
          fontFamily: "'DM Sans', sans-serif",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div style={{ width: "100%", padding: "0 clamp(24px, 6vw, 120px)" }}>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{ marginBottom: 56 }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 300,
                color: "rgba(var(--fg-rgb),0.28)",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                display: "block",
                marginBottom: 12,
              }}
            >
              Career
            </span>
            <h2
              style={{
                fontSize: "clamp(38px, 5vw, 64px)",
                fontWeight: 300,
                color: "var(--fg)",
                letterSpacing: "-0.02em",
                lineHeight: 1,
                margin: 0,
              }}
            >
              Work Experience.
            </h2>
          </motion.div>

          <div style={{ borderTop: "1px solid rgba(var(--fg-rgb),0.16)", borderBottom: "1px solid rgba(var(--fg-rgb),0.16)" }}>
            {experiences.map((exp, i) => (
              <ExperienceRow
                key={i}
                index={i}
                experience={exp}
                onOpen={() => setOpenIndex(i)}
                onHoverChange={(isHovering) => setHoveredIndex(isHovering ? i : null)}
              />
            ))}
          </div>

        </div>
      </section>

      <CursorPreview hoveredIndex={hoveredIndex} />

      <AnimatePresence>
        {openIndex !== null && (
          <ExperienceDetail
            key="exp-detail"
            experience={experiences[openIndex]}
            index={openIndex}
            total={experiences.length}
            onClose={() => setOpenIndex(null)}
            onPrev={() => setOpenIndex((i) => (i - 1 + experiences.length) % experiences.length)}
            onNext={() => setOpenIndex((i) => (i + 1) % experiences.length)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Experience;
