import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { styles } from "../styles";

const DURATION = 0.25;
const STAGGER = 0.025;

const FlipLink = ({ children, href }) => {
  return (
    <motion.a
      initial="initial"
      whileHover="hovered"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="relative block overflow-hidden whitespace-nowrap text-sm sm:text-base md:text-lg font-bold uppercase"
      style={{
        lineHeight: 1,
      }}
    >
      <div>
        {children.split("").map((l, i) => (
          <motion.span
            variants={{
              initial: {
                y: 0,
              },
              hovered: {
                y: "-100%",
              },
            }}
            transition={{
              duration: DURATION,
              ease: "easeInOut",
              delay: STAGGER * i,
            }}
            className="inline-block text-white"
            key={i}
          >
            {l}
          </motion.span>
        ))}
      </div>
      <div className="absolute inset-0">
        {children.split("").map((l, i) => (
          <motion.span
            variants={{
              initial: {
                y: "100%",
              },
              hovered: {
                y: 0,
              },
            }}
            transition={{
              duration: DURATION,
              ease: "easeInOut",
              delay: STAGGER * i,
            }}
            className="inline-block bg-gradient-to-r from-[#d1e6ff] to-[#84b3e8] bg-clip-text text-transparent"
            key={i}
          >
            {l}
          </motion.span>
        ))}
      </div>
    </motion.a>
  );
};

const End = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Semicircle moves up from top middle as you scroll
  const circleY = useTransform(scrollYProgress, [0, 1], ["0%", "-100%"]);

  return (
    <section
      ref={ref}
      className="relative w-full min-h-screen bg-black overflow-hidden flex items-center justify-center"
    >
      {/* White Semicircle Overlay that moves up from top middle */}
      <motion.div
        style={{
          y: circleY,
        }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[100vw] h-[50vh] pointer-events-none z-20"
      >
        <div
          className="w-full h-full rounded-b-full bg-white"
          style={{
            boxShadow: "0 20px 60px rgba(255, 255, 255, 0.1)",
          }}
        />
      </motion.div>

      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(209, 230, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(209, 230, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-[#d1e6ff] rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Left Side - Main Heading */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex-1"
        >
          <p className={`${styles.sectionSubText}`}>Connect with me</p>
          <h2 className={`${styles.sectionHeadText} mt-4`}>
            Let's Build
            <br />
            <span className="text-[#d1e6ff]">Together</span>
          </h2>
          <p className="mt-6 text-secondary text-[17px] max-w-xl leading-relaxed">
            I'm always open to new opportunities, collaborations, and
            interesting projects. Whether you want to work together or just
            say hi, feel free to reach out!
          </p>

          {/* Email */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-8"
          >
            <p className="text-secondary text-sm uppercase tracking-wider mb-2">
              Email
            </p>
            <a
              href="mailto:james.hanzell@mail.utoronto.ca"
              className="text-white text-xl font-semibold hover:text-[#d1e6ff] transition-colors"
            >
              james.hanzell@mail.utoronto.ca
            </a>
          </motion.div>

          {/* Location */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-6"
          >
            <p className="text-secondary text-sm uppercase tracking-wider mb-2">
              Location
            </p>
            <p className="text-white text-xl font-semibold">
              Toronto, Ontario 🇨🇦
            </p>
          </motion.div>
        </motion.div>

        {/* Right Side - Social Links (Small) */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col gap-6 items-start lg:items-end"
        >
          <div className="text-right">
            <p className="text-secondary text-xs uppercase tracking-wider mb-4">
              Follow Me
            </p>
            <div className="flex flex-col gap-3 items-start lg:items-end">
              <FlipLink href="https://linkedin.com/in/jameswilliamhanzell">
                LinkedIn
              </FlipLink>
              <FlipLink href="https://github.com/Eternal128">GitHub</FlipLink>
              <FlipLink href="https://tiktok.com/@yourhandle">
                TikTok
              </FlipLink>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-secondary text-sm">
            © 2025 James William Hanzell
          </p>
          <p className="text-secondary text-sm">
            Built with Fun
          </p>
        </div>
      </div>

      {/* Decorative Elements */}
      <motion.div
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-20 right-20 w-64 h-64 border border-[#d1e6ff]/20 rounded-full pointer-events-none"
      />
      <motion.div
        animate={{
          rotate: -360,
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute bottom-20 left-20 w-48 h-48 border border-[#d1e6ff]/20 rounded-full pointer-events-none"
      />
    </section>
  );
};

export default End;