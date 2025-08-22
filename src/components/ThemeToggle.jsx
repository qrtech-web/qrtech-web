// src/components/ThemeToggle.jsx
import React from 'react';
import useDarkMode from '../hooks/useDarkMode';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [dark, setDark] = useDarkMode();
  return (
    <button
      onClick={() => setDark(!dark)}
      className="p-2 rounded focus:outline-none"
      aria-label="Toggle dark mode"
    >
      {dark ? <Sun /> : <Moon />}
    </button>
  );
}
