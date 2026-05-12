import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where, getDoc, doc } from 'firebase/firestore';
import fs from 'fs';

// Read env variables
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
    projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function main() {
    console.log("Searching for thread with urlId = 60448115...");
    const threadsRef = collection(db, "threads");
    const q = query(threadsRef, where("urlId", "==", 60448115));
    const snap = await getDocs(q);
    
    if (snap.empty) {
        console.log("Thread not found!");
        return;
    }
    
    const threadDoc = snap.docs[0];
    console.log("Thread ID:", threadDoc.id);
    console.log("Thread title:", threadDoc.data().title);
    console.log("Thread entryCount:", threadDoc.data().entryCount);
    
    console.log("Fetching entries...");
    const entriesRef = collection(db, "threads", threadDoc.id, "entries");
    const entriesSnap = await getDocs(entriesRef);
    
    console.log(`Found ${entriesSnap.size} entries in subcollection.`);
    const entries = [];
    entriesSnap.forEach(d => {
        entries.push({ id: d.id, ...d.data() });
    });
    
    entries.sort((a,b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));
    
    entries.slice(0, 5).forEach(e => {
        console.log(`[${e.id}] User: ${e.username}, CreatedAt: ${e.createdAt ? new Date(e.createdAt.seconds * 1000).toISOString() : 'null'}, Content: ${e.content.substring(0, 40)}...`);
    });
    process.exit(0);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
