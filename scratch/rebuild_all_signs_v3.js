const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');

const dataFile = path.join(__dirname, '../data/trafik_isaretleri.json');
const signsDir = path.join(__dirname, '../public/signs');

const signsData = {
  categories: [
    {
      id: "tehlike_uyari",
      name: "Tehlike Uyarı İşaretleri (T Serisi)",
      description: "Sürücüleri yol üzerindeki tehlikeler konusunda uyarır. Genellikle eşkenar üçgen şeklindedir ve kırmızı vişne çürüğü çerçevesi vardır.",
      signs: [
        { id: "T-1a", name: "Sağa Tehlikeli Viraj", wiki: "Turkey_road_sign_T-1a.svg", desc: "İleride sağa dönen tehlikeli bir viraj olduğunu bildirir." },
        { id: "T-1b", name: "Sola Tehlikeli Viraj", wiki: "Turkey_road_sign_T-1b.svg", desc: "İleride sola dönen tehlikeli bir viraj olduğunu bildirir." },
        { id: "T-2a", name: "Sağa Tehlikeli Devamlı Virajlar", wiki: "Turkey_road_sign_T-2a.svg", desc: "İlki sağa olmak üzere ardı ardına devam eden tehlikeli virajları bildirir." },
        { id: "T-2b", name: "Sola Tehlikeli Devamlı Virajlar", wiki: "Turkey_road_sign_T-2b.svg", desc: "İlki sola olmak üzere ardı ardına devam eden tehlikeli virajları bildirir." },
        { id: "T-3a", name: "Tehlikeli Eğim (İniş)", wiki: "Turkey_road_sign_T-3a.svg", desc: "İleride %10 veya daha fazla iniş eğimli bir yol kesimi olduğunu bildirir." },
        { id: "T-3b", name: "Tehlikeli Eğim (Çıkış)", wiki: "Turkey_road_sign_T-3b.svg", desc: "İleride %10 veya daha fazla çıkış eğimli bir yol kesimi olduğunu bildirir." },
        { id: "T-4a", name: "Her İki Taraftan Daralan Kaplama", wiki: "Turkey_road_sign_T-4a.svg", desc: "İleride yolun her iki taraftan daralacağını bildirir." },
        { id: "T-4b", name: "Sağdan Daralan Kaplama", wiki: "Turkey_road_sign_T-4b.svg", desc: "İleride yolun sağ taraftan daralacağını bildirir." },
        { id: "T-7", name: "Kasisli Yol", wiki: "Turkey_road_sign_T-7.svg", desc: "İleride kasis bulunduğunu bildirir." },
        { id: "T-8", name: "Kaygan Yol", wiki: "Turkey_road_sign_T-8.svg", desc: "Yolun kaygan olabileceğini bildirir." },
        { id: "T-9", name: "Gevşek Malzemeli Zemin", wiki: "Turkey_road_sign_T-9.svg", desc: "Yol üzerinde gevşek malzeme bulunduğunu bildirir." },
        { id: "T-10", name: "Gevşek Şev", wiki: "Turkey_road_sign_T-10.svg", desc: "Yarma şevlerinden yola taş veya kaya düşebileceğini bildirir." },
        { id: "T-11", name: "Yaya Geçidi", wiki: "Turkey_road_sign_T-11.svg", desc: "İleride yaya geçidi bulunduğunu bildirir." },
        { id: "T-12", name: "Okul Geçidi", wiki: "Turkey_road_sign_T-12.svg", desc: "İleride okul geçidi bulunduğunu bildirir." },
        { id: "T-14a", name: "Ehli Hayvan Geçebilir", wiki: "Turkey_road_sign_T-14a.svg", desc: "Yola ehli hayvan çıkabileceğini bildirir." },
        { id: "T-14b", name: "Vahşi Hayvan Geçebilir", wiki: "Turkey_road_sign_T-14b.svg", desc: "Yola vahşi hayvan çıkabileceğini bildirir." },
        { id: "T-15", name: "Yolda Çalışma Var", wiki: "Turkey_road_sign_T-15.svg", desc: "İleride yapım, bakım veya onarım çalışması olduğunu bildirir." },
        { id: "T-16", name: "Işıklı İşaret Cihazı", wiki: "Turkey_road_sign_T-16.svg", desc: "İleride trafik ışıkları olduğunu bildirir." },
        { id: "T-18", name: "İki Yönlü Trafik", wiki: "Turkey_road_sign_T-18.svg", desc: "İki yönlü trafiğin olduğu yola girileceğini bildirir." },
        { id: "T-19", name: "Dikkat", wiki: "Turkey_road_sign_T-19.svg", desc: "Tanımlanmamış tehlikelerin olabileceğini bildirir." },
        { id: "T-21", name: "Kontrolsüz Kavşak", wiki: "Turkey_road_sign_T-21.svg", desc: "İleride kontrolsüz kavşak bulunduğunu bildirir." },
        { id: "T-22a", name: "Ana Yol Tali Yol Kavşağı", wiki: "Turkey_road_sign_T-22a.svg", desc: "Ana yola tali yolların bağlanacağı bir kavşak olduğunu bildirir." },
        { id: "T-23a", name: "Dönel Kavşak Yaklaşımı", wiki: "Turkey_road_sign_T-23a.svg", desc: "İleride dönel kavşak bulunduğunu bildirir." },
        { id: "T-25", name: "Kontrollü Demiryolu Geçidi", wiki: "Turkey_road_sign_T-25.svg", desc: "Bariyerli hemzemin geçit olduğunu bildirir." },
        { id: "T-26", name: "Kontrolsüz Demiryolu Geçidi", wiki: "Turkey_road_sign_T-26.svg", desc: "Bariyersiz hemzemin geçit olduğunu bildirir." }
      ]
    },
    {
      id: "trafik_tanzim",
      name: "Trafik Tanzim İşaretleri (TT Serisi)",
      description: "Trafik akışını düzenler, yasaklar ve kısıtlamalar getirir. Genellikle yuvarlaktır ve uymamak asli kusur/ceza sebebidir.",
      signs: [
        { id: "TT-1", name: "Yol Ver", wiki: "Turkey_road_sign_TT-1.svg", desc: "Kavşağa yaklaşan araçların geçiş hakkı vermesi gerektiğini bildirir." },
        { id: "TT-2", name: "Dur", wiki: "Turkey_road_sign_TT-2.svg", desc: "Kavşağa girmeden önce tamamen durulması gerektiğini bildirir." },
        { id: "TT-3", name: "Karşıdan Gelene Yol Ver", wiki: "Turkey_road_sign_TT-3.svg", desc: "Karşı yönden gelen araçlara öncelik verilmesi gerektiğini bildirir." },
        { id: "TT-4", name: "Taşıt Trafiğine Kapalı Yol", wiki: "Turkey_road_sign_TT-4.svg", desc: "Yolun araç trafiğine kapalı olduğunu bildirir." },
        { id: "TT-5", name: "Girişi Olmayan Yol", wiki: "Turkey_road_sign_TT-5.svg", desc: "Ters yön girişini belirtir." },
        { id: "TT-6", name: "Motorlu Taşıt Giremez", wiki: "Turkey_road_sign_TT-6.svg", desc: "Motosikletler hariç motorlu taşıtların girmesinin yasak olduğunu bildirir." },
        { id: "TT-8", name: "Motosiklet Giremez", wiki: "Turkey_road_sign_TT-8.svg", desc: "Motosikletlerin girmesinin yasak olduğunu bildirir." },
        { id: "TT-9", name: "Bisiklet Giremez", wiki: "Turkey_road_sign_TT-9.svg", desc: "Bisikletlerin girmesinin yasak olduğunu bildirir." },
        { id: "TT-13", name: "Yaya Giremez", wiki: "Turkey_road_sign_TT-13.svg", desc: "Yayaların girmesinin yasak olduğunu bildirir." },
        { id: "TT-17", name: "Genişliği Fazla Olan Taşıt Giremez", wiki: "Turkey_road_sign_TT-17.svg", desc: "Geniş araçların girmesinin yasak olduğunu bildirir." },
        { id: "TT-18", name: "Yüksekliği Fazla Olan Taşıt Giremez", wiki: "Turkey_road_sign_TT-18.svg", desc: "Yüksek araçların girmesinin yasak olduğunu bildirir." },
        { id: "TT-26a", name: "Sağa Dönülmez", wiki: "Turkey_road_sign_TT-26a.svg", desc: "Sağa dönmenin yasak olduğunu bildirir." },
        { id: "TT-26b", name: "Sola Dönülmez", wiki: "Turkey_road_sign_TT-26b.svg", desc: "Sola dönmenin yasak olduğunu bildirir." },
        { id: "TT-27", name: "U Dönüşü Yapılmaz", wiki: "Turkey_road_sign_TT-27.svg", desc: "U dönüşü yapmanın yasak olduğunu bildirir." },
        { id: "TT-28", name: "Öndeki Taşıtı Geçmek Yasaktır", wiki: "Turkey_road_sign_TT-28.svg", desc: "Sollama yapmanın yasak olduğunu bildirir." },
        { id: "TT-29", name: "Kamyonlar İçin Öndeki Taşıtı Geçmek Yasaktır", wiki: "Turkey_road_sign_TT-29.svg", desc: "Kamyonların sollama yapmasının yasak olduğunu bildirir." },
        { id: "TT-30", name: "Azami Hız Sınırlaması", wiki: "Turkey_road_sign_TT-30.svg", desc: "Azami hız kısıtlamasını bildirir." },
        { id: "TT-31", name: "Sesli İkaz Cihazları Yasaktır", wiki: "Turkey_road_sign_TT-31.svg", desc: "Korna çalınmasının yasak olduğunu bildirir." },
        { id: "TT-32", name: "Bütün Yasaklamaların Sonu", wiki: "Turkey_road_sign_TT-32.svg", desc: "Daha önceki tüm yasaklamaların sona erdiğini bildirir." },
        { id: "TT-33", name: "Hız Sınırlaması Sonu", wiki: "Turkey_road_sign_TT-33.svg", desc: "Hız kısıtlamasının sona erdiğini bildirir." },
        { id: "TT-34a", name: "Geçme Yasağı Sonu", wiki: "Turkey_road_sign_TT-34a.svg", desc: "Sollama yasağının bittiğini bildirir." },
        { id: "TT-35a", name: "İleri Mecburi Yön", wiki: "TR_road_sign_TT-35a.svg", desc: "Sadece düz gidilebileceğini bildirir." },
        { id: "TT-35b", name: "Sağa Mecburi Yön", wiki: "TR_road_sign_TT-35b.svg", desc: "Sadece sağa dönülebileceğini bildirir." },
        { id: "TT-35c", name: "Sola Mecburi Yön", wiki: "TR_road_sign_TT-35c.svg", desc: "Sadece sola dönülebileceğini bildirir." },
        { id: "TT-38", name: "Park Yasaktır", wiki: "Turkey_road_sign_TT-38.svg", desc: "Park etmenin yasak olduğunu bildirir." },
        { id: "TT-39", name: "Duraklamak ve Park Etmek Yasaktır", wiki: "Turkey_road_sign_TT-39.svg", desc: "Duraklama ve park etmenin kesinlikle yasak olduğunu bildirir." }
      ]
    },
    {
      id: "bilgi_isaretleri",
      name: "Bilgi İşaretleri (B Serisi)",
      description: "Sürücülere yol, yerleşim yerleri, hizmet tesisleri ve kurallar hakkında bilgi verir.",
      signs: [
        { id: "B-14a", name: "Yaya Geçidi", wiki: "Turkey_road_sign_B-14a.svg", desc: "Yaya geçidi olduğunu bildirir." },
        { id: "B-14b", name: "Okul Geçidi", wiki: "Turkey_road_sign_B-14b.svg", desc: "Okul geçidi olduğunu bildirir." }
      ]
    }
  ]
};

function getWikimediaUrl(filename) {
    const fn = filename.replace(/ /g, '_');
    const hash = crypto.createHash('md5').update(fn).digest('hex');
    return 'https://upload.wikimedia.org/wikipedia/commons/' + hash.substring(0,1) + '/' + hash.substring(0,2) + '/' + encodeURIComponent(fn);
}

function downloadFile(url, filepath) {
    return new Promise((resolve) => {
        const options = {
            headers: { 
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'image/svg+xml'
            }
        };
        https.get(url, options, (res) => {
            if (res.statusCode === 301 || res.statusCode === 302) {
                downloadFile(res.headers.location, filepath).then(resolve);
                return;
            }
            if (res.statusCode !== 200) {
                resolve(false);
                return;
            }
            const file = fs.createWriteStream(filepath);
            res.pipe(file);
            file.on('finish', () => { file.close(); resolve(true); });
            file.on('error', () => { fs.unlinkSync(filepath); resolve(false); });
        }).on('error', () => resolve(false));
    });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
    let successCount = 0;
    const finalData = { categories: [] };
    
    // Clear out existing SVGs to ensure we don't serve old ones if they fail
    // except the ones I perfected
    const perfected = ['T-1a', 'T-1b', 'T-2a', 'T-2b', 'T-3a', 'T-3b', 'T-4a', 'T-4b', 'T-7'];
    
    for (const cat of signsData.categories) {
        const outCat = { ...cat, signs: [] };
        for (const sign of cat.signs) {
            const filepath = path.join(signsDir, sign.id + '.svg');
            const url = getWikimediaUrl(sign.wiki);
            
            let success = false;
            if (perfected.includes(sign.id) && fs.existsSync(filepath)) {
                success = true;
                console.log('✅ Kept perfected SVG: ' + sign.id);
            } else {
                const fileContent = fs.existsSync(filepath) ? fs.readFileSync(filepath, 'utf8') : '';
                if (fs.existsSync(filepath) && !fileContent.includes('MISSING')) {
                    success = true;
                    console.log('✅ Kept existing SVG: ' + sign.id);
                } else {
                    success = await downloadFile(url, filepath);
                    if (success) {
                        successCount++;
                        console.log('✅ Success: ' + sign.id);
                    } else {
                        console.log('❌ Failed: ' + sign.id + ' (Will create empty mockup)');
                        const fallback = '<?xml version="1.0"?><svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="45" fill="#f00" /><text x="50" y="55" font-family="Arial" font-size="20" fill="#fff" text-anchor="middle">MISSING</text></svg>';
                        fs.writeFileSync(filepath, fallback);
                    }
                    await sleep(3000);
                }
            }
            
            outCat.signs.push({
                id: sign.id,
                name: sign.name,
                image: '/signs/' + sign.id + '.svg?v=' + Date.now(),
                description: sign.desc
            });
        }
        finalData.categories.push(outCat);
    }
    
    fs.writeFileSync(dataFile, JSON.stringify(finalData, null, 2));
    console.log('\\nDone! Downloaded ' + successCount + ' authentic signs and rebuilt JSON with ?v cache buster.');
}

main().catch(console.error);
