const https = require('https');
const fs = require('fs');

const url = 'https://api.allorigins.win/raw?url=' + encodeURIComponent('https://upload.wikimedia.org/wikipedia/commons/9/99/Turkey_road_sign_P-1.svg');

https.get(url, (res) => {
    console.log(res.statusCode);
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        console.log("Size: ", data.length);
        if (data.includes('<svg')) {
            console.log("It's an SVG!");
        }
    });
});
