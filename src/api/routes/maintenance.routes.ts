import express from 'express';
import { MaintenanceServices } from '../../domains/maintenance/services';
import { ErrorType } from '../../errors/types';
import { MaintenanceRepository } from '../../domains/maintenance/repository';
import { firestoreDB } from '../../gateways/firestore/db';

class MaintenanceRouter {
  public router: express.Router;
  constructor(private maintenanceServices: MaintenanceServices) {
    this.router = express.Router();
    this.router.get('/:id', this.getMaintenancesByUserID);
    this.router.post('/', this.createMaintenance);
    this.router.delete('/:id', this.deleteMaintenance);
    this.router.put('/:id', this.updateMaintenance);
  }

  getMaintenancesByUserID = (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    this.maintenanceServices
      .getMaintenancesByUserID(id)
      .then((maintenances) => {
        return res.status(200).json(maintenances);
      })
      .catch((error: ErrorType) => {
        return res.status(error.status).json(error);
      });
  };

  createMaintenance = (req: express.Request, res: express.Response) => {
    const maintenanceDTO = req.body;
    this.maintenanceServices
      .createMaintenance(maintenanceDTO)
      .then((maintenance) => {
        return res.status(201).json(maintenance);
      })
      .catch((error: ErrorType) => {
        return res.status(error.status).json(error);
      });
  };

  deleteMaintenance = (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    this.maintenanceServices
      .deleteMaintenance(id)
      .then(() => {
        return res.status(204).send();
      })
      .catch((error: ErrorType) => {
        return res.status(error.status).json(error);
      });
  };

  updateMaintenance = (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    const maintenanceDTO = req.body;
    this.maintenanceServices
      .updateMaintenance(id, maintenanceDTO)
      .then((maintenance) => {
        return res.status(200).json(maintenance);
      })
      .catch((error: ErrorType) => {
        return res.status(error.status).json(error);
      });
  };

  public getRouter() {
    return this.router;
  }
}

export const maintenanceRouter = () => {
  const db = firestoreDB();
  const maintenanceRepository = new MaintenanceRepository(db, 'maintenances');
  const maintenanceServices = new MaintenanceServices(maintenanceRepository);
  const router = new MaintenanceRouter(maintenanceServices);
  return router.getRouter();
};
