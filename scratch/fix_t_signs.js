const fs = require('fs');
const path = require('path');

const signsDir = path.join(__dirname, '../public/signs');

const baseSvg = (innerContent) => '<?xml version="1.0" encoding="utf-8"?>\\n' +
'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 210">\\n' +
'  <!-- Thick Red Triangle Background -->\\n' +
'  <path d="M 120,15 L 225,195 H 15 Z" fill="#fff" stroke="#ef2028" stroke-width="20" stroke-linejoin="round" />\\n' +
'  <!-- Inner Black Shape -->\\n' +
'  ' + innerContent + '\\n' +
'</svg>';

const tSigns = {
  'T-1': '<path d="M 135,160 C 135,100 105,100 105,80 M 105,80 L 120,80 M 105,80 L 105,95" fill="none" stroke="#000" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>',
  'T-2': '<path d="M 105,160 C 105,100 135,100 135,80 M 135,80 L 120,80 M 135,80 L 135,95" fill="none" stroke="#000" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>',
  'T-3': '<path d="M 120,160 C 150,130 90,110 120,70 M 120,70 L 105,75 M 120,70 L 130,80" fill="none" stroke="#000" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>',
  'T-4': '<path d="M 120,160 C 90,130 150,110 120,70 M 120,70 L 135,75 M 120,70 L 110,80" fill="none" stroke="#000" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>',
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
