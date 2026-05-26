const fs = require('fs');
const path = require('path');
const https = require('https');

const dataFile = path.join(__dirname, '../data/trafik_isaretleri.json');
const outDir = path.join(__dirname, '../public/signs');

if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

let data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

const downloadImage = (url, filepath) => {
    return new Promise((resolve, reject) => {
        // We'll download the original SVG instead of the png thumbnail to avoid 403s on non-existent thumbnails
        let svgUrl = url;
        if (url.includes('/thumb/')) {
            // "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Turkey_road_sign_T-1a.svg/200px-Turkey_road_sign_T-1a.svg.png"
            // => "https://upload.wikimedia.org/wikipedia/commons/e/ec/Turkey_road_sign_T-1a.svg"
            const parts = url.split('/');
            parts.pop(); // remove the 200px- part
            // remove 'thumb'
            const thumbIdx = parts.indexOf('thumb');
            if (thumbIdx !== -1) {
                parts.splice(thumbIdx, 1);
            }
            svgUrl = parts.join('/');
        }

        const options = {
            headers: {
                'User-Agent': 'OtoAsfalt/1.0 (contact@otosoz.com)'
            }
        };

        const req = https.get(svgUrl, options, (res) => {
            if (res.statusCode !== 200) {
                console.error(`Failed to download ${svgUrl}: ${res.statusCode}`);
                // fallback to the original url if SVG fails
                https.get(url, options, (res2) => {
                    if (res2.statusCode !== 200) {
                        resolve(false);
                        return;
                    }
                    const file = fs.createWriteStream(filepath);
                    res2.pipe(file);
                    file.on('finish', () => { file.close(); resolve(true); });
                });
                return;
            }
            const file = fs.createWriteStream(filepath);
            res.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve(true);
            });
        });

        req.on('error', (err) => {
            reject(err);
        });
    });
};

async function processAll() {
    let promises = [];
    for (let cat of data.categories) {
        for (let sign of cat.signs) {
            // some are svg.png, let's just save as .svg since we are downloading the SVG
            let filename = sign.id + '.svg';
            let filepath = path.join(outDir, filename);
            let localUrl = `/signs/${filename}`;
            
            console.log(`Downloading ${sign.id}...`);
            const success = await downloadImage(sign.image, filepath);
            if (success) {
                sign.image = localUrl;
            } else {
                console.log(`Could not download ${sign.id}`);
            }
        }
    }
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
    console.log('All done. Data file updated.');
}

processAll();
