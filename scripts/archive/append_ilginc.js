const fs = require('fs');

const path = './public/data/interesting_information.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

// Find highest ID
let maxId = 0;
const sections = ['dailyTips', 'checklists', 'doAndDont', 'quickFacts', 'timeBasedPlans', 'mythBusters'];
sections.forEach(sec => {
    if(data.interestingFacts[sec]) {
        data.interestingFacts[sec].forEach(item => {
            if(item.id && item.id.startsWith('ilginc-')) {
                const num = parseInt(item.id.replace('ilginc-', ''), 10);
                if(num > maxId) maxId = num;
            }
        });
    }
});

const newTipId = 'ilginc-' + String(maxId + 1).padStart(5, '0');
const newChecklistId = 'ilginc-' + String(maxId + 2).padStart(5, '0');

const newTip = {
  "id": newTipId,
  "title": "Klimadan Gelen Kötü Kokuyu Önleme",
  "tip": "Klimayı kullanırken, varacağınız yere gelmeden 3-4 dakika önce A/C (klima) düğmesini kapatıp sadece fanı çalıştırın. Bu sayede klima sisteminde kalan soğuk nem kuruyacak ve bakteri oluşumuna (dolayısıyla küf kokusuna) engel olacaktır.",
  "category": "maintenance",
  "icon": "ac_unit"
};

const newChecklist = {
  "id": newChecklistId,
  "title": "İkinci El Araç Ekspertiz Öncesi Sırları",
  "category": "buying",
  "gradient": ["#F59E0B", "#EF4444"],
  "items": [
    "Motor tamamen soğukken ilk marş sesini dinleyin (zincir veya itici sesi arayın).",
    "Gaza aniden yüklenin ve egzozdan mavi veya siyah duman atıp atmadığına bakın.",
    "Kaput altındaki plastik trimlerde ve vida başlarında anahtar izi arayın (sök-tak belirtisi).",
    "Tüm kapı lastiklerini (fitilleri) hafifçe kaldırıp altındaki sac kıvrımlarına bakın (punto izleri orijinal mi?).",
    "Direksiyon tam sağ veya sol yapıldığında aks kafalarından tıkırtı geliyor mu dinleyin.",
    "Rölantide beklerken direksiyonu avuç içiyle hafif tutun, titreme varsa motor takozu bitik olabilir.",
    "Bütün emniyet kemerlerini sonuna kadar çekip dip kısımlarındaki su izine veya çamura bakın (sel hasarı testi).",
    "Farlardaki marka logolarının ve üretim tarihlerinin her iki tarafta aynı olup olmadığını kontrol edin."
  ]
};

data.interestingFacts.dailyTips.unshift(newTip);
data.interestingFacts.checklists.unshift(newChecklist);

fs.writeFileSync(path, JSON.stringify(data, null, 2));
console.log('Added new daily tip and checklist!');
