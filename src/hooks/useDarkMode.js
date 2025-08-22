// src/hooks/useDarkMode.js
import { useEffect, useState } from 'react';

export default function useDarkMode() {
  const [dark, setDark] = useState(() => {
    // primero, comprueba si el usuario ya eligió
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    // si no, usa preferencia del sistema
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (dark) root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  return [dark, setDark];
}
