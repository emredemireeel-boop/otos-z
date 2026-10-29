const fs = require('fs');

const path = './public/data/library_guides.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const guide = data.guides.find(g => g.id === "guide_nasil_galerici_olunur");

if (guide) {
  const section = guide.sections.find(s => s.title.includes("Adım 1: Psikolojik Hazırlık"));
  if (section) {
    section.content = "Bir araca aşık olabilirsiniz, küçüklüğünüzden beri hayalini kurduğunuz o markayı sürmek için yanıp tutuşabilirsiniz, ancak ticarette 'duygulara' yer yoktur. Eğer galerinizdeki bir arabayı kendinize aitmiş gibi benimser ve onunla duygusal bir bağ kurarsanız, satma vakti geldiğinde gerçekçi bir fiyat koyamazsınız veya satmak istemezsiniz; bu da paranın dönüşünü (sirkülasyonu) durdurur. İkinci el otomobil ticareti vahşi bir ormandır ve bu ormanda hayatta kalmak istiyorsanız, kapıdan içeri giren her araca bir metal yığını ve potansiyel bir kar marjı olarak bakmalısınız. Ticaret zekası dediğimiz şey; piyasanın o anki ateşini ölçebilmek, panik satışlarında arabayı dipten toplamak ve herkes arabaya saldırırken zirveden satıp nakde geçebilmektir.";
    
    section.subsections = [
      {
        "subtitle": "Duygusal Bağ Kurmamak",
        "text": "Galericilikteki ilk altın kural şudur: Sattığınız hiçbir araç sizin şahsi aracınız değildir, hepsi sadece birer 'ticari metadır'. Çoğu hevesli galerici, kendi beğendiği ve zevkine uygun, özel renkli veya çok dolu donanımlı (fakat piyasası yavaş) araçları alır. Ancak sizin çok sevdiğiniz o elektrik kırmızısı, 3.0 motor coupe araç, piyasada alıcı bulamayan niş bir model olabilir. Piyasada ne hızlı dönüyorsa, beyaz renkli sıradan, manuel vitesli, kapak jantlı bir sedan dahi olsa onu almalısınız. Arabayı alırken 'Bunu ben hafta sonu binerim, eşim dostum görür' diye düşünüyorsanız, zaten o ticarete 1-0 yenik başlamışsınız demektir. Sizin göreviniz o metal yığınını en hızlı şekilde nakde çevirmektir. Duygusal zayıflık gösterip araca bağlanırsanız, müşterinin yaptığı makul bir fiyat kırma teklifini gurur meselesi yapar, ticareti kilitler ve paranızı o araca aylarca hapsedersiniz.",
        "points": [
          "Galerinizdeki arabalar oyuncak değil, banknottur. Onlara obje gözüyle bakın.",
          "Özel zevklerinizle piyasa gerçeklerini birbirine karıştırmayın.",
          "Müşterinin arabayı eleştirmesini (çizik var, boya solmuş) kişisel algılamayın; bu sadece bir pazarlık argümanıdır."
        ]
      },
      {
        "subtitle": "Kurtlar Sofrasına Girmek ve Yalan Dedektörü Olmak",
        "text": "Bu piyasa dürüst insanların olduğu kadar, dolandırıcıların, kurnazların, kilometreyi düşürenlerin ve merdiven altı tamircilerin de kol gezdiği acımasız bir ekosistemdir. 'Abi araç ilk elden, hatasız, doktordan' diyen bir satıcının gözünün içine bakarken, onun beden dilini okumalı, aynı zamanda profesyonelce yalan söylüyor olabileceği ihtimalini %100 cebinizde tutmalısınız. Herkesle tokalaşacak kadar sıcak, ama kimsenin sözüne ekspertiz raporu olmadan inanmayacak kadar soğuk ve şüpheci olmalısınız. Kriz yönetimi bu işin bel kemiğidir. Örneğin, kapora verdiğiniz araçta devir esnasında noter ekranında haciz çıkarsa veya eksperde motor blokunda gizlenmiş büyük bir kaynak izi fark ederseniz sinir krizi geçirmek yerine, hızlıca masadan kalkmayı ve o kaporayı/zamanı başka bir ticarette nasıl çıkaracağınızı saniyeler içinde planlamalısınız."
      },
      {
        "subtitle": "Bütçe ve Nakit Akışı (Cash Flow) Yönetimi",
        "text": "Sermayenizin tamamını tek bir lüks araca bağlamak, bir galericinin yapabileceği en büyük intihar girişimidir. Elinizde 3 Milyon TL varsa, gidip 3 Milyonluk tek bir araç alırsanız, o aracı satana kadar dükkanınızın tüm geliri donar. Elektrik, su, kira, vergi, personel maaşları işlemeye devam ederken siz o lüks aracın başında kara kara müşteri beklersiniz. Bunun yerine o bütçeyi 3 veya 4 parçaya bölüp, piyasada 'peynir ekmek gibi' satılan, herkesin bildiği, hızlı giden C segment 3-4 farklı araç almak, dükkana hem sirkülasyon kazandırır hem de riski böler. Araçlardan biri 1 ay beklese bile diğeri 3 günde satılarak çarkın dönmesini sağlar. Ticarette aslolan büyük kâr marjlarıyla yılda 3 araç satmak değil, küçük kâr marjlarıyla sürekli al-sat yaparak 'sürümden' kazanmak ve paranın nefes almasını (nakit döngüsünü) asla durdurmamaktır."
      }
    ];

    fs.writeFileSync(path, JSON.stringify(data, null, 2));
    console.log('Successfully updated Step 1!');
  } else {
    console.log('Step 1 not found!');
  }
} else {
  console.log('Guide not found!');
}
