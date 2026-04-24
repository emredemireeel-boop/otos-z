const fs = require('fs');
const file = 'data/obd-codes.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const existingCodes = new Set(data.map(d => d.code));

const newCodes = [
    // Dizel ve EGR Özel Kodlar
    { code: "P040A", title: "Egzoz Gazı Sıcaklık Sensörü Devresi 'A'", desc: "EGR soğutucu çıkışındaki sıcaklık sensörü arızası.", sys: ["Egzoz ve Emisyon"], sev: "Yüksek" },
    { code: "P040B", title: "Egzoz Gazı Sıcaklık Sensörü 'A' Aralık/Performans", desc: "Sensör mantıksız değerler okuyor. EGR tıkanıklığı olabilir.", sys: ["Egzoz ve Emisyon"], sev: "Yüksek" },
    { code: "P042A", title: "Katalitik Konvertör Sıcaklık Sensörü Devresi (Bank 1 Sensör 2)", desc: "Katalizör sonrası sıcaklık sensöründe elektriksel sorun.", sys: ["Egzoz ve Emisyon"], sev: "Yüksek" },
    { code: "P042B", title: "Katalitik Konvertör Sıcaklık Sensörü Aralık/Performans", desc: "Katalizör sıcaklık okumaları mantıksız.", sys: ["Egzoz ve Emisyon"], sev: "Yüksek" },
    { code: "P200A", title: "Emme Manifoldu Akış Kontrol (Runner) Performansı (Bank 1)", desc: "Emme manifoldunun içindeki flaplar (kelebekler) sıkışmış veya aktüatör bozuk.", sys: ["Motor Elektroniği", "Emme Sistemi"], sev: "Kritik" },
    { code: "P200B", title: "Emme Manifoldu Akış Kontrol (Runner) Performansı (Bank 2)", desc: "V motorlarda 2. bankın manifold flapları sıkışmış.", sys: ["Motor Elektroniği", "Emme Sistemi"], sev: "Kritik" },
    { code: "P201A", title: "Redüktan (AdBlue) Enjeksiyon Valfi Devre Aralığı", desc: "SCR/AdBlue sistemindeki enjektör valfi hatalı.", sys: ["Dizel Egzoz Sistemi", "SCR/AdBlue"], sev: "Kritik" },
    { code: "P2033", title: "Egzoz Gazı Sıcaklık Sensörü Devresi Yüksek (Bank 1 Sensör 2)", desc: "DPF öncesi sıcaklık sensöründen sürekli yüksek sinyal geliyor.", sys: ["Egzoz ve Emisyon"], sev: "Yüksek" },
    { code: "P20E8", title: "Redüktan (AdBlue) Basıncı Çok Düşük", desc: "AdBlue pompası yeterli basıncı üretemiyor veya hatta sızıntı var.", sys: ["Dizel Egzoz Sistemi", "SCR/AdBlue"], sev: "Kritik" },
    { code: "P20EE", title: "SCR NOx Katalizör Verimliliği Eşiğin Altında (Bank 1)", desc: "AdBlue sistemi egzozdaki NOx gazlarını yeterince temizleyemiyor.", sys: ["Dizel Egzoz Sistemi", "SCR/AdBlue"], sev: "Kritik" },
    { code: "P20F4", title: "Redüktan (AdBlue) Tüketimi Çok Düşük", desc: "Araç beklenen miktarda AdBlue tüketmiyor. Enjektör tıkanmış olabilir.", sys: ["Dizel Egzoz Sistemi", "SCR/AdBlue"], sev: "Kritik" },
    { code: "P2200", title: "NOx Sensörü Devresi (Bank 1 Sensör 1)", desc: "NOx sensöründe donanımsal arıza veya kablo kopukluğu. Sıklıkla dizel araçlarda görülür.", sys: ["Dizel Egzoz Sistemi"], sev: "Kritik" },
    { code: "P2201", title: "NOx Sensörü Aralık/Performans Sorunu (Bank 1 Sensör 1)", desc: "NOx sensörünün okuduğu değerler kabul edilebilir aralığın dışında.", sys: ["Dizel Egzoz Sistemi"], sev: "Yüksek" },
    { code: "P2202", title: "NOx Sensörü Devresi Düşük (Bank 1 Sensör 1)", desc: "NOx sensöründen çok düşük sinyal voltajı alınıyor.", sys: ["Dizel Egzoz Sistemi"], sev: "Yüksek" },
    { code: "P229E", title: "NOx Sensörü Devresi (Bank 1 Sensör 2)", desc: "Katalizör veya DPF sonrası 2. NOx sensörü arızası.", sys: ["Dizel Egzoz Sistemi"], sev: "Kritik" },

    // DPF/Turbo Dizel Kodları
    { code: "P242F", title: "Dizel Partikül Filtresi Kurum Birikimi", desc: "DPF tamamen tıkanmış durumda, rejenerasyon yapılamıyor.", sys: ["Dizel Egzoz Sistemi", "DPF"], sev: "Kritik" },
    { code: "P24A2", title: "Dizel Partikül Filtresi Rejenerasyon Tamamlanmadı", desc: "Sürüş koşulları DPF rejenerasyonunun tamamlanmasına izin vermedi.", sys: ["Dizel Egzoz Sistemi", "DPF"], sev: "Yüksek" },
    { code: "P2563", title: "Turboşarj Boost Kontrol Pozisyon Sensörü 'A' Devre Aralığı", desc: "Turbonun değişken geometrisini (VGT) kontrol eden aktüatör hatalı çalışıyor.", sys: ["Aşırı Besleme Sistemi", "Motor Elektroniği"], sev: "Kritik" },
    { code: "P259F", title: "Turboşarj 'A' Boost Kontrol Pozisyonu Uyuşmazlığı", desc: "Turbo aktüatörünün beklenen konumu ile gerçek konumu farklı.", sys: ["Aşırı Besleme Sistemi", "Motor Elektroniği"], sev: "Kritik" },
    { code: "P00AF", title: "Turboşarj/Süperşarj Boost Kontrol Modülü Performansı", desc: "Turbo kontrol ünitesinde arıza. Değişken geometrili (VNT) turbolarda yaygın.", sys: ["Aşırı Besleme Sistemi"], sev: "Kritik" },

    // Yakıt/Enjeksiyon İleri Düzey Kodlar
    { code: "P1093", title: "Yakıt Rayı Basıncı Çok Düşük (Kalkışta)", desc: "Yüksek basınç pompası anlık hızlanmalarda yeterli basıncı sağlayamıyor.", sys: ["Yakıt Sistemi"], sev: "Kritik" },
    { code: "P00C6", title: "Yakıt Rayı Basıncı Motor Çalıştırmada Çok Düşük", desc: "Marş sırasında yeterli yakıt basıncı oluşmuyor, araç geç çalışır.", sys: ["Yakıt Sistemi"], sev: "Kritik" },
    { code: "P0148", title: "Yakıt Dağıtım Hatası", desc: "Enjektörlere giden yakıt dağıtımında basınç veya zamanlama hatası.", sys: ["Yakıt Sistemi"], sev: "Kritik" },
    { code: "P1148", title: "Kapalı Döngü Kontrolü Öğrenme Hatası (Bank 1)", desc: "Oksijen sensörü verileri ile yakıt trimi arasındaki adaptasyon sınırı aşıldı.", sys: ["Yakıt Sistemi", "Motor Elektroniği"], sev: "Yüksek" },
    { code: "P02CD", title: "Silindir 1 Yakıt Enjektörü Offset Öğrenme Maksimum Limite Ulaştı", desc: "1. enjektör aşınmış veya tıkanmış, ECU telafi etmek için yakıtı maksimuma çıkardı.", sys: ["Yakıt Sistemi"], sev: "Kritik" },

    // Hibrit / Elektrikli Araç Kodları
    { code: "P0A1F", title: "Batarya Enerji Kontrol Modülü Arızası", desc: "Hibrit aracın ana batarya yönetim modülü donanımsal hata verdi.", sys: ["Hibrit Sistemi", "Batarya Yönetim Sistemi"], sev: "Kritik" },
    { code: "P0A3F", title: "Elektrik Motoru (MG1) Sensör Devresi Arızası", desc: "Hibrit sistemin 1 numaralı motor/jeneratörünün konum sensörü hatalı.", sys: ["Hibrit Sistemi"], sev: "Kritik" },
    { code: "P0A44", title: "Elektrik Motoru (MG2) Sensör Devresi Arızası", desc: "Çekişi sağlayan MG2 motorunun konum sensörü arızalı.", sys: ["Hibrit Sistemi"], sev: "Kritik" },
    { code: "P0A81", title: "Hibrit Batarya Soğutma Fanı Kontrol Devresi", desc: "Arka koltuğun altındaki veya bagajdaki batarya soğutma fanı çalışmıyor.", sys: ["Hibrit Sistemi"], sev: "Kritik" },
    { code: "P0A84", title: "Hibrit Batarya Paketi Soğutma Fanı Modülü Düşük", desc: "Batarya soğutma fanı motoru düşük voltaj çekiyor veya yavaş dönüyor.", sys: ["Hibrit Sistemi"], sev: "Yüksek" },
    { code: "P0A94", title: "DC/DC Konvertör Performans Sorunu", desc: "Yüksek voltajı 12V akü için dönüştüren modül beklenen akımı sağlayamıyor.", sys: ["Hibrit Sistemi"], sev: "Kritik" },
    { code: "P0AC4", title: "Hibrit Aktarma Organı Kontrol Modülü MIL Yaktı", desc: "Hibrit beyni bir sorun algıladı ve motor beyninden arıza lambasını yakmasını istedi.", sys: ["Hibrit Sistemi"], sev: "Yüksek" },
    { code: "P1A08", title: "Jeneratör Yüksek Isı Koruması Devrede", desc: "Hibrit aracın jeneratörü aşırı ısındı, soğutma sisteminde sorun olabilir.", sys: ["Hibrit Sistemi"], sev: "Kritik" },
    { code: "P1A09", title: "İnvertör Soğutma Sistemi Hatası", desc: "İnvertörü soğutan özel sıvı hattında akış yok veya su pompası arızalı.", sys: ["Hibrit Sistemi"], sev: "Kritik" },
    { code: "P0BBD", title: "Batarya Paketi Voltajı Dalgalanması Yüksek", desc: "Elektrikli aracın batarya hücreleri arasında dengesiz deşarj var.", sys: ["Batarya Yönetim Sistemi"], sev: "Kritik" },

    // Özel Şanzıman ve Kavrama Kodları (DSG, Powershift vb.)
    { code: "P1732", title: "Vites Kutusu Kontrol Modülü Geçiş Zaman Aşımı", desc: "Yarı otomatik şanzıman beklenen sürede vites değişimini tamamlayamadı. Kavrama arızası.", sys: ["Otomatik Şanzıman", "Robotize Şanzıman"], sev: "Kritik" },
    { code: "P0810", title: "Debriyaj Konum Kontrol Hatası", desc: "Robotize veya çift kavramalı şanzımanda debriyaj motoru hedef konuma gelemiyor.", sys: ["Otomatik Şanzıman"], sev: "Kritik" },
    { code: "P0820", title: "Vites Kolu X-Y Konum Sensörü", desc: "Vites kolunun hangi konumda olduğunu belirleyen X-Y sensörleri uyuşmuyor.", sys: ["Otomatik Şanzıman"], sev: "Orta" },
    { code: "P2711", title: "Beklenmeyen Mekanik Vites Geçişi Bozulması", desc: "Çift kavramalı (DSG gibi) şanzımanda iki vites aynı anda devreye girmeye çalıştı veya dişli sıkıştı.", sys: ["Otomatik Şanzıman"], sev: "Kritik" },
    { code: "P284C", title: "Vites Değiştirme Çatalı 'A' Sıkıştı", desc: "Şanzıman içindeki mekanik vites değiştirme çatalı hareket edemiyor.", sys: ["Otomatik Şanzıman"], sev: "Kritik" },
    { code: "P0944", title: "Hidrolik Pompa Ünitesi Basınç Kaybı", desc: "Şanzıman veya direksiyon sistemine ait hidrolik pompa yeterli basınç üretemiyor.", sys: ["Otomatik Şanzıman", "Hidrolik Sistem"], sev: "Kritik" },

    // Stop & Start Sistemi ve Akü Kodları
    { code: "P0A8F", title: "14V Güç Modülü Sistemi Arızası", desc: "Start/Stop donanımlı araçlarda 12/14V dönüştürücüde donanım sorunu.", sys: ["Start & Stop Sistemi"], sev: "Yüksek" },
    { code: "P0562", title: "Sistem Voltajı Düşük", desc: "Şarj dinamosu aküyü şarj etmiyor. Voltaj 10V altına düştüğünde ortaya çıkar.", sys: ["Elektrik Sistemi"], sev: "Kritik" },
    { code: "P1682", title: "Kontak Anahtarı 1 - 2 Devresi Arası Voltaj Uyuşmazlığı", desc: "Kontak rölelerinden veya sigorta kutusundan gelen voltajlarda fark var.", sys: ["Elektrik Sistemi"], sev: "Yüksek" },

    // Start-Stop/Alternatör (P1xxx, P0Bxx vb.)
    { code: "P0A14", title: "Motor Bağlantı Kontrol (Start-Stop) Devre Arızası", desc: "Start/Stop sistemi için motor takozlarının sertliğini ayarlayan devrede sorun.", sys: ["Motor Elektroniği"], sev: "Düşük" },
    { code: "P0625", title: "Jeneratör Alan (Field) Terminali Devresi Düşük", desc: "Şarj dinamosunun (Alternatör) L veya F terminali sinyali düşük. Şarj etmeyebilir.", sys: ["Elektrik Sistemi", "Şarj Sistemi"], sev: "Yüksek" },
    { code: "P0626", title: "Jeneratör Alan (Field) Terminali Devresi Yüksek", desc: "Şarj dinamosu aşırı şarj ediyor olabilir. Akü kaynayabilir.", sys: ["Elektrik Sistemi", "Şarj Sistemi"], sev: "Kritik" },
    { code: "P011A", title: "Motor Soğutma Suyu Sıcaklığı Sensörü 1 / 2 Korelasyonu", desc: "Motorda iki farklı hararet müşürü var ve birbirleriyle uyuşmayan sıcaklık gösteriyorlar.", sys: ["Soğutma Sistemi", "Motor Elektroniği"], sev: "Yüksek" },
    { code: "P0128", title: "Soğutma Suyu Termostatı Çalışma Derecesinin Altında", desc: "Motor beklenen sürede ısınamıyor. Termostat açık kalmış (bozulmuş) olabilir.", sys: ["Soğutma Sistemi"], sev: "Yüksek" },
    { code: "P0219", title: "Motor Aşırı Devir Durumu Algılandı", desc: "Motor redline sınırının çok üzerinde bir devire çıktı (Yanlış vites küçültme vb. kaynaklı olabilir).", sys: ["Motor Elektroniği", "Güvenlik Sistemi"], sev: "Kritik" }
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
console.log(`${addedCount} yeni essiz Powertrain (P) kodu eklendi. Toplam: ${data.length}`);
