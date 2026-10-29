const fs = require('fs');

const path = './public/data/library_guides.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const newGuide = {
  "id": "guide_dunya_lider_otomotiv_gruplari",
  "title": "Hangi Marka Kimin? Dünyanın Lider Otomotiv Grupları ve Gizli Ortaklıklar",
  "description": "Yüzlerce farklı araba markası olduğunu sanıyorsunuz değil mi? Aslında dünyadaki otomotiv endüstrisi sadece birkaç dev ailenin elinde. Hangi markaların aynı çatı altında üretildiğini öğrenince çok şaşıracaksınız!",
  "minutes": 8,
  "difficulty": "Tüm Sürücüler",
  "tags": [
    "Otomotiv Grupları",
    "Markalar",
    "Endüstri",
    "Genel Kültür",
    "Stellantis",
    "Volkswagen"
  ],
  "author": "OtoSöz Endüstri Analisti",
  "sections": [
    {
      "type": "intro",
      "title": "İllüzyona Hoş Geldiniz: Yüzlerce Marka, Birkaç Patron",
      "content": "Sokakta yürürken onlarca farklı otomobil markası görüyorsunuz. Tasarımları, motorları, kitleleri ve hatta ülkeleri farklı... Ancak arka planda dönen oyun çok daha büyük. Otomotiv dünyasında bağımsız marka kalmak neredeyse imkansızdır. Ar-Ge maliyetleri, emisyon kuralları ve platform paylaşımı gibi sebeplerden dolayı, yollarda gördüğümüz o meşhur markaların %90'ı sadece birkaç dev şirketin çatısı altında birleşmiş durumda. Gelin, hangi markanın aslında kime ait olduğuna ve otomotiv dünyasının devasa aile ağacına birlikte göz atalım."
    },
    {
      "type": "step",
      "title": "1. Volkswagen Group (VAG): Alman İmparatorluğu",
      "content": "Halkın arabası (Volkswagen) olarak yola çıkan marka, bugün otomotiv tarihinin en büyük imparatorluklarından biri. Sokakta gördüğünüz o sportif **Seat (ve Cupra)**, pratik **Skoda** ve premium **Audi** aslında tamamen Volkswagen genleri taşıyor. Hatta işi süper spor ve lüks klasmana taşıdığımızda **Porsche, Bentley, Lamborghini** ve efsanevi **Bugatti** de doğrudan Volkswagen Grubu'nun kasasını dolduruyor. Ortak platform (MQB vb.) kullanımının piri olan VAG, tek bir şasiden hem Skoda Octavia hem de Audi A3 üretebiliyor."
    },
    {
      "type": "step",
      "title": "2. Stellantis: Avrupa ve Amerika'nın Dev Evliliği",
      "content": "2021 yılında Fransız PSA grubu ile İtalyan-Amerikan FCA grubunun birleşmesiyle doğan Stellantis, tam 14 markayı tek çatı altına toplayan bir dev. Bir yanda **Peugeot, Citroen, Opel ve DS Automobiles** gibi Avrupalılar, diğer yanda **Fiat, Alfa Romeo, Lancia ve Maserati** gibi İtalyanlar, okyanusun ötesinde ise **Jeep, Chrysler, Dodge ve RAM** gibi Amerikan kasları var. Bugün bir Opel Corsa ile Peugeot 208'in aynı fabrikadan, aynı motor ve şasiyle çıktığını bilmek, bu devasa birleşmenin gücünü özetliyor."
    },
    {
      "type": "step",
      "title": "3. Renault-Nissan-Mitsubishi İttifakı",
      "content": "Bu grup klasik bir 'şirket satın alması' değil, stratejik bir ittifaktır. **Renault** ve **Nissan**'ın başı çektiği bu ortaklık, daha sonra **Mitsubishi**'yi de arasına kattı. Ayrıca yollarda çokça gördüğümüz fiyat/performans kralı **Dacia** ve Rus otomotiv devi **Lada** da Renault'nun kanatları altındadır. Nissan'ın lüks markası **Infiniti** ve Renault'nun spor markası **Alpine** de bu dev şemsiyenin altında teknolojilerini paylaşıyorlar."
    },
    {
      "type": "step",
      "title": "4. Geely: Ejderhanın Küresel Yükselişi",
      "content": "Çin otomotiv endüstrisinin dünyadaki en büyük gururu olan Geely, agresif satın alma politikasıyla dikkat çekiyor. Güvenliğin kalesi İsveçli **Volvo**'yu satın alarak dünyayı şoke eden Geely, bununla kalmayıp Volvo'nun elektrikli performans markası **Polestar**'ı yarattı. İngiliz spor otomobil efsanesi **Lotus** ve Londra'nın meşhur siyah taksilerini üreten **LEVC** de bugün Geely'nin himayesinde. Smart markasında da Mercedes ile %50-%50 ortaklıkları bulunuyor."
    },
    {
      "type": "step",
      "title": "5. Tata Motors: Hint Kaplanı'nın Lüks İştahı",
      "content": "Hindistan'ın en büyük devlerinden biri olan Tata Motors, Hindistan'da ürettiği ultra ucuz arabalarla (Tata Nano gibi) bilinirken, 2008 yılında Ford'dan İngiliz aristokrasisinin simgesi olan **Jaguar** ve **Land Rover**'ı satın alarak dünyanın çenesini düşürdü. JLR (Jaguar Land Rover) bugün Tata'nın finansal gücü sayesinde ayakta kalıp muazzam araçlar üretmeye devam ediyor."
    },
    {
      "type": "step",
      "title": "6. BMW ve Mercedes: Premium Yalnızlık (Neredeyse)",
      "content": "Birçok markayı yutan devlerin aksine, Alman premium devleri çekirdek aile kalmayı tercih ediyor. \n- **BMW Grubu:** Sadece BMW'den ibaret değil; ikonik İngiliz **MINI** ve dünyanın en lüks otomobillerini üreten **Rolls-Royce** BMW bünyesinde bulunuyor.\n- **Mercedes-Benz Grubu:** Eskiden Chrysler ile ortak olan marka artık sadece kendi lüksüne odaklanıyor. Yalnızca şehir otomobili üreten **Smart**'ı Geely ile ortaklaşa yaşatıyor."
    },
    {
      "type": "step",
      "title": "7. Uzak Doğu'nun Bağımsız Ruhları: Toyota, Hyundai ve Honda",
      "content": "Asyalı devler genellikle kendi içlerinden marka doğurmayı seviyor:\n- **Toyota Grubu:** Dünyanın en çok satan otomotiv şirketi olan Toyota, lüks sınıf için **Lexus**'u yarattı. Ayrıca küçük araç uzmanı **Daihatsu** ve ticari araç markası Hino da Toyota'nın.\n- **Hyundai Motor Grubu:** Koreli dev, kardeşi **Kia** ile omuz omuza dünyayı fethediyor. Son yıllarda yarattıkları lüks marka **Genesis** ile de Alman premiumlara kafa tutuyorlar.\n- **Honda:** Bağımsız Japon devi, Kuzey Amerika pazarındaki lüks algısını yönetmek için **Acura** markasıyla yola devam ediyor."
    },
    {
      "type": "conclusion",
      "title": "Sonuç: Ortak Platform, Farklı Logolar",
      "content": "Bugün sıfır kilometre bir araba aldığınızda, kaputun altındaki motorun, şasinin ve hatta silecek kollarının bambaşka logolu araçlarla aynı olabileceğini unutmayın. Otomotiv dünyasında artık 'safkan' bir marka bulmak çok zor. Ancak bu ortaklıklar, geliştirme maliyetlerini milyarlarca dolar düşürdüğü için yeni teknolojilerin (özellikle elektrikli araçların) daha hızlı hayatımıza girmesini sağlıyor. Artık 'Alman arabası mı, Fransız arabası mı?' sorusu yerine, 'Hangi grubun platformu?' sorusunu sormanın vakti geldi.",
      "finalChecklist": [
        "Bir otomobil alırken aynı motor ve altyapıyı kullanan diğer grup markalarının daha uygun fiyatlı olup olmadığını kontrol edin (Örn: Golf yerine Leon veya Octavia).",
        "Markaların kökenine değil, o modelin hangi grubun platformunda üretildiğine odaklanın.",
        "Parça fiyatları ararken, aracınızın grubundaki (örneğin Stellantis) diğer markaların eşdeğer parçalarının fiyatlarını da mutlaka kıyaslayın."
      ]
    }
  ],
  "urlId": 10041
};

data.guides.unshift(newGuide);

fs.writeFileSync(path, JSON.stringify(data, null, 2));
console.log('Successfully appended auto groups guide!');
