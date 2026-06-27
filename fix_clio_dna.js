const fs = require('fs');

let content = fs.readFileSync('./data/vehicle-dna.ts', 'utf8');
const lines = content.split('\n');

// ========== HELPER: Find entry boundaries by id ==========
function findEntryLines(lines, targetId) {
    let startLine = -1;
    let endLine = -1;
    for (let i = 0; i < lines.length; i++) {
        const idMatch = lines[i].match(/^\s*id:\s*(\d+)\s*,?\s*$/);
        if (idMatch && parseInt(idMatch[1]) === targetId) {
            // Walk backwards to find the opening {
            for (let j = i - 1; j >= 0; j--) {
                if (lines[j].trim() === '{') {
                    startLine = j;
                    break;
                }
            }
            // Walk forwards to find the closing },
            let braceCount = 1;
            for (let j = i; j < lines.length; j++) {
                // Count braces but skip strings
                const line = lines[j];
                for (let c = 0; c < line.length; c++) {
                    if (line[c] === '{') braceCount++;
                    if (line[c] === '}') braceCount--;
                    if (braceCount === 0) {
                        endLine = j;
                        break;
                    }
                }
                if (endLine !== -1) break;
            }
            break;
        }
    }
    return { startLine, endLine };
}

// ========== NEW ENTRIES ==========

const clio1Entry = `    {
        id: 1001,
        brand: "Renault",
        model: "Clio 1. Nesil (1990-1998)",
        year: "1990-1998",
        ncapStars: 3,
        ncapYear: "1997",
        dnaScore: 58,
        strengths: [
            "Avrupa'da Yılın Otomobili Ödülü (1991 - Lansmanla gelen prestij)",
            "Kompakt Boyut ve Çevik Manevra Kabiliyeti (Şehir içi ideal)",
            "Basit Mekanik Yapı (Tamircide kolay ve ucuz tamir)",
            "Dönemine Göre Modern Tasarım (Süper 5'e kıyasla devrim)",
            "Hafif Kasa ile Düşük Yakıt Tüketimi"
        ],
        weaknesses: [
            "Güvenlik Donanımı Yok Denecek Kadar Az (Hava yastığı çoğu pakette yok)",
            "Kaporta Paslanmaya Çok Müsait (Özellikle çamurluk ve kapı altları)",
            "Plastik Tamponların Solması ve Kırılganlığı",
            "Yalıtım Sıfıra Yakın (Motor, yol ve rüzgar sesi direkt kabine girer)",
            "Klima Çoğu Modelde Bulunmaz"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Kaporta Çürümesi ve Paslanma",
                severity: "high",
                reportCount: 9,
                description: "Özellikle arka çamurluklar, kapı altları, şase kirişleri ve bagaj çevresi yoğun paslanmaya maruz kalır. Galvaniz kaplama olmadığı için nem ve tuz korozyona davetiye çıkarır."
            },
            {
                id: 2,
                title: "Elektrik Tesisatı Sorunları",
                severity: "high",
                reportCount: 8,
                description: "Kablo izolasyonlarının yaşla birlikte sertleşip çatlaması, sigorta kutusundaki oksitlenme ve topraklama hataları. Far, silecek veya sinyal arızaları genelde tesisat kaynaklıdır."
            },
            {
                id: 3,
                title: "Soğutma Sistemi Kaçakları",
                severity: "medium",
                reportCount: 8,
                description: "Genleşme kabı, alt hortumlar ve su pompası contasından su sızıntısı. Eski araçlarda antifriz yerine su kullanımı korozyonu hızlandırarak radyatör tıkanmasına yol açar."
            },
            {
                id: 4,
                title: "Gaz Teli ve Debriyaj Teli Kopması",
                severity: "medium",
                reportCount: 7,
                description: "Tel tahrikli gaz ve debriyaj mekanizmalarında tellerin zamanla uzaması veya kopması. Özellikle kış aylarında soğukta sertleşen teller kopma riski taşır."
            }
        ],
        userExperiences: [],
        totalReports: 7
    }`;

const clio2Entry = `    {
        id: 1002,
        brand: "Renault",
        model: "Clio 2. Nesil (1998-2012)",
        year: "1998-2012",
        ncapStars: 4,
        ncapYear: "2000",
        dnaScore: 68,
        strengths: [
            "Efsanevi 1.5 dCi Motorun İlk Kullanıldığı Kasa (K9K motor dünya çapında kanıtlanmış güvenilirlik)",
            "Kompakt Ama Şaşırtıcı Derecede Geniş İç Mekan",
            "Çok Uzun Üretim Ömrü (Campus olarak 2012'ye kadar - Parça bolluğu)",
            "Türkiye'de Çok Yaygın Servis ve Yedek Parça Ağı",
            "Clio V6 Sport Versiyonu ile Efsane Statüsü",
            "Düşük Sigorta ve İşletme Maliyetleri"
        ],
        weaknesses: [
            "Yaşlanan Kaporta (Özellikle 2005 öncesi modellerde pas riski)",
            "İç Mekan Malzeme Kalitesi (Sert ve çizilmeye müsait plastikler)",
            "Güvenlik Donanımı (Baz modellerde sadece sürücü airbag)",
            "Yalıtım Eksikliği (Motor ve yol sesi kabine fazla gelir)",
            "Otomatik Şanzıman Seçeneğinin Olmaması (Çoğu versiyonda)"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Cam Kriko Motoru Arızası",
                severity: "high",
                reportCount: 9,
                description: "Clio 2'nin en meşhur kronik sorunudur. Özellikle ön kapı cam kriko motorlarının düzenli olarak yanması ve camın yarıda kalması. Piyasada muadil parçalar çok yaygın ve ucuzdur."
            },
            {
                id: 2,
                title: "Kapak Contası ve Yağ Sızıntısı",
                severity: "medium",
                reportCount: 9,
                description: "Üst kapak contası (kep contası) ve karter contasından yağ sızıntısı. Motor bloğu ile kapak arasından süzülen yağ, zamanla enjektör kuyularına da dolabilir."
            },
            {
                id: 3,
                title: "Arka Fren Kampana Problemi",
                severity: "medium",
                reportCount: 8,
                description: "Arka kampana fren balatalarının çabuk aşınması ve fren sıkıştığında ayar mekanizmasının kilitlenmesi. El freni ayarı sık sık yapılması gerekir."
            },
            {
                id: 4,
                title: "Klima Kompresörü ve Gaz Kaçağı",
                severity: "medium",
                reportCount: 7,
                description: "Klima sisteminde gaz kaçağı veya kompresör kavramasının tutmaması. Özellikle yüksek kilometreli araçlarda klimanın hiç soğutmaması şikayeti yaygın."
            },
            {
                id: 5,
                title: "Direksiyon Hidrolik Pompa Sızıntısı",
                severity: "medium",
                reportCount: 7,
                description: "Hidrolik direksiyonlu modellerde pompa keçelerinden sızıntı ve direksiyon ağırlaşması. Özellikle park manevralarında inleme sesi duyulur."
            }
        ],
        userExperiences: [],
        totalReports: 8
    }`;

// ========== REPLACEMENT ENTRIES ==========

const clio3Fixed = `    {
        id: 2017,
        brand: "Renault",
        model: "Clio 3. Nesil (2005-2014)",
        year: "2005-2014",
        ncapStars: 5,
        ncapYear: "2005",
        dnaScore: 72,
        strengths: [
            "5 Yıldız Euro NCAP Güvenlik (2005 testi - Sınıfında ilklerden)",
            "1.5 dCi Motorun Olgunlaşmış ve Güvenilir Performansı (Ortalama 4.5L/100km)",
            "Clio RS 197/200 ile Sıcak Hatch Efsanesi (Nürburgring rekortmeni)",
            "Geniş Ön Yaşam Alanı ve Ergonomik Sürücü Pozisyonu",
            "Ucuz ve Kolay Bulunan Yedek Parça (Türkiye üretimi avantajı)",
            "Dönemine Göre Kaliteli İç Mekan Malzemeleri"
        ],
        weaknesses: [
            "Arka Koltuk ve Bagaj Hacminin Rakiplerine Göre Dar Olması",
            "Otomatik (EDC) Versiyonun Olmaması (Sadece robotize Quickshift var)",
            "Direksiyon Hissiyatının Yapay ve Hafif Olması",
            "Yüksek Hızlarda Rüzgar Sesi (Ayna diplerinden)",
            "Quickshift Robotize Şanzımanın Gecikmeli ve Sarsıntılı Vites Geçişleri"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Ön Yay ve Amortisör Takozu Çökmesi",
                severity: "medium",
                reportCount: 9,
                description: "Ön süspansiyon yaylarının kırılması ve amortisör takozlarının ezilmesi Clio 3'ün en sık karşılaşılan mekanik sorunudur. Bozuk yollarda tok vuruntu sesleri duyulur. Genelde 60.000-80.000 km civarında başlar."
            },
            {
                id: 2,
                title: "Turbo Hortumu Patlaması (1.5 dCi)",
                severity: "high",
                reportCount: 8,
                description: "Turbo intercooler hortumlarının ısı ve basınçla zamanla şişerek patlaması veya kelepçe yerinden çıkması. Araç ani güç kaybı yaşar ve motor arıza lambası yanar. Silikon hortuma geçiş önerilir."
            },
            {
                id: 3,
                title: "Kart Okuyucu ve İmmobilizer Arızası",
                severity: "high",
                reportCount: 8,
                description: "Anahtarsız giriş kartının algılanmaması veya 'Kart Algılanmadı' uyarısıyla aracın çalışmaması. Kart okuyucu modülü veya kartın pilinin bitmesi olabilir. Yedek kartla denenmelidir."
            },
            {
                id: 4,
                title: "Egzoz Esnek Boru Kopmesi",
                severity: "medium",
                reportCount: 7,
                description: "Egzoz manifoldu ile katalizör arasındaki esnek boru bağlantısının çürüyerek kopması. Motor altından gelen metalik ses ve egzoz kokusu belirtileridir."
            },
            {
                id: 5,
                title: "Gösterge Paneli Piksel Bozulması",
                severity: "low",
                reportCount: 8,
                description: "Gösterge panelindeki küçük LCD ekranda (kilometre sayacı, trip bilgisi) piksellerin kaybolması veya solması. Özellikle sıcak havalarda belirginleşir. Ekran modülü değişimi gerektirir."
            }
        ],
        userExperiences: [],
        totalReports: 9
    }`;

const clio5TrimFixed = `    {
        id: 2046,
        brand: "Renault",
        model: "Clio 5 (1.0 TCe - Icon Paket)",
        year: "2020-2025",
        ncapStars: 5,
        ncapYear: "2019",
        dnaScore: 77,
        strengths: [
            "100 HP TCe Motor ile Şehir İçi Yeterli Performans (0-100: 11.8 sn)",
            "Icon Paket ile Zengin Donanım (7'' Ekran, Geri Görüş Kamerası, Otomatik Klima)",
            "Mükemmel Yakıt Ekonomisi (Şehir içi 5.5-6L, uzun yol 4.5L)",
            "5 Yıldız Euro NCAP (Sınıfının en güvenlilerinden)",
            "İkinci Elde Çok Hızlı Satış (En çok aranan B segmenti)"
        ],
        weaknesses: [
            "1.0 TCe Motorun Otoyolda Zorlanması (Sollama için aşağı vites gerekli)",
            "X-Tronic CVT ile Motor Gürültüsü (Tam gaza basınca motor bağırır)",
            "Icon Pakette LED Far Olmaması (Halojen standart)",
            "Arka Koltuk Diz Mesafesi Dar (Uzun yolculuklar için ideal değil)",
            "Start-Stop Sisteminin Sık Arıza Vermesi"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "X-Tronic CVT Düşük Hız Silkelenmesi",
                severity: "medium",
                reportCount: 8,
                description: "X-Tronic şanzımanlı versiyonlarda özellikle 20-40 km/s aralığında ve yokuş çıkışlarda silkelenme/titreme hissedilmesi. Yazılım güncellemesi kısmen çözer."
            },
            {
                id: 2,
                title: "Multimedya Ekranı Donma ve Resetleme",
                severity: "low",
                reportCount: 7,
                description: "Easy Link multimedya sisteminin kendi kendine kapanıp yeniden başlaması veya dokunmatik ekranın yanıt vermemesi. Yazılım güncellemesi ile düzelir."
            },
            {
                id: 3,
                title: "Emniyet Kemeri B Sütunu Tıkırtısı",
                severity: "low",
                reportCount: 9,
                description: "B sütunundan gelen ritmik tıkırtı sesi. Emniyet kemeri mekanizmasının plastik kılıfıyla B sütunu arasında boşluk oluşmasından kaynaklanır."
            }
        ],
        userExperiences: [],
        totalReports: 8
    }`;

const i20Fixed = `    {
        id: 2029,
        brand: "Hyundai",
        model: "i20 1. Nesil PB (2008-2014)",
        year: "2008-2014",
        ncapStars: 5,
        ncapYear: "2009",
        dnaScore: 74,
        strengths: [
            "5 Yıl Fabrika Garantisi ile Gönül Rahatlığı",
            "Sınıfına Göre Geniş İç Mekan ve Bagaj Hacmi (295 Litre)",
            "Düşük Yakıt Tüketimi (1.4 CRDi ile 4.5L/100km)",
            "Sessiz ve Konforlu Kabin Yalıtımı (Sınıfının en iyilerinden)",
            "Sorunsuz ve Güvenilir 1.2/1.4 Atmosferik Benzinli Motorlar"
        ],
        weaknesses: [
            "Sönük ve Sıradan Dış Tasarım (Rakiplerine göre dikkat çekmiyor)",
            "Direksiyon Hissiyatının Çok Hafif ve Yapay Olması",
            "Otomatik Şanzıman Seçeneğinin Sınırlı Olması (4 ileri konvansiyonel)",
            "Düşük Donanımlı Paketlerin Çok Boş Kalması",
            "Sert Plastik İç Mekan Malzemeleri"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Direksiyon Kutusu Boşluğu ve Tıkırtı",
                severity: "medium",
                reportCount: 8,
                description: "Kasislerde direksiyondan gelen tıkırtı sesi ve direksiyondaki boşluk hissi. Genellikle direksiyon rot başı veya rotil bilyası kaynaklı."
            },
            {
                id: 2,
                title: "Arka Fren Kampana ve Balata Gıcırtısı",
                severity: "low",
                reportCount: 7,
                description: "Arka kampana frenlerde özellikle nemli havalarda veya sabah ilk kullanımda metal sürtünme sesi ve gıcırtı duyulması."
            },
            {
                id: 3,
                title: "Klima Kompresörü Kavrama Sesi",
                severity: "low",
                reportCount: 6,
                description: "Klima devreye girerken kompresör kavramasından gelen 'tık' sesi ve hafif sarsıntı. Normal çalışma sesi olup fazla belirginse kavrama kontrolü gerekebilir."
            }
        ],
        userExperiences: [],
        totalReports: 7
    }`;

const symbolFixed = `    {
        id: 156,
        brand: "Renault",
        model: "Symbol / Clio Symbol (2000-2012)",
        year: "2000-2012",
        dnaScore: 63,
        strengths: [
            "1.5 dCi Motorun Efsanevi Yakıt Cimriliği (Şehir içi 5L, uzun yol 3.8L)",
            "Sınıfının En Geniş Bagaj Hacmi (510 Litre - Sedan avantajı)",
            "Çok Düşük Bakım ve İşletme Maliyeti (Parça fiyatları çok ucuz)",
            "Şehir İçinde Kolay Park ve Manevra (Kompakt boyut)",
            "İkinci Elde Anında Nakite Çevrilebilme (Taksi/ticari talep)",
            "Türkiye'de Üretim Avantajı ile Her Yerde Servis Bulunabilirlik"
        ],
        weaknesses: [
            "Konfor Seviyesinin Çok Düşük Olması (Sert süspansiyon, ince koltuk)",
            "Yüksek Hızlarda Ciddi Rüzgar Sesi ve Savrulma Hissi",
            "Arka Diz Mesafesinin Yetersizliği (Uzun yolculuk zor)",
            "İç Mekan Malzeme Kalitesinin Çok Düşük Olması (Sert ve ucuz plastikler)",
            "Güvenlik Donanımının Yetersizliği (Baz paketlerde ABS bile opsiyonel)",
            "Otomatik Vites Seçeneğinin Bulunmaması"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Enjektör ve Mazot Pompası Arızası (dCi)",
                severity: "high",
                reportCount: 9,
                description: "Kötü yakıt kullanımı veya yaşa bağlı olarak enjektörlerin tıkanması veya sızıntı yapması. Mazot pompası arızası ise aracı çalışmaz hale getirebilir. Kaliteli yakıt filtresi kullanımı önerilir."
            },
            {
                id: 2,
                title: "Klima Kompresörü Arızası",
                severity: "medium",
                reportCount: 8,
                description: "Klimanın yeterince soğutmaması veya hiç çalışmaması. Kompresör kavraması veya gaz kaçağı kaynaklı olabiliyor. Orijinal kompresör pahalıdır."
            },
            {
                id: 3,
                title: "Cam Kriko Motoru Bozulması",
                severity: "medium",
                reportCount: 8,
                description: "Clio/Symbol ailesinin ortak sorunu olan cam kriko motorunun yanması. Özellikle sürücü tarafı camın yarıda kalması veya hiç çalışmaması."
            },
            {
                id: 4,
                title: "Debriyaj Baskı ve Balata Erken Aşınması",
                severity: "medium",
                reportCount: 7,
                description: "Şehir içi yoğun trafikte debriyaj setinin 70.000-90.000 km'de değişim gerektirmesi. Debriyaj sertleşmesi veya kaçırması belirtileri verir."
            }
        ],
        userExperiences: [],
        totalReports: 8,
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Renault_Symbol_front_20081206.jpg/800px-Renault_Symbol_front_20081206.jpg"
    }`;

// ========== STEP 1: Remove duplicate id:3021 (random dnaScore Clio 5) ==========
console.log('--- Step 1: Removing id:3021 (random dnaScore Clio 5 trim) ---');
const entry3021 = findEntryLines(lines, 3021);
console.log(`  Found at lines ${entry3021.startLine}-${entry3021.endLine}`);
if (entry3021.startLine !== -1) {
    // Remove the entry + trailing comma
    lines.splice(entry3021.startLine, entry3021.endLine - entry3021.startLine + 1);
    console.log('  Removed successfully.');
} else {
    console.log('  NOT FOUND - skipping.');
}

// ========== STEP 2: Remove duplicate id:120 (duplicate Clio 4) ==========
console.log('--- Step 2: Removing id:120 (duplicate Clio 4) ---');
const entry120 = findEntryLines(lines, 120);
console.log(`  Found at lines ${entry120.startLine}-${entry120.endLine}`);
if (entry120.startLine !== -1) {
    lines.splice(entry120.startLine, entry120.endLine - entry120.startLine + 1);
    console.log('  Removed successfully.');
} else {
    console.log('  NOT FOUND - skipping.');
}

// ========== STEP 3: Fix id:2017 (Clio 3 - wrong years) ==========
console.log('--- Step 3: Fixing id:2017 (Clio 3) ---');
const entry2017 = findEntryLines(lines, 2017);
console.log(`  Found at lines ${entry2017.startLine}-${entry2017.endLine}`);
if (entry2017.startLine !== -1) {
    lines.splice(entry2017.startLine, entry2017.endLine - entry2017.startLine + 1, clio3Fixed);
    console.log('  Replaced successfully.');
} else {
    console.log('  NOT FOUND - skipping.');
}

// ========== STEP 4: Fix id:2046 (Clio 5 trim - generic content) ==========
console.log('--- Step 4: Fixing id:2046 (Clio 5 trim) ---');
const entry2046 = findEntryLines(lines, 2046);
console.log(`  Found at lines ${entry2046.startLine}-${entry2046.endLine}`);
if (entry2046.startLine !== -1) {
    lines.splice(entry2046.startLine, entry2046.endLine - entry2046.startLine + 1, clio5TrimFixed);
    console.log('  Replaced successfully.');
} else {
    console.log('  NOT FOUND - skipping.');
}

// ========== STEP 5: Fix id:2029 (i20/Clio 4 -> just i20) ==========
console.log('--- Step 5: Fixing id:2029 (i20/Clio 4 -> i20 only) ---');
const entry2029 = findEntryLines(lines, 2029);
console.log(`  Found at lines ${entry2029.startLine}-${entry2029.endLine}`);
if (entry2029.startLine !== -1) {
    lines.splice(entry2029.startLine, entry2029.endLine - entry2029.startLine + 1, i20Fixed);
    console.log('  Replaced successfully.');
} else {
    console.log('  NOT FOUND - skipping.');
}

// ========== STEP 6: Fix id:156 (Symbol / Clio Symbol) ==========
console.log('--- Step 6: Fixing id:156 (Symbol / Clio Symbol) ---');
const entry156 = findEntryLines(lines, 156);
console.log(`  Found at lines ${entry156.startLine}-${entry156.endLine}`);
if (entry156.startLine !== -1) {
    lines.splice(entry156.startLine, entry156.endLine - entry156.startLine + 1, symbolFixed);
    console.log('  Replaced successfully.');
} else {
    console.log('  NOT FOUND - skipping.');
}

// ========== STEP 7: Add Clio 1 and Clio 2 after Clio 5 (id:1) ==========
console.log('--- Step 7: Adding Clio 1 and Clio 2 ---');
const entry1 = findEntryLines(lines, 1);
console.log(`  Clio 5 (id:1) found at lines ${entry1.startLine}-${entry1.endLine}`);
if (entry1.startLine !== -1) {
    // Insert after the Clio 5 entry (after endLine which has },)
    const insertAfter = entry1.endLine + 1;
    const newEntries = clio1Entry + ',\n' + clio2Entry + ',';
    lines.splice(insertAfter, 0, newEntries);
    console.log('  Added Clio 1 and Clio 2 after Clio 5.');
} else {
    console.log('  Clio 5 NOT FOUND - skipping.');
}

// ========== WRITE RESULT ==========
content = lines.join('\n');
fs.writeFileSync('./data/vehicle-dna.ts', content, 'utf8');
console.log('\n=== All changes written to vehicle-dna.ts ===');

// ========== VERIFICATION ==========
console.log('\n--- Verification ---');
const verifyContent = fs.readFileSync('./data/vehicle-dna.ts', 'utf8');

// Check for Math.random
const randomMatches = verifyContent.match(/Math\.random/g);
console.log(`Math.random occurrences: ${randomMatches ? randomMatches.length : 0}`);

// Check Clio entries
const clioMatches = verifyContent.match(/model:.*Clio/g);
console.log(`Clio entries found: ${clioMatches ? clioMatches.length : 0}`);
if (clioMatches) {
    clioMatches.forEach(m => console.log(`  - ${m.trim()}`));
}

// Check for duplicate IDs among Clio entries
const idRegex = /id:\s*(\d+),/g;
const allIds = [];
let idMatch;
while ((idMatch = idRegex.exec(verifyContent)) !== null) {
    allIds.push(parseInt(idMatch[1]));
}
const duplicateIds = allIds.filter((id, index) => allIds.indexOf(id) !== index);
if (duplicateIds.length > 0) {
    console.log(`WARNING: Duplicate IDs found: ${[...new Set(duplicateIds)].join(', ')}`);
} else {
    console.log('No duplicate IDs found.');
}

// Check year correctness for Clio 3
if (verifyContent.includes('"2005-2014"') && verifyContent.includes('Clio 3')) {
    console.log('Clio 3 year verified: 2005-2014 ✓');
} else {
    console.log('WARNING: Clio 3 year may not be correct!');
}
