import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { technologies, projects, experiences } from "../constants";
import { useSound } from "../context/SoundContext";

const LEVEL_BAR = { Expert: 1, Advanced: 0.75, Intermediate: 0.5, Beginner: 0.25 };

const SKILL_PROJECTS = {
  "React": ["Editing Portfolio", "Roomie", "QuietSpace", "Personal Portfolio"],
  "JavaScript": ["Editing Portfolio", "QuietSpace", "Personal Portfolio"],
  "TypeScript": ["Roomie"],
  "Three.js": ["Editing Portfolio", "Personal Portfolio"],
  "Tailwind CSS": ["Editing Portfolio", "Roomie", "QuietSpace", "Personal Portfolio"],
  "Node.js": ["Roomie"],
  "Vercel": ["Editing Portfolio", "QuietSpace", "Personal Portfolio"],
  "Docker": ["Roomie"],
  "Python": ["COVID-19 X-Ray Classification", "Jakarta Route Optimization", "Spotify Music Recommender", "Machine Learning Projects"],
  "TensorFlow": ["COVID-19 X-Ray Classification"],
  "PyTorch": ["Spotify Music Recommender"],
  "Flutter": ["Meal App"],
  "Java": ["Arcade Game using Java"],
};

const SKILL_JOBS = {
  "Next.js": [
    { company: "Lirvana Labs", point: "Shipped AI-generated learning activities in a Next.js, TypeScript, React & Rust monorepo." },
    { company: "Ernst & Young (EY)", point: "Built internal tooling and client-facing workflows using a Next.js frontend." },
  ],
  "TypeScript": [
    { company: "Lirvana Labs", point: "Typed a large Next.js + React monorepo across 14 production files." },
  ],
  "React": [
    { company: "Lirvana Labs", point: "Built student-facing quiz, lesson, and Timeline flows in React." },
  ],
  "Rust": [
    { company: "Lirvana Labs", point: "Contributed to a Next.js + Rust monorepo powering learning activities." },
  ],
  "Node.js": [
    { company: "Lirvana Labs", point: "Backend runtime and server-side rendering within the production monorepo." },
  ],
  "Docker": [
    { company: "Ernst & Young (EY)", point: "Containerized AI/ETL pipelines for consistent, reproducible deployments." },
    { company: "Lirvana Labs", point: "Used Docker for consistent build and deployment environments." },
  ],
  "Selenium": [
    { company: "Ernst & Young (EY)", point: "Automated web scraping and social sentiment pipelines with Selenium." },
  ],
  "Azure AI": [
    { company: "Ernst & Young (EY)", point: "Built a speech-driven AI interviewer using the Azure AI Speech SDK." },
  ],
  "Postman": [
    { company: "Ernst & Young (EY)", point: "Designed and tested REST APIs across proposal-generation services." },
  ],
  "Python": [
    { company: "Ernst & Young (EY)", point: "Built a Python ETL pipeline processing 25,000+ WHO records into an LLM workflow." },
  ],
  "LangChain": [
    { company: "PT. Japfa Comfeed Indonesia", point: "PDF vectorization and semantic retrieval with LangChain + OpenAI API." },
  ],
  "Flutter": [
    { company: "Mitra Integrasi Informatika (Metrodata Group)", point: "Built a Flutter frontend for an LLM natural-language processing system." },
  ],
  "Git": [
    { company: "University of Toronto", point: "Version control across all coursework and collaborative CS projects." },
    { company: "Lirvana Labs", point: "Daily Git workflow across a production monorepo." },
    { company: "Ernst & Young (EY)", point: "Managed code collaboration during the AI development internship." },
  ],
};

const SKILL_HIGHLIGHT = {
  "C / C++": {
    badge: "Competitive Programming",
    title: "Informatics Olympiad",
    body: "Used C++ extensively for competitive programming — solving algorithmic problems under time pressure with a focus on data structures, complexity, and optimization.",
  },
};

const findProject = (nameList) =>
  (nameList || []).map((n) => projects.find((p) => p.name === n)).filter(Boolean);

const findJobMeta = (companyName) =>
  experiences.find((e) => e.company_name === companyName);

const TechCard = ({ name, icon, level, description, invert, index, onClick }) => {
  const [hovered, setHovered] = useState(false);
  const { play } = useSound();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5, delay: index * 0.04, ease: [0.25, 0.46, 0.45, 0.94] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => { play("click"); onClick(name); }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.97 }}
      style={{
        position: "relative",
        background: hovered ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.02)",
        border: `1px solid ${hovered ? "rgba(212,180,100,0.35)" : "rgba(255,255,255,0.06)"}`,
        borderRadius: 16, padding: "24px 20px",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
        cursor: "pointer", transition: "background 0.3s, border-color 0.3s",
        overflow: "visible",
      }}
    >
      {/* Tooltip — absolute, lives inside the card, scrolls with it natively */}
      {hovered && (
        <div
          style={{
            position: "absolute", left: "50%", bottom: "100%", transform: "translateX(-50%)",
            marginBottom: 12, width: 210, background: "rgba(10,10,10,0.96)",
            border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "10px 16px",
            zIndex: 50, pointerEvents: "none", fontFamily: "'DM Sans', sans-serif",
          }}
        >
          <p style={{ fontSize: 12, fontWeight: 300, color: "rgba(255,255,255,0.55)", lineHeight: 1.6, textAlign: "center", margin: 0 }}>
            {description}
          </p>
          <div style={{
            position: "absolute", bottom: -5, left: "50%", transform: "translateX(-50%) rotate(45deg)",
            width: 8, height: 8, background: "rgba(10,10,10,0.96)",
            borderRight: "1px solid rgba(255,255,255,0.1)", borderBottom: "1px solid rgba(255,255,255,0.1)",
          }} />
        </div>
      )}

      <span style={{
        position: "absolute", top: 10, right: 12, fontSize: 12, lineHeight: 1,
        color: "rgba(212,180,100,0.9)", opacity: hovered ? 1 : 0,
        transform: hovered ? "translateY(0)" : "translateY(-3px)",
        transition: "opacity 0.3s ease, transform 0.3s ease", pointerEvents: "none",
      }}>↗</span>

      <div style={{ width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <img src={icon} alt={name} style={{
          width: 36, height: 36, objectFit: "contain",
          filter: `${invert ? "invert(1) " : ""}${hovered ? "grayscale(0%) brightness(1)" : "grayscale(100%) brightness(0.7)"}`,
          transition: "filter 0.4s ease",
        }} />
      </div>

      <p style={{
        fontSize: 13, fontWeight: 300,
        color: hovered ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.5)",
        letterSpacing: "0.02em", textAlign: "center",
        fontFamily: "'DM Sans', sans-serif", transition: "color 0.3s", margin: 0,
      }}>{name}</p>

      <div style={{ width: "100%", height: 2, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${(LEVEL_BAR[level] || 0.5) * 100}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: index * 0.04 + 0.3, ease: "easeOut" }}
          style={{
            height: "100%",
            background: hovered ? "rgba(212,180,100,0.88)" : "rgba(255,255,255,0.25)",
            borderRadius: 2, transition: "background 0.3s",
          }}
        />
      </div>

      <div style={{ position: "relative", height: 14, width: "100%" }}>
        <span style={{
          position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 10, fontWeight: 300, color: "rgba(255,255,255,0.22)",
          letterSpacing: "0.12em", textTransform: "uppercase", whiteSpace: "nowrap",
          fontFamily: "'DM Sans', sans-serif", opacity: hovered ? 0 : 1, transition: "opacity 0.35s ease",
        }}>{level}</span>
        <span style={{
          position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 10, fontWeight: 300, color: "rgba(212,180,100,0.85)",
          letterSpacing: "0.06em", textTransform: "uppercase", whiteSpace: "nowrap",
          fontFamily: "'DM Sans', sans-serif", opacity: hovered ? 1 : 0, transition: "opacity 0.35s ease",
        }}>View details →</span>
      </div>
    </motion.div>
  );
};

const SectionLabel = ({ children }) => (
  <p style={{
    margin: "0 0 12px", fontSize: 10, fontWeight: 400, letterSpacing: "0.16em",
    textTransform: "uppercase", color: "rgba(212,180,100,0.7)",
  }}>{children}</p>
);

const ProjectRow = ({ p }) => (
  <div style={{ display: "flex", gap: 16, padding: 14, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14 }}>
    {p.image && <img src={p.image} alt={p.name} style={{ width: 84, height: 60, objectFit: "cover", borderRadius: 8, flexShrink: 0 }} />}
    <div style={{ flex: 1, minWidth: 0 }}>
      <p style={{ margin: 0, fontSize: 15, fontWeight: 500, color: "#fff" }}>{p.name}</p>
      <p style={{ margin: "4px 0 8px", fontSize: 12.5, lineHeight: 1.5, color: "rgba(255,255,255,0.45)" }}>{p.description}</p>
      <div style={{ display: "flex", gap: 14 }}>
        {p.source_code_link && <a href={p.source_code_link} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: "rgba(212,180,100,0.85)", textDecoration: "none" }}>Code ↗</a>}
        {p.live_demo_link && <a href={p.live_demo_link} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: "rgba(212,180,100,0.85)", textDecoration: "none" }}>Live Demo ↗</a>}
      </div>
    </div>
  </div>
);

const JobRow = ({ job }) => {
  const meta = findJobMeta(job.company);
  return (
    <div style={{ display: "flex", gap: 14, padding: 14, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14 }}>
      <div style={{
        width: 40, height: 40, borderRadius: 10, flexShrink: 0, overflow: "hidden",
        background: meta?.iconBg || "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {meta?.icon && <img src={meta.icon} alt={job.company} style={{ width: "78%", height: "78%", objectFit: "contain" }} />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: "#fff" }}>{job.company}</p>
          {meta?.date && <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", whiteSpace: "nowrap" }}>{meta.date}</span>}
        </div>
        {meta?.title && <p style={{ margin: "1px 0 6px", fontSize: 11, fontWeight: 400, color: "rgba(212,180,100,0.75)" }}>{meta.title}</p>}
        <p style={{ margin: 0, fontSize: 12, lineHeight: 1.55, color: "rgba(255,255,255,0.45)" }}>{job.point}</p>
      </div>
    </div>
  );
};

const HighlightCard = ({ data }) => (
  <div style={{
    padding: 22, borderRadius: 16,
    background: "linear-gradient(135deg, rgba(212,180,100,0.10) 0%, rgba(212,180,100,0.02) 100%)",
    border: "1px solid rgba(212,180,100,0.28)",
  }}>
    <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(212,180,100,0.85)" }}>
      {data.badge}
    </span>
    <p style={{ margin: "8px 0 6px", fontSize: 17, fontWeight: 500, color: "#fff" }}>🏆 {data.title}</p>
    <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: "rgba(255,255,255,0.55)" }}>{data.body}</p>
  </div>
);

const SkillModal = ({ skill, onClose }) => {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  if (!skill) return null;
  const skillIcon = technologies.find((t) => t.name === skill.name);
  const projs = findProject(SKILL_PROJECTS[skill.name]);
  const jobs = SKILL_JOBS[skill.name] || [];
  const highlight = SKILL_HIGHLIGHT[skill.name];

  const totalParts = [];
  if (projs.length) totalParts.push(`${projs.length} ${projs.length === 1 ? "project" : "projects"}`);
  if (jobs.length) totalParts.push(`${jobs.length} ${jobs.length === 1 ? "role" : "roles"}`);
  const summary = totalParts.join(" · ") || (highlight ? highlight.badge : "Core toolkit");
  const hasContent = projs.length || jobs.length || highlight;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)",
        zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
        fontFamily: "'DM Sans', sans-serif", overflowY: "auto", overscrollBehavior: "contain",
      }}
    >
      <motion.div
        data-lenis-prevent
        initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 24, scale: 0.97 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: 560, maxHeight: "80vh", overflowY: "auto",
          WebkitOverflowScrolling: "touch", overscrollBehavior: "contain",
          background: "rgba(14,14,14,0.98)", border: "1px solid rgba(212,180,100,0.25)", borderRadius: 20, padding: 32,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 26 }}>
          {skillIcon && (
            <div style={{ width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.04)", borderRadius: 12 }}>
              <img src={skillIcon.icon} alt={skill.name} style={{ width: 28, height: 28, objectFit: "contain", filter: skillIcon.invert ? "invert(1)" : "none" }} />
            </div>
          )}
          <div>
            <h3 style={{ margin: 0, fontSize: 22, fontWeight: 400, color: "#fff", letterSpacing: "-0.01em" }}>{skill.name}</h3>
            <span style={{ fontSize: 11, color: "rgba(212,180,100,0.7)", letterSpacing: "0.14em", textTransform: "uppercase" }}>{summary}</span>
          </div>
          <button onClick={onClose} aria-label="Close" style={{
            marginLeft: "auto", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.6)", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 16, lineHeight: 1,
          }}>×</button>
        </div>

        {highlight && <div style={{ marginBottom: projs.length || jobs.length ? 26 : 0 }}><HighlightCard data={highlight} /></div>}

        {projs.length > 0 && (
          <div style={{ marginBottom: jobs.length ? 26 : 0 }}>
            <SectionLabel>In projects</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {projs.map((p) => <ProjectRow key={p.name} p={p} />)}
            </div>
          </div>
        )}

        {jobs.length > 0 && (
          <div>
            <SectionLabel>Used at work</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {jobs.map((j) => <JobRow key={j.company} job={j} />)}
            </div>
          </div>
        )}

        {!hasContent && (
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, lineHeight: 1.6, margin: 0 }}>
            Part of my core toolkit — applied across coursework and personal builds.
          </p>
        )}
      </motion.div>
    </div>
  );
};

const Tech = () => {
  const [activeSkill, setActiveSkill] = useState(null);
  const { play } = useSound();

  // Card already plays "click" on click; modal open stays silent (no whoosh).
  const handleClick = useCallback((name) => setActiveSkill({ name }), []);
  const handleClose = useCallback(() => { play("close"); setActiveSkill(null); }, [play]);

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,200;9..40,300;9..40,400;9..40,500&display=swap');`}</style>

      <AnimatePresence>
        {activeSkill && <SkillModal skill={activeSkill} onClose={handleClose} />}
      </AnimatePresence>

      <section id="tech" style={{ background: "transparent", padding: "100px 0 80px", fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 64px" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.7 }} style={{ marginBottom: 56 }}
          >
            <span style={{ fontSize: 11, fontWeight: 300, color: "rgba(255,255,255,0.28)", letterSpacing: "0.22em", textTransform: "uppercase", display: "block", marginBottom: 12 }}>
              My expertise
            </span>
            <h2 style={{ fontSize: "clamp(38px, 5vw, 64px)", fontWeight: 300, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1, margin: 0 }}>
              Technical Skills.
            </h2>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", marginTop: 14, fontWeight: 300 }}>
              Click any skill to see where I've used it.
            </p>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 10, rowGap: 48 }}>
            {technologies.map((tech, i) => (
              <TechCard key={tech.name} index={i} {...tech} onClick={handleClick} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Tech;