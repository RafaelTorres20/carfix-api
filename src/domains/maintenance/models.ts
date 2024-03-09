import { z } from 'zod';

export type Maintenance = z.infer<typeof maintenance>;

export type MaintenanceDTO = z.infer<typeof maintenanceDTO>;

export const maintenanceDTO = z.object({
  name: z.string(),
  nextMileage: z.number(),
  userID: z.string(),
});

export const maintenance = z.object({
  id: z.string(),
  userID: z.string(),
  name: z.string(),
  nextMileage: z.number(),
});
