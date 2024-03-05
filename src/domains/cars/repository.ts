import { Repository } from '../../gateways/firestore/repository';
import { Car } from './models';

export class CarsRepository extends Repository<Car> {
  private database;
  constructor(db: FirebaseFirestore.Firestore) {
    super(db, 'cars');
    this.database = db;
  }

  getCarsByUserID = async (userID: string) => {
    const carsdocs = await this.database
      .collection('cars')
      .where('userID', '==', userID)
      .get();
    const cars = carsdocs.docs.map((car) => car.data());
    return cars as Car[];
  };
}
