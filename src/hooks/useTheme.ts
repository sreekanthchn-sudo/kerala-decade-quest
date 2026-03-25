'use client';

import { useState, useEffect, useCallback } from 'react';

type Theme = 'dark';

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>('dark');

  useEffect(() => {
    const initial: Theme = 'dark';
    setThemeState(initial);
    document.documentElement.setAttribute('data-theme', initial);
  }, []);

  const setTheme = useCallback((t: Theme) => {
    // Dark-theme-only app: keep API surface, but only allow 'dark'.
    setThemeState(t);
    document.documentElement.setAttribute('data-theme', t);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme('dark');
  }, [theme, setTheme]);

  return { theme, setTheme, toggleTheme, isDark: theme === 'dark' };
}
