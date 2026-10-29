const fs = require('fs');

const path = './public/data/library_guides.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const detailedGuide = {
  "id": "guide_araba_renkleri_isi_emilimi",
  "title": "Araç Rengi Seçiminin Bilimsel Sırları: Renklere Göre Isı Emilimi ve Yakıt Tasarrufu Mega Rehberi",
  "description": "Güneş altında park edilen araçların rengi, kabin içinin fırına dönmesinde ne kadar etkilidir? Siyah ile beyaz araç arasında tam 19°C yüzey sıcaklığı farkı olduğunu biliyor muydunuz? İşin termodinamik boyutu, klima maliyetleri ve boya koruma sırları.",
  "minutes": 10,
  "difficulty": "Tüm Sürücüler",
  "tags": [
    "Araç Rengi",
    "Isı Emilimi",
    "Termodinamik",
    "Klima Kullanımı",
    "Tasarruf",
    "Boya Koruma"
  ],
  "author": "OtoSöz Bilim ve Teknik",
  "sections": [
    {
      "type": "intro",
      "title": "Sıcak Bir Yaz Gününde Kabin İçi Neden Cehenneme Döner?",
      "content": "Temmuz sıcağında aracınızı güneşte park edip döndüğünüzde, kapıyı açar açmaz yüzünüze vuran o alev topunu hepimiz biliriz. Direksiyon tutulamayacak kadar ısınmış, vites topuzu el yakar hale gelmiş, deri koltuklar ise adeta birer ızgara teline dönüşmüştür. Araç içi sıcaklığın dış ortamdan çok daha yüksek (bazen 70-80°C'ye kadar) olmasının temel nedeni 'Sera Etkisi'dir. Güneş ışınları camdan girip içerideki yüzeylere çarparak ısı enerjisine dönüşür ve bu ısı camdan geri çıkamaz. Ancak bu sürecin ne kadar şiddetli yaşanacağını belirleyen asıl faktör, aracınızın dış kaporta rengidir."
    },
    {
      "type": "info",
      "title": "Termodinamiğin Temel Kuralı: Albedo Etkisi",
      "content": "Bilimde 'Albedo' olarak bilinen kavram, bir yüzeyin üzerine düşen ışığı yansıtma kapasitesidir. Beyaz renk %100'e yakın bir albedo değerine sahipken (ışığı yansıtır), siyah renk 0'a yakın bir değere sahiptir (ışığı ve enerjiyi emer). Bu basit fizik kuralı, araç tercihlerinde binlerce liralık yakıt ve konfor farkı yaratır."
    },
    {
      "type": "step",
      "title": "Siyah: Yüzey Sıcaklığı 62°C (Isı Mıknatısı)",
      "content": "Siyah renk, karizmanın ve asaletin sembolüdür; makam araçlarının vazgeçilmezidir. Ancak yaz aylarında tam bir 'Isı Mıknatısı'na dönüşür. Yapılan termal kamera testlerinde, güneş altında kalan siyah bir aracın yüzey sıcaklığı 62°C'ye kadar çıkmaktadır. Bu devasa ısı sadece kaportada kalmaz, iletim (kondüksiyon) yoluyla doğrudan kabin içine aktarılır. İçeriyi soğutmak için klimanın en son ayarda, çok daha uzun süre çalışması gerekir. Ayrıca siyah renkli araçların boyası, UV ışınlarını daha fazla emdiği için vernik yanığına (güneş yanığı) en yatkın renktir."
    },
    {
      "type": "step",
      "title": "Beyaz: Yüzey Sıcaklığı 43°C (Doğal İzolasyon)",
      "content": "Şirket araçlarının ve sıcak iklimdeki ülkelerin neden genellikle beyaz arabaları tercih ettiğini hiç düşündünüz mü? Beyaz, ışığı yansıtma özelliği sayesinde şüphesiz en avantajlı renktir. Yüzey sıcaklığı 43°C civarında kalarak siyah bir araca göre tam 19 derecelik muazzam bir avantaj sağlar. Bu fark, aracın içine girdiğinizde nefes alabilmenizi, plastik trim aksamların (göğüslük) daha az genleşip çatlamamasını ve klimanın sadece birkaç dakika içinde içeriyi buz gibi yapabilmesini sağlar."
    },
    {
      "type": "step",
      "title": "Gümüş ve Yeşil: Serin Tutan Alternatifler (45-47°C)",
      "content": "Eğer beyaz renk size 'taksi' veya 'şirket aracı' gibi hissettiriyorsa, gümüş gri (47°C) ve açık yeşil (45°C) tonları bilimsel olarak en mantıklı alternatiflerdir. Gümüş gri, metalik yapısı sayesinde güneş ışınlarını tıpkı bir ayna gibi kırar. Ortalama 47°C yüzey sıcaklığıyla dengeli bir kabin ısısı sunar. Ayrıca kiri, tozu ve kılcal çizikleri (harelenme) en iyi saklayan renk olması, gümüşü dünyanın en sorunsuz otomobil rengi yapar."
    },
    {
      "type": "step",
      "title": "Mavi, Sarı ve Kırmızı: Enerji Tüketen Renkler (48-51°C)",
      "content": "Estetik ve sportif açıdan en göz alıcı renkler, maalesef ısı emiliminde ortanın üzerine çıkmaktadır. Mavi araçlar 48°C, sportifliğin rengi sarı 50°C, tutkunun rengi kırmızı ise 51°C gibi oldukça yüksek yüzey sıcaklıklarına ulaşır. Kırmızı renk, spektrumdaki yapısı gereği UV ışınlarından çok çabuk etkilenir; eğer düzenli cila (wax) atılmazsa, kırmızı araçların birkaç yıl içinde pembeye dönük mat bir renge büründüğünü (oksidasyon) görebilirsiniz."
    },
    {
      "type": "info",
      "title": "Ekonomik Boyut: Renk Seçimi ve Yakıt Tüketimi (Klima Etkisi)",
      "content": "Berkeley Lab tarafından yapılan bir araştırmada, gümüş/beyaz araçların siyah araçlara göre kabin içini soğutmak için %13 daha az klima kapasitesine ihtiyaç duyduğu kanıtlanmıştır. Klima kompresörü doğrudan motordan güç aldığı için, siyah bir aracı soğutmaya çalışmak yakıt tüketimini ortalama %1.1 ile %2 arasında artırır. Uzun vadede düşündüğünüzde, koyu renk bir aracın sadece yaz aylarındaki ekstra yakıt masrafı bile küçümsenemeyecek boyutlardadır."
    },
    {
      "type": "conclusion",
      "title": "Sonuç: Konfor mu, Karizma mı?",
      "content": "Araç alırken renk seçimi sadece zevk meselesi değildir; yaşadığınız iklim, park koşullarınız (kapalı otoparkınız var mı?) ve yakıt bütçenizle doğrudan ilgilidir. Siyah bir araç size o an çok havalı gelebilir, ancak Temmuz ayında gölgesiz bir otoparkta aracınıza binerken yaşayacağınız eziyeti hesap etmelisiniz. Eğer koyu renkli bir araca aşıksanız, seramik kaplama yaptırmak, kaliteli bir cam filmi (UV korumalı) çektirmek ve ön cam güneşliğini bagajdan hiç eksik etmemek sizin için bir zorunluluktur.",
      "finalChecklist": [
        "Siyah veya lacivert araç alıyorsanız, kesinlikle UV korumalı cam filmi ve kaliteli bir ön cam güneşliği edinin.",
        "Açık renklerin klimayı daha az zorlayarak doğrudan yakıt tasarrufu sağladığını unutmayın.",
        "Kırmızı araçların güneş yanığına ve oksidasyona (solma) çok yatkın olduğunu bilerek, her 6 ayda bir UV korumalı cila (wax) uygulayın.",
        "Kapalı otopark imkanınız yoksa, beyaz ve gümüş gri her zaman en mantıklı yatırım olacaktır."
      ]
    }
  ]
};

// Replace the specific guide
const guideIndex = data.guides.findIndex(g => g.id === "guide_araba_renkleri_isi_emilimi");

if (guideIndex !== -1) {
  data.guides[guideIndex] = detailedGuide;
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
  console.log('Successfully updated the color heat absorption guide with mega details!');
} else {
  console.log('Guide not found! Maybe ID is different?');
}
