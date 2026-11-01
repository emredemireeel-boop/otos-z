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

export const SAMPLE_EXPERT_QUESTIONS: ShowcaseExpertQuestion[] = [];

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
