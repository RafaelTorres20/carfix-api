import { z } from 'zod';

export type Maintenance = z.infer<typeof maintenance>;

export type MaintenanceDTO = z.infer<typeof maintenanceDTO>;

export type MaintenanceUpdateDTO = Partial<MaintenanceDTO>;

export const maintenanceDTO = z.object({
  name: z.string(),
  nextMileage: z.number(),
  lastMileage: z.number(),
  carID: z.string(),
});

export const maintenance = z.object({
  id: z.string(),
  carID: z.string(),
  name: z.string(),
  nextMileage: z.number(),
  lastMileage: z.number(),
});

export const maintenanceUpdateDTO = z
  .object({})
  .merge(maintenanceDTO)
  .omit({ carID: true });
