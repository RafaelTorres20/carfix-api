import { Repository } from '../../gateways/firestore/repository';
import { User } from './models';

export class UsersRepository extends Repository<User> {
  private database;
  constructor(db: FirebaseFirestore.Firestore) {
    super(db, 'users');
    this.database = db;
  }
}
