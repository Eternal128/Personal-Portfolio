import React, { createContext, useContext, useRef, useState, useEffect, useCallback } from "react";

const SoundContext = createContext(null);

// One-shot SFX (files live in /public/sounds/)
const SFX = {
  click: "/sounds/click.mp3",  // nav, cards, buttons
  close: "/sounds/close.mp3",  // modal close
};

const AMBIENT = "/sounds/ambient-space.mp3"; // looping cinematic drone

export const SoundProvider = ({ children }) => {
  // ALWAYS start muted. Nothing auto-starts — music only begins when the
  // user explicitly unmutes (loader "Enter" click or the toggle button).
  const [muted, setMuted] = useState(true);

  const buffers = useRef({});      // preloaded SFX Audio elements
  const ambientRef = useRef(null); // ambient Audio element
  const startedAmbient = useRef(false);

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

  // SINGLE source of truth for ambient: react to `muted` changes.
  // Because `muted` only ever flips from a real user gesture (loader Enter
  // click or the toggle button), amb.play() is always allowed.
  // NOTE: there is intentionally NO "auto-unlock on first gesture" effect,
  // so the ambient never plays during the loader screen.
  useEffect(() => {
    const amb = ambientRef.current;
    if (!amb) return;

    if (muted) {
      fade(amb, amb.volume, 0, 400, () => amb.pause());
    } else {
      startedAmbient.current = true;
      amb.play()
        .then(() => fade(amb, amb.volume || 0, 0.18, 900))
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

  // Simple toggle — the [muted] effect handles all ambient play/pause.
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