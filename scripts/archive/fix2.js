const fs = require('fs');

const dataPath = 'data/otobutce-data.ts';
let content = fs.readFileSync(dataPath, 'utf8');

// There are malformed cars from the previous regex.
// Let's print out what the malformed block looks like around c-0-2.
const index = content.indexOf('c-0-2');
console.log(content.substring(index - 100, index + 200));

// Let's actually just extract all the clean properties we can find, and rewrite OTOBUTCE_CATEGORIES.
// But it's easier to find the exact errors.
