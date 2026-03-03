import React, { useState } from "react";
import { motion } from "framer-motion";
import { experiences } from "../constants";

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
                    lineHeight: 1.7,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {point}
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
  const [activeIndex, setActiveIndex] = useState(null);

  const toggle = (i) => setActiveIndex(activeIndex === i ? null : i);

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,200;9..40,300;9..40,400&display=swap');`}</style>

      <section
        id="work"
        style={{
          background: "transparent",
          padding: "100px 0 80px",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 24px" }}>

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
                isActive={activeIndex === i}
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