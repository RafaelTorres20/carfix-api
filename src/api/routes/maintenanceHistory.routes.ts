import express from 'express';
import { v4 as uuid } from 'uuid';
import { MaintenanceHistoryServices } from '../../domains/maintenanceHistory/services';
import { MaintenanceHistoryRepository } from '../../domains/maintenanceHistory/repository';
import { firestoreDB } from '../../gateways/firestore/db';

class MaintenanceHistory {
  public router: express.Router;
  constructor(private maintenanceHistoryServices: MaintenanceHistoryServices) {
    this.router = express.Router();
    this.router.get('/:id', this.getMaintenanceHistoryByID);
    this.router.post('/', this.createMaintenanceHistory);
    this.router.delete('/:id', this.deleteMaintenanceHistory);
    this.router.put('/:id', this.updateMaintenanceHistory);
  }

  getMaintenanceHistoryByID = (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    this.maintenanceHistoryServices
      .getMaintenanceHistoriesByMaintenanceID(id)
      .then((maintenanceHistory) => {
        return res.status(200).json(maintenanceHistory);
      })
      .catch((error) => {
        return res.status(error.status).json(error);
      });
  };

  createMaintenanceHistory = (req: express.Request, res: express.Response) => {
    const maintenanceHistoryDTO = req.body;
    this.maintenanceHistoryServices
      .createMaintenanceHistory(maintenanceHistoryDTO)
      .then((maintenanceHistory) => {
        return res.status(201).json(maintenanceHistory);
      })
      .catch((error) => {
        return res.status(error.status).json(error);
      });
  };

  deleteMaintenanceHistory = (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    this.maintenanceHistoryServices
      .deleteMaintenanceHistory(id)
      .then(() => {
        return res.status(204).send();
      })
      .catch((error) => {
        return res.status(error.status).json(error);
      });
  };

  updateMaintenanceHistory = (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    const maintenanceHistoryDTO = req.body;
    this.maintenanceHistoryServices
      .updateMaintenanceHistory(id, maintenanceHistoryDTO)
      .then((maintenanceHistory) => {
        return res.status(200).json(maintenanceHistory);
      })
      .catch((error) => {
        return res.status(error.status).json(error);
      });
  };
  public getRouter() {
    return this.router;
  }
}

export const maintenanceHistoryRouter = () => {
  const db = firestoreDB();
  const maintenanceHistoryRepository = new MaintenanceHistoryRepository(
    db,
    'maintenanceHistory'
  );
  const maintenanceHistoryServices = new MaintenanceHistoryServices(
    maintenanceHistoryRepository
  );
  const router = new MaintenanceHistory(maintenanceHistoryServices);
  return router.getRouter();
};
