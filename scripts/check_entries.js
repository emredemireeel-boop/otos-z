import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where, getDoc, doc } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
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
    console.log("Thread Data:", threadDoc.data());
    
    console.log("Fetching entries...");
    const entriesRef = collection(db, "threads", threadDoc.id, "entries");
    const entriesSnap = await getDocs(entriesRef);
    
    console.log(`Found ${entriesSnap.size} entries.`);
    entriesSnap.forEach(d => {
        const data = d.data();
        console.log(`[${d.id}] User: ${data.username}, Content: ${data.content.substring(0, 50)}...`);
    });
}

main().catch(console.error);
