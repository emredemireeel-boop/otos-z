const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../public/data/library_guides.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const guideIndex = data.guides.findIndex(g => g.id === "guide_dunya_lider_otomotiv_gruplari");

if (guideIndex !== -1) {
    data.guides[guideIndex] = {
      "id": "guide_dunya_lider_otomotiv_gruplari",
      "title": "Hangi Marka Kimin? Dünyanın Lider Otomotiv Grupları ve Gizli Ortaklıklar (Ultra Kapsamlı Rehber)",
      "description": "Sadece logolara bakarak farklı markalar aldığınızı mı düşünüyorsunuz? Otomotiv tarihindeki devasa satın almalar, perde arkasındaki platform ve motor paylaşımları, iflaslar ve teknoloji evlilikleri... Otomotiv dünyasının tüm karanlık ve aydınlık sırlarını deşifre ediyoruz.",
      "minutes": 25,
      "difficulty": "Tüm Sürücüler",
      "tags": [
        "Otomotiv Grupları",
        "Markalar",
        "Endüstri",
        "Tarihçe",
        "Genel Kültür",
        "Stellantis",
        "Volkswagen",
        "Geely",
        "Otomotiv Sırları"
      ],
      "author": "OtoSöz Endüstri Analisti",
      "sections": [
        {
          "type": "intro",
          "title": "İllüzyona Hoş Geldiniz: Yüzlerce Marka, Birkaç Küresel Patron",
          "content": "Sokakta yürürken onlarca farklı otomobil markası görüyorsunuz. Tasarımları, motor sesleri, hitap ettikleri kitleler ve hatta menşei ülkeleri bile tamamen farklı görünüyor. Alman disiplini, İtalyan tutkusu, Amerikan kası veya Japon dayanıklılığı... Ancak arka planda dönen oyun çok daha büyük ve karmaşıktır.\n\nGünümüzün acımasız rekabet koşullarında, milyarlarca dolarlık Ar-Ge bütçeleri, giderek sıkılaşan emisyon regülasyonları ve elektrifikasyon (EV) devriminin getirdiği devasa maliyetler nedeniyle otomotiv dünyasında tamamen 'bağımsız' kalabilmek neredeyse imkansızdır. Yollarda gördüğümüz o meşhur markaların yaklaşık %90'ı, sadece birkaç devasa küresel şirketin çatısı altında toplanmıştır.\n\nGelin, kaputun altındaki gizli genetik bağlara, kimin kimi yuttuğuna, efsanevi markaların nasıl el değiştirdiğine ve otomotiv dünyasının devasa aile ağacına birlikte göz atalım.",
          "warning": {
            "title": "Platform ve Motor Kardeşliği",
            "text": "Bugün sıfır kilometre premium bir araç aldığınızda, aracınızın şasisi, motor bloku, şanzımanı ve hatta multimedya ekran altyapısı, yarı fiyatına satılan ana akım bir markanın aracıyla birebir aynı olabilir. Buna otomotiv dilinde 'Ortak Platform Kullanımı' denir ve sektörün hayatta kalma sırrıdır."
          }
        },
        {
          "type": "step",
          "title": "1. Volkswagen Group (VAG): Dünyayı Yöneten Alman İmparatorluğu",
          "content": "Halkın arabası (Volkswagen) mottosuyla yola çıkan marka, Ferdinand Piëch'in agresif vizyonu sayesinde bugün otomotiv tarihinin en büyük ve en güçlü imparatorluklarından biri konumundadır. VAG (Volkswagen Aktiengesellschaft), Avrupa pazarının mutlak hakimidir.",
          "subsections": [
            {
              "subtitle": "Ana Akım ve Premium: MQB Efsanesi",
              "text": "Sokakta sıkça karşılaştığımız Alman pratikliği **Volkswagen**, İspanyol ateşi **Seat** (ve sportif alt markası **Cupra**), Çekyalı genişlik kraliçesi **Skoda** ve premium segmentin teknoloji öncüsü **Audi**, bu grubun omurgasını oluşturur. VAG'ın meşhur **MQB platformu** ve efsanevi **EA888 motoru** sayesinde; bir Skoda Octavia, VW Golf, Seat Leon ve Audi A3 aslında aynı fabrikanın farklı elbiseler giydirilmiş çocuklarıdır."
            },
            {
              "subtitle": "Lüks, Performans ve Egzotik Markalar",
              "text": "İşi süper spor ve ultra lüks klasmana taşıdığımızda da Volkswagen'in ezici üstünlüğünü görüyoruz. Efsanevi spor otomobil üreticisi **Porsche**, İngiliz lüksünün zirvesi **Bentley**, İtalyan boğası **Lamborghini** ve hiper otomobil dünyasının kralı **Bugatti** (Bugatti-Rimac ortaklığıyla), doğrudan Volkswagen Grubu'nun teknoloji havuzundan beslenmektedir. Ayrıca motosiklet devi **Ducati** ve ticari araç devleri **Scania** ile **MAN** da VAG çatısı altındadır.",
              "points": [
                "**Biliyor muydunuz?** 2008 krizinde küçük Porsche, devasa Volkswagen'i satın almaya çalışmış ancak finansal olarak batmanın eşiğine gelince tam tersi olmuş ve VW, Porsche'yi yutmuştur.",
                "Lamborghini Urus, Porsche Cayenne, Audi Q8 ve Bentley Bentayga aynı platform (MLB Evo) üzerinde inşa edilmiştir. Şasileri aynı fabrikadan (Slovakya Bratislava) çıkar."
              ]
            }
          ]
        },
        {
          "type": "step",
          "title": "2. Stellantis: Avrupa ve Amerika'nın Tarihi Evliliği",
          "content": "Ocak 2021'de tamamlanan ve otomotiv dünyasında deprem etkisi yaratan birleşme ile Fransız PSA grubu ve İtalyan-Amerikan FCA (Fiat Chrysler Automobiles) grubu birleşti. Ortaya, 14 farklı markayı tek çatı altında toplayan devasa Stellantis çıktı.",
          "subsections": [
            {
              "subtitle": "Fransız ve Alman Kanadı (Eski PSA)",
              "text": "Grubun Avrupa'yı domine eden tarafında aslan logolu **Peugeot**, konfor ve ilginç tasarım odaklı **Citroën**, eski General Motors markası olan Alman **Opel** (Vauxhall) ve Fransız avant-garde lüksünü temsil eden **DS Automobiles** yer almaktadır."
            },
            {
              "subtitle": "İtalyan ve Amerikan Kanadı (Eski FCA)",
              "text": "İtalyan tarafında A ve B segmentinin hakimi **Fiat**, sportif sürüş dinamikleriyle **Alfa Romeo**, lüks spor **Maserati** ve premium tarafta yeniden doğmayı bekleyen efsane **Lancia** ile modifiye ustası **Abarth** bulunur. Okyanusun ötesinde ise koca motorlu Amerikan kaslarını temsil eden **Jeep**, **Chrysler**, **Dodge** ve devasa pikap üreticisi **RAM** markaları bu büyük ailenin üyeleridir."
            }
          ],
          "tip": {
            "title": "Stellantis Sinerjisi (EMP2 ve CMP)",
            "text": "Bugün bir Opel Corsa, Peugeot 208, Citroën C3 ve Lancia Ypsilon tamamen aynı altyapıyı (CMP platformu) ve motor seçeneklerini (Örn: 1.2 PureTech) paylaşır. Bu birleşme, Carlos Tavares yönetiminde milyarlarca dolarlık Ar-Ge tasarrufu sağlamış ve grubun elektrikli araçlara (STLA platformları) devasa yatırımlar yapmasının önünü açmıştır."
          }
        },
        {
          "type": "step",
          "title": "3. Renault-Nissan-Mitsubishi İttifakı",
          "content": "Bu grup klasik bir 'şirket satın alması' veya tam birleşme değil, stratejik ve çapraz hisse sahipliğine dayanan bir ittifaktır (Alliance). Hikayesi, Carlos Ghosn'un şirketi kurtarması ve sonrasında Japonya'dan bir müzik kutusu içinde kaçmasıyla Hollywood filmlerini aratmayan bir dramaya sahiptir.",
          "subsections": [
            {
              "subtitle": "İttifakın Markaları ve Platform Kardeşliği",
              "text": "Fransız **Renault** ve Japon **Nissan**'ın başı çektiği bu ortaklık, 2016 yılında zor durumdaki **Mitsubishi**'nin de gruba dahil olmasıyla küresel bir dev haline gelmiştir. **CMF (Common Module Family)** platformu sayesinde bir Renault Kadjar/Austral ile Nissan Qashqai şasi ve motor teknolojilerini paylaşır."
            },
            {
              "subtitle": "Alt Markalar ve Efsanevi Motor",
              "text": "Yollarda çokça gördüğümüz fiyat/performans kralı Romanyalı **Dacia** ve Rus otomotiv devi **Lada** (AvtoVAZ - Rusya ambargosuna kadar) Renault'nun himayesindeydi. Nissan'ın premium markası **Infiniti** ve Renault'nun motor sporları mirasını taşıyan **Alpine** de bu şemsiyenin altındadır.",
              "points": [
                "**1.5 dCi Efsanesi:** Renault'nun geliştirdiği 1.5 dCi (K9K) dizel motor o kadar başarılı ve verimliydi ki, Nissan ve Dacia modellerinin yanı sıra bir dönem **Mercedes-Benz** A, B, CLA serilerinde ve ticari Citan modellerinde bile (OM607 koduyla) kullanılmıştır."
              ]
            }
          ]
        },
        {
          "type": "step",
          "title": "4. Geely: Çin Ejderhasının Küresel İstilası",
          "content": "Zhejiang Geely Holding Group (Kısaca Geely), Li Shufu tarafından kurulan ve Çin otomotiv endüstrisinin dünyadaki en agresif ve vizyoner temsilcisidir. Avrupalı rakiplerini kopyalamak yerine, onları doğrudan satın alma stratejisini benimsemiştir.",
          "subsections": [
            {
              "subtitle": "Avrupa Çıkarması: Volvo, Lotus ve Ötesi",
              "text": "2010 yılında, güvenliğin kalesi İsveçli **Volvo**'yu Ford'dan sadece 1.8 milyar dolara satın alarak dünyayı şoke eden Geely, markanın iç işlerine karışmadan milyarlarca dolar yatırım yaptı. Bugün Volvo tarihinin en parlak dönemini yaşıyor. Geely bununla kalmayıp Volvo ile ortaklaşa tamamen elektrikli premium performans markası **Polestar**'ı ve yenilikçi mobilite markası **Lynk & Co**'yu kurdu. Ayrıca ikonik İngiliz hiper otomobil efsanesi **Lotus** da Geely'nin finansal gücüyle elektrik devrimine öncülük etmektedir."
            },
            {
              "subtitle": "Mercedes Ortaklığı ve Taksi İmparatorluğu",
              "text": "Geely, Londra'nın meşhur siyah taksilerini üreten **LEVC**'nin tamamına sahiptir. Daha da ilginci Li Shufu, Mercedes-Benz Group'un (%9.6) en büyük bireysel hissedarlarından biridir. Bu sayede ikonik şehir otomobili markası **Smart**'ı Mercedes ile %50-%50 ortak girişime dönüştürerek markayı baştan yarattılar. Ayrıca kendi ultra lüks teknoloji markası **Zeekr** ile Porsche ve Tesla gibi devlere doğrudan kafa tutmaktadır."
            }
          ]
        },
        {
          "type": "step",
          "title": "5. Ford ve General Motors: Zayıflayan Amerikan Devleri",
          "content": "Bir zamanlar dünyanın tartışmasız en büyük şirketleri olan Amerikan devleri, değişen tüketici trendleri ve krizler nedeniyle küresel hakimiyetlerini daraltıp daha kârlı olan Kuzey Amerika pazarına odaklanmayı seçtiler.",
          "subsections": [
            {
              "subtitle": "Ford Motor Company: Küçülerek Büyümek",
              "text": "Ford, 2000'li yılların başında 'Premier Automotive Group' adı altında **Volvo**, **Aston Martin**, **Jaguar** ve **Land Rover** markalarına sahipti. Ancak 2008 kriziyle birlikte nakit yaratmak için tüm bu efsaneleri sattı (Volvo Geely'ye, JLR Tata'ya, Aston Martin yatırımcılara). Bugün Ford; ticari araçları, pick-up'ları (F-150 efsanesi), Mustang ve Bronco serileri ile premium kanadında sadece **Lincoln** markasına odaklanmıştır."
            },
            {
              "subtitle": "General Motors (GM): Ana Kıtaya Dönüş",
              "text": "Yıllarca dünyanın en büyük otomotiv şirketi ünvanını taşıyan GM, Avrupa'yı tamamen terk etme kararı alarak ikonik Alman markası Opel'i PSA (Stellantis) grubuna sattı. Avustralya'daki meşhur markası Holden'i kapattı. Şu an ağırlıklı olarak Kuzey Amerika ve Çin'de varlık gösteriyor. Bünyesinde **Chevrolet**, efsanevi lüks marka **Cadillac**, pick-up ve SUV devi **GMC** ve Çin'de çok popüler olan **Buick** markalarını barındırmaktadır."
            }
          ]
        },
        {
          "type": "step",
          "title": "6. Tata Motors: Hint Kaplanı'nın Lüks İştahı",
          "content": "Eski İngiliz sömürgesi olan Hindistan'ın en büyük devlerinden biri olan Tata Motors'un İngiliz lüksünü satın alma hikayesi, küresel ekonomik gücün Doğu'ya nasıl kaydığının en çarpıcı özetidir.",
          "subsections": [
            {
              "subtitle": "Jaguar Land Rover (JLR) Kurtarışı",
              "text": "Tata Motors, Hindistan'da ürettiği ultra ucuz ve dünyanın en ucuz arabası olan Tata Nano ile bilinirken, 2008 yılında Ford'dan İngiliz aristokrasisinin simgesi olan **Jaguar** ve **Land Rover**'ı nakit 2.3 milyar dolara satın alarak dünyayı şaşırttı. Tata, bu İngiliz markalarına tam özerklik ve devasa bir Ar-Ge bütçesi vererek, JLR'ın küresel pazarda muazzam araçlar (Range Rover serileri, Defender vb.) üretmeye devam etmesini sağlamıştır."
            }
          ]
        },
        {
          "type": "step",
          "title": "7. BMW ve Mercedes: Tavizsiz Alman Premiumları",
          "content": "Birçok farklı segmente yayılmış düzinelerce markayı yutan devlerin (VAG veya Stellantis) aksine, Alman premium devleri daha odaklı ve 'çekirdek aile' olarak kalarak kârlılığı maksimize etmeyi tercih etmektedir.",
          "subsections": [
            {
              "subtitle": "BMW Grubu",
              "text": "Münihli premium devi; sürüş dinamiklerinin sembolü çekirdek marka **BMW**'nin yanı sıra, genç ve şehirli İngiliz ikonu **MINI**'yi ve dünyanın gelmiş geçmiş en prestijli, el yapımı ultra lüks otomobillerini üreten **Rolls-Royce** markasını bünyesinde bulundurmaktadır."
            },
            {
              "subtitle": "Mercedes-Benz Grubu",
              "text": "Geçmişte Amerikan Chrysler ile başarısız ve milyarlarca dolara mâl olan bir 'eşitler evliliği' (DaimlerChrysler) yaşayan marka, o defteri kapattı. Artık sadece kendi lüksüne ve ekstrem performans bölümlerine (**Mercedes-AMG**, **Mercedes-Maybach**, **G-Class**) odaklanıyor. Gruba ait olan ağır vasıta bölümünü (Daimler Truck) ayrı bir şirket yaptı. Şehir otomobili **Smart**'ı ise Geely ile paylaşıyor."
            }
          ]
        },
        {
          "type": "step",
          "title": "8. Uzak Doğu'nun Gücü: Toyota, Hyundai ve Bağımsız Çinliler",
          "content": "Asyalı devler genellikle başka şirketleri satın almak yerine, kendi içlerinden yeni markalar doğurmayı veya ulusal ekosistemler yaratmayı tercih ederler.",
          "subsections": [
            {
              "subtitle": "Toyota Motor Corporation: Dünyanın Bir Numarası",
              "text": "Dünyanın en çok araç üreten ve satan şirketi olan **Toyota**, sağlamlık felsefesiyle dünyayı fethetti. 1989 yılında Amerikan pazarında Almanlarla rekabet edebilmek için lüks markası **Lexus**'u sıfırdan yarattı. Ayrıca küçük araç uzmanı **Daihatsu** ve ticari araç markası **Hino**'nun tam sahibidir. Spor otomobil cephesinde ise **Subaru**'nun %20'sine sahiptir (Bu yüzden Toyota GR86 ile Subaru BRZ ikiz kardeştir)."
            },
            {
              "subtitle": "Hyundai Motor Grubu: İnanılmaz Yükseliş",
              "text": "Koreli dev **Hyundai**, %33 hissesine sahip olduğu ancak piyasada rakip gibi konumlandırdığı kardeşi **Kia** ile omuz omuza dünyayı domine ediyor. İki marka ortak E-GMP elektrikli platformunu kullanıyor. Son yıllarda yarattıkları premium marka **Genesis** ile de kalite anlamında Alman lükslerine kafa tutar hale geldiler."
            },
            {
              "subtitle": "Honda ve Çinli Bağımsızlar",
              "text": "Nadir bağımsız Japon devlerinden biri olan **Honda**, lüks algısını **Acura** markasıyla yönetiyor. Çin cephesinde ise Geely haricinde devasa oyuncular var: Devlet destekli **SAIC** (Eski İngiliz markası **MG**'nin ve **Maxus**'un sahibi) ve tamamen organik büyüyerek dünyanın en büyük elektrikli araç üreticisi konumuna yükselen, batarya mucidi **BYD**."
            }
          ]
        },
        {
          "type": "step",
          "title": "9. Endüstrinin En Büyük Sırrı: Çapraz Ortaklıklar",
          "content": "Peki markalar birbirini satın almadan da parça paylaşabilir mi? Otomotiv dünyasında düşmanlık yoktur, kâr marjı vardır. İşte herkesin bilmediği bazı gizli işbirlikleri:",
          "subsections": [
            {
              "subtitle": "Gizli Evlilikler",
              "text": "Milyarlarca dolarlık Ar-Ge bütçelerini kısmak için ezeli rakipler bile masaya oturur.",
              "points": [
                "**Toyota Supra & BMW Z4:** Efsanevi Japon ikonu Toyota Supra'nın yeni nesli, aslında BMW Z4 altyapısı, B58 kodlu BMW motoru ve ZF şanzımanı kullanılarak Avusturya'da Magna Steyr fabrikasında üretilir. İç mekandaki tuşlar bile BMW'dir.",
                "**Aston Martin & Mercedes-AMG:** James Bond'un efsanevi İngiliz arabası Aston Martin modellerinin (Vantage, DB11) kaputunun altında ve multimedya ekranında Alman Mercedes-AMG teknolojisi yatmaktadır.",
                "**Toyota & Suzuki / Mazda:** Avrupa'daki emisyon kurallarını aşmak için Suzuki Swace modeli aslında sadece logosu değiştirilmiş bir Toyota Corolla Station Wagon'dur."
              ]
            }
          ]
        },
        {
          "type": "conclusion",
          "title": "Sonuç: Otomotivin DNA'sı Küreselleşti",
          "content": "Otomotiv dünyasında artık 'safkan' bir marka bulmak teknik olarak çok zordur. Ortak platformlar, devasa geliştirme maliyetlerini milyarlarca dolar düşürdüğü için yeni teknolojilerin, güvenlik sistemlerinin ve özellikle otonom sürüş yeteneklerinin daha hızlı hayatımıza girmesini sağlıyor.\n\nArtık bir bayiide araç seçerken 'Alman arabası mı, Fransız arabası mı, Çin arabası mı?' sorusu yerine, 'Hangi grubun platformu ve motor teknolojisi?' sorusunu sormanın vakti geldi.",
          "table": {
            "headers": ["Otomotiv Grubu", "Bünyesindeki Başlıca Markalar", "Genel Merkez"],
            "rows": [
              ["Volkswagen Grubu", "VW, Audi, Porsche, Skoda, Seat, Cupra, Bentley, Lamborghini, Bugatti, Ducati", "Wolfsburg, Almanya"],
              ["Stellantis", "Peugeot, Citroën, Opel, Fiat, Alfa Romeo, Jeep, Maserati, Dodge, RAM, DS, Lancia", "Hollanda (Çokuluslu)"],
              ["Renault-Nissan-Mitsubishi", "Renault, Nissan, Mitsubishi, Dacia, Alpine, Infiniti", "Paris / Yokohama"],
              ["Geely (Zhejiang)", "Geely, Volvo, Polestar, Lotus, Zeekr, LEVC, Smart (%50)", "Hangzhou, Çin"],
              ["Toyota Motor Corp.", "Toyota, Lexus, Daihatsu, Hino", "Toyota Şehri, Japonya"],
              ["Hyundai Grubu", "Hyundai, Kia, Genesis", "Seul, Güney Kore"],
              ["BMW Grubu", "BMW, MINI, Rolls-Royce", "Münih, Almanya"],
              ["General Motors", "Chevrolet, Cadillac, GMC, Buick", "Detroit, ABD"],
              ["Ford Motor Company", "Ford, Lincoln", "Dearborn, ABD"],
              ["Tata Motors", "Tata, Jaguar, Land Rover (JLR)", "Mumbai, Hindistan"],
              ["SAIC Motor", "MG, Maxus, Roewe", "Şanghay, Çin"]
            ]
          },
          "finalChecklist": [
            "Premium bir araç için fazla ödeme yapmadan önce, o aracın motorunu veya platformunu kullanan daha uygun fiyatlı 'kardeş' modelleri inceleyin (Örn: Audi A3 yerine VW Golf veya Skoda Octavia).",
            "Yedek parça satın alırken, kutunun üzerinde başka bir markanın amblemi olsa da (Örn: Stellantis grubu parçası) aracınıza birebir uyumlu olabileceğini unutmayın.",
            "Otomobil markalarının 'ülke' algısına takılıp kalmayın. Çinli bir Geely olan Volvo dünyanın en güvenli arabalarını İsveç mühendisliğiyle geliştirirken, Amerikan Ford birçok Avrupa modelini Almanya'da tasarlamaktadır."
          ]
        }
      ]
    };
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log('Update successful');
} else {
    console.log('Guide not found');
}
