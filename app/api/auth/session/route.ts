import { NextResponse } from 'next/server';
import { getAdminAuth, getAdminDb } from '@/lib/firebaseAdmin';
import { checkRateLimit, getClientIP, RATE_LIMITS } from '@/lib/rateLimit';

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    path: '/',
};

function isSameOrigin(request: Request): boolean {
    const origin = request.headers.get('origin');
    const host = request.headers.get('host');
    if (!origin || !host) return false;
    try {
        const parsed = new URL(origin);
        const originHost = parsed.host.toLowerCase();
        const requestHost = host.toLowerCase();
        if (originHost !== requestHost) return false;
        return process.env.NODE_ENV !== 'production' || parsed.protocol === 'https:';
    } catch {
        return false;
    }
}

function clearSession(response: NextResponse) {
    response.cookies.set('auth_token', '', { ...COOKIE_OPTIONS, maxAge: 0 });
    response.cookies.set('user_role', '', { ...COOKIE_OPTIONS, maxAge: 0 });
    return response;
}

export async function POST(request: Request) {
    const ip = getClientIP(request);
    const rateLimit = checkRateLimit(`auth-session:${ip}`, RATE_LIMITS.auth);
    if (!rateLimit.allowed) {
        return NextResponse.json({ success: false, message: 'Çok fazla oturum isteği.' }, {
            status: 429,
            headers: { 'Retry-After': String(Math.ceil((rateLimit.retryAfterMs || 60_000) / 1000)) },
        });
    }
    if (!isSameOrigin(request)) {
        return NextResponse.json({ success: false, message: 'Geçersiz istek kaynağı.' }, { status: 403 });
    }

    try {
        const body = await request.json();
        const idToken = typeof body?.idToken === 'string' ? body.idToken.trim() : '';
        if (!idToken || idToken.length > 8192) {
            return NextResponse.json({ success: false, message: 'Geçersiz token.' }, { status: 400 });
        }

        const decoded = await getAdminAuth().verifyIdToken(idToken, true);
        const profile = await getAdminDb().collection('users').doc(decoded.uid).get();
        const data = profile.data() || {};
        const role = typeof data.role === 'string' ? data.role : 'caylak';
        const bannedUntil = data.bannedUntil?.toMillis?.() ?? null;
        const banActive = data.banned === true && (bannedUntil === null || bannedUntil > Date.now());
        if (banActive) {
            return clearSession(NextResponse.json({ success: false, message: 'Hesap erişime kapalı.' }, { status: 403 }));
        }

        const maxAge = Math.max(60, Math.min(3600, Number(decoded.exp || 0) - Math.floor(Date.now() / 1000)));
        const response = NextResponse.json({ success: true }, {
            headers: { 'Cache-Control': 'no-store, max-age=0' },
        });
        response.cookies.set('auth_token', idToken, { ...COOKIE_OPTIONS, maxAge });
        response.cookies.set('user_role', role, { ...COOKIE_OPTIONS, maxAge });
        return response;
    } catch {
        return clearSession(NextResponse.json({ success: false, message: 'Kimlik doğrulama başarısız.' }, { status: 401 }));
    }
}

export async function DELETE(request: Request) {
    if (!isSameOrigin(request)) {
        return NextResponse.json({ success: false, message: 'Geçersiz istek kaynağı.' }, { status: 403 });
    }
    return clearSession(NextResponse.json({ success: true }, {
        headers: { 'Cache-Control': 'no-store, max-age=0' },
    }));
}
