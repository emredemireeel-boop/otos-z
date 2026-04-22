const fs = require('fs');

// Direct line-by-line fix for Navbar.tsx and other files with known broken text
// \uFFFD is the Unicode replacement character that shows as ? in browser

function fixFile(filepath, fixes) {
  let content = fs.readFileSync(filepath, 'utf8');
  const original = content;
  for (const [bad, good] of fixes) {
    content = content.split(bad).join(good);
  }
  if (content !== original) {
    fs.writeFileSync(filepath, content, 'utf8');
    console.log('✓ Fixed: ' + filepath);
  }
}

const R = '\uFFFD'; // replacement char

// ── Navbar.tsx ────────────────────────────────────────────────────────────────
fixFile('components/Navbar.tsx', [
  // Notification titles/messages
  [`Be${R}eni ald${R}n${R}z`, 'Beğeni aldınız'],
  [`yorumunuzu be${R}endi`, 'yorumunuzu beğendi'],
  [`Yeni yan${R}t`, 'Yeni yanıt'],
  [`yorumunuza yan${R}t verdi`, 'yorumunuza yanıt verdi'],
  [`Yeni takip${R}i`, 'Yeni takipçi'],
  [`takip etmeye ba${R}lad${R}`, 'takip etmeye başladı'],
  [`Uzman S${R}r${R}c${R}`, 'Uzman Sürücü'],
  [`rozetini kazand${R}n${R}z`, 'rozetini kazandınız'],
  [`Ho${R} geldiniz!`, 'Hoş geldiniz!'],
  [`toplulu${R}una kat${R}ld${R}n${R}z`, 'topluluğuna katıldınız'],
  // Messages
  [`hakk${R}nda ne d${R}${R}${R}n${R}yorsun?`, 'hakkında ne düşünüyorsun?'],
  [`Yar${R}n g${R}r${R}${R}ebiliriz mi?`, 'Yarın görüşebiliriz mi?'],
  [`sonu${R}lar${R} ${R}ok ilgin${R}`, 'sonuçları çok ilginç'],
  [`Bilgi i${R}in te${R}ekk${R}rler!`, 'Bilgi için teşekkürler!'],
  // Time
  [`1 g${R}n`, '1 gün'],
  // Nav links
  [`KAR${R}ILA${R}TIRMA`, 'KARŞILAŞTIRMA'],
  [`ARA${R} DNA`, 'ARAÇ DNA'],
  [`K${R}T${R}PHANE`, 'KÜTÜPHANE'],
  [`ETK${R}NL${R}KLER`, 'ETKİNLİKLER'],
  [`G${R}VENMETRE`, 'GÜVENMETRE'],
  [`P${R}YASALAR`, 'PİYASALAR'],
  // Buttons
  [`PREM${R}UM`, 'PREMİUM'],
  [`G${R}R${R}${R}`, 'GİRİŞ'],
  // Dropdown
  [`T${R}m${R}n${R} G${R}r`, 'Tümünü Gör'],
  [`T${R}m${R}n${R} okundu i${R}aretle`, 'Tümünü okundu işaretle'],
  // Logout
  [`${R}${R}k${R}${R} Yap`, 'Çıkış Yap'],
  [`${R}k${R}${R} Yap`, 'Çıkış Yap'],
]);

// ── AdminSidebar.tsx ──────────────────────────────────────────────────────────
fixFile('components/admin/AdminSidebar.tsx', [
  [`${R}statistikler`, 'İstatistikler'],
  [`${R}statistik`, 'İstatistik'],
  [`Kullan${R}c${R}lar`, 'Kullanıcılar'],
  [`Kullan${R}c${R}`, 'Kullanıcı'],
  [`${R}erik Y${R}netimi`, 'İçerik Yönetimi'],
  [`${R}erik`, 'İçerik'],
  [`Y${R}netim`, 'Yönetim'],
  [`Moderasyon`, 'Moderasyon'],
  [`Reklam${R}`, 'Reklamı'],
  [`Raporlar`, 'Raporlar'],
  [`Ayarlar`, 'Ayarlar'],
  [`${R}statistik`, 'İstatistik'],
  [`${R}deme`, 'Ödeme'],
  [`${R}neri`, 'Öneri'],
  [`G${R}venlik`, 'Güvenlik'],
  [`ba${R}ar${R}`, 'başarı'],
]);

// ── ModeratorSidebar.tsx ──────────────────────────────────────────────────────
fixFile('components/moderator/ModeratorSidebar.tsx', [
  [`${R}${R}k${R}${R} Yap`, 'Çıkış Yap'],
  [`${R}k${R}${R} Yap`, 'Çıkış Yap'],
  [`Kullan${R}c${R}`, 'Kullanıcı'],
  [`Raporlar`, 'Raporlar'],
  [`${R}erik`, 'İçerik'],
  [`Moderasyon`, 'Moderasyon'],
]);

// ── app/giris/page.tsx ────────────────────────────────────────────────────────
fixFile('app/giris/page.tsx', [
  [`${R}ifre`, 'Şifre'],
  [`${R}ifremi`, 'Şifremi'],
  [`${R}ifreni`, 'Şifreni'],
  [`${R}ifreyi`, 'Şifreyi'],
  [`${R}ifrenizi`, 'Şifrenizi'],
  [`Ho${R} geldin`, 'Hoş geldin'],
  [`Giri${R}`, 'Giriş'],
  [`giri${R}`, 'giriş'],
  [`Kay${R}t`, 'Kayıt'],
  [`kay${R}t`, 'kayıt'],
  [`${R}ahs${R}`, 'şahsı'],
  [`hesab${R}n${R}z`, 'hesabınız'],
  [`${R}aretleyin`, 'işaretleyin'],
  [`${R}ifreniz`, 'Şifreniz'],
  [`Kullan${R}c${R}`, 'Kullanıcı'],
  [`kullan${R}c${R}`, 'kullanıcı'],
  [`${R}statistik`, 'İstatistik'],
  [`ba${R}ar${R}`, 'başarı'],
  [`Devam et`, 'Devam et'],
  [`${R}nceki`, 'Önceki'],
  [`${R}nce`, 'Önce'],
]);

// ── app/kayit/page.tsx ────────────────────────────────────────────────────────
fixFile('app/kayit/page.tsx', [
  [`${R}ifre`, 'Şifre'],
  [`${R}ifremi`, 'Şifremi'],
  [`Kay${R}t`, 'Kayıt'],
  [`kay${R}t`, 'kayıt'],
  [`Kullan${R}c${R}`, 'Kullanıcı'],
  [`kullan${R}c${R}`, 'kullanıcı'],
  [`Ho${R}`, 'Hoş'],
  [`Giri${R}`, 'Giriş'],
  [`giri${R}`, 'giriş'],
  [`${R}statistik`, 'İstatistik'],
  [`ba${R}ar${R}`, 'başarı'],
]);

console.log('\nDone! Please refresh the browser.');
