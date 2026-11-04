import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({ theme: 'light', toggleTheme: () => {} });

// Only an explicit toggle is saved, so light stays the default for everyone
// who hasn't chosen dark. (The old 'theme' key was written on every visit.)
const STORAGE_KEY = 'theme-choice';
const THEME_COLOR = { light: '#f5f3ee', dark: '#000000' };

const getInitialTheme = () => {
  if (typeof window === 'undefined') return 'light';
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[theme]);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => {
    const next = t === 'dark' ? 'light' : 'dark';
    try { window.localStorage.setItem(STORAGE_KEY, next); } catch { /* private mode: still toggles */ }
    return next;
  });

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
