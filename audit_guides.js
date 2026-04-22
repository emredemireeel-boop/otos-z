const fs = require('fs');
const path = 'public/data/library_guides.json';

try {
    const data = fs.readFileSync(path, 'utf8');
    const json = JSON.parse(data);
    const guides = json.guides;
    const ids = {};

    console.log('--- Guide Audit ---');
    guides.forEach((g, index) => {
        console.log(`Index ${index}: ID=${g.id}, Title="${g.title}"`);
        if (ids[g.id]) {
            console.error(`DUPLICATE ID FOUND: ${g.id} at index ${index} and ${ids[g.id]}`);
        } else {
            ids[g.id] = index;
        }
    });
    console.log('--- End Audit ---');

} catch (e) {
    console.error('Error:', e.message);
}
