import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { app } from "./firebase-client-app";
import { auth, googleProvider } from "./firebase-client-auth";
const db = getFirestore(app);
const storage = getStorage(app);
export { app, auth, db, storage, googleProvider };
