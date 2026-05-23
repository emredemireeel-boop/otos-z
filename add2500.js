const fs = require('fs');
const dataPath = 'data/otobutce-data.ts';
let content = fs.readFileSync(dataPath, 'utf8');

const newCategory = `
    {
      id: "2500-3500k",
      slug: "2-5-3-5-milyon-tl-arasi-araclar",
      title: "2.500.000 TL - 3.500.000 TL Arası",
      minPrice: 2500000,
      maxPrice: 3500000,
      seoTitle: "2.5 Milyon - 3.5 Milyon TL Bütçeyle Lüks ve Performans Araçları",
      seoDesc: "2.500.000 - 3.500.000 TL bandında alınabilecek en prestijli, güvenli ve Quattro performansına sahip lüks otomobil tavsiyeleri.",
      introText: \`Bütçenizi 2.5 ile 3.5 Milyon TL aralığına taşıdığınızda, yollardaki en prestijli, en güvenli ve yol tutuşu en yüksek otomobillere sahip olmaya başlarsınız. Bu bütçe; makam aracı konforunu, spor otomobil performansını ve geniş aileler için S Kasa lüksünü bir arada isteyenlerin dünyasıdır.\`,
      tavsiyeText: \`Otosöz Tavsiyesi: Bu bütçelerde araç alırken 'kullanım amacı' en kritik belirleyicidir. Eğer geniş bir aileniz varsa ve makam aracı lüksü istiyorsanız Mercedes GL Serisi öndedir. Gençseniz ve performans önemliyse Audi A5 veya BMW 4 Serisi sizi tatmin edecektir. Önceliğiniz aile güvenliği ise Volvo S90 veya XC60 en rasyonel harekettir.\`,
      cars: [
        {
            id: "c-16-1",
            marka: "Mercedes-Benz",
            model: "GL / GLS Serisi",
            yilAraligi: "2015 - 2016",
            yakitTipi: "Dizel / Benzin",
            sanziman: "Otomatik",
            aciklama: "Uzmanın 1 Numaralı Favorisi: 3.5 Milyon bandına taşıdığınızda alınabilecek en gösterişli, 7 kişilik ve 'S Serisi konforu' sunan gerçek bir SUV'dur. Boyutları devasa olduğundan şehir içi manevraları ve yakıt tüketimi oldukça yüksektir.",
            ortalamaFiyat: 3400000
        },
        {
            id: "c-16-2",
            marka: "Volvo",
            model: "S90",
            yilAraligi: "2019 - 2020",
            yakitTipi: "Dizel / Benzin",
            sanziman: "Otomatik",
            aciklama: "İsveç Çeliği ve Prestij: 3 Milyon TL bandında alınabilecek en prestijli E segmenti sedanlardan biridir. Dört çeker sistemi, muazzam yaşam alanı ve Volvo'nun efsanevi güvenlik donanımlarıyla tam bir makam aracıdır.",
            ortalamaFiyat: 3000000
        },
        {
            id: "c-16-3",
            marka: "Audi",
            model: "A5 Quattro S-Line (45 TFSI)",
            yilAraligi: "2021",
            yakitTipi: "Benzin",
            sanziman: "Otomatik (S-Tronic)",
            aciklama: "Genç, Sportif ve Yırtıcı: Tasarımıyla dönüp bir daha baktıran, Quattro dört çeker sistemiyle asfalta yapışan harika bir performans otomobilidir. Yakıt tüketimi agresif kullanımlarda yüksek olacaktır.",
            ortalamaFiyat: 3300000
        },
        {
            id: "c-16-4",
            marka: "Volvo",
            model: "XC60",
            yilAraligi: "2019 - 2020",
            yakitTipi: "Dizel / Benzin",
            sanziman: "Otomatik",
            aciklama: "Güvenliğin SUV Formu: 2.5 ile 2.8 Milyon TL arasında, S90'ın kalitesini yerden yüksek bir SUV formunda arayanların tercihidir. Geniş aileler için piyasadaki en güvenli seçeneklerin başında gelir.",
            ortalamaFiyat: 2700000
        },
        {
            id: "c-16-5",
            marka: "BMW",
            model: "4 Serisi Coupe",
            yilAraligi: "2020 - 2022",
            yakitTipi: "Benzin",
            sanziman: "Otomatik",
            aciklama: "Sürüş Zevki Arayanlara: Mercedes'in konfor odaklı dünyasından çıkıp daha sportif, sürücü odaklı ve dinamik bir sürüş arıyorsanız en iddialı coupe tasarımlarından biridir.",
            ortalamaFiyat: 3100000
        },
        {
            id: "c-16-6",
            marka: "Audi",
            model: "A6 Quattro",
            yilAraligi: "2017 - 2018",
            yakitTipi: "Dizel / Benzin",
            sanziman: "Otomatik (S-Tronic)",
            aciklama: "Klasik Lüks ve Oturaklılık: Sportif A5 yerine daha geniş, daha klasik ve ağırbaşlı bir Alman tankı isteyenlerin tercihidir. Quattro sistemiyle her türlü yol koşulunda güven verir.",
            ortalamaFiyat: 2800000
        }
      ]
    }
`;

// Insert the new category at the end of the array.
// The array ends with:
//         ortalamaFiyat: 2150000
//         }
//       ]
//     }
//   ];

content = content.replace(/\]\n\s*\}\n\s*\];/, `]\n    },${newCategory}\n  ];`);

fs.writeFileSync(dataPath, content);
console.log('Successfully added the new 2500-3500k category.');
