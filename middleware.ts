import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import libraryGuides from './public/data/library_guides.json';
import { createSeoSlug } from './lib/slug';

const ARTICLE_CANONICAL_SLUGS = new Map<string, string>(
    libraryGuides.guides.flatMap(guide => {
        const canonicalRouteId = String(guide.urlId || guide.id);
        const canonicalSlug = `${createSeoSlug(guide.title)}--${canonicalRouteId}`;
        const legacyRouteIds = new Set([canonicalRouteId, String(guide.id)]);

        return Array.from(legacyRouteIds, routeId => [routeId, canonicalSlug] as const);
    }),
);

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
    const hostHeader = (request.headers.get('host') || '').toLowerCase();
    const hostname = hostHeader.split(':')[0];
    const allowedHosts = new Set(['otosoz.com', 'www.otosoz.com', 'localhost', '127.0.0.1']);

    // Host başlığı üzerinden açık yönlendirme/cache poisoning yapılmasını engelle.
    if (!allowedHosts.has(hostname)) {
        return new NextResponse('Geçersiz host.', { status: 400 });
    }

    // ── www → sabit canonical alan adı ──
    if (hostname === 'www.otosoz.com') {
        const newUrl = request.nextUrl.clone();
        newUrl.protocol = 'https:';
        newUrl.host = 'otosoz.com';
        return NextResponse.redirect(newUrl, 301);
    }

    const path = request.nextUrl.pathname;
    let decodedPath: string;
    try {
        decodedPath = decodeURIComponent(path).toLowerCase();
    } catch {
        return new NextResponse('Geçersiz istek yolu.', { status: 400 });
    }

    // Eski sözlük ve OBD URL'lerini içerik sunabilen güncel adreslere taşı.
    // Bu yollar geçmişte 200 durum kodlu "bulunamadı" sayfası üreterek
    // Search Console'da soft 404 olarak görünüyordu.
    const legacyPathRedirects: Record<string, string> = {
        '/sozluk/amortisör_takozu': '/sozluk/amortisor_takozu',
        '/obd/citron': '/obd/citroen',
        '/obd/alfa romeo': '/obd/alfa-romeo',
        '/obd/aston martin': '/obd/aston-martin',
    };
    const legacyDestination = legacyPathRedirects[decodedPath];

    if (legacyDestination) {
        return NextResponse.redirect(new URL(legacyDestination, request.url), 308);
    }

    // Eski Kütüphane query adreslerini temiz ve tek bir canonical hedefe taşı.
    // Arama motoru yönlendirme hedefinde eski query parametresini görmez.
    if (path === '/kutuphane') {
        const category = request.nextUrl.searchParams.get('kategori');
        const categoryRedirects: Record<string, { pathname: string; category?: string }> = {
            'obd-ariza-kodlari': { pathname: '/obd' },
            'otoyol-ucretleri': { pathname: '/kutuphane', category: 'otoyol-ve-kopru-ucretleri' },
            'ehliyet-sinifari': { pathname: '/kutuphane', category: 'ehliyet-siniflari' },
            'makaleler': { pathname: '/kutuphane' },
        };
        const target = category ? categoryRedirects[category] : undefined;

        if (target) {
            const canonicalUrl = request.nextUrl.clone();
            canonicalUrl.pathname = target.pathname;
            canonicalUrl.search = '';
            if (target.category) canonicalUrl.searchParams.set('kategori', target.category);
            return NextResponse.redirect(canonicalUrl, 308);
        }
    }

    // Eski, Unicode veya sonradan değişmiş makale başlıklarını HTTP düzeyinde
    // tek kalıcı slug'a taşı. Böylece Google aynı içeriği alternatif canonical
    // olarak tekrar tekrar taramak yerine yalnızca güncel URL'yi izler.
    if (path.startsWith('/makale/')) {
        const requestedSlug = decodeURIComponent(path.slice('/makale/'.length));
        const routeId = requestedSlug.split('--').at(-1) || '';
        const normalizedRouteId = /^\d{3}$/.test(routeId)
            ? `guide_${routeId}`
            : routeId;
        const canonicalSlug = ARTICLE_CANONICAL_SLUGS.get(routeId)
            || ARTICLE_CANONICAL_SLUGS.get(normalizedRouteId);

        if (canonicalSlug && requestedSlug !== canonicalSlug) {
            const canonicalUrl = request.nextUrl.clone();
            canonicalUrl.pathname = `/makale/${canonicalSlug}`;
            return NextResponse.redirect(canonicalUrl, 308);
        }
    }

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
