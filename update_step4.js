const fs = require('fs');

const path = './public/data/library_guides.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const guide = data.guides.find(g => g.id === "guide_nasil_galerici_olunur");

if (guide) {
  const step4Section = guide.sections.find(s => s.title && s.title.includes("Adım 4: Lokasyon Seçimi"));
  
  if (step4Section) {
    step4Section.content = "Bir oto galeri açarken yapılan en büyük stratejik hatalardan biri, 'kirası çok ucuz' diye şehrin ücra bir köşesinde, ayak altı olmayan veya otomobil ekosisteminden tamamen uzak rastgele bir dükkan tutmaktır.\n\nMüşteri profiliniz, sattığınız aracın segmenti ve piyasadaki güvenilirlik imajınız doğrudan showroom'unuzun bulunduğu semt ve fiziki koşullarıyla şekillenir. Dükkanınızın lokasyonu ve dizaynı, aslında sizin pazarlama bütçenizin ve vizyonunuzun en büyük reklam panosudur.";
    
    step4Section.subsections = [
      {
        "subtitle": "1. Oto Ticaret Merkezleri vs. Bağımsız Cadde Dükkanları",
        "text": "Günümüzde büyük şehirlerdeki Oto Ticaret Merkezleri (Otonomi, Automall, Otoport vb.), yüksek kira veya aidat bedellerine sahip olsalar da 'hazır bir müşteri trafiğine' sahiptirler. Hafta sonu araba bakmak, piyasayı yoklamak isteyen binlerce potansiyel alıcı doğrudan bu merkezlere akın eder; yani 'ayak müşterisi' dediğimiz sıcak potansiyel buralarda muazzam yüksektir.\n\nAyrıca bu merkezlerin en büyük avantajı; noterin, güvenilir ekspertiz firmalarının, banka şubelerinin, trafik müşavirlerinin ve yıkamacıların aynı kampüs içinde, yan yana olmasıdır. Bu sayede aracı beğenen müşterinin heyecanı soğumadan, tüm resmi satış işlemini sadece 1 saat içinde aynı kampüsten çıkmadan pürüzsüzce bitirebilirsiniz.\n\nEğer tercihiniz bağımsız bir cadde dükkanı tutmaksa, seçtiğiniz dükkanın yürüme mesafesinde mutlaka saygın ve kurumsal bir ekspertiz firmasının, ve araçla en fazla 5 dakika mesafede bir noter şubesinin olmasına dikkat etmelisiniz. Şehrin dışında, sanayi sitelerinin karanlık arka sokaklarında konumlanmış ıssız bir dükkan, aileleriyle gelen müşterilerde ister istemez bir 'güven' problemi (Acaba dolandırılır mıyım?) yaratacaktır."
      },
      {
        "subtitle": "2. Showroom İçi Tasarım ve Psikolojik Aydınlatma Hileleri",
        "text": "Müşteri kapıdan içeri ilk adımını attığında hissettiği kalite algısı, masaya oturduğunda yapacağınız pazarlığın sınırlarını çizer. Loş, dağınık, her tarafa yedek lastik veya çıkma tampon fırlatılmış, izmarit kokan bir dükkanda yüksek bütçeli, prestijli bir araç satamazsınız.\n\nAydınlatma, ikinci el bir aracı satmanın ve albenisini artırmanın en büyük yasal hilesidir. Showroom tavanınızda, araçların kaput ve omuz (yan bel) çizgisine vuracak şekilde ayarlanmış güçlü beyaz veya gün ışığı LED spotlar olmalıdır. Bu spot ışıklar, aracın kaportasına yapılan en ufak bir temizlik cilasını bile devasa ve pürüzsüz bir parlamaya dönüştürerek, müşterinin araca aşık olmasını sağlar.\n\nUnutmayın, otomobil ticareti önce gözle, sonra cüzdanla yapılan duygusal bir eylemdir. Dükkanın zemininde epoksi veya şık seramik kaplamalar kullanılması, araçların yere yansıyan silüetiyle birlikte mekana premium bir galeri havası katacaktır."
      },
      {
        "subtitle": "3. Güven Veren Görüşme (Ağırlama) Alanı Kurulumu",
        "text": "Ciddi pazarlıklar ayakta yapılmaz! Müşterinin rahatça oturup, alım kararının verdiği heyecanı dindireceği, temiz, ferah ve kaliteli ikramların eksik olmadığı şık bir ağırlama köşesi, satış kapamanın kilit noktasıdır.\n\nGörüşme masanızın arkasındaki duvarda mutlaka şirketinize ait vergi levhası, İkinci El Motorlu Kara Taşıtı Ticareti Yetki Belgesi, oda kayıt sicil suretleri ve daha önce yaptığınız mutlu müşteri teslimat fotoğrafları şık çerçevelerle asılı olmalıdır. Bu belgeler müşterinin bilinçaltına 'Burası devletin kontrolünde, resmi ve kurumsal bir yer' mesajını kazır.\n\nMasanızın üstünde kalın ve düzenli bir sözleşme/kapora koçanı, marka baskılı kaliteli kalemler ve büyük bir hesap makinesi bulunmalıdır. Müşteri o masaya oturduğunda ve kahvesinden ilk yudumu aldığında, size ve firmanıza karşı sıfır şüphe duymalıdır."
      }
    ];

    step4Section.tip = {
      "title": "İlk İzlenim Asla Unutulmaz",
      "text": "Dükkanınızın vitrin camları her daim pırıl pırıl olmalı, içeride hafif ama premium hissettiren bir ortam kokusu (örneğin bambu veya sandal ağacı) bulunmalıdır. Kokular ve aydınlatma, satış psikolojisinde fiyatın kendisi kadar etkilidir."
    };

    fs.writeFileSync(path, JSON.stringify(data, null, 2));
    console.log('Successfully updated Step 4!');
  } else {
    console.log('Step 4 not found!');
  }
} else {
  console.log('Guide not found!');
}
