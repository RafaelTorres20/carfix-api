import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import serviceAccount from '../../../sa.json';

export class FirestoreDB {
  private _firestoreDB: Firestore;

  constructor() {
    this._firestoreDB = this.initOnce();
  }

  initOnce() {
    if (!this._firestoreDB) {
      initializeApp({
        credential: cert(serviceAccount),
      });
      this._firestoreDB = getFirestore();
    }
    return this._firestoreDB;
  }

  getFirestoreDB() {
    return this._firestoreDB;
  }
}
const firestore = new FirestoreDB().getFirestoreDB();

export const firestoreDB = () => {
  return firestore;
};
