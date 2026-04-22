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

// These are contexts where uppercase Ş should be lowercase ş
// We look for specific Turkish words where Ş appears mid-word incorrectly
// Mid-word uppercase Ş means it should be ş
const WORD_FIXES = [
  // Common incorrectly uppercased patterns
  ['baŞla', 'başla'],
  ['baŞlı', 'başlı'],
  ['baŞar', 'başar'],
  ['düŞün', 'düşün'],
  ['görüŞ', 'görüş'],
  ['iŞle', 'işle'],
  ['iŞlem', 'işlem'],
  ['teŞek', 'teşek'],
  ['giŞe', 'gişe'],
  ['hoŞ g', 'hoş g'],  // hoş geldiniz etc
  ['HoŞ g', 'Hoş g'],  // sentence start
  ['boŞ', 'boş'],
  ['deŞif', 'deşif'],
  ['eŞ', 'eş'],        // eşit etc
  ['leŞ', 'leş'],
  ['öfŞ', 'öfş'],
  ['taŞ', 'taş'],
  ['kaŞ', 'kaş'],
  ['yaŞ', 'yaş'],
  ['geŞ', 'geş'],
  ['ŞiŞ', 'şiş'],
  ['doŞ', 'doş'],
  ['kiŞ', 'kiş'],
  ['yüŞ', 'yüş'],
  ['oluŞ', 'oluş'],
  ['çalıŞ', 'çalış'],
  ['paylaŞ', 'paylaş'],
  ['araŞtır', 'araştır'],
  ['gerçekleŞ', 'gerçekleş'],
  ['birleŞ', 'birleş'],
  ['dönüŞ', 'dönüş'],
  ['karŞı', 'karşı'],
  ['topluluŞ', 'topluluş'],  // shouldn't exist but just in case
];

const files = [
  ...getAllFiles('app', ['.tsx', '.ts']),
  ...getAllFiles('components', ['.tsx', '.ts']),
  ...getAllFiles('data', ['.tsx', '.ts']),
];

let totalFixed = 0;
for (const filepath of files) {
  let content = fs.readFileSync(filepath, 'utf8');
  let changed = false;
  
  for (const [bad, good] of WORD_FIXES) {
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
