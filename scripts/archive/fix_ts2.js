const fs = require('fs');

const path = './app/makale/[slug]/MakaleDetailClient.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/<AdPlaceholder \/>/g, '<AdPlaceholder position="sidebar" />');

fs.writeFileSync(path, content);
console.log('Fixed AdPlaceholder TS errors in MakaleDetailClient.tsx');
