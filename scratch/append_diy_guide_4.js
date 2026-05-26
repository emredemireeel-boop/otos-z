const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../public/data/library_guides.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const guideIndex = data.guides.findIndex(g => g.id === "guide_kendin_yap_cozumler");

if (guideIndex !== -1) {
  // Replace the introduction to sound more advanced and scientific as requested by the text
  data.guides[guideIndex].sections[0].content = "Otomotiv sistemleri artık basit mekaniklerden çıkıp mekatronik ve yazılımla dolu bir hale gelse de, 'Kendin Yap' (DIY) çözümleri malzeme bilimi ve termodinamik yasaları kullanılarak hala hayat kurtarabiliyor. Arabanızda karşılaştığınız ufak tefek sorunları, evdeki basit malzemelerle, kimyasal reaksiyonları ve fiziği kendi lehinize kullanarak çözebileceğiniz inanılmaz pratik taktikler derledik. İşte yüzey biliminden elektromekaniğe kadar uzanan, ustalara taş çıkartan DIY oto taktikleri!";
  
  // Append new advanced sections
  const advancedSections = [
    {
      "type": "step",
      "title": "28. Ekran Çiziklerine Karşı Tüy Toplayıcı Rulo (Lint Roller)",
      "content": "Kabin içindeki tozlar sadece kötü görünmekle kalmaz, mikroskobik silika ve kum partikülleri içerdiği için bezle silindiğinde dokunmatik ekranları ve parlak trimleri 'zımpara' gibi çizer.",
      "subsections": [
        {
          "subtitle": "Kaldırma (Lifting) Kuvveti",
          "text": "Bezle yatay sürtünme yaratmak yerine, elbiseleriniz için kullandığınız yapışkanlı 'tüy toplayıcı ruloyu' ekranlarda ve konsolda yuvarlayın. Rulo, viskoelastik yapısı sayesinde toz partiküllerini yüzeye sürtmeden, dikey bir kuvvetle (lifting) yukarı çeker. Çizilme riski tamamen sıfırlanır."
        }
      ]
    },
    {
      "type": "step",
      "title": "29. Göçük Düzeltmede Termal Şok (Saç Kurutma Makinesi + Basınçlı Hava)",
      "content": "Kaportada boyanın kalkmadığı yumuşak göçüklerde, metalin 'hafızasını' kullanarak fizik yasalarıyla düzeltme yapılabilir.",
      "subsections": [
        {
          "subtitle": "Isı ve Ani Soğutma Reaksiyonu",
          "text": "Göçüğün olduğu bölgeyi saç kurutma makinesiyle 1-2 dakika iyice ısıtıp genleşmesini sağlayın. Ardından, bilgisayar temizliğinde kullanılan 'basınçlı hava spreyi (air duster)' tüpünü baş aşağı çevirerek göçüğe sıkın. Baş aşağı sıkılan sıvılaştırılmış gaz, saniyeler içinde donma noktasına inerek (endotermik tepkime) metali aniden büzülmeye zorlar. Bu şiddetli gerilim, göçüğün 'pop' sesiyle orijinal formuna geri atmasını sağlar."
        }
      ]
    },
    {
      "type": "step",
      "title": "30. Acil Radyatör Sızıntılarına Karabiber ve Çiğ Yumurta",
      "content": "Dağ başında radyatörünüz delindiğinde ve motor hararet yapmaya başladığında, sistemi geçici olarak tıkamak için organik malzemeler kullanılabilir.",
      "subsections": [
        {
          "subtitle": "Protein ve Şişme Dinamiği",
          "text": "Radyatör kapağından içeri dökülen karabiber taneleri, sıcak su akıntısıyla sızıntı deliğine sürüklenir ve orada şişerek mikro-delikleri tıkar. Alternatif olarak atılan çiğ yumurtanın akındaki proteinler ise 100°C sıcak suya değdiği an denatüre olup katılaşır ve deliği kapatan esnek bir biyolojik yama oluşturur."
        }
      ],
      "warning": {
        "title": "Kıyamet Günü Çözümü",
        "text": "Bu taktikler sadece hayatta kalma modunda uygulanmalıdır! Organik parçalar ince soğutma kanallarını tıkayabilir veya plastik radyatör tankının aşırı basınçtan tamamen patlamasına yol açabilir."
      }
    },
    {
      "type": "step",
      "title": "31. Kopan Kayış İçin 'Külotlu Çorap' Efsanesi",
      "content": "Seyir halindeyken kopan alternatör veya su pompası kayışının yerine külotlu çorap bağlayıp yola devam etme hikayesini duymuşsunuzdur.",
      "subsections": [
        {
          "subtitle": "Modern Araçlarda Asla Denemeyin",
          "text": "Bu efsane, 1990 öncesi eski araçların derin oluklu 'V-kayış' kasnaklarında işe yarardı. Ancak günümüz araçları geniş, pürüzsüz ve devasa gerilimle çalışan 'Serpentine' (çok kanallı) kayışlar kullanır. Modern pürüzsüz kasnaklara bağlayacağınız bir çorap veya ip anında kayacak, eriyecek veya motor bloğuna sarılarak felaket yaratacaktır."
        }
      ]
    },
    {
      "type": "step",
      "title": "32. Çamura ve Kara Saplanmalarda Kauçuk Paspas",
      "content": "Aracınız çamura veya derin kara saplandığında lastikler dönerken yüzeyi buza çevirip sürtünmeyi sıfırlar.",
      "subsections": [
        {
          "subtitle": "Doğru Paspas Seçimi",
          "text": "Tekerleğin altına 'kumaş/halı' paspas koymak işe yaramaz, suyu emip kayganlaşarak mermi gibi fırlatılır. Ancak suyu iten ve derin olukları olan 'kauçuk (rubber)' paspaslar, dönen lastiğin dişlerine kenetlenip araca muazzam bir statik sürtünme sağlayarak saplandığı yerden çıkarır."
        }
      ]
    },
    {
      "type": "step",
      "title": "33. Radikal Saplanmalar İçin 'Ahşap Takoz' (Paddle-Wheel) Yöntemi",
      "content": "Paspasın bile işe yaramadığı felaket durumlarında, aracı bir nehir vapuru (paddle-wheel) gibi hareket ettirmek mümkündür.",
      "subsections": [
        {
          "subtitle": "Nasıl Uygulanır?",
          "text": "Kalın bir odun veya tahta parçasını, güçlü bir cırcırlı yük kayışıyla jant boşluklarından geçirerek lastiğin sırtına dikey olarak bağlayın. Dönen odun yere saplanarak aracı kaldırıp çamurdan dışarı iter."
        }
      ],
      "warning": {
        "title": "Diferansiyel Patlaması Riski",
        "text": "Odun yere vurduğunda boşta dönen tekerlek aniden muazzam bir tutunma kazanır. Bu ani kinetik şok, aks millerini burkabilir veya diferansiyel dişlilerini patlatabilir. Çok yavaş ve çaresiz kalınan durumlarda denenmelidir."
      }
    },
    {
      "type": "step",
      "title": "34. Güvenli LED Ambiyansı İçin 'Sigorta Çoğaltıcı' (Add-A-Circuit)",
      "content": "Kabin içine kendi başınıza yapacağınız LED aydınlatmalarda, kabloları kesip bantlamak yangın riskidir.",
      "subsections": [
        {
          "subtitle": "Elektromekanik Zarafet",
          "text": "Bunun yerine sigorta kutusundaki silecek veya radyo sigortasını çıkarıp 'Add-a-Circuit (Sigorta Çoğaltıcı)' aparatını takın. Bu aparat, mevcut devreyi bozmadan size güvenli, ayrı bir hat (ve ayrı bir düşük amperli sigorta yuvası) sunar. Böylece kısa devre anında aracın ana sistemleri değil, sadece LED'in sigortası atar."
        }
      ]
    },
    {
      "type": "step",
      "title": "35. Oto Hırsızlığına Karşı 'Gizli Şalter' (Kill Switch)",
      "content": "Anahtarı kopyalasalar veya düz kontak yapsalar bile aracınızın çalınmasını engelleyecek donanımsal en üst düzey güvenlik önlemidir.",
      "subsections": [
        {
          "subtitle": "Kusursuz Mülkiyet Koruması",
          "text": "Aracın 'Yakıt Pompası'na giden röle kablosunu kesip, araya ucuz bir 12V bas-çek (toggle) düğme bağlayın. Bu düğmeyi vites körüğünün altına veya bardaklığın içine gizleyin. Yakıt pompasının elektriği kesildiğinde hırsız ne yaparsa yapsın motor çalışmayacaktır."
        }
      ]
    },
    {
      "type": "step",
      "title": "36. Termodinamik Yemek Isıtıcısı: Koltuk Isıtma",
      "content": "Restorandan aldığınız sıcak paket (takeout) yiyecekleri evinize soğumadan götürmek istiyorsanız enerjiyi akıllıca kullanın.",
      "subsections": [
        {
          "subtitle": "Joule Etkisi",
          "text": "Yemeği yan yolcu koltuğuna koyun ve 'koltuk ısıtma' (seat warmer) sistemini son kademede açın. Koltuk içindeki termal rezistansların ürettiği ısı, yemeğin dış atmosfere ısı kaybını (konveksiyon) durdurarak mükemmel bir benmari/servis ısıtıcısı görevi görecektir."
        }
      ]
    },
    {
      "type": "step",
      "title": "37. Mısır Gevreği Kabından Sabit Çöp Kutusu",
      "content": "Kabin içindeki poşet çöpler virajlarda devrilir ve sıvı dökülmelerine yol açar.",
      "subsections": [
        {
          "subtitle": "Modüler Tasarım",
          "text": "Plastik, kapaklı ve kilitli 'mısır gevreği / bakliyat saklama kaplarının' içine bir poşet geçirin ve koltuğun arkasına veya altına sabitleyin. Sızdırmaz yapısı, devrilmeyen sert gövdesi ve kilitli kapağı sayesinde aracınızda asla koku veya dökülme yaşatmayan premium bir çöp üniteniz olacaktır."
        }
      ]
    }
  ];

  data.guides[guideIndex].sections.push(...advancedSections);
  data.guides[guideIndex].minutes += 15;

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log('Appended scientific DIY tricks successfully!');
} else {
  console.log('Guide not found!');
}
