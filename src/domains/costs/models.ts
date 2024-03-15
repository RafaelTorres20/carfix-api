import { z } from 'zod';

export type Cost = z.infer<typeof cost>;
export type CostDTO = z.infer<typeof costDTO>;

export const costDTO = z.object({
  cost: z.number(),
  date: z.string(),
  name: z.string(),
  carID: z.string(),
});

export const cost = z.object({
  id: z.string(),
  cost: z.number(),
  date: z.string(),
  name: z.string(),
  carID: z.string(),
});
