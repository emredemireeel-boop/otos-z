const fs = require('fs');

const data = JSON.parse(fs.readFileSync('./public/data/library_guides.json', 'utf8'));

const newGuide = {
  "id": "guide_araba_renkleri_isi_emilimi",
  "title": "Araç Rengi Seçimi Neden Önemli? Renklere Göre Isı Emilimi ve Yaz Sıcakları",
  "description": "Güneş altında park edilen araçların rengi, kabin içinin fırına dönmesinde ne kadar etkilidir? Siyah ile beyaz araç arasında tam 19°C yüzey sıcaklığı farkı olduğunu biliyor muydunuz?",
  "minutes": 6,
  "difficulty": "Tüm Sürücüler",
  "tags": [
    "Araç Rengi",
    "Isı Emilimi",
    "Yaz Ayları",
    "Klima Kullanımı",
    "Tavsiye"
  ],
  "author": "OtoSöz Bilim ve Teknik",
  "sections": [
    {
      "type": "intro",
      "title": "Güneşin Altında Kalan Arabalar: Hangi Renk Ne Kadar Isınıyor?",
      "content": "Yaz aylarında aracınızı güneşte park edip döndüğünüzde kapıyı açar açmaz yüzünüze vuran o alev topunu bilirsiniz. Direksiyon tutulmayacak kadar ısınmış, koltuklar ise adeta birer fırın tepsisine dönüşmüştür. Peki, bunun tek sorumlusu güneş mi? Hayır! Aracınızın rengi, ısıyı ne kadar emdiği konusunda hayati bir rol oynar. Yapılan testlerde, farklı renklerdeki araçların yüzey sıcaklıkları arasında devasa farklar olduğu ortaya çıktı."
    },
    {
      "type": "step",
      "title": "Siyah: Yüzey Sıcaklığı 62°C (En Çok Isıyı Emer)",
      "content": "Siyah renk, ışığın tamamına yakınını emdiği için yaz aylarında adeta bir ısı mıknatısına dönüşür. Güneş altında kalan siyah bir aracın yüzey sıcaklığı 62 dereceye kadar çıkabilir. Bu durum sadece kaportayı değil, kabin içini de kavurucu hale getirir. Klimanızın içeriyi soğutması beyaz bir araca göre çok daha uzun sürer ve yakıt tüketiminizi artırır."
    },
    {
      "type": "step",
      "title": "Beyaz: Yüzey Sıcaklığı 43°C (Güneş Işığını En Çok Yansıtır)",
      "content": "Beyaz renk, ışığı yansıtma özelliği sayesinde yaz aylarının şüphesiz en avantajlı rengidir. Yüzey sıcaklığı 43 derece civarında kalarak siyah bir araca göre tam 19 derecelik bir avantaj sağlar. Bu, kabin içinin nispeten daha serin kalmasını ve klimanın çok daha kısa sürede içeriyi yaşanabilir bir seviyeye getirmesini sağlar."
    },
    {
      "type": "step",
      "title": "Gümüş ve Yeşil: Serin Tutan Alternatifler (45-47°C)",
      "content": "Eğer beyaz renk size çok sıradan geliyorsa, gümüş gri (47°C) ve açık yeşil (45°C) tonları harika alternatiflerdir. Koyu ve parlak renklere kıyasla daha az ısı emerler, orta düzeyde bir yansıtma sağlayarak dengeli bir kabin sıcaklığı sunarlar. Özellikle gümüş gri, kiri de az belli etmesiyle tam bir yazlık dostudur."
    },
    {
      "type": "step",
      "title": "Mavi, Sarı ve Kırmızı: Orta-Yüksek Isı Grubu (48-51°C)",
      "content": "Görsel olarak en çekici renkler maalesef ısı emiliminde ortanın üzerine çıkıyor. Mavi araçlar 48°C, sarı araçlar 50°C, kırmızı araçlar ise 51°C gibi yüksek yüzey sıcaklıklarına ulaşıyor. Kırmızı renk, açık renklere kıyasla güneşi daha fazla hapsederek yaz aylarında klimanıza ekstra mesai yaptıracaktır."
    },
    {
      "type": "conclusion",
      "title": "Sonuç: Renk Seçimi Sadece Estetik Değildir",
      "content": "Sıfır veya ikinci el araç alırken renk seçimi sadece zevk meselesi değildir. Özellikle sıcak iklimlerde yaşıyorsanız, koyu renkli bir araç seçmek hem klimaya daha fazla yüklenmenize (ve dolayısıyla daha çok yakıt harcamanıza) hem de konforunuzun düşmesine neden olur. Açık renkli araçlar ise yansıtıcılıkları sayesinde size doğal bir izolasyon sağlar.",
      "finalChecklist": [
        "Sıcak bir bölgede yaşıyorsanız siyah, lacivert veya koyu gri gibi renklerden kaçının.",
        "Açık renklerin klimayı daha az zorlayarak yakıt tasarrufu sağladığını unutmayın.",
        "Koyu renkli araç sahipleri için yazın ön cam güneşliği kullanmak hayati önem taşır."
      ]
    }
  ],
  "urlId": 10040
};

// Insert at the beginning of the guides array
data.guides.unshift(newGuide);

fs.writeFileSync('./public/data/library_guides.json', JSON.stringify(data, null, 2));
console.log('Successfully appended color heat absorption guide!');
