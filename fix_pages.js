const fs = require('fs');
const R = '\uFFFD';

function fix(filepath, pairs) {
  let c = fs.readFileSync(filepath, 'utf8');
  const orig = c;
  for (const [bad, good] of pairs) c = c.split(bad).join(good);
  if (c !== orig) {
    fs.writeFileSync(filepath, c, 'utf8');
    const left = c.split('\n').filter(l => l.includes(R));
    console.log((left.length === 0 ? '✅' : '⚠️ (' + left.length + ' kaldı)') + ' ' + filepath);
    left.forEach(l => console.log('   >> ' + l.trim().substring(0, 90)));
  }
}

// ── app/giris/page.tsx ────────────────────────────────────────────────────────
fix('app/giris/page.tsx', [
  ['ba' + R + 'ar' + R + 's' + R + 'z', 'başarısız'],
  ['T' + R + 'rkiye', 'Türkiye'],
  ['b' + R + 'y' + R + 'k', 'büyük'],
  ['toplulu' + R + 'una', 'topluluğuna'],
  ['kat' + R + 'l' + R + 'n', 'katılın'],
  ['g' + R + 'r' + R + R + 'leri', 'görüşleri'],
  ['s' + R + 'r' + R + 'c' + R + 'yle', 'sürücüyle'],
  ['tan' + R + R + R + 'n', 'tanışın'],
  ['Aktif ' + R + 'ye', 'Aktif Üye'],
  ['Anl' + R + 'k', 'Anlık'],
  ['G' + R + 'ncel', 'Güncel'],
  ['G' + R + 'ven Metre' + R, 'Güven Metresi'],
  ['Do' + R + 'rulanm' + R + R + ' ilanlar', 'Doğrulanmış ilanlar'],
  ['Hesab' + R + 'n' + R + 'za', 'Hesabınıza'],
  ['Kullan' + R + 'c' + R + ' Ad' + R, 'Kullanıcı Adı'],
  ['ad' + R + 'n' + R + 'z' + R + ' girin', 'adınızı girin'],
  [R + R + R + R + R + R + R + R, '••••••••'],
  ['Beni hat' + R + 'rla', 'Beni hatırla'],
  ['yap' + R + 'l' + R + 'yor', 'yapılıyor'],
  ['Hesab' + R + 'n' + R + 'z yok mu', 'Hesabınız yok mu'],
  [R + 'cretsiz kay' + R + 't olun', 'Ücretsiz kayıt olun'],
  ['SSL Korumal' + R, 'SSL Korumalı'],
  ['ba' + R + 'ar' + R + 's' + R, 'başarısı'],
  // Remaining patterns
  ['Bulu' + R + 'ma Noktas' + R, 'Buluşma Noktası'],
  ['Tutkunlar' + R + 'n' + R + 'n', 'Tutkunlarının'],
]);

// ── app/kayit/page.tsx ────────────────────────────────────────────────────────
fix('app/kayit/page.tsx', [
  ['ba' + R + 'ar' + R + 'yla olu' + R + 'turuldu', 'başarıyla oluşturuldu'],
  [R + 'imdi toplulu' + R + 'umuza kat' + R + 'l' + R + 'n', 'Şimdi topluluğumuza katılın'],
  [R + 'cretsiz Kay' + R + 't', 'Ücretsiz Kayıt'],
  ['Toplulu' + R + 'a', 'Topluluğa'],
  ['Kat' + R + 'l' + R + 'n', 'Katılın'],
  ['Fark Yarat' + R + 'n', 'Fark Yaratın'],
  ['tahminlerce', 'tahminen'],
  ['tutkunu taraf' + R + 'ndan', 'tutkunu tarafından'],
  ['g' + R + 'venilen', 'güvenilen'],
  [R + 'cretsiz kat' + R + 'l' + R + 'n', 'Ücretsiz katılın'],
  ['arac' + R + 'm' + R + ' ald' + R + 'm', 'aracımı aldım'],
  ['G' + R + 'ven Metre harika', 'Güven Metre harika'],
  ['deste' + R + 'i inan' + R + 'lmaz', 'desteği inanılmaz'],
  ['an' + R + 'nda cevap', 'anında cevap'],
  ['ki' + R + 'i bug' + R + 'n kat' + R + 'ld' + R, 'kişi bugün katıldı'],
  ['Hesap Olu' + R + 'tur', 'Hesap Oluştur'],
  ['Bilgilerinizi girerek ba' + R + 'lay' + R + 'n', 'Bilgilerinizi girerek başlayın'],
  ['Hesab' + R + 'n' + R + 'z' + R + ' g' + R + 'venli', 'Hesabınızı güvenli'],
  ['Kullan' + R + 'c' + R + ' Ad' + R, 'Kullanıcı Adı'],
  ['k' + R + R + R + 'k harf', 'küçük harf'],
  [R + 'ifre G' + R + 'c' + R, 'Şifre Gücü'],
  ['tekrarlay' + R + 'n', 'tekrarlayın'],
  [R + 'ifrelere e' + R + 'le' + R + 'miyor', 'Şifreler eşleşmiyor'],
  [R + 'ifreler e' + R + 'le' + R + 'iyor', 'Şifreler eşleşiyor'],
  ['e' + R + 'le' + R + 'miyor', 'eşleşmiyor'],
  ['e' + R + 'le' + R + 'iyor', 'eşleşiyor'],
  ['Kullan' + R + 'm ' + R + 'artlar' + R + 'n' + R, 'Kullanım Şartlarını'],
  ['Gizlilik Politikas' + R + 'n' + R, 'Gizlilik Politikasını'],
  ['Hesap olu' + R + 'turuluyor', 'Hesap oluşturuluyor'],
  ['Ay' + R + 'e Y', 'Ayşe Y'],
  ['Hesab' + R + 'n' + R + 'z var m' + R, 'Hesabınız var mı'],
  ['Giri' + R + ' yap' + R + 'n', 'Giriş yapın'],
]);

// ── AdminSidebar remaining ────────────────────────────────────────────────────
fix('components/admin/AdminSidebar.tsx', [
  [R + R + R + '\u200b', ''],  // zero-width chars
  ['Siteye D' + R + 'n', 'Siteye Dön'],
]);

// ── ModeratorSidebar remaining ────────────────────────────────────────────────
fix('components/moderator/ModeratorSidebar.tsx', [
  ['aktif', 'aktif'],
  ['kuyru' + R + 'u', 'kuyruğu'],
  ['k' + R + 's' + R + 'm', 'kısım'],
]);
