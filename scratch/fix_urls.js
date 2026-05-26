const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, '../data/trafik_isaretleri.json');
let data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

for (let cat of data.categories) {
    for (let sign of cat.signs) {
        let url = sign.image;
        if (url.includes('/thumb/')) {
            const parts = url.split('/');
            parts.pop(); // remove the 200px- part
            const thumbIdx = parts.indexOf('thumb');
            if (thumbIdx !== -1) {
                parts.splice(thumbIdx, 1);
            }
            sign.image = parts.join('/');
        }
    }
}

fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
console.log('URLs updated successfully.');
