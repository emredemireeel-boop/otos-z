const fs = require('fs');
const path = require('path');
const iconv = require('iconv-lite');

function getAllFiles(dir, exts) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.next'].includes(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...getAllFiles(fullPath, exts));
    else if (exts.some(ext => entry.name.endsWith(ext))) results.push(fullPath);
  }
  return results;
}

function hasC1Bytes(raw) {
  for (let i = 0; i < raw.length; i++) {
    if (raw[i] >= 0x80 && raw[i] <= 0x9F) return true;
  }
  return false;
}

const files = [
  ...getAllFiles('app', ['.tsx', '.ts', '.json']),
  ...getAllFiles('components', ['.tsx', '.ts']),
  ...getAllFiles('data', ['.tsx', '.ts', '.json']),
];

let fixed = 0;
for (const filepath of files) {
  const raw = fs.readFileSync(filepath);
  if (hasC1Bytes(raw)) {
    // Use iconv to decode as Windows-1252
    const decoded = iconv.decode(raw, 'win1252');
    fs.writeFileSync(filepath, decoded, 'utf8');
    fixed++;
    
    // Verify
    const raw2 = fs.readFileSync(filepath);
    const stillBad = hasC1Bytes(raw2);
    console.log((stillBad ? 'STILL BAD' : 'OK') + ': ' + filepath);
  }
}

console.log('\nFixed', fixed, 'files');
