export interface OtoHesapGuide {
  label: string;
  h1: string;
  category: string;
  steps: [string, string, string];
  result: string;
  caution: string;
  faqs: Array<{ question: string; answer: string }>;
  formula?: string;
  example?: string;
}

export const OTOHESAP_LAST_REVIEWED = '2026-09-02';

export const OTOHESAP_GUIDES: Record<string, OtoHesapGuide> = {
  'yakit-hesaplama': {
    label: 'Yakıt Hesaplama',
    h1: 'Şehirler Arası Yakıt Maliyeti Hesaplama',
    category: 'Kullanım maliyeti',
    steps: ['Kalkış ve varış konumlarını seçin.', 'Yakıt türünü ve aracın ortalama tüketimini girin.', 'Tek yön veya gidiş-dönüş toplam maliyetini inceleyin.'],
    result: 'Sonuç; tahmini karayolu mesafesini, gerekli yakıt miktarını, toplam maliyeti ve kilometre başına gideri birlikte gösterir.',
    caution: 'Gerçek tüketim; trafik, yük, hava, sürüş tarzı ve güzergâha göre değişebilir. Sonucu yolculuk bütçesi için tahmini değer olarak kullanın.',
    faqs: [
      { question: 'Yakıt maliyeti nasıl hesaplanır?', answer: 'Mesafe, aracın 100 kilometredeki ortalama tüketimiyle çarpılır; bulunan litre miktarı güncel litre fiyatıyla çarpılarak tahmini maliyet elde edilir.' },
      { question: 'Gidiş-dönüş hesabı yapılabilir mi?', answer: 'Evet. Gidiş-dönüş seçeneği açıkken hesaplanan güzergâh mesafesi iki yön için değerlendirilir.' },
    ],
  },
  'yatirim-kiyaslama': {
    label: 'Yatırım Kıyaslama',
    h1: 'Araç, Altın, Dolar ve Mevduat Yatırım Kıyaslama',
    category: 'Değer ve yatırım',
    steps: ['Başlangıç tutarını ve yatırım dönemini belirleyin.', 'Araç ile kıyaslamak istediğiniz yatırım seçeneklerini seçin.', 'Nominal ve reel değişim sonuçlarını birlikte değerlendirin.'],
    result: 'Araç değer değişimi ile alternatif yatırım araçlarının aynı dönem içindeki tahmini performansı ortak bir tabloda karşılaştırılır.',
    caution: 'Geçmiş performans gelecekteki getiriyi garanti etmez. Hesaplama yatırım tavsiyesi değildir; vergi, likidite ve işlem maliyetleri ayrıca değerlendirilmelidir.',
    faqs: [
      { question: 'Araç bir yatırım aracı mıdır?', answer: 'Araç değer kazanabilir ancak bakım, sigorta, vergi, finansman ve kullanım giderleri net getiriyi azaltabilir.' },
      { question: 'Reel getiri neden önemlidir?', answer: 'Reel getiri, nominal değişimin enflasyon etkisinden arındırılmış halidir ve satın alma gücündeki değişimi daha iyi gösterir.' },
    ],
  },
  'al-sat-analizi': {
    label: 'Al-Sat Analizi',
    h1: 'Araç Al-Sat Net Kâr Marjı Hesaplama',
    category: 'Değer ve yatırım',
    steps: ['Aracın alış ve hedef satış fiyatını girin.', 'Noter, ekspertiz, bakım ve ilan giderlerini ekleyin.', 'Net kârı ve satış fiyatına göre kâr marjını inceleyin.'],
    result: 'Brüt fiyat farkından tüm ek giderler düşülür; tahmini net kâr ve yüzde kâr marjı ayrı gösterilir.',
    caution: 'Vergi yükümlülüğü ve ticari faaliyet kapsamı kişiye göre değişebilir. Düzenli al-sat yapanların mali müşavir görüşü alması gerekir.',
    faqs: [
      { question: 'Araç al-sat kârı nasıl bulunur?', answer: 'Satış fiyatından alış bedeliyle birlikte ekspertiz, noter, bakım, ilan ve finansman gibi tüm işlem giderleri çıkarılır.' },
      { question: 'Kâr marjı ile kâr oranı aynı mı?', answer: 'Kâr marjı genellikle satış fiyatı üzerinden, getiri oranı ise yatırılan toplam maliyet üzerinden hesaplanır; bu nedenle sonuçları farklı olabilir.' },
    ],
  },
  'otv-muafiyeti': {
    label: 'ÖTV Muafiyeti',
    h1: 'Engelli Araç ÖTV Muafiyeti Hesaplama 2026',
    category: 'Satın alma ve finansman',
    steps: ['Aracın vergiler dahil satış fiyatını girin.', 'Uygulanan ÖTV oranını ve uygunluk durumunu seçin.', 'Muafiyet sonrası tahmini araç bedelini inceleyin.'],
    result: 'Araç fiyatındaki ÖTV ve buna bağlı KDV etkisi ayrıştırılarak tahmini muafiyetli tutar gösterilir.',
    caution: 'Mevzuat, üst limitler ve uygun araç şartları değişebilir. Nihai fiyat ve hak sahipliği için Gelir İdaresi ile yetkili satıcı açıklamaları esas alınmalıdır.',
    faqs: [
      { question: 'ÖTV muafiyetli fiyat neden liste fiyatından farklıdır?', answer: 'ÖTV kaldırıldığında KDV matrahı da değişebildiği için toplam indirim yalnızca liste fiyatından tek bir oran düşmekle aynı olmayabilir.' },
      { question: 'Hesaplanan tutar kesin satış fiyatı mıdır?', answer: 'Hayır. Donanım, tescil giderleri, kampanya ve güncel mevzuat nihai bedeli değiştirebilir.' },
    ],
  },
  'deger-kaybi': {
    label: 'Değer Kaybı',
    h1: 'Kaza Sonrası Araç Değer Kaybı Hesaplama',
    category: 'Değer ve yatırım',
    steps: ['Aracın piyasa değeri, yaşı ve kilometresini girin.', 'Hasar gören ve değişen parçaları belirtin.', 'Tahmini değer kaybı aralığını değerlendirin.'],
    result: 'Araç yaşı, kilometre, hasarın niteliği ve piyasa değeri birlikte değerlendirilerek tahmini kayıp tutarı hesaplanır.',
    caution: 'Bu araç ön değerlendirme sunar. Sigorta başvurusu veya hukuki süreçte eksper raporu ve dosyaya özgü belgeler belirleyicidir.',
    faqs: [
      { question: 'Her kaza değer kaybı oluşturur mu?', answer: 'Hasarın niteliği, daha önce aynı bölgede işlem bulunması, araç yaşı ve kilometre gibi unsurlar hak ve tutar üzerinde etkili olabilir.' },
      { question: 'Değer kaybı sonucu kesin midir?', answer: 'Hayır. Kesin tutar, somut dosya ve uzman incelemesine göre değişebilir.' },
    ],
  },
  'tasit-kredisi': {
    label: 'Taşıt Kredisi',
    h1: 'Taşıt Kredisi Taksit ve Toplam Geri Ödeme Hesaplama',
    category: 'Satın alma ve finansman',
    steps: ['Araç fiyatını, peşinatı ve kredi tutarını girin.', 'Aylık faiz oranı ile vadeyi seçin.', 'Aylık taksit ve toplam geri ödemeyi karşılaştırın.'],
    result: 'Aylık taksit, toplam faiz yükü ve geri ödeme tutarı tek hesapta gösterilir.',
    caution: 'Banka tahsis ücreti, sigorta, kasko ve müşteriye özel faiz oranı nihai maliyeti değiştirebilir. Teklif öncesi banka ödeme planını kontrol edin.',
    faqs: [
      { question: 'Taşıt kredisi taksiti nasıl hesaplanır?', answer: 'Kredi tutarı, aylık faiz ve vade kullanılarak eşit taksitli kredi formülüyle ödeme planına dönüştürülür.' },
      { question: 'Araç fiyatının tamamına kredi çıkar mı?', answer: 'Kredi oranı; araç türü, yaşı, değeri ve yürürlükteki bankacılık sınırlarına göre değişir.' },
    ],
  },
  'arac-bakim': {
    label: 'Bakım Maliyeti',
    h1: 'Araç Periyodik Bakım Maliyeti Hesaplama',
    category: 'Kullanım maliyeti',
    steps: ['Araç tipi, yaş ve yıllık kilometre bilgisini girin.', 'Bakımda değişecek parça ve sıvıları seçin.', 'Tek bakım ve yıllık tahmini bütçeyi inceleyin.'],
    result: 'Yağ, filtre, sıvı, işçilik ve seçilen ek kalemler birleştirilerek tahmini bakım bütçesi oluşturulur.',
    caution: 'Parça markası, motor seçeneği, şehir ve servis türü fiyatı önemli ölçüde değiştirebilir. Kesin ücret için servis teklifi alın.',
    faqs: [
      { question: 'Periyodik bakım ne sıklıkla yapılır?', answer: 'Üreticinin kilometre veya süre sınırından hangisi önce dolarsa o bakım aralığı esas alınır.' },
      { question: 'Bakım maliyetine neler dahildir?', answer: 'Seçime göre motor yağı, filtreler, sıvılar, buji ve işçilik gibi temel kalemler dahil edilir.' },
    ],
  },
  'lastik-ebat': {
    label: 'Lastik Ebat',
    h1: 'Lastik Ebat, Çap ve Hız Sapması Hesaplama',
    category: 'Teknik hesaplamalar',
    steps: ['Mevcut lastiğin taban, yanak ve jant ölçüsünü girin.', 'Yeni lastik ebatlarını aynı şekilde belirtin.', 'Çap farkı ile hız göstergesi sapmasını kontrol edin.'],
    result: 'İki lastiğin toplam çapı, çevresi, yerden yükseklik farkı ve tahmini hız sapması karşılaştırılır.',
    caution: 'Matematiksel uyum tek başına yeterli değildir. Jant genişliği, yük ve hız endeksi ile üretici onaylı ölçüler mutlaka kontrol edilmelidir.',
    faqs: [
      { question: 'Lastik çap farkı kaç olmalı?', answer: 'Genellikle küçük farklar tercih edilir; ancak güvenli ve yasal seçim için araç üreticisinin onayladığı ebatlar esas alınmalıdır.' },
      { question: 'Ebat değişince hız göstergesi etkilenir mi?', answer: 'Evet. Lastiğin yuvarlanma çevresi değiştiğinde gerçek hız ile göstergedeki hız arasında fark oluşabilir.' },
    ],
  },
  'kredi-karti-hesaplama': {
    label: 'Kredi Kartıyla Araç',
    h1: 'Kredi Kartıyla Araç Alma Komisyon ve Taksit Hesaplama',
    category: 'Satın alma ve finansman',
    steps: ['Kartla ödenecek araç tutarını girin.', 'Komisyon oranını ve taksit sayısını seçin.', 'Aylık ödeme ile toplam kart maliyetini inceleyin.'],
    result: 'Komisyon tutarı, komisyon dahil toplam ödeme ve taksit başına düşen yaklaşık bedel ayrı gösterilir.',
    caution: 'Banka, POS sağlayıcısı ve satıcı uygulamaları farklı olabilir. İşlemden önce toplam tahsilatı ve kart limitini yazılı olarak doğrulayın.',
    faqs: [
      { question: 'Kredi kartı komisyonu nasıl hesaplanır?', answer: 'İşlem tutarı ile uygulanan komisyon oranı çarpılır ve bulunan bedel ana tutara eklenir.' },
      { question: 'Her araç satıcısı taksit yapar mı?', answer: 'Hayır. Taksit, komisyon ve kabul edilen kartlar iş yeri ile bankanın koşullarına bağlıdır.' },
    ],
  },
  'butce-planlama': {
    label: 'Araç Bütçe Planlama',
    h1: 'Araç Alım Toplam Bütçe ve Ek Gider Hesaplama',
    category: 'Satın alma ve finansman',
    steps: ['Araç bedeli ile peşinat/kredi dağılımını girin.', 'Noter, sigorta, kasko ve ilk bakım giderlerini ekleyin.', 'İlk gün ve aylık toplam bütçe ihtiyacını inceleyin.'],
    result: 'Satın alma bedeli, finansman maliyeti ve başlangıç giderleri bir araya getirilerek gerçekçi toplam bütçe oluşturulur.',
    caution: 'Sigorta, kasko, kredi ve bakım teklifleri kullanıcıya göre değişir. Beklenmeyen giderler için ayrıca güvenlik payı bırakın.',
    faqs: [
      { question: 'Araç fiyatı dışında hangi giderler vardır?', answer: 'Noter, tescil, trafik sigortası, kasko, ekspertiz, ilk bakım ve finansman maliyetleri bütçeye eklenebilir.' },
      { question: 'Peşinat arttıkça toplam maliyet düşer mi?', answer: 'Kredi tutarı azaldığı için çoğu senaryoda toplam finansman maliyeti düşer; nakit ihtiyacı ise artar.' },
    ],
  },
  'dijital-senet-hesaplama': {
    label: 'Dijital Senet',
    h1: 'Dijital Senetle Araç Alma Reel Maliyet Hesaplama',
    category: 'Satın alma ve finansman',
    steps: ['Peşinat, finanse edilen tutar ve vade bilgisini girin.', 'Aylık taksit ile dosya/organizasyon ücretini ekleyin.', 'Toplam geri ödeme ve efektif maliyeti inceleyin.'],
    result: 'Peşin fiyat ile vadeli toplam ödeme arasındaki fark ve masraflar dahil yaklaşık finansman maliyeti gösterilir.',
    caution: 'Sözleşmedeki gecikme, erken kapama, teslim ve ek ücret maddelerini ayrıca okuyun. Hesap sonucu hukuki veya finansal teklif değildir.',
    faqs: [
      { question: 'Reel maliyet neden ilan edilen orandan farklı olabilir?', answer: 'Dosya, organizasyon ve benzeri zorunlu ücretler toplam geri ödemeyi artırarak efektif maliyeti yükseltebilir.' },
      { question: 'Sadece aylık taksite bakmak yeterli mi?', answer: 'Hayır. Peşinat, tüm ücretler, toplam geri ödeme ve teslim koşulları birlikte değerlendirilmelidir.' },
    ],
  },
  'mtv-hesaplama': {
    label: 'MTV Hesaplama',
    h1: '2026 Motorlu Taşıtlar Vergisi (MTV) Hesaplama',
    category: 'Kullanım maliyeti',
    steps: ['Aracın türünü ve ilk tescil yılını seçin.', 'Motor hacmi ile gerekli taşıt değeri bilgisini girin.', 'Yıllık MTV ve dönem taksitlerini inceleyin.'],
    result: 'Seçilen araç özelliklerine karşılık gelen yıllık vergi tutarı ve iki dönemlik yaklaşık ödeme dağılımı gösterilir.',
    caution: 'Resmî borç ve istisna bilgisi için Gelir İdaresi Başkanlığı kayıtları esas alınmalıdır. Araç tescil tarihi ve değer bilgisi sonucu değiştirebilir.',
    faqs: [
      { question: 'MTV hangi bilgilere göre hesaplanır?', answer: 'Araç türüne göre motor hacmi, yaş, taşıt değeri, motor gücü veya azami ağırlık gibi ölçütler kullanılabilir.' },
      { question: 'MTV yılda kaç kez ödenir?', answer: 'Motorlu Taşıtlar Vergisi genel olarak ocak ve temmuz dönemlerinde iki taksit halinde ödenir.' },
    ],
  },
  'kasko-deger-sorgulama': {
    label: 'Kasko Değer Sorgulama',
    h1: '2026 Araç Kasko Değer Listesi Sorgulama',
    category: 'Değer ve yatırım',
    steps: ['Araç yılını, markasını ve modelini seçin.', 'Doğru motor ve donanım kaydını bulun.', 'Referans kasko değerini görüntüleyin.'],
    result: 'Seçilen araç kaydı için sigorta işlemlerinde kullanılan referans kasko bedeli gösterilir.',
    caution: 'Kasko değeri ilan veya satış fiyatı değildir. Poliçe bedeli; kullanım, hasar geçmişi, aksesuar ve sigorta şirketi değerlendirmesine göre değişebilir.',
    faqs: [
      { question: 'Kasko değeri piyasa değeriyle aynı mıdır?', answer: 'Hayır. Kasko değer listesi sigorta işlemleri için referanstır; gerçek piyasa fiyatı arz, talep ve araç durumuna göre değişir.' },
      { question: 'Doğru araç kaydını nasıl seçerim?', answer: 'Model yılı, motor hacmi, yakıt, şanzıman ve donanım bilgilerinin ruhsat ve araçla eşleştiğini kontrol edin.' },
    ],
  },
  'elektrikli-arac-sarj-maliyeti': {
    label: 'Elektrikli Araç Şarj',
    h1: 'Elektrikli Araç Şarj Maliyeti Hesaplama',
    category: 'Kullanım maliyeti',
    steps: ['Batarya kapasitesi ve ortalama tüketimi girin.', 'Ev AC veya halka açık DC şarj tarifesini seçin.', 'Dolum, 100 km ve aylık kullanım maliyetini inceleyin.'],
    result: 'Şarj kaybı dahil tahmini dolum maliyeti, 100 kilometre gideri ve aylık elektrik tüketimi hesaplanır.',
    caution: 'Şarj kaybı, sıcaklık, sürüş tarzı ve istasyon tarifesi sonucu değiştirir. Tarife bilgilerini hizmet sağlayıcısından doğrulayın.',
    faqs: [
      { question: 'Elektrikli araç 100 km’de kaç TL yakar?', answer: 'Tüketim değeri kWh/100 km ile elektrik birim fiyatı çarpılarak bulunur; şarj kayıpları için ek pay gerekebilir.' },
      { question: 'Evde şarj ile hızlı şarj aynı maliyette mi?', answer: 'Genellikle değildir. Ev ve halka açık istasyon tarifeleri ile şarj kayıpları farklı olabilir.' },
    ],
  },
  'arac-ithalat-vergisi': {
    label: 'Araç İthalat Vergisi',
    h1: 'Yurt Dışından Araç Getirme Vergi ve Maliyet Hesaplama',
    category: 'Değer ve yatırım',
    steps: ['Araç bedelini, ülkeyi ve taşıma giderini girin.', 'Motor/yakıt türü ile ilgili vergi seçeneklerini belirtin.', 'Gümrük, ÖTV, KDV ve toplam maliyeti inceleyin.'],
    result: 'Araç ve taşıma bedeline uygulanabilecek temel vergi kalemleri ayrıştırılarak tahmini ithalat maliyeti gösterilir.',
    caution: 'İthalat mevzuatı; menşe, yaş, teknik uygunluk ve araç türüne göre değişir. İşlem öncesinde gümrük müşaviri ve resmî kurum bilgisi alınmalıdır.',
    faqs: [
      { question: 'Yurt dışındaki satış fiyatı toplam maliyet midir?', answer: 'Hayır. Nakliye, sigorta, gümrük, ÖTV, KDV, uygunluk ve tescil giderleri ayrıca oluşabilir.' },
      { question: 'Her ikinci el araç ithal edilebilir mi?', answer: 'Hayır. Yaş, teknik uygunluk ve ithalat rejimi gibi sınırlamalar bulunabilir.' },
    ],
  },
  'arac-vs-taksi': {
    label: 'Araç mı Taksi mi?',
    h1: 'Araç Sahibi Olmak mı Taksi Kullanmak mı? Maliyet Kıyaslama',
    category: 'Kullanım maliyeti',
    steps: ['Yıllık kilometre ve kullanım sıklığını girin.', 'Araç satın alma ile sabit/değişken giderleri ekleyin.', 'Taksi veya kiralama maliyetiyle yıllık toplamı karşılaştırın.'],
    result: 'Araç sahipliğinin finansman, değer kaybı ve kullanım giderleri alternatif ulaşım maliyetiyle aynı dönemde karşılaştırılır.',
    caution: 'Konfor, erişilebilirlik, zaman ve kullanım esnekliği parasal sonucun dışında kalan önemli karar ölçütleridir.',
    faqs: [
      { question: 'Araç sahipliği maliyetine neler dahildir?', answer: 'Değer kaybı, finansman, sigorta, vergi, bakım, lastik, park ve yakıt gibi kalemler birlikte düşünülmelidir.' },
      { question: 'Düşük kilometrede taksi daha mı avantajlıdır?', answer: 'Sabit araç giderleri nedeniyle düşük kullanımda alternatif ulaşım daha ekonomik olabilir; sonuç şehir ve kullanım düzenine göre değişir.' },
    ],
  },
  'km-basina-maliyet': {
    label: 'Kilometre Başı Maliyet',
    h1: 'Kilometre Başı Araç Maliyeti Hesaplama',
    category: 'Kullanım maliyeti',
    steps: ['Aylık kilometre, yakıt fiyatı ve ortalama tüketimi girin.', 'Sigorta, MTV, bakım, lastik ve diğer yıllık giderleri ekleyin.', 'Kilometre başı, aylık ve yıllık gerçek maliyeti birlikte inceleyin.'],
    result: 'Yakıt gideri ile yıllık sabit giderler aynı kullanım mesafesine dağıtılır; TL/km, aylık ortalama ve yıllık toplam ayrı gösterilir.',
    caution: 'Değer kaybı ve kredi faizi bu araçta varsayılan olarak yer almaz. Bunları görmek için toplam sahip olma maliyeti aracını kullanın.',
    formula: 'Kilometre başı maliyet = (yıllık yakıt gideri + yıllık sabit giderler) / yıllık kilometre.',
    example: 'Ayda 1.250 km kullanılan bir araç yılda 15.000 km yapar. Yakıt, sigorta, vergi ve bakım toplamı 120.000 TL ise maliyet 8 TL/km olur.',
    faqs: [
      { question: 'Araç kilometre maliyetine hangi giderler eklenmeli?', answer: 'Yakıtın yanında trafik sigortası, kasko, MTV, bakım, lastik, otopark ve düzenli diğer kullanım giderleri eklenmelidir.' },
      { question: 'Sadece yakıt maliyetine bakmak neden yanıltıcıdır?', answer: 'Araç az kullanılsa bile sigorta, vergi ve zaman bağlı bakım gibi sabit giderler devam eder; gerçek kilometre maliyeti bu kalemlerle yükselir.' },
      { question: 'Kilometre arttıkça birim maliyet düşer mi?', answer: 'Sabit giderler daha fazla kilometreye yayıldığı için genellikle düşer; ancak yakıt ve aşınma giderleri kullanım arttıkça yükselir.' },
    ],
  },
  'yillik-sahip-olma-maliyeti': {
    label: 'Sahip Olma Maliyeti',
    h1: 'Yıllık ve Toplam Araç Sahip Olma Maliyeti Hesaplama',
    category: 'Kullanım maliyeti',
    steps: ['Araç değeri, kullanım süresi ve yıllık değer kaybı oranını girin.', 'Kilometre, tüketim ve yakıt fiyatını belirtin.', 'Vergi, sigorta, bakım ve diğer yıllık giderlerle toplam maliyeti görün.'],
    result: 'Tahmini satış değeri, bileşik değer kaybı, dönem yakıt gideri ve sabit giderler birleştirilerek toplam sahip olma maliyeti hesaplanır.',
    caution: 'İkinci el piyasa değeri doğrusal değişmez. Marka, model, kilometre, hasar, kur ve piyasa koşulları tahmini kalan değeri değiştirebilir.',
    formula: 'Toplam sahip olma maliyeti = değer kaybı + kullanım dönemi boyunca yakıt, vergi, sigorta, bakım ve diğer giderler.',
    example: '1.250.000 TL değerindeki araç beş yıl sonunda tahminen 660.000 TL kalırsa, yaklaşık 590.000 TL değer kaybı kullanım giderlerine eklenir.',
    faqs: [
      { question: 'Toplam sahip olma maliyeti nedir?', answer: 'Aracın alış fiyatı ile satış değeri arasındaki kayba yakıt, finansman, vergi, sigorta, bakım ve kullanım giderlerinin eklenmesidir.' },
      { question: 'Araç fiyatının tamamı gider sayılır mı?', answer: 'Araç dönem sonunda satılabilecek bir varlık olduğu için hesapta alış fiyatının tamamı değil, tahmini değer kaybı maliyet kabul edilir.' },
      { question: 'Değer kaybı neden bileşik hesaplanır?', answer: 'Her yılın kaybı bir önceki yılın kalan değeri üzerinden gerçekleştiği için bileşik yaklaşım düz bir toplamdan daha gerçekçi bir tahmin sunar.' },
    ],
  },
  'yakit-turu-karsilastirma': {
    label: 'Yakıt Türü Kıyaslama',
    h1: 'Benzin, Dizel, LPG ve Elektrik Maliyet Karşılaştırma',
    category: 'Kullanım maliyeti',
    steps: ['Yıllık kullanım kilometrenizi girin.', 'Her enerji türü için güncel birim fiyat ve tüketim değerini yazın.', 'Kilometre başı ve yıllık maliyet sıralamasını karşılaştırın.'],
    result: 'Dört enerji türü en düşük yıllık maliyetten en yükseğe sıralanır; her seçeneğin TL/km değeri ve en ekonomik seçeneğe göre farkı gösterilir.',
    caution: 'Araç fiyatı, bakım, batarya, vergi ve sigorta farkları dahil değildir. Satın alma kararı için yalnızca enerji maliyetini değil toplam sahip olma maliyetini değerlendirin.',
    formula: 'Yıllık enerji maliyeti = yıllık kilometre × (100 km tüketimi × birim fiyat / 100).',
    example: '15.000 km kullanımda 7 lt/100 km tüketen bir araç, litre fiyatı 48 TL ise yılda yaklaşık 50.400 TL yakıt harcar.',
    faqs: [
      { question: 'Benzin mi dizel mi daha ekonomik?', answer: 'Sonuç yıllık kilometre, gerçek tüketim ve güncel fiyatlara bağlıdır. Düşük tüketim tek başına daha düşük toplam araç maliyeti anlamına gelmez.' },
      { question: 'Elektrikli araç tüketimi nasıl karşılaştırılır?', answer: 'Elektrikli araçta kWh/100 km tüketim ile elektrik birim fiyatı çarpılır; sonuç diğer yakıtlarla aynı TL/km ölçeğine çevrilir.' },
      { question: 'LPG tüketimi neden benzinden yüksek olabilir?', answer: 'LPG’nin enerji yoğunluğu farklı olduğu için litre bazında tüketim genellikle artabilir; düşük litre fiyatı toplam maliyeti dengeleyebilir.' },
    ],
  },
  'motor-gucu-donusturme': {
    label: 'kW - Beygir Çevirme',
    h1: 'kW, HP ve PS Motor Gücü Dönüştürme',
    category: 'Teknik hesaplamalar',
    steps: ['Ruhsatta veya teknik tabloda gördüğünüz güç değerini girin.', 'Kaynak birimi kW, PS veya HP olarak seçin.', 'Diğer iki birimdeki kesin karşılığı anında görüntüleyin.'],
    result: 'Girilen motor gücü kilovat, metrik beygir (PS) ve mekanik beygir (HP) olarak aynı anda gösterilir.',
    caution: 'Türkiye’de günlük dilde beygir denildiğinde çoğunlukla PS kastedilir. HP ile PS birbirine yakın olsa da aynı birim değildir.',
    formula: '1 kW = 1,35962 PS = 1,34102 HP. Dönüşüm uluslararası sabit katsayılarla yapılır.',
    example: '100 kW motor gücü yaklaşık 135,96 PS ve 134,10 HP değerine karşılık gelir.',
    faqs: [
      { question: '100 kW kaç beygirdir?', answer: '100 kW yaklaşık 135,96 PS metrik beygir veya 134,10 HP mekanik beygirdir.' },
      { question: 'HP ve PS aynı mı?', answer: 'Hayır. PS metrik beygir, HP mekanik beygirdir. Aralarındaki fark küçük olsa da teknik karşılıkları farklıdır.' },
      { question: 'Ruhsatta motor gücü hangi birimde yazar?', answer: 'Türkiye’de ruhsat ve resmî teknik kayıtlarda motor gücü çoğunlukla kW olarak belirtilir.' },
    ],
  },
  'lastik-basinci-donusturme': {
    label: 'PSI - Bar Çevirme',
    h1: 'Lastik Basıncı PSI, Bar ve kPa Dönüştürme',
    category: 'Teknik hesaplamalar',
    steps: ['Pompa, araç etiketi veya kılavuzdaki basınç değerini girin.', 'Kaynak birimi PSI, bar veya kPa olarak seçin.', 'Diğer basınç birimlerindeki karşılığı görüntüleyin.'],
    result: 'Tek bir lastik basıncı değeri bar, PSI ve kilopaskal biçiminde eş zamanlı gösterilir.',
    caution: 'Bu araç yalnızca birim dönüştürür. Aracınız için doğru hedef basınç, sürücü kapısı içindeki etiket veya kullanım kılavuzunda yer alır.',
    formula: '1 bar = 14,5038 PSI = 100 kPa.',
    example: '2,3 bar lastik basıncı yaklaşık 33,36 PSI ve tam olarak 230 kPa değerine karşılık gelir.',
    faqs: [
      { question: '2,3 bar kaç PSI eder?', answer: '2,3 bar yaklaşık 33,36 PSI değerine karşılık gelir.' },
      { question: 'Lastik yanağındaki PSI değeri önerilen basınç mı?', answer: 'Genellikle hayır. Yanaktaki değer lastiğin azami sınırı olabilir; araç üreticisinin kapı içi etiketindeki soğuk lastik basıncı esas alınmalıdır.' },
      { question: 'Lastik basıncı ne zaman ölçülmeli?', answer: 'Daha doğru karşılaştırma için lastikler soğukken, uzun sürüşten önce ölçüm yapılması tercih edilir.' },
    ],
  },

};

export const OTOHESAP_GROUPS = [
  { title: 'Kullanım maliyetleri', description: 'Yakıt, vergi, bakım ve gerçek araç kullanım bütçenizi planlayın.', modules: ['yakit-hesaplama', 'km-basina-maliyet', 'yillik-sahip-olma-maliyeti', 'yakit-turu-karsilastirma', 'elektrikli-arac-sarj-maliyeti', 'arac-bakim', 'mtv-hesaplama', 'arac-vs-taksi'] },
  { title: 'Satın alma ve finansman', description: 'Kredi, peşinat, taksit ve araç alımındaki toplam maliyeti görün.', modules: ['tasit-kredisi', 'butce-planlama', 'kredi-karti-hesaplama', 'dijital-senet-hesaplama', 'otv-muafiyeti'] },
  { title: 'Araç değeri ve yatırım', description: 'Piyasa değeri, hasar, al-sat ve alternatif yatırım senaryolarını kıyaslayın.', modules: ['kasko-deger-sorgulama', 'deger-kaybi', 'al-sat-analizi', 'yatirim-kiyaslama', 'arac-ithalat-vergisi'] },
  { title: 'Teknik hesaplamalar', description: 'Araç ölçülerini ve teknik birimleri güvenilir katsayılarla dönüştürün.', modules: ['lastik-ebat', 'motor-gucu-donusturme', 'lastik-basinci-donusturme'] },
] as const;
