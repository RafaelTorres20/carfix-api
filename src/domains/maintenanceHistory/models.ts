import { z } from 'zod';
export type MaintenanceHistory = z.infer<typeof maintenanceHistory>;
export type MaintenanceHistoryDTO = z.infer<typeof maintenanceHistoryDTO>;

export const maintenanceHistoryDTO = z.object({
  maintenanceID: z.string(),
  date: z.string(),
  value: z.number(),
  mileage: z.number(),
});

export const maintenanceHistory = z.object({
  id: z.string(),
  maintenanceID: z.string(),
  date: z.string(),
  value: z.number(),
  mileage: z.number(),
});
