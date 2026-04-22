const fs = require('fs');

// Fix kutuphane - remaining ? are emojis and icon chars
let k = fs.readFileSync('app/kutuphane/page.tsx', 'utf8');
const klines = k.split('\n');

// Line 469: ?? = emoji placeholder, let's see context
console.log('Line 469:', klines[468]);
console.log('Line 561:', klines[560]);
console.log('Line 576:', klines[575]);
console.log('Line 619:', klines[618]);
console.log('Line 626:', klines[625]);
console.log('Line 748:', klines[747]);

// Fix uzmana-sor
let u = fs.readFileSync('app/uzmana-sor/page.tsx', 'utf8');

const uzFixes = [
  // State initialization
  ['"T?m?"', '"Tümü"'],
  // Experts data (lines 627-630)
  ["expertise: \"Otomatik ?anz?man\"", "expertise: \"Otomatik Şanzıman\""],
  ["expertise: \"Ara? Elektroni?i\"", "expertise: \"Araç Elektroniği\""],
  ["expertise: \"Lastik \\u0026 Yol Tutu?\"", "expertise: \"Lastik & Yol Tutuşu\""],
  ['expertise: "Lastik & Yol Tutu?"', 'expertise: "Lastik & Yol Tutuşu"'],
  ["expertise: \"A??r Hasar Onar?m?\"", "expertise: \"Ağır Hasar Onarımı\""],
  // JSX text spans
  ['>Yan?t<', '>Yanıt<'],
  ['Uzman garantili yan?t', 'Uzman garantili yanıt'],
  ['Öncelikli destek', 'Öncelikli destek'],
  ['Detayl? a??klama', 'Detaylı açıklama'],
  ['Topluluk yan?tlar?', 'Topluluk yanıtları'],
  ['S?n?rs?z soru', 'Sınırsız soru'],
  ['Herkese a??k', 'Herkese açık'],
  // Line 1055
  ['Soru detaylar? ?', 'Soru detayları ·'],
  ["'?deme'", "'Ödeme'"],
  ["'Gönder'", "'Gönder'"],
  // Lines 1069-1088
  ["'5 araca kadar de?erlendirme'", "'5 araca kadar değerlendirme'"],
  ["'Art?-eksi listesi'", "'Artı-eksi listesi'"],
  ["'Video ve foto?raf deste?i'", "'Video ve fotoğraf desteği'"],
  ["'Olas? neden analizi'", "'Olası neden analizi'"],
  ["'Par?a ve i??ilik bedeli'", "'Parça ve işçilik bedeli'"],
  // title.replace patterns
  ["section.tip.title.replace('?? ', '')", "section.tip.title.replace('💡 ', '')"],
  ["section.warning.title.replace('?? ', '')", "section.warning.title.replace('⚠️ ', '')"],
];

for (const [bad, good] of uzFixes) {
  if (u.includes(bad)) {
    u = u.split(bad).join(good);
    console.log('UZ Fixed: ' + bad.substring(0, 50));
  } else {
    console.log('UZ NOT FOUND: ' + bad.substring(0, 50));
  }
}

fs.writeFileSync('app/uzmana-sor/page.tsx', u, 'utf8');
console.log('\nDone.');
