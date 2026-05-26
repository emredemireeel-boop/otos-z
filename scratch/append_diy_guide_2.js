const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../public/data/library_guides.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Find the existing guide
const guideIndex = data.guides.findIndex(g => g.id === "guide_kendin_yap_cozumler");

if (guideIndex !== -1) {
  const additionalSections = [
    {
      "type": "step",
      "title": "14. Cam Buğulanmasına Karşı Tıraş Köpüğü Kalkanı",
      "content": "Kışın araca bindiğinizde nefesinizle birlikte ön camın saniyeler içinde buğulanması görüşü tamamen kapatır. Camı bezle silmek ise iz bırakır.",
      "subsections": [
        {
          "subtitle": "Köpük Mucizesi",
          "text": "Temiz ve kuru ön camın iç yüzeyine bir miktar tıraş köpüğü sıkın (tıpkı koltuk temizliğinde olduğu gibi beyaz köpük). Kuru bir mikrofiber bezle köpüğü camda hiç iz kalmayacak şekilde tamamen silin. Tıraş köpüğü, cam yüzeyinde görünmez bir film tabakası oluşturarak su buharının cama tutunmasını (buğulanmayı) haftalarca engeller."
        }
      ]
    },
    {
      "type": "step",
      "title": "15. Donan Kapı Kilitleri İçin El Dezenfektanı",
      "content": "Çok soğuk gecelerde manuel kapı kilitlerinin içine su sızıp donduğunda anahtar deliğe girmez veya dönmez. Zorlarsanız anahtarı kırabilirsiniz.",
      "subsections": [
        {
          "subtitle": "Alkolün Gücü",
          "text": "Anahtarınızın ucuna bolca alkol bazlı el dezenfektanı sıkın ve kilide sokun. Dezenfektanın içindeki yüksek orandaki izopropil alkol, saniyeler içinde buzları eriterek kilidin şak diye açılmasını sağlar."
        }
      ]
    },
    {
      "type": "step",
      "title": "16. Doğal Torpido Parlatıcı: Zeytinyağı",
      "content": "Güneşte kuruyan, matlaşan ve çatlama riski taşıyan torpidolar (konsollar) için piyasadaki silikonlu spreyler bazen parlamayı aşırı abartarak ön cama yansıma yapar.",
      "subsections": [
        {
          "subtitle": "Mutfaktan Gelen Bakım",
          "text": "Eski bir pamuklu beze veya temiz bir kahve filtresine sadece birkaç damla hakiki zeytinyağı (veya hindistancevizi yağı) damlatın. Torpidoyu bu bezle dairesel hareketlerle silin. Yağ, plastiği besleyerek doğal ve şık bir matlıkta parlatır, aynı zamanda tozu uzun süre iter."
        }
      ]
    },
    {
      "type": "step",
      "title": "17. Deri Koltuk Çatlaklarına Karşı Vücut Losyonu",
      "content": "Eğer aracınızda deri koltuklar varsa, yaz güneşinin altında kuruyup çatlamaları an meselesidir. Özel deri bakım kremleri oldukça pahalı olabilir.",
      "subsections": [
        {
          "subtitle": "Nasıl Uygulanır?",
          "text": "Evinizdeki kokusuz, renksiz ve katkısız standart bir vücut nemlendirici losyonunu alın. Temizlediğiniz deri koltuklara elinizle hafifçe masaj yaparak yedirin ve birkaç saat emmesini bekleyin. İnsan tenini nemlendiren losyon, doğal deri üzerinde de aynı etkiyi yaratarak koltukların yumuşacık kalmasını sağlar."
        }
      ]
    },
    {
      "type": "step",
      "title": "18. Tıkırdayan Emniyet Kemeri Tokalarına Kadife Bant",
      "content": "Aracınızla çukurlara veya kasislere girdiğinizde, kullanılmayan yolcu emniyet kemeri tokasının yandaki sert plastiğe vurarak 'tıkır tıkır' ses yapması sinir bozucudur.",
      "subsections": [
        {
          "subtitle": "Sesi Kesen Detay",
          "text": "Metal tokanın arkasına, sert plastiğe değen yüzeyine küçük bir parça yapışkanlı sünger, keçe veya kadife bant yapıştırın. Bu sayede toka ne kadar sallanırsa sallansın, sadece yumuşak bir temas olacağı için kabin içindeki o sinir bozucu tıkırtı tamamen yok olacaktır."
        }
      ]
    },
    {
      "type": "step",
      "title": "19. Klima Izgaraları İçin Köpük Fırça",
      "content": "Klima menfezlerinin ince aralıkları ne mikrofiber bezle silinebilir ne de elektrik süpürgesiyle tam olarak temizlenebilir. O aralıklardaki toz, klimayı açtığınızda doğrudan yüzünüze çarpar.",
      "subsections": [
        {
          "subtitle": "Pratik Çözüm",
          "text": "Nalburlarda çok ucuza satılan, ucu sünger (köpük) şeklindeki boya fırçalarından alın. Bu sünger fırçanın üzerine çok hafif cam sil sıkın ve klima ızgaralarının arasına sokup çekin. Sünger, o dar aralıktaki tüm yapışmış tozları tek hamlede mıknatıs gibi toplayacaktır."
        }
      ]
    },
    {
      "type": "step",
      "title": "20. İnatçı Böcek Lekelerine Karşı Kurutma Makinesi Mendili",
      "content": "Uzun yolculuklardan sonra ön tampon ve dikiz aynaları yüzlerce ölü sinek ve böcekle kaplanır. Güneşte kuruyan bu lekeleri süngerle kazımak arabanın boyasını çizer.",
      "subsections": [
        {
          "subtitle": "Nasıl Uygulanır?",
          "text": "Çamaşır kurutma makinelerinde kullanılan 'kokulu yumuşatıcı kağıt mendillerinden' birini suyla iyice ıslatın. Islak mendille tamponu yavaşça silin. Mendilin içindeki kimyasallar böcek kalıntılarını tereyağı gibi yumuşatarak boyaya sıfır zarar verecek şekilde kolayca akıp gitmesini sağlar."
        }
      ]
    }
  ];

  data.guides[guideIndex].sections.push(...additionalSections);

  // Update read time
  data.guides[guideIndex].minutes += 12;

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log('Appended EVEN MORE DIY tricks successfully!');
} else {
  console.log('Guide not found!');
}
