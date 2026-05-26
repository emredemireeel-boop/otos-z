const https = require('https');

https.get('https://tr.wikipedia.org/wiki/T%C3%BCrkiye%27deki_trafik_i%C5%9Faretleri', (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        const fs = require('fs');
        fs.writeFileSync('scratch/wiki_signs.html', data);
        console.log('Saved to scratch/wiki_signs.html. Length: ', data.length);
    });
});
