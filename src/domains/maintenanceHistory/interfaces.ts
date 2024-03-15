import { MaintenanceHistoryDTO, MaintenanceHistory } from './models';

export interface IMaintenanceHistory {
  createMaintenanceHistory: (
    maintenanceHistory: MaintenanceHistoryDTO
  ) => Promise<{ id: string }>;
  updateMaintenanceHistory: (
    id: string,
    maintenanceHistory: MaintenanceHistoryDTO
  ) => Promise<MaintenanceHistory>;
  deleteMaintenanceHistory: (id: string) => Promise<void>;
  getMaintenanceHistoriesByMaintenanceID: (id: string) => Promise<MaintenanceHistory[]>;
}
