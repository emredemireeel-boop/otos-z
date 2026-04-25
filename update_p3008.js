const fs = require('fs');

let content = fs.readFileSync('data/vehicle-dna.ts', 'utf8');

// The regex matches the existing Peugeot 3008 block which has ID 10
// We look for: brand: "Peugeot", model: "3008" and then down to totalReports: <number>
const p3008Regex = /\{\s*id:\s*\d+,\s*brand:\s*["']Peugeot["'],\s*model:\s*["']3008["'].*?totalReports:\s*\d+\s*\}/s;

const p3008_1stGen = `{
        id: 901,
        brand: "Peugeot",
        model: "3008 (1. Nesil 2009-2016)",
        year: "2009-2016",
        ncapStars: 5,
        ncapYear: "2009",
        dnaScore: 71,
        strengths: [
            "Ferah ve Geniş Cam Tavan (Cielo)",
            "Geniş Bagaj Hacmi (512 Litre)",
            "1.6 HDi Motorun Düşük Yakıt Tüketimi"
        ],
        weaknesses: [
            "Auto6R Yarı Otomatik Şanzımanın Sarsıntılı Geçişleri",
            "Süspansiyonların Sertliği ve Gelen Sesler",
            "Tasarımın MPV ile SUV Arasında Kalması"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "1.6 THP Triger Zinciri Uzaması",
                severity: "high",
                reportCount: 350,
                description: "Erken dönem 1.6 THP benzinli motorlarda triger zincirinin erken uzaması ve sente atlaması sonucu motor arıza lambası yakması kroniktir."
            },
            {
                id: 2,
                title: "Auto6R Şanzıman Kavrama/Volan Arızası",
                severity: "high",
                reportCount: 520,
                description: "Yarı otomatik Auto6R şanzımanda kavrama (baskı balata) ve volan dişlisinin erken ömrünü tamamlaması, dur-kalklarda silkeleme yapması yaygındır."
            },
            {
                id: 3,
                title: "Amortisör Takozu Sesleri",
                severity: "low",
                reportCount: 410,
                description: "Ön süspansiyonlardan, özellikle kasis geçişlerinde lokurtu/gıcırtı sesleri gelmesi sık rastlanan bir montaj/parça zayıflığıdır."
            }
        ],
        userExperiences: [],
        totalReports: 1200
    }`;

const p3008_2ndGen = `{
        id: 902,
        brand: "Peugeot",
        model: "3008 (2. Nesil 2016-2023)",
        year: "2016-2023",
        ncapStars: 5,
        ncapYear: "2016",
        dnaScore: 86,
        strengths: [
            "Göz Alıcı ve Modern i-Cockpit Tasarımı",
            "EAT8 Şanzımanın Kusursuz Geçişleri",
            "Yüksek İzolasyon ve Sürüş Konforu",
            "Agresif Dış Tasarım"
        ],
        weaknesses: [
            "Arka Diz Mesafesi Sınıf Rakiplerinden Dar",
            "Multimedya Ekranının Zaman Zaman Donması",
            "Yüksek Yedek Parça ve Servis Maliyetleri"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "1.5 BlueHDi AdBlue Sistemi Arızası",
                severity: "high",
                reportCount: 1250,
                description: "PSA grubunun kronik sorunudur. AdBlue deposu, pompası veya enjektörünün tıkanması sonucu 'Motor Arızası - Aracı Durdurun' veya 'Emisyon Hatası' vererek sistemin komple değişmesini gerektirebilir."
            },
            {
                id: 2,
                title: "1.2 PureTech Triger Kayışı Soyulması",
                severity: "high",
                reportCount: 890,
                description: "Yağ içinde çalışan triger kayışının erken yıpranarak (soyularak) partiküllerinin yağ süzgecini tıkaması ve motor yağ basıncı arızası vermesi durumudur. Erken bakım şarttır."
            },
            {
                id: 3,
                title: "EAT6/EAT8 Şanzıman Düşük Hız Vuruntusu",
                severity: "medium",
                reportCount: 560,
                description: "Özellikle 2. vitesten 1. vitese düşerken veya durmaya yakın hızlarda şanzımandan hafif bir vuruntu veya sarsıntı hissedilebilir. Yazılım güncellemesi ile büyük ölçüde çözülür."
            },
            {
                id: 4,
                title: "Multimedya (SMEG/NAC) Ekran Donması",
                severity: "low",
                reportCount: 730,
                description: "Orta ekranın kendi kendine kapanması, geri görüş kamerasının siyah ekranda kalması veya Bluetooth bağlantısının kopması sorunları yazılımsal olarak yaşanmaktadır."
            }
        ],
        userExperiences: [],
        totalReports: 3400
    }`;

if(p3008Regex.test(content)) {
    content = content.replace(p3008Regex, p3008_1stGen + ',\n    ' + p3008_2ndGen);
    fs.writeFileSync('data/vehicle-dna.ts', content);
    console.log("Successfully updated Peugeot 3008 into generations.");
} else {
    console.log("Regex did not match the existing Peugeot 3008 object.");
}
