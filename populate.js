const fs = require('fs');
const dataPath = 'data/otobutce-data.ts';
let content = fs.readFileSync(dataPath, 'utf8');

// We have the categories. We will inject cars into the `cars: []` arrays of the specific categories.
const newCarsData = {
    "950-1050k": [
        {
            id: "c-7-1",
            marka: "Renault",
            model: "Megane 4 (1.5 dCi Touch/Joy)",
            yilAraligi: "2017 - 2019",
            yakitTipi: "Dizel",
            sanziman: "Otomatik (EDC)",
            aciklama: "Geniş iç hacmi, düşük yakıt tüketimi ve yaygın servis ağıyla 1 Milyon TL bandının en mantıklı aile araçlarından biri.",
            ortalamaFiyat: 1000000
        },
        {
            id: "c-7-2",
            marka: "Honda",
            model: "Civic (1.6 i-VTEC Eco Elegance)",
            yilAraligi: "2016 - 2018",
            yakitTipi: "LPG / Benzin",
            sanziman: "Otomatik",
            aciklama: "Sorunsuz motoru ve fabrikasyon LPG uyumu sayesinde işletme maliyetleri en düşük C segmenti sedan.",
            ortalamaFiyat: 1020000
        }
    ],
    "1150-1250k": [
        {
            id: "c-8-1",
            marka: "Renault",
            model: "Clio 5 (1.0 TCe Icon)",
            yilAraligi: "2021 - 2023",
            yakitTipi: "Benzin",
            sanziman: "Otomatik (X-Tronic)",
            aciklama: "Şehir içi kullanımda pratik, yeni nesil teknolojiye sahip ve sıfıra yakın kondisyonda bulunabilecek en mantıklı B segmenti.",
            ortalamaFiyat: 1200000
        },
        {
            id: "c-8-2",
            marka: "Opel",
            model: "Insignia (1.6 Dizel Design/Edition)",
            yilAraligi: "2016 - 2017",
            yakitTipi: "Dizel",
            sanziman: "Otomatik",
            aciklama: "Büyük, güçlü ve prestijli bir D segmenti arayanlar için yorgun Passat yerine fiyat/performans açısından çok daha mantıklı bir tercih.",
            ortalamaFiyat: 1180000
        }
    ],
    "1250-1350k": [
        {
            id: "c-9-1",
            marka: "Fiat",
            model: "Egea Cross (1.6 Multijet Lounge)",
            yilAraligi: "2022 - 2024",
            yakitTipi: "Dizel",
            sanziman: "Otomatik",
            aciklama: "Crossover hissi veren yerden yüksek tasarımı, güçlü 1.6 Multijet motoru ve düşük kilometreli bulunabilmesiyle çok rasyonel bir seçim.",
            ortalamaFiyat: 1300000
        },
        {
            id: "c-9-2",
            marka: "Volkswagen",
            model: "Golf (1.0 TSI Midline Plus/Comfortline)",
            yilAraligi: "2018 - 2020",
            yakitTipi: "Benzin",
            sanziman: "Otomatik (DSG)",
            aciklama: "Alman mühendisliği ve C segmenti hatchback standartlarını belirleyen model. 1.0 motor yakıt cimrisi olup DSG uyumu başarılıdır.",
            ortalamaFiyat: 1320000
        }
    ],
    "1450-1550k": [
        {
            id: "c-10-1",
            marka: "Opel",
            model: "Astra (1.2 Puretech Elegance)",
            yilAraligi: "2022 - 2023",
            yakitTipi: "Benzin",
            sanziman: "Otomatik (EAT8)",
            aciklama: "Tasarımı çok güncel ve donanımı zengin gerçek bir yeni nesil C segmenti. 1.2 Puretech motorun triger durumuna dikkat edilmeli.",
            ortalamaFiyat: 1480000
        },
        {
            id: "c-10-2",
            marka: "Peugeot",
            model: "308 (1.2 Puretech Allure)",
            yilAraligi: "2022 - 2023",
            yakitTipi: "Benzin",
            sanziman: "Otomatik (EAT8)",
            aciklama: "Astra ile aynı altyapıyı paylaşan, tasarım olarak daha iddialı ve sportif detaylara sahip şık bir hatchback.",
            ortalamaFiyat: 1500000
        },
        {
            id: "c-10-3",
            marka: "Citroen",
            model: "C4X (1.2 Puretech Feel Bold)",
            yilAraligi: "2023 - 2024",
            yakitTipi: "Benzin",
            sanziman: "Otomatik (EAT8)",
            aciklama: "Sedan konforu ile Crossover yüksekliğini birleştiren, yumuşak süspansiyonu ile konfor odaklı aileler için ideal.",
            ortalamaFiyat: 1520000
        }
    ],
    "1550-1650k": [
        {
            id: "c-11-1",
            marka: "Hyundai",
            model: "Bayon (1.4 MPI / 1.0 T-GDI Elite)",
            yilAraligi: "2023 - 2024",
            yakitTipi: "Benzin",
            sanziman: "Otomatik",
            aciklama: "Garantisi devam eden, şehir içi kullanımı rahat ve sorunsuz tork konvertörlü şanzımana sahip B-SUV modeli.",
            ortalamaFiyat: 1600000
        },
        {
            id: "c-11-2",
            marka: "Kia",
            model: "Stonic (1.4 DPI Elegance)",
            yilAraligi: "2023 - 2024",
            yakitTipi: "Benzin",
            sanziman: "Otomatik",
            aciklama: "Kompakt boyutları, canlı tasarımı ve Hyundai grubu güvencesiyle sıfır ayarında binilebilecek sorunsuz bir Crossover.",
            ortalamaFiyat: 1580000
        }
    ],
    "1700-1800k": [
        {
            id: "c-12-1",
            marka: "Hyundai",
            model: "Ioniq 6 (Progessive)",
            yilAraligi: "2023 - 2024",
            yakitTipi: "Elektrik",
            sanziman: "Otomatik",
            aciklama: "İnanılmaz düşük rüzgar direnci ve fütüristik teknolojisiyle gelecekte hissettiren ikonik tasarımlı tam elektrikli otomobil.",
            ortalamaFiyat: 1750000
        },
        {
            id: "c-12-2",
            marka: "DS Automobiles",
            model: "DS 4 (1.5 BlueHDi / 1.2 Puretech Trocadero)",
            yilAraligi: "2022 - 2023",
            yakitTipi: "Dizel / Benzin",
            sanziman: "Otomatik",
            aciklama: "Malzeme kalitesi ve şık tasarımıyla Audi/BMW'ye ter döktüren, premium lüks algısı çok yüksek bir Fransız tasarımı.",
            ortalamaFiyat: 1780000
        }
    ],
    "1800-1900k": [
        {
            id: "c-13-1",
            marka: "TOGG",
            model: "T10F (Standart Menzil)",
            yilAraligi: "2024 - 2025",
            yakitTipi: "Elektrik",
            sanziman: "Otomatik",
            aciklama: "218 beygir gücü ve fastback tasarımıyla çok sportif olan yerli üretim tam elektrikli model.",
            ortalamaFiyat: 1850000
        },
        {
            id: "c-13-2",
            marka: "BYD",
            model: "Dolphin (Design Paket)",
            yilAraligi: "2024 - 2025",
            yakitTipi: "Elektrik",
            sanziman: "Otomatik",
            aciklama: "Şehir içi ve dışı kullanımda yüksek verimlilik sunan, Çinli teknoloji devinin donanımlı kompakt elektrikli modeli.",
            ortalamaFiyat: 1820000
        }
    ],
    "1900-2100k": [
        {
            id: "c-14-1",
            marka: "Toyota",
            model: "Corolla (1.8 Hybrid Passion X-Pack)",
            yilAraligi: "2023 - 2024",
            yakitTipi: "Hibrit",
            sanziman: "Otomatik (e-CVT)",
            aciklama: "Bütçe ne olursa olsun 'sorunsuzluk' dendiğinde akla ilk gelen, şehir içi yakıt tüketimi çok düşük olan donanımlı model.",
            ortalamaFiyat: 1950000
        },
        {
            id: "c-14-2",
            marka: "Mercedes-Benz",
            model: "C Serisi (C200d AMG / Fascination)",
            yilAraligi: "2018 - 2019",
            yakitTipi: "Dizel",
            sanziman: "Otomatik (9G-Tronic)",
            aciklama: "W205 kasa kodlu, arkadan itişli dinamikleri ve lüks iç mekanıyla D segmenti premium sedan sınıfının liderlerinden.",
            ortalamaFiyat: 2050000
        }
    ],
    "2100-2300k": [
        {
            id: "c-15-1",
            marka: "BYD",
            model: "Seal Sedan (Design)",
            yilAraligi: "2024 - 2025",
            yakitTipi: "Elektrik",
            sanziman: "Otomatik",
            aciklama: "Çift salıncaklı süspansiyon, 61.4 kWh LFP batarya ve 218 HP arkadan itiş ile sürüş dinamikleri çok güçlü elektrikli D segmenti.",
            ortalamaFiyat: 2200000
        },
        {
            id: "c-15-2",
            marka: "DS Automobiles",
            model: "DS 9 (1.6 Puretech Opera/Rivoli)",
            yilAraligi: "2022 - 2023",
            yakitTipi: "Benzin",
            sanziman: "Otomatik",
            aciklama: "225 beygir gücünde, D segmentinde emsalsiz bir lüks ve konfor sunan çok özel tasarımlı premium sedan.",
            ortalamaFiyat: 2250000
        },
        {
            id: "c-15-3",
            marka: "Peugeot",
            model: "508 GT (1.5 BlueHDi)",
            yilAraligi: "2022 - 2023",
            yakitTipi: "Dizel",
            sanziman: "Otomatik (EAT8)",
            aciklama: "Gece görüşü (Night Vision) gibi üst düzey donanımlara sahip, çok dolu ve tork konvertörlü sorunsuz D segmenti.",
            ortalamaFiyat: 2150000
        },
        {
            id: "c-15-4",
            marka: "Skoda",
            model: "Octavia (1.5 e-TEC Premium)",
            yilAraligi: "2023 - 2024",
            yakitTipi: "Yarı Hibrit",
            sanziman: "Otomatik (DSG)",
            aciklama: "Devasa iç hacmi ve hafif hibrit motor verimliliği ile geniş ailelerin D segmenti yerine tercih edebileceği C segmenti lideri.",
            ortalamaFiyat: 2100000
        }
    ]
};

for (const [catId, cars] of Object.entries(newCarsData)) {
    const regex = new RegExp(`(id:\\s*"${catId}"[\\s\\S]*?cars:\\s*\\[)([\\s\\S]*?)(\\]\\s*\\})`);
    content = content.replace(regex, (match, p1, p2, p3) => {
        let carsStr = '';
        for (let i = 0; i < cars.length; i++) {
            const car = cars[i];
            carsStr += `      {
        id: "${car.id}",
        marka: "${car.marka}",
        model: "${car.model}",
        yilAraligi: "${car.yilAraligi}",
        yakitTipi: "${car.yakitTipi}",
        sanziman: "${car.sanziman}",
        aciklama: "${car.aciklama}",
        ortalamaFiyat: ${car.ortalamaFiyat}
      }${i === cars.length - 1 ? '' : ','}\n`;
        }
        return p1 + '\n' + carsStr + '    ]  }';
    });
}

// Ensure proper formatting
content = content.replace(/\]\s*\}\s*\]/g, ']\n  }\n]');

fs.writeFileSync(dataPath, content);
console.log('Successfully injected cars into missing categories.');
