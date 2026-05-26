const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../public/data/library_guides.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const guide = data.guides.find(g => g.id === "guide_kendin_yap_cozumler");
if (guide) {
  guide.urlId = "10043";
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log('Fixed urlId successfully!');
} else {
  console.log('Guide not found.');
}
