const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'public', 'data', 'library_guides.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const guideIndex = data.guides.findIndex(g => g.id === 'guide_005');
if (guideIndex !== -1) {
  data.guides[guideIndex] = {
    id: "guide_005",
    title: "Araç Dolandırıcılık Yöntemleri ve Korunma Yolları",
    description: "Sazan sarmalı, sahte dekont, km düşürme, pert gizleme ve dijital dolandırıcılık yöntemlerini tanıyın. Gerçek mağdur hikayeleri ve adım adım korunma rehberiyle paranızı güvene alın.",
    minutes: 18,
    difficulty: "Kritik",
    tags: [
      "Dolandırıcılık",
      "Güvenlik",
      "Sazan Sarmalı",
      "Hukuk",
      "Korunma"
    ],
    author: "Otosöz Güvenlik Uzmanları",
    sections: [
      {
        type: "intro",
        title: "Türkiye'de İkinci El Araç Piyasasındaki Acı Gerçekler",
        content: "Türkiye'de ikinci el araç piyasasında dönen paranın büyüklüğü, her seviyeden dolandırıcının iştahını kabartmaktadır. Emniyet verilerine göre siber suçlardan sonra en çok şikayet alan kategori araç dolandırıcılığıdır. Yöntemler sürekli evrilip dijitalleşse de temel mantık hep aynıdır: Sizin dikkatsizliğiniz, heyecanınız veya 'fırsatı kaçırma' korkunuzdan faydalanmak. Bu rehberde, basit hilelerden organize şebeke işlerine kadar en yaygın dolandırıcılık yöntemlerini ve bunlara karşı kurşun geçirmez savunma tekniklerini bulacaksınız."
      },
      {
        type: "section",
        title: "1. Sazan Sarmalı (Üçgen Dolandırıcılığı)",
        content: "Türkiye'de en çok para kaybettiren, polis kayıtlarında yılda binlerce kez rastlanan en organize dolandırıcılık türüdür.",
        subsections: [
          {
            "subtitle": "Nasıl İşler? (Adım Adım)",
            "text": "Dolandırıcı, gerçek bir ilanı kopyalar ve daha ucuza kendi ilanıymış gibi koyar.",
            "points": [
              "Dolandırıcı (B), Gerçek Satıcıyı (A) arar: 'Aracı alacağım ama şirketten/borçtan dolayı kuzenim gelecek, aramızda anlaştığımız fiyattan bahsetme' der.",
              "Dolandırıcı (B), Alıcıyı (C) arar: 'Aracı satıyorum ama işim çıktı, vekaleti olan kuzenim/ortağım devri verecek, parayı bana (B'ye) atın' der.",
              "Noterde Gerçek Satıcı (A) ve Alıcı (C) buluşur. Birbirleriyle fiyat konuşmazlar çünkü dolandırıcı ikisini de 'ayrı ayrı' tembihlemiştir.",
              "Alıcı (C), parayı Dolandırıcıya (B'ye) gönderir. Satıcı (A) hesabında para görmediği için imzayı atmaz.",
              "Dolandırıcı (B) parayı kripto paraya çevirir veya çeker ve kayıplara karışır. C parasını kaybeder, A aracını satamaz."
            ]
          },
          {
            "subtitle": "Korunma Yolu",
            "text": "Bu tuzağı bozmanın çok basit ama kesin bir kuralı vardır:",
            "points": [
              "ALTIN KURAL: Parayı gönderdiğiniz IBAN sahibi ile Noterde ruhsatı devreden kişinin TC Kimlik numarası / İsmi BİREBİR AYNI olmak zorundadır.",
              "Asla 'Aracı dayım verecek parayı bana at' diyen birine para göndermeyin.",
              "Noterde satıcıyla açıkça 'Fiyatta anlaştık mı, parayı kime gönderiyorum?' diye teyit edin. 'Aramızda ayıp olur' diye bir şey ticarette yoktur."
            ]
          }
        ],
        warning: {
          title: "🚨 Kırmızı Alarm",
          text: "Birisi size 'Noterde fiyattan bahsetme, aramızda ayıp olur' veya 'Borcum var duyulmasın' diyorsa %100 dolandırılıyorsunuz. Hemen işlemi iptal edin."
        }
      },
      {
        type: "section",
        title: "2. Sahte Dekont ve İleri Tarihli EFT Tuzağı",
        content: "Özellikle araç satan kişileri hedef alan, teknoloji destekli bir hırsızlık.",
        subsections: [
          {
            "subtitle": "Photoshop veya Sahte Uygulama",
            "text": "Alıcı size telefonundan 'Para gönderildi' ekranını gösterir. Oysa bu ekran Photoshop ile hazırlanmış veya sahte bir bankacılık uygulaması (APK) üzerinden oluşturulmuştur.",
            "points": [
              "Gösterilen 'Gönderildi' ekranı tamamen sahtedir.",
              "1 TL gönderilip, dekont üzerindeki miktar 1.000.000 TL olarak değiştirilmiş olabilir."
            ]
          },
          {
            "subtitle": "İleri Tarihli EFT/FAST İptali",
            "text": "Alıcı bankadan EFT talimatını verir ancak 'ileri tarihli' (örn: yarın sabah) ayarlar.",
            "points": [
              "Size bankadan 'Talimat verilmiştir' mesajı gelir. Siz imzayı atarsınız.",
              "Alıcı noterden çıkar çıkmaz mobil bankacılıktan talimatı iptal eder. Para hesabınıza asla geçmez."
            ]
          },
          {
            "subtitle": "Korunma Yolu",
            "text": "Parayı garantiye almadan imza atmayın:",
            "points": [
              "KENDİ mobil bankacılığınızı açın ve bakiyenizde artışı GÖZÜNÜZLE görün. Karşı tarafın telefonuna veya SMS'lere güvenmeyin.",
              "Ticaret Bakanlığı'nın zorunlu kıldığı 'Güvenli Ödeme Sistemi'ni kullanın. Para önce devletin havuzuna (escrow) düşer, noter onayıyla anında hesabınıza geçer."
            ]
          }
        ]
      },
      {
        type: "section",
        title: "3. Kapora Dolandırıcılığı",
        content: "Düşük rakamlarla binlerce kişiyi aynı anda dolandırma yöntemidir.",
        subsections: [
          {
            "subtitle": "Klasik Senaryo",
            "text": "Piyasa değerinin %20 altında, kusursuz bir araç ilanı açılır.",
            "points": [
              "Satıcı genellikle güven telkin etmek için 'Askerim, polisim, doktorum, tayinim çıktı acil satılık' yalanını söyler.",
              "Arayanlara 'İlgi çok büyük, bana hemen 5-10 bin TL kapora atarsan ilanı sana ayırırım' denir.",
              "Para gönderildikten 1 saat sonra telefon kapanır, ilan silinir."
            ]
          },
          {
            "subtitle": "Korunma Yolu",
            "text": "Kural çok basit:",
            "points": [
              "Aracı FİZİKSEL olarak görmeden, ruhsat ile satıcının kimliğini eşleştirmeden KİMSEYE 1 TL DAHİ KAPORA GÖNDERMEYİN.",
              "Çok ucuz ilanlar fırsat değil, tuzaktır."
            ]
          }
        ]
      },
      {
        type: "section",
        title: "4. Ağır Hasarlı / Pert Kayıtlı Aracı Gizleme",
        content: "Aracın şasi ve güvenlik geçmişini gizleyerek değerini yapay olarak artırmak.",
        subsections: [
          {
            "subtitle": "Sigorta Şişirmesi Yalanı",
            "text": "Satıcı size 'Araçta sadece tampon değişti ama sigorta şişirmesi yüzünden ağır hasar işlendi' der. Bu, ikinci el piyasasının en büyük yalanıdır.",
            "points": [
              "Hiçbir sigorta şirketi sadece tamponu değişen aracı pert (ağır hasar) ayırmaz. Ağır hasarlı araçların %90'ında şasi, direk, podye veya tavan hasarı vardır.",
              "Ekleme araç: İki farklı aracın ön ve arka kısmının kaynakla birleştirilmesi. Kaza anında araç ikiye bölünür.",
              "Airbag lambası söndürme: Patlayan hava yastıklarının yerine yenisi takılmaz, araya 2 liralık direnç lehimlenir ve kadrandaki uyarı lambası söndürülür. Kaza anında airbag açılmaz."
            ]
          },
          {
            "subtitle": "Korunma Yolu",
            "text": "Geçmişi didik didik edin:",
            "points": [
              "Tramer sorgulamasını SMS (5664) ve e-Devlet üzerinden mutlaka yapın.",
              "Ekspertiz firmasını SİZ seçin. Satıcının önerdiği yere gitmeyin.",
              "Ekspertizde mutlaka 'Airbag Kontrolü' ve 'Şasi Ölçümü' isteyin."
            ]
          }
        ]
      },
      {
        type: "section",
        title: "5. Kilometre (KM) Düşürme Hilesi",
        content: "Aracın daha az kullanılmış gibi gösterilerek 50-100 bin TL daha pahalıya satılmasıdır.",
        subsections: [
          {
            "subtitle": "Nasıl Yapılıyor?",
            "text": "Modern araçlarda bile OBD portuna takılan yazılımlarla kadran kmsi dakikalar içinde düşürülebilir.",
            "points": [
              "280.000 km'deki bir ticari geçmişli araç 120.000 km'ye çekilir.",
              "Fiziksel aşınmayı gizlemek için direksiyon simidi, pedallar ve vites topuzu yenilenir veya kılıf takılır."
            ]
          },
          {
            "subtitle": "Korunma Yolu",
            "text": "Dedektiflik yapmalısınız:",
            "points": [
              "TÜVTÜRK muayene kilometre geçmişini HGS uygulamasından sorgulayın.",
              "Yetkili servis kayıtlarına ulaşın. Bakımda 180.000 yazan araç ilanda 100.000 olamaz.",
              "Gelişmiş OBD testleriyle aracın ABS beyni, Şanzıman beyni veya Klima beynindeki gerçek km okunabilir. (Kadran sıfırlansa bile diğer beyinler unutmaz)."
            ]
          }
        ]
      },
      {
        type: "section",
        title: "6. Galeri / Anlaşmalı Ekspertiz Kumpası",
        content: "Satış sürecinde aracı gözden ayırdığınızda başınıza gelebilecekler.",
        subsections: [
          {
            "subtitle": "Parça Değişimi (Swap)",
            "text": "Aracı ekspertize sokup 'temiz' raporu alırsınız. Ancak noter satışına kadar geçen 1-2 saatte:",
            "points": [
              "Araçtaki sıfır lastikler sökülüp kabak lastikler takılır.",
              "Katalitik konvertör (çok değerli bir parçadır) sökülüp içi boşaltılır.",
              "Orijinal akü sökülüp bitik akü konur."
            ]
          },
          {
            "subtitle": "Korunma Yolu",
            "text": "Aracı ekspertizden sonra GÖZÜNÜZÜN ÖNÜNDEN AYIRMAYIN. Ekspertiz biter bitmez araca binip notere doğrudan birlikte gidin. Akü ve lastik markalarının fotoğraflarını çekin."
          }
        ]
      },
      {
        type: "section",
        title: "7. Kiralık Araç ve Vekalet Dolandırıcılığı",
        content: "Ruhsat sahibinin dışında yapılan satış işlemlerinde dönen oyunlar.",
        subsections: [
          {
            "subtitle": "Kiralık Aracı Satmak",
            "text": "Dolandırıcı aracı Rent A Car firmasından kiralar. Sahte kimlik ve belgelerle sanki şirket aracıymış gibi ucuz fiyata satışa sunar. Sizi inandırmak için sahte vekaletname bile ayarlarlar.",
            "points": [
              "Satışı noterde yapamazlar, size 'Vekaletle verelim' derler."
            ]
          },
          {
            "subtitle": "Korunma Yolu",
            "text": "Araç devrini NOTERDE resmi olarak üzerinize geçirmeden para ÖDEMEYİN. Genel vekalet ile araç kullanılmaz. Aracın tescil belgesinde (Ruhsat) yazan isim haricinde kimseyle ticaret yapmayın."
          }
        ]
      },
      {
        type: "conclusion",
        title: "Sonuç: Tedbir, Güvenden Üstündür",
        content: "Araç alım-satımında 'ayıp olur', 'kırmayayım', 'fırsatı kaçırmayayım' gibi duygusal tepkiler dolandırıcıların en sevdiği zayıflıklardır. Şüpheci olun, tüm kontrolleri (Tramer, Ekspertiz, Noter Güvenli Ödeme) harfiyen uygulayın. Unutmayın, hiçbir dürüst satıcı sizin bu kontrolleri yapmanızdan rahatsız olmaz; rahatsız olan kişinin mutlaka gizlediği bir şey vardır."
      }
    ]
  };

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log('Successfully updated guide_005');
} else {
  console.log('Could not find guide_005');
}
