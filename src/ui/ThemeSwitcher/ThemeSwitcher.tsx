import { useTheme } from '../theme/ThemeContext';
import type { Theme } from '../theme/ThemeContext';
import styles from './ThemeSwitcher.module.css';

const OPTIONS: Array<{ value: Theme; label: string }> = [
  { value: 'system', label: 'Sistema' },
  { value: 'light', label: 'Claro' },
  { value: 'dark', label: 'Oscuro' },
];

// Control segmentado de HANDOFF.md §8.9 ("Tema"). Adelantado en M0 por su
// propia definición de terminado — ver design.md, Decisión 3.
export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div className={styles.group} role="radiogroup" aria-label="Tema">
      {OPTIONS.map((option) => {
        const active = theme === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            className={active ? `${styles.option} ${styles.optionActive}` : styles.option}
            onClick={() => setTheme(option.value)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
