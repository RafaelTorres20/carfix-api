import z from 'zod';
export type Car = z.infer<typeof car>;
export type CarDTO = z.infer<typeof carDTO>;

export const car = z.object({
  id: z.string(),
  userID: z.string(),
  plate: z.string(),
  model: z.string(),
  actualKm: z.number(),
});

export const carDTO = z.object({
  userID: z.string(),
  plate: z.string(),
  model: z.string(),
  actualKm: z.number(),
});
