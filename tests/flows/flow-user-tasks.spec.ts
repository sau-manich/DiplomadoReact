import test, { expect } from '@playwright/test';
import {
  login,
  registration,
  taskCreate,
  TaskDelete,
  TaskDone,
  TaskEdit,
} from '../helpers';

const random = Date.now();
const username = `usernmae${random}`;
const password = '123456';
const task = 'Tarea de flujo';
const taskEdit = 'Editar de flujo';

test('registro, login y CRUD de tareas con usuario dinámico', async ({
  page,
}) => {
  await page.goto('/userRegister');
  await registration(page, username, password);
  await expect(page.getByText('Usuario creado')).toBeVisible();
  await expect(page).toHaveURL('/login'); // 👈 asegura que redirige
  await expect(page).toHaveURL(/\/login$/);

  await login(page, username, password);
  await expect(page.getByText('Bienvenido a tu perfil')).toBeVisible();

  await page.goto('/tasks');
  await taskCreate(page, task);
  await expect(page.getByText('Tarea creada')).toBeVisible();

  await TaskEdit(page, taskEdit);
  await expect(page.getByText('Tarea editada')).toBeVisible();

  await TaskDone(page);
  await expect(page.getByText('Tarea modificada')).toBeVisible();

  await TaskDelete(page);
  await expect(page.getByText('Tarea eliminada')).toBeVisible();
});
