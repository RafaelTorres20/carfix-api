import { Repository } from '../../gateways/firestore/repository';
import { to } from '../../utils/to';
import { Cost } from './models';

export class CostRepository extends Repository<Cost> {
  constructor(db: FirebaseFirestore.Firestore, collection: string) {
    super(db, collection);
  }

  getCostsByCarID = async (id: string): Promise<Cost[]> => {
    const [data, error] = await to(this.findAllBy('carID', id));
    if (error) {
      console.log(error);
      throw { message: 'internal server error', status: 500 };
    }
    return data;
  };
}
