const fs = require('fs');
const path = require('path');
const https = require('https');

const cars = [
  {
    id: "tofas-murat-131-124",
    url: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&q=80"
  },
  {
    id: "tofas-dogan",
    url: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&q=80"
  },
  {
    id: "skoda-favorit",
    url: "https://images.unsplash.com/photo-1502877338593-d29a509eb177?w=800&q=80"
  },
  {
    id: "renault-9",
    url: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=800&q=80"
  },
  {
    id: "ford-escort",
    url: "https://images.unsplash.com/photo-1610647752706-3bb12232b3ab?w=800&q=80"
  },
  {
    id: "ford-taunus",
    url: "https://images.unsplash.com/photo-1590212948175-fb1896d859ce?w=800&q=80"
  },
  {
    id: "lada-samara",
    url: "https://images.unsplash.com/photo-1623869675781-80aa31012a5a?w=800&q=80"
  },
  {
    id: "renault-11",
    url: "https://images.unsplash.com/photo-1520638531123-bc70e176ff83?w=800&q=80"
  },
  {
    id: "fiat-uno",
    url: "https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?w=800&q=80"
  }
];

const publicDir = path.join(__dirname, '..', 'public', 'cars');

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
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
    console.log(`Downloading Unsplash replacement for ${car.id}...`);
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
