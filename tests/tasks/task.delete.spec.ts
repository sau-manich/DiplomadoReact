import { expect } from '@playwright/test';
import { test } from '../../playwright.config';
import { login } from '../helpers';
import { TaskDelete } from '../helpers/tasks';

test.describe('Flujo de elimincación de tarea', () => {
  test.beforeEach(async ({ page, authUser }) => {
    await login(page, authUser.username, authUser.password);
  });
  test('Eliminación de tarea', async ({ page }) => {
    await page.goto('/tasks');
    await TaskDelete(page);
    await expect(page.getByText('Tarea eliminada')).toBeVisible();
  });
});
