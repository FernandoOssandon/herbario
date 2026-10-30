import { expect, test } from '@playwright/test';

// Definición de terminado de M0 (HANDOFF.md §12): navegar entre las 5
// pestañas y cambiar de tema funciona.
test('navega por las 5 pestañas y cambia el tema', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/hoy$/);
  await expect(page.getByRole('heading', { name: 'Hoy' })).toBeVisible();

  const nav = page.getByRole('navigation', { name: 'Navegación principal' });
  await nav.getByRole('link', { name: 'Jardín' }).click();
  await expect(page.getByRole('heading', { name: 'Mi jardín' })).toBeVisible();
  await expect(nav.getByRole('link', { name: 'Jardín' })).toHaveAttribute('aria-current', 'page');

  await nav.getByRole('link', { name: 'Diario' }).click();
  await expect(page.getByRole('heading', { name: 'Diario' })).toBeVisible();

  await nav.getByRole('link', { name: 'Aprender' }).click();
  await expect(page.getByRole('heading', { name: 'Aprender' })).toBeVisible();

  await nav.getByRole('link', { name: 'Herbario' }).click();
  await expect(page.getByRole('heading', { name: 'Herbario · Especies' })).toBeVisible();

  await nav.getByRole('link', { name: 'Hoy' }).click();
  await expect(page.getByRole('heading', { name: 'Hoy' })).toBeVisible();
});

test('cambiar el tema a oscuro y de vuelta a sistema', async ({ page }) => {
  await page.goto('/ajustes');

  const themeGroup = page.getByRole('radiogroup', { name: 'Tema' });
  await themeGroup.getByRole('radio', { name: 'Oscuro' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

  await themeGroup.getByRole('radio', { name: 'Sistema' }).click();
  await expect(page.locator('html')).not.toHaveAttribute('data-theme');
});
