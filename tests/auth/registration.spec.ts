import { expect, test } from '@playwright/test';
import { registration } from '../helpers';

const random = Date.now();
const username = `usernmae${random}`;
const password = '123456';

test.describe('Flujo de creación de usuario', () => {
  test('creación de usuario', async ({ page }) => {
    // Ir a la página de usuario
    // NOTE: configurar playwright.config.ts use baseurl
    // await page.goto('http://localhost:5173/user');
    await page.goto('/userRegister');
    await registration(page, username, password);
    await expect(page.getByText('Usuario creado')).toBeVisible();

    // --- Redirección al login ---
    await expect(page).toHaveURL('/login'); // 👈 asegura que redirige
    await expect(page).toHaveURL(/\/login$/);
  });
});
