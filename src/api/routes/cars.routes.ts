import express from 'express';
import { CarDTO } from '../../domains/cars/models';
import { CarsServices } from '../../domains/cars/services';
import { ErrorType } from '../../errors/types';
import { CarsRepository } from '../../domains/cars/repository';
import { firestoreDB } from '../../gateways/firestore/db';
class CarsRouter {
  public router: express.Router;
  constructor(private carsService: CarsServices) {
    this.router = express.Router();
    this.router.get('/:id', this.getCarByID);
    this.router.post('/', this.createCar);
    this.router.delete('/:id', this.deleteCar);
    this.router.put('/:id', this.updateCar);
    this.router.patch('/:id', this.updateActualKm);
    this.router.get('/user/:id', this.getCarsByUserID);
  }

  getCarsByUserID = (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    this.carsService
      .getCarsByUserID(id)
      .then((cars) => {
        return res.status(200).json(cars);
      })
      .catch((error: ErrorType) => {
        return res.status(error.status).json(error);
      });
  };

  getCarByID = (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    this.carsService
      .getCarByID(id)
      .then((car) => {
        return res.status(200).json(car);
      })
      .catch((error: ErrorType) => {
        return res.status(error.status).json(error);
      });
  };

  createCar = (req: express.Request, res: express.Response) => {
    const carDTO: CarDTO = req.body;
    this.carsService
      .createCar(carDTO)
      .then((car) => {
        return res.status(201).json(car);
      })
      .catch((error: ErrorType) => {
        return res.status(error.status).json(error);
      });
  };

  deleteCar = (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    this.carsService
      .deleteCarByID(id)
      .then(() => {
        return res.status(204).send();
      })
      .catch((error: ErrorType) => {
        return res.status(error.status).json(error);
      });
  };

  updateActualKm = (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    const { actualKm } = req.body;
    this.carsService
      .updateActualKm(id, actualKm)
      .then((car) => {
        return res.status(200).json(car);
      })
      .catch((error: ErrorType) => {
        return res.status(error.status).json(error);
      });
  };

  updateCar = (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    const carDTO: CarDTO = req.body;
    this.carsService
      .updateCarByID(id, carDTO)
      .then((car) => {
        return res.status(200).json(car);
      })
      .catch((error: ErrorType) => {
        return res.status(error.status).json(error);
      });
  };

  public getRouter() {
    return this.router;
  }
}

export const carsRouter = () => {
  const db = firestoreDB();
  const carsRepository = new CarsRepository(db);
  const carsServices = new CarsServices(carsRepository);
  const router = new CarsRouter(carsServices);
  return router.getRouter();
};
