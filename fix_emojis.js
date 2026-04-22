const fs = require('fs');

let u = fs.readFileSync('app/uzmana-sor/page.tsx', 'utf8');

// Fix emoji placeholders based on context
// L591, L593: separator dots before date 
// L594: eye emoji for views
// L930-936: checkmark bullets - premium list  
// L980-986: checkmark bullets - free list
// L776, L836: section header emojis
// L231, L245, L274: small emojis
// L1126: comment/chat emoji  
// L1167: arrow emoji
// L1176: price/free labels
// L1320: send/pay button

const ulines = u.split('\n');

// Helper: replace specific line
function replaceLine(lineNum, newContent) {
  ulines[lineNum - 1] = newContent;
}

// L591, L593: dots between metadata
replaceLine(591, "                                                    <span>·</span>");
replaceLine(593, "                                                    <span>·</span>");
// L594: views with eye emoji
replaceLine(594, "                                                    <span>👁 {q.views}</span>");

// L930-936: orange checkmarks (premium features)
replaceLine(930, "                                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ color: 'var(--primary)' }}>✓</span> Uzman garantili yanıt</li>");
replaceLine(933, "                                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ color: 'var(--primary)' }}>✓</span> Öncelikli destek</li>");
replaceLine(936, "                                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ color: 'var(--primary)' }}>✓</span> Detaylı açıklama</li>");

// L980-986: blue checkmarks (free features)
replaceLine(980, "                                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ color: '#3b82f6' }}>✓</span> Topluluk yanıtları</li>");
replaceLine(983, "                                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ color: '#3b82f6' }}>✓</span> Sınırsız soru</li>");
replaceLine(986, "                                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ color: '#3b82f6' }}>✓</span> Herkese açık</li>");

// L776: section heading emoji (likely 💬 or 🔖)
ulines[775] = ulines[775].replace('>??<', '>💬<');
// L836: section heading emoji  
ulines[835] = ulines[835].replace('>??<', '>⭐<');

// L231: small icon (likely a star or badge)
ulines[230] = ulines[230].replace('>?<', '>★<');
// L245: colored emoji (category icon)
ulines[244] = ulines[244].replace('>?<', '>🔧<');
// L274: badge label
ulines[273] = ulines[273].replace('>?<', '>★<');

// L1126: ?? double emoji in chat bubble context
ulines[1125] = ulines[1125].replace('>??<', '>💬<');
// L1167: arrow icon
ulines[1166] = ulines[1166].replace('>?<', '>→<');

// L1176: price labels  
ulines[1175] = ulines[1175].replace("'? ?cretli'", "'💰 Ücretli'").replace("'?? ?cretsiz'", "'✓ Ücretsiz'");
// L1320: button text
ulines[1319] = ulines[1319].replace("'Gönder ve ?de (50?)'", "'Gönder ve Öde (50₺)'").replace("'Soruyu Gönder'", "'Soruyu Gönder'");

u = ulines.join('\n');
fs.writeFileSync('app/uzmana-sor/page.tsx', u, 'utf8');
console.log('Done! Fixed uzmana-sor emojis and remaining Turkish chars');

// Final check
const remaining = (u.match(/>[^<]*\?[^<]*</g) || []).filter(m => !/[A-Za-z0-9\s]/.test(m.replace(/[^?]/g,'')) === false).length;
console.log('Quick remaining check done');
