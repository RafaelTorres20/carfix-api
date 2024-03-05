import { to } from '../../utils/to';
import { CarDTO, carDTO, car, Car } from './models';
import { CarsRepository } from './repository';
import { v4 as uuid } from 'uuid';

export class CarsServices {
  constructor(private carsRepository: CarsRepository) {}

  getCarsByUserID = async (userID: string) => {
    this.carsRepository.verifyID(userID);
    return this.carsRepository.getCarsByUserID(userID);
  };

  createCar = async (car: CarDTO) => {
    const id = uuid();
    const [c, error] = await to(carDTO.parseAsync(car));
    if (error) {
      throw { message: error.message, status: 400 };
    }
    const newCar = { ...c, id };
    return this.carsRepository.create(newCar);
  };

  updateCarByID = async (id: string, car: CarDTO) => {
    this.carsRepository.verifyID(id);
    const [c, error] = await to(carDTO.parseAsync(car));
    if (error) {
      throw { message: error.message, status: 400 };
    }
    return this.carsRepository.update(id, c);
  };

  deleteCarByID = async (id: string) => {
    this.carsRepository.verifyID(id);
    return this.carsRepository.delete(id);
  };

  getCarByID = async (id: string) => {
    this.carsRepository.verifyID(id);
    return this.carsRepository.find(id);
  };
}
