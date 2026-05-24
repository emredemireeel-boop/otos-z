const fs = require('fs');

const dataToAdd = `
  "tofas": {
    "murat-131-124": {
      id: "murat-131-124",
      brand: "Tofaş",
      model: "Murat 131 / 124",
      description: "Temel ulaşım ihtiyacını karşılayan, parçası en bol ve ucuz klasik.",
      pros: ["Yedek parça sudan ucuz", "Her usta anlar", "LPG ile çok az yakar"],
      cons: ["Güvenlik yok denecek kadar az", "Kaporta çabuk çürür", "Konfor seviyesi düşük"],
      commonIssues: [
        { issue: "Hararet Problemi", severity: "high", details: "Radyatör ve fan sistemi düzenli kontrol edilmeli." },
        { issue: "Kaporta Çürükleri", severity: "medium", details: "Özellikle kapı altları ve şasede çürümeler olabilir." }
      ],
      expertOpinion: "Bu bütçede alacağınız aracın tek amacı sizi A noktasından B noktasına götürmektir. Motoru saat gibiyse gerisini çok dert etmeyin.",
      rating: 60,
      engines: [
        { name: "1.6 Benzinli", specs: { hp: 75, torque: 120, consumption: "8.5L", volume: "1581cc", cylinders: 4 } }
      ]
    },
    "dogan": {
      id: "dogan",
      brand: "Tofaş",
      model: "Doğan",
      description: "Geniş iç hacmi ve konforuyla döneminin efsanesi.",
      pros: ["Geniş iç hacim", "Süspansiyon konforu", "Parça ve usta bolluğu"],
      cons: ["Yüksek hızlarda güvensiz", "Arka lastiklerde aşınma", "Düşük çarpışma testi sonucu"],
      commonIssues: [
        { issue: "Diferansiyel Ötmesi", severity: "medium", details: "Tofaşların genel kronik sorunudur, yağ kontrolü şarttır." }
      ],
      expertOpinion: "Doğan, Şahin'e göre daha doludur. Hidrolik direksiyonlu modellerini (SLX vs) tercih etmeye çalışın.",
      rating: 62,
      engines: [
        { name: "1.6", specs: { hp: 86, torque: 130, consumption: "9.0L", volume: "1581cc", cylinders: 4 } }
      ]
    }
  },
  "skoda": {
    "favorit-forman": {
      id: "favorit-forman",
      brand: "Skoda",
      model: "Favorit / Forman",
      description: "Uygun fiyatlı aile kullanımı için ideal station wagon ve hatchback seçeneği.",
      pros: ["İç hacmi geniş", "Motoru VW grubuna yakın sağlamlıktadır", "Yakıtı ekonomiktir"],
      cons: ["Plastik kalitesi düşük", "Ses yalıtımı zayıf", "Hararet sorununa yatkın"],
      commonIssues: [
        { issue: "Hararet ve Conta Yakma", severity: "high", details: "Soğutma sistemi eski nesil olduğu için dikkat edilmeli." }
      ],
      expertOpinion: "Forman modeli özellikle köy yolları veya ufak çaplı yük taşıma işleri için bulunmaz nimettir.",
      rating: 61,
      engines: [
        { name: "1.3", specs: { hp: 58, torque: 94, consumption: "7.0L", volume: "1289cc", cylinders: 4 } }
      ]
    }
  },
  "renault": {
    "9-spring-broadway": {
      id: "9-spring-broadway",
      brand: "Renault",
      model: "9 (Spring / Broadway)",
      description: "Anadolu'nun efsanevi aracı. Masrafsız, az yakan, parçası ucuz bir halk otomobili.",
      pros: ["Yakıt cimrisi", "Ön takım sağlam", "Satışı çok hızlı"],
      cons: ["Direksiyon çok sert (hidrolik olmayanlar)", "Güvenlik donanımı yok", "İç mekan dar"],
      commonIssues: [
        { issue: "Karbüratör Tıkanıklığı", severity: "low", details: "LPG kullanımına bağlı karbüratör ayarı sık bozulabilir." }
      ],
      expertOpinion: "Broadway modelleri her zaman daha çok tutulur ve satışı daha rahattır. Motoru sağlamdır.",
      rating: 65,
      engines: [
        { name: "1.4", specs: { hp: 72, torque: 105, consumption: "7.5L", volume: "1397cc", cylinders: 4 } }
      ]
    },
    "11-flash-rainbow": {
      id: "11-flash-rainbow",
      brand: "Renault",
      model: "11 (Flash / Rainbow)",
      description: "Renault 9'un hatchback kardeşi. Döneminin spor çizgilerini taşıyan kullanışlı bir model.",
      pros: ["Motor çekişi fena değil", "Bagaj kullanımı pratik", "Ucuz yedek parça"],
      cons: ["Trim sesi çok fazladır", "Elektrik tesisatı yaşa bağlı olarak sıkıntı çıkarabilir", "Güvenlik zafiyeti"],
      commonIssues: [
        { issue: "Elektrik ve Gösterge Sorunları", severity: "medium", details: "Flash serisinde dijital göstergelerde oksitlenme olur." }
      ],
      expertOpinion: "Flash S modeli dönemine göre oldukça seri bir araçtır ancak şase yorgunluğuna dikkat edin.",
      rating: 63,
      engines: [
        { name: "1.7", specs: { hp: 90, torque: 135, consumption: "8.5L", volume: "1721cc", cylinders: 4 } }
      ]
    }
  },
  "ford": {
    "escort": {
      id: "escort",
      brand: "Ford",
      model: "Escort",
      description: "Zamanının şık tasarımlı ve tok sürüşlü araçlarından biri.",
      pros: ["Yol tutuşu iyidir", "Kasası sağlam hissiyat verir", "Zetec motorlar çok uzun ömürlüdür"],
      cons: ["Ön takım hassastır", "Elektronik ateşleme beyni arıza yapabilir", "Parçası Tofaş kadar ucuz değildir"],
      commonIssues: [
        { issue: "Ateşleme Bobini ve Beyin", severity: "medium", details: "Su alma durumunda beyin arıza verebilir." },
        { issue: "Rölanti Dalgalanması", severity: "medium", details: "Rölanti valfi kirlenmeye çok müsaittir." }
      ],
      expertOpinion: "Mümkünse EFI enjeksiyonlu ve Zetec motorlu modelleri tercih edin. CLX donanımı oldukça yeterlidir.",
      rating: 66,
      engines: [
        { name: "1.6 Zetec", specs: { hp: 90, torque: 130, consumption: "8.0L", volume: "1597cc", cylinders: 4 } }
      ]
    },
    "taunus": {
      id: "taunus",
      brand: "Ford",
      model: "Taunus",
      description: "Eski Amerikan arabası hissiyatı veren, arkadan itişli, geniş ve konforlu klasik.",
      pros: ["Muazzam konfor", "Arkadan itiş keyfi", "Heybetli görünüm"],
      cons: ["Çok fazla yakar", "Park etmesi zordur", "Çürümeye çok meyillidir"],
      commonIssues: [
        { issue: "Şaft Ötmesi", severity: "high", details: "Arkadan itişli olduğu için şaft istavrozu ve mafsallar aşınır." }
      ],
      expertOpinion: "Hafta sonu binmelik bir araçtır, günlük kullanımda yakıt tüketimi üzer.",
      rating: 60,
      engines: [
        { name: "1.6", specs: { hp: 73, torque: 115, consumption: "10.5L", volume: "1593cc", cylinders: 4 } },
        { name: "2.0", specs: { hp: 100, torque: 153, consumption: "12.0L", volume: "1993cc", cylinders: 4 } }
      ]
    }
  },
  "lada": {
    "samara": {
      id: "samara",
      brand: "Lada",
      model: "Samara",
      description: "Rus tankı lakaplı, gösterişsiz ama kemikli ve dayanıklı bir araç.",
      pros: ["Motoru çok sağlamdır", "Altı yüksektir, köy yoluna gelir", "Isıtma sistemi (kalorifer) çok güçlüdür"],
      cons: ["Konfor sıfıra yakındır", "Tasarımı çok köşelidir", "Süspansiyonlar serttir"],
      commonIssues: [
        { issue: "Fren Zayıflığı", severity: "high", details: "Fren sistemi döneminin diğer araçlarına göre bile hissizdir." }
      ],
      expertOpinion: "Dağa taşa vurmalık, kışın buzda karda banamısın demeyecek bir görev aracıdır.",
      rating: 64,
      engines: [
        { name: "1.5", specs: { hp: 71, torque: 106, consumption: "7.5L", volume: "1499cc", cylinders: 4 } }
      ]
    }
  },
  "fiat": {
    "uno": {
      id: "uno",
      brand: "Fiat",
      model: "Uno",
      description: "Şehir içi pratik kullanımı, park kolaylığı ve canlı motoruyla bilinen efsanevi hatchback.",
      pros: ["Şehir içinde park etmek çok kolay", "Motoru kasaya göre oldukça atiktir", "Yedek parçası bakkalda bile bulunur"],
      cons: ["İç plastik kalitesi çok kötüdür", "Ön düzen çabuk bozulur", "Uzun yolda yorar"],
      commonIssues: [
        { issue: "Ön Düzen ve Rotil", severity: "medium", details: "Kasislerde dikkat edilmezse ön takımı sık sık yenilemek gerekir." }
      ],
      expertOpinion: "Özellikle 70 S ve 70 SX modelleri en çok tutulan ve piyasası hızlı olanlardır. Öğrenciler ve yeni başlayanlar için idealdir.",
      rating: 67,
      engines: [
        { name: "1.4 i.e.", specs: { hp: 71, torque: 106, consumption: "7.0L", volume: "1372cc", cylinders: 4 } }
      ]
    }
  }
`;

let content = fs.readFileSync('data/vehicle-dna.ts', 'utf8');
const searchStr = "export const VEHICLE_DNA: Record<string, Record<string, VehicleDNA>> = {";
if (content.includes(searchStr)) {
  const parts = content.split(searchStr);
  const newContent = parts[0] + searchStr + "\n" + dataToAdd + "," + parts[1];
  fs.writeFileSync('data/vehicle-dna.ts', newContent);
  console.log("Vehicle DNA successfully injected.");
} else {
  console.log("Could not find VEHICLE_DNA export.");
}
