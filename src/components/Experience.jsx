import React, { useState } from "react";
import { motion } from "framer-motion";
import { experiences } from "../constants";

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
                  color: active ? "#171400" : "rgba(255,255,255,0.45)",
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

const ExperienceCard = ({ experience, index, isActive, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
      onClick={onClick}
      style={{
        cursor: "pointer",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        padding: "28px 0",
        display: "grid",
        gridTemplateColumns: "1fr auto",
        gap: 24,
        alignItems: "start",
        transition: "opacity 0.2s",
      }}
    >
      {/* Left — role + company + points */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 6 }}>
          {/* Company icon dot */}
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              overflow: "hidden",
            }}
          >
            <img
              src={experience.icon}
              alt={experience.company_name}
              style={{ width: 22, height: 22, objectFit: "contain", filter: "grayscale(100%) brightness(1.2)" }}
            />
          </div>

          <div>
            <p
              style={{
                fontSize: 13,
                fontWeight: 300,
                color: "rgba(255,255,255,0.35)",
                letterSpacing: "0.05em",
                marginBottom: 2,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {experience.company_name}
            </p>
            <h3
              style={{
                fontSize: 18,
                fontWeight: 300,
                color: isActive ? "#fff" : "rgba(255,255,255,0.75)",
                letterSpacing: "-0.01em",
                fontFamily: "'DM Sans', sans-serif",
                transition: "color 0.3s",
              }}
            >
              {experience.title}
            </h3>
          </div>
        </div>

        {/* Expandable bullet points */}
        <motion.div
          initial={false}
          animate={{ height: isActive ? "auto" : 0, opacity: isActive ? 1 : 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ overflow: "hidden", paddingLeft: 50 }}
        >
          <div style={{ paddingTop: 16, paddingBottom: 4, display: "flex", flexDirection: "column", gap: 8 }}>
            {experience.points.map((point, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.25)",
                    marginTop: 7,
                    flexShrink: 0,
                  }}
                />
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 300,
                    color: "rgba(255,255,255,0.45)",
                    lineHeight: 1.9,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  <Highlight text={point} active={isActive} baseDelay={0.25 + i * 0.06} />
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right — date + expand indicator */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10, paddingTop: 4 }}>
        <span
          style={{
            fontSize: 12,
            fontWeight: 300,
            color: "rgba(255,255,255,0.28)",
            letterSpacing: "0.06em",
            fontFamily: "'DM Sans', sans-serif",
            whiteSpace: "nowrap",
          }}
        >
          {experience.date}
        </span>
        <div
          style={{
            width: 24,
            height: 24,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform 0.35s ease, border-color 0.3s",
            transform: isActive ? "rotate(45deg)" : "rotate(0deg)",
            borderColor: isActive ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.12)",
          }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M5 1V9M1 5H9" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </motion.div>
  );
};

const Experience = () => {
  const [openIndices, setOpenIndices] = useState(new Set());

  const toggle = (i) => {
    setOpenIndices(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,200;9..40,300;9..40,400&display=swap');`}</style>

      <section
        id="work"
        style={{
          background: "transparent",
          padding: "100px 0 80px",
          fontFamily: "'DM Sans', sans-serif",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Aligned to match projects/testimonials: max-w-7xl mx-auto px-6 sm:px-16 */}
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 64px" }}>

          {/* Header */}
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
                color: "rgba(255,255,255,0.28)",
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
                color: "#fff",
                letterSpacing: "-0.02em",
                lineHeight: 1,
                margin: 0,
              }}
            >
              Work Experience.
            </h2>
          </motion.div>

          {/* Timeline rows */}
          <div style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            {experiences.map((exp, i) => (
              <ExperienceCard
                key={i}
                index={i}
                experience={exp}
                isActive={openIndices.has(i)}
                onClick={() => toggle(i)}
              />
            ))}
          </div>

        </div>
      </section>
    </>
  );
};

export default Experience;