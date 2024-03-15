import express from 'express';import { Cost } from '../../domains/costs/models';
import { v4 as uuid } from 'uuid';
import { CostServices } from '../../domains/costs/services';
import { firestoreDB } from '../../gateways/firestore/db';
import { CostRepository } from '../../domains/costs/repository';

class CostsRouter {
  public router: express.Router;
  constructor(private costsService: CostServices) {
    this.router = express.Router();
    this.router.get('/:carID', this.getCostsByCarID);
    this.router.post('/', this.createCost);
    this.router.delete('/:id', this.deleteCost);
    this.router.put('/:id', this.updateCost);
  }

  getCostsByCarID = (req: express.Request, res: express.Response) => {
    const { carID } = req.params;
    this.costsService
      .getCostsByCarID(carID)
      .then((costs) => {
        return res.status(200).json(costs);
      })
      .catch((error) => {
        return res.status(error.status).json(error);
      });
  };

  createCost = (req: express.Request, res: express.Response) => {
    const costDTO = req.body;
    const id = uuid();
    this.costsService
      .createCost({ ...costDTO, id })
      .then((cost) => {
        return res.status(201).json(cost);
      })
      .catch((error) => {
        return res.status(error.status).json(error);
      });
  };

  deleteCost = (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    this.costsService
      .deleteCost(id)
      .then(() => {
        return res.status(204).send();
      })
      .catch((error) => {
        return res.status(error.status).json(error);
      });
  };

  updateCost = (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    const costDTO = req.body;
    this.costsService
      .updateCost(id, costDTO)
      .then((cost) => {
        return res.status(200).json(cost);
      })
      .catch((error) => {
        return res.status(error.status).json(error);
      });
  };

  public getRouter() {
    return this.router;
  }
}

export const costsRouter = () => {
  const db = firestoreDB();
  const costsRepository = new CostRepository(db, 'costs');
  const costsService = new CostServices(costsRepository);
  const router = new CostsRouter(costsService);
  return router.getRouter();
};
