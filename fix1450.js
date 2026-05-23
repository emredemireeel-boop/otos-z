const fs = require('fs');
const dataPath = 'data/otobutce-data.ts';
let content = fs.readFileSync(dataPath, 'utf8');

const newCars = [
    {
        id: "c-10-1",
        marka: "Opel / Peugeot",
        model: "Astra / 308 (1.2 Puretech)",
        yilAraligi: "2022 - 2023",
        yakitTipi: "Benzin",
        sanziman: "Otomatik",
        aciklama: "Yeni Nesil C Segmenti: Çok genç, tasarımı güncel ve donanımı zengin gerçek bir C segmenti. 1.2 Puretech motorun triger kayışı sorunları bu yeni kasalarda da mevcuttur.",
        ortalamaFiyat: 1450000
    },
    {
        id: "c-10-2",
        marka: "Citroen",
        model: "C4X (1.2 Turbo)",
        yilAraligi: "2023 - 2024",
        yakitTipi: "Benzin",
        sanziman: "Otomatik",
        aciklama: "Yerden Yüksek Sedan: Bagajı büyük, iç mekanı geniş ve donanımı oldukça iyidir. 10.000 - 25.000 km gibi çok düşük kilometrelerde bulunabilir.",
        ortalamaFiyat: 1480000
    },
    {
        id: "c-10-3",
        marka: "Ford",
        model: "Focus 4 (1.5 Dizel - Trend X)",
        yilAraligi: "2020 - 2022",
        yakitTipi: "Dizel",
        sanziman: "Otomatik",
        aciklama: "Sürüş Dinamikleri: 60.000 km civarında bulunabilen, Focus efsanesinin 4. neslidir. Bu bütçede Egea almak yerine C segmentine sağlam bir geçiş yapmaktır.",
        ortalamaFiyat: 1400000
    },
    {
        id: "c-10-4",
        marka: "Toyota",
        model: "Corolla (1.8 Hybrid - Dream)",
        yilAraligi: "2021 - 2023",
        yakitTipi: "Hibrit",
        sanziman: "Otomatik",
        aciklama: "Gerçek Sorunsuzluk ve Ekonomi: Normal 1.6 benzinlilerine göre çok daha mantıklıdır. Dream paketiyle dolu ve hibrit teknolojisiyle çok az yakan bir D segmenti hissiyatı sunar.",
        ortalamaFiyat: 1500000
    },
    {
        id: "c-10-5",
        marka: "Skoda",
        model: "Scala (1.0 TSI - Elite/Premium)",
        yilAraligi: "2023 - 2024",
        yakitTipi: "Benzin",
        sanziman: "Otomatik (DSG)",
        aciklama: "Mantık Arabası: 2023 model ve 30-40 bin km bandında, çok geniş iç hacimli, konforlu ve az yakan bir C segmenti alternatifidir.",
        ortalamaFiyat: 1450000
    },
    {
        id: "c-10-6",
        marka: "Chery",
        model: "Omoda 5 (Comfort)",
        yilAraligi: "2023 - 2024",
        yakitTipi: "Benzin",
        sanziman: "Otomatik",
        aciklama: "SUV Konforu ve Yüksek Donanım: 50.000 km civarında bulunabilen, tasarımı dikkat çekici ve 183 beygirlik performanslı bir SUV seçeneğidir.",
        ortalamaFiyat: 1420000
    }
];

const catId = "1450-1550k";
const regex = new RegExp(`(id:\\s*"${catId}"[\\s\\S]*?cars:\\s*\\[)([\\s\\S]*?)(\\]\\s*\\})`);
content = content.replace(regex, (match, p1, p2, p3) => {
    let carsStr = '';
    for (let i = 0; i < newCars.length; i++) {
        const car = newCars[i];
        carsStr += `      {
        id: "${car.id}",
        marka: "${car.marka}",
        model: "${car.model}",
        yilAraligi: "${car.yilAraligi}",
        yakitTipi: "${car.yakitTipi}",
        sanziman: "${car.sanziman}",
        aciklama: "${car.aciklama}",
        ortalamaFiyat: ${car.ortalamaFiyat}
      }${i === newCars.length - 1 ? '' : ','}\n`;
    }
    return p1 + '\n' + carsStr + '    ]  }';
});

content = content.replace(/\]\s*\}\s*\]/g, ']\n  }\n]');
fs.writeFileSync(dataPath, content);
console.log('Successfully injected 6 missing cars for 1450-1550k band.');
