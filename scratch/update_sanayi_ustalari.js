const fs = require('fs');

const filePath = 'public/data/library_guides.json';
const fileContents = fs.readFileSync(filePath, 'utf8');
const data = JSON.parse(fileContents);

const guideIndex = data.guides.findIndex(g => g.id === 'guide_sanayi_ustalari_sirlar');

if (guideIndex === -1) {
    console.error('Guide not found');
    process.exit(1);
}

const updatedGuide = {
  "id": "guide_sanayi_ustalari_sirlar",
  "urlId": 10035,
  "title": "Sanayide Ustaların Gizlediği 7 Kritik Sır: Aracınızın Ömrünü ve Cüzdanınızı Nasıl Kurtarırsınız?",
  "description": "Yetkili servislerin ve sanayi ustalarının genellikle size söylemediği, basit ama hayati önem taşıyan 7 kritik bakım sırrı. Motor yağınızın gerçek ömründen, şanzıman kurtaran basit alışkanlıklara ve gizli fren hatalarına kadar detaylı bir hayatta kalma rehberi.",
  "minutes": 20,
  "difficulty": "Başlangıç/Orta",
  "tags": [
    "Bakım",
    "Tasarruf",
    "Sanayi",
    "Tavsiye",
    "Pratik Bilgi",
    "Motor",
    "Şanzıman"
  ],
  "author": "OtoSöz Baş Usta",
  "sections": [
    {
      "type": "intro",
      "title": "Kimse Sizin Cebinizi Sizin Kadar Düşünmez",
      "content": "Aracınızı servise her götürdüğünüzde değişen parçalar, gittikçe kabaran faturalar ve bir türlü bitmeyen \"Abi şu parçayı da değiştirsek iyi olur\" cümleleri... Otomotiv endüstrisi ve bakım sektörü, genellikle kullanıcıların bilgisizliğinden ve korkularından beslenen devasa bir çarktır. Peki bu çarkın dişlileri arasında ezilmemek, servise servet ödememek için ne yapmalısınız?\n\nİşte ustaların bilmenizi pek de istemediği, size söylemeye gerek duymadığı veya sizin alışkanlıklarınızı düzeltmek için vakit harcamadığı 7 kritik sır. Bu sırlar, arabanızın ömrünü iki katına çıkarırken cüzdanınızı ağır hasarlardan koruyacak."
    },
    {
      "type": "section",
      "title": "1. 10.000 KM Yalanı ve Yağın Gerçek Ömrü",
      "content": "Pek çok özel servis ve usta, aracınıza en pahalı tam sentetik yağı koysa bile ısrarla 10.000 km'de bir (hatta bazıları 8.000'de bir) bakıma gelmenizi ister.",
      "subsections": [
        {
          "subtitle": "Kullanım Şartlarına Göre Yağ Değişimi",
          "text": "Bugün modern tam sentetik yağlar kolaylıkla 15.000 ile 20.000 km arası dayanacak kimyasal kapasitededir. Ancak burada asıl hile 'kilometre' değil, 'motor çalışma saati' faktöründedir.",
          "points": [
            "**Uzun Yol Aracı:** Eğer sürekli otobanda veya uzun yolda sabit hızla gidiyorsanız, tam sentetik bir yağ ile 15.000 km'yi rahatlıkla görebilirsiniz. Motorunuz az yorulmuştur.",
            "**Şehir İçi İşkencesi:** Ancak aracınız sürekli dur-kalk İstanbul/Ankara trafiğindeyse, kilometreniz az bile olsa motorunuz saatlerce rölantide çalışmıştır. Motor yağı mesafe katetmeseniz bile ısıdan ve sürtünmeden dolayı özelliğini yitirir.",
            "**Ustaların Söylemediği:** Sadece kilometre sayacına bakmayın, yol bilgisayarındaki ortalama hızınıza bakın."
          ]
        }
      ],
      "tip": {
        "title": "💡 Altın Formül",
        "text": "Eğer yol bilgisayarınızdaki ortalama hızınız 25 km/s altındaysa (yoğun trafik), yağınızı 10.000 km dolmadan (örneğin 8.000'de) değiştirin. Eğer ortalama hızınız 50 km/s ve üzerindeyse, 15.000 km'yi güvenle bekleyebilirsiniz. Fazla bakım israftır."
      }
    },
    {
      "type": "section",
      "title": "2. Otomatik Şanzıman Katili: 'P' Vitesi Tuzağı",
      "content": "Türkiye'deki otomatik vites arızalarının yarısından fazlası donanım kaynaklı değil, tamamen yanlış kullanıcı alışkanlığı kaynaklıdır.",
      "subsections": [
        {
          "subtitle": "Yokuşta Park Ederken Yapılan Ölümcül Hata",
          "text": "Aracı yokuşta veya hafif eğimli bir yerde park ettiğinizde önce vitesi 'P' (Park) konumuna alıp, sonra el frenini çekiyor veya motoru kapatıyorsanız, 1.5 tonluk aracın tüm ağırlığını şanzımanın içindeki serçe parmağı büyüklüğündeki incecik bir demir çubuğa ('Park Mandalı') bindiriyorsunuz demektir.",
          "points": [
            "**Vuruntu Sesi:** Bu şekilde park ettikten sonra aracı çalıştırıp vitesi 'P'den 'D'ye veya 'R'ye alırken şanzımandan \"TAK\" veya \"KÜT\" diye sert bir vuruntu sesi duyarsınız. Bu ses, sıkışan park mandalının zorla yerinden çıkma sesidir.",
            "**Doğru Sıralama (Hayat Kurtarır):** Aracı frenle durdurun > Vitesi **'N' (Boş)** konumuna alın > El frenini sonuna kadar çekin > Ayak frenini yavaşça bırakıp **aracın tüm yükünün el frenine (arka tekerleklere) binmesini sağlayın** > Araç esneyip oturduktan sonra vitesi son olarak **'P'** konumuna alın."
          ]
        }
      ],
      "warning": {
        "title": "⚠️ Şanzıman Revizyonu Faturası",
        "text": "Basit bir sıralama hatası yüzünden o küçük mandal kırılırsa veya şanzıman dişlileri aşınırsa, günümüzde otomatik şanzıman revizyonları 50.000 TL ile 150.000 TL arasında dudak uçuklatan rakamlara mal olmaktadır."
      }
    },
    {
      "type": "section",
      "title": "3. Klima Bakımında 'Sadece Gaz Basmak' Yeterli Mi?",
      "content": "Yaz aylarında klimanız eskisi gibi soğutmuyorsa veya hiç soğuk üflemiyorsa, sanayideki ilk teşhis her zaman şudur: 'Abi gazı bitmiş, 500 lira ver gaz basalım düzelir.'",
      "subsections": [
        {
          "subtitle": "Klima Gazı Kendi Kendine Asla Bitmez",
          "text": "Otomobil klimaları, tıpkı evinizdeki buzdolapları gibi 'kapalı devre' basınçlı bir sistemdir. Evinizdeki buzdolabına her yaz gaz bastırıyor musunuz? Hayır. Peki arabanıza neden bastırasınız?",
          "points": [
            "**Sızıntı (Kaçak) Gerçeği:** Eğer klimanızın gazı eksilmişse veya bitmişse, borularda, contalarda veya kompresörde çatlak/sızıntı var demektir. Sızıntıyı bulmadan sadece yeni gaz basmak, delik bir kovaya su doldurmaktan farksızdır. Birkaç hafta sonra o gaz da uçup gidecektir.",
            "**Test Şartı:** Ustadan gaz basmadan önce sisteme mutlaka azot veya UV ışıklı (fosforlu) renkli boya basarak kaçak testi yapmasını isteyin.",
            "**Polen Filtresi:** Klimanız soğutuyor ama üflemesi zayıfsa sorun gaz değil, tıkanmış polen filtresidir. Servise tonla para vermeyin; pek çok modelde torpido gözünün arkasından 2 dakikada klipssiz kendiniz değiştirebilirsiniz."
          ]
        }
      ]
    },
    {
      "type": "section",
      "title": "4. Turboyu Sessizce Öldüren Sabırsızlık",
      "content": "Günümüzde neredeyse tüm araçlar turboludur (TSI, TCe, TDI, dCi, mHawk vb.). Turbolu araç sahiplerinin en büyük hatası, motoru çalıştırır çalıştırmaz gaza yüklenmek ve varış noktasında motoru aniden kapatmaktır.",
      "subsections": [
        {
          "subtitle": "Turbo Mili ve Yağlama Prensibi",
          "text": "Turbo pervaneleri, egzoz gazının itmesiyle dakikada 150.000 - 250.000 gibi inanılmaz devirlerle döner. Bu korkunç hıza ve ısıya dayanabilmelerinin tek sebebi, karterden gelen motor yağının turbo mili etrafında oluşturduğu sürtünmesiz \"yağ filmidir\".",
          "points": [
            "**Kalkışta Acele Etmek:** Sabah soğuk motoru çalıştırdığınızda karterdeki yağın yukarı tırmanıp turboya ulaşması yaklaşık 20-30 saniye sürer. Eğer motoru çalıştırır çalıştırmaz gaza basıp hareket ederseniz, turbo pervanesi yağsız (kuru kuruya) döner ve metal metale sürterek aşınır.",
            "**Kapatırken Acele Etmek:** Uzun yoldan, rampadan veya sıkıştırmalı bir otoban sürüşünden sonra motoru hemen kapatırsanız (kontak kapatırsanız), motordaki yağ akışı aniden kesilir. Ancak ivme kazanmış olan turbo mili içeride 100.000 devirle dönmeye devam etmektedir! Yağsız dönen bu mil aşırı ısınır ve zamanla keser."
          ]
        }
      ],
      "tip": {
        "title": "💡 1 Dakika Kuralı (Turbonun Can Simidi)",
        "text": "Motoru ilk çalıştırdığınızda yola çıkmadan önce en az 30-40 saniye rölantide bekleyin. Sürüşünüz bittiğinde motoru stop etmeden önce (özellikle uzun yoldan gelmişseniz) mutlaka 1 dakika boyunca aracı rölantide çalışır vaziyette bekletin ki turbo pervanesi yavaşlasın ve yağlanarak soğusun."
      }
    },
    {
      "type": "section",
      "title": "5. Motor Suyu (Antifriz) Sadece Kışın Konmaz!",
      "content": "Çoğu sürücü yaz aylarında radyatör suyu eksildiğinde üzerine normal musluk suyu (veya içme suyu) ekler. Antifrizin sadece kışın suların donmasını engellemek için konulduğunu sanır.",
      "subsections": [
        {
          "subtitle": "Pas, Korozyon ve Contalar",
          "text": "Antifriz (Soğutma Sıvısı), sadece donmayı engellemez; aynı zamanda motor bloğunun içindeki su kanallarının paslanmasını, kireçlenmesini ve çürümesini (korozyonu) engeller. Ayrıca kaynama noktasını 100 dereceden 120-130 derecelere çıkararak harareti önler.",
          "points": [
            "**Musluk Suyu Cinayettir:** Yaz aylarında saf su veya antifriz yerine musluk suyu eklerseniz, içindeki kireç zamanla devirdaim pompasını kilitler, incecik radyatör kanallarını tıkar ve silindir kapak contanızı çürütür.",
            "**4 Mevsim Kuralı:** Antifriz yaz-kış motorda bulunmak zorundadır. Soğutma suyuna ekleme yapacaksanız her zaman antifriz + saf su (veya önceden karıştırılmış hazır soğutma sıvısı) kullanın."
          ]
        }
      ]
    },
    {
      "type": "section",
      "title": "6. Fren Disklerinin En Büyük Düşmanı: 'Sıcak Su'",
      "content": "Özellikle yazın uzun bir yoldan veya dağ inişinden geldiğinizde, aracınızı hemen bir yıkamacıya çeker veya kendiniz yıkamaya başlarsınız. Balatalardaki siyah tozları çıkarmak için o kızgın jantlara ve fren disklerine tazyikli soğuk suyu tuttuğunuz an \"Cıssss\" diye bir buhar yükselir.",
      "subsections": [
        {
          "subtitle": "Disk Eğriltme ve Balata Camlaşması",
          "text": "Ağır frenlemeden sonra fren disklerinizin sıcaklığı 400-500 derecelere kadar ulaşabilir. Kızgın bir demire aniden soğuk su çarparsa ne olur? Metal aniden büzülür ve şekli bozulur (yamulur).",
          "points": [
            "**Direksiyon Titremesi:** Yıkamadan çıktıktan sonra yüksek hızda frene bastığınızda direksiyonunuz sağa sola şiddetle titriyorsa, tebrikler; fren disklerinizi soğuk su sıkarak eğdiniz. Artık tornalanması veya değiştirilmesi gerekir.",
            "**Balata Spreyi Tuzağı:** Sanayide bazı ustalar frenlerden ses geliyor diye balataları sökmeden bolca \"Balata Spreyi\" sıkar ve yollar. O sprey sadece yüzeydeki tozu uçurur. Balata camlaşmışsa (sertleşmişse) sprey işe yaramaz, balatanın zımparalanması veya değişmesi şarttır."
          ]
        }
      ],
      "warning": {
        "title": "⚠️ Yıkama Öncesi Bekleyin",
        "text": "Uzun yoldan veya sert frenlemeli bir sürüşten sonra aracınızı yıkamaya sokmadan önce gölgede en az 15-20 dakika bekleyip fren disklerinin doğal yollarla soğumasına izin verin."
      }
    },
    {
      "type": "section",
      "title": "7. Akü Ömrü: Kısa Mesafeler Aküyü Neden Öldürür?",
      "content": "Yeni bir akü aldınız ama 1.5 yıl içinde \"Akü Zayıf\" uyarısı vermeye başladı. Sanayiye gidip ölçtürdüğünüzde akünün ömrünün bittiğini söylüyorlar.",
      "subsections": [
        {
          "subtitle": "Marş Motorunun Bedeli ve Şarj (Alternatör) Süresi",
          "text": "Aracınızı her çalıştırdığınızda (marş bastığınızda), aküden devasa bir anlık akım çekilir. Alternatörün (şarj dinamosunun) marş basarken kaybedilen bu enerjiyi aküye geri yükleyebilmesi için aracın en az 15-20 dakika kesintisiz çalışması gerekir.",
          "points": [
            "**Bakkala Arabayla Gitmek:** Aracınızı sadece sabah 5 dakika işe gitmek, akşam 5 dakika dönmek veya markete gitmek için kullanıyorsanız, akü hiçbir zaman harcadığı enerjiyi tam olarak geri kazanamaz.",
            "**Kapasite Düşüşü:** Sürekli yarım şarjda kalan bir akünün içindeki kurşun plakalar sülfatlaşır (kristalleşir) ve akü bir daha tam kapasite şarj tutamaz hale gelir.",
            "**Çözüm:** Eğer aracınızı hep çok kısa mesafelerde kullanıyorsanız, ayda en az 1-2 kez aracı otoyola çıkarıp 30-40 dakika devirli ve kesintisiz kullanarak akünün \"derin şarj\" (deep cycle) yapmasına olanak tanıyın."
          ]
        }
      ]
    },
    {
      "type": "conclusion",
      "title": "Özetle: Bilgi En İyi Tasarruftur, Kulaktan Dolma Bilgi İse En Pahalı Faturadır",
      "content": "Yukarıdaki 7 sırrın hiçbiri uzay bilimi değildir, tamamen temel mekanik ve fizik kurallarına dayanır. Ancak bu basit kuralları göz ardı etmek, sizi on binlerce liralık servis faturalarıyla baş başa bırakabilir. \n\nArabanızın torpido gözündeki kullanım kılavuzunu açıp okumak, sanayideki çırakların kulaktan dolma efsanelerini dinlemekten yüz kat daha değerlidir. Unutmayın; iyi ve doğru kullanım alışkanlıkları, en iyi tamirciden bile daha etkilidir. Aracınıza iyi davranın, o da sizi yolda bırakmasın.",
      "finalChecklist": [
        "Park ederken sıralamaya dikkat ediliyor mu? (Önce N, sonra el freni, yükü bindir ve en son P)",
        "Turbolu araçlarda motoru çalıştırırken ve kapatırken '1 dakika bekleme' kuralına uyuluyor mu?",
        "Yağ değişimi sadece kilometreye değil, ortalama çalışma saatine ve hızına göre planlanıyor mu?",
        "Yaz aylarında radyotöre musluk suyu yerine mutlaka Antifriz eklendiğinden emin olundu mu?",
        "Sıcak fren disklerine tazyikli soğuk su tutulmasından kaçınılıyor mu?"
      ]
    }
  ]
};

data.guides[guideIndex] = updatedGuide;
fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
console.log('Update successful');
