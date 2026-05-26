const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../public/data/library_guides.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const guideIndex = data.guides.findIndex(g => g.id === "guide_sanayi_ustalari_sirlar");

if (guideIndex !== -1) {
  const guide = data.guides[guideIndex];
  const additionalSecrets = [
    {
      "type": "step",
      "title": "Sır 8: Motor Temizliği (Basınçlı Su) Ticarileşmesi",
      "content": "Araç satılacağı zaman veya detaylı temizliklerde kaputun altı köpüklenir ve oto yıkamacılarda tazyikli basınçlı suyla yıkanır. Çıkan pırıl pırıl sonuç göze harika görünse de aslında kaputun altında bir felaket senaryosu başlamıştır.",
      "subsections": [
        {
          "subtitle": "Elektronik İntihar",
          "text": "Modern otomobillerin kaputunun altı sadece demir yığınından ibaret değildir. ECU (Motor Beyni), ABS beyni, sigorta kutuları, hassas ateşleme bobinleri ve sayısız sensör soketi bulunur. Basınçlı su, soketlerin yalıtım (conta) sınırlarını aşarak kılcal kabloların içine nüfuz eder. O an araba çalışsa bile, suyun yarattığı oksitlenme birkaç ay sonra aracın yolda teklemesine, beynin yanmasına veya anlamsız arıza lambalarının yanmasına sebep olur."
        },
        {
          "subtitle": "Kritik Müdahale",
          "text": "Motor asla tazyikli suyla yıkanmamalıdır! Sanayide 'Ben yıkıyorum abi bir şey olmuyor' diyenlere itibar etmeyin. Motor temizliği, nemli bir mikrofiber bez, yağ sökücü sprey ve detay fırçalarıyla (su tutulmadan) tamamen 'kuru/nemli temizlik' yöntemiyle yapılmalıdır. Görüntü için binlerce liralık elektrik tesisatını riske atmayın."
        }
      ]
    },
    {
      "type": "step",
      "title": "Sır 9: Yedek Parçada 'Logolu Orijinal' vs 'OEM' Yanılgısı",
      "content": "Yetkili servise gittiğinizde size bir fren balatası veya filtre için dışarıdaki fiyatın üç katı fatura çıkarılır ve 'Biz sadece orijinal logolu parça takıyoruz, yan sanayi kullanmıyoruz' denir.",
      "subsections": [
        {
          "subtitle": "Orijinal Ekipman Üreticisi (OEM) Gerçeği",
          "text": "Otomobil markaları (BMW, VW, Renault vb.) fren balatası, filtre veya buji üretmezler. Bu parçaları Bosch, Valeo, Mann, Mahle, NGK gibi dev tedarikçilere ürettirirler. Üretici, bu parçanın üzerine sadece 'Araba Markasının Logosunu' bastırır ve kendi kutusuna koyar. İşte o logoyu sildiğinizde, aynı Bosch markalı balatayı dışarıdaki parçacıdan OEM (Original Equipment Manufacturer) olarak üçte biri fiyatına alabilirsiniz."
        },
        {
          "subtitle": "Kritik Müdahale",
          "text": "Aracınıza parça alırken 'Yan Sanayi' (merdiven altı, Çin malı) almayın; ancak fahiş fiyatlı 'Logolu Orijinal' almak zorunda da değilsiniz. Aracınızın fabrika çıkışında o parçayı üreten OEM markasını (örneğin debriyaj için LUK veya Sachs, far için Hella) öğrenin ve doğrudan o markanın kutusuyla satın alın. Kalite %100 aynı, fiyat %60 daha ucuzdur."
        }
      ]
    },
    {
      "type": "step",
      "title": "Sır 10: Turbo Arızalarında 'Türbin Değişimi' Aceleciliği",
      "content": "Turbodan ıslık sesi gelmeye başladığında veya aracın egzozundan mavi duman (yağ yakma) çıktığında usta direkt 'Turbo yemiş, türbin değişecek, 25.000 TL' teşhisini koyar.",
      "subsections": [
        {
          "subtitle": "PCV Valfi ve Basınç Körlüğü",
          "text": "Turbonun yağ sızdırması her zaman turbonun mekanik olarak dağıldığı anlamına gelmez. Çoğu zaman motorun Karter Havalandırma Valfi (PCV Valfi - 500 TL'lik plastik bir parça) tıkanmıştır. PCV tıkanınca karterde oluşan yüksek basınç gidecek yer bulamaz ve motor yağını zorla turbonun keçelerinden dışarı iter. Turbo sadece yüksek basıncın kurbanı olmuştur."
        },
        {
          "subtitle": "Kritik Müdahale",
          "text": "Turbonuz ıslık çalıyor veya yağ veriyorsa, turboyu söktürmeden önce kesinlikle PCV (Karter Havalandırma) valfini, yağ geri dönüş borularını ve hava filtresini kontrol ettirin. Basit bir tıkanıklığı açmak, sizi devasa turbo revizyon faturalarından kurtarabilir."
        }
      ]
    },
    {
      "type": "step",
      "title": "Sır 11: Triger Değişiminde 'Sahte Ekonomi' (Su Pompası İhmali)",
      "content": "Araçların ağır bakımı olan Triger (Zamanlama) kayışı değişiminde, usta sadece kayışı ve bilyaları (gergileri) değiştirir. Müşteri 'Su pompasını (devridaimi) da değiştirelim mi?' dediğinde, usta maliyeti düşürmek ve şirin görünmek için 'Gerek yok abi, su pompası daha iyi durumda, akıtmıyor' der.",
      "subsections": [
        {
          "subtitle": "Zaman Ayarlı Bomba",
          "text": "Triger kayışı değiştiğinde, kayışın geçtiği güzergahtaki en önemli dönen parça devridaim (su) pompasıdır. Eski su pompası, üzerine takılan yepyeni ve çok gergin triger kayışının yarattığı yanal kuvvete dayanamaz. 10.000 km sonra eski su pompası rulmanı kilitlenir. Pompa kilitlendiğinde üstünden geçen yeni triger kayışını da anında koparır ve motorun sibopları pistonlara vurarak motoru tamamen yok eder (150.000 TL zarar)."
        },
        {
          "subtitle": "Kritik Müdahale",
          "text": "Triger bakımı bir bütündür! Triger kayışı değişiyorsa, üzerinden geçtiği su pompası da (isterse sıfır gibi görünsün) tartışmasız olarak değiştirilmelidir. 1.000 TL'lik pompadan kaçmak (sahte ekonomi yapmak), motorunuzun intihar fermanını imzalamaktır."
        }
      ]
    },
    {
      "type": "step",
      "title": "Sır 12: Antifriz Eklerken Yapılan 'Saf Antifriz' Katliamı",
      "content": "Kış gelirken veya soğutma suyu eksildiğinde, marketten veya benzinlikten konsantre (saf) antifriz alınır ve 'Ne kadar koyu olursa o kadar iyi korur' mantığıyla direkt radyatöre dökülür.",
      "subsections": [
        {
          "subtitle": "Asit Etkisi ve Donma Noktası Paradoksu",
          "text": "Saf konsantre antifriz son derece korozif bir kimyasaldır. Eğer suyla karıştırılmazsa sistemdeki kauçuk hortumları, O-ringleri ve ince alüminyum contaları asit gibi eritmeye başlar ve araca her yerden su kaçırtır. Daha da ilginci, termodinamik bir paradoks olarak; saf antifrizin donma noktası -12°C iken, %50 saf su ile karıştırılmış antifrizin donma noktası -37°C'ye düşer! Yani saf antifriz koymak soğuğa karşı daha korumasızdır."
        },
        {
          "subtitle": "Kritik Müdahale",
          "text": "Aracınıza asla direkt şişeden saf antifriz boşaltmayın. Etiketinde 'Pre-Mixed' veya 'Ready to Use' (Hazır Karışım) yazmıyorsa, mutlaka bidonun dışında %50 oranında saf su (çeşme suyu veya pet şişe suyu asla değil, saf distile akü suyu) ile karışım hazırlayıp öyle ekleyin."
        }
      ]
    },
    {
      "type": "step",
      "title": "Sır 13: 4x4 (AWD) Araçların 'Kış Lastiği' Efsanesi",
      "content": "4x4 (Dört tekerlekten çekişli) veya lüks SUV araç sahiplerinin en büyük argümanı şudur: 'Benim aracım çok güçlü ve 4 çeker, kış lastiğine ihtiyacım yok, karı buzu yarar geçerim.' Bu yüzden yazlık veya dört mevsim lastiklerle karlı yollara çıkarlar.",
      "subsections": [
        {
          "subtitle": "Frenleme Dinamikleri ve Traksiyon Farkı",
          "text": "Fizik kuralları acımasızdır. 4x4 (AWD) sistemi sadece aracın 'kalkışında (traksiyon)' ve hızlanmasında işe yarar; gücü tekerleklere dağıtarak patinajı önler. Ancak frene bastığınız anda, aracınız ister 4x4 ister önden çekişli olsun, hepsi eşit şartlarda '4 tekerlekten frenleyen' bir demir yığınına dönüşür. Fren mesafesini AWD sistemi değil, sadece lastik hamurunun yere ne kadar tutunduğu (sürtünme katsayısı) belirler."
        },
        {
          "subtitle": "Kritik Müdahale",
          "text": "Karda yaz lastiği takılı bir 4x4 araç kolayca hızlanabilir (bu da sürücüye sahte bir özgüven verir), ancak durması gerektiğinde kızaklayarak felakete sürüklenir. Gerçek kış güvenliği çekiş sisteminde değil, 7 derecenin altında sertleşmeyen silika bazlı kış lastiği hamurundadır. 4x4 bir jip yaz lastiğiyle duramazken, kış lastiği takılı önden çekişli ucuz bir hatchback güvenle durur."
        }
      ]
    },
    {
      "type": "step",
      "title": "Sır 14: Ekspertiz Firmalarının 'Boya Takıntısı' Manipülasyonu",
      "content": "İkinci el araba alırken ekspertize gidilir ve raporda 'Sağ arka çamurluk boyalı, kapı ucu lokal boyalı' çıkar. Alıcı anında paniğe kapılır, aracın değerini 50.000 TL kırmaya çalışır veya almaktan vazgeçer. Piyasada kozmetik boya bir 'tabu' haline getirilmiştir.",
      "subsections": [
        {
          "subtitle": "Mekanik Sağlık vs Kozmetik Takıntı",
          "text": "Avrupa ve Amerika'da aracın kaportasındaki boya bir değer kaybı sebebi değil, araca yapılan bir 'bakım' olarak görülür. Aracın iskeletini (şasi uçları, podyeler, kuleler), hava yastıklarını (airbag) ve motor sağlığını (kompresyon testi) mükemmel çıkmışsa, kapıya sürtmeden dolayı atılan mikronluk yüzeysel boyanın aracın dinamiklerine veya güvenliğine sıfır (0) etkisi vardır. Aksine o çiziğin boyanmaması zamanla sacın paslanıp çürümesine yol açar."
        },
        {
          "subtitle": "Kritik Müdahale",
          "text": "Araç alırken 'Hatasız, Boyasız' saplantısı yüzünden şanzımanı vuruntulu, motoru yağ yakan bitik arabaları yüksek fiyata almayın. Boyalı ama mekaniği saat gibi, tüm ağır bakımları yetkili serviste yapılmış bir araç her zaman binici için çok daha güvenli ve akıllıca bir yatırımdır. Arabanın kaportası değil, motoru ve şasisi sizi yolda tutar!"
        }
      ]
    }
  ];

  guide.sections.push(...additionalSecrets);
  guide.minutes += 25; // added read time
  guide.title = "Sanayide Ustaların Gizlediği 14 Kritik Sır: Aracınızın Ömrünü ve Cüzdanınızı Nasıl Kurtarırsınız? (Derin Analiz)";

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log('Expanded mechanic secrets EVEN MORE successfully!');
} else {
  console.log('Guide not found.');
}
