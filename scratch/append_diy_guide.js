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
      "title": "8. Jant Temizliğinde Kola ve Alüminyum Folyo",
      "content": "Pahalı jant temizleyicileri almak yerine, inatçı fren tozu ve pas lekeleri için mutfağınızdaki asitli içecekleri kullanabilirsiniz.",
      "subsections": [
        {
          "subtitle": "Kola ve Folyo Etkisi",
          "text": "Kararmış jantlarınıza veya paslı krom aksamlara bolca Kola dökün (içindeki fosforik asit mükemmel bir pas sökücüdür). Ardından top haline getirdiğiniz bir parça alüminyum folyo ile jantı hafifçe ovalayın. Alüminyum ve kolanın asidi reaksiyona girerek pası anında çözer ve jantlarınızı ayna gibi parlatır."
        }
      ]
    },
    {
      "type": "step",
      "title": "9. Evcil Hayvan Tüyleri İçin Cam Çekçeği",
      "content": "Eğer arabanızda kedi veya köpek taşıyorsanız, koltuklara iğne gibi saplanan tüyleri elektrikli süpürgeyle bile almak imkansız gibidir.",
      "subsections": [
        {
          "subtitle": "Nasıl Uygulanır?",
          "text": "Banyolarda veya cam silerken kullandığınız saplı, plastik uçlu cam çekçeğini alın. Sileceğin ucunu hafifçe suyla nemlendirin ve kumaş koltukların üzerinde yukarıdan aşağıya doğru süpürür gibi çekin. Çekçeğin lastik ucu statik elektrik yaratarak tüm tüyleri rulo halinde toplayıp tek bir noktada biriktirecektir. (Aynı işlem mutfaklarda kullanılan kalın sarı bulaşık eldivenleriyle de yapılabilir.)"
        }
      ]
    },
    {
      "type": "step",
      "title": "10. Silecek Ömrünü Uzatan Vazelin Taktikleri",
      "content": "Silecekleriniz camı çizerken 'gıcırtı' sesi yapıyor veya suyu iz bırakarak siliyorsa hemen yenisini almayın. Sorun lastiklerin kurumasıdır.",
      "subsections": [
        {
          "subtitle": "Yumuşatma İşlemi",
          "text": "Silecek lastiklerini yerinden sökün ve sıcak su dolu bir kovanın içinde 10 dakika bekletip yumuşatın. Ardından bir pamuğa veya beze az miktarda 'Vazelin' (veya bebek yağı) sürerek lastiklerin uçlarına masaj yaparak yedirin. Kuruduktan sonra camı eskisinden bile daha pürüzsüz ve sessiz sildiklerini göreceksiniz."
        }
      ]
    },
    {
      "type": "step",
      "title": "11. Dar Garajlar İçin Havuz Makarnası Tamponu",
      "content": "Arabanızı dar bir garaja park ederken kapıyı açtığınızda duvarın boyasını veya kendi aracınızın kapısını çizmek en can sıkıcı durumlardan biridir.",
      "subsections": [
        {
          "subtitle": "Nasıl Uygulanır?",
          "text": "Yazın denizde kullandığınız silindir şeklindeki uzun sünger 'havuz makarnalarından' birini alın. Makarnayı uzunlamasına tam ortadan ikiye kesin. Düz tarafını garajınızın duvarına, aracınızın kapısının denk geldiği hizaya çift taraflı bant veya silikonla yapıştırın. Artık kapıyı ne kadar hızlı açarsanız açın, yumuşak bir süngere çarpacak ve asla çizilmeyecek."
        }
      ]
    },
    {
      "type": "step",
      "title": "12. Çıkmayan Yapışkan ve Etiket İzlerine Fıstık Ezmesi",
      "content": "Arabanızın camındaki eski HGS/OGS etiketleri, park izin çıkartmaları veya tamponda çocukların yapıştırdığı sticker'lar çıkarıldığında arkasında iğrenç bir yapışkan tabaka bırakır.",
      "subsections": [
        {
          "subtitle": "Fıstık Ezmesi Gücü",
          "text": "Çıkmayan o yapışkanlı bölgenin üzerine kalın bir tabaka halinde yağlı fıstık ezmesi (veya mayonez) sürün. Yaklaşık 15-20 dakika bekletin. İçlerindeki doğal yağlar, kimyasal yapışkanı tamamen çözer. Sürenin sonunda kuru bir kağıt havluyla sildiğinizde yapışkanın tamamen kayıp gittiğini göreceksiniz. (Alternatif olarak WD-40 da aynı işlevi görür)."
        }
      ]
    },
    {
      "type": "step",
      "title": "13. Bardaklık Temizliği İçin Muffin Kalıpları",
      "content": "Orta konsoldaki bardaklıklara dökülen yapışkan kahveler, aralara giren tozlar ve kırıntıları temizlemek çok zordur.",
      "subsections": [
        {
          "subtitle": "Akıllı Tasarım",
          "text": "Evinizdeki silikon kek/muffin kalıplarından iki tanesini aracınızın bardaklık yuvalarına yerleştirin. İçecekleriniz taştığında veya toz biriktiğinde, bu kalıpları tek bir hareketle yerinden çıkarıp yıkayın ve geri koyun. Dip köşe bezle uğraşma devrine son!"
        }
      ]
    }
  ];

  data.guides[guideIndex].sections.push(...additionalSections);

  // Update read time based on new content
  data.guides[guideIndex].minutes += 10;

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log('Appended more DIY tricks successfully!');
} else {
  console.log('Guide not found!');
}
