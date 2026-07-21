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

// Eski etkinlik kayıtlarındaki oto pazarı sayfalarını tek ve kaynak kontrollü
// şehir/pazar URL yapısında birleştir. Böylece iki ayrı canonical üretilmez.
const openCarMarketRedirects = [
    ['istanbul-kartal-otopazari', '/acik-oto-pazari/istanbul/kartal-eski-oto-pazari'],
    ['ankara-pursaklar-otopazari', '/acik-oto-pazari/ankara/pursaklar-karacaoren-acik-oto-pazari'],
    ['izmir-kemalpasa-otopazari', '/acik-oto-pazari/izmir/kemalpasa-acik-oto-pazari'],
    ['izmir-gaziemir-otopazari', '/acik-oto-pazari/izmir/gaziemir-oto-pazari'],
    ['bursa-nilufer-otopazari', '/acik-oto-pazari/bursa/nilufer-ucevler-acik-oto-pazari'],
    ['adana-cukurova-otopazari', '/acik-oto-pazari/adana/belediye-evleri-semt-ve-oto-pazari'],
    ['antalya-kepez-otopazari', '/acik-oto-pazari/antalya/kepez-acik-oto-pazari'],
    ['aydin-efeler-otopazari', '/acik-oto-pazari/aydin'],
    ['balikesir-altieylul-otopazari', '/acik-oto-pazari/balikesir'],
    ['denizli-merkezefendi-otopazari', '/acik-oto-pazari/denizli'],
    ['diyarbakir-kayapinar-otopazari', '/acik-oto-pazari/diyarbakir'],
    ['erzurum-yakutiye-otopazari', '/acik-oto-pazari/erzurum'],
    ['eskisehir-odunpazari-otopazari', '/acik-oto-pazari/eskisehir/odunpazari-acik-oto-pazari'],
    ['gaziantep-sehitkamil-otopazari', '/acik-oto-pazari/gaziantep'],
    ['hatay-antakya-otopazari', '/acik-oto-pazari/hatay'],
    ['kahramanmaras-dulkadiroglu-otopazari', '/acik-oto-pazari/kahramanmaras'],
    ['kayseri-kocasinan-otopazari', '/acik-oto-pazari/kayseri/kocasinan-acik-oto-pazari'],
    ['kocaeli-basiskele-otopazari', '/acik-oto-pazari/kocaeli'],
    ['konya-karatay-otopazari', '/acik-oto-pazari/konya/karatay-galericiler-sitesi-acik-oto-pazari'],
    ['malatya-yesilyurt-otopazari', '/acik-oto-pazari/malatya'],
    ['manisa-sehzadeler-otopazari', '/acik-oto-pazari/manisa'],
    ['mardin-kiziltepe-otopazari', '/acik-oto-pazari/mardin'],
    ['mersin-toroslar-otopazari', '/acik-oto-pazari/mersin'],
    ['mugla-mentese-otopazari', '/acik-oto-pazari/mugla'],
    ['ordu-altinordu-otopazari', '/acik-oto-pazari/ordu'],
    ['sakarya-adapazari-otopazari', '/acik-oto-pazari/sakarya/gunesler-acik-oto-pazari'],
    ['samsun-tekkekoy-otopazari', '/acik-oto-pazari/samsun'],
    ['sanliurfa-haliliye-otopazari', '/acik-oto-pazari/sanliurfa'],
    ['tekirdag-suleymanpasa-otopazari', '/acik-oto-pazari/tekirdag'],
    ['trabzon-ortahisar-otopazari', '/acik-oto-pazari/trabzon'],
    ['van-tusba-otopazari', '/acik-oto-pazari/van'],
] as const;

const nextConfig: NextConfig = {
    // Üst dizindeki ilgisiz lockfile'ın Turbopack çalışma kökü olarak
    // seçilmesini engelle; derleme yalnızca bu projeyi tarasın.
    turbopack: {
        root: process.cwd(),
    },
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
            ...openCarMarketRedirects.map(([eventId, destination]) => ({
                source: `/etkinlikler/${eventId}`,
                destination,
                permanent: true,
            })),
            {
                source: '/arac-dna/:brand/:model/artilari-eksileri',
                destination: '/arac-dna/:brand/:model/neden-alinir',
                permanent: true,
            },
            // Eski, jenerasyonsuz Araç DNA model adresleri → güncel veri kaydı.
            // :path* motor ve içerik sekmelerini de aynı hedef altında korur.
            {
                source: '/arac-dna/bmw/320i/:path*',
                destination: '/arac-dna/bmw/320i-f30-2012-2019/:path*',
                permanent: true,
            },
            {
                source: '/arac-dna/renault/clio-3/:path*',
                destination: '/arac-dna/renault/clio-3-nesil-2005-2014/:path*',
                permanent: true,
            },
            {
                source: '/arac-dna/hyundai-renault/i20-clio-4/:path*',
                destination: '/arac-dna/hyundai/i20-2-nesil-gb-2014-2020/:path*',
                permanent: true,
            },
            {
                source: '/arac-dna/ford/focus/:path*',
                destination: '/arac-dna/ford/focus-4-nesil-mk4-2018-2025/:path*',
                permanent: true,
            },
            {
                source: '/arac-dna/renault/clio/:path*',
                destination: '/arac-dna/renault/clio-5-nesil-2020-2025/:path*',
                permanent: true,
            },
            {
                source: '/arac-dna/volkswagen/passat/:path*',
                destination: '/arac-dna/volkswagen/passat-b8-2015-2023/:path*',
                permanent: true,
            },
            {
                source: '/arac-dna/skoda/octavia/:path*',
                destination: '/arac-dna/skoda/octavia-nx-4-nesil-2020-2025/:path*',
                permanent: true,
            },
            {
                source: '/arac-dna/nissan/qashqai/:path*',
                destination: '/arac-dna/nissan/qashqai-j11-2014-2021/:path*',
                permanent: true,
            },
            {
                source: '/arac-dna/seat/leon/:path*',
                destination: '/arac-dna/seat/leon-kl-4-nesil-2020-2025/:path*',
                permanent: true,
            },
            {
                source: '/arac-dna/fiat/egea/:path*',
                destination: '/arac-dna/fiat/egea-1-nesil-2015-2025/:path*',
                permanent: true,
            },
            {
                source: '/arac-dna/dacia/duster/:path*',
                destination: '/arac-dna/dacia/duster-2010-2024/:path*',
                permanent: true,
            },
            {
                source: '/arac-dna/honda/civic/:path*',
                destination: '/arac-dna/honda/civic-11-nesil-fe1-2021-2025/:path*',
                permanent: true,
            },
            {
                source: '/arac-dna/renault/megane/:path*',
                destination: '/arac-dna/renault/megane-4-nesil-2016-2025/:path*',
                permanent: true,
            },
            {
                source: '/arac-dna/chery/tiggo-8-pro/:path*',
                destination: '/arac-dna/chery/tiggo-8-pro-1-nesil-2023-2025/:path*',
                permanent: true,
            },
            {
                source: '/arac-dna/dacia/sandero-stepway/:path*',
                destination: '/arac-dna/dacia/sandero-stepway-2021-2025/:path*',
                permanent: true,
            },
            {
                source: '/arac-dna/tesla/model-y/:path*',
                destination: '/arac-dna/tesla/model-y-1-nesil-2020-2025/:path*',
                permanent: true,
            },
            {
                source: '/arac-dna/hyundai/i20/:path*',
                destination: '/arac-dna/hyundai/i20-3-nesil-bc3-2020-2025/:path*',
                permanent: true,
            },
            {
                source: '/arac-dna/renault/fuence-15-dci/:path*',
                destination: '/arac-dna/renault/fluence-15-dci/:path*',
                permanent: true,
            },
            {
                source: '/arac-dna/citroen/c3/:path*',
                destination: '/arac-dna/citroen/c3-12-puretech/:path*',
                permanent: true,
            },
            {
                // /obd/{brand}/{code} → /obd/{code} — duplicate content önleme
                source: '/obd/:brand/:code',
                destination: '/obd/:code',
                permanent: true,
            },
            // Eski kütüphane kategori yollarını tek canonical kategori URL'sinde birleştir.
            // Bu adresler rehber detay rotasına düşüp ana sayfayı canonical gösteriyordu.
            {
                source: '/kutuphane/makaleler',
                destination: '/kutuphane',
                permanent: true,
            },
            {
                source: '/kutuphane/kaza-ilkyardim',
                destination: '/kutuphane?kategori=kaza-ilkyardim',
                permanent: true,
            },
            {
                source: '/kutuphane/dolandiricilik-rehberi',
                destination: '/kutuphane?kategori=dolandiricilik-rehberi',
                permanent: true,
            },
            {
                source: '/kutuphane/gosterge-isiklari',
                destination: '/kutuphane?kategori=gosterge-isiklari',
                permanent: true,
            },
            {
                source: '/kutuphane/sigorta-rehberi',
                destination: '/kutuphane?kategori=sigorta-rehberi',
                permanent: true,
            },
            {
                source: '/kutuphane/ehliyet-sinifari',
                destination: '/kutuphane?kategori=ehliyet-siniflari',
                permanent: true,
            },
            {
                source: '/kutuphane/lastik-rehberi',
                destination: '/kutuphane?kategori=lastik-rehberi',
                permanent: true,
            },
            {
                source: '/kutuphane/efsane-avcilari',
                destination: '/kutuphane?kategori=efsane-avcilari',
                permanent: true,
            },
            {
                source: '/kutuphane/tuvturk',
                destination: '/kutuphane?kategori=tuvturk-muayene',
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
