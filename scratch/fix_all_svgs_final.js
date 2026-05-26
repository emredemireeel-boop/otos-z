const fs = require('fs');
const path = require('path');

const signsDir = path.join(__dirname, '../public/signs');

const baseSvg = (innerContent) => '<?xml version="1.0" encoding="utf-8"?> ' +
'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 210"> ' +
'  <!-- Thick Red Triangle Background --> ' +
'  <path d="M 120,15 L 225,195 H 15 Z" fill="#fff" stroke="#ef2028" stroke-width="20" stroke-linejoin="round" /> ' +
'  <!-- Inner Black Shape --> ' +
'  ' + innerContent + ' ' +
'</svg>';

const tSigns = {
  'T-1': '<path d="M 135,160 C 135,100 105,100 105,80 M 105,80 L 120,80 M 105,80 L 105,95" fill="none" stroke="#000" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>',
  'T-2': '<path d="M 105,160 C 105,100 135,100 135,80 M 135,80 L 120,80 M 135,80 L 135,95" fill="none" stroke="#000" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>',
  'T-3': '<path d="M 120,160 C 90,130 150,110 120,70 M 120,70 L 135,75 M 120,70 L 110,80" fill="none" stroke="#000" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>',
  'T-4': '<path d="M 120,160 C 150,130 90,110 120,70 M 120,70 L 105,75 M 120,70 L 130,80" fill="none" stroke="#000" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>',
  'T-5': '<polygon points="80,150 160,150 80,90" fill="#000" /><text x="120" y="80" font-family="Arial" font-weight="900" font-size="28" fill="#000" text-anchor="middle">10%</text>',
  'T-6': '<polygon points="80,150 160,150 160,90" fill="#000" /><text x="120" y="80" font-family="Arial" font-weight="900" font-size="28" fill="#000" text-anchor="middle">10%</text>',
  'T-7': '<path d="M 90,160 L 90,120 L 105,90 L 105,60 M 150,160 L 150,120 L 135,90 L 135,60" fill="none" stroke="#000" stroke-width="16" stroke-linecap="square"/>',
  'T-8': '<path d="M 100,160 L 100,60 M 140,160 L 140,120 L 125,90 L 125,60" fill="none" stroke="#000" stroke-width="16" stroke-linecap="square"/>',
  'T-11': '<path d="M 70,140 Q 95,90 120,140 Q 145,90 170,140" fill="none" stroke="#000" stroke-width="16" stroke-linecap="round"/>'
};

for (const [id, inner] of Object.entries(tSigns)) {
  fs.writeFileSync(path.join(signsDir, id + '.svg'), baseSvg(inner));
  console.log('Fixed ' + id + '.svg');
}

const newSvgs = {
  'TT-40': '<?xml version="1.0" encoding="utf-8"?> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"><circle cx="120" cy="120" r="100" fill="#003e8d" stroke="#ef2028" stroke-width="24" /><path d="M 50,50 L 190,190" stroke="#ef2028" stroke-width="24" stroke-linecap="round" /></svg>',
  'TT-41': '<?xml version="1.0" encoding="utf-8"?> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"><circle cx="120" cy="120" r="100" fill="#003e8d" stroke="#ef2028" stroke-width="24" /><path d="M 50,50 L 190,190 M 190,50 L 50,190" stroke="#ef2028" stroke-width="24" stroke-linecap="round" /></svg>',
  'TT-33': '<?xml version="1.0" encoding="utf-8"?> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"><circle cx="120" cy="120" r="110" fill="#003e8d" /><path d="M 60,120 H 160 M 130,90 L 160,120 L 130,150" fill="none" stroke="#fff" stroke-width="20" stroke-linecap="round" stroke-linejoin="round" /></svg>',
  'TT-33a': '<?xml version="1.0" encoding="utf-8"?> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"><circle cx="120" cy="120" r="110" fill="#003e8d" /><path d="M 180,120 H 80 M 110,90 L 80,120 L 110,150" fill="none" stroke="#fff" stroke-width="20" stroke-linecap="round" stroke-linejoin="round" /></svg>',
  'B-11': '<?xml version="1.0" encoding="utf-8"?> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"><rect x="10" y="10" width="220" height="220" rx="20" fill="#003e8d" /><path d="M 120,40 L 200,180 H 40 Z" fill="#fff" /><path d="M 110,130 L 100,160 M 110,130 L 120,160 M 110,130 V 100 M 110,100 L 90,110 M 110,100 L 130,110" fill="none" stroke="#000" stroke-width="10" stroke-linecap="round" /><circle cx="110" cy="80" r="10" fill="#000" /><path d="M 70,170 H 150 M 60,180 H 160" stroke="#000" stroke-width="8" /></svg>'
};

for (const [id, svg] of Object.entries(newSvgs)) {
  fs.writeFileSync(path.join(signsDir, id + '.svg'), svg);
  console.log('Fixed ' + id + '.svg');
}
