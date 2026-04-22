import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

/**
 * Firebase Admin SDK — server-side only.
 * Token dogrulama ve sunucu tarafli islemler icin kullanilir.
 * 
 * ONEMLI: Bu dosya sadece API route'larda ve server componentlerde import edilmeli.
 * Client component'lerde ASLA kullanilmamali.
 */

let adminApp: App;
let adminAuth: Auth;
let adminDb: Firestore;

function initAdmin() {
    if (getApps().length === 0) {
        // Service account JSON'u environment variable'dan oku
        const serviceAccountStr = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

        if (serviceAccountStr) {
            try {
                const serviceAccount = JSON.parse(serviceAccountStr);
                adminApp = initializeApp({
                    credential: cert(serviceAccount),
                    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
                });
            } catch {
                console.warn('Firebase Admin: Service account parse hatasi, applicationDefault kullaniliyor.');
                adminApp = initializeApp({
                    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
                });
            }
        } else {
            // Service account yoksa, projectId ile basla (emulator/local dev icin)
            adminApp = initializeApp({
                projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            });
        }
    } else {
        adminApp = getApps()[0];
    }

    adminAuth = getAuth(adminApp);
    adminDb = getFirestore(adminApp);
}

initAdmin();

export { adminAuth, adminDb };
