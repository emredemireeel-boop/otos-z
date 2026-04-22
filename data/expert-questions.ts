export interface Question {
    id: number;
    question: string;
    category: string;
    author: string;
    authorLevel: string;
    date: string;
    answers: number;
    views: number;
    isAnswered: boolean;
    description?: string; // Added description for detail page
    expertAnswer?: {
        expertName: string;
        expertLevel: string;
        answer: string;
        date: string;
    };
}

export const mockQuestions: Question[] = [
    {
        id: 1,
        question: "BMW F30 320i'de motor ısınma sorunu yaşıyorum, termostat olabilir mi?",
        description: "Merhaba arkadaşlar, aracım 2014 model F30 320i. Son zamanlarda trafikte dur kalk yaparken hararet göstergesinin yükseldiğini fark ettim. Fan sürekli çalışıyor ama hararet düşmüyor. Sizce sorun termostatta mı yoksa devirdaim pompasında mı olabilir? Daha önce başına gelen var mı?",
        category: "Motor",
        author: "yolcanavari",
        authorLevel: "Efsane",
        date: "2 saat önce",
        answers: 5,
        views: 234,
        isAnswered: true,
        expertAnswer: {
            expertName: "motor_ustasi_ali",
            expertLevel: "Efsane",
            answer: "Merhabalar, F30 kasalarda kronik olarak termostat arızası sık görülür ancak devirdaim pompası da kontrol edilmelidir. Eğer su eksiltme yoksa kuvvetle muhtemel termostat açmıyordur. Bilgisayara bağlayıp hata kodu okumak en sağlıklısı olacaktır. Geçmiş olsun.",
            date: "1 saat önce"
        }
    },
    {
        id: 2,
        question: "Audi A4 B8 DSG Şanzımanda sarsıntı var, ne yapmalıyım?",
        description: "Aracım kalkışlarda, özellikle yokuş yukarı kalkarken titreme yapıyor. Vites geçişlerinde bazen kararsızlık yaşıyor. Kavrama değişimi mi gerekiyor yoksa yazılımla düzelir mi?",
        category: "Şanzıman",
        author: "auditutkunu",
        authorLevel: "Usta",
        date: "5 saat önce",
        answers: 3,
        views: 156,
        isAnswered: true,
        expertAnswer: {
            expertName: "sanziman_profesoru",
            expertLevel: "Usta",
            answer: "Selamlar, DSG/S-Tronic Şanzımanlarda bu tip titremeler genellikle kavrama (çift kavrama seti) aşınmasından kaynaklanır. Ancak mekatronik ünitede basınç kaybı olup olmadığına da bakılmalı. İyi bir Şanzımancıya göstermenizi tavsiye ederim.",
            date: "4 saat önce"
        }
    },
    {
        id: 3,
        question: "Lastik seçiminde 205/55R16 mı yoksa 215/50R17 mi tercih etmeliyim?",
        description: "Aracımın orijinal lastikleri 16 inç ama görsellik için 17 inçe geçmek istiyorum. Konfor ve yakıt tüketimi çok etkilenir mi? Hangi ebatı tavsiye edersiniz?",
        category: "Lastik",
        author: "turbosever",
        authorLevel: "Tutkun",
        date: "1 gün önce",
        answers: 8,
        views: 445,
        isAnswered: true,
        expertAnswer: {
            expertName: "lastik_uzmani",
            expertLevel: "Usta",
            answer: "17 inçe geçmek yol tutuşu artırır ancak yanak inceldiği için konfor bir miktar azalır. Yakıt tüketimi de taban genişlediği için çok az artabilir (%2-3). Görsellik sizin için önemliyse 215/50R17 güzel bir tercih olur.",
            date: "20 saat önce"
        }
    },
    {
        id: 4,
        question: "Golf 7 1.4 TSI'da yakıt tüketimi çok yüksek, normal mi?",
        description: "Şehir içi ortalamam 10-11 litre civarında geziyor. Agresif kullanmıyorum. Bakımları yeni yapıldı. Bu değerler normal mi yoksa bir sorun mu var?",
        category: "Motor",
        author: "dieselmaster",
        authorLevel: "Usta",
        date: "2 gün önce",
        answers: 12,
        views: 678,
        isAnswered: true,
        expertAnswer: {
            expertName: "mekanikcerrah",
            expertLevel: "Efsane",
            answer: "1.4 TSI motorlar için yoğun trafikte 9-10 litreler görülebilir ancak sakin kullanımda 7.5-8.5 litre civarında olması beklenir. Hava filtresi, bujiler ve lastik basınçlarını kontrol edin. Ayrıca oksijen sensörü arızası da yakıtı artırabilir.",
            date: "1 gün önce"
        }
    },
    {
        id: 5,
        question: "Tesla Model S Şarj süresi uzadı, batarya sağlığı nasıl ölçülür?",
        description: "Son zamanlarda supercharger'da bile Şarj süresi uzadı. Batarya sağlığını (SOH) nasıl kontrol edebilirim? Servise gitmeden bir yolu var mı?",
        category: "Elektrik",
        author: "elektriklidunya",
        authorLevel: "Tutkun",
        date: "3 gün önce",
        answers: 6,
        views: 321,
        isAnswered: true,
        expertAnswer: {
            expertName: "elektronik_guru",
            expertLevel: "Efsane",
            answer: "Araç menüsünden servis moduna girerek batarya sağlık testini başlatabilirsiniz ancak bu işlem Şarjın tamamen bitirilip doldurulmasını gerektirir ve uzun sürer. En sağlıklısı OBD üzerinden ScanMyTesla gibi uygulamalarla hücre voltajlarını ve SOH değerini okumaktır.",
            date: "2 gün önce"
        }
    },
];

export const categories = ["Tümü", "Motor", "Şanzıman", "Lastik", "Bakım", "Elektrik", "Fren", "Süspansiyon"];

export const levelColors: Record<string, { bg: string; text: string }> = {
    "Çaylak": { bg: "rgba(100, 100, 100, 0.2)", text: "#888" },
    "Sürücü": { bg: "rgba(59, 130, 246, 0.2)", text: "#3b82f6" },
    "Tutkun": { bg: "rgba(168, 85, 247, 0.2)", text: "#a855f7" },
    "Usta": { bg: "rgba(245, 158, 11, 0.2)", text: "#f59e0b" },
    "Efsane": { bg: "rgba(34, 197, 94, 0.2)", text: "#22c55e" },
    "Uzman": { bg: "rgba(239, 68, 68, 0.2)", text: "#ef4444" }, // Red for official experts
};
