import express from 'express';
import { Cost } from '../../domains/costs/models';
import { v4 as uuid } from 'uuid';

class CostsRouter {
  public router: express.Router;
  private costs: Cost[] = [];
  constructor() {
    this.router = express.Router();
    this.router.get('/:id', this.getCostByID);
    this.router.post('/', this.createCost);
    this.router.delete('/:id', this.deleteCost);
    this.router.put('/:id', this.updateCost);
  }

  getCostByID = (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    const [cost] = this.costs.filter((cost) => cost.id === id);
    return res.status(200).json(cost);
  };

  createCost = (req: express.Request, res: express.Response) => {
    const costDTO = req.body;
    const id = uuid();
    const cost: Cost = {
      id,
      ...costDTO,
    };
    return res.status(201).json(cost);
  };

  deleteCost = (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    this.costs = this.costs.filter((cost) => cost.id !== id);
    return res.status(204).send();
  };

  updateCost = (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    const costDTO = req.body;
    const cost: Cost = {
      id,
      ...costDTO,
    };
    this.costs = this.costs.map((c) => (c.id === id ? cost : c));
    return res.status(200).json(cost);
  };

  public getRouter() {
    return this.router;
  }
}

export const costsRouter = () => {
  const router = new CostsRouter();
  return router.getRouter();
};
