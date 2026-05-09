const fs = require('fs');
const path = require('path');
const { JWT } = require('google-auth-library');

// Read env.local manually to get FIREBASE_SERVICE_ACCOUNT_KEY
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const match = envContent.match(/FIREBASE_SERVICE_ACCOUNT_KEY=(.*)/);

if (!match || !match[1]) {
    console.error("FIREBASE_SERVICE_ACCOUNT_KEY not found in .env.local");
    process.exit(1);
}

const serviceAccount = JSON.parse(match[1]);

// Set up JWT client for Indexing API
const jwtClient = new JWT({
    email: serviceAccount.client_email,
    key: serviceAccount.private_key,
    scopes: ['https://www.googleapis.com/auth/indexing'],
});

function slugify(marka, model, yil) {
    return `${yil}-${marka}-${model}`
        .toLocaleLowerCase("tr")
        .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ü/g, "u")
        .replace(/ş/g, "s").replace(/ğ/g, "g").replace(/ç/g, "c")
        .replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

async function submitUrls() {
    console.log("Loading kasko data...");
    const dataPath = path.join(__dirname, '..', 'data', 'kasko_deger.json');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

    // Select 200 vehicles (for example, latest year and popular brands first)
    // We'll just sort them by year descending, then take the first 200
    const sorted = data.araclar.sort((a, b) => b.yil - a.yil || a.marka.localeCompare(b.marka));
    const selected = sorted.slice(0, 200);

    const baseUrl = "https://www.otosoz.com/kutuphane/kasko-deger/";
    const urls = selected.map(a => baseUrl + slugify(a.marka, a.model, a.yil));

    console.log(`Preparing to submit ${urls.length} URLs to Google Indexing API...`);

    let successCount = 0;
    let failCount = 0;

    // We process sequentially with a small delay to avoid rate limits
    for (let i = 0; i < urls.length; i++) {
        const url = urls[i];
        try {
            const res = await jwtClient.request({
                url: 'https://indexing.googleapis.com/v3/urlNotifications:publish',
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                data: {
                    url: url,
                    type: 'URL_UPDATED',
                },
            });
            console.log(`[${i + 1}/200] SUCCESS: ${url}`);
            successCount++;
        } catch (error) {
            console.error(`[${i + 1}/200] FAILED: ${url}`, error.message);
            failCount++;
        }
        
        // Small delay
        await new Promise(r => setTimeout(r, 200));
    }

    console.log(`\nIndexing Submission Complete!`);
    console.log(`Successfully Submitted: ${successCount}`);
    console.log(`Failed: ${failCount}`);
}

submitUrls().catch(console.error);
