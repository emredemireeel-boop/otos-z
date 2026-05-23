const fs = require('fs');
const path = require('path');
const https = require('https');

const cars = [
  {
    id: "tofas-murat-131-124",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/1980_Murat_131.jpg/800px-1980_Murat_131.jpg"
  },
  {
    id: "tofas-dogan",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Tofa%C5%9F_Do%C4%9Fan.jpg/800px-Tofa%C5%9F_Do%C4%9Fan.jpg"
  },
  {
    id: "skoda-favorit",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Skoda_Favorit_front_20080327.jpg/800px-Skoda_Favorit_front_20080327.jpg"
  },
  {
    id: "renault-9",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Renault_9_GTC_1985.jpg/800px-Renault_9_GTC_1985.jpg"
  },
  {
    id: "ford-escort",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Ford_Escort_Mk5_1991.jpg/800px-Ford_Escort_Mk5_1991.jpg"
  },
  {
    id: "ford-taunus",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Ford_Taunus_TC2.jpg/800px-Ford_Taunus_TC2.jpg"
  },
  {
    id: "lada-samara",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Lada_Samara_2109_1.5.jpg/800px-Lada_Samara_2109_1.5.jpg"
  },
  {
    id: "renault-11",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Renault_11_GTL_1985.jpg/800px-Renault_11_GTL_1985.jpg"
  },
  {
    id: "fiat-uno",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Fiat_Uno_1.1_i.e._front.jpg/800px-Fiat_Uno_1.1_i.e._front.jpg"
  }
];

const publicDir = path.join(__dirname, '..', 'public', 'cars');

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'OtoAsfalt/1.0 (admin@otoasfalt.com)',
        'Accept': 'image/jpeg,image/png,*/*'
      }
    };
    https.get(url, options, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadImage(res.headers.location, filepath).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Status Code: ${res.statusCode}`));
      }
      const writeStream = fs.createWriteStream(filepath);
      res.pipe(writeStream);
      writeStream.on('finish', () => {
        writeStream.close();
        resolve();
      });
    }).on('error', reject);
  });
}

async function run() {
  for (const car of cars) {
    const dest = path.join(publicDir, `${car.id}.jpg`);
    console.log(`Downloading ${car.id}...`);
    try {
      await downloadImage(car.url, dest);
      const stats = fs.statSync(dest);
      console.log(`Successfully downloaded ${car.id}.jpg (Size: ${stats.size} bytes)`);
    } catch (err) {
      console.error(`Failed to download ${car.id}:`, err.message);
    }
  }
}

run();
