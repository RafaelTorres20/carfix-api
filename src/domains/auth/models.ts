import { z } from 'zod';

export type LoginData = z.infer<typeof login>;

export const login = z.object({
  email: z.string().email().min(1),
  password: z.string().min(1),
});
