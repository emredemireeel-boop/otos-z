const fs=require('fs');
let f='app/uzmana-sor/page.tsx';
let c=fs.readFileSync(f,'utf8');
c=c.replace(/\?\? Aktif Uzmanlar/g,'👨‍🔧 Aktif Uzmanlar');
c=c.replace(/icon=\"\?\?\"/g,'icon="🔧"');
c=c.replace(/Detayl\? A\?\?klama/g,'Detaylı Açıklama');
c=c.replace(/\?\? ödeme Bilgisi/g,'💳 Ödeme Bilgisi');
fs.writeFileSync(f,c);
