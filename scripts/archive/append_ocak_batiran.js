const fs = require('fs');

const data = JSON.parse(fs.readFileSync('./public/data/library_guides.json', 'utf8'));

const newGuide = {
  "id": "guide_ocaga_incir_agaci_diken_arabalar",
  "title": "Ocağınıza İncir Ağacı Dikecek Arabalar: Garibanın Uzak Durması Gereken 10 Model",
  "description": "Konforuna, duruşuna veya performansına kanıp ucuza aldığınızı sandığınız ama benzinlikte sizi ağlatacak o meşhur 10 araç. Pompacıyla kanka olmadan önce bu listeyi mutlaka okuyun!",
  "minutes": 8,
  "difficulty": "Eğlenceli/Gerçekçi",
  "tags": [
    "Yakıt Tüketimi",
    "Tasarruf",
    "Tavsiye",
    "İkinci El",
    "Maliyet"
  ],
  "author": "OtoSöz Sanayi Gurmesi",
  "sections": [
    {
      "type": "intro",
      "title": "Giriş: Arabanın Hizmetkarı Olmak",
      "content": "Selam dostlar! Araba fiyatlarının uçtuğu şu dönemde kısıtlı bütçeyle araç bakıyorsanız, sadece satın alma fiyatına aldanmak yapacağınız en büyük hata olur. 'Ucuza kocaman, lüks araba buldum' diye sevinirken, aslında evinize bir hortum bağladığınızın farkına varamayabilirsiniz. Hele ki kısıtlı bir bütçeyle, tabiri caizse 'gariban' işi bir araç arayışındaysanız, az sonra sayacağımız modellere çok ama çok dikkat etmelisiniz. Aksi takdirde araba sizin değil, siz arabanın hizmetkarı olursunuz; ocağınıza incir ağacını öyle bir diker ki ruhunuz duymaz! İşte konforuna ya da performansına aldanıp ocağınızı batırabilecek o meşhur 10 araç:"
    },
    {
      "type": "step",
      "title": "10. Opel Insignia (1.6 Turbo, 170 Hp) - 11 Litre",
      "content": "Konforlu mu? Evet. Geniş mi? Kesinlikle. Gaza basınca uzuyor mu? Hem de nasıl! Ama o kaputun altındaki turbonun faturası ağır dostlar. Şehir içi trafiğinde dur-kalk yaparken benzin ibresinin gözünüzün önünde nasıl yavaş yavaş düştüğünü izlemek, o lüks makam aracı hissini bir anda yok ediveriyor. Yakıt parası yüzünden klimayı açmaya korkabilirsiniz."
    },
    {
      "type": "step",
      "title": "9. Chery Tiggo 7 ve 8 Pro (1.6 Turbo, 183 Hp) - 12 Litre",
      "content": "Son dönemin açık ara en popüler ve havalı SUV'ları! İçerisi uzay mekiği gibi, donanım gani, gösteriş zirvede. Ama o koca kasayı ve 183 beygirlik performansı havayla besleyemezsiniz. 12 litreleri gözden çıkarmadan bu ihtişamın tadını sürmek imkansız. Araç sizi konforuyla mest ederken, tüketimiyle derin düşüncelere daldırır."
    },
    {
      "type": "step",
      "title": "8. Kia Sportage (1.6 Atmosferik, 135 Hp) - 13 Litre",
      "content": "'Atmosferik motor bozulmaz, masraf çıkarmaz' diyerek alırsınız ama işin rengi yolda değişir. O ağır kasayı 1.6 litrelik atmosferik bir motorla yürütmeye çalışmak tam bir işkencedir. Motor resmen arabayı çekebilmek için benzini içer. Özellikle dik bir yokuşta gaza yüklendiğinizde, arkadan deponun hıçkıra hıçkıra ağladığını duyabilirsiniz."
    },
    {
      "type": "step",
      "title": "7. Opel Vectra B (2.0, 136 Hp) - 13 Litre",
      "content": "Ah o 90'ların sonu, 2000'lerin başının efsanesi... O tok kapı sesi, yola o muazzam oturuşu harikadır ama Vectra B, tam bir 'Sanayi Dostu'dur. Hem yakıtı su gibi içer hem de kronik elektronik sorunlarıyla sanayideki ustalarla aranızda sarsılmaz, ebedi bir dostluk kurdurur. Gülü seven dikenine, Vectra'yı seven sanayi masrafına katlanır."
    },
    {
      "type": "step",
      "title": "6. Chevrolet Captiva (2.0 Dizel, 150 Hp) - 13 Litre",
      "content": "Listemizde dizel olmasına rağmen bu kadar çok yakan nadir araçlardan biri, nam-ı diğer 'Ölüm Makinesi'. 7 kişilik devasa cüssesi, sürekli dört çeker sistemi ve eski nesil hantal motor teknolojisiyle yakıt konusunda tam bir yıkım projesi. Dizel ucuza gelir diye düşünürken mazot ibresiyle her gün ölüm kalım savaşı verebilirsiniz."
    },
    {
      "type": "step",
      "title": "5. Renault Laguna (2.0, 140 Hp) - 14 Litre",
      "content": "Zamanının Fransız makam aracı kıvamındaki konfor abidesi... O pofuduk geniş koltuklarına gömülüp yolculuk yapmak harikadır. Ta ki yol bilgisayarında şehir içi 14 litre ortalamayı görene kadar. O andan itibaren o pamuk gibi rahat koltuklar size batmaya, direksiyon ağırlaşmaya başlar. Lüks hissiyatı yüksektir ama yakıt faturası ondan da yüksektir."
    },
    {
      "type": "step",
      "title": "4. Volkswagen Passat (2.0 FSI, 150 Hp) - 14 Litre",
      "content": "FSI motorun LPG ile olan destansı uyumsuzluğu ve benzini lıkır lıkır içme huyu sebebiyle piyasada haklı olarak 'Ocak Batıran' unvanını almıştır. Dışarıdan baktığınızda kusursuz bir Passat karizması sunar, prestijlidir ama kullanım maliyeti olarak Porsche masrafıyla kapışır! İkinci elde uygun fiyata görünce iki kere düşünün."
    },
    {
      "type": "step",
      "title": "3. Ford Mondeo (2.0, 145 Hp) - 14 Litre",
      "content": "Yol tutuş canavarı, D segmentinin tankı! Mondeo virajda yola bir yapıştı mı asla kopmaz. Ama maalesef benzin pompasına da aynı sadakatle yapışır. Konforlu, güvenli ve son derece oturaklı bir şekilde cüzdanınızı tahliye eder. Uzun yolda uçak gibidir ama şehir içi sıkışık trafikte tam bir ekonomik çiledir."
    },
    {
      "type": "step",
      "title": "2. Toyota Avensis (2.0, 147 Hp) - 15 Litre",
      "content": "'Toyota bozulmaz, masrafsızdır' efsanesi bu 2.0 litrelik modelde yakıt açısından maalesef çöküyor. Gerçekten de tamirhaneye kolay kolay gitmezsiniz, araba saat gibidir. Ama tamirciye vermediğiniz o parayı fazlasıyla benzinliğe ödersiniz. Şehir içinde 15 litreyle gezerken Avensis'in o muhteşem yalıtımı ve sessizliğinin tadı ağzınızda biraz acı bir tat bırakabilir."
    },
    {
      "type": "step",
      "title": "1. Fiat Marea (2.0, 154 Hp) - 15 Litre (ŞAMPİYON)",
      "content": "Ve karşınızda listenin mutlak kralı! İtalyan mühendislerin 'Performans olsun, yakıtı kim takar yahu!' diyerek ürettiği efsanevi 2.0 litrelik, 5 silindirli HGT canavarı. O 5 silindirin egzozdan çıkardığı hırçın ses muazzamdır, araba resmen uçar. Ama kontağı her çevirdiğinizde cüzdanınızdan da bir miktar nakit gökyüzüne doğru uçar. Bu arabaya hafta içi her gün günlük binmek ciddi bir cesaret veya sınırsız bir bütçe işidir!"
    },
    {
      "type": "conclusion",
      "title": "Son Söz: Pompacıyla Kanka Olmayın",
      "content": "Eğer bütçeniz kısıtlıysa ve 'Ayağımı yerden kessin, başımı da ağrıtmasın' diyorsanız; sırf ikinci elde fiyatı uygun diye performansa, devasa kasalara veya D segmentinin konforuna kanıp bu araçlara yaklaşırken iki defa düşünün. Tabii ki bunlardan çok daha fazla yakan 4.0 motorlu devasa araçlar da var ancak 'standart binici' klasmanında, özellikle de sınırlı bütçeyle yola çıkanlar için bu liste tam bir saatli bomba niteliğinde.\n\nAllah'a emanet olun, pompacıyla kanka olmamak için almadan önce yakıt verilerini araştırmayı ve ayağınızı gazdan çekmeyi unutmayın. Bir sonraki rehberde görüşmek üzere!",
      "finalChecklist": [
        "Sırf 'D segmenti' veya 'ucuz' diye eski nesil 2.0 motorlara atlamayın.",
        "Kasa ağırlığı ile motor gücünün orantısız olduğu araçlardan (1.6 atmosferik ağır SUV'lar) uzak durun.",
        "Turbo beslemeli ağır araçların dur-kalk trafikte 12 litreleri rahatça görebileceğini unutmayın."
      ]
    }
  ],
  "urlId": 10039
};

// Insert at the beginning of the guides array so it shows up first
data.guides.unshift(newGuide);

fs.writeFileSync('./public/data/library_guides.json', JSON.stringify(data, null, 2));
console.log('Successfully appended Ocaga Incir Agaci Diken Arabalar to library_guides.json!');
