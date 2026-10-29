const fs = require('fs');

const vehicleDNAFile = 'data/vehicle-dna.ts';
let vehicleDNAContent = fs.readFileSync(vehicleDNAFile, 'utf-8');

const newVehicleStr = `,
    {
        id: 1002,
        brand: "Renault",
        model: "Symbol 1.0 SCe",
        year: "2017-2021",
        ncapStars: 3,
        ncapYear: "2013",
        dnaScore: 68,
        strengths: [
            "Atmosferik motorun getirdiği sadelik ve düşük bakım maliyeti",
            "Şehir içi kullanıma uygun düşük yakıt tüketimi",
            "Sınıfına göre devasa bagaj hacmi (510 litre)",
            "LPG uyumu yüksek (atmosferik enjeksiyon)",
            "Yedek parça ucuzluğu ve servis ağının çok geniş olması"
        ],
        weaknesses: [
            "Düşük tork (97 Nm) sebebiyle yokuşlarda çekişten düşme",
            "Klima açıkken veya araç doluyken performans kaybı",
            "Yüksek hızlarda yetersiz ses yalıtımı",
            "Sert plastik ağırlıklı, basit iç mekan kalitesi",
            "Güvenlik donanımlarının sadece temel seviyede olması"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Rölanti dalgalanması",
                severity: "medium",
                reportCount: 145,
                description: "Boğaz kelebeğinin kirlenmesi veya ateşleme bobinlerindeki hassasiyet nedeniyle rölantide titreme ve dalgalanma yaşanabiliyor. Temizlik veya bobin değişimi ile çözülür."
            },
            {
                id: 2,
                title: "Triger kayışı ömrü",
                severity: "high",
                reportCount: 85,
                description: "1.0 SCe motorlarda triger seti değişim periyoduna çok dikkat edilmeli. Kayış kopması durumunda motorda ağır hasarlar oluşabilir."
            },
            {
                id: 3,
                title: "Amortisör ve alt takım sesleri",
                severity: "low",
                reportCount: 230,
                description: "Özellikle bozuk yollarda ön takımdan ve amortisör kulelerinden lokurtu şeklinde sesler gelmesi kronik sayılabilir."
            }
        ],
        userExperiences: [
            {
                id: 1,
                author: "Taksi_Cem",
                authorLevel: "Gümüş Üye",
                text: "Şehir içi taksi ve kurye işinde kullanıyoruz. Yakıtı kokluyor adeta. Ama uzun yola veya yokuşlu bölgelere pek gelmez. Düz yolda problemsiz.",
                likes: 42,
                replies: 5,
                date: "2024-03-12",
                rating: 4
            },
            {
                id: 2,
                author: "AileBabası",
                authorLevel: "Bronz Üye",
                text: "Bagajı puset ve valizler için harika. Fakat araç sollarken 2 kez düşünmek gerekiyor. Tork çok zayıf. LPG taktırdım, şu an bedavaya geziyorum resmen.",
                likes: 85,
                replies: 12,
                date: "2023-11-20",
                rating: 3
            }
        ],
        totalReports: 742,
        imageUrl: "https://images.unsplash.com/photo-1549314418-6c841bb749f7?q=80&w=2070&auto=format&fit=crop"
    }
`;

// Insert into vehicle-dna.ts just before the last ];
const lastBracketIndex = vehicleDNAContent.lastIndexOf('];');
if (lastBracketIndex !== -1) {
    vehicleDNAContent = vehicleDNAContent.substring(0, lastBracketIndex) + newVehicleStr + vehicleDNAContent.substring(lastBracketIndex);
    fs.writeFileSync(vehicleDNAFile, vehicleDNAContent, 'utf-8');
    console.log("Added to vehicle-dna.ts");
}

const engineDNAFile = 'data/engine-dna.ts';
let engineDNAContent = fs.readFileSync(engineDNAFile, 'utf-8');

const newEngineStr = `,
    {
        vehicleId: 1002,
        engines: [
            {
                slug: "10-sce-73-hp-benzin-manuel",
                name: "1.0 SCe 73 HP",
                fuelType: "Benzin",
                transmission: "Manuel",
                score: 75,
                chronicIssues: [
                    { title: "Rölanti Dalgalanması", description: "Boğaz kelebeği kirliliği kaynaklı titreme.", severity: "medium", reportCount: 145 },
                    { title: "Yağ Eksiltme (Yüksek KM)", description: "Bazı yüksek kilometreli araçlarda periyodik yağ eksiltmesi gözlemlenmiştir.", severity: "low", reportCount: 92 }
                ]
            }
        ]
    }
`;

const engineLastBracketIndex = engineDNAContent.lastIndexOf('];');
if (engineLastBracketIndex !== -1) {
    engineDNAContent = engineDNAContent.substring(0, engineLastBracketIndex) + newEngineStr + engineDNAContent.substring(engineLastBracketIndex);
    fs.writeFileSync(engineDNAFile, engineDNAContent, 'utf-8');
    console.log("Added to engine-dna.ts");
}
