const https = require('https');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const outDir = path.join(__dirname, '../public/signs');

const signFileMap = {
    'T-1':  'Turkey_road_sign_T-1a.svg',
    'T-2':  'Turkey_road_sign_T-1b.svg',
    'T-3':  'Turkey_road_sign_T-2a.svg',
    'T-4':  'Turkey_road_sign_T-2b.svg',
    'T-5':  'Turkey_road_sign_T-3a.svg',
    'T-6':  'Turkey_road_sign_T-3b.svg',
    'T-7':  'Turkey_road_sign_T-4a.svg',
    'T-8':  'Turkey_road_sign_T-4b.svg',
    'T-11': 'Turkey_road_sign_T-7.svg',
    'T-12': 'Turkey_road_sign_T-8.svg',
    'T-13': 'Turkey_road_sign_T-9.svg',
    'T-14': 'Turkey_road_sign_T-10.svg',
    'T-15': 'Turkey_road_sign_T-11.svg',
    'T-16': 'Turkey_road_sign_T-12.svg',
    'T-18': 'Turkey_road_sign_T-14a.svg',
    'T-19': 'Turkey_road_sign_T-14b.svg',
    'T-20': 'Turkey_road_sign_T-15.svg',
    'T-21': 'Turkey_road_sign_T-16.svg',
    'T-23': 'Turkey_road_sign_T-18.svg',
    'T-24': 'Turkey_road_sign_T-19.svg',
    'T-26': 'Turkey_road_sign_T-21.svg',
    'T-27': 'Turkey_road_sign_T-22a.svg',
    'T-28': 'Turkey_road_sign_T-23a.svg',
    'T-30': 'Turkey_road_sign_T-25.svg',
    'T-31': 'Turkey_road_sign_T-26.svg',
    
    'TT-1': 'Turkey_road_sign_B-2a.svg',
    'TT-2': 'Turkey_road_sign_B-3.svg',
    'TT-3': 'Turkey_road_sign_TT-1.svg',
    'TT-4': 'Turkey_road_sign_TT-2.svg',
    'TT-5': 'Turkey_road_sign_TT-3.svg',
    'TT-6': 'Turkey_road_sign_TT-4.svg',
    'TT-8': 'Turkey_road_sign_TT-5.svg',
    'TT-9': 'Turkey_road_sign_TT-6.svg',
    'TT-16':'Turkey_road_sign_TT-13.svg',
    'TT-21':'Turkey_road_sign_TT-16a.svg',
    'TT-22':'Turkey_road_sign_TT-17.svg',
    'TT-25':'Turkey_road_sign_TT-24.svg',
    'TT-26':'Turkey_road_sign_TT-25.svg',
    'TT-27':'Turkey_road_sign_TT-26a.svg',
    'TT-28':'Turkey_road_sign_TT-27.svg',
    'TT-30':'Turkey_road_sign_TT-30.svg',
    'TT-31':'Turkey_road_sign_TT-32.svg',
    'TT-32':'Turkey_road_sign_TT-34a.svg',
    'TT-36':'TR_road_sign_TT-35c.svg',
    'TT-39':'Turkey_road_sign_TT-35g.svg',
    
    'B-1':  'Turkey_road_sign_B-14a.svg',
    'B-2':  'Turkey_road_sign_B-14b.svg',
    'B-3':  'Turkey_road_sign_B-15.svg',
    'B-4':  'Turkey_road_sign_B-16.svg',
    'B-7':  'Turkey_road_sign_B-29.svg',
};

// Hand-coded signs that we should NOT overwrite:
// TT-34, TT-35, B-5, B-6, P-1, P-2, P-3, P-4

// I've removed them from signFileMap to ensure they aren't downloaded.

function getWikimediaUrl(filename) {
    const fn = filename.replace(/ /g, '_');
    const hash = crypto.createHash('md5').update(fn).digest('hex');
    return 'https://upload.wikimedia.org/wikipedia/commons/' + hash.substring(0,1) + '/' + hash.substring(0,2) + '/' + encodeURIComponent(fn);
}

function downloadFile(url, filepath) {
    return new Promise((resolve) => {
        const options = {
            headers: { 
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Referer': 'https://commons.wikimedia.org/'
            }
        };
        https.get(url, options, (res) => {
            if (res.statusCode === 301 || res.statusCode === 302) {
                downloadFile(res.headers.location, filepath).then(resolve);
                return;
            }
            if (res.statusCode !== 200) {
                console.error('  ❌ HTTP ' + res.statusCode + ' for ' + url);
                resolve(false);
                return;
            }
            const file = fs.createWriteStream(filepath);
            res.pipe(file);
            file.on('finish', () => { file.close(); resolve(true); });
            file.on('error', () => { fs.unlinkSync(filepath); resolve(false); });
        }).on('error', () => resolve(false));
    });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
    let successCount = 0;
    
    // We will delete existing files first to be sure
    for (const signId of Object.keys(signFileMap)) {
        const filepath = path.join(outDir, signId + '.svg');
        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath); // Force delete mock SVGs
        }
    }
    
    for (const [signId, wikiFilename] of Object.entries(signFileMap)) {
        const filepath = path.join(outDir, signId + '.svg');
        
        console.log('[' + signId + '] Downloading...');
        const url = getWikimediaUrl(wikiFilename);
        const success = await downloadFile(url, filepath);
        
        if (success) {
            successCount++;
            console.log('✅ Success: ' + signId);
        } else {
            console.log('❌ Failed: ' + signId);
        }
        
        await sleep(2500); // 2.5 seconds to avoid 429
    }
    console.log('\\nDone! Downloaded ' + successCount + ' authentic signs.');
}

main().catch(console.error);
