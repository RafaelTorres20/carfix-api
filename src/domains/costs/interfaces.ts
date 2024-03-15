import { CostDTO, Cost } from './models';

export interface ICost {
  createCost: (cost: CostDTO) => Promise<{ id: string }>;
  updateCost: (id: string, cost: CostDTO) => Promise<Cost>;
  deleteCost: (id: string) => Promise<void>;
  getCostsByCarID: (id: string) => Promise<Cost[]>;
}
