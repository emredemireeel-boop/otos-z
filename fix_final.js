const fs = require('fs');
const path = require('path');

function getAllFiles(dir, exts) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.next'].includes(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...getAllFiles(fullPath, exts));
    else if (exts.some(ext => entry.name.endsWith(ext))) results.push(fullPath);
  }
  return results;
}

// iconv-lite win1252 decode of UTF-8 bytes:
// For Turkish chars that were in UTF-8 (C4 9F, C5 9F, etc.)
// After win1252 decode:
//   0xC4 (196) -> U+00C4 = Ä
//   0x9F (159) -> U+0178 = Ÿ
//   0xC5 (197) -> U+00C5 = Å  
//   0x9E (158) -> U+017E = ž
//   0xC5 0x9F -> Å ž  (but win1252 0x9F = U+0178 = Ÿ, 0x9E = U+017E = ž)
//   0xC4 0x9E -> Äž
//   0xC3 0xB6 -> ö (ö)
//   0xC3 0xBC -> ü (ü)
//   0xC4 0xB1 -> ı (ı)

// So the "double-iconv" patterns are:
const FIXES = [
  // ğ (UTF8: C4 9F) -> after win1252 decode -> Ä + win1252(9F=Ÿ U+0178) = ÄŸ
  ['\u00C4\u0178', '\u011F'],  // ğ : Ä + Ÿ(U+0178)
  // Ğ (UTF8: C4 9E) -> Ä + win1252(9E=ž U+017E) = Äž
  ['\u00C4\u017E', '\u011E'],  // Ğ : Ä + ž(U+017E)
  // ş (UTF8: C5 9F) -> Å + Ÿ(U+0178)
  ['\u00C5\u0178', '\u015F'],  // ş : Å + Ÿ(U+0178)
  // Ş (UTF8: C5 9E) -> Å + ž(U+017E)
  ['\u00C5\u017E', '\u015E'],  // Ş : Å + ž(U+017E)
  //  (UTF8: C5 9F) in DIFFERENT encoding: ş
  ['\u00C5\u0178', '\u015F'],  // ş duplicate handled above
  // ı (UTF8: C4 B1) -> Ä + ±(U+00B1) = ı
  ['\u00C4\u00B1', '\u0131'],  // ı : Ä + ±
  // İ (UTF8: C4 B0) -> Ä + °(U+00B0) = İ
  ['\u00C4\u00B0', '\u0130'],  // İ : Ä + °
  // ö (UTF8: C3 B6) -> à+ ¶(U+00B6) = ö
  ['\u00C3\u00B6', '\u00F6'],  // ö
  // ü (UTF8: C3 BC) -> à+ ¼(U+00BC) = ü
  ['\u00C3\u00BC', '\u00FC'],  // ü
  // ç (UTF8: C3 A7) -> à+ §(U+00A7) = ç
  ['\u00C3\u00A7', '\u00E7'],  // ç
  // Ç (UTF8: C3 87) -> à+ ‡(U+2021??) actually 0x87 in Win1252 is U+2021(double dagger)
  // Wait: C3 87 -> Ã¿? No: C3 (Ã) 87 -> win1252(87)=U+2021 is wrong
  // win1252 byte 0x87 -> U+2021 (DOUBLE DAGGER)
  ['\u00C3\u2021', '\u00C7'],  // Ç
  // Ö (UTF8: C3 96) -> à+ win1252(96)=U+2013(en dash)
  ['\u00C3\u2013', '\u00D6'],  // Ö
  // Ü (UTF8: C3 9C) -> à+ win1252(9C)=U+0153(œ)
  ['\u00C3\u0153', '\u00DC'],  // Ü
  // â (UTF8: C3 A2) -> à+ ¢
  // Various other sequences...
  // en dash — (E2 80 94 in UTF8) -> after win1252: â (E2=â) + \u0080(U+0080)?
  // Actually E2 = â, 80 is C1 so win1252(80)=U+20AC(€), 94 win1252(94)=U+201D 
  // This gets very complex. Let's focus on just the Turkish chars above.
  
  // Additional patterns that might appear:
  ['\u00C4\u009F', '\u011F'],  // ğ: Ä + U+009F (sometimes appears)
  ['\u00C5\u009F', '\u015F'],  // ş: Å + U+009F
  ['\u00C4\u009E', '\u011E'],  // Ğ: Ä + U+009E  
  ['\u00C5\u009E', '\u015E'],  // Ş: Å + U+009E
];

const files = [
  ...getAllFiles('app', ['.tsx', '.ts', '.json']),
  ...getAllFiles('components', ['.tsx', '.ts']),
  ...getAllFiles('data', ['.tsx', '.ts', '.json']),
];

let totalFixed = 0;
for (const filepath of files) {
  let content = fs.readFileSync(filepath, 'utf8');
  let changed = false;
  
  for (const [bad, good] of FIXES) {
    if (content.includes(bad)) {
      content = content.split(bad).join(good);
      changed = true;
    }
  }
  
  if (changed) {
    fs.writeFileSync(filepath, content, 'utf8');
    totalFixed++;
    console.log('FIXED: ' + filepath);
  }
}

console.log('\nTotal files fixed: ' + totalFixed);

// Verify Navbar
const nav = fs.readFileSync('components/Navbar.tsx', 'utf8');
console.log('\nNavbar verification:');
console.log('Has Beğeni:', nav.includes('Be\u011Feni'));
console.log('Has başladı:', nav.includes('ba\u015Flad\u0131'));
console.log('Has topluluğuna:', nav.includes('toplulu\u011Funa'));
