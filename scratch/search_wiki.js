const https = require('https');

const options = {
  hostname: 'commons.wikimedia.org',
  path: '/w/api.php?action=query&list=allimages&aiprop=url&aiprefix=TR_road_sign_T&format=json&ailimit=500',
  headers: { 'User-Agent': 'OtoasfaltBot/1.0' }
};

https.get(options, (res) => {
  let data = '';
  res.on('data', d => data += d);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      const images = json.query.allimages.map(img => img.name);
      console.log('Found ' + images.length + ' images.');
      // Print first 50
      console.log(images.slice(0, 50).join('\\n'));
    } catch (e) {
      console.log('Error parsing JSON:', data);
    }
  });
});
