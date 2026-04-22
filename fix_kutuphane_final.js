const fs = require('fs');

function fixFile(filepath, replacements) {
    if (!fs.existsSync(filepath)) return;
    let content = fs.readFileSync(filepath, 'utf8');
    const startContent = content;

    for (const [bad, good] of replacements) {
        content = content.split(bad).join(good);
    }

    if (content !== startContent) {
        fs.writeFileSync(filepath, content, 'utf8');
        console.log(`[FIXED] ${filepath}`);
    } else {
        console.log(`[NO CHANGES] ${filepath}`);
    }
}

const R = '\uFFFD';

// Fixes for Kutuphane Page
let content = fs.readFileSync('app/kutuphane/page.tsx', 'utf8');

// Replace standard • with BookOpen for Guides list
content = content.replace(
    /justifyContent: 'center',\s*fontSize: '24px'\s*}\}>\s*•\s*<\/div>/g,
    `justifyContent: 'center'
                                            }>
                                                <BookOpen size={24} color="white" />
                                            </div>`
);

// Replace icon strings with React Elements in Interesting tab
content = content.replace(/icon=""/g, 'icon={<Lightbulb color="#F59E0B" />}');
content = content.replace(/icon="⚡"/g, 'icon={<Zap color="#F59E0B" />}');

// Manual fixes for specific icons
content = content.replace(/title="Günlük İpuçları" icon=\{<Zap color="#F59E0B" \/>\}/g, 'title="Günlük İpuçları" icon={<Lightbulb color="#F59E0B" />}');
content = content.replace(/title="Kontrol Listeleri" icon=\{<Zap color="#F59E0B" \/>\}/g, 'title="Kontrol Listeleri" icon={<CheckCircle color="#43E97B" />}');
content = content.replace(/title="Yap & Yapma" icon=\{<Zap color="#F59E0B" \/>\}/g, 'title="Yap & Yapma" icon={<ThumbsUp color="#3B82F6" />}');
content = content.replace(/title="Mit Kırıcılar" icon=\{<Lightbulb color="#F59E0B" \/>\}/g, 'title="Mit Kırıcılar" icon={<ShieldAlert color="#EF4444" />}');

// Remaining garbled text fixes
content = content.replace(/Yanl/g, 'Yanlış');
content = content.replace(/Yanl/g, 'Yanlış');
content = content.replace(/Doru/g, 'Doğru');


fs.writeFileSync('app/kutuphane/page.tsx', content, 'utf8');
console.log('Fixed Page.tsx');
