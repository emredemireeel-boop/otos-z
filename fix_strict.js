const fs = require('fs');
const path = require('path');
const R = '\uFFFD';

function getAllFiles(dir, exts = ['.tsx', '.ts', '.js']) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.next', '.git', 'public'].includes(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...getAllFiles(fullPath, exts));
    else if (exts.some(e => entry.name.endsWith(e))) results.push(fullPath);
  }
  return results;
}

const root = process.cwd();
const files = getAllFiles(root);

for (const filepath of files) {
  let c;
  try { c = fs.readFileSync(filepath, 'utf8'); } catch { continue; }
  const orig = c;

  c = c.replace(/Otosöz/g, 'Otosöz');
  c = c.replace(/Otosöz/g, 'Otosöz');
  c = c.replace(/Otosöz/g, 'Otosöz');
  c = c.replace(/Otosöz/ig, 'Otosöz');
  c = c.replace(/Otosöz/g, 'Otosöz');

  if (c !== orig) {
    fs.writeFileSync(filepath, c, 'utf8');
    console.log('✓ Name fix: ' + path.relative(root, filepath));
  }
}

function fixFile(filepath, pairs) {
  if (!fs.existsSync(filepath)) return;
  let c = fs.readFileSync(filepath, 'utf8');
  let orig = c;
  for (const [bad, good] of pairs) {
    c = c.split(bad).join(good);
  }
  if (c !== orig) {
    fs.writeFileSync(filepath, c, 'utf8');
    console.log('✅ Encoding fix: ' + filepath);
  }
}

fixFile('app/kutuphane/page.tsx', [
  ['Otosöz', 'Otosöz'],
  ['i' + R + 'in ', 'için '],
  ['ilgin' + R + ' ', 'ilginç '],
  ['sonu' + R + ' ', 'sonuç '],
  ['S' + R + 'zl' + R + 'k', 'Sözlük'],
  ['G' + R + 'stergeler', 'Göstergeler'],
  ['Cezalar' + R, 'Cezaları'],
  ['G' + R + 'ncel', 'Güncel'],
  [R + 'ehir ' + R + R + 'i', 'Şehir İçi'],
  ['a' + R + R + 'm', 'aşım'],
  ['G' + R + 'n', 'Gün'],
  [R + 'zeri', 'üzeri'],
  ['Alkoll' + R, 'Alkollü'],
  ['Ara' + R, 'Araç'],
  [R + 'st' + R, 'Üstü'],
  ['Sonras' + R, 'Sonrası'],
  ['Y' + R + 'l', 'Yıl'],
  ['Uyu' + R + 'turucu', 'Uyuşturucu'],
  [R + 'ptali', 'İptali'],
  ['ZORBALI' + R + 'I', 'ZORBALIĞI'],
  ['Sald' + R + 'rgan', 'Saldırgan'],
  ['S' + R + 'r' + R + R, 'Sürüş'],
  ['Israrl' + R, 'Israrlı'],
  [R + 'htar' + R + 'na', 'İhtarına'],
  ['Ka' + R + 'ma', 'Kaçma'],
  ['Soru' + R + 'turma', 'Soruşturma'],
  ['Plakas' + R + 'n' + R, 'Plakasını'],
  [R + 'ptal', 'İptal'],
  ['G' + R + 'VENL' + R + 'K', 'GÜVENLİK'],
  ['K' + R + 'rm' + R + 'z' + R + ' I' + R + R + 'k', 'Kırmızı Işık'],
  [R + 'eridi', 'şeridi'],
  [R + 'hlali', 'İhlali'],
  ['Puan' + R, 'Puanı'],
  ['Y' + R + 'nde', 'Yönde'],
  [R + 'ocuk', 'Çocuk'],
  ['Koltuu', 'Koltuğu'],
  ['S' + R + 'GORTA', 'SİGORTA'],
  ['Sigortasz', 'Sigortasız'],
  ['Trafi' + R + 'e ' + R + R + 'kma', 'Trafiğe Çıkma'],
  [R + 'gal', 'işgal'],
  ['Hatal' + R, 'Hatalı'],
  ['T' + R + 'CAR' + R, 'TİCARİ'],
  ['M' + R + 'dahalesi', 'Müdahalesi'],
  ['Men', 'Men'],
  [R + 'hlal', 'İhlal'],
  ['T' + R + 'r' + R, 'Türü'],
  ['Tutar' + R, 'Tutarı']
]);

fixFile('app/moderator/page.tsx', [
  ['başlıÃ„şında', 'başlığında'],
  ['gönderildi', 'gönderildi'],
  ['kullanıcısı uyarıldı', 'kullanıcısı uyarıldı'],
  ['🛠️¡ïÂ¸Â', '🛠️'],
  ['Son giriŞ', 'Son giriş']
]);

fixFile('app/page.tsx', [
  ['başlıÃ„şı', 'başlığı']
]);

fixFile('app/pazar/page.tsx', [
  ['←' + R, '←']
]);

fixFile('app/uzmana-sor/page.tsx', [
  ['âš' + R + 'ï¸' + R, '⚠️'],
  ['ðŸ‘' + R, '👁️'],
  ['â­' + R, '⭐']
]);

fixFile('components/ExpertComponents.tsx', [
  ['←' + R, '←'],
  ['🛠️' + R + 'ïÂ¸Â' + R, '🛠️']
]);

fixFile('components/Footer.tsx', [
  ['Ã°Â•Â', '𝕏'],
  ['▶️' + R, '▶️']
]);

fixFile('components/guvenmetre/RatingDialog.tsx', [
  ['👍' + R, '👍'],
  ['🤔' + R, '🤔']
]);

fixFile('data/dictionary.ts', [
  ['özel s', 'özel sıvı']
]);

fixFile('data/moderators.ts', [
  ['ðŸ›¡ï¸' + R, '🛡️'],
  ['İçerik Moderasyonu', 'İçerik Moderasyonu'],
]);
