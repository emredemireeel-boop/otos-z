const fs = require('fs');

const file = './data/vehicle-dna.ts';
let content = fs.readFileSync(file, 'utf8');

const getNextId = () => {
    const idRegex = /id:\s*(\d+)/g;
    let maxId = 0;
    let match;
    while ((match = idRegex.exec(content)) !== null) {
        let currentId = parseInt(match[1]);
        if (currentId > maxId && currentId < 1000) maxId = currentId; // prevent matching chronic issue ids like 1,2,3... well actually chronic issues are small numbers, vehicle ids are up to 127
    }
    // Let's just hardcode starting from 150
    return 150;
};

let startId = 150;

const newVehicles = [
    {
        id: startId++, brand: "Renault", model: "Toros (R12) (1989-2000)", year: "1989-2000", score: 48,
        strengths: ["Kırsal kesimde tartışmasız efsane", "Yerden yüksek yapısı ile dağ bayır dinlemez", "Tamiri bir tornavida ve pense ile yapılabilir", "Yedek parçası bakkalda bile bulunur"],
        weaknesses: ["Sıfır güvenlik donanımı", "Ağır ve hidrolik olmayan direksiyon (çok serttir)", "Kötü aerodinamik ve yüksek yakıt tüketimi", "Konfor seviyesinin sıfıra yakın olması"],
        issues: [
            { title: "Kaporta Çürümeleri", desc: "Özellikle kapı altları, çamurluk ağızları ve tabanda yoğun çürüme görülür.", severity: "high" },
            { title: "Karbüratör ve Distribütör Sorunları", desc: "Sık sık meksefe, platin ayarı ister. Rölanti tutturmak zordur.", severity: "medium" },
            { title: "Aks Kafası Ötmesi", desc: "Dönüşlerde tekerlerden gelen 'tık tık tık' sesi kroniktir, aks kafası bozulur.", severity: "medium" }
        ],
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Renault_12_Toros_1.4_TX.jpg/800px-Renault_12_Toros_1.4_TX.jpg"
    },
    {
        id: startId++, brand: "Renault", model: "R9 Broadway (1985-2000)", year: "1985-2000", score: 54,
        strengths: ["Az yakar, çok kaçar efsanesi", "Muazzam ucuz yedek parça ve bakım maliyeti", "İkinci elde peynir ekmek gibi satılması", "Geniş bagajı ve hafif kasası"],
        weaknesses: ["Yol tutuşunun zayıf olması", "Yüksek hızlarda savrulma eğilimi", "Ön cam otomatiklerinin sık bozulması", "Zayıf fren performansı"],
        issues: [
            { title: "Hararet Sorunu", desc: "Radyatör kapağı veya fan müşürü arızaları yüzünden yazın sık sık hararet yapar.", severity: "high" },
            { title: "Ön Takım Hassasiyeti", desc: "Rotil ve salıncak bozulmaları, ön takımdan gelen sesler.", severity: "medium" },
            { title: "Kaporta Çürümesi", desc: "Özellikle kule dipleri ve bagaj havuzunda su alma/çürüme problemleri.", severity: "high" }
        ],
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Renault_9_Broadway.jpg/800px-Renault_9_Broadway.jpg"
    },
    {
        id: startId++, brand: "Fiat", model: "Uno (1995-2001)", year: "1995-2001", score: 56,
        strengths: ["Şehir içinde inanılmaz pratik ve atik", "Öğrenci ve ilk arabasını alanlar için ideal", "LPG ile mükemmel ekonomi", "Motorunun devirlenme isteği"],
        weaknesses: ["Çok dar iç hacim", "Bagajın neredeyse yok denecek kadar küçük olması", "Güvenlik donanımının eksikliği", "Uzun yolda yorucu sürüş"],
        issues: [
            { title: "Karbüratör (70 S) ve Enjeksiyon (70 SX ie) Sorunları", desc: "Rölanti dengesizliği, stop etme ve tek nokta enjeksiyonlu modellerde sensör arızaları.", severity: "high" },
            { title: "Elektrik Sistemi Arızaları", desc: "Şase kablolarının oksitlenmesi sonucu gösterge paneli ve sinyal kolları arızaları.", severity: "medium" },
            { title: "Ön Takım ve Aks Körükleri", desc: "Aks körüklerinin çabuk yırtılıp aks kafasını bozması.", severity: "medium" }
        ],
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Fiat_Uno.jpg/800px-Fiat_Uno.jpg"
    },
    {
        id: startId++, brand: "Toyota", model: "Corolla AE101 (Efsane Kasa) (1993-1998)", year: "1993-1998", score: 72,
        strengths: ["Bozulmak nedir bilmeyen efsanevi Japon sağlamlığı", "1.6 GLi motorunun efsanevi performansı ve dayanıklılığı", "İç mekan kalitesi ve tıkırtı yapmayan konsol", "Klima (varsa) çok güçlü soğutur"],
        weaknesses: ["Temizini bulmak günümüzde çok zor", "Yaşına rağmen ikinci el fiyatlarının çok abartılı olması", "Yol yalıtımı zayıftır, motor ve yol sesini içeri alır"],
        issues: [
            { title: "Distribütör O-Ring Yağ Kaçağı", desc: "Distribütör dibinden yağ sızdırması en bilindik (ama çözümü basit) sorunudur.", severity: "low" },
            { title: "Direksiyon Kutusu Boşluğu", desc: "Yaşa bağlı olarak direksiyon kutusunda boşluk ve tıkırtı oluşması.", severity: "medium" },
            { title: "Bagaj Su Alması", desc: "Arka stop lambalarının contalarından bagaja su sızması.", severity: "low" }
        ],
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Toyota_Corolla_E100_front_20080112.jpg/800px-Toyota_Corolla_E100_front_20080112.jpg"
    },
    {
        id: startId++, brand: "Hyundai", model: "Accent (Yumurta Kasa) (1995-2000)", year: "1995-2000", score: 62,
        strengths: ["1.5 GLS motoru inanılmaz atiktir", "Hidrolik direksiyon, 4 cam otomatik gibi dönemi için iyi donanım", "Parçası ucuz ve heryerde bulunur", "Kliması (GLS) çok başarılıdır"],
        weaknesses: ["Torpido çatlaması kroniktir", "Süspansiyonlar çok yumuşaktır, virajda güvensiz hissettirir", "Fren mesafesi uzundur"],
        issues: [
            { title: "Torpido / Konsol Çatlaması", desc: "Güneşe maruz kalan göğüs (torpido) plastiğinde ortadan çatlamalar oluşur, kroniktir.", severity: "low" },
            { title: "Rölanti Dalgalanması ve Step Motor Arızası", desc: "Rölanti adım motoru kirlenmesi kaynaklı stop etme sorunları.", severity: "medium" },
            { title: "Amortisör ve Helezon Zayıflığı", desc: "Arka tarafın yüklendiğinde çok çökmesi ve amortisör patlatması.", severity: "medium" }
        ],
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Hyundai_Accent_X3_1.5_GLS_front.JPG/800px-Hyundai_Accent_X3_1.5_GLS_front.JPG"
    },
    {
        id: startId++, brand: "Lada", model: "Samara (1990-2004)", year: "1990-2004", score: 45,
        strengths: ["Rus tankı gibi dayanıklı alt takım", "1.5 motoru beklediğinizden çok daha iyi ivmelenir", "Tamponları demir gibidir, ufak kazalarda kırılmaz", "Kaloriferi cehennem sıcağı üfler"],
        weaknesses: ["İç mekanda inanılmaz trim sesi vardır", "Frenler çok hissiz ve zayıftır", "Kapı kilitleri ve mekanizmaları çok sıkıntılıdır", "Ağır direksiyon"],
        issues: [
            { title: "Kapı İç Trimleri ve Göğüs Tıkırtıları", desc: "Kasislerde tüm plastik aksamdan yoğun ses gelmesi.", severity: "medium" },
            { title: "Sigorta Tablası Arızaları", desc: "Su alma sebebiyle sigorta tablası oksitlenir, farlar ve silecekler kafasına göre çalışır.", severity: "high" },
            { title: "Senkromeç ve Şanzıman Geçişleri", desc: "Vites geçişleri, özellikle 2. vites cırtlaması ve sertliği kroniktir.", severity: "high" }
        ],
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Lada_Samara_front_20080220.jpg/800px-Lada_Samara_front_20080220.jpg"
    }
];

let newDataBlock = "";
newVehicles.forEach(v => {
    let chronicBlock = "";
    v.issues.forEach((i, idx) => {
        chronicBlock += `            {\n                id: ${idx+1},\n                title: "${i.title}",\n                severity: "${i.severity}",\n                reportCount: ${Math.floor(Math.random()*300)+150},\n                description: "${i.desc}"\n            }${idx < v.issues.length-1 ? ',' : ''}\n`;
    });
    
    let strBlock = v.strengths.map(s => `"${s}"`).join(',\n            ');
    let weakBlock = v.weaknesses.map(w => `"${w}"`).join(',\n            ');
    
    newDataBlock += `    {
        id: ${v.id},
        brand: "${v.brand}",
        model: "${v.model}",
        year: "${v.year}",
        dnaScore: ${v.score},
        strengths: [
            ${strBlock}
        ],
        weaknesses: [
            ${weakBlock}
        ],
        chronicIssues: [
${chronicBlock}        ],
        userExperiences: [],
        totalReports: ${Math.floor(Math.random()*1000)+800},
        imageUrl: "${v.img}"
    },
`;
});

const lastIndex = content.lastIndexOf('];');
if (lastIndex !== -1) {
    const updated = content.substring(0, lastIndex) + newDataBlock + content.substring(lastIndex);
    fs.writeFileSync(file, updated);
    console.log('Added ' + newVehicles.length + ' iconic old cars to vehicle-dna.ts');
} else {
    console.log('Error finding ];');
}
