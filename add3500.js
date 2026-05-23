const fs = require('fs');
const dataPath = 'data/otobutce-data.ts';
let content = fs.readFileSync(dataPath, 'utf8');

const newCategory = `
    {
      id: "3500-5000k",
      slug: "3-5-5-0-milyon-tl-arasi-araclar",
      title: "3.500.000 TL - 5.000.000 TL Arası",
      minPrice: 3500000,
      maxPrice: 5000000,
      seoTitle: "3.5 Milyon - 5 Milyon TL Bütçeyle Alman Efsaneleri ve VIP Konfor",
      seoDesc: "3.500.000 - 5.000.000 TL bandında alınabilecek prestijli E segmenti sedanlar ve VIP tasarım otomobil tavsiyeleri.",
      introText: \`Bütçenizi 3.5 ile 5 Milyon TL aralığına çıkarttığınızda, otomotiv dünyasının 'Kutsal Üçlüsü' (BMW, Mercedes, Audi) arasında kalacağınız tatlı bir kararsızlık başlar. Bu bütçe; makam şoförüyle kullanılabilecek kadar prestijli, ancak direksiyonuna geçtiğinizde size üst düzey sürüş zevki verecek E segmenti sedanların ve özel tasarım VIP araçların dünyasıdır.\`,
      tavsiyeText: \`Otosöz Tavsiyesi: Bu bütçede Alman üçlüsü arasında seçim yaparken tamamen kişisel zevkleriniz devreye girer. Konfor diyorsanız Mercedes E200, Sürüş Zevki diyorsanız BMW 520i, Teknoloji ve Yol Tutuş diyorsanız Audi A6 tercih etmelisiniz. Eğer büyük bir aileniz varsa veya sık sık uzun yola şoförlü çıkıyorsanız, Sıfır Kilometre VIP Vito almak size hiçbir sedanın veremeyeceği bir ferahlık sunacaktır.\`,
      cars: [
        {
            id: "c-17-1",
            marka: "BMW",
            model: "520i",
            yilAraligi: "2021 - 2022",
            yakitTipi: "Benzin",
            sanziman: "Otomatik",
            aciklama: "Sportif Makam Aracı: E segmentinde sürücü odaklı sürüş dinamiğini en iyi hissettiren araçtır. Makam aracından ziyade direksiyonunda kendiniz olmak istiyorsanız ilk tercihiniz olmalıdır.",
            ortalamaFiyat: 3800000
        },
        {
            id: "c-17-2",
            marka: "Audi",
            model: "A6",
            yilAraligi: "2021 - 2022",
            yakitTipi: "Dizel / Benzin",
            sanziman: "Otomatik",
            aciklama: "Quattro ve Teknolojik İmaj: Tasarımıyla rakiplerine göre daha köşeli, daha teknolojik ve modern bir duruş sergiler. Sessizliği ve Quattro altyapısıyla kusursuzdur.",
            ortalamaFiyat: 4000000
        },
        {
            id: "c-17-3",
            marka: "Mercedes-Benz",
            model: "E200",
            yilAraligi: "2021 - 2022",
            yakitTipi: "Benzin",
            sanziman: "Otomatik",
            aciklama: "Klasik Patron Arabası: Prestij ve konfor dendiğinde akla ilk gelen otomobildir. Yumuşak sürüşü ve marka algısıyla sınıfının referans noktasıdır.",
            ortalamaFiyat: 4200000
        },
        {
            id: "c-17-4",
            marka: "Mercedes-Benz",
            model: "Vito (VIP Dizayn)",
            yilAraligi: "2023",
            yakitTipi: "Dizel",
            sanziman: "Otomatik",
            aciklama: "Yürüyen Lüks Ofis: Arka koltukta oturmayı seviyorsanız, içi tamamen özel yapım (TV, buzdolabı, masajlı koltuklar) VIP Vito almak çok lüks bir deneyim sunar.",
            ortalamaFiyat: 3800000
        }
      ]
    }
`;

// Insert the new category at the end of the array.
content = content.replace(/\]\n\s*\}\n\s*\];/, `]\n    },${newCategory}\n  ];`);

fs.writeFileSync(dataPath, content);
console.log('Successfully added the new 3500-5000k category.');
