import { Repository } from '../../gateways/firestore/repository';
import { to } from '../../utils/to';
import { MaintenanceHistory } from './models';

export class MaintenanceHistoryRepository extends Repository<MaintenanceHistory> {
  constructor(db: FirebaseFirestore.Firestore, collection: string) {
    super(db, collection);
  }

  getMaintenanceHistoriesByMaintenanceID = async (
    id: string
  ): Promise<MaintenanceHistory[]> => {
    const [data, error] = await to(this.findAllBy('carID', id));
    if (error) {
      console.log(error);
      throw { message: 'internal server error', status: 500 };
    }
    return data;
  };
}
