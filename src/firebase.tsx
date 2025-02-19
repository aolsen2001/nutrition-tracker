// Import the functions you need from the SDKs you need

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const apiKey = import.meta.env.VITE_FIREBASE_APIKEY;
const authDomain = import.meta.env.VITE_FIREBASE_AUTHDOMAIN;
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
const storageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET;
const messagingSenderId = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID;
const appId = import.meta.env.VITE_FIREBASE_APP_ID;

const firebaseConfig = {
  apiKey: apiKey,

  authDomain: authDomain,

  projectId: projectId,

  storageBucket: storageBucket,

  messagingSenderId: messagingSenderId,

  appId: appId,
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export default app;
