import z from 'zod';
export type Car = z.infer<typeof car>;
export type CarDTO = z.infer<typeof carDTO>;

export const car = z.object({
  id: z.string(),
  userID: z.string(),
  plate: z.string(),
  model: z.string(),
  currentMileage: z.number(),
  photo: z.string().optional(),
});

export const carDTO = z.object({
  userID: z.string(),
  plate: z.string(),
  model: z.string(),
  currentMileage: z.string().transform((x) => parseInt(x)),
  photo: z.string().optional(),
});
