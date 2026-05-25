const fs = require('fs');

const filePath = 'public/data/library_guides.json';
const fileContents = fs.readFileSync(filePath, 'utf8');
const data = JSON.parse(fileContents);

const guideIndex = data.guides.findIndex(g => g.id === 'guide_yag_kacaklari');

if (guideIndex === -1) {
    console.error('Guide not found');
    process.exit(1);
}

const updatedGuide = {
  "id": "guide_yag_kacaklari",
  "urlId": 10032,
  "title": "Araç Yağ Kaçırırsa Ne Yapılmalı? Yağ Kaçağı Tespiti ve Acil Eylem Plânı",
  "description": "Sabah aracınızın altında siyah bir gölet mi gördünüz? Kırmızı yağdanlık lambası yandığında motorunuzun ölmesine kaç saniye var? Sıvının renginden arızayı anlama taktikleri ve sanayide dolandırılmamanız için 'terleme' ile 'kaçak' arasındaki devasa fark.",
  "minutes": 25,
  "difficulty": "Kritik/İleri",
  "tags": [
    "Motor",
    "Bakım",
    "Arıza",
    "Yağ",
    "Kritik",
    "Acil Durum",
    "Mekanik"
  ],
  "author": "OtoSöz Teknik Ekip",
  "sections": [
    {
      "type": "intro",
      "title": "Motorun Kanı Yere Akarken: Paniğe Kapılmayın, Gözlem Yapın",
      "content": "Sabah işe gitmek için evden çıktınız, aracınıza doğru yaklaştınız ve o korkunç manzarayla karşılaştınız: Aracınızın tam altında simsiyah, yapışkan bir sıvı göleti var. İnsan anatomisinde kan neyse, içten yanmalı bir motor için de yağ tam olarak odur. Yağsız bir motor, saniyede binlerce kez birbirine çarpan metallerin ısıdan eriyip birbirine kaynadığı bir cehenneme dönüşür.\n\nAncak her sıvı sızıntısı motorun bittiği anlamına gelmez. Bazen sadece klimanın tahliye ettiği masum bir su birikintisi, bazen de yolda kalmanıza sebep olacak kritik bir şanzıman sızıntısıdır. Bu rehber, aracınızın altına damlayan o esrarengiz sıvının kimliğini 'kriminal bir dedektif gibi' tespit etmenizi sağlayacak, kırmızı yağdanlık lambasının gerçekte ne anlama geldiğini öğretecek ve sizi gereksiz motor rektifiye faturalarından kurtaracak."
    },
    {
      "type": "section",
      "title": "1. Sıvının Kimliği: Kriminal Tespit (Renk, Koku, Kıvam)",
      "content": "Aracınızın altına damlayan sıvının türünü anlamak, sanayide usta karşısında ne kadar para ödeyeceğinizi belirleyen ilk adımdır. Sıvıya bir peçete veya beyaz bir kağıt daldırarak rengini test edin.",
      "subsections": [
        {
          "subtitle": "Simsiyah veya Koyu Kahverengi, Kaygan Sıvı",
          "text": "**Teşhis: Motor Yağı.** Eğer dizel bir araç kullanıyorsanız, yağ konulduktan 100 km sonra bile simsiyah olur. Benzinli araçlarda ise amber (koyu bal) rengindedir. Parmaklarınızın arasında ezdiğinizde pürüzsüz ve çok kaygandır. Genellikle motor karterinden veya yağ filtresinden damlar.",
          "points": []
        },
        {
          "subtitle": "Kırmızımtırak, Açık Kahve ve Yanık Kokulu Sıvı",
          "text": "**Teşhis: Otomatik Şanzıman Yağı (ATF).** Hidrolik bazlıdır, çok incedir ve genellikle kırmızı/pembe tonlarındadır. Eğer eskiyse rengi kahverengiye döner ama kokusu motor yağından çok daha keskin ve kimyasaldır. Aracın tam orta kısmından, vites kutusunun altından damlar.",
          "points": []
        },
        {
          "subtitle": "Açık Kırmızı, Şeffaf veya Sarımsı İnce Sıvı",
          "text": "**Teşhis: Direksiyon Hidroliği.** Motor yağdan çok daha ince bir kıvamdadır. Genellikle motorun ön kısmından, tamponun hemen arkasından yere damlar. Eğer bu yağ eksilirse, direksiyonu çevirirken 'ııııııı' şeklinde inleme sesleri (pompa ağlaması) duyarsınız.",
          "points": []
        },
        {
          "subtitle": "Yeşil, Mavi, Kırmızı/Turuncu ve Tatlı Kokulu Sıvı",
          "text": "**Teşhis: Antifriz (Motor Soğutma Suyu).** Kesinlikle yağ değildir, su gibi akışkandır. En ayırt edici özelliği aşırı parlak neon renklerde olması ve burnunuza tatlı (şekerli) bir koku vermesidir. Radyatör hortumlarından sızar.",
          "points": []
        },
        {
          "subtitle": "Şeffaf, Kokusuz ve Su Gibi",
          "text": "**Teşhis: Klima Yoğuşma Suyu.** Özellikle sıcak yaz günlerinde aracınızı park ettikten sonra sağ ön yolcu koltuğunun altından şırıl şırıl su damlar. Bu tamamen zararsızdır, klimanın doğal terlemesidir."
        }
      ]
    },
    {
      "type": "section",
      "title": "2. Terleme Mi, Kaçak Mı? (Sanayide Dolandırılmayın)",
      "content": "Sanayiye aracınızı götürdüğünüzde, lifte kaldırılan arabanın altında siyah bir leke gören usta hemen panikle, \"Abi motor yağ kaçırıyor, motoru indirmemiz lazım, 30.000 TL masrafı var\" diyebilir. Burada bilmeniz gereken en kritik kavram 'terleme'dir.",
      "subsections": [
        {
          "subtitle": "Yağ Terlemesi (Sweating) Nedir?",
          "text": "Motor contaları zamanla ısı ve soğuma döngüleri yüzünden esnekliğini kaybeder. Etrafında hafif siyah bir yağ sisi veya çamurlaşmış toz tabakası birikir. Ancak bu tabaka yere **DAMLA DAMLA akmıyorsa**, sadece yüzeyi kirletmişse buna terleme denir.",
          "points": [
            "**Normaldir:** Özellikle 10 yaşın ve 150.000 km'nin üzerindeki turbo dizel araçların çoğunda karter veya hortum etrafında terleme olması son derece normaldir.",
            "**Müdahale Gerekmez:** Eğer aracınız periyodik bakımdan bakıma (10.000 km'de) 1 litreden daha az yağ eksiltiyorsa, bu terleme için motor indirmeye, on binlerce lira harcamaya gerek yoktur.",
            "**Gerçek Kaçak:** Gerçek kaçak; aracın altına karton koyduğunuzda ertesi sabah o kartonda 5-6 damla belirgin yağ lekesi gördüğünüz durumdur. Acil müdahale gerektirir."
          ]
        }
      ]
    },
    {
      "type": "section",
      "title": "3. Kırmızı Yağdanlık İkazı: Motorun 5 Saniyelik Ölüm Fermanı",
      "content": "Sürüş esnasında gösterge panelinde pek çok arıza lambası yanabilir (Motor arıza lambası, silecek suyu, lastik basıncı vb.). Bunların %90'ı sarı renklidir ve \"dikkatli sür, servise git\" demektir. Ancak ekranda yanan **Kırmızı Yağdanlık Lisesi**, aracın kalbinin durmak üzere olduğunu söyler.",
      "subsections": [
        {
          "subtitle": "Yağ Seviyesi Değil, Yağ 'Basıncı' Sıfırlandı!",
          "text": "Acemilerin en büyük yanılgısı bu lambayı \"Yağ azaldı, birazdan üzerine eklerim\" diye yorumlamasıdır. Oysa o lamba yağ miktarını değil, **yağ basıncını** ölçer. Lamba yandığında karterdeki yağı pompalayan yağ pompası bozulmuş, yağ tamamen boşalmış veya filtre patlamış demektir.",
          "points": [
            "**Metal Metale Sürtünme:** Basınç bittiğinde motorun içindeki pistonlar, krank mili ve yataklar (saniyede yüzlerce kez dönen parçalar) yağsız kalır.",
            "**5 Saniye Kuralı:** O lambayı gördüğünüz an müzik kapatın, sağa sinyal verin ve aracı güvenli bir şekilde emniyet şeridine çekip anında **KONTAĞI KAPATIN.**",
            "**Asla Sürmeyin:** \"Şurada 2 kilometre ileride sanayi var, yavaş yavaş giderim\" derseniz, o 2 kilometrenin sonunda motorunuz büyük bir gürültüyle kilitlenir (yatak sarar) ve motoru çöpe atmak zorunda kalırsınız (Güncel maliyeti 150.000 TL+). Çekici çağırmak 2.000 TL'dir."
          ]
        }
      ],
      "warning": {
        "title": "⚠️ Sarı vs Kırmızı Yağdanlık",
        "text": "Eğer yağdanlık simgesi SARI renkli yanıyorsa, \"Sensör yağın biraz azaldığını söylüyor, en kısa sürede 1 litre yağ ekle\" demektir. KIRMIZI renkli yanıyorsa \"Yağ basıncı durdu, saniyeler içinde motoru durdur\" demektir."
      }
    },
    {
      "type": "section",
      "title": "4. En Yaygın Yağ Kaçağı Noktaları ve Beklenen Maliyetler",
      "content": "Aracınız yağ damlatıyorsa, sorunun kaynağı %99 ihtimalle aşağıdaki 5 noktadan biridir. Bunların bazısı çok ucuzken, bazıları ağır işçilik gerektirir.",
      "subsections": [
        {
          "subtitle": "A. Külbütör Kapağı Contası (Ucuz ve Basit)",
          "text": "Motorun en tepesindeki plastik/metal kapağın contasıdır. Sızıntı motorun dışından bloğa doğru akar. Parça ve işçilik çok ucuzdur (1-2 bin TL arası).",
          "points": []
        },
        {
          "subtitle": "B. Yağ Filtresi ve Tapa (Bedava veya Çok Ucuz)",
          "text": "Bakım esnasında usta yağ filtresini tam sıkmamışsa, O-ring contasını koparmışsa veya karterin altındaki boşaltma vidasını (tapa) yalama yapmışsa yağ sızar. Tapa değiştirilerek 500 TL'ye çözülür.",
          "points": []
        },
        {
          "subtitle": "C. Krank Keçeleri (İşçilik Felaketi)",
          "text": "Motor ile şanzımanın birleştiği o devasa aralıktan yağ damlıyorsa, arka krank keçesi patlamıştır. Keçenin kendisi 500 TL'dir ancak o keçeyi değiştirmek için şanzımanın ve bazen motorun indirilmesi gerekir. İşçilik 10.000 TL'yi bulabilir.",
          "points": []
        },
        {
          "subtitle": "D. Yağ Soğutucusu Patlaması (Ölümcül Tehlike)",
          "text": "Yağ soğutucusu (eşanjör) patlarsa, motor yağı arabanın su (antifriz) sistemine karışır. Su yedek deponuzu açtığınızda tahin/mayonez kıvamında çamurlu bir yağ görürsünüz. Motor hararet yapar. Derhal parça değişmeli ve soğutma sistemi 3-4 kez ilaçla yıkanmalıdır.",
          "points": []
        }
      ]
    },
    {
      "type": "section",
      "title": "5. Adım Adım Acil Durum Eylem Planı (Yolda Kalınca)",
      "content": "Aracınızın altına baktınız ve bir yağ göleti gördünüz. İşte adım adım yapmanız gerekenler:",
      "subsections": [
        {
          "subtitle": "Adım 1: Motoru Durdurun ve Çubuğu Çekin",
          "text": "Motor kapalıyken kaputu açın ve sarı/kırmızı renkli yağ çubuğunu çekin. Temiz bir peçeteyle silin, tam dibe kadar sokun ve tekrar çekin. Yağ seviyesi MIN ve MAX çizgileri arasında mı? Yoksa çubuğun ucu kupkuru mu?",
          "points": []
        },
        {
          "subtitle": "Adım 2: Çubuk Kuruysa Marşa Dokunmayın",
          "text": "Eğer çubuğun ucunda yağ göremiyorsanız, motorun içinde yağ kalmamış demektir. Asla \"Acaba çalışıyor mu?\" diye marş basmayın. O tek bir marş basma hareketi bile silindirlere kalıcı zarar verir.",
          "points": []
        },
        {
          "subtitle": "Adım 3: Bagajdaki Yağ Yanılgısı",
          "text": "Bagajınızda 1 litre yedek yağınız varsa ve kaçağın kaynağı devasa bir delikse (örneğin karteri taşa vurduysanız), o yağı ekleseniz bile 100 metre ileride o yağ da yere akacaktır. Altını vurduysanız direkt çekici çağırın.",
          "points": []
        }
      ]
    },
    {
      "type": "section",
      "title": "6. İnce Yağ Kullanımının Yaşlı Motorlardaki Etkisi",
      "content": "Ustaların sıkça yaptığı bir hata, sırf kitapçıkta yazıyor diye 20 yaşındaki, 300.000 kilometredeki bir araca su gibi incecik (0W-20 veya 5W-30) tam sentetik yağ koymaktır.",
      "subsections": [
        {
          "subtitle": "Aşınmış Metal, İnce Yağ",
          "text": "Yüz binlerce kilometre boyunca çalışan motor blokları ve contalar mikroskobik olarak genişler ve aşınır. Bu genişleyen aralıklara çok ince bir yağ koyarsanız, o yağ molekülleri contaların arasından sızıp kaçmaya, terlemeye ve damlamaya başlar.",
          "points": [
            "**Geçiş Yapın:** Eğer eski bir aracınız varsa ve kaliteli 5W-30 yağ koyduğunuzda araba her yerden yağ terletmeye veya eksiltmeye başladıysa (kaçak olmadığı halde), ustanıza danışarak bir tık daha kalın bir yağa (örneğin 10W-40) geçiş yapın. Kalın yağ, yorgun contalardan daha zor sızar ve sızıntılarınız bir anda kesilebilir."
          ]
        }
      ]
    },
    {
      "type": "conclusion",
      "title": "Sonuç: Lekeleri Okumayı Öğrenin",
      "content": "Otoparktan çıkarken aracınızın park ettiği yere bir saniyelik geriye dönük bakış atmak, sadece usta ve bilinçli sürücülerin yaptığı bir reflekstir. Yerdeki siyah bir leke, size motorunuzun kalbinde oluşan ve binlerce liraya mal olacak bir damar çatlamasını aylar öncesinden haber veriyor olabilir.\n\nSıvının rengini tanıyın, terleme ile damlamayı birbirinden ayırın ve kırmızı yağdanlık simgesine asla bir kilometre bile müsamaha göstermeyin. Bagajınızda daima aracınıza uygun vizkozitede (örneğin 5W-30) 1 litrelik yedek motor yağı bulundurmak, sizi dağ başında çaresizce saatlerce çekici beklemekten kurtaracak en ucuz sigortadır.",
      "finalChecklist": [
        "Kırmızı yağ lambası yandığında aracı SIFIR TEREDDÜTLE stop etme kuralı anlaşıldı mı?",
        "Sıvıların renk kodu (Siyah=Motor, Kırmızı=Şanzıman, Parlak=Antifriz) öğrenildi mi?",
        "Terleme ile gerçek damlama (kaçak) arasındaki o pahalı fark idrak edildi mi?",
        "Karter muhafazası (alt koruma sacı) olmayan araçların taşa vurma riskinin ölümcül olduğu biliniyor mu?"
      ]
    }
  ]
};

data.guides[guideIndex] = updatedGuide;
fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
console.log('Update successful');
