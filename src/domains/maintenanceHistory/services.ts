import { IMaintenanceHistory } from './interfaces';
import {
  MaintenanceHistoryDTO,
  maintenanceHistoryDTO,
  MaintenanceHistory,
} from './models';
import { MaintenanceHistoryRepository } from './repository';
import { to } from '../../utils/to';
import { v4 as uuid } from 'uuid';

export class MaintenanceHistoryServices implements IMaintenanceHistory {
  constructor(private maintenanceHistoryRepository: MaintenanceHistoryRepository) {}
  createMaintenanceHistory = async (
    maintenanceHistory: MaintenanceHistoryDTO
  ): Promise<{ id: string }> => {
    const id = uuid();
    const [m, error] = await to(maintenanceHistoryDTO.parseAsync(maintenanceHistory));
    if (error) {
      console.log(error);
      throw { message: 'bad request', status: 400 };
    }
    const newMaintenanceHistory = { ...m, id };
    await this.maintenanceHistoryRepository.create(newMaintenanceHistory);
    return { id };
  };
  updateMaintenanceHistory = async (
    id: string,
    maintenanceHistory: MaintenanceHistoryDTO
  ): Promise<MaintenanceHistory> => {
    this.maintenanceHistoryRepository.verifyID(id);
    const [m, error] = await to(maintenanceHistoryDTO.parseAsync(maintenanceHistory));
    if (error) {
      console.log(error);
      throw { message: 'bad request', status: 400 };
    }
    return this.maintenanceHistoryRepository.update('id', id, m);
  };
  deleteMaintenanceHistory = async (id: string): Promise<void> => {
    this.maintenanceHistoryRepository.verifyID(id);
    this.maintenanceHistoryRepository.delete('id', id);
    return;
  };
  getMaintenanceHistoriesByMaintenanceID = async (
    id: string
  ): Promise<MaintenanceHistory[]> => {
    this.maintenanceHistoryRepository.verifyID(id);
    return this.maintenanceHistoryRepository.getMaintenanceHistoriesByMaintenanceID(id);
  };
}
