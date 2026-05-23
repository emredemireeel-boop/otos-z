const fs = require('fs');
const path = require('path');

const otobutceFile = path.join(__dirname, 'data/otobutce-data.ts');
let content = fs.readFileSync(otobutceFile, 'utf8');

const newCategory = `
  {
    id: "150k",
    title: "150.000 TL Altı: \\"Ayağımı Yerden Kessin\\" Arabaları",
    slug: "150-bin-tl-alti-arabalar",
    priceRange: "0 TL - 150.000 TL",
    shortDescription: "Otobüste, dolmuşta çile çekmek istemiyorum, kapımın önünde 4 lastik olsun yeter diyenler için.",
    content: \`"Otobüste, dolmuşta çile çekmek istemiyorum, kapımın önünde 4 lastik olsun yeter" diyorsanız, 150.000 TL bandında alabileceğiniz araçlar temel ulaşım ihtiyacınızı karşılamaya yöneliktir.

Bu bütçedeki araçlardan konfor, yüksek performans veya "hatasız" bir kaporta beklemek gerçekçi olmaz. Bu fiyat bandında alacağınız araçlarda "komple boya" veya "değişen parça" olması son derece doğaldır. Önemli olan motorun yürür durumda olması ve sizi yolda bırakmamasıdır.

İşte 150.000 TL bütçeyle piyasada bulabileceğiniz, en temel ulaşım ihtiyacını çözen o modeller:\`,
    tavsiyeText: "Otosöz Tavsiyesi: Bu araçları alırken kaporta takıntısını bir kenara bırakın. Odaklanmanız gereken tek şey motorun sağlıklı çalışması, şasenin düzgün olması ve yürüyen aksamın (fren, debriyaj, şanzıman) güvenliğiniz için sorunsuz olmasıdır. Darda kaldığınızda kimseye ağız eğmemek için bu araçlar hala en mantıklı başlangıç noktasıdır.",
    cars: [
      {
        id: "tofas-murat-131",
        marka: "Tofaş",
        model: "Murat 131 / 124",
        yilAraligi: "1977-1988",
        yakitTipi: "LPG / Benzin",
        sanziman: "Manuel",
        aciklama: "Nostaljik / Temel ulaşım",
        ortalamaFiyat: 120000
      },
      {
        id: "tofas-dogan",
        marka: "Tofaş",
        model: "Doğan",
        yilAraligi: "1988-2002",
        yakitTipi: "LPG / Benzin",
        sanziman: "Manuel",
        aciklama: "Geniş iç hacim, ucuz parça",
        ortalamaFiyat: 140000
      },
      {
        id: "skoda-favorit",
        marka: "Skoda",
        model: "Favorit / Forman",
        yilAraligi: "1989-1995",
        yakitTipi: "LPG / Benzin",
        sanziman: "Manuel",
        aciklama: "Uygun fiyatlı aile kullanımı",
        ortalamaFiyat: 135000
      },
      {
        id: "renault-9",
        marka: "Renault",
        model: "9 (Spring / Broadway)",
        yilAraligi: "1988-1995",
        yakitTipi: "LPG / Benzin",
        sanziman: "Manuel",
        aciklama: "Az yakan, masrafsız klasik",
        ortalamaFiyat: 145000
      },
      {
        id: "ford-escort",
        marka: "Ford",
        model: "Escort",
        yilAraligi: "1990-2000",
        yakitTipi: "LPG / Benzin",
        sanziman: "Manuel",
        aciklama: "Döneminin konforlu seçeneklerinden",
        ortalamaFiyat: 150000
      },
      {
        id: "ford-taunus",
        marka: "Ford",
        model: "Taunus",
        yilAraligi: "1980-1993",
        yakitTipi: "LPG / Benzin",
        sanziman: "Manuel",
        aciklama: "Sağlam kasa, arkadan itiş",
        ortalamaFiyat: 130000
      },
      {
        id: "lada-samara",
        marka: "Lada",
        model: "Samara",
        yilAraligi: "1990-2004",
        yakitTipi: "LPG / Benzin",
        sanziman: "Manuel",
        aciklama: "Zorlu şartlara dayanıklı, kemikli yapı",
        ortalamaFiyat: 125000
      },
      {
        id: "renault-11",
        marka: "Renault",
        model: "11 (Flash / Rainbow)",
        yilAraligi: "1988-1995",
        yakitTipi: "LPG / Benzin",
        sanziman: "Manuel",
        aciklama: "Döneminin performanslı modellerinden",
        ortalamaFiyat: 140000
      },
      {
        id: "fiat-uno",
        marka: "Fiat",
        model: "Uno",
        yilAraligi: "1995-2001",
        yakitTipi: "LPG / Benzin",
        sanziman: "Manuel",
        aciklama: "Şehir içi kolay park, pratik kullanım",
        ortalamaFiyat: 145000
      }
    ]
  },`;

// Inject into OTOBUTCE_CATEGORIES array
content = content.replace(/export const OTOBUTCE_CATEGORIES: OtoButceCategory\[\] = \[/, \`export const OTOBUTCE_CATEGORIES: OtoButceCategory[] = [\${newCategory}\`);

fs.writeFileSync(otobutceFile, content);
console.log("Updated otobutce-data.ts");
