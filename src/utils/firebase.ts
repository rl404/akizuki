import { cert, initializeApp } from 'firebase-admin/app';
import { Database, getDatabase } from 'firebase-admin/database';

export var database: Database;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');
  const app = initializeApp({
    credential: cert({
      projectId: serviceAccount.project_id,
      clientEmail: serviceAccount.client_email,
      privateKey: serviceAccount.private_key,
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
  database = getDatabase(app);
} else {
  console.log('not using firebase');
}
