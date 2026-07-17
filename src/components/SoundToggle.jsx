import React from "react";
import { motion } from "framer-motion";
import { useSound } from "../context/SoundContext";

const SoundToggle = () => {
  const { muted, toggleMute } = useSound();

  return (
    <motion.button
      onClick={toggleMute}
      aria-label={muted ? "Enable sound" : "Mute sound"}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      style={{
        position: "fixed", bottom: 24, right: 24, zIndex: 12000,
        width: 44, height: 44, borderRadius: "50%",
        background: "rgba(14,14,14,0.9)", backdropFilter: "blur(8px)",
        border: "1px solid rgba(212,180,100,0.3)",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", color: "rgba(212,180,100,0.9)",
      }}
    >
      {/* animated equalizer bars when playing, muted icon when off */}
      {muted ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M11 5 6 9H2v6h4l5 4V5z" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      ) : (
        <div style={{ display: "flex", gap: 2, alignItems: "flex-end", height: 16 }}>
          {[0, 1, 2, 3].map((n) => (
            <motion.span key={n}
              animate={{ height: [4, 14, 6, 12, 4] }}
              transition={{ duration: 1, repeat: Infinity, delay: n * 0.12, ease: "easeInOut" }}
              style={{ width: 3, background: "currentColor", borderRadius: 2, display: "block" }}
            />
          ))}
        </div>
      )}
    </motion.button>
  );
};

export default SoundToggle;