import z from 'zod';

export type User = z.infer<typeof user>;
export type UserDTO = z.infer<typeof userDTO>;

export const user = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  password: z.string(),
});

export const userDTO = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
});
