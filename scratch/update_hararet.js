const fs = require('fs');

const filePath = 'public/data/library_guides.json';
const fileContents = fs.readFileSync(filePath, 'utf8');
const data = JSON.parse(fileContents);

const guideIndex = data.guides.findIndex(g => g.id === 'guide_hararet');

if (guideIndex === -1) {
    console.error('Guide not found');
    process.exit(1);
}

const updatedGuide = {
  "id": "guide_hararet",
  "urlId": 10033,
  "title": "Araç Hararet Yaparsa Ne Yapılmalı? Soğutma Krizleri ve Conta Yakma Anatomisi",
  "description": "Göstergedeki hararet ibresi kırmızıya ulaştığında saniyelerle yarışırsınız. Kapağı açarsanız yanarsınız, yola devam ederseniz motoru çöpe atarsınız. Peki harareti anında düşüren o meşhur kalorifer taktiği nasıl uygulanır?",
  "minutes": 25,
  "difficulty": "İleri/Kritik",
  "tags": [
    "Motor",
    "Hararet",
    "Soğutma",
    "Arıza",
    "Kritik",
    "Acil Durum"
  ],
  "author": "OtoSöz Baş Mekaniker",
  "sections": [
    {
      "type": "intro",
      "title": "Kaputun Altındaki Basınçlı Cehennem",
      "content": "İçten yanmalı motorlarda benzin veya dizel yakıt patladığında 2000°C'ye varan devasa ısılar açığa çıkar. Motorun eriyip birbirine kaynamasını engelleyen tek şey, motor bloğunun içindeki kanallarda sirküle eden soğutma sıvısıdır. Bu sistemdeki en ufak bir sızıntı veya mekanik aksaklık, motorun kalbindeki o korkunç ısının metali bükmeye başlamasına, yani \"Hararet\" olayına yol açar.\n\nGöstergedeki hararet ibresi 90°C'yi (veya ortayı) geçip kırmızı bölgeye tırmandığında, artık yolda değil, bir krizin tam ortasındasınız demektir. Yanlış bir müdahale sizi hastanelik edebilir, geç kalınmış bir duruş ise motor bloğunu çatlatıp on binlerce liralık rektifiye faturası çıkarabilir. Bu rehber, kriz anında doğru kararları vermeniz için hazırlandı."
    },
    {
      "type": "section",
      "title": "1. Kritik Uyarı: Radyatör Kapağını ASLA Açmayın!",
      "content": "Hararet yapmış bir aracın kaputundan dumanlar yükselirken, sürücülerin içgüdüsel olarak yaptığı ilk şey kaputu açıp genleşme kabı (su deposu) kapağını çevirmektir. Bu, yapılabilecek en ölümcül hatadır.",
      "subsections": [
        {
          "subtitle": "Buhar Bombası ve 3. Derece Yanıklar",
          "text": "Fizik kuralı gereği, basınç altındaki sıvıların kaynama noktası yükselir. Aracınız hararet yaptığında içerideki su 120-130°C'dedir ancak kapalı sistem basıncı nedeniyle tam kaynayıp buharlaşamamıştır. Siz o kapağı hafifçe bile çevirdiğiniz an...",
          "points": [
            "**Basınç Patlaması:** Kapağı açtığınız an sistemdeki basınç aniden sıfırlanır ve o 130 derecelik su, saniyenin onda biri sürede şiddetle kaynayarak yanardağ gibi dışarı fışkırır.",
            "**Müdahale Süresi:** Kapağı açmak veya su eklemek için aracın gölgede en az 40-50 dakika beklemesi, kapağa dokunulduğunda el yakmayacak seviyeye inmesi şarttır.",
            "**Havlu Tekniği:** Eğer kesinlikle açmanız gerekiyorsa (ki önermiyoruz), kapağın üzerine kalın bir havlu örtün ve çok yavaşça (tıss sesini duyarak) basıncın kademeli olarak tahliye olmasını bekleyin."
          ]
        }
      ]
    },
    {
      "type": "section",
      "title": "2. Harareti Anında Düşüren Hayat Kurtarıcı Taktik: Kalorifer Hack'i",
      "content": "Dağ başında, ıssız bir yoldasınız. İbre kırmızıya dayandı ancak sağa çekip güvenle durabileceğiniz hiçbir emniyet şeridi yok. Harareti acilen 1-2 dakika içinde düşürmeniz gerekiyor.",
      "subsections": [
        {
          "subtitle": "Isıyı Kabine Tahliye Etmek",
          "text": "Arabanızın kabinini ısıtan kalorifer sistemi, aslında motorun sıcak suyunu kullanan ikinci bir mini-radyatördür.",
          "points": [
            "**Klimayı Kapatın (A/C OFF):** Klima kompresörü motora ekstra yük bindirir. Hemen kapatın.",
            "**Kaloriferi Sona Açın:** Sıcaklık ayarını EN SICAK (HI) konuma getirin ve fan hızını (üflemeyi) SON KADEME açın. Camları tamamen indirin (çünkü içerisi fırın gibi olacak).",
            "**Nasıl Çalışır?** Bu hamle, motorun içindeki hapsolmuş aşırı ısıyı hızla kabinin içine çeker. Kalorifer peteği devasa bir soğutucu görevi görerek ibrenin gözlerinizin önünde hızla düşmesini sağlayabilir. Sizi güvenli bir yere çekene kadar kurtaracak en önemli taktiktir."
          ]
        }
      ]
    },
    {
      "type": "section",
      "title": "3. Acil Durum Yönetimi: Stop Etmeli Mi, Rölantide Mi Beklemeli?",
      "content": "Hararet uyarısını aldınız ve güvenle sağa çektiniz. Peki motoru hemen kapatmalı mısınız? Duruma göre değişir.",
      "subsections": [
        {
          "subtitle": "Senaryo A: Hortum Patladı, Su Boşaldı (Hemen Stop!)",
          "text": "Eğer kaputun altından yoğun beyaz bir duman (buhar) tütüyorsa, yere şarıl şarıl su akıyorsa sistemde hiç sıvı kalmamış demektir. Su olmayan motoru rölantide çalıştırmak metal sürtünmesinden dolayı motoru anında kilitler. **Kontak anında kapatılmalıdır.**",
          "points": []
        },
        {
          "subtitle": "Senaryo B: Rampa Çıkarken Zorlandı, Su Var (Rölantide Bekle!)",
          "text": "Eğer hortumlar sağlamsa, sadece aşırı trafik veya dik bir rampa çıkarken zorlandığı için ibre sona dayandıysa motoru hemen stop ETMEK ZARARLIDIR.",
          "points": [
            "**Isı Sıkışması:** Hararet yapmış motoru aniden stop ederseniz, devirdaim (su pompası) ve fan durur. Motor bloğunun içindeki su hareketsiz kalır ve ısı tahliye edilemediği için conta o anda yanar.",
            "**Çözüm:** Motoru rölantide çalışır vaziyette bırakın, kaloriferi en sıcağa açın ve fanın/radyatörün suyu soğutarak devirdaim yapmasına izin verin. İbre normale döndüğünde stop edebilirsiniz."
          ]
        }
      ]
    },
    {
      "type": "section",
      "title": "4. Hararetin Gizli Sebepleri: Neden Kaynattı?",
      "content": "Motorun ısınmasına sebep olan teknik arızalar şunlardır:",
      "subsections": [
        {
          "subtitle": "Termostatın Kapalı Kalması (Sinsi Arıza)",
          "text": "Termostat, motor suyu belli bir sıcaklığa gelene kadar suyu motor bloğu içinde tutan, ısındığında ise açılarak suyu radyatöre (soğumaya) gönderen mekanik bir valftir. Eğer termostat arızalanıp KAPALI kalırsa, kaynar su radyatöre gidemez ve saniyeler içinde hararet yapar.",
          "points": [
            "**Teşhis:** Motor hararet yapıyor ama radyatöre giden kalın plastik hortuma dokunduğunuzda soğuksa, su oraya ulaşamıyor (termostat kilitlenmiş) demektir."
          ]
        },
        {
          "subtitle": "Devirdaim (Su Pompası) Çürümesi",
          "text": "Yıllarca sadece musluk suyu konulmuş motorlarda, suyu sirküle eden pompanın metal kanatçıkları paslanıp erir. Pervane döner ama suyu itemez.",
          "points": []
        },
        {
          "subtitle": "Gizli Kabin İçi Kaçaklar (Tatlı Koku)",
          "text": "Arabanın altına hiç su damlamıyor ama su eksiltiyorsa, sağ ön yolcu paspasına bakın. Eğer paspas ıslaksa ve içeride tatlı/şekerli bir koku varsa, kalorifer peteğiniz patlamış ve suyu kabinin içine sızdırıyor demektir."
        }
      ]
    },
    {
      "type": "section",
      "title": "5. Felaket Senaryosu: Conta Yakmak Ne Demektir?",
      "content": "Araç hararet yaptığında sürücü uyarıları dikkate almaz ve \"Bir şey olmaz, az kaldı\" diyerek gaza basmaya devam ederse, sıcaklık 130-140°C'leri geçer. O noktada \"Silindir Kapak Contası\" erir.",
      "subsections": [
        {
          "subtitle": "Motor Bloğunun Çarpılması (Eğilmesi)",
          "text": "Conta yandığında sadece ince bir kağıt/metal parçası erimiş olmaz. Aşırı ısı, motorun döküm demirini veya alüminyum kapağını fiziki olarak büker, yamultur. Kapak taşlanmak üzere tornacıya gitmek zorunda kalır.",
          "points": []
        },
        {
          "subtitle": "Belirti 1: Tahin Kıvamında Yağ (Çikolatalı Süt)",
          "text": "Conta eridiği için soğutma suyu kanalları ile motor yağı kanalları birbirine karışır. Yağ çubuğunu çektiğinizde siyah yağ yerine, köpüklü, tahin renginde iğrenç bir balçık görürsünüz. Motorun tüm damarlarına zehir girmiş demektir.",
          "points": []
        },
        {
          "subtitle": "Belirti 2: Genleşme Kabında Çamur",
          "text": "Motor yağı, yüksek basınçla su sistemine basılır. Su deposunun (genleşme kabının) kapağını açtığınızda su yerine simsiyah yağ çamuru (veya mayonez gibi bir tortu) görüyorsanız geçmiş olsun.",
          "points": []
        },
        {
          "subtitle": "Belirti 3: Egzozdan Beyaz Bulut Atması",
          "text": "Soğutma suyu, contanın eridiği yerden yanma odasına (pistonların üzerine) dökülür ve yakıtla beraber yanar. Aracın egzozundan sis bombası gibi yoğun, tatlı kokulu ve kesintisiz BEYAZ BUHAR atılır."
        }
      ]
    },
    {
      "type": "section",
      "title": "6. Ölümcül Hata: Sıcak Motora Buz Gibi Su Dökmek",
      "content": "Diyelim ki 40 dakika beklediniz, araba biraz soğudu. Kapağı dikkatlice açtınız ve sistemde hiç su kalmadığını gördünüz. O an yanınızdaki buz gibi içme suyunu hararetli motora boca ederseniz ne olur?",
      "subsections": [
        {
          "subtitle": "Termal Şok (Thermal Shock) ve Blok Çatlaması",
          "text": "İçi 120 derece olan metal bir kaba 10 derecelik soğuk su dökerseniz, metal aniden büzüşür. Fizikteki bu 'Termal Şok' etkisi, motor bloğunun tam ortadan \"ÇAT!\" diye çatlamasına veya silindir kapağının kırılmasına yol açar. Bu hasar onarılamaz, motor değişimi gerekir.",
          "points": [
            "**Doğru Ekleme:** Ekleyeceğiniz su mutlaka ılık olmalıdır. Daha da önemlisi, suyu eklerken motor mutlaka **RÖLANTİDE ÇALIŞIYOR** olmalıdır. Böylece eklenen su devirdaim ile yavaş yavaş tüm sisteme dağılır, tek bir noktada şok etkisi yaratmaz."
          ]
        }
      ]
    },
    {
      "type": "conclusion",
      "title": "Sonuç: Hararetle İnatlaşılmaz, Sadece Teslim Olunur",
      "content": "Arabanızın hararet ibresi kırmızıya ulaştığında, motor size kelimenin tam anlamıyla yalvarmaktadır. \"Birkaç kilometre daha giderim\", \"Sadece yokuşu çıkayım\", \"Sanayiye az kaldı\" gibi inatlaşmaların otomotiv dünyasındaki tek karşılığı 50.000 TL ile 150.000 TL arasında değişen ağır motor rektifiye faturalarıdır.\n\nSoğutma sisteminize sadece kışın değil, yaz-kış antifriz koymayı ihmal etmeyin. Çünkü saf musluk suyu 100 derecede kaynar ve köpürürken, kaliteli bir antifriz karışımı basınç altında 130 derecelere kadar kaynamadan dayanabilir. Gözünüz yolda, kulaklarınız seste, arada bir gözünüz de o küçük hararet ibresinde olsun.",
      "finalChecklist": [
        "Hararet anında kaputu açıp su kapağına ASLA dokunulmaması gerektiği anlaşıldı mı?",
        "Kaloriferi sona açarak harareti düşürme (kabin içine ısı tahliyesi) taktiği öğrenildi mi?",
        "Termal şok yaşamamak için sıcak motora soğuk su konulmaması gerektiği idrak edildi mi?",
        "Suyun yağa karıştığı o meşhur 'Tahin/Çikolatalı Süt' görüntüsünün conta yakmak olduğu biliniyor mu?"
      ]
    }
  ]
};

data.guides[guideIndex] = updatedGuide;
fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
console.log('Update successful');
