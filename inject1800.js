const fs = require('fs');
const dataPath = 'data/otobutce-data.ts';
let content = fs.readFileSync(dataPath, 'utf8');

const missingCategory = `
    {
      id: "1800-1900k",
      slug: "1-8-1-9-milyon-tl-arasi-araclar",
      title: "1.800.000 TL - 1.900.000 TL Arası",
      minPrice: 1800000,
      maxPrice: 1900000,
      seoTitle: "1.8 Milyon - 1.9 Milyon TL Bütçeyle Sıfır Kilometre Araçlar",
      seoDesc: "1.800.000 TL bandında ikinci el riskine girmeden alınabilecek sıfır kilometre elektrikli (TOGG, BYD) ve hafif hibrit araç tavsiyeleri.",
      introText: \`Bütçenizi 1.8 Milyon TL seviyesine çıkardığınızda, ikinci el piyasasının riskli dünyasından tamamen sıyrılıp, bayi vitrinlerindeki "sıfır kilometre" araçlara yönelebilirsiniz. Bu bantta geleneksel benzinli sedanların yerini hızla yeni nesil hafif hibrit B-SUV'lar ve menzilleri 400 km'yi aşan tam elektrikli (EV) otomobiller almaktadır.\`,
      tavsiyeText: \`Otosöz Tavsiyesi: Eğer evinizde veya iş yerinizde şarj imkanınız varsa; TOGG T10F veya BYD Dolphin gibi elektrikli araçlar rakipsizdir. Ancak şarj stresi yaşamak istemiyorum diyorsanız, hibrit teknolojisiyle az yakan bir Ford Puma veya sağlamlığı kanıtlanmış VAG grubu Skoda Kamiq en rasyonel tercihler olacaktır.\`,
      cars: [
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
      ]
    },`;

// Find where 1900-2100k starts and insert missingCategory right before it
if (!content.includes('id: "1800-1900k"')) {
    content = content.replace(/(\{\s*id:\s*"1900-2100k")/, missingCategory + '\n    $1');
    fs.writeFileSync(dataPath, content);
    console.log('Successfully injected the missing 1800-1900k category and its cars.');
} else {
    console.log('1800-1900k already exists!');
}
