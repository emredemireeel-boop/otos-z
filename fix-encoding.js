const fs = require('fs');
const path = require('path');

const files = [
  'app/kutuphane/bakim-takvimi-section.tsx',
  'app/kutuphane/kaza-ilkyardim-section.tsx',
  'app/yakit-hesaplama/page.tsx',
];

files.forEach(file => {
  const fp = path.join(__dirname, file);
  let content = fs.readFileSync(fp, 'utf8');
  // Replace literal \uXXXX with actual unicode chars
  content = content.replace(/\\u([0-9a-fA-F]{4})/g, (match, hex) => {
    return String.fromCharCode(parseInt(hex, 16));
  });
  fs.writeFileSync(fp, content, 'utf8');
  console.log('Fixed:', file);
});
console.log('Done!');
