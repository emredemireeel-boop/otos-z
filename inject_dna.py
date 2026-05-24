import re
import sys

def inject_dna():
    file_path = 'data/vehicle-dna.ts'
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading file: {e}")
        return

    new_data = """
    ,{
        id: 1001,
        brand: "Tofaş",
        model: "Murat 131 / 124",
        year: "1977-1988",
        dnaScore: 60,
        strengths: ["Yedek parça sudan ucuz", "Her usta anlar", "LPG ile çok az yakar"],
        weaknesses: ["Güvenlik yok denecek kadar az", "Kaporta çabuk çürür", "Konfor seviyesi düşük"],
        chronicIssues: [
            { id: 1, title: "Hararet Problemi", severity: "high", reportCount: 9, description: "Radyatör ve fan sistemi eski tip olduğu için sık kontrol gerektirir." },
            { id: 2, title: "Kaporta Çürükleri", severity: "medium", reportCount: 8, description: "Özellikle kapı altları ve şasede kronik çürümeler yaşanır." }
        ],
        userExperiences: [],
        totalReports: 5
    },
    {
        id: 1002,
        brand: "Tofaş",
        model: "Doğan",
        year: "1988-2002",
        dnaScore: 62,
        strengths: ["Geniş iç hacim", "Süspansiyon konforu", "Parça ve usta bolluğu"],
        weaknesses: ["Yüksek hızlarda güvensiz", "Arka lastiklerde aşınma", "Zayıf yalıtım"],
        chronicIssues: [
            { id: 1, title: "Diferansiyel Ötmesi", severity: "medium", reportCount: 9, description: "Tofaşların genel kronik sorunudur, yağ kontrolü şarttır." }
        ],
        userExperiences: [],
        totalReports: 6
    },
    {
        id: 1003,
        brand: "Skoda",
        model: "Favorit / Forman",
        year: "1989-1995",
        dnaScore: 61,
        strengths: ["İç hacmi geniş", "Motoru sağlamdır", "Yakıtı ekonomiktir"],
        weaknesses: ["Plastik kalitesi düşük", "Ses yalıtımı zayıf", "Hararet sorununa yatkın"],
        chronicIssues: [
            { id: 1, title: "Hararet ve Conta Yakma", severity: "high", reportCount: 8, description: "Soğutma sistemi eski nesil olduğu için hararete dikkat edilmeli." }
        ],
        userExperiences: [],
        totalReports: 5
    },
    {
        id: 1004,
        brand: "Renault",
        model: "9 (Spring / Broadway)",
        year: "1988-1995",
        dnaScore: 65,
        strengths: ["Yakıt cimrisi", "Ön takım sağlam", "Satışı çok hızlı"],
        weaknesses: ["Direksiyon çok sert", "Güvenlik donanımı yok", "İç mekan dar"],
        chronicIssues: [
            { id: 1, title: "Karbüratör Tıkanıklığı", severity: "low", reportCount: 7, description: "LPG kullanımına bağlı karbüratör ayarı sık bozulabilir." }
        ],
        userExperiences: [],
        totalReports: 8
    },
    {
        id: 1005,
        brand: "Renault",
        model: "11 (Flash / Rainbow)",
        year: "1988-1995",
        dnaScore: 63,
        strengths: ["Motor çekişi fena değil", "Bagaj kullanımı pratik", "Ucuz yedek parça"],
        weaknesses: ["Trim sesi çok fazladır", "Elektrik tesisatı yaşlıdır", "Güvenlik zafiyeti"],
        chronicIssues: [
            { id: 1, title: "Elektrik ve Gösterge Sorunları", severity: "medium", reportCount: 7, description: "Özellikle dijital göstergelerde oksitlenme olur." }
        ],
        userExperiences: [],
        totalReports: 5
    },
    {
        id: 1006,
        brand: "Ford",
        model: "Escort",
        year: "1990-2000",
        dnaScore: 66,
        strengths: ["Yol tutuşu iyidir", "Kasası sağlam hissiyat verir", "Zetec motorlar çok uzun ömürlüdür"],
        weaknesses: ["Ön takım hassastır", "Elektronik ateşleme arızaları", "Parçası nispeten pahalı"],
        chronicIssues: [
            { id: 1, title: "Rölanti Dalgalanması", severity: "medium", reportCount: 8, description: "Rölanti valfi kirlenmeye çok müsaittir." }
        ],
        userExperiences: [],
        totalReports: 6
    },
    {
        id: 1007,
        brand: "Ford",
        model: "Taunus",
        year: "1980-1993",
        dnaScore: 60,
        strengths: ["Muazzam konfor", "Arkadan itiş keyfi", "Heybetli görünüm"],
        weaknesses: ["Çok fazla yakar", "Park etmesi zordur", "Çürümeye çok meyillidir"],
        chronicIssues: [
            { id: 1, title: "Şaft Ötmesi", severity: "high", reportCount: 8, description: "Arkadan itişli olduğu için şaft istavrozu ve mafsallar aşınır." }
        ],
        userExperiences: [],
        totalReports: 4
    },
    {
        id: 1008,
        brand: "Lada",
        model: "Samara",
        year: "1990-2004",
        dnaScore: 64,
        strengths: ["Motoru çok sağlamdır", "Altı yüksektir", "Isıtma sistemi (kalorifer) çok güçlüdür"],
        weaknesses: ["Konfor sıfıra yakındır", "Tasarımı çok köşelidir", "Süspansiyonlar serttir"],
        chronicIssues: [
            { id: 1, title: "Fren Zayıflığı", severity: "high", reportCount: 9, description: "Fren sistemi döneminin diğer araçlarına göre bile hissizdir." }
        ],
        userExperiences: [],
        totalReports: 6
    },
    {
        id: 1009,
        brand: "Fiat",
        model: "Uno",
        year: "1995-2001",
        dnaScore: 67,
        strengths: ["Şehir içinde park etmek çok kolay", "Motoru kasaya göre atiktir", "Yedek parçası bakkalda bile bulunur"],
        weaknesses: ["İç plastik kalitesi çok kötüdür", "Ön düzen çabuk bozulur", "Uzun yolda yorar"],
        chronicIssues: [
            { id: 1, title: "Ön Düzen ve Rotil", severity: "medium", reportCount: 8, description: "Kasislerde dikkat edilmezse ön takımı sık sık yenilemek gerekir." }
        ],
        userExperiences: [],
        totalReports: 7
    }
"""

    match = re.search(r'\];\s*export function getSeverityColor', content)
    if match:
        new_content = content[:match.start()] + new_data + content[match.start():]
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("Successfully injected DNA data!")
    else:
        print("Could not find the closing bracket of vehicleDNAData array before getSeverityColor")

if __name__ == "__main__":
    inject_dna()
