const fs = require('fs');
const path = require('path');
const https = require('https');

const publicDir = path.join(__dirname, '..', 'public');

// We will query multiple search terms to get a diverse set of images showing MANY cars.
const searchTerms = [
    "used car lot",
    "car dealership exterior",
    "parking lot full of cars",
    "auto auction lot",
    "car market outdoor"
];

let allImageUrls = [];

async function searchWikimedia(query) {
    return new Promise((resolve, reject) => {
        const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(query)}&gsrlimit=50&prop=imageinfo&iiprop=url&format=json`;
        
        https.get(url, { headers: { 'User-Agent': 'OtoAsfaltBot/1.0' } }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    const pages = parsed.query && parsed.query.pages ? parsed.query.pages : {};
                    const urls = [];
                    for (const key in pages) {
                        const page = pages[key];
                        if (page.imageinfo && page.imageinfo[0] && page.imageinfo[0].url) {
                            const imgUrl = page.imageinfo[0].url;
                            // Filter out SVGs, PDFs, and small icons
                            if (imgUrl.match(/\.(jpe?g|png)$/i)) {
                                urls.push(imgUrl);
                            }
                        }
                    }
                    resolve(urls);
                } catch (e) {
                    resolve([]);
                }
            });
        }).on('error', reject);
    });
}

function downloadImage(url, index) {
    return new Promise((resolve, reject) => {
        const filename = `otopazari_gen_${index}.png`; // save as png for consistency, even if jpg
        const filePath = path.join(publicDir, filename);

        https.get(url, { headers: { 'User-Agent': 'OtoAsfaltBot/1.0' } }, (response) => {
            if (response.statusCode === 301 || response.statusCode === 302) {
                https.get(response.headers.location, { headers: { 'User-Agent': 'OtoAsfaltBot/1.0' } }, (redirectResponse) => {
                    const fileStream = fs.createWriteStream(filePath);
                    redirectResponse.pipe(fileStream);
                    fileStream.on('finish', () => { fileStream.close(); resolve(); });
                }).on('error', reject);
                return;
            }
            if (response.statusCode !== 200) {
                resolve(); // just skip on error to try next
                return;
            }
            const fileStream = fs.createWriteStream(filePath);
            response.pipe(fileStream);
            fileStream.on('finish', () => { fileStream.close(); resolve(); });
        }).on('error', reject);
    });
}

async function run() {
    console.log("Searching Wikimedia Commons for real 'car market' and 'dealership lot' images...");
    
    for (const term of searchTerms) {
        console.log(`Searching for: ${term}...`);
        const urls = await searchWikimedia(term);
        allImageUrls = allImageUrls.concat(urls);
    }
    
    // Remove duplicates
    allImageUrls = [...new Set(allImageUrls)];
    console.log(`Found ${allImageUrls.length} total unique images.`);
    
    // Shuffle the array to get random distribution
    allImageUrls.sort(() => Math.random() - 0.5);
    
    if (allImageUrls.length < 26) {
        console.error("Not enough images found!");
        return;
    }

    console.log("Downloading 26 unique, wide-angle car lot images...");
    
    let downloadedCount = 0;
    let urlIndex = 0;
    
    while (downloadedCount < 26 && urlIndex < allImageUrls.length) {
        const url = allImageUrls[urlIndex];
        const targetIndex = downloadedCount + 1;
        
        try {
            console.log(`[${targetIndex}/26] Downloading from ${url.substring(0, 50)}...`);
            await downloadImage(url, targetIndex);
            downloadedCount++;
        } catch (e) {
            console.log(`Failed to download ${url}`);
        }
        urlIndex++;
    }
    
    console.log(`Successfully replaced all ${downloadedCount} images with real car lot pictures!`);
}

run();
