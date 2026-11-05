import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { experiences } from "../constants";

const RESUME = "/James-Hanzell-Resume.pdf";
const EASE = [0.16, 1, 0.3, 1];

// Bullets mark their key numbers with **…**; those render in full ink.
const renderPoint = (text) =>
  text.split(/(\*\*.*?\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="xp-metric">{part.slice(2, -2)}</strong>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    )
  );

const rowVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE, staggerChildren: 0.05, delayChildren: 0.1 } },
};
const pointVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

// One trigger per row; the bullets follow it, so they can never be left hidden.
const RoleRow = ({ experience, reduce }) => (
  <motion.article
    className="xp-row"
    variants={reduce ? undefined : rowVariants}
    initial={reduce ? false : "hidden"}
    whileInView="show"
    viewport={{ once: true, amount: 0.2 }}
  >
    <div className="xp-meta">
      <span className="xp-logo" style={{ background: experience.iconBg }}>
        <img src={experience.icon} alt="" width="26" height="26" />
      </span>
      <div>
        <p className="xp-company">{experience.company_name}</p>
        <p className="xp-date">{experience.date}</p>
      </div>
    </div>

    <div className="xp-body">
      <h3 className="xp-title">{experience.title}</h3>
      <ul className="xp-points">
        {experience.points.map((point, i) => (
          <motion.li key={i} variants={reduce ? undefined : pointVariants}>
            {renderPoint(point)}
          </motion.li>
        ))}
      </ul>
    </div>
  </motion.article>
);

const Experience = () => {
  const reduce = useReducedMotion();

  return (
    <>
      <style>{`
        .xp-list {
          display: flex;
          flex-direction: column;
          gap: clamp(56px, 8vh, 96px);
        }
        .xp-row {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
          gap: clamp(32px, 5vw, 96px);
          align-items: start;
        }
        .xp-meta {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .xp-logo {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .xp-logo img { width: 26px; height: 26px; object-fit: contain; }
        .xp-company {
          margin: 0 0 6px;
          font-size: 20px;
          font-weight: 400;
          line-height: 1.3;
          color: var(--fg);
        }
        .xp-date {
          margin: 0;
          font-size: 15px;
          font-weight: 300;
          color: rgba(var(--fg-rgb), 0.55);
        }
        .xp-title {
          margin: 0 0 22px;
          font-size: clamp(24px, 2.6vw, 34px);
          font-weight: 300;
          line-height: 1.15;
          letter-spacing: -0.01em;
          color: var(--fg);
        }
        .xp-points {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 14px;
          max-width: 66ch;
        }
        .xp-points li {
          position: relative;
          padding-left: 20px;
          font-size: 17px;
          font-weight: 300;
          line-height: 1.7;
          color: rgba(var(--fg-rgb), 0.72);
        }
        .xp-points li::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0.72em;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: rgba(var(--fg-rgb), 0.3);
        }
        .xp-metric { font-weight: 500; color: var(--fg); }
        .xp-resume {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: clamp(56px, 8vh, 96px);
          color: var(--fg);
          font-size: 14px;
          font-weight: 400;
          letter-spacing: 0.06em;
          text-decoration: none;
          cursor: none;
        }
        .xp-resume:hover { text-decoration: underline; text-underline-offset: 3px; }
        .xp-resume svg { transition: transform 0.2s; }
        .xp-resume:hover svg { transform: translate(2px, -2px); }
        .xp-resume:focus-visible { outline: 2px solid var(--fg); outline-offset: 3px; }

        @media (max-width: 767px) {
          .xp-row { grid-template-columns: minmax(0, 1fr); gap: 20px; }
          .xp-meta { flex-direction: row; align-items: center; gap: 14px; }
          .xp-company { font-size: 17px; margin-bottom: 2px; }
          .xp-date { font-size: 14px; }
          .xp-title { margin-bottom: 16px; }
          .xp-points li { font-size: 16px; }
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
        <div style={{ width: "100%", padding: "0 clamp(20px, 6vw, 120px)" }}>
          <motion.h2
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
            style={{
              fontSize: "clamp(38px, 5vw, 64px)",
              fontWeight: 300,
              color: "var(--fg)",
              letterSpacing: "-0.02em",
              lineHeight: 1,
              margin: "0 0 clamp(56px, 8vh, 88px)",
            }}
          >
            Work Experience.
          </motion.h2>

          <div className="xp-list">
            {experiences.map((exp) => (
              <RoleRow key={exp.company_name} experience={exp} reduce={reduce} />
            ))}
          </div>

          <a className="xp-resume" href={RESUME} target="_blank" rel="noopener noreferrer">
            Full resume
            <svg width="10" height="10" viewBox="0 0 12 12" aria-hidden="true">
              <path d="M1.5 10.5 10.5 1.5M10.5 1.5H4M10.5 1.5V8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </section>
    </>
  );
};

export default Experience;
