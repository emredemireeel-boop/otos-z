export interface EngineOption {
    slug: string;
    name: string;
    fuelType: 'Benzin' | 'Dizel' | 'Elektrik' | 'Hibrit';
    transmission: string;
    score: number;
    issues: string[];
}

export interface VehicleEngineData {
    vehicleId: number;
    engines: EngineOption[];
}

// Helper to generate IDs
const generateId = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');

export const engineDNAData: VehicleEngineData[] = [
    {
        vehicleId: 1,
        engines: [
            { slug: "10-tce-90-hp-benzin-manuel-x-tronic", name: "1.0 TCe 90 HP", fuelType: "Benzin", transmission: "Manuel / X-Tronic", score: 85, issues: ["Erken debriyaj aşınması","Turbo valfi sesi"] },
            { slug: "15-dci-110-hp-dizel-manuel-edc", name: "1.5 dCi 110 HP", fuelType: "Dizel", transmission: "Manuel / EDC", score: 92, issues: ["EGR valfi tıkanıklığı","Partikül filtresi dolumu"] },
            { slug: "13-tce-140-hp-benzin-edc", name: "1.3 TCe 140 HP", fuelType: "Benzin", transmission: "EDC", score: 88, issues: ["Kavrama ısınması (Şehir içi)","Yağ eksiltme"] },
            { slug: "16-e-tech-140-hp-hibrit-otomatik", name: "1.6 E-Tech 140 HP", fuelType: "Hibrit", transmission: "Otomatik", score: 90, issues: ["Yazılım güncellemeleri gereksinimi","Vites geçişlerinde kararsızlık"] },
        ]
    },
    {
        vehicleId: 2,
        engines: [
            { slug: "14-fire-95-hp-benzin-manuel", name: "1.4 Fire 95 HP", fuelType: "Benzin", transmission: "Manuel", score: 90, issues: ["Yüksek yağ tüketimi","Performans eksikliği"] },
            { slug: "13-multijet-95-hp-dizel-manuel", name: "1.3 Multijet 95 HP", fuelType: "Dizel", transmission: "Manuel", score: 95, issues: ["EGR tıkanması","Baskı balata ömrü"] },
            { slug: "16-multijet-120-hp-dizel-manuel-dct", name: "1.6 Multijet 120 HP", fuelType: "Dizel", transmission: "Manuel / DCT", score: 85, issues: ["Volant arızası","DCT kavrama ısınması"] },
            { slug: "15-t4-hibrit-130-hp-hibrit-dct", name: "1.5 T4 Hibrit 130 HP", fuelType: "Hibrit", transmission: "DCT", score: 87, issues: ["Elektrik motoru geçiş sarsıntısı"] },
        ]
    },
    {
        vehicleId: 3,
        engines: [
            { slug: "15-dynamic-force-125-hp-benzin-multidrive-s", name: "1.5 Dynamic Force 125 HP", fuelType: "Benzin", transmission: "Multidrive S", score: 94, issues: ["CVT şanzıman ısınması","Yüksek devirde ses"] },
            { slug: "18-hybrid-122-hp-hibrit-e-cvt", name: "1.8 Hybrid 122 HP", fuelType: "Hibrit", transmission: "e-CVT", score: 98, issues: ["Batarya kapasite düşüşü (Uzun vadede)","EGR valfi kirlenmesi"] },
            { slug: "16-valvematic-132-hp-benzin-manuel-multidrive-s", name: "1.6 Valvematic 132 HP", fuelType: "Benzin", transmission: "Manuel / Multidrive S", score: 96, issues: ["Krank keçesi terlemesi"] },
        ]
    },
    {
        vehicleId: 4,
        engines: [
            { slug: "10-tce-90-hp-benzin-manuel-x-tronic", name: "1.0 TCe 90 HP", fuelType: "Benzin", transmission: "Manuel / X-Tronic", score: 85, issues: ["Erken debriyaj aşınması","Turbo valfi sesi"] },
            { slug: "15-dci-110-hp-dizel-manuel-edc", name: "1.5 dCi 110 HP", fuelType: "Dizel", transmission: "Manuel / EDC", score: 92, issues: ["EGR valfi tıkanıklığı","Partikül filtresi dolumu"] },
            { slug: "13-tce-140-hp-benzin-edc", name: "1.3 TCe 140 HP", fuelType: "Benzin", transmission: "EDC", score: 88, issues: ["Kavrama ısınması (Şehir içi)","Yağ eksiltme"] },
            { slug: "16-e-tech-140-hp-hibrit-otomatik", name: "1.6 E-Tech 140 HP", fuelType: "Hibrit", transmission: "Otomatik", score: 90, issues: ["Yazılım güncellemeleri gereksinimi","Vites geçişlerinde kararsızlık"] },
        ]
    },
    {
        vehicleId: 5,
        engines: [
            { slug: "15-vtec-turbo-182-hp-benzin-cvt", name: "1.5 VTEC Turbo 182 HP", fuelType: "Benzin", transmission: "CVT", score: 94, issues: ["Yağa benzin karışması (Bazı seriler)","Direksiyon kutusu tıkırtısı"] },
            { slug: "16-i-dtec-120-hp-dizel-otomatik", name: "1.6 i-DTEC 120 HP", fuelType: "Dizel", transmission: "Otomatik", score: 93, issues: ["DPF dolumu","Şanzıman yağı değişim hassasiyeti"] },
            { slug: "15-ehev-hibrit-hibrit-e-cvt", name: "1.5 e:HEV Hibrit", fuelType: "Hibrit", transmission: "e-CVT", score: 95, issues: ["Akü ömrü kısallığı","Kış aylarında düşük yakıt verimliliği"] },
        ]
    },
    {
        vehicleId: 6,
        engines: [
            { slug: "10-tsi-110-hp-benzin-dsg", name: "1.0 TSI 110 HP", fuelType: "Benzin", transmission: "DSG", score: 88, issues: ["Kavrama titremesi (DSG)","Mekatronik arızası"] },
            { slug: "15-tsi-150-hp-benzin-dsg", name: "1.5 TSI 150 HP", fuelType: "Benzin", transmission: "DSG", score: 89, issues: ["Soğuk marşta titreme","DSG mekatronik basınç tüpü"] },
            { slug: "16-tdi-120-hp-dizel-dsg", name: "1.6 TDI 120 HP", fuelType: "Dizel", transmission: "DSG", score: 85, issues: ["EGR valfi arızası","Su pompası sızıntısı","Enjektör arızası"] },
            { slug: "20-tdi-150-hp-dizel-dsg", name: "2.0 TDI 150 HP", fuelType: "Dizel", transmission: "DSG", score: 91, issues: ["DPF dolumu","AdBlue sistemi sorunları"] },
        ]
    },
    {
        vehicleId: 7,
        engines: [
            { slug: "10-tce-90-hp-benzin-manuel-x-tronic", name: "1.0 TCe 90 HP", fuelType: "Benzin", transmission: "Manuel / X-Tronic", score: 85, issues: ["Erken debriyaj aşınması","Turbo valfi sesi"] },
            { slug: "15-dci-110-hp-dizel-manuel-edc", name: "1.5 dCi 110 HP", fuelType: "Dizel", transmission: "Manuel / EDC", score: 92, issues: ["EGR valfi tıkanıklığı","Partikül filtresi dolumu"] },
            { slug: "13-tce-140-hp-benzin-edc", name: "1.3 TCe 140 HP", fuelType: "Benzin", transmission: "EDC", score: 88, issues: ["Kavrama ısınması (Şehir içi)","Yağ eksiltme"] },
            { slug: "16-e-tech-140-hp-hibrit-otomatik", name: "1.6 E-Tech 140 HP", fuelType: "Hibrit", transmission: "Otomatik", score: 90, issues: ["Yazılım güncellemeleri gereksinimi","Vites geçişlerinde kararsızlık"] },
        ]
    },
    {
        vehicleId: 8,
        engines: [
            { slug: "14-mpi-100-hp-benzin-manuel-otomatik", name: "1.4 MPI 100 HP", fuelType: "Benzin", transmission: "Manuel / Otomatik", score: 93, issues: ["Katalitik konvertör hassasiyeti","Performans eksikliği"] },
            { slug: "10-t-gdi-100-hp-benzin-dct", name: "1.0 T-GDI 100 HP", fuelType: "Benzin", transmission: "DCT", score: 86, issues: ["Kuru tip DCT kavrama titremesi","Turbo selenoid valfi"] },
            { slug: "14-crdi-90-hp-dizel-manuel", name: "1.4 CRDi 90 HP", fuelType: "Dizel", transmission: "Manuel", score: 92, issues: ["DPF rejenerasyon sıklığı","Enjektör kirlenmesi"] },
            { slug: "16-t-gdi-177-hp-benzin-dct", name: "1.6 T-GDI 177 HP", fuelType: "Benzin", transmission: "DCT", score: 84, issues: ["Şanzıman aşırı ısınma uyarısı","Kavrama ömrü"] },
        ]
    },
    {
        vehicleId: 901,
        engines: [
            { slug: "12-puretech-130-hp-benzin-eat8", name: "1.2 PureTech 130 HP", fuelType: "Benzin", transmission: "EAT8", score: 80, issues: ["Triger kayışı parçalanması","Yüksek yağ tüketimi","Vakum pompası tıkanması"] },
            { slug: "15-bluehdi-130-hp-dizel-eat8", name: "1.5 BlueHDi 130 HP", fuelType: "Dizel", transmission: "EAT8", score: 82, issues: ["AdBlue deposu arızası","EGR valfi tıkanması","AdBlue pompası"] },
        ]
    },
    {
        vehicleId: 902,
        engines: [
            { slug: "12-puretech-130-hp-benzin-eat8", name: "1.2 PureTech 130 HP", fuelType: "Benzin", transmission: "EAT8", score: 80, issues: ["Triger kayışı parçalanması","Yüksek yağ tüketimi","Vakum pompası tıkanması"] },
            { slug: "15-bluehdi-130-hp-dizel-eat8", name: "1.5 BlueHDi 130 HP", fuelType: "Dizel", transmission: "EAT8", score: 82, issues: ["AdBlue deposu arızası","EGR valfi tıkanması","AdBlue pompası"] },
        ]
    },
    {
        vehicleId: 10,
        engines: [
            { slug: "12-puretech-130-hp-benzin-eat8", name: "1.2 PureTech 130 HP", fuelType: "Benzin", transmission: "EAT8", score: 80, issues: ["Triger kayışı parçalanması","Yüksek yağ tüketimi","Vakum pompası tıkanması"] },
            { slug: "15-bluehdi-130-hp-dizel-eat8", name: "1.5 BlueHDi 130 HP", fuelType: "Dizel", transmission: "EAT8", score: 82, issues: ["AdBlue deposu arızası","EGR valfi tıkanması","AdBlue pompası"] },
        ]
    },
    {
        vehicleId: 11,
        engines: [
            { slug: "v1-standart-menzil-elektrik-tek-vites", name: "V1 Standart Menzil", fuelType: "Elektrik", transmission: "Tek Vites", score: 87, issues: ["Ekran arayüzü donmaları","Mobil uygulama senkronizasyonu","Şarj istasyonu tanıma hataları"] },
            { slug: "v2-uzun-menzil-elektrik-tek-vites", name: "V2 Uzun Menzil", fuelType: "Elektrik", transmission: "Tek Vites", score: 88, issues: ["Yazılımsal hatalar","Kamera sensör buğulanması"] },
        ]
    },
    {
        vehicleId: 12,
        engines: [
            { slug: "16-tgdi-183-hp-benzin-7-dct", name: "1.6 TGDI 183 HP", fuelType: "Benzin", transmission: "7-DCT", score: 82, issues: ["Şanzıman kararsızlığı","Yüksek yakıt tüketimi","Yazılım hataları"] },
            { slug: "phev-hibrit-hibrit-dht", name: "PHEV Hibrit", fuelType: "Hibrit", transmission: "DHT", score: 85, issues: ["Batarya menzil tutarsızlığı","Şarj uyumluluğu"] },
        ]
    },
    {
        vehicleId: 13,
        engines: [
            { slug: "10-tsi-110-hp-benzin-dsg", name: "1.0 TSI 110 HP", fuelType: "Benzin", transmission: "DSG", score: 88, issues: ["Kavrama titremesi (DSG)","Mekatronik arızası"] },
            { slug: "15-tsi-150-hp-benzin-dsg", name: "1.5 TSI 150 HP", fuelType: "Benzin", transmission: "DSG", score: 89, issues: ["Soğuk marşta titreme","DSG mekatronik basınç tüpü"] },
            { slug: "16-tdi-120-hp-dizel-dsg", name: "1.6 TDI 120 HP", fuelType: "Dizel", transmission: "DSG", score: 85, issues: ["EGR valfi arızası","Su pompası sızıntısı","Enjektör arızası"] },
            { slug: "20-tdi-150-hp-dizel-dsg", name: "2.0 TDI 150 HP", fuelType: "Dizel", transmission: "DSG", score: 91, issues: ["DPF dolumu","AdBlue sistemi sorunları"] },
        ]
    },
    {
        vehicleId: 14,
        engines: [
            { slug: "14-benzinli-benzin-otomatik", name: "1.4 Benzinli", fuelType: "Benzin", transmission: "Otomatik", score: 85, issues: ["Yakıt pompası","Ateşleme bobini"] },
            { slug: "16-dizel-dizel-manuel", name: "1.6 Dizel", fuelType: "Dizel", transmission: "Manuel", score: 88, issues: ["DPF rejenerasyonu","Enjektörler"] },
        ]
    },
    {
        vehicleId: 15,
        engines: [
            { slug: "14-benzinli-benzin-otomatik", name: "1.4 Benzinli", fuelType: "Benzin", transmission: "Otomatik", score: 85, issues: ["Yakıt pompası","Ateşleme bobini"] },
            { slug: "16-dizel-dizel-manuel", name: "1.6 Dizel", fuelType: "Dizel", transmission: "Manuel", score: 88, issues: ["DPF rejenerasyonu","Enjektörler"] },
        ]
    },
    {
        vehicleId: 16,
        engines: [
            { slug: "14-benzinli-benzin-otomatik", name: "1.4 Benzinli", fuelType: "Benzin", transmission: "Otomatik", score: 85, issues: ["Yakıt pompası","Ateşleme bobini"] },
            { slug: "16-dizel-dizel-manuel", name: "1.6 Dizel", fuelType: "Dizel", transmission: "Manuel", score: 88, issues: ["DPF rejenerasyonu","Enjektörler"] },
        ]
    },
    {
        vehicleId: 17,
        engines: [
            { slug: "16-tgdi-183-hp-benzin-7-dct", name: "1.6 TGDI 183 HP", fuelType: "Benzin", transmission: "7-DCT", score: 82, issues: ["Şanzıman kararsızlığı","Yüksek yakıt tüketimi","Yazılım hataları"] },
            { slug: "phev-hibrit-hibrit-dht", name: "PHEV Hibrit", fuelType: "Hibrit", transmission: "DHT", score: 85, issues: ["Batarya menzil tutarsızlığı","Şarj uyumluluğu"] },
        ]
    },
    {
        vehicleId: 18,
        engines: [
            { slug: "14-benzinli-benzin-otomatik", name: "1.4 Benzinli", fuelType: "Benzin", transmission: "Otomatik", score: 85, issues: ["Yakıt pompası","Ateşleme bobini"] },
            { slug: "16-dizel-dizel-manuel", name: "1.6 Dizel", fuelType: "Dizel", transmission: "Manuel", score: 88, issues: ["DPF rejenerasyonu","Enjektörler"] },
        ]
    },
    {
        vehicleId: 19,
        engines: [
            { slug: "14-mpi-100-hp-benzin-manuel-otomatik", name: "1.4 MPI 100 HP", fuelType: "Benzin", transmission: "Manuel / Otomatik", score: 93, issues: ["Katalitik konvertör hassasiyeti","Performans eksikliği"] },
            { slug: "10-t-gdi-100-hp-benzin-dct", name: "1.0 T-GDI 100 HP", fuelType: "Benzin", transmission: "DCT", score: 86, issues: ["Kuru tip DCT kavrama titremesi","Turbo selenoid valfi"] },
            { slug: "14-crdi-90-hp-dizel-manuel", name: "1.4 CRDi 90 HP", fuelType: "Dizel", transmission: "Manuel", score: 92, issues: ["DPF rejenerasyon sıklığı","Enjektör kirlenmesi"] },
            { slug: "16-t-gdi-177-hp-benzin-dct", name: "1.6 T-GDI 177 HP", fuelType: "Benzin", transmission: "DCT", score: 84, issues: ["Şanzıman aşırı ısınma uyarısı","Kavrama ömrü"] },
        ]
    },
    {
        vehicleId: 20,
        engines: [
            { slug: "14-mpi-100-hp-benzin-manuel-otomatik", name: "1.4 MPI 100 HP", fuelType: "Benzin", transmission: "Manuel / Otomatik", score: 93, issues: ["Katalitik konvertör hassasiyeti","Performans eksikliği"] },
            { slug: "10-t-gdi-100-hp-benzin-dct", name: "1.0 T-GDI 100 HP", fuelType: "Benzin", transmission: "DCT", score: 86, issues: ["Kuru tip DCT kavrama titremesi","Turbo selenoid valfi"] },
            { slug: "14-crdi-90-hp-dizel-manuel", name: "1.4 CRDi 90 HP", fuelType: "Dizel", transmission: "Manuel", score: 92, issues: ["DPF rejenerasyon sıklığı","Enjektör kirlenmesi"] },
            { slug: "16-t-gdi-177-hp-benzin-dct", name: "1.6 T-GDI 177 HP", fuelType: "Benzin", transmission: "DCT", score: 84, issues: ["Şanzıman aşırı ısınma uyarısı","Kavrama ömrü"] },
        ]
    },
    {
        vehicleId: 21,
        engines: [
            { slug: "12-puretech-130-hp-benzin-eat8", name: "1.2 PureTech 130 HP", fuelType: "Benzin", transmission: "EAT8", score: 80, issues: ["Triger kayışı parçalanması","Yüksek yağ tüketimi","Vakum pompası tıkanması"] },
            { slug: "15-bluehdi-130-hp-dizel-eat8", name: "1.5 BlueHDi 130 HP", fuelType: "Dizel", transmission: "EAT8", score: 82, issues: ["AdBlue deposu arızası","EGR valfi tıkanması","AdBlue pompası"] },
        ]
    },
    {
        vehicleId: 22,
        engines: [
            { slug: "12-puretech-130-hp-benzin-eat8", name: "1.2 PureTech 130 HP", fuelType: "Benzin", transmission: "EAT8", score: 80, issues: ["Triger kayışı parçalanması","Yüksek yağ tüketimi","Vakum pompası tıkanması"] },
            { slug: "15-bluehdi-130-hp-dizel-eat8", name: "1.5 BlueHDi 130 HP", fuelType: "Dizel", transmission: "EAT8", score: 82, issues: ["AdBlue deposu arızası","EGR valfi tıkanması","AdBlue pompası"] },
        ]
    },
    {
        vehicleId: 23,
        engines: [
            { slug: "15-vtec-turbo-182-hp-benzin-cvt", name: "1.5 VTEC Turbo 182 HP", fuelType: "Benzin", transmission: "CVT", score: 94, issues: ["Yağa benzin karışması (Bazı seriler)","Direksiyon kutusu tıkırtısı"] },
            { slug: "16-i-dtec-120-hp-dizel-otomatik", name: "1.6 i-DTEC 120 HP", fuelType: "Dizel", transmission: "Otomatik", score: 93, issues: ["DPF dolumu","Şanzıman yağı değişim hassasiyeti"] },
            { slug: "15-ehev-hibrit-hibrit-e-cvt", name: "1.5 e:HEV Hibrit", fuelType: "Hibrit", transmission: "e-CVT", score: 95, issues: ["Akü ömrü kısallığı","Kış aylarında düşük yakıt verimliliği"] },
        ]
    },
    {
        vehicleId: 24,
        engines: [
            { slug: "10-tsi-110-hp-benzin-dsg", name: "1.0 TSI 110 HP", fuelType: "Benzin", transmission: "DSG", score: 88, issues: ["Kavrama titremesi (DSG)","Mekatronik arızası"] },
            { slug: "15-tsi-150-hp-benzin-dsg", name: "1.5 TSI 150 HP", fuelType: "Benzin", transmission: "DSG", score: 89, issues: ["Soğuk marşta titreme","DSG mekatronik basınç tüpü"] },
            { slug: "16-tdi-120-hp-dizel-dsg", name: "1.6 TDI 120 HP", fuelType: "Dizel", transmission: "DSG", score: 85, issues: ["EGR valfi arızası","Su pompası sızıntısı","Enjektör arızası"] },
            { slug: "20-tdi-150-hp-dizel-dsg", name: "2.0 TDI 150 HP", fuelType: "Dizel", transmission: "DSG", score: 91, issues: ["DPF dolumu","AdBlue sistemi sorunları"] },
        ]
    },
    {
        vehicleId: 25,
        engines: [
            { slug: "12-puretech-130-hp-benzin-eat8", name: "1.2 PureTech 130 HP", fuelType: "Benzin", transmission: "EAT8", score: 80, issues: ["Triger kayışı parçalanması","Yüksek yağ tüketimi","Vakum pompası tıkanması"] },
            { slug: "15-bluehdi-130-hp-dizel-eat8", name: "1.5 BlueHDi 130 HP", fuelType: "Dizel", transmission: "EAT8", score: 82, issues: ["AdBlue deposu arızası","EGR valfi tıkanması","AdBlue pompası"] },
        ]
    },
    {
        vehicleId: 26,
        engines: [
            { slug: "10-tsi-110-hp-benzin-dsg", name: "1.0 TSI 110 HP", fuelType: "Benzin", transmission: "DSG", score: 88, issues: ["Kavrama titremesi (DSG)","Mekatronik arızası"] },
            { slug: "15-tsi-150-hp-benzin-dsg", name: "1.5 TSI 150 HP", fuelType: "Benzin", transmission: "DSG", score: 89, issues: ["Soğuk marşta titreme","DSG mekatronik basınç tüpü"] },
            { slug: "16-tdi-120-hp-dizel-dsg", name: "1.6 TDI 120 HP", fuelType: "Dizel", transmission: "DSG", score: 85, issues: ["EGR valfi arızası","Su pompası sızıntısı","Enjektör arızası"] },
            { slug: "20-tdi-150-hp-dizel-dsg", name: "2.0 TDI 150 HP", fuelType: "Dizel", transmission: "DSG", score: 91, issues: ["DPF dolumu","AdBlue sistemi sorunları"] },
        ]
    },
    {
        vehicleId: 27,
        engines: [
            { slug: "10-tsi-110-hp-benzin-dsg", name: "1.0 TSI 110 HP", fuelType: "Benzin", transmission: "DSG", score: 88, issues: ["Kavrama titremesi (DSG)","Mekatronik arızası"] },
            { slug: "15-tsi-150-hp-benzin-dsg", name: "1.5 TSI 150 HP", fuelType: "Benzin", transmission: "DSG", score: 89, issues: ["Soğuk marşta titreme","DSG mekatronik basınç tüpü"] },
            { slug: "16-tdi-120-hp-dizel-dsg", name: "1.6 TDI 120 HP", fuelType: "Dizel", transmission: "DSG", score: 85, issues: ["EGR valfi arızası","Su pompası sızıntısı","Enjektör arızası"] },
            { slug: "20-tdi-150-hp-dizel-dsg", name: "2.0 TDI 150 HP", fuelType: "Dizel", transmission: "DSG", score: 91, issues: ["DPF dolumu","AdBlue sistemi sorunları"] },
        ]
    },
    {
        vehicleId: 28,
        engines: [
            { slug: "16-tgdi-183-hp-benzin-7-dct", name: "1.6 TGDI 183 HP", fuelType: "Benzin", transmission: "7-DCT", score: 82, issues: ["Şanzıman kararsızlığı","Yüksek yakıt tüketimi","Yazılım hataları"] },
            { slug: "phev-hibrit-hibrit-dht", name: "PHEV Hibrit", fuelType: "Hibrit", transmission: "DHT", score: 85, issues: ["Batarya menzil tutarsızlığı","Şarj uyumluluğu"] },
        ]
    },
    {
        vehicleId: 29,
        engines: [
            { slug: "10-tsi-110-hp-benzin-dsg", name: "1.0 TSI 110 HP", fuelType: "Benzin", transmission: "DSG", score: 88, issues: ["Kavrama titremesi (DSG)","Mekatronik arızası"] },
            { slug: "15-tsi-150-hp-benzin-dsg", name: "1.5 TSI 150 HP", fuelType: "Benzin", transmission: "DSG", score: 89, issues: ["Soğuk marşta titreme","DSG mekatronik basınç tüpü"] },
            { slug: "16-tdi-120-hp-dizel-dsg", name: "1.6 TDI 120 HP", fuelType: "Dizel", transmission: "DSG", score: 85, issues: ["EGR valfi arızası","Su pompası sızıntısı","Enjektör arızası"] },
            { slug: "20-tdi-150-hp-dizel-dsg", name: "2.0 TDI 150 HP", fuelType: "Dizel", transmission: "DSG", score: 91, issues: ["DPF dolumu","AdBlue sistemi sorunları"] },
        ]
    },
    {
        vehicleId: 30,
        engines: [
            { slug: "rwd-elektrik-tek-vites", name: "RWD", fuelType: "Elektrik", transmission: "Tek Vites", score: 92, issues: ["Boya kalitesi problemleri","Ekran donmaları","Süspansiyon burçları"] },
            { slug: "long-range-dual-motor-elektrik-tek-vites", name: "Long Range Dual Motor", fuelType: "Elektrik", transmission: "Tek Vites", score: 90, issues: ["Şarj kapağı sensörü","Isı pompası arızası (Soğuk havada)"] },
            { slug: "performance-elektrik-tek-vites", name: "Performance", fuelType: "Elektrik", transmission: "Tek Vites", score: 88, issues: ["Lastik aşınması","Fren diski eğrilmesi"] },
        ]
    },
    {
        vehicleId: 31,
        engines: [
            { slug: "14-mpi-100-hp-benzin-manuel-otomatik", name: "1.4 MPI 100 HP", fuelType: "Benzin", transmission: "Manuel / Otomatik", score: 93, issues: ["Katalitik konvertör hassasiyeti","Performans eksikliği"] },
            { slug: "10-t-gdi-100-hp-benzin-dct", name: "1.0 T-GDI 100 HP", fuelType: "Benzin", transmission: "DCT", score: 86, issues: ["Kuru tip DCT kavrama titremesi","Turbo selenoid valfi"] },
            { slug: "14-crdi-90-hp-dizel-manuel", name: "1.4 CRDi 90 HP", fuelType: "Dizel", transmission: "Manuel", score: 92, issues: ["DPF rejenerasyon sıklığı","Enjektör kirlenmesi"] },
            { slug: "16-t-gdi-177-hp-benzin-dct", name: "1.6 T-GDI 177 HP", fuelType: "Benzin", transmission: "DCT", score: 84, issues: ["Şanzıman aşırı ısınma uyarısı","Kavrama ömrü"] },
        ]
    },
    {
        vehicleId: 32,
        engines: [
            { slug: "14-mpi-100-hp-benzin-manuel-otomatik", name: "1.4 MPI 100 HP", fuelType: "Benzin", transmission: "Manuel / Otomatik", score: 93, issues: ["Katalitik konvertör hassasiyeti","Performans eksikliği"] },
            { slug: "10-t-gdi-100-hp-benzin-dct", name: "1.0 T-GDI 100 HP", fuelType: "Benzin", transmission: "DCT", score: 86, issues: ["Kuru tip DCT kavrama titremesi","Turbo selenoid valfi"] },
            { slug: "14-crdi-90-hp-dizel-manuel", name: "1.4 CRDi 90 HP", fuelType: "Dizel", transmission: "Manuel", score: 92, issues: ["DPF rejenerasyon sıklığı","Enjektör kirlenmesi"] },
            { slug: "16-t-gdi-177-hp-benzin-dct", name: "1.6 T-GDI 177 HP", fuelType: "Benzin", transmission: "DCT", score: 84, issues: ["Şanzıman aşırı ısınma uyarısı","Kavrama ömrü"] },
        ]
    },
    {
        vehicleId: 33,
        engines: [
            { slug: "10-tsi-110-hp-benzin-dsg", name: "1.0 TSI 110 HP", fuelType: "Benzin", transmission: "DSG", score: 88, issues: ["Kavrama titremesi (DSG)","Mekatronik arızası"] },
            { slug: "15-tsi-150-hp-benzin-dsg", name: "1.5 TSI 150 HP", fuelType: "Benzin", transmission: "DSG", score: 89, issues: ["Soğuk marşta titreme","DSG mekatronik basınç tüpü"] },
            { slug: "16-tdi-120-hp-dizel-dsg", name: "1.6 TDI 120 HP", fuelType: "Dizel", transmission: "DSG", score: 85, issues: ["EGR valfi arızası","Su pompası sızıntısı","Enjektör arızası"] },
            { slug: "20-tdi-150-hp-dizel-dsg", name: "2.0 TDI 150 HP", fuelType: "Dizel", transmission: "DSG", score: 91, issues: ["DPF dolumu","AdBlue sistemi sorunları"] },
        ]
    },
    {
        vehicleId: 34,
        engines: [
            { slug: "10-tce-90-hp-benzin-manuel-x-tronic", name: "1.0 TCe 90 HP", fuelType: "Benzin", transmission: "Manuel / X-Tronic", score: 85, issues: ["Erken debriyaj aşınması","Turbo valfi sesi"] },
            { slug: "15-dci-110-hp-dizel-manuel-edc", name: "1.5 dCi 110 HP", fuelType: "Dizel", transmission: "Manuel / EDC", score: 92, issues: ["EGR valfi tıkanıklığı","Partikül filtresi dolumu"] },
            { slug: "13-tce-140-hp-benzin-edc", name: "1.3 TCe 140 HP", fuelType: "Benzin", transmission: "EDC", score: 88, issues: ["Kavrama ısınması (Şehir içi)","Yağ eksiltme"] },
            { slug: "16-e-tech-140-hp-hibrit-otomatik", name: "1.6 E-Tech 140 HP", fuelType: "Hibrit", transmission: "Otomatik", score: 90, issues: ["Yazılım güncellemeleri gereksinimi","Vites geçişlerinde kararsızlık"] },
        ]
    },
];
