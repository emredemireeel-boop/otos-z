const fs = require('fs');
const R = '\uFFFD';

function fix(filepath, replacements) {
  let c = fs.readFileSync(filepath, 'utf8');
  const orig = c;
  for (const [bad, good] of replacements) {
    c = c.split(bad).join(good);
  }
  if (c !== orig) {
    fs.writeFileSync(filepath, c, 'utf8');
    const remaining = c.split('\n').filter(l => l.includes(R));
    console.log((remaining.length === 0 ? '✅' : '⚠️ (' + remaining.length + ' kaldı)') + ' ' + filepath);
    if (remaining.length > 0) remaining.forEach(l => console.log('   >> ' + l.trim().substring(0, 80)));
  } else {
    console.log('(değişmedi) ' + filepath);
  }
}

// ── AdminSidebar ─────────────────────────────────────────────────────────────
fix('components/admin/AdminSidebar.tsx', [
  ['S' + R + 'zl' + R + 'k Moderasyonu', 'Sözlük Moderasyonu'],
  [R + 'ikayet Kuyru' + R + 'u', 'Şikayet Kuyruğu'],
  ['Pazar Kontrol' + R, 'Pazar Kontrolü'],
  ['G' + R + 'venmetre Onay' + R, 'Güvenmetre Onayı'],
  ['Y' + R + 'NET' + R + 'M PANEL' + R, 'YÖNETİM PANELİ'],
  ['Y' + R + 'NET' + R + 'M', 'YÖNETİM'],
  [R + '\u0130\u00e7erik', '\u0130\u00e7erik'],
  [R + 'i\u0307\u00e7erik', '\u0130\u00e7erik'],
  ['Sistem Loglar' + R, 'Sistem Logları'],
  ['Sistem Ayarlar' + R, 'Sistem Ayarları'],
  ['Ana Siteye D' + R + 'n', 'Ana Siteye Dön'],
  ['? ' + R + 'evrimi' + R + 'i', '🟢 Çevrimiçi'],
  [R + 'evrimi' + R + 'i', 'Çevrimiçi'],
  // Remaining
  ['Kelime Filtresi', 'Kelime Filtresi'],
]);

// ── ModeratorSidebar ──────────────────────────────────────────────────────────
fix('components/moderator/ModeratorSidebar.tsx', [
  ['rapor_kuyru' + R + 'u', 'rapor_kuyrugu'],
  [R + '\u0130\u00e7erik Moderasyonu', '\u0130\u00e7erik Moderasyonu'],
  ['Pazar Kontrol' + R, 'Pazar Kontrolü'],
  ['G' + R + 'venmetre Onay' + R, 'Güvenmetre Onayı'],
  ['Sistem Loglar' + R, 'Sistem Logları'],
  ['Toplu Yay' + R + 'n', 'Toplu Yayın'],
  ['MODERAT' + R + 'R', 'MODERATÖR'],
  ['Moderat' + R + 'r bilgisi', 'Moderatör bilgisi'],
  ['"Moderat' + R + 'r"', '"Moderatör"'],
  ['Moderat' + R + 'r', 'Moderatör'],
  ['YETK' + R + 'S' + R + 'Z', 'YETKİSİZ'],
  ['Alt k' + R + 's' + R + 'm', 'Alt kısım'],
  ['Ana Siteye D' + R + 'n', 'Ana Siteye Dön'],
  ['yetki aktif', 'yetki aktif'],
]);

// ── app/giris/page.tsx ────────────────────────────────────────────────────────
const girisLines = fs.readFileSync('app/giris/page.tsx', 'utf8').split('\n');
girisLines.forEach((l, i) => { if (l.includes(R)) console.log('GIRIS ' + (i + 1) + ': ' + l.trim().substring(0, 100)); });

// ── app/kayit/page.tsx ────────────────────────────────────────────────────────
const kayitLines = fs.readFileSync('app/kayit/page.tsx', 'utf8').split('\n');
kayitLines.forEach((l, i) => { if (l.includes(R)) console.log('KAYIT ' + (i + 1) + ': ' + l.trim().substring(0, 100)); });
