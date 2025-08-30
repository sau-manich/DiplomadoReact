import { expect, test } from '@playwright/test';

const random = Date.now();
const username = `usernmae${random}`;
const password = '123456';

test.describe('Flujo de creación de usuario y autenticación', () => {
  test('creación de usuario', async ({ page }) => {
    // Ir a la página de usuario
    await page.goto('http://localhost:5173/user');
    await page.getByLabel('Usuario').fill(username);
    await page.locator('input[name="password"]').fill(password);
    await page.locator('input[name="confirmPassword"]').fill(password);
    await page.getByRole('button', { name: 'Registrar' }).click();
    await expect(page.getByText('Usuario creado')).toBeVisible();

    // --- Redirección al login ---
    await expect(page).toHaveURL('http://localhost:5173/login'); // 👈 asegura que redirige

    // --- Login ---
    await expect(page).toHaveURL(/\/login$/);
    await page.getByLabel('Usuario').fill(username);
    await page.getByLabel('Contraseña').fill(password);
    await page.getByRole('button', { name: 'Ingresar' }).click();

    // --- Verificación de que entró al sistema ---
    await expect(page.getByText('Bienvenido a tu perfil')).toBeVisible();
  });
});
