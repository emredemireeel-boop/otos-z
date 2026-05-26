const fs = require('fs');
const path = require('path');

const signsDir = path.join(__dirname, '../public/signs');
const jsonPath = path.join(__dirname, '../data/trafik_isaretleri.json');

const svg = '<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><circle cx="100" cy="100" r="90" fill="#fff" stroke="#ef2028" stroke-width="20" /><text x="100" y="130" font-family="Arial, sans-serif" font-weight="900" font-size="80" fill="#000" text-anchor="middle">50</text></svg>';

fs.writeFileSync(path.join(signsDir, 'TT-30.svg'), svg);
console.log('Drawn TT-30');

// Update JSON cache buster again just to be safe
let jsonContent = fs.readFileSync(jsonPath, 'utf8');
const newVersion = '?v=' + Date.now();
jsonContent = jsonContent.replace(/\?v=\d+/g, newVersion);
fs.writeFileSync(jsonPath, jsonContent);
console.log('Updated JSON timestamps to ' + newVersion);
