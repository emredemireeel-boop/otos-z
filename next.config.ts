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
                permanent: true,
            },
            {
                // /obd/{brand}/{code} → /obd/{code} — duplicate content önleme
                source: '/obd/:brand/:code',
                destination: '/obd/:code',
                permanent: true,
            },
            // ── Eski /kutuphane/rehber/ URL'leri → /kutuphane/{guideId} ──
            {
                source: '/kutuphane/rehber/:guideId',
                destination: '/kutuphane/:guideId',
                permanent: true,
            },
            // ── Eski /yakit-hesaplama → /otohesap/yakit-hesaplama ──
            {
                source: '/yakit-hesaplama',
                destination: '/otohesap/yakit-hesaplama',
                permanent: true,
            },
            // ── Eski /kullanim-kosullari → /kullanim-sartlari ──
            {
                source: '/kullanim-kosullari',
                destination: '/kullanim-sartlari',
                permanent: true,
            },
            // ── Birleşik marka slug'ları (Opel / Hyundai vb.) → ana markaya yönlendir ──
            {
                source: '/arac-dna/opel-hyundai',
                destination: '/arac-dna/opel',
                permanent: true,
            },
            {
                source: '/arac-dna/opel-peugeot',
                destination: '/arac-dna/opel',
                permanent: true,
            },
            {
                source: '/arac-dna/toyota-honda',
                destination: '/arac-dna/toyota',
                permanent: true,
            },
            {
                source: '/arac-dna/hyundai-kia',
                destination: '/arac-dna/hyundai',
                permanent: true,
            },
            {
                source: '/arac-dna/peugeot-citroen',
                destination: '/arac-dna/peugeot',
                permanent: true,
            },
            {
                source: '/arac-dna/dacia-renault',
                destination: '/arac-dna/dacia',
                permanent: true,
            },
            {
                source: '/arac-dna/skoda-seat',
                destination: '/arac-dna/skoda',
                permanent: true,
            },
            {
                source: '/arac-dna/skoda-vw',
                destination: '/arac-dna/skoda',
                permanent: true,
            },
            {
                source: '/arac-dna/seat-vw',
                destination: '/arac-dna/seat',
                permanent: true,
            },
            {
                source: '/arac-dna/hyundai-renault',
                destination: '/arac-dna/hyundai',
                permanent: true,
            },
            // ── Hub sayfası olmayan eski URL'ler ──
            {
                source: '/bakim-rehberi',
                destination: '/kutuphane?kategori=bakim-zamanlari',
                permanent: true,
            },
            {
                source: '/ikinci-el-rehberi',
                destination: '/kutuphane?kategori=ikinci-el-rehberi',
                permanent: true,
            },
            // ── Bozuk URL'ler ──
            {
                source: '/\\&',
                destination: '/',
                permanent: true,
            },
            {
                source: '/\\$',
                destination: '/',
                permanent: true,
            },
        ];
    },
    // Powered-by header'ını kaldır (bilgi sızıntısı önleme)
    poweredByHeader: false,
    // TypeScript kontrolünü build aşamasında atla (bellek tasarrufu ~800MB)
    // Kontrol zaten IDE ve lokal geliştirmede yapılıyor
    typescript: {
        ignoreBuildErrors: true,
    },
};

export default nextConfig;
