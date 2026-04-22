const { google } = require('googleapis');
const path = require('path');

// Service Account key dosyası
const KEY_FILE = 'otosozindex-7a4ca5cb2331.json';

const auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, KEY_FILE),
    scopes: ['https://www.googleapis.com/auth/indexing'],
});

// İndexlenecek tüm public sayfalar
const URLS = [
    'https://www.otosoz.com/',
    'https://www.otosoz.com/forum',
    'https://www.otosoz.com/pazar',
    'https://www.otosoz.com/karsilastirma',
    'https://www.otosoz.com/arac-dna',
    'https://www.otosoz.com/uzmana-sor',
    'https://www.otosoz.com/kutuphane',
    'https://www.otosoz.com/piyasalar',
    'https://www.otosoz.com/anket',
    'https://www.otosoz.com/etkinlikler',
    'https://www.otosoz.com/ajanda',
    'https://www.otosoz.com/guvenmetre',
    'https://www.otosoz.com/obd',
    'https://www.otosoz.com/yakit-hesaplama',
    'https://www.otosoz.com/para-kazan',
    'https://www.otosoz.com/premium',
    'https://www.otosoz.com/hakkimizda',
    'https://www.otosoz.com/iletisim',
    'https://www.otosoz.com/giris',
    'https://www.otosoz.com/kayit',
    'https://www.otosoz.com/gizlilik-politikasi',
    'https://www.otosoz.com/kullanim-sartlari',
];

async function notifyGoogle(url) {
    try {
        const client = await auth.getClient();
        const indexing = google.indexing({
            version: 'v3',
            auth: client,
        });

        const res = await indexing.urlNotifications.publish({
            requestBody: {
                url: url,
                type: 'URL_UPDATED',
            },
        });

        console.log(`\x1b[32m✔ Başarılı: ${url}\x1b[0m`);
        console.log('  Yanıt:', JSON.stringify(res.data));
    } catch (error) {
        console.error(`\x1b[31m✘ Hata: ${url}\x1b[0m`);
        console.error('  Detay:', error.response ? error.response.data : error.message);
    }
}

async function indexAll() {
    console.log(`\n🚀 Google Indexing API - ${URLS.length} sayfa bildiriliyor...\n`);
    console.log('='.repeat(60));

    let success = 0;
    let fail = 0;

    for (const url of URLS) {
        await notifyGoogle(url);
        success++;
        // Rate limit: 200 req/day, aralarında kısa bekleme
        await new Promise(r => setTimeout(r, 500));
    }

    console.log('\n' + '='.repeat(60));
    console.log(`\n✅ Tamamlandı! ${URLS.length} sayfa Google'a bildirildi.\n`);
}

indexAll();