const fs = require('fs');
const path = 'app/kullanim-sartlari/page.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/Ã„ş/g, 'ğ');
content = content.replace(/Ã„Ş/g, 'Ğ');
content = content.replace(/İŞbu/g, 'İşbu');
content = content.replace(/⚠️/g, '⚠️');

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed Turkish characters in Kullanım Şartları.');
