const fs = require('fs');
let content = fs.readFileSync('app/uzmana-sor/page.tsx', 'utf8');

content = content.replace(/'linear-gradient\\(135deg, rgba\\(59, 130, 246, 0\\.1\\), rgba\\(147, 51, 234, 0\\.1\\)\\)'/g, "'var(--secondary)'");
content = content.replace(/'1px solid rgba\\(59, 130, 246, 0\\.2\\)'/g, "'1px solid var(--card-border)'");
content = content.replace(/Bunlar\? Biliyor muydunuz\?/g, "Bunları Biliyor muydunuz?");

fs.writeFileSync('app/uzmana-sor/page.tsx', content);
console.log('Fixed uzmana-sor random fact section');
