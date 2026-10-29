const fs = require('fs');
const path = './public/data/library_guides.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const guide = data.guides.find(g => g.id === "guide_nasil_galerici_olunur");

if (guide) {
  const step16 = guide.sections.find(s => s.title && s.title.includes('Adım 16'));
  if (step16) {
    const sub = step16.subsections.find(s => s.subtitle.includes('Asgari Kurulum Maliyetleri'));
    if (sub) {
      sub.text = 'Bu maliyetin sadece küçük bir kısmı bürokratik giderlerden oluşurken, aslan payı fiziki mekan ve başlangıç envanterinin (stok araçların) oluşturulmasına aittir. Bu **1.677.500 TL**\'lik tutar, işletmenin hayatta kalabilmesi için gerekli olan "oksijen seviyesi"dir. İşletme rotasını lüks segment SUV\'lara veya premium Alman markalarına çevirdiğinde, sadece envanter maliyeti 10-15 Milyon TL seviyelerine kolaylıkla tırmanacaktır. Ortalama maliyet analiz tablosu aşağıda sunulmuştur:';
      
      // Re-apply the HTML conversion for the bold text we just added
      sub.text = sub.text.replace(/\*\*(.*?)\*\*/g, '<strong style="color: var(--foreground);">$1</strong>');
    }
  }

  fs.writeFileSync(path, JSON.stringify(data, null, 2));
  console.log('Fixed [TABLO_BURADA] and cleaned text in Step 16!');
}
