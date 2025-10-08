import React, { useState } from "react";
import { motion } from "framer-motion";
import { styles } from "../styles";

const SocialLink = ({ platform, icon, url, color, delay }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.8, ease: "easeOut" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group"
    >
      <motion.div
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 flex flex-col items-center justify-center bg-tertiary rounded-2xl border-2 border-transparent hover:border-[#d1e6ff] transition-all duration-300"
        style={{
          boxShadow: isHovered ? `0 0 40px ${color}` : 'none',
        }}
      >
        {/* Icon */}
        <motion.div
          animate={{ scale: isHovered ? 1.2 : 1, rotate: isHovered ? 360 : 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl sm:text-6xl md:text-7xl mb-2"
        >
          {icon}
        </motion.div>

        {/* Platform Name */}
        <motion.p
          animate={{ y: isHovered ? -5 : 0 }}
          className="text-white font-bold text-lg sm:text-xl"
        >
          {platform}
        </motion.p>

        {/* Hover Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 0.1 : 0 }}
          className="absolute inset-0 rounded-2xl"
          style={{ background: color }}
        />
      </motion.div>

      {/* Decorative Corner */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute -top-2 -right-2 w-6 h-6 bg-[#d1e6ff] rounded-full"
      />
    </motion.a>
  );
};

const End = () => {
  const socials = [
    {
      platform: "LinkedIn",
      icon: "💼",
      url: "https://linkedin.com/in/jameswilliamhanzell", // Replace with your LinkedIn
      color: "rgba(10, 102, 194, 0.5)",
      delay: 0.2,
    },
    {
      platform: "TikTok",
      icon: "🎵",
      url: "https://tiktok.com/@yourhandle", // Replace with your TikTok
      color: "rgba(254, 44, 85, 0.5)",
      delay: 0.4,
    },
    {
      platform: "GitHub",
      icon: "💻",
      url: "https://github.com/Eternal128",
      color: "rgba(88, 166, 255, 0.5)",
      delay: 0.6,
    },
  ];

  return (
    <section className="relative w-full min-h-screen bg-black overflow-hidden py-20 flex items-center justify-center">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(209, 230, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(209, 230, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Floating Particles */}
      {[...Array(15)].map((_, i) => (
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

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.p
            className={`${styles.sectionSubText} text-center`}
          >
            Connect with me
          </motion.p>
          <motion.h2
            className={`${styles.sectionHeadText} text-center`}
          >
            Let's Stay in <span className="text-[#d1e6ff]">Touch</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-4 text-secondary text-[17px] max-w-3xl mx-auto"
          >
            Follow my journey, check out my code, or connect professionally.
            <br />
            I'm always open to collaborations and new opportunities!
          </motion.p>
        </motion.div>

        {/* Social Links */}
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 lg:gap-16">
          {socials.map((social, index) => (
            <SocialLink key={social.platform} {...social} />
          ))}
        </div>

        {/* Footer Text */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 1 }}
          className="text-center mt-20"
        >
          <p className="text-secondary text-sm">
            © 2025 James William Hanzell. Built with passion and code.
          </p>
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="inline-block mt-4 text-2xl"
          >
            ❤️
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative Circles */}
      <motion.div
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-20 right-20 w-64 h-64 border border-[#d1e6ff]/20 rounded-full"
      />
      <motion.div
        animate={{
          rotate: -360,
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute bottom-20 left-20 w-48 h-48 border border-[#d1e6ff]/20 rounded-full"
      />
    </section>
  );
};

export default End;