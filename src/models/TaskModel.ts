import z from 'zod';

export const schemaTask = z.object({
  name: z.string().min(3, 'El nombre es obligatorio'),
});

export type TaskFormValues = z.infer<typeof schemaTask>;