const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../public/data/library_guides.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const guideIndex = data.guides.findIndex(g => g.id === "guide_dunya_lider_otomotiv_gruplari");

if (guideIndex !== -1) {
    data.guides[guideIndex] = {
      "id": "guide_dunya_lider_otomotiv_gruplari",
      "title": "Hangi Marka Kimin? Dünyanın Lider Otomotiv Grupları ve Gizli Ortaklıklar (Kapsamlı Rehber)",
      "description": "Yüzlerce farklı araba markası olduğunu sanıyorsunuz değil mi? Aslında dünyadaki otomotiv endüstrisi sadece birkaç dev ailenin elinde. Hangi markaların aynı çatı altında üretildiğini, kimin kimi satın aldığını ve ortak platformların sırlarını öğrenince otomobil dünyasına bakışınız tamamen değişecek!",
      "minutes": 15,
      "difficulty": "Tüm Sürücüler",
      "tags": [
        "Otomotiv Grupları",
        "Markalar",
        "Endüstri",
        "Genel Kültür",
        "Stellantis",
        "Volkswagen",
        "Geely"
      ],
      "author": "OtoSöz Endüstri Analisti",
      "sections": [
        {
          "type": "intro",
          "title": "İllüzyona Hoş Geldiniz: Yüzlerce Marka, Birkaç Patron",
          "content": "Sokakta yürürken onlarca farklı otomobil markası görüyorsunuz. Tasarımları, motorları, kitleleri ve hatta ülkeleri farklı... Ancak arka planda dönen oyun çok daha büyük. Otomotiv dünyasında bağımsız marka kalmak günümüzün acımasız rekabet koşullarında neredeyse imkansızdır.\n\nArtan Ar-Ge maliyetleri, katılaşan emisyon kuralları, elektrifikasyona geçiş sürecinin getirdiği milyarlarca dolarlık yatırım ihtiyaçları ve platform paylaşımı zorunluluğu gibi sebeplerden dolayı, yollarda gördüğümüz o meşhur markaların %90'ı sadece birkaç dev şirketin çatısı altında birleşmiş durumdadır. Gelin, hangi markanın aslında kime ait olduğuna, kaputun altındaki gizli genetik bağlara ve otomotiv dünyasının devasa aile ağacına birlikte göz atalım.",
          "warning": {
            "title": "Platform Kardeşliği",
            "text": "Bugün sıfır kilometre bir araç aldığınızda, aracınızın şasisi, motoru, şanzımanı ve hatta multimedya ekranı, rakip olarak gördüğünüz tamamen farklı logolu bir araçla birebir aynı olabilir. Buna otomotiv dilinde 'Ortak Platform Kullanımı' denir."
          }
        },
        {
          "type": "step",
          "title": "1. Volkswagen Group (VAG): Alman İmparatorluğu",
          "content": "Halkın arabası (Volkswagen) olarak yola çıkan marka, bugün otomotiv tarihinin en büyük ve en güçlü imparatorluklarından biri konumundadır. VAG (Volkswagen Aktiengesellschaft), sadece farklı bütçelere değil, aynı zamanda farklı sürüş karakterlerine hitap eden inanılmaz bir marka portföyüne sahiptir.",
          "subsections": [
            {
              "subtitle": "Ana Akım ve Premium Markalar",
              "text": "Sokakta sıkça karşılaştığımız Alman pratikliği **Volkswagen**, İspanyol ateşi **Seat** (ve onun performans odaklı alt markası **Cupra**), Çekyalı akılcı **Skoda** ve premium segmentin devlerinden **Audi**, bu grubun omurgasını oluşturur. VAG'ın meşhur MQB platformu sayesinde, bir Skoda Octavia, VW Golf ve Audi A3 aslında aynı fabrikasyon genetiği paylaşır."
            },
            {
              "subtitle": "Lüks, Performans ve Egzotik Markalar",
              "text": "İşi süper spor ve ultra lüks klasmana taşıdığımızda da Volkswagen'in ezici üstünlüğünü görüyoruz. Efsanevi spor otomobil üreticisi **Porsche**, İngiliz lüksünün zirvesi **Bentley**, İtalyan boğası **Lamborghini** ve hiper otomobil dünyasının kralı **Bugatti** (Bugatti-Rimac ortaklığıyla), doğrudan Volkswagen Grubu'nun teknoloji havuzundan beslenmektedir.",
              "points": [
                "**Biliyor muydunuz?** Lamborghini Urus, Porsche Cayenne, Audi Q8 ve Bentley Bentayga aynı platform (MLB Evo) üzerinde inşa edilmiştir."
              ]
            }
          ]
        },
        {
          "type": "step",
          "title": "2. Stellantis: Avrupa ve Amerika'nın Dev Evliliği",
          "content": "2021 yılında Fransız PSA grubu ile İtalyan-Amerikan FCA (Fiat Chrysler Automobiles) grubunun birleşmesiyle doğan Stellantis, tam 14 markayı tek çatı altına toplayarak dünyanın en büyük 4. otomotiv üreticisi konumuna yükselmiştir.",
          "subsections": [
            {
              "subtitle": "Fransız ve Alman Kanadı (Eski PSA)",
              "text": "Grubun bu kanadında aslan logolu **Peugeot**, konfor odaklı **Citroën**, Alman mühendisliği **Opel** (Vauxhall) ve Fransız lüksünü temsil eden **DS Automobiles** yer almaktadır."
            },
            {
              "subtitle": "İtalyan ve Amerikan Kanadı (Eski FCA)",
              "text": "İtalyan tarafında halk tipi **Fiat**, sportif **Alfa Romeo**, lüks spor **Maserati** ve yeniden doğmayı bekleyen **Lancia** bulunur. Okyanusun ötesinde ise Amerikan kaslarını temsil eden **Jeep**, **Chrysler**, **Dodge** ve **RAM** markaları bu dev ailenin üyeleridir."
            }
          ],
          "tip": {
            "title": "Stellantis Sinerjisi",
            "text": "Bugün bir Opel Corsa, Peugeot 208 ve DS 3 tamamen aynı altyapıyı (CMP platformu) ve motor seçeneklerini (1.2 PureTech) paylaşır. Bu birleşme, milyarlarca dolarlık Ar-Ge tasarrufu sağlamıştır."
          }
        },
        {
          "type": "step",
          "title": "3. Renault-Nissan-Mitsubishi İttifakı",
          "content": "Bu grup klasik bir 'şirket satın alması' veya tam birleşme değil, stratejik ve çapraz hisse sahipliğine dayanan bir ittifaktır (Alliance). Otomotiv tarihindeki en ilginç ve zaman zaman en çalkantılı ortaklıklardan biridir.",
          "subsections": [
            {
              "subtitle": "İttifakın Markaları",
              "text": "Fransız **Renault** ve Japon **Nissan**'ın başı çektiği bu ortaklık, 2016 yılında **Mitsubishi**'nin de gruba dahil olmasıyla küresel bir dev haline gelmiştir. Ortak platformlar (CMF) geliştirerek maliyetleri minimize ederler."
            },
            {
              "subtitle": "Alt Markalar ve Genişleme",
              "text": "Yollarda çokça gördüğümüz fiyat/performans kralı Romanyalı **Dacia** ve Rus otomotiv devi **Lada** da (yakın zamana kadar) Renault'nun himayesindeydi. Nissan'ın premium markası **Infiniti** ve Renault'nun motor sporları mirasını taşıyan **Alpine** de bu şemsiyenin altındadır.",
              "points": [
                "Dacia Duster ve Renault Megane, Nissan'ın geliştirdiği birçok motor ve şanzıman teknolojisini kullanır."
              ]
            }
          ]
        },
        {
          "type": "step",
          "title": "4. Geely: Ejderhanın Küresel Yükselişi",
          "content": "Çin otomotiv endüstrisinin dünyadaki en büyük ve en agresif gururu olan Geely (Zhejiang Geely Holding Group), otomotiv dünyasının dengelerini değiştiren müthiş bir satın alma stratejisi yürütmektedir.",
          "subsections": [
            {
              "subtitle": "Avrupa Çıkarması: Volvo ve Lotus",
              "text": "Güvenliğin kalesi İsveçli **Volvo**'yu Ford'dan satın alarak dünyayı şoke eden Geely, markaya milyarlarca dolar yatırım yaparak onu adeta yeniden yarattı. Bununla kalmayıp Volvo ile birlikte sadece elektrikli performans araçları üreten **Polestar**'ı kurdular. Efsanevi İngiliz spor otomobil markası **Lotus** da bugün Geely'nin finansal gücüyle elektrikli hiper otomobiller üretmektedir."
            },
            {
              "subtitle": "Stratejik Ortaklıklar",
              "text": "Geely, Londra'nın meşhur siyah taksilerini üreten **LEVC**'nin sahibidir. Ayrıca Mercedes-Benz Group'un en büyük hissedarlarından biridir ve ikonik şehir otomobili markası **Smart**'ın %50'sine sahiptir (Yeni nesil Smart araçları Geely platformunda Çin'de üretilmektedir). Kendi lüks elektrikli markası **Zeekr** ile de küresel pazarda ses getirmektedir."
            }
          ]
        },
        {
          "type": "step",
          "title": "5. Tata Motors: Hint Kaplanı'nın Lüks İştahı",
          "content": "Hindistan'ın en büyük devlerinden biri olan Tata Motors'un hikayesi, küresel ekonominin nasıl el değiştirdiğinin en güzel özetidir.",
          "subsections": [
            {
              "subtitle": "Jaguar Land Rover (JLR) Satın Alması",
              "text": "Tata Motors, Hindistan'da ürettiği ultra ucuz arabalarla (Tata Nano gibi) bilinirken, 2008 yılında yaşanan küresel kriz sırasında Ford'dan İngiliz aristokrasisinin simgesi olan **Jaguar** ve **Land Rover**'ı 2.3 milyar dolara satın alarak dünyayı şaşırttı. Başlangıçta bu hamleye şüpheyle yaklaşılsa da, JLR (Jaguar Land Rover) bugün Tata'nın finansal özgürlüğü sayesinde ayakta kalıp muazzam premium araçlar üretmeye devam etmektedir."
            }
          ]
        },
        {
          "type": "step",
          "title": "6. BMW, Mercedes ve General Motors: Çekirdek Aileler",
          "content": "Birçok farklı segmente yayılmış onlarca markayı yutan devlerin aksine, bazı büyük oyuncular daha odaklı ve 'çekirdek aile' olarak kalmayı tercih etmektedir.",
          "subsections": [
            {
              "subtitle": "BMW Grubu",
              "text": "Alman premium devinin bünyesinde sürüş dinamiklerinin sembolü **BMW**'nin yanı sıra, ikonik İngiliz markası **MINI** ve dünyanın en lüks, el yapımı otomobillerini üreten **Rolls-Royce** bulunmaktadır."
            },
            {
              "subtitle": "Mercedes-Benz Grubu",
              "text": "Geçmişte Chrysler ile başarısız bir evlilik (DaimlerChrysler) yaşayan marka, artık sadece kendi lüksüne ve performansına (**Mercedes-AMG**, **Mercedes-Maybach**) odaklanıyor. Şehir otomobili üreten **Smart** markasını ise Geely ile ortaklaşa yönetiyor."
            },
            {
              "subtitle": "General Motors (GM)",
              "text": "Bir zamanlar dünyanın en büyüğü olan Amerikan devi GM, Avrupa operasyonlarını (Opel) Stellantis'e satarak küçüldü. Şu an ağırlıklı olarak Kuzey Amerika ve Çin'e odaklı; bünyesinde **Chevrolet**, **Cadillac**, **GMC** ve **Buick** markalarını barındırıyor."
            }
          ]
        },
        {
          "type": "step",
          "title": "7. Uzak Doğu'nun Bağımsız Ruhları: Toyota, Hyundai ve Honda",
          "content": "Asyalı devler genellikle başka şirketleri satın almak yerine, kendi içlerinden yeni markalar doğurmayı veya organik büyümeyi tercih ederler.",
          "subsections": [
            {
              "subtitle": "Toyota Motor Corporation",
              "text": "Dünyanın en çok araç satan şirketi olan **Toyota**, 1989 yılında Amerikan premium pazarıyla rekabet edebilmek için lüks markası **Lexus**'u sıfırdan yarattı. Ayrıca küçük araç uzmanı **Daihatsu**, ticari araç markası Hino ve Subaru'da (%20 hisse) önemli paylara sahiptir."
            },
            {
              "subtitle": "Hyundai Motor Grubu",
              "text": "Koreli dev **Hyundai**, kardeşi **Kia** ile omuz omuza dünyayı fethediyor. İki marka aynı platformları kullansa da tasarımsal olarak birbirleriyle sıkı bir rekabet içindeler. Son yıllarda yarattıkları premium marka **Genesis** ile de Alman lükslerine kafa tutuyorlar."
            },
            {
              "subtitle": "Honda",
              "text": "Kendi başına ayakta duran nadir bağımsız Japon devlerinden biri olan **Honda**, Kuzey Amerika pazarındaki lüks algısını yönetmek için **Acura** markasıyla yola devam etmektedir."
            }
          ]
        },
        {
          "type": "conclusion",
          "title": "Sonuç: Otomotivin DNA'sı Birleşiyor",
          "content": "Otomotiv dünyasında artık 'safkan' bir marka bulmak çok zor. Ortak platformlar, devasa geliştirme maliyetlerini milyarlarca dolar düşürdüğü için yeni teknolojilerin (özellikle elektrikli ve otonom araçların) daha hızlı hayatımıza girmesini sağlıyor. Artık 'Alman arabası mı, Fransız arabası mı?' sorusu yerine, 'Hangi grubun platformu ve motor teknolojisi?' sorusunu sormanın vakti geldi.",
          "table": {
            "headers": ["Otomotiv Grubu", "Bünyesindeki Başlıca Markalar", "Genel Merkez"],
            "rows": [
              ["Volkswagen Grubu", "VW, Audi, Porsche, Skoda, Seat, Cupra, Bentley, Lamborghini, Bugatti", "Almanya"],
              ["Stellantis", "Peugeot, Citroën, Opel, Fiat, Alfa Romeo, Jeep, Maserati, Dodge, RAM, DS", "Hollanda (Çokuluslu)"],
              ["Renault-Nissan-Mitsubishi", "Renault, Nissan, Mitsubishi, Dacia, Alpine, Infiniti", "Fransa / Japonya"],
              ["Geely", "Geely, Volvo, Polestar, Lotus, Zeekr, LEVC, Smart (Ortak)", "Çin"],
              ["Toyota", "Toyota, Lexus, Daihatsu, Hino", "Japonya"],
              ["Hyundai Grubu", "Hyundai, Kia, Genesis", "Güney Kore"],
              ["BMW Grubu", "BMW, MINI, Rolls-Royce", "Almanya"],
              ["General Motors", "Chevrolet, Cadillac, GMC, Buick", "ABD"]
            ]
          },
          "finalChecklist": [
            "Bir otomobil alırken aynı motor ve altyapıyı kullanan diğer grup markalarının daha uygun fiyatlı olup olmadığını kontrol edin (Örn: Golf yerine Leon veya Octavia).",
            "Markaların kökenine değil, o modelin hangi grubun platformunda üretildiğine ve yedek parça bulunabilirliğine odaklanın.",
            "Parça fiyatları ararken, aracınızın grubundaki (örneğin Stellantis grubu) diğer markaların eşdeğer parçalarının fiyatlarını da mutlaka kıyaslayın."
          ]
        }
      ]
    };
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log('Update successful');
} else {
    console.log('Guide not found');
}
