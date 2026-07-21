export type MarketStatus = "verified" | "needs-confirmation" | "historical";

export interface MarketSource {
    label: string;
    url: string;
    publisher: string;
    publishedAt?: string;
    official: boolean;
}

export interface OpenCarMarket {
    slug: string;
    province: string;
    provinceSlug: string;
    district: string;
    name: string;
    shortName: string;
    address?: string;
    day?: string;
    hours?: string;
    status: MarketStatus;
    summary: string;
    verificationNote: string;
    checkedAt: string;
    sourceDateLabel: string;
    sources: MarketSource[];
    imageUrl?: string;
    legacyEventId?: string;
}

export interface ProvinceEntry {
    name: string;
    slug: string;
    plate: number;
    featured?: boolean;
}

const TURKISH_CHARACTERS: Record<string, string> = {
    ç: "c",
    ğ: "g",
    ı: "i",
    ö: "o",
    ş: "s",
    ü: "u",
    Ç: "c",
    Ğ: "g",
    İ: "i",
    Ö: "o",
    Ş: "s",
    Ü: "u",
};

export function toMarketSlug(value: string): string {
    return value
        .split("")
        .map((character) => TURKISH_CHARACTERS[character] ?? character)
        .join("")
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}

const PROVINCE_NAMES = [
    "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Amasya", "Ankara", "Antalya", "Artvin",
    "Aydın", "Balıkesir", "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale",
    "Çankırı", "Çorum", "Denizli", "Diyarbakır", "Edirne", "Elazığ", "Erzincan", "Erzurum",
    "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari", "Hatay", "Isparta", "Mersin",
    "İstanbul", "İzmir", "Kars", "Kastamonu", "Kayseri", "Kırklareli", "Kırşehir", "Kocaeli",
    "Konya", "Kütahya", "Malatya", "Manisa", "Kahramanmaraş", "Mardin", "Muğla", "Muş", "Nevşehir",
    "Niğde", "Ordu", "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas", "Tekirdağ", "Tokat",
    "Trabzon", "Tunceli", "Şanlıurfa", "Uşak", "Van", "Yozgat", "Zonguldak", "Aksaray", "Bayburt",
    "Karaman", "Kırıkkale", "Batman", "Şırnak", "Bartın", "Ardahan", "Iğdır", "Yalova", "Karabük",
    "Kilis", "Osmaniye", "Düzce",
] as const;

const FEATURED_PROVINCES = new Set([
    "İstanbul", "Ankara", "İzmir", "Bursa", "Antalya", "Adana", "Konya", "Kayseri", "Eskişehir", "Sakarya",
]);

export const TURKEY_PROVINCES: ProvinceEntry[] = PROVINCE_NAMES.map((name, index) => ({
    name,
    slug: toMarketSlug(name),
    plate: index + 1,
    featured: FEATURED_PROVINCES.has(name),
}));

export const OPEN_CAR_MARKETS: OpenCarMarket[] = [
    {
        slug: "kocasinan-acik-oto-pazari",
        province: "Kayseri",
        provinceSlug: "kayseri",
        district: "Kocasinan",
        name: "Kayseri Kocasinan Açık Oto Pazarı",
        shortName: "Kocasinan Açık Oto Pazarı",
        address: "Yıldızevler Mahallesi, Oto Galericiler Sitesi çevresi, Kocasinan",
        day: "Pazar",
        status: "verified",
        summary: "Kayseri merkezdeki ikinci el araç pazarı Kocasinan'daki oto galericiler bölgesinde kuruluyor.",
        verificationNote: "Belediye kayıtları pazar yerinin varlığını, Yahyalı Belediyesi de Kayseri merkez pazarının pazar günleri kurulduğunu doğruluyor. Güncel açılış-kapanış saati resmî sayfalarda yayımlanmadığı için saat bilgisi verilmedi.",
        checkedAt: "2026-07-21",
        sourceDateLabel: "Resmî kayıtlardan doğrulandı; saat teyidi bekleniyor",
        sources: [
            {
                label: "Kayseri merkez pazarının pazar günü kurulduğuna ilişkin belediye açıklaması",
                url: "https://www.yahyali.bel.tr/haberler/ilcemizde-2el-oto-pazari-acildi",
                publisher: "Yahyalı Belediyesi",
                official: true,
            },
            {
                label: "Kocasinan 2. el oto alım satım pazar yeri kaydı",
                url: "https://kocasinan.bel.tr/uiimg/content_59_2016-03-05_pp2013.pdf",
                publisher: "Kocasinan Belediyesi",
                official: true,
            },
        ],
        imageUrl: "/otopazari_final_12.png",
        legacyEventId: "kayseri-kocasinan-otopazari",
    },
    {
        slug: "yahyali-ikinci-el-oto-pazari",
        province: "Kayseri",
        provinceSlug: "kayseri",
        district: "Yahyalı",
        name: "Yahyalı 2. El Oto Pazarı",
        shortName: "Yahyalı Oto Pazarı",
        day: "Cumartesi",
        status: "verified",
        summary: "Yahyalı Belediyesi tarafından ilçe ticaretini canlandırmak amacıyla kurulan ikinci el oto pazarıdır.",
        verificationNote: "Belediyenin resmî duyurusu pazarın her cumartesi kurulduğunu belirtiyor. Açık adres ve güncel saat bilgisi duyuruda yer almadığından yola çıkmadan önce belediyeden teyit edilmesi gerekir.",
        checkedAt: "2026-07-21",
        sourceDateLabel: "Belediye duyurusundan doğrulandı; adres ve saat teyidi önerilir",
        sources: [
            {
                label: "İlçemizde 2. El Oto Pazarı Açıldı",
                url: "https://www.yahyali.bel.tr/haberler/ilcemizde-2el-oto-pazari-acildi",
                publisher: "Yahyalı Belediyesi",
                official: true,
            },
        ],
        imageUrl: "/otopazari_final_12.png",
    },
    {
        slug: "kepez-acik-oto-pazari",
        province: "Antalya",
        provinceSlug: "antalya",
        district: "Kepez",
        name: "Antalya Kepez Açık Oto Pazarı",
        shortName: "Kepez Açık Oto Pazarı",
        address: "Baraj Mahallesi, Kepez",
        status: "verified",
        summary: "Kepez Belediyesi 2026 programında ilçe sınırları içinde bir oto pazarının faal olduğunu kayda geçiriyor.",
        verificationNote: "Pazarın varlığı güncel belediye programıyla doğrulandı. Baraj Mahallesi konumu sektör kaynağında yer alıyor; belediye güncel gün ve saat takvimi yayımlamadığı için kesin saat verilmedi.",
        checkedAt: "2026-07-21",
        sourceDateLabel: "2026 belediye programıyla faal olduğu doğrulandı",
        sources: [
            {
                label: "2026 Mali Yılı Performans Programı",
                url: "https://www.kepez-bld.gov.tr/file_parliament_2851_2026-yili-performans-programi.pdf",
                publisher: "Kepez Belediyesi",
                publishedAt: "2026",
                official: true,
            },
            {
                label: "Türkiye'deki Oto Pazarları Listesi",
                url: "https://www.arabam.com/blog/danisman/turkiyedeki-oto-pazarlari-listesi/",
                publisher: "arabam.com",
                official: false,
            },
        ],
        imageUrl: "/otopazari_final_2.png",
        legacyEventId: "antalya-kepez-otopazari",
    },
    {
        slug: "belediye-evleri-semt-ve-oto-pazari",
        province: "Adana",
        provinceSlug: "adana",
        district: "Çukurova",
        name: "Belediye Evleri Semt ve Oto Pazarı",
        shortName: "Belediye Evleri Oto Pazarı",
        address: "Belediye Evleri Mahallesi, Çoban Yurtçu Bulvarı üzeri, Çukurova",
        status: "verified",
        summary: "Çukurova Belediyesi kayıtlarında semt ve oto pazarı olarak geçen geniş pazar alanıdır.",
        verificationNote: "Konum belediyenin güncel toplanma alanları kaydında yer alıyor. Gün ve çalışma saatleri aynı kaynakta belirtilmediği için kesin program yayımlanmadı.",
        checkedAt: "2026-07-21",
        sourceDateLabel: "Konum belediye kaydından doğrulandı; program teyidi bekleniyor",
        sources: [
            {
                label: "Çukurova ilçesi acil durum toplanma alanları",
                url: "https://cukurova.bel.tr/toplanma.html",
                publisher: "Çukurova Belediyesi",
                official: true,
            },
        ],
        imageUrl: "/otopazari_final_1.png",
        legacyEventId: "adana-cukurova-otopazari",
    },
    {
        slug: "inegol-merpa-oto-pazari",
        province: "Bursa",
        provinceSlug: "bursa",
        district: "İnegöl",
        name: "İnegöl MERPA Oto Pazarı",
        shortName: "İnegöl MERPA Oto Pazarı",
        address: "MERPA Merkez Pazar Yeri, İnegöl",
        day: "Cumartesi",
        status: "verified",
        summary: "MERPA'nın çok amaçlı pazar alanında cumartesi günleri oto pazarı faaliyeti için ayrılan bölümdür.",
        verificationNote: "Cumartesi bilgisi Bursa Büyükşehir Belediyesi'nin tesis açılış kaydına dayanıyor. Kayıt eski tarihli olduğu için güncel saat ve faaliyetin devamı ziyaret öncesi teyit edilmelidir.",
        checkedAt: "2026-07-21",
        sourceDateLabel: "Resmî tesis kaydı mevcut; güncel saat teyidi önerilir",
        sources: [
            {
                label: "MERPA modern yüzüyle hizmette",
                url: "https://www.bursa.bel.tr/haber/merpa-modern-yuzuyle-hizmette-23420",
                publisher: "Bursa Büyükşehir Belediyesi",
                publishedAt: "2017-03-02",
                official: true,
            },
        ],
        imageUrl: "/bursaotopazari.png",
    },
    {
        slug: "nilufer-ucevler-acik-oto-pazari",
        province: "Bursa",
        provinceSlug: "bursa",
        district: "Nilüfer",
        name: "Nilüfer Üçevler Açık Oto Pazarı",
        shortName: "Nilüfer Üçevler Açık Oto Pazarı",
        address: "Üçevler Mahallesi, Nilüfer",
        status: "needs-confirmation",
        summary: "Harita kayıtlarında Üçevler'de görünen, güncel resmî programı bulunamayan açık oto pazarı kaydıdır.",
        verificationNote: "Konum birden fazla harita/dizin kaydında yer alıyor; ancak gün ve çalışma saatini doğrulayan güncel belediye duyurusu bulunamadı. Bu nedenle İnegöl MERPA kaydından ayrı tutuluyor ve kesin program yayımlanmıyor.",
        checkedAt: "2026-07-21",
        sourceDateLabel: "Konum kaydı var; güncel belediye programı bekleniyor",
        sources: [
            {
                label: "Nilvak Açık Oto Pazarı harita kaydı",
                url: "https://haritane.com/nilvak-acik-oto-pazari-detay5443381/",
                publisher: "Haritane",
                official: false,
            },
        ],
        imageUrl: "/bursaotopazari.png",
        legacyEventId: "bursa-nilufer-otopazari",
    },
    {
        slug: "odunpazari-acik-oto-pazari",
        province: "Eskişehir",
        provinceSlug: "eskisehir",
        district: "Odunpazarı",
        name: "Odunpazarı Açık Oto Pazarı",
        shortName: "Odunpazarı Açık Oto Pazarı",
        address: "75. Yıl Mahallesi, Oto Center bitişiği, Odunpazarı",
        day: "Pazar",
        hours: "08:00–15:00 (son resmî yayımlanan program)",
        status: "verified",
        summary: "Odunpazarı Belediyesi tarafından açılan, 500 araç kapasiteli ikinci el otomobil pazarıdır.",
        verificationNote: "Adres, gün ve saat belediyenin 2021 tarihli resmî yeniden açılış duyurusuna dayanıyor. Saatler değişebileceği için ziyaret öncesi güncel teyit önerilir.",
        checkedAt: "2026-07-21",
        sourceDateLabel: "Son resmî saat duyurusu: 5 Mart 2021",
        sources: [
            {
                label: "Odunpazarı Açık Oto Pazarı yeniden açılıyor",
                url: "https://odunpazari.bel.tr/guncel/haberler/genel-haberler/odunpazari-acik-oto-pazari-yeniden-aciliyor",
                publisher: "Odunpazarı Belediyesi",
                publishedAt: "2021-03-05",
                official: true,
            },
        ],
        imageUrl: "/otopazari_final_8.png",
        legacyEventId: "eskisehir-odunpazari-otopazari",
    },
    {
        slug: "tepebasi-camlica-acik-oto-pazari",
        province: "Eskişehir",
        provinceSlug: "eskisehir",
        district: "Tepebaşı",
        name: "Tepebaşı Çamlıca Açık Oto Pazarı",
        shortName: "Tepebaşı Çamlıca Açık Oto Pazarı",
        address: "Çamlıca Kapalı Pazar Yeri, Tepebaşı",
        day: "Pazar",
        status: "verified",
        summary: "Tepebaşı Belediyesi tarafından Çamlıca Kapalı Pazar Yeri'nde kurulan açık oto pazarıdır.",
        verificationNote: "Belediye haber arşivi pazarın Çamlıca Kapalı Pazar Yeri'ne taşındığını ve her pazar günü kurulduğunu belirtiyor. Güncel açılış-kapanış saati yayımlanmadığı için saat verilmedi.",
        checkedAt: "2026-07-21",
        sourceDateLabel: "Belediye kaydından yer ve gün doğrulandı",
        sources: [
            {
                label: "Açık Oto Pazarı yeni yerinde hizmete açılıyor",
                url: "https://www.tepebasi.bel.tr/haberlertum.asp?s=134",
                publisher: "Tepebaşı Belediyesi",
                official: true,
            },
        ],
        imageUrl: "/otopazari_final_8.png",
    },
    {
        slug: "karatay-galericiler-sitesi-acik-oto-pazari",
        province: "Konya",
        provinceSlug: "konya",
        district: "Karatay",
        name: "Karatay Galericiler Sitesi Açık Oto Pazarı",
        shortName: "Karatay Açık Oto Pazarı",
        address: "Galericiler Sitesi, Karatay",
        day: "Hafta sonu",
        status: "verified",
        summary: "Karatay Galericiler Sitesi içinde ikinci el otomobil satışı için kullanılan açık pazar alanıdır.",
        verificationNote: "Yer ve hafta sonu bilgisi Karatay Belediyesi kaydında bulunuyor. Kaynakta güncel saat yayımlanmadığı için kesin saat belirtilmedi.",
        checkedAt: "2026-07-21",
        sourceDateLabel: "Belediye kaydı doğrulandı; saat teyidi bekleniyor",
        sources: [
            {
                label: "Açık Oto Pazarı yeniden düzenlendi",
                url: "https://karatay.bel.tr/haberdetay/470/acik-oto-pazar-yeniden-duzenlendikaratay-beled",
                publisher: "Karatay Belediyesi",
                official: true,
            },
        ],
        imageUrl: "/otopazari_final_14.png",
        legacyEventId: "konya-karatay-otopazari",
    },
    {
        slug: "gunesler-acik-oto-pazari",
        province: "Sakarya",
        provinceSlug: "sakarya",
        district: "Adapazarı",
        name: "Güneşler Açık Oto Pazarı",
        shortName: "Güneşler Açık Oto Pazarı",
        address: "Güneşler bölgesi, Zirai Aletler ve Açık Oto Pazarı, Adapazarı",
        day: "Pazar",
        status: "verified",
        summary: "Adapazarı Belediyesi faaliyet kayıtlarında pazar günü kullanılan açık oto pazarıdır.",
        verificationNote: "Pazar günü bilgisi belediyenin faaliyet raporunda açıkça yer alıyor. Açılış-kapanış saati yayımlanmadığı için saat bilgisi verilmedi.",
        checkedAt: "2026-07-21",
        sourceDateLabel: "2023 belediye faaliyet kaydından doğrulandı",
        sources: [
            {
                label: "2023 Yılı Faaliyet Raporu",
                url: "https://www.adapazari.bel.tr/upload/files/2023-yili-faaliyet-raporu-yayimlanmistir/2023-yili-faaliyet-raporu-yayimlanmistir_8336.pdf",
                publisher: "Adapazarı Belediyesi",
                publishedAt: "2024",
                official: true,
            },
        ],
        imageUrl: "/otopazari_final_21.png",
        legacyEventId: "sakarya-adapazari-otopazari",
    },
    {
        slug: "bafra-ikinci-el-oto-pazari",
        province: "Samsun",
        provinceSlug: "samsun",
        district: "Bafra",
        name: "Bafra 2. El Oto Pazarı",
        shortName: "Bafra 2. El Oto Pazarı",
        address: "Fatih Mahallesi, Kale Sokak No:50, Bafra",
        day: "Cumartesi",
        status: "verified",
        summary: "Bafra'da ikinci el araç satışı için kullanılan ve belediye ulaşım kararlarında yer alan pazar alanıdır.",
        verificationNote: "Adres ve cumartesi günü çevre trafik düzenlemesi Samsun Büyükşehir Belediyesi UKOME kararında yer alıyor. Pazarın güncel çalışma saati ayrıca teyit edilmelidir.",
        checkedAt: "2026-07-21",
        sourceDateLabel: "UKOME kaydından konum ve gün doğrulandı",
        sources: [
            {
                label: "Bafra 2. El Oto Pazarı çevresi UKOME kararı",
                url: "https://samsun.bel.tr/uploads/dokumanlar/8a8b96ad58850754b6ee1c1966ab5a635c2.pdf",
                publisher: "Samsun Büyükşehir Belediyesi",
                publishedAt: "2017",
                official: true,
            },
        ],
        imageUrl: "/otopazari_final_22.png",
    },
    {
        slug: "bandirma-ikinci-el-oto-pazari",
        province: "Balıkesir",
        provinceSlug: "balikesir",
        district: "Bandırma",
        name: "Bandırma İkinci El Oto Pazarı",
        shortName: "Bandırma İkinci El Oto Pazarı",
        status: "verified",
        summary: "Bandırma Belediyesi'nin 2026 pazar duyurusunda faal pazarlar arasında yer alan ikinci el oto pazarıdır.",
        verificationNote: "Pazarın faaliyeti 17 Mart 2026 tarihli belediye duyurusuyla doğrulandı. Duyuruda normal kuruluş günü, açık adres ve saat bulunmadığı için bu alanlar kesin bilgi olarak yayımlanmadı.",
        checkedAt: "2026-07-21",
        sourceDateLabel: "17 Mart 2026 belediye duyurusuyla doğrulandı",
        sources: [
            {
                label: "Ramazan Bayramı öncesi pazar yerleri hizmet duyurusu",
                url: "https://www.bandirma.bel.tr/haber/ramazan-bayrami-oncesi-ve-bayram-suresinde-pazar-yerleri-hizmet-duyurusu",
                publisher: "Bandırma Belediyesi",
                publishedAt: "2026-03-17",
                official: true,
            },
        ],
        imageUrl: "/otopazari_final_4.png",
    },
    {
        slug: "demirci-ikinci-el-oto-pazari",
        province: "Manisa",
        provinceSlug: "manisa",
        district: "Demirci",
        name: "Demirci 2. El Oto Pazarı",
        shortName: "Demirci 2. El Oto Pazarı",
        address: "Camiatik Mahallesi, Açık Pazar Yeri, Demirci",
        day: "Pazar",
        status: "verified",
        summary: "Demirci Belediyesi tarafından 26 Nisan 2026'da açılan ve pazar günleri kurulan ikinci el oto pazarıdır.",
        verificationNote: "Belediyenin Nisan, Mayıs ve Haziran 2026 duyuruları pazarın yerini, pazar günü kurulduğunu ve faaliyetine devam ettiğini doğruluyor. Kesin açılış-kapanış saati yayımlanmadı.",
        checkedAt: "2026-07-21",
        sourceDateLabel: "En son resmî faaliyet duyurusu: 3 Haziran 2026",
        sources: [
            {
                label: "Bölgenin tek oto pazarı 7 Haziran'da",
                url: "https://www.demirci-bld.gov.tr/detaylar/1/haberler/46108/bolgenin_tek_oto_pazari_7_haziranda%E2%80%A6.aspx",
                publisher: "Demirci Belediyesi",
                publishedAt: "2026-06-03",
                official: true,
            },
            {
                label: "2. El Oto Pazarının kalbi Demirci olacak",
                url: "https://www.demirci-bld.gov.tr/detaylar/1/haberler/46089/2_el_oto_pazarinin_kalbi_demirci_olacak.aspx",
                publisher: "Demirci Belediyesi",
                publishedAt: "2026-04-26",
                official: true,
            },
        ],
        imageUrl: "/otopazari_final_16.png",
    },
    {
        slug: "tavsanli-acik-oto-pazari",
        province: "Kütahya",
        provinceSlug: "kutahya",
        district: "Tavşanlı",
        name: "Tavşanlı Açık Oto Pazarı",
        shortName: "Tavşanlı Açık Oto Pazarı",
        status: "verified",
        summary: "Tavşanlı Belediyesi'nin 2026 gelir tarifesinde faal hizmet olarak yer alan açık oto pazarıdır.",
        verificationNote: "Pazarın varlığı ve 2026 giriş tarifesi belediye meclis kayıtlarında bulunuyor. Kaynakta açık adres, gün ve saat yayımlanmadığı için bu bilgiler tahmin edilmedi.",
        checkedAt: "2026-07-21",
        sourceDateLabel: "2026 belediye tarifesinden doğrulandı",
        sources: [
            {
                label: "2026 yılında uygulanacak tarifeler",
                url: "https://www.tavsanli.bel.tr/wp-content/uploads/2026/01/Belediyemizce-2026-y%C4%B1l%C4%B1nda-uygulanacak-tarifeler..pdf",
                publisher: "Tavşanlı Belediyesi",
                publishedAt: "2026",
                official: true,
            },
        ],
        imageUrl: "/otopazari_final_8.png",
    },
    {
        slug: "fatsa-acik-oto-pazari",
        province: "Ordu",
        provinceSlug: "ordu",
        district: "Fatsa",
        name: "Fatsa Açık Oto Pazarı",
        shortName: "Fatsa Açık Oto Pazarı",
        status: "verified",
        summary: "Fatsa Belediyesi'nin 2026 hizmet değerlendirmesinde faal belediye yatırımları arasında yer alan açık oto pazarıdır.",
        verificationNote: "Pazarın varlığı Ocak 2026 tarihli belediye açıklamasıyla doğrulandı. Gün, saat ve açık adres aynı kaynakta yayımlanmadığı için kesin program verilmedi.",
        checkedAt: "2026-07-21",
        sourceDateLabel: "5 Ocak 2026 belediye kaydından doğrulandı",
        sources: [
            {
                label: "Fatsa'ya damga vuran 7 yıl",
                url: "https://www.fatsa.bel.tr/haber/fatsa-ya-damga-vuran-7-yil-baki-olan-hizmetlerimizdir",
                publisher: "Fatsa Belediyesi",
                publishedAt: "2026-01-05",
                official: true,
            },
        ],
        imageUrl: "/otopazari_final_20.png",
    },
    {
        slug: "kartal-eski-oto-pazari",
        province: "İstanbul",
        provinceSlug: "istanbul",
        district: "Kartal",
        name: "Kartal Eski Oto Pazarı",
        shortName: "Kartal Eski Oto Pazarı",
        address: "Orta Mahalle, Kartal Köprüsü çevresi",
        status: "historical",
        summary: "Kartal Belediyesi güncel afet alanı kaydında bu konumu 'Eski Oto Pazarı' adıyla tanımlıyor.",
        verificationNote: "Mevcut sitedeki 'cumartesi açık' kaydı güvenilir güncel bir kaynakla doğrulanamadı. Belediye alanı açıkça 'eski oto pazarı' olarak adlandırdığı için aktif pazar gibi sunulmuyor.",
        checkedAt: "2026-07-21",
        sourceDateLabel: "Aktif olmadığına işaret eden güncel belediye kaydı",
        sources: [
            {
                label: "Kartal afet toplanma alanları haritası",
                url: "https://www.kartal.bel.tr/Kartal/AfetToplanmaAlanlariHaritasi",
                publisher: "Kartal Belediyesi",
                official: true,
            },
        ],
        imageUrl: "/kartalotopazari.png",
        legacyEventId: "istanbul-kartal-otopazari",
    },
    {
        slug: "kahramankazan-dagyaka-acik-oto-pazari",
        province: "Ankara",
        provinceSlug: "ankara",
        district: "Kahramankazan",
        name: "Kahramankazan Dağyaka Açık Oto Pazarı",
        shortName: "Dağyaka Açık Oto Pazarı",
        address: "Dağyaka bölgesi, Kahramankazan",
        status: "historical",
        summary: "Belediye meclisi kaydında tamamlanmasına rağmen hizmete açılamadığı belirtilen pazar projesidir.",
        verificationNote: "Resmî meclis tutanağı alanın o tarihte hizmete açılmadığını söylüyor. Sonraki açılışı doğrulayan güncel resmî kaynak bulunamadığı için aktif pazar listesine alınmadı.",
        checkedAt: "2026-07-21",
        sourceDateLabel: "Açılışı doğrulanamadı; aktif pazar olarak gösterilmiyor",
        sources: [
            {
                label: "Ankara Büyükşehir Belediye Meclisi tutanağı",
                url: "https://s.ankara.bel.tr/files/2023/03/01/1f1c0d57b45df7f098b76d713ea22cc7.pdf",
                publisher: "Ankara Büyükşehir Belediyesi",
                official: true,
            },
        ],
        imageUrl: "/pursaklarotopazari.png",
    },
    {
        slug: "pursaklar-karacaoren-acik-oto-pazari",
        province: "Ankara",
        provinceSlug: "ankara",
        district: "Pursaklar",
        name: "Pursaklar Karacaören Açık Oto Pazarı",
        shortName: "Pursaklar Karacaören Açık Oto Pazarı",
        address: "Karacaören Mahallesi, Pursaklar",
        status: "needs-confirmation",
        summary: "Eski pazar listelerinde Karacaören'de gösterilen, güncel resmî programı doğrulanamayan Ankara oto pazarı kaydıdır.",
        verificationNote: "Mevcut sitedeki gün, saat ve ücret iddialarını destekleyen güncel belediye belgesi bulunamadı. Dağyaka projesinden ayrı bir kayıt olarak tutuluyor; kesin program yayımlanmıyor.",
        checkedAt: "2026-07-21",
        sourceDateLabel: "Güncel resmî program bulunamadı",
        sources: [],
        imageUrl: "/pursaklarotopazari.png",
        legacyEventId: "ankara-pursaklar-otopazari",
    },
    {
        slug: "kemalpasa-acik-oto-pazari",
        province: "İzmir",
        provinceSlug: "izmir",
        district: "Kemalpaşa",
        name: "Kemalpaşa Açık Oto Pazarı",
        shortName: "Kemalpaşa Açık Oto Pazarı",
        address: "Kemalpaşa, İzmir",
        status: "needs-confirmation",
        summary: "Harita ve ulaşım kaynaklarında yer alan ancak güncel belediye takvimi bulunamayan pazar kaydıdır.",
        verificationNote: "Konum bağımsız harita kaynaklarında bulunuyor; gün, saat ve faaliyetin devamını doğrulayan güncel resmî açıklama bulunamadı. Bu nedenle teyitli aktif pazar olarak gösterilmiyor.",
        checkedAt: "2026-07-21",
        sourceDateLabel: "Güncel resmî program bulunamadı",
        sources: [
            {
                label: "Kemalpaşa Açık Oto Pazarı harita kaydı",
                url: "https://www.haritamap.com/yer/kemalpasa-acik-oto-pazari-kemalpasa",
                publisher: "HaritaMap",
                official: false,
            },
        ],
        imageUrl: "/izmirkemalpasaotopazari.png",
        legacyEventId: "izmir-kemalpasa-otopazari",
    },
    {
        slug: "gaziemir-oto-pazari",
        province: "İzmir",
        provinceSlug: "izmir",
        district: "Gaziemir",
        name: "Gaziemir Oto Pazarı",
        shortName: "Gaziemir Oto Pazarı",
        address: "Gaziemir, İzmir",
        status: "needs-confirmation",
        summary: "Eski dizinlerde yer alan ancak güncel resmî belediye programı bulunamayan pazar kaydıdır.",
        verificationNote: "Mevcut gün ve saat iddiaları güncel resmî kaynakla doğrulanamadı. Yanlış yönlendirmemek için kesin program yayımlanmıyor.",
        checkedAt: "2026-07-21",
        sourceDateLabel: "Güncel resmî program bulunamadı",
        sources: [],
        imageUrl: "/gaziemirotopazari.png",
        legacyEventId: "izmir-gaziemir-otopazari",
    },
];

export function getProvinceBySlug(slug: string): ProvinceEntry | undefined {
    return TURKEY_PROVINCES.find((province) => province.slug === slug);
}

export function getMarketsByProvince(provinceSlug: string): OpenCarMarket[] {
    return OPEN_CAR_MARKETS.filter((market) => market.provinceSlug === provinceSlug);
}

export function getMarket(provinceSlug: string, marketSlug: string): OpenCarMarket | undefined {
    return OPEN_CAR_MARKETS.find(
        (market) => market.provinceSlug === provinceSlug && market.slug === marketSlug,
    );
}

export function getMarketPath(market: OpenCarMarket): string {
    return `/acik-oto-pazari/${market.provinceSlug}/${market.slug}`;
}

export function hasVerifiedMarket(provinceSlug: string): boolean {
    return getMarketsByProvince(provinceSlug).some((market) => market.status === "verified");
}

export function getLegacyMarketPath(eventId: string): string | undefined {
    const market = OPEN_CAR_MARKETS.find((entry) => entry.legacyEventId === eventId);
    return market ? getMarketPath(market) : undefined;
}
