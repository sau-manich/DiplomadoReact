import { expect } from '@playwright/test';
import { test } from '../../playwright.config';
import { login } from '../helpers';
import { TaskDone } from '../helpers/tasks';

test.describe('Flujo de hecho de tarea', () => {
  test.beforeEach(async ({ page, authUser }) => {
    await login(page, authUser.username, authUser.password);
  });
  test('Hecho de tarea', async ({ page }) => {
    await page.goto('/tasks');
    await TaskDone(page);
    await expect(page.getByText('Tarea modificada')).toBeVisible();
  });
});
