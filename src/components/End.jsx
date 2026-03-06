import React, { useState } from 'react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';

const DURATION = 0.25;
const STAGGER = 0.025;

const FlipLink = ({ children, href }) => (
  <motion.a
    initial="initial"
    whileHover="hovered"
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="relative block overflow-hidden whitespace-nowrap text-[13px] uppercase tracking-[0.15em] font-light"
    style={{ lineHeight: 1.2, fontFamily: "'DM Sans', sans-serif" }}
  >
    <div>
      {children.split("").map((l, i) => (
        <motion.span
          key={i}
          variants={{ initial: { y: 0 }, hovered: { y: "-100%" } }}
          transition={{ duration: DURATION, ease: "easeInOut", delay: STAGGER * i }}
          className="inline-block text-white"
        >
          {l === " " ? "\u00A0" : l}
        </motion.span>
      ))}
    </div>
    <div className="absolute inset-0">
      {children.split("").map((l, i) => (
        <motion.span
          key={i}
          variants={{ initial: { y: "100%" }, hovered: { y: 0 } }}
          transition={{ duration: DURATION, ease: "easeInOut", delay: STAGGER * i }}
          className="inline-block"
          style={{ color: 'rgba(255,255,255,0.45)' }}
        >
          {l === " " ? "\u00A0" : l}
        </motion.span>
      ))}
    </div>
  </motion.a>
);

const ContactEnd = () => {
  const [form, setForm]       = useState({ name: '', email: '', message: '' });
  const [sent, setSent]       = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    emailjs.send(
      import.meta.env.VITE_APP_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID,
      {
        name:    form.name,
        email:   form.email,
        message: form.message,
      },
      import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY
    ).then(() => {
      setLoading(false);
      setSent(true);
      setForm({ name: '', email: '', message: '' });
    }).catch((err) => {
      setLoading(false);
      console.error(err);
      setError('Something went wrong. Please try again.');
    });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,200;9..40,300;9..40,400&display=swap');

        .contact-section {
          position: relative;
          width: 100%;
          min-height: 100vh;
          background: transparent;
          overflow: hidden;
          font-family: 'DM Sans', sans-serif;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .contact-input {
          width: 100%;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 14px 18px;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 300;
          outline: none;
          transition: border-color 0.3s ease, background 0.3s ease;
          resize: none;
        }
        .contact-input::placeholder { color: rgba(255,255,255,0.22); }
        .contact-input:focus {
          border-color: rgba(255,255,255,0.22);
          background: rgba(255,255,255,0.05);
        }

        .contact-submit {
          position: relative;
          padding: 13px 36px;
          border-radius: 100px;
          border: none;
          background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 40%, #252525 60%, #1a1a1a 100%);
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 300;
          letter-spacing: 0.06em;
          cursor: pointer;
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease;
          box-shadow: 0 0 0 1px rgba(255,255,255,0.08), 0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05);
        }
        .contact-submit:disabled { opacity: 0.5; cursor: not-allowed; }
        .contact-submit::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 100px;
          padding: 1.5px;
          background: transparent;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: destination-out;
          mask-composite: exclude;
          transition: background 0.4s ease;
        }
        .contact-submit:not(:disabled):hover {
          transform: translateY(-2px);
          box-shadow: 0 0 0 1px rgba(255,255,255,0.2), 0 6px 30px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08);
        }
        .contact-submit:not(:disabled):hover::before {
          background: linear-gradient(135deg,
            rgba(255,255,255,0.0) 0%, rgba(255,255,255,0.22) 50%,
            rgba(255,255,255,0.0) 100%);
        }

        .avail-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 7px 16px;
          border-radius: 100px;
          margin-bottom: 28px;
        }
        .avail-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #6ee99e;
          box-shadow: 0 0 6px rgba(110,233,158,0.7);
          animation: availPulse 2s ease-in-out infinite;
        }
        @keyframes availPulse {
          0%,100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>

      <section id="contact" className="contact-section">

        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 sm:px-16 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">

            {/* Left — info */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="avail-pill">
                <div className="avail-dot" />
                <span className="text-[12px] font-light tracking-[0.1em]" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  Available For Work
                </span>
              </div>

              <h2
                className="font-light leading-none tracking-tight mb-6"
                style={{
                  fontSize: 'clamp(36px, 5vw, 72px)',
                  background: 'linear-gradient(135deg, #ffffff 0%, #e8e8e8 30%, #ffffff 60%, #c8c8c8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Curious about me and what<br />we can create<br />
                <span style={{ color: 'rgba(255,255,255,0.4)', WebkitTextFillColor: 'rgba(255,255,255,0.4)' }}>
                  together?
                </span>
              </h2>

              <p className="text-[14px] font-light leading-relaxed max-w-sm mb-10" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Whether you want to work together or just say hi, I'd love to hear from you!
              </p>

              <div className="space-y-6 mb-12">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] mb-1.5" style={{ color: 'rgba(255,255,255,0.3)' }}>Email</p>
                  <a href="mailto:james.hanzell@mail.utoronto.ca" className="text-white text-[15px] font-light hover:opacity-60 transition-opacity">
                    james.hanzell@mail.utoronto.ca
                  </a>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] mb-1.5" style={{ color: 'rgba(255,255,255,0.3)' }}>Location</p>
                  <p className="text-white text-[15px] font-light">Toronto, Ontario</p>
                </div>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] mb-4" style={{ color: 'rgba(255,255,255,0.3)' }}>Follow Me</p>
                <div className="flex items-center gap-8">
                  <FlipLink href="https://www.linkedin.com/in/james-william-hanzell/">LinkedIn</FlipLink>
                  <div className="h-3 w-[1px]" style={{ background: 'rgba(255,255,255,0.1)' }} />
                  <FlipLink href="https://github.com/Eternal128">GitHub</FlipLink>
                  <div className="h-3 w-[1px]" style={{ background: 'rgba(255,255,255,0.1)' }} />
                  <FlipLink href="https://tiktok.com/@eternalglazer">TikTok</FlipLink>
                </div>
              </div>
            </motion.div>

            {/* Right — form */}
            <motion.divc
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {sent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center h-full py-20"
                >
                  <div className="w-14 h-14 rounded-full flex items-center justify-center mb-6" style={{ border: '1px solid rgba(255,255,255,0.15)' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <p className="text-white text-[18px] font-light text-center">Message sent.</p>
                  <p className="mt-2 text-[13px] font-light text-center" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    I'll get back to you as soon as possible.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div>
                    <label className="block text-[11px] uppercase tracking-[0.15em] mb-2.5" style={{ color: 'rgba(255,255,255,0.35)' }}>Your Name</label>
                    <input className="contact-input" type="text" name="name" value={form.name} onChange={handleChange} placeholder="What's your name?" required />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-[0.15em] mb-2.5" style={{ color: 'rgba(255,255,255,0.35)' }}>Your Email</label>
                    <input className="contact-input" type="email" name="email" value={form.email} onChange={handleChange} placeholder="What's your email address?" required />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-[0.15em] mb-2.5" style={{ color: 'rgba(255,255,255,0.35)' }}>Your Message</label>
                    <textarea className="contact-input" name="message" value={form.message} onChange={handleChange} placeholder="What do you want to say?" rows={6} required />
                  </div>
                  {error && (
                    <p className="text-[12px] font-light" style={{ color: 'rgba(255,100,100,0.8)' }}>{error}</p>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <button type="submit" className="contact-submit" disabled={loading}>
                      {loading ? 'Sending...' : 'Send Message'}
                    </button>
                    <p className="text-[11px] font-light" style={{ color: 'rgba(255,255,255,0.2)' }}>
                      I usually reply within 24h
                    </p>
                  </div>
                </form>
              )}
            </motion.divc>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 px-6 sm:px-16 pb-10" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 pt-8">
            <p className="text-[11px] font-light" style={{ color: 'rgba(255,255,255,0.25)' }}>© 2025 James William Hanzell</p>
            <p className="text-[11px] font-light" style={{ color: 'rgba(255,255,255,0.25)' }}>Built with React</p>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactEnd;