import { ICost } from './interfaces';
import { CostDTO, Cost, costDTO } from './models';
import { CostRepository } from './repository';
import { to } from '../../utils/to';
import { v4 as uuid } from 'uuid';
export class MaintenanceServices implements ICost {
  constructor(private costRepository: CostRepository) {}

  createCost = async (cost: CostDTO): Promise<{ id: string }> => {
    const id = uuid();
    const [c, error] = await to(costDTO.parseAsync(cost));
    if (error) {
      console.log(error);
      throw { message: 'bad request', status: 400 };
    }
    const newCost = { ...c, id };
    return this.costRepository.create(newCost);
  };
  updateCost = async (id: string, cost: CostDTO): Promise<Cost> => {
    this.costRepository.verifyID(id);
    const [c, error] = await to(costDTO.parseAsync(cost));
    if (error) {
      console.log(error);
      throw { message: 'bad request', status: 400 };
    }
    return this.costRepository.update('id', id, c);
  };
  deleteCost = async (id: string): Promise<void> => {
    this.costRepository.verifyID(id);
    this.costRepository.delete('id', id);
    return;
  };
  getCostsByCarID = async (id: string): Promise<Cost[]> => {
    this.costRepository.verifyID(id);
    return this.costRepository.getCostsByCarID(id);
  };
}
