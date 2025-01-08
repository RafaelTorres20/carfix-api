import { credential } from 'firebase-admin';
import { initializeApp } from 'firebase-admin/app';
import { Firestore, getFirestore } from 'firebase-admin/firestore';

export class FirestoreDB {
  private _firestoreDB: Firestore;

  constructor() {
    this._firestoreDB = this.initOnce();
  }

  initOnce() {
    if (!this._firestoreDB) {
      initializeApp({
        credential: credential.applicationDefault(),
        databaseURL: 'https://carfix-bd96a.firebaseio.com',
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
