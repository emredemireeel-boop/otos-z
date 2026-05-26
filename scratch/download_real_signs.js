const https = require('https');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '../public/signs');

// Mapping: our sign ID -> correct Wikipedia filename (without "Dosya:" prefix)
// These are the REAL filenames from Turkish Wikipedia
const signFileMap = {
    // TEHLIKE UYARI (Warning)
    'T-1':  'Turkey road sign T-1a.svg',
    'T-2':  'Turkey road sign T-1b.svg',
    'T-3':  'Turkey road sign T-2a.svg',
    'T-4':  'Turkey road sign T-2b.svg',
    'T-5':  'Turkey road sign T-3a.svg',
    'T-6':  'Turkey road sign T-3b.svg',
    'T-7':  'Turkey road sign T-4a.svg',
    'T-8':  'Turkey road sign T-4b.svg',
    'T-11': 'Turkey road sign T-7.svg',
    'T-12': 'Turkey road sign T-8.svg',
    'T-13': 'Turkey road sign T-9.svg',
    'T-14': 'Turkey road sign T-10.svg',
    'T-15': 'Turkey road sign T-11.svg',
    'T-16': 'Turkey road sign T-12.svg',
    'T-18': 'Turkey road sign T-14a.svg',
    'T-19': 'Turkey road sign T-14b.svg',
    'T-20': 'Turkey road sign T-15.svg',
    'T-21': 'Turkey road sign T-16.svg',
    'T-23': 'Turkey road sign T-18.svg',
    'T-24': 'Turkey road sign T-19.svg',
    'T-26': 'Turkey road sign T-21.svg',
    'T-27': 'Turkey road sign T-22a.svg',
    'T-28': 'Turkey road sign T-23a.svg',
    'T-30': 'Turkey road sign T-25.svg',
    'T-31': 'Turkey road sign T-26.svg',
    
    // TRAFIK TANZIM (Regulatory)
    'TT-1': 'Turkey road sign B-2a.svg',   // Yol Ver (inverted triangle)
    'TT-2': 'Turkey road sign B-3.svg',    // Dur (stop octagon)
    'TT-3': 'Turkey road sign TT-1.svg',
    'TT-4': 'Turkey road sign TT-2.svg',
    'TT-5': 'Turkey road sign TT-3.svg',
    'TT-6': 'Turkey road sign TT-4.svg',
    'TT-8': 'Turkey road sign TT-5.svg',
    'TT-9': 'Turkey road sign TT-6.svg',
    'TT-16':'Turkey road sign TT-13.svg',
    'TT-21':'Turkey road sign TT-16a.svg',
    'TT-22':'Turkey road sign TT-17.svg',
    'TT-25':'Turkey road sign TT-24.svg',
    'TT-26':'Turkey road sign TT-25.svg',
    'TT-27':'Turkey road sign TT-26a.svg',
    'TT-28':'Turkey road sign TT-27.svg',
    'TT-30':'Turkey road sign TT-30.svg',
    'TT-31':'Turkey road sign TT-32.svg',
    'TT-32':'Turkey road sign TT-34a.svg',
    'TT-34':'TR road sign TT-35a.svg',
    'TT-35':'TR road sign TT-35b.svg',
    'TT-36':'TR road sign TT-35c.svg',
    'TT-39':'Turkey road sign TT-35g.svg',
    
    // BİLGİ (Information)
    'B-1':  'Turkey road sign B-14a.svg',
    'B-2':  'Turkey road sign B-14b.svg',
    'B-3':  'Turkey road sign B-15.svg',
    'B-4':  'Turkey road sign B-16.svg',
    'B-5':  'Turkey road sign B-24.svg',
    'B-6':  'Turkey road sign B-28.svg',
    'B-7':  'Turkey road sign B-29.svg',
    
    // PARK
    'P-1':  'Turkey road sign P-1.svg',
    'P-2':  'Turkey road sign P-2.svg',
    'P-3':  'Turkey road sign P-3a.svg',
    'P-4':  'Turkey road sign P-3e.svg',
};

// Use Wikimedia API to resolve File: title -> actual download URL
function getImageUrl(filename) {
    return new Promise((resolve, reject) => {
        const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(filename)}&prop=imageinfo&iiprop=url&format=json`;
        https.get(apiUrl, { headers: { 'User-Agent': 'OtoAsfaltBot/1.0 (contact@otosoz.com)' } }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    const pages = json.query.pages;
                    const pageId = Object.keys(pages)[0];
                    const info = pages[pageId]?.imageinfo?.[0];
                    if (info && info.url) {
                        resolve(info.url);
                    } else {
                        resolve(null);
                    }
                } catch(e) {
                    resolve(null);
                }
            });
        }).on('error', () => resolve(null));
    });
}

function downloadFile(url, filepath) {
    return new Promise((resolve, reject) => {
        https.get(url, { headers: { 'User-Agent': 'OtoAsfaltBot/1.0 (contact@otosoz.com)' } }, (res) => {
            if (res.statusCode === 301 || res.statusCode === 302) {
                // Follow redirect
                downloadFile(res.headers.location, filepath).then(resolve).catch(reject);
                return;
            }
            if (res.statusCode !== 200) {
                console.error(`  ❌ HTTP ${res.statusCode} for ${url}`);
                resolve(false);
                return;
            }
            const file = fs.createWriteStream(filepath);
            res.pipe(file);
            file.on('finish', () => { file.close(); resolve(true); });
            file.on('error', () => resolve(false));
        }).on('error', () => resolve(false));
    });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
    const dataFile = path.join(__dirname, '../data/trafik_isaretleri.json');
    let data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    
    const entries = Object.entries(signFileMap);
    let success = 0;
    let fail = 0;
    
    for (let i = 0; i < entries.length; i++) {
        const [signId, wikiFilename] = entries[i];
        console.log(`[${i+1}/${entries.length}] ${signId} -> ${wikiFilename}`);
        
        // Get the real download URL via API
        const imageUrl = await getImageUrl(wikiFilename);
        if (!imageUrl) {
            console.error(`  ❌ Could not resolve URL for ${wikiFilename}`);
            fail++;
            await sleep(500);
            continue;
        }
        
        console.log(`  URL: ${imageUrl}`);
        
        const filepath = path.join(outDir, `${signId}.svg`);
        const ok = await downloadFile(imageUrl, filepath);
        
        if (ok) {
            console.log(`  ✅ Downloaded`);
            success++;
        } else {
            console.log(`  ❌ Failed to download`);
            fail++;
        }
        
        // Rate limit: wait between requests
        await sleep(1000);
    }
    
    // Update JSON to use local paths
    for (let cat of data.categories) {
        for (let sign of cat.signs) {
            sign.image = `/signs/${sign.id}.svg`;
        }
    }
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
    
    console.log(`\n✅ Done! ${success} downloaded, ${fail} failed.`);
}

main().catch(console.error);
