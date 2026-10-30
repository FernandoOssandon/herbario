import { createContext, useContext } from 'react';

// Ver HANDOFF.md §5.2. Persistencia en Settings.theme queda para cuando
// Dexie exista (M2) — ver design.md del change m0-base-proyecto, Decisión 4.
export type Theme = 'system' | 'light' | 'dark';

export interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe usarse dentro de <ThemeProvider>');
  }
  return context;
}
