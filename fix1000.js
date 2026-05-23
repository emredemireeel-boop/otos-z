const fs = require('fs');
const dataPath = 'data/otobutce-data.ts';
let content = fs.readFileSync(dataPath, 'utf8');

const newCars = [
    {
        id: "c-7-1",
        marka: "Honda",
        model: "Civic (FB7)",
        yilAraligi: "2012 - 2015",
        yakitTipi: "LPG / Benzin",
        sanziman: "Otomatik",
        aciklama: "Sorunsuzluk İsteyenler İçin: LPG ile mükemmel uyumlu VTEC motor, dayanıklı Japon mühendisliği ve asla değer kaybetmeyen çok güçlü bir ikinci el piyasası. İç mekanda yol sesini fazla alır.",
        ortalamaFiyat: 1000000
    },
    {
        id: "c-7-2",
        marka: "Renault",
        model: "Megane 4 (1.5 dCi)",
        yilAraligi: "2016 - 2018",
        yakitTipi: "Dizel",
        sanziman: "Otomatik (EDC)",
        aciklama: "Konfor ve Denge İsteyenler İçin: Taş gibi sağlam 1.5 dCi motor, hem aile hem gençlere hitap eden güncel tasarım. Kesinlikle EDC şanzıman kontrol edilmelidir.",
        ortalamaFiyat: 1020000
    },
    {
        id: "c-7-3",
        marka: "Skoda / VW",
        model: "Scala / Jetta",
        yilAraligi: "2015 - 2020",
        yakitTipi: "Dizel / Benzin",
        sanziman: "Otomatik (DSG)",
        aciklama: "Premium Hissiyat ve Prestij İsteyenler İçin: Jetta tam bir Alman klasiğidir. Scala ise içi geniş ve kaliteli malzemelere sahiptir. DSG mekatronik arızalarına dikkat edilmelidir.",
        ortalamaFiyat: 1050000
    },
    {
        id: "c-7-4",
        marka: "Dacia",
        model: "Sandero (2022+)",
        yilAraligi: "2022 - 2024",
        yakitTipi: "Benzin",
        sanziman: "Otomatik",
        aciklama: "Sıfır Kokusu ve Düşük Risk İsteyenler İçin: Bu bütçeye alınabilecek neredeyse sıfır garantili, çok yeni modelli en mantıklı şehir içi otomobilidir. Tam bir görev adamıdır.",
        ortalamaFiyat: 980000
    },
    {
        id: "c-7-5",
        marka: "Citroen",
        model: "C3 (1.2 Puretech)",
        yilAraligi: "2020 - 2022",
        yakitTipi: "Benzin",
        sanziman: "Otomatik",
        aciklama: "Modern Tasarım İsteyenler İçin: Genç işi, şehir içinde kullanımı çok rahat ve şık bir araçtır. Yeni nesil zincirli motor değilse triger geçmişi mutlaka soruşturulmalıdır.",
        ortalamaFiyat: 950000
    }
];

const catId = "950-1050k";
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
console.log('Successfully injected 5 missing cars for 950-1050k band.');
