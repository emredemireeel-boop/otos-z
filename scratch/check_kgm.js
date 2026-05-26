const https = require('https');
https.get('https://www.kgm.gov.tr/SiteCollectionImages/KGMimages/Trafik/Isaretler/TehlikeUyari/t1a.gif', {
    rejectUnauthorized: false
}, (res) => {
    console.log('KGM status:', res.statusCode);
}).on('error', (e) => {
    console.error('KGM error:', e.message);
});
