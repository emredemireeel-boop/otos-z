const fs = require('fs');
const dataPath = 'data/otobutce-data.ts';
let content = fs.readFileSync(dataPath, 'utf8');

const newCarsData = {
    "950-1050k": [
        {
            id: "c-7-1",
            marka: "Honda",
            model: "Civic (FB7)",
            yilAraligi: "2013 - 2016",
            yakitTipi: "LPG / Benzin",
            sanziman: "Otomatik",
            aciklama: "Sorunsuzluk İsteyenler İçin: LPG ile mükemmel uyumlu VTEC motor, dayanıklı Japon mühendisliği ve asla değer kaybetmeyen çok güçlü bir ikinci el piyasası.",
            ortalamaFiyat: 1000000
        },
        {
            id: "c-7-2",
            marka: "Renault",
            model: "Megane 4 (1.5 dCi)",
            yilAraligi: "2016 - 2018",
            yakitTipi: "Dizel",
            sanziman: "Otomatik (EDC)",
            aciklama: "Tasarruf ve Aile Odaklı: İnanılmaz düşük yakıt tüketimi, çok geniş bagaj ve ferah iç hacim. EDC şanzıman konforludur.",
            ortalamaFiyat: 1020000
        }
    ],
    "1150-1250k": [
        {
            id: "c-8-1",
            marka: "Renault",
            model: "Clio 5 (1.0 TCe - Icon Paket)",
            yilAraligi: "2022 - 2023",
            yakitTipi: "Benzin",
            sanziman: "Otomatik (X-Tronic)",
            aciklama: "Yeni, Dolu ve Sorunsuz: 40.000 km altında, turbo benzinli motoru ve en dolu donanımıyla (Icon) bu bütçenin en rasyonel ve hızlı satılan seçeneklerinden biridir.",
            ortalamaFiyat: 1200000
        },
        {
            id: "c-8-2",
            marka: "Opel",
            model: "Insignia (1.6 Dizel)",
            yilAraligi: "2016 - 2017",
            yakitTipi: "Dizel",
            sanziman: "Otomatik",
            aciklama: "D Segmenti Fiyat/Performans Kralı: C segmenti fiyatına; çok daha tok, yola oturan, donanımlı ve prestijli Alman tankı.",
            ortalamaFiyat: 1220000
        }
    ],
    "1250-1350k": [
        {
            id: "c-9-1",
            marka: "Fiat",
            model: "Egea Cross (1.6 Multijet)",
            yilAraligi: "2022 - 2024",
            yakitTipi: "Dizel",
            sanziman: "Otomatik",
            aciklama: "Tam Otomatik Sorunsuzluk: 1.6 Multijet efsanevi dayanıklılıktadır ve yeni nesil tam otomatik şanzımanla buluştuğu bu versiyonu çok tutulmaktadır.",
            ortalamaFiyat: 1300000
        },
        {
            id: "c-9-2",
            marka: "Volkswagen",
            model: "Golf (1.0 TSI)",
            yilAraligi: "2018 - 2020",
            yakitTipi: "Benzin",
            sanziman: "Otomatik (DSG)",
            aciklama: "C Segmenti Referansı: Malzeme kalitesi, yalıtım ve sürüş dinamikleriyle sınıfının her zaman referans modelidir. 1.0 TSI motor beklentinin üzerinde performans verir.",
            ortalamaFiyat: 1350000
        }
    ],
    "1450-1550k": [
        {
            id: "c-10-1",
            marka: "Opel / Peugeot",
            model: "Astra / 308 (1.2 Puretech)",
            yilAraligi: "2022 - 2023",
            yakitTipi: "Benzin",
            sanziman: "Otomatik",
            aciklama: "Yeni Nesil C Segmenti: Çok genç, tasarımı güncel ve donanımı zengin gerçek bir C segmenti. 1.2 Puretech motorun triger kayışı durumuna dikkat edilmelidir.",
            ortalamaFiyat: 1500000
        },
        {
            id: "c-10-2",
            marka: "Citroen",
            model: "C4X (1.2 Puretech)",
            yilAraligi: "2023 - 2024",
            yakitTipi: "Benzin",
            sanziman: "Otomatik",
            aciklama: "Crossover Esnekliği: Konfor odaklı, yumuşak süspansiyonlara sahip, hem sedan hem de yüksek Crossover hissiyatını aynı potada eriten tam bir aile aracıdır.",
            ortalamaFiyat: 1520000
        }
    ],
    "1550-1650k": [
        {
            id: "c-11-1",
            marka: "Hyundai / Kia",
            model: "Bayon / Stonic",
            yilAraligi: "2023 - 2025",
            yakitTipi: "Benzin",
            sanziman: "Otomatik",
            aciklama: "Küçük Ailelerin Favorisi: Otomatik vitesleri çift kavrama (DSG gibi) değil, sorunsuz tork konvertörlüdür. Şehir içi kullanımı rahat ve neredeyse sıfır ayarındadır.",
            ortalamaFiyat: 1600000
        },
        {
            id: "c-11-2",
            marka: "Dacia / Renault",
            model: "Duster / Megane 4 (1.3 TCe)",
            yilAraligi: "2022 - 2023",
            yakitTipi: "Benzin",
            sanziman: "Otomatik",
            aciklama: "Yüksek Performans ve Sessizlik: Mercedes ile ortak üretilen 1.3 TCe motor inanılmaz atak ve performanslıdır. Megane konfor, Duster yükseklik arayanlara hitap eder.",
            ortalamaFiyat: 1620000
        },
        {
            id: "c-11-3",
            marka: "Seat / VW",
            model: "Arona / T-Cross (1.0 TSI)",
            yilAraligi: "2022 - 2024",
            yakitTipi: "Benzin",
            sanziman: "Otomatik",
            aciklama: "Premium B-SUV: Özellikle eş/okul aracı olarak bilinen, parkı kolay, VAG grubu kalitesini sunan pratik şehir içi Crossover'larıdır.",
            ortalamaFiyat: 1650000
        }
    ],
    "1700-1800k": [
        {
            id: "c-12-1",
            marka: "Hyundai",
            model: "Ioniq 6",
            yilAraligi: "2023 - 2024",
            yakitTipi: "Elektrik",
            sanziman: "Otomatik",
            aciklama: "Uzay Mekiği ve Teknoloji Harikası: Elektrikli otomobil devriminin en ikonik tasarımlarından biri. İnanılmaz düşük rüzgar direnci ve fütüristik teknolojisiyle gelecekte hissettirir.",
            ortalamaFiyat: 1750000
        },
        {
            id: "c-12-2",
            marka: "DS Automobiles",
            model: "DS 4",
            yilAraligi: "2022 - 2023",
            yakitTipi: "Dizel / Benzin",
            sanziman: "Otomatik",
            aciklama: "Ulaşılabilir Premium Lüks: Malzeme kalitesi ve tasarımıyla Audi/BMW gibi rakiplerine ter döktüren Fransız premium seçeneği.",
            ortalamaFiyat: 1780000
        },
        {
            id: "c-12-3",
            marka: "Peugeot",
            model: "308 (Yeni Kasa)",
            yilAraligi: "2022 - 2023",
            yakitTipi: "Benzin",
            sanziman: "Otomatik",
            aciklama: "Herkesin Özendiği Hatchback: Yollardaki en yırtıcı ve dikkat çekici tasarımlardan biri. Yeni nesil i-Cockpit ve zengin donanımıyla C segmentinde arzu nesnesidir.",
            ortalamaFiyat: 1720000
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
            aciklama: "Milli Teknoloji ve Tasarım: Yollara yeni inen T10F, 218 beygir gücü ve fastback tasarımıyla hem çok sportif hem de 350 km menziliyle şehir içine uygundur.",
            ortalamaFiyat: 1850000
        },
        {
            id: "c-13-2",
            marka: "BYD",
            model: "Dolphin (Design Paket)",
            yilAraligi: "2024 - 2025",
            yakitTipi: "Elektrik",
            sanziman: "Otomatik",
            aciklama: "Çinli Teknoloji Devi: 204 beygir gücü, 427 km karma menzili ve inanılmaz donanımıyla bütçenin en rasyonel araçlarından biridir.",
            ortalamaFiyat: 1820000
        },
        {
            id: "c-13-3",
            marka: "Ford",
            model: "Puma (1.0 Titanium)",
            yilAraligi: "2023 - 2024",
            yakitTipi: "Hafif Hibrit",
            sanziman: "Otomatik",
            aciklama: "Sürüş Dinamikleri: 125 beygirlik hibrit motoru (5.7L tüketim) ve efsanevi yol tutuşuyla sınıfının en keyifli B-SUV'udur.",
            ortalamaFiyat: 1800000
        },
        {
            id: "c-13-4",
            marka: "Renault",
            model: "Duster (Evolution Turbo)",
            yilAraligi: "2024 - 2025",
            yakitTipi: "Benzin",
            sanziman: "Otomatik",
            aciklama: "Yeni Nesil Efsane: Artık Renault logosuyla gelen Duster, güçlü turbo motoru ve otomatik şanzımanıyla sağlam bir seçenektir.",
            ortalamaFiyat: 1840000
        },
        {
            id: "c-13-5",
            marka: "Toyota",
            model: "Corolla (1.5 Drive/Dream)",
            yilAraligi: "2024 - 2025",
            yakitTipi: "Benzin",
            sanziman: "Otomatik",
            aciklama: "Geleneksel Sorunsuzluk: Sıfır kilometre araç alıp '10 yıl sanayi yüzü görmeyeyim' diyenlerin klasik ve risksiz tercihidir.",
            ortalamaFiyat: 1830000
        },
        {
            id: "c-13-6",
            marka: "Skoda / Seat",
            model: "Kamiq / Arona",
            yilAraligi: "2024 - 2025",
            yakitTipi: "Benzin",
            sanziman: "Otomatik",
            aciklama: "VAG Grubu Kalitesi: Aynı altyapıyı kullanan, Volkswagen grubunun tok kapı hissini ve DSG konforunu arayanlar için garanti tercihlerdir.",
            ortalamaFiyat: 1810000
        },
        {
            id: "c-13-7",
            marka: "Citroen",
            model: "C3 Aircross (1.2 Plus)",
            yilAraligi: "2024 - 2025",
            yakitTipi: "Hafif Hibrit",
            sanziman: "Otomatik",
            aciklama: "Konfor ve Hacim: Yenilenen yüzü, 145 HP hibrit motoru ve aileler için sunduğu yüksek tavan/bagaj hacmiyle uzun yol aracıdır.",
            ortalamaFiyat: 1800000
        },
        {
            id: "c-13-8",
            marka: "Hyundai / Kia",
            model: "i30 / XCeed",
            yilAraligi: "2023 - 2024",
            yakitTipi: "Benzin",
            sanziman: "Otomatik",
            aciklama: "Sportif Ruh: SUV istemeyip asfalt üzerinde daha dinamik bir C segmenti arayanlar için oldukça mantıklı seçeneklerdir.",
            ortalamaFiyat: 1850000
        }
    ],
    "1900-2100k": [
        {
            id: "c-14-1",
            marka: "Toyota",
            model: "Corolla (Hibrit)",
            yilAraligi: "2023 - 2024",
            yakitTipi: "Hibrit",
            sanziman: "Otomatik",
            aciklama: "Sıfır Sorun, Sıfır Baş Ağrısı: Çok düşük kilometreli, hibrit motorlu ve en dolu donanımlı versiyonlarına sahip olabilirsiniz.",
            ortalamaFiyat: 1950000
        },
        {
            id: "c-14-2",
            marka: "Mercedes-Benz",
            model: "C Serisi (2018-2019)",
            yilAraligi: "2018 - 2019",
            yakitTipi: "Dizel / Benzin",
            sanziman: "Otomatik",
            aciklama: "Klasik Premium Konforu: W205 makyajlı kasalara denk gelen bu yıllar, konfor, prestij ve malzeme kalitesi açısından beklentilerinizi karşılar.",
            ortalamaFiyat: 2050000
        },
        {
            id: "c-14-3",
            marka: "Mercedes-Benz",
            model: "A Serisi",
            yilAraligi: "2020 - 2022",
            yakitTipi: "Benzin / Dizel",
            sanziman: "Otomatik",
            aciklama: "Genç ve Dinamik Premium: Modern iç tasarımı (MBUX ekranları) ve daha sportif sürüşü tercih edenler için kompakt lüks.",
            ortalamaFiyat: 2000000
        },
        {
            id: "c-14-4",
            marka: "Skoda",
            model: "Kodiaq",
            yilAraligi: "2020 - 2022",
            yakitTipi: "Dizel / Benzin",
            sanziman: "Otomatik",
            aciklama: "Geniş Ailelerin D-SUV Tercihi: 7 koltuk seçeneği, devasa bagajı ve VAG grubu konforuyla tam bir aile ve uzun yol aracıdır.",
            ortalamaFiyat: 2050000
        },
        {
            id: "c-14-5",
            marka: "Skoda",
            model: "Kamiq",
            yilAraligi: "2022 - 2024",
            yakitTipi: "Benzin",
            sanziman: "Otomatik",
            aciklama: "Pratik ve Sorunsuz B-SUV: Daha çok şehir içi odaklı, yakıt tüketimi makul bir araç arayanlar için pratik kardeşidir.",
            ortalamaFiyat: 1900000
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
            aciklama: "Great double wishbone suspension, 61.4 kWh LFP battery, 218 HP RWD. Drawback: Low charging speed.",
            ortalamaFiyat: 2200000
        },
        {
            id: "c-15-2",
            marka: "BYD",
            model: "Sealion 7",
            yilAraligi: "2025",
            yakitTipi: "Elektrik",
            sanziman: "Otomatik",
            aciklama: "Much better alternative to Seal Sedan. 71 kWh battery, 150 kW DC charging.",
            ortalamaFiyat: 2300000
        },
        {
            id: "c-15-3",
            marka: "DS Automobiles",
            model: "DS 9 (1.6 Puretech)",
            yilAraligi: "2022 - 2023",
            yakitTipi: "Benzin",
            sanziman: "Otomatik",
            aciklama: "D-segment luxury, 225 HP. Very unique, luxury alternative to traditional German sedans.",
            ortalamaFiyat: 2250000
        },
        {
            id: "c-15-4",
            marka: "Peugeot",
            model: "508 GT (1.5 Dizel)",
            yilAraligi: "2023 - 2024",
            yakitTipi: "Dizel",
            sanziman: "Otomatik",
            aciklama: "D-segment, torque converter auto, very full spec (night vision, etc.). Better value than barebones models.",
            ortalamaFiyat: 2150000
        },
        {
            id: "c-15-5",
            marka: "Skoda",
            model: "Octavia (1.5 e-TEC)",
            yilAraligi: "2023 - 2024",
            yakitTipi: "Yarı Hibrit",
            sanziman: "Otomatik",
            aciklama: "C-segment that feels like D-segment. Very comfortable, massage seats, DSG.",
            ortalamaFiyat: 2100000
        },
        {
            id: "c-15-6",
            marka: "Tesla",
            model: "Model Y (Long Range)",
            yilAraligi: "2023 - 2024",
            yakitTipi: "Elektrik",
            sanziman: "Otomatik",
            aciklama: "Dual motor 4x4, NMC battery, 250 kW DC fast charging, ~500km range. Best electric alternative.",
            ortalamaFiyat: 2250000
        },
        {
            id: "c-15-7",
            marka: "Volkswagen",
            model: "Passat Variant B9 (1.5 eTSI)",
            yilAraligi: "2024 - 2025",
            yakitTipi: "Yarı Hibrit",
            sanziman: "Otomatik",
            aciklama: "Huge station wagon, 5 meters long, very comfortable classic German engineering.",
            ortalamaFiyat: 2300000
        },
        {
            id: "c-15-8",
            marka: "Chery",
            model: "Tiggo 8 Pro Max",
            yilAraligi: "2025",
            yakitTipi: "Benzin",
            sanziman: "Otomatik",
            aciklama: "7-seater, gasoline, zero km. Huge space for families.",
            ortalamaFiyat: 2200000
        },
        {
            id: "c-15-9",
            marka: "DS Automobiles",
            model: "DS 7 Crossback (1.5 Dizel)",
            yilAraligi: "2022 - 2023",
            yakitTipi: "Dizel",
            sanziman: "Otomatik",
            aciklama: "Low km, reliable torque converter, premium alternative to 3008/C5 Aircross.",
            ortalamaFiyat: 2100000
        },
        {
            id: "c-15-10",
            marka: "Peugeot",
            model: "E-3008 (GT 2024)",
            yilAraligi: "2024 - 2025",
            yakitTipi: "Elektrik",
            sanziman: "Otomatik",
            aciklama: "Fully loaded EV, NMC battery, heat pump. Much better equipment (massage, cooling) than Tesla/BYD.",
            ortalamaFiyat: 2250000
        },
        {
            id: "c-15-11",
            marka: "TOGG",
            model: "T10X",
            yilAraligi: "2024 - 2025",
            yakitTipi: "Elektrik",
            sanziman: "Otomatik",
            aciklama: "Recommended to buy Zero KM rather than second-hand here due to 1M TL 0% interest loan campaigns.",
            ortalamaFiyat: 2150000
        }
    ]
};

for (const [catId, cars] of Object.entries(newCarsData)) {
    // We will completely replace the array inside cars: [...] for the specific catId
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
        aciklama: \`${car.aciklama.replace(/`/g, "'")}\`,
        ortalamaFiyat: ${car.ortalamaFiyat}
      }${i === cars.length - 1 ? '' : ','}\n`;
        }
        return p1 + '\n' + carsStr + '    ]  }';
    });
}

// Ensure formatting is clean
content = content.replace(/\]\s*\}\s*\]/g, ']\n  }\n]');
fs.writeFileSync(dataPath, content);
console.log('Successfully injected ALL missing cars matching exactly the user prompt descriptions.');
