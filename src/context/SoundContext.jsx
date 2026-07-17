import React, { createContext, useContext, useRef, useState, useEffect, useCallback } from "react";

const SoundContext = createContext(null);
const SFX = {
  click: "/sounds/click.mp3",  // soft tick — nav, cards, buttons
  close: "/sounds/close.mp3",  // modal close
};

const AMBIENT = "/sounds/ambient-space.mp3"; // looping cinematic drone

export const SoundProvider = ({ children }) => {
  const [muted, setMuted] = useState(() => {
    return localStorage.getItem("sound-muted") === "true";
  });

  const buffers = useRef({});      
  const ambientRef = useRef(null);  
  const startedRef = useRef(false); 

  useEffect(() => {
    Object.entries(SFX).forEach(([key, src]) => {
      const a = new Audio(src);
      a.preload = "auto";
      a.volume = 0.35;
      buffers.current[key] = a;
    });

    const amb = new Audio(AMBIENT);
    amb.loop = true;
    amb.volume = 0; // fade in later
    ambientRef.current = amb;

    return () => {
      amb.pause();
    };
  }, []);

  const attemptStart = useCallback(() => {
    if (startedRef.current) return;
    const amb = ambientRef.current;
    if (!amb) return;

    amb.play()
      .then(() => {
        startedRef.current = true;
        setMuted(false);
        fade(amb, amb.volume || 0, 0.18, 900);
      })
      .catch(() => {
      });
  }, []);

  useEffect(() => {
    if (localStorage.getItem("sound-muted") === "true") return;

    attemptStart();

    const unlock = () => {
      attemptStart();
      if (startedRef.current) removeListeners();
    };
    const removeListeners = () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
      window.removeEventListener("touchstart", unlock);
    };

    window.addEventListener("pointerdown", unlock);
    window.addEventListener("keydown", unlock);
    window.addEventListener("touchstart", unlock);

    return removeListeners;
  }, [attemptStart]);

  // SINGLE source of truth for ambient: react to `muted` changes from
  // the toggle button. The auto-start flow above also flips `muted` to
  // false once it succeeds, which is handled by `startedRef` so this
  // effect doesn't try to double-start it.
  useEffect(() => {
    localStorage.setItem("sound-muted", String(muted));
    const amb = ambientRef.current;
    if (!amb) return;

    if (muted) {
      startedRef.current = false;
      fade(amb, amb.volume, 0, 400, () => amb.pause());
    } else if (!startedRef.current) {
      amb.play()
        .then(() => {
          startedRef.current = true;
          fade(amb, amb.volume || 0, 0.18, 800);
        })
        .catch(() => {});
    }
  }, [muted]);

  // Play a one-shot SFX by name
  const play = useCallback((name) => {
    if (muted) return;
    const base = buffers.current[name];
    if (!base) return;
    const node = base.cloneNode();
    node.volume = base.volume;
    node.play().catch(() => {});
  }, [muted]);

  // Simple toggle
  const toggleMute = useCallback(() => {
    setMuted((m) => !m);
  }, []);

  return (
    <SoundContext.Provider value={{ muted, toggleMute, play }}>
      {children}
    </SoundContext.Provider>
  );
};

// Tiny linear fade helper
function fade(audio, from, to, ms, done) {
  const steps = 20;
  const stepMs = ms / steps;
  let i = 0;
  audio.volume = Math.max(0, Math.min(1, from));
  const id = setInterval(() => {
    i++;
    audio.volume = Math.max(0, Math.min(1, from + (to - from) * (i / steps)));
    if (i >= steps) {
      clearInterval(id);
      done && done();
    }
  }, stepMs);
}

export const useSound = () => {
  const ctx = useContext(SoundContext);
  if (!ctx) return { muted: true, toggleMute: () => {}, play: () => {} };
  return ctx;
};