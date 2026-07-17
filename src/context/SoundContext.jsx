import React, { createContext, useContext, useRef, useState, useEffect, useCallback } from "react";

const SoundContext = createContext(null);

// Map logical names → audio file paths (files live in /public/sounds/)
const SFX = {
  click: "/sounds/click.mp3",  // soft tick — nav, cards, buttons
  close: "/sounds/close.mp3",  // modal close
};

const AMBIENT = "/sounds/ambient-space.mp3"; // looping cinematic drone

export const SoundProvider = ({ children }) => {
  // ALWAYS start muted. Browsers block audio until a real user gesture,
  // so restoring an "unmuted" state on load would desync the UI from reality.
  const [muted, setMuted] = useState(true);

  const buffers = useRef({});      // preloaded SFX Audio elements
  const ambientRef = useRef(null); // ambient Audio element

  // Preload SFX + ambient once
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

  // OPTIONAL: if the user previously enabled sound, auto-resume it — but only
  // after their first real gesture on the page (to satisfy autoplay policy).
  useEffect(() => {
    const wasUnmuted = localStorage.getItem("sound-muted") === "false";
    if (!wasUnmuted) return;

    const unlock = () => {
      setMuted(false);
      window.removeEventListener("pointerdown", unlock);
    };
    window.addEventListener("pointerdown", unlock);
    return () => window.removeEventListener("pointerdown", unlock);
  }, []);

  // SINGLE source of truth for ambient: react to `muted` changes.
  // Because `muted` only ever flips as a result of a user gesture
  // (toggle click, or the first-pointerdown unlock), amb.play() is allowed.
  useEffect(() => {
    localStorage.setItem("sound-muted", String(muted));
    const amb = ambientRef.current;
    if (!amb) return;

    if (muted) {
      fade(amb, amb.volume, 0, 400, () => amb.pause());
    } else {
      amb.play()
        .then(() => fade(amb, amb.volume || 0, 0.18, 800))
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

  // Simple toggle — the [muted] effect handles all ambient play/pause logic.
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