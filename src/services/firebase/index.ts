import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { env } from '../../environment';

const firebaseConfig = {
  apiKey: env.firebase.API_KEY,
  authDomain: env.firebase.AUTH_DOMAIN,
  projectId: env.firebase.PROJECT_ID,
  storageBucket: env.firebase.STORAGE_BUCKET,
  messagingSenderId: env.firebase.MESSAGING_SENDER_ID,
  appId: env.firebase.APP_ID,
  measurementId: env.firebase.MEASUREMENT_ID,
};

export const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
