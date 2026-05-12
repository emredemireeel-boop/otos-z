import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import fs from 'fs';

const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
    const [key, ...val] = line.split('=');
    if (key && val) {
        env[key.trim()] = val.join('=').trim().replace(/['"]/g, '');
    }
});

const firebaseConfig = {
    apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function main() {
    const threadsRef = collection(db, "threads");
    const q = query(threadsRef, where("urlId", "==", 60448115));
    const snap = await getDocs(q);
    
    if (snap.empty) {
        console.log("Thread not found!");
        return;
    }
    
    const d = snap.docs[0];
    const entriesSnap = await getDocs(collection(db, "threads", d.id, "entries"));
    entriesSnap.forEach(e => {
        console.log(`Entry ID: ${e.id}, Author: ${e.data().username}, AuthorID: ${e.data().authorId}`);
    });
}
main().then(() => process.exit(0));
