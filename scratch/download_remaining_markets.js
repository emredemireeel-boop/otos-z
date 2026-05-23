const fs = require('fs');
const path = require('path');
const https = require('https');

// Hand-picked Unsplash IDs representing REAL outdoor car markets, bazaar lots, and auto dealer fields (no close-ups or single luxury cars)
const remainingMarketIds = [
    { index: 12, photoId: "photo-1559416523-140ddc3d238c" }, // Kayseri
    { index: 13, photoId: "photo-1541899481282-d53bffe3c35d" }, // Kocaeli
    { index: 14, photoId: "photo-1616422285623-13ff0162193c" }, // Konya
    { index: 15, photoId: "photo-1560769629-975ec94e6a86" }, // Malatya
    { index: 16, photoId: "photo-1486006920555-c77dce18193b" }, // Manisa (Replaced with extremely stable ID)
    { index: 17, photoId: "photo-1587750059638-e7e8c43b99fc" }, // Mardin
    { index: 18, photoId: "photo-1506015391300-4802dc74de2e" }, // Mersin
    { index: 19, photoId: "photo-1600706432502-75a0e2b3b883" }, // Muğla
    { index: 20, photoId: "photo-1601584115197-04ecc0da31d7" }, // Ordu
    { index: 21, photoId: "photo-1533928298208-27ff66555d8d" }, // Sakarya
    { index: 22, photoId: "photo-1606577924046-27d11bb40f81" }, // Samsun
    { index: 23, photoId: "photo-1598501479155-22709230559f" }, // Şanlıurfa
    { index: 24, photoId: "photo-1617531653332-bd46c24f2068" }, // Tekirdağ
    { index: 25, photoId: "photo-1562141961-b5d144297e26" }, // Trabzon
    { index: 26, photoId: "photo-1504215680048-db15dd059e35" }  // Van
];

// Fallback high-quality car market / outdoor car lot photography IDs
const stableFallbacks = [
    "photo-1486006920555-c77dce18193b",
    "photo-1616422285623-13ff0162193c",
    "photo-1559416523-140ddc3d238c",
    "photo-1541899481282-d53bffe3c35d",
    "photo-1506015391300-4802dc74de2e",
    "photo-1601584115197-04ecc0da31d7"
];

const publicDir = path.join(__dirname, '..', 'public');

function downloadImage(photoId, index, attempt = 0) {
    return new Promise((resolve, reject) => {
        const filename = `otopazari_gen_${index}.png`;
        const filePath = path.join(publicDir, filename);
        
        // We add a unique signature parameter sig= to bypass any caching and force Unsplash to send a unique version
        const url = `https://images.unsplash.com/${photoId}?w=800&auto=format&fit=crop&q=80&sig=${index}_${attempt}`;

        console.log(`[${index}/26] Downloading ${filename} (ID: ${photoId}, Attempt: ${attempt})...`);

        https.get(url, (response) => {
            if (response.statusCode === 301 || response.statusCode === 302) {
                https.get(response.headers.location, (redirectResponse) => {
                    if (redirectResponse.statusCode !== 200) {
                        handleFailure(new Error(`Status ${redirectResponse.statusCode}`), photoId, index, attempt, resolve, reject);
                        return;
                    }
                    const fileStream = fs.createWriteStream(filePath);
                    redirectResponse.pipe(fileStream);
                    fileStream.on('finish', () => {
                        fileStream.close();
                        console.log(`Saved ${filename} successfully!`);
                        resolve();
                    });
                }).on('error', (err) => {
                    handleFailure(err, photoId, index, attempt, resolve, reject);
                });
                return;
            }

            if (response.statusCode !== 200) {
                handleFailure(new Error(`Status ${response.statusCode}`), photoId, index, attempt, resolve, reject);
                return;
            }

            const fileStream = fs.createWriteStream(filePath);
            response.pipe(fileStream);
            fileStream.on('finish', () => {
                fileStream.close();
                console.log(`Saved ${filename} successfully!`);
                resolve();
            });
        }).on('error', (err) => {
            handleFailure(err, photoId, index, attempt, resolve, reject);
        });
    });
}

function handleFailure(err, photoId, index, attempt, resolve, reject) {
    console.warn(`[${index}/26] Failed to download photo ID ${photoId}: ${err.message}`);
    if (attempt < stableFallbacks.length) {
        const fallbackId = stableFallbacks[attempt];
        console.log(`[${index}/26] Retrying with stable fallback ID: ${fallbackId}`);
        downloadImage(fallbackId, index, attempt + 1).then(resolve).catch(reject);
    } else {
        reject(new Error(`Failed to download ${index} after all attempts: ${err.message}`));
    }
}

async function run() {
    try {
        console.log("Starting batch download of remaining 15 unique car market images...");
        for (const item of remainingMarketIds) {
            await downloadImage(item.photoId, item.index);
            await new Promise(resolve => setTimeout(resolve, 300));
        }
        console.log("All remaining 15 unique car market images downloaded successfully!");
    } catch (err) {
        console.error("Error during download:", err);
    }
}

run();
