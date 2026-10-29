const fs = require('fs');

const path = './app/makale/[slug]/MakaleDetailClient.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/<AdPlaceholder format="vertical" \/>/g, '<AdPlaceholder />');
content = content.replace(/<PopularThreadsWidget limit=\{5\} \/>/g, '<PopularThreadsWidget />');
content = content.replace(/<LatestThreadsWidget limit=\{5\} \/>/g, '<LatestThreadsWidget />');
content = content.replace(/<AdPlaceholder format="square" \/>/g, '<AdPlaceholder />');

fs.writeFileSync(path, content);
console.log('Fixed TS errors in MakaleDetailClient.tsx');
