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
    const daysUntilSaturday = dayOfWeek === 6 ? 7 : 6 - dayOfWeek + (dayOfWeek === 0 ? -1 : 0); // If Sunday (0), next Sat is 6 days away? No 6-0 = 6.
    // Logic: 
    // Sun (0) -> Sat (6) = +6
    // Mon (1) -> Sat (6) = +5
    // ...
    // Fri (5) -> Sat (6) = +1
    // Sat (6) -> Next Sat = +7

    // 0 -> 6 (6-0)
    // 1 -> 5 (6-1)
    // 6 -> 7

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
        attendeesCount: null, // Bilinmiyor
        maxAttendees: null, // Bilinmiyor
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
        attendeesCount: null, // Bilinmiyor
        maxAttendees: null, // Bilinmiyor
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
        schedule: [
            { dayName: "Pazartesi", hours: "Kapalı", isOpen: false },
            { dayName: "Salı", hours: "Kapalı", isOpen: false },
            { dayName: "Çarşamba", hours: "Kapalı", isOpen: false },
            { dayName: "Perşembe", hours: "Kapalı", isOpen: false },
            { dayName: "Cuma", hours: "Kapalı", isOpen: false },
            { dayName: "Cumartesi", hours: "Kapalı", isOpen: false },
            { dayName: "Pazar", hours: "08:00 - 17:00", isOpen: true }
        ]
    }
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

export const cities = ["Tümü", ...Array.from(new Set(events.map(e => e.city))).sort()];
