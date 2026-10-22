export interface TopSellingVehicleGuide {
    vehiclePath: string;
    rank: number;
    registrations: number;
    period: string;
    generation: string;
    decision: string;
    idealFor: string[];
    attention: string[];
    categories: Array<{ title: string; detail: string }>;
    officialSource: string;
}

export const topSellingVehicleGuides: TopSellingVehicleGuide[] = [
    {
        vehiclePath: "renault/clio-5-nesil-2020-2025",
        rank: 1,
        registrations: 31643,
        period: "Ocak–Ağustos 2026",
        generation: "Clio 5 · 2020–2025",
        decision: "Şehir içinde kolay kullanılan, ikinci eli canlı ve işletme maliyeti öngörülebilir bir hatchback isteyenler için güçlü adaydır. Motor ve şanzıman seçimi, aracın karakterini belirleyen temel karardır.",
        idealFor: ["Yoğun şehir kullanımı", "Kolay park ve düşük tüketim", "Güçlü ikinci el talebi"],
        attention: ["EDC bakım ve kullanım geçmişi", "Turbo motorlarda düzenli yağ bakımı", "Test sürüşünde trim ve süspansiyon sesleri"],
        categories: [
            { title: "Motor ve şanzıman", detail: "1.0 TCe günlük kullanım için dengeli seçenektir. EDC tercihinde kalkış, düşük hız geçişleri ve bakım faturaları birlikte kontrol edilmelidir." },
            { title: "Kabin ve kullanım", detail: "Kompakt ölçüler şehirde avantaj sağlar; arka yaşam alanı ve uzun yol bagaj ihtiyacı satın alma öncesi birebir denenmelidir." },
            { title: "İkinci el kontrolü", detail: "Soğuk çalıştırma, turbo sesi, şanzıman geçişleri, ön takım ve hasar geçmişi aynı ekspertiz akışında incelenmelidir." },
        ],
        officialSource: "https://www.renault.com.tr/hybrid-araclar/yeni-clio/teknik-bilgiler.html",
    },
    {
        vehiclePath: "toyota/corolla-12-nesil-2019-2025",
        rank: 2,
        registrations: 22009,
        period: "Ocak–Ağustos 2026",
        generation: "Corolla 12. Nesil · 2019–2026",
        decision: "Konfor, aile kullanımı ve değer koruma dengesini arayanlar için güvenli bir kısa liste aracıdır. 1.5 benzinli ile 1.8 hibrit, kullanım rotasına göre ayrı değerlendirilmelidir.",
        idealFor: ["Aile ve uzun dönem kullanım", "Şehir içi hibrit verimliliği", "Geniş servis erişimi"],
        attention: ["Hibrit batarya sağlık raporu", "CVT/e-CVT kullanım karakteri", "Alt takım ve kaporta geçmişi"],
        categories: [
            { title: "Motor seçimi", detail: "1.5 Multidrive S sade kullanım sunarken 1.8 hibrit yoğun şehir trafiğinde verimlilik avantajı sağlar; yıllık kilometre hesabı yapılmalıdır." },
            { title: "Aile kullanımı", detail: "Sedan gövde, 4,63 metrelik uzunluk ve 471 litreye varan bagaj hacmiyle aile ihtiyaçlarına odaklanır." },
            { title: "Ekspertiz", detail: "Hibritte batarya test çıktısı; benzinlide soğuk çalışma ve CVT tepkisi, her iki versiyonda bakım kaydıyla birlikte görülmelidir." },
        ],
        officialSource: "https://www.toyota.com.tr/araba-modelleri/corolla-sedan",
    },
    {
        vehiclePath: "renault/megane-4-nesil-2016-2025",
        rank: 3,
        registrations: 19938,
        period: "Ocak–Ağustos 2026",
        generation: "Megane 4 Sedan · 2016–2026",
        decision: "Geniş sedan isteyen, uzun yol konforuna ve yaygın servis ağına önem veren kullanıcılar için mantıklı bir alternatiftir. Motor geçmişi kadar EDC kullanım geçmişi de fiyatı belirlemelidir.",
        idealFor: ["Uzun yol ve aile kullanımı", "Geniş bagaj ihtiyacı", "Dengeli konfor"],
        attention: ["EDC kavrama davranışı", "Dizelde DPF/EGR kullanım geçmişi", "Elektronik donanım kontrolleri"],
        categories: [
            { title: "Güç aktarma", detail: "1.3 TCe 140 bg ve 240 Nm güncel benzinli seçenek için yeterli performans sunar; eski dizellerde kullanım profili ve emisyon sistemi kontrol edilmelidir." },
            { title: "Yol karakteri", detail: "2,71 metrelik dingil mesafesi ve sedan yerleşimi uzun yolda dengeli bir karakter verir; jant ölçüsü konforu etkileyebilir." },
            { title: "Satın alma kontrolü", detail: "Soğuk çalışma, şanzıman geçişleri, multimedya ve sürüş destekleri ayrı ayrı denenmeli; periyodik bakım belgeleri görülmelidir." },
        ],
        officialSource: "https://www.renault.com.tr/binek-araclar/megane-sedan.html",
    },
    {
        vehiclePath: "togg/t10x-1-nesil-2023-2025",
        rank: 4,
        registrations: 17783,
        period: "Ocak–Ağustos 2026",
        generation: "T10X 1. Nesil · 2023–2026",
        decision: "Elektrikli otomobile geçerken geniş kabin, yerli servis ekosistemi ve yüksek teknoloji isteyenler için değerlendirilmelidir. Karar, evde şarj imkânı ve gerçek rota planıyla verilmelidir.",
        idealFor: ["Evde veya işte şarj erişimi", "Geniş aile kullanımı", "Bağlantılı araç deneyimi"],
        attention: ["Batarya ve yazılım sürümü", "DC şarj eğrisi ve rota", "Lastik/ağırlık kaynaklı kullanım maliyeti"],
        categories: [
            { title: "Menzil ve şarj", detail: "Versiyona göre menzil değişir; katalog değerinden önce günlük rota, kış koşulu ve yüzde 20–80 şarj alışkanlığı hesaplanmalıdır." },
            { title: "Performans", detail: "218 PS arkadan itişli yapı akıcı hızlanma sunar. Yüksek anlık tork nedeniyle lastik durumu test sürüşünde özellikle kontrol edilmelidir." },
            { title: "Dijital sistemler", detail: "Teslimden önce yazılım sürümü, mobil uygulama eşleşmesi, kameralar ve sürüş destekleri kontrol listesiyle denenmelidir." },
        ],
        officialSource: "https://togg.com.tr/t10x",
    },
    {
        vehiclePath: "renault/duster-3-nesil-2024-2026",
        rank: 5,
        registrations: 17469,
        period: "Ocak–Ağustos 2026",
        generation: "Renault Duster 3. Nesil · 2024–2026",
        decision: "Yüksek yerden açıklık, geniş yükleme alanı ve farklı güç aktarma seçeneklerini uygun maliyet odağında birleştiren aile SUV’sidir. 4x2, hibrit ve 4x4 ihtiyacı kullanım senaryosuna göre seçilmelidir.",
        idealFor: ["Bozuk yol ve hafta sonu kullanımı", "594 litreye varan bagaj", "Benzin, hibrit, LPG veya 4x4 seçimi"],
        attention: ["Versiyon ve çekiş sistemini doğru eşleştirme", "Yeni nesilde yazılım güncellemeleri", "Arazi kullanımında alt gövde kontrolü"],
        categories: [
            { title: "Motor ailesi", detail: "Turbo TCe EDC 145 bg, full hybrid E-Tech 160 bg, hybrid 4x4 150 bg ve Eco-G 120 bg birbirinden farklı kullanım maliyeti ve çekiş karakteri sunar." },
            { title: "Gövde ve pratiklik", detail: "209–217 mm’ye varan yerden yükseklik ve 594 litreye varan bagaj, günlük kullanım ile hafif arazi ihtiyacını bir araya getirir." },
            { title: "Doğru versiyon", detail: "Sadece görünüşe göre değil; yıllık kilometre, şehir trafiği, LPG erişimi, çekme ihtiyacı ve gerçek 4x4 gereksinimine göre seçilmelidir." },
        ],
        officialSource: "https://www.renault.com.tr/hybrid-araclar/yeni-renault-duster/teknik-bilgiler.html",
    },
];

export const topSellingPeriod = "Ocak–Ağustos 2026";
export const topSellingSourceUrl = "https://www.odmd.org.tr/web_2837_2/neuralnetwork.aspx?type=35";

export function getTopSellingVehicleGuide(brandSlug: string, modelSlug: string) {
    return topSellingVehicleGuides.find((guide) => guide.vehiclePath === `${brandSlug}/${modelSlug}`) || null;
}
