import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                // Ana Googlebot ve tüm arama motorları
                userAgent: '*',
                // /forum ve /makale dahil tüm içerik açık; /api/ yasağında
                // paylaşım görselleri için gerekli dar istisna korunur.
                allow: ['/', '/api/og'],
                disallow: [
                    '/api/',           // API endpoint'leri indeksleme
                    '/admin/',         // Admin paneli
                    '/moderator/',     // Moderatör paneli
                    '/profil/',        // Kullanıcı profilleri (kişisel veri)
                    '/ayarlar/',       // Kullanıcı ayarları
                    '/mesajlar/',      // Özel mesajlar
                    '/islerim/',       // Kullanıcı görevleri
                    // Giriş ve kayıt sayfaları meta robots noindex kullanır.
                    // Buradan engellenmez; aksi halde crawler noindex etiketini göremez.
                    '/profil-tamamla/',// Profil tamamlama
                    '/para-kazan/',    // Para kazanma
                    '/premium/',       // Premium sayfası
                    '/pazar/',         // Pazar gizli
                ],
            },
            {
                // Google Resim botu — görsellere erişim aç
                userAgent: 'Googlebot-Image',
                allow: ['/', '/api/og'],
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
        sitemap: [
            'https://otosoz.com/sitemap.xml',
            'https://otosoz.com/news-sitemap.xml',
        ],
        host: 'https://otosoz.com',
    };
}
