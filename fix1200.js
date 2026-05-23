const fs = require('fs');
const dataPath = 'data/otobutce-data.ts';
let content = fs.readFileSync(dataPath, 'utf8');

const newCars = [
    {
        id: "c-8-1",
        marka: "Renault",
        model: "Clio 5 (1.0 TCe - Icon Paket)",
        yilAraligi: "2022 - 2023",
        yakitTipi: "Benzin",
        sanziman: "Otomatik (X-Tronic)",
        aciklama: "Yeni, Dolu ve Sorunsuz: 40.000 km altında, turbo benzinli motoru ve en dolu donanımıyla (Icon) bu bütçenin en rasyonel seçeneklerinden biridir.",
        ortalamaFiyat: 1200000
    },
    {
        id: "c-8-2",
        marka: "Opel",
        model: "Insignia (1.6 Dizel)",
        yilAraligi: "2016",
        yakitTipi: "Dizel",
        sanziman: "Otomatik",
        aciklama: "Bu Bütçenin D Segmenti Kralı: 60.000 - 75.000 km bandında bulunabilecek 2016 model bir Insignia, Passat B7'ye göre çok daha genç ve doludur.",
        ortalamaFiyat: 1220000
    },
    {
        id: "c-8-3",
        marka: "Seat",
        model: "Leon (1.6 TDI)",
        yilAraligi: "2017",
        yakitTipi: "Dizel",
        sanziman: "Otomatik (DSG)",
        aciklama: "Fiyat / Performans C Segmenti: Müthiş bir tasarım, düşük yakıt tüketimi ve DSG şanzıman konforu. Style (standart) paketleri bu bütçede mantıklıdır.",
        ortalamaFiyat: 1180000
    },
    {
        id: "c-8-4",
        marka: "Fiat",
        model: "Egea Sedan (1.6 Multijet Lounge)",
        yilAraligi: "2022",
        yakitTipi: "Dizel",
        sanziman: "Otomatik",
        aciklama: "Geniş Aile ve Düşük Kilometre: 50.000 km altında, otomatik vitesli ve en dolu (Lounge) paketiyle tam bir sorunsuzluk abidesidir.",
        ortalamaFiyat: 1200000
    },
    {
        id: "c-8-5",
        marka: "Honda",
        model: "City (1.5 Executive)",
        yilAraligi: "2023",
        yakitTipi: "Benzin",
        sanziman: "Otomatik (CVT)",
        aciklama: "Japon Yeniliği: Yine 50.000 km altında, atmosferik motor ve CVT şanzımanı ile 'beni hiç sanayiye sokma' diyenlerin tercihidir.",
        ortalamaFiyat: 1250000
    },
    {
        id: "c-8-6",
        marka: "Opel / Hyundai",
        model: "Corsa / i20 (1.2T / 1.0T)",
        yilAraligi: "2022 - 2024",
        yakitTipi: "Benzin",
        sanziman: "Otomatik",
        aciklama: "Güncel ve Çevik: 2024 model Corsa (Edition) veya 2022 model i20 (Style Plus) gibi çok genç B segmenti seçenekler de bu bütçenin garanti alternatifleridir.",
        ortalamaFiyat: 1150000
    }
];

const catId = "1150-1250k";
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
console.log('Successfully injected 6 missing cars for 1150-1250k band.');
