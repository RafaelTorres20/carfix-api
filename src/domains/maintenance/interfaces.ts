import { MaintenanceDTO, Maintenance } from './models';
export interface IMaintenance {
  createMaintenance: (maintenance: MaintenanceDTO) => Promise<{ id: string }>;
  updateMaintenance: (id: string, maintenance: MaintenanceDTO) => Promise<Maintenance>;
  deleteMaintenance: (id: string) => Promise<void>;
  getMaintenancesByCarID: (id: string) => Promise<Maintenance[]>;
}
