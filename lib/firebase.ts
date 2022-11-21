import * as firebase from 'firebase-admin';

if (!firebase.apps.length) {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');

    firebase.initializeApp({
      credential: firebase.credential.cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    });
  } else {
    console.log('not using firebase');
  }
} else {
  firebase.app();
}

export default firebase;
