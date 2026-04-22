import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/admin/',
                    '/moderator/',
                    '/api/',
                    '/gosterge-paneli/',
                    '/mesajlar/',
                    '/profil-tamamla/',
                    '/ayarlar/',
                ],
            },
            {
                userAgent: 'Googlebot',
                allow: '/',
                disallow: [
                    '/admin/',
                    '/moderator/',
                    '/api/',
                ],
            },
        ],
        sitemap: 'https://www.otosoz.com/sitemap.xml',
    };
}
