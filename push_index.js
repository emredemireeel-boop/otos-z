const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

async function run() {
    const KEY_FILE = 'otosozindex-7a4ca5cb2331.json';
    const keyFilePath = path.join(__dirname, KEY_FILE);

    const auth = new google.auth.GoogleAuth({
        keyFile: keyFilePath,
        scopes: ['https://www.googleapis.com/auth/indexing'],
    });

    const client = await auth.getClient();
    const indexing = google.indexing({ version: 'v3', auth: client });

    const obdData = JSON.parse(fs.readFileSync('./data/obd-codes.json'));
    const obdCodes = obdData.slice(0, 150).map(d => d.code.toLowerCase());

    const topPages = [
        "", "/kutuphane", "/arac-dna", "/forum", "/pazar", "/haberler", "/karsilastirma",
        "/uzmana-sor", "/otohesap", "/piyasalar", "/guvenmetre", "/altin-anahtar", "/anket",
        "/etkinlikler", "/sozluk", "/obd",
        "/arac-dna/fiat/egea", "/arac-dna/fiat/egea/kronik-sorunlar",
        "/arac-dna/renault/clio", "/arac-dna/renault/clio/kronik-sorunlar",
        "/arac-dna/toyota/corolla", "/arac-dna/toyota/corolla/kronik-sorunlar",
        "/arac-dna/honda/civic", "/arac-dna/honda/civic/kronik-sorunlar",
        "/arac-dna/volkswagen/passat", "/arac-dna/volkswagen/passat/kronik-sorunlar",
        "/arac-dna/volkswagen/golf", "/arac-dna/volkswagen/golf/kronik-sorunlar",
        "/arac-dna/dacia/duster", "/arac-dna/dacia/duster/kronik-sorunlar",
        "/arac-dna/hyundai/i20", "/arac-dna/hyundai/i20/kronik-sorunlar",
        "/arac-dna/peugeot/3008-2-nesil-2016-2023", "/arac-dna/peugeot/3008-2-nesil-2016-2023/kronik-sorunlar",
        "/arac-dna/opel/corsa", "/arac-dna/opel/corsa/kronik-sorunlar",
        "/arac-dna/togg/t10x", "/arac-dna/togg/t10x/kronik-sorunlar",
        "/arac-dna/chery/tiggo-8-pro", "/arac-dna/chery/tiggo-8-pro/kronik-sorunlar"
    ];

    const allUrls = [
        ...topPages.map(p => `https://www.otosoz.com${p}`),
        ...obdCodes.map(c => `https://www.otosoz.com/obd/${c}`)
    ].slice(0, 200);

    console.log(`Sending ${allUrls.length} URLs to Google Indexing API...`);

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < allUrls.length; i += 10) {
        const batch = allUrls.slice(i, i + 10);
        await Promise.all(batch.map(async (url) => {
            try {
                await indexing.urlNotifications.publish({
                    requestBody: { url, type: 'URL_UPDATED' },
                });
                successCount++;
            } catch (err) {
                console.error(`\nError for ${url}:`, err.message);
                errorCount++;
            }
        }));
        await new Promise(resolve => setTimeout(resolve, 500));
        process.stdout.write(`\rProgress: ${Math.min(i + 10, allUrls.length)} / ${allUrls.length} sent...`);
    }

    console.log(`\nDone! Success: ${successCount}, Errors: ${errorCount}`);
}

run().catch(console.error);
