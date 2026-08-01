// src/hooks/useLocalStorage.js
// Reusable, generic localStorage-backed state hook.
//
// NOTE: previously this exact hook was defined twice in the codebase
// (once, unused, at src/useLocalStorage.js, and again inline inside
// Resume.js). This is now the single source of truth.
import { useState, useEffect } from 'react';

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error retrieving from localStorage:', error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
