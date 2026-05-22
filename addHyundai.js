const fs = require('fs');

const vehicleDNAFile = 'data/vehicle-dna.ts';
let vehicleDNAContent = fs.readFileSync(vehicleDNAFile, 'utf-8');

const newVehiclesStr = `,
    {
        id: 1004,
        brand: "Hyundai",
        model: "i20 3. Nesil (2020-Günümüz)",
        year: "2020-2025",
        ncapStars: 4,
        ncapYear: "2021",
        dnaScore: 82,
        strengths: [
            "Çok dikkat çekici, sportif ve yenilikçi dış tasarım",
            "1.4 MPI motor ve 6 ileri tork konvertörlü tam otomatik şanzımanın mükemmel uyumu ve arıza yapmama garantisi",
            "Sınıfına göre çok geniş arka diz mesafesi ve 352 litrelik büyük bagaj hacmi",
            "Apple CarPlay, kablosuz şarj ve dijital gösterge gibi teknolojik donanımların zenginliği",
            "İkinci el piyasasında çok hızlı alınıp satılabilmesi"
        ],
        weaknesses: [
            "1.4 MPI motorun ivmelenmede zayıf kalması ve şehir içi 9-10 litreleri bulan yüksek yakıt tüketimi",
            "Süspansiyonların sportif sürüş odaklı, yani biraz sert olması (çukurları hissettirmesi)",
            "Kabin içinde, özellikle kapı içlerinde ve konsolda kullanılan sert plastik malzemeler",
            "Yüksek hızlarda (110 km/s üzeri) kabin içine alınan yol ve rüzgar sesi"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "EPS Direksiyon Kaplini Tıkırtısı",
                severity: "medium",
                reportCount: 215,
                description: "Özellikle bozuk veya parke taşlı yollarda direksiyon kutusundan tıkırtı gelmesi kroniktir. EPS kaplini değişimi veya yağlanması ile çözülür, kronik bir Hyundai/Kia sorunudur."
            },
            {
                id: 2,
                title: "Trim (Plastik) Sesleri",
                severity: "low",
                reportCount: 140,
                description: "Havaların soğumasıyla veya bozuk yollarda ön konsoldan ve kapı döşemelerinden tıkırtılar (trim sesi) gelebilir."
            }
        ],
        userExperiences: [
            {
                id: 1,
                author: "TasarimciKiz",
                authorLevel: "Gümüş Üye",
                text: "Tasarımına aşık olup 1.4 otomatiğini aldım. Çok havalı duruyor, içi çok geniş. Ama İstanbul trafiğinde su gibi benzin içiyor. LPG taktırmak şart oldu.",
                likes: 88,
                replies: 14,
                date: "2024-01-05",
                rating: 4
            },
            {
                id: 2,
                author: "HizliPilot",
                authorLevel: "Bronz Üye",
                text: "1.0 T-GDI DCT versiyonu uçak gibi kaçıyor. 1.4'teki o hantallık yok. Vites geçişleri efsane hızlı. Fakat süspansiyonlar belimi ağrıtıyor bozuk yollarda.",
                likes: 65,
                replies: 10,
                date: "2023-11-12",
                rating: 4
            }
        ],
        totalReports: 625,
        imageUrl: "https://images.unsplash.com/photo-1695420138139-448f22ed1525?q=80&w=2070&auto=format&fit=crop"
    },
    {
        id: 1005,
        brand: "Hyundai",
        model: "Tucson 4. Nesil (2021-Günümüz)",
        year: "2021-2025",
        ncapStars: 5,
        ncapYear: "2021",
        dnaScore: 88,
        strengths: [
            "Parametrik gizli aydınlatmalı ızgarasıyla trafikte herkesin dönüp baktığı fütüristik tasarım",
            "C-SUV segmentinin en geniş iç hacimlerinden ve en büyük bagajlarından (620 litre) birini sunması",
            "Adaptif hız sabitleyici, şerit takip ve çarpışma önleme gibi güvenlik asistanlarının kusursuz çalışması",
            "Premium araç hissiyatı veren kaliteli iç mekan ve yüksek çözünürlüklü ekranlar",
            "Dört tekerlekten çekiş (HTRAC) opsiyonunun son derece başarılı olması"
        ],
        weaknesses: [
            "1.6 T-GDI benzinli motorun cüsseli kasada 10 litrenin altına düşmeyen yüksek yakıt tüketimi",
            "Konsoldaki parlak siyah (Piano Black) plastiklerin ve dokunmatik tuşların anında çizilmesi ve toz tutması",
            "Fiziksel tuş olmaması sebebiyle sürüş esnasında klima ayarı yapmanın dikkat dağıtması",
            "7 ileri DCT şanzımanın yoğun dur-kalk trafikte kararsızlık yaşaması ve ısınma eğilimi"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "DCT Şanzıman Isınma Uyarısı",
                severity: "high",
                reportCount: 310,
                description: "Özellikle çok dik yokuşlarda veya saatler süren dur-kalk trafiğinde, çift kavramalı (DCT) şanzıman ısınarak ekranda 'Şanzıman Isındı, Durun' uyarısı verebilir."
            },
            {
                id: 2,
                title: "Multimedya Yazılım Sorunları",
                severity: "low",
                reportCount: 120,
                description: "Zaman zaman geri görüş kamerasının siyah ekran vermesi veya Bluetooth bağlantısının kopması yaşanıyor. Serviste yapılan güncellemelerle çözülüyor."
            }
        ],
        userExperiences: [
            {
                id: 1,
                author: "SUV_Tutkunu",
                authorLevel: "Altın Üye",
                text: "Tasarımı hala ilk günkü gibi heyecan veriyor. Arka koltukta bacak bacak üstüne atılıyor. Bagaj devasa. 1.6 benzinli modelde performans müthiş ama yakıtı görünce insan bir ağlıyor.",
                likes: 145,
                replies: 22,
                date: "2024-04-10",
                rating: 5
            },
            {
                id: 2,
                author: "GezginBaba",
                authorLevel: "Gümüş Üye",
                text: "1.6 CRDi Dizel kullanıcısıyım. Tork efsane, rampa mampa dinlemiyor. Yakıtı da dizel olduğu için makul. Tek sıkıntım klima tuşlarını bulamamak, yola bakarken derece kısmak işkence.",
                likes: 92,
                replies: 15,
                date: "2023-12-05",
                rating: 4
            }
        ],
        totalReports: 854,
        imageUrl: "https://images.unsplash.com/photo-1629897048514-3dd741427cc7?q=80&w=2072&auto=format&fit=crop"
    }
`;

const lastBracketIndex = vehicleDNAContent.lastIndexOf('];');
if (lastBracketIndex !== -1) {
    vehicleDNAContent = vehicleDNAContent.substring(0, lastBracketIndex) + newVehiclesStr + vehicleDNAContent.substring(lastBracketIndex);
    fs.writeFileSync(vehicleDNAFile, vehicleDNAContent, 'utf-8');
    console.log("Added Hyundai vehicles to vehicle-dna.ts");
}

const engineDNAFile = 'data/engine-dna.ts';
let engineDNAContent = fs.readFileSync(engineDNAFile, 'utf-8');

const newEnginesStr = `,
    {
        vehicleId: 1004,
        engines: [
            {
                slug: "14-mpi-100-hp-benzin-otomatik",
                name: "1.4 MPI 100 HP",
                fuelType: "Benzin",
                transmission: "Tam Otomatik (6AT)",
                score: 84,
                chronicIssues: [
                    { title: "Yüksek Yakıt Tüketimi", description: "Atmosferik motor ve tork konvertör sebebiyle yoğun trafikte sarfiyat fazladır.", severity: "low", reportCount: 300 }
                ]
            },
            {
                slug: "10-tgdi-100-hp-benzin-dct",
                name: "1.0 T-GDI 100 HP",
                fuelType: "Benzin",
                transmission: "Çift Kavrama (DCT)",
                score: 80,
                chronicIssues: [
                    { title: "DCT Kavrama Titremesi", description: "Düşük hızlarda veya dur-kalk trafikte kavramada hafif sarsıntılar hissedilebilir.", severity: "medium", reportCount: 150 }
                ]
            }
        ]
    },
    {
        vehicleId: 1005,
        engines: [
            {
                slug: "16-tgdi-180-hp-benzin-dct",
                name: "1.6 T-GDI 180 HP",
                fuelType: "Benzin",
                transmission: "Çift Kavrama (DCT)",
                score: 85,
                chronicIssues: [
                    { title: "Şanzıman Isınması", description: "Uzun süreli yokuş kalkışlarında ve trafikte kavrama ısınma uyarısı verebilir.", severity: "high", reportCount: 310 }
                ]
            },
            {
                slug: "16-crdi-136-hp-dizel-dct",
                name: "1.6 CRDi 136 HP",
                fuelType: "Dizel",
                transmission: "Çift Kavrama (DCT)",
                score: 88,
                chronicIssues: [
                    { title: "EGR / DPF Tıkanıklığı", description: "Sürekli şehir içi kullanımlarda dizel partikül filtresi dolabilmektedir.", severity: "medium", reportCount: 180 }
                ]
            }
        ]
    }
`;

const engineLastBracketIndex = engineDNAContent.lastIndexOf('];');
if (engineLastBracketIndex !== -1) {
    engineDNAContent = engineDNAContent.substring(0, engineLastBracketIndex) + newEnginesStr + engineDNAContent.substring(engineLastBracketIndex);
    fs.writeFileSync(engineDNAFile, engineDNAContent, 'utf-8');
    console.log("Added Hyundai engines to engine-dna.ts");
}
