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
let initError: string | null = null;

function initAdmin() {
    if (getApps().length === 0) {
        // Service account JSON'u environment variable'dan oku
        const serviceAccountStr = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

        if (serviceAccountStr) {
            try {
                // Windows'ta .env dosyasindaki JSON satirlari bozulabilir, temizle
                const cleaned = serviceAccountStr
                    .replace(/\r?\n/g, '')  // satir sonlarini kaldir
                    .replace(/\\n/g, '\\n'); // literal \n'leri koru

                const serviceAccount = JSON.parse(cleaned);
                
                // private_key icindeki literal \n karakterlerini gercek newline'a cevir
                if (serviceAccount.private_key && typeof serviceAccount.private_key === 'string') {
                    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
                }

                adminApp = initializeApp({
                    credential: cert(serviceAccount),
                    projectId: serviceAccount.project_id || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
                });
            } catch (err: any) {
                console.error('Firebase Admin: Service account hatasi:', err?.message || err);
                initError = `Service account parse/init hatasi: ${err?.message || 'Bilinmeyen hata'}`;
                
                // Credential olmadan init etme — default credentials hatasi verir
                // Bunun yerine hata kaydedip fonksiyonlarda kontrol edecegiz
                try {
                    adminApp = initializeApp({
                        credential: cert({
                            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'placeholder',
                            clientEmail: 'error@placeholder.iam.gserviceaccount.com',
                            privateKey: '-----BEGIN RSA PRIVATE KEY-----\nplaceholder\n-----END RSA PRIVATE KEY-----\n',
                        }),
                        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
                    });
                } catch {
                    // Son care: basic init
                    adminApp = initializeApp({
                        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
                    });
                }
            }
        } else {
            console.warn('Firebase Admin: FIREBASE_SERVICE_ACCOUNT_KEY env degiskeni bulunamadi.');
            initError = 'FIREBASE_SERVICE_ACCOUNT_KEY ortam degiskeni eksik.';
            // Credential olmadan baslatma — hatali islemler anlasilir hata verecek
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

try {
    initAdmin();
} catch (err: any) {
    console.error('Firebase Admin init tamamen basarisiz:', err?.message || err);
    initError = `Init tamamen basarisiz: ${err?.message || err}`;
}

export { adminAuth, adminDb, initError };
