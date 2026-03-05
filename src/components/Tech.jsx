import React, { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { technologies } from "../constants";

const LEVEL_BAR = { Expert: 1, Advanced: 0.75, Intermediate: 0.5, Beginner: 0.25 };

// Card — only reports hover state + card center coords upward, renders no tooltip itself
const TechCard = ({ name, icon, level, description, index, onHover, onLeave }) => {
  const [hovered, setHovered] = useState(false);
  const ref = React.useRef(null);

  const handleEnter = () => {
    setHovered(true);
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      onHover({ name, description, x: rect.left + rect.width / 2, y: rect.top });
    }
  };

  const handleLeave = () => {
    setHovered(false);
    onLeave();
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5, delay: index * 0.04, ease: [0.25, 0.46, 0.45, 0.94] }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{
        position: "relative",
        background: hovered ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.02)",
        border: `1px solid ${hovered ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.06)"}`,
        borderRadius: 16,
        padding: "24px 20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        cursor: "default",
        transition: "background 0.3s, border-color 0.3s",
      }}
    >
      {/* Icon */}
      <div style={{ width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <img
          src={icon}
          alt={name}
          style={{
            width: 36,
            height: 36,
            objectFit: "contain",
            filter: hovered ? "grayscale(0%) brightness(1)" : "grayscale(100%) brightness(0.7)",
            transition: "filter 0.4s ease",
          }}
        />
      </div>

      {/* Name */}
      <p style={{
        fontSize: 13,
        fontWeight: 300,
        color: hovered ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.5)",
        letterSpacing: "0.02em",
        textAlign: "center",
        fontFamily: "'DM Sans', sans-serif",
        transition: "color 0.3s",
        margin: 0,
      }}>
        {name}
      </p>

      {/* Level bar */}
      <div style={{ width: "100%", height: 2, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${(LEVEL_BAR[level] || 0.5) * 100}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: index * 0.04 + 0.3, ease: "easeOut" }}
          style={{
            height: "100%",
            background: hovered ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.25)",
            borderRadius: 2,
            transition: "background 0.3s",
          }}
        />
      </div>

      {/* Level label */}
      <span style={{
        fontSize: 10,
        fontWeight: 300,
        color: "rgba(255,255,255,0.22)",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        fontFamily: "'DM Sans', sans-serif",
      }}>
        {level}
      </span>
    </motion.div>
  );
};

const Tech = () => {
  const [tooltip, setTooltip] = useState(null); // { name, description, x, y }

  const handleHover = useCallback((data) => setTooltip(data), []);
  const handleLeave = useCallback(() => setTooltip(null), []);

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,200;9..40,300;9..40,400&display=swap');`}</style>

      {/* Fixed tooltip — lives at root level, never clipped */}
      {tooltip && (
        <div
          style={{
            position: "fixed",
            left: tooltip.x,
            top: tooltip.y - 12,
            transform: "translate(-50%, -100%)",
            background: "rgba(10,10,10,0.96)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 12,
            padding: "10px 16px",
            width: 210,
            zIndex: 9999,
            pointerEvents: "none",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          <p style={{
            fontSize: 12,
            fontWeight: 300,
            color: "rgba(255,255,255,0.55)",
            lineHeight: 1.65,
            textAlign: "center",
            margin: 0,
          }}>
            {tooltip.description}
          </p>
          {/* Arrow pointing DOWN toward the card */}
          <div style={{
            position: "absolute",
            bottom: -5,
            left: "50%",
            transform: "translateX(-50%) rotate(45deg)",
            width: 8,
            height: 8,
            background: "rgba(10,10,10,0.96)",
            borderRight: "1px solid rgba(255,255,255,0.1)",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          }} />
        </div>
      )}

      <section
        id="tech"
        style={{ background: "transparent", padding: "100px 0 80px", fontFamily: "'DM Sans', sans-serif" }}
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
            <span style={{
              fontSize: 11,
              fontWeight: 300,
              color: "rgba(255,255,255,0.28)",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              display: "block",
              marginBottom: 12,
            }}>
              My expertise
            </span>
            <h2 style={{
              fontSize: "clamp(38px, 5vw, 64px)",
              fontWeight: 300,
              color: "#fff",
              letterSpacing: "-0.02em",
              lineHeight: 1,
              margin: 0,
            }}>
              Technical Skills.
            </h2>
          </motion.div>

          {/* Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
            gap: 10,
          }}>
            {technologies.map((tech, i) => (
              <TechCard
                key={tech.name}
                index={i}
                {...tech}
                onHover={handleHover}
                onLeave={handleLeave}
              />
            ))}
          </div>

        </div>
      </section>
    </>
  );
};

export default Tech;