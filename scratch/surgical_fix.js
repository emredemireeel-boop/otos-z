const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');

const signsDir = path.join(__dirname, '../public/signs');
const jsonPath = path.join(__dirname, '../data/trafik_isaretleri.json');

const downloads = {
  'TT-5': 'Turkey_road_sign_TT-3.svg', // Girişi Olmayan Yol
  'TT-6': 'Turkey_road_sign_TT-4.svg', // Motorlu Taşıt Giremez
  'TT-8': 'Turkey_road_sign_TT-9.svg', // Motosiklet Giremez
  'TT-9': 'Turkey_road_sign_TT-8.svg', // Bisiklet Giremez
  'TT-28': 'Turkey_road_sign_TT-27.svg', // Sollama Yasaktır
  'TT-29': 'Turkey_road_sign_TT-28.svg', // Kamyon Sollama Yasaktır
  'TT-30': 'Turkey_road_sign_TT-29.svg', // Azami Hız Sınırı
  'TT-31': 'Turkey_road_sign_TT-30.svg', // Korna Yasaktır
  'TT-35a': 'TR_road_sign_TT-35c.svg', // İleri
  'TT-35b': 'TR_road_sign_TT-35a.svg', // Sağa
  'TT-35c': 'TR_road_sign_TT-35b.svg'  // Sola
};

const drawings = {
  'TT-13': '<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><circle cx="100" cy="100" r="90" fill="#fff" stroke="#ef2028" stroke-width="20" /><circle cx="100" cy="50" r="12" fill="#000" /><path d="M 100,65 L 100,120 M 100,80 L 70,110 M 100,80 L 130,110 M 100,120 L 80,160 M 100,120 L 120,160" fill="none" stroke="#000" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" /></svg>',
  
  'TT-17': '<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><circle cx="100" cy="100" r="90" fill="#fff" stroke="#ef2028" stroke-width="20" /><text x="100" y="120" font-family="Arial, sans-serif" font-weight="bold" font-size="50" fill="#000" text-anchor="middle">2.30m</text><polygon points="20,100 45,85 45,115" fill="#000" /><polygon points="180,100 155,85 155,115" fill="#000" /></svg>',
  
  'TT-18': '<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><circle cx="100" cy="100" r="90" fill="#fff" stroke="#ef2028" stroke-width="20" /><text x="100" y="120" font-family="Arial, sans-serif" font-weight="bold" font-size="50" fill="#000" text-anchor="middle">3.50m</text><polygon points="100,20 85,45 115,45" fill="#000" /><polygon points="100,180 85,155 115,155" fill="#000" /></svg>',
  
  'TT-27': '<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><circle cx="100" cy="100" r="90" fill="#fff" stroke="#ef2028" stroke-width="20" /><path d="M 120,140 L 120,80 C 120,50 80,50 80,80 L 80,140" fill="none" stroke="#000" stroke-width="16" stroke-linecap="round" /><polygon points="80,160 65,130 95,130" fill="#000" /><line x1="40" y1="40" x2="160" y2="160" stroke="#ef2028" stroke-width="20" /></svg>'
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

async function main() {
    // 1. Draw missing SVGs
    for (const [id, svgContent] of Object.entries(drawings)) {
        fs.writeFileSync(path.join(signsDir, id + '.svg'), svgContent);
        console.log('Drawn ' + id);
    }
    
    // 2. Download swapped SVGs
    for (const [id, wiki] of Object.entries(downloads)) {
        const url = getWikimediaUrl(wiki);
        const filepath = path.join(signsDir, id + '.svg');
        const success = await downloadFile(url, filepath);
        console.log((success ? '✅ Downloaded ' : '❌ Failed ') + id + ' from ' + wiki);
    }
    
    // 3. Update JSON cache buster
    let jsonContent = fs.readFileSync(jsonPath, 'utf8');
    const newVersion = '?v=' + Date.now();
    jsonContent = jsonContent.replace(/\?v=\d+/g, newVersion);
    fs.writeFileSync(jsonPath, jsonContent);
    console.log('Updated JSON timestamps to ' + newVersion);
}

main().catch(console.error);
