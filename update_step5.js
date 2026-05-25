const fs = require('fs');

const path = './public/data/library_guides.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const guide = data.guides.find(g => g.id === "guide_nasil_galerici_olunur");

if (guide) {
  const step5Section = guide.sections.find(s => s.title && s.title.includes("Adım 5: Doğru Araç Tedariği"));
  
  if (step5Section) {
    step5Section.content = "Parayı bastırıp satılacak rastgele bir araba bulmak dünyanın en kolay işidir. Asıl marifet; 'satarken size para kazandıracak' o dip fiyatlı (kelepir) aracı daha satın alma aşamasındayken bulmaktır.\n\nEğer sadece herkesin günde milyonlarca kez tıkladığı standart ilan sitelerine girip, oradaki perakende (binici) fiyatlarından araç alıp üzerine kâr koyarak satmayı umuyorsanız, çok kısa sürede sermayenizi eritip dükkanı kapatırsınız. Başarılı bir galerici, tedarik zincirini çeşitlendiren ve ilan sitelerinin dışındaki daha derin, kapalı fırsat sularında yüzmesini bilen kişidir.";
    
    step5Section.subsections = [
      {
        "subtitle": "1. Kurumsal Filo İhaleleri (Auction) ve Kiralama Dönüşleri",
        "text": "İkinci el piyasasının en büyük 'gizli toptancıları' operasyonel kiralama ve dev filo şirketleridir. Bu şirketler (Zeplin, Intercity vb.), 3 veya 4 yıllık kiralama süresi dolan yüzlerce aracı, tek tek perakende müşterisiyle uğraşmamak için devasa B2B (işletmeden işletmeye) kapalı ihalelerle doğrudan galericilere satarlar.\n\nBu ihalelere (örneğin İkinciyeni, VavaCars ihale platformları) girebilmek için mutlaka resmi bir şirketiniz ve İkinci El Yetki Belgeniz olmak zorundadır. Filo ihalelerinin galericiler için en muazzam avantajı; araçların tüm detaylı ekspertizlerinin ihaleye girmeden önce tamamen şeffaf sunulması ve 'toptan' mantığıyla satıldıkları için piyasanın (perakende vitrin fiyatının) %10 ila %15 altına araç kapatabilme şansıdır. Şirketinizin ana beslenme damarı bu ihaleler olmalıdır."
      },
      {
        "subtitle": "2. Eş-Dost Çevresi (Network) ve Kapı Müşterisi",
        "text": "Oto galericiliğin belki de en tatlı, en stressiz ve kâr marjı en yüksek tedarik yöntemi sağlam bir insan çevresi (network) kurmaktır. Mahallenizdeki esnafın, çocukluk arkadaşınızın, kuaförünüzün veya uzaktan bir akrabanızın acil nakde sıkıştığında, borç kapatması gerektiğinde veya eşine model yükseltmek istediğinde ilk arayacağı, aklına gelen ilk isim 'siz' olmalısınız.\n\nAraba satmak isteyen normal bir binici, ilan sitelerinin o yorucu, saçma sapan mesajlar gelen telefon trafiğiyle uğraşmak istemez. Bu yüzden aracı doğrudan size ('Güvendiği galericiye') getirdiğinde, hızlıca nakde dönmenin rahatlığı karşılığında fiyatta esnemeye her zaman çok daha hazırdır. Ayrıca dükkanınız işlek bir caddedeyse, yoldan geçerken 'Acaba benim araca ne fiyat verirsiniz, yenisini sizden alsam takas olur mu?' diye kapıdan içeri giren müşteriler, en temiz alışları yapacağınız sıcak kaynaktır."
      },
      {
        "subtitle": "3. İlan Sitelerinde Pusuya Yatmak (Acil Nakit Arayanlar)",
        "text": "İlan siteleri (Sarı site vb.) genellikle tok satıcıların mekanıdır ve fiyatlar şişiriktir. Ancak orada da 'altın vuruş' fırsatları döner. Buradaki işin sırrı tam anlamıyla pusuda beklemektir. İlanları düşük fiyata göre değil, her zaman 'İlan Tarihine (En Yeniler)' göre sıralamalı ve radarınıza aldığınız marka/modellerin sayfasını gün boyu sürekli F5 yaparak yenilemelisiniz.\n\nBazen bir vatandaş, batan bir ticari senedini ödemek, hastane masrafı çıkarmak veya kredisini o gün kapatmak için arabasını piyasanın 50.000 TL altına, hatta bazen 100.000 TL altına 'Acil - Yarına Kadar' başlığıyla sisteme düşer. O ilan yayımlandığı anki ilk 3-5 dakika içinde o kişiyi aramalı, güven verip kaporayı anında hesabına ateşleyerek (göndererek) aracı bağlamalısınız. Bu piyasada hızlı olan ve kaporayı çekinmeden atan kârı cebine koyar; 'Acaba 1 saat düşünsem mi?' diyen kişi fırsatı başka bir galericiye çoktan kaptırmış olur."
      }
    ];

    step5Section.tip = {
      title: "Takasın Gizli Gücü",
      text: "Müşterinin getirdiği takas aracı, aslında sizin 'bedavaya' (çok ucuz bir maliyetle) tedarik ettiğiniz yeni bir sermayedir. Takas tekliflerinde kendi aracınızın fiyatından kırmayın, ancak müşterinin aracını piyasa pazar fiyatının %10-%15 altından sayarak içeri alın. En tatlı kâr, satılan araçtan değil, her zaman ucuza alınan takas aracından edilir."
    };

    fs.writeFileSync(path, JSON.stringify(data, null, 2));
    console.log('Successfully updated Step 5!');
  } else {
    console.log('Step 5 not found!');
  }
} else {
  console.log('Guide not found!');
}
