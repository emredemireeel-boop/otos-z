const fs = require('fs');
const file = 'data/obd-codes.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const existingCodes = new Set(data.map(d => d.code));

const newCodes = [
  { code:"P0641", title:"Sensör Referans Voltaj 'A' Devresi Açık", desc:"5V referans hattında kopukluk. Birden fazla sensör aynı anda hata verebilir.", sys:["Motor Elektroniği"], sev:"Kritik" },
  { code:"P0650", title:"Arıza Lambası (MIL) Kontrol Devresi", desc:"Göstergedeki check engine lambasını kontrol eden devre arızalı.", sys:["Motor Elektroniği"], sev:"Orta" },
  { code:"P0685", title:"ECM/PCM Güç Rölesi Kontrol Devresi Açık", desc:"Motor beyni güç rölesine komut gönderemiyor, araç çalışmayabilir.", sys:["Motor Elektroniği"], sev:"Kritik" },
  { code:"P0691", title:"Fan 1 Kontrol Devresi Düşük", desc:"Radyatör fanı kontrol devresinde düşük sinyal. Fan çalışmayabilir, motor aşırı ısınır.", sys:["Soğutma Sistemi"], sev:"Yüksek" },
  { code:"P0693", title:"Fan 2 Kontrol Devresi Düşük", desc:"İkinci radyatör fanı kontrol devresinde arıza. Klima açıkken soğutma yetersiz kalır.", sys:["Soğutma Sistemi"], sev:"Yüksek" },
  { code:"P0701", title:"Şanzıman Kontrol Sistemi Performans Sorunu", desc:"Şanzıman kontrol modülü genel bir performans düşüklüğü algıladı.", sys:["Otomatik Şanzıman"], sev:"Yüksek" },
  { code:"P0707", title:"Şanzıman Vites Konum Sensörü Devresi Düşük Sinyal", desc:"Vites seçici sensöründen düşük voltaj geliyor, vites konumu okunamıyor.", sys:["Otomatik Şanzıman"], sev:"Yüksek" },
  { code:"P0710", title:"Şanzıman Yağ Sıcaklık Sensörü Devresi Arızası", desc:"Şanzıman yağ sıcaklığını ölçen sensörden sinyal alınamıyor.", sys:["Otomatik Şanzıman"], sev:"Yüksek" },
  { code:"P0711", title:"Şanzıman Yağ Sıcaklık Sensörü Performans Sorunu", desc:"Sensör okumaları mantıksız veya çok yavaş değişiyor. Yağ seviyesi düşük olabilir.", sys:["Otomatik Şanzıman"], sev:"Yüksek" },
  { code:"P0716", title:"Giriş/Türbin Hız Sensörü Performans Sorunu", desc:"Türbin hız sensörü aralıklı veya tutarsız okumalar yapıyor.", sys:["Otomatik Şanzıman"], sev:"Yüksek" },
  { code:"P0717", title:"Giriş/Türbin Hız Sensörü Sinyal Yok", desc:"Şanzıman beyni türbin milinden hiç hız sinyali alamıyor. Sert vites geçişlerine neden olur.", sys:["Otomatik Şanzıman"], sev:"Kritik" },
  { code:"P0721", title:"Çıkış Hız Sensörü Performans Sorunu", desc:"Çıkış şaftı hız sensöründen tutarsız veya mantıksız değerler okunuyor.", sys:["Otomatik Şanzıman"], sev:"Yüksek" },
  { code:"P0722", title:"Çıkış Hız Sensörü Sinyal Yok", desc:"Çıkış hız sensöründen hiç sinyal gelmiyor. Hız göstergesi çalışmaz, vites geçişleri bozulur.", sys:["Otomatik Şanzıman"], sev:"Kritik" },
  { code:"P0725", title:"Motor Devir Giriş Devresi Arızası", desc:"Şanzıman beyni motor devrini okuyamıyor. Vites değiştirme zamanlaması bozulur.", sys:["Otomatik Şanzıman"], sev:"Yüksek" },
  { code:"P0731", title:"1. Vites Dişli Oranı Hatalı", desc:"Birinci viteste motor devri ile tekerlek hızı arasındaki oran beklenenden farklı. Kavrama kayması olabilir.", sys:["Otomatik Şanzıman"], sev:"Kritik" },
  { code:"P0732", title:"2. Vites Dişli Oranı Hatalı", desc:"İkinci viteste oran uyumsuzluğu. Bant veya kavrama paketi aşınmış olabilir.", sys:["Otomatik Şanzıman"], sev:"Kritik" },
  { code:"P0733", title:"3. Vites Dişli Oranı Hatalı", desc:"Üçüncü viteste dişli oranı beklenenle uyuşmuyor. Şanzıman içi mekanik sorun.", sys:["Otomatik Şanzıman"], sev:"Kritik" },
  { code:"P0734", title:"4. Vites Dişli Oranı Hatalı", desc:"Dördüncü viteste oran hatası. Şanzıman kaymaya başlamış olabilir.", sys:["Otomatik Şanzıman"], sev:"Kritik" },
  { code:"P0735", title:"5. Vites Dişli Oranı Hatalı", desc:"Beşinci (overdrive) viteste dişli oranı hatalı. Yüksek hızda devir yüksek kalır.", sys:["Otomatik Şanzıman"], sev:"Kritik" },
  { code:"P0741", title:"Tork Konvertörü Kavrama Selenoidi Performans Sorunu", desc:"Tork konvertörü kilitlenme kavraması düzgün çalışmıyor, yakıt tüketimi artar.", sys:["Otomatik Şanzıman"], sev:"Yüksek" },
  { code:"P0743", title:"Tork Konvertörü Kavrama Selenoidi Elektrik Arızası", desc:"Tork konvertörü selenoid valfinin elektrik devresinde sorun var.", sys:["Otomatik Şanzıman"], sev:"Yüksek" },
  { code:"P0751", title:"Vites Selenoidi 'A' Performans/Açık Kaldı", desc:"A selenoidi mekanik olarak sıkışmış veya tepki süreleri normalin dışında.", sys:["Otomatik Şanzıman"], sev:"Yüksek" },
  { code:"P0756", title:"Vites Selenoidi 'B' Performans/Açık Kaldı", desc:"B selenoidi gerektiği gibi çalışmıyor, vites geçişlerinde sertlik hissedilir.", sys:["Otomatik Şanzıman"], sev:"Yüksek" },
  { code:"P0760", title:"Vites Değiştirme Selenoidi 'C' Arızası", desc:"Şanzıman içindeki C selenoid valfi elektrik veya mekanik olarak çalışmıyor.", sys:["Otomatik Şanzıman"], sev:"Yüksek" },
  { code:"P0765", title:"Vites Değiştirme Selenoidi 'D' Arızası", desc:"D selenoidi arızalı. Belirli vites geçişleri yapılamaz hale gelebilir.", sys:["Otomatik Şanzıman"], sev:"Yüksek" },
  { code:"P0770", title:"Vites Değiştirme Selenoidi 'E' Arızası", desc:"E selenoidi görevini yapamıyor. Genellikle üst viteslerde sorun yaratır.", sys:["Otomatik Şanzıman"], sev:"Yüksek" },
  { code:"P0775", title:"Basınç Kontrol Selenoidi 'B' Arızası", desc:"Şanzıman hat basıncını düzenleyen B selenoidi arızalı, sert geçişler olur.", sys:["Otomatik Şanzıman"], sev:"Yüksek" },
  { code:"P0780", title:"Vites Değiştirme Genel Arızası", desc:"Şanzıman beyni vites geçişlerinde genel bir anormallik algıladı.", sys:["Otomatik Şanzıman"], sev:"Kritik" },
  { code:"P0868", title:"Şanzıman Yağ Basıncı Düşük", desc:"Şanzıman içi yağ basıncı tehlikeli seviyede düşük. Kavramalar yanabilir.", sys:["Otomatik Şanzıman"], sev:"Kritik" },
  { code:"P2088", title:"Eksantrik Mili Ayar Selenoidi 'A' Pozisyon Açık Kaldı (Bank 1)", desc:"VVT/VANOS sistemi eksantrik milini ilerletemiyor. Rölantide titreşim, güç kaybı.", sys:["Motor Elektroniği","Değişken Supap Zamanlaması"], sev:"Yüksek" },
  { code:"P2089", title:"Eksantrik Mili Ayar Selenoidi 'A' Pozisyon Kapalı Kaldı (Bank 1)", desc:"VVT/VANOS selenoidi kapalı konumda sıkışmış, motor performansı düşer.", sys:["Motor Elektroniği","Değişken Supap Zamanlaması"], sev:"Yüksek" },
  { code:"P2090", title:"Eksantrik Mili Ayar Selenoidi 'B' Pozisyon Açık Kaldı (Bank 1)", desc:"Egzoz tarafı VVT selenoidi açık pozisyonda takılı kalmış.", sys:["Motor Elektroniği","Değişken Supap Zamanlaması"], sev:"Yüksek" },
  { code:"P2091", title:"Eksantrik Mili Ayar Selenoidi 'B' Pozisyon Kapalı Kaldı (Bank 1)", desc:"Egzoz eksantrik mili ayar selenoidi kapalı kalmış, emisyonlar artar.", sys:["Motor Elektroniği","Değişken Supap Zamanlaması"], sev:"Yüksek" },
  { code:"P2106", title:"Gaz Kelebeği Kontrol Sistemi Zorla Güç Sınırlaması", desc:"Motor beyni bir güvenlik sorunu tespit ederek motorun gücünü kasıtlı olarak sınırladı (Limp Mode).", sys:["Motor Elektroniği"], sev:"Kritik" },
  { code:"P2110", title:"Gaz Kelebeği Kontrol Sistemi Zorla Devir Sınırlaması", desc:"ECU motor devrini güvenlik nedeniyle sınırladı. Gaz pedalına basılsa da devir yükselmez.", sys:["Motor Elektroniği"], sev:"Kritik" },
  { code:"P2118", title:"Gaz Kelebeği Motoru Akım Aralığı/Performansı", desc:"Gaz kelebeği motoruna giden akım beklenen aralığın dışında.", sys:["Motor Elektroniği"], sev:"Yüksek" },
  { code:"P2119", title:"Gaz Kelebeği Gövdesi Aralık/Performans Sorunu", desc:"Gaz kelebeği fiziksel konumu ile beklenen konum uyuşmuyor. Kirli kelebek veya motor arızası.", sys:["Motor Elektroniği"], sev:"Kritik" },
  { code:"P2176", title:"Gaz Kelebeği Rölanti Pozisyonu Öğrenilmedi", desc:"Gaz kelebeği temizliği veya akü söküldükten sonra rölanti adaptasyonu yapılmamış.", sys:["Motor Elektroniği"], sev:"Orta" },
  { code:"P2178", title:"Sistem Rölanti Haricinde Çok Zengin (Bank 1)", desc:"Gaza basıldığında motor zengin karışıma giriyor. Enjektör sızıntısı veya basınç regülatörü arızası.", sys:["Yakıt Sistemi"], sev:"Yüksek" },
  { code:"P2188", title:"Sistem Rölantide Çok Zengin (Bank 1)", desc:"Rölantide aşırı yakıt enjeksiyonu. Enjektör sızıntısı, basınç regülatörü veya MAP sensörü.", sys:["Yakıt Sistemi"], sev:"Yüksek" },
  { code:"P2196", title:"Oksijen Sensörü Sinyali Zengin Karışımda Takılı Kaldı (B1S1)", desc:"Lambda sensörü sürekli zengin karışım okuyor, sensör ömrü dolmuş olabilir.", sys:["Egzoz ve Emisyon"], sev:"Yüksek" },
  { code:"P2270", title:"Oksijen Sensörü Fakir Sinyalde Takılı (Bank 1 Sensör 2)", desc:"Katalitik konvertör sonrası oksijen sensörü sürekli fakir değer gösteriyor.", sys:["Egzoz ve Emisyon"], sev:"Orta" },
  { code:"P2279", title:"Emme Havası Sistemi Kaçağı", desc:"Emme manifoldu ile gaz kelebeği arasında hava kaçağı var. Rölanti düzensizliği.", sys:["Motor Elektroniği","Emme Sistemi"], sev:"Yüksek" },
  { code:"P2400", title:"EVAP Kaçak Tespit Pompası Kontrol Devresi", desc:"Buharlaşma sistemi kaçak tespit pompası arızalı. Emisyon testini geçemez.", sys:["Yakıt Buharlaşma Sistemi"], sev:"Orta" },
  { code:"P2413", title:"EGR Sistemi Performans Sorunu", desc:"Egzoz gazı geri dönüş sistemi beklenen akış değerlerini karşılamıyor.", sys:["Egzoz ve Emisyon"], sev:"Yüksek" },
  { code:"P2453", title:"Dizel Partikül Filtresi Basınç Sensörü Arızası", desc:"DPF diferansiyel basınç sensörü hatalı okuyor. DPF rejenerasyon döngüsü bozulur.", sys:["Dizel Egzoz Sistemi","DPF"], sev:"Yüksek" },
  { code:"P2457", title:"EGR Soğutma Sistemi Performansı", desc:"EGR soğutucusu beklenen performansı sağlayamıyor. Soğutucu tıkanmış veya sızıntı var.", sys:["Egzoz ve Emisyon","EGR"], sev:"Yüksek" },
  { code:"P2458", title:"Dizel Partikül Filtresi Rejenerasyon Süresi Aşıldı", desc:"DPF rejenerasyonu normal süreden fazla sürüyor. Filtre aşırı tıkanmış olabilir.", sys:["Dizel Egzoz Sistemi","DPF"], sev:"Kritik" },
  { code:"P2459", title:"Dizel Partikül Filtresi Rejenerasyon Sıklığı Anormal", desc:"DPF çok sık rejenerasyona giriyor. Motor yağ tüketiyor veya enjektör sızıntısı var.", sys:["Dizel Egzoz Sistemi","DPF"], sev:"Yüksek" },
  { code:"P2463", title:"Dizel Partikül Filtresi Kurum Birikimi Aşırı", desc:"DPF içinde aşırı kurum birikmiş. Zorla rejenerasyon veya filtre temizliği gerekir.", sys:["Dizel Egzoz Sistemi","DPF"], sev:"Kritik" }
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
