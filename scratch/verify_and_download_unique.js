const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');

// Large pool of beautiful, diverse outdoor car market and parking lot candidate IDs from Unsplash
const candidateIds = [
    "photo-1559416523-140ddc3d238c", // 1. Outdoor parking lot of cars
    "photo-1541899481282-d53bffe3c35d", // 2. Sleek auto floor with rows
    "photo-1616422285623-13ff0162193c", // 3. Rows of modern used cars
    "photo-1560769629-975ec94e6a86", // 4. Colorful parked cars at a lot
    "photo-1486006920555-c77dce18193b", // 5. Row of classic cars
    "photo-1587750059638-e7e8c43b99fc", // 6. Rows of parked cars outdoors
    "photo-1506015391300-4802dc74de2e", // 7. Cars parked at an outdoor lot
    "photo-1533928298208-27ff66555d8d", // 8. Row of colorful classic cars
    "photo-1601584115197-04ecc0da31d7", // 9. Cars lined up in a parking lot
    "photo-1617531653332-bd46c24f2068", // 10. Rows of clean cars
    "photo-1562141961-b5d144297e26", // 11. Outdoor auto bazaar
    "photo-1533473359331-0135ef1b58bf", // 12. Row of cars parked
    "photo-1580273916550-e323be2ae537", // 13. Blue sport sedans lined up
    "photo-1494976388531-d1058494cdd8", // 14. Rows of clean sedans
    "photo-1621007947382-cc34aa864ee3", // 15. Rows of modern SUVs
    "photo-1590362891961-309131744b9a", // 16. Rugged grey Jeep SUVs
    "photo-1518987187123-5e921d7b1a0e", // 17. Row of vintage cars
    "photo-1525609004556-c46c7d6cf0a3", // 18. Luxury cars side profile
    "photo-1618843479313-40f8afb4b4d8", // 19. Mercedes AMG G-Wagon SUVs
    "photo-1605559424843-9e4c228bf1c2", // 20. Modern grey SUVs in rows
    "photo-1552519507-da3b142c6e3d", // 21. Row of Chevrolet Corvettes
    "photo-1503376780353-7e6692767b70", // 22. Row of sports cars
    "photo-1549399542-7e3f8b79c341", // 23. Rows of Mercedes classics
    "photo-1610647752706-3bb12232b3ab", // 24. Chevrolet pickup trucks
    "photo-1502877338535-766e1452684a", // 25. Lined up VW Beetles
    "photo-1514316454349-750a7fd3da3a", // 26. Vintage automobiles parked
    "photo-1568605117036-5fe5e7bab0b7"  // 27. Modern white cars parked
];

const publicDir = path.join(__dirname, '..', 'public');

// Check if a photo ID is valid (returns 200 OK)
function checkPhotoId(photoId) {
    return new Promise((resolve) => {
        const url = `https://images.unsplash.com/${photoId}?w=10`;
        https.get(url, (res) => {
            if (res.statusCode === 200 || res.statusCode === 301 || res.statusCode === 302) {
                resolve(true);
            } else {
                resolve(false);
            }
        }).on('error', () => {
            resolve(false);
        });
    });
}

// Download image helper
function downloadImage(photoId, index) {
    return new Promise((resolve, reject) => {
        const filename = `otopazari_gen_${index}.png`;
        const filePath = path.join(publicDir, filename);
        const url = `https://images.unsplash.com/${photoId}?w=800&auto=format&fit=crop&q=80`;

        https.get(url, (response) => {
            if (response.statusCode === 301 || response.statusCode === 302) {
                https.get(response.headers.location, (redirectResponse) => {
                    if (redirectResponse.statusCode !== 200) {
                        reject(new Error(`Status ${redirectResponse.statusCode}`));
                        return;
                    }
                    const fileStream = fs.createWriteStream(filePath);
                    redirectResponse.pipe(fileStream);
                    fileStream.on('finish', () => {
                        fileStream.close();
                        resolve();
                    });
                }).on('error', reject);
                return;
            }

            if (response.statusCode !== 200) {
                reject(new Error(`Status ${response.statusCode}`));
                return;
            }

            const fileStream = fs.createWriteStream(filePath);
            response.pipe(fileStream);
            fileStream.on('finish', () => {
                fileStream.close();
                resolve();
            });
        }).on('error', reject);
    });
}

// Get file SHA256 hash helper
function getFileHash(filePath) {
    const fileBuffer = fs.readFileSync(filePath);
    const hashSum = crypto.createHash('sha256');
    hashSum.update(fileBuffer);
    return hashSum.digest('hex');
}

async function run() {
    try {
        console.log("Pre-verifying Unsplash candidate IDs...");
        const verifiedIds = [];
        
        for (const id of candidateIds) {
            const isValid = await checkPhotoId(id);
            if (isValid) {
                verifiedIds.push(id);
                console.log(`- ID: ${id} is VALID`);
            } else {
                console.log(`- ID: ${id} is INVALID (skipping)`);
            }
            if (verifiedIds.length >= 15) {
                console.log("Found 15 verified unique Unsplash IDs!");
                break;
            }
            await new Promise(r => setTimeout(r, 100));
        }

        if (verifiedIds.length < 15) {
            throw new Error(`Only found ${verifiedIds.length} valid IDs, we need at least 15.`);
        }

        console.log("\nStarting downloads for remaining 15 cities (indices 12 to 26)...");
        for (let i = 0; i < 15; i++) {
            const index = i + 12;
            const photoId = verifiedIds[i];
            console.log(`[${index}/26] Downloading otopazari_gen_${index}.png from verified ID: ${photoId}...`);
            await downloadImage(photoId, index);
            console.log(`Saved otopazari_gen_${index}.png successfully!`);
            await new Promise(r => setTimeout(r, 200));
        }

        console.log("\nVerifying image file uniqueness across all 26 cities...");
        const hashCount = {};
        const duplicates = [];

        for (let index = 1; index <= 26; index++) {
            const filename = `otopazari_gen_${index}.png`;
            const filePath = path.join(publicDir, filename);
            if (fs.existsSync(filePath)) {
                const hash = getFileHash(filePath);
                if (!hashCount[hash]) {
                    hashCount[hash] = [];
                }
                hashCount[hash].push(filename);
            }
        }

        for (const [hash, files] of Object.entries(hashCount)) {
            if (files.length > 1) {
                duplicates.push({ hash, files });
            }
        }

        if (duplicates.length > 0) {
            console.warn("\nWARNING: Some files have duplicate hashes!", JSON.stringify(duplicates, null, 2));
        } else {
            console.log("\nSUCCESS: All 26 cities have 100% unique and distinct images!");
        }

    } catch (err) {
        console.error("Error during process:", err);
    }
}

run();
