const fs = require('fs');

const path = './public/data/library_guides.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const guide = data.guides.find(g => g.id === "guide_nasil_galerici_olunur");

if (guide) {
  const step16 = guide.sections.find(s => s.title && s.title.includes('Adım 16'));
  if (step16) {
    // Find the BDDK subsection
    const bddkIndex = step16.subsections.findIndex(s => s.subtitle.includes('BDDK'));
    
    if (bddkIndex !== -1) {
      // Replace the old complex subsection with 2 new structured ones
      const newSub1 = {
        "subtitle": "BDDK Makro İhtiyati Tedbirleri ve Güncel Taşıt Kredisi Oranları",
        "text": "Oto galerilerin araç stok devir hızını (bir aracın ortalama satılma süresini) belirleyen en yaşamsal faktör, nihai tüketicinin otomobil kredilerine erişim imkanıdır. Türkiye Cumhuriyet Merkez Bankası (TCMB) ve Bankacılık Düzenleme ve Denetleme Kurumu (BDDK), ikinci el taşıt kredilerinde tüketiciyi aşırı borçlanmadan korumak ve suni talebi kırmak amacıyla Kredi Değer Oranı (Loan-to-Value) ve vade kısıtlamaları uygulamaktadır.\n\nGüncel kurallara göre bankaların kasko veya rayiç bedeli üzerinden uyguladığı net sınırlar şöyledir:",
        "points": [
          "**0 - 400.000 TL:** Aracın değerinin **%70'ine kadar** kredi kullandırılır. (Azami Vade: **48 Ay**)",
          "**400.001 - 800.000 TL:** Aracın değerinin **%50'sine kadar** kredi kullandırılır. (Azami Vade: **36 Ay**)",
          "**800.001 - 1.200.000 TL:** Aracın değerinin **%30'una kadar** kredi kullandırılır. (Azami Vade: **24 Ay**)",
          "**1.200.001 - 2.000.000 TL:** Aracın değerinin **%20'sine kadar** kredi kullandırılır. (Azami Vade: **12 Ay**)",
          "**2.000.000 TL Üzeri:** Bu değer aralığındaki araçlar için genellikle taşıt kredisi **verilmemektedir**."
        ]
      };

      const newSub2 = {
        "subtitle": "Araç Yaş Sınırları ve Doğru Envanter Stratejisi",
        "text": "Bankaların tahsis politikalarına göre ikinci el araçlarda katı bir yaş sınırı uygulanmakta olup, ağırlıklı olarak **en fazla 8 yaşına kadar** olan taşıtlar kredilendirilebilmektedir. Yüksek faiz oranları ve tahsis ücretlerinin olduğu bir konjonktürde, oto galerilerin envanter alım stratejilerini buna göre revize etmeleri şarttır.\n\nKurumsal bir galeri, sermayesini yavaş devreden 10 yaş üstü araçlar yerine; BDDK kredilerine uygun, 8 yaş altı ve finansman imkanı yüksek değer bandındaki araçlara yatırım yaparak olası likidite krizlerinden korunabilir."
      };

      // Replace 1 old item with 2 new items
      step16.subsections.splice(bddkIndex, 1, newSub1, newSub2);
      
      fs.writeFileSync(path, JSON.stringify(data, null, 2));
      console.log('BDDK subsection updated successfully!');
    }
  }
}
