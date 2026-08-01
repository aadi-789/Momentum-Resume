// src/context/ThemeContext.js
// Global theme (dark/light) state. Context holds ONLY state + the setter —
// no UI, no utility functions, no API calls (see project architecture rules).
import React, { createContext, useContext, useState, useEffect } from 'react';
import { STORAGE_KEYS } from '../constants/resumeDefaults';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const getInitialTheme = () => {
  const storedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
  if (storedTheme) return storedTheme === 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem(STORAGE_KEYS.THEME, isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
