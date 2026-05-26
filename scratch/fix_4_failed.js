const fs = require('fs');
const path = require('path');

const signsDir = path.join(__dirname, '../public/signs');

const signs = {
  'TT-38': '<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><circle cx="100" cy="100" r="90" fill="#0053a0" stroke="#ef2028" stroke-width="20" /><line x1="36" y1="36" x2="164" y2="164" stroke="#ef2028" stroke-width="20" /></svg>',
  
  'TT-39': '<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><circle cx="100" cy="100" r="90" fill="#0053a0" stroke="#ef2028" stroke-width="20" /><line x1="36" y1="36" x2="164" y2="164" stroke="#ef2028" stroke-width="20" /><line x1="164" y1="36" x2="36" y2="164" stroke="#ef2028" stroke-width="20" /></svg>',
  
  'TT-33': '<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><circle cx="100" cy="100" r="90" fill="#fff" stroke="#000" stroke-width="6" /><text x="100" y="130" font-family="Arial, sans-serif" font-weight="900" font-size="80" fill="#000" text-anchor="middle">50</text><line x1="50" y1="170" x2="150" y2="30" stroke="#000" stroke-width="6" /><line x1="40" y1="160" x2="140" y2="20" stroke="#000" stroke-width="6" /><line x1="60" y1="180" x2="160" y2="40" stroke="#000" stroke-width="6" /></svg>',
  
  'TT-29': '<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><circle cx="100" cy="100" r="90" fill="#fff" stroke="#ef2028" stroke-width="20" /><rect x="35" y="80" width="50" height="40" fill="#ef2028" rx="5" /><rect x="115" y="90" width="40" height="30" fill="#000" rx="10" /></svg>'
};

for (const [id, svg] of Object.entries(signs)) {
  fs.writeFileSync(path.join(signsDir, id + '.svg'), svg);
  console.log('Fixed ' + id + '.svg');
}
