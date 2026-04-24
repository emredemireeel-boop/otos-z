const fs = require('fs');

const file = 'data/obd-codes.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const existingCodes = new Set(data.map(d => d.code));

const newCodes = [
  { code: "P2004", title: "Emme Manifoldu Akış Kontrolü Açık Kaldı (Bank 1)", desc: "Manifold içindeki kelebekler açık pozisyonda sıkışmış." },
  { code: "P2015", title: "Emme Manifoldu Akış Pozisyon Sensörü Aralığı (Bank 1)", desc: "Sensör emme manifoldu flaplarının yanlış pozisyonda olduğunu tespit etti. Genellikle VAG grubunda kroniktir." },
  { code: "P2101", title: "Elektronik Gaz Kelebeği Motoru Devresi Performansı", desc: "Gaz kelebeği motoru düzgün çalışmıyor, temizlik veya adaptasyon gerektirir." },
  { code: "P2111", title: "Gaz Kelebeği Sistemi Açık Kaldı", desc: "Elektronik gaz kelebeği fiziksel olarak açık pozisyonda sıkışmış." },
  { code: "P2112", title: "Gaz Kelebeği Sistemi Kapalı Kaldı", desc: "Elektronik gaz kelebeği tamamen kapanmış ve açılamıyor, aşırı kurum birikimi olabilir." },
  { code: "P2122", title: "Gaz Pedalı Pozisyon Sensörü 'D' Devresi Düşük Voltaj", desc: "Gaz pedalından beyne giden sinyal çok düşük, kablo veya pedal arızası." },
  { code: "P2135", title: "Gaz Pedalı Pozisyon Sensörleri 'A'/'B' Voltaj Uyuşmazlığı", desc: "Gaz pedalındaki iki farklı güvenlik sensörünün değerleri uyuşmuyor, araç limp moda (koruma) geçer." },
  { code: "P2177", title: "Sistem Rölanti Haricinde Çok Fakir (Bank 1)", desc: "Gaza basıldığında motor fakir karışıma düşüyor. Düşük yakıt basıncı veya vakum kaçağı." },
  { code: "P2181", title: "Soğutma Sistemi Performansı", desc: "Motor beklenen sürede ısınamıyor veya aşırı ısınıyor. Termostat arızası kuvvetle muhtemel." },
  { code: "P2187", title: "Sistem Rölantide Çok Fakir (Bank 1)", desc: "Rölantide çalışırken yanma odasına yeterli yakıt gitmiyor veya fazla hava giriyor." },
  { code: "P2195", title: "Oksijen Sensörü Sinyali Fakir Karışımda Takılı Kaldı", desc: "1. Oksijen sensörü sürekli olarak oksijenin fazla olduğunu (fakir karışım) okuyor." },
  { code: "P2238", title: "Oksijen Sensörü Pozitif Akım Kontrol Devresi Düşük", desc: "Geniş bantlı oksijen sensörünün (A/F) iç devresinde voltaj düşüklüğü." },
  { code: "P2509", title: "ECM/PCM Güç Girişi Sinyali Kesintili", desc: "Motor beynine giden elektrik akımında anlık kesilmeler yaşanıyor. Akü kutup başları veya şasi kabloları gevşek." },
  { code: "P2610", title: "ECM/PCM İç Motor Kapalı Zamanlayıcı Performansı", desc: "Motor beyni, kontağın ne kadar süre kapalı kaldığını hesaplayamıyor." },
  { code: "P2A00", title: "Oksijen Sensörü Devresi Performansı (Bank 1 Sensör 1)", desc: "Birinci oksijen sensörü (Air/Fuel Ratio) yeterince hızlı tepki vermiyor veya değerler mantıksız." },
  { code: "P0705", title: "Şanzıman Vites Konum Sensörü (PRNDL) Arızası", desc: "Otomatik vites konum şalteri vitesin hangi konumda (P, R, N, D) olduğunu beyne iletemiyor." },
  { code: "P0706", title: "Şanzıman Vites Konum Sensörü Aralık Arızası", desc: "Vites seçici sensörden mantıksız sinyaller geliyor, örneğin aynı anda hem D hem R okuyor." },
  { code: "P0715", title: "Giriş/Türbin Hız Sensörü Devresi Arızası", desc: "Şanzıman beyni, tork konvertöründen şanzımana giren milin hızını okuyamıyor." },
  { code: "P0720", title: "Çıkış Hız Sensörü Devresi Arızası", desc: "Şanzımandan tekerleklere giden şaftın hızını ölçen sensör arızalı." },
  { code: "P0730", title: "Hatalı Vites Dişli Oranı", desc: "Şanzıman beyni, motor devri ile tekerlek hızı arasındaki oranın seçili vitese uymadığını tespit etti (Kavrama kaçırıyor olabilir)." },
  { code: "P0750", title: "Vites Değiştirme Selenoidi 'A' Arızası", desc: "Otomatik şanzıman içindeki A selenoid valfi elektrik veya mekanik olarak arızalı." },
  { code: "P0755", title: "Vites Değiştirme Selenoidi 'B' Arızası", desc: "Otomatik şanzıman içindeki B selenoid valfi görevini yapamıyor." },
  { code: "P0841", title: "Şanzıman Yağ Basınç Sensörü 'A' Aralığı", desc: "Otomatik şanzıman içindeki yağ basıncı okuyan sensörden hatalı veriler geliyor." },
  { code: "P0900", title: "Debriyaj Aktüatörü Devresi Açık (Yarı Otomatik)", desc: "Robotize (Yarı Otomatik) şanzımanlarda debriyajı ayıran motorun elektrik devresinde kopukluk var." },
  { code: "P1000", title: "OBD Sistem Hazırlık Testleri Tamamlanmadı", desc: "Arıza kodları yeni silinmiş veya akü sökülmüş. Aracın emisyon testine hazır olmadığını belirtir." },
  { code: "P1101", title: "MAF Sensörü Otopark Test Aralığı Dışında", desc: "Kütle hava akış sensörü, gaz kelebeği ile uyumsuz okumalar yapıyor." },
  { code: "P1133", title: "Oksijen Sensörü Yetersiz Anahtarlama (Bank 1 Sensör 1)", desc: "Oksijen sensörü Zengin-Fakir arasında yeterince hızlı geçiş (switch) yapamıyor, tembelleşmiş." },
  { code: "P1604", title: "Startability Malfunction (Çalıştırma Hatası)", desc: "Motor marşa basıldığı halde zamanında veya hiç çalışmadı. Akü, marş motoru veya yakıt sistemi kaynaklıdır." },
  { code: "P3000", title: "Batarya Kontrol Sistemi Arızası (Hibrit)", desc: "Hibrit (Hybrid) araçlarda yüksek voltaj batarya sisteminde (HV Battery) kritik bir sorun tespit edildi." },
  { code: "P3190", title: "Motor Gücü Zayıf (Hibrit)", desc: "Hibrit araçlarda içten yanmalı motor yeterli güç üretemiyor." }
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
        severity: nc.code.startsWith('P2') || nc.code.startsWith('P3') ? "Kritik" : "Önemli",
        systems: nc.code.startsWith('P07') || nc.code.startsWith('P08') || nc.code.startsWith('P09') ? ["Otomatik Şanzıman"] : (nc.code.startsWith('P3') ? ["Hibrit Sistemi"] : ["Motor Elektroniği"]),
        symptoms: ["Arıza lambası yanar", "Araç performansında farklılıklar gözlemlenir"],
        causes: ["Kablo tesisatı arızası", "Sensör ömrünün dolması", "Mekanik aşınma"],
        fixes: ["Diagnostik cihaz ile detaylı canlı değer okuması", "İlgili sensör veya modül değişimi"]
    });
    addedCount++;
  }
}

data.sort((a, b) => a.code.localeCompare(b.code));
fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
console.log(`Successfully added ${addedCount} exactly new P codes.`);
