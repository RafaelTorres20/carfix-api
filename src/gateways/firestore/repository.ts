import { FirebaseError } from 'firebase-admin';
import { to } from '../../utils/to';
import {
  FirebaseResponseFindAll,
  FirestoreResponseCreate,
  FirestoreResponseGet,
  FirestoreResponseUpdate,
} from './types';
import { ErrorType } from '../../errors/types';

export class Repository<T extends { [x: string]: any }> {
  constructor(private db: FirebaseFirestore.Firestore, private collection: string) {
    this.db = db;
    this.collection = collection;
  }
  verifyID(id: string): void {
    if (!id) {
      throw { message: 'id is required', status: 400 };
    }
    if (id.length !== 36) {
      throw { message: 'id is invalid', status: 400 };
    }
    if (typeof id !== 'string') {
      throw { message: 'id is invalid', status: 400 };
    }
  }
  async create(data: T): Promise<any> {
    const [newData, error] = await to<FirestoreResponseCreate, FirebaseError>(
      this.db.collection(this.collection).add(data)
    );
    if (error !== null) {
      throw { message: 'internal server error', status: 500 } as ErrorType;
    }

    return { id: newData.id };
  }
  async update(id: string, data: any): Promise<T> {
    const [updatedData, error] = await to<FirestoreResponseUpdate, FirebaseError>(
      this.db.collection(this.collection).doc(id).update(data)
    );
    if (error !== null) {
      throw { message: 'internal server error', status: 500 } as ErrorType;
    }
    return updatedData as unknown as T;
  }
  async delete(id: string): Promise<FirestoreResponseUpdate> {
    const [deletedData, error] = await to<FirestoreResponseUpdate, FirebaseError>(
      this.db.collection(this.collection).doc(id).delete()
    );
    if (error !== null) {
      throw { message: 'internal server error', status: 500 } as ErrorType;
    }
    return deletedData;
  }
  async find(id: string): Promise<T> {
    const [data, error] = await to<FirestoreResponseGet, FirebaseError>(
      this.db.collection(this.collection).doc(id).get()
    );
    console.log(data.data, error);
    if (error !== null) {
      throw { message: 'internal server error', status: 500 } as ErrorType;
    }
    if (!data) {
      throw { message: 'not found', status: 404 } as ErrorType;
    }
    return data.data() as unknown as T;
  }
  async findAll() {
    const [data, error] = await to<FirebaseResponseFindAll, FirebaseError>(
      this.db.collection(this.collection).get()
    );
    if (error !== null) {
      throw { message: 'internal server error', status: 500 } as ErrorType;
    }
    if (!data) {
      throw { message: 'not found', status: 404 } as ErrorType;
    }
    return data;
  }
}
