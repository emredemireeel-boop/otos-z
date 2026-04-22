const fs = require('fs');

// Verify key files have proper Turkish characters
const checks = [
  { file: 'components/Navbar.tsx', search: ['Beğeni aldınız', 'Uzman Sürücü'] },
  { file: 'components/admin/AdminSidebar.tsx', search: ['Moderatörler', 'YÖNETİM PANELİ', 'Çevrimiçi'] },
  { file: 'components/moderator/ModeratorSidebar.tsx', search: ['Şikayet Kuyruğu', 'MODERATÖR'] },
  { file: 'app/admin/kullanicilar/page.tsx', search: ['Kalıcı Ban', 'Kullanıcılar yüklenemedi'] },
  { file: 'data/moderators.ts', search: ['Şikayet Kuyruğu', 'Güvenmetre Onayı'] },
];

let allGood = true;
for (const check of checks) {
  if (!fs.existsSync(check.file)) { console.log('MISSING:', check.file); continue; }
  const content = fs.readFileSync(check.file, 'utf8');
  for (const term of check.search) {
    const found = content.includes(term);
    if (!found) {
      console.log('MISSING "' + term + '" in ' + check.file);
      allGood = false;
    }
  }
  if (allGood) console.log('OK: ' + check.file);
}

if (allGood) {
  console.log('\nAll checks passed! Turkish characters are correct.');
} else {
  console.log('\nSome checks failed.');
}

// Also check for remaining bad double-encoding patterns
const testFiles = ['components/Navbar.tsx', 'app/admin/moderatorler/page.tsx'];
for (const f of testFiles) {
  const c = fs.readFileSync(f, 'utf8');
  const hasDouble = /Ã[\x80-\xBF]|Ã[öüçÖÜÇ]/.test(c) || c.includes('ö') || c.includes('ü') || c.includes('ç');
  console.log((hasDouble ? 'STILL HAS DOUBLE-ENCODE' : 'CLEAN') + ': ' + f);
}
