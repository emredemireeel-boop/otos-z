const fs = require('fs');
const data = JSON.parse(fs.readFileSync('./public/data/library_guides.json', 'utf8'));
const guide = data.guides.find(g => g.id === 'guide_nasil_galerici_olunur');
const step16 = guide.sections.find(s => s.title && s.title.includes('Adım 16'));
step16.subsections.unshift({
  subtitle: 'Asgari Kurulum Maliyetleri Analizi (2026 Projeksiyonu)',
  text: 'Bu maliyetin sadece küçük bir kısmı bürokratik giderlerden oluşurken, aslan payı fiziki mekan ve başlangıç envanterinin (stok araçların) oluşturulmasına aittir. Minimum gereksinimler doğrultusunda çıkarılmış ortalama maliyet tablosu şu şekildedir:\n\n[TABLO_BURADA]\n\nBu 1.677.500 TL\'lik tutar, işletmenin hayatta kalabilmesi için gerekli olan "oksijen seviyesi"dir. İşletme rotasını lüks segment SUV\'lara veya premium Alman markalarına çevirdiğinde, sadece envanter maliyeti 10-15 Milyon TL seviyelerine kolaylıkla tırmanacaktır.'
});
fs.writeFileSync('./public/data/library_guides.json', JSON.stringify(data, null, 2));
console.log('Step 16 fixed!');
