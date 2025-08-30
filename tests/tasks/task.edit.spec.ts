import { expect } from '@playwright/test';
import { test } from '../../playwright.config';
import { login } from '../helpers';
import { TaskEdit } from '../helpers/tasks';

test.describe('Flujo de edición de tarea', () => {
  test.beforeEach(async ({ page, authUser }) => {
    await login(page, authUser.username, authUser.password);
  });
  test('Edición de tarea', async ({ page }) => {
    const tareaEditada = 'Dormir cambiado';
    await page.goto('/tasks');
    await TaskEdit(page, tareaEditada);
    await expect(page.getByText('Tarea editada')).toBeVisible();
  });
});
