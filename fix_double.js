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

// Double-encoded UTF-8 sequences (Turkish only, no emojis to avoid script corruption)
// Format: bad sequence -> correct char
const DOUBLE_ENCODED = [
  ['\u00C3\u00B6', '\u00F6'], // ö
  ['\u00C3\u00BC', '\u00FC'], // ü
  ['\u00C3\u00A7', '\u00E7'], // ç
  ['\u00C3\u2021', '\u00C7'], // Ç (Ç)
  ['\u00C3\u2013', '\u00D6'], // Ö (Ö)
  ['\u00C3\u0153', '\u00DC'], // Ü (Ü)
  ['\u00C4\u00B1', '\u0131'], // ı (ı)
  ['\u00C4\u00B0', '\u0130'], // İ (İ)
  ['\u00C5\u0178', '\u015E'], // Ş (Ş)
  ['\u00C5\u00B8', '\u015F'], // ş (ş but as 2 bytes)
  ['\u00C4\u009E', '\u011E'], // Ğ (Äž)
  ['\u00C4\u009F', '\u011F'], // ğ (Ä\x9f)
  // Also handle the visible string form
  ['ö', '\u00F6'],  // ö
  ['ü', '\u00FC'],  // ü
  ['ç', '\u00E7'],  // ç
  ['Ã\u0087', '\u00C7'], // Ç
  ['Ã\u0096', '\u00D6'], // Ö
  ['Ã\u009C', '\u00DC'], // Ü
  ['ı', '\u0131'],  // ı
  ['İ', '\u0130'],  // İ
  ['Ş', '\u015E'],  // Ş
  ['ş', '\u015F'],  // ş
  ['Äž', '\u011E'],  // Ğ
  ['Ä\u009F', '\u011F'], // ğ
  // Bullet/dot
  ['\u00C2\u00B7', '\u00B7'], // middle dot (·)
  ['·', '\u00B7'],
  // Online status dot
  ['â—', '\u25CF'], // filled circle
  // Çevrimiçi specific
  ['\u00C3\u2021evrimii', '\u00C7evrimii'], // partial fix
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
  
  for (const [bad, good] of DOUBLE_ENCODED) {
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
