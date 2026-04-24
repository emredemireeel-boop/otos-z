const fs = require('fs');

const file = 'data/obd-codes.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const existingCodes = new Set(data.map(d => d.code));

const newCodes = [
  {
    "code": "P0171",
    "title": "Sistem Çok Fakir (Bank 1)",
    "description": "Motor kontrol ünitesi (ECU), egzoz gazlarında çok fazla oksijen tespit etti. Yanma odasına giren hava/yakıt karışımı idealden daha fakir (hava fazla, yakıt az).",
    "type": "P",
    "isGeneric": true,
    "severity": "Kritik",
    "systems": ["Yakıt Sistemi", "Hava Emiş Sistemi"],
    "symptoms": ["Arıza lambası yanar", "Rölantide dalgalanma", "Güç kaybı", "Motorda tekleme"],
    "causes": ["Vakum kaçağı", "Arızalı MAF sensörü", "Tıkalı yakıt filtresi", "Arızalı yakıt pompası", "Oksijen sensörü arızası"],
    "fixes": ["Vakum kaçaklarını kontrol edin", "MAF sensörünü temizleyin veya değiştirin", "Yakıt basıncını ölçün", "Oksijen sensörlerini test edin"]
  },
  {
    "code": "P0172",
    "title": "Sistem Çok Zengin (Bank 1)",
    "description": "Egzoz gazlarında yeterince oksijen yok. Hava/yakıt karışımı çok zengin (yakıt fazla, hava az).",
    "type": "P",
    "isGeneric": true,
    "severity": "Önemli",
    "systems": ["Yakıt Sistemi", "Emisyon"],
    "symptoms": ["Siyah egzoz dumanı", "Yüksek yakıt tüketimi", "Çiğ gaz kokusu"],
    "causes": ["Arızalı yakıt enjektörü (işeme yapıyor)", "Arızalı MAF/MAP sensörü", "Kirli hava filtresi", "Yüksek yakıt basıncı"],
    "fixes": ["Hava filtresini kontrol edin", "Enjektör temizliği/değişimi yapın", "Yakıt basınç regülatörünü kontrol edin"]
  },
  {
    "code": "P0300",
    "title": "Rastgele/Çoklu Silindir Teklemesi",
    "description": "Birden fazla silindirde rastgele zamanlarda tekleme (misfire) algılandı.",
    "type": "P",
    "isGeneric": true,
    "severity": "Kritik",
    "systems": ["Ateşleme Sistemi", "Motor Mekaniği"],
    "symptoms": ["Motor titremesi", "Arıza lambasının yanıp sönmesi", "Çekiş düşüklüğü"],
    "causes": ["Aşınmış bujiler", "Arızalı ateşleme bobini", "Düşük yakıt basıncı", "Vakum kaçağı", "Kötü yakıt kalitesi"],
    "fixes": ["Bujileri ve bobinleri kontrol edin", "Vakum kaçağı testi yapın", "Yakıt basıncını kontrol edin"]
  },
  {
    "code": "P0301",
    "title": "Silindir 1 Teklemesi (Misfire)",
    "description": "1 numaralı silindirde tekleme veya yanma problemi tespit edildi.",
    "type": "P",
    "isGeneric": true,
    "severity": "Kritik",
    "systems": ["Ateşleme Sistemi"],
    "symptoms": ["Rölantide sarsıntı", "Performans kaybı"],
    "causes": ["1. silindir bujisi arızası", "1. silindir ateşleme bobini arızası", "1. silindir enjektör tıkanıklığı"],
    "fixes": ["Bobinlerin yerini değiştirerek arızayı teyit edin", "Bujiyi değiştirin", "Enjektörü kontrol edin"]
  },
  {
    "code": "P0302",
    "title": "Silindir 2 Teklemesi (Misfire)",
    "description": "2 numaralı silindirde tekleme tespit edildi.",
    "type": "P",
    "isGeneric": true,
    "severity": "Kritik",
    "systems": ["Ateşleme Sistemi"],
    "symptoms": ["Rölantide sarsıntı", "Performans kaybı"],
    "causes": ["2. silindir bujisi arızası", "2. silindir ateşleme bobini arızası", "2. silindir enjektörü"],
    "fixes": ["Bobini başka silindirle değiştirerek test edin", "Buji değişimi"]
  },
  {
    "code": "P0303",
    "title": "Silindir 3 Teklemesi (Misfire)",
    "description": "3 numaralı silindirde tekleme tespit edildi.",
    "type": "P",
    "isGeneric": true,
    "severity": "Kritik",
    "systems": ["Ateşleme Sistemi"],
    "symptoms": ["Rölantide sarsıntı", "Performans kaybı"],
    "causes": ["3. silindir bujisi arızası", "3. silindir ateşleme bobini arızası"],
    "fixes": ["Bobin/buji testi"]
  },
  {
    "code": "P0304",
    "title": "Silindir 4 Teklemesi (Misfire)",
    "description": "4 numaralı silindirde tekleme tespit edildi.",
    "type": "P",
    "isGeneric": true,
    "severity": "Kritik",
    "systems": ["Ateşleme Sistemi"],
    "symptoms": ["Rölantide sarsıntı", "Performans kaybı"],
    "causes": ["4. silindir bujisi arızası", "4. silindir ateşleme bobini arızası"],
    "fixes": ["Bobin/buji testi"]
  },
  {
    "code": "P0420",
    "title": "Katalitik Konvertör Verimliliği Eşik Değerin Altında (Bank 1)",
    "description": "Oksijen sensörleri, katalitik konvertörün zararlı gazları yeterince temizleyemediğini tespit etti.",
    "type": "P",
    "isGeneric": true,
    "severity": "Önemli",
    "systems": ["Egzoz ve Emisyon Sistemi"],
    "symptoms": ["Arıza lambası yanar", "Muayeneden geçememe", "Çürük yumurta kokusu"],
    "causes": ["Katalitik konvertör ömrünü tamamlamış", "Arızalı arka oksijen sensörü", "Egzoz kaçağı"],
    "fixes": ["Oksijen sensörlerinin voltaj değerlerini okuyun", "Gerekirse katalitik konvertörü yenileyin"]
  },
  {
    "code": "P0430",
    "title": "Katalitik Konvertör Verimliliği Eşik Değerin Altında (Bank 2)",
    "description": "Bank 2 tarafındaki katalitik konvertörün temizleme kapasitesi yetersiz.",
    "type": "P",
    "isGeneric": true,
    "severity": "Önemli",
    "systems": ["Egzoz ve Emisyon Sistemi"],
    "symptoms": ["Arıza lambası yanar"],
    "causes": ["Arızalı konvertör", "Arızalı O2 sensörü"],
    "fixes": ["Katalizör ve sensör kontrolü"]
  },
  {
    "code": "P0401",
    "title": "EGR Akışı Yetersiz",
    "description": "Egzoz Gazı Geri Çevrim (EGR) sisteminden geçen gaz miktarı beklenenden daha az.",
    "type": "P",
    "isGeneric": true,
    "severity": "Önemli",
    "systems": ["Emisyon Sistemi"],
    "symptoms": ["Arıza lambası yanar", "Motorda vuruntu (pinging)", "Nox emisyon artışı"],
    "causes": ["Tıkalı EGR valfi veya kanalları", "Arızalı EGR vakum valfi", "DPF tıkanıklığı (dizellerde)"],
    "fixes": ["EGR valfini söküp karbon birikintilerini temizleyin", "EGR kanallarını temizleyin", "EGR valfini değiştirin"]
  },
  {
    "code": "P0442",
    "title": "EVAP Sistemi Kaçağı Tespit Edildi (Küçük Sızıntı)",
    "description": "Yakıt buharı geri kazanım sisteminde (EVAP) çok küçük boyutta (0.040 inç) bir sızıntı tespit edildi.",
    "type": "P",
    "isGeneric": true,
    "severity": "Rutin",
    "systems": ["Yakıt Sistemi", "Emisyon"],
    "symptoms": ["Arıza lambası yanar", "Hafif benzin kokusu"],
    "causes": ["Gevşek veya bozuk yakıt depo kapağı", "EVAP hortumlarında çatlak", "Arızalı purj valfi"],
    "fixes": ["Yakıt depo kapağını sıkın veya yenileyin", "Sistemde duman testi yaparak sızıntıyı bulun"]
  },
  {
    "code": "P0455",
    "title": "EVAP Sistemi Kaçağı Tespit Edildi (Büyük Sızıntı)",
    "description": "EVAP sisteminde büyük bir vakum kaçağı var.",
    "type": "P",
    "isGeneric": true,
    "severity": "Önemli",
    "systems": ["Yakıt Sistemi"],
    "symptoms": ["Aşırı benzin kokusu", "Arıza lambası yanar"],
    "causes": ["Açık unutulmuş veya kayıp depo kapağı", "Yırtık EVAP hortumu", "Purj valfinin açık kalması"],
    "fixes": ["Depo kapağını kontrol edin", "EVAP sistemi duman testi"]
  },
  {
    "code": "P0128",
    "title": "Motor Soğutma Suyu Termostatı Arızası",
    "description": "Motor çalışma sıcaklığına belirlenen süre içinde ulaşamıyor.",
    "type": "P",
    "isGeneric": true,
    "severity": "Önemli",
    "systems": ["Soğutma Sistemi"],
    "symptoms": ["Kaloriferin iyi ısıtmaması", "Hararet göstergesinin 90'a ulaşmaması", "Yakıt tüketimi artışı"],
    "causes": ["Termostatın açık kalması", "Arızalı sıcaklık sensörü", "Sürekli çalışan radyatör fanı"],
    "fixes": ["Termostatı yenileyin", "Hararet müşürünü kontrol edin"]
  },
  {
    "code": "P0340",
    "title": "Eksantrik Mili Pozisyon Sensörü (Camshaft) 'A' Devresi",
    "description": "Motor kontrol ünitesi (ECU), eksantrik milinin dönüş pozisyon sinyalini alamıyor.",
    "type": "P",
    "isGeneric": true,
    "severity": "Kritik",
    "systems": ["Motor Elektroniği"],
    "symptoms": ["Motorun geç çalışması veya hiç çalışmaması", "Düşük çekiş", "Sürüş esnasında stop etme"],
    "causes": ["Arızalı eksantrik mili sensörü", "Sensör kablolarında kopukluk", "Sente atlamış triger kayışı"],
    "fixes": ["Sensörü ve soketini değiştirin", "Triger sente ayarını kontrol edin"]
  },
  {
    "code": "P0335",
    "title": "Krank Mili Pozisyon Sensörü 'A' Devresi",
    "description": "ECU, krank milinden dönüş devri sinyalini alamıyor.",
    "type": "P",
    "isGeneric": true,
    "severity": "Kritik",
    "systems": ["Motor Elektroniği"],
    "symptoms": ["Motor kesinlikle çalışmaz (Marş basar ama ateşleme yapmaz)", "Seyir halindeyken aniden motor stop eder"],
    "causes": ["Arızalı krank devir sensörü (okuyucu)", "Krank dişlisi hasarı", "Kablolama sorunu"],
    "fixes": ["Krank sensörünü değiştirin", "Soketi ve tesisatı onarın"]
  },
  {
    "code": "P0101",
    "title": "MAF Sensörü Performans/Aralık Arızası",
    "description": "Kütle Hava Akış (MAF) sensörünün okuduğu değer beklenen aralıkta değil.",
    "type": "P",
    "isGeneric": true,
    "severity": "Önemli",
    "systems": ["Hava Emiş Sistemi"],
    "symptoms": ["Rölantide sarsıntı", "Gaza basınca boğulma", "Siyah duman"],
    "causes": ["Kirli MAF sensörü teli", "Emme manifoldu vakum kaçağı", "Arızalı MAF sensörü"],
    "fixes": ["Özel MAF spreyi ile temizleyin", "Sensörü yenileyin"]
  },
  {
    "code": "P0135",
    "title": "Oksijen Sensörü Isıtıcı Devresi (Bank 1 Sensör 1)",
    "description": "Birinci oksijen sensörünün içindeki ısıtıcı eleman bozuk. Sensör hızlı ısınamıyor.",
    "type": "P",
    "isGeneric": true,
    "severity": "Önemli",
    "systems": ["Emisyon Sistemi"],
    "symptoms": ["Arıza lambası yanar", "Soğuk motorda ilk çalışma sarsıntısı"],
    "causes": ["Sensör içi ısıtıcı direnç kopuk", "Sigorta atık"],
    "fixes": ["Oksijen sensörünü değiştirin (ısıtıcısı bozuk tamir olmaz)"]
  },
  {
    "code": "P0700",
    "title": "Şanzıman Kontrol Sistemi Arızası",
    "description": "Şanzıman beyni (TCM), motordan (ECU) arıza lambasını yakmasını talep ediyor.",
    "type": "P",
    "isGeneric": true,
    "severity": "Kritik",
    "systems": ["Otomatik Şanzıman"],
    "symptoms": ["Vites geçişlerinde vuruntu", "Araç koruma (limp) moduna girer", "Vites yükseltmeme"],
    "causes": ["Şanzıman içinde oluşan spesifik bir mekanik/elektronik arıza"],
    "fixes": ["TCM'ye bağlanıp alt şanzıman arıza kodlarını (P07XX) okuyun"]
  },
  {
    "code": "P0740",
    "title": "Tork Konvertörü Kavrama Devresi Arızası",
    "description": "Otomatik şanzıman tork konvertörü (lock-up) kavraması beklenen kilitlemeyi yapamıyor.",
    "type": "P",
    "isGeneric": true,
    "severity": "Kritik",
    "systems": ["Otomatik Şanzıman"],
    "symptoms": ["Yüksek hızlarda aşırı yakıt tüketimi", "Şanzımanın aşırı ısınması"],
    "causes": ["Arızalı lock-up selenoidi", "Tork konvertörü mekanik arızası", "Kirli şanzıman yağı"],
    "fixes": ["Şanzıman yağını kontrol edin", "Tork konvertörü veya selenoid onarımı"]
  },
  {
    "code": "P0299",
    "title": "Turboşarj/Süperşarj Düşük Basınç (Underboost)",
    "description": "Turbo basıncı ECU'nun talep ettiği değerin çok altında.",
    "type": "P",
    "isGeneric": true,
    "severity": "Kritik",
    "systems": ["Aşırı Besleme (Turbo)"],
    "symptoms": ["Hızlanmada ciddi performans kaybı", "Araç 3000 deviri geçmez", "Emiş sesi (ıslık)"],
    "causes": ["Turbo hortumlarında yırtık veya kelepçe atması", "Arızalı wastegate", "Turbonun mekanik arızası", "Arızalı N75 turbo valfi"],
    "fixes": ["Tüm hava/intercooler hortumlarını kontrol edin", "Turbo kontrol valflerini değiştirin"]
  },
  {
    "code": "P0234",
    "title": "Turboşarj/Süperşarj Yüksek Basınç (Overboost)",
    "description": "Turbo basıncı güvenlik sınırlarını aşacak şekilde çok yüksek.",
    "type": "P",
    "isGeneric": true,
    "severity": "Kritik",
    "systems": ["Aşırı Besleme (Turbo)"],
    "symptoms": ["Gazı aniden kesme (koruma modu)", "Motor arıza lambası"],
    "causes": ["Wastegate takılı kalmış", "VTG (değişken geometri) kanatçıkları kurum bağlamış/sıkışmış"],
    "fixes": ["Turboyu söküp kanatçıkları temizletin", "Wastegate onarımı"]
  },
  {
    "code": "P2002",
    "title": "Dizel Partikül Filtresi (DPF) Verimliliği Düşük",
    "description": "DPF (Partikül Filtresi) tıkanmış veya yeterli temizlik yapamıyor.",
    "type": "P",
    "isGeneric": true,
    "severity": "Önemli",
    "systems": ["Egzoz ve Emisyon (Dizel)"],
    "symptoms": ["Çekiş düşüklüğü", "Sürekli rejenerasyon denemesi (rölanti yüksek)", "Araç koruma modu"],
    "causes": ["Şehir içi düşük hızlarda sürekli kullanım", "Arızalı DPF fark basınç sensörü", "Tamamen tıkalı DPF"],
    "fixes": ["Bilgisayarla servis rejenerasyonu yapın", "Fark basınç sensörünü değiştirin", "DPF temizliği veya değişimi"]
  },
  {
    "code": "P0113",
    "title": "Emme Havası Sıcaklık (IAT) Sensörü Devresi Yüksek Voltaj",
    "description": "Giren hava sıcaklık sensörü -40 derece gibi gerçek dışı soğuk okuyor (açık devre).",
    "type": "P",
    "isGeneric": true,
    "severity": "Önemli",
    "systems": ["Hava Emiş Sistemi"],
    "symptoms": ["Soğuk marşta zorlanma", "Yüksek yakıt tüketimi"],
    "causes": ["IAT sensörü fişi çıkık veya kablosu kopuk", "Arızalı sensör"],
    "fixes": ["Soketi ve kabloları kontrol edin, sensörü yenileyin"]
  },
  {
    "code": "P2138",
    "title": "Gaz Pedalı Pozisyon Sensörü D/E Voltaj Korelasyonu",
    "description": "Elektronik gaz pedalındaki iki farklı sensörün okuduğu açı değerleri birbiriyle uyuşmuyor.",
    "type": "P",
    "isGeneric": true,
    "severity": "Kritik",
    "systems": ["Elektronik Gaz Kelebeği"],
    "symptoms": ["Gaza basınca araç devirlenmez (Limp Mode)", "Motor rölantide kalır"],
    "causes": ["Elektronik gaz pedalı arızası", "Pedal fişinde oksitlenme"],
    "fixes": ["Gaz pedalını (potansiyometre) yenileyin", "Soketi temizleyin"]
  },
  {
    "code": "P0087",
    "title": "Yakıt Rayı Sistem Basıncı Çok Düşük",
    "description": "Yüksek basınç yakıt hattındaki basınç ECU'nun beklediği değerden çok düşük.",
    "type": "P",
    "isGeneric": true,
    "severity": "Kritik",
    "systems": ["Yakıt Sistemi"],
    "symptoms": ["Gaza tam basıldığında motorun stop etmesi veya teklemesi", "Uzun marş"],
    "causes": ["Arızalı yüksek basınç pompası", "Arızalı yakıt rayı basınç sensörü", "Tıkalı yakıt filtresi", "Depo içi yakıt pompası zayıf"],
    "fixes": ["Yakıt basıncını mekanik manometre ile ölçün", "Pompaları ve filtreleri kontrol edin"]
  },
  {
    "code": "P0088",
    "title": "Yakıt Rayı Sistem Basıncı Çok Yüksek",
    "description": "Yakıt hattındaki basınç üst limitlerin üzerinde. Genellikle dizellerde görülür.",
    "type": "P",
    "isGeneric": true,
    "severity": "Kritik",
    "systems": ["Yakıt Sistemi"],
    "symptoms": ["Siyah duman", "Motorun sarsıntılı çalışması", "Korumaya alma"],
    "causes": ["Yakıt basınç regülatörü/valfi sıkışmış", "Geri dönüş hattı tıkalı"],
    "fixes": ["Basınç ayar valfini (Müşürünü) değiştirin"]
  },
  {
    "code": "P0500",
    "title": "Araç Hız Sensörü (VSS) 'A'",
    "description": "Motor beyni aracın ne kadar hızla gittiğine dair sinyal alamıyor.",
    "type": "P",
    "isGeneric": true,
    "severity": "Önemli",
    "systems": ["Hız ve İletişim"],
    "symptoms": ["Kilometre saati çalışmaz", "Otomatik vites geçişleri sapıtır", "ABS/ESP devre dışı"],
    "causes": ["Arızalı VSS sensörü", "Kopuk kablo", "ABS beyni ile iletişim kaybı"],
    "fixes": ["Hız sensörünü değiştirin veya ABS soketini temizleyin"]
  },
  {
    "code": "P0507",
    "title": "Rölanti Kontrol Sistemi Devri Beklenenden Yüksek",
    "description": "Araç rölantisi ECU'nun belirlediği normal devrin (örn. 800 RPM) çok üzerinde çalışıyor.",
    "type": "P",
    "isGeneric": true,
    "severity": "Önemli",
    "systems": ["Hava/Yakıt Oranı"],
    "symptoms": ["Işıklarda dururken aracın ileri atılmak istemesi", "Yüksek devirli rölanti (1500+ RPM)"],
    "causes": ["Emme manifolduna vakum kaçağı (hortum yırtığı)", "Arızalı/Kirli Rölanti Valfi (IAC)", "Kirlenmiş elektronik gaz kelebeği"],
    "fixes": ["Vakum kaçaklarını kapatın", "Gaz kelebeği adaptasyonu yapın"]
  },
  {
    "code": "P0505",
    "title": "Rölanti Hava Kontrol (IAC) Sistem Arızası",
    "description": "Rölanti motoru veya valfi komutlara cevap vermiyor.",
    "type": "P",
    "isGeneric": true,
    "severity": "Önemli",
    "systems": ["Elektronik"],
    "symptoms": ["Araç rölantide duramayıp stop ediyor", "Dalgalı rölanti"],
    "causes": ["Rölanti motoru karbon birikintisinden sıkışmış", "Elektrik motoru yanmış"],
    "fixes": ["Rölanti valfini balata spreyi ile temizleyin veya değiştirin"]
  },
  {
    "code": "P2293",
    "title": "Yakıt Basınç Regülatörü 2 Performansı",
    "description": "Yüksek basınç pompası üzerindeki regülatör valfi düzgün çalışmıyor.",
    "type": "P",
    "isGeneric": true,
    "severity": "Kritik",
    "systems": ["Yakıt Sistemi"],
    "symptoms": ["Düşük devirde tekleme", "Motor gücünde ciddi azalma"],
    "causes": ["Yüksek basınç pompası mekanik arızası", "Eksantrik itici aşınması (VAG grubu FSI/TFSI motorlarda çok yaygındır)"],
    "fixes": ["Pompa iticisini kontrol edin/yenileyin"]
  },
  {
    "code": "P1345",
    "title": "Eksantrik ve Krank Mili Korelasyon Hatası",
    "description": "Krank ile eksantrik milleri arasındaki mekanik zamanlama bozuk (Sente Atlaması).",
    "type": "P",
    "isGeneric": false,
    "severity": "Kritik",
    "systems": ["Motor Mekaniği"],
    "symptoms": ["Motor çalışmaz", "Valflerin pistonlara vurma sesi (şakırtı)", "Büyük çekiş kaybı"],
    "causes": ["Triger kayışı kopmuş veya dişi atlamış", "Triger zinciri uzamış", "Gergiler boşalmış"],
    "fixes": ["Motoru durdurun. Triger setini yenileyip senteyi düzgünce ayarlayın. (Çalıştırmaya zorlamak motoru kullanılmaz hale getirebilir)"]
  },
  {
    "code": "P1516",
    "title": "Gaz Kelebeği Aktüatörü Kontrol Modülü Pozisyon Performansı",
    "description": "Motor beyni, gaz kelebeğinin olması gereken açıda olmadığını tespit etti.",
    "type": "P",
    "isGeneric": false,
    "severity": "Kritik",
    "systems": ["Hava Emiş Sistemi"],
    "symptoms": ["Limp mode (Güvenli sürüş modu)", "Aracın gaza tepki vermemesi"],
    "causes": ["Gaz kelebeği motoru arızalı", "Kelebek aşırı kirlenmeden ötürü sıkışıyor"],
    "fixes": ["Gaz kelebeği gövdesini söküp temizleyin, adaptasyon yapın"]
  }
];

let addedCount = 0;
for (const nc of newCodes) {
  if (!existingCodes.has(nc.code)) {
    data.push(nc);
    addedCount++;
  }
}

data.sort((a, b) => a.code.localeCompare(b.code));
fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
console.log(`Added ${addedCount} new important Powertrain (P) codes.`);
