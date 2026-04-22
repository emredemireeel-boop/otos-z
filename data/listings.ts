// Car Listings Data for Pazar (Marketplace) Page
import carModels from './carmodels.json';
import engineOptions from './engineoptions.json';


// Car colors options
export const carColors = [
    { id: "beyaz", name: "Beyaz", hex: "#FFFFFF" },
    { id: "siyah", name: "Siyah", hex: "#000000" },
    { id: "gri", name: "Gri", hex: "#808080" },
    { id: "gumus_gri", name: "Gümüş Gri", hex: "#C0C0C0" },
    { id: "kirmizi", name: "Kırmızı", hex: "#FF0000" },
    { id: "mavi", name: "Mavi", hex: "#0000FF" },
    { id: "lacivert", name: "Lacivert", hex: "#000080" },
    { id: "yesil", name: "Yeşil", hex: "#008000" },
    { id: "sari", name: "Sarı", hex: "#FFFF00" },
    { id: "turuncu", name: "Turuncu", hex: "#FFA500" },
    { id: "bordo", name: "Bordo", hex: "#800000" },
    { id: "kahverengi", name: "Kahverengi", hex: "#A52A2A" },
    { id: "bej", name: "Bej", hex: "#F5F5DC" },
    { id: "mor", name: "Mor", hex: "#800080" },
    { id: "sampanya", name: "Şampanya", hex: "#F7E7CE" },
    { id: "fume", name: "Füme", hex: "#71797E" },
    { id: "bronz", name: "Bronz", hex: "#CD7F32" },
    { id: "altin", name: "Altın", hex: "#FFD700" },
    { id: "turkuaz", name: "Turkuaz", hex: "#40E0D0" },
    { id: "metalik_mavi", name: "Metalik Mavi", hex: "#4682B4" },
];

export const getColorLabel = (id: string): string => {
    const color = carColors.find(c => c.id === id);
    return color ? color.name : id;
};

export const getColorHex = (id: string): string => {
    const color = carColors.find(c => c.id === id);
    return color ? color.hex : "#CCCCCC";
};

// Panel options for paint status
export const paintPanels = [
    { id: "kaput", name: "Kaput" },
    { id: "sag_on_camurluk", name: "Sağ Ön Çamurluk" },
    { id: "sol_on_camurluk", name: "Sol Ön Çamurluk" },
    { id: "sag_on_kapi", name: "Sağ Ön Kapı" },
    { id: "sol_on_kapi", name: "Sol Ön Kapı" },
    { id: "sag_arka_kapi", name: "Sağ Arka Kapı" },
    { id: "sol_arka_kapi", name: "Sol Arka Kapı" },
    { id: "sag_arka_camurluk", name: "Sağ Arka Çamurluk" },
    { id: "sol_arka_camurluk", name: "Sol Arka Çamurluk" },
    { id: "tavan", name: "Tavan" },
    { id: "bagaj", name: "Bagaj" },
];

// Paint status types
export type PaintStatus = "orijinal" | "boyali" | "lokal" | "degisen" | "hasarli";

export const paintStatusLabels: Record<PaintStatus, string> = {
    orijinal: "Orijinal",
    boyali: "Boyalı",
    lokal: "Lokal Boya",
    degisen: "Değişen",
    hasarli: "Hasarlı",
};

export const paintStatusColors: Record<PaintStatus, string> = {
    orijinal: "#10B981",  // green
    boyali: "#FBBF24",    // yellow
    lokal: "#60A5FA",     // blue
    degisen: "#F97316",   // orange
    hasarli: "#EF4444",   // red
};

// Panel paint status
export interface PaintPanel {
    panelId: string;
    status: PaintStatus;
}

// Car listing interface
export interface CarListing {
    id: string;
    brand: string;
    model: string;
    year: number;
    km: number;
    color: string;              // Added color field
    price: number;              // Otosöz'taki indirimli fiyat
    originalPrice?: number;     // Orijinal ilan fiyatı (sahibinden/arabam)
    paintStatus: PaintPanel[];
    externalLink: string;
    source: "arabam" | "sahibinden" | "other";
    description?: string;
    createdAt: string;
    userId: string;
    userName: string;
    phoneNumber: string;         // Seller's phone number
    // Engine Information
    fuelType?: string;          // benzin, dizel, lpg, elektrik, hibrit, etc.
    transmission?: string;       // manuel, otomatik, dsg, cvt, etc.
    engineType?: string;         // turbo, atmosferik, supercharger, etc.
    drivetrain?: string;         // on_ceker, arkadan_itisli, 4x4, awd
    engineDisplacement?: string; // 1.6, 2.0, 3.0, etc.
    horsepower?: number;         // Motor gücü (HP)
    // Additional Information
    inspectionDate?: string;     // Muayene tarihi (YYYY-MM-DD)
    tireCondition?: number;      // Lastik durumu (0-100%)
    tramerPrice?: number;        // Tramer kaydı fiyatı (TL)
    isUrgent?: boolean;          // Acil satış
    isHeavilyDamaged?: boolean;  // Ağır hasarlı
    // Maintenance tracking
    nextMaintenanceKm?: number;  // Sonraki rutin bakım km
    completedMaintenance?: string[]; // Yapılan ağır bakımlar
    // Location
    city?: string;
    district?: string;
}


// Get all brands from carmodels.json
export const getAllBrands = (): string[] => {
    return Object.keys(carModels as Record<string, string[]>).sort();
};

// Get models for a specific brand
export const getModelsForBrand = (brand: string): string[] => {
    const models = (carModels as Record<string, string[]>)[brand];
    return models ? models.sort() : [];
};

// Get all fuel types
export const getAllFuelTypes = () => {
    return engineOptions.fuelTypes;
};

// Get all transmission types
export const getAllTransmissionTypes = () => {
    return engineOptions.transmissionTypes;
};

// Get all engine types
export const getAllEngineTypes = () => {
    return engineOptions.engineTypes;
};

// Get all drivetrain types
export const getAllDrivetrainTypes = () => {
    return engineOptions.drivetrainTypes;
};

// Get all engine displacements
export const getAllEngineDisplacements = () => {
    return engineOptions.engineDisplacements;
};

// Get all horsepower ranges
export const getAllHorsepowerRanges = () => {
    return engineOptions.horsepowerRanges;
};

// Get label for fuel type
export const getFuelTypeLabel = (id: string): string => {
    const fuelType = engineOptions.fuelTypes.find(f => f.id === id);
    return fuelType ? fuelType.name : id;
};

// Get color for fuel type
export const getFuelTypeColor = (id: string): string => {
    const colorMap: Record<string, string> = {
        "dizel": "#FF6B35",        // Orange for diesel
        "benzin": "#10B981",       // Green for gasoline
        "elektrik": "#3B82F6",     // Blue for electric
        "benzin-lpg": "#A855F7",   // Purple for benzin-lpg
        "hibrit": "#10B981",       // Green for hybrid
        "lpg": "#F97316",          // Orange for LPG
    };
    return colorMap[id] || "#6366F1"; // Default purple
};

// Get label for transmission type
export const getTransmissionLabel = (id: string): string => {
    const transmission = engineOptions.transmissionTypes.find(t => t.id === id);
    return transmission ? transmission.name : id;
};

// Get label for engine type
export const getEngineTypeLabel = (id: string): string => {
    const engineType = engineOptions.engineTypes.find(e => e.id === id);
    return engineType ? engineType.name : id;
};

// Get label for drivetrain type
export const getDrivetrainLabel = (id: string): string => {
    const drivetrain = engineOptions.drivetrainTypes.find(d => d.id === id);
    return drivetrain ? drivetrain.name : id;
};


// Sample listings data
export const sampleListings: CarListing[] = [
    {
        id: "1",
        brand: "BMW",
        model: "3 Serisi (M3)",
        year: 2020,
        km: 45000,
        color: "metalik_mavi",
        price: 2850000,
        originalPrice: 2950000,  // %3.4 indirim
        paintStatus: [
            { panelId: "kaput", status: "orijinal" },
            { panelId: "sag_on_camurluk", status: "boyali" },
            { panelId: "sol_on_camurluk", status: "orijinal" },
            { panelId: "sag_on_kapi", status: "orijinal" },
            { panelId: "sol_on_kapi", status: "orijinal" },
            { panelId: "sag_arka_kapi", status: "orijinal" },
            { panelId: "sol_arka_kapi", status: "orijinal" },
            { panelId: "sag_arka_camurluk", status: "orijinal" },
            { panelId: "sol_arka_camurluk", status: "orijinal" },
            { panelId: "tavan", status: "orijinal" },
            { panelId: "bagaj", status: "orijinal" },
        ],
        externalLink: "https://www.sahibinden.com/ilan/12345678",
        source: "sahibinden",
        description: "Temiz araç, garaj arabası",
        createdAt: "2024-01-20",
        userId: "user1",
        userName: "Ahmet K.",
        phoneNumber: "0532 123 4567",
        // Engine specs
        fuelType: "benzin",
        transmission: "otomatik",
        engineType: "turbo",
        drivetrain: "arkadan_itisli",
        engineDisplacement: "3.0",
        horsepower: 510,
        inspectionDate: "2025-08-15",
        tireCondition: 85,
        tramerPrice: 15000,
        nextMaintenanceKm: 50000,
        completedMaintenance: ["Triger kayışı", "Su pompası"],
        city: "ADANA",
        district: "SEYHAN"
    },
];

// Calculate paint summary for a listing
export const getPaintSummary = (paintStatus: PaintPanel[]) => {
    const counts = {
        orijinal: 0,
        boyali: 0,
        lokal: 0,
        degisen: 0,
        hasarli: 0,
    };

    paintStatus.forEach(panel => {
        counts[panel.status]++;
    });

    return counts;
};

// Get overall paint score (0-100)
export const getPaintScore = (paintStatus: PaintPanel[]): number => {
    const weights: Record<PaintStatus, number> = {
        orijinal: 100,
        boyali: 60,
        lokal: 75,
        degisen: 30,
        hasarli: 0,
    };

    const total = paintStatus.reduce((sum, panel) => sum + weights[panel.status], 0);
    return Math.round(total / paintStatus.length);
};

// Get paint score color
export const getPaintScoreColor = (score: number): string => {
    if (score >= 90) return "#10B981";
    if (score >= 70) return "#34D399";
    if (score >= 50) return "#FBBF24";
    if (score >= 30) return "#F97316";
    return "#EF4444";
};

// Format price
export const formatListingPrice = (price: number): string => {
    return new Intl.NumberFormat('tr-TR').format(price) + ' ₺';
};

// Calculate discount percentage
export const getDiscountPercentage = (originalPrice?: number, price?: number): number => {
    if (!originalPrice || !price) return 0;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
};

// Calculate discount amount
export const getDiscountAmount = (originalPrice?: number, price?: number): number => {
    if (!originalPrice || !price) return 0;
    return originalPrice - price;
};

// Format KM
export const formatKm = (km: number): string => {
    return new Intl.NumberFormat('tr-TR').format(km) + ' km';
};

// Calculate days until inspection
export const getDaysUntilInspection = (inspectionDate?: string): number | null => {
    if (!inspectionDate) return null;
    const today = new Date();
    const inspection = new Date(inspectionDate);
    const diffTime = inspection.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};

// Format inspection status
export const formatInspectionStatus = (inspectionDate?: string): string => {
    const days = getDaysUntilInspection(inspectionDate);
    if (days === null) return "Belirtilmemiş";

    const totalDays = Math.abs(days);
    const months = Math.floor(totalDays / 30);
    const remainingDays = totalDays % 30;

    if (days === 0) {
        return "Bugün bitiyor";
    }

    // Format the output with months and days
    let result = "";
    if (months > 0) {
        result += `${months} ay`;
    }
    if (remainingDays > 0) {
        if (result) result += " ";
        result += `${remainingDays} gün`;
    }
    if (!result) {
        result = "0 gün";
    }

    return `${result} kaldı`;
};

// Get inspection status color
export const getInspectionColor = (inspectionDate?: string): string => {
    const days = getDaysUntilInspection(inspectionDate);
    if (days === null) return "#808080";
    if (days < 0) return "#EF4444"; // Overdue - red
    if (days <= 30) return "#EF4444"; // Critical - red
    if (days <= 90) return "#F97316"; // Soon - orange
    if (days <= 180) return "#FBBF24"; // Warning - yellow (less than 6 months)
    if (days <= 365) return "#F97316"; // 6 months to 1 year - orange
    return "#10B981"; // More than 1 year - green
};

// Get tire condition color
export const getTireConditionColor = (condition?: number): string => {
    if (!condition) return "#808080";
    if (condition >= 80) return "#10B981"; // Green
    if (condition >= 60) return "#FBBF24"; // Yellow
    if (condition >= 40) return "#F97316"; // Orange
    return "#EF4444"; // Red
};


// Detect source from URL
export const detectSource = (url: string): "arabam" | "sahibinden" | "other" => {
    if (url.includes("arabam.com")) return "arabam";
    if (url.includes("sahibinden.com")) return "sahibinden";
    return "other";
};
