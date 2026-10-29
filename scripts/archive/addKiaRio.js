const fs = require('fs');

const vehicleDNAFile = 'data/vehicle-dna.ts';
let vehicleDNAContent = fs.readFileSync(vehicleDNAFile, 'utf-8');

const newVehicleStr = `,
    {
        id: 1003,
        brand: "Kia",
        model: "Rio 4. Nesil (2017-2023)",
        year: "2017-2023",
        ncapStars: 5,
        ncapYear: "2017",
        dnaScore: 79,
        strengths: [
            "1.4 MPI motorda sunulan tam otomatik şanzımanın yüksek dayanıklılığı ve sarsıntısız geçişleri",
            "B segmentine göre oldukça ferah ve ergonomik iç mekan tasarımı",
            "Hyundai i20 ile ortak parça kullanımı sayesinde ucuz ve kolay bulunabilen yedek parça",
            "Genel mekanik güvenilirliğinin sınıf standartlarının üzerinde olması",
            "Atmosferik motorların LPG uyumunun çok iyi olması"
        ],
        weaknesses: [
            "1.4 MPI otomatik versiyonun şehir içi yakıt tüketiminin rakiplerine göre yüksek olması",
            "1.25 MPI versiyonunda yüklüyken ve yokuşlarda belirgin çekiş düşüklüğü",
            "Süspansiyonların rakiplerine (örneğin Clio) göre daha sert olması",
            "Yüksek hızlarda kabin içine alınan yol ve rüzgar sesi"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Direksiyon Kutusu Tıkırtısı",
                severity: "medium",
                reportCount: 185,
                description: "Özellikle parke taşlı veya bozuk yollarda direksiyon kutusundan tıkırtı benzeri sesler gelmesi bilinen bir durumdur. Genellikle eps kaplini değişimi veya kutu revizyonu ile çözülür."
            },
            {
                id: 2,
                title: "Multimedya Ekran Donmaları",
                severity: "low",
                reportCount: 95,
                description: "Ara sıra multimedya sisteminin donması veya Apple CarPlay/Android Auto bağlantısının kopması yaşanabilir. Yazılım güncellemesi ile büyük ölçüde giderilir."
            }
        ],
        userExperiences: [
            {
                id: 1,
                author: "SehirIciSurucusu",
                authorLevel: "Altın Üye",
                text: "1.4 otomatik olanını 3 yıldır kullanıyorum. Vites geçişlerini hissetmiyorsunuz bile, DSG gibi sorun çıkarır mı korkusu yok. Tek derdim şehir içi 8.5-9 litreyi bulabilen yakıt tüketimi.",
                likes: 56,
                replies: 8,
                date: "2024-02-15",
                rating: 4
            },
            {
                id: 2,
                author: "RioMan",
                authorLevel: "Gümüş Üye",
                text: "Süspansiyonları bana biraz sert geldi, bozuk yollarda konfor düşüyor ama bunun karşılığında yol tutuşu sınıfına göre gayet güven veriyor. i20 yerine tercih ettim, daha sportif duruyor.",
                likes: 34,
                replies: 3,
                date: "2023-09-28",
                rating: 4
            }
        ],
        totalReports: 512,
        imageUrl: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fd?q=80&w=2070&auto=format&fit=crop"
    }
`;

const lastBracketIndex = vehicleDNAContent.lastIndexOf('];');
if (lastBracketIndex !== -1) {
    vehicleDNAContent = vehicleDNAContent.substring(0, lastBracketIndex) + newVehicleStr + vehicleDNAContent.substring(lastBracketIndex);
    fs.writeFileSync(vehicleDNAFile, vehicleDNAContent, 'utf-8');
    console.log("Added Kia Rio to vehicle-dna.ts");
}

const engineDNAFile = 'data/engine-dna.ts';
let engineDNAContent = fs.readFileSync(engineDNAFile, 'utf-8');

const newEngineStr = `,
    {
        vehicleId: 1003,
        engines: [
            {
                slug: "14-mpi-100-hp-benzin-otomatik",
                name: "1.4 MPI 100 HP",
                fuelType: "Benzin",
                transmission: "Tam Otomatik",
                score: 82,
                chronicIssues: [
                    { title: "Ateşleme Bobini Hassasiyeti", description: "Özellikle LPG'li kullanımlarda bobin ömrü kısalabilmektedir.", severity: "low", reportCount: 65 }
                ]
            },
            {
                slug: "125-mpi-84-hp-benzin-manuel",
                name: "1.25 MPI 84 HP",
                fuelType: "Benzin",
                transmission: "Manuel",
                score: 75,
                chronicIssues: [
                    { title: "Debriyaj Kavrama Titremesi", description: "Yoğun trafikte ısınan debriyaj balatası ilk kalkışlarda hafif titreme yapabilir.", severity: "low", reportCount: 110 }
                ]
            }
        ]
    }
`;

const engineLastBracketIndex = engineDNAContent.lastIndexOf('];');
if (engineLastBracketIndex !== -1) {
    engineDNAContent = engineDNAContent.substring(0, engineLastBracketIndex) + newEngineStr + engineDNAContent.substring(engineLastBracketIndex);
    fs.writeFileSync(engineDNAFile, engineDNAContent, 'utf-8');
    console.log("Added Kia Rio engines to engine-dna.ts");
}
