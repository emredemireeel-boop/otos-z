const fs = require('fs');
const file = 'data/obd-codes.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const existingCodes = new Set(data.map(d => d.code));

const newCodes = [
    // 6 eksik kodu tamamlamak için en çok aratılan özel kodlar
    { code: "P0087", title: "Yakıt Rayı/Sistem Basıncı Çok Düşük", desc: "Common rail yakıt hattında basınç çok düşük. Yakıt filtresi tıkanıklığı, yüksek basınç pompası veya enjektör sızıntısı olabilir.", sys: ["Yakıt Sistemi"], sev: "Kritik" },
    { code: "P0088", title: "Yakıt Rayı/Sistem Basıncı Çok Yüksek", desc: "Common rail yakıt hattında basınç sınırın üzerinde. Basınç regülatörü veya müşür arızası.", sys: ["Yakıt Sistemi"], sev: "Kritik" },
    { code: "P0101", title: "Kütle veya Hacim Hava Akış (MAF) Sensörü 'A' Devresi Aralık/Performans", desc: "MAF sensörü ölçümleri emilen hava miktarıyla uyuşmuyor. Sensör kirli veya arızalı olabilir.", sys: ["Emme Sistemi", "Motor Elektroniği"], sev: "Yüksek" },
    { code: "P0171", title: "Sistem Çok Fakir (Bank 1)", desc: "1. silindir sırasındaki yakıt/hava karışımı çok fakir (yakıt az, hava çok). Emme manifoldu kaçağı veya düşük yakıt basıncı.", sys: ["Yakıt Sistemi", "Emme Sistemi"], sev: "Yüksek" },
    { code: "P0172", title: "Sistem Çok Zengin (Bank 1)", desc: "1. silindir sırasındaki yakıt/hava karışımı çok zengin (yakıt çok, hava az). Enjektör sızıntısı veya kirli hava filtresi.", sys: ["Yakıt Sistemi", "Emme Sistemi"], sev: "Yüksek" },
    { code: "P0300", title: "Rastgele/Çoklu Silindir Tekleme Algılandı", desc: "Birden fazla silindirde ateşleme atlaması (tekleme) yaşanıyor. Buji, bobin, yakıt veya kompresyon kaynaklı olabilir.", sys: ["Ateşleme Sistemi", "Motor Mekaniği"], sev: "Kritik" },
    { code: "P0446", title: "Buharlaştırıcı Emisyon (EVAP) Sistemi Havalandırma Kontrol Devresi", desc: "Yakıt buharı havalandırma (vent) valfi arızalı. Kanister temizlenemiyor.", sys: ["Yakıt Buharlaşma Sistemi (EVAP)"], sev: "Orta" },
    { code: "P0455", title: "Buharlaştırıcı Emisyon (EVAP) Sistemi Sızıntı Algılandı (Büyük Sızıntı)", desc: "Yakıt buharı sisteminde büyük kaçak var. Genelde yakıt depo kapağının tam kapanmamasından kaynaklanır.", sys: ["Yakıt Buharlaşma Sistemi (EVAP)"], sev: "Orta" },
    { code: "P0700", title: "Şanzıman Kontrol Sistemi Arızası (TCM MIL İsteği)", desc: "Şanzıman beyni (TCM) bir arıza tespit etti ve motor beyninden arıza lambasını (MIL) yakmasını istedi.", sys: ["Otomatik Şanzıman", "Motor Elektroniği"], sev: "Yüksek" }
];

let addedCount = 0;
for (const nc of newCodes) {
  if (!existingCodes.has(nc.code)) {
    data.push({
      code: nc.code,
      title: nc.title,
      description: nc.desc,
      type: "P",
      isGeneric: true,
      severity: nc.sev,
      systems: nc.sys,
      symptoms: ["Arıza lambası (MIL) yanar", "Motor performansında düşüş hissedilir"],
      causes: ["İlgili sensör veya aktüatör arızası", "Kablo tesisatında kopukluk/kısa devre", "Mekanik aşınma veya tıkanma"],
      fixes: ["Diagnostik cihaz ile canlı veri ve freeze frame analizi", "İlgili sensör, selenoid veya modülün değişimi", "Kablo ve soket bağlantılarının kontrol edilmesi"]
    });
    addedCount++;
  }
}

if (addedCount > 0) {
  data.sort((a, b) => a.code.localeCompare(b.code));
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
}
console.log(`${addedCount} adet eksik tamamlayici Powertrain (P) kodu eklendi. Toplam: ${data.length}`);
