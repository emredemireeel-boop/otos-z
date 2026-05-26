const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, '../data/trafik_isaretleri.json');
const signsDir = path.join(__dirname, '../public/signs');

const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

// We only keep signs that have a valid downloaded SVG file (> 1200 bytes)
for (let cat of data.categories) {
    cat.signs = cat.signs.filter(sign => {
        const svgPath = path.join(signsDir, `${sign.id}.svg`);
        if (fs.existsSync(svgPath)) {
            const size = fs.statSync(svgPath).size;
            if (size > 1200) {
                return true; // Keep this sign, it's real
            }
        }
        return false; // Remove fake or missing sign
    });
}

// Write back
fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
console.log('Filtered out missing or fake signs from JSON.');
