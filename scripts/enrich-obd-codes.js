/**
 * OBD Kodları Zenginleştirme & Genişletme Scripti
 * 
 * Bu script:
 * 1. Mevcut obd-codes.json dosyasını okur
 * 2. Fakir içerikli kodları tespit edip zenginleştirir
 * 3. İngilizce başlıkları Türkçeye çevirir
 * 4. Yazım hatalarını düzeltir
 * 5. Eksik popüler OBD kodlarını ekler
 * 6. Sonucu yazar
 */

const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '..', 'data', 'obd-codes.json');

// ═══════════════════════════════════════════════════════════════
// BÖLÜM 1: KOD AİLELERİNE GÖRE ZENGİN İÇERİK HARİTASI
// ═══════════════════════════════════════════════════════════════

// P Kodları — Motor & Şanzıman
const P_FAMILY_DATA = {
  // P00xx — Yakıt ve Hava Ölçüm Sistemi
  'P000': {
    systems: ['Yakıt Sistemi'],
    severity: 'Orta',
    defaultSymptoms: [
      'Motor arıza lambası (MIL) yanar',
      'Motor performansında düşüş',
      'Yakıt tüketiminde belirgin artış',
      'Rölantide titreşim veya düzensizlik'
    ],
    defaultCauses: [
      'Yakıt basınç regülatörü arızası veya tıkanması',
      'Yakıt pompası performans düşüklüğü',
      'İlgili kablolama veya konektör hasarı',
      'ECU (Motor Kontrol Ünitesi) yazılım hatası'
    ],
    defaultFixes: [
      'Yakıt basınç regülatörünü kontrol edin ve gerekirse değiştirin',
      'Kablo tesisatı ve soketleri multimetre ile test edin',
      'OBD-II tarayıcı ile canlı veri okuyarak yakıt basıncını izleyin',
      'Arıza kodunu silin ve yol testi yaparak tekrarını gözlemleyin'
    ]
  },
  'P001': {
    systems: ['Yakıt Sistemi', 'Eksantrik Mili Sistemi'],
    severity: 'Orta',
    defaultSymptoms: [
      'Motor arıza lambası (MIL) yanar',
      'Motor çalışırken anormal sesler',
      'Hızlanma sırasında güç kaybı',
      'Rölanti devir sayısında dalgalanma'
    ],
    defaultCauses: [
      'Eksantrik mili pozisyon aktüatörü arızası',
      'Eksantrik mili zincir/kayış uzaması',
      'Yağ basıncı düşüklüğü veya kirli motor yağı',
      'İlgili solenoid valfin tıkanması'
    ],
    defaultFixes: [
      'Motor yağı seviyesini ve kalitesini kontrol edin, gerekirse değiştirin',
      'Eksantrik mili pozisyon sensörünü multimetre ile test edin',
      'Zaman zinciri/kayışı gerginliğini kontrol edin',
      'VVT solenoid valfini temizleyin veya değiştirin'
    ]
  },
  'P002': {
    systems: ['Yakıt Sistemi'],
    severity: 'Orta',
    defaultSymptoms: [
      'Motor arıza lambası (MIL) yanar',
      'Motor performansında belirgin düşüş',
      'Soğuk çalıştırmada zorluk',
      'Yakıt tüketiminde artış'
    ],
    defaultCauses: [
      'Yakıt enjektör devresi arızası',
      'Yakıt basınç sensörü hatası',
      'İlgili kablo demetinde kısa devre veya açık devre',
      'ECU bağlantı sorunu'
    ],
    defaultFixes: [
      'Enjektör dirençlerini multimetre ile ölçün (tipik: 12-16 ohm)',
      'Yakıt rampası basıncını manometre ile kontrol edin',
      'Kablo demetindeki konektörleri görsel olarak inceleyin',
      'Arıza kodunu silin ve test sürüşü yapın'
    ]
  },
  // P01xx — Yakıt/Hava Sensörleri (MAF, MAP, IAT, ECT)
  'P010': {
    systems: ['Yakıt Sistemi', 'Emme Manifoldu'],
    severity: 'Yüksek',
    defaultSymptoms: [
      'Motor arıza lambası (MIL) yanar',
      'Belirgin güç kaybı ve sarsıntı',
      'Yakıt tüketiminde %20-40 artış',
      'Motor rölantide titrer veya stop eder',
      'Egzozdan siyah duman'
    ],
    defaultCauses: [
      'MAF (Kütle Hava Akış) sensörü kirlenmesi veya arızası',
      'Hava filtresi aşırı kirli veya tıkalı',
      'Emme manifoldunda hava kaçağı (vakum kaçağı)',
      'MAF sensör konektöründe oksitlenme veya gevşeklik'
    ],
    defaultFixes: [
      'MAF sensörünü özel MAF temizleyici sprey ile temizleyin',
      'Hava filtresini kontrol edin ve gerekirse değiştirin',
      'Emme manifoldu contalarını ve hortumlarını hava kaçağı için kontrol edin',
      'Sensör kablolama ve konektörlerini temizleyin, gerekirse sensörü değiştirin'
    ]
  },
  'P011': {
    systems: ['Emme Sistemi', 'Soğutma Sistemi'],
    severity: 'Orta',
    defaultSymptoms: [
      'Motor arıza lambası (MIL) yanar',
      'Soğuk havalarda zor çalıştırma',
      'Rölanti devir dalgalanması',
      'Yakıt karışımında dengesizlik',
      'Klima performansında düşüş'
    ],
    defaultCauses: [
      'Emme havası sıcaklık (IAT) sensörü arızası',
      'Sensör kablolarında açık devre veya kısa devre',
      'Konektörde su birikmesi veya oksitlenme',
      'Motor soğutma sıcaklık (ECT) sensörü hatası'
    ],
    defaultFixes: [
      'IAT/ECT sensör direncini multimetre ile ölçün (sıcaklığa göre değişir)',
      'Sensör soketini kontak temizleyici ile temizleyin',
      'Kablo demetini fiziksel hasar açısından inceleyin',
      'Sensörü orijinal parça ile değiştirin'
    ]
  },
  'P012': {
    systems: ['Kelebek Gövdesi', 'Gaz Pedalı'],
    severity: 'Yüksek',
    defaultSymptoms: [
      'Motor arıza lambası (MIL) yanar',
      'Gaz pedalına yanıt gecikmesi',
      'Acil durum moduna (limp mode) geçiş',
      'Rölantide dengesizlik',
      'Hızlanma sırasında takılma hissi'
    ],
    defaultCauses: [
      'Kelebek konum sensörü (TPS) arızası',
      'Gaz pedalı pozisyon sensörü hatası',
      'Elektronik kelebek gövdesi kontrol motoru arızası',
      'İlgili kablolama veya topraklama sorunu'
    ],
    defaultFixes: [
      'Kelebek gövdesini özel karbüratör temizleyici ile temizleyin',
      'TPS sensör voltajını OBD-II tarayıcı ile canlı veri olarak izleyin',
      'Gaz pedalı sensör çıkışlarını multimetre ile kontrol edin',
      'Gerekirse kelebek gövdesi komple değişimi ve adaptasyon işlemi yapın'
    ]
  },
  'P013': {
    systems: ['Oksijen Sensörü', 'Egzoz Sistemi'],
    severity: 'Orta',
    defaultSymptoms: [
      'Motor arıza lambası (MIL) yanar',
      'Yakıt tüketiminde belirgin artış',
      'Egzozdan kötü koku',
      'Emisyon testinden kalma',
      'Motor performansında hafif düşüş'
    ],
    defaultCauses: [
      'Oksijen (Lambda/O2) sensörü ömrünü tamamlamış veya arızalı',
      'Sensör kablosunda hasar veya korozyon',
      'Egzoz kaçağı (sensör öncesinde)',
      'Yakıt enjektör sızıntısı (zengin karışım)'
    ],
    defaultFixes: [
      'O2 sensör voltajını OBD-II canlı veri ile izleyin (0.1-0.9V arası salınım)',
      'Sensör ısıtıcı direncini kontrol edin (tipik: 4-12 ohm)',
      'Egzoz manifoldu ve boru bağlantılarını sızıntı açısından kontrol edin',
      'Oksijen sensörünü orijinal veya kaliteli muadil ile değiştirin'
    ]
  },
  'P014': {
    systems: ['Oksijen Sensörü', 'Egzoz Sistemi'],
    severity: 'Orta',
    defaultSymptoms: [
      'Motor arıza lambası (MIL) yanar',
      'Emisyon değerlerinde artış',
      'Yakıt ekonomisinde kötüleşme',
      'Katalitik konvertör verimliliğinde düşüş',
      'Egzoz emisyon testinden kalma'
    ],
    defaultCauses: [
      'Oksijen sensörü (Banka 1 Sensör 2) yaşlanmış veya arızalı',
      'Katalitik konvertör verimliliği düşmüş',
      'Sensör kablolarında hasar',
      'Egzoz sistemi sızıntısı'
    ],
    defaultFixes: [
      'Kat sonrası O2 sensörünün voltaj kararlılığını kontrol edin (0.6-0.8V civarı stabil olmalı)',
      'Katalitik konvertör sıcaklık farkını ölçün (giriş-çıkış min 50°C fark)',
      'Sensör ve kablo bağlantılarını kontrol edin',
      'Gerekirse katalitik konvertör veya O2 sensörünü değiştirin'
    ]
  },
  // P015x-P019x — Krank/Eksantrik Sensörleri
  'P015': {
    systems: ['Oksijen Sensörü', 'Yakıt Sistemi'],
    severity: 'Orta',
    defaultSymptoms: [
      'Motor arıza lambası (MIL) yanar',
      'Yakıt tüketiminde artış',
      'Motor performansında düşüş',
      'Emisyon değerlerinde yükselme'
    ],
    defaultCauses: [
      'Oksijen sensörü yavaş tepki veriyor',
      'Sensör elemanı kirlenmesi veya zehirlenmesi',
      'Yakıt basıncı problemi',
      'Egzoz kaçağı'
    ],
    defaultFixes: [
      'O2 sensörünün tepki süresini canlı veri ile kontrol edin',
      'Yakıt basıncını ölçün',
      'Egzoz manifoldunu sızıntı açısından inceleyin',
      'Oksijen sensörünü değiştirin'
    ]
  },
  'P016': {
    systems: ['Krank Mili', 'Eksantrik Mili'],
    severity: 'Yüksek',
    defaultSymptoms: [
      'Motor arıza lambası (MIL) yanar',
      'Motor çalıştırmada zorluk veya çalışmama',
      'Motordan anormal tıkırtı sesleri',
      'Güç kaybı ve sarsıntı',
      'Rölantide düzensizlik'
    ],
    defaultCauses: [
      'Krank mili pozisyon sensörü arızası',
      'Eksantrik mili pozisyon sensörü hatası',
      'Zaman zinciri/kayışı uzamış veya atlamış',
      'Sensör ile dişli çark arasındaki hava aralığında değişiklik',
      'Krank mili sensör kablosunda hasar'
    ],
    defaultFixes: [
      'Krank/eksantrik sensörlerinin sinyal çıkışlarını osiloskop ile kontrol edin',
      'Zaman zinciri/kayışı gerginliğini ve durumunu kontrol edin',
      'Sensör ve dişli çark arasındaki boşluğu kontrol edin',
      'Arızalı sensörü orijinal parça ile değiştirin'
    ]
  },
  'P017': {
    systems: ['Krank Mili', 'Eksantrik Mili'],
    severity: 'Yüksek',
    defaultSymptoms: [
      'Motor arıza lambası (MIL) yanar',
      'Motor performansında ciddi düşüş',
      'Motorun zaman zaman durması',
      'Çalıştırma güçlüğü',
      'Anormal motor sesleri'
    ],
    defaultCauses: [
      'Krank-eksantrik mili korelasyon hatası',
      'Zaman zinciri/kayışı atlama',
      'VVT (Değişken Supap Zamanlaması) sistemi arızası',
      'Zincir gergi mekanizması arızası'
    ],
    defaultFixes: [
      'Krank ve eksantrik pozisyon sensör sinyallerini eş zamanlı kontrol edin',
      'Zaman zinciri/kayışı değişim geçmişini araştırın',
      'VVT solenoid ve aktüatör testleri yapın',
      'Gerekirse zaman zinciri/kayışı seti komple değiştirin'
    ]
  },
  // P02xx — Yakıt Karışımı ve Enjektörler
  'P020': {
    systems: ['Enjeksiyon Sistemi'],
    severity: 'Yüksek',
    defaultSymptoms: [
      'Motor arıza lambası (MIL) yanar',
      'Bir veya birden fazla silindirde ateşleme kaybı',
      'Motor sarsıntılı çalışır',
      'Güç kaybı ve kötü performans',
      'Egzozdan yanmamış yakıt kokusu'
    ],
    defaultCauses: [
      'Enjektör devresi açık veya kısa devre',
      'Enjektör arızası veya tıkanması',
      'ECU enjektör sürücü devresi hasarı',
      'Enjektör konektöründe korozyon veya gevşeklik'
    ],
    defaultFixes: [
      'Enjektör dirençlerini ölçün ve karşılaştırın (tipik: 12-16 ohm)',
      'Enjektör konnektörlerini çıkarıp temizleyin',
      'Enjektör püskürtme paternini test edin',
      'Arızalı enjektörü değiştirin veya ultrasonik temizleme yaptırın'
    ]
  },
  'P021': {
    systems: ['Enjeksiyon Sistemi', 'Yakıt Sistemi'],
    severity: 'Orta',
    defaultSymptoms: [
      'Motor arıza lambası (MIL) yanar',
      'Yakıt tüketiminde artış',
      'Motor performans düşüklüğü',
      'Rölantide düzensizlik'
    ],
    defaultCauses: [
      'Enjektör devresi sinyal aralığı hatası',
      'Enjektör mekanik sıkışma',
      'Yakıt basınç regülatörü sorunu',
      'ECU enjektör kontrol hatası'
    ],
    defaultFixes: [
      'Enjektör çalışma seslerini stetoskop ile dinleyin',
      'Yakıt basıncını kontrol edin',
      'Enjektör devresini multimetre ile test edin',
      'Arıza kodunu silip test sürüşü yapın'
    ]
  },
  'P022': {
    systems: ['Enjeksiyon Sistemi'],
    severity: 'Orta',
    defaultSymptoms: [
      'Motor arıza lambası (MIL) yanar',
      'Motor performans kaybı',
      'Yakıt tüketim artışı',
      'Rölanti düzensizliği',
      'Emisyon değerlerinde artış'
    ],
    defaultCauses: [
      'Enjektör devresi düşük sinyal',
      'Kablolama hasarı',
      'Kötü topraklama bağlantısı',
      'ECU sürücü devresi arızası'
    ],
    defaultFixes: [
      'Enjektör kablo demetini kontrol edin',
      'Topraklama noktalarını temizleyin',
      'Enjektör konektörünü kontrol edin',
      'ECU yazılım güncellemesi yaptırın'
    ]
  },
  // P03xx — Ateşleme Sistemi
  'P030': {
    systems: ['Ateşleme Sistemi'],
    severity: 'Yüksek',
    defaultSymptoms: [
      'Motor arıza lambası (MIL) yanıp söner (misfire)',
      'Motor sarsıntılı ve düzensiz çalışır',
      'Belirgin güç kaybı',
      'Egzozdan patlamalar veya geri tepmeler',
      'Hızlanma sırasında takılma',
      'Rölantide titreşim ve sallanma'
    ],
    defaultCauses: [
      'Buji aşınmış, kirlenmiş veya yanlış aralıklı',
      'Ateşleme bobini (koil) arızası',
      'Buji kablosu/bootu hasarlı veya yıpranmış',
      'Sıkıştırma basıncı düşük (mekanik sorun)',
      'Enjektör tıkanması veya arızası',
      'Vakum kaçağı'
    ],
    defaultFixes: [
      'Bujileri çıkarın, elektrot aralığını ve durumunu kontrol edin, gerekirse değiştirin',
      'Ateşleme bobinlerini tek tek test edin (direnci ölçün veya takas yapın)',
      'Buji kablolarını ve bootlarını görsel olarak inceleyin, çatlak/aşınma varsa değiştirin',
      'Silindir kompresyon testi yapın (min. 10 bar olmalı)',
      'Arıza kodunu silin, test sürüşü yapın ve tekrarını izleyin'
    ]
  },
  'P031': {
    systems: ['Ateşleme Sistemi'],
    severity: 'Yüksek',
    defaultSymptoms: [
      'Motor arıza lambası (MIL) yanıp söner',
      'İlgili silindirde ateşleme kaybı (misfire)',
      'Motor sarsıntılı çalışır',
      'Güç kaybı ve rölanti düzensizliği',
      'Egzozdan yanmamış yakıt kokusu'
    ],
    defaultCauses: [
      'İlgili silindirdeki bujinin aşınması veya kirlenmesi',
      'Ateşleme bobini (koil) arızası',
      'Enjektör tıkanması veya arızası',
      'Düşük silindir kompresyon basıncı',
      'Supap contası sızıntısı'
    ],
    defaultFixes: [
      'İlgili silindirin bujisini kontrol edin ve gerekirse değiştirin',
      'Ateşleme bobinini sağlam bir silindirdeki ile yer değiştirerek test edin',
      'Enjektörü test edin (direnç ölçümü ve püskürtme testi)',
      'Silindir kompresyon testi yaparak mekanik sorunu ekarte edin'
    ]
  },
  // P04xx — Emisyon Kontrol Sistemi
  'P040': {
    systems: ['Emisyon Kontrol Sistemi'],
    severity: 'Orta',
    defaultSymptoms: [
      'Motor arıza lambası (MIL) yanar',
      'Egzoz emisyon değerlerinde artış',
      'Motor performansında hafif düşüş',
      'Rölantide düzensizlik',
      'Egzozdan koyu duman'
    ],
    defaultCauses: [
      'EGR (Egzoz Gazı Geri Devirdaim) valfı karbon birikimi veya sıkışması',
      'EGR solenoid arızası',
      'EGR geçiş kanallarında tıkanıklık',
      'EGR pozisyon sensörü hatası',
      'Vakum hortumunda çatlak veya sızıntı'
    ],
    defaultFixes: [
      'EGR valfını sökün, karbon birikimini temizleyin',
      'EGR solenoid valfını test edin ve gerekirse değiştirin',
      'EGR kanal ve geçişlerini karbon birikiminden temizleyin',
      'Vakum hortumlarını sızıntı açısından kontrol edin',
      'EGR pozisyon sensörünü multimetre ile test edin'
    ]
  },
  'P041': {
    systems: ['Emisyon Kontrol Sistemi', 'EGR Sistemi'],
    severity: 'Orta',
    defaultSymptoms: [
      'Motor arıza lambası (MIL) yanar',
      'EGR sistem performansında düşüş',
      'NOx emisyonlarında artış',
      'Motor vuruntu sesi',
      'Yakıt tüketimi artışı'
    ],
    defaultCauses: [
      'EGR valfı tam kapanmıyor veya açılmıyor',
      'EGR solenoid veya vakum kontrol arızası',
      'Emme manifoldu karbon birikimi',
      'DPFE (Diferansiyel Basınç) sensörü arızası'
    ],
    defaultFixes: [
      'EGR valfını sökün ve temizleyin veya değiştirin',
      'EGR kontrol solenoidini test edin',
      'DPFE/EGR basınç sensörünü kontrol edin',
      'Emme manifoldunu karbon birikiminden temizleyin'
    ]
  },
  'P042': {
    systems: ['Emisyon Kontrol Sistemi', 'Katalitik Konvertör'],
    severity: 'Yüksek',
    defaultSymptoms: [
      'Motor arıza lambası (MIL) yanar',
      'Emisyon testinden kalma',
      'Motor performansında düşüş',
      'Egzozdan kükürt (çürük yumurta) kokusu',
      'Yakıt tüketiminde artış'
    ],
    defaultCauses: [
      'Katalitik konvertör verimliliği eşik değerinin altında',
      'Katalitik konvertör iç yapısının bozulması veya erimesi',
      'Kat öncesi/sonrası oksijen sensörü arızası',
      'Motor iç mekanik sorunu (yağ yakma)',
      'Kötü kalite yakıt kullanımı'
    ],
    defaultFixes: [
      'Kat öncesi ve sonrası O2 sensör voltajlarını karşılaştırın',
      'Katalitik konvertör giriş-çıkış sıcaklık farkını ölçün (min 50°C fark olmalı)',
      'Motor yağ tüketimini kontrol edin',
      'Katalitik konvertörü değiştirin (yetkili serviste)',
      'Kötü yakıt kullanımını önleyin, kaliteli akaryakıt tercih edin'
    ]
  },
  'P043': {
    systems: ['Emisyon Kontrol Sistemi', 'EVAP Sistemi'],
    severity: 'Düşük',
    defaultSymptoms: [
      'Motor arıza lambası (MIL) yanar',
      'Yakıt kokusu hissedilmesi (özellikle sıcak havalarda)',
      'Yakıt tüketiminde hafif artış',
      'Emisyon testinden kalma'
    ],
    defaultCauses: [
      'EVAP (Yakıt Buharı Geri Kazanım) sisteminde kaçak',
      'Yakıt deposu kapağı gevşek, hasarlı veya eksik',
      'EVAP kömür kanisterı arızası',
      'EVAP kontrol solenoid valfı arızası',
      'EVAP hortum ve bağlantılarında çatlak'
    ],
    defaultFixes: [
      'Yakıt deposu kapağını sıkıca kapatın, contasını kontrol edin',
      'EVAP sistem hortumlarını ve bağlantılarını duman testi ile kontrol edin',
      'EVAP solenoid valfını test edin',
      'Kömür kanisterını kontrol edin ve gerekirse değiştirin',
      'Arıza kodunu silin, kapak sıkıysa birkaç sürüş döngüsü bekleyin'
    ]
  },
  'P044': {
    systems: ['Emisyon Kontrol Sistemi', 'EVAP Sistemi'],
    severity: 'Düşük',
    defaultSymptoms: [
      'Motor arıza lambası (MIL) yanar',
      'Yakıt kokusu (özellikle park halinde)',
      'Emisyon testinden kalma',
      'Yakıt tüketiminde hafif artış'
    ],
    defaultCauses: [
      'EVAP sisteminde büyük sızıntı',
      'Yakıt deposu kapağı hasarlı veya eksik',
      'EVAP hortumlarında kırık veya kopukluk',
      'Yakıt deposu veya dolum borusunda çatlak'
    ],
    defaultFixes: [
      'Yakıt deposu kapağını kontrol edin, gerekirse yenisini takın',
      'EVAP hortum ve bağlantılarını görsel olarak inceleyin',
      'Duman testi ile sızıntı noktasını tespit edin',
      'Hasarlı parçayı değiştirin'
    ]
  },
  // P05xx-P09xx — Motor Yardımcı Sistemler
  'P050': {
    systems: ['Rölanti Kontrol Sistemi'],
    severity: 'Orta',
    defaultSymptoms: [
      'Rölantide devir dalgalanması (yüksek/düşük)',
      'Motor arıza lambası (MIL) yanar',
      'Motor stop etme (özellikle duruşlarda)',
      'Soğuk çalıştırmada yüksek veya düşük rölanti',
      'Klima devreye girdiğinde rölanti düşmesi'
    ],
    defaultCauses: [
      'Rölanti kontrol valfı (IAC) kirlenmesi veya arızası',
      'Kelebek gövdesi kirlenmesi',
      'Vakum kaçağı (emme manifoldu, hortumlar)',
      'EGR valfı sızıntısı',
      'Motor soğutma suyu sıcaklık sensörü hatası'
    ],
    defaultFixes: [
      'Rölanti kontrol valfını (IAC) temizleyin veya değiştirin',
      'Kelebek gövdesini temizleyin ve rölanti adaptasyonu yapın',
      'Tüm vakum hortumlarını sızıntı açısından kontrol edin',
      'EGR valfını kapalı konumda sızıntı kontrolü yapın',
      'ECT sensörünü test edin'
    ]
  },
  'P055': {
    systems: ['Motor Yönetim Sistemi'],
    severity: 'Orta',
    defaultSymptoms: [
      'Motor arıza lambası (MIL) yanar',
      'Motor performansında düşüş',
      'Yakıt karışımı dengesizliği',
      'Emisyon değerlerinde artış'
    ],
    defaultCauses: [
      'Motor yönetim sistemi sensör aralık dışı değer',
      'İlgili sensörde kirlenme veya yaşlanma',
      'Kablo bağlantısında sorun',
      'ECU dahili arıza'
    ],
    defaultFixes: [
      'İlgili sensörü test edin ve gerekirse değiştirin',
      'Kablo ve konektörleri kontrol edin',
      'ECU yazılım güncellemesi yapın',
      'Arıza kodunu silin ve izleyin'
    ]
  },
  'P060': {
    systems: ['Motor Kontrol Ünitesi (ECU)'],
    severity: 'Yüksek',
    defaultSymptoms: [
      'Motor arıza lambası (MIL) yanar',
      'Birden fazla arıza kodu aynı anda oluşur',
      'Motor performansında ciddi düşüş',
      'Motor çalışmama veya ani durma',
      'Acil durum moduna (limp mode) geçiş'
    ],
    defaultCauses: [
      'ECU (Motor Kontrol Ünitesi) dahili arıza',
      'ECU güç beslemesi veya topraklama sorunu',
      'ECU yazılım bozulması',
      'Akü voltaj düşüklüğü veya dalgalanması',
      'ECU konektöründe korozyon veya su girişi'
    ],
    defaultFixes: [
      'Akü voltajını ve şarj sistemini kontrol edin (13.5-14.5V)',
      'ECU güç ve topraklama bağlantılarını temizleyin ve sıkılaştırın',
      'ECU konektörünü su/nem girişi açısından inceleyin',
      'ECU yazılım güncellemesi veya yeniden programlama yaptırın',
      'Gerekirse ECU modülünü değiştirin (yetkili serviste)'
    ]
  },
  'P070': {
    systems: ['Şanzıman (Otomatik)'],
    severity: 'Yüksek',
    defaultSymptoms: [
      'Şanzıman arıza lambası yanar',
      'Vites geçişlerinde sarsıntı veya gecikme',
      'Acil durum moduna (limp mode) geçiş (3. viteste takılı kalma)',
      'Geri vitese geçmeme',
      'Hızlanma sırasında kayma hissi'
    ],
    defaultCauses: [
      'Şanzıman kontrol modülü (TCM) arızası',
      'Şanzıman yağı seviye düşüklüğü veya kirli yağ',
      'Solenoid valf arızası',
      'Hız sensörü (input/output) hatası',
      'Kablo demetinde kısa devre veya açık devre'
    ],
    defaultFixes: [
      'Şanzıman yağı seviyesini ve rengini kontrol edin (pembe/kırmızı olmalı)',
      'Şanzıman yağı ve filtresini değiştirin',
      'OBD-II tarayıcı ile şanzıman canlı verilerini okuyun',
      'İlgili solenoid valfı test edin ve gerekirse değiştirin',
      'Şanzıman kablo demetini kontrol edin'
    ]
  },

  // P1xxx — Üretici Özel
  'P1': {
    systems: ['Motor Kontrol Sistemi (Üretici Özel)'],
    severity: 'Orta',
    defaultSymptoms: [
      'Motor arıza lambası (MIL) yanar',
      'Motor performansında değişkenlik',
      'Yakıt tüketim artışı',
      'İlgili sistemde fonksiyon kaybı'
    ],
    defaultCauses: [
      'Üreticiye özel sensör veya aktüatör arızası',
      'İlgili kablo demetinde hasar veya korozyon',
      'ECU yazılım uyumsuzluğu veya güncelleme ihtiyacı',
      'Bileşen yaşlanması veya aşınması'
    ],
    defaultFixes: [
      'Yetkili servis veya marka-özel teşhis cihazı ile detaylı tarama yapın',
      'İlgili bileşenin teknik servis bültenlerini (TSB) araştırın',
      'Kablo ve konektörleri inceleyin',
      'ECU yazılım güncellemesi yapın',
      'Arızalı parçayı orijinal yedek parça ile değiştirin'
    ]
  },

  // P2xxx — Modern Sistemler (Turbo, DPF, AdBlue)
  'P200': {
    systems: ['Emme Manifoldu', 'Hava Akış Sistemi'],
    severity: 'Orta',
    defaultSymptoms: [
      'Motor arıza lambası (MIL) yanar',
      'Motor performansında düşüş',
      'Turbo basıncında düzensizlik',
      'Yakıt tüketiminde artış'
    ],
    defaultCauses: [
      'Emme manifoldu kanatçık (flap) arızası',
      'Emme manifoldu aktüatörü hasarı',
      'Hava akış sensörü kirlenme',
      'Turbo basınç kontrol valfı sorunu'
    ],
    defaultFixes: [
      'Emme manifoldu kanatçıklarını kontrol edin',
      'Aktüatör motorunu test edin',
      'MAF sensörünü temizleyin',
      'Turbo basınç valfını kontrol edin'
    ]
  },
  'P220': {
    systems: ['Kelebek Gövdesi', 'Motor Kontrol'],
    severity: 'Yüksek',
    defaultSymptoms: [
      'Motor arıza lambası (MIL) yanar',
      'Acil durum moduna (limp mode) geçiş',
      'Gaz pedalına sınırlı yanıt',
      'Maksimum hız sınırlaması',
      'Rölantide düzensizlik'
    ],
    defaultCauses: [
      'Elektronik kelebek gövdesi motoru arızası',
      'Kelebek pozisyon sensörü hatası',
      'Gaz pedalı modülü arızası',
      'ECU kelebek kontrol devresi hasarı'
    ],
    defaultFixes: [
      'Kelebek gövdesini temizleyin',
      'Kelebek pozisyon sensör voltajını kontrol edin',
      'Gaz pedalı modülünü test edin',
      'Gerekirse kelebek gövdesi komple değiştirin ve adaptasyon yapın'
    ]
  },
  'P224': {
    systems: ['Turbo/Süperşarj Sistemi'],
    severity: 'Yüksek',
    defaultSymptoms: [
      'Motor arıza lambası (MIL) yanar',
      'Turbo basıncında düşme veya aşırı yükselme',
      'Motor güç kaybı (özellikle yokuş ve sollama)',
      'Turbodan ıslık veya hışırtı sesi',
      'Egzozdan mavi/beyaz duman'
    ],
    defaultCauses: [
      'Turbo şarj basınç kontrol valfı (wastegate/bypass) arızası',
      'Turbo yağ keçesi sızıntısı',
      'Turbo intercooler hortumlarında yırtık veya gevşeklik',
      'Turbo kanatçıklarında hasar veya aşınma',
      'Turbo basınç sensörü (MAP) hatası'
    ],
    defaultFixes: [
      'Turbo basınç değerlerini OBD-II ile canlı veri olarak izleyin',
      'Intercooler hortumlarını ve kelepçelerini kontrol edin',
      'Wastegate aktüatörünü test edin',
      'Turbo yağ girişi ve dönüş hatlarını kontrol edin',
      'Gerekirse turbo komple değiştirin veya revize ettirin'
    ]
  },
  'P240': {
    systems: ['DPF (Dizel Partikül Filtresi)'],
    severity: 'Yüksek',
    defaultSymptoms: [
      'DPF uyarı lambası yanar',
      'Motor arıza lambası (MIL) yanar',
      'Motor gücünde ciddi düşüş',
      'Acil durum moduna (limp mode) geçiş',
      'Yakıt tüketiminde belirgin artış',
      'Rejenerasyon işleminin tamamlanamaması'
    ],
    defaultCauses: [
      'DPF filtresi aşırı kurum birikimi',
      'DPF basınç fark sensörü arızası',
      'Egzoz sıcaklık sensörü hatası',
      'Kısa mesafe şehir içi kullanım (rejenerasyon yapılamıyor)',
      'EGR sistemindeki sorunların DPF\'yi etkilemesi'
    ],
    defaultFixes: [
      'Zorunlu DPF rejenerasyonu başlatın (OBD-II tarayıcı ile)',
      'Uzun mesafe otoyol sürüşü yaparak doğal rejenerasyonu tetikleyin',
      'DPF basınç sensörünü ve hortumlarını kontrol edin',
      'Egzoz sıcaklık sensörlerini test edin',
      'Gerekirse DPF profesyonel kimyasal temizlik veya değişim'
    ]
  },
  'P242': {
    systems: ['DPF (Dizel Partikül Filtresi)'],
    severity: 'Yüksek',
    defaultSymptoms: [
      'DPF uyarı lambası yanar',
      'Motor performans kaybı',
      'Acil durum moduna geçiş',
      'Egzoz sıcaklığında artış',
      'Yakıt tüketiminde artış'
    ],
    defaultCauses: [
      'DPF kurum yükü %80 üzerinde',
      'Rejenerasyon sürecinin tekrar tekrar kesintiye uğraması',
      'Egzoz sıcaklık sensörü arızası',
      'DPF fiziksel hasarı (çatlak veya kırık)'
    ],
    defaultFixes: [
      'Yetkili serviste zorunlu rejenerasyon başlatın',
      'DPF kurum oranını OBD ile kontrol edin',
      'Egzoz sıcaklık sensörlerini test edin',
      'Gerekirse DPF profesyonel temizlik veya değişim'
    ]
  },
  'P2': {
    systems: ['Motor Kontrol Sistemi'],
    severity: 'Orta',
    defaultSymptoms: [
      'Motor arıza lambası (MIL) yanar',
      'Motor performansında değişkenlik',
      'Yakıt tüketiminde artış',
      'İlgili sistemde fonksiyon düşüklüğü'
    ],
    defaultCauses: [
      'İlgili sensör veya aktüatör arızası',
      'Kablolama hasarı veya kısa devre',
      'ECU kontrol devresi sorunu',
      'Bileşen yaşlanması'
    ],
    defaultFixes: [
      'OBD-II tarayıcı ile canlı verileri okuyarak ilgili sensörü tespit edin',
      'Kablo ve konektörleri inceleyin',
      'İlgili sensör/aktüatörü test edin',
      'Arızalı parçayı değiştirin'
    ]
  },

  // Genel P fallback
  'P': {
    systems: ['Motor / Aktarma Organları'],
    severity: 'Orta',
    defaultSymptoms: [
      'Motor arıza lambası (MIL) yanar',
      'Motor performansında değişkenlik',
      'Yakıt tüketiminde olası artış',
      'Sürüş konforunda azalma'
    ],
    defaultCauses: [
      'İlgili sensör veya aktüatör arızası',
      'Kablo tesisatında hasar veya korozyon',
      'ECU kontrol modülü sorunu',
      'İlgili mekanik bileşende aşınma'
    ],
    defaultFixes: [
      'OBD-II tarayıcı ile detaylı tarama ve canlı veri okuma yapın',
      'İlgili kablo ve konektörleri kontrol edin',
      'İlgili sensör/aktüatörü test edin ve gerekirse değiştirin',
      'Arıza kodunu silin ve yol testi ile tekrarını izleyin'
    ]
  }
};

// B Kodları — Gövde Sistemi
const B_FAMILY_DATA = {
  'B000': {
    systems: ['SRS / Hava Yastığı'],
    severity: 'Yüksek',
    defaultSymptoms: [
      'Airbag (hava yastığı) uyarı lambası yanar',
      'Olası bir kazada ilgili hava yastığının açılmaması riski',
      'Emniyet kemeri gergisinin çalışmaması',
      'Araç içi SRS uyarı mesajı'
    ],
    defaultCauses: [
      'Koltuk altı airbag konektöründe temassızlık veya oksitlenme',
      'Direksiyon saat yayı (clock spring) kopması veya aşınması',
      'Darbe sensöründe su birikmesi veya hasar',
      'Airbag kontrol modülünde donanımsal arıza',
      'Kablo demetinde ezilme veya kopukluk'
    ],
    defaultFixes: [
      'Akü sökük iken koltuk altı airbag soketlerini kontrol edin ve temizleyin',
      'Direksiyon saat yayını (clock spring) test edin ve gerekirse değiştirin',
      'SRS kontrol modülünü yetkili serviste tarama ve kodlama ile kontrol ettirin',
      'Hasarlı kablolamayı onarın veya değiştirin',
      'Arıza kodunu SRS tarayıcı ile silin'
    ]
  },
  'B001': {
    systems: ['SRS / Hava Yastığı', 'Emniyet Kemeri'],
    severity: 'Yüksek',
    defaultSymptoms: [
      'Airbag uyarı lambası yanar',
      'Emniyet kemeri uyarı sistemi hatalı çalışır',
      'Koltuk sensörü hatası',
      'SRS sistem arızası bildirimi'
    ],
    defaultCauses: [
      'Emniyet kemeri gergisi devresi arızası',
      'Yolcu koltuğu ağırlık sensörü hatası',
      'SRS modülü iç arızası',
      'Konektör oksitlenmesi'
    ],
    defaultFixes: [
      'Emniyet kemeri konektörlerini kontrol edin',
      'Koltuk altı sensör soketlerini temizleyin',
      'SRS modülünü yetkili serviste kontrol ettirin',
      'Kablo demetini inceleyin'
    ]
  },
  'B010': {
    systems: ['Gövde Kontrol Modülü (BCM)'],
    severity: 'Orta',
    defaultSymptoms: [
      'İlgili gövde sisteminde fonksiyon kaybı',
      'Araç içi uyarı lambası veya mesaj',
      'Elektrik aksesuarlarında düzensiz çalışma',
      'Merkezi kilit veya cam sisteminde sorun'
    ],
    defaultCauses: [
      'BCM (Gövde Kontrol Modülü) iç arızası',
      'İlgili sigorta atması veya röle arızası',
      'Kablo demetinde kısa devre veya açık devre',
      'Konektör oksitlenmesi veya su birikmesi'
    ],
    defaultFixes: [
      'İlgili sigortayı kontrol edin, atık ise değiştirin',
      'Röleleri kontrol edin (tıkırtı testi veya takas)',
      'BCM konektörlerini çıkarıp temizleyin',
      'Kablo demetini hasar açısından inceleyin',
      'BCM yazılım güncellemesi yapın'
    ]
  },
  'B1': {
    systems: ['Gövde Sistemi'],
    severity: 'Orta',
    defaultSymptoms: [
      'İlgili gövde sistemi bileşeninde fonksiyon kaybı',
      'Araç içi uyarı lambası veya mesajı',
      'Konfor donanımlarında düzensiz çalışma',
      'Elektrikli aksesuar arızası'
    ],
    defaultCauses: [
      'İlgili modül veya sensör arızası',
      'Sigorta/röle sorunu',
      'Kablo demetinde kopukluk, kısa devre veya izolasyon hasarı',
      'Konektör oksitlenmesi veya gevşekliği',
      'BCM yazılım hatası'
    ],
    defaultFixes: [
      'İlgili sigortaları ve röleleri kontrol edin',
      'Kablo demetini fiziksel hasar açısından inceleyin',
      'Konektörleri kontak temizleyici ile temizleyin',
      'İlgili modülü/sensörü multimetre ile test edin',
      'Arızalı bileşeni değiştirin'
    ]
  },
  'B2': {
    systems: ['Gövde Sistemi (Üretici Özel)'],
    severity: 'Orta',
    defaultSymptoms: [
      'İlgili gövde sisteminde fonksiyon kaybı',
      'Araç içi uyarı mesajı veya lambası',
      'Konfor/güvenlik donanımında düzensizlik',
      'Elektriksel aksesuar problemi'
    ],
    defaultCauses: [
      'Üreticiye özel modül veya sensör arızası',
      'Kablolama hasarı',
      'Konektör oksitlenmesi veya su girişi',
      'İlgili kontrol modülünde yazılım hatası'
    ],
    defaultFixes: [
      'Marka-özel teşhis cihazı ile detaylı tarama yapın',
      'İlgili bileşenin teknik servis bültenlerini araştırın',
      'Kablo ve konektörleri inceleyin ve temizleyin',
      'Modül yazılım güncellemesi yapın',
      'Arızalı parçayı orijinal yedek ile değiştirin'
    ]
  },

  // Genel B fallback
  'B': {
    systems: ['Gövde Sistemi'],
    severity: 'Orta',
    defaultSymptoms: [
      'İlgili gövde sisteminde fonksiyon kaybı veya düzensizlik',
      'Araç içi uyarı lambası veya mesajı',
      'Konfor/güvenlik donanımında sorun'
    ],
    defaultCauses: [
      'İlgili modül, sensör veya aktüatör arızası',
      'Kablo tesisatında hasar veya korozyon',
      'Sigorta/röle sorunu',
      'Konektör oksitlenmesi'
    ],
    defaultFixes: [
      'İlgili sigortaları ve röleleri kontrol edin',
      'Kablo ve konektörleri inceleyin',
      'İlgili bileşeni test edin ve gerekirse değiştirin',
      'Arıza kodunu silin ve tekrarını izleyin'
    ]
  }
};

// C Kodları — Şasi Sistemi
const C_FAMILY_DATA = {
  'C0': {
    systems: ['ABS / Fren Sistemi', 'ESP / Denge Kontrol'],
    severity: 'Yüksek',
    defaultSymptoms: [
      'ABS uyarı lambası yanar',
      'ESP/ESC uyarı lambası yanar',
      'Fren pedalında titreşim veya sertlik',
      'ABS fonksiyonunun devre dışı kalması',
      'Kaygan zeminde fren mesafesinin uzaması'
    ],
    defaultCauses: [
      'ABS tekerlek hız sensörü arızası veya kirlenmesi',
      'ABS sensör kablosunda kopukluk veya hasar',
      'ABS hidraulik pompa/modül arızası',
      'Fren diski tondiğinin (reluctor ring) hasar görmesi',
      'Düşük fren hidroliği seviyesi'
    ],
    defaultFixes: [
      'ABS tekerlek hız sensörlerini temizleyin (metal talaş birikimi)',
      'Sensör kablolarını ve konektörleri kontrol edin',
      'ABS sensörü ile tondiği arasındaki hava boşluğunu kontrol edin',
      'Fren hidroliği seviyesini kontrol edin ve gerekirse tamamlayın',
      'ABS modülünü yetkili serviste taratın'
    ]
  },
  'C1': {
    systems: ['ABS / Fren Sistemi', 'Süspansiyon'],
    severity: 'Yüksek',
    defaultSymptoms: [
      'ABS/ESP uyarı lambası yanar',
      'Fren sisteminde anormal davranış',
      'Süspansiyon sertliğinde değişiklik',
      'Araç denge kontrolünde sorun',
      'Direksiyon ağırlığında değişiklik'
    ],
    defaultCauses: [
      'ABS/ESP sensör arızası',
      'Fren kaliperi veya balata sorunu',
      'Süspansiyon kontrol modülü hatası',
      'Direksiyon açı sensörü kalibrasyonsuzluğu',
      'Kablo demetinde hasar'
    ],
    defaultFixes: [
      'ABS sensörlerini ve tondiğlerini kontrol edin',
      'Fren balatalarını ve disklerini inceleyin',
      'Direksiyon açı sensörü kalibrasyonu yapın',
      'Süspansiyon bileşenlerini kontrol edin',
      'Kablo ve konektörleri inceleyin'
    ]
  },

  // Genel C fallback
  'C': {
    systems: ['Şasi / Fren / Süspansiyon'],
    severity: 'Yüksek',
    defaultSymptoms: [
      'ABS/ESP/TCS uyarı lambası yanar',
      'Fren veya süspansiyon sisteminde anormal davranış',
      'Sürüş stabilitesinde azalma',
      'Fren mesafesinde uzama'
    ],
    defaultCauses: [
      'İlgili şasi sensörü veya aktüatörü arızası',
      'Kablo tesisatında hasar',
      'Şasi kontrol modülü sorunu',
      'Hidrolik bileşen arızası'
    ],
    defaultFixes: [
      'ABS/ESP sensörlerini kontrol edin',
      'Fren sistemi bileşenlerini inceleyin',
      'Kablo ve konektörleri kontrol edin',
      'İlgili modülü teşhis cihazı ile taratın',
      'Arızalı bileşeni değiştirin'
    ]
  }
};

// U Kodları — Ağ/İletişim
const U_FAMILY_DATA = {
  'U0': {
    systems: ['Ağ ve İletişim (CAN Bus)'],
    severity: 'Orta',
    defaultSymptoms: [
      'Birden fazla uyarı lambası aynı anda yanar',
      'Gösterge panelinde hatalı veya eksik bilgiler',
      'Araç sistemlerinde iletişim kesintisi',
      'Bazı fonksiyonların çalışmaması',
      'Aralıklı elektrik sorunları'
    ],
    defaultCauses: [
      'CAN bus veri hattında kopukluk veya kısa devre',
      'İlgili kontrol modülünde (ECU) iletişim arızası',
      'Düşük akü voltajı (12V altı) veya kötü şase topraklaması',
      'CAN bus sonlandırma direncinde sorun',
      'Modül konektöründe su girişi veya korozyon'
    ],
    defaultFixes: [
      'Akü voltajını kontrol edin (12.4V+ olmalı, motor çalışırken 13.5-14.5V)',
      'Akü kutup başlarını ve şase topraklama noktalarını temizleyin',
      'CAN bus hatlarını multimetre ile süreklilik testi yapın',
      'İlgili modül konektörlerini çıkarıp temizleyin',
      'Tüm modülleri tarayarak sorunlu modülü tespit edin'
    ]
  },
  'U1': {
    systems: ['Ağ ve İletişim (CAN Bus)'],
    severity: 'Orta',
    defaultSymptoms: [
      'Birden fazla uyarı lambası yanar',
      'Modüller arası iletişim kesintisi',
      'Bazı araç fonksiyonlarının çalışmaması',
      'Gösterge panelinde hatalı gösterimler',
      'Motor çalıştırma güçlüğü'
    ],
    defaultCauses: [
      'CAN bus hat bütünlüğünde sorun',
      'Zayıf akü veya alternatör arızası',
      'Şase topraklama noktalarında paslanma',
      'İlgili kontrol modülü dahili arızası',
      'Kablo demetinde fiziksel hasar'
    ],
    defaultFixes: [
      'Akü kutup başlarını temizleyip sıkıştırın',
      'Şase topraklama noktalarını zımparalayıp yeniden bağlayın',
      'CAN bus iletişim hatlarını osiloskop ile analiz edin',
      'İlgili modülü ayrı ayrı tarayarak sorunlu olanı tespit edin',
      'Kablo demetini görsel olarak inceleyin'
    ]
  },
  'U2': {
    systems: ['Ağ ve İletişim (CAN Bus)'],
    severity: 'Orta',
    defaultSymptoms: [
      'İlgili modülden veri alınamıyor',
      'Birden fazla sistem uyarısı',
      'Araç fonksiyonlarında kesinti',
      'Gösterge paneli hatası'
    ],
    defaultCauses: [
      'İlgili kontrol modülü iletişim hatası',
      'CAN bus kablo hasarı',
      'Düşük voltaj veya topraklama sorunu',
      'Modül yazılım uyumsuzluğu'
    ],
    defaultFixes: [
      'Akü ve şarj sistemini kontrol edin',
      'CAN bus kablolarını inceleyin',
      'İlgili modülü ayrı tarayıp test edin',
      'Modül yazılım güncellemesi yapın'
    ]
  },

  // Genel U fallback
  'U': {
    systems: ['Ağ ve İletişim (CAN Bus)'],
    severity: 'Orta',
    defaultSymptoms: [
      'Birden fazla uyarı lambası yanar',
      'Modüller arası iletişim kesintisi',
      'Araç fonksiyonlarında düzensizlik',
      'Gösterge panelinde hata mesajları'
    ],
    defaultCauses: [
      'CAN bus veri hattında sorun',
      'Düşük akü voltajı veya kötü topraklama',
      'İlgili kontrol modülü arızası',
      'Kablo demetinde hasar'
    ],
    defaultFixes: [
      'Akü kutup başlarını temizleyin ve voltajı kontrol edin',
      'Şase topraklama noktalarını temizleyin',
      'İlgili modülü teşhis cihazı ile taratın',
      'CAN bus hat bütünlüğünü kontrol edin'
    ]
  }
};

// ═══════════════════════════════════════════════════════════════
// BÖLÜM 2: İNGİLİZCE → TÜRKÇE ÇEVİRİ SÖZLÜĞÜ
// ═══════════════════════════════════════════════════════════════

const EN_TR_MAP = {
  // Common terms
  'Circuit': 'Devresi', 'Open': 'Açık Devre', 'Short': 'Kısa Devre',
  'High': 'Yüksek', 'Low': 'Düşük', 'Range': 'Aralık', 'Performance': 'Performans',
  'Malfunction': 'Arıza', 'Failure': 'Arıza', 'failure': 'arızası', 'Fault': 'Arıza',
  'Input': 'Girişi', 'Output': 'Çıkışı', 'Signal': 'Sinyal', 'Voltage': 'Voltaj',
  'Sensor': 'Sensörü', 'Switch': 'Anahtarı', 'Relay': 'Rölesi', 'Module': 'Modülü',
  'Control': 'Kontrol', 'System': 'Sistemi', 'Bank': 'Banka',
  'Internal': 'Dahili', 'External': 'Harici',
  'Intermittent': 'Aralıklı', 'Erratic': 'Düzensiz',
  'Data': 'Veri', 'Invalid': 'Geçersiz', 'Missing': 'Eksik',
  'Timeout': 'Zaman Aşımı', 'No Communication': 'İletişim Yok',
  'Stuck': 'Takılı', 'Frozen': 'Donmuş',
  
  // Automotive components
  'Engine': 'Motor', 'Transmission': 'Şanzıman', 'Throttle': 'Kelebek Gövdesi',
  'Turbocharger': 'Turbo Şarj', 'Supercharger': 'Süperşarj',
  'Catalytic Converter': 'Katalitik Konvertör', 'Catalyst': 'Katalizör',
  'Exhaust': 'Egzoz', 'Intake': 'Emme', 'Manifold': 'Manifoldu',
  'Fuel': 'Yakıt', 'Injector': 'Enjektör', 'Pump': 'Pompası',
  'Coolant': 'Soğutma Suyu', 'Temperature': 'Sıcaklık',
  'Pressure': 'Basınç', 'Oil': 'Yağ', 'Air': 'Hava',
  'Oxygen': 'Oksijen', 'Lambda': 'Lambda',
  'Crankshaft': 'Krank Mili', 'Camshaft': 'Eksantrik Mili',
  'Ignition': 'Ateşleme', 'Spark': 'Buji', 'Coil': 'Bobin',
  'Cylinder': 'Silindir', 'Piston': 'Piston', 'Valve': 'Valf/Supap',
  'Brake': 'Fren', 'Steering': 'Direksiyon', 'Suspension': 'Süspansiyon',
  'Airbag': 'Hava Yastığı', 'Seatbelt': 'Emniyet Kemeri',
  'Actuator': 'Aktüatör', 'Solenoid': 'Solenoid',
  'Heater': 'Isıtıcı', 'Regulator': 'Regülatör',
  'Position': 'Pozisyon', 'Speed': 'Hız', 'Flow': 'Akış',
  'Mass Air Flow': 'Kütle Hava Akışı (MAF)',
  'Manifold Absolute Pressure': 'Manifold Mutlak Basınç (MAP)',
  'Throttle Position': 'Kelebek Pozisyon',
  'EGR': 'EGR (Egzoz Gazı Geri Devirdaim)',
  'EVAP': 'EVAP (Yakıt Buharı Geri Kazanım)',
  'Driver': 'Sürücü', 'Passenger': 'Yolcu',
  'Side': 'Yan', 'Front': 'Ön', 'Rear': 'Arka',
  'Left': 'Sol', 'Right': 'Sağ',
  'Door': 'Kapı', 'Window': 'Cam', 'Mirror': 'Ayna',
  'Lock': 'Kilit', 'Wiper': 'Silecek', 'Washer': 'Yıkama',
  'Horn': 'Korna', 'Light': 'Lamba/Işık',
  'Headlamp': 'Far', 'Headlight': 'Far',
  'Turn Signal': 'Sinyal Lambası', 'Indicator': 'Gösterge',
  'Crash': 'Çarpışma', 'Impact': 'Darbe',
  'Intrusion': 'Sızma/Giriş', 'Powertrain': 'Aktarma Organı',
  'Body': 'Gövde', 'Chassis': 'Şasi', 'Network': 'Ağ',
  'Communication': 'İletişim', 'CAN': 'CAN Bus',
  'Lost Communication': 'İletişim Kaybı',
  'Acknowledgement': 'Onay', 'Lack': 'Eksikliği',
  'Devresi': 'Devresi', 'Sensörü': 'Sensörü',
  'Şalteri': 'Anahtarı',
};

// ═══════════════════════════════════════════════════════════════
// BÖLÜM 3: YAZIM HATALARI DÜZELTMELERİ
// ═══════════════════════════════════════════════════════════════

const TYPO_FIXES = {
  'ÇekiŞ': 'Çekiş', 'çekiŞ': 'çekiş',
  'artıŞ': 'artış', 'ArtıŞ': 'Artış',
  'düşüŞ': 'düşüş', 'DüşüŞ': 'Düşüş',
  'Selonoid': 'Solenoid', 'selonoid': 'solenoid',
  'kumanda hat:': 'kumanda hattı',
  'Sinyal :': 'Sinyal:', 'sinyal :': 'sinyal:',
  'yada': 'ya da',
  'Şaseye': 'şaseye',
  'hat kesintisi': 'hat kesintisi',
  'regülatörü': 'regülatörü',
};

// ═══════════════════════════════════════════════════════════════
// BÖLÜM 4: YENİ EKLENECEK POPÜLER OBD KODLARI
// (Mevcut veritabanında olmayanlar)
// ═══════════════════════════════════════════════════════════════

const NEW_CODES = [
  // En çok aranan P kodları — eksik olanlar
  {
    code: 'P0005', title: 'Yakıt Kesme Valfı "A" Kontrol Devresi Açık',
    description: 'Motor kontrol ünitesi (ECU), yakıt kesme valfı A\'nın kontrol devresinde bir açık devre tespit etmiştir. Bu valf, motorun yakıt beslemesini kesmek için kullanılır ve güvenlik açısından kritik bir bileşendir.',
    type: 'P', isGeneric: true, severity: 'Orta',
    systems: ['Yakıt Sistemi'],
    symptoms: ['Motor arıza lambası (MIL) yanar', 'Motor kapatıldığında devam eden çalışma (dieseling)', 'Yakıt kesme fonksiyonunun çalışmaması', 'Motor stop sonrası titreşim'],
    causes: ['Yakıt kesme valfı solenoid bobini arızası', 'Valf kontrol kablosunda kopukluk', 'ECU çıkış devresi arızası', 'Konektörde oksitlenme veya su birikmesi'],
    fixes: ['Yakıt kesme valfı solenoid direncini multimetre ile ölçün', 'Kablo demetindeki iletkenliği kontrol edin', 'Konektörleri temizleyin ve sıkılaştırın', 'Arızalı valfı değiştirin']
  },
  {
    code: 'P0006', title: 'Yakıt Kesme Valfı "A" Kontrol Devresi Düşük',
    description: 'ECU, yakıt kesme valfı A kontrol devresinde normalden düşük bir voltaj seviyesi algılamıştır. Bu durum genellikle şaseye kısa devre veya kablolama hasarına işaret eder.',
    type: 'P', isGeneric: true, severity: 'Orta',
    systems: ['Yakıt Sistemi'],
    symptoms: ['Motor arıza lambası (MIL) yanar', 'Yakıt kesme fonksiyonunda düzensizlik', 'Motor performansında değişkenlik'],
    causes: ['Valf kontrol kablosunda şaseye kısa devre', 'Solenoid bobin kısa devresi', 'Konektör hasarı', 'ECU sürücü devresi arızası'],
    fixes: ['Kablo izolasyonunu kontrol edin', 'Solenoid direncini ölçün', 'Konektörleri inceleyin', 'Gerekirse valfı değiştirin']
  },
  {
    code: 'P0007', title: 'Yakıt Kesme Valfı "A" Kontrol Devresi Yüksek',
    description: 'ECU, yakıt kesme valfı A kontrol devresinde normalden yüksek bir voltaj seviyesi algılamıştır. Bu durum genellikle besleme hattına kısa devre veya açık devre durumuna işaret eder.',
    type: 'P', isGeneric: true, severity: 'Orta',
    systems: ['Yakıt Sistemi'],
    symptoms: ['Motor arıza lambası (MIL) yanar', 'Yakıt kesme işlevinin bozulması', 'Motor çalışma düzensizliği'],
    causes: ['Valf kontrol kablosunda artıya kısa devre', 'Kablo demetinde açık devre', 'Solenoid arızası', 'ECU devre hasarı'],
    fixes: ['Kablo demetini kısa devre açısından test edin', 'Solenoid valfı test edin', 'Konektör bağlantılarını kontrol edin', 'Arızalı bileşeni değiştirin']
  },
  {
    code: 'P0008', title: 'Motor Pozisyon Sistemi Performansı (Banka 1)',
    description: 'ECU, motor krank ve eksantrik mili pozisyon korelasyonunda Banka 1 tarafında bir performans sapması tespit etmiştir. Bu durum zaman zinciri/kayışı veya VVT sistemi ile ilgili bir soruna işaret eder.',
    type: 'P', isGeneric: true, severity: 'Yüksek',
    systems: ['Motor Zamanlama Sistemi', 'VVT Sistemi'],
    symptoms: ['Motor arıza lambası (MIL) yanar', 'Motor gücünde ciddi düşüş', 'Motordan tıkırtı sesleri', 'Soğuk çalıştırma güçlüğü', 'Rölantide düzensizlik'],
    causes: ['Zaman zinciri/kayışı uzamış veya atlamış', 'VVT solenoid valfı tıkanmış', 'Düşük yağ basıncı veya kirli motor yağı', 'Zincir gergi mekanizması aşınmış', 'Eksantrik mili fazör arızası'],
    fixes: ['Motor yağı seviyesini ve kalitesini kontrol edin', 'VVT solenoid valfını temizleyin veya değiştirin', 'Zaman zinciri gerginliğini ve durumunu kontrol edin', 'Gerekirse zaman zinciri setini komple değiştirin', 'Krank/eksantrik pozisyon sensörlerini test edin']
  },
  {
    code: 'P0009', title: 'Motor Pozisyon Sistemi Performansı (Banka 2)',
    description: 'ECU, motor krank ve eksantrik mili pozisyon korelasyonunda Banka 2 tarafında bir performans sapması tespit etmiştir. V veya boxer motor konfigürasyonlarında ikinci silindir bankasını etkiler.',
    type: 'P', isGeneric: true, severity: 'Yüksek',
    systems: ['Motor Zamanlama Sistemi', 'VVT Sistemi'],
    symptoms: ['Motor arıza lambası (MIL) yanar', 'Motor performansında belirgin düşüş', 'Motordan mekanik sesler', 'Rölanti düzensizliği', 'Hızlanma güçlüğü'],
    causes: ['Banka 2 tarafında zaman zinciri/kayışı uzaması', 'VVT aktüatör veya solenoid arızası', 'Motor yağı basınç düşüklüğü', 'Zincir kılavuz rayı aşınması'],
    fixes: ['Motor yağını kontrol edin ve gerekirse değiştirin', 'VVT solenoid valfını test edin', 'Zaman zinciri bileşenlerini kontrol edin', 'Gerekirse komple zincir seti değişimi yapın']
  },
  {
    code: 'P0010', title: 'Eksantrik Mili Pozisyon Aktüatörü "A" Devresi (Banka 1)',
    description: 'ECU, Banka 1 tarafındaki "A" eksantrik mili (genelde emme) pozisyon aktüatörünün kontrol devresinde bir sorun algılamıştır. Bu aktüatör, değişken supap zamanlamasını (VVT) kontrol eder.',
    type: 'P', isGeneric: true, severity: 'Orta',
    systems: ['VVT Sistemi', 'Eksantrik Mili'],
    symptoms: ['Motor arıza lambası (MIL) yanar', 'Rölantide düzensizlik', 'Motor performansında düşüş', 'Yakıt tüketiminde artış', 'Motor gürültüsü artışı'],
    causes: ['VVT solenoid valfı arızası', 'VVT solenoid kablo/konektör hasarı', 'Düşük motor yağı seviyesi veya kirli yağ', 'VVT aktüatör mekanik arızası', 'ECU çıkış devresi sorunu'],
    fixes: ['Motor yağı seviyesini ve kalitesini kontrol edin', 'VVT solenoid valfının direncini ölçün (tipik: 7-12 ohm)', 'Solenoid konektörünü temizleyin', 'Gerekirse VVT solenoid valfını değiştirin', 'Yağ değişimi yapın (düşük viskoziteli uygun yağ kullanın)']
  },
  {
    code: 'P0011', title: 'Eksantrik Mili Pozisyon Zamanlaması Aşırı İleri (Banka 1 "A")',
    description: 'ECU, Banka 1 emme eksantrik mili zamanlamasının (VVT) beklenenden daha ileri konumda olduğunu tespit etmiştir. Motor zamanlaması mekanik olarak veya yağ basıncı ile ilgili sorunlardan kaynaklanabilir.',
    type: 'P', isGeneric: true, severity: 'Yüksek',
    systems: ['VVT Sistemi', 'Eksantrik Mili'],
    symptoms: ['Motor arıza lambası (MIL) yanar', 'Motor çalıştırma güçlüğü', 'Rölantide sert çalışma', 'Motor gücünde azalma', 'Motorun durma eğilimi', 'Artan egzoz emisyonları'],
    causes: ['Motor yağı çok kirli veya yanlış viskozite', 'VVT solenoid valfı tıkanmış (açık konumda takılı)', 'Zaman zinciri/kayışı uzamış', 'Motor yağı basıncı düşük', 'VVT fazör iç mekanizması hasarlı'],
    fixes: ['Motor yağı ve filtre değişimi yapın (doğru viskozite)', 'VVT solenoid valfını çıkarın, temizleyin veya değiştirin', 'Motor yağ basıncını kontrol edin', 'Zaman zinciri/kayışı gerilimini ve durumunu kontrol edin', 'Gerekirse VVT fazör değişimi']
  },
  {
    code: 'P0012', title: 'Eksantrik Mili Pozisyon Zamanlaması Aşırı Geri (Banka 1 "A")',
    description: 'ECU, Banka 1 emme eksantrik mili zamanlamasının beklenenden daha geri konumda olduğunu algılamıştır. Bu durum motorun verimli çalışmasını engelleyerek performans kaybına neden olur.',
    type: 'P', isGeneric: true, severity: 'Yüksek',
    systems: ['VVT Sistemi', 'Eksantrik Mili'],
    symptoms: ['Motor arıza lambası (MIL) yanar', 'Güç kaybı (özellikle düşük devirlerde)', 'Yakıt tüketiminde artış', 'Rölantide titreşim', 'Emisyon değerlerinde artış'],
    causes: ['VVT solenoid valfı tıkanmış (kapalı konumda takılı)', 'Motor yağı seviyesi düşük', 'Yağ kanallarında tıkanıklık', 'Zaman zinciri/kayışı atlama', 'VVT aktüatör mekanik arızası'],
    fixes: ['Motor yağını ve filtresini değiştirin', 'VVT solenoid valfını temizleyin veya değiştirin', 'Yağ kanallarının açıklığını kontrol edin', 'Zaman zinciri/kayışını kontrol edin', 'Motor yağ basıncını ölçün']
  },
  {
    code: 'P0100', title: 'Kütle Hava Akış (MAF) Sensörü Devresi Arızası',
    description: 'ECU, kütle hava akış (MAF) sensöründen gelen sinyalde bir devre arızası tespit etmiştir. MAF sensörü motora giren hava miktarını ölçer ve doğru yakıt-hava karışımı için kritik önemdedir.',
    type: 'P', isGeneric: true, severity: 'Yüksek',
    systems: ['Yakıt Sistemi', 'Emme Manifoldu'],
    symptoms: ['Motor arıza lambası (MIL) yanar', 'Motor performansında ciddi düşüş', 'Yakıt tüketiminde %20-40 artış', 'Rölantide titreşim ve düzensizlik', 'Hızlanma sırasında takılma', 'Egzozdan siyah duman'],
    causes: ['MAF sensör elemanı kirlenmesi veya kontaminasyonu', 'MAF sensör kablo/konektör hasarı', 'Hava filtresi aşırı kirli veya yanlış takılmış', 'Emme borusunda hava kaçağı (MAF sonrası)', 'MAF sensör dahili arızası'],
    fixes: ['MAF sensörünü özel MAF temizleyici sprey ile temizleyin (WD-40 KULLANMAYIN)', 'Hava filtresini kontrol edin ve gerekirse değiştirin', 'Emme hortumlarını ve bağlantılarını kaçak açısından kontrol edin', 'MAF sensör konektörünü temizleyin', 'Gerekirse MAF sensörünü orijinal parça ile değiştirin']
  },
  {
    code: 'P0101', title: 'Kütle Hava Akış (MAF) Sensörü Aralık/Performans Sorunu',
    description: 'ECU, MAF sensöründen gelen değerlerin beklenen aralık dışında olduğunu algılamıştır. Sensör fiziksel olarak çalışıyor ancak okumaları doğru değil.',
    type: 'P', isGeneric: true, severity: 'Orta',
    systems: ['Yakıt Sistemi', 'Emme Manifoldu'],
    symptoms: ['Motor arıza lambası (MIL) yanar', 'Yakıt tüketiminde artış', 'Güç kaybı', 'Rölanti düzensizliği', 'Hızlanmada gecikme'],
    causes: ['MAF sensör elemanı kirli', 'Hava kaçağı (emme manifoldu veya hortumlar)', 'Hava filtresi çok kirli', 'MAF sensör yaşlanması', 'PCV valfı arızası'],
    fixes: ['MAF sensörünü temizleyin', 'Tüm emme hortumlarını kaçak kontrolü yapın', 'Hava filtresini değiştirin', 'PCV valfını kontrol edin', 'Gerekirse MAF sensörünü değiştirin']
  },
  {
    code: 'P0102', title: 'Kütle Hava Akış (MAF) Sensörü Düşük Giriş',
    description: 'ECU, MAF sensöründen normalden düşük bir sinyal aldığını tespit etmiştir. Bu genellikle hava akış yolunda bir kısıtlama veya sensör devresinde sorun olduğunu gösterir.',
    type: 'P', isGeneric: true, severity: 'Orta',
    systems: ['Yakıt Sistemi', 'Emme Manifoldu'],
    symptoms: ['Motor arıza lambası (MIL) yanar', 'Güç kaybı', 'Motor stop etme eğilimi', 'Rölantide düzensizlik', 'Yakıt karışımında fakirleşme'],
    causes: ['MAF sensör kirli veya arızalı', 'Hava filtresi tıkalı', 'MAF sensör kablo kopukluğu', 'Emme borusunda daraltma veya tıkanıklık'],
    fixes: ['MAF sensörünü temizleyin', 'Hava filtresini değiştirin', 'Sensör kablolarını kontrol edin', 'Emme yolunu tıkanıklık açısından inceleyin']
  },
  {
    code: 'P0103', title: 'Kütle Hava Akış (MAF) Sensörü Yüksek Giriş',
    description: 'ECU, MAF sensöründen normalden yüksek bir sinyal almaktadır. Bu durum aşırı zengin yakıt karışımına ve motor performans sorunlarına yol açabilir.',
    type: 'P', isGeneric: true, severity: 'Orta',
    systems: ['Yakıt Sistemi', 'Emme Manifoldu'],
    symptoms: ['Motor arıza lambası (MIL) yanar', 'Egzozdan siyah duman', 'Yakıt tüketiminde artış', 'Motor performansında düşüş', 'Bujilerde is birikimi'],
    causes: ['MAF sensör arızası (yüksek okuma)', 'Sensör devresinde kısa devre', 'Hava kaçağı (MAF sonrası)', 'Konektör su girişi'],
    fixes: ['MAF sensörünü temizleyin veya değiştirin', 'Kablo demetini kısa devre açısından kontrol edin', 'Emme hortumlarını kontrol edin', 'Konektörü temizleyin']
  },
  {
    code: 'P0171', title: 'Yakıt Sistemi Çok Fakir (Banka 1)',
    description: 'ECU, Banka 1 tarafında yakıt-hava karışımının sürekli olarak çok fakir (fazla hava, az yakıt) olduğunu tespit etmiştir. Bu, motorun verimli yanma için yeterli yakıt alamadığı anlamına gelir.',
    type: 'P', isGeneric: true, severity: 'Orta',
    systems: ['Yakıt Sistemi', 'Emme Manifoldu'],
    symptoms: ['Motor arıza lambası (MIL) yanar', 'Rölantide sarsıntı ve düzensizlik', 'Hızlanma sırasında takılma veya gecikme', 'Motor stop etme (özellikle duruşlarda)', 'Soğuk çalıştırma güçlüğü', 'Misfire (ateşleme kaybı) hissi'],
    causes: ['Emme manifoldunda vakum kaçağı', 'Yakıt enjektörlerinin tıkanması', 'Yakıt pompası basınç düşüklüğü', 'MAF sensörü kirlenmesi veya arızası', 'Yakıt filtresi tıkanması', 'PCV valfı arızası (açık takılı)'],
    fixes: ['Emme manifoldu conta ve hortumlarını duman testi ile kontrol edin', 'MAF sensörünü temizleyin', 'Yakıt basıncını manometre ile ölçün (spesifikasyonlara uygunluk)', 'Yakıt filtresini değiştirin', 'Enjektörleri ultrasonik temizleme veya kontrol ettirin', 'PCV valfını test edin']
  },
  {
    code: 'P0172', title: 'Yakıt Sistemi Çok Zengin (Banka 1)',
    description: 'ECU, Banka 1 tarafında yakıt-hava karışımının sürekli olarak çok zengin (fazla yakıt, az hava) olduğunu tespit etmiştir. Bu durum yakıt israfına, emisyon artışına ve katalitik konvertör hasarına yol açabilir.',
    type: 'P', isGeneric: true, severity: 'Orta',
    systems: ['Yakıt Sistemi'],
    symptoms: ['Motor arıza lambası (MIL) yanar', 'Yakıt tüketiminde belirgin artış', 'Egzozdan siyah duman ve yanmamış yakıt kokusu', 'Bujilerde is birikimi', 'Katalitik konvertörde erken aşınma', 'Rölantide düzensizlik'],
    causes: ['Sızıran veya arızalı yakıt enjektörü', 'Yakıt basınç regülatörü arızası (yüksek basınç)', 'MAF sensörü kirli veya arızalı (düşük okuma)', 'Oksijen sensörü yaşlanmış veya arızalı', 'Hava filtresi aşırı kirli (hava girişi kısıtlı)', 'Soğutma suyu sıcaklık sensörü hatalı değer gönderiyor'],
    fixes: ['Yakıt enjektörlerini sızıntı testi yapın', 'Yakıt basıncını kontrol edin', 'MAF sensörünü temizleyin veya değiştirin', 'O2 sensör canlı verilerini izleyin', 'Hava filtresini değiştirin', 'ECT sensörünü test edin']
  },
  {
    code: 'P0174', title: 'Yakıt Sistemi Çok Fakir (Banka 2)',
    description: 'ECU, Banka 2 tarafında (V veya boxer motorlarda) yakıt-hava karışımının sürekli olarak çok fakir olduğunu tespit etmiştir. P0171 ile benzer nedenler ancak Banka 2 tarafını etkiler.',
    type: 'P', isGeneric: true, severity: 'Orta',
    systems: ['Yakıt Sistemi', 'Emme Manifoldu'],
    symptoms: ['Motor arıza lambası (MIL) yanar', 'Rölantide düzensizlik', 'Hızlanmada gecikme', 'Motor stop etme eğilimi', 'Soğuk çalıştırmada zorluk'],
    causes: ['Emme manifoldu Banka 2 tarafında vakum kaçağı', 'Banka 2 enjektörlerinde tıkanma', 'Yakıt basınç düşüklüğü', 'MAF sensör arızası', 'Banka 2 O2 sensör hatası'],
    fixes: ['Banka 2 tarafı emme manifoldu contalarını kontrol edin', 'Enjektörleri test edin', 'Yakıt basıncını ölçün', 'MAF sensörünü temizleyin', 'O2 sensör verilerini izleyin']
  },
  {
    code: 'P0175', title: 'Yakıt Sistemi Çok Zengin (Banka 2)',
    description: 'ECU, Banka 2 tarafında yakıt-hava karışımının sürekli olarak çok zengin olduğunu tespit etmiştir. V veya boxer motor konfigürasyonlarında ikinci silindir bankasını etkileyen bir sorun.',
    type: 'P', isGeneric: true, severity: 'Orta',
    systems: ['Yakıt Sistemi'],
    symptoms: ['Motor arıza lambası (MIL) yanar', 'Egzozdan siyah duman', 'Yakıt tüketiminde artış', 'Bujilerde is birikimi', 'Rölanti düzensizliği'],
    causes: ['Banka 2 enjektörlerinde sızıntı', 'Yakıt basınç regülatörü arızası', 'MAF sensör hatası', 'Banka 2 O2 sensör yaşlanması', 'ECT sensör hatası'],
    fixes: ['Banka 2 enjektörlerini sızıntı testi yapın', 'Yakıt basıncını kontrol edin', 'MAF sensörünü temizleyin', 'O2 sensörlerini test edin', 'ECT sensörünü kontrol edin']
  },
  {
    code: 'P0300', title: 'Rastgele/Çoklu Silindir Ateşleme Kaybı Tespit Edildi',
    description: 'ECU, birden fazla silindirde rastgele ateşleme kaybı (misfire) tespit etmiştir. Bu kod, sorunun tek bir silindire özgü olmadığını, birden fazla silindirde veya tüm motorumda ateşleme sorunu olduğunu gösterir.',
    type: 'P', isGeneric: true, severity: 'Yüksek',
    systems: ['Ateşleme Sistemi', 'Yakıt Sistemi'],
    symptoms: ['Motor arıza lambası (MIL) yanıp söner', 'Motor şiddetli sarsıntı ile çalışır', 'Belirgin güç kaybı', 'Egzozdan patlamalar ve geri tepmeler', 'Hızlanma sırasında takılma ve sarsıntı', 'Rölantide şiddetli titreşim', 'Yakıt tüketiminde ciddi artış'],
    causes: ['Bujiler aşınmış veya kirlenmiş (tüm silindirler)', 'Ateşleme bobinleri (koiller) arızalı', 'Yakıt basıncı düşük (yakıt pompası veya filtre)', 'Vakum kaçağı (emme manifoldu)', 'Düşük silindir kompresyon basıncı', 'EGR valfı sızıntısı', 'Kötü kalite yakıt'],
    fixes: ['Tüm bujileri kontrol edin ve gerekirse set halinde değiştirin', 'Ateşleme bobinlerini tek tek test edin', 'Yakıt basıncını manometre ile ölçün', 'Emme manifoldu vakum hortumlarını kontrol edin', 'Silindir kompresyon testi yapın', 'EGR valfını kontrol edin', 'Yakıt deposundaki yakıtın kalitesini değerlendirin']
  },
  {
    code: 'P0301', title: '1. Silindir Ateşleme Kaybı Tespit Edildi',
    description: 'ECU, 1 numaralı silindirde ateşleme kaybı (misfire) tespit etmiştir. Bu silindirde yanma düzgün gerçekleşmiyor.',
    type: 'P', isGeneric: true, severity: 'Yüksek',
    systems: ['Ateşleme Sistemi'],
    symptoms: ['Motor arıza lambası (MIL) yanıp söner', '1. silindirde ateşleme kaybı', 'Motor sarsıntılı çalışır', 'Güç kaybı', 'Egzozdan düzensiz atımlar'],
    causes: ['1. silindir bujisi aşınmış veya kirli', '1. silindir ateşleme bobini arızalı', '1. silindir enjektörü tıkalı veya arızalı', '1. silindir kompresyon basıncı düşük', 'Buji kablosu/bootu hasarlı'],
    fixes: ['1. silindir bujisini kontrol edin ve değiştirin', 'Ateşleme bobinini sağlam silindirdeki ile yer değiştirerek test edin', 'Enjektörü test edin', 'Kompresyon testi yapın', 'Buji kablosu/bootunu kontrol edin']
  },
  {
    code: 'P0302', title: '2. Silindir Ateşleme Kaybı Tespit Edildi',
    description: 'ECU, 2 numaralı silindirde ateşleme kaybı (misfire) tespit etmiştir.',
    type: 'P', isGeneric: true, severity: 'Yüksek',
    systems: ['Ateşleme Sistemi'],
    symptoms: ['Motor arıza lambası (MIL) yanıp söner', '2. silindirde ateşleme kaybı', 'Motor sarsıntılı çalışır', 'Güç kaybı', 'Rölantide titreşim'],
    causes: ['2. silindir bujisi aşınmış', '2. silindir ateşleme bobini arızalı', '2. silindir enjektörü tıkalı', 'Düşük kompresyon', 'Supap contası sızıntısı'],
    fixes: ['2. silindir bujisini değiştirin', 'Ateşleme bobinini test edin (takas yöntemi)', 'Enjektörü kontrol edin', 'Kompresyon testi yapın']
  },
  {
    code: 'P0303', title: '3. Silindir Ateşleme Kaybı Tespit Edildi',
    description: 'ECU, 3 numaralı silindirde ateşleme kaybı (misfire) tespit etmiştir.',
    type: 'P', isGeneric: true, severity: 'Yüksek',
    systems: ['Ateşleme Sistemi'],
    symptoms: ['Motor arıza lambası (MIL) yanıp söner', '3. silindirde ateşleme kaybı', 'Motor sarsıntılı çalışır', 'Güç kaybı'],
    causes: ['3. silindir bujisi aşınmış', '3. silindir ateşleme bobini arızalı', '3. silindir enjektörü tıkalı', 'Düşük kompresyon'],
    fixes: ['3. silindir bujisini değiştirin', 'Ateşleme bobinini test edin', 'Enjektörü kontrol edin', 'Kompresyon testi yapın']
  },
  {
    code: 'P0304', title: '4. Silindir Ateşleme Kaybı Tespit Edildi',
    description: 'ECU, 4 numaralı silindirde ateşleme kaybı (misfire) tespit etmiştir.',
    type: 'P', isGeneric: true, severity: 'Yüksek',
    systems: ['Ateşleme Sistemi'],
    symptoms: ['Motor arıza lambası (MIL) yanıp söner', '4. silindirde ateşleme kaybı', 'Motor sarsıntılı çalışır', 'Güç kaybı'],
    causes: ['4. silindir bujisi aşınmış', '4. silindir ateşleme bobini arızalı', '4. silindir enjektörü tıkalı', 'Düşük kompresyon'],
    fixes: ['4. silindir bujisini değiştirin', 'Ateşleme bobinini test edin', 'Enjektörü kontrol edin', 'Kompresyon testi yapın']
  },
  {
    code: 'P0335', title: 'Krank Mili Pozisyon Sensörü "A" Devresi Arızası',
    description: 'ECU, krank mili pozisyon sensöründen (CKP) sinyal alamıyor veya düzensiz sinyal alıyor. Bu sensör motorun devir sayısını ve krank pozisyonunu belirler, ateşleme ve enjeksiyon zamanlaması için kritiktir.',
    type: 'P', isGeneric: true, severity: 'Kritik',
    systems: ['Ateşleme Sistemi', 'Motor Kontrol'],
    symptoms: ['Motor çalışmıyor veya marş yapıp çalışmıyor', 'Motor arıza lambası (MIL) yanar', 'Motor ani duruş yapıyor', 'Devir göstergesi sıfır gösteriyor', 'Motor aralıklı olarak duruyor'],
    causes: ['Krank mili pozisyon sensörü arızası', 'Sensör kablo/konektör hasarı veya korozyonu', 'Krank mili dişli çarkında (reluctor ring) hasar', 'Sensör ile dişli çark arası boşluk bozulmuş', 'ECU sinyal devresi arızası'],
    fixes: ['Krank mili pozisyon sensörü direncini ölçün (spesifikasyona göre)', 'Sensör kablosu ve konektörünü kontrol edin', 'Sensör ucu ile dişli çark arasındaki boşluğu kontrol edin', 'Dişli çarkı (reluctor ring) hasar açısından inceleyin', 'Sensörü orijinal parça ile değiştirin']
  },
  {
    code: 'P0340', title: 'Eksantrik Mili Pozisyon Sensörü "A" Devresi Arızası (Banka 1)',
    description: 'ECU, Banka 1 eksantrik mili pozisyon sensöründen (CMP) sinyal alamıyor veya düzensiz sinyal alıyor. Bu sensör ECU\'nun doğru silindire doğru zamanda enjeksiyon yapmasını sağlar.',
    type: 'P', isGeneric: true, severity: 'Yüksek',
    systems: ['Ateşleme Sistemi', 'Motor Kontrol'],
    symptoms: ['Motor arıza lambası (MIL) yanar', 'Motor çalıştırma güçlüğü (uzun marş)', 'Motor aralıklı durma', 'Güç kaybı', 'Yakıt tüketiminde artış'],
    causes: ['Eksantrik mili pozisyon sensörü arızası', 'Sensör kablosunda kopukluk veya hasar', 'Sensör konektöründe oksitlenme', 'Zaman zinciri/kayışı atlama', 'Sensör hedef dişlisinde hasar'],
    fixes: ['CMP sensör direncini multimetre ile ölçün', 'Sensör kablo ve konektörünü kontrol edin', 'Sensörü orijinal parça ile değiştirin', 'Zaman zinciri/kayışını kontrol edin', 'Arıza kodunu silin ve test edin']
  },
  {
    code: 'P0400', title: 'Egzoz Gazı Geri Devirdaim (EGR) Akış Arızası',
    description: 'ECU, EGR sistemi akışında bir arıza tespit etmiştir. EGR sistemi, egzoz gazlarının bir kısmını emme manifolduna geri göndererek NOx emisyonlarını azaltır.',
    type: 'P', isGeneric: true, severity: 'Orta',
    systems: ['Emisyon Kontrol Sistemi', 'EGR Sistemi'],
    symptoms: ['Motor arıza lambası (MIL) yanar', 'Motor vuruntu sesi (özellikle yokuşta)', 'Rölantide düzensizlik', 'Emisyon testinden kalma', 'Yakıt tüketiminde artış'],
    causes: ['EGR valfı karbon birikimi nedeniyle sıkışmış', 'EGR geçiş kanallarında tıkanıklık', 'EGR vakum kontrol solenoidı arızası', 'EGR pozisyon/basınç sensörü hatası', 'Vakum hortumlarında çatlak veya sızıntı'],
    fixes: ['EGR valfını sökün ve karbon birikimini temizleyin', 'EGR kanal ve geçişlerini temizleyin', 'EGR kontrol solenoidini test edin', 'Vakum hortumlarını sızıntı açısından kontrol edin', 'EGR pozisyon sensörünü test edin']
  },
  {
    code: 'P0420', title: 'Katalitik Konvertör Verimi Eşik Altında (Banka 1)',
    description: 'ECU, Banka 1 katalitik konvertörün emisyon dönüşüm veriminin kabul edilebilir eşik değerinin altına düştüğünü tespit etmiştir. Bu, egzoz emisyonlarının standartları aşması anlamına gelir.',
    type: 'P', isGeneric: true, severity: 'Yüksek',
    systems: ['Emisyon Kontrol Sistemi', 'Katalitik Konvertör'],
    symptoms: ['Motor arıza lambası (MIL) yanar', 'Emisyon testinden kalma', 'Egzozdan kükürt (çürük yumurta) kokusu', 'Motor performansında hafif düşüş', 'Yakıt tüketiminde artış'],
    causes: ['Katalitik konvertör iç yapısının bozulması veya yaşlanması', 'Katalitik konvertör iç dolgusu erimiş', 'Kat öncesi/sonrası O2 sensörü arızası', 'Motor yağ yakıyor (katalitik konvertörü zehirliyor)', 'Kötü kalite veya kurşunlu yakıt kullanımı', 'Uzun süre zengin yakıt karışımı ile çalışma'],
    fixes: ['Kat öncesi ve sonrası O2 sensör voltajlarını karşılaştırın (kat sonrası stabil olmalı)', 'Katalitik konvertör giriş-çıkış sıcaklık farkını ölçün', 'Motor yağ tüketimini kontrol edin', 'O2 sensörlerini test edin ve gerekirse değiştirin', 'Gerekirse katalitik konvertörü değiştirin', 'Kaliteli yakıt kullanın']
  },
  {
    code: 'P0430', title: 'Katalitik Konvertör Verimi Eşik Altında (Banka 2)',
    description: 'ECU, Banka 2 katalitik konvertörün emisyon dönüşüm veriminin kabul edilebilir eşik değerinin altına düştüğünü tespit etmiştir. V veya boxer motorlarda ikinci banka için geçerlidir.',
    type: 'P', isGeneric: true, severity: 'Yüksek',
    systems: ['Emisyon Kontrol Sistemi', 'Katalitik Konvertör'],
    symptoms: ['Motor arıza lambası (MIL) yanar', 'Emisyon testinden kalma', 'Egzoz kokusu', 'Performans düşüklüğü'],
    causes: ['Banka 2 katalitik konvertör yaşlanması', 'Banka 2 O2 sensör arızası', 'Motor yağ yakma sorunu', 'Kötü yakıt kalitesi'],
    fixes: ['Banka 2 O2 sensörlerini kontrol edin', 'Katalitik konvertör verimini test edin', 'Motor yağ tüketimini kontrol edin', 'Gerekirse katalitik konvertörü değiştirin']
  },
  {
    code: 'P0440', title: 'EVAP Emisyon Kontrol Sistemi Arızası',
    description: 'ECU, EVAP (Yakıt Buharı Geri Kazanım) emisyon kontrol sisteminde genel bir arıza algılamıştır. Bu sistem yakıt buharlarının atmosfere kaçmasını önler.',
    type: 'P', isGeneric: true, severity: 'Düşük',
    systems: ['Emisyon Kontrol Sistemi', 'EVAP Sistemi'],
    symptoms: ['Motor arıza lambası (MIL) yanar', 'Yakıt kokusu hissedilmesi', 'Emisyon testinden kalma', 'Yakıt deposu kapağı uyarısı'],
    causes: ['Yakıt deposu kapağı gevşek, hasarlı veya eksik', 'EVAP hortumlarında çatlak veya kopukluk', 'EVAP kömür kanisteri arızası', 'EVAP kontrol (purge/vent) solenoid arızası', 'Yakıt deposu veya dolum borusunda çatlak'],
    fixes: ['Yakıt deposu kapağını sıkıca kapatın, contasını kontrol edin', 'EVAP hortum ve bağlantılarını duman testi ile kontrol edin', 'EVAP solenoid valflerini test edin', 'Kömür kanisterını kontrol edin', 'Arıza kodunu silin, birkaç sürüş döngüsü bekleyin']
  },
  {
    code: 'P0442', title: 'EVAP Emisyon Kontrol Sistemi Küçük Sızıntı Tespit Edildi',
    description: 'ECU, EVAP sisteminde küçük bir sızıntı tespit etmiştir. Bu genellikle yakıt deposu kapağı veya küçük bir hortum çatlağı ile ilgilidir.',
    type: 'P', isGeneric: true, severity: 'Düşük',
    systems: ['Emisyon Kontrol Sistemi', 'EVAP Sistemi'],
    symptoms: ['Motor arıza lambası (MIL) yanar', 'Hafif yakıt kokusu', 'Emisyon testinden kalma'],
    causes: ['Yakıt deposu kapağı contası aşınmış', 'EVAP hortumlarında küçük çatlak', 'EVAP solenoid valfında küçük sızıntı', 'Yakıt deposu dolum borusunda gevşeklik'],
    fixes: ['Yakıt deposu kapağını yenisi ile değiştirin', 'EVAP hortumlarını duman testi ile kontrol edin', 'Tüm EVAP bağlantılarını sıkılaştırın', 'Arıza kodunu silin ve izleyin']
  },
  {
    code: 'P0455', title: 'EVAP Emisyon Kontrol Sistemi Büyük Sızıntı Tespit Edildi',
    description: 'ECU, EVAP sisteminde büyük bir sızıntı tespit etmiştir. Bu genellikle yakıt deposu kapağının tamamen açık olması veya büyük bir hortum kopması ile ilgilidir.',
    type: 'P', isGeneric: true, severity: 'Düşük',
    systems: ['Emisyon Kontrol Sistemi', 'EVAP Sistemi'],
    symptoms: ['Motor arıza lambası (MIL) yanar', 'Belirgin yakıt kokusu', 'Emisyon testinden kalma'],
    causes: ['Yakıt deposu kapağı takılmamış veya tam kapanmamış', 'EVAP hortumunda büyük kopukluk', 'EVAP kömür kanisteri hasarı', 'Yakıt deposunda çatlak'],
    fixes: ['Yakıt deposu kapağını kontrol edin ve düzgün kapatın', 'EVAP hortumlarını görsel olarak inceleyin', 'Duman testi ile sızıntı noktasını bulun', 'Hasarlı parçayı değiştirin']
  },
  {
    code: 'P0500', title: 'Araç Hız Sensörü "A" Arızası',
    description: 'ECU, araç hız sensöründen (VSS) sinyal alamıyor veya düzensiz sinyal alıyor. Bu sensör hız göstergesi, ABS, şanzıman kontrolü ve hız sabitleme gibi birçok sistem için kritiktir.',
    type: 'P', isGeneric: true, severity: 'Yüksek',
    systems: ['Şanzıman', 'Hız Sensörü'],
    symptoms: ['Hız göstergesi çalışmıyor veya yanlış gösteriyor', 'Motor arıza lambası (MIL) yanar', 'Otomatik şanzıman vites geçiş sorunları', 'Hız sabitleyici (cruise control) çalışmıyor', 'ABS/ESP uyarı lambası yanabilir', 'Kilometre sayacı durmuş'],
    causes: ['Araç hız sensörü (VSS) arızası', 'Sensör kablo/konektör hasarı', 'Şanzıman çıkış mili hız sensörü arızası', 'Sensör dişli çarkında hasar', 'ECU sinyal devresi sorunu'],
    fixes: ['Hız sensörünü multimetre ile test edin', 'Sensör kablo ve konektörlerini kontrol edin', 'Sensör dişli çarkını hasar açısından inceleyin', 'Sensörü orijinal parça ile değiştirin', 'Arıza kodunu silin ve test sürüşü yapın']
  },
  {
    code: 'P0505', title: 'Rölanti Kontrol Sistemi Arızası',
    description: 'ECU, rölanti kontrol sisteminde bir arıza algılamıştır. Rölanti kontrol valfı (IAC) veya elektronik kelebek gövdesi, motorun rölanti devrini ayarlamaktan sorumludur.',
    type: 'P', isGeneric: true, severity: 'Orta',
    systems: ['Rölanti Kontrol Sistemi', 'Kelebek Gövdesi'],
    symptoms: ['Rölantide devir dalgalanması', 'Motor stop etme (duruşlarda)', 'Rölanti devri çok yüksek veya çok düşük', 'Soğuk çalıştırmada düzensiz rölanti', 'Klima açıldığında motor durması'],
    causes: ['IAC (Rölanti Kontrol Valfı) kirlenmesi veya arızası', 'Kelebek gövdesi kirlenmesi', 'Vakum kaçağı', 'Soğutma suyu sıcaklık sensörü (ECT) hatası', 'IAC kablo/konektör hasarı'],
    fixes: ['IAC valfını temizleyin veya değiştirin', 'Kelebek gövdesini temizleyin', 'Rölanti adaptasyonu (TPS reset) yapın', 'Vakum hortumlarını kontrol edin', 'ECT sensörünü test edin']
  },
  {
    code: 'P0562', title: 'Sistem Voltajı Düşük',
    description: 'ECU, araç elektrik sisteminin voltajının normalin altına düştüğünü tespit etmiştir (tipik olarak 11V altı). Bu durum birçok elektrik ve elektronik sistemin düzgün çalışmasını etkiler.',
    type: 'P', isGeneric: true, severity: 'Orta',
    systems: ['Şarj Sistemi', 'Elektrik Sistemi'],
    symptoms: ['Motor arıza lambası (MIL) yanar', 'Akü uyarı lambası yanar', 'Farlar sönük yanıyor', 'Elektrikli cam ve kilitlerde yavaşlama', 'Motor çalıştırma güçlüğü', 'Radyo/multimedya sistemi kapanıyor'],
    causes: ['Akü ömrünü tamamlamış veya zayıflamış', 'Alternatör (şarj dinamosu) arızası', 'Alternatör kayışı gevşek veya kopmuş', 'Akü kutup başlarında oksitlenme veya gevşeklik', 'Elektrik sisteminde aşırı akım çeken parazit yük'],
    fixes: ['Akü voltajını multimetre ile ölçün (12.4V+ olmalı)', 'Alternatör şarj voltajını kontrol edin (13.5-14.5V)', 'Akü kutup başlarını temizleyin ve sıkılaştırın', 'Alternatör kayışı gerginliğini kontrol edin', 'Gerekirse akü veya alternatörü değiştirin']
  },
  {
    code: 'P0600', title: 'Seri İletişim Bağlantı Arızası',
    description: 'ECU, dahili seri iletişim bağlantısında bir arıza tespit etmiştir. Bu genellikle ECU iç devre sorunu veya harici bir iletişim hatasıdır.',
    type: 'P', isGeneric: true, severity: 'Yüksek',
    systems: ['Motor Kontrol Ünitesi (ECU)'],
    symptoms: ['Motor arıza lambası (MIL) yanar', 'Birden fazla arıza kodu oluşabilir', 'Motor performansında değişkenlik', 'OBD-II tarayıcı ile iletişim güçlüğü'],
    causes: ['ECU dahili devre arızası', 'ECU güç/topraklama sorunu', 'CAN bus iletişim hattı problemi', 'Düşük akü voltajı'],
    fixes: ['Akü voltajını kontrol edin', 'ECU güç ve topraklama bağlantılarını kontrol edin', 'CAN bus hatlarını test edin', 'Gerekirse ECU değişimi veya onarımı']
  },
  {
    code: 'P0700', title: 'Şanzıman Kontrol Sistemi (MIL Talebi)',
    description: 'Şanzıman kontrol modülü (TCM), motor kontrol ünitesine (ECU) bir arıza kodunun kayıtlı olduğunu bildirmektedir. Bu kod, şanzımanda başka bir spesifik arıza olduğuna işaret eder.',
    type: 'P', isGeneric: true, severity: 'Yüksek',
    systems: ['Şanzıman (Otomatik)'],
    symptoms: ['Motor arıza lambası (MIL) yanar', 'Şanzıman arıza lambası yanabilir', 'Vites geçişlerinde sorun', 'Acil durum moduna (limp mode) geçiş', 'Sert veya gecikmeli vites geçişi'],
    causes: ['Şanzıman dahili mekanik veya elektronik arıza', 'Şanzıman yağı seviye düşüklüğü veya kirli yağ', 'Solenoid valfı arızası', 'Şanzıman hız sensörü hatası', 'TCM (Şanzıman Kontrol Modülü) arızası'],
    fixes: ['OBD-II tarayıcı ile şanzıman spesifik arıza kodlarını okuyun', 'Şanzıman yağı seviye ve durumunu kontrol edin', 'Şanzıman yağı ve filtresini değiştirin', 'İlgili şanzıman arıza koduna göre onarım yapın', 'Gerekirse yetkili serviste detaylı şanzıman taraması']
  },
  // === Eksik P0xxx Hex Kodları ===
  {
    code: 'P001A', title: 'Eksantrik Mili Profil Kontrol Devresi Açık (Banka 1 "A")',
    description: 'ECU, Banka 1 "A" eksantrik mili profil kontrol solenoid devresinde açık devre tespit etmiştir.',
    type: 'P', isGeneric: true, severity: 'Orta', systems: ['VVT Sistemi', 'Eksantrik Mili'],
    symptoms: ['Motor arıza lambası (MIL) yanar', 'Motor performansında düşüş', 'Rölantide düzensizlik', 'Yakıt tüketiminde artış'],
    causes: ['VVT profil solenoid valfı arızası', 'Solenoid kablo kopukluğu', 'ECU çıkış devresi hasarı', 'Konektör oksitlenmesi'],
    fixes: ['VVT profil solenoid direncini ölçün', 'Kablo demetini kontrol edin', 'Konektörü temizleyin', 'Gerekirse solenoid değiştirin']
  },
  {
    code: 'P001B', title: 'Eksantrik Mili Profil Kontrol Devresi Düşük (Banka 1 "A")',
    description: 'ECU, Banka 1 "A" eksantrik mili profil kontrol devresinde düşük voltaj tespit etmiştir.',
    type: 'P', isGeneric: true, severity: 'Orta', systems: ['VVT Sistemi'],
    symptoms: ['Motor arıza lambası (MIL) yanar', 'Motor performans kaybı', 'Rölanti düzensizliği'],
    causes: ['Solenoid kısa devresi', 'Kablo izolasyon hasarı', 'ECU sürücü devresi sorunu'],
    fixes: ['Solenoid direncini ölçün', 'Kablo izolasyonunu kontrol edin', 'Gerekirse solenoid değiştirin']
  },
  {
    code: 'P001C', title: 'Eksantrik Mili Profil Kontrol Devresi Yüksek (Banka 1 "A")',
    description: 'ECU, Banka 1 "A" eksantrik mili profil kontrol devresinde yüksek voltaj tespit etmiştir.',
    type: 'P', isGeneric: true, severity: 'Orta', systems: ['VVT Sistemi'],
    symptoms: ['Motor arıza lambası (MIL) yanar', 'Motor performans düşüklüğü', 'Rölanti sorunu'],
    causes: ['Kablo demetinde artıya kısa devre', 'Solenoid açık devre', 'ECU devre hasarı'],
    fixes: ['Kablolama kontrolü yapın', 'Solenoid valfını test edin', 'Konektörleri inceleyin']
  },
  {
    code: 'P002A', title: 'Eksantrik Mili Profil Kontrol Devresi Açık (Banka 1 "B")',
    description: 'ECU, Banka 1 "B" eksantrik mili profil kontrol devresinde açık devre algılamıştır.',
    type: 'P', isGeneric: true, severity: 'Orta', systems: ['VVT Sistemi', 'Eksantrik Mili'],
    symptoms: ['Motor arıza lambası (MIL) yanar', 'Motor performansında düşüş', 'Rölantide düzensizlik'],
    causes: ['VVT profil solenoid arızası', 'Kablo kopukluğu', 'Konektör gevşekliği'],
    fixes: ['Solenoid direncini ölçün', 'Kablo demetini kontrol edin', 'Konektörü temizleyin ve sıkılaştırın']
  },
  {
    code: 'P003A', title: 'Turboşarj/Süperşarj Boost Kontrol "A" Pozisyon Öğrenme Limiti Aşıldı',
    description: 'ECU, turboşarj boost kontrol "A" aktüatörünün adaptasyon değerlerinin izin verilen limitleri aştığını tespit etmiştir.',
    type: 'P', isGeneric: true, severity: 'Orta', systems: ['Turbo/Süperşarj Sistemi'],
    symptoms: ['Motor arıza lambası (MIL) yanar', 'Turbo basıncında düzensizlik', 'Güç kaybı', 'Yakıt tüketiminde artış'],
    causes: ['Turbo wastegate aktüatörü aşınmış', 'Turbo basınç kontrol solenoidı arızalı', 'Turbo mekanik aşınma', 'Egzoz sızıntısı'],
    fixes: ['Turbo wastegate aktüatörünü test edin', 'Boost basıncını canlı veri ile izleyin', 'Turbo basınç solenoidini kontrol edin', 'Egzoz sızıntısını kontrol edin']
  },
  {
    code: 'P004A', title: 'Turboşarj/Süperşarj Boost Kontrol "B" Devresi Açık',
    description: 'ECU, ikinci turboşarj boost kontrol devresinde açık devre tespit etmiştir. Çift turbo motorlarda ikinci turbo kontrolünü etkiler.',
    type: 'P', isGeneric: true, severity: 'Orta', systems: ['Turbo/Süperşarj Sistemi'],
    symptoms: ['Motor arıza lambası (MIL) yanar', 'İkinci turbo devreye girmiyor', 'Yüksek devirde güç kaybı'],
    causes: ['İkinci turbo kontrol solenoidı arızası', 'Kablo kopukluğu', 'ECU çıkış devresi hasarı'],
    fixes: ['Turbo B kontrol solenoidini test edin', 'Kablo demetini kontrol edin', 'Konektörleri inceleyin']
  },
  {
    code: 'P006A', title: 'MAP — Kütle/Hacim Hava Akış Korelasyonu (Banka 1)',
    description: 'ECU, MAP sensörü ile MAF sensörü okumaları arasında tutarsızlık tespit etmiştir. Bu iki sensörün birbiriyle uyumlu olması motor yönetimi için kritiktir.',
    type: 'P', isGeneric: true, severity: 'Orta', systems: ['Emme Manifoldu', 'Yakıt Sistemi'],
    symptoms: ['Motor arıza lambası (MIL) yanar', 'Motor performansında düşüş', 'Yakıt tüketiminde artış', 'Rölantide düzensizlik'],
    causes: ['MAP sensörü arızası veya kirlenmesi', 'MAF sensörü kirlenmesi', 'Emme manifoldunda hava kaçağı (vakum kaçağı)', 'Turbo intercooler hortumunda sızıntı'],
    fixes: ['MAP sensörünü temizleyin veya değiştirin', 'MAF sensörünü temizleyin', 'Emme manifoldunu sızıntı açısından kontrol edin', 'Turbo hortumlarını kontrol edin']
  },
  {
    code: 'P007A', title: 'Şarj Havası Soğutucu Sıcaklık Sensörü Devresi (Banka 1)',
    description: 'ECU, intercooler çıkışındaki şarj havası soğutucu sıcaklık sensöründe devre arızası tespit etmiştir.',
    type: 'P', isGeneric: true, severity: 'Orta', systems: ['Turbo/Süperşarj Sistemi', 'Emme Sistemi'],
    symptoms: ['Motor arıza lambası (MIL) yanar', 'Motor performansında düşüş', 'Turbo veriminde azalma'],
    causes: ['Şarj havası sıcaklık sensörü arızası', 'Sensör kablolama hasarı', 'Konektör oksitlenmesi'],
    fixes: ['Sensör direncini ölçün (sıcaklığa bağlı direnç tablosu)', 'Kablo ve konektörleri kontrol edin', 'Gerekirse sensörü değiştirin']
  },
  {
    code: 'P008A', title: 'Düşük Basınç Yakıt Sistemi Basıncı — Çok Düşük',
    description: 'ECU, düşük basınç yakıt sisteminde basıncın kabul edilebilir minimum seviyenin altına düştüğünü tespit etmiştir.',
    type: 'P', isGeneric: true, severity: 'Yüksek', systems: ['Yakıt Sistemi'],
    symptoms: ['Motor arıza lambası (MIL) yanar', 'Motor çalıştırma güçlüğü', 'Motor güç kaybı', 'Motor sarsıntılı çalışma', 'Motor durma eğilimi'],
    causes: ['Yakıt pompası performans düşüklüğü', 'Yakıt filtresi tıkanması', 'Yakıt hattında sızıntı', 'Yakıt basınç regülatörü arızası', 'Yakıt deposunda yetersiz yakıt'],
    fixes: ['Yakıt pompası çıkış basıncını ölçün', 'Yakıt filtresini değiştirin', 'Yakıt hattını sızıntı açısından kontrol edin', 'Yakıt basınç regülatörünü test edin']
  },
  {
    code: 'P009A', title: 'Emme Hava Sıcaklığı / Ortam Hava Sıcaklığı Korelasyonu',
    description: 'ECU, emme havası sıcaklık sensörü (IAT) ile ortam hava sıcaklık sensörü okumaları arasında mantıksız bir fark tespit etmiştir.',
    type: 'P', isGeneric: true, severity: 'Düşük', systems: ['Emme Sistemi', 'Soğutma Sistemi'],
    symptoms: ['Motor arıza lambası (MIL) yanar', 'Yakıt karışımında hafif dengesizlik', 'Motor performansında hafif düşüş'],
    causes: ['IAT sensörü arızası veya kirlenmesi', 'Ortam hava sıcaklık sensörü arızası', 'Emme sisteminde aşırı ısınma', 'Sensör kablo hasarı'],
    fixes: ['IAT sensörü direncini kontrol edin', 'Ortam sıcaklık sensörünü test edin', 'Emme hortumlarında ısı izolasyonu kontrol edin', 'Arızalı sensörü değiştirin']
  },
  // === Önemli P03xx Hex Kodları ===
  {
    code: 'P0305', title: '5. Silindir Ateşleme Kaybı Tespit Edildi',
    description: 'ECU, 5 numaralı silindirde ateşleme kaybı (misfire) tespit etmiştir. V6, V8 veya düz 5 motorlu araçlarda görülür.',
    type: 'P', isGeneric: true, severity: 'Yüksek', systems: ['Ateşleme Sistemi'],
    symptoms: ['Motor arıza lambası (MIL) yanıp söner', '5. silindirde ateşleme kaybı', 'Motor sarsıntılı çalışır', 'Güç kaybı'],
    causes: ['5. silindir bujisi aşınmış', '5. silindir ateşleme bobini arızalı', '5. silindir enjektörü tıkalı', 'Düşük kompresyon'],
    fixes: ['5. silindir bujisini değiştirin', 'Ateşleme bobinini test edin (takas yöntemi)', 'Enjektörü kontrol edin', 'Kompresyon testi yapın']
  },
  {
    code: 'P0306', title: '6. Silindir Ateşleme Kaybı Tespit Edildi',
    description: 'ECU, 6 numaralı silindirde ateşleme kaybı (misfire) tespit etmiştir. V6, V8, düz 6 motorlu araçlarda görülür.',
    type: 'P', isGeneric: true, severity: 'Yüksek', systems: ['Ateşleme Sistemi'],
    symptoms: ['Motor arıza lambası (MIL) yanıp söner', '6. silindirde ateşleme kaybı', 'Motor sarsıntılı çalışır', 'Güç kaybı'],
    causes: ['6. silindir bujisi aşınmış', '6. silindir ateşleme bobini arızalı', '6. silindir enjektörü tıkalı', 'Düşük kompresyon'],
    fixes: ['6. silindir bujisini değiştirin', 'Ateşleme bobinini test edin', 'Enjektörü kontrol edin', 'Kompresyon testi yapın']
  },
  {
    code: 'P0307', title: '7. Silindir Ateşleme Kaybı Tespit Edildi',
    description: 'ECU, 7 numaralı silindirde ateşleme kaybı tespit etmiştir. V8 motorlu araçlarda görülür.',
    type: 'P', isGeneric: true, severity: 'Yüksek', systems: ['Ateşleme Sistemi'],
    symptoms: ['Motor arıza lambası (MIL) yanıp söner', '7. silindirde ateşleme kaybı', 'Motor sarsıntılı çalışır', 'Güç kaybı'],
    causes: ['7. silindir bujisi aşınmış', '7. silindir ateşleme bobini arızalı', '7. silindir enjektörü tıkalı', 'Düşük kompresyon'],
    fixes: ['7. silindir bujisini değiştirin', 'Ateşleme bobinini test edin', 'Enjektörü kontrol edin', 'Kompresyon testi yapın']
  },
  {
    code: 'P0308', title: '8. Silindir Ateşleme Kaybı Tespit Edildi',
    description: 'ECU, 8 numaralı silindirde ateşleme kaybı tespit etmiştir. V8 motorlu araçlarda görülür.',
    type: 'P', isGeneric: true, severity: 'Yüksek', systems: ['Ateşleme Sistemi'],
    symptoms: ['Motor arıza lambası (MIL) yanıp söner', '8. silindirde ateşleme kaybı', 'Motor sarsıntılı çalışır', 'Güç kaybı'],
    causes: ['8. silindir bujisi aşınmış', '8. silindir ateşleme bobini arızalı', '8. silindir enjektörü tıkalı', 'Düşük kompresyon'],
    fixes: ['8. silindir bujisini değiştirin', 'Ateşleme bobinini test edin', 'Enjektörü kontrol edin', 'Kompresyon testi yapın']
  },
  // === Önemli P04xx/P05xx Kodları ===
  {
    code: 'P0401', title: 'EGR Akış Yetersiz Tespit Edildi',
    description: 'ECU, EGR (Egzoz Gazı Geri Devirdaim) sisteminin yeterli akış sağlamadığını tespit etmiştir.',
    type: 'P', isGeneric: true, severity: 'Orta', systems: ['Emisyon Kontrol Sistemi', 'EGR Sistemi'],
    symptoms: ['Motor arıza lambası (MIL) yanar', 'Motor vuruntu sesi (pingleme)', 'Emisyon testinden kalma', 'NOx emisyonlarında artış'],
    causes: ['EGR valfı karbon birikimi nedeniyle açılmıyor', 'EGR geçiş kanallarında ciddi tıkanıklık', 'DPFE/MAP sensörü arızası', 'Vakum kontrol sorunu'],
    fixes: ['EGR valfını sökün ve karbon birikimini temizleyin', 'EGR kanal ve geçişlerini temizleyin', 'DPFE sensörünü test edin', 'Vakum hortumlarını kontrol edin']
  },
  {
    code: 'P0402', title: 'EGR Aşırı Akış Tespit Edildi',
    description: 'ECU, EGR sistemi akışının normalden fazla olduğunu tespit etmiştir. Aşırı egzoz gazı emme manifolduna geri dönüyor.',
    type: 'P', isGeneric: true, severity: 'Orta', systems: ['Emisyon Kontrol Sistemi', 'EGR Sistemi'],
    symptoms: ['Motor arıza lambası (MIL) yanar', 'Rölantide düzensizlik veya motor durması', 'Güç kaybı', 'Motorun boğulma hissi'],
    causes: ['EGR valfı açık takılı kalmış', 'EGR kontrol solenoidı arızası', 'DPFE sensörü hatalı okuma yapıyor', 'EGR valfı yatağında karbon birikimi'],
    fixes: ['EGR valfını kontrol edin (kapalı durumda sızdırma testi)', 'EGR solenoidini test edin', 'DPFE sensörünü değiştirin', 'EGR valfını temizleyin veya değiştirin']
  },
  {
    code: 'P0411', title: 'İkincil Hava Enjeksiyon Sistemi Akışı Yanlış Tespit Edildi',
    description: 'ECU, ikincil hava enjeksiyon sisteminin akışında bir anomali tespit etmiştir. Bu sistem soğuk çalıştırmada katalitik konvertörün hızlı ısınmasını sağlar.',
    type: 'P', isGeneric: true, severity: 'Düşük', systems: ['Emisyon Kontrol Sistemi'],
    symptoms: ['Motor arıza lambası (MIL) yanar', 'Emisyon testinden kalma', 'Soğuk çalıştırma sonrası hafif rölanti düzensizliği'],
    causes: ['İkincil hava pompası arızası', 'Hava enjeksiyon çek valfı sıkışmış', 'Hava pompası rölesi arızası', 'Hava hortumlarında tıkanıklık'],
    fixes: ['İkincil hava pompası çalışmasını kontrol edin', 'Çek valfını serbestlik açısından kontrol edin', 'Hava pompası rölesini test edin', 'Hava hortumlarını tıkanıklık açısından inceleyin']
  },
  {
    code: 'P0446', title: 'EVAP Emisyon Kontrol Sistemi Havalandırma Kontrol Devresi Arızası',
    description: 'ECU, EVAP sistemi havalandırma kontrol solenoidinin devresinde bir arıza tespit etmiştir.',
    type: 'P', isGeneric: true, severity: 'Düşük', systems: ['EVAP Sistemi', 'Emisyon Kontrol'],
    symptoms: ['Motor arıza lambası (MIL) yanar', 'Emisyon testinden kalma', 'Yakıt kokusu (nadir)'],
    causes: ['EVAP havalandırma (vent) solenoidı arızası', 'Solenoid kablo/konektör hasarı', 'Kömür kanisteri havalandırma tıkanıklığı', 'ECU çıkış devresi sorunu'],
    fixes: ['Havalandırma solenoidini test edin (12V uygulayarak çalışma kontrolü)', 'Kablo ve konektörleri kontrol edin', 'Kömür kanisteri havalandırma yolunu temizleyin', 'Gerekirse solenoidı değiştirin']
  },
  {
    code: 'P0456', title: 'EVAP Emisyon Kontrol Sistemi Çok Küçük Sızıntı Tespit Edildi',
    description: 'ECU, EVAP sisteminde çok küçük bir sızıntı (0.020 inç delik eşdeğeri) tespit etmiştir.',
    type: 'P', isGeneric: true, severity: 'Düşük', systems: ['EVAP Sistemi', 'Emisyon Kontrol'],
    symptoms: ['Motor arıza lambası (MIL) yanar', 'Emisyon testinden kalma', 'Sürüş performansına etkisi yok'],
    causes: ['Yakıt deposu kapağı contası aşınmış', 'EVAP bağlantılarında çok küçük sızıntı', 'EVAP hortumlarında micro çatlak', 'Kömür kanisteri bağlantı gevşekliği'],
    fixes: ['Yakıt deposu kapağını yenisi ile değiştirin (en yaygın çözüm)', 'EVAP sistemini duman testi ile kontrol edin', 'Tüm EVAP bağlantılarını sıkılaştırın', 'Arıza kodunu silin ve birkaç sürüş döngüsü izleyin']
  },
  {
    code: 'P0507', title: 'Rölanti Kontrol Sistemi RPM Beklenenden Yüksek',
    description: 'ECU, motorun rölanti devrinin beklenen değerden sürekli yüksek olduğunu tespit etmiştir.',
    type: 'P', isGeneric: true, severity: 'Orta', systems: ['Rölanti Kontrol Sistemi'],
    symptoms: ['Motor arıza lambası (MIL) yanar', 'Rölanti devri normalden yüksek (900+ RPM)', 'Otomatik şanzımanda sürüklenme hissi', 'Fren pedalına daha fazla basma gerekliliği'],
    causes: ['Vakum kaçağı (emme manifoldu veya hortumlar)', 'IAC (rölanti kontrol) valfı açık takılı', 'Kelebek gövdesi kirli veya tam kapanmıyor', 'EGR valfı sızıntısı', 'Gaz kelebeği tel ayarı bozuk'],
    fixes: ['Tüm vakum hortumlarını sızıntı açısından kontrol edin', 'IAC valfını temizleyin veya değiştirin', 'Kelebek gövdesini temizleyin', 'EGR valfını kontrol edin', 'Kelebek adaptasyonu yapın']
  },
  {
    code: 'P0521', title: 'Motor Yağ Basıncı Sensörü/Anahtarı Performans',
    description: 'ECU, motor yağ basıncı sensöründen beklenen aralık dışında değerler almaktadır.',
    type: 'P', isGeneric: true, severity: 'Yüksek', systems: ['Motor Yağlama Sistemi'],
    symptoms: ['Motor arıza lambası (MIL) yanar', 'Yağ basıncı uyarı lambası yanabilir', 'Motor sesleri artabilir'],
    causes: ['Yağ basıncı sensörü arızası', 'Gerçek yağ basıncı sorunu', 'Sensör kablolama hasarı', 'Kirli veya uygun olmayan motor yağı'],
    fixes: ['Yağ basıncını mekanik manometre ile ölçün', 'Motor yağı seviyesini ve kalitesini kontrol edin', 'Yağ basıncı sensörünü değiştirin', 'Gerekirse yağ pompasını kontrol edin']
  },
  {
    code: 'P0523', title: 'Motor Yağ Basıncı Sensörü/Anahtarı Yüksek',
    description: 'ECU, motor yağ basıncı sensöründen normalden yüksek bir sinyal almaktadır.',
    type: 'P', isGeneric: true, severity: 'Yüksek', systems: ['Motor Yağlama Sistemi'],
    symptoms: ['Motor arıza lambası (MIL) yanar', 'Yağ basıncı göstergesi yüksek gösterir', 'Olası motor hasarı riski'],
    causes: ['Yağ basıncı sensörü arızası (yüksek okuma)', 'Sensör devresinde kısa devre', 'Yağ basınç tahliye valfı tıkalı', 'Yanlış viskozite motor yağı'],
    fixes: ['Gerçek yağ basıncını mekanik manometre ile doğrulayın', 'Sensörü değiştirin', 'Motor yağı viskozitesini kontrol edin', 'Yağ basınç tahliye valfını kontrol edin']
  },
  // === P06xx ECU Kodları ===
  {
    code: 'P0601', title: 'Dahili Kontrol Modülü Bellek Sağlama Hatası',
    description: 'ECU, dahili ROM veya flash belleğinde bir sağlama (checksum) hatası tespit etmiştir. Bu genellikle ECU yazılım bozulmasına veya donanım arızasına işaret eder.',
    type: 'P', isGeneric: true, severity: 'Yüksek', systems: ['Motor Kontrol Ünitesi (ECU)'],
    symptoms: ['Motor arıza lambası (MIL) yanar', 'Motor performansında değişkenlik', 'Birden fazla arıza kodu', 'Motor çalışmama riski'],
    causes: ['ECU dahili yazılım bozulması', 'ECU donanım arızası', 'Akü voltaj dalgalanması ECU belleğini bozmuş', 'Başarısız ECU yazılım güncellemesi'],
    fixes: ['ECU yazılım güncellemesi/yeniden programlama yapın', 'Akü ve şarj sistemini kontrol edin', 'ECU konektörlerini temizleyin', 'Gerekirse ECU değişimi']
  },
  {
    code: 'P0606', title: 'ECM/PCM İşlemci Arızası',
    description: 'ECU, dahili işlemcisinde bir arıza tespit etmiştir. Bu ciddi bir elektronik arıza olup ECU değişimi gerektirebilir.',
    type: 'P', isGeneric: true, severity: 'Kritik', systems: ['Motor Kontrol Ünitesi (ECU)'],
    symptoms: ['Motor arıza lambası (MIL) yanar', 'Motor çalışmama veya ani durma', 'Birden fazla rastgele arıza kodu', 'Acil durum moduna geçiş', 'Güç kısıtlaması'],
    causes: ['ECU dahili işlemci arızası', 'ECU aşırı ısınma', 'ECU su veya nem girişi', 'Voltaj dalgalanması kaynaklı hasar'],
    fixes: ['Akü voltajını ve şarj sistemini kontrol edin', 'ECU konektörlerini su/nem açısından inceleyin', 'ECU yazılım güncellemesi deneyin', 'Gerekirse ECU değiştirin ve programlayın']
  },
  // === P07xx Şanzıman Kodları ===
  {
    code: 'P0705', title: 'Şanzıman Kademe Sensörü Devresi Arızası (PRNDL Giriş)',
    description: 'ECU, şanzıman kademe sensöründen (vites konum anahtarı) doğru sinyal alamıyor. Bu sensör aracın hangi viteste olduğunu bildirir.',
    type: 'P', isGeneric: true, severity: 'Yüksek', systems: ['Şanzıman (Otomatik)'],
    symptoms: ['Motor arıza lambası (MIL) yanar', 'Gösterge panelinde vites göstergesi hatalı', 'Motor Park veya Nötr dışında çalışmayabilir', 'Geri vites lambaları düzensiz çalışır'],
    causes: ['Kademe sensörü (inhibitör switch) arızası', 'Sensör ayarı bozulmuş', 'Kablo demetinde hasar', 'Şanzıman konektöründe korozyon'],
    fixes: ['Kademe sensörünü ayarlayın', 'Sensör konektörünü temizleyin', 'Kablo demetini kontrol edin', 'Gerekirse kademe sensörünü değiştirin']
  },
  {
    code: 'P0715', title: 'Şanzıman Giriş/Türbin Hız Sensörü Devresi Arızası',
    description: 'ECU, şanzıman giriş (türbin) hız sensöründen sinyal alamıyor. Bu sensör tork konvertör çıkış hızını ölçer.',
    type: 'P', isGeneric: true, severity: 'Yüksek', systems: ['Şanzıman (Otomatik)'],
    symptoms: ['Şanzıman arıza lambası yanar', 'Sert vites geçişleri', 'Acil durum moduna (limp mode) geçiş', 'Hız göstergesinde düzensizlik'],
    causes: ['Giriş hız sensörü arızası', 'Sensör kablolama hasarı', 'Şanzıman iç kablolama sorunu', 'Sensör hedef dişlisinde hasar'],
    fixes: ['Giriş hız sensörü sinyal çıkışını kontrol edin', 'Kablo ve konektörleri inceleyin', 'Şanzıman yağı seviyesini kontrol edin', 'Gerekirse sensörü değiştirin']
  },
  {
    code: 'P0720', title: 'Şanzıman Çıkış Hız Sensörü Devresi Arızası',
    description: 'ECU, şanzıman çıkış hız sensöründen sinyal alamıyor. Bu sensör şanzıman çıkış milinin hızını ölçer ve vites geçiş zamanlaması için kritiktir.',
    type: 'P', isGeneric: true, severity: 'Yüksek', systems: ['Şanzıman (Otomatik)'],
    symptoms: ['Şanzıman arıza lambası yanar', 'Hız göstergesi çalışmıyor', 'Vites geçişlerinde sorun', 'Acil durum moduna (limp mode) geçiş'],
    causes: ['Çıkış hız sensörü arızası', 'Sensör kablolama hasarı', 'Şanzıman yağı seviye düşüklüğü', 'Sensör hedef dişlisinde hasar'],
    fixes: ['Çıkış hız sensörünü test edin', 'Kablo ve konektörleri kontrol edin', 'Şanzıman yağı seviyesini kontrol edin', 'Gerekirse sensörü değiştirin']
  },
  {
    code: 'P0730', title: 'Yanlış Vites Oranı',
    description: 'ECU, şanzıman giriş ve çıkış hız sensörleri arasındaki vites oranının beklenen değerle uyuşmadığını tespit etmiştir.',
    type: 'P', isGeneric: true, severity: 'Yüksek', systems: ['Şanzıman (Otomatik)'],
    symptoms: ['Şanzıman arıza lambası yanar', 'Vites kayması hissi', 'Sert vites geçişleri', 'Acil durum moduna geçiş', 'Yakıt tüketiminde artış'],
    causes: ['Şanzıman yağı seviye düşüklüğü veya kirli yağ', 'Şanzıman iç aşınma (kavrama plakaları)', 'Solenoid valfı arızası', 'Tork konvertör arızası'],
    fixes: ['Şanzıman yağı seviye ve durumunu kontrol edin', 'Şanzıman yağı ve filtresini değiştirin', 'Solenoid valflerini test edin', 'Gerekirse şanzıman onarımı']
  },
  {
    code: 'P0741', title: 'Tork Konvertör Kilitleme Kavraması Devresi Performans veya Takılı Kapalı',
    description: 'ECU, tork konvertör kilitleme kavramasının (TCC) beklenen performansta çalışmadığını tespit etmiştir.',
    type: 'P', isGeneric: true, severity: 'Orta', systems: ['Şanzıman (Otomatik)'],
    symptoms: ['Motor arıza lambası (MIL) yanar', 'Yakıt tüketiminde artış', 'Otoyol hızında motor devri yüksek', 'Hafif titreşim hissi'],
    causes: ['TCC solenoid valfı arızası', 'Şanzıman yağı kirli veya düşük seviyede', 'Tork konvertör iç arızası', 'Kablo demetinde hasar'],
    fixes: ['Şanzıman yağı ve filtresini değiştirin', 'TCC solenoid valfını test edin', 'Kablo ve konektörleri kontrol edin', 'Gerekirse tork konvertör değişimi']
  },
  // === P3xxx Hibrit/Elektrikli Araç Kodları ===
  {
    code: 'P3001', title: 'Batarya Yüksek Voltaj Sistemi Performansı',
    description: 'Hibrit araçlarda yüksek voltaj batarya sisteminin performansında bir düşüş tespit edilmiştir. Batarya kapasitesi veya voltaj değerleri beklenenin altında.',
    type: 'P', isGeneric: true, severity: 'Kritik', systems: ['Hibrit Sistemi', 'Yüksek Voltaj Batarya'],
    symptoms: ['Hibrit sistem uyarı lambası yanar', 'Elektrik motorunda güç kaybı', 'Yakıt tüketiminde artış', 'Batarya şarj süresi uzaması'],
    causes: ['HV batarya hücrelerinde kapasite düşüşü', 'Batarya soğutma sistemi arızası', 'Batarya yönetim sistemi (BMS) hatası', 'Batarya bağlantılarında yüksek direnç'],
    fixes: ['HV batarya sağlık durumunu kontrol edin (SOH)', 'Batarya soğutma fanını test edin', 'Batarya konektörlerini kontrol edin', 'Gerekirse batarya modülü değişimi']
  },
  {
    code: 'P3004', title: 'Batarya Modülü Sıcaklığı Yüksek',
    description: 'Hibrit araçlarda yüksek voltaj batarya modülünün sıcaklığının güvenli limitin üzerine çıktığı tespit edilmiştir.',
    type: 'P', isGeneric: true, severity: 'Kritik', systems: ['Hibrit Sistemi', 'Yüksek Voltaj Batarya'],
    symptoms: ['Hibrit sistem uyarı lambası yanar', 'Elektrik motoru gücü kısıtlanmış', 'Batarya şarj/deşarj kısıtlaması', 'Klima performansında düşüş'],
    causes: ['Batarya soğutma fanı arızası', 'Soğutma kanallarında tıkanıklık', 'Aşırı sıcak ortam koşulları', 'Batarya hücresi iç direnci artmış'],
    fixes: ['Batarya soğutma fanını kontrol edin', 'Soğutma kanallarını ve filtresini temizleyin', 'Batarya modülü sıcaklık sensörünü test edin', 'Aracı serin ortamda park edin ve tekrar deneyin']
  },
  {
    code: 'P3009', title: 'HV Batarya Yalıtım Direnci Düşük',
    description: 'Hibrit/elektrikli araçlarda yüksek voltaj batarya sisteminin yalıtım direncinin güvenli seviyenin altına düştüğü tespit edilmiştir. Bu ciddi bir elektrik güvenliği sorunudur.',
    type: 'P', isGeneric: true, severity: 'Kritik', systems: ['Hibrit Sistemi', 'Yüksek Voltaj Batarya'],
    symptoms: ['Hibrit/EV sistem uyarı lambası yanar', 'Araç çalışmayabilir', 'Elektrik motoru devre dışı kalabilir', 'Güvenlik sistemi devreye girer'],
    causes: ['HV kablo izolasyonunda hasar', 'Batarya kasasında su birikmesi', 'HV konektörlerde nem/korozyon', 'Batarya hücresi sızıntısı'],
    fixes: ['HV sistemi güvenli şekilde devre dışı bırakın (yetkili servis!)', 'Yalıtım direnci ölçümü yapın', 'HV kablo ve konektörleri inceleyin', 'Gerekirse HV kablo veya batarya modülü değişimi']
  },
  // === Önemli U Kodları ===
  {
    code: 'U0001', title: 'Yüksek Hızlı CAN İletişim Bus Arızası',
    description: 'Araçtaki yüksek hızlı CAN bus iletişim hattında arıza tespit edilmiştir. CAN bus, tüm elektronik kontrol modüllerinin birbiriyle haberleşmesini sağlayan temel ağdır.',
    type: 'U', isGeneric: true, severity: 'Yüksek', systems: ['Ağ ve İletişim (CAN Bus)'],
    symptoms: ['Birden fazla uyarı lambası aynı anda yanar', 'Gösterge panelinde hatalı gösterimler', 'Bazı araç fonksiyonları çalışmaz', 'OBD-II tarayıcı ile iletişim güçlüğü', 'Motor çalışmayabilir'],
    causes: ['CAN bus kablosunda kopukluk veya kısa devre', 'CAN bus sonlandırma direnci arızası', 'Bir kontrol modülünün CAN hattını aşağı çekmesi', 'Kablo demetinde fiziksel hasar (kemirgen vb.)'],
    fixes: ['CAN bus CAN-H ve CAN-L hatlarını multimetre ile kontrol edin', 'CAN bus sonlandırma direncini ölçün (60 ohm)', 'Modülleri tek tek ayırarak sorunlu olanı tespit edin', 'Kablo demetini hasar açısından inceleyin']
  },
  {
    code: 'U0073', title: 'Kontrol Modülü İletişimi Kapalı — Bus A',
    description: 'Bir veya birden fazla kontrol modülünün CAN Bus A üzerindeki iletişiminin tamamen kesildiği tespit edilmiştir.',
    type: 'U', isGeneric: true, severity: 'Yüksek', systems: ['Ağ ve İletişim (CAN Bus)'],
    symptoms: ['Birden fazla sistem uyarısı', 'Araç fonksiyonlarında ciddi kayıp', 'Motor çalışmayabilir', 'Gösterge paneli karanlık kalabilir'],
    causes: ['CAN bus hattında tam kopukluk', 'Ciddi kısa devre', 'Akü çok zayıf veya bağlantı sorunlu', 'Merkezi junction box arızası'],
    fixes: ['Akü bağlantılarını kontrol edin ve sıkılaştırın', 'CAN bus hatlarını tam kopukluk açısından kontrol edin', 'Junction box/sigorta kutusu bağlantılarını inceleyin', 'Tüm modülleri ayrı ayrı tarayın']
  },
  {
    code: 'U0100', title: 'ECM/PCM ile İletişim Kaybı',
    description: 'Bir kontrol modülü, motor kontrol ünitesi (ECM/PCM) ile iletişimini kaybetmiştir. ECM tüm motor fonksiyonlarını yönettiği için kritik bir arızadır.',
    type: 'U', isGeneric: true, severity: 'Kritik', systems: ['Ağ ve İletişim (CAN Bus)', 'Motor Kontrol Ünitesi'],
    symptoms: ['Motor arıza lambası (MIL) yanar', 'Motor çalışmayabilir', 'Gösterge panelinde çoklu uyarılar', 'Hız göstergesi/devir göstergesi çalışmaz', 'Acil durum moduna geçiş'],
    causes: ['ECM güç beslemesi veya topraklama kaybı', 'ECM dahili arıza', 'CAN bus hat kopukluğu', 'ECM konektöründe korozyon', 'Sigorta atması'],
    fixes: ['ECM güç ve topraklama pinlerini kontrol edin', 'ECM sigortalarını kontrol edin', 'ECM konektörünü çıkarıp temizleyin', 'CAN bus hatlarını kontrol edin', 'Gerekirse ECM değişimi']
  },
  {
    code: 'U0101', title: 'TCM ile İletişim Kaybı',
    description: 'Bir kontrol modülü, şanzıman kontrol modülü (TCM) ile iletişimini kaybetmiştir.',
    type: 'U', isGeneric: true, severity: 'Yüksek', systems: ['Ağ ve İletişim (CAN Bus)', 'Şanzıman'],
    symptoms: ['Şanzıman arıza lambası yanar', 'Vites geçişlerinde sorun', 'Acil durum moduna geçiş', 'Motor arıza lambası da yanabilir'],
    causes: ['TCM güç/topraklama kaybı', 'TCM dahili arıza', 'CAN bus iletişim problemi', 'TCM konektöründe su/korozyon'],
    fixes: ['TCM güç beslemesini kontrol edin', 'TCM konektörünü temizleyin', 'CAN bus hatlarını kontrol edin', 'Gerekirse TCM değişimi']
  },
  {
    code: 'U0121', title: 'ABS Kontrol Modülü ile İletişim Kaybı',
    description: 'Bir kontrol modülü, ABS (Anti-lock Braking System) kontrol modülü ile iletişimini kaybetmiştir.',
    type: 'U', isGeneric: true, severity: 'Yüksek', systems: ['Ağ ve İletişim (CAN Bus)', 'ABS / Fren Sistemi'],
    symptoms: ['ABS uyarı lambası yanar', 'ESP/ESC uyarı lambası yanar', 'ABS fonksiyonu devre dışı', 'Motor arıza lambası yanabilir'],
    causes: ['ABS modülü güç/topraklama kaybı', 'ABS modülü dahili arıza', 'CAN bus iletişim sorunu', 'ABS modülü konektöründe korozyon'],
    fixes: ['ABS modülü güç ve topraklamasını kontrol edin', 'ABS modülü konektörünü temizleyin', 'CAN bus hatlarını kontrol edin', 'Gerekirse ABS modülü değişimi']
  },
  {
    code: 'U0140', title: 'BCM (Gövde Kontrol Modülü) ile İletişim Kaybı',
    description: 'Bir kontrol modülü, gövde kontrol modülü (BCM) ile iletişimini kaybetmiştir. BCM aydınlatma, merkezi kilit, cam kontrolü gibi gövde fonksiyonlarını yönetir.',
    type: 'U', isGeneric: true, severity: 'Orta', systems: ['Ağ ve İletişim (CAN Bus)', 'Gövde Kontrol Modülü'],
    symptoms: ['Birden fazla gövde sistemi çalışmaz (lambalar, kilitler, camlar)', 'Uyarı lambaları yanar', 'Merkezi kilit çalışmaz', 'İç aydınlatma sorunu'],
    causes: ['BCM güç/topraklama kaybı', 'BCM dahili arıza', 'CAN bus iletişim sorunu', 'BCM konektöründe su girişi'],
    fixes: ['BCM güç beslemesini ve sigortalarını kontrol edin', 'BCM konektörünü temizleyin', 'CAN bus hatlarını kontrol edin', 'Gerekirse BCM yazılım güncellemesi veya değişimi']
  },
  {
    code: 'U0155', title: 'Gösterge Paneli Kontrol Modülü ile İletişim Kaybı',
    description: 'Bir kontrol modülü, gösterge paneli (instrument cluster) kontrol modülü ile iletişimini kaybetmiştir.',
    type: 'U', isGeneric: true, severity: 'Orta', systems: ['Ağ ve İletişim (CAN Bus)', 'Gösterge Paneli'],
    symptoms: ['Gösterge paneli karanlık veya hatalı gösterim', 'Hız/devir göstergeleri çalışmaz', 'Uyarı lambaları düzensiz çalışır', 'Kilometre sayacı duruyor'],
    causes: ['Gösterge paneli modülü güç kaybı', 'Modül konektöründe gevşeklik', 'CAN bus iletişim hatası', 'Gösterge paneli dahili arıza'],
    fixes: ['Gösterge paneli konektörlerini kontrol edin', 'Güç ve topraklama pinlerini test edin', 'CAN bus hatlarını kontrol edin', 'Gerekirse gösterge paneli değişimi veya onarımı']
  },
];

// ═══════════════════════════════════════════════════════════════
// BÖLÜM 5: ANA ZENGİNLEŞTİRME FONKSİYONLARI
// ═══════════════════════════════════════════════════════════════

function fixTypos(text) {
  if (!text) return text;
  let result = text;
  for (const [wrong, correct] of Object.entries(TYPO_FIXES)) {
    result = result.split(wrong).join(correct);
  }
  return result;
}

function translateTitle(title) {
  if (!title) return title;
  // Sadece İngilizce kelime içeren başlıkları çevir
  const hasEnglish = /[A-Za-z]{3,}/.test(title) && !/^[A-ZÇĞİÖŞÜ]/.test(title);
  if (!hasEnglish) return title;
  
  let result = title;
  // Uzun ifadeleri önce çevir
  const longPhrases = Object.entries(EN_TR_MAP)
    .sort((a, b) => b[0].length - a[0].length);
  
  for (const [en, tr] of longPhrases) {
    const regex = new RegExp(`\\b${en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    result = result.replace(regex, tr);
  }
  return result;
}

function getFamilyData(code) {
  const type = code[0]; // P, B, C, U
  const prefix = code.substring(0, 4); // e.g., P030
  const prefix3 = code.substring(0, 3); // e.g., P03
  const prefix2 = code.substring(0, 2); // e.g., P0
  
  let familyMap;
  switch (type) {
    case 'P': familyMap = P_FAMILY_DATA; break;
    case 'B': familyMap = B_FAMILY_DATA; break;
    case 'C': familyMap = C_FAMILY_DATA; break;
    case 'U': familyMap = U_FAMILY_DATA; break;
    default: return null;
  }
  
  // Try most specific first
  return familyMap[prefix] || familyMap[prefix3] || familyMap[prefix2] || familyMap[type] || null;
}

function isPoor(code) {
  return (
    code.symptoms.length === 0 ||
    code.causes.length <= 1 ||
    code.fixes.length <= 1 ||
    code.description === code.title
  );
}

function enrichCode(code) {
  const family = getFamilyData(code.code);
  if (!family) return code;
  
  const enriched = { ...code };
  
  // Fix typos in all text fields
  enriched.title = fixTypos(enriched.title);
  enriched.description = fixTypos(enriched.description);
  enriched.symptoms = enriched.symptoms.map(fixTypos);
  enriched.causes = enriched.causes.map(fixTypos);
  enriched.fixes = enriched.fixes.map(fixTypos);
  
  // Translate title if needed
  enriched.title = translateTitle(enriched.title);
  
  // Enrich description if same as title
  if (enriched.description === enriched.title || enriched.description.length < enriched.title.length + 10) {
    enriched.description = `Araç beyni (ECU/PCM), ${enriched.title.toLowerCase()} arızası tespit etmiştir. Bu arıza kodu, ${family.systems[0] || 'ilgili sistem'} ile ilgili bir sorun olduğuna işaret eder ve doğru teşhis için profesyonel OBD-II tarayıcı ile analiz önerilir.`;
  }
  
  // Enrich symptoms if empty
  if (enriched.symptoms.length === 0) {
    enriched.symptoms = [...family.defaultSymptoms];
  } else if (enriched.symptoms.length < 2) {
    // Add more symptoms from family
    const existing = new Set(enriched.symptoms.map(s => s.toLowerCase()));
    for (const sym of family.defaultSymptoms) {
      if (!existing.has(sym.toLowerCase()) && enriched.symptoms.length < 4) {
        enriched.symptoms.push(sym);
        existing.add(sym.toLowerCase());
      }
    }
  }
  
  // Enrich causes if too few
  if (enriched.causes.length <= 1) {
    const existing = new Set(enriched.causes.map(c => c.toLowerCase()));
    for (const cause of family.defaultCauses) {
      if (!existing.has(cause.toLowerCase()) && enriched.causes.length < 4) {
        enriched.causes.push(cause);
        existing.add(cause.toLowerCase());
      }
    }
  }
  
  // Enrich fixes if too few
  if (enriched.fixes.length <= 1) {
    const existing = new Set(enriched.fixes.map(f => f.toLowerCase()));
    for (const fix of family.defaultFixes) {
      if (!existing.has(fix.toLowerCase()) && enriched.fixes.length < 4) {
        enriched.fixes.push(fix);
        existing.add(fix.toLowerCase());
      }
    }
  }
  
  // Fix severity if "Değişken"
  if (enriched.severity === 'Değişken' && family.severity) {
    enriched.severity = family.severity;
  }
  
  // Fix systems if generic
  if (enriched.systems.length === 1 && (
    enriched.systems[0] === 'Motor Kontrol Sistemi (Genel)' || 
    enriched.systems[0] === 'Gövde Sistemi'
  ) && family.systems) {
    enriched.systems = [...family.systems];
  }
  
  return enriched;
}

// ═══════════════════════════════════════════════════════════════
// BÖLÜM 6: ANA ÇALIŞTIRMA
// ═══════════════════════════════════════════════════════════════

function main() {
  console.log('📖 Mevcut obd-codes.json okunuyor...');
  const rawData = fs.readFileSync(DATA_PATH, 'utf-8');
  const codes = JSON.parse(rawData);
  
  console.log(`📊 Toplam ${codes.length} OBD kodu bulundu.`);
  
  // İstatistikler - Önce
  const beforeStats = {
    total: codes.length,
    emptySym: codes.filter(c => c.symptoms.length === 0).length,
    oneCause: codes.filter(c => c.causes.length <= 1).length,
    oneFix: codes.filter(c => c.fixes.length <= 1).length,
    sameDesc: codes.filter(c => c.description === c.title).length,
    poor: codes.filter(isPoor).length,
  };
  
  console.log('\n📊 Mevcut İstatistikler:');
  console.log(`   Boş semptom: ${beforeStats.emptySym}`);
  console.log(`   1 veya az neden: ${beforeStats.oneCause}`);
  console.log(`   1 veya az çözüm: ${beforeStats.oneFix}`);
  console.log(`   Description = Title: ${beforeStats.sameDesc}`);
  console.log(`   Fakir içerikli toplam: ${beforeStats.poor}`);
  
  // Zenginleştir
  console.log('\n🔧 Kodlar zenginleştiriliyor...');
  const enriched = codes.map(enrichCode);
  let enrichedCount = 0;
  for (let i = 0; i < codes.length; i++) {
    if (JSON.stringify(codes[i]) !== JSON.stringify(enriched[i])) {
      enrichedCount++;
    }
  }
  console.log(`   ${enrichedCount} kod zenginleştirildi.`);
  
  // Yeni kodları ekle
  console.log('\n➕ Yeni kodlar ekleniyor...');
  const existingCodes = new Set(enriched.map(c => c.code));
  let addedCount = 0;
  for (const newCode of NEW_CODES) {
    if (!existingCodes.has(newCode.code)) {
      enriched.push(newCode);
      existingCodes.add(newCode.code);
      addedCount++;
    }
  }
  console.log(`   ${addedCount} yeni kod eklendi.`);
  
  // Sırala (code'a göre)
  enriched.sort((a, b) => a.code.localeCompare(b.code));
  
  // İstatistikler - Sonra
  const afterStats = {
    total: enriched.length,
    emptySym: enriched.filter(c => c.symptoms.length === 0).length,
    oneCause: enriched.filter(c => c.causes.length <= 1).length,
    oneFix: enriched.filter(c => c.fixes.length <= 1).length,
    sameDesc: enriched.filter(c => c.description === c.title).length,
    poor: enriched.filter(isPoor).length,
  };
  
  console.log('\n📊 Güncelleme Sonrası İstatistikler:');
  console.log(`   Toplam kod: ${beforeStats.total} → ${afterStats.total}`);
  console.log(`   Boş semptom: ${beforeStats.emptySym} → ${afterStats.emptySym}`);
  console.log(`   1 veya az neden: ${beforeStats.oneCause} → ${afterStats.oneCause}`);
  console.log(`   1 veya az çözüm: ${beforeStats.oneFix} → ${afterStats.oneFix}`);
  console.log(`   Description = Title: ${beforeStats.sameDesc} → ${afterStats.sameDesc}`);
  console.log(`   Fakir içerikli: ${beforeStats.poor} → ${afterStats.poor}`);
  
  // Dosyaya yaz
  console.log('\n💾 obd-codes.json dosyasına yazılıyor...');
  fs.writeFileSync(DATA_PATH, JSON.stringify(enriched, null, 2), 'utf-8');
  
  const fileSizeMB = (fs.statSync(DATA_PATH).size / (1024 * 1024)).toFixed(2);
  console.log(`   Dosya boyutu: ${fileSizeMB} MB`);
  
  console.log('\n✅ OBD kodları başarıyla zenginleştirildi!');
}

main();
