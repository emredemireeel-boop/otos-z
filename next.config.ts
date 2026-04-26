import type { NextConfig } from "next";

const securityHeaders = [
    {
        // Clickjacking koruması - iframe'de gösterilmesini engelle
        key: 'X-Frame-Options',
        value: 'DENY',
    },
    {
        // MIME sniffing koruması
        key: 'X-Content-Type-Options',
        value: 'nosniff',
    },
    {
        // XSS koruması (eski tarayıcılar için)
        key: 'X-XSS-Protection',
        value: '1; mode=block',
    },
    {
        // Referrer bilgisini sınırla
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin',
    },
    {
        // Kullanılmayan tarayıcı API'lerini kapat
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=(self), interest-cohort=()',
    },
    {
        // HTTPS zorunlu kıl (production'da)
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload',
    },
];

const nextConfig: NextConfig = {
    compress: true, // Gzip/Brotli sıkıştırmasını aktifleştirir
    images: {
        formats: ['image/avif', 'image/webp'], // Daha modern ve küçük resim formatları kullan
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
            },
            {
                protocol: 'https',
                hostname: '*.sahibinden.com',
            },
            {
                protocol: 'https',
                hostname: '*.arabam.com',
            },
        ],
    },
    // Güvenlik header'ları tüm sayfalara uygulanır
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: securityHeaders,
            },
            {
                // public klasöründeki statik görseller için önbellek (Cache-Control)
                source: '/:path*\\.(svg|jpg|png|webp|avif)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
        ];
    },
    async redirects() {
        return [
            {
                source: '/arac-dna/:brand/:model/artilari-eksileri',
                destination: '/arac-dna/:brand/:model/neden-alinir',
                permanent: true, // 301 Redirect for SEO
            },
        ];
    },
    // Powered-by header'ını kaldır (bilgi sızıntısı önleme)
    poweredByHeader: false,
};

export default nextConfig;
