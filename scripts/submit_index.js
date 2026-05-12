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

let serviceAccount;
try {
    // Attempt to parse the key. It might be wrapped in quotes.
    let keyString = match[1].trim();
    if (keyString.startsWith('"') && keyString.endsWith('"')) {
        keyString = keyString.slice(1, -1);
    }
    // Handle escaped quotes if any
    keyString = keyString.replace(/\\"/g, '"');
    serviceAccount = JSON.parse(keyString);
} catch (e) {
    console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY:", e.message);
    process.exit(1);
}

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
    let urls = [];

    // 1. Load OBD Codes (Get 100)
    console.log("Loading OBD data...");
    try {
        const obdPath = path.join(__dirname, '..', 'data', 'obd-codes.json');
        const obdData = JSON.parse(fs.readFileSync(obdPath, 'utf-8'));
        const obdUrls = obdData.slice(0, 100).map(a => `https://www.otosoz.com/obd/${a.code.toLowerCase()}`);
        urls = urls.concat(obdUrls);
        console.log(`Added ${obdUrls.length} OBD URLs.`);
    } catch (e) {
        console.log("Could not load OBD data:", e.message);
    }

    // 2. Load Kasko Data (Get 100)
    console.log("Loading Kasko data...");
    try {
        const kaskoPath = path.join(__dirname, '..', 'data', 'kasko_deger.json');
        const kaskoData = JSON.parse(fs.readFileSync(kaskoPath, 'utf-8'));
        const sortedKasko = kaskoData.araclar.sort((a, b) => b.yil - a.yil || a.marka.localeCompare(b.marka));
        const kaskoUrls = sortedKasko.slice(0, 100).map(a => `https://www.otosoz.com/kutuphane/kasko-deger/${slugify(a.marka, a.model, a.yil)}`);
        urls = urls.concat(kaskoUrls);
        console.log(`Added ${kaskoUrls.length} Kasko URLs.`);
    } catch (e) {
        console.log("Could not load Kasko data:", e.message);
    }

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
            console.log(`[${i + 1}/${urls.length}] SUCCESS: ${url}`);
            successCount++;
        } catch (error) {
            console.error(`[${i + 1}/${urls.length}] FAILED: ${url} - ${error.message}`);
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
