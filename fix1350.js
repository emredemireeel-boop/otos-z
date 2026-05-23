const fs = require('fs');
const dataPath = 'data/otobutce-data.ts';
let content = fs.readFileSync(dataPath, 'utf8');

const newCars = [
    {
        id: "c-9-1",
        marka: "Fiat",
        model: "Egea Cross (1.6 Multijet Otomatik)",
        yilAraligi: "2022 - 2024",
        yakitTipi: "Dizel",
        sanziman: "Otomatik",
        aciklama: "Uzmanların 1 Numaralı Tercihi: Hem yerden yüksek tasarımı (Crossover hissi) hem güçlü 1.6 Multijet motoru hem de düşük kilometreli bulunabilmesiyle bu bütçenin en mantıklı seçeneğidir.",
        ortalamaFiyat: 1300000
    },
    {
        id: "c-9-2",
        marka: "Opel",
        model: "Astra K Kasa (1.6 Dizel Otomatik)",
        yilAraligi: "2018 - 2020",
        yakitTipi: "Dizel",
        sanziman: "Otomatik",
        aciklama: "C Segmenti Alman Mantığı: Bu bütçede hala düşük kilometreli bulunabilen, donanımlı ve sürüşü oldukça keyifli gerçek bir C segmenti hatchback'tir.",
        ortalamaFiyat: 1280000
    },
    {
        id: "c-9-3",
        marka: "Opel",
        model: "Corsa (1.2 Turbo Otomatik)",
        yilAraligi: "2021 - 2023",
        yakitTipi: "Benzin",
        sanziman: "Otomatik",
        aciklama: "Genç ve Çevik: Şehir içi kullanımı pratik, tasarımı güncel ve dinamik bir B segmenti aracıdır.",
        ortalamaFiyat: 1250000
    },
    {
        id: "c-9-4",
        marka: "Volkswagen",
        model: "Golf / Polo",
        yilAraligi: "2015 - 2018",
        yakitTipi: "Benzin / Dizel",
        sanziman: "Otomatik (DSG)",
        aciklama: "Klasik Alman Kalitesi: Herkesin hayalindeki sorunsuz ve tok kapı sesli Alman efsaneleri. Ancak 1.3 Milyona alınan Golf'ün kmsi yüksek olabilir.",
        ortalamaFiyat: 1320000
    },
    {
        id: "c-9-5",
        marka: "Ford",
        model: "Focus (Hatchback)",
        yilAraligi: "2016 - 2018",
        yakitTipi: "Dizel",
        sanziman: "Otomatik",
        aciklama: "Sürüş Dinamikleri: Segmentinin en iyi yol tutan aracıdır. Bu bütçeyle otomatik model yılı rakiplerine göre düşük kalacaktır.",
        ortalamaFiyat: 1300000
    }
];

const catId = "1250-1350k";
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
console.log('Successfully injected 5 missing cars for 1250-1350k band.');
