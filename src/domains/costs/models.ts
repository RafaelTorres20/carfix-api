import { z } from 'zod';
export type Cost = z.infer<typeof cost>;
export type CostDTO = z.infer<typeof costDTO>;

export const costDTO = z.object({
  cost: z.number(),
  date: z.string().transform((val) => new Date(val)),
  name: z.string(),
  carID: z.string(),
});

export const cost = z.object({
  id: z.string(),
  cost: z.number(),
  date: z.date(),
  name: z.string(),
  carID: z.string(),
});
