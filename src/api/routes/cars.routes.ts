import express from 'express';
import { CarDTO } from '../../domains/cars/models';
import { CarsServices } from '../../domains/cars/services';
import { ErrorType } from '../../errors/types';
import { CarsRepository } from '../../domains/cars/repository';
import { firestoreDB } from '../../gateways/firestore/db';
import Multer from 'multer';
import { Storage } from '@google-cloud/storage';
import bucket from '../../../bucket.json';
import path from 'path';
const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // no larger than 5mb, you can change as needed.
  },
});
class CarsRouter {
  public router: express.Router;
  constructor(private carsService: CarsServices) {
    this.router = express.Router();
    this.router.get('/:id', this.getCarByID);
    this.router.post('/', multer.single('photo'), this.createCar);
    this.router.delete('/:id', this.deleteCar);
    this.router.put('/:id', multer.single('photo'), this.updateCar);
    this.router.patch('/:id', this.updateCurrentMileage);
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
    const file = req.file;
    this.carsService
      .createCar(carDTO, file)
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

  updateCurrentMileage = (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    const { currentMileage } = req.body;
    this.carsService
      .updateCurrentMileage(id, currentMileage)
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
    try {
      const file = req?.file;
    } catch (e) {
      console.log(e);
    }
    const file = req?.file;
    console.log({ file, carDTO, id });
    this.carsService
      .updateCarByID(id, carDTO, file)
      .then((car) => {
        return res.status(200).json(car);
      })
      .catch((error: ErrorType) => {
        console.log(error);
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
  const storage = new Storage({
    projectId: 'endless-terra-421507',
    keyFilename: path.join(__dirname, '../../../bucket.json'),
  });
  const carsServices = new CarsServices(carsRepository, storage);
  const router = new CarsRouter(carsServices);
  return router.getRouter();
};
