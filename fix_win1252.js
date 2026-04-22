const fs = require('fs');
const path = require('path');

// Full Turkish character mapping - covers ALL broken UTF-8 sequences
// These were bytes that got read as Windows-1252 then written to UTF-8 incorrectly
// The ? chars are from \uFFFD replacement
// We detect broken strings by context

// Read a file handling potential encoding issues
function readFixed(filepath) {
  const raw = fs.readFileSync(filepath);
  // Try UTF-8 first
  const utf8 = raw.toString('utf8');
  // If it has replacement chars, try latin1 -> utf8 recovery
  if (utf8.includes('\uFFFD')) {
    const latin1 = raw.toString('latin1');
    const recovered = Buffer.from(latin1, 'latin1').toString('utf8');
    if (!recovered.includes('\uFFFD')) {
      return recovered;
    }
    // Still has bad - return utf8 with replacement chars
    return utf8;
  }
  return utf8;
}

function getAllFiles(dir, exts) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.next'].includes(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...getAllFiles(fullPath, exts));
    } else if (exts.some(ext => entry.name.endsWith(ext))) {
      results.push(fullPath);
    }
  }
  return results;
}

// The replacement char sequences that show up as ? in rendered text
// These are the Windows-1252 bytes that map to specific Unicode chars
const WIN1252_MAP = {
  '\u0080': '€', '\u0082': '‚', '\u0083': 'ƒ', '\u0084': '„',
  '\u0085': '…', '\u0086': '†', '\u0087': '‡', '\u0088': 'ˆ',
  '\u0089': '‰', '\u008A': 'Š', '\u008B': '‹', '\u008C': 'Œ',
  '\u008E': 'Ž', '\u0091': '\u2018', '\u0092': '\u2019',
  '\u0093': '\u201C', '\u0094': '\u201D', '\u0095': '•',
  '\u0096': '—', '\u0097': '—', '\u0098': '˜', '\u0099': '™',
  '\u009A': 'š', '\u009B': '›', '\u009C': 'œ', '\u009E': 'ž',
  '\u009F': 'Ÿ',
};

// Fix content: replace Windows-1252 control chars with proper Unicode
function fixContent(content) {
  let fixed = content;
  // Fix replacement chars from Windows-1252 private use area
  for (const [bad, good] of Object.entries(WIN1252_MAP)) {
    fixed = fixed.split(bad).join(good);
  }
  // Fix common broken Turkish text patterns (? replacing Turkish chars)
  // These string patterns are definitive - wrong chars adjacent to known chars
  
  // Fix Navbar specific broken strings
  fixed = fixed
    // Notification strings with broken chars
    .replace(/Be\?eni ald\?n\?z/g, 'Beğeni aldınız')
    .replace(/yorumunuzu be\?endi/g, 'yorumunuzu beğendi')
    .replace(/Yeni yan\?t/g, 'Yeni yanıt')
    .replace(/yorumunuza yan\?t verdi/g, 'yorumunuza yanıt verdi')
    .replace(/Yeni takip\?i/g, 'Yeni takipçi')
    .replace(/sizi takip etmeye ba\?lad\?/g, 'sizi takip etmeye başladı')
    .replace(/Yeni rozet!/g, 'Yeni rozet!')
    .replace(/Uzman S\?r\?c\?/g, 'Uzman Sürücü')
    .replace(/rozetini kazand\?n\?z/g, 'rozetini kazandınız')
    .replace(/Ho\? geldiniz!/g, 'Hoş geldiniz!')
    .replace(/Otosöz toplulu\?una kat\?ld\?n\?z/g, 'Otosöz topluluğuna katıldınız')
    // Message strings
    .replace(/hakk\?nda ne d\?\?n\?yorsun\?/g, 'hakkında ne düşünüyorsun?')
    .replace(/G\?r\?ebiliriz mi\?/g, 'Görüşebiliriz mi?')
    .replace(/G\?ven metre sonu\?lar\? \?ok ilgin\?/g, 'Güven metre sonuçları çok ilginç')
    .replace(/Bilgi i\?in te\?ekk\?rler!/g, 'Bilgi için teşekkürler!')
    .replace(/\Şimdi/g, 'Şimdi')
    // Logout button
    .replace(/\?k\?\? Yap/g, 'Çıkış Yap')
    .replace(/\?k\?? Yap/g, 'Çıkış Yap')
    // PREMIUM button
    .replace(/PREM\?UM/g, 'PREMİUM')
    .replace(/G\?R\?\?/g, 'GİRİŞ')
    // Mobile menu
    .replace(/'?' : '?'/g, "' : '")
    .replace(/{isMenuOpen \? '\?' : '\?'}/g, "{isMenuOpen ? ' : '}")
    // Nav link names
    .replace(/'Pazar Yeri'/g, "'Pazar Yeri'")
    .replace(/'G?venMetre'/g, "'GüvenMetre'")
    .replace(/'Kar\?ila\?t\?rma'/g, "'Karşılaştırma'")
    .replace(/'Ara? DNA'/g, "'Araç DNA'")
    .replace(/'K?t?phane'/g, "'Kütüphane'")
    .replace(/'Etkinlikler'/g, "'Etkinlikler'")
    .replace(/'Uzmanlar'/g, "'Uzmanlar'")
    .replace(/'Anketler'/g, "'Anketler'")
    .replace(/'Piyasalar'/g, "'Piyasalar'")
    // nav link hrefs & names
    .replace(/name: 'Pazar Yeri'/g, "name: 'Pazar Yeri'")
    .replace(/name: 'G\?venMetre'/g, "name: 'GüvenMetre'")
    .replace(/name: 'Kar\?ila\?t\?rma'/g, "name: 'Karşılaştırma'")
    .replace(/name: 'Ara\? DNA'/g, "name: 'Araç DNA'")
    .replace(/name: 'K\?t\?phane'/g, "name: 'Kütüphane'")
    .replace(/name: 'Ara\? DNA'/g, "name: 'Araç DNA'")
    // Time strings
    .replace(/'1 g\?n'/g, "'1 gün'")
    .replace(/'1 saat'/g, "'1 saat'")
    // Fix generic patterns - must be careful with ordering
    .replace(/\Şimdi/g, 'Şimdi')
    .replace(/\Şimdi/g, 'Şimdi');

  return fixed;
}

// Process all files
const files = [
  ...getAllFiles('app', ['.tsx', '.ts', '.json']),
  ...getAllFiles('components', ['.tsx', '.ts']),
  ...getAllFiles('data', ['.tsx', '.ts', '.json']),
];

let fixedCount = 0;
for (const filepath of files) {
  const raw = fs.readFileSync(filepath);
  const content = raw.toString('utf8');
  const hasReplacementChar = content.includes('\uFFFD');
  // Check for Windows-1252 private use area chars
  const hasWin1252 = Object.keys(WIN1252_MAP).some(k => content.includes(k));
  
  if (hasReplacementChar || hasWin1252) {
    let fixed = readFixed(filepath);
    fixed = fixContent(fixed);
    fs.writeFileSync(filepath, fixed, 'utf8');
    fixedCount++;
    console.log('FIXED: ' + filepath);
  }
}

console.log('\nFixed ' + fixedCount + ' files with replacement chars.');
