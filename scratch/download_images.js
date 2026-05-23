const fs = require('fs');
const path = require('path');
const https = require('https');

// 26 completely unique and stunning automotive photography IDs from Unsplash.
// We map each ID to its index so we get 26 completely distinct images.
const unsplashIds = [
    "photo-1549399542-7e3f8b79c341", // 1. Mercedes-Benz (Classic Benz in city)
    "photo-1503376780353-7e6692767b70", // 2. Porsche 911 (Sleek sports car)
    "photo-1552519507-da3b142c6e3d", // 3. Chevrolet Corvette (Aesthetic side view)
    "photo-1492144534655-ae79c964c9d7", // 4. Luxury Muscle Car (Black classic sedan)
    "photo-1580273916550-e323be2ae537", // 5. BMW M4 (Sporty blue sedan front)
    "photo-1617814076367-b759c7d7e738", // 6. Classic retro car headlights
    "photo-1502877338535-766e1452684a", // 7. Vintage Red VW Beetle
    "photo-1568605117036-5fe5e7bab0b7", // 8. Modern white sports car front
    "photo-1616422285623-13ff0162193c", // 9. Outdoor used car dealership lot
    "photo-1605559424843-9e4c228bf1c2", // 10. Sleek grey SUV front angle
    "photo-1542282088-fe8426682b8f", // 11. Car driving on scenic road
    "photo-1511919884226-fd3cad34687c", // 12. Yellow Lamborghini supercar
    "photo-1553440569-bcc63803a83d", // 13. Red Ford Mustang muscle car
    "photo-1525609004556-c46c7d6cf0a3", // 14. Orange Aston Martin luxury car
    "photo-1618843479313-40f8afb4b4d8", // 15. Luxury Mercedes G-Wagon SUV
    "photo-1555215695-3004980ad54e", // 16. Luxury black classic saloon car
    "photo-1567818735868-e71b99932e29", // 17. Aesthetic wheel and brake details
    "photo-1514316454349-750a7fd3da3a", // 18. Elegant classic blue car front
    "photo-1606016159991-dfe4f2746ad5", // 19. Vintage Mustang in a garage
    "photo-1619767886558-efdc259cde1a", // 20. Modern black luxury sedan
    "photo-1603584173870-7f23fdae1b7a", // 21. Sleek Audi e-tron SUV
    "photo-1590362891961-309131744b9a", // 22. Rugged grey Jeep Wrangler offroad
    "photo-1610647752706-3bb12232b3ab", // 23. Classic red pickup truck
    "photo-1559416523-140ddc3d238c", // 24. Beautiful outdoor parking lot of cars
    "photo-1541899481282-d53bffe3c35d", // 25. High-end motor show exhibition
    "photo-1533473359331-0135ef1b58bf"  // 26. Red SUV crossing stream (offroad)
];

const publicDir = path.join(__dirname, '..', 'public');

// Helper function to download an image from Unsplash with a specific ID
function downloadImage(photoId, index) {
    return new Promise((resolve, reject) => {
        const filename = `otopazari_gen_${index}.png`;
        const filePath = path.join(publicDir, filename);
        // We use Unsplash Source CDN with a fixed width of 800px and 80% JPEG quality
        const url = `https://images.unsplash.com/${photoId}?w=800&auto=format&fit=crop&q=80`;

        console.log(`[${index}/26] Downloading ${filename} from Unsplash ID: ${photoId}...`);

        https.get(url, (response) => {
            if (response.statusCode === 301 || response.statusCode === 302) {
                // Handle redirect if any
                https.get(response.headers.location, (redirectResponse) => {
                    if (redirectResponse.statusCode !== 200) {
                        reject(new Error(`Failed to download ${filename}: Status ${redirectResponse.statusCode}`));
                        return;
                    }
                    const fileStream = fs.createWriteStream(filePath);
                    redirectResponse.pipe(fileStream);
                    fileStream.on('finish', () => {
                        fileStream.close();
                        console.log(`[${index}/26] Saved ${filename} successfully!`);
                        resolve();
                    });
                }).on('error', reject);
                return;
            }

            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download ${filename}: Status ${response.statusCode}`));
                return;
            }

            const fileStream = fs.createWriteStream(filePath);
            response.pipe(fileStream);
            fileStream.on('finish', () => {
                fileStream.close();
                console.log(`[${index}/26] Saved ${filename} successfully!`);
                resolve();
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
}

async function run() {
    try {
        console.log("Starting batch download of 26 unique images...");
        for (let i = 0; i < unsplashIds.length; i++) {
            const photoId = unsplashIds[i];
            const index = i + 1;
            await downloadImage(photoId, index);
            // Small pause between requests to be polite to the CDN
            await new Promise(r => setTimeout(r, 200));
        }
        console.log("All 26 unique images have been downloaded successfully!");
    } catch (error) {
        console.error("Error during download process:", error);
    }
}

run();
