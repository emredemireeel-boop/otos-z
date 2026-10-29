const fs = require('fs');

const path = './public/data/library_guides.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const guide = data.guides.find(g => g.id === "guide_nasil_galerici_olunur");

if (guide) {
  const step3 = guide.sections.find(s => s.title && s.title.includes('Adım 3'));
  
  if (step3) {
    // 1. Update BDDK section
    const bddkSub = step3.subsections.find(s => s.subtitle.includes('BDDK'));
    if (bddkSub) {
      bddkSub.text = "Galerilerin satış hızını belirleyen en yaşamsal faktör, tüketicinin taşıt kredisine erişimidir. BDDK'nın güncel Kredi Değer Oranı (Loan-to-Value) kurallarına göre kredi limitleri şunlardır:\n\n**0 - 400.000 TL:** %70'ine kadar (Maksimum 48 ay)\n**400.001 - 800.000 TL:** %50'sine kadar (Maksimum 36 ay)\n**800.001 - 1.200.000 TL:** %30'una kadar (Maksimum 24 ay)\n**1.200.001 - 2.000.000 TL:** %20'sine kadar (Maksimum 12 ay)\n**2.000.000 TL üzeri:** Taşıt kredisi verilmemektedir.\n\nAyrıca bankalar krediye konu edilecek ikinci el araçlarda en fazla 8 yaş sınırı uygular. Sermayeyi yavaş devreden 10 yaş üstü araçlar yerine, BDDK kredilerine uygun 8 yaş altı 'hızlı döner' araçlara yatırmak hayati önem taşır. *(Not: Kredi süreçlerinin çok daha derin hukuki ve akademik incelemesi Adım 16'da detaylandırılmıştır.)*";
    }

    // 2. Remove table to avoid duplication with Step 16
    if (step3.table) {
      delete step3.table;
    }
    
    // Also rename Step 3 slightly to remove "Asgari Bütçe Planlaması" which is Step 16 now
    step3.title = "Adım 3: Sermaye Yönetimi ve Sabit Gider Planlaması";

    fs.writeFileSync(path, JSON.stringify(data, null, 2));
    console.log('Step 3 fixed successfully!');
  }
}
