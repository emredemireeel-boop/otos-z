export interface TrimLevel {
    name: string;
    availability: ('standard' | 'optional' | 'unavailable')[];
}

export interface VehicleTrimData {
    vehicleId: number;
    features: string[];
    trims: TrimLevel[];
}

export const trimDNAData: VehicleTrimData[] = [
    {
        vehicleId: 1, // Renault Clio 5
        features: [
            "Alaşım Jantlar",
            "Dijital Klima",
            "LED Ön Farlar",
            "Geri Görüş Kamerası",
            "Hayalet Ekran (Dijital Kadran)",
            "Apple CarPlay & Android Auto",
            "Anahtarsız Giriş ve Çalıştırma",
            "Şerit Takip Asistanı",
            "Cam Tavan"
        ],
        trims: [
            {
                name: "Joy",
                availability: ["unavailable", "unavailable", "standard", "unavailable", "unavailable", "unavailable", "unavailable", "unavailable", "unavailable"]
            },
            {
                name: "Touch",
                availability: ["standard", "unavailable", "standard", "standard", "unavailable", "standard", "unavailable", "unavailable", "optional"]
            },
            {
                name: "Icon",
                availability: ["standard", "standard", "standard", "standard", "standard", "standard", "standard", "standard", "optional"]
            }
        ]
    },
    {
        vehicleId: 2, // Fiat Egea (Makyajlı)
        features: [
            "Alaşımlı Çelik Jant",
            "Dijital Klima",
            "Full LED Farlar",
            "Geri Görüş Kamerası",
            "7'' Renkli TFT Gösterge Paneli",
            "10'' Tablet Ekran & CarPlay",
            "Kör Nokta Uyarı Sistemi",
            "Kablosuz Şarj",
            "Isıtmalı Ön Koltuklar"
        ],
        trims: [
            {
                name: "Easy",
                availability: ["unavailable", "unavailable", "unavailable", "unavailable", "unavailable", "unavailable", "unavailable", "unavailable", "unavailable"]
            },
            {
                name: "Urban",
                availability: ["standard", "standard", "standard", "unavailable", "unavailable", "standard", "unavailable", "unavailable", "unavailable"]
            },
            {
                name: "Lounge",
                availability: ["standard", "standard", "standard", "standard", "standard", "standard", "optional", "standard", "optional"]
            }
        ]
    },
    {
        vehicleId: 3, // Renault Megane 4
        features: [
            "Alaşımlı Jant",
            "Çift Bölgeli Dijital Klima",
            "Pure Vision LED Farlar",
            "Geri Görüş Kamerası",
            "Hayalet Ekran",
            "R-Link / Easy Link Multimedya",
            "Anahtarsız Giriş & Çalıştırma",
            "Cam Tavan",
            "Masajlı Sürücü Koltuğu"
        ],
        trims: [
            {
                name: "Joy",
                availability: ["unavailable", "unavailable", "unavailable", "unavailable", "unavailable", "unavailable", "unavailable", "unavailable", "unavailable"]
            },
            {
                name: "Touch",
                availability: ["standard", "standard", "unavailable", "standard", "unavailable", "standard", "standard", "optional", "unavailable"]
            },
            {
                name: "Icon",
                availability: ["standard", "standard", "standard", "standard", "standard", "standard", "standard", "optional", "standard"]
            }
        ]
    },
    {
        vehicleId: 4, // Hyundai i20
        features: [
            "Alaşım Jantlar",
            "Dijital Klima",
            "LED Ön Farlar & Stoplar",
            "Geri Görüş Kamerası",
            "10.25'' Dijital Gösterge",
            "8'' Multimedya & Apple CarPlay",
            "Anahtarsız Giriş",
            "Şerit Takip ve Çarpışma Önleme",
            "Sunroof"
        ],
        trims: [
            {
                name: "Jump",
                availability: ["unavailable", "unavailable", "unavailable", "unavailable", "unavailable", "unavailable", "unavailable", "unavailable", "unavailable"]
            },
            {
                name: "Style",
                availability: ["standard", "unavailable", "standard", "standard", "unavailable", "standard", "unavailable", "unavailable", "optional"]
            },
            {
                name: "Elite",
                availability: ["standard", "standard", "standard", "standard", "standard", "standard", "standard", "standard", "optional"]
            }
        ]
    },
    {
        vehicleId: 5, // Honda Civic FC5
        features: [
            "Alaşım Jantlar",
            "Dijital Klima",
            "LED Farlar",
            "Geri Görüş Kamerası",
            "Hayalet Kadran",
            "Apple CarPlay / Android Auto",
            "Anahtarsız Giriş",
            "Sunroof",
            "Isıtmalı Deri Koltuklar"
        ],
        trims: [
            {
                name: "Elegance",
                availability: ["standard", "standard", "unavailable", "standard", "standard", "standard", "standard", "standard", "standard"]
            },
            {
                name: "Executive",
                availability: ["standard", "standard", "standard", "standard", "standard", "standard", "standard", "standard", "standard"]
            }
        ]
    },
    {
        vehicleId: 10, // Dacia Duster
        features: [
            "Çelik Jant",
            "Otomatik Klima",
            "Kör Nokta Uyarı Sistemi",
            "Geri Görüş Kamerası",
            "Multimedya & CarPlay",
            "Anahtarsız Giriş",
            "4x4 Çekiş Sistemi",
            "Koltuk Isıtma",
            "360 Derece Kamera"
        ],
        trims: [
            {
                name: "Comfort / Essential",
                availability: ["unavailable", "unavailable", "unavailable", "unavailable", "unavailable", "unavailable", "optional", "unavailable", "unavailable"]
            },
            {
                name: "Prestige / Journey",
                availability: ["standard", "standard", "standard", "standard", "standard", "unavailable", "optional", "optional", "unavailable"]
            },
            {
                name: "Extreme",
                availability: ["standard", "standard", "standard", "standard", "standard", "standard", "optional", "optional", "standard"]
            }
        ]
    }
];
