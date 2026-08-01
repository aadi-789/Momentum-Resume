// src/components/common/ThemeToggle.js
import React, { useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();
  const [isToggling, setIsToggling] = useState(false);

  const handleToggle = () => {
    if (isToggling) return;
    setIsToggling(true);
    toggleTheme();
    setTimeout(() => setIsToggling(false), 150);
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isToggling}
      className="p-2 rounded-lg surface hover:surface-secondary border border-border"
      style={{
        transition: 'background-color 0.1s cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: isToggling ? 0.7 : 1,
      }}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? (
        <Sun size={20} className="text-yellow-500" />
      ) : (
        <Moon size={20} className="text-slate-600" />
      )}
    </button>
  );
};

export default ThemeToggle;
