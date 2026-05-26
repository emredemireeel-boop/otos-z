const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../public/data/library_guides.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const newGuide = {
  "id": "guide_kendin_yap_cozumler",
  "title": "Hayat Kurtaran Yaratıcı 'Kendin Yap' (DIY) Oto Çözümleri",
  "description": "Arabanızda karşılaştığınız ufak tefek ama can sıkıcı sorunları, sanayiye gitmeden evdeki basit malzemelerle çözebileceğiniz inanılmaz pratik ve yaratıcı DIY taktikleri.",
  "minutes": 15,
  "difficulty": "Başlangıç",
  "tags": [
    "DIY",
    "Pratik Çözümler",
    "Bakım",
    "Tasarruf",
    "İpuçları"
  ],
  "author": "OtoSöz Pratik Zeka Ekibi",
  "sections": [
    {
      "type": "intro",
      "content": "Arabanız bazen hiç beklenmedik anlarda ufak tefek sorunlar çıkarabilir. Çizikler, çıkmayan lekeler, matlaşan farlar veya kışın donan camlar... Tüm bu sorunlar için her zaman sanayiye gitmek veya pahalı oto kozmetik ürünleri almak zorunda değilsiniz. Evinizde, mutfağınızda veya banyonuzda bulunan sıradan malzemelerle uygulayabileceğiniz 'Kendin Yap' (DIY - Do It Yourself) çözümleri hem bütçenizi korur hem de arabanıza pratik bir şekilde ilk günkü canlılığını kazandırır. İşte ustalara taş çıkartan, yaratıcı ve hayat kurtaran DIY oto taktikleri!",
      "tip": {
        "title": "Önce Ufak Bir Alanda Deneyin",
        "text": "Ev yapımı karışımları veya kimyasalları aracınızın kaportasında veya döşemesinde uygulamadan önce her zaman görünmeyen küçük bir köşede test edin."
      }
    },
    {
      "type": "step",
      "title": "1. Farlar İçin Diş Macunu Mucizesi",
      "content": "Zamanla güneşin UV ışınları ve yoldaki tozlar nedeniyle aracınızın farları sararır ve matlaşır. Bu durum sadece kötü görünmekle kalmaz, gece görüşünüzü de tehlikeye atar. Pahalı far temizleme kitleri yerine banyonuzdaki diş macununu kullanabilirsiniz.",
      "subsections": [
        {
          "subtitle": "Nasıl Uygulanır?",
          "text": "Özellikle 'karbonatlı' veya 'beyazlatıcı' özellikli bir diş macununu matlaşmış farın üzerine sıkın. Eski bir diş fırçası veya mikrofiber bez yardımıyla dairesel hareketlerle 5-10 dakika boyunca farı ovalayın. Diş macununun içindeki hafif aşındırıcı mikro partiküller, tıpkı dişlerinizdeki plakları temizlediği gibi fardaki oksitlenmiş sarı tabakayı da söküp alacaktır. Son olarak ıslak bir bezle silin ve durulayın. Sonuca inanamayacaksınız!"
        }
      ]
    },
    {
      "type": "step",
      "title": "2. Koltuk Lekelerine Karşı Tıraş Köpüğü",
      "content": "Kumaş koltuklara dökülen kahve, meyve suyu veya yağ lekeleri kabusunuz olmasın. Oto kuaförlere yüzlerce lira vermeden önce tıraş köpüğü yöntemini deneyin.",
      "subsections": [
        {
          "subtitle": "Nasıl Uygulanır?",
          "text": "Lekeli bölgeye bolca tıraş köpüğü (jel değil, bildiğimiz beyaz köpük) sıkın ve köpüğü elinizle lekenin üzerine yayın. Yaklaşık 10-15 dakika köpüğün kumaşa işlemesini ve lekeyi yumuşatmasını bekleyin. Ardından yumuşak uçlu bir fırça (veya eski bir diş fırçası) ile bölgeyi nazikçe fırçalayın. Son olarak nemli ve temiz bir mikrofiber bezle bölgeyi silerek durulayın. Tıraş köpüğünün içindeki aktif temizleyiciler lekeleri hızla çözer."
        }
      ]
    },
    {
      "type": "step",
      "title": "3. Kışın Buzlanan Camlara 'Sirke ve Soğan' Kalkanı",
      "content": "Soğuk kış sabahlarında işe yetişmeye çalışırken camlardaki kalın buz tabakasını kazımak eziyettir. Bu durumu yaşanmadan önlemek tamamen sizin elinizde.",
      "subsections": [
        {
          "subtitle": "Soğan Taktiği",
          "text": "Akşam arabanızı park ettikten sonra, ortadan ikiye kestiğiniz çiğ bir soğanı ön camınıza iyice sürün. Soğanın içindeki yağlı ve asidik yapı, gece boyunca camın üzerinde mikroskobik bir kalkan oluşturarak sabah camın buz tutmasını engeller."
        },
        {
          "subtitle": "Sirke-Su Karışımı",
          "text": "Bir sprey şişesine 3 ölçü elma sirkesi, 1 ölçü su koyun. Bu karışımı akşamdan camlarınıza sıkın. Sirkedeki asetik asit, suyun donma noktasını ciddi şekilde düşürdüğü için sabah kalktığınızda camlarınızda buzlanma olmadığını göreceksiniz."
        }
      ],
      "warning": {
        "title": "Sıcak Su Tehlikesi",
        "text": "Buz tutmuş cama asla sıcak su dökmeyin! Ani sıcaklık değişimi camın saniyeler içinde tuzla buz olmasına (çatlamasına) neden olur."
      }
    },
    {
      "type": "step",
      "title": "4. İnce Çizikleri Oje ile Gizleme",
      "content": "Kaportadaki veya jantlardaki derin olmayan, astar boyaya inmemiş kılcal çizikler için mini bir makyaj yapabilirsiniz.",
      "subsections": [
        {
          "subtitle": "Renkli ve Şeffaf Oje",
          "text": "Aracınızın rengine birebir uyan bir oje bulursanız (özellikle siyah veya beyaz araçlarda çok kolaydır), ince uçlu oje fırçasıyla çiziğin içini nazikçe doldurun. Eğer renk tutturamıyorsanız, sadece 'şeffaf cila oje' sürerek çiziğin içinin dolmasını ve güneş ışığında parlayarak belli olmamasını sağlayabilirsiniz. Oje kuruduktan sonra üzerine hafif bir pasta-cila geçerek yüzeyi eşitleyebilirsiniz."
        }
      ]
    },
    {
      "type": "step",
      "title": "5. Plastik Aksamlar İçin Ayakkabı Boyası",
      "content": "Eski model araçların siyah plastik tamponları veya yan çıtaları zamanla güneşe maruz kalarak grileşir ve çirkin bir hal alır.",
      "subsections": [
        {
          "subtitle": "Nasıl Uygulanır?",
          "text": "Siyah ve süngerli likit ayakkabı boyasını alın. Grileşmiş plastik tamponunuzu güzelce yıkayıp kuruladıktan sonra, ayakkabı boyasını tampona yedirerek sürün. Kuruması için 1 saat bekleyin. Plastik aksamlar ilk günkü gibi simsiyah ve parlak görünecektir. Etkisi yıkama sıklığına göre 1-2 ay sürer ve yenilemesi saniyeler alır."
        }
      ]
    },
    {
      "type": "step",
      "title": "6. Kötü Kokulara Karşı Mangal Kömürü ve Kahve",
      "content": "Arabanıza dökülen süt, nemli kalan paspaslar veya sigara dumanı ağır ve kalıcı kokular bırakabilir. Kimyasal oto parfümleri sadece bu kokuyu bastırır, sorunu çözmez.",
      "subsections": [
        {
          "subtitle": "Doğal Koku Emiciler",
          "text": "Aracınızın koltuk altına veya bagajına, hava alan bir bez kese içerisinde birkaç parça 'mangal kömürü' (aktif karbon) veya 1 kase 'kavrulmuş Türk kahvesi' koyun. Kömür, havadaki nemi ve kötü koku partiküllerini sünger gibi içine çekerken; kahve çekirdekleri arabanın içine harika ve doğal bir aroma yayar. Birkaç gün içinde o ağır kokuların tamamen kaybolduğunu fark edeceksiniz."
        }
      ]
    },
    {
      "type": "step",
      "title": "7. Acil Durumlar İçin Paket Lastiğinden Telefon Tutucu",
      "content": "Araba kiraladığınızda veya telefon tutucunuz kırıldığında navigasyona bakmak büyük bir çiledir.",
      "subsections": [
        {
          "subtitle": "Nasıl Uygulanır?",
          "text": "Kalın bir paket lastiğini alın. Lastiğin bir ucunu havalandırma ızgarasının bir kanadından içeri sokun ve diğer kanadından çıkarın. Çıkan iki uca telefonunuzu üstten ve alttan tutturun. İşte size saniyeler içinde hazırlanan, sıfır maliyetli ve telefonu sapasağlam tutan bir tutucu!"
        }
      ]
    }
  ]
};

data.guides.unshift(newGuide);

fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
console.log('Added DIY guide successfully!');
