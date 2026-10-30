import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { ThemeProvider } from './ThemeProvider';
import { useTheme } from './ThemeContext';

function ThemeProbe() {
  const { theme, setTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme-value">{theme}</span>
      <button onClick={() => setTheme('light')}>Claro</button>
      <button onClick={() => setTheme('dark')}>Oscuro</button>
      <button onClick={() => setTheme('system')}>Sistema</button>
    </div>
  );
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    delete document.documentElement.dataset.theme;
  });

  afterEach(() => {
    delete document.documentElement.dataset.theme;
  });

  it('aplica data-theme="dark" y el theme-color correspondiente', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>,
    );

    await user.click(screen.getByText('Oscuro'));

    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(document.querySelector('meta[name="theme-color"]')?.getAttribute('content')).toBe(
      '#0E110D',
    );
  });

  it('aplica data-theme="light" y el theme-color correspondiente', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>,
    );

    await user.click(screen.getByText('Claro'));

    expect(document.documentElement.dataset.theme).toBe('light');
    expect(document.querySelector('meta[name="theme-color"]')?.getAttribute('content')).toBe(
      '#F7F4EC',
    );
  });

  it('con "system" no fija data-theme en <html>', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>,
    );

    await user.click(screen.getByText('Oscuro'));
    await user.click(screen.getByText('Sistema'));

    expect(document.documentElement.dataset.theme).toBeUndefined();
  });
});
