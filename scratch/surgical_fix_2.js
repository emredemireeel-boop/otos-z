const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');

const signsDir = path.join(__dirname, '../public/signs');
const jsonPath = path.join(__dirname, '../data/trafik_isaretleri.json');

const downloads = {
  'TT-28': 'Turkey_road_sign_TT-27.svg',
  'TT-30': 'Turkey_road_sign_TT-29.svg',
  'TT-31': 'Turkey_road_sign_TT-30.svg',
  'TT-35a': 'TR_road_sign_TT-35c.svg',
  'TT-35b': 'TR_road_sign_TT-35a.svg',
  'TT-35c': 'TR_road_sign_TT-35b.svg'
};

function getWikimediaUrl(filename) {
    const fn = filename.replace(/ /g, '_');
    const hash = crypto.createHash('md5').update(fn).digest('hex');
    return 'https://upload.wikimedia.org/wikipedia/commons/' + hash.substring(0,1) + '/' + hash.substring(0,2) + '/' + encodeURIComponent(fn);
}

function downloadFile(url, filepath) {
    return new Promise((resolve) => {
        const options = {
            headers: { 
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                'Accept': 'image/svg+xml'
            }
        };
        https.get(url, options, (res) => {
            if (res.statusCode === 301 || res.statusCode === 302) {
                downloadFile(res.headers.location, filepath).then(resolve);
                return;
            }
            if (res.statusCode !== 200) {
                resolve(false);
                return;
            }
            const file = fs.createWriteStream(filepath);
            res.pipe(file);
            file.on('finish', () => { file.close(); resolve(true); });
        }).on('error', () => resolve(false));
    });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
    for (const [id, wiki] of Object.entries(downloads)) {
        const url = getWikimediaUrl(wiki);
        const filepath = path.join(signsDir, id + '.svg');
        const success = await downloadFile(url, filepath);
        console.log((success ? '✅ Downloaded ' : '❌ Failed ') + id + ' from ' + wiki);
        await sleep(3000);
    }
    
    // Update JSON cache buster
    let jsonContent = fs.readFileSync(jsonPath, 'utf8');
    const newVersion = '?v=' + Date.now();
    jsonContent = jsonContent.replace(/\?v=\d+/g, newVersion);
    fs.writeFileSync(jsonPath, jsonContent);
    console.log('Updated JSON timestamps to ' + newVersion);
}

main().catch(console.error);
