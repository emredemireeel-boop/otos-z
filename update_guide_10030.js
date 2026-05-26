const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'public', 'data', 'library_guides.json');
const fileContents = fs.readFileSync(filePath, 'utf8');
const data = JSON.parse(fileContents);

const index = data.guides.findIndex(g => g.urlId === 10030);

if (index !== -1) {
    data.guides[index] = {
        "id": "guide_seo_014",
        "title": "Sıfır Araç Alırken Bayide Kurulan 7 Tuzak",
        "description": "Sıfır kilometre bir otomobil almak harika bir his! Ama o parlak showroom'a adım attığınız andan itibaren cüzdanınızı korumanız gereken profesyonel bir satranç maçı başlıyor. Gelin, bayilerin sıkça başvurduğu 7 klasik tuzağı detaylarıyla deşifre edelim.",
        "minutes": 15,
        "difficulty": "Kritik",
        "tags": [
            "Satın Alma",
            "Dolandırıcılık",
            "Finans",
            "Bütçe",
            "İpuçları"
        ],
        "author": "OtoSöz Cüzdan Koruyucuları",
        "sections": [
            {
                "type": "intro",
                "title": "Bayi Her Zaman Sizin Tarafınızda Değildir: Satranç Masasına Hoş Geldiniz!",
                "content": "Sıfır kilometre bir otomobilin o kendine has 'yeni araba kokusunu' içinize çekmek harika bir duygudur, değil mi? O parlak ışıklar altında pırıl pırıl parlayan araçlar, size güler yüzle ikram edilen sıcak kahveler ve bir anda kendinizi çok özel hissetmeniz... Evet, harika bir his ama unutmayın; showroom'a adım attığınız andan itibaren çok profesyonelce kurgulanmış bir satış stratejisinin tam merkezindesiniz.\n\nMüşteri temsilciniz ne kadar tatlı dilli ve yardımcı olursa olsun, günün sonunda bayi kârlılığını maksimize etmekle görevlidir. Onların amacı size en iyi arabayı en ucuza vermek değil, size o arabayı olabilecek en kârlı (kendi açılarından) şekilde satmaktır. Peki, o tatlı heyecanınızın kurbanı olmadan, yıllarca biriktirdiğiniz emeğinizi nasıl koruyabilirsiniz? Türkiye şartlarında bayilerin en sık başvurduğu 7 psikolojik ve finansal tuzağı hep birlikte inceleyelim!"
            },
            {
                "type": "section",
                "title": "1. 'Zorunlu' Aksesuar Paketi Dayatması: Krom Çıtaya 50 Bin TL Vermek?",
                "content": "Özellikle araç stoklarının az olduğu dönemlerde hortlayan ve maalesef günümüzde de inatla devam eden en büyük bayi tuzağı budur.",
                "subsections": [
                    {
                        "subtitle": "Seramik Kaplama, Cam Filmi ve Bagaj Havuzu Üçgeni",
                        "text": "Bayi size şöyle der: 'Beyefendi/Hanımefendi, araç geldi ancak üzerinde seramik kaplama, cam filmi ve yan basamak var. Bu paket zorunlu, fiyatı da 60.000 TL. Almazsanız aracı sırada bekleyen diğer müşteriye vereceğiz.'\n\nBurada çok dikkatli olmalısınız. Dışarıda, profesyonel bir detailing merkezinde, çok daha kaliteli malzemelerle 15-20 bin TL'ye yaptırabileceğiniz bir işlem için sizden 3-4 katı para istenir. Üstelik bayide atılan seramik kaplama çoğu zaman sadece basit bir hızlı ciladan ibarettir.",
                        "points": [
                            "**Nasıl Karşı Çıkılır?**: Türkiye Cumhuriyeti kanunlarına göre, bir malın satışı başka bir malın veya hizmetin satın alınmasına bağlanamaz (Tüketicinin Korunması Hakkında Kanun). Bu durum yasadışıdır.",
                            "**Sihirli Cümle**: 'Bu zorunlu dayatmayı bana yazılı, kaşeli ve imzalı olarak verebilir misiniz? Ticaret Bakanlığı ve Rekabet Kurumu'na durumu bildirmem gerekiyor.' Bu cümleyi kibar ama net bir şekilde söylediğinizde, genellikle 'Müdürüme bir sorayım' diyerek arka odaya gidecekler ve o zorunlu paket bir anda 'sizin için' iptal edilecektir."
                        ]
                    }
                ],
                "tip": {
                    "title": "💡 Aksesuar İstiyorsanız Dışarıya Bakın",
                    "text": "Bayinin sunduğu orijinal kauçuk paspaslar harika olabilir ama internette birebir uyumlu çok daha kaliteli 3D havuzlu paspasları üçte bir fiyatına alabilirsiniz."
                }
            },
            {
                "type": "section",
                "title": "2. Kredi ve '0 Faiz' Oyunları: Sihirbazlık Gösterisi",
                "content": "TV'de, gazetede devasa puntolarla yazan '0 Faiz' veya 'Şimdi Al Seneye Öde' kampanyalarının her zaman görünmeyen, küçük puntolarla yazılmış bir bedeli vardır. Bedava peynir sadece fare kapanında bulunur dostlar.",
                "subsections": [
                    {
                        "subtitle": "Peşin İndirimini Yakma Tuzağı",
                        "text": "Diyelim ki aracın liste fiyatı 1.500.000 TL. Bayi size '300.000 TL için 12 ay %0 faiz' sunuyor. Kulağa harika geliyor, değil mi? Ancak satış danışmanına 'Tamam, ben bu aracı kredili değil de tamamen nakit almak istiyorum' dediğinizde, aracın fiyatının 1.350.000 TL'ye düştüğünü görebilirsiniz!\n\nİşte tuzak burada: O %0 faizli krediyi kullandığınızda, bayi aslında cebinizden çıkması gerekmeyen 150.000 TL'lik o muazzam peşin indirimini iptal eder. Bankadan o parayı %5 faizle çekseniz bile cebinizden çıkacak toplam para daha az olabilir."
                    },
                    {
                        "subtitle": "Kredi Koruma ve Fahiş Hayat Sigortası",
                        "text": "Bayi üzerinden anlaşmalı bankadan kredi kullandığınızda, size bankanın dışarıda sunduğundan çok daha pahalı bir 'Kredi Koruma Sigortası' veya 'Hayat Sigortası' dayatılabilir. Size sanki bu zorunluymuş gibi sunulur.",
                        "points": [
                            "Yasal olarak hayat sigortasını dilediğiniz şirketten kendiniz yaptırıp, bu poliçeyi bankaya sunma hakkınız vardır.",
                            "Banka bunu kabul etmemezlik yapamaz. Dışarıdan yaptıracağınız sigorta %50-60 daha ucuz olabilir."
                        ]
                    }
                ],
                "warning": {
                    "title": "⚠️ Hesap Makinesi Sırdaşınız Olsun",
                    "text": "Bayiye giderken telefonunuzun hesap makinesi mutlaka elinizin altında olsun. Kredili toplam ödeme vs Nakit alım toplam ödemesini her zaman karşılaştırın."
                }
            },
            {
                "type": "section",
                "title": "3. Takas (Trade-in) Tuzağı: Rahatlığın Ağır Bedeli",
                "content": "Eski aracınızı getirip anahtarını masaya bırakmak ve yeni aracınızın anahtarını alıp gitmek... Çok karizmatik ve pratik bir yöntem, değil mi? Ama bayi, bu rahatlığın bedelini size oldukça ağır ödetir.",
                "subsections": [
                    {
                        "subtitle": "Aracınızın Değerini Öldürme Politikası",
                        "text": "Bayinin ikinci el departmanı, aracınıza piyasa değerinin en az %15-20 altında bir fiyat biçecektir. Çünkü o aracı alıp, temizleyip, kâr koyup tekrar satacaklar.\n\nBazen size 'Takas desteğimiz var, aracınıza piyasa fiyatını vereceğiz' derler. Ama bu durumda da sıfır araç için size liste fiyatı üzerinden yapabilecekleri 50.000 TL'lik indirimi asla yapmazlar. Yani cebinize girmesi gereken parayı takas desteği adıyla size satarlar."
                    }
                ],
                "tip": {
                    "title": "💡 Ne Yapmalısınız?",
                    "text": "Aracınızı sarı sitede veya son zamanlarda popüler olan açık artırma / anında alım platformlarında satmak her zaman bayiye vermekten çok daha kârlıdır. 3-4 gün uğraşır ama cebinizde 80-100 bin TL fazladan parayla yeni aracınızı alırsınız."
                }
            },
            {
                "type": "section",
                "title": "4. 'Stokta Son 1 Araç' Psikolojik Baskısı (FOMO)",
                "content": "FOMO (Fear Of Missing Out - Fırsatı Kaçırma Korkusu), tüm dünyada satış temsilcilerinin en sık kullandığı ve en etkili psikolojik silahtır.",
                "subsections": [
                    {
                        "subtitle": "Acele Edin, Diğer Müşteri Kaporayı Gönderiyor!",
                        "text": "Siz tam fiyatı düşünürken satış temsilcisi bilgisayarına bakar, kaşlarını çatar ve şöyle der: 'Şu an sistemde bu araca bakan ve kredi onayı bekleyen başka bir müşteri daha var. Hemen kapora vermezseniz aracı kaçırabilirsiniz.'\n\nBu senaryo büyük ihtimalle (%90 oranında) tamamen uydurmadır. Amacı, sizin düşünme payınızı elinizden almak, sizi başka bayileri aramaktan veya başka markaları gezmekten alıkoymaktır."
                    }
                ],
                "warning": {
                    "title": "⚠️ Sakin Kalın",
                    "text": "Bu numara karşısında asla paniklemeyin. 'Nasip kısmetmiş, o müşteri alırsa biz de başka renklere veya başka markalara bakarız' deyip gülümsediğinizde, o 'hayalet müşterinin' bir anda kredisinin onaylanmadığını ve aracın size kaldığını görebilirsiniz."
                }
            },
            {
                "type": "section",
                "title": "5. Uzatılmış Garanti ve Kasko Şartı",
                "content": "Araç satışı sırasında size sunulan ek hizmetlerin çoğu bayi için çok yüksek kâr marjlı 'tatlı' ürünlerdir.",
                "subsections": [
                    {
                        "subtitle": "Gereksiz Uzatılmış Garanti",
                        "text": "Mevcut 3 yıllık garantiye ek olarak size 'Sadece bugün için çok avantajlı' diyerek 2 yıl uzatılmış garanti satmaya çalışırlar. Ancak uzatılmış garanti sözleşmelerinin o minicik puntolarını okuduğunuzda (örneğin baskı balata, amortisör, elektronik birçok aksam gibi aşınan veya pahalı parçaların kapsama dahil olmaması) aslında çok kısıtlı bir koruma satın aldığınızı görürsünüz.\n\nEğer garanti uzatmayı düşünüyorsanız, sözleşmede nelerin garanti dışında olduğunu satır satır okumadan asla imza atmayın."
                    },
                    {
                        "subtitle": "Kaskoyu Buradan Yapma Zorunluluğu",
                        "text": "Bazı bayiler 'Kredi kullandığınız için kasko ve trafik sigortasını bizden yaptırmak zorundasınız' derler. Bu kesinlikle doğru değildir. İstediğiniz sigorta acentesinden teklif alıp, en uygununu bankaya dain-i mürtehin (rehinli) olarak sunabilirsiniz."
                    }
                ]
            },
            {
                "type": "section",
                "title": "6. Fiyat Sabitleme Yalanı",
                "content": "Türkiye gibi kurun ve vergilerin hareketli olduğu bir ülkede araç yokken sipariş verdiğinizde karşılaştığınız en büyük risktir.",
                "subsections": [
                    {
                        "subtitle": "Kapora Yanılgısı",
                        "text": "Aracın gelmesi 2 ay sürecekse ve siz 50.000 TL kapora verdiyseniz, aracın fiyatını o günkü fiyattan (örneğin 1.200.000 TL) sabitlediğinizi düşünebilirsiniz. Maalesef bu büyük bir yanılgıdır!\n\nAraç gümrükten çekildiği günkü kur ve o gün geçerli olan liste fiyatı geçerli olacaktır. Eğer bayi size sözlü olarak 'Merak etmeyin, zam gelmeden fiyatı bağladık' diyorsa, bu lafa asla güvenmeyin. Bunu mutlaka yazılı, kaşeli ve imzalı bir sözleşmeye dökmelerini isteyin. Çoğu bunu yapmayı kibarca reddedecektir, çünkü risk almak istemezler."
                    }
                ]
            },
            {
                "type": "section",
                "title": "7. Tescil ve Dosya Masrafı Şişirmeleri",
                "content": "Fatura kesim aşamasına geldiğinizde, anahtar teslim fiyatına dahil olan veya olmayan ücretlerdeki karmaşa kafanızı karıştırabilir.",
                "subsections": [
                    {
                        "subtitle": "Görünmeyen 'Takipçi' Ücretleri",
                        "text": "Satış temsilcisi size 'Trafik tescil, ruhsat, plaka basımı ve dosya masrafları için ekstra 15.000 TL vermeniz gerekiyor' diyebilir.\n\nOysa o yılın MTV (Motorlu Taşıtlar Vergisi) tutarı, ruhsat yaprağı bedeli ve noter masrafı kalem kalem internetten araştırılıp toplandığında, bu rakamın çok altında bir sonuçla karşılaşabilirsiniz. Aradaki devasa fark, 'Hizmet Bedeli' veya 'Trafik Takipçi Ücreti' adı altında bayinin cebine gider.\n\nUnutmayın; size resmi faturası, makbuzu veya dekontu verilemeyen hiçbir ekstra ücreti ödemek zorunda değilsiniz."
                    }
                ]
            },
            {
                "type": "conclusion",
                "title": "Özetle: Oyunu Kurallarına Göre Oynayın!",
                "content": "Sıfır araç alma süreci duygusal değil, tamamen mantıksal ve finansal bir süreç olmalıdır. Bu tuzaklara düşmemek için:\n\n* En az 3 farklı bayiden mutlaka yazılı teklif alın. Telefonla verilen fiyatlara değil, PDF veya kağıt üzerindeki tekliflere güvenin.\n* İnternet forumlarında o bayinin şikayetlerini okuyun.\n* 'Zorunlu' denilen hiçbir şeyin kanuni dayanağı olmadığını bilin.\n* Ve en önemlisi; pazarlık masasından kalkabilme cesaretini gösterin.\n\nUnutmayın, o kapıdan arkanıza bakmadan çıktığınızda, çoğu zaman o bayi sizi ertesi gün çok daha gerçekçi ve iyi bir teklifle tekrar arayacaktır. Aklınızı ve cüzdanınızı koruduğunuz, keyifli sürüşler dileriz!",
                "finalChecklist": [
                    "Kredili ve nakit alım senaryolarını hesap makinesiyle karşılaştırın.",
                    "Dayatılan aksesuarları Ticaret Bakanlığı kurallarını hatırlatarak reddedin.",
                    "Sözlü verilen 'Fiyat sabittir' sözlerine güvenmeyin, yazılı sözleşme talep edin.",
                    "Sigorta ve kasko için mutlaka dışarıdaki acentelerden alternatif teklif alın."
                ]
            }
        ]
    };

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log('Successfully updated article 10030');
} else {
    console.log('Article 10030 not found!');
}
