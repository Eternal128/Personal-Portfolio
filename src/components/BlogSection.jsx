import React from 'react';
import { motion } from 'framer-motion';
import { POSTS } from '../constants/posts';

const PREVIEW_COUNT = 5;

const BlogSection = ({ onOpenBlog, onOpenPost }) => {
  const previews = POSTS.slice(0, PREVIEW_COUNT);

  return (
    <section
      id="blog"
      style={{
        fontFamily: "'DM Sans', sans-serif",
        padding: '120px 0 100px',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <style>{`
        .blog-sec-wrap { width: 100%; padding: 0 clamp(24px, 6vw, 120px); }
        .blog-sec-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 24px;
          margin-top: 48px;
        }
        .blog-card {
          text-align: left;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          overflow: hidden;
          padding: 0 0 24px;
          cursor: pointer;
          transition: background 0.3s ease, border-color 0.3s ease, transform 0.3s ease;
          font-family: 'DM Sans', sans-serif;
        }
        .blog-card:hover {
          background: rgba(255,255,255,0.045);
          border-color: rgba(255,255,255,0.16);
          transform: translateY(-4px);
        }
        .blog-card:hover .blog-card-arrow { transform: translateX(5px); }
        .blog-card:hover .blog-card-thumb img,
        .blog-card:hover .blog-card-thumb video { transform: scale(1.05); }
        .blog-card-arrow { transition: transform 0.35s cubic-bezier(0.16,1,0.3,1); }
        .blog-card-body { padding: 22px 24px 0; }
        .blog-card-thumb {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 10;
          overflow: hidden;
          background: rgba(255,255,255,0.03);
        }
        .blog-card-thumb img,
        .blog-card-thumb video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.5s cubic-bezier(0.16,1,0.3,1);
        }
        @media (max-width: 900px) {
          .blog-sec-wrap { padding: 0 22px; }
          .blog-sec-grid { grid-template-columns: 1fr; gap: 16px; }
        }
      `}</style>

      <div className="blog-sec-wrap">
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
          <div>
            <div style={{
              fontFamily: "'DM Mono', monospace", fontSize: 11,
              letterSpacing: '0.28em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.4)', marginBottom: 18,
            }}>
              Journal
            </div>
            <h2 style={{
              fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 300,
              color: '#fff', letterSpacing: '-0.02em', lineHeight: 1,
            }}>
              Thoughts & process.
            </h2>
          </div>

          <button
            onClick={onOpenBlog}
            style={{
              padding: '11px 22px', borderRadius: 100,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.85)',
              fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 300,
              letterSpacing: '0.02em', cursor: 'pointer', whiteSpace: 'nowrap',
              transition: 'background 0.2s, border-color 0.2s, color 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.85)'; }}
          >
            See all posts →
          </button>
        </div>

        {/* Preview cards */}
        <div className="blog-sec-grid">
          {previews.map((p, i) => (
            <motion.button
              key={p.id}
              className="blog-card"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              onClick={() => onOpenPost(p)}
            >
              <div className="blog-card-thumb">
                {p.thumbnail ? (
                  <img src={p.thumbnail} alt="" />
                ) : p.hero?.type === 'video' ? (
                  <video src={p.hero.src} autoPlay muted loop playsInline />
                ) : null}
              </div>

              <div className="blog-card-body">
                <div style={{
                  fontFamily: "'DM Mono', monospace", fontSize: 10,
                  letterSpacing: '0.22em', textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.4)', marginBottom: 14,
                  display: 'flex', justifyContent: 'space-between',
                }}>
                  <span>{p.kicker}</span>
                  <span>{p.date} · {p.readingTime}</span>
                </div>
                <h3 style={{
                  fontSize: 21, fontWeight: 400, color: '#fff',
                  lineHeight: 1.2, marginBottom: 12, letterSpacing: '-0.01em',
                }}>
                  {p.title}
                </h3>
                <p style={{
                  fontSize: 14, fontWeight: 300, lineHeight: 1.6,
                  color: 'rgba(255,255,255,0.5)', marginBottom: 20,
                }}>
                  {p.excerpt}
                </p>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  fontSize: 12, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.02em',
                }}>
                  Read <span className="blog-card-arrow">↗</span>
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;