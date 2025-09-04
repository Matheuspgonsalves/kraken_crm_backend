import { Module } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

interface FirebaseEnvConfig {
  env?: {
    FIREBASE_PROJECT_ID?: string;
  };
}

const firebaseConfig = functions.config() as FirebaseEnvConfig;

const firebaseProjectID: string =
  firebaseConfig?.env?.FIREBASE_PROJECT_ID ||
  process.env.FIREBASE_PROJECT_ID ||
  '';

const firebaseAdmin = admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: `https://${firebaseProjectID}-default-rtdb.firebaseio.com`,
});

const AuthProvider = {
  provide: 'FIREBASE_AUTH',
  useValue: firebaseAdmin.auth(),
};

const FirestoreProvider = {
  provide: 'FIREBASE_FIRESTORE',
  useValue: firebaseAdmin.firestore(),
};

@Module({
  providers: [AuthProvider, FirestoreProvider],
  exports: [AuthProvider, FirestoreProvider],
})
export class FirebaseModule {}
