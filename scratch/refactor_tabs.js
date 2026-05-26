const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../app/kutuphane/KutuphaneClient.tsx');
let code = fs.readFileSync(filePath, 'utf8');

// The original slugs before any modification:
const slugs = [
    'makaleler', // 0
    'ilginc-bilgiler', // 1
    'otomotiv-sozluk', // 2
    'obd-ariza-kodlari', // 3
    'gosterge-isiklari', // 4
    'trafik-cezalari', // 5
    'lastik-rehberi', // 6
    'ikinci-el-rehberi', // 7
    'kaza-ilkyardim', // 8
    'mevsimsel-bakim', // 9
    'sigorta-rehberi', // 10
    'otoyol-ve-kopru-ucretleri', // 11
    'bakim-zamanlari', // 12
    'tuvturk-muayene', // 13
    'arac-segmentleri', // 14
    'plaka-kodlari', // 15
    'noter-islemleri', // 16
    'ehliyet-siniflari', // 17
    'kasko-deger', // 18
    'hgs-siniflari', // 19
    'dolandiricilik-rehberi', // 20
    'nereye-gitmeli', // 21
    'hasar-sorgulama', // 22
    'efsane-avcilari' // 23
];

// Replace activeTab === X with currentTab.slug === 'slug'
slugs.forEach((slug, idx) => {
    // Regex to match exact `activeTab === idx` and safely replace
    const regex = new RegExp(`activeTab\\s*===\\s*${idx}\\s*&&`, 'g');
    code = code.replace(regex, `currentTab.slug === '${slug}' &&`);
});

// Now insert the new tab into tabSlugs array
const newTabObj = `        { slug: 'trafik-isaretleri', name: 'Trafik İşaretleri', icon: Signpost, title: 'Türkiye Trafik İşaretleri ve Anlamları | OtoSöz', description: 'Tüm trafik tanzim, tehlike uyarı, bilgi ve park etme levhalarının resimleri ve detaylı açıklamaları.' },`;
code = code.replace(
    /{ slug: 'otomotiv-sozluk', name: 'Sözlük', icon: BookMarked,[^\}]+},/g,
    `{ slug: 'otomotiv-sozluk', name: 'Sözlük', icon: BookMarked, title: 'Otomotiv Sözlüğü - Türkçe Araç Terimleri | OtoSöz', description: 'A\\'dan Z\\'ye tüm otomotiv terimlerinin Türkçe açıklamaları. ABS, ESP, Tramer, Ekspertiz ve daha fazlası.' },\n${newTabObj}`
);

// Add import for Signpost
if (!code.includes('Signpost')) {
    code = code.replace(/import \{([^\}]+)\} from "lucide-react";/, (match, p1) => {
        return `import { ${p1.trim()}, Signpost } from "lucide-react";`;
    });
}

// Add import for TrafikIsaretleriSection
if (!code.includes('TrafikIsaretleriSection')) {
    code = code.replace(/import EfsaneAvcilariSection from "\.\/efsane-avcilari-section";/, 
        `import EfsaneAvcilariSection from "./efsane-avcilari-section";\nimport TrafikIsaretleriSection from "./trafik-isaretleri-section";`
    );
}

// Add rendering logic for TrafikIsaretleriSection right after Sözlük
if (!code.includes('<TrafikIsaretleriSection />')) {
    const renderBlock = `
                    {/* Tab 3.5: Trafik İşaretleri */}
                    {currentTab.slug === 'trafik-isaretleri' && (
                        <TrafikIsaretleriSection />
                    )}
`;
    // Insert it after {currentTab.slug === 'otomotiv-sozluk' && (...)}
    // Let's find a safe spot, right before OBD
    code = code.replace(/{currentTab\.slug === 'obd-ariza-kodlari' && \(/g, `${renderBlock}                    {currentTab.slug === 'obd-ariza-kodlari' && (`);
}

fs.writeFileSync(filePath, code);
console.log('Refactored KutuphaneClient.tsx successfully!');
