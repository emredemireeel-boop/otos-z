import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Edge middleware — kaba kapı (coarse gate).
 *
 * ⚠️ GÜVENLİK NOTU:
 *  - Edge runtime'da firebase-admin çalışmadığı için token imzası burada
 *    TAM doğrulanamaz. Bu nedenle middleware yalnızca "kaba" bir kapıdır:
 *    geçerli (süresi dolmamış) bir oturum token'ı var mı diye bakar.
 *  - Gerçek yetki (admin/moderator rolü) kontrolü iki katmanda yapılır:
 *      1) Sayfa katmanı: app/admin/layout.tsx — Firestore'dan canlı rolü doğrular.
 *      2) Veri katmanı: tüm /api/admin rotaları Firebase Admin SDK ile ID token
 *         doğrular + Firestore'dan rolü okur; Firestore kuralları da rolü zorlar.
 *  - Yani user_role cookie'si SAHTE olsa bile saldırgan veri okuyamaz/yazamaz;
 *    en fazla boş bir admin iskeletini görür ve hemen geri yönlendirilir.
 */

/** JWT payload'ını imza doğrulamadan çözer (yalnızca exp kontrolü için). */
function getTokenExp(token: string): number | null {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;
        // base64url -> base64
        const payloadB64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const json = atob(payloadB64);
        const payload = JSON.parse(json);
        return typeof payload.exp === 'number' ? payload.exp : null;
    } catch {
        return null;
    }
}

function isTokenValid(token: string | undefined): boolean {
    if (!token) return false;
    const exp = getTokenExp(token);
    if (exp === null) return false;
    // exp saniye cinsinden; süresi dolmuşsa geçersiz
    return exp * 1000 > Date.now();
}

export function middleware(request: NextRequest) {
    const hostname = request.headers.get('host') || '';
    
    // ── www → non-www 301 redirect (SEO) ──
    if (hostname.startsWith('www.')) {
        const newUrl = new URL(request.url);
        newUrl.host = hostname.replace('www.', '');
        return NextResponse.redirect(newUrl, 301);
    }

    const path = request.nextUrl.pathname;
    const token = request.cookies.get('auth_token')?.value;
    const role = request.cookies.get('user_role')?.value;

    const tokenValid = isTokenValid(token);

    const redirectToLogin = () => {
        const url = new URL('/giris', request.url);
        url.searchParams.set('redirect', path);
        return NextResponse.redirect(url);
    };

    // ── /admin/* → geçerli oturum + admin rolü (kaba) ──
    if (path.startsWith('/admin')) {
        if (!tokenValid) return redirectToLogin();
        if (role !== 'admin') {
            if (role === 'moderator') {
                return NextResponse.redirect(new URL('/moderator', request.url));
            }
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    // ── /moderator/* → geçerli oturum + moderatör/admin rolü (kaba) ──
    if (path.startsWith('/moderator')) {
        if (!tokenValid) return redirectToLogin();
        if (role !== 'moderator' && role !== 'admin') {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        // www redirect için tüm sayfaları yakala (statik dosyalar hariç)
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|css|js|woff|woff2|ttf|eot|json|xml|txt|map)).*)',
    ],
};

