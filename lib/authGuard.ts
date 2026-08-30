import { NextResponse } from 'next/server';
import { getAdminAuth, getAdminDb } from './firebaseAdmin';

export interface AuthResult {
    authenticated: boolean;
    uid?: string;
    email?: string;
    role?: string;
    error?: string;
}

function isBanActive(data: FirebaseFirestore.DocumentData): boolean {
    if (data.banned !== true) return false;
    const until = data.bannedUntil?.toMillis?.();
    return typeof until !== 'number' || until > Date.now();
}

export async function verifyAuth(request: Request): Promise<AuthResult> {
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return { authenticated: false, error: 'Yetkilendirme tokenı eksik.' };
        }
        const idToken = authHeader.slice(7).trim();
        if (!idToken || idToken.length > 8192) {
            return { authenticated: false, error: 'Geçersiz token formatı.' };
        }

        const decodedToken = await getAdminAuth().verifyIdToken(idToken, true);
        const userDoc = await getAdminDb().collection('users').doc(decodedToken.uid).get();
        const profile = userDoc.data() || {};
        if (isBanActive(profile)) {
            return { authenticated: false, error: 'Hesap erişime kapalı.' };
        }

        return {
            authenticated: true,
            uid: decodedToken.uid,
            email: decodedToken.email,
            role: typeof profile.role === 'string' ? profile.role : 'caylak',
        };
    } catch (error: unknown) {
        const code = (error as { code?: string }).code;
        if (code === 'auth/id-token-expired') {
            return { authenticated: false, error: 'Oturum süresi dolmuş. Lütfen tekrar giriş yapın.' };
        }
        return { authenticated: false, error: 'Kimlik doğrulama başarısız.' };
    }
}

export async function requireAdmin(request: Request): Promise<AuthResult | NextResponse> {
    const auth = await verifyAuth(request);
    if (!auth.authenticated) {
        return NextResponse.json({ success: false, message: auth.error }, { status: 401 });
    }
    if (auth.role !== 'admin') {
        return NextResponse.json({ success: false, message: 'Bu işlem için admin yetkisi gereklidir.' }, { status: 403 });
    }
    return auth;
}

export async function requireModOrAdmin(request: Request): Promise<AuthResult | NextResponse> {
    const auth = await verifyAuth(request);
    if (!auth.authenticated) {
        return NextResponse.json({ success: false, message: auth.error }, { status: 401 });
    }
    if (auth.role !== 'admin' && auth.role !== 'moderator') {
        return NextResponse.json({ success: false, message: 'Bu işlem için yetkili rolü gereklidir.' }, { status: 403 });
    }
    return auth;
}

export async function requireAuth(request: Request): Promise<AuthResult | NextResponse> {
    const auth = await verifyAuth(request);
    if (!auth.authenticated) {
        return NextResponse.json({ success: false, message: auth.error }, { status: 401 });
    }
    return auth;
}
