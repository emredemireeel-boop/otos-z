const https = require('https');
const fs = require('fs');

const url = "https://tr.wikipedia.org/w/api.php?action=parse&page=T%C3%BCrkiye%27deki_trafik_i%C5%9Faretleri&format=json";

const options = {
    headers: {
        'User-Agent': 'OtoAsfaltBot/1.0 (otoasfalt@example.com)'
    }
};

https.get(url, options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            const html = json.parse.text['*'];
            
            const signs = [];
            const imgRegex = /<img[^>]+src="([^">]+)"[^>]+alt="([^">]+)"/g;
            let match;
            while ((match = imgRegex.exec(html)) !== null) {
                let src = match[1];
                let alt = match[2];
                if (src.includes('Turkey_road_sign') || src.includes('Traffic_sign')) {
                    if (src.startsWith('//')) src = 'https:' + src;
                    src = src.replace(/\/\d+px-/, '/300px-');
                    
                    // Cleanup alt text (e.g., remove "Turkey road sign..." if alt is bad)
                    if (alt.includes('Turkey road sign')) {
                       // skip or clean
                       let parts = alt.split('.');
                       alt = parts[0];
                    }

                    signs.push({
                        image: src,
                        name: alt.trim()
                    });
                }
            }
            
            fs.writeFileSync('scratch/signs.json', JSON.stringify(signs, null, 2));
            console.log(`Found ${signs.length} signs.`);
        } catch (e) {
            console.error(e);
        }
    });
}).on('error', (e) => {
    console.error(e);
});
