import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                // Ana Googlebot ve tüm arama motorları
                userAgent: '*',
                allow: '/',
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
                    '/*?query=',       // Arama parametreleri
                    '/*?sort=',        // Sıralama parametreleri
                    '/*?tab=',         // Tab parametreleri
                    '/*?sehir=',       // Şehir filtre parametreleri
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
        sitemap: 'https://www.otosoz.com/sitemap.xml',
        host: 'https://www.otosoz.com',
    };
}
