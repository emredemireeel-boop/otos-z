const fs = require('fs');
let content = fs.readFileSync('app/page.tsx', 'utf8');
content = content.replace(
    /minRows=\{newTopicData\.type === 'survey' \? 2 : 4\}[\s\S]*?resize: 'none',\s*\}\}\s*\/>/,
    "minRows={newTopicData.type === 'survey' ? 2 : 4}\n                                />"
);
fs.writeFileSync('app/page.tsx', content);
console.log("Fixed page.tsx");
