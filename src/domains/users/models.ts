import z from 'zod';

export type User = z.infer<typeof user>;
export type UserDTO = z.infer<typeof userDTO>;

export const user = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  password: z.string(),
  jwt: z.string(),
});

export const userDTO = z.object({
  name: z.string(),
  email: z.string(),
  jwt: z.string().nullable().optional(),
  password: z
    .string()
    .min(8, 'bad request')
    .refine((password) => {
      // Pelo menos uma letra maiúscula
      if (!/[A-Z]/.test(password)) {
        throw new Error('bad request');
      }

      // Pelo menos uma letra minúscula
      if (!/[a-z]/.test(password)) {
        throw new Error('bad request');
      }

      // Pelo menos um número
      if (!/[0-9]/.test(password)) {
        throw new Error('bad request');
      }

      // Pelo menos um caractere especial
      if (!/[$&+,:;=?@#|'<>.^*()%!-]/.test(password)) {
        throw new Error('bad request');
      }

      return true;
    }),
});
