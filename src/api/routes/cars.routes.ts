import express from 'express';
import { Car, CarDTO } from '../../domains/cars/models';
import { v4 as uuid } from 'uuid';
class CarsRouter {
  public router: express.Router;
  private cars: Car[] = [];
  constructor() {
    this.router = express.Router();
    this.router.get('/:id', this.getCarByID);
    this.router.post('/', this.createCar);
    this.router.delete('/:id', this.deleteCar);
    this.router.put('/:id', this.updateCar);
  }

  getCarByID = (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    const [car] = this.cars.filter((car) => car.id === id);
    return res.status(200).json(car);
  };

  createCar = (req: express.Request, res: express.Response) => {
    const carDTO: CarDTO = req.body;
    const id: string = uuid();
    const car: Car = {
      id,
      ...carDTO,
    };
    this.cars.push(car);
    return res.status(201).json({ id });
  };

  deleteCar = (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    this.cars = this.cars.filter((car) => car.id !== id);
    return res.status(204).send();
  };

  updateCar = (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    const carDTO: CarDTO = req.body;
    const car: Car = {
      id,
      ...carDTO,
    };
    this.cars = this.cars.map((c) => (c.id === id ? car : c));
    return res.status(200).json({ car });
  };

  public getRouter() {
    return this.router;
  }
}

export const carsRouter = () => {
  const router = new CarsRouter();
  return router.getRouter();
};
