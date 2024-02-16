import express from 'express';
import { Maintenance } from '../../domains/maintenance/models';
import { v4 as uuid } from 'uuid';

class MaintenanceRouter {
  public router: express.Router;
  private maintenances: Maintenance[] = [];
  constructor() {
    this.router = express.Router();
    this.router.get('/:id', this.getMaintenanceByID);
    this.router.post('/', this.createMaintenance);
    this.router.delete('/:id', this.deleteMaintenance);
    this.router.put('/:id', this.updateMaintenance);
  }

  getMaintenanceByID = (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    const [maintenance] = this.maintenances.filter(
      (maintenance) => maintenance.id === id
    );
    return res.status(200).json(maintenance);
  };

  createMaintenance = (req: express.Request, res: express.Response) => {
    const maintenanceDTO = req.body;
    const id: string = uuid();
    const maintenance: Maintenance = {
      id,
      ...maintenanceDTO,
    };
    return res.status(201).json({ id });
  };

  deleteMaintenance = (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    this.maintenances = this.maintenances.filter((maintenance) => maintenance.id !== id);
    return res.status(204).send();
  };

  updateMaintenance = (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    const maintenanceDTO = req.body;
    const maintenance: Maintenance = {
      id,
      ...maintenanceDTO,
    };
    this.maintenances = this.maintenances.map((m) => (m.id === id ? maintenance : m));
    return res.status(200).json(maintenance);
  };

  public getRouter() {
    return this.router;
  }
}

export const maintenanceRouter = () => {
  const router = new MaintenanceRouter();
  return router.getRouter();
};
