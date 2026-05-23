export interface DaySchedule {
    dayName: string;
    hours: string;
    isOpen: boolean;
}

export interface Event {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    date: string; // ISO format
    duration: string;
    location: string;
    city: string;
    priceText: string;
    isFree: boolean;
    category: 'pazar' | 'sergi' | 'yaris' | 'bulusma';
    attendeesCount: number | null; // null = bilinmiyor
    maxAttendees: number | null; // null = bilinmiyor
    isOnline: boolean;
    organizer: string;
    tags: string[];
    schedule?: DaySchedule[];
}

export const eventCategories = {
    pazar: { label: 'Oto Pazarı', color: '#3B82F6' },
    sergi: { label: 'Sergi', color: '#8B5CF6' },
    yaris: { label: 'Yarış', color: '#EF4444' },
    bulusma: { label: 'Buluşma', color: '#10B981' }
};

// Helper function to get next Sunday
function getNextSunday(): string {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const daysUntilSunday = dayOfWeek === 0 ? 7 : 7 - dayOfWeek;
    const nextSunday = new Date(now);
    nextSunday.setDate(now.getDate() + daysUntilSunday);
    nextSunday.setHours(9, 0, 0, 0);
    return nextSunday.toISOString();
}

// Helper function to get next Saturday
function getNextSaturday(): string {
    const now = new Date();
    const dayOfWeek = now.getDay();
    let daysToAdd = 6 - dayOfWeek;
    if (daysToAdd <= 0) daysToAdd += 7;

    const nextSaturday = new Date(now);
    nextSaturday.setDate(now.getDate() + daysToAdd);
    nextSaturday.setHours(9, 0, 0, 0);
    return nextSaturday.toISOString();
}

const kemalpasaSchedule: DaySchedule[] = [
    { dayName: "Pazartesi", hours: "Kapalı", isOpen: false },
    { dayName: "Salı", hours: "Kapalı", isOpen: false },
    { dayName: "Çarşamba", hours: "Kapalı", isOpen: false },
    { dayName: "Perşembe", hours: "Kapalı", isOpen: false },
    { dayName: "Cuma", hours: "Kapalı", isOpen: false },
    { dayName: "Cumartesi", hours: "Kapalı", isOpen: false },
    { dayName: "Pazar", hours: "09:00 - 17:00", isOpen: true }
];

const gaziemirSchedule: DaySchedule[] = [
    { dayName: "Pazartesi", hours: "Kapalı", isOpen: false },
    { dayName: "Salı", hours: "Kapalı", isOpen: false },
    { dayName: "Çarşamba", hours: "Kapalı", isOpen: false },
    { dayName: "Perşembe", hours: "Kapalı", isOpen: false },
    { dayName: "Cuma", hours: "Kapalı", isOpen: false },
    { dayName: "Cumartesi", hours: "Kapalı", isOpen: false },
    { dayName: "Pazar", hours: "Tüm Gün", isOpen: true }
];

const ankaraSchedule: DaySchedule[] = [
    { dayName: "Pazartesi", hours: "Kapalı", isOpen: false },
    { dayName: "Salı", hours: "Kapalı", isOpen: false },
    { dayName: "Çarşamba", hours: "Kapalı", isOpen: false },
    { dayName: "Perşembe", hours: "Kapalı", isOpen: false },
    { dayName: "Cuma", hours: "Kapalı", isOpen: false },
    { dayName: "Cumartesi", hours: "Kapalı", isOpen: false },
    { dayName: "Pazar", hours: "07:00 - 17:00", isOpen: true }
];

const kartalSchedule: DaySchedule[] = [
    { dayName: "Pazartesi", hours: "Kapalı", isOpen: false },
    { dayName: "Salı", hours: "Kapalı", isOpen: false },
    { dayName: "Çarşamba", hours: "Kapalı", isOpen: false },
    { dayName: "Perşembe", hours: "Kapalı", isOpen: false },
    { dayName: "Cuma", hours: "Kapalı", isOpen: false },
    { dayName: "Cumartesi", hours: "09:00 - 18:00", isOpen: true },
    { dayName: "Pazar", hours: "Kapalı", isOpen: false }
];

const standardSundaySchedule: DaySchedule[] = [
    { dayName: "Pazartesi", hours: "Kapalı", isOpen: false },
    { dayName: "Salı", hours: "Kapalı", isOpen: false },
    { dayName: "Çarşamba", hours: "Kapalı", isOpen: false },
    { dayName: "Perşembe", hours: "Kapalı", isOpen: false },
    { dayName: "Cuma", hours: "Kapalı", isOpen: false },
    { dayName: "Cumartesi", hours: "Kapalı", isOpen: false },
    { dayName: "Pazar", hours: "08:00 - 17:00", isOpen: true }
];

export const events: Event[] = [
    {
        id: "istanbul-kartal-otopazari",
        title: "Kartal Oto Pazarı (Anadolu Yakası)",
        description: "Anadolu yakasının en köklü oto pazarlarından biri.",
        imageUrl: "/kartalotopazari.png",
        date: getNextSaturday(),
        duration: "09:00 - 18:00",
        location: "Yunus Mahallesi, Kartal, İstanbul",
        city: "İstanbul",
        priceText: "Bilinmiyor",
        isFree: false,
        category: "pazar",
        attendeesCount: null,
        maxAttendees: null,
        isOnline: false,
        organizer: "Bilinmiyor",
        tags: ["Anadolu Yakası", "Kartal", "Büyük Pazar"],
        schedule: kartalSchedule
    },
    {
        id: "ankara-pursaklar-otopazari",
        title: "Ankara (Karacaören) Açık Oto Pazarı",
        description: "Ankara'nın en büyük oto pazarı. 2026 yılı itibarıyla araç başına giriş ücreti 300 TL'dir.",
        imageUrl: "/pursaklarotopazari.png",
        date: getNextSunday(),
        duration: "07:00 - 17:00",
        location: "Pursaklar, Karacaören Mah. (Esenboğa Yolu Üzeri)",
        city: "Ankara",
        priceText: "300 TL",
        isFree: false,
        category: "pazar",
        attendeesCount: null,
        maxAttendees: null,
        isOnline: false,
        organizer: "Bilinmiyor",
        tags: ["Büyük Pazar", "Ankara", "Pursaklar"],
        schedule: ankaraSchedule
    },
    {
        id: "izmir-kemalpasa-otopazari",
        title: "Kemalpaşa Açık Oto Pazarı",
        description: "Ege Bölgesinden çok sayıda araç gelir. Hafta sonu açık olan en büyük oto pazarlarından biri.",
        imageUrl: "/izmirkemalpasaotopazari.png",
        date: getNextSunday(),
        duration: "09:00 - 17:00",
        location: "40 Sk. No:2, Kemalpasa, Turkey",
        city: "İzmir",
        priceText: "Bilinmiyor",
        isFree: false,
        category: "pazar",
        attendeesCount: null,
        maxAttendees: null,
        isOnline: false,
        organizer: "Bilinmiyor",
        tags: ["Büyük Pazar", "Ege", "Kemalpaşa"],
        schedule: kemalpasaSchedule
    },
    {
        id: "izmir-gaziemir-otopazari",
        title: "Gaziemir Oto Pazarı",
        description: "Optimum Outlet arkası. Kalabalık ve çeşitli araçların bulunduğu popüler pazar.",
        imageUrl: "/gaziemirotopazari.png",
        date: getNextSunday(),
        duration: "Tüm Gün",
        location: "Beyazevler Cami Yanı, Gaziemir",
        city: "İzmir",
        priceText: "Bilinmiyor",
        isFree: false,
        category: "pazar",
        attendeesCount: null,
        maxAttendees: null,
        isOnline: false,
        organizer: "Bilinmiyor",
        tags: ["Gaziemir", "Kalabalık", "Ekspertiz"],
        schedule: gaziemirSchedule
    },
    {
        id: "bursa-nilufer-otopazari",
        title: "Nilüfer Açık Oto Pazarı",
        description: "Bursa'nın en büyük ve popüler oto pazarlarından biri. Her pazar günü Üçevler mahallesinde hizmet vermektedir.",
        imageUrl: "/bursaotopazari.png",
        date: getNextSunday(),
        duration: "08:00 - 17:00",
        location: "Üçevler Mah. 70. Sk. No: 38 Nilüfer / Bursa",
        city: "Bursa",
        priceText: "Bilinmiyor",
        isFree: false,
        category: "pazar",
        attendeesCount: null,
        maxAttendees: null,
        isOnline: false,
        organizer: "Bilinmiyor",
        tags: ["Büyük Pazar", "Bursa", "Nilüfer", "Marmara"],
        schedule: standardSundaySchedule
    },
    {
        id: "adana-cukurova-otopazari",
        title: "Adana Çukurova Açık Oto Pazarı",
        description: "Adana'nın en işlek açık oto pazarı. Çukurova ilçesi Belediye Evleri Mahallesi'nde kurulmaktadır.",
        imageUrl: "/otopazari_final_1.png",
        date: getNextSunday(),
        duration: "08:00 - 16:00",
        location: "Belediye Evleri Mah., Ramazan Atıl Lisesi Civarı, Çukurova, Adana",
        city: "Adana",
        priceText: "Bilinmiyor",
        isFree: false,
        category: "pazar",
        attendeesCount: null,
        maxAttendees: null,
        isOnline: false,
        organizer: "Bilinmiyor",
        tags: ["Büyük Pazar", "Adana", "Çukurova", "Akdeniz"],
        schedule: standardSundaySchedule
    },
    {
        id: "antalya-kepez-otopazari",
        title: "Antalya Kepez Açık Oto Pazarı",
        description: "Antalya'nın merkezindeki en büyük oto pazarı. Kepez ilçesinde Gülveren Mahallesi 3705. Sokak üzerinde kurulur.",
        imageUrl: "/otopazari_final_2.png",
        date: getNextSunday(),
        duration: "08:00 - 17:00",
        location: "Gülveren Mah., 3705. Sk., Kepez, Antalya",
        city: "Antalya",
        priceText: "Bilinmiyor",
        isFree: false,
        category: "pazar",
        attendeesCount: null,
        maxAttendees: null,
        isOnline: false,
        organizer: "Bilinmiyor",
        tags: ["Antalya", "Kepez", "Akdeniz", "Açık Pazar"],
        schedule: standardSundaySchedule
    },
    {
        id: "aydin-efeler-otopazari",
        title: "Aydın Efeler Açık Oto Pazarı",
        description: "Aydın ve çevre ilçelerden gelen yüzlerce aracın sergilendiği popüler oto pazarı.",
        imageUrl: "/otopazari_final_3.png",
        date: getNextSunday(),
        duration: "08:00 - 17:00",
        location: "Efeler Mah., Otogar Yanı Açık Alan, Efeler, Aydın",
        city: "Aydın",
        priceText: "Bilinmiyor",
        isFree: false,
        category: "pazar",
        attendeesCount: null,
        maxAttendees: null,
        isOnline: false,
        organizer: "Bilinmiyor",
        tags: ["Aydın", "Efeler", "Ege", "Açık Pazar"],
        schedule: standardSundaySchedule
    },
    {
        id: "balikesir-altieylul-otopazari",
        title: "Balıkesir Altıeylül Açık Oto Pazarı",
        description: "Marmara ve Ege geçiş noktasındaki Balıkesir'in en büyük oto pazarı. Kepsut Yolu üzerinde kurulmaktadır.",
        imageUrl: "/otopazari_final_4.png",
        date: getNextSunday(),
        duration: "08:00 - 16:00",
        location: "Kepsut Yolu Üzeri, Altıeylül, Balıkesir",
        city: "Balıkesir",
        priceText: "Bilinmiyor",
        isFree: false,
        category: "pazar",
        attendeesCount: null,
        maxAttendees: null,
        isOnline: false,
        organizer: "Bilinmiyor",
        tags: ["Balıkesir", "Altıeylül", "Marmara", "Ege"],
        schedule: standardSundaySchedule
    },
    {
        id: "denizli-merkezefendi-otopazari",
        title: "Denizli Sevindik Açık Oto Pazarı",
        description: "Denizli'nin en büyük ikinci el araç pazarı. Merkezefendi ilçesi Sevindik Mahallesi'nde kurulmaktadır.",
        imageUrl: "/otopazari_final_5.png",
        date: getNextSunday(),
        duration: "08:00 - 17:00",
        location: "Sevindik Mah., Merkezefendi, Denizli",
        city: "Denizli",
        priceText: "Bilinmiyor",
        isFree: false,
        category: "pazar",
        attendeesCount: null,
        maxAttendees: null,
        isOnline: false,
        organizer: "Bilinmiyor",
        tags: ["Denizli", "Sevindik", "Merkezefendi", "Ege"],
        schedule: standardSundaySchedule
    },
    {
        id: "diyarbakir-kayapinar-otopazari",
        title: "Diyarbakır Kayapınar Açık Oto Pazarı",
        description: "Güneydoğu Anadolu Bölgesi'nin en büyük açık oto pazarlarından biri. Şehirlerarası Otogar yakınında kurulmaktadır.",
        imageUrl: "/otopazari_final_6.png",
        date: getNextSunday(),
        duration: "08:00 - 17:00",
        location: "Talaytepe Mah., Otogar Yanı Açık Alan, Kayapınar, Diyarbakır",
        city: "Diyarbakır",
        priceText: "Bilinmiyor",
        isFree: false,
        category: "pazar",
        attendeesCount: null,
        maxAttendees: null,
        isOnline: false,
        organizer: "Bilinmiyor",
        tags: ["Diyarbakır", "Kayapınar", "Güneydoğu", "Büyük Pazar"],
        schedule: standardSundaySchedule
    },
    {
        id: "erzurum-yakutiye-otopazari",
        title: "Erzurum Yakutiye Açık Oto Pazarı",
        description: "Doğu Anadolu'nun en yüksek hacimli açık oto pazarı. Yakutiye ilçesindeki Kombina Caddesi üzerinde kurulur.",
        imageUrl: "/otopazari_final_7.png",
        date: getNextSunday(),
        duration: "09:00 - 16:00",
        location: "Kombina Cd., Yakutiye, Erzurum",
        city: "Erzurum",
        priceText: "Bilinmiyor",
        isFree: false,
        category: "pazar",
        attendeesCount: null,
        maxAttendees: null,
        isOnline: false,
        organizer: "Bilinmiyor",
        tags: ["Erzurum", "Yakutiye", "Doğu Anadolu", "Açık Pazar"],
        schedule: standardSundaySchedule
    },
    {
        id: "eskisehir-odunpazari-otopazari",
        title: "Eskişehir Odunpazarı Açık Oto Pazarı",
        description: "İç Anadolu'nun popüler oto pazarlarından biri. Odunpazarı ilçesi 75. Yıl Mahallesi (Sultandere) mevkiinde kurulur.",
        imageUrl: "/otopazari_final_8.png",
        date: getNextSunday(),
        duration: "07:00 - 16:00",
        location: "75. Yıl Mah. (Sultandere), Odunpazarı, Eskişehir",
        city: "Eskişehir",
        priceText: "Bilinmiyor",
        isFree: false,
        category: "pazar",
        attendeesCount: null,
        maxAttendees: null,
        isOnline: false,
        organizer: "Bilinmiyor",
        tags: ["Eskişehir", "Odunpazarı", "İç Anadolu", "Sultandere"],
        schedule: standardSundaySchedule
    },
    {
        id: "gaziantep-sehitkamil-otopazari",
        title: "Gaziantep Şehitkamil Açık Oto Pazarı",
        description: "Bölgenin en hareketli ticaret noktalarından biri. Şehitkamil ilçesi Karacaahmet Mahallesi otogar çevresinde kurulur.",
        imageUrl: "/otopazari_final_9.png",
        date: getNextSunday(),
        duration: "07:00 - 17:00",
        location: "Karacaahmet Mah., Otogar Çevresi, Şehitkamil, Gaziantep",
        city: "Gaziantep",
        priceText: "Bilinmiyor",
        isFree: false,
        category: "pazar",
        attendeesCount: null,
        maxAttendees: null,
        isOnline: false,
        organizer: "Bilinmiyor",
        tags: ["Gaziantep", "Şehitkamil", "Güneydoğu", "Ticaret"],
        schedule: standardSundaySchedule
    },
    {
        id: "hatay-antakya-otopazari",
        title: "Hatay Antakya Açık Oto Pazarı",
        description: "Çevre illerden de yoğun katılım alan, Hatay'ın en işlek ikinci el araç pazarı. Antakya Çevre Yolu üzerinde kurulur.",
        imageUrl: "/otopazari_final_10.png",
        date: getNextSunday(),
        duration: "08:00 - 16:00",
        location: "Çevre Yolu Üzeri, Antakya, Hatay",
        city: "Hatay",
        priceText: "Bilinmiyor",
        isFree: false,
        category: "pazar",
        attendeesCount: null,
        maxAttendees: null,
        isOnline: false,
        organizer: "Bilinmiyor",
        tags: ["Hatay", "Antakya", "Akdeniz", "Açık Pazar"],
        schedule: standardSundaySchedule
    },
    {
        id: "kahramanmaras-dulkadiroglu-otopazari",
        title: "Kahramanmaraş Dulkadiroğlu Oto Pazarı",
        description: "Kahramanmaraş'ta ikinci el araç ticaretinin kalbi. Dulkadiroğlu Galericiler Sitesi içerisinde kurulur.",
        imageUrl: "/otopazari_final_11.png",
        date: getNextSunday(),
        duration: "08:00 - 17:00",
        location: "Galericiler Sitesi İçi, Dulkadiroğlu, Kahramanmaraş",
        city: "Kahramanmaraş",
        priceText: "Bilinmiyor",
        isFree: false,
        category: "pazar",
        attendeesCount: null,
        maxAttendees: null,
        isOnline: false,
        organizer: "Bilinmiyor",
        tags: ["Kahramanmaraş", "Dulkadiroğlu", "Akdeniz", "Galericiler"],
        schedule: standardSundaySchedule
    },
    {
        id: "kayseri-kocasinan-otopazari",
        title: "Kayseri Kocasinan Açık Oto Pazarı",
        description: "Kayseri'nin en büyük ikinci el araç pazarı. Kocasinan ilçesi Yıldızevler Mahallesi'ndeki Galericiler Sitesi çevresinde kurulur.",
        imageUrl: "/otopazari_final_12.png",
        date: getNextSunday(),
        duration: "07:00 - 16:00",
        location: "Yıldızevler Mah., Galericiler Sitesi Yanı, Kocasinan, Kayseri",
        city: "Kayseri",
        priceText: "Bilinmiyor",
        isFree: false,
        category: "pazar",
        attendeesCount: null,
        maxAttendees: null,
        isOnline: false,
        organizer: "Bilinmiyor",
        tags: ["Kayseri", "Kocasinan", "İç Anadolu", "Yıldızevler"],
        schedule: standardSundaySchedule
    },
    {
        id: "kocaeli-basiskele-otopazari",
        title: "Kocaeli Başiskele Açık Oto Pazarı",
        description: "Kocaeli'nin en popüler oto pazarı. Başiskele ilçesi Vezirçiftliği Mahallesi Ali Aygün Sokak üzerinde kurulmaktadır.",
        imageUrl: "/otopazari_final_13.png",
        date: getNextSunday(),
        duration: "08:00 - 17:00",
        location: "Vezirçiftliği Mah., Ali Aygün Sk. No:9, Başiskele, Kocaeli",
        city: "Kocaeli",
        priceText: "Bilinmiyor",
        isFree: false,
        category: "pazar",
        attendeesCount: null,
        maxAttendees: null,
        isOnline: false,
        organizer: "Bilinmiyor",
        tags: ["Kocaeli", "Başiskele", "Marmara", "Büyük Pazar"],
        schedule: standardSundaySchedule
    },
    {
        id: "konya-karatay-otopazari",
        title: "Konya Karatay Açık Oto Pazarı",
        description: "İç Anadolu Bölgesi'nin en köklü ve büyük oto pazarlarından biri. Karatay ilçesi Fevziçakmak Mahallesi'nde kurulur.",
        imageUrl: "/otopazari_final_14.png",
        date: getNextSunday(),
        duration: "08:00 - 17:00",
        location: "Fevziçakmak Mah., Ayyıldız Cd., Karatay, Konya",
        city: "Konya",
        priceText: "Bilinmiyor",
        isFree: false,
        category: "pazar",
        attendeesCount: null,
        maxAttendees: null,
        isOnline: false,
        organizer: "Bilinmiyor",
        tags: ["Konya", "Karatay", "İç Anadolu", "Fevziçakmak"],
        schedule: standardSundaySchedule
    },
    {
        id: "malatya-yesilyurt-otopazari",
        title: "Malatya Yeşilyurt Açık Oto Pazarı",
        description: "Doğu Anadolu and Doğu Akdeniz geçişindeki Malatya'nın en büyük oto pazarı. Yeşilyurt Galericiler Sitesi'nde kurulur.",
        imageUrl: "/otopazari_final_15.png",
        date: getNextSunday(),
        duration: "08:00 - 17:00",
        location: "Galericiler Sitesi Açık Alanı, Yeşilyurt, Malatya",
        city: "Malatya",
        priceText: "Bilinmiyor",
        isFree: false,
        category: "pazar",
        attendeesCount: null,
        maxAttendees: null,
        isOnline: false,
        organizer: "Bilinmiyor",
        tags: ["Malatya", "Yeşilyurt", "Doğu Anadolu", "Açık Pazar"],
        schedule: standardSundaySchedule
    },
    {
        id: "manisa-sehzadeler-otopazari",
        title: "Manisa Şehzadeler Açık Oto Pazarı",
        description: "Ege'nin sanayi kenti Manisa'nın popüler ikinci el araba pazarı. Şehzadeler Nurlupınar Mahallesi yakınında kurulur.",
        imageUrl: "/otopazari_final_16.png",
        date: getNextSunday(),
        duration: "08:00 - 16:00",
        location: "Nurlupınar Mah., Açık Alan, Şehzadeler, Manisa",
        city: "Manisa",
        priceText: "Bilinmiyor",
        isFree: false,
        category: "pazar",
        attendeesCount: null,
        maxAttendees: null,
        isOnline: false,
        organizer: "Bilinmiyor",
        tags: ["Manisa", "Şehzadeler", "Ege", "Açık Pazar"],
        schedule: standardSundaySchedule
    },
    {
        id: "mardin-kiziltepe-otopazari",
        title: "Mardin Kızıltepe Açık Oto Pazarı",
        description: "Mardin'in en hareketli ticaret ilçesi Kızıltepe'de, Kızıltepe Yolu üzerindeki Galericiler Sitesi açık alanında kurulur.",
        imageUrl: "/otopazari_final_17.png",
        date: getNextSunday(),
        duration: "08:00 - 16:00",
        location: "Kızıltepe Yolu Üzeri, Galericiler Sitesi, Kızıltepe, Mardin",
        city: "Mardin",
        priceText: "Bilinmiyor",
        isFree: false,
        category: "pazar",
        attendeesCount: null,
        maxAttendees: null,
        isOnline: false,
        organizer: "Bilinmiyor",
        tags: ["Mardin", "Kızıltepe", "Güneydoğu", "Açık Pazar"],
        schedule: standardSundaySchedule
    },
    {
        id: "mersin-toroslar-otopazari",
        title: "Mersin Toroslar Açık Oto Pazarı",
        description: "Mersin'in en büyük açık araba pazarı. Toroslar ilçesindeki Galericiler Sitesi içerisinde kurulur.",
        imageUrl: "/otopazari_final_18.png",
        date: getNextSunday(),
        duration: "08:00 - 17:00",
        location: "Galericiler Sitesi İçi, Toroslar, Mersin",
        city: "Mersin",
        priceText: "Bilinmiyor",
        isFree: false,
        category: "pazar",
        attendeesCount: null,
        maxAttendees: null,
        isOnline: false,
        organizer: "Bilinmiyor",
        tags: ["Mersin", "Toroslar", "Akdeniz", "Galeriler"],
        schedule: standardSundaySchedule
    },
    {
        id: "mugla-mentese-otopazari",
        title: "Muğla Menteşe (Bayır) Oto Pazarı",
        description: "Muğla genelinden ve turistik ilçelerden gelen araçların buluştuğu nokta. Menteşe Bayır Mahallesi'nde kurulur.",
        imageUrl: "/otopazari_final_19.png",
        date: getNextSunday(),
        duration: "08:00 - 16:00",
        location: "Bayır Mah., Pazar Yeri Alanı, Menteşe, Muğla",
        city: "Muğla",
        priceText: "Bilinmiyor",
        isFree: false,
        category: "pazar",
        attendeesCount: null,
        maxAttendees: null,
        isOnline: false,
        organizer: "Bilinmiyor",
        tags: ["Muğla", "Menteşe", "Bayır", "Ege"],
        schedule: standardSundaySchedule
    },
    {
        id: "ordu-altinordu-otopazari",
        title: "Ordu Altınordu Açık Oto Pazarı",
        description: "Karadeniz'in gözde şehirlerinden Ordu'nun en büyük ikinci el araba pazarı. Altınordu Karapınar Galericiler Sitesi'nde kurulur.",
        imageUrl: "/otopazari_final_20.png",
        date: getNextSunday(),
        duration: "08:00 - 16:00",
        location: "Karapınar Mah., Galericiler Sitesi, Altınordu, Ordu",
        city: "Ordu",
        priceText: "Bilinmiyor",
        isFree: false,
        category: "pazar",
        attendeesCount: null,
        maxAttendees: null,
        isOnline: false,
        organizer: "Bilinmiyor",
        tags: ["Ordu", "Altınordu", "Karadeniz", "Galericiler"],
        schedule: standardSundaySchedule
    },
    {
        id: "sakarya-adapazari-otopazari",
        title: "Sakarya Adapazarı Açık Oto Pazarı",
        description: "Marmara Region'nin en hareketli otomotiv pazarlarından biri. Adapazarı Güneşler Mahallesi'nde kurulmaktadır.",
        imageUrl: "/otopazari_final_21.png",
        date: getNextSunday(),
        duration: "08:00 - 17:00",
        location: "Güneşler Mah., Açık Pazar Alanı, Adapazarı, Sakarya",
        city: "Sakarya",
        priceText: "Bilinmiyor",
        isFree: false,
        category: "pazar",
        attendeesCount: null,
        maxAttendees: null,
        isOnline: false,
        organizer: "Bilinmiyor",
        tags: ["Sakarya", "Adapazarı", "Güneşler", "Marmara"],
        schedule: standardSundaySchedule
    },
    {
        id: "samsun-tekkekoy-otopazari",
        title: "Samsun Tekkeköy Açık Oto Pazarı",
        description: "Orta Karadeniz'in en büyük açık oto pazarı. Tekkeköy ilçesi Kirazlık mevkiindeki Galericiler Sitesi çevresinde kurulur.",
        imageUrl: "/otopazari_final_22.png",
        date: getNextSunday(),
        duration: "08:00 - 17:00",
        location: "Kirazlık Mah., Galericiler Sitesi Yanı, Tekkeköy, Samsun",
        city: "Samsun",
        priceText: "Bilinmiyor",
        isFree: false,
        category: "pazar",
        attendeesCount: null,
        maxAttendees: null,
        isOnline: false,
        organizer: "Bilinmiyor",
        tags: ["Samsun", "Tekkeköy", "Kirazlık", "Karadeniz"],
        schedule: standardSundaySchedule
    },
    {
        id: "sanliurfa-haliliye-otopazari",
        title: "Şanlıurfa Haliliye Açık Oto Pazarı",
        description: "Güneydoğu Anadolu'nun en yoğun ikinci el araç pazarlarından biri. Haliliye Sırrın Galericiler Sitesi açık alanında kurulur.",
        imageUrl: "/otopazari_final_23.png",
        date: getNextSunday(),
        duration: "08:00 - 17:00",
        location: "Sırrın Mah., Galericiler Sitesi, Haliliye, Şanlıurfa",
        city: "Şanlıurfa",
        priceText: "Bilinmiyor",
        isFree: false,
        category: "pazar",
        attendeesCount: null,
        maxAttendees: null,
        isOnline: false,
        organizer: "Bilinmiyor",
        tags: ["Şanlıurfa", "Haliliye", "Sırrın", "Güneydoğu"],
        schedule: standardSundaySchedule
    },
    {
        id: "tekirdag-suleymanpasa-otopazari",
        title: "Tekirdağ Süleymanpaşa Açık Oto Pazarı",
        description: "Trakya Bölgesi'nin en popüler açık oto pazarlarından biri. Süleymanpaşa ilçesi Yavuz Mahallesi yeni sanayi sitesi çevresinde kurulur.",
        imageUrl: "/otopazari_final_24.png",
        date: getNextSunday(),
        duration: "08:00 - 16:00",
        location: "Yavuz Mah., Yeni Sanayi Çevresi, Süleymanpaşa, Tekirdağ",
        city: "Tekirdağ",
        priceText: "Bilinmiyor",
        isFree: false,
        category: "pazar",
        attendeesCount: null,
        maxAttendees: null,
        isOnline: false,
        organizer: "Bilinmiyor",
        tags: ["Tekirdağ", "Süleymanpaşa", "Trakya", "Marmara"],
        schedule: standardSundaySchedule
    },
    {
        id: "trabzon-ortahisar-otopazari",
        title: "Trabzon Ortahisar Açık Oto Pazarı",
        description: "Doğu Karadeniz'in en büyük ve en kalabalık açık araba pazarı. Ortahisar Sanayi Mahallesi'nde kurulur.",
        imageUrl: "/otopazari_final_25.png",
        date: getNextSunday(),
        duration: "08:00 - 16:00",
        location: "Sanayi Mah., Açık Alan, Ortahisar, Trabzon",
        city: "Trabzon",
        priceText: "Bilinmiyor",
        isFree: false,
        category: "pazar",
        attendeesCount: null,
        maxAttendees: null,
        isOnline: false,
        organizer: "Bilinmiyor",
        tags: ["Trabzon", "Ortahisar", "Karadeniz", "Sanayi"],
        schedule: standardSundaySchedule
    },
    {
        id: "van-tusba-otopazari",
        title: "Van Tuşba Açık Oto Pazarı",
        description: "Doğu'nun ticaret merkezi Van'ın en büyük ikinci el otomobil pazarı. Tuşba Galericiler Sitesi içerisinde kurulur.",
        imageUrl: "/otopazari_final_26.png",
        date: getNextSunday(),
        duration: "08:00 - 17:00",
        location: "Galericiler Sitesi İçi, Tuşba, Van",
        city: "Van",
        priceText: "Bilinmiyor",
        isFree: false,
        category: "pazar",
        attendeesCount: null,
        maxAttendees: null,
        isOnline: false,
        organizer: "Bilinmiyor",
        tags: ["Van", "Tuşba", "Doğu Anadolu", "Açık Pazar"],
        schedule: standardSundaySchedule
    }
];

const POPULATION_ORDER = [
    "İstanbul",
    "Ankara",
    "İzmir",
    "Bursa",
    "Antalya",
    "Adana",
    "Konya",
    "Şanlıurfa",
    "Gaziantep",
    "Kocaeli",
    "Mersin",
    "Diyarbakır",
    "Hatay",
    "Manisa",
    "Kayseri",
    "Samsun",
    "Balıkesir",
    "Kahramanmaraş",
    "Van",
    "Aydın",
    "Tekirdağ",
    "Denizli",
    "Sakarya",
    "Muğla",
    "Eskişehir",
    "Mardin",
    "Trabzon",
    "Ordu",
    "Erzurum",
    "Malatya"
];

export function getEventById(id: string): Event | undefined {
    return events.find(event => event.id === id);
}

export function getEventsByCity(city: string): Event[] {
    if (city === "Tümü") return events;
    return events.filter(event => event.city.toLowerCase() === city.toLowerCase());
}

export function getEventsByCategory(category: string): Event[] {
    if (category === "all") return events;
    return events.filter(event => event.category === category);
}

export const cities = [
    "Tümü",
    ...Array.from(new Set(events.map(e => e.city))).sort((a, b) => {
        const indexA = POPULATION_ORDER.indexOf(a);
        const indexB = POPULATION_ORDER.indexOf(b);
        if (indexA === -1 && indexB === -1) return a.localeCompare(b);
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
    })
];
