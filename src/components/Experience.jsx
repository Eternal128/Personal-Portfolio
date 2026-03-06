import React, { useState } from "react";
import { motion } from "framer-motion";
import { experiences } from "../constants";

const STATS = [
  { value: "3",   label: "Internships" },
  { value: "2+",  label: "Years Experience" },
  { value: "25K+", label: "Records Processed" },
];

const ExperienceCard = ({ experience, index, isActive, onClick }) => {
  const num = String(index + 1).padStart(2, "0");

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
      onClick={onClick}
      className="exp-card"
      style={{
        cursor: "pointer",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        padding: "28px 0 28px 48px",
        display: "grid",
        gridTemplateColumns: "1fr auto",
        gap: 24,
        alignItems: "start",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Large background number */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          right: 48,
          top: "50%",
          transform: "translateY(-50%)",
          fontSize: "clamp(60px, 10vw, 140px)",
          fontWeight: 700,
          color: isActive ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.025)",
          letterSpacing: "-0.04em",
          lineHeight: 1,
          fontFamily: "'DM Sans', sans-serif",
          userSelect: "none",
          pointerEvents: "none",
          transition: "color 0.4s ease",
          zIndex: 0,
        }}
      >
        {num}
      </div>

      {/* Animated left progress line */}
      <motion.div
        style={{
          position: "absolute",
          left: 0, top: 0, bottom: 0,
          width: 2,
          background: "rgba(255,255,255,0.06)",
        }}
      >
        <motion.div
          initial={false}
          animate={{ scaleY: isActive ? 1 : 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(255,255,255,0.5)",
            transformOrigin: "top",
          }}
        />
      </motion.div>

      {/* Left — role + company + points */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 6 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0, overflow: "hidden",
          }}>
            <img
              src={experience.icon}
              alt={experience.company_name}
              style={{ width: 22, height: 22, objectFit: "contain", filter: "grayscale(100%) brightness(1.2)" }}
            />
          </div>

          <div>
            <p style={{
              fontSize: 13, fontWeight: 300,
              color: "rgba(255,255,255,0.35)",
              letterSpacing: "0.05em", marginBottom: 2,
              fontFamily: "'DM Sans', sans-serif",
            }}>
              {experience.company_name}
            </p>
            <h3 style={{
              fontSize: 18, fontWeight: 300,
              color: isActive ? "#fff" : "rgba(255,255,255,0.75)",
              letterSpacing: "-0.01em",
              fontFamily: "'DM Sans', sans-serif",
              transition: "color 0.3s",
            }}>
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
                <span style={{
                  width: 4, height: 4, borderRadius: "50%",
                  background: "rgba(255,255,255,0.25)",
                  marginTop: 7, flexShrink: 0,
                }} />
                <p style={{
                  fontSize: 13, fontWeight: 300,
                  color: "rgba(255,255,255,0.45)",
                  lineHeight: 1.7,
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  {point}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right — date + expand indicator */}
      <div style={{
        display: "flex", flexDirection: "column",
        alignItems: "flex-end", gap: 10, paddingTop: 4,
        position: "relative", zIndex: 1,
      }}>
        <span style={{
          fontSize: 12, fontWeight: 300,
          color: "rgba(255,255,255,0.28)",
          letterSpacing: "0.06em",
          fontFamily: "'DM Sans', sans-serif",
          whiteSpace: "nowrap",
        }}>
          {experience.date}
        </span>
        <div style={{
          width: 24, height: 24, borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.12)",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "transform 0.35s ease, border-color 0.3s",
          transform: isActive ? "rotate(45deg)" : "rotate(0deg)",
          borderColor: isActive ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.12)",
        }}>
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
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,200;9..40,300;9..40,400&display=swap');

        .exp-stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 64px;
        }
        .exp-stat-cell {
          background: #000;
          padding: 28px 24px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        @media (max-width: 767px) {
          .exp-section { padding: 60px 0 !important; }
          .exp-inner   { padding: 0 20px !important; }

          /* Stack stats 1-column on very small, keep 3-col otherwise */
          .exp-stats-grid {
            grid-template-columns: repeat(3, 1fr);
          }
          .exp-stat-cell {
            padding: 18px 12px;
          }

          /* Card left padding reduced so progress line doesn't eat space */
          .exp-card {
            padding-left: 20px !important;
          }
        }
      `}</style>

      <section
        id="work"
        className="exp-section"
        style={{
          background: "transparent",
          padding: "100px 0 80px",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <div className="exp-inner" style={{ maxWidth: 1280, margin: "0 auto", padding: "0 64px" }}>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{ marginBottom: 48 }}
          >
            <span style={{
              fontSize: 11, fontWeight: 300,
              color: "rgba(255,255,255,0.28)",
              letterSpacing: "0.22em", textTransform: "uppercase",
              display: "block", marginBottom: 12,
            }}>
              Career
            </span>
            <h2 style={{
              fontSize: "clamp(38px, 5vw, 64px)",
              fontWeight: 300, color: "#fff",
              letterSpacing: "-0.02em", lineHeight: 1, margin: 0,
            }}>
              Work Experience.
            </h2>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="exp-stats-grid"
          >
            {STATS.map((s, i) => (
              <div key={i} className="exp-stat-cell">
                <span style={{
                  fontSize: "clamp(24px, 4vw, 42px)",
                  fontWeight: 300, color: "#fff",
                  letterSpacing: "-0.03em", lineHeight: 1,
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  {s.value}
                </span>
                <span style={{
                  fontSize: 11, fontWeight: 300,
                  color: "rgba(255,255,255,0.3)",
                  letterSpacing: "0.08em", textTransform: "uppercase",
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  {s.label}
                </span>
              </div>
            ))}
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