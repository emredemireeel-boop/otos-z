const fs = require('fs');

let content = fs.readFileSync('app/kutuphane/page.tsx', 'utf8');

const R = '\uFFFD';

content = content.replace('title="Günlük İpuçları" icon="' + R + R + '"', 'title="Günlük İpuçları" icon={<Lightbulb color="#F59E0B" />}');
content = content.replace('title="Mit Kırıcılar" icon="' + R + R + '"', 'title="Mit Kırıcılar" icon={<ShieldAlert color="#EF4444" />}');
content = content.replace('Yanlışış' + R + R, 'Yanlış');
content = content.replace('Do' + R + 'ru', 'Doğru');
content = content.replace('iİlginçç', 'İlginç');

// Also check for any other random unicode replacements I missed
content = content.replace('Yanl' + R + R, 'Yanlış');

fs.writeFileSync('app/kutuphane/page.tsx', content, 'utf8');
console.log('Fixed İlginç section errors');
