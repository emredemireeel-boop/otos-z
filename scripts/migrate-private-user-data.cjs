/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');
const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');

function credentials() {
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (raw) return JSON.parse(raw);
    const file = path.join(process.cwd(), 'otosoz-admin.json');
    if (fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, 'utf8'));
    throw new Error('Firebase Admin kimlik bilgisi bulunamadı.');
}

async function main() {
    const apply = process.argv.includes('--apply');
    const serviceAccount = credentials();
    const app = getApps()[0] || initializeApp({ credential: cert(serviceAccount) });
    const db = getFirestore(app);
    const users = await db.collection('users').get();
    const candidates = users.docs.filter(doc => typeof doc.data().email === 'string' && doc.data().email);
    console.log(`Taşınacak açık e-posta alanı: ${candidates.length}`);
    if (!apply) {
        console.log('Salt okunur deneme tamamlandı. Uygulamak için --apply kullanın.');
        return;
    }
    for (let i = 0; i < candidates.length; i += 200) {
        const batch = db.batch();
        for (const user of candidates.slice(i, i + 200)) {
            batch.set(db.collection('user_private').doc(user.id), {
                email: user.data().email,
                migratedAt: FieldValue.serverTimestamp(),
            }, { merge: true });
            batch.update(user.ref, { email: FieldValue.delete() });
        }
        await batch.commit();
    }
    console.log(`Taşınan kayıt: ${candidates.length}`);
}

main().catch(error => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
});
