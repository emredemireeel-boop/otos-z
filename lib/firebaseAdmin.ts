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

let adminApp: App | undefined;
let adminAuth: Auth | undefined;
let adminDb: Firestore | undefined;
let initError: string | null = null;

function parseServiceAccount(): any {
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (!raw) {
        // ENV yoksa dosyadan okumayı dene (build-time fallback)
        try {
            const fs = require('fs');
            const path = require('path');
            const filePath = path.join(process.cwd(), 'otosoz-admin.json');
            if (fs.existsSync(filePath)) {
                const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                if (parsed.private_key && typeof parsed.private_key === 'string') {
                    parsed.private_key = parsed.private_key.replace(/\\n/g, '\n');
                }
                return parsed;
            }
        } catch (fileErr: any) {
            // Dosyadan okuma da başarısız — sessizce devam et
        }
        return null;
    }

    // Windows .env dosyalarında JSON'un içindeki newline'lar bozulabilir
    // Adım 1: Dış wrapper'daki satır sonlarını temizle
    const stripped = raw.trim();

    try {
        const parsed = JSON.parse(stripped);
        // private_key içindeki literal \n karakterlerini gerçek newline'a çevir
        if (parsed.private_key && typeof parsed.private_key === 'string') {
            parsed.private_key = parsed.private_key.replace(/\\n/g, '\n');
        }
        return parsed;
    } catch (firstErr) {
        // İkinci deneme: tek satırlık JSON'u temizle
        try {
            const cleaned = stripped
                .replace(/\r?\n/g, '')  // satır sonlarını kaldır
                .replace(/\t/g, ' ');   // tab'ları boşluğa çevir
            const parsed = JSON.parse(cleaned);
            if (parsed.private_key && typeof parsed.private_key === 'string') {
                parsed.private_key = parsed.private_key.replace(/\\n/g, '\n');
            }
            return parsed;
        } catch (secondErr: any) {
            console.error('Firebase Admin: Service account JSON parse hatası:', secondErr?.message);
            return null;
        }
    }
}

function initAdmin(): void {
    if (getApps().length > 0) {
        // Zaten başlatılmış — mevcut app'i kullan
        adminApp = getApps()[0];
        adminAuth = getAuth(adminApp);
        adminDb = getFirestore(adminApp);
        return;
    }

    const serviceAccount = parseServiceAccount();

    if (serviceAccount) {
        try {
            adminApp = initializeApp({
                credential: cert(serviceAccount),
                projectId: serviceAccount.project_id || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            });
            adminAuth = getAuth(adminApp);
            adminDb = getFirestore(adminApp);
            return;
        } catch (err: any) {
            initError = `Firebase Admin init hatası: ${err?.message || err}`;
            console.error('Firebase Admin: initializeApp hatası:', err?.message || err);
        }
    } else {
        initError = 'FIREBASE_SERVICE_ACCOUNT_KEY ortam değişkeni eksik veya geçersiz JSON.';
        console.warn('Firebase Admin:', initError);
    }

    // Son çare: sadece projectId ile başlat (token doğrulama çalışmaz ama crash olmaz)
    try {
        adminApp = initializeApp({ projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'otosoz' });
        adminAuth = getAuth(adminApp);
        adminDb = getFirestore(adminApp);
    } catch (fallbackErr: any) {
        console.error('Firebase Admin: Fallback init de başarısız:', fallbackErr?.message);
    }
}

try {
    initAdmin();
} catch (err: any) {
    initError = `Firebase Admin tamamen başlatılamadı: ${err?.message || err}`;
    console.error(initError);
}

// Güvenli getter'lar — başlatılmamışsa anlamlı hata verir
export function getAdminAuth(): Auth {
    if (!adminAuth) throw new Error('Firebase Admin Auth başlatılmamış. initError: ' + initError);
    return adminAuth;
}

export function getAdminDb(): Firestore {
    if (!adminDb) throw new Error('Firebase Admin Firestore başlatılmamış. initError: ' + initError);
    return adminDb;
}

// Backward compat — doğrudan kullanım için
export { adminAuth, adminDb, initError };
