import { expect } from '@playwright/test';
import { login } from '../helpers/auth';
import { test } from '../../playwright.config';


test('login', async ({ page, authUser }) => {
  const {password, username} = authUser
  // NOTE: configurar playwright.config.ts use baseurl
  await page.goto('/login');
  await login(page, username, password);
  await expect(page.getByText('Bienvenido a tu perfil')).toBeVisible();
});
