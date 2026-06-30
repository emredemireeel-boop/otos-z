const d = require('../data/obd-codes.json');
console.log('Toplam OBD kodu:', d.length);

const types = { P: 0, B: 0, C: 0, U: 0 };
d.forEach(c => types[c.type] = (types[c.type] || 0) + 1);
console.log('Tiplere gore dagilim:', JSON.stringify(types));

const empty_sym = d.filter(c => c.symptoms.length === 0).length;
const one_cause = d.filter(c => c.causes.length <= 1).length;
const one_fix = d.filter(c => c.fixes.length <= 1).length;
const same_desc = d.filter(c => c.description === c.title).length;

console.log('Bos semptom:', empty_sym);
console.log('1 veya az neden:', one_cause);
console.log('1 veya az cozum:', one_fix);
console.log('Description=Title (ayni):', same_desc);

// Fakir iceriklere ornek goster
const poorCodes = d.filter(c =>
  c.symptoms.length === 0 && c.causes.length <= 1 && c.fixes.length <= 1
);
console.log('\nEn fakir icerikli kodlardan ornekler (ilk 10):');
poorCodes.slice(0, 10).forEach(c => {
  console.log(`  ${c.code}: ${c.title}`);
  console.log(`    Symptoms: [${c.symptoms.join(', ')}]`);
  console.log(`    Causes: [${c.causes.join(', ')}]`);
  console.log(`    Fixes: [${c.fixes.join(', ')}]`);
});

// P kod araliklarina bak - hangileri eksik?
const pCodes = d.filter(c => c.type === 'P').map(c => c.code);
console.log('\nP kodlari araligi:', pCodes[0], '-', pCodes[pCodes.length - 1]);

// Hangi P0xxx araligi eksik?
const p0Codes = new Set(d.filter(c => c.code.startsWith('P0')).map(c => c.code));
let missing = 0;
for (let i = 0; i <= 999; i++) {
  const code = 'P0' + String(i).padStart(3, '0');
  if (!p0Codes.has(code)) missing++;
}
console.log('P0000-P0999 araliginda eksik:', missing, 'kod');

const p1Codes = new Set(d.filter(c => c.code.startsWith('P1')).map(c => c.code));
let missingP1 = 0;
for (let i = 0; i <= 999; i++) {
  const code = 'P1' + String(i).padStart(3, '0');
  if (!p1Codes.has(code)) missingP1++;
}
console.log('P1000-P1999 araliginda eksik:', missingP1, 'kod');

const p2Codes = new Set(d.filter(c => c.code.startsWith('P2')).map(c => c.code));
let missingP2 = 0;
for (let i = 0; i <= 999; i++) {
  const code = 'P2' + String(i).padStart(3, '0');
  if (!p2Codes.has(code)) missingP2++;
}
console.log('P2000-P2999 araliginda eksik:', missingP2, 'kod');
