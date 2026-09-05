export type QuizMode = "daily" | "weekly";

export interface QuizQuestion {
    id: string;
    category: string;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
}

export const AUTOMOTIVE_QUIZ_QUESTIONS: QuizQuestion[] = [
    { id:"abs-01", category:"Güvenlik", question:"ABS'nin temel görevi nedir?", options:["Fren mesafesini her zeminde yarıya indirmek","Sert frende tekerleklerin kilitlenmesini azaltıp direksiyon hakimiyetini korumaya yardımcı olmak","Motor gücünü artırmak","Lastik basıncını ayarlamak"], correctIndex:1, explanation:"ABS, tekerlek hızını izleyip fren basıncını düzenler; temel faydası sert fren sırasında yön kontrolünü korumaya yardımcı olmasıdır." },
    { id:"dpf-01", category:"Dizel", question:"DPF kısa mesafeli kullanımda neden daha kolay dolar?", options:["Motor yağı soğuduğu için","Egzoz sıcaklığı kurum yakma rejenerasyonu için yeterince yükselmediği için","Yakıt deposu küçüldüğü için","ABS devreye girdiği için"], correctIndex:1, explanation:"Dizel partikül filtresinin kurum yakabilmesi için uygun egzoz sıcaklığı ve sürüş süresi gerekir." },
    { id:"hararet-01", category:"Arıza", question:"Hararet göstergesi kırmızı bölgeye geldiğinde en güvenli ilk hareket hangisidir?", options:["Radyatör kapağını hemen açmak","Aracı güvenli yere çekip motoru durdurmak ve sistem soğumadan kapağı açmamak","Hızı artırmak","Motora soğuk su dökmek"], correctIndex:1, explanation:"Basınçlı sıcak soğutma sistemi ciddi yanık riski taşır. Güvenli yerde durmak ve soğumasını beklemek gerekir." },
    { id:"yag-01", category:"Bakım", question:"Motor yağ basıncı ikazı sürüş sırasında yanarsa ne yapılmalıdır?", options:["Bir sonraki bakıma kadar devam edilir","Güvenli yerde motor durdurulur ve yağ seviyesi/basınç sistemi kontrol edilir","Klima kapatılır","Lastikler şişirilir"], correctIndex:1, explanation:"Yağ basıncı kaybıyla çalışmaya devam etmek çok kısa sürede ağır motor hasarına yol açabilir." },
    { id:"triger-01", category:"Bakım", question:"Triger kayışı değişim aralığı için en doğru kaynak hangisidir?", options:["Her araç için sabit 100.000 km","Sosyal medya yorumu","Aracın üretici bakım planı; kilometre ve süre sınırından önce dolan","Yakıt istasyonu çalışanı"], correctIndex:2, explanation:"Motor ve kayış tipine göre aralık değişir. Üreticinin kilometre/süre şartında önce dolan esas alınır." },
    { id:"p0420-01", category:"OBD", question:"P0420 kodu en çok hangi sistemle ilişkilidir?", options:["Katalitik konvertör verimliliği","Lastik basıncı","Klima gazı","Direksiyon açısı"], correctIndex:0, explanation:"P0420, katalizör sistem verimliliğinin eşik altında algılandığını belirtir; sensör ve kaçak kontrolleri de gerekir." },
    { id:"aku-01", category:"Elektrik", question:"Motor çalışırken akü lambasının yanması çoğunlukla neyi düşündürür?", options:["Şarj sistemi/alternatör problemi","Fren balatası aşınması","Düşük lastik basıncı","DPF rejenerasyonu"], correctIndex:0, explanation:"Akü ikazı yalnız aküyü değil, alternatör ve kayış dahil şarj sistemini işaret edebilir." },
    { id:"aquaplaning-01", category:"Sürüş", question:"Suda kızaklama başladığında genel olarak ne yapılmalıdır?", options:["Ani fren ve sert direksiyon","Gazı yumuşakça bırakıp direksiyonu sakin tutmak","El frenini çekmek","Hızlanmak"], correctIndex:1, explanation:"Ani komutlar tutunmayı daha da bozabilir; gazı yumuşak bırakmak ve sakin yönlendirme lastiğin yeniden temasına yardım eder." },
    { id:"fren-hidrolik-01", category:"Bakım", question:"Fren hidroliği neden zamanla değiştirilir?", options:["Rengi güzel görünsün diye","Nem çekip kaynama noktası düşebildiği için","Yakıt tüketimini sıfırlamak için","Motor sesini azaltmak için"], correctIndex:1, explanation:"Higroskopik fren sıvısı zamanla nem alabilir; yüksek ısıda performans ve güvenlik etkilenebilir." },
    { id:"dot-01", category:"Lastik", question:"Lastik üzerindeki dört haneli 2325 DOT tarih kodu neyi anlatır?", options:["2023 yılının 25. günü","2025 yılının 23. haftası","23 psi basınç","25 mm diş derinliği"], correctIndex:1, explanation:"İlk iki hane üretim haftasını, son iki hane üretim yılını gösterir." },
    { id:"turbo-01", category:"Motor", question:"Yoğun yük veya yüksek hız sonrası turbo motoru hemen kapatmamak neden önerilebilir?", options:["Frenleri soğutmak için","Turbo yağlamasının ve sıcaklığının dengelenmesine kısa süre tanımak için","Radyoyu korumak için","Aküyü boşaltmak için"], correctIndex:1, explanation:"Özellikle eski veya ağır yükte çalışan turbo sistemlerde kısa sakin kullanım/rölanti, sıcaklık ve yağ dolaşımının dengelenmesine yardımcı olabilir." },
    { id:"beyaz-duman-01", category:"Arıza", question:"Soğuk ilk çalıştırmada kısa süreli ince beyaz buhar her zaman arıza mıdır?", options:["Evet, kesin conta yanmıştır","Hayır; yoğuşma olabilir, kalıcı yoğun duman ve su eksiltme ayrıca incelenmelidir","Kesin turbo arızasıdır","Lastik arızasıdır"], correctIndex:1, explanation:"Soğukta yoğuşma normal olabilir. Motor ısınınca sürmesi, tatlı koku veya su eksiltme varsa profesyonel kontrol gerekir." },
    { id:"tpms-01", category:"Lastik", question:"TPMS lambası yandığında ilk kontrol ne olmalıdır?", options:["Motor yağı","Soğuk lastik basınçlarını kapı içi etiketteki değerlere göre ölçmek","Radyo sigortası","Egzoz ucu"], correctIndex:1, explanation:"Basınçlar lastikler soğukken, araç üreticisinin yük/ebat değerine göre kontrol edilmelidir." },
    { id:"adblue-01", category:"Dizel", question:"AdBlue'nun görevi nedir?", options:["Motor yağını inceltmek","SCR sisteminde azot oksit emisyonlarını azaltmaya yardımcı olmak","Oktanı artırmak","Frenleri soğutmak"], correctIndex:1, explanation:"AdBlue egzoz hattındaki SCR sisteminde kullanılır; yakıt deposuna konulmaz." },
    { id:"oktan-01", category:"Yakıt", question:"Üreticinin önerdiğinden daha yüksek oktanlı benzin her araçta daha fazla güç sağlar mı?", options:["Evet, daima","Hayır; motor yönetimi ve tasarım buna uygun değilse belirgin kazanç sağlamayabilir","Yalnız lastikleri büyütür","Aküyü şarj eder"], correctIndex:1, explanation:"Oktan vuruntu direncidir. Motorun sıkıştırma oranı ve yönetimi yararlanamıyorsa yüksek oktan tek başına güç garantisi vermez." },
    { id:"debriyaj-01", category:"Şanzıman", question:"Manuel araçta ayağı sürekli debriyaj pedalında tutmak neye yol açabilir?", options:["Yakıt üretir","Debriyaj rulmanı ve balatanın gereksiz aşınmasına","ABS'nin kapanmasına","Soğutma suyunun artmasına"], correctIndex:1, explanation:"Pedala hafif baskı bile sistemi kısmen yük altında bırakıp parçaların ömrünü azaltabilir." },
    { id:"egr-01", category:"Dizel", question:"EGR sistemi temel olarak ne yapar?", options:["Egzoz gazının bir bölümünü yanmaya geri vererek NOx oluşumunu azaltmaya yardımcı olur","Lastiği şişirir","Aküyü soğutur","Fren basıncını artırır"], correctIndex:0, explanation:"EGR, belirli koşullarda yanma sıcaklığı ve NOx emisyonunu düşürmek için egzoz gazı devridaimi yapar." },
    { id:"rejeneratif-01", category:"Elektrikli", question:"Rejeneratif frenleme ne sağlar?", options:["Fren balatasını sürekli ısıtır","Yavaşlama sırasında enerjinin bir kısmını bataryaya geri kazandırır","Benzin üretir","Lastik basıncını sabitler"], correctIndex:1, explanation:"Elektrik motoru jeneratör gibi çalışarak kinetik enerjinin bir bölümünü elektrik enerjisine dönüştürür." },
    { id:"rot-01", category:"Lastik", question:"Araç düz yolda bir tarafa çekiyorsa hangisi kontrol listesinde olmalıdır?", options:["Rot ayarı, lastik basıncı/aşınması ve fren sıkışması","Sadece radyo anteni","Bagaj lambası","Plaka vidası"], correctIndex:0, explanation:"Tek tarafa çekme birden fazla nedenden doğabilir; yalnız rot ayarı varsayımıyla parça değiştirilmemelidir." },
    { id:"obd-p-01", category:"OBD", question:"OBD-II kodunda P harfi hangi ana grubu gösterir?", options:["Gövde","Şasi","Güç aktarma: motor ve şanzıman","Araç ağı"], correctIndex:2, explanation:"P, Powertrain grubudur. B gövde, C şasi ve U ağ/iletişim kodlarını ifade eder." },
    { id:"hibrit-01", category:"Elektrikli", question:"Tam hibrit bir araç yalnız elektrikle kısa süre hareket edebilir mi?", options:["Sisteme ve koşullara bağlı olarak evet","Hiçbir zaman","Yalnız motor sökülürse","Sadece yokuş yukarı"], correctIndex:0, explanation:"Tam hibritlerde batarya doluluğu, sıcaklık ve yük uygunsa elektrik motoru tek başına kısa süreli hareket sağlayabilir." },
    { id:"balata-01", category:"Fren", question:"Fren sırasında metalik sürtme sesi duyulması ne gerektirir?", options:["Sesi bastırmak için müziği açmak","Balata ve disklerin gecikmeden kontrolü","Yakıt eklemek","Klimayı kapatmak"], correctIndex:1, explanation:"Balata aşınmış veya yabancı cisim sıkışmış olabilir; fren sistemi güvenlik parçasıdır ve geciktirilmemelidir." },
    { id:"basinc-01", category:"Lastik", question:"Düşük lastik basıncı genellikle neye yol açabilir?", options:["Yuvarlanma direnci ve düzensiz aşınmanın artmasına","Motor hacminin büyümesine","Oktan artışına","Akünün yenilenmesine"], correctIndex:0, explanation:"Düşük basınç ısıyı, omuz aşınmasını ve enerji tüketimini artırabilir; araç etiketindeki değer kullanılmalıdır." },
    { id:"antifriz-01", category:"Soğutma", question:"Soğutma sistemine yalnız musluk suyu koymak neden iyi bir sürekli çözüm değildir?", options:["Rengi şeffaf olduğu için","Donma, kaynama, korozyon ve tortu koruması yetersiz kalabileceği için","Freni sertleştirdiği için","Farları söndürdüğü için"], correctIndex:1, explanation:"Üretici onaylı doğru karışım, sadece donmaya karşı değil korozyon ve kaynama koruması için de gereklidir." },
    { id:"aku-voltaj-01", category:"Elektrik", question:"Dinlenmiş sağlıklı 12 V kurşun-asit akü tam doluya yakınken yaklaşık kaç volt ölçülebilir?", options:["1,5 V","6 V","12,6 V","24 V"], correctIndex:2, explanation:"Yaklaşık 12,6 V tam doluya yakın değerdir; sıcaklık, akü tipi ve yüzey yükü ölçümü etkileyebilir." },
    { id:"tork-01", category:"Teknik", question:"Newton metre (Nm) otomobil teknik verilerinde çoğunlukla neyi ifade eder?", options:["Motor torkunu","Bagaj hacmini","Lastik çapını","Yakıt oktanını"], correctIndex:0, explanation:"Nm dönme momentinin birimidir; motorun dönme kuvvetini ifade eder." },
    { id:"katalizor-01", category:"Emisyon", question:"Katalitik konvertörün temel görevi nedir?", options:["Zararlı egzoz bileşenlerini daha az zararlı gazlara dönüştürmeye yardımcı olmak","Lastikleri soğutmak","Yakıt pompalamak","Direksiyonu hafifletmek"], correctIndex:0, explanation:"Katalizör kimyasal reaksiyonlarla CO, HC ve NOx gibi bileşenlerin azaltılmasına yardım eder." },
    { id:"awd-01", category:"Aktarma", question:"Dört tekerlekten çekiş fren mesafesini her koşulda kısaltır mı?", options:["Evet, fizik kuralları değişir","Hayır; çekişe yardım eder fakat frenlemede lastik ve zemin hâlâ belirleyicidir","Sadece yağmurda sıfırlar","ABS'yi gereksiz yapar"], correctIndex:1, explanation:"AWD hızlanma çekişini iyileştirebilir; durma mesafesinin temel belirleyicileri lastik, zemin, hız ve fren sistemidir." },
    { id:"ekspertiz-01", category:"Satın Alma", question:"İkinci el araçta yalnız boya ölçümü kapsamlı ekspertiz için yeterli midir?", options:["Evet","Hayır; mekanik, elektronik, şasi, fren, lastik ve kayıt kontrolleri de gerekir","Sadece dizelde yeterli","Yalnız yeni araçta yeterli"], correctIndex:1, explanation:"Kaporta ölçümü geçmişin yalnız bir bölümünü gösterir; karar bütün sistemler ve belgeler birlikte incelenerek verilmelidir." },
    { id:"motor-soguk-01", category:"Sürüş", question:"Soğuk motoru en sağlıklı biçimde ısıtmak için genel yaklaşım hangisidir?", options:["Uzun süre yüksek rölanti","Kısa hazırlık sonrası düşük-orta yükte sakin sürüş","Hemen tam gaz","Kontak kapalı beklemek"], correctIndex:1, explanation:"Modern araçlarda yağ dolaşımı oluştuktan sonra sakin sürüş, motor ve aktarma organlarının birlikte kontrollü ısınmasını sağlar." },
];

function hash(input: string) {
    let value = 2166136261;
    for (let i = 0; i < input.length; i += 1) value = Math.imul(value ^ input.charCodeAt(i), 16777619);
    return value >>> 0;
}

export function quizPeriodKey(mode: QuizMode, date = new Date()) {
    const parts = new Intl.DateTimeFormat("en-CA", { timeZone:"Europe/Istanbul", year:"numeric", month:"2-digit", day:"2-digit" }).formatToParts(date);
    const values = Object.fromEntries(parts.map(part => [part.type, part.value]));
    const dayKey = `${values.year}-${values.month}-${values.day}`;
    if (mode === "daily") return dayKey;
    const day = new Date(`${dayKey}T12:00:00Z`);
    const weekday = day.getUTCDay() || 7;
    day.setUTCDate(day.getUTCDate() + 4 - weekday);
    const yearStart = new Date(Date.UTC(day.getUTCFullYear(), 0, 1));
    const week = Math.ceil((((day.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    return `${day.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

export function getQuizQuestions(mode: QuizMode, periodKey: string) {
    return [...AUTOMOTIVE_QUIZ_QUESTIONS]
        .sort((a, b) => hash(`${mode}:${periodKey}:${a.id}`) - hash(`${mode}:${periodKey}:${b.id}`))
        .slice(0, 10);
}
