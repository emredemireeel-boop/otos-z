
// Car Market Data for Piyasalar Page

// 1. BRAND BASED DATA (Top 30 Brands)
export interface MarketBrandRow {
    rank: number;
    brand: string;
    totalSales: number; // Adet
    marketSharePercent: number; // Yüzde
    basePriceTl: number; // 2026 Tahmini Başlangıç Fiyatı (0 km)
    country: string;
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
    demandIndex: number;
    country: string;
    isDiscontinued?: boolean;
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

// Top 30 Brands - 2025 Sales Data
export const turkeyBrandMarkets: MarketBrandRow[] = [
    { rank: 1, brand: "Renault", totalSales: 144331, marketSharePercent: 10.55, basePriceTl: 1150000, country: "Fransa" },
    { rank: 2, brand: "Fiat", totalSales: 118641, marketSharePercent: 8.67, basePriceTl: 1250000, country: "İtalya" },
    { rank: 3, brand: "Volkswagen", totalSales: 112287, marketSharePercent: 8.21, basePriceTl: 1650000, country: "Almanya" },
    { rank: 4, brand: "Ford", totalSales: 109585, marketSharePercent: 8.01, basePriceTl: 1550000, country: "ABD" },
    { rank: 5, brand: "Toyota", totalSales: 92381, marketSharePercent: 6.75, basePriceTl: 1450000, country: "Japonya" },
    { rank: 6, brand: "Peugeot", totalSales: 86459, marketSharePercent: 6.32, basePriceTl: 1580000, country: "Fransa" },
    { rank: 7, brand: "Opel", totalSales: 75487, marketSharePercent: 5.52, basePriceTl: 1350000, country: "Almanya" },
    { rank: 8, brand: "Citroen", totalSales: 71440, marketSharePercent: 5.22, basePriceTl: 1280000, country: "Fransa" },
    { rank: 9, brand: "Hyundai", totalSales: 67120, marketSharePercent: 4.90, basePriceTl: 1320000, country: "Güney Kore" },
    { rank: 10, brand: "BYD", totalSales: 45537, marketSharePercent: 3.33, basePriceTl: 1750000, country: "Çin" },
    { rank: 11, brand: "Skoda", totalSales: 45321, marketSharePercent: 3.31, basePriceTl: 1620000, country: "Çekya" },
    { rank: 12, brand: "Togg", totalSales: 39020, marketSharePercent: 2.85, basePriceTl: 1850000, country: "Türkiye" },
    { rank: 13, brand: "Dacia", totalSales: 35000, marketSharePercent: 2.50, basePriceTl: 1100000, country: "Romanya" },
    { rank: 14, brand: "Tesla", totalSales: 31509, marketSharePercent: 2.30, basePriceTl: 2100000, country: "ABD" },
    { rank: 15, brand: "Chery", totalSales: 28579, marketSharePercent: 2.09, basePriceTl: 1950000, country: "Çin" },
    { rank: 16, brand: "Nissan", totalSales: 25000, marketSharePercent: 1.80, basePriceTl: 1850000, country: "Japonya" },
    { rank: 17, brand: "BMW", totalSales: 20000, marketSharePercent: 1.45, basePriceTl: 3200000, country: "Almanya" },
    { rank: 18, brand: "Audi", totalSales: 18000, marketSharePercent: 1.30, basePriceTl: 2950000, country: "Almanya" },
    { rank: 19, brand: "Mercedes-Benz", totalSales: 15000, marketSharePercent: 1.10, basePriceTl: 3450000, country: "Almanya" },
    { rank: 20, brand: "MG", totalSales: 14000, marketSharePercent: 1.00, basePriceTl: 1250000, country: "Çin" },
    { rank: 21, brand: "Cupra", totalSales: 12998, marketSharePercent: 0.95, basePriceTl: 2450000, country: "İspanya" },
    { rank: 22, brand: "Honda", totalSales: 11000, marketSharePercent: 0.80, basePriceTl: 1950000, country: "Japonya" },
    { rank: 23, brand: "Kia", totalSales: 10000, marketSharePercent: 0.75, basePriceTl: 1450000, country: "Güney Kore" },
    { rank: 24, brand: "Seat", totalSales: 9000, marketSharePercent: 0.65, basePriceTl: 1550000, country: "İspanya" },
    { rank: 25, brand: "Suzuki", totalSales: 7000, marketSharePercent: 0.50, basePriceTl: 1380000, country: "Japonya" },
    { rank: 26, brand: "Volvo", totalSales: 6000, marketSharePercent: 0.45, basePriceTl: 3650000, country: "İsveç" },
    { rank: 27, brand: "Jeep", totalSales: 4000, marketSharePercent: 0.30, basePriceTl: 2150000, country: "ABD" },
    { rank: 28, brand: "Land Rover", totalSales: 3500, marketSharePercent: 0.25, basePriceTl: 8500000, country: "İngiltere" },
    { rank: 29, brand: "Mitsubishi", totalSales: 2500, marketSharePercent: 0.18, basePriceTl: 1950000, country: "Japonya" },
    { rank: 30, brand: "Lexus", totalSales: 742, marketSharePercent: 0.05, basePriceTl: 4250000, country: "Japonya" },
];

// Top 30 Best Selling Models - 2025 Data
export const turkeyModelMarkets: MarketModelRow[] = [
    { rank: 1, brand: "Renault", model: "Clio", segment: "B", bodyType: "HB", yearRange: "2020-2026", averagePriceTl: 1480000, demandIndex: 99, country: "Fransa" },
    { rank: 2, brand: "Renault", model: "Megane Sedan", segment: "C", bodyType: "Sedan", yearRange: "2017-2026", averagePriceTl: 1650000, demandIndex: 98, country: "Fransa" },
    { rank: 3, brand: "Fiat", model: "Egea Sedan", segment: "C", bodyType: "Sedan", yearRange: "2016-2026", averagePriceTl: 1350000, demandIndex: 97, country: "İtalya" },
    { rank: 4, brand: "Toyota", model: "Corolla", segment: "C", bodyType: "Sedan", yearRange: "2019-2026", averagePriceTl: 1850000, demandIndex: 96, country: "Japonya" },
    { rank: 5, brand: "Tesla", model: "Model Y", segment: "SUV", bodyType: "SUV", yearRange: "2022-2026", averagePriceTl: 2400000, demandIndex: 95, country: "ABD" },
    { rank: 6, brand: "BYD", model: "Seal U", segment: "SUV", bodyType: "SUV", yearRange: "2024-2026", averagePriceTl: 1950000, demandIndex: 94, country: "Çin" },
    { rank: 7, brand: "Togg", model: "T10X", segment: "SUV", bodyType: "SUV", yearRange: "2023-2026", averagePriceTl: 1650000, demandIndex: 93, country: "Türkiye" },
    { rank: 8, brand: "Dacia", model: "Duster", segment: "SUV", bodyType: "SUV", yearRange: "2019-2026", averagePriceTl: 1550000, demandIndex: 92, country: "Romanya" },
    { rank: 9, brand: "Hyundai", model: "i20", segment: "B", bodyType: "HB", yearRange: "2021-2026", averagePriceTl: 1350000, demandIndex: 91, country: "Güney Kore" },
    { rank: 10, brand: "Chery", model: "Tiggo 8 Pro", segment: "SUV", bodyType: "SUV", yearRange: "2023-2026", averagePriceTl: 2050000, demandIndex: 90, country: "Çin" },
    { rank: 11, brand: "Fiat", model: "Egea Cross", segment: "C-SUV", bodyType: "SUV", yearRange: "2021-2026", averagePriceTl: 1450000, demandIndex: 89, country: "İtalya" },
    { rank: 12, brand: "Volkswagen", model: "Polo", segment: "B", bodyType: "HB", yearRange: "2018-2026", averagePriceTl: 1550000, demandIndex: 88, country: "Almanya" },
    { rank: 13, brand: "Opel", model: "Corsa", segment: "B", bodyType: "HB", yearRange: "2020-2026", averagePriceTl: 1450000, demandIndex: 87, country: "Almanya" },
    { rank: 14, brand: "Peugeot", model: "2008", segment: "SUV", bodyType: "SUV", yearRange: "2020-2026", averagePriceTl: 1850000, demandIndex: 86, country: "Fransa" },
    { rank: 15, brand: "Nissan", model: "Qashqai", segment: "SUV", bodyType: "SUV", yearRange: "2015-2026", averagePriceTl: 2250000, demandIndex: 85, country: "Japonya" },
    { rank: 16, brand: "Chery", model: "Tiggo 7 Pro", segment: "SUV", bodyType: "SUV", yearRange: "2023-2026", averagePriceTl: 1750000, demandIndex: 84, country: "Çin" },
    { rank: 17, brand: "Chery", model: "Omoda 5", segment: "SUV", bodyType: "SUV", yearRange: "2023-2026", averagePriceTl: 1650000, demandIndex: 83, country: "Çin" },
    { rank: 18, brand: "Peugeot", model: "3008", segment: "SUV", bodyType: "SUV", yearRange: "2018-2026", averagePriceTl: 2450000, demandIndex: 82, country: "Fransa" },
    { rank: 19, brand: "Volkswagen", model: "T-Roc", segment: "SUV", bodyType: "SUV", yearRange: "2020-2026", averagePriceTl: 2150000, demandIndex: 81, country: "Almanya" },
    { rank: 20, brand: "Citroen", model: "C4 X", segment: "C", bodyType: "Sedan", yearRange: "2023-2026", averagePriceTl: 1750000, demandIndex: 80, country: "Fransa" },
    { rank: 21, brand: "Honda", model: "City", segment: "B", bodyType: "Sedan", yearRange: "2021-2026", averagePriceTl: 1350000, demandIndex: 79, country: "Japonya" },
    { rank: 22, brand: "Skoda", model: "Octavia", segment: "C", bodyType: "Sedan", yearRange: "2018-2026", averagePriceTl: 2350000, demandIndex: 78, country: "Çekya" },
    { rank: 23, brand: "Kia", model: "Sportage", segment: "SUV", bodyType: "SUV", yearRange: "2017-2026", averagePriceTl: 2350000, demandIndex: 77, country: "Güney Kore" },
    { rank: 24, brand: "Hyundai", model: "Tucson", segment: "SUV", bodyType: "SUV", yearRange: "2017-2026", averagePriceTl: 2450000, demandIndex: 76, country: "Güney Kore" },
    { rank: 25, brand: "Volkswagen", model: "Taigo", segment: "SUV", bodyType: "SUV", yearRange: "2022-2026", averagePriceTl: 1950000, demandIndex: 75, country: "Almanya" },
    { rank: 26, brand: "Opel", model: "Mokka", segment: "SUV", bodyType: "SUV", yearRange: "2021-2026", averagePriceTl: 1850000, demandIndex: 74, country: "Almanya" },
    { rank: 27, brand: "Dacia", model: "Sandero Stepway", segment: "B", bodyType: "HB", yearRange: "2021-2026", averagePriceTl: 1250000, demandIndex: 73, country: "Romanya" },
    { rank: 28, brand: "MG", model: "ZS", segment: "SUV", bodyType: "SUV", yearRange: "2021-2026", averagePriceTl: 1350000, demandIndex: 72, country: "Çin" },
    { rank: 29, brand: "Citroen", model: "C3", segment: "B", bodyType: "HB", yearRange: "2018-2026", averagePriceTl: 1150000, demandIndex: 71, country: "Fransa" },
    { rank: 30, brand: "Peugeot", model: "208", segment: "B", bodyType: "HB", yearRange: "2020-2026", averagePriceTl: 1450000, demandIndex: 70, country: "Fransa" },
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
