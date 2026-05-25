const fs = require('fs');

const path = './public/data/library_guides.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const guide = data.guides.find(g => g.id === "guide_nasil_galerici_olunur");

if (guide) {
  const step10Section = guide.sections.find(s => s.title && s.title.includes("Adım 10: Satış Sonrası"));
  
  if (step10Section) {
    step10Section.content = "Eski usül 'kaldırım galericiliğinde' yazılı olmayan kural şuydu: 'Araba noterden çıkar, galerici müşteriyi tamamen unutur, telefonu açmaz.' Ancak modern ticarette bu yaklaşım, kendi topuğunuza sıkmaktan farksızdır.\n\nGerçek servet, bir müşteriye tek bir araba satıp 50 bin TL kazanmaktan değil; o müşterinin güvenini kazanıp onun kardeşine, babasına, komşusuna ve ofis arkadaşlarına da yıllar içinde onlarca araba satabilmekten (sadakat ağından) gelir. Satış sonrası (after-sales) sunduğunuz destek ve şeffaflık, Google reklamlarına veya billboardlara harcayacağınız milyonlarca liradan çok daha etkili, organik ve kalıcı bir pazarlama stratejisidir.";
    
    step10Section.subsections = [
      {
        "subtitle": "1. İlk 72 Saat Kuralı ve Proaktif İletişim Şoku",
        "text": "Noterde imzalar atılıp aracı teslim ettikten sonra müşteriyle iletişimi keserseniz, sıradan bir tüccar olursunuz. Fark yaratmanın altın kuralı 'İlk 72 Saat' kuralıdır. Aracı teslim ettikten tam 2 gün sonra (ne erken, ne geç) müşterinizi telefonla bizzat arayın:\n\n'Ahmet Bey, yeni aracınız tekrardan hayırlı olsun, ailenizle iyi günlerde kullanın. Multimedya sisteminin kullanımı, vites geçişleri veya araçla ilgili sormak istediğiniz herhangi bir şey var mı? Biz her zaman buradayız.'\n\nÇoğu müşteri, parayı aldıktan sonra kendisini hal hatır sormak için arayan bir galericiyi hayatı boyunca görmemiştir. Bu 30 saniyelik basit telefon görüşmesi, müşterinin bilinçaltında 'Bu adam sattığı malın sonuna kadar arkasında duruyor' hissini çelik gibi sağlamlaştırır."
      },
      {
        "subtitle": "2. Kriz Anında Sorumluluk Almak (Zararı Satın Almak)",
        "text": "Sattığınız araç ikinci el bir makinedir ve doğası gereği 2 gün sonra bile mekanik bir arıza verebilir. Müşteri arabayı aldıktan 2 hafta sonra 'Abi şanzıman vuruntu yapıyor, yolda kaldım' diye sizi panikle aradığında telefonu meşgule atmayın veya 'İkinci el araba aldın, garantisi yok, bana ne' demeyin!\n\nEğer böyle derseniz o müşteri sizi çevresindeki en az 50 kişiye kötüler ve bölgenizdeki itibarınızı zehirler. Bunun yerine profesyonel davranın: Çekiciyi hemen dükkanın cebinden yollayın, aracı anlaşmalı olduğunuz iyi bir ustaya çektirin ve masrafın örneğin yarısını veya işçiliğini cebinizden karşılayın (Zararı Satın Almak). Kasanızdan çıkacak o 10.000 TL'lik masraf, o mutlu müşterinin sırf bu dürüstlüğünüz yüzünden size ileride getireceği 3 yeni garantili müşterinin devasa kârının yanında bir hiçtir."
      },
      {
        "subtitle": "3. CRM Mantığı, Yıllık Hatırlatmalar ve VİP (Sadakat) Hizmetleri",
        "text": "Ticaret ağınızı büyütmek istiyorsanız her bir müşterinizin satış kaydını (telefon, doğum tarihi, aracın markası, muayene bitiş tarihi) mutlaka dijital bir ortamda (basit bir Excel veya CRM yazılımı) tutmalısınız.\n\nSattığınız aracın TÜVTÜRK muayene tarihi veya 10.000 km periyodik yağ bakım tarihi yaklaştığında müşterinize kurumsal bir mesaj atın: 'Mehmet Bey, aracınızın yıllık bakım dönemi yaklaşmıştır. Dilerseniz anlaşmalı olduğumuz Bosch Car Service'den sizin adınıza %20 iskontolu randevu oluşturabiliriz.' Bu tarz ince, şaşırtıcı ve VİP dokunuşlar, o müşteri 2 yıl sonra arabasını satmak veya model yükseltmek istediğinde; başka hiçbir galeriye veya sarı siteye bakmadan anahtarı doğrudan sizin masanıza bırakmasını kesin olarak garanti altına alır."
      }
    ];

    step10Section.tip = {
      title: "Mutlu Müşteri Portföyü (Referans Duvarı)",
      text: "Satış sonrasında araç teslimi yaparken müşterilerinizden izin isteyerek onlarla aracın önünde şık fotoğraflar çekilin. Bu fotoğrafları (yüzleri çok açık etmeden) sosyal medyanızda 'Mutlu Teslimatlarımız' serisi olarak paylaşın. İnsanlar, başkalarının da sizden güvenle araç aldığını gördükçe size karşı olan önyargılarını çok daha hızlı yıkacaktır."
    };

    fs.writeFileSync(path, JSON.stringify(data, null, 2));
    console.log('Successfully updated Step 10!');
  } else {
    console.log('Step 10 not found!');
  }
} else {
  console.log('Guide not found!');
}
