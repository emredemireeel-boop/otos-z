const fs = require('fs');
const file = './data/vehicle-dna.ts';
let content = fs.readFileSync(file, 'utf8');

const newVehicles = [
    {
        id: 156, brand: "Renault", model: "Symbol / Clio Symbol", year: "2000-2012", score: 60,
        strengths: ["1.5 dCi motorun efsanevi yakıt cimriliği", "Geniş bagaj hacmi", "Şehir içinde kolay park ve manevra", "İkinci elde anında nakite çevrilebilme"],
        weaknesses: ["Konfor seviyesinin düşük olması", "Yüksek hızlarda rüzgar sesi ve savrulma", "Arka diz mesafesi darlığı", "Malzeme kalitesinin düşük olması"],
        issues: [
            { title: "Enjektör ve Mazot Pompası (dCi)", desc: "Kötü yakıt kullanımı veya yaşa bağlı olarak enjektör tıkanması/bozulması.", severity: "high" },
            { title: "Klima Kompresörü", desc: "Özellikle eski modellerde klimanın yeterince soğutmaması veya kompresör arızası.", severity: "medium" }
        ],
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Renault_Symbol_front_20081206.jpg/800px-Renault_Symbol_front_20081206.jpg"
    },
    {
        id: 157, brand: "Fiat", model: "Linea", year: "2007-2018", score: 65,
        strengths: ["Tam bir aile arabası, bagajı devasadır", "1.3 Multijet motorun dayanıklılığı ve ekonomisi", "Bakım ve yedek parça maliyetlerinin çok düşük olması", "Türkiye şartlarına uygun yerden yüksek yapısı"],
        weaknesses: ["Şehir içinde 1.3 motorun kalkışlarda hantal kalması", "Yol sesi yalıtımının zayıf olması", "İç mekanda sert plastik kullanımı"],
        issues: [
            { title: "EGR ve DPF Tıkanıklığı", desc: "Sürekli şehir içi kullanımda Partikül Filtresi ve EGR valfi dolar.", severity: "medium" },
            { title: "Zincir Sesi (1.3 Multijet)", desc: "100.000 km üzeri triger zincirinden ses gelmesi ve değişmesi gerekmesi.", severity: "high" },
            { title: "Direksiyon Kutusu Boşluğu", desc: "Tıkırtı burçlarının aşınması sonucu direksiyondan gelen boşluk ve tıkırtı.", severity: "medium" }
        ],
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Fiat_Linea_front.JPG/800px-Fiat_Linea_front.JPG"
    },
    {
        id: 158, brand: "Peugeot", model: "206", year: "1998-2012", score: 58,
        strengths: ["Yıllara meydan okuyan muazzam tasarım", "Şehir içinde çok pratik ve çevik olması", "Özellikle 1.4 HDi ve LPG'li modellerinin çok az yakması"],
        weaknesses: ["Elektronik sorunlara olan yatkınlığı", "Arka torsiyon sisteminin pahalı ve kronik arızası", "Arka yaşam alanının dar olması"],
        issues: [
            { title: "Arka Torsiyon (Dingil) Arızası", desc: "Arka tekerleklerin içe doğru yatması ve kasislerde gıcırtı gelmesi, tamiri masraflıdır.", severity: "high" },
            { title: "Elektrik Sistemi ve Müşürler", desc: "Sinyal kolu (COM2000) arızası, kendi kendine sinyal verme veya far açma kroniktir.", severity: "high" },
            { title: "Kalorifer Peteği Su Sızıntısı", desc: "Paspasların altının ıslanması, petek değişimi için göğsün sökülmesi gerekir.", severity: "medium" }
        ],
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Peugeot_206_front_20080612.jpg/800px-Peugeot_206_front_20080612.jpg"
    },
    {
        id: 159, brand: "Honda", model: "Civic FD6", year: "2006-2012", score: 82,
        strengths: ["Uzay mekiği gibi dijital gösterge tablosu", "LPG ile mükemmel uyumlu 1.6 i-VTEC motoru", "Sorunsuz tam otomatik şanzımanı", "Tasarımının hala modern durması"],
        weaknesses: ["Yol ve rüzgar sesini kabine fazlasıyla alması", "Bagaj hacminin rakiplerine göre küçük olması", "Süspansiyonların sert olması ve çukur hissettirmesi"],
        issues: [
            { title: "Direksiyon Kutusu Tıkırtısı", desc: "Parke taşlı veya bozuk yollarda direksiyon kutusundan gelen ses.", severity: "medium" },
            { title: "Otomatik Cam Mekanizması Düşmesi", desc: "Özellikle şoför camının yuvadan çıkarak çapraz kalkması/inmesi.", severity: "low" },
            { title: "Motor Takozu Çökmesi", desc: "Motor takozunun ezilerek rölantide kabin içine titreme vermesi.", severity: "medium" }
        ],
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/2006-2008_Honda_Civic_VTi-L_sedan_01.jpg/800px-2006-2008_Honda_Civic_VTi-L_sedan_01.jpg"
    },
    {
        id: 160, brand: "Opel", model: "Vectra B", year: "1995-2002", score: 64,
        strengths: ["Dönemine göre çok yüksek donanım ve konfor", "Yol tutuşunun tank gibi güven vermesi", "Geniş iç hacim ve D segmenti hissi", "Aynalarla bütünleşen aerodinamik tasarım"],
        weaknesses: ["Elektronik arıza verme potansiyeli yüksektir", "Yedek parçaları eski bir araca göre pahalıdır", "Şehir içi yakıt tüketimi fazladır (2.0 ve 1.6 motor)"],
        issues: [
            { title: "Eksantrik ve Krank Devir Sensörü", desc: "Motorun birden stop etmesi veya geç çalışmasına sebep olur.", severity: "medium" },
            { title: "EGR Valfi ve Rölanti Dalgalanması", desc: "Stop etme, rölantide devrin sürekli inip çıkması.", severity: "medium" },
            { title: "Yol Bilgisayarı (TID/MID) Ekran Piksel Kaybı", desc: "Ekranda çizgiler oluşması ve yazıların okunmaz hale gelmesi.", severity: "low" }
        ],
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Opel_Vectra_B_front_20080313.jpg/800px-Opel_Vectra_B_front_20080313.jpg"
    },
    {
        id: 161, brand: "Tofaş", model: "Murat 131", year: "1977-1988", score: 50,
        strengths: ["Türkiye otomotiv tarihinin ilk gözağrılarından", "Modifiyeye ve klasik restorasyona uygun altyapı", "Basit motor mimarisi", "Yedek parçasının çok ucuz olması"],
        weaknesses: ["Paslanmaya aşırı müsait kaporta", "Güvenlik, konfor veya yalıtımın hiç olmaması", "Fren mesafesinin çok uzun olması"],
        issues: [
            { title: "Yoğun Kaporta Çürümeleri", desc: "Tavan hariç neredeyse tüm aksamlarda pas ve çürüme gözlemlenmesi.", severity: "high" },
            { title: "Karbüratör Karışım Sorunu", desc: "Karbüratörün sık sık ayar istemesi.", severity: "medium" },
            { title: "Diferansiyel Ötmesi", desc: "Arka diferansiyelden özellikle hızlandıkça gelen uğultu.", severity: "medium" }
        ],
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Fiat_124.jpg/800px-Fiat_124.jpg"
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
    const updated = content.substring(0, lastIndex) + ',\n' + newDataBlock + content.substring(lastIndex);
    fs.writeFileSync(file, updated);
}
