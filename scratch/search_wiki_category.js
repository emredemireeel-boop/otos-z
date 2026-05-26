const https = require('https');

const options = {
  hostname: 'commons.wikimedia.org',
  path: '/w/api.php?action=query&list=categorymembers&cmtitle=Category:SVG_road_signs_in_Turkey&cmlimit=500&format=json',
  headers: { 'User-Agent': 'OtoasfaltBot/1.0' }
};

https.get(options, (res) => {
  let data = '';
  res.on('data', d => data += d);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      const images = json.query.categorymembers.map(img => img.title.replace('File:', ''));
      console.log('Found ' + images.length + ' files in Category:SVG road signs in Turkey.');
      fs.writeFileSync('scratch/wiki_signs.txt', images.join('\\n'));
    } catch (e) {
      console.log('Error parsing JSON:', data);
    }
  });
});
const fs = require('fs');
