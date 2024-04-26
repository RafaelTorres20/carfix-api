import { to } from '../../utils/to';
import { IMaintenance } from './interfaces';
import { MaintenanceDTO, Maintenance, maintenanceDTO } from './models';
import { v4 as uuid } from 'uuid';
import { MaintenanceRepository } from './repository';

export class MaintenanceServices implements IMaintenance {
  constructor(private maintenanceRepository: MaintenanceRepository) {}

  createMaintenance = async (maintenance: MaintenanceDTO): Promise<{ id: string }> => {
    const id = uuid();
    this.maintenanceRepository.verifyID(maintenance.carID);
    const [m, error] = await to(maintenanceDTO.parseAsync(maintenance));
    if (error) {
      console.log(error);
      throw { message: 'bad request', status: 400 };
    }
    const newMaintenance = { ...m, id };
    await this.maintenanceRepository.create(newMaintenance);
    return { id };
  };

  updateMaintenance = async (
    id: string,
    maintenance: MaintenanceDTO
  ): Promise<Maintenance> => {
    this.maintenanceRepository.verifyID(id);
    const [m, error] = await to(maintenanceDTO.parseAsync(maintenance));
    if (error) {
      console.log(error);
      throw { message: 'bad request', status: 400 };
    }
    return this.maintenanceRepository.update('id', id, m);
  };

  deleteMaintenance = async (id: string): Promise<any> => {
    this.maintenanceRepository.verifyID(id);
    return this.maintenanceRepository.delete('id', id);
  };

  getMaintenancesByCarID = async (id: string): Promise<Maintenance[]> => {
    this.maintenanceRepository.verifyID(id);
    return this.maintenanceRepository.getMaintenancesByCarID(id);
  };
}
