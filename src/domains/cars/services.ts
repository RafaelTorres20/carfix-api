import { to } from '../../utils/to';
import { CarDTO, carDTO } from './models';
import { CarsRepository } from './repository';
import { v4 as uuid } from 'uuid';
import { Storage } from '@google-cloud/storage';
export class CarsServices {
  constructor(private carsRepository: CarsRepository, private storage: Storage) {}
  uploadFile = (file: any): Promise<any> => {
    return new Promise((resolve, reject) => {
      const bucket = this.storage.bucket('carfix');
      if (file?.originalname) {
        const time = new Date().getTime();
        const blob = bucket.file(time + file.originalname);
        const blobStream = blob.createWriteStream();

        blobStream.on('error', (err) => {
          reject(err);
        });

        blobStream.on('finish', async () => {
          const [f] = await this.storage
            .bucket('carfix')
            .file(time + file.originalname)
            .exists();
          if (!f) {
            reject(new Error('File not found'));
          }
          const url = await this.storage
            .bucket('carfix')
            .file(time + file.originalname)
            .getSignedUrl({
              action: 'read',
              expires: '03-09-2026',
            });
          resolve(url);
        });

        blobStream.end(file.buffer);
      } else {
        reject(new Error('No file provided'));
      }
    });
  };
  getCarsByUserID = async (userID: string) => {
    this.carsRepository.verifyID(userID);
    return this.carsRepository.getCarsByUserID(userID);
  };

  createCar = async (car: CarDTO, file: Express.Multer.File | undefined) => {
    let signedUrl;
    const id = uuid();
    const [c, error] = await to(carDTO.parseAsync(car));
    if (error) {
      console.log(error);
      throw { message: error.message, status: 400 };
    }
    if (file) {
      signedUrl = await this.uploadFile(file);
    }

    c.photo = signedUrl[0];
    const newCar = { ...c, id };
    await this.carsRepository.create(newCar);
    return { id };
  };

  updateCurrentMileage = async (id: string, currentMileage: number) => {
    this.carsRepository.verifyID(id);
    if (!currentMileage) {
      throw { message: 'currentMileage is required', status: 400 };
    }
    return this.carsRepository.update('id', id, { currentMileage });
  };

  updateCarByID = async (id: string, car: CarDTO) => {
    this.carsRepository.verifyID(id);
    const [c, error] = await to(carDTO.parseAsync(car));
    if (error) {
      throw { message: error.message, status: 400 };
    }
    return this.carsRepository.update('id', id, c);
  };

  deleteCarByID = async (id: string) => {
    this.carsRepository.verifyID(id);
    return this.carsRepository.delete('id', id);
  };

  getCarByID = async (id: string) => {
    this.carsRepository.verifyID(id);
    return this.carsRepository.findBy('id', id);
  };
}
