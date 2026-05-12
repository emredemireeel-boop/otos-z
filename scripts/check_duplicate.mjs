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
    
    console.log(`Found ${snap.size} threads with urlId 60448115`);
    for (const d of snap.docs) {
        console.log(`Thread ID: ${d.id}, author: ${d.data().authorUsername}, title: ${d.data().title}, entryCount: ${d.data().entryCount}`);
        const entriesSnap = await getDocs(collection(db, "threads", d.id, "entries"));
        console.log(`  -> has ${entriesSnap.size} entries in subcollection`);
    }
}
main().then(() => process.exit(0));
