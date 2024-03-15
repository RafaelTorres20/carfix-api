import { FirebaseError } from 'firebase-admin';import { to } from '../../utils/to';
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
      console.log('id is required');
      throw { message: 'id is required', status: 400 };
    }
    if (id.length !== 36) {
      console.log('id is invalid');
      throw { message: 'id is invalid', status: 400 };
    }
    if (typeof id !== 'string') {
      console.log('id is invalid');
      throw { message: 'id is invalid', status: 400 };
    }
  }
  async create(data: T): Promise<{ id: string }> {
    const [newData, error] = await to<FirestoreResponseCreate, FirebaseError>(
      this.db.collection(this.collection).add(data)
    );
    if (error !== null) {
      console.log(error);
      throw { message: 'internal server error', status: 500 } as ErrorType;
    }

    return { id: newData.id };
  }
  async update(field: string, id: string, data: any): Promise<T> {
    const [updatedData, error] = await to<FirestoreResponseUpdate, FirebaseError>(
      (
        await this.db.collection(this.collection).where(field, '==', id).get()
      ).docs[0].ref.update(data)
    );
    if (error !== null) {
      console.log(error);
      throw { message: 'internal server error', status: 500 } as ErrorType;
    }
    return updatedData as unknown as T;
  }
  async delete(field: string, id: string): Promise<FirestoreResponseUpdate> {
    const [deletedData, error] = await to<any, FirebaseError>(
      (
        await this.db.collection(this.collection).where(field, '==', id).get()
      ).docs[0].ref.delete()
    );
    if (error !== null) {
      console.log(error);
      throw { message: 'internal server error', status: 500 } as ErrorType;
    }
    return deletedData;
  }
  async find(id: string): Promise<T> {
    const [data, error] = await to<FirestoreResponseGet, FirebaseError>(
      this.db.collection(this.collection).doc(id).get()
    );
    if (error !== null) {
      console.log(error);
      throw { message: 'internal server error', status: 500 } as ErrorType;
    }
    if (!data) {
      console.log('not found');
      throw { message: 'not found', status: 404 } as ErrorType;
    }
    return data.data() as unknown as T;
  }
  async findBy(field: string, value: string): Promise<T> {
    const [user, error] = await to(
      this.db.collection(this.collection).where(field, '==', value).get()
    );
    if (error) {
      console.log(error);
      throw { message: 'internal server error', status: 500 };
    }
    if (user.empty) {
      console.log('not found');
      throw { message: 'bad request', status: 400 };
    }
    return user.docs[0].data() as T;
  }
  async findAllBy(field: string, value: string): Promise<T[]> {
    const [data, error] = await to(
      this.db.collection(this.collection).where(field, '==', value).get()
    );
    if (error) {
      console.log(error);
      throw { message: 'internal server error', status: 500 };
    }
    if (data.empty) {
      console.log('not found');
      throw { message: 'not found', status: 404 };
    }
    const result: T[] = [];
    data.forEach((doc) => {
      result.push(doc.data() as T);
    });
    return result;
  }
  async findAll() {
    const [data, error] = await to<FirebaseResponseFindAll, FirebaseError>(
      this.db.collection(this.collection).get()
    );
    if (error !== null) {
      console.log(error);
      throw { message: 'internal server error', status: 500 } as ErrorType;
    }
    if (!data) {
      console.log('not found');
      throw { message: 'not found', status: 404 } as ErrorType;
    }
    return data;
  }

  async findAllByDateAndID(
    fieldID: string,
    id: string,
    fieldDate: string,
    minDate: Date,
    maxDate: Date
  ): Promise<T[]> {
    const [data, error] = await to(
      this.db
        .collection(this.collection)
        .where(fieldID, '==', id)
        .where(fieldDate, '>=', minDate)
        .where(fieldDate, '<=', maxDate)
        .get()
    );
    if (error) {
      console.log(error);
      throw { message: 'internal server error', status: 500 };
    }
    if (data.empty) {
      console.log('not found');
      throw { message: 'not found', status: 404 };
    }
    const result: T[] = [];
    data.forEach((doc) => {
      result.push(doc.data() as T);
    });
    return result;
  }
}
