import { Page } from '@playwright/test';

export const login = async (page: Page, username: string, password: string) => {
  await page.getByLabel('Username').fill(username);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Ingresar' }).click();
  await page.waitForURL('/perfil');
};

export const registration = async (
  page: Page,
  username: string,
  password: string
) => {
  await page.getByLabel('Username').fill(username);
  await page.locator('input[name="password"]').fill(password);
  await page.locator('input[name="confirmPassword"]').fill(password);
  await page.getByRole('button', { name: 'Registrar' }).click();
};
