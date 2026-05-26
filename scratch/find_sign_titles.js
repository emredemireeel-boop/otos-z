const https = require('https');
const fs = require('fs');
const path = require('path');

function fetchJSON(url) {
    return new Promise((resolve, reject) => {
        https.get(url, { headers: { 'User-Agent': 'OtoAsfaltBot/1.0' } }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try { resolve(JSON.parse(data)); }
                catch(e) { reject(new Error(`Parse error: ${data.substring(0,200)}`)); }
            });
        }).on('error', reject);
    });
}

async function main() {
    // Use the Turkish Wikipedia article which uses the real sign images
    const url = 'https://tr.wikipedia.org/w/api.php?action=query&titles=T%C3%BCrkiye%27deki_trafik_i%C5%9Faretleri&prop=images&imlimit=500&format=json';
    const data = await fetchJSON(url);
    const pages = data.query.pages;
    const pageId = Object.keys(pages)[0];
    const images = pages[pageId].images || [];
    
    console.log(`Total images: ${images.length}`);
    const signImages = images.map(img => img.title);
    signImages.forEach(img => console.log(img));
    
    fs.writeFileSync(
        path.join(__dirname, 'turkey_sign_titles.json'),
        JSON.stringify(signImages, null, 2)
    );
}

main().catch(console.error);
