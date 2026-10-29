const fs = require('fs');

const path = './public/data/library_guides.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const guide = data.guides.find(g => g.id === "guide_nasil_galerici_olunur");

if (guide) {
  const step7Section = guide.sections.find(s => s.title && s.title.includes("Adım 7: Fiyatlandırma Stratejisi"));
  
  if (step7Section) {
    step7Section.content = "İkinci el araç alım-satımında yapılan en ölümcül hata, aracın fiyatını ilan sitelerindeki en yüksek fiyatlı emsallerine bakarak, tamamen hayalperest (tok satıcı) bir ruh haliyle belirlemektir. Unutmayın: Gerçek piyasa fiyatı, sitede aylarca asılı kalan rakam değil, 'aracın gerçekten noterde el değiştirdiği' rakamdır.\n\nSizin göreviniz o aracı vitrinde biblo gibi süslemek değil, nakit döngüsünü sağlamak ve kâr etmektir. İşte bu noktada profesyonel galericilerin kullandığı, hataya yer bırakmayan '3'lü Matematik Sistemi' devreye girer. Bu sistemi kullanmayı öğrenmek ticari hayatınızı kurtaracaktır.";
    
    step7Section.subsections = [
      {
        "subtitle": "1. Kör Alış Fiyatı (Acil Nakde Dönüş / Taban Fiyat)",
        "text": "Ticarette her şey her zaman yolunda gitmez. Kredi faizleri aniden fırlar veya sizin acil nakde sıkıştığınız bir kriz anı doğar. Kör Alış Fiyatı; bu aracın hiçbir binici (perakende) müşterisi çıkmazsa, aracı hemen o gün nakde döndürmek için bölgedeki diğer galericilere ('esnaf/ölücü' piyasasına) kaça satabileceğinizin hesaplanmasıdır.\n\nBu, aracın mutlak dip/taban fiyatıdır. O aracı ilk satın alırken ödediğiniz rakam, hiçbir koşulda bu Kör Alış Fiyatı'nın çok üzerine çıkmamalıdır. Kriz anında sizi iflastan kurtaracak olan şey; panikle değil, 'bu arabayı en kötü şu fiyata esnafa yıkar çıkarım' matematiğiyle hareket etmenizdir."
      },
      {
        "subtitle": "2. Pazar Fiyatı ve Emsal Temizliği (Gerçek Değer)",
        "text": "Aracın marka, model, paket, boya/değişen ve kilometre kombinasyonuna göre piyasadaki gerçek binicinin o araca ödemeye razı olduğu 'gerçekçi' tutardır. Pazar fiyatını belirlemek için ilan sitelerinde birebir kendi aracınızın emsallerini (aynı boya/kilometre aralığı) listelemeli ve fiyata göre sıralamalısınız.\n\nBu listelemede en baştaki (en ucuz) 3 'ağır hasarlı/sorunlu/sahte ilan' fiyatını görmezden gelin (silin). Aynı şekilde listenin en sonundaki (en pahalı) 5 'hayalperest/arabasına aşık' satıcının ilanını da silin. İşte o ortada kalan, birbirine çok yakın fiyatların olduğu 'homojen yığın', o aracın gerçek Pazar Fiyatıdır. Hedef net satış fiyatınızı o yığının tam içine, hatta rekabet için ortalamanın bir tık altına konumlandırmalısınız."
      },
      {
        "subtitle": "3. Vitrin (İlan) Fiyatı ve Psikolojik Pazarlık Marjı",
        "text": "Türk insanı pazarlık yapmadan araba almaz, bu reddedilemez sosyolojik bir gerçektir! Müşteri masaya oturduğunda 'ben de bir şeyler kopardım' hissiyatını (zafer hissini) tatmak zorundadır.\n\nPazar fiyatını (Gerçek Değer) belirledikten sonra, bunun üzerine %2 ila %4 oranında mantıklı bir 'pazarlık marjı' ekleyerek nihai İlan Fiyatınızı (Vitrin Fiyatı) oluşturursunuz. Örneğin, aracı cebinize net 950.000 TL kalacak şekilde (Pazar Fiyatı) satmak istiyorsanız, ilana 975.000 TL yazarsınız. Müşteri ofisinize geldiğinde kıran kırana yapılan pazarlık sonucu fiyattan tam 25.000 TL ikram yaptığınızda; müşteri devasa bir kâr ettiğini düşünüp büyük bir psikolojik tatminle elinizi sıkarken, siz de hedefe tam 12'den vurmuş olursunuz."
      },
      {
        "subtitle": "4. OtoSöz'ün Teknolojik Gücü: OtoHesap Al-Sat Analizi",
        "text": "Tüm bu karmaşık emsal analizlerini, komisyon oranlarını, noter devir ücretlerini, ekspertiz giderlerini ve yatırdığınız paranın enflasyon karşısındaki reel yatırım getirisini (ROI) kafadan manuel hesaplamak son derece tehlikeli ve hata yapmaya açıktır.\n\nTam da bu yüzden, sadece yeni başlayanlar değil, yılların profesyonel galericileri bile sitemizde yer alan muazzam **OtoHesap Al-Sat Kâr/Zarar Hesaplama** aracını şiddetle kullanmalıdır! [OtoHesap](/otohesap/al-sat) sayfasına girip; aracı alış fiyatınızı, potansiyel revizyon masraflarınızı ve satmayı düşündüğünüz Vitrin Fiyatını sisteme girin. OtoSöz yapay zekası size vergi kesintileri, dolaylı giderler ve kâr marjı yüzdelerini hesaplayarak cebinize kalacak 'net nakdi' saniyeler içinde çıkarsın. Bu dijital aracı kullanmadan hiçbir ticaret masasına oturmayın!"
      }
    ];

    step7Section.tip = {
      title: "Veri Odaklı Karar",
      text: "Duygularınızı kapıda bırakın ve sayılara güvenin. Aracın değerlemesini yaparken kendi OtoHesap kâr analiziniz her zaman referans noktanız olmalıdır. Zarar ettiğinizi gösteren hiçbir pazarlık masasında 'müşteriyi kaçırmayayım' diyerek oturmaya devam etmeyin."
    };

    fs.writeFileSync(path, JSON.stringify(data, null, 2));
    console.log('Successfully updated Step 7!');
  } else {
    console.log('Step 7 not found!');
  }
} else {
  console.log('Guide not found!');
}
