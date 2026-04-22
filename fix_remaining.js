const fs = require('fs');

// Fix remaining in kutuphane
let k = fs.readFileSync('app/kutuphane/page.tsx', 'utf8');
k = k.split('Oto K?t?phane').join('Oto Kütüphane');
k = k.split('K?t?phane').join('Kütüphane');
k = k.split('k?t?phane').join('kütüphane');
fs.writeFileSync('app/kutuphane/page.tsx', k, 'utf8');
console.log('kutuphane fixed');

// Check remaining ? in kutuphane
const klines = k.split('\n');
let kq = 0;
klines.forEach((l, i) => {
  if (/>([^<]*\?[^<]*)</.test(l) || /['"]([^'"]*\?[^'"]*)['"]\s*[,}\)]/.test(l)) {
    console.log('K' + (i+1) + ': ' + l.trim().substring(0, 80));
    kq++;
  }
});
console.log('Remaining ? in kutuphane: ' + kq);

// Now check uzmana-sor
const u = fs.readFileSync('app/uzmana-sor/page.tsx', 'utf8');
const ulines = u.split('\n');
let uq = 0;
ulines.forEach((l, i) => {
  if (/>([^<]*\?[^<]*)</.test(l) || /['"]([^'"]*\?[^'"]*)['"]\s*[,}\)]/.test(l)) {
    if (uq < 30) console.log('U' + (i+1) + ': ' + l.trim().substring(0, 80));
    uq++;
  }
});
console.log('Total ? in uzmana-sor: ' + uq);
