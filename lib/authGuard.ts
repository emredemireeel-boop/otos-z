import { NextResponse } from 'next/server';
import { adminAuth } from './firebaseAdmin';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

/**
 * API Route Authentication & Authorization Utility
 * 
 * Tum API isteklerinde kullanilacak guvenlik katmani.
 * Firebase ID Token dogrulamasi + Firestore rol kontrolu yapar.
 */

export interface AuthResult {
    authenticated: boolean;
    uid?: string;
    email?: string;
    role?: string;
    error?: string;
}

/**
 * Request'ten Bearer token'i cikarir ve Firebase Admin SDK ile dogrular.
 * Ardindan Firestore'dan kullanicinin rolunu kontrol eder.
 */
export async function verifyAuth(request: Request): Promise<AuthResult> {
    try {
        const authHeader = request.headers.get('Authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return { authenticated: false, error: 'Yetkilendirme token\'ı eksik.' };
        }

        const idToken = authHeader.split('Bearer ')[1];

        if (!idToken || idToken.trim().length === 0) {
            return { authenticated: false, error: 'Geçersiz token formatı.' };
        }

        // Firebase Admin SDK ile token dogrula
        const decodedToken = await adminAuth.verifyIdToken(idToken);

        // Firestore'dan guncel rolu al (cookie'ye guvenme!)
        let role = 'caylak';
        try {
            const userDoc = await getDoc(doc(db, 'users', decodedToken.uid));
            if (userDoc.exists()) {
                role = userDoc.data().role || 'caylak';
            }
        } catch (e) {
            console.warn('Rol okuma hatasi:', e);
        }

        return {
            authenticated: true,
            uid: decodedToken.uid,
            email: decodedToken.email,
            role,
        };
    } catch (error: any) {
        // Token suresi dolmus, gecersiz, vb.
        if (error.code === 'auth/id-token-expired') {
            return { authenticated: false, error: 'Oturum süresi dolmuş. Lütfen tekrar giriş yapın.' };
        }
        if (error.code === 'auth/argument-error' || error.code === 'auth/id-token-revoked') {
            return { authenticated: false, error: 'Geçersiz veya iptal edilmiş token.' };
        }
        console.error('Token dogrulama hatasi:', error.message);
        return { authenticated: false, error: 'Kimlik doğrulama başarısız.' };
    }
}

/**
 * Admin yetkisi gerektirir. 401/403 döner veya AuthResult verir.
 */
export async function requireAdmin(request: Request): Promise<AuthResult | NextResponse> {
    const auth = await verifyAuth(request);

    if (!auth.authenticated) {
        return NextResponse.json(
            { success: false, message: auth.error || 'Yetkilendirme başarısız.' },
            { status: 401 }
        );
    }

    if (auth.role !== 'admin') {
        return NextResponse.json(
            { success: false, message: 'Bu işlem için admin yetkisi gereklidir.' },
            { status: 403 }
        );
    }

    return auth;
}

/**
 * Moderator veya Admin yetkisi gerektirir.
 */
export async function requireModOrAdmin(request: Request): Promise<AuthResult | NextResponse> {
    const auth = await verifyAuth(request);

    if (!auth.authenticated) {
        return NextResponse.json(
            { success: false, message: auth.error || 'Yetkilendirme başarısız.' },
            { status: 401 }
        );
    }

    if (auth.role !== 'admin' && auth.role !== 'moderator') {
        return NextResponse.json(
            { success: false, message: 'Bu işlem için yetkili rolü gereklidir.' },
            { status: 403 }
        );
    }

    return auth;
}

/**
 * Sadece giris yapmis kullanici gerektirir (herhangi bir rol).
 */
export async function requireAuth(request: Request): Promise<AuthResult | NextResponse> {
    const auth = await verifyAuth(request);

    if (!auth.authenticated) {
        return NextResponse.json(
            { success: false, message: auth.error || 'Giriş yapmanız gerekiyor.' },
            { status: 401 }
        );
    }

    return auth;
}
