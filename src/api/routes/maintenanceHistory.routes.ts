import express from 'express';
import { v4 as uuid } from 'uuid';
import { MaintenanceHistoryType } from '../../domains/maintenanceHistory/models';

class MaintenanceHistory {
  public router: express.Router;
  private maintenanceHistory: MaintenanceHistoryType[] = [];
  constructor() {
    this.router = express.Router();
    this.router.get('/:id', this.getMaintenanceHistoryByID);
    this.router.post('/', this.createMaintenanceHistory);
    this.router.delete('/:id', this.deleteMaintenanceHistory);
    this.router.put('/:id', this.updateMaintenanceHistory);
  }

  getMaintenanceHistoryByID = (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    const [maintenanceHistory] = this.maintenanceHistory.filter(
      (maintenanceHistory) => maintenanceHistory.id === id
    );
    return res.status(200).json(maintenanceHistory);
  };

  createMaintenanceHistory = (req: express.Request, res: express.Response) => {
    const maintenanceHistoryDTO = req.body;
    const id: string = uuid();
    const maintenanceHistory = {
      id,
      ...maintenanceHistoryDTO,
    };
    this.maintenanceHistory.push(maintenanceHistory);
    return res.status(201).json({ id });
  };

  deleteMaintenanceHistory = (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    this.maintenanceHistory = this.maintenanceHistory.filter(
      (maintenanceHistory) => maintenanceHistory.id !== id
    );
    return res.status(204).send();
  };

  updateMaintenanceHistory = (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    const maintenanceHistoryDTO = req.body;
    const maintenanceHistory = {
      id,
      ...maintenanceHistoryDTO,
    };
    this.maintenanceHistory = this.maintenanceHistory.map((m) =>
      m.id === id ? maintenanceHistory : m
    );
    return res.status(200).json(maintenanceHistory);
  };
  public getRouter() {
    return this.router;
  }
}

export const maintenanceHistoryRouter = () => {
  const router = new MaintenanceHistory();
  return router.getRouter();
};
