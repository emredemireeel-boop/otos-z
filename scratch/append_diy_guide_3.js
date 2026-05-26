const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../public/data/library_guides.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const guideIndex = data.guides.findIndex(g => g.id === "guide_kendin_yap_cozumler");

if (guideIndex !== -1) {
  const additionalSections = [
    {
      "type": "step",
      "title": "21. Boyaya Sıçrayan Zift Lekeleri İçin Margarin",
      "content": "Yazın eriyen veya yeni dökülen asfalt yollardan geçtiğinizde, kaportanın alt kısımlarına ve çamurluklara zift (katran) sıçrar. Bunları kazımak boyayı mahveder.",
      "subsections": [
        {
          "subtitle": "Tereyağı veya Margarin Mucizesi",
          "text": "Sertleşmiş siyah zift lekelerinin üzerine mutfağınızdaki margarini veya tereyağını bolca sürün. Yağın katranı yumuşatması için aracı 15 dakika güneşte bırakın. Margarindeki hayvansal/bitkisel yağlar, petrol bazlı ziftin moleküler yapısını bozar. Süre sonunda mikrofiber bir bezle sildiğinizde ziftin çamur gibi eriyip aktığını göreceksiniz."
        }
      ]
    },
    {
      "type": "step",
      "title": "22. Ulaşılamayan Boşluklar İçin 'Slime' (Oyun Hamuru)",
      "content": "Vites topuzunun dipleri, el freni körüğü, cam açma düğmelerinin kenarları... Bu kılcal boşluklara hiçbir bez veya fırça giremez.",
      "subsections": [
        {
          "subtitle": "Eğlenceli Temizlik",
          "text": "Çocukların oynadığı yapışkan, jölemsi 'Slime' hamurundan (veya internette satılan temizlik hamurlarından) bir topak alın. Bu hamuru düğmelerin ve dar boşlukların üzerine bastırın ve geri çekin. Hamur, araya giren tüm tozu, kumu ve bisküvi kırıntılarını kendi içine hapsederek o bölgeyi steril hale getirecektir."
        }
      ]
    },
    {
      "type": "step",
      "title": "23. Titreşimden Gevşeyen Vidalar İçin Şeffaf Oje",
      "content": "Özellikle eski arabalarda kapı döşemelerindeki, plakalardaki veya hoparlör kapaklarındaki vidalar yol titreşimi nedeniyle sürekli gevşer ve ses yapar.",
      "subsections": [
        {
          "subtitle": "Doğal Vida Sabitleyici",
          "text": "Gevşeyen vidayı tamamen çıkarın. Yivlerine (dişlerine) sadece bir damla şeffaf oje damlatın ve hemen yerine geri vidalayın. Oje kuruduğunda kauçuksu ama sıkı bir yapı oluşturarak tıpkı profesyonel bir vida sabitleyici (Loctite) gibi vidanın titreşimden gevşemesini sonsuza dek engeller."
        }
      ]
    },
    {
      "type": "step",
      "title": "24. Koltuk Gıcırtılarına Karşı Bebek Pudrası",
      "content": "Arabanız esnedikçe koltukların deri veya kumaş birleşim yerlerinden, plastik aksamlara sürtünmesinden dolayı gıcır gıcır sesler geliyorsa çözüm çok basittir.",
      "subsections": [
        {
          "subtitle": "Kuru Yağlama",
          "text": "Sesin geldiği birleşim yerlerine (özellikle emniyet kemeri tokasının koltuğa değdiği yerlere veya deri minder aralarına) biraz bebek pudrası serpin. Pudra, sıvı yağların aksine leke bırakmayan mükemmel bir 'kuru yağlayıcıdır'. Sürtünmeyi sıfıra indirerek gıcırtıları anında keser."
        }
      ]
    },
    {
      "type": "step",
      "title": "25. Yanan Direksiyon İçin 180 Derece Taktiği",
      "content": "Yazın arabanızı güneşe park ettiğinizde döndüğünüzde direksiyon simidi elinizi yakacak kadar ısınmış olur.",
      "subsections": [
        {
          "subtitle": "Zekice Bir Park Hamlesi",
          "text": "Aracınızı park edip motoru kapatmadan hemen önce direksiyonu tam yarım tur (180 derece) çevirin ve o şekilde bırakın. Siz döndüğünüzde güneş direksiyonun sadece alt kısmını ısıtmış olacaktır. Arabaya binip direksiyonu düzelttiğinizde ellerinizi koyduğunuz üst kısım gölgede kaldığı için buz gibi serin olacaktır."
        }
      ]
    },
    {
      "type": "step",
      "title": "26. Savrulan Bagaj Poşetleri İçin Karabina",
      "content": "Market alışverişinden sonra eve dönerken ilk virajda tüm poşetlerin devrilip domateslerin bagaja saçılması bir klasiktir.",
      "subsections": [
        {
          "subtitle": "Dağcı Kancası",
          "text": "Aracınızın bagajında veya arka koltuk başlıklarının demirlerinde bulunan ufak kancalara birer tane büyük 'dağcı karabinası' (kancası) takın. Market poşetlerinin saplarını bu kancadan geçirin. Poşetler ne kadar ağır olursa olsun veya ne kadar sert viraj alırsanız alın, havada asılı kalacak ve asla devrilmeyecektir."
        }
      ]
    },
    {
      "type": "step",
      "title": "27. Sarkan Tavan Kumaşına Estetik 'Raptiye' Çözümü",
      "content": "Eski model araçlarda tavan döşemesi yapışkanını bırakıp sarkarak kafanıza değmeye başlar. Döşemeciler bu iş için ciddi paralar ister.",
      "subsections": [
        {
          "subtitle": "Geometrik Tasarım",
          "text": "Eğer tavanı tamamen yeniletecek bütçeniz o an yoksa, kırtasiyeden şeffaf veya aracın tavan rengine uygun yuvarlak başlıklı 'harita raptiyeleri' (veya burgulu döşeme iğneleri) alın. Sarkan kumaşı bu raptiyelerle eşit aralıklarla ve baklava (kapitone) deseni oluşturacak şekilde tavandaki kartona saplayın. Sarkmayı çözdüğünüz gibi arabaya VIP, deri koltuk deseni havası katarsınız."
        }
      ]
    }
  ];

  data.guides[guideIndex].sections.push(...additionalSections);
  data.guides[guideIndex].minutes += 13;

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log('Appended even more epic DIY tricks!');
} else {
  console.log('Guide not found!');
}
