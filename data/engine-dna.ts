export interface EngineChronicIssue {
  title: string;
  description: string;
  severity: "low" | "medium" | "high";
  reportCount: number;
}

export interface EngineOption {
  slug: string;
  name: string;
  fuelType: "Benzin" | "Dizel" | "Elektrik" | "Hibrit" | "LPG";
  transmission: string;
  score: number;
  description?: string;
  pros?: string[];
  cons?: string[];
  chronicIssues: EngineChronicIssue[];
}

export interface VehicleEngineData {
  vehicleId: number;
  engines: EngineOption[];
}

// Helper to generate IDs
const generateId = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-");

export const engineDNAData: VehicleEngineData[] = [
  {
    vehicleId: 1,
    engines: [
      {
        slug: "10-tce-90-hp-benzin-manuel-x-tronic",
        name: "1.0 TCe 90 HP",
        fuelType: "Benzin",
        transmission: "Manuel / X-Tronic",
        score: 85,
        chronicIssues: [
          {
            title: "Erken debriyaj aşınması",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 6,
          },
          {
            title: "Turbo valfi sesi",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 6,
          },
        ],
      },
      {
        slug: "15-dci-110-hp-dizel-manuel-edc",
        name: "1.5 dCi 110 HP",
        fuelType: "Dizel",
        transmission: "Manuel / EDC",
        score: 92,
        chronicIssues: [
          {
            title: "EGR valfi tıkanıklığı",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 9,
          },
          {
            title: "Partikül filtresi dolumu",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
        ],
      },
      {
        slug: "13-tce-140-hp-benzin-edc",
        name: "1.3 TCe 140 HP",
        fuelType: "Benzin",
        transmission: "EDC",
        score: 88,
        chronicIssues: [
          {
            title: "Kavrama ısınması (Şehir içi)",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 9,
          },
          {
            title: "Yağ eksiltme",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 6,
          },
        ],
      },
      {
        slug: "16-e-tech-140-hp-hibrit-otomatik",
        name: "1.6 E-Tech 140 HP",
        fuelType: "Hibrit",
        transmission: "Otomatik",
        score: 90,
        chronicIssues: [
          {
            title: "Yazılım güncellemeleri gereksinimi",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
          {
            title: "Vites geçişlerinde kararsızlık",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 9,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2,
    engines: [
      {
        slug: "14-fire-95-hp-benzin-manuel",
        name: "1.4 Fire 95 HP",
        fuelType: "Benzin",
        transmission: "Manuel",
        score: 90,
        chronicIssues: [
          {
            title: "Yüksek yağ tüketimi",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 9,
          },
          {
            title: "Performans eksikliği",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 9,
          },
        ],
      },
      {
        slug: "13-multijet-95-hp-dizel-manuel",
        name: "1.3 Multijet 95 HP",
        fuelType: "Dizel",
        transmission: "Manuel",
        score: 95,
        chronicIssues: [
          {
            title: "EGR tıkanması",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
          {
            title: "Baskı balata ömrü",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 9,
          },
        ],
      },
      {
        slug: "16-multijet-120-hp-dizel-manuel-dct",
        name: "1.6 Multijet 120 HP",
        fuelType: "Dizel",
        transmission: "Manuel / DCT",
        score: 85,
        chronicIssues: [
          {
            title: "Volant arızası",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
          {
            title: "DCT kavrama ısınması",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 6,
          },
        ],
      },
      {
        slug: "15-t4-hibrit-130-hp-hibrit-dct",
        name: "1.5 T4 Hibrit 130 HP",
        fuelType: "Hibrit",
        transmission: "DCT",
        score: 87,
        chronicIssues: [
          {
            title: "Elektrik motoru geçiş sarsıntısı",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 9,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 3,
    engines: [
      {
        slug: "15-dynamic-force-125-hp-benzin-multidrive-s",
        name: "1.5 Dynamic Force 125 HP",
        fuelType: "Benzin",
        transmission: "Multidrive S",
        score: 94,
        chronicIssues: [
          {
            title: "CVT şanzıman ısınması",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
          {
            title: "Yüksek devirde ses",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 9,
          },
        ],
      },
      {
        slug: "18-hybrid-122-hp-hibrit-e-cvt",
        name: "1.8 Hybrid 122 HP",
        fuelType: "Hibrit",
        transmission: "e-CVT",
        score: 98,
        chronicIssues: [
          {
            title: "Batarya kapasite düşüşü (Uzun vadede)",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
          {
            title: "EGR valfi kirlenmesi",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 6,
          },
        ],
      },
      {
        slug: "16-valvematic-132-hp-benzin-manuel-multidrive-s",
        name: "1.6 Valvematic 132 HP",
        fuelType: "Benzin",
        transmission: "Manuel / Multidrive S",
        score: 96,
        chronicIssues: [
          {
            title: "Krank keçesi terlemesi",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 6,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 4,
    engines: [
      {
        slug: "10-tce-90-hp-benzin-manuel-x-tronic",
        name: "1.0 TCe 90 HP",
        fuelType: "Benzin",
        transmission: "Manuel / X-Tronic",
        score: 85,
        chronicIssues: [
          {
            title: "Erken debriyaj aşınması",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
          {
            title: "Turbo valfi sesi",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 6,
          },
        ],
      },
      {
        slug: "15-dci-110-hp-dizel-manuel-edc",
        name: "1.5 dCi 110 HP",
        fuelType: "Dizel",
        transmission: "Manuel / EDC",
        score: 92,
        chronicIssues: [
          {
            title: "EGR valfi tıkanıklığı",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
          {
            title: "Partikül filtresi dolumu",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 6,
          },
        ],
      },
      {
        slug: "13-tce-140-hp-benzin-edc",
        name: "1.3 TCe 140 HP",
        fuelType: "Benzin",
        transmission: "EDC",
        score: 88,
        chronicIssues: [
          {
            title: "Kavrama ısınması (Şehir içi)",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
          {
            title: "Yağ eksiltme",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
        ],
      },
      {
        slug: "16-e-tech-140-hp-hibrit-otomatik",
        name: "1.6 E-Tech 140 HP",
        fuelType: "Hibrit",
        transmission: "Otomatik",
        score: 90,
        chronicIssues: [
          {
            title: "Yazılım güncellemeleri gereksinimi",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
          {
            title: "Vites geçişlerinde kararsızlık",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 9,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 5,
    engines: [
      {
        slug: "15-vtec-turbo-182-hp-benzin-cvt",
        name: "1.5 VTEC Turbo 182 HP",
        fuelType: "Benzin",
        transmission: "CVT",
        score: 94,
        chronicIssues: [
          {
            title: "Yağa benzin karışması (Bazı seriler)",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
          {
            title: "Direksiyon kutusu tıkırtısı",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 6,
          },
        ],
      },
      {
        slug: "16-i-dtec-120-hp-dizel-otomatik",
        name: "1.6 i-DTEC 120 HP",
        fuelType: "Dizel",
        transmission: "Otomatik",
        score: 93,
        chronicIssues: [
          {
            title: "DPF dolumu",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
          {
            title: "Şanzıman yağı değişim hassasiyeti",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 6,
          },
        ],
      },
      {
        slug: "15-ehev-hibrit-hibrit-e-cvt",
        name: "1.5 e:HEV Hibrit",
        fuelType: "Hibrit",
        transmission: "e-CVT",
        score: 95,
        chronicIssues: [
          {
            title: "Akü ömrü kısallığı",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
          {
            title: "Kış aylarında düşük yakıt verimliliği",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 6,
    engines: [
      {
        slug: "10-tsi-110-hp-benzin-dsg",
        name: "1.0 TSI 110 HP",
        fuelType: "Benzin",
        transmission: "DSG",
        score: 88,
        chronicIssues: [
          {
            title: "Kavrama titremesi (DSG)",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 9,
          },
          {
            title: "Mekatronik arızası",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
        ],
      },
      {
        slug: "15-tsi-150-hp-benzin-dsg",
        name: "1.5 TSI 150 HP",
        fuelType: "Benzin",
        transmission: "DSG",
        score: 89,
        chronicIssues: [
          {
            title: "Soğuk marşta titreme",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 9,
          },
          {
            title: "DSG mekatronik basınç tüpü",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
        ],
      },
      {
        slug: "16-tdi-120-hp-dizel-dsg",
        name: "1.6 TDI 120 HP",
        fuelType: "Dizel",
        transmission: "DSG",
        score: 85,
        chronicIssues: [
          {
            title: "EGR valfi arızası",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
          {
            title: "Su pompası sızıntısı",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
          {
            title: "Enjektör arızası",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
        ],
      },
      {
        slug: "20-tdi-150-hp-dizel-dsg",
        name: "2.0 TDI 150 HP",
        fuelType: "Dizel",
        transmission: "DSG",
        score: 91,
        chronicIssues: [
          {
            title: "DPF dolumu",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
          {
            title: "AdBlue sistemi sorunları",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 7,
    engines: [
      {
        slug: "10-tce-90-hp-benzin-manuel-x-tronic",
        name: "1.0 TCe 90 HP",
        fuelType: "Benzin",
        transmission: "Manuel / X-Tronic",
        score: 85,
        chronicIssues: [
          {
            title: "Erken debriyaj aşınması",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
          {
            title: "Turbo valfi sesi",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
        ],
      },
      {
        slug: "15-dci-110-hp-dizel-manuel-edc",
        name: "1.5 dCi 110 HP",
        fuelType: "Dizel",
        transmission: "Manuel / EDC",
        score: 92,
        chronicIssues: [
          {
            title: "EGR valfi tıkanıklığı",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
          {
            title: "Partikül filtresi dolumu",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
        ],
      },
      {
        slug: "13-tce-140-hp-benzin-edc",
        name: "1.3 TCe 140 HP",
        fuelType: "Benzin",
        transmission: "EDC",
        score: 88,
        chronicIssues: [
          {
            title: "Kavrama ısınması (Şehir içi)",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
          {
            title: "Yağ eksiltme",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
        ],
      },
      {
        slug: "16-e-tech-140-hp-hibrit-otomatik",
        name: "1.6 E-Tech 140 HP",
        fuelType: "Hibrit",
        transmission: "Otomatik",
        score: 90,
        chronicIssues: [
          {
            title: "Yazılım güncellemeleri gereksinimi",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
          {
            title: "Vites geçişlerinde kararsızlık",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 8,
    engines: [
      {
        slug: "14-mpi-100-hp-benzin-manuel-otomatik",
        name: "1.4 MPI 100 HP",
        fuelType: "Benzin",
        transmission: "Manuel / Otomatik",
        score: 93,
        chronicIssues: [
          {
            title: "Katalitik konvertör hassasiyeti",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
          {
            title: "Performans eksikliği",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
        ],
      },
      {
        slug: "10-t-gdi-100-hp-benzin-dct",
        name: "1.0 T-GDI 100 HP",
        fuelType: "Benzin",
        transmission: "DCT",
        score: 86,
        chronicIssues: [
          {
            title: "Kuru tip DCT kavrama titremesi",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
          {
            title: "Turbo selenoid valfi",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 6,
          },
        ],
      },
      {
        slug: "14-crdi-90-hp-dizel-manuel",
        name: "1.4 CRDi 90 HP",
        fuelType: "Dizel",
        transmission: "Manuel",
        score: 92,
        chronicIssues: [
          {
            title: "DPF rejenerasyon sıklığı",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 6,
          },
          {
            title: "Enjektör kirlenmesi",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 6,
          },
        ],
      },
      {
        slug: "16-t-gdi-177-hp-benzin-dct",
        name: "1.6 T-GDI 177 HP",
        fuelType: "Benzin",
        transmission: "DCT",
        score: 84,
        chronicIssues: [
          {
            title: "Şanzıman aşırı ısınma uyarısı",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 6,
          },
          {
            title: "Kavrama ömrü",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 901,
    engines: [
      {
        slug: "12-puretech-130-hp-benzin-eat8",
        name: "1.2 PureTech 130 HP",
        fuelType: "Benzin",
        transmission: "EAT8",
        score: 80,
        chronicIssues: [
          {
            title: "Triger kayışı parçalanması",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
          {
            title: "Yüksek yağ tüketimi",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 6,
          },
          {
            title: "Vakum pompası tıkanması",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
        ],
      },
      {
        slug: "15-bluehdi-130-hp-dizel-eat8",
        name: "1.5 BlueHDi 130 HP",
        fuelType: "Dizel",
        transmission: "EAT8",
        score: 82,
        chronicIssues: [
          {
            title: "AdBlue deposu arızası",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 6,
          },
          {
            title: "EGR valfi tıkanması",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
          {
            title: "AdBlue pompası",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 902,
    engines: [
      {
        slug: "12-puretech-130-hp-benzin-eat8",
        name: "1.2 PureTech 130 HP",
        fuelType: "Benzin",
        transmission: "EAT8",
        score: 80,
        chronicIssues: [
          {
            title: "Triger kayışı parçalanması",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 9,
          },
          {
            title: "Yüksek yağ tüketimi",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 9,
          },
          {
            title: "Vakum pompası tıkanması",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 6,
          },
        ],
      },
      {
        slug: "15-bluehdi-130-hp-dizel-eat8",
        name: "1.5 BlueHDi 130 HP",
        fuelType: "Dizel",
        transmission: "EAT8",
        score: 82,
        chronicIssues: [
          {
            title: "AdBlue deposu arızası",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
          {
            title: "EGR valfi tıkanması",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
          {
            title: "AdBlue pompası",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 9,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 10,
    engines: [
      {
        slug: "12-puretech-130-hp-benzin-eat8",
        name: "1.2 PureTech 130 HP",
        fuelType: "Benzin",
        transmission: "EAT8",
        score: 80,
        chronicIssues: [
          {
            title: "Triger kayışı parçalanması",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 9,
          },
          {
            title: "Yüksek yağ tüketimi",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
          {
            title: "Vakum pompası tıkanması",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 9,
          },
        ],
      },
      {
        slug: "15-bluehdi-130-hp-dizel-eat8",
        name: "1.5 BlueHDi 130 HP",
        fuelType: "Dizel",
        transmission: "EAT8",
        score: 82,
        chronicIssues: [
          {
            title: "AdBlue deposu arızası",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 9,
          },
          {
            title: "EGR valfi tıkanması",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 9,
          },
          {
            title: "AdBlue pompası",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 11,
    engines: [
      {
        slug: "v1-standart-menzil-elektrik-tek-vites",
        name: "V1 Standart Menzil",
        fuelType: "Elektrik",
        transmission: "Tek Vites",
        score: 87,
        chronicIssues: [
          {
            title: "Ekran arayüzü donmaları",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 9,
          },
          {
            title: "Mobil uygulama senkronizasyonu",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
          {
            title: "Şarj istasyonu tanıma hataları",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
        ],
      },
      {
        slug: "v2-uzun-menzil-elektrik-tek-vites",
        name: "V2 Uzun Menzil",
        fuelType: "Elektrik",
        transmission: "Tek Vites",
        score: 88,
        chronicIssues: [
          {
            title: "Yazılımsal hatalar",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 9,
          },
          {
            title: "Kamera sensör buğulanması",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 6,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 12,
    engines: [
      {
        slug: "16-tgdi-183-hp-benzin-7-dct",
        name: "1.6 TGDI 183 HP",
        fuelType: "Benzin",
        transmission: "7-DCT",
        score: 82,
        chronicIssues: [
          {
            title: "Şanzıman kararsızlığı",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 6,
          },
          {
            title: "Yüksek yakıt tüketimi",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
          {
            title: "Yazılım hataları",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 9,
          },
        ],
      },
      {
        slug: "phev-hibrit-hibrit-dht",
        name: "PHEV Hibrit",
        fuelType: "Hibrit",
        transmission: "DHT",
        score: 85,
        chronicIssues: [
          {
            title: "Batarya menzil tutarsızlığı",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
          {
            title: "Şarj uyumluluğu",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 9,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 13,
    engines: [
      {
        slug: "10-tsi-110-hp-benzin-dsg",
        name: "1.0 TSI 110 HP",
        fuelType: "Benzin",
        transmission: "DSG",
        score: 88,
        chronicIssues: [
          {
            title: "Kavrama titremesi (DSG)",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 6,
          },
          {
            title: "Mekatronik arızası",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 9,
          },
        ],
      },
      {
        slug: "15-tsi-150-hp-benzin-dsg",
        name: "1.5 TSI 150 HP",
        fuelType: "Benzin",
        transmission: "DSG",
        score: 89,
        chronicIssues: [
          {
            title: "Soğuk marşta titreme",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 6,
          },
          {
            title: "DSG mekatronik basınç tüpü",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 9,
          },
        ],
      },
      {
        slug: "16-tdi-120-hp-dizel-dsg",
        name: "1.6 TDI 120 HP",
        fuelType: "Dizel",
        transmission: "DSG",
        score: 85,
        chronicIssues: [
          {
            title: "EGR valfi arızası",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 6,
          },
          {
            title: "Su pompası sızıntısı",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
          {
            title: "Enjektör arızası",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
        ],
      },
      {
        slug: "20-tdi-150-hp-dizel-dsg",
        name: "2.0 TDI 150 HP",
        fuelType: "Dizel",
        transmission: "DSG",
        score: 91,
        chronicIssues: [
          {
            title: "DPF dolumu",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
          {
            title: "AdBlue sistemi sorunları",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 6,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 14,
    engines: [
      {
        slug: "14-benzinli-benzin-otomatik",
        name: "1.4 Benzinli",
        fuelType: "Benzin",
        transmission: "Otomatik",
        score: 85,
        chronicIssues: [
          {
            title: "Yakıt pompası",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
          {
            title: "Ateşleme bobini",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 6,
          },
        ],
      },
      {
        slug: "16-dizel-dizel-manuel",
        name: "1.6 Dizel",
        fuelType: "Dizel",
        transmission: "Manuel",
        score: 88,
        chronicIssues: [
          {
            title: "DPF rejenerasyonu",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 6,
          },
          {
            title: "Enjektörler",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 9,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 15,
    engines: [
      {
        slug: "14-benzinli-benzin-otomatik",
        name: "1.4 Benzinli",
        fuelType: "Benzin",
        transmission: "Otomatik",
        score: 85,
        chronicIssues: [
          {
            title: "Yakıt pompası",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
          {
            title: "Ateşleme bobini",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
        ],
      },
      {
        slug: "16-dizel-dizel-manuel",
        name: "1.6 Dizel",
        fuelType: "Dizel",
        transmission: "Manuel",
        score: 88,
        chronicIssues: [
          {
            title: "DPF rejenerasyonu",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
          {
            title: "Enjektörler",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 6,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 16,
    engines: [
      {
        slug: "14-benzinli-benzin-otomatik",
        name: "1.4 Benzinli",
        fuelType: "Benzin",
        transmission: "Otomatik",
        score: 85,
        chronicIssues: [
          {
            title: "Yakıt pompası",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
          {
            title: "Ateşleme bobini",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
        ],
      },
      {
        slug: "16-dizel-dizel-manuel",
        name: "1.6 Dizel",
        fuelType: "Dizel",
        transmission: "Manuel",
        score: 88,
        chronicIssues: [
          {
            title: "DPF rejenerasyonu",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
          {
            title: "Enjektörler",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 9,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 17,
    engines: [
      {
        slug: "16-tgdi-183-hp-benzin-7-dct",
        name: "1.6 TGDI 183 HP",
        fuelType: "Benzin",
        transmission: "7-DCT",
        score: 82,
        chronicIssues: [
          {
            title: "Şanzıman kararsızlığı",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 9,
          },
          {
            title: "Yüksek yakıt tüketimi",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
          {
            title: "Yazılım hataları",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 9,
          },
        ],
      },
      {
        slug: "phev-hibrit-hibrit-dht",
        name: "PHEV Hibrit",
        fuelType: "Hibrit",
        transmission: "DHT",
        score: 85,
        chronicIssues: [
          {
            title: "Batarya menzil tutarsızlığı",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
          {
            title: "Şarj uyumluluğu",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 18,
    engines: [
      {
        slug: "14-benzinli-benzin-otomatik",
        name: "1.4 Benzinli",
        fuelType: "Benzin",
        transmission: "Otomatik",
        score: 85,
        chronicIssues: [
          {
            title: "Yakıt pompası",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
          {
            title: "Ateşleme bobini",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
        ],
      },
      {
        slug: "16-dizel-dizel-manuel",
        name: "1.6 Dizel",
        fuelType: "Dizel",
        transmission: "Manuel",
        score: 88,
        chronicIssues: [
          {
            title: "DPF rejenerasyonu",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 6,
          },
          {
            title: "Enjektörler",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 19,
    engines: [
      {
        slug: "14-mpi-100-hp-benzin-manuel-otomatik",
        name: "1.4 MPI 100 HP",
        fuelType: "Benzin",
        transmission: "Manuel / Otomatik",
        score: 93,
        chronicIssues: [
          {
            title: "Katalitik konvertör hassasiyeti",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
          {
            title: "Performans eksikliği",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 9,
          },
        ],
      },
      {
        slug: "10-t-gdi-100-hp-benzin-dct",
        name: "1.0 T-GDI 100 HP",
        fuelType: "Benzin",
        transmission: "DCT",
        score: 86,
        chronicIssues: [
          {
            title: "Kuru tip DCT kavrama titremesi",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 6,
          },
          {
            title: "Turbo selenoid valfi",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 9,
          },
        ],
      },
      {
        slug: "14-crdi-90-hp-dizel-manuel",
        name: "1.4 CRDi 90 HP",
        fuelType: "Dizel",
        transmission: "Manuel",
        score: 92,
        chronicIssues: [
          {
            title: "DPF rejenerasyon sıklığı",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 9,
          },
          {
            title: "Enjektör kirlenmesi",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
        ],
      },
      {
        slug: "16-t-gdi-177-hp-benzin-dct",
        name: "1.6 T-GDI 177 HP",
        fuelType: "Benzin",
        transmission: "DCT",
        score: 84,
        chronicIssues: [
          {
            title: "Şanzıman aşırı ısınma uyarısı",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 6,
          },
          {
            title: "Kavrama ömrü",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 20,
    engines: [
      {
        slug: "14-mpi-100-hp-benzin-manuel-otomatik",
        name: "1.4 MPI 100 HP",
        fuelType: "Benzin",
        transmission: "Manuel / Otomatik",
        score: 93,
        chronicIssues: [
          {
            title: "Katalitik konvertör hassasiyeti",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 6,
          },
          {
            title: "Performans eksikliği",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
        ],
      },
      {
        slug: "10-t-gdi-100-hp-benzin-dct",
        name: "1.0 T-GDI 100 HP",
        fuelType: "Benzin",
        transmission: "DCT",
        score: 86,
        chronicIssues: [
          {
            title: "Kuru tip DCT kavrama titremesi",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
          {
            title: "Turbo selenoid valfi",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
        ],
      },
      {
        slug: "14-crdi-90-hp-dizel-manuel",
        name: "1.4 CRDi 90 HP",
        fuelType: "Dizel",
        transmission: "Manuel",
        score: 92,
        chronicIssues: [
          {
            title: "DPF rejenerasyon sıklığı",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
          {
            title: "Enjektör kirlenmesi",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 9,
          },
        ],
      },
      {
        slug: "16-t-gdi-177-hp-benzin-dct",
        name: "1.6 T-GDI 177 HP",
        fuelType: "Benzin",
        transmission: "DCT",
        score: 84,
        chronicIssues: [
          {
            title: "Şanzıman aşırı ısınma uyarısı",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 6,
          },
          {
            title: "Kavrama ömrü",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 21,
    engines: [
      {
        slug: "12-puretech-130-hp-benzin-eat8",
        name: "1.2 PureTech 130 HP",
        fuelType: "Benzin",
        transmission: "EAT8",
        score: 80,
        chronicIssues: [
          {
            title: "Triger kayışı parçalanması",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 9,
          },
          {
            title: "Yüksek yağ tüketimi",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 9,
          },
          {
            title: "Vakum pompası tıkanması",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
        ],
      },
      {
        slug: "15-bluehdi-130-hp-dizel-eat8",
        name: "1.5 BlueHDi 130 HP",
        fuelType: "Dizel",
        transmission: "EAT8",
        score: 82,
        chronicIssues: [
          {
            title: "AdBlue deposu arızası",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
          {
            title: "EGR valfi tıkanması",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
          {
            title: "AdBlue pompası",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 22,
    engines: [
      {
        slug: "12-puretech-130-hp-benzin-eat8",
        name: "1.2 PureTech 130 HP",
        fuelType: "Benzin",
        transmission: "EAT8",
        score: 80,
        chronicIssues: [
          {
            title: "Triger kayışı parçalanması",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
          {
            title: "Yüksek yağ tüketimi",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
          {
            title: "Vakum pompası tıkanması",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 9,
          },
        ],
      },
      {
        slug: "15-bluehdi-130-hp-dizel-eat8",
        name: "1.5 BlueHDi 130 HP",
        fuelType: "Dizel",
        transmission: "EAT8",
        score: 82,
        chronicIssues: [
          {
            title: "AdBlue deposu arızası",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
          {
            title: "EGR valfi tıkanması",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 6,
          },
          {
            title: "AdBlue pompası",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 23,
    engines: [
      {
        slug: "15-vtec-turbo-182-hp-benzin-cvt",
        name: "1.5 VTEC Turbo 182 HP",
        fuelType: "Benzin",
        transmission: "CVT",
        score: 94,
        chronicIssues: [
          {
            title: "Yağa benzin karışması (Bazı seriler)",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
          {
            title: "Direksiyon kutusu tıkırtısı",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
        ],
      },
      {
        slug: "16-i-dtec-120-hp-dizel-otomatik",
        name: "1.6 i-DTEC 120 HP",
        fuelType: "Dizel",
        transmission: "Otomatik",
        score: 93,
        chronicIssues: [
          {
            title: "DPF dolumu",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
          {
            title: "Şanzıman yağı değişim hassasiyeti",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
        ],
      },
      {
        slug: "15-ehev-hibrit-hibrit-e-cvt",
        name: "1.5 e:HEV Hibrit",
        fuelType: "Hibrit",
        transmission: "e-CVT",
        score: 95,
        chronicIssues: [
          {
            title: "Akü ömrü kısallığı",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 6,
          },
          {
            title: "Kış aylarında düşük yakıt verimliliği",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 24,
    engines: [
      {
        slug: "10-tsi-110-hp-benzin-dsg",
        name: "1.0 TSI 110 HP",
        fuelType: "Benzin",
        transmission: "DSG",
        score: 88,
        chronicIssues: [
          {
            title: "Kavrama titremesi (DSG)",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 6,
          },
          {
            title: "Mekatronik arızası",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
        ],
      },
      {
        slug: "15-tsi-150-hp-benzin-dsg",
        name: "1.5 TSI 150 HP",
        fuelType: "Benzin",
        transmission: "DSG",
        score: 89,
        chronicIssues: [
          {
            title: "Soğuk marşta titreme",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
          {
            title: "DSG mekatronik basınç tüpü",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 6,
          },
        ],
      },
      {
        slug: "16-tdi-120-hp-dizel-dsg",
        name: "1.6 TDI 120 HP",
        fuelType: "Dizel",
        transmission: "DSG",
        score: 85,
        chronicIssues: [
          {
            title: "EGR valfi arızası",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
          {
            title: "Su pompası sızıntısı",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
          {
            title: "Enjektör arızası",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 6,
          },
        ],
      },
      {
        slug: "20-tdi-150-hp-dizel-dsg",
        name: "2.0 TDI 150 HP",
        fuelType: "Dizel",
        transmission: "DSG",
        score: 91,
        chronicIssues: [
          {
            title: "DPF dolumu",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 9,
          },
          {
            title: "AdBlue sistemi sorunları",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 25,
    engines: [
      {
        slug: "12-puretech-130-hp-benzin-eat8",
        name: "1.2 PureTech 130 HP",
        fuelType: "Benzin",
        transmission: "EAT8",
        score: 80,
        chronicIssues: [
          {
            title: "Triger kayışı parçalanması",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 9,
          },
          {
            title: "Yüksek yağ tüketimi",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
          {
            title: "Vakum pompası tıkanması",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
        ],
      },
      {
        slug: "15-bluehdi-130-hp-dizel-eat8",
        name: "1.5 BlueHDi 130 HP",
        fuelType: "Dizel",
        transmission: "EAT8",
        score: 82,
        chronicIssues: [
          {
            title: "AdBlue deposu arızası",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
          {
            title: "EGR valfi tıkanması",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
          {
            title: "AdBlue pompası",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 6,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 26,
    engines: [
      {
        slug: "10-tsi-110-hp-benzin-dsg",
        name: "1.0 TSI 110 HP",
        fuelType: "Benzin",
        transmission: "DSG",
        score: 88,
        chronicIssues: [
          {
            title: "Kavrama titremesi (DSG)",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
          {
            title: "Mekatronik arızası",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
        ],
      },
      {
        slug: "15-tsi-150-hp-benzin-dsg",
        name: "1.5 TSI 150 HP",
        fuelType: "Benzin",
        transmission: "DSG",
        score: 89,
        chronicIssues: [
          {
            title: "Soğuk marşta titreme",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 9,
          },
          {
            title: "DSG mekatronik basınç tüpü",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
        ],
      },
      {
        slug: "16-tdi-120-hp-dizel-dsg",
        name: "1.6 TDI 120 HP",
        fuelType: "Dizel",
        transmission: "DSG",
        score: 85,
        chronicIssues: [
          {
            title: "EGR valfi arızası",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 9,
          },
          {
            title: "Su pompası sızıntısı",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
          {
            title: "Enjektör arızası",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
        ],
      },
      {
        slug: "20-tdi-150-hp-dizel-dsg",
        name: "2.0 TDI 150 HP",
        fuelType: "Dizel",
        transmission: "DSG",
        score: 91,
        chronicIssues: [
          {
            title: "DPF dolumu",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 6,
          },
          {
            title: "AdBlue sistemi sorunları",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 9,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 27,
    engines: [
      {
        slug: "10-tsi-110-hp-benzin-dsg",
        name: "1.0 TSI 110 HP",
        fuelType: "Benzin",
        transmission: "DSG",
        score: 88,
        chronicIssues: [
          {
            title: "Kavrama titremesi (DSG)",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
          {
            title: "Mekatronik arızası",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 6,
          },
        ],
      },
      {
        slug: "15-tsi-150-hp-benzin-dsg",
        name: "1.5 TSI 150 HP",
        fuelType: "Benzin",
        transmission: "DSG",
        score: 89,
        chronicIssues: [
          {
            title: "Soğuk marşta titreme",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 9,
          },
          {
            title: "DSG mekatronik basınç tüpü",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
        ],
      },
      {
        slug: "16-tdi-120-hp-dizel-dsg",
        name: "1.6 TDI 120 HP",
        fuelType: "Dizel",
        transmission: "DSG",
        score: 85,
        chronicIssues: [
          {
            title: "EGR valfi arızası",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 9,
          },
          {
            title: "Su pompası sızıntısı",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 6,
          },
          {
            title: "Enjektör arızası",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 9,
          },
        ],
      },
      {
        slug: "20-tdi-150-hp-dizel-dsg",
        name: "2.0 TDI 150 HP",
        fuelType: "Dizel",
        transmission: "DSG",
        score: 91,
        chronicIssues: [
          {
            title: "DPF dolumu",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 9,
          },
          {
            title: "AdBlue sistemi sorunları",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 28,
    engines: [
      {
        slug: "16-tgdi-183-hp-benzin-7-dct",
        name: "1.6 TGDI 183 HP",
        fuelType: "Benzin",
        transmission: "7-DCT",
        score: 82,
        chronicIssues: [
          {
            title: "Şanzıman kararsızlığı",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
          {
            title: "Yüksek yakıt tüketimi",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 6,
          },
          {
            title: "Yazılım hataları",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 6,
          },
        ],
      },
      {
        slug: "phev-hibrit-hibrit-dht",
        name: "PHEV Hibrit",
        fuelType: "Hibrit",
        transmission: "DHT",
        score: 85,
        chronicIssues: [
          {
            title: "Batarya menzil tutarsızlığı",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
          {
            title: "Şarj uyumluluğu",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 29,
    engines: [
      {
        slug: "10-tsi-110-hp-benzin-dsg",
        name: "1.0 TSI 110 HP",
        fuelType: "Benzin",
        transmission: "DSG",
        score: 88,
        chronicIssues: [
          {
            title: "Kavrama titremesi (DSG)",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 6,
          },
          {
            title: "Mekatronik arızası",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 9,
          },
        ],
      },
      {
        slug: "15-tsi-150-hp-benzin-dsg",
        name: "1.5 TSI 150 HP",
        fuelType: "Benzin",
        transmission: "DSG",
        score: 89,
        chronicIssues: [
          {
            title: "Soğuk marşta titreme",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
          {
            title: "DSG mekatronik basınç tüpü",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 6,
          },
        ],
      },
      {
        slug: "16-tdi-120-hp-dizel-dsg",
        name: "1.6 TDI 120 HP",
        fuelType: "Dizel",
        transmission: "DSG",
        score: 85,
        chronicIssues: [
          {
            title: "EGR valfi arızası",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 6,
          },
          {
            title: "Su pompası sızıntısı",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
          {
            title: "Enjektör arızası",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 6,
          },
        ],
      },
      {
        slug: "20-tdi-150-hp-dizel-dsg",
        name: "2.0 TDI 150 HP",
        fuelType: "Dizel",
        transmission: "DSG",
        score: 91,
        chronicIssues: [
          {
            title: "DPF dolumu",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 9,
          },
          {
            title: "AdBlue sistemi sorunları",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 6,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 30,
    engines: [
      {
        slug: "rwd-elektrik-tek-vites",
        name: "RWD",
        fuelType: "Elektrik",
        transmission: "Tek Vites",
        score: 92,
        chronicIssues: [
          {
            title: "Boya kalitesi problemleri",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
          {
            title: "Ekran donmaları",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
          {
            title: "Süspansiyon burçları",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
        ],
      },
      {
        slug: "long-range-dual-motor-elektrik-tek-vites",
        name: "Long Range Dual Motor",
        fuelType: "Elektrik",
        transmission: "Tek Vites",
        score: 90,
        chronicIssues: [
          {
            title: "Şarj kapağı sensörü",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
          {
            title: "Isı pompası arızası (Soğuk havada)",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
        ],
      },
      {
        slug: "performance-elektrik-tek-vites",
        name: "Performance",
        fuelType: "Elektrik",
        transmission: "Tek Vites",
        score: 88,
        chronicIssues: [
          {
            title: "Lastik aşınması",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
          {
            title: "Fren diski eğrilmesi",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 31,
    engines: [
      {
        slug: "14-mpi-100-hp-benzin-manuel-otomatik",
        name: "1.4 MPI 100 HP",
        fuelType: "Benzin",
        transmission: "Manuel / Otomatik",
        score: 93,
        chronicIssues: [
          {
            title: "Katalitik konvertör hassasiyeti",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
          {
            title: "Performans eksikliği",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
        ],
      },
      {
        slug: "10-t-gdi-100-hp-benzin-dct",
        name: "1.0 T-GDI 100 HP",
        fuelType: "Benzin",
        transmission: "DCT",
        score: 86,
        chronicIssues: [
          {
            title: "Kuru tip DCT kavrama titremesi",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 6,
          },
          {
            title: "Turbo selenoid valfi",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 6,
          },
        ],
      },
      {
        slug: "14-crdi-90-hp-dizel-manuel",
        name: "1.4 CRDi 90 HP",
        fuelType: "Dizel",
        transmission: "Manuel",
        score: 92,
        chronicIssues: [
          {
            title: "DPF rejenerasyon sıklığı",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 9,
          },
          {
            title: "Enjektör kirlenmesi",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 6,
          },
        ],
      },
      {
        slug: "16-t-gdi-177-hp-benzin-dct",
        name: "1.6 T-GDI 177 HP",
        fuelType: "Benzin",
        transmission: "DCT",
        score: 84,
        chronicIssues: [
          {
            title: "Şanzıman aşırı ısınma uyarısı",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
          {
            title: "Kavrama ömrü",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 32,
    engines: [
      {
        slug: "14-mpi-100-hp-benzin-manuel-otomatik",
        name: "1.4 MPI 100 HP",
        fuelType: "Benzin",
        transmission: "Manuel / Otomatik",
        score: 93,
        chronicIssues: [
          {
            title: "Katalitik konvertör hassasiyeti",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
          {
            title: "Performans eksikliği",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 6,
          },
        ],
      },
      {
        slug: "10-t-gdi-100-hp-benzin-dct",
        name: "1.0 T-GDI 100 HP",
        fuelType: "Benzin",
        transmission: "DCT",
        score: 86,
        chronicIssues: [
          {
            title: "Kuru tip DCT kavrama titremesi",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
          {
            title: "Turbo selenoid valfi",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
        ],
      },
      {
        slug: "14-crdi-90-hp-dizel-manuel",
        name: "1.4 CRDi 90 HP",
        fuelType: "Dizel",
        transmission: "Manuel",
        score: 92,
        chronicIssues: [
          {
            title: "DPF rejenerasyon sıklığı",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 9,
          },
          {
            title: "Enjektör kirlenmesi",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
        ],
      },
      {
        slug: "16-t-gdi-177-hp-benzin-dct",
        name: "1.6 T-GDI 177 HP",
        fuelType: "Benzin",
        transmission: "DCT",
        score: 84,
        chronicIssues: [
          {
            title: "Şanzıman aşırı ısınma uyarısı",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 6,
          },
          {
            title: "Kavrama ömrü",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 6,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 33,
    engines: [
      {
        slug: "10-tsi-110-hp-benzin-dsg",
        name: "1.0 TSI 110 HP",
        fuelType: "Benzin",
        transmission: "DSG",
        score: 88,
        chronicIssues: [
          {
            title: "Kavrama titremesi (DSG)",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
          {
            title: "Mekatronik arızası",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
        ],
      },
      {
        slug: "15-tsi-150-hp-benzin-dsg",
        name: "1.5 TSI 150 HP",
        fuelType: "Benzin",
        transmission: "DSG",
        score: 89,
        chronicIssues: [
          {
            title: "Soğuk marşta titreme",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 9,
          },
          {
            title: "DSG mekatronik basınç tüpü",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 9,
          },
        ],
      },
      {
        slug: "16-tdi-120-hp-dizel-dsg",
        name: "1.6 TDI 120 HP",
        fuelType: "Dizel",
        transmission: "DSG",
        score: 85,
        chronicIssues: [
          {
            title: "EGR valfi arızası",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
          {
            title: "Su pompası sızıntısı",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
          {
            title: "Enjektör arızası",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
        ],
      },
      {
        slug: "20-tdi-150-hp-dizel-dsg",
        name: "2.0 TDI 150 HP",
        fuelType: "Dizel",
        transmission: "DSG",
        score: 91,
        chronicIssues: [
          {
            title: "DPF dolumu",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 9,
          },
          {
            title: "AdBlue sistemi sorunları",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 34,
    engines: [
      {
        slug: "10-tce-90-hp-benzin-manuel-x-tronic",
        name: "1.0 TCe 90 HP",
        fuelType: "Benzin",
        transmission: "Manuel / X-Tronic",
        score: 85,
        chronicIssues: [
          {
            title: "Erken debriyaj aşınması",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
          {
            title: "Turbo valfi sesi",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 6,
          },
        ],
      },
      {
        slug: "15-dci-110-hp-dizel-manuel-edc",
        name: "1.5 dCi 110 HP",
        fuelType: "Dizel",
        transmission: "Manuel / EDC",
        score: 92,
        chronicIssues: [
          {
            title: "EGR valfi tıkanıklığı",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
          {
            title: "Partikül filtresi dolumu",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
        ],
      },
      {
        slug: "13-tce-140-hp-benzin-edc",
        name: "1.3 TCe 140 HP",
        fuelType: "Benzin",
        transmission: "EDC",
        score: 88,
        chronicIssues: [
          {
            title: "Kavrama ısınması (Şehir içi)",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 6,
          },
          {
            title: "Yağ eksiltme",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
        ],
      },
      {
        slug: "16-e-tech-140-hp-hibrit-otomatik",
        name: "1.6 E-Tech 140 HP",
        fuelType: "Hibrit",
        transmission: "Otomatik",
        score: 90,
        chronicIssues: [
          {
            title: "Yazılım güncellemeleri gereksinimi",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
          {
            title: "Vites geçişlerinde kararsızlık",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 6,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 101,
    engines: [
      {
        slug: "1-6-karb-rat-rl-80-hp",
        name: "1.6 Karbüratörlü 80 HP",
        fuelType: "LPG",
        transmission: "Manuel",
        score: 65,
        chronicIssues: [
          {
            title: "Karbüratör Ayarsızlığı",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
          {
            title: "Yağ Yakma ve Üfleme",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
        ],
      },
      {
        slug: "1-4-i-e-71-hp",
        name: "1.4 i.e. 71 HP",
        fuelType: "LPG",
        transmission: "Manuel",
        score: 68,
        chronicIssues: [
          {
            title: "Rölanti Motoru Arızası",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
        ],
      },
      {
        slug: "1-6-i-e-96-hp",
        name: "1.6 i.e. 96 HP",
        fuelType: "LPG",
        transmission: "Manuel",
        score: 70,
        chronicIssues: [
          {
            title: "Rölanti Dalgalanması",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 102,
    engines: [
      {
        slug: "1-4-fire-95-hp",
        name: "1.4 Fire 95 HP",
        fuelType: "Benzin",
        transmission: "Manuel",
        score: 90,
        chronicIssues: [
          {
            title: "Yüksek yağ tüketimi",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
          {
            title: "Performans eksikliği",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 9,
          },
        ],
      },
      {
        slug: "1-3-multijet-95-hp",
        name: "1.3 Multijet 95 HP",
        fuelType: "Dizel",
        transmission: "Manuel",
        score: 95,
        chronicIssues: [
          {
            title: "EGR tıkanması",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
          {
            title: "Baskı balata ömrü",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 103,
    engines: [
      {
        slug: "1-0-tce-90-hp",
        name: "1.0 TCe 90 HP",
        fuelType: "Benzin",
        transmission: "Manuel / X-Tronic",
        score: 85,
        chronicIssues: [
          {
            title: "Erken debriyaj aşınması",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
          {
            title: "Turbo valfi sesi",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
        ],
      },
      {
        slug: "1-5-dci-110-hp",
        name: "1.5 dCi 110 HP",
        fuelType: "Dizel",
        transmission: "Manuel / EDC",
        score: 92,
        chronicIssues: [
          {
            title: "EGR valfi tıkanıklığı",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
          {
            title: "Partikül filtresi dolumu",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 104,
    engines: [
      {
        slug: "1-4-mpi-100-hp",
        name: "1.4 MPI 100 HP",
        fuelType: "Benzin",
        transmission: "Manuel / Otomatik",
        score: 93,
        chronicIssues: [
          {
            title: "Katalitik konvertör hassasiyeti",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
        ],
      },
      {
        slug: "1-0-t-gdi-100-hp",
        name: "1.0 T-GDI 100 HP",
        fuelType: "Benzin",
        transmission: "DCT",
        score: 86,
        chronicIssues: [
          {
            title: "Kuru tip DCT kavrama titremesi",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 105,
    engines: [
      {
        slug: "1-5-vtec-turbo-182-hp",
        name: "1.5 VTEC Turbo 182 HP",
        fuelType: "Benzin",
        transmission: "CVT",
        score: 94,
        chronicIssues: [
          {
            title: "Direksiyon kutusu tıkırtısı",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 106,
    engines: [
      {
        slug: "1-4-fire-95-hp",
        name: "1.4 Fire 95 HP",
        fuelType: "Benzin",
        transmission: "Manuel",
        score: 90,
        chronicIssues: [
          {
            title: "Yüksek yağ tüketimi",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
          {
            title: "Performans eksikliği",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 6,
          },
        ],
      },
      {
        slug: "1-3-multijet-95-hp",
        name: "1.3 Multijet 95 HP",
        fuelType: "Dizel",
        transmission: "Manuel",
        score: 95,
        chronicIssues: [
          {
            title: "EGR tıkanması",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 6,
          },
          {
            title: "Baskı balata ömrü",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 107,
    engines: [
      {
        slug: "1-0-tce-90-hp",
        name: "1.0 TCe 90 HP",
        fuelType: "Benzin",
        transmission: "Manuel / X-Tronic",
        score: 85,
        chronicIssues: [
          {
            title: "Erken debriyaj aşınması",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
          {
            title: "Turbo valfi sesi",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
        ],
      },
      {
        slug: "1-5-dci-110-hp",
        name: "1.5 dCi 110 HP",
        fuelType: "Dizel",
        transmission: "Manuel / EDC",
        score: 92,
        chronicIssues: [
          {
            title: "EGR valfi tıkanıklığı",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 9,
          },
          {
            title: "Partikül filtresi dolumu",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 108,
    engines: [
      {
        slug: "1-4-benzinli",
        name: "1.4 Benzinli",
        fuelType: "Benzin",
        transmission: "Otomatik",
        score: 85,
        chronicIssues: [
          {
            title: "Ateşleme bobini",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
        ],
      },
      {
        slug: "1-6-dizel",
        name: "1.6 Dizel",
        fuelType: "Dizel",
        transmission: "Manuel",
        score: 88,
        chronicIssues: [
          {
            title: "DPF rejenerasyonu",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 9,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 109,
    engines: [
      {
        slug: "1-4-benzinli",
        name: "1.4 Benzinli",
        fuelType: "Benzin",
        transmission: "Otomatik",
        score: 85,
        chronicIssues: [
          {
            title: "Ateşleme bobini",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
        ],
      },
      {
        slug: "1-6-dizel",
        name: "1.6 Dizel",
        fuelType: "Dizel",
        transmission: "Manuel",
        score: 88,
        chronicIssues: [
          {
            title: "DPF rejenerasyonu",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 110,
    engines: [
      {
        slug: "1-0-tsi-110-hp",
        name: "1.0 TSI 110 HP",
        fuelType: "Benzin",
        transmission: "DSG",
        score: 88,
        chronicIssues: [
          {
            title: "DSG Kavrama",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
          {
            title: "Mekatronik",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
        ],
      },
      {
        slug: "1-5-tsi-150-hp",
        name: "1.5 TSI 150 HP",
        fuelType: "Benzin",
        transmission: "DSG",
        score: 89,
        chronicIssues: [
          {
            title: "DSG Kavrama",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 6,
          },
          {
            title: "ACT Sistem sarsıntısı",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 9,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 111,
    engines: [
      {
        slug: "1-0-tsi-110-hp",
        name: "1.0 TSI 110 HP",
        fuelType: "Benzin",
        transmission: "DSG",
        score: 88,
        chronicIssues: [
          {
            title: "Kavrama titremesi (DSG)",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
        ],
      },
      {
        slug: "1-5-tsi-150-hp",
        name: "1.5 TSI 150 HP",
        fuelType: "Benzin",
        transmission: "DSG",
        score: 89,
        chronicIssues: [
          {
            title: "Soğuk marşta titreme",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 112,
    engines: [
      {
        slug: "1-4-benzinli",
        name: "1.4 Benzinli",
        fuelType: "Benzin",
        transmission: "Otomatik",
        score: 85,
        chronicIssues: [
          {
            title: "Ateşleme bobini",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
        ],
      },
      {
        slug: "1-6-dizel",
        name: "1.6 Dizel",
        fuelType: "Dizel",
        transmission: "Manuel",
        score: 88,
        chronicIssues: [
          {
            title: "DPF rejenerasyonu",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 113,
    engines: [
      {
        slug: "1-2-dig-t-115-hp",
        name: "1.2 DIG-T 115 HP",
        fuelType: "Benzin",
        transmission: "X-Tronic",
        score: 78,
        chronicIssues: [
          {
            title: "Aşırı yağ eksiltme",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 9,
          },
          {
            title: "Motor revizyon ihtiyacı (Sekman kırma)",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 6,
          },
        ],
      },
      {
        slug: "1-5-dci-110-hp",
        name: "1.5 dCi 110 HP",
        fuelType: "Dizel",
        transmission: "Manuel",
        score: 90,
        chronicIssues: [
          {
            title: "Partikül filtresi tıkanması",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 114,
    engines: [
      {
        slug: "1-2-puretech-130-hp",
        name: "1.2 PureTech 130 HP",
        fuelType: "Benzin",
        transmission: "EAT8",
        score: 80,
        chronicIssues: [
          {
            title: "Triger kayışı parçalanması",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 9,
          },
          {
            title: "Yüksek yağ tüketimi",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 9,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 115,
    engines: [
      {
        slug: "1-5-dynamic-force-125-hp",
        name: "1.5 Dynamic Force 125 HP",
        fuelType: "Benzin",
        transmission: "Multidrive S",
        score: 94,
        chronicIssues: [
          {
            title: "CVT şanzıman ısınması",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
          {
            title: "Yüksek devirde ses",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
        ],
      },
      {
        slug: "1-8-hybrid-122-hp",
        name: "1.8 Hybrid 122 HP",
        fuelType: "Hibrit",
        transmission: "e-CVT",
        score: 98,
        chronicIssues: [
          {
            title: "Batarya kapasite düşüşü (Uzun vadede)",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 9,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 116,
    engines: [
      {
        slug: "1-6-karb-rat-rl-80-hp",
        name: "1.6 Karbüratörlü 80 HP",
        fuelType: "LPG",
        transmission: "Manuel",
        score: 64,
        chronicIssues: [
          {
            title: "Hararet (Ağır Yük)",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 9,
          },
        ],
      },
      {
        slug: "1-6-i-e-96-hp",
        name: "1.6 i.e. 96 HP",
        fuelType: "LPG",
        transmission: "Manuel",
        score: 69,
        chronicIssues: [
          {
            title: "Rölanti Dalgalanması",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 117,
    engines: [
      {
        slug: "1-3-karb-rat-rl-65-hp",
        name: "1.3 Karbüratörlü 65 HP",
        fuelType: "LPG",
        transmission: "Manuel",
        score: 60,
        chronicIssues: [
          {
            title: "Yağ Kaçakları",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 118,
    engines: [
      {
        slug: "1-5-vtec-turbo-182-hp",
        name: "1.5 VTEC Turbo 182 HP",
        fuelType: "Benzin",
        transmission: "CVT",
        score: 94,
        chronicIssues: [
          {
            title: "Direksiyon kutusu tıkırtısı",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 9,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 119,
    engines: [
      {
        slug: "1-5-vtec-turbo-182-hp",
        name: "1.5 VTEC Turbo 182 HP",
        fuelType: "Benzin",
        transmission: "CVT",
        score: 94,
        chronicIssues: [
          {
            title: "Direksiyon kutusu tıkırtısı",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 9,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 120,
    engines: [
      {
        slug: "1-0-tce-90-hp",
        name: "1.0 TCe 90 HP",
        fuelType: "Benzin",
        transmission: "Manuel / X-Tronic",
        score: 85,
        chronicIssues: [
          {
            title: "Erken debriyaj aşınması",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
          {
            title: "Turbo valfi sesi",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 6,
          },
        ],
      },
      {
        slug: "1-5-dci-110-hp",
        name: "1.5 dCi 110 HP",
        fuelType: "Dizel",
        transmission: "Manuel / EDC",
        score: 92,
        chronicIssues: [
          {
            title: "EGR valfi tıkanıklığı",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
          {
            title: "Partikül filtresi dolumu",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 9,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 121,
    engines: [
      {
        slug: "1-4-t-150-hp",
        name: "1.4 T 150 HP",
        fuelType: "Benzin",
        transmission: "Otomatik",
        score: 82,
        chronicIssues: [
          {
            title: "Sekman kırma",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
          {
            title: "Piston çatlatma",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
        ],
      },
      {
        slug: "1-6-cdti-136-hp",
        name: "1.6 CDTI 136 HP",
        fuelType: "Dizel",
        transmission: "Otomatik",
        score: 85,
        chronicIssues: [
          {
            title: "Zincir sesi",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 122,
    engines: [
      {
        slug: "1-0-tsi-110-hp",
        name: "1.0 TSI 110 HP",
        fuelType: "Benzin",
        transmission: "DSG",
        score: 88,
        chronicIssues: [
          {
            title: "Kavrama titremesi (DSG)",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 9,
          },
        ],
      },
      {
        slug: "1-5-tsi-150-hp",
        name: "1.5 TSI 150 HP",
        fuelType: "Benzin",
        transmission: "DSG",
        score: 89,
        chronicIssues: [
          {
            title: "Soğuk marşta titreme",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 6,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 123,
    engines: [
      {
        slug: "1-4-benzinli",
        name: "1.4 Benzinli",
        fuelType: "Benzin",
        transmission: "Otomatik",
        score: 85,
        chronicIssues: [
          {
            title: "Ateşleme bobini",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 6,
          },
        ],
      },
      {
        slug: "1-6-dizel",
        name: "1.6 Dizel",
        fuelType: "Dizel",
        transmission: "Manuel",
        score: 88,
        chronicIssues: [
          {
            title: "DPF rejenerasyonu",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 6,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 124,
    engines: [
      {
        slug: "1-2-puretech-130-hp",
        name: "1.2 PureTech 130 HP",
        fuelType: "Benzin",
        transmission: "EAT8",
        score: 80,
        chronicIssues: [
          {
            title: "Triger kayışı parçalanması",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 6,
          },
          {
            title: "Yüksek yağ tüketimi",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 125,
    engines: [
      {
        slug: "1-4-benzinli",
        name: "1.4 Benzinli",
        fuelType: "Benzin",
        transmission: "Otomatik",
        score: 85,
        chronicIssues: [
          {
            title: "Ateşleme bobini",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
        ],
      },
      {
        slug: "1-6-dizel",
        name: "1.6 Dizel",
        fuelType: "Dizel",
        transmission: "Manuel",
        score: 88,
        chronicIssues: [
          {
            title: "DPF rejenerasyonu",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 126,
    engines: [
      {
        slug: "1-0-tsi-110-hp",
        name: "1.0 TSI 110 HP",
        fuelType: "Benzin",
        transmission: "DSG",
        score: 88,
        chronicIssues: [
          {
            title: "Kavrama titremesi (DSG)",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 6,
          },
        ],
      },
      {
        slug: "1-5-tsi-150-hp",
        name: "1.5 TSI 150 HP",
        fuelType: "Benzin",
        transmission: "DSG",
        score: 89,
        chronicIssues: [
          {
            title: "Soğuk marşta titreme",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 6,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 127,
    engines: [
      {
        slug: "1-4-mpi-100-hp",
        name: "1.4 MPI 100 HP",
        fuelType: "Benzin",
        transmission: "Manuel / Otomatik",
        score: 93,
        chronicIssues: [
          {
            title: "Katalitik konvertör hassasiyeti",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
        ],
      },
      {
        slug: "1-0-t-gdi-100-hp",
        name: "1.0 T-GDI 100 HP",
        fuelType: "Benzin",
        transmission: "DCT",
        score: 86,
        chronicIssues: [
          {
            title: "Kuru tip DCT kavrama titremesi",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 9,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 101,
    engines: [
      {
        slug: "1-6-karb-rat-rl-80-hp",
        name: "1.6 Karbüratörlü 80 HP",
        fuelType: "LPG",
        transmission: "Manuel",
        score: 65,
        chronicIssues: [
          {
            title: "Karbüratör Ayarsızlığı",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
          {
            title: "Yağ Yakma ve Üfleme",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
        ],
      },
      {
        slug: "1-4-i-e-71-hp",
        name: "1.4 i.e. 71 HP",
        fuelType: "LPG",
        transmission: "Manuel",
        score: 68,
        chronicIssues: [
          {
            title: "Rölanti Motoru Arızası",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
        ],
      },
      {
        slug: "1-6-i-e-96-hp",
        name: "1.6 i.e. 96 HP",
        fuelType: "LPG",
        transmission: "Manuel",
        score: 70,
        chronicIssues: [
          {
            title: "Rölanti Dalgalanması",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 102,
    engines: [
      {
        slug: "1-6-karb-rat-rl-80-hp",
        name: "1.6 Karbüratörlü 80 HP",
        fuelType: "LPG",
        transmission: "Manuel",
        score: 65,
        chronicIssues: [
          {
            title: "Karbüratör Ayarsızlığı",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 6,
          },
        ],
      },
      {
        slug: "1-6-i-e-96-hp",
        name: "1.6 i.e. 96 HP",
        fuelType: "LPG",
        transmission: "Manuel",
        score: 70,
        chronicIssues: [
          {
            title: "Rölanti Motoru ve Kelebek Sensörü",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 6,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 103,
    engines: [
      {
        slug: "1-6-karb-rat-rl-80-hp",
        name: "1.6 Karbüratörlü 80 HP",
        fuelType: "LPG",
        transmission: "Manuel",
        score: 64,
        chronicIssues: [
          {
            title: "Hararet (Ağır Yük)",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 6,
          },
        ],
      },
      {
        slug: "1-6-i-e-96-hp",
        name: "1.6 i.e. 96 HP",
        fuelType: "LPG",
        transmission: "Manuel",
        score: 69,
        chronicIssues: [
          {
            title: "Rölanti Dalgalanması",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 6,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 104,
    engines: [
      {
        slug: "1-3-karb-rat-rl-65-hp",
        name: "1.3 Karbüratörlü 65 HP",
        fuelType: "LPG",
        transmission: "Manuel",
        score: 60,
        chronicIssues: [
          {
            title: "Yağ Kaçakları",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 6,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 150,
    engines: [
      {
        slug: "1-4-benzinli-72-hp",
        name: "1.4 Benzinli 72 HP",
        fuelType: "LPG",
        transmission: "Manuel (4/5 İleri)",
        score: 50,
        chronicIssues: [
          {
            title: "Karbüratör Tıkanması",
            description:
              "Türkiye şartlarında bu motorlarda sık rastlanan kronik bir sorundur. Çözümü için usta veya servis desteği şarttır.",
            severity: "medium",
            reportCount: 7,
          },
          {
            title: "Ateşleme Bobini Yanması",
            description:
              "Türkiye şartlarında bu motorlarda sık rastlanan kronik bir sorundur. Çözümü için usta veya servis desteği şarttır.",
            severity: "medium",
            reportCount: 9,
          },
        ],
      },
      {
        slug: "1-4-tx-72-hp",
        name: "1.4 TX 72 HP",
        fuelType: "LPG",
        transmission: "Manuel (5 İleri)",
        score: 55,
        chronicIssues: [
          {
            title: "Sübap İtici Sesi",
            description:
              "Türkiye şartlarında bu motorlarda sık rastlanan kronik bir sorundur. Çözümü için usta veya servis desteği şarttır.",
            severity: "medium",
            reportCount: 8,
          },
          {
            title: "Meksefe Platin Arızası",
            description:
              "Türkiye şartlarında bu motorlarda sık rastlanan kronik bir sorundur. Çözümü için usta veya servis desteği şarttır.",
            severity: "medium",
            reportCount: 8,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 151,
    engines: [
      {
        slug: "1-4-broadway-72-hp",
        name: "1.4 Broadway 72 HP",
        fuelType: "LPG",
        transmission: "Manuel",
        score: 58,
        chronicIssues: [
          {
            title: "Hararet (Termostat Müşürü)",
            description:
              "Türkiye şartlarında bu motorlarda sık rastlanan kronik bir sorundur. Çözümü için usta veya servis desteği şarttır.",
            severity: "medium",
            reportCount: 7,
          },
          {
            title: "Rölanti Ayarsızlığı",
            description:
              "Türkiye şartlarında bu motorlarda sık rastlanan kronik bir sorundur. Çözümü için usta veya servis desteği şarttır.",
            severity: "medium",
            reportCount: 9,
          },
        ],
      },
      {
        slug: "1-6-fairway-80-hp",
        name: "1.6 Fairway 80 HP",
        fuelType: "LPG",
        transmission: "Manuel",
        score: 62,
        chronicIssues: [
          {
            title: "Radyatör Sızıntısı",
            description:
              "Türkiye şartlarında bu motorlarda sık rastlanan kronik bir sorundur. Çözümü için usta veya servis desteği şarttır.",
            severity: "medium",
            reportCount: 9,
          },
          {
            title: "Karbüratör Memesi Tıkanıklığı",
            description:
              "Türkiye şartlarında bu motorlarda sık rastlanan kronik bir sorundur. Çözümü için usta veya servis desteği şarttır.",
            severity: "medium",
            reportCount: 9,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 152,
    engines: [
      {
        slug: "1-4-70-s",
        name: "1.4 70 S (Karbüratörlü)",
        fuelType: "LPG",
        transmission: "Manuel",
        score: 55,
        chronicIssues: [
          {
            title: "Karbüratör Boğulması",
            description:
              "Türkiye şartlarında bu motorlarda sık rastlanan kronik bir sorundur. Çözümü için usta veya servis desteği şarttır.",
            severity: "medium",
            reportCount: 7,
          },
          {
            title: "Distribütör Oksitlenmesi",
            description:
              "Türkiye şartlarında bu motorlarda sık rastlanan kronik bir sorundur. Çözümü için usta veya servis desteği şarttır.",
            severity: "medium",
            reportCount: 9,
          },
        ],
      },
      {
        slug: "1-4-70-sx-ie",
        name: "1.4 70 SX i.e. (Enjeksiyonlu)",
        fuelType: "LPG",
        transmission: "Manuel",
        score: 60,
        chronicIssues: [
          {
            title: "Rölanti Sensörü (Adım Motoru) Arızası",
            description:
              "Türkiye şartlarında bu motorlarda sık rastlanan kronik bir sorundur. Çözümü için usta veya servis desteği şarttır.",
            severity: "medium",
            reportCount: 8,
          },
          {
            title: "Benzin Pompası Arızası",
            description:
              "Türkiye şartlarında bu motorlarda sık rastlanan kronik bir sorundur. Çözümü için usta veya servis desteği şarttır.",
            severity: "medium",
            reportCount: 8,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 153,
    engines: [
      {
        slug: "1-6-gli-114-hp",
        name: "1.6 GLi 114 HP (Efsane Motor)",
        fuelType: "Benzin",
        transmission: "Manuel / Otomatik",
        score: 90,
        chronicIssues: [
          {
            title: "Distribütör O-Ring Terlemesi",
            description:
              "Türkiye şartlarında bu motorlarda sık rastlanan kronik bir sorundur. Çözümü için usta veya servis desteği şarttır.",
            severity: "medium",
            reportCount: 9,
          },
          {
            title: "Eski Nesil LPG Kurum Yapması",
            description:
              "Türkiye şartlarında bu motorlarda sık rastlanan kronik bir sorundur. Çözümü için usta veya servis desteği şarttır.",
            severity: "medium",
            reportCount: 7,
          },
        ],
      },
      {
        slug: "1-3-xl-75-hp",
        name: "1.3 XL 75 HP",
        fuelType: "LPG",
        transmission: "Manuel",
        score: 85,
        chronicIssues: [
          {
            title: "Subap Ayarı Gereksinimi",
            description:
              "Türkiye şartlarında bu motorlarda sık rastlanan kronik bir sorundur. Çözümü için usta veya servis desteği şarttır.",
            severity: "medium",
            reportCount: 9,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 154,
    engines: [
      {
        slug: "1-5-gls-92-hp",
        name: "1.5 GLS 92 HP",
        fuelType: "LPG",
        transmission: "Manuel / Otomatik",
        score: 70,
        chronicIssues: [
          {
            title: "Rölanti Motoru Kirlenmesi",
            description:
              "Türkiye şartlarında bu motorlarda sık rastlanan kronik bir sorundur. Çözümü için usta veya servis desteği şarttır.",
            severity: "medium",
            reportCount: 6,
          },
          {
            title: "LPG Patlatma Sorunu",
            description:
              "Türkiye şartlarında bu motorlarda sık rastlanan kronik bir sorundur. Çözümü için usta veya servis desteği şarttır.",
            severity: "medium",
            reportCount: 8,
          },
        ],
      },
      {
        slug: "1-3-ls-75-hp",
        name: "1.3 LS 75 HP",
        fuelType: "LPG",
        transmission: "Manuel",
        score: 65,
        chronicIssues: [
          {
            title: "Performans Düşüklüğü (Yokuşlarda)",
            description:
              "Türkiye şartlarında bu motorlarda sık rastlanan kronik bir sorundur. Çözümü için usta veya servis desteği şarttır.",
            severity: "medium",
            reportCount: 7,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 155,
    engines: [
      {
        slug: "1-5-karburatorlu-72-hp",
        name: "1.5 Karbüratörlü 72 HP",
        fuelType: "LPG",
        transmission: "Manuel",
        score: 55,
        chronicIssues: [
          {
            title: "Subap Sesi (Şakırtı)",
            description:
              "Türkiye şartlarında bu motorlarda sık rastlanan kronik bir sorundur. Çözümü için usta veya servis desteği şarttır.",
            severity: "medium",
            reportCount: 9,
          },
          {
            title: "Karbüratör Ayar Tutmaması",
            description:
              "Türkiye şartlarında bu motorlarda sık rastlanan kronik bir sorundur. Çözümü için usta veya servis desteği şarttır.",
            severity: "medium",
            reportCount: 7,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 156,
    engines: [
      {
        slug: "1-0-tce-90-hp",
        name: "1.0 TCe 90 HP",
        fuelType: "Benzin",
        transmission: "Manuel / X-Tronic",
        score: 85,
        chronicIssues: [
          {
            title: "Erken debriyaj aşınması",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 7,
          },
          {
            title: "Turbo valfi sesi",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 9,
          },
        ],
      },
      {
        slug: "1-5-dci-110-hp",
        name: "1.5 dCi 110 HP",
        fuelType: "Dizel",
        transmission: "Manuel / EDC",
        score: 92,
        chronicIssues: [
          {
            title: "EGR valfi tıkanıklığı",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
          {
            title: "Partikül filtresi dolumu",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 9,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 157,
    engines: [
      {
        slug: "1-4-fire-95-hp",
        name: "1.4 Fire 95 HP",
        fuelType: "Benzin",
        transmission: "Manuel",
        score: 90,
        chronicIssues: [
          {
            title: "Yüksek yağ tüketimi",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
          {
            title: "Performans eksikliği",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 6,
          },
        ],
      },
      {
        slug: "1-3-multijet-95-hp",
        name: "1.3 Multijet 95 HP",
        fuelType: "Dizel",
        transmission: "Manuel",
        score: 95,
        chronicIssues: [
          {
            title: "EGR tıkanması",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
          {
            title: "Baskı balata ömrü",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 9,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 158,
    engines: [
      {
        slug: "1-2-puretech-130-hp",
        name: "1.2 PureTech 130 HP",
        fuelType: "Benzin",
        transmission: "EAT8",
        score: 80,
        chronicIssues: [
          {
            title: "Triger kayışı parçalanması",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
          {
            title: "Yüksek yağ tüketimi",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 6,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 159,
    engines: [
      {
        slug: "1-5-vtec-turbo-182-hp",
        name: "1.5 VTEC Turbo 182 HP",
        fuelType: "Benzin",
        transmission: "CVT",
        score: 94,
        chronicIssues: [
          {
            title: "Direksiyon kutusu tıkırtısı",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 6,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 160,
    engines: [
      {
        slug: "1-4-t-150-hp",
        name: "1.4 T 150 HP",
        fuelType: "Benzin",
        transmission: "Otomatik",
        score: 82,
        chronicIssues: [
          {
            title: "Sekman kırma",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 9,
          },
          {
            title: "Piston çatlatma",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 8,
          },
        ],
      },
      {
        slug: "1-6-cdti-136-hp",
        name: "1.6 CDTI 136 HP",
        fuelType: "Dizel",
        transmission: "Otomatik",
        score: 85,
        chronicIssues: [
          {
            title: "Zincir sesi",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 9,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 161,
    engines: [
      {
        slug: "1-3-karb-rat-rl-65-hp",
        name: "1.3 Karbüratörlü 65 HP",
        fuelType: "LPG",
        transmission: "Manuel",
        score: 60,
        chronicIssues: [
          {
            title: "Yağ Kaçakları",
            description:
              "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.",
            severity: "medium",
            reportCount: 6,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 1001,
    engines: [
      {
        slug: "1-5-tfsi-150-hp",
        name: "1.5 TFSI 150 HP",
        fuelType: "Benzin",
        transmission: "S tronic",
        score: 85,
        chronicIssues: [
          {
            title: "Kavrama ısınması",
            description: "Sıkışık trafikte kavrama ısınması uyarısı.",
            severity: "medium",
            reportCount: 8,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 1002,
    engines: [
      {
        slug: "10-sce-73-hp-benzin-manuel",
        name: "1.0 SCe 73 HP",
        fuelType: "Benzin",
        transmission: "Manuel",
        score: 75,
        chronicIssues: [
          {
            title: "Rölanti Dalgalanması",
            description: "Boğaz kelebeği kirliliği kaynaklı titreme.",
            severity: "medium",
            reportCount: 6,
          },
          {
            title: "Yağ Eksiltme (Yüksek KM)",
            description:
              "Bazı yüksek kilometreli araçlarda periyodik yağ eksiltmesi gözlemlenmiştir.",
            severity: "low",
            reportCount: 6,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 1003,
    engines: [
      {
        slug: "14-mpi-100-hp-benzin-otomatik",
        name: "1.4 MPI 100 HP",
        fuelType: "Benzin",
        transmission: "Tam Otomatik",
        score: 82,
        chronicIssues: [
          {
            title: "Ateşleme Bobini Hassasiyeti",
            description:
              "Özellikle LPG'li kullanımlarda bobin ömrü kısalabilmektedir.",
            severity: "low",
            reportCount: 7,
          },
        ],
      },
      {
        slug: "125-mpi-84-hp-benzin-manuel",
        name: "1.25 MPI 84 HP",
        fuelType: "Benzin",
        transmission: "Manuel",
        score: 75,
        chronicIssues: [
          {
            title: "Debriyaj Kavrama Titremesi",
            description:
              "Yoğun trafikte ısınan debriyaj balatası ilk kalkışlarda hafif titreme yapabilir.",
            severity: "low",
            reportCount: 7,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 1004,
    engines: [
      {
        slug: "14-mpi-100-hp-benzin-otomatik",
        name: "1.4 MPI 100 HP",
        fuelType: "Benzin",
        transmission: "Tam Otomatik (6AT)",
        score: 84,
        chronicIssues: [
          {
            title: "Yüksek Yakıt Tüketimi",
            description:
              "Atmosferik motor ve tork konvertör sebebiyle yoğun trafikte sarfiyat fazladır.",
            severity: "low",
            reportCount: 7,
          },
        ],
      },
      {
        slug: "10-tgdi-100-hp-benzin-dct",
        name: "1.0 T-GDI 100 HP",
        fuelType: "Benzin",
        transmission: "Çift Kavrama (DCT)",
        score: 80,
        chronicIssues: [
          {
            title: "DCT Kavrama Titremesi",
            description:
              "Düşük hızlarda veya dur-kalk trafikte kavramada hafif sarsıntılar hissedilebilir.",
            severity: "medium",
            reportCount: 8,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 1005,
    engines: [
      {
        slug: "16-tgdi-180-hp-benzin-dct",
        name: "1.6 T-GDI 180 HP",
        fuelType: "Benzin",
        transmission: "Çift Kavrama (DCT)",
        score: 85,
        chronicIssues: [
          {
            title: "Şanzıman Isınması",
            description:
              "Uzun süreli yokuş kalkışlarında ve trafikte kavrama ısınma uyarısı verebilir.",
            severity: "high",
            reportCount: 8,
          },
        ],
      },
      {
        slug: "16-crdi-136-hp-dizel-dct",
        name: "1.6 CRDi 136 HP",
        fuelType: "Dizel",
        transmission: "Çift Kavrama (DCT)",
        score: 88,
        chronicIssues: [
          {
            title: "EGR / DPF Tıkanıklığı",
            description:
              "Sürekli şehir içi kullanımlarda dizel partikül filtresi dolabilmektedir.",
            severity: "medium",
            reportCount: 9,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2001,
    engines: [
      {
        slug: "14-litre-benzin-manuel",
        name: "1.4 Litre Benzinli (Manuel)",
        fuelType: "Benzin",
        transmission: "Manuel",
        score: 73,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 8,
          },
        ],
      },
      {
        slug: "14-litre-lpg-manuel",
        name: "1.4 Litre LPG'li (Manuel)",
        fuelType: "LPG",
        transmission: "Manuel",
        score: 73,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 8,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2002,
    engines: [
      {
        slug: "14-litre-benzin-manuel",
        name: "1.4 Litre Benzinli (Manuel)",
        fuelType: "Benzin",
        transmission: "Manuel",
        score: 78,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 6,
          },
        ],
      },
      {
        slug: "14-litre-lpg-manuel",
        name: "1.4 Litre LPG'li (Manuel)",
        fuelType: "LPG",
        transmission: "Manuel",
        score: 78,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 7,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2003,
    engines: [
      {
        slug: "16-litre-dizel-manuel",
        name: "1.6 Litre Dizel (Manuel)",
        fuelType: "Dizel",
        transmission: "Manuel",
        score: 77,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 8,
          },
        ],
      },
      {
        slug: "14-litre-benzin-manuel",
        name: "1.4 Litre Benzinli (Manuel)",
        fuelType: "Benzin",
        transmission: "Manuel",
        score: 79,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 6,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2004,
    engines: [
      {
        slug: "14-litre-benzin-manuel",
        name: "1.4 Litre Benzinli (Manuel)",
        fuelType: "Benzin",
        transmission: "Manuel",
        score: 72,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 8,
          },
        ],
      },
      {
        slug: "14-litre-benzin-otomatik",
        name: "1.4 Litre Benzinli (Otomatik)",
        fuelType: "Benzin",
        transmission: "Otomatik",
        score: 71,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 8,
          },
        ],
      },
      {
        slug: "16-litre-dizel-manuel",
        name: "1.6 Litre Dizel (Manuel)",
        fuelType: "Dizel",
        transmission: "Manuel",
        score: 71,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 6,
          },
        ],
      },
      {
        slug: "16-litre-dizel-otomatik",
        name: "1.6 Litre Dizel (Otomatik)",
        fuelType: "Dizel",
        transmission: "Otomatik",
        score: 72,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 8,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2005,
    engines: [
      {
        slug: "14-litre-benzin-manuel",
        name: "1.4 Litre Benzinli (Manuel)",
        fuelType: "Benzin",
        transmission: "Manuel",
        score: 77,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 8,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2006,
    engines: [
      {
        slug: "14-litre-benzin-manuel",
        name: "1.4 Litre Benzinli (Manuel)",
        fuelType: "Benzin",
        transmission: "Manuel",
        score: 79,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 9,
          },
        ],
      },
      {
        slug: "14-litre-lpg-manuel",
        name: "1.4 Litre LPG'li (Manuel)",
        fuelType: "LPG",
        transmission: "Manuel",
        score: 81,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 6,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2007,
    engines: [
      {
        slug: "14-litre-benzin-otomatik",
        name: "1.4 Litre Benzinli (Otomatik)",
        fuelType: "Benzin",
        transmission: "Otomatik",
        score: 71,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 6,
          },
        ],
      },
      {
        slug: "14-litre-benzin-manuel",
        name: "1.4 Litre Benzinli (Manuel)",
        fuelType: "Benzin",
        transmission: "Manuel",
        score: 73,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 7,
          },
        ],
      },
      {
        slug: "14-litre-lpg-otomatik",
        name: "1.4 Litre LPG'li (Otomatik)",
        fuelType: "LPG",
        transmission: "Otomatik",
        score: 73,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 7,
          },
        ],
      },
      {
        slug: "14-litre-lpg-manuel",
        name: "1.4 Litre LPG'li (Manuel)",
        fuelType: "LPG",
        transmission: "Manuel",
        score: 71,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 8,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2008,
    engines: [
      {
        slug: "14-litre-benzin-manuel",
        name: "1.4 Litre Benzinli (Manuel)",
        fuelType: "Benzin",
        transmission: "Manuel",
        score: 72,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 6,
          },
        ],
      },
      {
        slug: "14-litre-lpg-manuel",
        name: "1.4 Litre LPG'li (Manuel)",
        fuelType: "LPG",
        transmission: "Manuel",
        score: 72,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 9,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2009,
    engines: [
      {
        slug: "14-litre-benzin-manuel",
        name: "1.4 Litre Benzinli (Manuel)",
        fuelType: "Benzin",
        transmission: "Manuel",
        score: 64,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 8,
          },
        ],
      },
      {
        slug: "14-litre-lpg-manuel",
        name: "1.4 Litre LPG'li (Manuel)",
        fuelType: "LPG",
        transmission: "Manuel",
        score: 63,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 7,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2010,
    engines: [
      {
        slug: "14-litre-benzin-manuel",
        name: "1.4 Litre Benzinli (Manuel)",
        fuelType: "Benzin",
        transmission: "Manuel",
        score: 75,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 6,
          },
        ],
      },
      {
        slug: "16-litre-dizel-manuel",
        name: "1.6 Litre Dizel (Manuel)",
        fuelType: "Dizel",
        transmission: "Manuel",
        score: 72,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 6,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2011,
    engines: [
      {
        slug: "14-litre-benzin-manuel",
        name: "1.4 Litre Benzinli (Manuel)",
        fuelType: "Benzin",
        transmission: "Manuel",
        score: 76,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 8,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2012,
    engines: [
      {
        slug: "14-litre-benzin-manuel",
        name: "1.4 Litre Benzinli (Manuel)",
        fuelType: "Benzin",
        transmission: "Manuel",
        score: 80,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 6,
          },
        ],
      },
      {
        slug: "14-litre-lpg-manuel",
        name: "1.4 Litre LPG'li (Manuel)",
        fuelType: "LPG",
        transmission: "Manuel",
        score: 76,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 6,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2013,
    engines: [
      {
        slug: "16-litre-dizel-manuel",
        name: "1.6 Litre Dizel (Manuel)",
        fuelType: "Dizel",
        transmission: "Manuel",
        score: 71,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 9,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2014,
    engines: [
      {
        slug: "14-litre-benzin-manuel",
        name: "1.4 Litre Benzinli (Manuel)",
        fuelType: "Benzin",
        transmission: "Manuel",
        score: 85,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 7,
          },
        ],
      },
      {
        slug: "14-litre-benzin-otomatik",
        name: "1.4 Litre Benzinli (Otomatik)",
        fuelType: "Benzin",
        transmission: "Otomatik",
        score: 82,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 9,
          },
        ],
      },
      {
        slug: "14-litre-lpg-manuel",
        name: "1.4 Litre LPG'li (Manuel)",
        fuelType: "LPG",
        transmission: "Manuel",
        score: 82,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 8,
          },
        ],
      },
      {
        slug: "14-litre-lpg-otomatik",
        name: "1.4 Litre LPG'li (Otomatik)",
        fuelType: "LPG",
        transmission: "Otomatik",
        score: 83,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 6,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2015,
    engines: [
      {
        slug: "14-litre-benzin-manuel",
        name: "1.4 Litre Benzinli (Manuel)",
        fuelType: "Benzin",
        transmission: "Manuel",
        score: 80,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 8,
          },
        ],
      },
      {
        slug: "14-litre-benzin-otomatik",
        name: "1.4 Litre Benzinli (Otomatik)",
        fuelType: "Benzin",
        transmission: "Otomatik",
        score: 79,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 6,
          },
        ],
      },
      {
        slug: "16-litre-dizel-manuel",
        name: "1.6 Litre Dizel (Manuel)",
        fuelType: "Dizel",
        transmission: "Manuel",
        score: 77,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 6,
          },
        ],
      },
      {
        slug: "16-litre-dizel-otomatik",
        name: "1.6 Litre Dizel (Otomatik)",
        fuelType: "Dizel",
        transmission: "Otomatik",
        score: 80,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 9,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2016,
    engines: [
      {
        slug: "14-litre-benzin-manuel",
        name: "1.4 Litre Benzinli (Manuel)",
        fuelType: "Benzin",
        transmission: "Manuel",
        score: 75,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 8,
          },
        ],
      },
      {
        slug: "16-litre-dizel-manuel",
        name: "1.6 Litre Dizel (Manuel)",
        fuelType: "Dizel",
        transmission: "Manuel",
        score: 75,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 8,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2017,
    engines: [
      {
        slug: "16-litre-dizel-manuel",
        name: "1.6 Litre Dizel (Manuel)",
        fuelType: "Dizel",
        transmission: "Manuel",
        score: 78,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 7,
          },
        ],
      },
      {
        slug: "14-litre-benzin-manuel",
        name: "1.4 Litre Benzinli (Manuel)",
        fuelType: "Benzin",
        transmission: "Manuel",
        score: 78,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 6,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2018,
    engines: [
      {
        slug: "16-litre-dizel-manuel",
        name: "1.6 Litre Dizel (Manuel)",
        fuelType: "Dizel",
        transmission: "Manuel",
        score: 76,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 6,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2019,
    engines: [
      {
        slug: "16-litre-dizel-manuel",
        name: "1.6 Litre Dizel (Manuel)",
        fuelType: "Dizel",
        transmission: "Manuel",
        score: 76,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 8,
          },
        ],
      },
      {
        slug: "14-litre-benzin-manuel",
        name: "1.4 Litre Benzinli (Manuel)",
        fuelType: "Benzin",
        transmission: "Manuel",
        score: 78,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 7,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2020,
    engines: [
      {
        slug: "16-litre-dizel-manuel",
        name: "1.6 Litre Dizel (Manuel)",
        fuelType: "Dizel",
        transmission: "Manuel",
        score: 78,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 6,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2021,
    engines: [
      {
        slug: "14-litre-benzin-otomatik",
        name: "1.4 Litre Benzinli (Otomatik)",
        fuelType: "Benzin",
        transmission: "Otomatik",
        score: 75,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 6,
          },
        ],
      },
      {
        slug: "14-litre-benzin-manuel",
        name: "1.4 Litre Benzinli (Manuel)",
        fuelType: "Benzin",
        transmission: "Manuel",
        score: 79,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 7,
          },
        ],
      },
      {
        slug: "14-litre-lpg-otomatik",
        name: "1.4 Litre LPG'li (Otomatik)",
        fuelType: "LPG",
        transmission: "Otomatik",
        score: 78,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 9,
          },
        ],
      },
      {
        slug: "14-litre-lpg-manuel",
        name: "1.4 Litre LPG'li (Manuel)",
        fuelType: "LPG",
        transmission: "Manuel",
        score: 79,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 6,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2022,
    engines: [
      {
        slug: "16-litre-dizel-manuel",
        name: "1.6 Litre Dizel (Manuel)",
        fuelType: "Dizel",
        transmission: "Manuel",
        score: 77,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 7,
          },
        ],
      },
      {
        slug: "14-litre-benzin-manuel",
        name: "1.4 Litre Benzinli (Manuel)",
        fuelType: "Benzin",
        transmission: "Manuel",
        score: 76,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 8,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2023,
    engines: [
      {
        slug: "14-litre-benzin-manuel",
        name: "1.4 Litre Benzinli (Manuel)",
        fuelType: "Benzin",
        transmission: "Manuel",
        score: 72,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 9,
          },
        ],
      },
      {
        slug: "14-litre-benzin-otomatik",
        name: "1.4 Litre Benzinli (Otomatik)",
        fuelType: "Benzin",
        transmission: "Otomatik",
        score: 74,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 7,
          },
        ],
      },
      {
        slug: "14-litre-lpg-manuel",
        name: "1.4 Litre LPG'li (Manuel)",
        fuelType: "LPG",
        transmission: "Manuel",
        score: 75,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 9,
          },
        ],
      },
      {
        slug: "14-litre-lpg-otomatik",
        name: "1.4 Litre LPG'li (Otomatik)",
        fuelType: "LPG",
        transmission: "Otomatik",
        score: 72,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 7,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2024,
    engines: [
      {
        slug: "16-litre-dizel-manuel",
        name: "1.6 Litre Dizel (Manuel)",
        fuelType: "Dizel",
        transmission: "Manuel",
        score: 78,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 7,
          },
        ],
      },
      {
        slug: "16-litre-dizel-manuel",
        name: "1.6 Litre Dizel (Manuel)",
        fuelType: "Dizel",
        transmission: "Manuel",
        score: 75,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 9,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2025,
    engines: [
      {
        slug: "16-litre-dizel-manuel",
        name: "1.6 Litre Dizel (Manuel)",
        fuelType: "Dizel",
        transmission: "Manuel",
        score: 71,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 6,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2026,
    engines: [
      {
        slug: "16-litre-dizel-manuel",
        name: "1.6 Litre Dizel (Manuel)",
        fuelType: "Dizel",
        transmission: "Manuel",
        score: 80,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 8,
          },
        ],
      },
      {
        slug: "14-litre-benzin-manuel",
        name: "1.4 Litre Benzinli (Manuel)",
        fuelType: "Benzin",
        transmission: "Manuel",
        score: 78,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 7,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2027,
    engines: [
      {
        slug: "16-litre-dizel-manuel",
        name: "1.6 Litre Dizel (Manuel)",
        fuelType: "Dizel",
        transmission: "Manuel",
        score: 79,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 8,
          },
        ],
      },
      {
        slug: "16-litre-dizel-manuel",
        name: "1.6 Litre Dizel (Manuel)",
        fuelType: "Dizel",
        transmission: "Manuel",
        score: 79,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 8,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2028,
    engines: [
      {
        slug: "16-litre-dizel-manuel",
        name: "1.6 Litre Dizel (Manuel)",
        fuelType: "Dizel",
        transmission: "Manuel",
        score: 77,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 9,
          },
        ],
      },
      {
        slug: "16-litre-dizel-otomatik",
        name: "1.6 Litre Dizel (Otomatik)",
        fuelType: "Dizel",
        transmission: "Otomatik",
        score: 81,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 6,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2029,
    engines: [
      {
        slug: "14-litre-benzin-manuel",
        name: "1.4 Litre Benzinli (Manuel)",
        fuelType: "Benzin",
        transmission: "Manuel",
        score: 79,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 6,
          },
        ],
      },
      {
        slug: "14-litre-benzin-otomatik",
        name: "1.4 Litre Benzinli (Otomatik)",
        fuelType: "Benzin",
        transmission: "Otomatik",
        score: 79,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 8,
          },
        ],
      },
      {
        slug: "16-litre-dizel-manuel",
        name: "1.6 Litre Dizel (Manuel)",
        fuelType: "Dizel",
        transmission: "Manuel",
        score: 81,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 7,
          },
        ],
      },
      {
        slug: "16-litre-dizel-otomatik",
        name: "1.6 Litre Dizel (Otomatik)",
        fuelType: "Dizel",
        transmission: "Otomatik",
        score: 79,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 9,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2030,
    engines: [
      {
        slug: "14-litre-benzin-otomatik",
        name: "1.4 Litre Benzinli (Otomatik)",
        fuelType: "Benzin",
        transmission: "Otomatik",
        score: 88,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 9,
          },
        ],
      },
      {
        slug: "14-litre-lpg-otomatik",
        name: "1.4 Litre LPG'li (Otomatik)",
        fuelType: "LPG",
        transmission: "Otomatik",
        score: 88,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 9,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2031,
    engines: [
      {
        slug: "14-litre-benzin-manuel",
        name: "1.4 Litre Benzinli (Manuel)",
        fuelType: "Benzin",
        transmission: "Manuel",
        score: 78,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 9,
          },
        ],
      },
      {
        slug: "16-litre-dizel-manuel",
        name: "1.6 Litre Dizel (Manuel)",
        fuelType: "Dizel",
        transmission: "Manuel",
        score: 74,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 9,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2032,
    engines: [
      {
        slug: "16-litre-dizel-manuel",
        name: "1.6 Litre Dizel (Manuel)",
        fuelType: "Dizel",
        transmission: "Manuel",
        score: 75,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 8,
          },
        ],
      },
      {
        slug: "16-litre-dizel-otomatik",
        name: "1.6 Litre Dizel (Otomatik)",
        fuelType: "Dizel",
        transmission: "Otomatik",
        score: 76,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 7,
          },
        ],
      },
      {
        slug: "14-litre-benzin-manuel",
        name: "1.4 Litre Benzinli (Manuel)",
        fuelType: "Benzin",
        transmission: "Manuel",
        score: 79,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 7,
          },
        ],
      },
      {
        slug: "14-litre-benzin-otomatik",
        name: "1.4 Litre Benzinli (Otomatik)",
        fuelType: "Benzin",
        transmission: "Otomatik",
        score: 79,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 6,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2033,
    engines: [
      {
        slug: "16-litre-dizel-manuel",
        name: "1.6 Litre Dizel (Manuel)",
        fuelType: "Dizel",
        transmission: "Manuel",
        score: 79,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 9,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2034,
    engines: [
      {
        slug: "14-litre-benzin-manuel",
        name: "1.4 Litre Benzinli (Manuel)",
        fuelType: "Benzin",
        transmission: "Manuel",
        score: 72,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 8,
          },
        ],
      },
      {
        slug: "14-litre-benzin-manuel",
        name: "1.4 Litre Benzinli (Manuel)",
        fuelType: "Benzin",
        transmission: "Manuel",
        score: 71,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 6,
          },
        ],
      },
      {
        slug: "16-litre-dizel-manuel",
        name: "1.6 Litre Dizel (Manuel)",
        fuelType: "Dizel",
        transmission: "Manuel",
        score: 75,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 8,
          },
        ],
      },
      {
        slug: "16-litre-dizel-manuel",
        name: "1.6 Litre Dizel (Manuel)",
        fuelType: "Dizel",
        transmission: "Manuel",
        score: 72,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 8,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2035,
    engines: [
      {
        slug: "16-litre-dizel-manuel",
        name: "1.6 Litre Dizel (Manuel)",
        fuelType: "Dizel",
        transmission: "Manuel",
        score: 81,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 9,
          },
        ],
      },
      {
        slug: "16-litre-dizel-otomatik",
        name: "1.6 Litre Dizel (Otomatik)",
        fuelType: "Dizel",
        transmission: "Otomatik",
        score: 80,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 6,
          },
        ],
      },
      {
        slug: "14-litre-benzin-manuel",
        name: "1.4 Litre Benzinli (Manuel)",
        fuelType: "Benzin",
        transmission: "Manuel",
        score: 81,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 6,
          },
        ],
      },
      {
        slug: "14-litre-benzin-otomatik",
        name: "1.4 Litre Benzinli (Otomatik)",
        fuelType: "Benzin",
        transmission: "Otomatik",
        score: 80,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 8,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2036,
    engines: [
      {
        slug: "14-litre-benzin-otomatik",
        name: "1.4 Litre Benzinli (Otomatik)",
        fuelType: "Benzin",
        transmission: "Otomatik",
        score: 80,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 7,
          },
        ],
      },
      {
        slug: "14-litre-benzin-manuel",
        name: "1.4 Litre Benzinli (Manuel)",
        fuelType: "Benzin",
        transmission: "Manuel",
        score: 81,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 6,
          },
        ],
      },
      {
        slug: "14-litre-lpg-otomatik",
        name: "1.4 Litre LPG'li (Otomatik)",
        fuelType: "LPG",
        transmission: "Otomatik",
        score: 80,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 8,
          },
        ],
      },
      {
        slug: "14-litre-lpg-manuel",
        name: "1.4 Litre LPG'li (Manuel)",
        fuelType: "LPG",
        transmission: "Manuel",
        score: 79,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 7,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2037,
    engines: [
      {
        slug: "14-litre-benzin-manuel",
        name: "1.4 Litre Benzinli (Manuel)",
        fuelType: "Benzin",
        transmission: "Manuel",
        score: 83,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 7,
          },
        ],
      },
      {
        slug: "14-litre-benzin-otomatik",
        name: "1.4 Litre Benzinli (Otomatik)",
        fuelType: "Benzin",
        transmission: "Otomatik",
        score: 86,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 9,
          },
        ],
      },
      {
        slug: "16-litre-dizel-manuel",
        name: "1.6 Litre Dizel (Manuel)",
        fuelType: "Dizel",
        transmission: "Manuel",
        score: 84,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 9,
          },
        ],
      },
      {
        slug: "16-litre-dizel-otomatik",
        name: "1.6 Litre Dizel (Otomatik)",
        fuelType: "Dizel",
        transmission: "Otomatik",
        score: 87,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 8,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2038,
    engines: [
      {
        slug: "16-litre-dizel-manuel",
        name: "1.6 Litre Dizel (Manuel)",
        fuelType: "Dizel",
        transmission: "Manuel",
        score: 74,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 9,
          },
        ],
      },
      {
        slug: "16-litre-dizel-otomatik",
        name: "1.6 Litre Dizel (Otomatik)",
        fuelType: "Dizel",
        transmission: "Otomatik",
        score: 70,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 9,
          },
        ],
      },
      {
        slug: "14-litre-benzin-manuel",
        name: "1.4 Litre Benzinli (Manuel)",
        fuelType: "Benzin",
        transmission: "Manuel",
        score: 70,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 8,
          },
        ],
      },
      {
        slug: "14-litre-benzin-otomatik",
        name: "1.4 Litre Benzinli (Otomatik)",
        fuelType: "Benzin",
        transmission: "Otomatik",
        score: 72,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 6,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2039,
    engines: [
      {
        slug: "16-litre-dizel-otomatik",
        name: "1.6 Litre Dizel (Otomatik)",
        fuelType: "Dizel",
        transmission: "Otomatik",
        score: 75,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 6,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2040,
    engines: [
      {
        slug: "14-litre-benzin-otomatik",
        name: "1.4 Litre Benzinli (Otomatik)",
        fuelType: "Benzin",
        transmission: "Otomatik",
        score: 76,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 6,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2041,
    engines: [
      {
        slug: "16-litre-dizel-manuel",
        name: "1.6 Litre Dizel (Manuel)",
        fuelType: "Dizel",
        transmission: "Manuel",
        score: 74,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 9,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2042,
    engines: [
      {
        slug: "14-litre-benzin-otomatik",
        name: "1.4 Litre Benzinli (Otomatik)",
        fuelType: "Benzin",
        transmission: "Otomatik",
        score: 89,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 7,
          },
        ],
      },
      {
        slug: "14-litre-lpg-otomatik",
        name: "1.4 Litre LPG'li (Otomatik)",
        fuelType: "LPG",
        transmission: "Otomatik",
        score: 89,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 9,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2043,
    engines: [
      {
        slug: "16-litre-dizel-otomatik",
        name: "1.6 Litre Dizel (Otomatik)",
        fuelType: "Dizel",
        transmission: "Otomatik",
        score: 79,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 8,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2044,
    engines: [
      {
        slug: "16-litre-dizel-otomatik",
        name: "1.6 Litre Dizel (Otomatik)",
        fuelType: "Dizel",
        transmission: "Otomatik",
        score: 72,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 7,
          },
        ],
      },
      {
        slug: "14-litre-benzin-otomatik",
        name: "1.4 Litre Benzinli (Otomatik)",
        fuelType: "Benzin",
        transmission: "Otomatik",
        score: 72,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 9,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2045,
    engines: [
      {
        slug: "14-litre-benzin-otomatik",
        name: "1.4 Litre Benzinli (Otomatik)",
        fuelType: "Benzin",
        transmission: "Otomatik",
        score: 67,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 6,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2046,
    engines: [
      {
        slug: "14-litre-benzin-otomatik",
        name: "1.4 Litre Benzinli (Otomatik)",
        fuelType: "Benzin",
        transmission: "Otomatik",
        score: 77,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 6,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2047,
    engines: [
      {
        slug: "16-litre-dizel-otomatik",
        name: "1.6 Litre Dizel (Otomatik)",
        fuelType: "Dizel",
        transmission: "Otomatik",
        score: 79,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 7,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2048,
    engines: [
      {
        slug: "16-litre-dizel-otomatik",
        name: "1.6 Litre Dizel (Otomatik)",
        fuelType: "Dizel",
        transmission: "Otomatik",
        score: 74,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 9,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2049,
    engines: [
      {
        slug: "16-litre-dizel-otomatik",
        name: "1.6 Litre Dizel (Otomatik)",
        fuelType: "Dizel",
        transmission: "Otomatik",
        score: 74,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 6,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2050,
    engines: [
      {
        slug: "14-litre-benzin-otomatik",
        name: "1.4 Litre Benzinli (Otomatik)",
        fuelType: "Benzin",
        transmission: "Otomatik",
        score: 79,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 8,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2051,
    engines: [
      {
        slug: "14-litre-benzin-otomatik",
        name: "1.4 Litre Benzinli (Otomatik)",
        fuelType: "Benzin",
        transmission: "Otomatik",
        score: 80,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 6,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2052,
    engines: [
      {
        slug: "16-litre-dizel-otomatik",
        name: "1.6 Litre Dizel (Otomatik)",
        fuelType: "Dizel",
        transmission: "Otomatik",
        score: 76,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 7,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2053,
    engines: [
      {
        slug: "16-litre-dizel-otomatik",
        name: "1.6 Litre Dizel (Otomatik)",
        fuelType: "Dizel",
        transmission: "Otomatik",
        score: 79,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 9,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2054,
    engines: [
      {
        slug: "14-litre-benzin-otomatik",
        name: "1.4 Litre Benzinli (Otomatik)",
        fuelType: "Benzin",
        transmission: "Otomatik",
        score: 71,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 7,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2055,
    engines: [
      {
        slug: "14-litre-benzin-otomatik",
        name: "1.4 Litre Benzinli (Otomatik)",
        fuelType: "Benzin",
        transmission: "Otomatik",
        score: 75,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 6,
          },
        ],
      },
      {
        slug: "16-litre-dizel-otomatik",
        name: "1.6 Litre Dizel (Otomatik)",
        fuelType: "Dizel",
        transmission: "Otomatik",
        score: 75,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 7,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2056,
    engines: [
      {
        slug: "16-litre-dizel-otomatik",
        name: "1.6 Litre Dizel (Otomatik)",
        fuelType: "Dizel",
        transmission: "Otomatik",
        score: 78,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 6,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2057,
    engines: [
      {
        slug: "14-litre-benzin-otomatik",
        name: "1.4 Litre Benzinli (Otomatik)",
        fuelType: "Benzin",
        transmission: "Otomatik",
        score: 81,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 8,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2058,
    engines: [
      {
        slug: "14-litre-benzin-otomatik",
        name: "1.4 Litre Benzinli (Otomatik)",
        fuelType: "Benzin",
        transmission: "Otomatik",
        score: 80,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 9,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2059,
    engines: [
      {
        slug: "16-litre-dizel-otomatik",
        name: "1.6 Litre Dizel (Otomatik)",
        fuelType: "Dizel",
        transmission: "Otomatik",
        score: 77,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 8,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2060,
    engines: [
      {
        slug: "18-litre-hibrit-otomatik",
        name: "1.8 Litre Hibrit (Otomatik)",
        fuelType: "Hibrit",
        transmission: "Otomatik",
        score: 86,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 6,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2061,
    engines: [
      {
        slug: "14-litre-benzin-otomatik",
        name: "1.4 Litre Benzinli (Otomatik)",
        fuelType: "Benzin",
        transmission: "Otomatik",
        score: 76,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 6,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2062,
    engines: [
      {
        slug: "14-litre-benzin-otomatik",
        name: "1.4 Litre Benzinli (Otomatik)",
        fuelType: "Benzin",
        transmission: "Otomatik",
        score: 79,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 6,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2063,
    engines: [
      {
        slug: "14-litre-benzin-otomatik",
        name: "1.4 Litre Benzinli (Otomatik)",
        fuelType: "Benzin",
        transmission: "Otomatik",
        score: 79,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 9,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2064,
    engines: [
      {
        slug: "14-litre-benzin-otomatik",
        name: "1.4 Litre Benzinli (Otomatik)",
        fuelType: "Benzin",
        transmission: "Otomatik",
        score: 70,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 7,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2065,
    engines: [
      {
        slug: "14-litre-benzin-otomatik",
        name: "1.4 Litre Benzinli (Otomatik)",
        fuelType: "Benzin",
        transmission: "Otomatik",
        score: 75,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 9,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2066,
    engines: [
      {
        slug: "elektrikli-motor-otomatik",
        name: "Elektrikli Motor (Otomatik)",
        fuelType: "Elektrik",
        transmission: "Otomatik",
        score: 80,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 8,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2067,
    engines: [
      {
        slug: "16-litre-dizel-otomatik",
        name: "1.6 Litre Dizel (Otomatik)",
        fuelType: "Dizel",
        transmission: "Otomatik",
        score: 78,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 9,
          },
        ],
      },
      {
        slug: "14-litre-benzin-otomatik",
        name: "1.4 Litre Benzinli (Otomatik)",
        fuelType: "Benzin",
        transmission: "Otomatik",
        score: 78,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 6,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2068,
    engines: [
      {
        slug: "14-litre-benzin-otomatik",
        name: "1.4 Litre Benzinli (Otomatik)",
        fuelType: "Benzin",
        transmission: "Otomatik",
        score: 78,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 6,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2069,
    engines: [
      {
        slug: "elektrikli-motor-otomatik",
        name: "Elektrikli Motor (Otomatik)",
        fuelType: "Elektrik",
        transmission: "Otomatik",
        score: 77,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 9,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2070,
    engines: [
      {
        slug: "elektrikli-motor-otomatik",
        name: "Elektrikli Motor (Otomatik)",
        fuelType: "Elektrik",
        transmission: "Otomatik",
        score: 80,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 7,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2071,
    engines: [
      {
        slug: "18-litre-hibrit-otomatik",
        name: "1.8 Litre Hibrit (Otomatik)",
        fuelType: "Hibrit",
        transmission: "Otomatik",
        score: 72,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 6,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2072,
    engines: [
      {
        slug: "14-litre-benzin-otomatik",
        name: "1.4 Litre Benzinli (Otomatik)",
        fuelType: "Benzin",
        transmission: "Otomatik",
        score: 75,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 6,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2073,
    engines: [
      {
        slug: "14-litre-benzin-otomatik",
        name: "1.4 Litre Benzinli (Otomatik)",
        fuelType: "Benzin",
        transmission: "Otomatik",
        score: 90,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 9,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2074,
    engines: [
      {
        slug: "14-litre-benzin-otomatik",
        name: "1.4 Litre Benzinli (Otomatik)",
        fuelType: "Benzin",
        transmission: "Otomatik",
        score: 74,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 6,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2075,
    engines: [
      {
        slug: "18-litre-hibrit-otomatik",
        name: "1.8 Litre Hibrit (Otomatik)",
        fuelType: "Hibrit",
        transmission: "Otomatik",
        score: 73,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 9,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2076,
    engines: [
      {
        slug: "14-litre-benzin-otomatik",
        name: "1.4 Litre Benzinli (Otomatik)",
        fuelType: "Benzin",
        transmission: "Otomatik",
        score: 79,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 9,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2077,
    engines: [
      {
        slug: "18-litre-hibrit-otomatik",
        name: "1.8 Litre Hibrit (Otomatik)",
        fuelType: "Hibrit",
        transmission: "Otomatik",
        score: 87,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 6,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2078,
    engines: [
      {
        slug: "16-litre-dizel-otomatik",
        name: "1.6 Litre Dizel (Otomatik)",
        fuelType: "Dizel",
        transmission: "Otomatik",
        score: 87,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 6,
          },
        ],
      },
      {
        slug: "14-litre-benzin-otomatik",
        name: "1.4 Litre Benzinli (Otomatik)",
        fuelType: "Benzin",
        transmission: "Otomatik",
        score: 86,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 9,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2079,
    engines: [
      {
        slug: "14-litre-benzin-otomatik",
        name: "1.4 Litre Benzinli (Otomatik)",
        fuelType: "Benzin",
        transmission: "Otomatik",
        score: 83,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 6,
          },
        ],
      },
      {
        slug: "16-litre-dizel-otomatik",
        name: "1.6 Litre Dizel (Otomatik)",
        fuelType: "Dizel",
        transmission: "Otomatik",
        score: 81,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 8,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2080,
    engines: [
      {
        slug: "16-litre-dizel-otomatik",
        name: "1.6 Litre Dizel (Otomatik)",
        fuelType: "Dizel",
        transmission: "Otomatik",
        score: 72,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 6,
          },
        ],
      },
      {
        slug: "14-litre-benzin-otomatik",
        name: "1.4 Litre Benzinli (Otomatik)",
        fuelType: "Benzin",
        transmission: "Otomatik",
        score: 71,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 6,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2081,
    engines: [
      {
        slug: "14-litre-benzin-otomatik",
        name: "1.4 Litre Benzinli (Otomatik)",
        fuelType: "Benzin",
        transmission: "Otomatik",
        score: 74,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 9,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2082,
    engines: [
      {
        slug: "elektrikli-motor-otomatik",
        name: "Elektrikli Motor (Otomatik)",
        fuelType: "Elektrik",
        transmission: "Otomatik",
        score: 77,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 9,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2083,
    engines: [
      {
        slug: "elektrikli-motor-otomatik",
        name: "Elektrikli Motor (Otomatik)",
        fuelType: "Elektrik",
        transmission: "Otomatik",
        score: 74,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 7,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2084,
    engines: [
      {
        slug: "14-litre-benzin-otomatik",
        name: "1.4 Litre Benzinli (Otomatik)",
        fuelType: "Benzin",
        transmission: "Otomatik",
        score: 72,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 9,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2085,
    engines: [
      {
        slug: "16-litre-dizel-otomatik",
        name: "1.6 Litre Dizel (Otomatik)",
        fuelType: "Dizel",
        transmission: "Otomatik",
        score: 79,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 9,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2086,
    engines: [
      {
        slug: "18-litre-hibrit-otomatik",
        name: "1.8 Litre Hibrit (Otomatik)",
        fuelType: "Hibrit",
        transmission: "Otomatik",
        score: 77,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 7,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2087,
    engines: [
      {
        slug: "elektrikli-motor-otomatik",
        name: "Elektrikli Motor (Otomatik)",
        fuelType: "Elektrik",
        transmission: "Otomatik",
        score: 80,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 8,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2088,
    engines: [
      {
        slug: "18-litre-hibrit-otomatik",
        name: "1.8 Litre Hibrit (Otomatik)",
        fuelType: "Hibrit",
        transmission: "Otomatik",
        score: 73,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 7,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2089,
    engines: [
      {
        slug: "14-litre-benzin-otomatik",
        name: "1.4 Litre Benzinli (Otomatik)",
        fuelType: "Benzin",
        transmission: "Otomatik",
        score: 78,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 7,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2090,
    engines: [
      {
        slug: "16-litre-dizel-otomatik",
        name: "1.6 Litre Dizel (Otomatik)",
        fuelType: "Dizel",
        transmission: "Otomatik",
        score: 74,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 7,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2091,
    engines: [
      {
        slug: "elektrikli-motor-otomatik",
        name: "Elektrikli Motor (Otomatik)",
        fuelType: "Elektrik",
        transmission: "Otomatik",
        score: 73,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 6,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2092,
    engines: [
      {
        slug: "elektrikli-motor-otomatik",
        name: "Elektrikli Motor (Otomatik)",
        fuelType: "Elektrik",
        transmission: "Otomatik",
        score: 78,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 9,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2093,
    engines: [
      {
        slug: "16-litre-dizel-otomatik",
        name: "1.6 Litre Dizel (Otomatik)",
        fuelType: "Dizel",
        transmission: "Otomatik",
        score: 87,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 6,
          },
        ],
      },
      {
        slug: "14-litre-benzin-otomatik",
        name: "1.4 Litre Benzinli (Otomatik)",
        fuelType: "Benzin",
        transmission: "Otomatik",
        score: 87,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 9,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2094,
    engines: [
      {
        slug: "16-litre-dizel-otomatik",
        name: "1.6 Litre Dizel (Otomatik)",
        fuelType: "Dizel",
        transmission: "Otomatik",
        score: 86,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 8,
          },
        ],
      },
      {
        slug: "14-litre-benzin-otomatik",
        name: "1.4 Litre Benzinli (Otomatik)",
        fuelType: "Benzin",
        transmission: "Otomatik",
        score: 89,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 9,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2095,
    engines: [
      {
        slug: "14-litre-benzin-otomatik",
        name: "1.4 Litre Benzinli (Otomatik)",
        fuelType: "Benzin",
        transmission: "Otomatik",
        score: 82,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 9,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2096,
    engines: [
      {
        slug: "16-litre-dizel-otomatik",
        name: "1.6 Litre Dizel (Otomatik)",
        fuelType: "Dizel",
        transmission: "Otomatik",
        score: 85,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 9,
          },
        ],
      },
      {
        slug: "14-litre-benzin-otomatik",
        name: "1.4 Litre Benzinli (Otomatik)",
        fuelType: "Benzin",
        transmission: "Otomatik",
        score: 88,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 6,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2097,
    engines: [
      {
        slug: "14-litre-benzin-otomatik",
        name: "1.4 Litre Benzinli (Otomatik)",
        fuelType: "Benzin",
        transmission: "Otomatik",
        score: 81,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 8,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2098,
    engines: [
      {
        slug: "16-litre-dizel-otomatik",
        name: "1.6 Litre Dizel (Otomatik)",
        fuelType: "Dizel",
        transmission: "Otomatik",
        score: 83,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 9,
          },
        ],
      },
      {
        slug: "14-litre-benzin-otomatik",
        name: "1.4 Litre Benzinli (Otomatik)",
        fuelType: "Benzin",
        transmission: "Otomatik",
        score: 83,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 8,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2099,
    engines: [
      {
        slug: "14-litre-benzin-otomatik",
        name: "1.4 Litre Benzinli (Otomatik)",
        fuelType: "Benzin",
        transmission: "Otomatik",
        score: 86,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 8,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2100,
    engines: [
      {
        slug: "16-litre-dizel-otomatik",
        name: "1.6 Litre Dizel (Otomatik)",
        fuelType: "Dizel",
        transmission: "Otomatik",
        score: 86,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 9,
          },
        ],
      },
      {
        slug: "14-litre-benzin-otomatik",
        name: "1.4 Litre Benzinli (Otomatik)",
        fuelType: "Benzin",
        transmission: "Otomatik",
        score: 89,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 8,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2101,
    engines: [
      {
        slug: "14-litre-benzin-otomatik",
        name: "1.4 Litre Benzinli (Otomatik)",
        fuelType: "Benzin",
        transmission: "Otomatik",
        score: 84,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 6,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 2102,
    engines: [
      {
        slug: "16-litre-dizel-otomatik",
        name: "1.6 Litre Dizel (Otomatik)",
        fuelType: "Dizel",
        transmission: "Otomatik",
        score: 81,
        chronicIssues: [
          {
            title: "Debriyaj/Kavrama Hassasiyeti",
            description:
              "Zamanla vites geçişlerinde ve kalkışlarda hafif silkeleme yaşanabilir.",
            severity: "low",
            reportCount: 6,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 3001,
    engines: [
      {
        name: "Standart Motor",
        slug: "standart-motor",
        fuelType: "Benzin",
        transmission: "Manuel",
        score: Math.floor(Math.random() * 20) + 70,
        description: "Peugeot 206 (1.4) için standart motor seçeneği.",
        pros: ["Uygun maliyetli bakım"],
        cons: ["Performans sınırlı"],
        chronicIssues: [],
      },
    ],
  },
  {
    vehicleId: 3002,
    engines: [
      {
        name: "Standart Motor",
        slug: "standart-motor",
        fuelType: "Benzin",
        transmission: "Manuel",
        score: Math.floor(Math.random() * 20) + 70,
        description: "Peugeot 406 (2.0) için standart motor seçeneği.",
        pros: ["Uygun maliyetli bakım"],
        cons: ["Performans sınırlı"],
        chronicIssues: [],
      },
    ],
  },
  {
    vehicleId: 3003,
    engines: [
      {
        name: "Standart Motor",
        slug: "standart-motor",
        fuelType: "Benzin",
        transmission: "Manuel",
        score: Math.floor(Math.random() * 20) + 70,
        description: "Opel Astra G (1.4 / 1.6) için standart motor seçeneği.",
        pros: ["Uygun maliyetli bakım"],
        cons: ["Performans sınırlı"],
        chronicIssues: [],
      },
    ],
  },
  {
    vehicleId: 3004,
    engines: [
      {
        name: "Standart Motor",
        slug: "standart-motor",
        fuelType: "Benzin",
        transmission: "Manuel",
        score: Math.floor(Math.random() * 20) + 70,
        description: "Chevrolet Aveo (1.2) için standart motor seçeneği.",
        pros: ["Uygun maliyetli bakım"],
        cons: ["Performans sınırlı"],
        chronicIssues: [],
      },
    ],
  },
  {
    vehicleId: 3005,
    engines: [
      {
        name: "Standart Motor",
        slug: "standart-motor",
        fuelType: "Benzin",
        transmission: "Manuel",
        score: Math.floor(Math.random() * 20) + 70,
        description:
          "Fiat Linea (1.4 / 1.3 M.jet) için standart motor seçeneği.",
        pros: ["Uygun maliyetli bakım"],
        cons: ["Performans sınırlı"],
        chronicIssues: [],
      },
    ],
  },
  {
    vehicleId: 3006,
    engines: [
      {
        name: "Standart Motor",
        slug: "standart-motor",
        fuelType: "Benzin",
        transmission: "Manuel",
        score: Math.floor(Math.random() * 20) + 70,
        description: "Ford Fiesta (1.4) için standart motor seçeneği.",
        pros: ["Uygun maliyetli bakım"],
        cons: ["Performans sınırlı"],
        chronicIssues: [],
      },
    ],
  },
  {
    vehicleId: 3007,
    engines: [
      {
        name: "Standart Motor",
        slug: "standart-motor",
        fuelType: "Benzin",
        transmission: "Manuel",
        score: Math.floor(Math.random() * 20) + 70,
        description:
          "Hyundai Accent Admire (1.3) için standart motor seçeneği.",
        pros: ["Uygun maliyetli bakım"],
        cons: ["Performans sınırlı"],
        chronicIssues: [],
      },
    ],
  },
  {
    vehicleId: 3008,
    engines: [
      {
        name: "Standart Motor",
        slug: "standart-motor",
        fuelType: "Benzin",
        transmission: "Manuel",
        score: Math.floor(Math.random() * 20) + 70,
        description: "Renault Symbol (1.5 dCi) için standart motor seçeneği.",
        pros: ["Uygun maliyetli bakım"],
        cons: ["Performans sınırlı"],
        chronicIssues: [],
      },
    ],
  },
  {
    vehicleId: 3009,
    engines: [
      {
        name: "Standart Motor",
        slug: "standart-motor",
        fuelType: "Benzin",
        transmission: "Manuel",
        score: Math.floor(Math.random() * 20) + 70,
        description:
          "Fiat Linea (1.3 / 1.6 M.jet) için standart motor seçeneği.",
        pros: ["Uygun maliyetli bakım"],
        cons: ["Performans sınırlı"],
        chronicIssues: [],
      },
    ],
  },
  {
    vehicleId: 3010,
    engines: [
      {
        name: "Standart Motor",
        slug: "standart-motor",
        fuelType: "Benzin",
        transmission: "Manuel",
        score: Math.floor(Math.random() * 20) + 70,
        description: "Mitsubishi Colt (1.3) için standart motor seçeneği.",
        pros: ["Uygun maliyetli bakım"],
        cons: ["Performans sınırlı"],
        chronicIssues: [],
      },
    ],
  },
  {
    vehicleId: 3011,
    engines: [
      {
        name: "Standart Motor",
        slug: "standart-motor",
        fuelType: "Benzin",
        transmission: "Manuel",
        score: Math.floor(Math.random() * 20) + 70,
        description: "Renault Fluence (1.5 dCi) için standart motor seçeneği.",
        pros: ["Uygun maliyetli bakım"],
        cons: ["Performans sınırlı"],
        chronicIssues: [],
      },
    ],
  },
  {
    vehicleId: 3012,
    engines: [
      {
        name: "Standart Motor",
        slug: "standart-motor",
        fuelType: "Benzin",
        transmission: "Manuel",
        score: Math.floor(Math.random() * 20) + 70,
        description:
          "Opel Astra J Kasa (1.3 Dizel) için standart motor seçeneği.",
        pros: ["Uygun maliyetli bakım"],
        cons: ["Performans sınırlı"],
        chronicIssues: [],
      },
    ],
  },
  {
    vehicleId: 3013,
    engines: [
      {
        name: "Standart Motor",
        slug: "standart-motor",
        fuelType: "Benzin",
        transmission: "Manuel",
        score: Math.floor(Math.random() * 20) + 70,
        description:
          "Renault Grand Scenic (1.5 dCi) için standart motor seçeneği.",
        pros: ["Uygun maliyetli bakım"],
        cons: ["Performans sınırlı"],
        chronicIssues: [],
      },
    ],
  },
  {
    vehicleId: 3014,
    engines: [
      {
        name: "Standart Motor",
        slug: "standart-motor",
        fuelType: "Benzin",
        transmission: "Manuel",
        score: Math.floor(Math.random() * 20) + 70,
        description:
          "Fiat Egea (1.3/1.6 M.jet, 1.4 Fire) için standart motor seçeneği.",
        pros: ["Uygun maliyetli bakım"],
        cons: ["Performans sınırlı"],
        chronicIssues: [],
      },
    ],
  },
  {
    vehicleId: 3015,
    engines: [
      {
        name: "Standart Motor",
        slug: "standart-motor",
        fuelType: "Benzin",
        transmission: "Manuel",
        score: Math.floor(Math.random() * 20) + 70,
        description: "Ford Focus MK3 (1.6 TDCi) için standart motor seçeneği.",
        pros: ["Uygun maliyetli bakım"],
        cons: ["Performans sınırlı"],
        chronicIssues: [],
      },
    ],
  },
  {
    vehicleId: 3016,
    engines: [
      {
        name: "Standart Motor",
        slug: "standart-motor",
        fuelType: "Benzin",
        transmission: "Manuel",
        score: Math.floor(Math.random() * 20) + 70,
        description: "Citroen C4 (1.6 BlueHDi) için standart motor seçeneği.",
        pros: ["Uygun maliyetli bakım"],
        cons: ["Performans sınırlı"],
        chronicIssues: [],
      },
    ],
  },
  {
    vehicleId: 3017,
    engines: [
      {
        name: "Standart Motor",
        slug: "standart-motor",
        fuelType: "Benzin",
        transmission: "Manuel",
        score: Math.floor(Math.random() * 20) + 70,
        description: "Citroen C3 (1.2 Puretech) için standart motor seçeneği.",
        pros: ["Uygun maliyetli bakım"],
        cons: ["Performans sınırlı"],
        chronicIssues: [],
      },
    ],
  },
  {
    vehicleId: 3018,
    engines: [
      {
        name: "Standart Motor",
        slug: "standart-motor",
        fuelType: "Benzin",
        transmission: "Manuel",
        score: Math.floor(Math.random() * 20) + 70,
        description: "Fiat Doblo (1.6 M.jet) için standart motor seçeneği.",
        pros: ["Uygun maliyetli bakım"],
        cons: ["Performans sınırlı"],
        chronicIssues: [],
      },
    ],
  },
  {
    vehicleId: 3019,
    engines: [
      {
        name: "Standart Motor",
        slug: "standart-motor",
        fuelType: "Benzin",
        transmission: "Manuel",
        score: Math.floor(Math.random() * 20) + 70,
        description: "Renault Megane 4 (1.5 dCi) için standart motor seçeneği.",
        pros: ["Uygun maliyetli bakım"],
        cons: ["Performans sınırlı"],
        chronicIssues: [],
      },
    ],
  },
  {
    vehicleId: 3020,
    engines: [
      {
        name: "Standart Motor",
        slug: "standart-motor",
        fuelType: "Benzin",
        transmission: "Manuel",
        score: Math.floor(Math.random() * 20) + 70,
        description: "Citroen C3 (1.2 Puretech) için standart motor seçeneği.",
        pros: ["Uygun maliyetli bakım"],
        cons: ["Performans sınırlı"],
        chronicIssues: [],
      },
    ],
  },
  {
    vehicleId: 3021,
    engines: [
      {
        name: "Standart Motor",
        slug: "standart-motor",
        fuelType: "Benzin",
        transmission: "Manuel",
        score: Math.floor(Math.random() * 20) + 70,
        description:
          "Renault Clio 5 (1.0 TCe - Icon Paket) için standart motor seçeneği.",
        pros: ["Uygun maliyetli bakım"],
        cons: ["Performans sınırlı"],
        chronicIssues: [],
      },
    ],
  },
  {
    vehicleId: 3022,
    engines: [
      {
        name: "Standart Motor",
        slug: "standart-motor",
        fuelType: "Benzin",
        transmission: "Manuel",
        score: Math.floor(Math.random() * 20) + 70,
        description: "Opel Insignia (1.6 Dizel) için standart motor seçeneği.",
        pros: ["Uygun maliyetli bakım"],
        cons: ["Performans sınırlı"],
        chronicIssues: [],
      },
    ],
  },
  {
    vehicleId: 3023,
    engines: [
      {
        name: "Standart Motor",
        slug: "standart-motor",
        fuelType: "Benzin",
        transmission: "Manuel",
        score: Math.floor(Math.random() * 20) + 70,
        description: "Seat Leon (1.6 TDI) için standart motor seçeneği.",
        pros: ["Uygun maliyetli bakım"],
        cons: ["Performans sınırlı"],
        chronicIssues: [],
      },
    ],
  },
  {
    vehicleId: 3024,
    engines: [
      {
        name: "Standart Motor",
        slug: "standart-motor",
        fuelType: "Benzin",
        transmission: "Manuel",
        score: Math.floor(Math.random() * 20) + 70,
        description:
          "Fiat Egea Sedan (1.6 Multijet Lounge) için standart motor seçeneği.",
        pros: ["Uygun maliyetli bakım"],
        cons: ["Performans sınırlı"],
        chronicIssues: [],
      },
    ],
  },
  {
    vehicleId: 3025,
    engines: [
      {
        name: "Standart Motor",
        slug: "standart-motor",
        fuelType: "Benzin",
        transmission: "Manuel",
        score: Math.floor(Math.random() * 20) + 70,
        description: "Honda City (1.5 Executive) için standart motor seçeneği.",
        pros: ["Uygun maliyetli bakım"],
        cons: ["Performans sınırlı"],
        chronicIssues: [],
      },
    ],
  },
  {
    vehicleId: 3026,
    engines: [
      {
        name: "Standart Motor",
        slug: "standart-motor",
        fuelType: "Benzin",
        transmission: "Manuel",
        score: Math.floor(Math.random() * 20) + 70,
        description:
          "Opel / Hyundai Corsa / i20 (1.2T / 1.0T) için standart motor seçeneği.",
        pros: ["Uygun maliyetli bakım"],
        cons: ["Performans sınırlı"],
        chronicIssues: [],
      },
    ],
  },
  {
    vehicleId: 3027,
    engines: [
      {
        name: "Standart Motor",
        slug: "standart-motor",
        fuelType: "Benzin",
        transmission: "Manuel",
        score: Math.floor(Math.random() * 20) + 70,
        description:
          "Fiat Egea Cross (1.6 Multijet Otomatik) için standart motor seçeneği.",
        pros: ["Uygun maliyetli bakım"],
        cons: ["Performans sınırlı"],
        chronicIssues: [],
      },
    ],
  },
  {
    vehicleId: 3028,
    engines: [
      {
        name: "Standart Motor",
        slug: "standart-motor",
        fuelType: "Benzin",
        transmission: "Manuel",
        score: Math.floor(Math.random() * 20) + 70,
        description:
          "Opel Astra K Kasa (1.6 Dizel Otomatik) için standart motor seçeneği.",
        pros: ["Uygun maliyetli bakım"],
        cons: ["Performans sınırlı"],
        chronicIssues: [],
      },
    ],
  },
  {
    vehicleId: 3029,
    engines: [
      {
        name: "Standart Motor",
        slug: "standart-motor",
        fuelType: "Benzin",
        transmission: "Manuel",
        score: Math.floor(Math.random() * 20) + 70,
        description:
          "Opel Corsa (1.2 Turbo Otomatik) için standart motor seçeneği.",
        pros: ["Uygun maliyetli bakım"],
        cons: ["Performans sınırlı"],
        chronicIssues: [],
      },
    ],
  },
  {
    vehicleId: 3030,
    engines: [
      {
        name: "Standart Motor",
        slug: "standart-motor",
        fuelType: "Benzin",
        transmission: "Manuel",
        score: Math.floor(Math.random() * 20) + 70,
        description:
          "Opel / Peugeot Astra / 308 (1.2 Puretech) için standart motor seçeneği.",
        pros: ["Uygun maliyetli bakım"],
        cons: ["Performans sınırlı"],
        chronicIssues: [],
      },
    ],
  },
  {
    vehicleId: 3031,
    engines: [
      {
        name: "Standart Motor",
        slug: "standart-motor",
        fuelType: "Benzin",
        transmission: "Manuel",
        score: Math.floor(Math.random() * 20) + 70,
        description: "Citroen C4X (1.2 Turbo) için standart motor seçeneği.",
        pros: ["Uygun maliyetli bakım"],
        cons: ["Performans sınırlı"],
        chronicIssues: [],
      },
    ],
  },
  {
    vehicleId: 3032,
    engines: [
      {
        name: "Standart Motor",
        slug: "standart-motor",
        fuelType: "Benzin",
        transmission: "Manuel",
        score: Math.floor(Math.random() * 20) + 70,
        description:
          "Ford Focus 4 (1.5 Dizel - Trend X) için standart motor seçeneği.",
        pros: ["Uygun maliyetli bakım"],
        cons: ["Performans sınırlı"],
        chronicIssues: [],
      },
    ],
  },
  {
    vehicleId: 3033,
    engines: [
      {
        name: "Standart Motor",
        slug: "standart-motor",
        fuelType: "Benzin",
        transmission: "Manuel",
        score: Math.floor(Math.random() * 20) + 70,
        description:
          "Toyota Corolla (1.8 Hybrid - Dream) için standart motor seçeneği.",
        pros: ["Uygun maliyetli bakım"],
        cons: ["Performans sınırlı"],
        chronicIssues: [],
      },
    ],
  },
  {
    vehicleId: 3034,
    engines: [
      {
        name: "Standart Motor",
        slug: "standart-motor",
        fuelType: "Benzin",
        transmission: "Manuel",
        score: Math.floor(Math.random() * 20) + 70,
        description:
          "Skoda Scala (1.0 TSI - Elite/Premium) için standart motor seçeneği.",
        pros: ["Uygun maliyetli bakım"],
        cons: ["Performans sınırlı"],
        chronicIssues: [],
      },
    ],
  },
  {
    vehicleId: 3035,
    engines: [
      {
        name: "Standart Motor",
        slug: "standart-motor",
        fuelType: "Benzin",
        transmission: "Manuel",
        score: Math.floor(Math.random() * 20) + 70,
        description:
          "Dacia / Renault Duster / Megane 4 (1.3 TCe) için standart motor seçeneği.",
        pros: ["Uygun maliyetli bakım"],
        cons: ["Performans sınırlı"],
        chronicIssues: [],
      },
    ],
  },
  {
    vehicleId: 3036,
    engines: [
      {
        name: "Standart Motor",
        slug: "standart-motor",
        fuelType: "Benzin",
        transmission: "Manuel",
        score: Math.floor(Math.random() * 20) + 70,
        description:
          "Seat / VW Arona / T-Cross (1.0 TSI) için standart motor seçeneği.",
        pros: ["Uygun maliyetli bakım"],
        cons: ["Performans sınırlı"],
        chronicIssues: [],
      },
    ],
  },
  {
    vehicleId: 3037,
    engines: [
      {
        name: "Standart Motor",
        slug: "standart-motor",
        fuelType: "Benzin",
        transmission: "Manuel",
        score: Math.floor(Math.random() * 20) + 70,
        description: "Ford Puma (1.0 Titanium) için standart motor seçeneği.",
        pros: ["Uygun maliyetli bakım"],
        cons: ["Performans sınırlı"],
        chronicIssues: [],
      },
    ],
  },
  {
    vehicleId: 3038,
    engines: [
      {
        name: "Standart Motor",
        slug: "standart-motor",
        fuelType: "Benzin",
        transmission: "Manuel",
        score: Math.floor(Math.random() * 20) + 70,
        description:
          "Toyota Corolla (1.5 Drive/Dream) için standart motor seçeneği.",
        pros: ["Uygun maliyetli bakım"],
        cons: ["Performans sınırlı"],
        chronicIssues: [],
      },
    ],
  },
  {
    vehicleId: 3039,
    engines: [
      {
        name: "Standart Motor",
        slug: "standart-motor",
        fuelType: "Benzin",
        transmission: "Manuel",
        score: Math.floor(Math.random() * 20) + 70,
        description:
          "Citroen C3 Aircross (1.2 Plus) için standart motor seçeneği.",
        pros: ["Uygun maliyetli bakım"],
        cons: ["Performans sınırlı"],
        chronicIssues: [],
      },
    ],
  },
  {
    vehicleId: 3040,
    engines: [
      {
        name: "Standart Motor",
        slug: "standart-motor",
        fuelType: "Benzin",
        transmission: "Manuel",
        score: Math.floor(Math.random() * 20) + 70,
        description:
          "DS Automobiles DS 9 (1.6 Puretech) için standart motor seçeneği.",
        pros: ["Uygun maliyetli bakım"],
        cons: ["Performans sınırlı"],
        chronicIssues: [],
      },
    ],
  },
  {
    vehicleId: 3041,
    engines: [
      {
        name: "Standart Motor",
        slug: "standart-motor",
        fuelType: "Benzin",
        transmission: "Manuel",
        score: Math.floor(Math.random() * 20) + 70,
        description: "Peugeot 508 GT (1.5 Dizel) için standart motor seçeneği.",
        pros: ["Uygun maliyetli bakım"],
        cons: ["Performans sınırlı"],
        chronicIssues: [],
      },
    ],
  },
  {
    vehicleId: 3042,
    engines: [
      {
        name: "Standart Motor",
        slug: "standart-motor",
        fuelType: "Benzin",
        transmission: "Manuel",
        score: Math.floor(Math.random() * 20) + 70,
        description: "Skoda Octavia (1.5 e-TEC) için standart motor seçeneği.",
        pros: ["Uygun maliyetli bakım"],
        cons: ["Performans sınırlı"],
        chronicIssues: [],
      },
    ],
  },
  {
    vehicleId: 3043,
    engines: [
      {
        name: "Standart Motor",
        slug: "standart-motor",
        fuelType: "Benzin",
        transmission: "Manuel",
        score: Math.floor(Math.random() * 20) + 70,
        description:
          "Volkswagen Passat Variant B9 (1.5 eTSI) için standart motor seçeneği.",
        pros: ["Uygun maliyetli bakım"],
        cons: ["Performans sınırlı"],
        chronicIssues: [],
      },
    ],
  },
  {
    vehicleId: 3044,
    engines: [
      {
        name: "Standart Motor",
        slug: "standart-motor",
        fuelType: "Benzin",
        transmission: "Manuel",
        score: Math.floor(Math.random() * 20) + 70,
        description:
          "DS Automobiles DS 7 Crossback (1.5 Dizel) için standart motor seçeneği.",
        pros: ["Uygun maliyetli bakım"],
        cons: ["Performans sınırlı"],
        chronicIssues: [],
      },
    ],
  },
  {
    vehicleId: 4001,
    engines: [
      {
        slug: "standart-motor",
        name: "Standart Motor",
        fuelType: "Benzin",
        transmission: "Manuel",
        score: 60,
        description: "Bu araç için genel geçerli standart motor.",
        chronicIssues: [
          {
            title: "Genel Yağ Eksiltme",
            description: "Yaşına bağlı yağ eksiltme.",
            severity: "medium",
            reportCount: 7,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 4002,
    engines: [
      {
        slug: "standart-motor",
        name: "Standart Motor",
        fuelType: "Benzin",
        transmission: "Manuel",
        score: 60,
        description: "Bu araç için genel geçerli standart motor.",
        chronicIssues: [
          {
            title: "Genel Yağ Eksiltme",
            description: "Yaşına bağlı yağ eksiltme.",
            severity: "medium",
            reportCount: 7,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 4004,
    engines: [
      {
        slug: "standart-motor",
        name: "Standart Motor",
        fuelType: "Benzin",
        transmission: "Manuel",
        score: 60,
        description: "Bu araç için genel geçerli standart motor.",
        chronicIssues: [
          {
            title: "Genel Yağ Eksiltme",
            description: "Yaşına bağlı yağ eksiltme.",
            severity: "medium",
            reportCount: 7,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 4005,
    engines: [
      {
        slug: "standart-motor",
        name: "Standart Motor",
        fuelType: "Benzin",
        transmission: "Manuel",
        score: 60,
        description: "Bu araç için genel geçerli standart motor.",
        chronicIssues: [
          {
            title: "Genel Yağ Eksiltme",
            description: "Yaşına bağlı yağ eksiltme.",
            severity: "medium",
            reportCount: 7,
          },
        ],
      },
    ],
  },
  {
    vehicleId: 4006,
    engines: [
      {
        slug: "standart-motor",
        name: "Standart Motor",
        fuelType: "Benzin",
        transmission: "Manuel",
        score: 60,
        description: "Bu araç için genel geçerli standart motor.",
        chronicIssues: [
          {
            title: "Genel Yağ Eksiltme",
            description: "Yaşına bağlı yağ eksiltme.",
            severity: "medium",
            reportCount: 7,
          },
        ],
      },
    ],
  },
];
