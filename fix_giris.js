const fs = require('fs');
let f = fs.readFileSync('app/giris/page.tsx', 'utf8');

const orig = f;

// Fix: GiriŞ / giriŞ -> Giriş / giriş (capital Ş after Giri should be lowercase ş)
f = f.replace(/Giri\u015e/g, 'Giri\u015f');
f = f.replace(/giri\u015e/g, 'giri\u015f');

// Fix: DoğrulanmıŞ -> Doğrulanmış
f = f.replace(/Do\u011frulanm\u0131\u015e/g, 'Do\u011frulanm\u0131\u015f');

// Fix broken bullet placeholder: • sequences -> •
f = f.replace(/\u00e2\u20ac\u00a2/g, '\u2022');

// Fix broken trademark: ™ -> ™
f = f.replace(/\u00e2\u201e\u00a2/g, '\u2122');

// Also catch literal mojibake strings if they survived as-is in the source
f = f.split('GiriŞ').join('Giriş');
f = f.split('giriŞ').join('giriş');
f = f.split('DoğrulanmıŞ').join('Doğrulanmış');
f = f.split('\u00e2\u20ac\u00a2').join('\u2022');

if (f === orig) {
    console.log('WARNING: No changes made — characters may already be correct or in a different encoding');
} else {
    fs.writeFileSync('app/giris/page.tsx', f, 'utf8');
    console.log('Done. File updated.');
}
