export interface ShowcaseEntry {
    id: string;
    username: string;
    role: string;
    content: string;
    likes: number;
    dateLabel: string;
}

export interface ShowcaseExpertQuestion {
    id: string;
    title: string;
    category: string;
    tags: string[];
    authorUsername: string;
    dateLabel: string;
    description: string;
    entries: ShowcaseEntry[];
}

export interface ShowcaseVehicle {
    name: string;
    href: string;
    summary: string;
    votes: number;
}

export interface ShowcaseComparison {
    id: string;
    title: string;
    category: string;
    tags: string[];
    authorUsername: string;
    dateLabel: string;
    description: string;
    vehicles: ShowcaseVehicle[];
    entries: ShowcaseEntry[];
}

export const SAMPLE_EXPERT_QUESTIONS: ShowcaseExpertQuestion[] = [
    {
        id: 'ornek-dizel-arac-sogukta-beyaz-duman',
        title: 'Dizel araç soğukta beyaz duman atıyor; hangi kontroller yapılmalı?',
        category: 'Motor',
        tags: ['Motor', 'Dizel', 'Soğuk çalıştırma'],
        authorUsername: 'otosoz_ornek',
        dateLabel: 'Örnek kayıt',
        description: '2017 model 1.5 dCi aracım ilk çalıştırmada yaklaşık bir dakika beyaz duman atıyor. Motor ısınınca duman kesiliyor; su ve yağ seviyesinde gözle görülür eksilme yok. Enjektör, kızdırma bujisi veya conta ihtimallerini hangi sırayla kontrol ettirmeliyim?',
        entries: [
            {
                id: 'ornek-soru',
                username: 'otosoz_ornek',
                role: 'Örnek sürücü',
                content: '2017 model 1.5 dCi aracım ilk çalıştırmada yaklaşık bir dakika beyaz duman atıyor. Motor ısınınca duman kesiliyor; su ve yağ seviyesinde gözle görülür eksilme yok. Enjektör, kızdırma bujisi veya conta ihtimallerini hangi sırayla kontrol ettirmeliyim?',
                likes: 0,
                dateLabel: 'Örnek soru',
            },
            {
                id: 'ornek-uzman-yaniti',
                username: 'otosoz_uzman_ornegi',
                role: 'Örnek uzman yanıtı',
                content: 'Soğukta kısa süreli beyaz duman önce kızdırma sistemi ve enjektör geri dönüş değerleriyle birlikte değerlendirilmelidir. Soğutma suyu eksilmesi, yağ kapağında emülsiyon veya sürekli duman varsa conta ihtimali ayrıca araştırılır. Arıza kodu taraması, kızdırma bujisi ölçümü ve enjektör geri dönüş testiyle başlanması; parça değiştirmeden önce kompresyon ve soğutma sistemi basınç testinin yapılması uygun olur.',
                likes: 0,
                dateLabel: 'Örnek yanıt',
            },
            {
                id: 'ornek-dizel-servis-gorusu',
                username: 'dizel_servis_ornegi',
                role: 'Örnek dizel servis görüşü',
                content: 'Dumanın kokusu ve kaybolma süresi ilk ayrım için önemlidir. Keskin yanmamış yakıt kokusu soğuk yanma veya kızdırma-enjektör tarafını; tatlımsı koku ve sürekli buhar ise soğutma sıvısı ihtimalini düşündürebilir. Tek belirtiyle parça kararı verilmemeli, soğuk motorla kontrollü test yapılmalıdır.',
                likes: 0,
                dateLabel: 'Örnek görüş',
            },
            {
                id: 'ornek-oto-elektrik-gorusu',
                username: 'oto_elektrik_ornegi',
                role: 'Örnek oto elektrik görüşü',
                content: 'Kızdırma bujileri yalnızca gözle kontrol edilmez. Bujilerin direnç ve akım değerleriyle birlikte kızdırma rölesi, besleme voltajı ve motor su sıcaklık sensörü verisi ölçülmelidir. Sensör motoru gerçekte olduğundan sıcak gösterirse kızdırma süresi yetersiz kalabilir.',
                likes: 0,
                dateLabel: 'Örnek görüş',
            },
            {
                id: 'ornek-enjektor-gorusu',
                username: 'enjektor_uzmani_ornegi',
                role: 'Örnek enjektör uzmanı görüşü',
                content: 'Enjektör için yalnızca rölanti düzeltme değerine bakmak yeterli değildir. Motor tamamen soğukken canlı düzeltme değerleri, geri dönüş miktarları ve rail basıncının hedefe ulaşma süresi birlikte kaydedilmelidir. Sapma görülürse tezgâh testi parça değişiminden önce gelir.',
                likes: 0,
                dateLabel: 'Örnek görüş',
            },
            {
                id: 'ornek-motor-mekanik-gorusu',
                username: 'motor_mekanik_ornegi',
                role: 'Örnek motor mekanik görüşü',
                content: 'Kızdırma ve enjektör kontrolleri normal çıkarsa silindirler arası kompresyon dengesi incelenebilir. Ölçümün üretici prosedürüne uygun yapılması gerekir; tek bir düşük değer, kaçak testi ve supap-zamanlama kontrolleriyle doğrulanmadan motor açma gerekçesi değildir.',
                likes: 0,
                dateLabel: 'Örnek görüş',
            },
            {
                id: 'ornek-sogutma-gorusu',
                username: 'sogutma_sistemi_ornegi',
                role: 'Örnek soğutma sistemi görüşü',
                content: 'Su seviyesi sabit görünse bile genleşme kabı çevresi, hortum sertleşmesi ve ilk çalıştırmada kabarcık gözlemi not alınabilir. Şüphe varsa soğutma sistemi basınç testi ve yanma gazı testi uygulanır; sıcak motorda genleşme kabı kapağı kesinlikle açılmaz.',
                likes: 0,
                dateLabel: 'Örnek görüş',
            },
            {
                id: 'ornek-obd-gorusu',
                username: 'obd_teshis_ornegi',
                role: 'Örnek arıza tespit görüşü',
                content: 'Arıza hafızasını silmeden önce kayıtlı ve bekleyen kodlar ile freeze-frame verisi alınmalıdır. Kızdırma devresi, silindir katkı dengesi, yakıt basıncı ve sıcaklık sensörü kodları kontrol sırasını daraltabilir. Kod bulunmaması mekanik arızayı tek başına dışlamaz.',
                likes: 0,
                dateLabel: 'Örnek görüş',
            },
            {
                id: 'ornek-servis-danismani-gorusu',
                username: 'servis_danismani_ornegi',
                role: 'Örnek servis danışmanı görüşü',
                content: 'Servise giderken dış sıcaklık, ilk marş süresi, dumanın kaç saniye sürdüğü, yakıt alınan istasyon ve son bakım kilometresi not edilirse arıza tekrarı daha kolay yakalanır. Mümkünse ilk çalıştırmanın kısa videosu da teşhis süresini azaltabilir.',
                likes: 0,
                dateLabel: 'Örnek görüş',
            },
            {
                id: 'ornek-guvenlik-gorusu',
                username: 'guvenlik_uzmani_ornegi',
                role: 'Örnek güvenlik notu',
                content: 'Duman motor ısındığında kesilmiyorsa, hararet yükseliyorsa, soğutma suyu hızla azalıyorsa veya motor düzensiz ve vuruntulu çalışıyorsa aracı zorlamayın. Güvenli yerde durup çekici veya profesyonel servis desteği alın.',
                likes: 0,
                dateLabel: 'Örnek görüş',
            },
            {
                id: 'ornek-kullanici-deneyimi',
                username: 'surucu_deneyimi_ornegi',
                role: 'Örnek kullanıcı deneyimi',
                content: 'Benzer belirti yaşayan bir sürücüde sorun kızdırma bujisiyle çözülmüş olabilir; ancak aynı belirti farklı araçta enjektör, sensör veya kompresyon kaynaklı çıkabilir. Kullanıcı deneyimi kontrol listesine yardımcı olur, doğrudan teşhis yerine geçmez.',
                likes: 0,
                dateLabel: 'Örnek görüş',
            },
            {
                id: 'ornek-editor-kontrol-sirasi',
                username: 'otosoz_editor',
                role: 'Örnek kontrol özeti',
                content: 'Pratik sıra: 1) sıvı seviyeleri ve duman karakteri, 2) arıza kodu ile canlı sıcaklık verisi, 3) kızdırma devresi, 4) enjektör geri dönüş ve rail basıncı, 5) gerekirse kompresyon ile soğutma sistemi testleri. Ölçüm sonucu olmadan parça değişimi yapılmamalıdır.',
                likes: 0,
                dateLabel: 'Örnek editör notu',
            },
        ],
    },
    {
        id: 'ornek-dsg-kalkista-titreme',
        title: 'DSG şanzıman kalkışta titriyor; kavrama mı, mekatronik mi?',
        category: 'Sanzıman',
        tags: ['Sanzıman', 'DSG', 'Titreme'],
        authorUsername: 'otosoz_ornek',
        dateLabel: 'Örnek kayıt',
        description: 'Araç özellikle ısındıktan sonra birinci viteste ve geri manevrada titriyor. Vites geçişlerinde sert vuruntu yok. Kavrama adaptasyonu yeterli olabilir mi, yoksa mekanik kontrol mü gerekir?',
        entries: [
            {
                id: 'ornek-soru',
                username: 'otosoz_ornek',
                role: 'Örnek sürücü',
                content: 'Araç özellikle ısındıktan sonra birinci viteste ve geri manevrada titriyor. Vites geçişlerinde sert vuruntu yok. Kavrama adaptasyonu yeterli olabilir mi, yoksa mekanik kontrol mü gerekir?',
                likes: 0,
                dateLabel: 'Örnek soru',
            },
            {
                id: 'ornek-uzman-yaniti',
                username: 'otosoz_uzman_ornegi',
                role: 'Örnek uzman yanıtı',
                content: 'Titremenin sıcaklıkla artması kavrama aşınması veya adaptasyon değerleriyle ilişkili olabilir; tek başına belirtiyle mekatronik kararı verilmez. Önce şanzıman hata kodları, kavrama aşınma değerleri ve üretici prosedürüne uygun adaptasyon kontrol edilmelidir. Yağ kaçağı ve motor-şanzıman takozları da elenmeden parça değişimine gidilmemelidir.',
                likes: 0,
                dateLabel: 'Örnek yanıt',
            },
        ],
    },
    {
        id: 'ornek-lastik-ebadi-degisimi',
        title: '205/55 R16 yerine 225/45 R17 takmak konforu ve tüketimi nasıl etkiler?',
        category: 'Lastik',
        tags: ['Lastik', 'Jant', 'Ebat'],
        authorUsername: 'otosoz_ornek',
        dateLabel: 'Örnek kayıt',
        description: 'Aracın ruhsat ve kapı etiketi alternatif 17 inç ölçüsünü destekliyor. Daha iyi görünüm istiyorum ancak şehir içinde konforun çok bozulmasını ve yakıt tüketiminin belirgin artmasını istemiyorum.',
        entries: [
            {
                id: 'ornek-soru',
                username: 'otosoz_ornek',
                role: 'Örnek sürücü',
                content: 'Aracın ruhsat ve kapı etiketi alternatif 17 inç ölçüsünü destekliyor. Daha iyi görünüm istiyorum ancak şehir içinde konforun çok bozulmasını ve yakıt tüketiminin belirgin artmasını istemiyorum.',
                likes: 0,
                dateLabel: 'Örnek soru',
            },
            {
                id: 'ornek-uzman-yaniti',
                username: 'otosoz_uzman_ornegi',
                role: 'Örnek uzman yanıtı',
                content: 'Daha geniş taban ve daha kısa yanak direksiyon tepkisini keskinleştirebilir; buna karşılık bozuk zeminde konfor azalabilir ve lastik-jant ağırlığına bağlı olarak tüketim bir miktar artabilir. Üreticinin onayladığı yük ve hız endeksinden sapmayın; toplam çap farkını, jant ofsetini ve çamurluk mesafesini lastik uzmanıyla doğrulayın.',
                likes: 0,
                dateLabel: 'Örnek yanıt',
            },
        ],
    },
];

export const SAMPLE_COMPARISONS: ShowcaseComparison[] = [
    {
        id: 'ornek-clio-5-vs-egea',
        title: 'Renault Clio 5 mi Fiat Egea mı? Şehir içi kullanım',
        category: '2 Araç',
        tags: ['2 Araç', 'Şehir içi', 'Ekonomi'],
        authorUsername: 'otosoz_ornek',
        dateLabel: 'Örnek kayıt',
        description: 'Günlük şehir içi kullanım, park kolaylığı, yakıt gideri ve ikinci el erişilebilirliği açısından iki popüler seçeneği değerlendiren örnek karşılaştırma.',
        vehicles: [
            {
                name: 'Renault Clio 5',
                href: '/arac-dna/renault/clio-5-nesil-2020-2025',
                summary: 'Kompakt ölçüler ve şehir içi manevra kolaylığı önceliği olanlar için.',
                votes: 14,
            },
            {
                name: 'Fiat Egea',
                href: '/arac-dna/fiat/egea-1-nesil-2015-2025',
                summary: 'İç hacim, bagaj ve yaygın servis erişimi önceliği olanlar için.',
                votes: 11,
            },
        ],
        entries: [
            {
                id: 'ornek-degerlendirme',
                username: 'otosoz_editor',
                role: 'Örnek değerlendirme',
                content: 'Clio 5 dar sokaklarda ve parkta daha rahat bir paket sunarken Egea aile kullanımı ve yükleme alanında öne çıkabilir. Karar verirken aynı bütçedeki motor, şanzıman ve donanım seviyelerini birebir eşleştirmek gerekir.',
                likes: 0,
                dateLabel: 'Örnek değerlendirme',
            },
        ],
    },
    {
        id: 'ornek-corolla-vs-megane-4',
        title: 'Toyota Corolla mı Renault Megane 4 mü? Aile otomobili seçimi',
        category: '2 Araç',
        tags: ['2 Araç', 'Aile', 'Sedan'],
        authorUsername: 'otosoz_ornek',
        dateLabel: 'Örnek kayıt',
        description: 'Konfor, arka yaşam alanı, kullanım maliyeti ve ikinci el beklentisi üzerinden hazırlanmış örnek aile otomobili senaryosu.',
        vehicles: [
            {
                name: 'Toyota Corolla 12. Nesil',
                href: '/arac-dna/toyota/corolla-12-nesil-2019-2025',
                summary: 'Sakin kullanım, hibrit seçeneği ve öngörülebilir sahiplik önceliği olanlar için.',
                votes: 18,
            },
            {
                name: 'Renault Megane 4',
                href: '/arac-dna/renault/megane-4-nesil-2016-2025',
                summary: 'Sürüş karakteri, motor seçenekleri ve ikinci el alternatifleri önceliği olanlar için.',
                votes: 13,
            },
        ],
        entries: [
            {
                id: 'ornek-degerlendirme',
                username: 'otosoz_editor',
                role: 'Örnek değerlendirme',
                content: 'Model adından önce motor-şanzıman eşleşmesi, bakım geçmişi ve gerçek ekspertiz sonucu karşılaştırılmalıdır. Aynı fiyat bandında daha temiz geçmişe sahip araç, donanım farkından daha değerli olabilir.',
                likes: 0,
                dateLabel: 'Örnek değerlendirme',
            },
        ],
    },
    {
        id: 'ornek-golf-8-vs-civic-11',
        title: 'Volkswagen Golf 8 mi Honda Civic 11 mi? Günlük kullanım',
        category: '2 Araç',
        tags: ['2 Araç', 'Günlük kullanım', 'Teknoloji'],
        authorUsername: 'otosoz_ornek',
        dateLabel: 'Örnek kayıt',
        description: 'Kompakt boyut, kabin teknolojisi, sürüş konforu ve uzun dönem kullanım beklentisini yan yana getiren örnek seçim senaryosu.',
        vehicles: [
            {
                name: 'Volkswagen Golf 8',
                href: '/arac-dna/volkswagen/golf-8-nesil-2020-2025',
                summary: 'Kompakt hatchback ölçüsü ve dijital kabin deneyimi önceliği olanlar için.',
                votes: 12,
            },
            {
                name: 'Honda Civic 11',
                href: '/arac-dna/honda/civic-11-nesil-fe1-2021-2025',
                summary: 'Sedan yaşam alanı ve daha geleneksel kullanım ergonomisi önceliği olanlar için.',
                votes: 16,
            },
        ],
        entries: [
            {
                id: 'ornek-degerlendirme',
                username: 'otosoz_editor',
                role: 'Örnek değerlendirme',
                content: 'Bu iki otomobil farklı gövde ihtiyaçlarına hitap eder. Park alanı ve kompaktlık Golf tarafını; arka yaşam alanı ve sedan bagajı Civic tarafını güçlendirebilir. Test sürüşünde görüş açıları, koltuk konumu ve multimedya kullanımını ayrıca deneyin.',
                likes: 0,
                dateLabel: 'Örnek değerlendirme',
            },
        ],
    },
];

export function getSampleExpertQuestion(id: string): ShowcaseExpertQuestion | undefined {
    return SAMPLE_EXPERT_QUESTIONS.find(question => question.id === id);
}

export function getSampleComparison(id: string): ShowcaseComparison | undefined {
    return SAMPLE_COMPARISONS.find(comparison => comparison.id === id);
}
