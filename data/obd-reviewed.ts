import type { ObdCode } from '../lib/obd-content';

// Kaynaklar belirli araçların üretici bültenleridir; tüm modellere uygulanacak
// parça değişimi talimatı olarak kullanılmaz. Yalnızca kontrol edilen kodlar.
export const reviewedObdCodes: Record<string, Partial<ObdCode>> = {
    P1000: {
        title: 'Ford P1000: OBD Hazırlık Testleri Tamamlanmadı',
        isGeneric: false,
        description: 'Ford bağlamında P1000, OBD izleme testlerinin tamamlanmadığını bildirir. Tek başına parça arızası veya değişim gerekçesi değildir. Kaynak 1999 Ford PCED belgesidir; güncel aracın yıl ve motoruna uygun prosedür ayrıca doğrulanmalıdır.',
        systems: ['OBD Hazırlık Monitörleri'],
        symptoms: ['Cihazda tamamlanmamış readiness monitörleri görülebilir; diğer belirtiler ayrıca değerlendirilmelidir'],
        causes: ['Akü/PCM bağlantısının kesilmesi veya kodların silinmesi sonrası testlerin tamamlanmaması', 'İzleme döngüsünün tamamlanmasını etkileyen koşullar veya başka arıza kayıtları'],
        fixes: ['Tüm kodları, readiness durumunu ve son işlemleri kaydedin', 'Araç için geçerli Ford prosedürünü kontrol edin; sabit kilometre veya sürüş süresi varsaymayın', 'Kodu tekrar tekrar silerek test tamamlanmasını beklemeyin; eşlik eden arızaları ayrıca inceletin'],
        lastReviewed: '2026-10-22',
        sources: [{ title: 'Ford PCED 1999: P1000 monitor testing not complete; model kapsamını kontrol edin', url: 'https://www.fordservicecontent.dealerconnection.com/pubs/content/~WVX2/~MUS~LEN/15/VX25112.HTM' }],
    },
    P0171: {
        title: 'Yakıt-Hava Karışımı Fazla Fakir (Bank 1)',
        description: 'P0171, motor kontrol ünitesinin birinci silindir sırasındaki yakıt-hava karışımını fazla fakir algıladığını belirtir. Emme hattındaki ölçülmemiş hava girişi olası nedenlerden biridir. Kod doğrudan krank mili veya zamanlama arızası anlamına gelmez.',
        systems: ['Yakıt Sistemi', 'Emme Hava Sistemi'],
        symptoms: ['Motor arıza lambasının yanması', 'Rölantide düzensizlik veya tekleme görülebilmesi', 'Çekişte azalma; bazı araçlarda belirgin sürüş belirtisi olmaması'],
        causes: ['Emme hortumunda, bağlantılarda veya vakum hattında kaçak', 'Yakıt beslemesi ya da hava ölçümüyle ilgili sorunlar; araç özelinde ölçüm gerekir'],
        fixes: ['Kodları ve arıza anı verilerini silmeden kaydedin', 'Emme hortumlarını, bağlantıları ve vakum hatlarını kaçak açısından kontrol ettirin', 'Yakıt düzeltmelerini ve yakıt/hava ölçümlerini motorun servis değerleriyle karşılaştırın', 'Ölçümle doğrulanan neden giderildikten sonra kodun tekrar oluşup oluşmadığını kontrol ettirin'],
        lastReviewed: '2026-09-18',
        sources: [{ title: 'GM 22-NA-171: P0171/P0174 ve emme hortumu kaçağı (belirli Colorado/Canyon modelleri)', url: 'https://static.nhtsa.gov/odi/tsbs/2023/MC-10231421-0001.pdf' }],
    },
    P0300: {
        title: 'Rastgele veya Birden Fazla Silindirde Tekleme',
        description: 'P0300, motorun rastgele veya birden fazla silindirde tekleme algıladığını belirtir. Tek başına hangi parçanın arızalı olduğunu göstermez. Ateşleme, yakıt beslemesi ve mekanik durum birlikte değerlendirilir.',
        systems: ['Ateşleme Sistemi', 'Yakıt Sistemi'],
        symptoms: ['Motorun sarsıntılı çalışması', 'Güç kaybı veya düzensiz rölanti', 'Motor arıza lambasının yanması; ağır teklemede yanıp sönmesi'],
        causes: ['Buji, ateşleme bobini veya bağlantı sorunu', 'Enjektör veya yakıt besleme sorunu', 'Kompresyon kaybı ya da supap mekanizması sorunu'],
        fixes: ['Kodları ve arıza anı verilerini kaydedin; eşlik eden P0301–P0306 gibi silindir kodlarını değerlendirin', 'Serviste ateşleme ve yakıt bileşenlerini test ettirin', 'Bu kontroller sonuç vermezse kompresyon ve supap mekanizmasını kontrol ettirin', 'Yanıp sönen arıza lambası ve şiddetli teklemede sürüşe devam etmeyin; güvenli yerde servis desteği alın'],
        lastReviewed: '2026-09-18',
        sources: [{ title: 'GM PIP5493E: P0300 ve silindir teklemesi teşhisi (bültende belirtilen motorlar)', url: 'https://static.nhtsa.gov/odi/tsbs/2018/MC-10129081-9999.pdf' }],
    },
    P0299: {
        title: 'Turbo / Süperşarj Basıncı Beklenenin Altında',
        description: 'P0299, kontrol ünitesinin beklenen şarj basıncına ulaşılamadığını algıladığını belirtir. Kod tek başına turbo değişimi gerektirmez; basınç hattı ve kontrol sistemi incelenmelidir.',
        systems: ['Turbo', 'Emme Hava Sistemi'],
        symptoms: ['Motor arıza lambasının yanması', 'Çekiş kaybı veya hızlanmada isteksizlik', 'Bazı araçlarda güç kısıtlama modu'],
        causes: ['Şarj havası hattı veya kontrol mekanizması sorunu', 'Basınç ölçümünü etkileyen sensör veya bağlantı sorunu', 'Bazı modellerde soğuk havada emme hattı/intercooler buzlanması', 'Testle doğrulanması gereken turbo mekanik arızası'],
        fixes: ['Kodları ve arızanın oluştuğu yük/sıcaklık koşullarını kaydedin', 'Hortumları, bağlantıları ve şarj havası hattını kontrol ettirin', 'Hedef ve ölçülen turbo basıncını üreticinin teşhis prosedürüyle karşılaştırın', 'Turbo değiştirmeden önce araç ve motora uygun basınç kontrol testini uygulatın'],
        lastReviewed: '2026-09-18',
        sources: [{ title: 'GM PIP5495: P0299/P0234 teşhisi ve turbo basınç testi (belirli GM modelleri)', url: 'https://static.nhtsa.gov/odi/tsbs/2018/MC-10145482-9999.pdf' }],
    },
    P0420: {
        title: 'Katalizör Verimliliği Eşik Değerinin Altında (Bank 1)',
        description: 'P0420, birinci silindir sırasındaki katalizör sisteminin verimlilik kontrolünü geçemediğini belirtir. Kod tek başına katalizörün değiştirilmesi gerektiğini kanıtlamaz; egzoz kaçağı ve ilgili sensör verileri de değerlendirilir.',
        systems: ['Katalitik Konvertör', 'O2/Lambda'],
        symptoms: ['Motor arıza lambasının yanması', 'Belirgin sürüş şikâyeti olmadan kod kaydı oluşabilmesi'],
        causes: ['Egzoz hattında kaçak', 'Katalizör veya oksijen sensörü ölçümüyle ilgili sorun; testle ayrılmalıdır'],
        fixes: ['Kodları ve arıza anı verilerini kaydedin; eşlik eden motor kodlarını değerlendirin', 'Egzoz bağlantılarını ve sensör çevresini kaçak açısından kontrol ettirin', 'Katalizör öncesi ve sonrası sensör verilerini üreticinin test koşullarında inceletin', 'Katalizör değişimini ancak kaçaklar ve ilgili ölçümler kontrol edildikten sonra değerlendirin'],
        lastReviewed: '2026-09-18',
        sources: [{ title: 'GM PIP5110C: P0420 için katalizör değişiminden önce egzoz kaçağı kontrolü (belirli GM modelleri)', url: 'https://static.nhtsa.gov/odi/tsbs/2015/MC-10114614-9999.pdf' }],
    },
};
