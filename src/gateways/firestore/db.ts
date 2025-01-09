import { getApps, initializeApp } from 'firebase-admin/app';
import { Firestore as AdminFirestore, getFirestore } from 'firebase-admin/firestore';

export class FirestoreDB {
  private _firestoreDB: AdminFirestore;

  constructor() {
    this._firestoreDB = this.initOnce();
  }

  initOnce(): AdminFirestore {
    if (!getApps().length) {
      initializeApp();
    }
    if (!this._firestoreDB) {
      this._firestoreDB = getFirestore();
      this._firestoreDB.settings({ databaseId: 'carfix-db' });
    }
    return this._firestoreDB;
  }

  getFirestoreDB(): AdminFirestore {
    return this._firestoreDB;
  }
}

const firestore = new FirestoreDB().getFirestoreDB();

export const firestoreDB = (): AdminFirestore => {
  return firestore;
};

// Test Firestore connection
const testFirestore = async (): Promise<void> => {
  try {
    const db = firestoreDB();
    const testCollection = await db.collection('test').get();
    console.log(
      testCollection.empty ? 'No documents found!' : 'Firestore connected successfully!'
    );
  } catch (error) {
    console.error('Firestore connection error:', error);
  }
};

testFirestore();
