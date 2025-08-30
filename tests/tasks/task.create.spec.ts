import { expect } from '@playwright/test';
import { test } from '../../playwright.config';
import { login, taskCreate } from '../helpers';

test.describe('Flujo de creación de tarea', () => {
  test.beforeEach(async ({ page, authUser }) => {
    await login(page, authUser.username, authUser.password);
  });
  test('creación de tarea', async ({ page }) => {
    const tarea = 'Estudiar React';
    await page.goto('/tasks');
    await taskCreate(page, tarea);
    await expect(page.getByText('Tarea creada')).toBeVisible();
  });
});
