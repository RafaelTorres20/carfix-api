import { Repository } from '../../gateways/firestore/repository';
import { to } from '../../utils/to';
import { User } from './models';
import jose from 'jose';

export class UsersRepository extends Repository<User> {
  constructor(db: FirebaseFirestore.Firestore, collection: string) {
    super(db, collection);
  }
}
