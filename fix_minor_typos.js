const fs = require('fs');
const path = require('path');

function fix(filepath, pairs) {
  if (!fs.existsSync(filepath)) return;
  let c = fs.readFileSync(filepath, 'utf8');
  const orig = c;
  for (const [bad, good] of pairs) {
    c = c.split(bad).join(good);
  }
  if (c !== orig) {
    fs.writeFileSync(filepath, c, 'utf8');
    console.log('Fixed: ' + filepath);
  }
}

fix('app/giris/page.tsx', [
  ['GÖncel', 'Güncel'],
]);

fix('app/kayit/page.tsx', [
  ['hesabnz var m?', 'hesabınız var mı?'],
  ['hesabnz var m?', 'hesabınız var mı?'],
  ['hesabnz', 'hesabınız'],
  ['Giriş yapn', 'Giriş yapın'],
  ['Giriş yapn', 'Giriş yapın'],
]);

fix('app/page.tsx', [
  ['GazyaÃ„şı', 'Gazyağı'],
  ['BitiŞ', 'Bitiş'],
  ['GÖncel', 'Güncel'],
]);

console.log('Minor typos fixed.');
