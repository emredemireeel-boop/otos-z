const fs = require('fs');

const path = './public/data/library_guides.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const guide = data.guides.find(g => g.id === "guide_nasil_galerici_olunur");

if (guide) {
  // 1. UPDATE INTRO
  const introSection = guide.sections.find(s => s.type === "intro");
  if (introSection) {
    introSection.content = "Oto galericilik, dışarıdan bakıldığında lüks arabalara binip, takım elbiseyle çay içerek, oturduğu yerden sadece telefon görüşmeleriyle on binlerce lira kazanılan kolay, havalı ve zahmetsiz bir meslek gibi görünebilir. Özellikle sosyal medyada pompalanan 'genç yaşta premium araçlarla gezen galerici' imajı, dışarıdaki birçok insanı bu sektöre heveslendirmektedir.\n\nOysa madalyonun diğer yüzü, dışarıdan görünen o şatafatlı vitrinden çok ama çok farklıdır! İyi bir galerici olmak; sadece V8 motorun kükreyişini sevmekten veya direksiyon başına geçtiğinde o derinin kokusunu hissetmekten ibaret değildir.\n\nBaşarı için derin ve acımasız bir ticaret zekası, kapıdan giren müşterinin aklından geçenleri saniyeler içinde okuyabilen bir insan psikolojisi uzmanlığı, sürekli değişen vergi ve noter mevzuatlarına bir avukat kadar hakimiyet ve en önemlisi 'büyük kriz anlarında buz gibi soğukkanlı kalabilme' yeteneği gerekir.\n\nBir aracı mekanik olarak çok iyi tanıyor olabilirsiniz. Vites geçişlerindeki milisaniyelik bir gecikmeyi, motorun ısınma evresindeki ufak bir titremeyi veya kaportadaki mikronluk bir boya hatasını sadece dokunarak bile hissedebilirsiniz. Ancak tüm bu teknik bilgi, o aracı 'doğru fiyata' alamadığınız veya o anki piyasa koşullarını doğru analiz edemediğiniz sürece hiçbir işe yaramaz.\n\nDeğerinden fazla para ödeyerek aldığınız bir araç, dükkanınızın vitrininde yatan ölü bir yatırıma dönüşür ve her geçen gün, ödediğiniz kira ve faturalarla birlikte sermayenizi adeta bir sünger gibi emer. Türkiye piyasasında batan, kepenk kapatmak zorunda kalan yüzlerce galerici, inanın bana arabaları bilmedikleri veya sevmedikleri için batmamıştır. Ticareti, nakit akışını (cash flow) ve yalanın, dolanın kol gezdiği bir kurtlar sofrasındaki insan ilişkilerini yönetemedikleri için sistemin dışına itilmişlerdir.\n\nBu meslek, yeri geldiğinde kapı fitilinin altına gizlenmiş milimetrik bir kaynak izini bulmayı, yeri geldiğinde elindeki kısıtlı sermayeyi tek bir lüks araca bağlamak yerine akıllıca dağıtmayı ve yeri geldiğinde de zarar etmeyi kabullenip o aracı 'zararına satıp nakde geçmeyi' bilmeyi gerektirir. Müşterinin size güvenmesini sağlamak ise tek kullanımlık bir illüzyon değil, tamamen şeffaflık ve dürüstlükle yıllara yayılan bir karakter inşasıdır.\n\nİşte tam da bu yüzden hazırladığımız bu mega rehberde, kulaktan dolma kahvehane efsanelerini bir kenara bırakıyoruz. Hayallerinizdeki oto galeriyi sıfırdan kurup, sadece araba heveslisi olan sıradan birinden, piyasanın yönünü tayin eden saygın bir ticaret kurduna dönüşmeniz için gereken 10 hayati adımı en ince ayrıntılarıyla masaya yatırıyoruz. Hazırsanız, kahvenizi tazeleyin ve kemerlerinizi bağlayın!";
    
    // Adding dipnot (warning/tip)
    introSection.warning = {
      title: "Piyasa Kulağı",
      text: "Asla 'Ben bu arabayı ucuza aldım, her türlü kâr ederim' yanılgısına düşmeyin. Bazen ucuza alınan arabanın arkasında, o arabanın piyasasının tamamen durmuş olması veya kronik bir motor arızasının gizlenmiş olması gerçeği yatar."
    };
    introSection.tip = {
      title: "Altın Kural",
      text: "Galericilik, araba alıp satma işinden ziyade 'insan yönetme' ve 'kriz çözme' sanatıdır. Sermayenizden önce psikolojinizi ve sabrınızı güçlendirmelisiniz."
    };
  }

  // 2. UPDATE STEP 2
  const step2Section = guide.sections.find(s => s.title && s.title.includes("Adım 2: Yasal Zorunluluklar"));
  if (step2Section) {
    step2Section.content = "Eskiden bir dükkan kiralayıp camına 'Oto Galeri' yazmak ve birkaç araba çekmek bu işe başlamak için yeterliydi. Ancak günümüzde Ticaret Bakanlığı'nın getirdiği sıkı regülasyonlar sayesinde galericilik ciddi bir bürokratik zemine oturtuldu. Yasal zorunlulukları yerine getirmeden satacağınız her araç, kapınıza dayanacak devasa maliye cezaları ve noter engelleri anlamına gelir. Bürokraside boğulmamak için sırayla izlemeniz gereken yasal adımlar tam olarak şunlardır:";
    
    step2Section.subsections = [
      {
        "subtitle": "1. Mesleki Yeterlilik Belgesi (Seviye 5) - Motorlu Kara Taşıtları Alım Satım",
        "text": "Bu belge olmadan galerici olma hayali kuramazsınız. MYK (Mesleki Yeterlilik Kurumu) tarafından yetkilendirilmiş kuruluşların açtığı teorik ve pratik sınavlara girerek 'Seviye 5' belgesini almanız şarttır. Sınavlarda araç motor tiplerinden tutun, müşteri ilişkilerine, yasal haklardan ekspertiz detaylarına kadar geniş bir müfredattan sorumlu olursunuz. Bu belge sadece sizin için değil, yanınızda çalıştıracağınız ve aktif satış yapacak her personel için de (Seviye 4) zorunludur. Belgeyi aldıktan sonra işiniz bitmiyor; Ticaret İl Müdürlüğüne başvurarak asıl yetki belgenizi (İkinci El Motorlu Kara Taşıtı Ticareti Yetki Belgesi) almanız gerekiyor.",
        "points": [
          "Sınavlar genellikle çoktan seçmeli yazılı test ve araç başında uygulamalı mülakat şeklinde yapılır.",
          "Yetki belgeniz olmadan noterde bir yılda en fazla 3 araç satabilirsiniz; 4. araçta sistem otomatik olarak satışı engeller.",
          "Belgeniz onaylanana kadar dükkan kiralamak risklidir, önce belge işlemlerini tamamlayın."
        ]
      },
      {
        "subtitle": "2. İşyeri Açma ve Çalışma Ruhsatı (Fiziksel Kriterler)",
        "text": "Ticaret Bakanlığı'nın yönetmeliğine göre artık bina altlarında, apartman girişlerinde veya dar sokaklarda galeri açılamamaktadır (Mevcut ruhsatlılar hariç). Yeni bir galeri açacaksanız, iş yerinizin AVM formundaki oto ticaret merkezlerinde veya bağımsız, iskanlı ticari yapılarda olması gerekir. Dükkanınızın tavan yüksekliği, giriş kapısının araç girmeye uygun genişliği, acil çıkış kapıları ve en az 4 aracın rahatça sığabileceği (genellikle minimum 80-100 metrekare) fiziksel bir kapalı veya açık teşhir alanına sahip olması şarttır. Ruhsatı belediyeden almadan önce mutlaka itfaiye raporu (yangın tüpleri, çıkış levhaları) almanız gerekecektir."
      },
      {
        "subtitle": "3. Şirket Kurulumu, Maliye ve KDV Dengesi",
        "text": "Oto galericilik, vergi takibinin en sıkı yapıldığı sektörlerin başında gelir. Bir Şahıs Şirketi, Limited (Ltd.) veya Anonim (A.Ş.) şirketi kurmanız şarttır. Araç alım-satımında KDV oranları çok kritik bir konudur. Eğer aracı vergi mükellefi olmayan bir vatandaştan alıyorsanız Gider Pusulası düzenlersiniz, aracı satarken sadece elde ettiğiniz 'Kâr' üzerinden KDV hesaplayıp fatura kesersiniz (Özel Matrah uygulaması). Ancak aracı faturasıyla bir şirketten alıyorsanız, aracı satarken aracın 'tamamı' üzerinden fatura kesmeniz gerekir. Bu dengeyi yanlış kurarsanız, yıl sonunda kazandığınız tüm parayı vergi cezası olarak devlete geri ödemek zorunda kalırsınız."
      }
    ];

    step2Section.warning = {
      title: "Noter Sistem Engeli",
      text: "Ticaret Bakanlığı'nın İkinci El Motorlu Kara Taşıtı Ticareti Yetki Belgesi olmayan işletmeler, noter sistemi (ARTES) üzerinden vekaletle bile olsa ticari satış yapamazlar. Sistemi kandırmaya çalışıp eş/dost üzerine yapılan satışlar Maliye tarafından tespit edildiğinde geriye dönük usulsüzlük cezaları kesilmektedir."
    };
  }

  fs.writeFileSync(path, JSON.stringify(data, null, 2));
  console.log('Successfully updated Intro and Step 2!');
} else {
  console.log('Guide not found!');
}
