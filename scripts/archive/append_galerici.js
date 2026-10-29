const fs = require('fs');

const path = './public/data/library_guides.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const newGuide = {
  "id": "guide_nasil_galerici_olunur",
  "title": "Sıfırdan Zirveye: Nasıl Profesyonel Bir Galerici (Oto Alım-Satım Uzmanı) Olunur? (10 Adımlık Mega Rehber)",
  "description": "Sadece araba sevgisiyle galerici olunmaz! Ticaret zekası, yasal prosedürler, ekspertiz hileleri ve ikna sanatını kapsayan, sıfırdan kendi oto galerinizi kurmanın 10 altın kuralı.",
  "minutes": 25,
  "difficulty": "Uzman",
  "tags": [
    "Oto Galeri",
    "Ticaret",
    "Meslek Rehberi",
    "Girişimcilik",
    "Satış",
    "Sermaye"
  ],
  "author": "OtoSöz Ticaret Uzmanı",
  "sections": [
    {
      "type": "intro",
      "title": "Başlamadan Önce: Araba Sevgisi Karın Doyurmaz",
      "content": "Oto galericilik, dışarıdan bakıldığında lüks arabalara binip, takım elbiseyle çay içerek para kazanılan kolay bir meslek gibi görünebilir. Oysa gerçekler çok farklıdır! İyi bir galerici olmak; sadece motor sesinden anlamayı değil, derin bir ticaret zekasını, insan psikolojisi okumayı, yasal mevzuatlara hakimiyeti ve en önemlisi 'kriz anında soğukkanlı kalmayı' gerektirir. Piyasada batan yüzlerce galerici, arabaları çok iyi bildiği için değil, ticareti ve insanları yönetemediği için batmıştır. Bu mega rehberde, hayallerinizdeki oto galeriyi sıfırdan kurup, piyasanın kurdu haline gelmeniz için gereken 10 hayati adımı tek tek inceleyeceğiz."
    },
    {
      "type": "step",
      "title": "Adım 1: Psikolojik Hazırlık ve Ticaret Zekası",
      "content": "Galericilik bir 'al-sat' mesleği değil, bir 'risk yönetimi' mesleğidir. İlk kural: Duygularınızı bagaja kilitleyin. Bir arabaya aşık olarak ticaret yapılmaz. Aldığınız araç sadece bir 'satılacak meta'dır. Ayrıca yalanın, dolanın ve dolandırıcılığın çok olduğu bir piyasaya giriyorsunuz. Herkese güvenmeyi bırakıp, paranoyak seviyesinde dikkatli olmalısınız. Kötü bir araç alıp binlerce lira zarar ettiğinizde gece rahat uyuyabilecek psikolojik dirence sahip değilseniz, bu meslek size göre değildir."
    },
    {
      "type": "step",
      "title": "Adım 2: Yasal Zorunluluklar ve İzinler (Mesleki Yeterlilik)",
      "content": "Artık 'ben galericiyim' diyerek dükkan açma devri kapandı. Ticaret Bakanlığı'nın kuralları çok net:\n1. **Mesleki Yeterlilik Belgesi (Seviye 5):** Sınava girip ikinci el motorlu kara taşıtları alım satım danışmanı belgenizi almalısınız.\n2. **Yetki Belgesi:** İşletmenizin İkinci El Motorlu Kara Taşıtı Ticareti Yetki Belgesi'ne sahip olması şarttır.\n3. **Lise Mezuniyeti:** Yetki belgesi alabilmek için en az lise mezunu olmanız gerekiyor.\n4. **Ruhsat ve Maliye:** Şirket kurulumu (Şahıs veya Limited), vergi levhası ve belediyeden alınacak iş yeri açma ve çalışma ruhsatı olmazsa olmazdır."
    },
    {
      "type": "step",
      "title": "Adım 3: Sermaye Yönetimi ve Bütçe Planlaması",
      "content": "Bir galeri açmak için ne kadar paraya ihtiyacınız var? Sadece araç almak yetmez. Kira, stopaj, dükkan dekorasyonu, reklam giderleri ve en az 6 ay dükkanı döndürecek bir 'can suyu' bütçeniz olmalı. \n**Altın Kural:** Asla tüm sermayenizi tek bir lüks araca bağlamayın. 3 Milyon TL'ye tek bir Premium araç alıp aylarca satılmasını beklemek yerine, o paraya hızlı sirkülasyonu olan, piyasası canlı (Clio, Egea, Megane, Focus vb.) 4-5 araç alın. Nakit akışı (cash flow) galericiliğin kan damarıdır; o kan durursa dükkan ölür."
    },
    {
      "type": "step",
      "title": "Adım 4: Lokasyon Seçimi ve Showroom Kurulumu",
      "content": "Dükkanınızın nerede olduğu, satacağınız araçların kalitesini belirler. Bir oto center'da (Oto kentsel dönüşüm alanları, Galericiler Sitesi vb.) dükkan açmak, doğal müşteri trafiği sağlar ancak rekabet çok yüksektir. Bağımsız bir cadde üstü dükkan açacaksanız, aydınlatma her şeydir! Araçların boyasını ve hatlarını ortaya çıkaracak profesyonel spot aydınlatmalar kullanılmalıdır. Zeminin temizliği (genelde epoksi kaplama), araçların birbirine olan mesafesi ve içerideki mis gibi 'yeni araç' kokusu müşterinin satın alma algısını %50 artırır."
    },
    {
      "type": "step",
      "title": "Adım 5: Araç Tedariği - Nereden, Nasıl Araç Bulunur?",
      "content": "Galericinin parayı satarken değil, 'alırken' kazandığını unutmayın. Peki araçlar nereden bulunur?\n- **İnternet İlanları:** Sürekli yenilenen ilanları saniye saniye takip edip, fiyatı yanlış girilmiş veya acil nakde sıkışmış kullanıcıları bulmak (buna piyasada ekran düşürmek denir).\n- **Filo Şirketleri:** Toplu alım yaparak birim maliyetini düşürmek.\n- **Takas Ağı:** Müşteriden gelen takas araçlarını ölü fiyata sayıp kar marjını artırmak.\n- **Çevre ve Sanayi:** Sanayi ustalarıyla arayı iyi tutup, motoru arızalı aracı ucuza alıp, yaptırıp karla satmak."
    },
    {
      "type": "step",
      "title": "Adım 6: Şahin Gözü Ekspertiz (Kazalı Aracı Koklamak)",
      "content": "Müşterinin getirdiği ekspertiz raporuna asla %100 güvenmeyin! Bir galerici, araca dışarıdan baktığında tavanın dalgalanmasından, farların farklı solgunlukta olmasından veya kapı fitillerinin altındaki punto izlerinden aracın geçmişini okuyabilmelidir. Boya kalınlık ölçüm cihazı (mikron makinesi) cebinizden hiç eksik olmamalı. Piyasada 2 parçadan eklenmiş ('kesme' tabir edilen) araçları size yutturmaya çalışan profesyonel dolandırıcılar olacaktır. Şase ucundaki milimetrik bir işlem, sizi yüz binlerce lira zarara sokabilir."
    },
    {
      "type": "info",
      "title": "Fiyatlandırma Sırrı: 3'lü Matematik Sistemi",
      "content": "Aracı kaça alıp kaça satacaksınız? Piyasada buna '3'lü matematik' denir:\n1. **Kör Alış Fiyatı:** Aracın yarın sabah galericiye veya nakit alım yapan firmalara anında verilebileceği ölü fiyat.\n2. **Binici Alış Fiyatı:** Aracın temizliğine göre sizin maksimum vereceğiniz rakam.\n3. **Vitrin Fiyatı:** Pazarlık payı eklenmiş, internete gireceğiniz fiyat.\nAsla vitrin fiyatına yakın bir fiyattan araç almayın; ticaretin kuralı min. %5-%10 arası net kar marjı bırakmaktır."
    },
    {
      "type": "step",
      "title": "Adım 8: Dijital Vitrin ve Kusursuz İlan Yönetimi",
      "content": "Günümüzde müşteriler galeriye gelmeden önce aracı %80 oranında internette satın alır. İlan fotoğraflarınız dükkanınızın namusudur!\n- Çekimler gün batımı veya gün doğumu yumuşak ışığında ya da profesyonel stüdyonuzda yapılmalı.\n- Plaka açık olmalı (gizlenen plaka güvensizlik yaratır).\n- Açıklama kısmı destan olmamalı ancak tüm ekspertiz, hasar kaydı ve donanım bilgileri ŞEFFAF bir şekilde madde madde yazılmalıdır. 'Gelen üzülmez, dost işi' gibi amatör ağızlar kurumsal imajınızı yerle bir eder."
    },
    {
      "type": "step",
      "title": "Adım 9: İkna Sanatı ve Müşteri Psikolojisi",
      "content": "Müşteri kapıdan girdiği an, onun bütçesini, ne aradığını ve neyden korktuğunu anlamalısınız. Aile babası güven (bagaj, güvenlik, sorunsuz motor) arar; genç müşteri gösteriş (jant, ses sistemi, performans) arar. Müşteri araca kusur bulduğunda (Örn: 'Bunun tamponu çizikmiş') asla defansif olmayın. 'Evet beyefendi, zaten o yüzden fiyatını emsallerinden 20 bin TL aşağıda tuttum, dilerseniz boyatıp teslim edebilirim' diyerek krizi satış argümanına çevirin. Müşteriye bir teneke satsanız dahi, ona bir altın aldığı hissini vermelisiniz."
    },
    {
      "type": "conclusion",
      "title": "Adım 10: Satış Sonrası ve Güven İnşası (Sürdürülebilirlik)",
      "content": "Bir müşteriye bir kez araç satarsanız para kazanırsınız. Ama o müşteriye güven verirseniz, size tüm sülalesini getirir ve bir imparatorluk kurarsınız! Araç satıldıktan sonra oluşan ufak tefek arızalarda (örneğin akü bitmesi) müşteriyi yarı yolda bırakmayıp sorunu çözmek, 3.000 TL masraf ettirir ama 3 yeni müşteri kazandırır. Dürüstlük, oto galericiliğin en pahalı ama en çok kazandıran reklam stratejisidir. Unutmayın: Piyasada kurnazlar sadece 1 yıl kazanır, dürüst tüccarlar ise nesiller boyu!\n\nArtık teorik donanıma sahipsiniz. Takım elbisenizi giyin, mikron makinenizi cebinize koyun ve ticaretin acımasız ama bir o kadar da keyifli dünyasına adım atın!",
      "finalChecklist": [
        "Mesleki Yeterlilik ve Yetki Belgelerinizi eksiksiz tamamladınız mı?",
        "Tüm sermayenizi tek bir lüks araca bağlamaktan kaçınıp sirkülasyon odaklı portföy kurdunuz mu?",
        "Ekspertiz raporlarına körü körüne güvenmeyi bırakıp kendi gözünüzle şase/podye kontrolü yapmayı öğrendiniz mi?",
        "İlan fotoğraflarınızın kalitesi ve açıklamalarınızın şeffaflığı kurumsal bir imaj çiziyor mu?"
      ]
    }
  ],
  "urlId": 10042
};

// Insert at the beginning of the guides array
data.guides.unshift(newGuide);

fs.writeFileSync(path, JSON.stringify(data, null, 2));
console.log('Successfully appended Galericilik guide!');
