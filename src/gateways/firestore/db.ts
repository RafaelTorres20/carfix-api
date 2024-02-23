import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import {
  getFirestore,
  Timestamp,
  FieldValue,
  Filter,
  Firestore,
} from 'firebase-admin/firestore';
import serviceAccount from '../../../serviceAccount.json';

export class FirestoreDB {
  private db: Firestore;
  constructor() {
    this.db = this.init();
  }
  init() {
    if (!this.db) {
      initializeApp({
        credential: cert(serviceAccount),
      });
      this.db = getFirestore();
    }
    return this.db;
  }

  get firestoreDB() {
    return this.db;
  }
}
