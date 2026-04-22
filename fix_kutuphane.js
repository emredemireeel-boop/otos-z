const fs = require('fs');

// Fix kutuphane/page.tsx
let content = fs.readFileSync('app/kutuphane/page.tsx', 'utf8');

const fixes = [
  // Section names (line 141-144)
  ["{ name: '?lgin?', icon: Lightbulb }", "{ name: 'İlginç', icon: Lightbulb }"],
  ["{ name: 'S?zl?k', icon: BookMarked }", "{ name: 'Sözlük', icon: BookMarked }"],
  ["{ name: 'G?stergeler', icon: AlertTriangle }", "{ name: 'Göstergeler', icon: AlertTriangle }"],
  // Line 235
  [": 'G?sterge Paneli'}", ": 'Gösterge Paneli'}"],
  // Line 639
  ['Bu arama i?in ilgin? bilgi bulunamad?.', 'Bu arama için ilginç bilgi bulunamadı.'],
  // Line 761
  ['Bu arama i?in sonu? bulunamad?.', 'Bu arama için sonuç bulunamadı.'],
  // Emoji lines 469 - leave as is, they're emoji
  // Lines 561, 576 - these are thumbs up/down icons
];

for (const [bad, good] of fixes) {
  if (content.includes(bad)) {
    content = content.split(bad).join(good);
    console.log('Fixed: ' + bad.substring(0, 40));
  } else {
    console.log('NOT FOUND: ' + bad.substring(0, 40));
  }
}

fs.writeFileSync('app/kutuphane/page.tsx', content, 'utf8');
console.log('\nDone. Checking line 222 which had h1:');
const lines = content.split('\n');
console.log(lines[221]);
console.log(lines[222]);
console.log(lines[223]);
