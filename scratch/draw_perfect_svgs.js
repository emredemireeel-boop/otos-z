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

const perfectSigns = {
  'T-1b': '<path d="M 120,170 L 120,110 Q 120,80 85,80" fill="none" stroke="#000" stroke-width="22" stroke-linecap="round" /> <polygon points="90,55 50,80 90,105" fill="#000" />',
  
  'T-1a': '<path d="M 120,170 L 120,110 Q 120,80 155,80" fill="none" stroke="#000" stroke-width="22" stroke-linecap="round" /> <polygon points="150,55 190,80 150,105" fill="#000" />',
  
  'T-2b': '<path d="M 120,170 L 120,140 Q 120,110 90,110 Q 70,110 70,90 L 70,80" fill="none" stroke="#000" stroke-width="22" stroke-linecap="round" /> <polygon points="50,85 70,50 90,85" fill="#000" />',
  
  'T-2a': '<path d="M 120,170 L 120,140 Q 120,110 150,110 Q 170,110 170,90 L 170,80" fill="none" stroke="#000" stroke-width="22" stroke-linecap="round" /> <polygon points="150,85 170,50 190,85" fill="#000" />',
  
  'T-3a': '<polygon points="50,140 190,140 50,70" fill="#000" /> <text x="100" y="130" font-family="Arial, sans-serif" font-weight="900" font-size="32" fill="#fff" transform="rotate(26 100 130)">10%</text>',
  
  'T-3b': '<polygon points="50,140 190,140 190,70" fill="#000" /> <text x="140" y="130" font-family="Arial, sans-serif" font-weight="900" font-size="32" fill="#fff" transform="rotate(-26 140 130)">10%</text>',
  
  'T-4a': '<path d="M 80,170 L 80,120 L 100,80 L 100,50 M 160,170 L 160,120 L 140,80 L 140,50" fill="none" stroke="#000" stroke-width="24" stroke-linecap="square" stroke-linejoin="miter" />',
  
  'T-4b': '<path d="M 90,170 L 90,50 M 160,170 L 160,120 L 130,80 L 130,50" fill="none" stroke="#000" stroke-width="24" stroke-linecap="square" stroke-linejoin="miter" />',
  
  'T-7': '<path d="M 50,130 C 50,60 120,60 120,130 C 120,60 190,60 190,130" fill="none" stroke="#000" stroke-width="24" stroke-linecap="round" />'
};

for (const [id, inner] of Object.entries(perfectSigns)) {
  fs.writeFileSync(path.join(signsDir, id + '.svg'), baseSvg(inner));
  console.log('Drawn perfect ' + id + '.svg');
}
