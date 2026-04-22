const fs = require('fs');
const R = '\uFFFD';

function fix(filepath, pairs) {
  if (!fs.existsSync(filepath)) return;
  let c = fs.readFileSync(filepath, 'utf8');
  const orig = c;
  for (const [bad, good] of pairs) {
    c = c.split(bad).join(good);
  }
  if (c !== orig) {
    fs.writeFileSync(filepath, c, 'utf8');
    console.log('✅ Fixed: ' + filepath);
  }
}

fix('app/giris/page.tsx', [
  ['başarıs' + R + 'z', 'başarısız'],
  ['Canl' + R + ' topluluk', 'Canlı topluluk'],
  ['Kullanıcı Ad' + R, 'Kullanıcı Adı'],
  [R + 'cretsiz', 'Ücretsiz'],
]);

fix('app/kayit/page.tsx', [
  ['Hesab' + R + 'n' + R + 'z', 'Hesabınız'],
  ['olu' + R + 'turuldu', 'oluşturuldu'],
  [R + 'cretsiz', 'Ücretsiz'],
  ['G' + R + 'venlik', 'Güvenlik'],
  ['Kullanıcı Ad' + R, 'Kullanıcı Adı'],
  ['alt ' + R + 'izgi', 'alt çizgi'],
  ['Geri d' + R + 'n', 'Geri dön'],
  ['G' + R + 'c' + R, 'Gücü'],
  ['var m' + R, 'var mı'],
  ['yap' + R + 'n', 'yapın'],
]);

fix('components/admin/AdminSidebar.tsx', [
  ['?' + R + R + R, '🟢'] // usually a status dot
]);

fix('components/moderator/ModeratorSidebar.tsx', [
  ['?' + R + R + R + R + '?', '👤'], // avatar placeholder
  ['?' + R + R + R, '🔴'], // status dot
]);

console.log('Pass 1 done. Checking for any remaining replacement characters in components and app...');

function checkRemaining(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.next'].includes(entry.name)) continue;
    const fullPath = dir + '/' + entry.name;
    if (entry.isDirectory()) {
      checkRemaining(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split('\n');
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes(R)) {
          console.log(`⚠️ Remaining in ${fullPath}:${i + 1} -> ${lines[i].trim().substring(0, 80)}`);
        }
      }
    }
  }
}

checkRemaining('app');
checkRemaining('components');
checkRemaining('data');
