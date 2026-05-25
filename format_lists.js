const fs = require('fs');

const path = './public/data/library_guides.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const guide = data.guides.find(g => g.id === "guide_nasil_galerici_olunur");

if (guide) {
  const step18 = guide.sections.find(s => s.title && s.title.includes('Adım 18'));
  if (step18) {
    const sub = step18.subsections.find(s => s.subtitle === 'Güvenli Ödeme İşlem Adımları');
    if (sub) {
      sub.text = "";
      sub.points = [
        "**1. Satıcı Veri Girişi:** Oto galeri yetkilisi, Noterler Birliği ile entegre çalışan bankasının veya ödeme kuruluşunun dijital sistemine giriş yapar. Sisteme; satılacak aracın plakası, şasi numarası, alıcının T.C. Kimlik veya Vergi Numarası ve üzerinde anlaşılan satış bedeli kuruşu kuruşuna kaydedilir.",
        "**2. Referans Numarası Üretimi:** Sistem, bu işlem için benzersiz bir referans (güvenlik) numarası üretir ve bu kodu alıcının cep telefonuna SMS veya e-posta yoluyla otomatik olarak iletir.",
        "**3. Alıcı Onayı ve Bloke İşlemi:** Alıcı, kendi bankasının mobil uygulaması üzerinden 'Güvenli Ödeme' sekmesine girerek bu referans numarasını tuşlar. Ekranda beliren satıcı, araç ve tutar bilgilerini onayladıktan sonra, taşıt bedelini sistemin yönlendirdiği özel bir takas (havuz) hesabına transfer eder. Para, ne alıcının kullanımındadır ne de henüz satıcıya geçmiştir; devlet güvencesiyle Araf'ta (havuzda) bloke edilir.",
        "**4. Tescil ve Otomatik Para Transferi:** Taraflar noter huzurunda buluşur ve satış sözleşmesine imzalar atılır. Noterlik sistemi üzerinden aracın ruhsat tescili alıcı üzerine geçtiği saniye, sistemler arası API entegrasyonu tetiklenir ve havuzda bloke bekleyen taşıt bedeli saliseler içerisinde otomatik olarak satıcı galerinin banka hesabına aktarılır. Bu sayede, hem taraflar arası yüzde yüz güven tesis edilmiş olur, hem de tüm araç satış bedelleri bankacılık sistemi üzerinden geçtiği için kayıt dışı para transferleri ve kara para aklama girişimleri engellenmiş, tam vergi şeffaflığı sağlanmış olur."
      ];
    }
  }

  // Also fix Step 17 guarantee parts list
  const step17 = guide.sections.find(s => s.title && s.title.includes('Adım 17'));
  if (step17) {
    const sub = step17.subsections.find(s => s.subtitle === 'Yasal Garanti Yükümlülüğü ve Kapsamı');
    if (sub && sub.text.includes('- Motor')) {
       // split the text before the list and the rest
       const parts = sub.text.split('İkinci el araç garanti kapsamına giren kritik parçalar şunlardır:');
       if (parts.length > 1) {
          sub.text = parts[0] + "İkinci el araç garanti kapsamına giren kritik parçalar şunlardır:";
          sub.points = [
             "Motor (Motor bloğu, pistonlar, silindir kapağı).",
             "Şanzıman (Vites kutusu dişlileri, mekatronik ünite).",
             "Tork Konvertörü.",
             "Diferansiyel ve aktarma organları.",
             "Aracın genel elektrik sistemi."
          ];
          
          const afterListStr = parts[1].split('Aracın genel elektrik sistemi.')[1];
          // We can't have text after points in this schema unless we create another subsection.
          // Let's create another subsection for the text after the list.
          if (afterListStr) {
             step17.subsections.push({
               subtitle: "Yasal Garanti Sonrası Sorumluluklar",
               text: afterListStr.trim()
             });
          }
       }
    }
  }

  fs.writeFileSync(path, JSON.stringify(data, null, 2));
  console.log('Fixed lists!');
}
