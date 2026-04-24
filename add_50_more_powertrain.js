const fs = require('fs');
const file = 'data/obd-codes.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const existingCodes = new Set(data.map(d => d.code));

const newCodes = [
    // Yakıt ve Hava Karışımı (P01xx - P02xx - Devamı)
    { code: "P0170", title: "Yakıt Trim Arızası (Bank 1)", desc: "Yakıt trim parametreleri limitlerin dışında. Motor çok zengin veya çok fakir çalışıyor.", sys: ["Yakıt Sistemi", "Motor Elektroniği"], sev: "Yüksek" },
    { code: "P0173", title: "Yakıt Trim Arızası (Bank 2)", desc: "Bank 2 için yakıt trim parametreleri limitlerin dışında. V motorlarda sık görülür.", sys: ["Yakıt Sistemi", "Motor Elektroniği"], sev: "Yüksek" },
    { code: "P0191", title: "Yakıt Rayı Basınç Sensörü Devre Performansı", desc: "Yakıt rayı basıncı beklenen değerlerin dışında. Pompa arızası veya tıkalı filtre olabilir.", sys: ["Yakıt Sistemi"], sev: "Yüksek" },
    { code: "P0234", title: "Turboşarj/Süperşarj Aşırı Besleme Durumu (Overboost)", desc: "Turbo basıncı istenen sınırın üzerine çıktı. Wastegate veya selenoid valf sıkışmış olabilir.", sys: ["Aşırı Besleme Sistemi", "Motor Elektroniği"], sev: "Kritik" },
    { code: "P0299", title: "Turboşarj/Süperşarj Düşük Besleme Durumu (Underboost)", desc: "Turbo basıncı beklenen sınırın altında. Turbo arızası, hava kaçağı veya wastegate sorunu.", sys: ["Aşırı Besleme Sistemi", "Motor Elektroniği"], sev: "Kritik" },

    // Ateşleme Sistemi (P03xx - Devamı)
    { code: "P0300", title: "Rastgele/Çoklu Silindir Tekleme Algılandı", desc: "Motorun birden fazla silindirinde tekleme (misfire) var. Buji, bobin veya yakıt kaynaklı olabilir.", sys: ["Ateşleme Sistemi", "Yakıt Sistemi"], sev: "Kritik" },
    { code: "P0351", title: "Ateşleme Bobini 'A' Birincil/İkincil Devre Arızası", desc: "1. silindir ateşleme bobininde elektriksel sorun. Tekleme yapar.", sys: ["Ateşleme Sistemi"], sev: "Yüksek" },
    { code: "P0352", title: "Ateşleme Bobini 'B' Birincil/İkincil Devre Arızası", desc: "2. silindir ateşleme bobininde elektriksel sorun. Tekleme yapar.", sys: ["Ateşleme Sistemi"], sev: "Yüksek" },
    { code: "P0353", title: "Ateşleme Bobini 'C' Birincil/İkincil Devre Arızası", desc: "3. silindir ateşleme bobininde elektriksel sorun. Tekleme yapar.", sys: ["Ateşleme Sistemi"], sev: "Yüksek" },
    { code: "P0354", title: "Ateşleme Bobini 'D' Birincil/İkincil Devre Arızası", desc: "4. silindir ateşleme bobininde elektriksel sorun. Tekleme yapar.", sys: ["Ateşleme Sistemi"], sev: "Yüksek" },

    // Emisyon Kontrolü (P04xx - Devamı)
    { code: "P0400", title: "Egzoz Gazı Geri Dönüşüm (EGR) Akışı Arızası", desc: "EGR valfinden beklenen egzoz gazı akışı sağlanamıyor. Tıkanıklık veya valf arızası.", sys: ["Egzoz ve Emisyon", "EGR Sistemi"], sev: "Yüksek" },
    { code: "P0401", title: "Egzoz Gazı Geri Dönüşüm (EGR) Akışı Yetersiz", desc: "EGR sistemi yeterli miktarda egzoz gazını emme manifolduna gönderemiyor.", sys: ["Egzoz ve Emisyon", "EGR Sistemi"], sev: "Yüksek" },
    { code: "P0402", title: "Egzoz Gazı Geri Dönüşüm (EGR) Akışı Aşırı", desc: "EGR valfi gereğinden fazla açık kalarak çok fazla egzoz gazı alıyor. Rölantide dalgalanma yapar.", sys: ["Egzoz ve Emisyon", "EGR Sistemi"], sev: "Yüksek" },
    { code: "P0410", title: "İkincil Hava Enjeksiyon Sistemi Arızası", desc: "Katalitik konvertörü hızlı ısıtmak için havayı basan sistem (Sekonder Hava Pompası) çalışmıyor.", sys: ["Egzoz ve Emisyon"], sev: "Orta" },
    { code: "P0420", title: "Katalizör Sistemi Verimliliği Eşiğin Altında (Bank 1)", desc: "Katalitik konvertör görevini tam yapamıyor, egzoz emisyonları sınırın üzerinde.", sys: ["Egzoz ve Emisyon"], sev: "Yüksek" },
    { code: "P0430", title: "Katalizör Sistemi Verimliliği Eşiğin Altında (Bank 2)", desc: "V motorlarda 2. sıradaki katalitik konvertörün verimi düşük.", sys: ["Egzoz ve Emisyon"], sev: "Yüksek" },
    { code: "P0440", title: "Buharlaştırıcı Emisyon (EVAP) Kontrol Sistemi Arızası", desc: "Yakıt deposundan benzin buharı kaçağı var veya EVAP sistemi arızalı.", sys: ["Yakıt Buharlaşma Sistemi (EVAP)"], sev: "Orta" },
    { code: "P0442", title: "EVAP Sistemi Küçük Kaçak Algılandı", desc: "Yakıt buharı sisteminde küçük çaplı bir sızıntı tespit edildi. (Örn: Gevşek depo kapağı)", sys: ["Yakıt Buharlaşma Sistemi (EVAP)"], sev: "Düşük" },
    { code: "P0455", title: "EVAP Sistemi Büyük Kaçak Algılandı", desc: "Yakıt buharı sisteminde büyük bir sızıntı var. Açık unutulmuş depo kapağı veya kopuk hortum.", sys: ["Yakıt Buharlaşma Sistemi (EVAP)"], sev: "Orta" },
    { code: "P0456", title: "EVAP Sistemi Çok Küçük Kaçak Algılandı", desc: "Yakıt buharı sisteminde mikro düzeyde bir sızıntı tespit edildi.", sys: ["Yakıt Buharlaşma Sistemi (EVAP)"], sev: "Düşük" },

    // Araç Hızı ve Rölanti (P05xx - Devamı)
    { code: "P0500", title: "Araç Hız Sensörü 'A' Arızası", desc: "Hız sensöründen sinyal gelmiyor veya tutarsız. ABS/ESP arızasıyla birlikte görülebilir.", sys: ["Araç Hızı ve Rölanti Kontrolü"], sev: "Yüksek" },
    { code: "P0505", title: "Rölanti Hava Kontrol Sistemi Arızası", desc: "Rölanti valfi (IAC) veya elektronik gaz kelebeği rölanti devrini ayarlayamıyor.", sys: ["Araç Hızı ve Rölanti Kontrolü"], sev: "Orta" },
    { code: "P0507", title: "Rölanti Kontrol Sistemi Devri Beklenenden Yüksek", desc: "Motor rölanti devri hedeflenen devrin çok üzerinde. Vakum kaçağı olabilir.", sys: ["Araç Hızı ve Rölanti Kontrolü", "Emme Sistemi"], sev: "Orta" },
    { code: "P0520", title: "Motor Yağ Basınç Sensörü / Şalter Devresi", desc: "Motor yağ basınç sensöründen gelen sinyal hatalı. Yağ lambası yanabilir.", sys: ["Motor Elektroniği"], sev: "Kritik" },
    { code: "P0550", title: "Hidrolik Direksiyon Basınç Sensörü Devresi", desc: "Direksiyon çevrildiğinde rölantiyi artırmak için kullanılan sensör arızalı.", sys: ["Motor Elektroniği", "Direksiyon Sistemi"], sev: "Orta" },

    // PCM/ECM Arızaları (P06xx - Devamı)
    { code: "P0601", title: "İç Kontrol Modülü Bellek Sağlama Toplamı (Checksum) Hatası", desc: "Motor beyni (PCM/ECM) içindeki hafızada veri bozulması var. Beyin arızası.", sys: ["Motor Elektroniği", "Beyin (ECU)"], sev: "Kritik" },
    { code: "P0603", title: "İç Kontrol Modülü KAM (Canlı Bellek) Hatası", desc: "Akü bağlantısı kesilmiş gibi canlı bellek sıfırlanıyor veya hafıza entegresi arızalı.", sys: ["Motor Elektroniği", "Beyin (ECU)"], sev: "Yüksek" },
    { code: "P0606", title: "ECM / PCM İşlemci Hatası", desc: "Motor kontrol modülü (beyin) işlemcisinde donanımsal arıza tespit edildi.", sys: ["Motor Elektroniği", "Beyin (ECU)"], sev: "Kritik" },
    { code: "P0651", title: "Sensör Referans Voltaj 'B' Devresi Açık", desc: "5V sensör referans hattı 2'de sorun var. Birden fazla sensör aynı anda çalışmayı durdurur.", sys: ["Motor Elektroniği"], sev: "Kritik" },

    // Şanzıman (P07xx - P08xx - Devamı)
    { code: "P0740", title: "Tork Konvertörü Kavrama Devresi Arızası", desc: "Şanzıman tork konvertörü kilitleme (lock-up) mekanizmasında sorun var.", sys: ["Otomatik Şanzıman"], sev: "Yüksek" },
    { code: "P0753", title: "Vites Değiştirme Selenoidi 'A' Elektriksel Arıza", desc: "1-2 vites geçişlerini sağlayan A selenoidinin elektrik devresinde sorun.", sys: ["Otomatik Şanzıman"], sev: "Yüksek" },
    { code: "P0758", title: "Vites Değiştirme Selenoidi 'B' Elektriksel Arıza", desc: "2-3 vites geçişlerini sağlayan B selenoidinin elektrik devresinde sorun.", sys: ["Otomatik Şanzıman"], sev: "Yüksek" },
    { code: "P0840", title: "Şanzıman Yağ Basınç Sensörü / Şalter 'A' Devresi", desc: "Şanzıman içindeki yağ basıncı sensöründen sinyal gelmiyor.", sys: ["Otomatik Şanzıman"], sev: "Yüksek" },

    // Üreticiye Özel veya İleri Düzey OBD2 (P1xxx - P2xxx)
    { code: "P1128", title: "Yakıt Trimi Sistem Çok Fakir (VAG Grubu)", desc: "Özellikle Volkswagen/Audi grubunda görülen uzun vadeli fakir karışım hatası.", sys: ["Yakıt Sistemi", "Motor Elektroniği"], sev: "Yüksek" },
    { code: "P1299", title: "Motor Aşırı Isınma Koruması Devrede (Ford/Mazda)", desc: "Motor harareti kritik seviyeye ulaştı, ECU hasarı önlemek için gücü kesti.", sys: ["Soğutma Sistemi", "Motor Elektroniği"], sev: "Kritik" },
    { code: "P1345", title: "Eksantrik Mili - Krank Mili Pozisyonu Senkronizasyon Hatası", desc: "Zamanlama zinciri uzaması veya atlaması nedeniyle eksantrik ile krank mili uyumsuz.", sys: ["Ateşleme Sistemi", "Motor Mekaniği"], sev: "Kritik" },
    { code: "P1516", title: "Gaz Kelebeği Aktüatör Kontrol Modülü Performansı", desc: "Elektronik gaz kelebeği istenen konuma gelemiyor veya takılıyor.", sys: ["Motor Elektroniği"], sev: "Yüksek" },
    { code: "P2002", title: "Partikül Filtresi (DPF) Verimliliği Eşiğin Altında (Bank 1)", desc: "Dizel partikül filtresi tıkanmış veya delinmiş, görevini yapamıyor.", sys: ["Dizel Egzoz Sistemi", "DPF"], sev: "Yüksek" },
    { code: "P2138", title: "Gaz Pedalı Pozisyon Sensörü 'D' / 'E' Voltaj Uyuşmazlığı", desc: "Elektronik gaz pedalındaki çift güvenlik sensörünün değerleri birbirini tutmuyor.", sys: ["Motor Elektroniği"], sev: "Kritik" },
    { code: "P2263", title: "Turboşarj / Süperşarj Basınç Sistemi Performansı", desc: "Turbo sistemi beklenen basıncı (boost) üretemiyor veya basınç dengesiz.", sys: ["Aşırı Besleme Sistemi", "Motor Elektroniği"], sev: "Kritik" },
    { code: "P2293", title: "Yakıt Basıncı Regülatörü 2 Performansı", desc: "Yüksek basınç pompası (TSI/TFSI gibi motorlarda) istenen yakıt basıncını sağlayamıyor.", sys: ["Yakıt Sistemi"], sev: "Kritik" },
    { code: "P2509", title: "ECM/PCM Güç Girişi Sinyali Kesintili", desc: "Motor kontrol ünitesine giden elektrik gücünde anlık kesintiler var.", sys: ["Motor Elektroniği", "Beyin (ECU)"], sev: "Kritik" },
    { code: "P2A00", title: "Oksijen Sensörü (B1S1) Performans Sorunu", desc: "Geniş bantlı (A/F) oksijen sensörü değerleri mantıklı sınırlar dışında.", sys: ["Egzoz ve Emisyon"], sev: "Yüksek" },

    // Hibrit ve Elektrikli Araç Kodları (P0Axx - P3xxx)
    { code: "P0A08", title: "DC/DC Konvertör Durum Devresi Arızası", desc: "Hibrit sistemde yüksek voltajı 12V'a çeviren DC-DC konvertör devresinde hata.", sys: ["Hibrit Sistemi", "Elektrik Sistemi"], sev: "Yüksek" },
    { code: "P0A0F", title: "Motor Başlatılamadı (Hibrit)", desc: "Hibrit araç içten yanmalı motoru (ICE) çalıştıramadı.", sys: ["Hibrit Sistemi"], sev: "Kritik" },
    { code: "P0A7F", title: "Hibrit Batarya Paketi Bozulması", desc: "Yüksek voltajlı hibrit/elektrikli araç bataryasının (HV Battery) kapasitesi kritik seviyede düştü veya hücreler arası voltaj farkı yüksek.", sys: ["Hibrit Sistemi", "Batarya Yönetim Sistemi"], sev: "Kritik" },
    { code: "P0A80", title: "Hibrit Batarya Paketini Değiştir", desc: "Batarya modüllerinden bir veya birkaçı arızalı. Tüm batarya paketinin veya arızalı hücrelerin değişimi gerekli.", sys: ["Hibrit Sistemi", "Batarya Yönetim Sistemi"], sev: "Kritik" },
    { code: "P0A93", title: "İnvertör 'A' Soğutma Sistemi Performansı", desc: "Hibrit invertörünün soğutma sistemi (su pompası arızası vb.) yetersiz.", sys: ["Hibrit Sistemi", "Soğutma Sistemi"], sev: "Kritik" },
    { code: "P0AA6", title: "Yüksek Voltaj Sistemi İzolasyon Hatası", desc: "Yüksek voltaj kablolarında kaçak var, şasiye elektrik sızıyor. Ölümcül tehlike, araç sistemi kapatır.", sys: ["Hibrit Sistemi", "Güvenlik Sistemi"], sev: "Kritik" }
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

data.sort((a, b) => a.code.localeCompare(b.code));
fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
console.log(`${addedCount} yeni onemli Powertrain (P) kodu eklendi. Toplam: ${data.length}`);
