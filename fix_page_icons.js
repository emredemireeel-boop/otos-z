const fs = require('fs');

const path = 'app/page.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/📑/g, '📑');
content = content.replace(/\{ id: 'expert', label: ' Soru', desc: 'Uzmana Sor' \}/g, "{ id: 'expert', label: '💡 Soru', desc: 'Uzmana Sor' }");

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed page.tsx icons');
