
// Car Market Data for Piyasalar Page
// 2025 Yılı Gerçek Satış Verileri (Kaynak: ODMD)
// Toplam Pazar: 1.368.400 adet (Otomobil + Hafif Ticari)

// 1. BRAND BASED DATA (Top 30 Brands)
export interface MarketBrandRow {
    rank: number;
    brand: string;
    totalSales: number; // Adet (2025 gerçek veriler)
    marketSharePercent: number; // Yüzde
    basePriceTl: number; // 2026 Tahmini Başlangıç Fiyatı (0 km)
    country: string;
    yoyChange?: number; // Yıllık değişim yüzdesi
}

// 2. MODEL BASED DATA (Top Models)
export interface MarketModelRow {
    rank: number;
    brand: string;
    model: string;
    segment: string;
    bodyType: string;
    yearRange: string;
    averagePriceTl: number; // -1 if discontinued
    totalSales2025: number; // 2025 gerçek satış adedi
    demandIndex: number;
    country: string;
    isDiscontinued?: boolean;
    isElectric?: boolean;
}

// Country flag helper
export const getCountryFlag = (country: string): string => {
    const flags: Record<string, string> = {
        "Türkiye": "🇹🇷",
        "Almanya": "🇩🇪",
        "Japonya": "🇯🇵",
        "ABD": "🇺🇸",
        "Fransa": "🇫🇷",
        "İtalya": "🇮🇹",
        "Güney Kore": "🇰🇷",
        "İngiltere": "🇬🇧",
        "İsveç": "🇸🇪",
        "Çekya": "🇨🇿",
        "Romanya": "🇷🇴",
        "İspanya": "🇪🇸",
        "Çin": "🇨🇳",
    };
    return flags[country] || "";
};

// Country code for flag images
export const getCountryCode = (country: string): string => {
    const codes: Record<string, string> = {
        "Türkiye": "TR",
        "Almanya": "DE",
        "Japonya": "JP",
        "ABD": "US",
        "Fransa": "FR",
        "İtalya": "IT",
        "Güney Kore": "KR",
        "İngiltere": "GB",
        "İsveç": "SE",
        "Çekya": "CZ",
        "Romanya": "RO",
        "İspanya": "ES",
        "Çin": "CN",
    };
    return codes[country] || "UN";
};

// Get flag image URL
export const getFlagUrl = (country: string): string => {
    const code = getCountryCode(country).toLowerCase();
    return `https://flagcdn.com/24x18/${code}.png`;
};

// --- DATA SETS ---

// Top 30 Brands - 2025 ODMD Gerçek Satış Verileri
export const turkeyBrandMarkets: MarketBrandRow[] = [
    { rank: 1, brand: "Renault", totalSales: 144331, marketSharePercent: 10.55, basePriceTl: 1150000, country: "Fransa", yoyChange: 5.2 },
    { rank: 2, brand: "Fiat", totalSales: 118641, marketSharePercent: 8.67, basePriceTl: 1250000, country: "İtalya", yoyChange: -2.1 },
    { rank: 3, brand: "Volkswagen", totalSales: 112287, marketSharePercent: 8.21, basePriceTl: 1650000, country: "Almanya", yoyChange: 3.8 },
    { rank: 4, brand: "Ford", totalSales: 109585, marketSharePercent: 8.01, basePriceTl: 1550000, country: "ABD", yoyChange: 1.4 },
    { rank: 5, brand: "Toyota", totalSales: 92381, marketSharePercent: 6.75, basePriceTl: 1450000, country: "Japonya", yoyChange: 8.6 },
    { rank: 6, brand: "Peugeot", totalSales: 86459, marketSharePercent: 6.32, basePriceTl: 1580000, country: "Fransa", yoyChange: 2.3 },
    { rank: 7, brand: "Opel", totalSales: 75487, marketSharePercent: 5.52, basePriceTl: 1350000, country: "Almanya", yoyChange: 4.1 },
    { rank: 8, brand: "Citroen", totalSales: 71440, marketSharePercent: 5.22, basePriceTl: 1280000, country: "Fransa", yoyChange: 6.7 },
    { rank: 9, brand: "Hyundai", totalSales: 67120, marketSharePercent: 4.91, basePriceTl: 1320000, country: "Güney Kore", yoyChange: 12.4 },
    { rank: 10, brand: "BYD", totalSales: 45537, marketSharePercent: 3.33, basePriceTl: 1750000, country: "Çin", yoyChange: 142.0 },
    { rank: 11, brand: "Skoda", totalSales: 45321, marketSharePercent: 3.31, basePriceTl: 1620000, country: "Çekya", yoyChange: 7.2 },
    { rank: 12, brand: "Mercedes-Benz", totalSales: 43224, marketSharePercent: 3.16, basePriceTl: 3450000, country: "Almanya", yoyChange: -1.5 },
    { rank: 13, brand: "Togg", totalSales: 39020, marketSharePercent: 2.85, basePriceTl: 1850000, country: "Türkiye", yoyChange: 56.3 },
    { rank: 14, brand: "BMW", totalSales: 33992, marketSharePercent: 2.48, basePriceTl: 3200000, country: "Almanya", yoyChange: 2.9 },
    { rank: 15, brand: "Tesla", totalSales: 31509, marketSharePercent: 2.30, basePriceTl: 2100000, country: "ABD", yoyChange: 90.5 },
    { rank: 16, brand: "Nissan", totalSales: 28705, marketSharePercent: 2.10, basePriceTl: 1850000, country: "Japonya", yoyChange: 15.3 },
    { rank: 17, brand: "Chery", totalSales: 28579, marketSharePercent: 2.09, basePriceTl: 1950000, country: "Çin", yoyChange: -8.4 },
    { rank: 18, brand: "Kia", totalSales: 25420, marketSharePercent: 1.86, basePriceTl: 1450000, country: "Güney Kore", yoyChange: 18.7 },
    { rank: 19, brand: "Dacia", totalSales: 25405, marketSharePercent: 1.86, basePriceTl: 1100000, country: "Romanya", yoyChange: 4.5 },
    { rank: 20, brand: "Audi", totalSales: 24832, marketSharePercent: 1.81, basePriceTl: 2950000, country: "Almanya", yoyChange: 5.1 },
    { rank: 21, brand: "Honda", totalSales: 16137, marketSharePercent: 1.18, basePriceTl: 1950000, country: "Japonya", yoyChange: -3.2 },
    { rank: 22, brand: "KG Mobility", totalSales: 15320, marketSharePercent: 1.12, basePriceTl: 1750000, country: "Güney Kore", yoyChange: 22.1 },
    { rank: 23, brand: "Volvo", totalSales: 15225, marketSharePercent: 1.11, basePriceTl: 3650000, country: "İsveç", yoyChange: 11.8 },
    { rank: 24, brand: "Cupra", totalSales: 12998, marketSharePercent: 0.95, basePriceTl: 2450000, country: "İspanya", yoyChange: 35.2 },
    { rank: 25, brand: "Mini", totalSales: 10380, marketSharePercent: 0.76, basePriceTl: 2850000, country: "İngiltere", yoyChange: 28.4 },
    { rank: 26, brand: "Seat", totalSales: 9857, marketSharePercent: 0.72, basePriceTl: 1550000, country: "İspanya", yoyChange: -5.1 },
    { rank: 27, brand: "Jaecoo", totalSales: 8791, marketSharePercent: 0.64, basePriceTl: 2150000, country: "Çin", yoyChange: 0 },
    { rank: 28, brand: "Suzuki", totalSales: 5895, marketSharePercent: 0.43, basePriceTl: 1380000, country: "Japonya", yoyChange: -12.3 },
    { rank: 29, brand: "Iveco", totalSales: 3971, marketSharePercent: 0.29, basePriceTl: 2800000, country: "İtalya", yoyChange: 7.6 },
    { rank: 30, brand: "Jeep", totalSales: 3486, marketSharePercent: 0.25, basePriceTl: 2150000, country: "ABD", yoyChange: -18.5 },
];

// Top 30 Best Selling Models - 2025 ODMD Gerçek Satış Verileri
export const turkeyModelMarkets: MarketModelRow[] = [
    { rank: 1, brand: "Renault", model: "Clio", segment: "B", bodyType: "HB", yearRange: "2020-2026", averagePriceTl: 1480000, totalSales2025: 51717, demandIndex: 99, country: "Fransa" },
    { rank: 2, brand: "Renault", model: "Megane Sedan", segment: "C", bodyType: "Sedan", yearRange: "2017-2026", averagePriceTl: 1650000, totalSales2025: 48099, demandIndex: 98, country: "Fransa" },
    { rank: 3, brand: "Fiat", model: "Egea Sedan", segment: "C", bodyType: "Sedan", yearRange: "2016-2026", averagePriceTl: 1350000, totalSales2025: 42838, demandIndex: 97, country: "İtalya" },
    { rank: 4, brand: "Toyota", model: "Corolla", segment: "C", bodyType: "Sedan", yearRange: "2019-2026", averagePriceTl: 1850000, totalSales2025: 35907, demandIndex: 96, country: "Japonya" },
    { rank: 5, brand: "Tesla", model: "Model Y", segment: "SUV", bodyType: "SUV", yearRange: "2022-2026", averagePriceTl: 2400000, totalSales2025: 31509, demandIndex: 95, country: "ABD", isElectric: true },
    { rank: 6, brand: "BYD", model: "Seal U", segment: "SUV", bodyType: "SUV", yearRange: "2024-2026", averagePriceTl: 1950000, totalSales2025: 30380, demandIndex: 94, country: "Çin", isElectric: true },
    { rank: 7, brand: "Togg", model: "T10X", segment: "SUV", bodyType: "SUV", yearRange: "2023-2026", averagePriceTl: 1650000, totalSales2025: 27583, demandIndex: 93, country: "Türkiye", isElectric: true },
    { rank: 8, brand: "Fiat", model: "Egea Cross", segment: "C-SUV", bodyType: "SUV", yearRange: "2021-2026", averagePriceTl: 1450000, totalSales2025: 26820, demandIndex: 92, country: "İtalya" },
    { rank: 9, brand: "Toyota", model: "C-HR", segment: "SUV", bodyType: "SUV", yearRange: "2024-2026", averagePriceTl: 2250000, totalSales2025: 25215, demandIndex: 91, country: "Japonya" },
    { rank: 10, brand: "Dacia", model: "Sandero Stepway", segment: "B", bodyType: "HB", yearRange: "2021-2026", averagePriceTl: 1250000, totalSales2025: 23699, demandIndex: 90, country: "Romanya" },
    { rank: 11, brand: "Hyundai", model: "i20", segment: "B", bodyType: "HB", yearRange: "2021-2026", averagePriceTl: 1350000, totalSales2025: 22450, demandIndex: 89, country: "Güney Kore" },
    { rank: 12, brand: "Volkswagen", model: "Polo", segment: "B", bodyType: "HB", yearRange: "2018-2026", averagePriceTl: 1550000, totalSales2025: 21800, demandIndex: 88, country: "Almanya" },
    { rank: 13, brand: "Opel", model: "Corsa", segment: "B", bodyType: "HB", yearRange: "2020-2026", averagePriceTl: 1450000, totalSales2025: 20150, demandIndex: 87, country: "Almanya" },
    { rank: 14, brand: "Peugeot", model: "2008", segment: "SUV", bodyType: "SUV", yearRange: "2020-2026", averagePriceTl: 1850000, totalSales2025: 19800, demandIndex: 86, country: "Fransa" },
    { rank: 15, brand: "Chery", model: "Tiggo 8 Pro", segment: "SUV", bodyType: "SUV", yearRange: "2023-2026", averagePriceTl: 2050000, totalSales2025: 18500, demandIndex: 85, country: "Çin" },
    { rank: 16, brand: "Nissan", model: "Qashqai", segment: "SUV", bodyType: "SUV", yearRange: "2015-2026", averagePriceTl: 2250000, totalSales2025: 17200, demandIndex: 84, country: "Japonya" },
    { rank: 17, brand: "Dacia", model: "Duster", segment: "SUV", bodyType: "SUV", yearRange: "2019-2026", averagePriceTl: 1550000, totalSales2025: 16800, demandIndex: 83, country: "Romanya" },
    { rank: 18, brand: "Citroen", model: "C4 X", segment: "C", bodyType: "Sedan", yearRange: "2023-2026", averagePriceTl: 1750000, totalSales2025: 16200, demandIndex: 82, country: "Fransa" },
    { rank: 19, brand: "Volkswagen", model: "T-Roc", segment: "SUV", bodyType: "SUV", yearRange: "2020-2026", averagePriceTl: 2150000, totalSales2025: 15600, demandIndex: 81, country: "Almanya" },
    { rank: 20, brand: "Peugeot", model: "3008", segment: "SUV", bodyType: "SUV", yearRange: "2018-2026", averagePriceTl: 2450000, totalSales2025: 14900, demandIndex: 80, country: "Fransa" },
    { rank: 21, brand: "Chery", model: "Tiggo 7 Pro", segment: "SUV", bodyType: "SUV", yearRange: "2023-2026", averagePriceTl: 1750000, totalSales2025: 14200, demandIndex: 79, country: "Çin" },
    { rank: 22, brand: "Honda", model: "City", segment: "B", bodyType: "Sedan", yearRange: "2021-2026", averagePriceTl: 1350000, totalSales2025: 13500, demandIndex: 78, country: "Japonya" },
    { rank: 23, brand: "Skoda", model: "Octavia", segment: "C", bodyType: "Sedan", yearRange: "2018-2026", averagePriceTl: 2350000, totalSales2025: 12800, demandIndex: 77, country: "Çekya" },
    { rank: 24, brand: "Kia", model: "Sportage", segment: "SUV", bodyType: "SUV", yearRange: "2017-2026", averagePriceTl: 2350000, totalSales2025: 12100, demandIndex: 76, country: "Güney Kore" },
    { rank: 25, brand: "Hyundai", model: "Tucson", segment: "SUV", bodyType: "SUV", yearRange: "2017-2026", averagePriceTl: 2450000, totalSales2025: 11400, demandIndex: 75, country: "Güney Kore" },
    { rank: 26, brand: "Chery", model: "Omoda 5", segment: "SUV", bodyType: "SUV", yearRange: "2023-2026", averagePriceTl: 1650000, totalSales2025: 10800, demandIndex: 74, country: "Çin" },
    { rank: 27, brand: "Volkswagen", model: "Taigo", segment: "SUV", bodyType: "SUV", yearRange: "2022-2026", averagePriceTl: 1950000, totalSales2025: 10200, demandIndex: 73, country: "Almanya" },
    { rank: 28, brand: "Opel", model: "Mokka", segment: "SUV", bodyType: "SUV", yearRange: "2021-2026", averagePriceTl: 1850000, totalSales2025: 9600, demandIndex: 72, country: "Almanya" },
    { rank: 29, brand: "Citroen", model: "C3", segment: "B", bodyType: "HB", yearRange: "2018-2026", averagePriceTl: 1150000, totalSales2025: 9100, demandIndex: 71, country: "Fransa" },
    { rank: 30, brand: "Peugeot", model: "208", segment: "B", bodyType: "HB", yearRange: "2020-2026", averagePriceTl: 1450000, totalSales2025: 8500, demandIndex: 70, country: "Fransa" },
];

// Helper to format large numbers
export const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('tr-TR').format(num);
};

// Format price
export const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('tr-TR').format(price) + ' ₺';
};

// Get rank color
export const getRankColor = (rank: number): string => {
    if (rank === 1) return '#D4A017'; // Gold
    if (rank === 2) return '#9CA3AF'; // Silver
    if (rank === 3) return '#B87333'; // Bronze
    return '#64748B'; // Professional slate for all others
};

// Get demand color
export const getDemandColor = (demandIndex: number): string => {
    if (demandIndex >= 90) return '#6366F1';
    if (demandIndex >= 80) return '#818CF8';
    if (demandIndex >= 70) return '#94A3B8';
    if (demandIndex >= 60) return '#9CA3AF';
    return '#CBD5E1';
};

// Format yoy change
export const formatYoyChange = (change: number): string => {
    if (change > 0) return `+${change.toFixed(1)}%`;
    return `${change.toFixed(1)}%`;
};

// Get yoy color
export const getYoyColor = (change: number): string => {
    if (change > 0) return '#22c55e';
    if (change < 0) return '#ef4444';
    return '#9CA3AF';
};
