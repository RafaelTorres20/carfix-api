import { Repository } from '../../gateways/firestore/repository';import { to } from '../../utils/to';
import { Maintenance } from './models';

export class MaintenanceRepository extends Repository<Maintenance> {
  constructor(db: FirebaseFirestore.Firestore, collection: string) {
    super(db, collection);
  }
  getMaintenancesByCarID = async (id: string): Promise<Maintenance[]> => {
    this.verifyID(id);
    const [data, error] = await to(this.findAllBy('carID', id));
    if (error) {
      console.log(error);
      throw { message: 'internal server error', status: 500 };
    }
    return data;
  };
  public verifyUserID(id: string): void {
    if (!id) {
      console.log('id is required');
      throw { message: 'bad request', status: 400 };
    }
    this.verifyID(id);
  }
}
