import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const configuredApiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim();
const hasUsableApiKey = Boolean(configuredApiKey && /^AIza[0-9A-Za-z_-]{35}$/.test(configuredApiKey));
const buildSafeApiKey = 'AIzaSyAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';

const firebaseConfig = {
  // Firebase Auth throws during module evaluation when a local/build
  // environment contains an empty or placeholder key. A syntactically valid
  // non-secret fallback keeps server route discovery from crashing; real
  // client requests still require the production key.
  apiKey: hasUsableApiKey ? configuredApiKey : buildSafeApiKey,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase (singleton)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, storage, googleProvider };
