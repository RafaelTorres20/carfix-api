import { z } from 'zod';export type Schedule = z.infer<typeof schedule>;
export type ScheduleDTO = z.infer<typeof scheduleDTO>;

export const scheduleDTO = z.object({
  date: z.string().transform((val) => new Date(val)),
  name: z.string(),
  carID: z.string(),
});

export const schedule = z.object({
  id: z.string(),
  name: z.string(),
  date: z.date(),
  carID: z.string(),
});
