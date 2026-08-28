import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                // Ana Googlebot ve tüm arama motorları
                userAgent: '*',
                allow: [
                    '/',
                    '/etkinlikler/',
                    '/arac-dna/',
                    '/forum',           // Forum hub sayfası (indekslenebilir topluluk sayfası)
                    '/forum/',          // Forum başlıkları
                    '/kutuphane/',
                    '/haberler/',
                    '/piyasalar/',
                    '/obd/',
                    '/sozluk/',
                    '/guvenmetre/',
                    '/karsilastirma/',
                    '/otohesap/',
                    '/uzmana-sor/',
                    '/altin-anahtar/',
                    '/anket/',
                    '/ajanda/',
                    '/bakim-rehberi/',
                    '/ikinci-el-rehberi/',
                    '/trafik-cezasi/',
                    '/gosterge/',
                    '/makale/',
                    '/hakkimizda/',
                    '/iletisim/',
                    '/usta-ol/',
                    '/uzman-ol/',
                ],
                disallow: [
                    '/api/',           // API endpoint'leri indeksleme
                    '/admin/',         // Admin paneli
                    '/moderator/',     // Moderatör paneli
                    '/profil/',        // Kullanıcı profilleri (kişisel veri)
                    '/ayarlar/',       // Kullanıcı ayarları
                    '/mesajlar/',      // Özel mesajlar
                    '/islerim/',       // Kullanıcı görevleri
                    '/kayit/',         // Kayıt sayfası
                    '/giris/',         // Giriş sayfası
                    '/profil-tamamla/',// Profil tamamlama
                    '/para-kazan/',    // Para kazanma
                    '/premium/',       // Premium sayfası
                    '/pazar/',         // Pazar gizli
                ],
            },
            {
                // Google Resim botu — görsellere erişim aç
                userAgent: 'Googlebot-Image',
                allow: '/',
                disallow: ['/api/', '/admin/', '/moderator/'],
            },
            {
                // Kötü niyetli botları engelle
                userAgent: 'AhrefsBot',
                disallow: '/',
            },
            {
                userAgent: 'SemrushBot',
                disallow: '/',
            },
            {
                userAgent: 'MJ12bot',
                disallow: '/',
            },
            {
                userAgent: 'DotBot',
                disallow: '/',
            },
        ],
        sitemap: ['https://otosoz.com/sitemap.xml', 'https://otosoz.com/news-sitemap.xml'],
        host: 'https://otosoz.com',
    };
}
