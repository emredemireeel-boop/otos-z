/**
 * Simple In-Memory Rate Limiter
 * 
 * API route'larina brute-force ve DoS saldirilarini onler.
 * Production'da Redis gibi bir store kullanilmali, 
 * bu versiyon tek-instance sunucu icin yeterlidir.
 */

interface RateLimitEntry {
    count: number;
    resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Her 5 dakikada bir eski kayitlari temizle
setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
        if (now > entry.resetTime) {
            rateLimitStore.delete(key);
        }
    }
}, 5 * 60 * 1000);

interface RateLimitConfig {
    /** Zaman penceresi (milisaniye) */
    windowMs: number;
    /** Pencere icinde izin verilen max istek */
    maxRequests: number;
}

// Ozel pencereler
export const RATE_LIMITS = {
    /** Genel API istekleri: dakikada 60 */
    general: { windowMs: 60_000, maxRequests: 60 },
    /** Admin islemleri: dakikada 30 */
    admin: { windowMs: 60_000, maxRequests: 30 },
    /** Forum entry: dakikada 10 */
    createContent: { windowMs: 60_000, maxRequests: 10 },
    /** Giris denemesi: 15 dakikada 10 */
    auth: { windowMs: 15 * 60_000, maxRequests: 10 },
    /** Rapor/sikayet: saatte 5 */
    report: { windowMs: 60 * 60_000, maxRequests: 5 },
} as const;

/**
 * IP veya kullanici bazli rate limit kontrolu.
 * @returns null = gecebilir, { retryAfter } = engellendi
 */
export function checkRateLimit(
    identifier: string,
    config: RateLimitConfig
): { allowed: boolean; retryAfterMs?: number; remaining: number } {
    const now = Date.now();
    const key = identifier;

    const entry = rateLimitStore.get(key);

    if (!entry || now > entry.resetTime) {
        // Yeni pencere baslat
        rateLimitStore.set(key, { count: 1, resetTime: now + config.windowMs });
        return { allowed: true, remaining: config.maxRequests - 1 };
    }

    if (entry.count >= config.maxRequests) {
        // Limit asildi
        return {
            allowed: false,
            retryAfterMs: entry.resetTime - now,
            remaining: 0,
        };
    }

    // Sayaci artir
    entry.count++;
    return { allowed: true, remaining: config.maxRequests - entry.count };
}

/**
 * Request'ten IP adresini cikarir
 */
export function getClientIP(request: Request): string {
    const forwarded = request.headers.get('x-forwarded-for');
    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }
    const realIp = request.headers.get('x-real-ip');
    if (realIp) return realIp;
    return 'unknown';
}
