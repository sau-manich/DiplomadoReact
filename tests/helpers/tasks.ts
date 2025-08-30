import { Page } from '@playwright/test';

export const taskCreate = async (page: Page, tarea: string) => {
  await page.getByRole('button', { name: 'Nueva tarea' }).click();
  await page.getByLabel('Nombre de la tarea').fill(tarea);
  await page.getByRole('button', { name: 'crear' }).click();
};

export const TaskEdit = async (page: Page, tareaEditada: string) => {
  await page.getByRole('button', { name: 'Editar' }).first().click();
  await page.getByLabel('Nombre de la tarea').fill(tareaEditada);
  await page.getByRole('button', { name: 'actualizar' }).click();
};

export const TaskDone = async (page: Page) => {
  page.once('dialog', (dialog) => {
    dialog.accept();
  });
  await page
    .getByRole('button', { name: /Marcar/ })
    .first()
    .click();
};

export const TaskDelete = async (page: Page) => {
  page.once('dialog', (dialog) => {
    dialog.accept();
  });
  await page
    .getByRole('button', { name: 'Eliminar' })
    .first()
    .click();
};
