import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import libraryGuides from './public/data/library_guides.json';
import { createSeoSlug } from './lib/slug';
import { mythsData } from './data/efsane-avcilari-data';
import { getLibraryCategoryRedirect } from './lib/library-categories';
import { getDnaLegacyRedirect } from './lib/arac-dna-redirects';
import { getCanonicalDictionaryId } from './lib/seoUrls';
import { getObdCode, obdDirectoryPageCount } from './lib/obd-catalog';
import { forumCategories, forumHubPath, normalizeForumCategory } from './lib/forum-hub';

const ARTICLE_CANONICAL_SLUGS = new Map<string, string>(
    libraryGuides.guides.flatMap(guide => {
        const canonicalRouteId = String(guide.urlId || guide.id);
        const canonicalSlug = `${createSeoSlug(guide.title)}--${canonicalRouteId}`;
        const legacyRouteIds = new Set([canonicalRouteId, String(guide.id)]);

        return Array.from(legacyRouteIds, routeId => [routeId, canonicalSlug] as const);
    }),
);

const MYTH_CANONICAL_SLUGS = new Map(
    mythsData.map(myth => [String(myth.id), `${myth.slug}--${myth.id}`] as const),
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

export async function proxy(request: NextRequest) {
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
        newUrl.port = '';
        return NextResponse.redirect(newUrl, 301);
    }

    const path = request.nextUrl.pathname;
    let decodedPath: string;
    try {
        decodedPath = decodeURIComponent(path).toLowerCase();
    } catch {
        return new NextResponse('Geçersiz istek yolu.', { status: 400 });
    }

    // Hub sayfa 1 ve eski query sayfalaması tek path canonical'a taşınır.
    // Ayrılmış segmentler tekil konu belge kimliği gibi Firestore'da aranmaz.
    const forumPageMatch = path.match(/^\/forum(?:\/kategori\/([^/]+))?\/sayfa\/(\d+)$/);
    if (forumPageMatch) {
        const page = Number(forumPageMatch[2]);
        const category = forumPageMatch[1];
        const knownCategory = !category || forumCategories.some(item => item.slug === category);
        if (knownCategory && Number.isSafeInteger(page) && page >= 1) {
            const target = forumHubPath(page, category);
            if (path !== target) {
                const canonicalUrl = request.nextUrl.clone();
                canonicalUrl.pathname = target;
                return NextResponse.redirect(canonicalUrl, 308);
            }
        }
    }
    const forumRootMatch = path.match(/^\/forum(?:\/kategori\/([^/]+))?$/);
    const legacyForumPage = request.nextUrl.searchParams.get('sayfa');
    const legacyForumCategory = path === '/forum' ? request.nextUrl.searchParams.get('kategori') : null;
    if (forumRootMatch && (legacyForumCategory !== null || (legacyForumPage && /^\d+$/.test(legacyForumPage)))) {
        const page = legacyForumPage ? Number(legacyForumPage) : 1;
        if (Number.isSafeInteger(page) && page >= 1) {
            const category = legacyForumCategory !== null
                ? forumCategories.find(item => item.name === normalizeForumCategory(legacyForumCategory))?.slug
                : forumRootMatch[1];
            const canonicalUrl = request.nextUrl.clone();
            canonicalUrl.pathname = forumHubPath(page, category);
            canonicalUrl.searchParams.delete('sayfa');
            canonicalUrl.searchParams.delete('kategori');
            return NextResponse.redirect(canonicalUrl, 308);
        }
    }

    // DNA yolunun tamamını koru: model layout'unda yönlendirme alt sekmeyi
    // kaybedebiliyor ve streaming başladıysa HTTP yerine meta-refresh üretiyordu.
    if (/^\/arac-dna(?:\/|$)/i.test(path)) {
        const target = getDnaLegacyRedirect(decodedPath) || decodedPath;
        if (decodeURIComponent(path) !== target) {
            const canonicalUrl = request.nextUrl.clone();
            canonicalUrl.pathname = target;
            return NextResponse.redirect(canonicalUrl, 308);
        }
    }

    // OBD kodlarının tek canonical biçimi küçük harftir. Statik üretilmiş sayfalar
    // büyük harfli yolu da 200 ile karşılayabildiği için yönlendirmeyi render öncesi yap.
    const obdCodeMatch = decodedPath.match(/^\/obd\/([^/]+)$/);
    const canonicalObdCode = obdCodeMatch ? getObdCode(obdCodeMatch[1])?.code.toLowerCase() : undefined;
    if (canonicalObdCode && path !== `/obd/${canonicalObdCode}`) {
        const canonicalUrl = request.nextUrl.clone();
        canonicalUrl.pathname = '/obd/' + canonicalObdCode;
        return NextResponse.redirect(canonicalUrl, 308);
    }

    // Yalnızca katalogda bulunan eski marka/kod yolları taşınır.
    // Biçimi doğru olsa bile olmayan bir kod yönlendirme yerine 404 alır.
    const legacyObdMatch = decodedPath.match(/^\/obd\/[^/]+\/([^/]+)$/);
    const legacyObdCode = legacyObdMatch ? getObdCode(legacyObdMatch[1]) : undefined;
    if (legacyObdCode) {
        const canonicalUrl = request.nextUrl.clone();
        canonicalUrl.pathname = `/obd/${legacyObdCode.code.toLowerCase()}`;
        return NextResponse.redirect(canonicalUrl, 308);
    }

    const dictionaryMatch = decodedPath.match(/^\/sozluk\/([^/]+)$/);
    if (dictionaryMatch) {
        const canonicalPath = `/sozluk/${getCanonicalDictionaryId(dictionaryMatch[1])}`;
        if (decodeURIComponent(path) !== canonicalPath) {
            const canonicalUrl = request.nextUrl.clone();
            canonicalUrl.pathname = canonicalPath;
            return NextResponse.redirect(canonicalUrl, 308);
        }
    }

    const directoryMatch = decodedPath.match(/^\/obd-kodlari\/(\d+)$/);
    if (directoryMatch) {
        const page = Number(directoryMatch[1]);
        const canonicalPath = `/obd-kodlari/${page}`;
        if (Number.isSafeInteger(page) && page >= 1 && page <= obdDirectoryPageCount && path !== canonicalPath) {
            const canonicalUrl = request.nextUrl.clone();
            canonicalUrl.pathname = canonicalPath;
            return NextResponse.redirect(canonicalUrl, 308);
        }
    }
    // Eski sözlük ve OBD URL'lerini içerik sunabilen güncel adreslere taşı.
    // Bu yollar geçmişte 200 durum kodlu "bulunamadı" sayfası üreterek
    // Search Console'da soft 404 olarak görünüyordu.
    const legacyPathRedirects: Record<string, string> = {
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
        const target = getLibraryCategoryRedirect(category)
            || (request.nextUrl.searchParams.getAll('kategori').length > 1
                ? `/kutuphane?kategori=${encodeURIComponent(category || '')}` : null);

        if (target) {
            const canonicalUrl = new URL(target, request.url);
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

    if (path.startsWith('/kutuphane/efsane-avcilari/')) {
        const requestedSlug = decodeURIComponent(path.slice('/kutuphane/efsane-avcilari/'.length));
        const routeId = requestedSlug.split('--').at(-1) || '';
        const canonicalSlug = /^\d+$/.test(routeId) ? MYTH_CANONICAL_SLUGS.get(String(Number(routeId))) : undefined;
        if (canonicalSlug && requestedSlug !== canonicalSlug) {
            const canonicalUrl = request.nextUrl.clone();
            canonicalUrl.pathname = `/kutuphane/efsane-avcilari/${canonicalSlug}`;
            return NextResponse.redirect(canonicalUrl, 308);
        }
    }

    // Konu başlığı değişebilir; yalnızca konu belgesiyle canonical slug çözülür.
    // Veri erişim hatası kalıcı 404/308 kararına dönüştürülmez.
    const forumMatch = path.match(/^\/forum\/([^/]+)$/);
    if (forumMatch && !['sayfa', 'kategori', 'feed.xml'].includes(forumMatch[1])) {
        try {
            const { getForumCanonicalRoute } = await import('./lib/forum-route-server');
            const requestedSlug = decodeURIComponent(forumMatch[1]);
            const canonicalSlug = await getForumCanonicalRoute(requestedSlug);
            if (canonicalSlug && requestedSlug !== canonicalSlug) {
                const canonicalUrl = request.nextUrl.clone();
                canonicalUrl.pathname = `/forum/${canonicalSlug}`;
                return NextResponse.redirect(canonicalUrl, 308);
            }
        } catch {
            return new NextResponse('Konu geçici olarak yüklenemiyor.', {
                status: 503,
                headers: { 'Retry-After': '60', 'X-Robots-Tag': 'noindex' },
            });
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
