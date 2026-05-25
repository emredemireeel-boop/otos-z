const fs = require('fs');

const path = './public/data/library_guides.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const guide = data.guides.find(g => g.id === "guide_nasil_galerici_olunur");

if (guide) {
  const introSection = guide.sections.find(s => s.type === "intro");
  if (introSection) {
    introSection.content = "Oto galericilik, dışarıdan bakıldığında lüks arabalara binip, takım elbiseyle çay içerek, oturduğu yerden sadece telefon görüşmeleriyle on binlerce lira kazanılan kolay, havalı ve zahmetsiz bir meslek gibi görünebilir. Özellikle sosyal medyada pompalanan 'genç yaşta premium araçlarla gezen galerici' imajı, dışarıdaki birçok insanı bu sektöre heveslendirmektedir. Oysa madalyonun diğer yüzü, dışarıdan görünen o şatafatlı vitrinden çok ama çok farklıdır! İyi bir galerici olmak; sadece V8 motorun kükreyişini sevmekten veya direksiyon başına geçtiğinde o derinin kokusunu hissetmekten ibaret değildir. Başarı için derin ve acımasız bir ticaret zekası, kapıdan giren müşterinin aklından geçenleri saniyeler içinde okuyabilen bir insan psikolojisi uzmanlığı, sürekli değişen vergi ve noter mevzuatlarına bir avukat kadar hakimiyet ve en önemlisi 'büyük kriz anlarında buz gibi soğukkanlı kalabilme' yeteneği gerekir.\n\nBir aracı mekanik olarak çok iyi tanıyor olabilirsiniz. Vites geçişlerindeki milisaniyelik bir gecikmeyi, motorun ısınma evresindeki ufak bir titremeyi veya kaportadaki mikronluk bir boya hatasını sadece dokunarak bile hissedebilirsiniz. Ancak tüm bu teknik bilgi, o aracı 'doğru fiyata' alamadığınız veya o anki piyasa koşullarını doğru analiz edemediğiniz sürece hiçbir işe yaramaz. Değerinden fazla para ödeyerek aldığınız bir araç, dükkanınızın vitrininde yatan ölü bir yatırıma dönüşür ve her geçen gün, ödediğiniz kira ve faturalarla birlikte sermayenizi adeta bir sünger gibi emer. Türkiye piyasasında batan, kepenk kapatmak zorunda kalan yüzlerce galerici, inanın bana arabaları bilmedikleri veya sevmedikleri için batmamıştır. Ticareti, nakit akışını (cash flow) ve yalanın, dolanın kol gezdiği bir kurtlar sofrasındaki insan ilişkilerini yönetemedikleri için sistemin dışına itilmişlerdir.\n\nBu meslek, yeri geldiğinde kapı fitilinin altına gizlenmiş milimetrik bir kaynak izini bulmayı, yeri geldiğinde elindeki kısıtlı sermayeyi tek bir lüks araca bağlamak yerine akıllıca dağıtmayı ve yeri geldiğinde de zarar etmeyi kabullenip o aracı 'zararına satıp nakde geçmeyi' bilmeyi gerektirir. Müşterinin size güvenmesini sağlamak ise tek kullanımlık bir illüzyon değil, tamamen şeffaflık ve dürüstlükle yıllara yayılan bir karakter inşasıdır. İşte tam da bu yüzden hazırladığımız bu mega rehberde, kulaktan dolma kahvehane efsanelerini bir kenara bırakıyoruz. Hayallerinizdeki oto galeriyi sıfırdan kurup, sadece araba heveslisi olan sıradan birinden, piyasanın yönünü tayin eden saygın bir ticaret kurduna dönüşmeniz için gereken 10 hayati adımı; yasal zorunluluklardan ekspertiz hilelerine, ilan taktiklerinden pazarlık psikolojisine kadar en ince ayrıntılarıyla ve tamamen yaşanmış acı/tatlı piyasa gerçekleriyle tek tek masaya yatırıyoruz. Hazırsanız, kahvenizi tazeleyin ve kemerlerinizi bağlayın; çünkü bu okumadan sonra ticarete ve otomobillere bakış açınız tamamen değişecek!";
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
    console.log('Successfully updated the intro section!');
  } else {
    console.log('Intro section not found!');
  }
} else {
  console.log('Guide not found!');
}
