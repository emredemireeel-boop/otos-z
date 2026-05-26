const fs = require('fs');
const path = require('path');

const signsDir = path.join(__dirname, '../public/signs');

const newSvgs = {
  'TT-34': '<?xml version="1.0" encoding="utf-8"?> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"><circle cx="120" cy="120" r="100" fill="#fff" stroke="#ef2028" stroke-width="24" /><path d="M 160,120 H 80 M 110,90 L 80,120 L 110,150" fill="none" stroke="#000" stroke-width="20" stroke-linecap="round" stroke-linejoin="round" /><path d="M 50,50 L 190,190" stroke="#ef2028" stroke-width="24" stroke-linecap="round" /></svg>',
  'TT-35': '<?xml version="1.0" encoding="utf-8"?> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"><circle cx="120" cy="120" r="100" fill="#fff" stroke="#ef2028" stroke-width="24" /><path d="M 80,120 H 160 M 130,90 L 160,120 L 130,150" fill="none" stroke="#000" stroke-width="20" stroke-linecap="round" stroke-linejoin="round" /><path d="M 50,50 L 190,190" stroke="#ef2028" stroke-width="24" stroke-linecap="round" /></svg>',
  'P-1': '<?xml version="1.0" encoding="utf-8"?> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"><rect x="20" y="20" width="200" height="200" rx="20" fill="#003e8d" /><text x="120" y="160" font-family="Arial" font-weight="900" font-size="120" fill="#fff" text-anchor="middle">P</text></svg>'
};

for (const [id, svg] of Object.entries(newSvgs)) {
  fs.writeFileSync(path.join(signsDir, id + '.svg'), svg);
  console.log('Fixed ' + id + '.svg');
}
