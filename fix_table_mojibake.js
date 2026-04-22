const fs = require('fs');

let content = fs.readFileSync('app/kutuphane/page.tsx', 'utf8');

const R = '\uFFFD';

content = content.replace('tutarlar' + R + ', ehliyet yapt' + R + 'r' + R + 'mlar' + R + ' ve ara' + R + ' men durumlar' + R, 'tutarları, ehliyet yaptırımları ve araç men durumları');
content = content.replace('Men (Yedek ' + R + 'of' + R + 'r yok)', 'Men (Yedek şoför yok)');
content = content.replace('2026 y' + R + 'l' + R + ' g' + R + 'ncel mevzuat' + R + ' kapsam' + R + 'nda haz' + R + 'rlanm' + R + R + 't' + R + 'r. Kesin bilgi için yetkili makamlara ba' + R + 'vurunuz.', '2026 yılı güncel mevzuatı kapsamında hazırlanmıştır. Kesin bilgi için yetkili makamlara başvurunuz.');

fs.writeFileSync('app/kutuphane/page.tsx', content, 'utf8');
console.log('Fixed \uFFFD mojibake characters in table text');
