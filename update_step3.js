const fs = require('fs');

const path = './public/data/library_guides.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const guide = data.guides.find(g => g.id === "guide_nasil_galerici_olunur");

if (guide) {
  const step3Section = guide.sections.find(s => s.title && s.title.includes("Adım 3: Sermaye Yönetimi"));
  
  if (step3Section) {
    step3Section.content = "Otomobil ticareti, dışarıdan bakıldığında nakit paranın su gibi aktığı bir okyanus gibi görünse de; yanlış bütçe yönetimi yapıldığında o okyanusta boğulmanız an meselesidir.\n\nSermaye yönetimi sadece 'cebimde ne kadar param var' sorusuyla değil, 'bu parayı ne kadar hızlı ve güvenli çevirebilirim' (sirkülasyon hızı) sorusuyla ilgilidir. İyi ve uzun ömürlü bir galerici, parayı cebinde tutan değil, parayı sürekli ve risksiz bir şekilde piyasanın içinde çalıştıran kişidir.";
    
    step3Section.subsections = [
      {
        "subtitle": "1. Sabit Giderler ve 'Operasyonel Bütçe Kalkanı'",
        "text": "Galeriyi açıp araçları vitrine büyük bir hevesle koyduğunuz ilk ay, tek bir satış bile yapamasanız da arka planda saatli bomba gibi işleyen bir sabit giderler tablonuz olacaktır. Yüksek dükkan kirası, elektrik/ısıtma faturaları, personel maaşları, SGK primleri, ilan sitesi (Sarı site vb.) aylık aidatları, muhasebe ücretleri ve günlük sarf malzemeler (temizlik, müşteri ikramlıkları). Tüm bunlar satılan her arabanın net kâr marjından tırtıklayacak olan görünmez düşmanlardır.\n\nSermayenizin tamamını arabalara bağlamadan önce, dükkanınızın en az 6 aylık sabit giderini karşılayacak nakit parayı (Operasyonel Bütçe Kalkanı) bankada, faizde veya hemen bozdurulabilecek likit bir varlıkta hazır tutmalısınız. Piyasaların tamamen durduğu, kredi faizlerinin tavan yaptığı dönemlerde elinde 10 tane arabası olup kamerasının veya personelinin parasını ödeyemediği için elindeki arabayı %20 zararına (ölü fiyata) satmak zorunda kalan galericiler, işte bu kalkanı oluşturmayanlardır."
      },
      {
        "subtitle": "2. Satın Alma Bütçesi ve Hızlı Dönen Sepet Mantığı",
        "text": "Finans dünyasındaki efsanevi 'Tüm yumurtaları aynı sepete koyma' kuralı, oto galericiliğin de en büyük altın kuralıdır. Eğer 2 Milyon TL sermayeniz varsa ve gidip bu paranın tamamıyla sadece 1 adet yüksek motorlu lüks bir Alman arabası alırsanız, o araba dükkanda yattığı her gün iflasa bir adım daha yaklaşırsınız. O arabanın elektronik bir beyni arızalandığında veya piyasası aniden düştüğünde tüm ticari hayatınız durur, eliniz kolunuz bağlanır.\n\nBunun yerine bütçenizi akıllıca 3'e veya 4'e bölün. Filo şirketlerinden çokça dönen, yedek parçası ucuz, herkesin kullandığı 'peynir ekmek gibi satan' B veya C segmenti hatchback/sedan araçlardan oluşan bir sepet yapın. Bir araç 30 gün beklese bile, sepetinizdeki diğer araç 2 günde satılır ve böylece çarkınız dönmeye devam eder. Otomotiv ticaretinde nakit akışı (cash flow) sizin nefes borunuzdur."
      },
      {
        "subtitle": "3. Revizyon (Toplama) ve Sürpriz Masraf Bütçesi",
        "text": "Bir aracı noterde üstünüze aldığınızda iş bitmez, aksine yeni başlar. O aracın vitrine çıkıp (showroom kondisyonuna) satılmaya hazır hale gelmesi için mutlaka önceden ayrılmış bir revizyon bütçesi olmalıdır. Kaportadaki ufak gamzelerin (göçüklerin) boyasız düzeltilmesi, profesyonel iç-dış detaylı temizlik ve pasta cila işlemi, eksik/yıpranmış silecekler veya plastik aksamların değişimi... Bunlar ilk bakışta göz ardı edilse de, aslında her araç için ortalama 5.000 TL ile 20.000 TL arasında kemiksiz bir masraf demektir.\n\nAyrıca motor revizyonları veya sonradan ortaya çıkabilecek gizli/kronik arızalar için mutlaka kasanızda bir 'Sürpriz Masraf' (Amortisman) fonu olmalıdır. Sattığınız bir araçta 1 hafta sonra müşteri kullanımı kaynaklı olmayan gizli bir şanzıman arızası çıkarsa, o müşteriyle mahkemelik olmak ve adınızı lekelemek yerine; bu fondan zararı hızlıca karşılayıp itibarınızı (yani gelecekteki yüzlerce satışınızı) kurtarmalısınız."
      }
    ];

    step3Section.warning = {
      title: "Kar Marjı Yanılgısı",
      text: "Satıştan elde ettiğiniz 50.000 TL kârın tamamı sizin değildir! O paranın içinden satılan aracın ilan masrafını, dükkanın o araca düşen günlük kira/fatura payını ve vergisini (KDV/Gelir) düştüğünüzde cebinize kalan 'net kâr' gerçek bütçenizi oluşturur. Brüt kârı net kâr sanıp lüks harcamalar yapmak, sermayeyi içeriden sinsice eritir."
    };

    fs.writeFileSync(path, JSON.stringify(data, null, 2));
    console.log('Successfully updated Step 3!');
  } else {
    console.log('Step 3 not found!');
  }
} else {
  console.log('Guide not found!');
}
