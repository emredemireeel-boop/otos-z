const fs = require('fs');

const path = './public/data/library_guides.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const guide = data.guides.find(g => g.id === "guide_nasil_galerici_olunur");

if (guide) {
  const step6Section = guide.sections.find(s => s.title && s.title.includes("Adım 6: Şahin Gözü Ekspertiz"));
  
  if (step6Section) {
    step6Section.content = "İkinci el araç piyasasında satıcıların meşhur 'Sadece ufak bir sürtmeden dolayı kapıda ince temizlik boyası var' yalanları, bu sektörün adeta milli marşıdır.\n\nBir profesyonel galerici olarak, ilgilendiğiniz her aracı doğrudan bilgisayarlı ekspertize sokma lüksünüz yoktur. Eğer satın almayı düşündüğünüz her potansiyel aracı ekspere götürüp 3.000 TL öderseniz, ayda on binlerce liralık kârınızı daha alım yapmadan havaya saçmış olursunuz. Sizin göreviniz, araca ilk baktığınız o 3 dakika içinde aracın ağır kazalı olup olmadığını adeta bir av köpeği gibi koklayarak anlamak ve eğer araçta gizlenmiş büyük bir kusur (şase/airbag işlemi) varsa ekspere dahi sokmadan o masadan kalkmaktır.";
    
    step6Section.subsections = [
      {
        "subtitle": "1. Kaporta ve Boya Dedektifliği (Işık ve Yansıma Hileleri)",
        "text": "Elinizde boya ölçüm cihazınız (mikron makinesi) olmasa bile, şahin gibi eğitilmiş gözleriniz size her şeyi anlatır. Bir araca asla tam karşıdan veya dik bir açıyla bakmayın. Aracın farından arka stop lambasına doğru uzanan o yan omuz çizgisine paralel (çapraz) ve hafif eğilerek bakın.\n\nOrijinal fabrikanın robot fırın boyası güneşte cam gibi pürüzsüz düz bir yansıma yaparken, sanayide sonradan atılmış bir boya (kaliteli de olsa) ışığın altında 'portakal kabuğu' (hafif pütürlü ve dalgalı) bir yansıma yapar. Parçalar arasındaki ton farkını (özellikle tampon ile çamurluk birleşiminde) veya kapı ile çamurluk arasındaki siyah derz boşluklarının milimetrik olarak farklı olduğunu (örneğin çizginin üstten dar, alttan giderek genişlemesini) fark ederseniz; o parça sökülüp takılmış, ayarı kaçmış veya tamamen yan sanayisiyle değişmiş demektir."
      },
      {
        "subtitle": "2. Şase, Podye ve Direklerin Gizli Şifresi",
        "text": "Bir aracın dış kaportası sanayide kusursuz toplanmış ve ayna gibi parlıyor olabilir; asıl ölümcül sırlar kaputun altında ve kapı fitillerinin (lastiklerinin) arkasında gizlidir. Kaputu açtığınızda doğrudan çamurlukları ve kaputu kasaya bağlayan somun/cıvatalara odaklanın. Fabrika çıkışı cıvataların üzerindeki boyada kesinlikle anahtar izi, çizik veya boya atması olamaz; eğer cıvatanın köşelerinde boya kazınmışsa o parça kesinlikle sökülmüştür.\n\nEn hayati nokta şase uçları ve podyelerdir. Bu demir omurgalardaki fabrika kaynak izleri, son derece simetrik, eşit aralıklı ve robotik bir nokta (punta) şeklindedir. Eğer kaynak noktaları birbirine benzemiyorsa, erimiş metal görüntüsü düzensizse, veya o bölgeye kalın bir siyah Dayson silikon/macun çekilip boyanmışsa, o araba önden çok ağır bir kaza geçirmiş, motor içeri girmiş ve sanayide 'göz boyanarak' toplanmış demektir."
      },
      {
        "subtitle": "3. Airbag (Hava Yastığı) ve Emniyet Kemeri Hileleri",
        "text": "Önden kazalı bir arabanın yamulan demirini çektirmek kolaydır, ancak patlamış airbag setlerini orijinal sıfırlarıyla değiştirmek muazzam pahalı olduğu için art niyetli satıcılar burada inanılmaz hilelere (direnç atma) başvurur. Direksiyon göbeğindeki marka logosu içe doğru hafif göçmüşse veya direksiyon kaplamasının (kornanın) dokusu ile torpidonun plastik dokusu arasında gözle görülür bir renk/malzeme uyumsuzluğu varsa, o airbag patlamış ve sanayide deriyle kaplanıp kapatılmış olabilir.\n\nBunu anlamanın en kesin, ücretsiz çözümü Emniyet Kemerleridir. Aracın emniyet kemerini sonuna kadar çekin. Kemerin en alt/dip kısmında beyaz bir fabrika üretim etiketi bulunur. O etikette yazan üretim yılı ile aracın ruhsattaki model yılı mutlaka aynı olmalıdır (veya en fazla 1 yıl öncesi olabilir). Araba 2020 modelken kemer etiketinde 2021 veya 2018 yazıyorsa o kemerler (ve dolayısıyla airbagler) patlamış ve çıkmacıdan alınan başka bir kemerle değiştirilmiştir."
      }
    ];

    step6Section.warning = {
      title: "Mikron Cihazı Her Şey Değildir (Ekleme Araç Terörü)",
      text: "Acemi galericiler boya ölçüm cihazına körü körüne güvenir. Cihaz tavanı veya arka çamurluğu orijinal (100 mikron boyasız) gösterebilir. Ancak uyanık bir kaportacı, ağır kazalı arabanın tavanını direklerden spiral ile kesip, hurdacıdan aldığı aynı renk 'orijinal boyalı' başka bir tavanı kaynakla oturtmuş (ekleme/kaynak araç) olabilir. Kapı fitillerini çekip altındaki fabrika kaynak puntolarını görmeden cihaza asla güvenmeyin."
    };

    fs.writeFileSync(path, JSON.stringify(data, null, 2));
    console.log('Successfully updated Step 6!');
  } else {
    console.log('Step 6 not found!');
  }
} else {
  console.log('Guide not found!');
}
