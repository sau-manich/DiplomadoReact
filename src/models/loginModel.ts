import { z } from 'zod';

export const shemaLogin = z.object({
  username: z.string().min(3, 'El nombre el obligarotio'),
  password: z.string().min(6, 'La contraseña es obligatoria'),
});

export type LoginFormValues = z.infer<typeof shemaLogin>;
