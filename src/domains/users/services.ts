import { FirebaseError } from 'firebase-admin';
import { ErrorType } from '../../errors/types';
import { to } from '../../utils/to';
import { User, UserDTO } from './models';
import {
  FirestoreResponseUpdate,
  FirestoreResponseGet,
} from '../../gateways/firestore/types';

export class UserService {
  constructor(private db: FirebaseFirestore.Firestore) {}

  async findUserByID(id: string): Promise<User> {
    try {
      const [userDoc, error] = await to<FirestoreResponseGet, FirebaseError>(
        this.db.collection('users').doc(id).get()
      );
      if (error !== null) {
        throw { message: 'internal server error', status: 500 } as ErrorType;
      }
      if (!userDoc.data()) {
        throw { message: 'not found', status: 404 } as ErrorType;
      }
      return userDoc.data() as User;
    } catch (e) {
      throw e;
    }
  }

  async updateUserByID(id: string, user: UserDTO): Promise<User> {
    try {
      const [updatedUser, error] = await to<FirestoreResponseUpdate, FirebaseError>(
        this.db.collection('users').doc(id).update(user)
      );
      if (error !== null) {
        throw { message: 'internal server error', status: 500 } as ErrorType;
      }
      if (!updatedUser) {
        throw { message: 'not found', status: 404 } as ErrorType;
      }
      return updatedUser as unknown as User;
    } catch (e) {
      throw e;
    }
  }
}
