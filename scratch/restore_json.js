const fs = require('fs');
const path = require('path');

const signsDir = path.join(__dirname, '../public/signs');

const missingSvgs = {
  'B-5': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <rect width="100" height="100" rx="8" fill="#003e8d" />
    <rect x="10" y="10" width="80" height="80" rx="4" fill="#fff" />
    <path d="M 30,55 H 70 V 65 H 30 Z" fill="#003e8d" />
    <path d="M 35,65 V 80 M 65,65 V 80 M 35,55 V 45" stroke="#003e8d" stroke-width="5" />
    <path d="M 50,20 V 40 M 40,30 H 60" stroke="#e3000f" stroke-width="8" />
  </svg>`,
  'B-6': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <rect width="100" height="100" rx="8" fill="#003e8d" />
    <rect x="10" y="10" width="80" height="80" rx="4" fill="#fff" />
    <rect x="40" y="25" width="20" height="40" rx="2" fill="#000" />
    <circle cx="50" cy="35" r="4" fill="#fff" />
    <path d="M 60,45 H 70 V 30 C 70,25 65,25 65,30 V 45" fill="none" stroke="#000" stroke-width="4" stroke-linejoin="round" stroke-linecap="round" />
    <rect x="35" y="65" width="30" height="10" fill="#000" />
  </svg>`,
  'P-1': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <rect width="100" height="100" rx="8" fill="#003e8d" />
    <path d="M 35,80 V 25 H 55 C 75,25 75,55 55,55 H 45 V 80 Z M 45,35 V 45 H 55 C 60,45 60,35 55,35 Z" fill="#fff" />
  </svg>`,
  'P-2': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <rect width="100" height="100" rx="8" fill="#003e8d" />
    <path d="M 35,80 V 35 H 55 C 75,35 75,60 55,60 H 45 V 80 Z M 45,45 V 50 H 55 C 60,50 60,45 55,45 Z" fill="#fff" />
    <path d="M 20,30 L 50,15 L 80,30" fill="none" stroke="#fff" stroke-width="8" stroke-linejoin="round" />
  </svg>`,
  'P-3': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <rect width="100" height="100" rx="8" fill="#003e8d" />
    <path d="M 20,50 V 20 H 40 C 60,20 60,50 40,50 H 30 V 50 Z M 30,30 V 40 H 40 C 45,40 45,30 40,30 Z" fill="#fff" />
    <path d="M 50,80 V 50 L 65,70 L 80,50 V 80 M 65,70 V 80" fill="none" stroke="#e3000f" stroke-width="8" stroke-linejoin="round" />
  </svg>`,
  'P-4': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <rect width="100" height="100" rx="8" fill="#003e8d" />
    <path d="M 25,60 V 20 H 40 C 55,20 55,45 40,45 H 35 V 60 Z M 35,30 V 35 H 40 C 45,35 45,30 40,30 Z" fill="#fff" />
    <circle cx="65" cy="50" r="15" fill="none" stroke="#fff" stroke-width="6" />
    <path d="M 65,35 V 50 H 80 M 65,35 L 55,45" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />
    <circle cx="65" cy="30" r="4" fill="#fff" />
  </svg>`,
  'TT-34': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="45" fill="#fff" stroke="#e3000f" stroke-width="10" />
    <path d="M 65,65 H 45 C 35,65 35,50 45,50 H 70" fill="none" stroke="#000" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M 45,40 L 30,50 L 45,60 Z" fill="#000" />
    <path d="M 20,80 L 80,20" stroke="#e3000f" stroke-width="10" />
  </svg>`,
  'TT-35': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="45" fill="#fff" stroke="#e3000f" stroke-width="10" />
    <path d="M 35,65 H 55 C 65,65 65,50 55,50 H 30" fill="none" stroke="#000" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M 55,40 L 70,50 L 55,60 Z" fill="#000" />
    <path d="M 20,80 L 80,20" stroke="#e3000f" stroke-width="10" />
  </svg>`
};

for (const [id, svg] of Object.entries(missingSvgs)) {
  fs.writeFileSync(path.join(signsDir, id + '.svg'), svg);
  console.log('Generated ' + id + '.svg');
}

// Restore JSON
const dataFile = path.join(__dirname, '../data/trafik_isaretleri.json');

const fullJson = {
  "categories": [
    {
      "id": "tehlike_uyari",
      "name": "Tehlike Uyarı İşaretleri (T Serisi)",
      "description": "Sürücüleri yol üzerindeki tehlikeler konusunda uyarır. Genellikle eşkenar üçgen şeklindedir ve kırmızı vişne çürüğü çerçevesi vardır.",
      "signs": [
        { "id": "T-1", "name": "Sola Tehlikeli Viraj", "image": "/signs/T-1.svg", "description": "İleride sola dönen tehlikeli bir viraj olduğunu bildirir. Hız azaltılmalı ve sollama yapılmamalıdır." },
        { "id": "T-2", "name": "Sağa Tehlikeli Viraj", "image": "/signs/T-2.svg", "description": "İleride sağa dönen tehlikeli bir viraj olduğunu bildirir. Hız azaltılmalı ve sollama yapılmamalıdır." },
        { "id": "T-3", "name": "Sola Tehlikeli Devamlı Virajlar", "image": "/signs/T-3.svg", "description": "İlki sola olmak üzere ardı ardına devam eden tehlikeli virajları bildirir." },
        { "id": "T-4", "name": "Sağa Tehlikeli Devamlı Virajlar", "image": "/signs/T-4.svg", "description": "İlki sağa olmak üzere ardı ardına devam eden tehlikeli virajları bildirir." },
        { "id": "T-5", "name": "Tehlikeli Eğim (İniş)", "image": "/signs/T-5.svg", "description": "İleride %10 veya daha fazla iniş eğimli bir yol kesimi olduğunu bildirir. Vites küçültülmelidir." },
        { "id": "T-6", "name": "Tehlikeli Eğim (Çıkış)", "image": "/signs/T-6.svg", "description": "İleride %10 veya daha fazla çıkış eğimli bir yol kesimi olduğunu bildirir." },
        { "id": "T-7", "name": "Her İki Taraftan Daralan Kaplama", "image": "/signs/T-7.svg", "description": "İleride yolun her iki taraftan daralacağını bildirir." },
        { "id": "T-8", "name": "Sağdan Daralan Kaplama", "image": "/signs/T-8.svg", "description": "İleride yolun sağ taraftan daralacağını bildirir." },
        { "id": "T-11", "name": "Kasisli Yol", "image": "/signs/T-11.svg", "description": "İleride hendek, kasis, çukur gibi yol yüzeyi bozuklukları olduğunu bildirir. Hız azaltılmalıdır." },
        { "id": "T-12", "name": "Kaygan Yol", "image": "/signs/T-12.svg", "description": "Yağmur, kar, buz veya döküntü nedeniyle yolun kaygan olabileceğini bildirir. Sert fren ve direksiyon manevralarından kaçınılmalıdır." },
        { "id": "T-13", "name": "Gevşek Malzemeli Zemin", "image": "/signs/T-13.svg", "description": "Yol üzerinde gevşek malzeme (mıcır vb.) bulunduğunu ve öndeki araçlardan taş sıçrayabileceğini bildirir. Takip mesafesi artırılmalıdır." },
        { "id": "T-14", "name": "Gevşek Şev", "image": "/signs/T-14.svg", "description": "Yarma şevlerinden yola taş veya kaya düşebileceğini bildirir." },
        { "id": "T-15", "name": "Yaya Geçidi", "image": "/signs/T-15.svg", "description": "İleride yaya geçidi bulunduğunu bildirir. Hız azaltılmalı, yayalara ilk geçiş hakkı verilmelidir." },
        { "id": "T-16", "name": "Okul Geçidi", "image": "/signs/T-16.svg", "description": "İleride okul geçidi bulunduğunu bildirir. Hız düşürülmeli ve öğrencilere ilk geçiş hakkı verilmelidir." },
        { "id": "T-18", "name": "Ehli Hayvan Geçebilir", "image": "/signs/T-18.svg", "description": "Yola ehli (evcil/çiftlik) hayvan çıkabileceğini bildirir." },
        { "id": "T-19", "name": "Vahşi Hayvan Geçebilir", "image": "/signs/T-19.svg", "description": "Yola vahşi hayvan çıkabileceğini bildirir." },
        { "id": "T-20", "name": "Yolda Çalışma Var", "image": "/signs/T-20.svg", "description": "İleride yapım, bakım veya onarım çalışması olduğunu bildirir." },
        { "id": "T-21", "name": "Işıklı İşaret Cihazı", "image": "/signs/T-21.svg", "description": "İleride trafik ışıkları olduğunu bildirir. Genellikle yüksek hızla yaklaşılan kavşaklardan önce konur." },
        { "id": "T-23", "name": "İki Yönlü Trafik", "image": "/signs/T-23.svg", "description": "Bölünmüş yoldan (çift şeritli), iki yönlü (gidiş-geliş) trafiğin olduğu yola girileceğini bildirir." },
        { "id": "T-24", "name": "Dikkat", "image": "/signs/T-24.svg", "description": "Tehlike uyarı işaretleriyle belirtilen tehlikeler dışında kalan, tanımlanmamış başka tehlikelerin olabileceğini bildirir." },
        { "id": "T-26", "name": "Kontrolsüz Kavşak", "image": "/signs/T-26.svg", "description": "İleride, sağdan gelen aracın geçiş hakkına sahip olduğu kontrolsüz bir kavşak bulunduğunu bildirir." },
        { "id": "T-27", "name": "Ana Yol Tali Yol Kavşağı", "image": "/signs/T-27.svg", "description": "Ana yolda seyreden sürücüye, ileride sağdan ve soldan tali yolların bağlanacağı bir kavşak olduğunu bildirir." },
        { "id": "T-28", "name": "Dönel Kavşak Yaklaşımı", "image": "/signs/T-28.svg", "description": "İleride dönel kavşak bulunduğunu bildirir. Ada içindeki araca yol verilmelidir." },
        { "id": "T-30", "name": "Kontrollü Demiryolu Geçidi", "image": "/signs/T-30.svg", "description": "İleride bariyerle veya ışıkla kontrol edilen bir hemzemin geçit (demiryolu) olduğunu bildirir." },
        { "id": "T-31", "name": "Kontrolsüz Demiryolu Geçidi", "image": "/signs/T-31.svg", "description": "İleride bariyersiz, kontrolsüz bir hemzemin geçit olduğunu bildirir. Trenin gelip gelmediği kontrol edilmelidir." }
      ]
    },
    {
      "id": "trafik_tanzim",
      "name": "Trafik Tanzim İşaretleri (TT Serisi)",
      "description": "Trafik akışını düzenler, yasaklar ve kısıtlamalar getirir. Genellikle yuvarlaktır ve uymamak asli kusur/ceza sebebidir.",
      "signs": [
        { "id": "TT-1", "name": "Yol Ver", "image": "/signs/TT-1.svg", "description": "Tali yoldan ana yola çıkan veya kavşağa yaklaşan araçların diğer yönden gelen araçlara geçiş hakkı vermesi gerektiğini bildirir. Ters üçgendir." },
        { "id": "TT-2", "name": "Dur", "image": "/signs/TT-2.svg", "description": "Kavşağa girmeden önce mutlaka tamamen durulması ve yolun müsait olduğu kontrol edildikten sonra geçilmesi gerektiğini bildirir. Sekizgendir." },
        { "id": "TT-3", "name": "Karşıdan Gelene Yol Ver", "image": "/signs/TT-3.svg", "description": "Yolun daraldığı veya köprü gibi yerlerde, karşı yönden gelen araçlara öncelik verilmesi gerektiğini bildirir." },
        { "id": "TT-4", "name": "Taşıt Trafiğine Kapalı Yol", "image": "/signs/TT-4.svg", "description": "Yolun her iki yönden de (yaya dışındaki) motorlu ve motorsuz tüm taşıtların trafiğine kapalı olduğunu bildirir." },
        { "id": "TT-5", "name": "Girişi Olmayan Yol", "image": "/signs/TT-5.svg", "description": "Ters yön veya tek yönlü sokakların ters girişini belirtir. Bu yönden yola girilmesi yasaktır." },
        { "id": "TT-6", "name": "Motorlu Taşıt Giremez", "image": "/signs/TT-6.svg", "description": "Motosikletler hariç motorlu taşıtların girmesinin yasak olduğunu bildirir." },
        { "id": "TT-8", "name": "Motosiklet Giremez", "image": "/signs/TT-8.svg", "description": "Bu yola motosikletlerin girmesinin yasak olduğunu bildirir." },
        { "id": "TT-9", "name": "Bisiklet Giremez", "image": "/signs/TT-9.svg", "description": "Bu yola bisikletlerin girmesinin yasak olduğunu bildirir." },
        { "id": "TT-16", "name": "Yaya Giremez", "image": "/signs/TT-16.svg", "description": "Otoyollar veya tehlikeli alt geçitler gibi yayaların girmesinin yasak olduğu yerleri bildirir." },
        { "id": "TT-21", "name": "Genişliği Belirtilenden Fazla Olan Taşıt Giremez", "image": "/signs/TT-21.svg", "description": "Tabelada yazan metreden daha geniş araçların o yola veya köprüye girmesinin yasak olduğunu bildirir." },
        { "id": "TT-22", "name": "Yüksekliği Belirtilenden Fazla Olan Taşıt Giremez", "image": "/signs/TT-22.svg", "description": "Alt geçit ve tünellerde, tabelada yazan metreden daha yüksek araçların girmesinin (sıkışacağı için) yasak olduğunu bildirir." },
        { "id": "TT-25", "name": "Öndeki Taşıtı Geçmek Yasaktır (Sollama Yasağı)", "image": "/signs/TT-25.svg", "description": "Yol görüşünün az olduğu veya tehlikeli yerlerde araçların önlerindeki diğer motorlu araçları geçmesinin yasak olduğunu bildirir." },
        { "id": "TT-26", "name": "Kamyonlar İçin Öndeki Taşıtı Geçmek Yasaktır", "image": "/signs/TT-26.svg", "description": "Kamyon veya çekici türü ağır vasıtaların sollama yapmasının yasak olduğunu bildirir." },
        { "id": "TT-27", "name": "Azami Hız Sınırlaması", "image": "/signs/TT-27.svg", "description": "Tabelada belirtilen kilometre/saat hızından daha yüksek bir hızda seyredilmesinin yasak olduğunu (Radarı) bildirir." },
        { "id": "TT-28", "name": "Sesli İkaz Cihazlarının Kullanımı Yasaktır", "image": "/signs/TT-28.svg", "description": "Hastane, okul veya hassas bölgelerde korna çalınmasının yasak olduğunu bildirir." },
        { "id": "TT-30", "name": "Geçme Yasağı Sonu", "image": "/signs/TT-30.svg", "description": "Daha önce konulmuş olan 'Sollama Yasağı' kısıtlamasının bittiğini ve sollama yapılabileceğini bildirir." },
        { "id": "TT-31", "name": "Hız Sınırlaması Sonu", "image": "/signs/TT-31.svg", "description": "Daha önce konulmuş olan azami hız kısıtlamasının sona erdiğini bildirir." },
        { "id": "TT-32", "name": "Bütün Yasaklama ve Kısıtlamaların Sonu", "image": "/signs/TT-32.svg", "description": "Daha önce konulmuş olan her türlü hız, sollama gibi yasak ve kısıtlamaların sona erdiğini bildirir." },
        { "id": "TT-34", "name": "Sola Dönülmez", "image": "/signs/TT-34.svg", "description": "Kavşakta sola dönmenin yasak olduğunu bildirir." },
        { "id": "TT-35", "name": "Sağa Dönülmez", "image": "/signs/TT-35.svg", "description": "Kavşakta sağa dönmenin yasak olduğunu bildirir." },
        { "id": "TT-36", "name": "İleri Mecburi Yön", "image": "/signs/TT-36.svg", "description": "Kavşakta araçların sağa veya sola dönemeyeceğini, sadece düz gitmesi gerektiğini bildirir." },
        { "id": "TT-39", "name": "U Dönüşü Yapılmaz", "image": "/signs/TT-39.svg", "description": "U dönüşü yapmanın yasak olduğunu bildirir." }
      ]
    },
    {
      "id": "bilgi_isaretleri",
      "name": "Bilgi İşaretleri (B Serisi)",
      "description": "Sürücülere yol, yerleşim yerleri, hizmet tesisleri ve kurallar hakkında bilgi verir. Genellikle mavi veya yeşil kare/dikdörtgendir.",
      "signs": [
        { "id": "B-1", "name": "Durak", "image": "/signs/B-1.svg", "description": "Otobüs, minibüs veya tramvay gibi toplu taşıma araçlarının durak yerini bildirir." },
        { "id": "B-2", "name": "Okul Geçidi (Bilgi)", "image": "/signs/B-2.svg", "description": "Okul geçidinin bulunduğu tam noktayı gösterir." },
        { "id": "B-3", "name": "Hastane", "image": "/signs/B-3.svg", "description": "Yakınlarda bir hastane bulunduğunu ve gürültü yapılmaması gerektiğini bildirir." },
        { "id": "B-4", "name": "Tek Yönlü Yol", "image": "/signs/B-4.svg", "description": "Gidilen sokağın veya caddenin sadece tek yönlü (ok istikametinde) olduğunu bildirir." },
        { "id": "B-5", "name": "Hastane Tesisleri", "image": "/signs/B-5.svg", "description": "Tesis veya hastane alanını gösterir." },
        { "id": "B-6", "name": "Akaryakıt İstasyonu", "image": "/signs/B-6.svg", "description": "Yakınlarda akaryakıt istasyonu olduğunu bildirir." },
        { "id": "B-7", "name": "Restoran / Lokanta", "image": "/signs/B-7.svg", "description": "Yakınlarda yemek yenilebilecek bir tesis olduğunu bildirir." }
      ]
    },
    {
      "id": "duraklama_parketme",
      "name": "Duraklama ve Parketme İşaretleri (P Serisi)",
      "description": "Araçların park etme ve duraklama kurallarını belirtir. Yuvarlak mavi/kırmızı veya kare mavi/beyazdır.",
      "signs": [
        { "id": "P-1", "name": "Park Yeri", "image": "/signs/P-1.svg", "description": "Araçların park etmesi için ayrılmış alanı gösterir." },
        { "id": "P-2", "name": "Kapalı Park Yeri", "image": "/signs/P-2.svg", "description": "Araçların park etmesi için ayrılmış kapalı alanı gösterir." },
        { "id": "P-3", "name": "Metro Park Yeri", "image": "/signs/P-3.svg", "description": "Metro istasyonuna ait park yerini gösterir." },
        { "id": "P-4", "name": "Engelli Park Yeri", "image": "/signs/P-4.svg", "description": "Sadece engelli araçlarının park edebileceği alanı gösterir." }
      ]
    }
  ]
};

fs.writeFileSync(dataFile, JSON.stringify(fullJson, null, 2));
console.log('Restored JSON with all 58 items!');
