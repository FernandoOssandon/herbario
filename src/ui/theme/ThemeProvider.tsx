import { useEffect, useState, type ReactNode } from 'react';

import { ThemeContext, type Theme } from './ThemeContext';

// Colores de HANDOFF.md §5.2 / design/tokens.css.
const THEME_COLOR: Record<'light' | 'dark', string> = {
  light: '#F7F4EC',
  dark: '#0E110D',
};

function prefersDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');

  if (theme === 'system') {
    delete root.dataset.theme;
    metaThemeColor?.setAttribute('content', prefersDark() ? THEME_COLOR.dark : THEME_COLOR.light);
    return;
  }

  root.dataset.theme = theme;
  metaThemeColor?.setAttribute('content', THEME_COLOR[theme]);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('system');

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}
