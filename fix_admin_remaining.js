const fs = require('fs');
const content = fs.readFileSync('app/admin/reklamlar/page.tsx', 'utf8');

let newContent = content.replace(/🟢Â/g, '🟢');
newContent = newContent.replace(/🟢¼/g, '🔴');
newContent = newContent.replace(/🟢Â/g, '🟢');
newContent = newContent.replace(/🟢¼/g, '🔴');
newContent = newContent.replace(/tanımlanmıŞ/g, 'tanımlanmış');
newContent = newContent.replace(/📑 /g, '📑 ');
newContent = newContent.replace(/ÇıkıŞ/g, 'Çıkış');
newContent = newContent.replace(/Ãƒâ€”/g, 'x');
newContent = newContent.replace(/👍¤/g, '👍');
newContent = newContent.replace(/🛑ª/g, '🛑');
newContent = newContent.replace(/📑¢/g, '📑');
newContent = newContent.replace(/— /g, '— ');

if (content !== newContent) {
    fs.writeFileSync('app/admin/reklamlar/page.tsx', newContent);
    console.log('Fixed reklamlar page bugs');
}

const hesapContent = fs.readFileSync('app/admin/hesap/page.tsx', 'utf8');
let newHesap = hesapContent.replace(/🟢 Çevrimiçi/g, '🟢 Çevrimiçi');
newHesap = newHesap.replace(/sabitlenmiŞ/g, 'sabitlenmiş');
if (hesapContent !== newHesap) {
    fs.writeFileSync('app/admin/hesap/page.tsx', newHesap);
    console.log('Fixed hesap page bugs');
}
