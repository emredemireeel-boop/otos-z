const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

// ═══════════════════════════════════════════════════════════════
// Google Indexing API — Stratejik 200 URL Bildirimi
// ═══════════════════════════════════════════════════════════════
// Günlük limit: 200 URL
// Strateji: En yüksek SEO etkili sayfalar önce
// --dry-run  : Sadece listeyi göster, API çağrısı yapma
// --resume   : Kaldığı yerden devam et (progress dosyasından)
// --reset    : İlerleme dosyasını sıfırla
// ═══════════════════════════════════════════════════════════════

const KEY_FILE = 'otosozindex-7a4ca5cb2331.json';
const BASE_URL = 'https://www.otosoz.com';
const PROGRESS_FILE = path.join(__dirname, '.index-progress.json');

const auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, KEY_FILE),
    scopes: ['https://www.googleapis.com/auth/indexing'],
});

// ── Türkçe slug helper ──
function createSlug(text) {
    const trMap = {
        'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
        'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u',
    };
    return text.replace(/[çğıöşüÇĞİÖŞÜ]/g, m => trMap[m] || m)
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

// ── İlerleme kaydetme/yükleme ──
function loadProgress() {
    try {
        if (fs.existsSync(PROGRESS_FILE)) {
            return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
        }
    } catch (e) {}
    return { completedUrls: [], lastRun: null, totalSuccess: 0, totalFail: 0 };
}

function saveProgress(progress) {
    fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2), 'utf8');
}

function buildUrls() {
    const urls = [];

    // ═══════════════════════════════════════════════════════════
    // 1. ANA SAYFALAR — En Yüksek Öncelik (6 URL)
    // ═══════════════════════════════════════════════════════════
    const mainPages = [
        '/',                    // Ana sayfa
        '/forum',               // Forum (UGC, yüksek trafik)
        '/pazar',               // Pazar (ilan, yüksek trafik)
        '/karsilastirma',       // Araç karşılaştırma (yüksek intent)
        '/arac-dna',            // Araç DNA analiz (benzersiz içerik)
        '/uzmana-sor',          // Uzman soru-cevap
    ];
    mainPages.forEach(p => urls.push({ url: `${BASE_URL}${p}`, tier: '🔴 T1-ANA' }));

    // ═══════════════════════════════════════════════════════════
    // 2. İÇERİK SAYFALARI — Yüksek Öncelik (9 URL)
    // ═══════════════════════════════════════════════════════════
    const contentPages = [
        '/kutuphane',           // Kütüphane hub
        '/sozluk',              // Otomotiv sözlük hub
        '/gosterge-paneli',     // Gösterge paneli
        '/piyasalar',           // Piyasa endeksleri (yüksek trafik)
        '/anket',               // Anketler
        '/obd',                 // OBD hub sayfası
        '/yakit-hesaplama',     // Yakıt hesaplama aracı
        '/etkinlikler',         // Etkinlikler hub
        '/ajanda',              // Ajanda
    ];
    contentPages.forEach(p => urls.push({ url: `${BASE_URL}${p}`, tier: '🟠 T2-İÇERİK' }));

    // ═══════════════════════════════════════════════════════════
    // 3. ETKİNLİK DETAY SAYFALARI (5 URL)
    // ═══════════════════════════════════════════════════════════
    const eventIds = [
        'istanbul-kartal-otopazari',
        'ankara-pursaklar-otopazari',
        'izmir-kemalpasa-otopazari',
        'izmir-gaziemir-otopazari',
        'bursa-nilufer-otopazari',
    ];
    eventIds.forEach(id => urls.push({ url: `${BASE_URL}/etkinlikler/${id}`, tier: '🟡 T3-ETKİNLİK' }));

    // ═══════════════════════════════════════════════════════════
    // 4. ARAÇ DNA — Marka Sayfaları (21 URL)
    // ═══════════════════════════════════════════════════════════
    const brands = [
        'Renault', 'Fiat', 'Toyota', 'Honda', 'Volkswagen',
        'Dacia', 'Hyundai', 'Peugeot', 'Opel', 'Togg',
        'Chery', 'Ford', 'BMW', 'Mercedes-Benz', 'Nissan',
        'Kia', 'Citroen', 'Skoda', 'Seat', 'Tesla', 'Audi'
    ];
    brands.forEach(b => urls.push({
        url: `${BASE_URL}/arac-dna/${b.toLowerCase().replace(/\s+/g, '-')}`,
        tier: '🟡 T3-DNA-MARKA'
    }));

    // ═══════════════════════════════════════════════════════════
    // 5. ARAÇ DNA — En Popüler Model Sayfaları (13 URL)
    // ═══════════════════════════════════════════════════════════
    const topModels = [
        { brand: 'Renault', model: 'Clio' },
        { brand: 'Fiat', model: 'Egea' },
        { brand: 'Toyota', model: 'Corolla' },
        { brand: 'Honda', model: 'Civic' },
        { brand: 'Volkswagen', model: 'Passat' },
        { brand: 'Dacia', model: 'Duster' },
        { brand: 'Hyundai', model: 'i20' },
        { brand: 'Peugeot', model: '3008' },
        { brand: 'Opel', model: 'Corsa' },
        { brand: 'Togg', model: 'T10X' },
        { brand: 'Volkswagen', model: 'Golf' },
        { brand: 'Ford', model: 'Focus' },
        { brand: 'BMW', model: '320i' },
    ];
    topModels.forEach(v => urls.push({
        url: `${BASE_URL}/arac-dna/${v.brand.toLowerCase().replace(/\s+/g, '-')}/${v.model.toLowerCase().replace(/\s+/g, '-')}`,
        tier: '🟡 T3-DNA-MODEL'
    }));

    // ═══════════════════════════════════════════════════════════
    // 6. KÜTÜPHANE BÖLÜM SAYFALARI (11 URL)
    // ═══════════════════════════════════════════════════════════
    const kutuphaneSections = [
        'trafik-cezalari',      // 🔥 Çok yüksek arama hacmi
        'obd-ariza-kodlari',    // 🔥 Çok yüksek arama hacmi
        'otomotiv-sozluk',
        'gosterge-isiklari',
        'ikinci-el-rehberi',
        'lastik-rehberi',
        'kaza-ilkyardim',
        'mevsimsel-bakim',
        'sigorta-rehberi',
        'ilginc-bilgiler',
        'makaleler',
    ];
    kutuphaneSections.forEach(s => urls.push({
        url: `${BASE_URL}/kutuphane?kategori=${s}`,
        tier: '🟡 T3-KÜTÜPHANE'
    }));

    // ═══════════════════════════════════════════════════════════
    // 7. GÖSTERGE IŞIKLARI — 19 Detay Sayfası (19 URL)
    // ═══════════════════════════════════════════════════════════
    try {
        const faultLights = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'fault_lights.json'), 'utf8'));
        faultLights.warningLights.forEach(light => {
            urls.push({
                url: `${BASE_URL}/gosterge/${createSlug(light.title)}--${light.urlId}`,
                tier: '🟢 T4-GÖSTERGE'
            });
        });
    } catch (e) {
        console.error('⚠ Fault lights verisi okunamadı:', e.message);
    }

    // ═══════════════════════════════════════════════════════════
    // 8. MAKALELER — 28 Detay Sayfası (28 URL)
    // ═══════════════════════════════════════════════════════════
    try {
        const guides = JSON.parse(fs.readFileSync(path.join(__dirname, 'public', 'data', 'library_guides.json'), 'utf8'));
        guides.guides.forEach(guide => {
            urls.push({
                url: `${BASE_URL}/makale/${createSlug(guide.title)}--${guide.urlId}`,
                tier: '🟢 T4-MAKALE'
            });
        });
    } catch (e) {
        console.error('⚠ Guides verisi okunamadı:', e.message);
    }

    // ═══════════════════════════════════════════════════════════
    // 9. OTOYOL ÜCRETLERİ — 13 Detay Sayfası (13 URL)
    // ═══════════════════════════════════════════════════════════
    try {
        const otoyol = JSON.parse(fs.readFileSync(path.join(__dirname, 'public', 'data', 'otoyol_ucretleri.json'), 'utf8'));
        otoyol.forEach(item => {
            urls.push({
                url: `${BASE_URL}/kutuphane/otoyol-ucretleri/${item.id}`,
                tier: '🟢 T4-OTOYOL'
            });
        });
    } catch (e) {
        console.error('⚠ Otoyol verisi okunamadı:', e.message);
    }

    // ═══════════════════════════════════════════════════════════
    // 10. EN POPÜLER OBD KODLARI — Kalan Slotlarla
    // ═══════════════════════════════════════════════════════════
    const topObdCodes = [
        'P0300', 'P0301', 'P0302', 'P0303', 'P0304', 'P0305', 'P0306', 'P0307', 'P0308',
        'P0171', 'P0172', 'P0173', 'P0174', 'P0175', 'P0170',
        'P0420', 'P0430',
        'P0440', 'P0441', 'P0442', 'P0443', 'P0444', 'P0445', 'P0446',
        'P0447', 'P0448', 'P0449', 'P0450', 'P0451', 'P0452', 'P0453',
        'P0455', 'P0456',
        'P0130', 'P0131', 'P0132', 'P0133', 'P0134', 'P0135',
        'P0136', 'P0137', 'P0138', 'P0139', 'P0140', 'P0141',
        'P0150', 'P0151', 'P0152', 'P0153', 'P0154', 'P0155',
        'P0156', 'P0157', 'P0158', 'P0159', 'P0160', 'P0161',
        'P0100', 'P0101', 'P0102', 'P0110', 'P0115', 'P0120', 'P0220',
        'P0200', 'P0201', 'P0202', 'P0203', 'P0204', 'P0230',
        'P0335', 'P0336', 'P0340', 'P0341',
        'P0128',
        'P0400', 'P0401',
        'P0500', 'P0505', 'P0506', 'P0507',
    ];

    const obdCodes = require('./data/obd-codes.json');
    const obdSet = new Set(obdCodes.map(c => c.code));
    let obdAdded = 0;
    const remaining = 200 - urls.length;

    for (const code of topObdCodes) {
        if (obdAdded >= remaining) break;
        if (obdSet.has(code)) {
            urls.push({
                url: `${BASE_URL}/obd/${code.toLowerCase()}`,
                tier: '🔵 T5-OBD'
            });
            obdAdded++;
        }
    }

    return urls;
}

// ── Google API çağrısı ──
async function notifyGoogle(url) {
    try {
        const client = await auth.getClient();
        const indexing = google.indexing({ version: 'v3', auth: client });

        const res = await indexing.urlNotifications.publish({
            requestBody: {
                url: url,
                type: 'URL_UPDATED',
            },
        });

        return { success: true, data: res.data };
    } catch (error) {
        const errData = error.response ? error.response.data : { message: error.message };
        const isQuotaExceeded = error.response && error.response.status === 429;
        return { success: false, error: errData, quotaExceeded: isQuotaExceeded };
    }
}

// ── Ana işlem ──
async function indexAll() {
    const allUrls = buildUrls();
    const progress = loadProgress();
    const completedSet = new Set(progress.completedUrls);

    // Henüz gönderilmemiş URL'leri filtrele
    const pendingUrls = allUrls.filter(u => !completedSet.has(u.url));

    console.log('\n' + '═'.repeat(70));
    console.log('  🚀 Google Indexing API — OtoSöz Stratejik İndeksleme');
    console.log('═'.repeat(70));
    console.log(`\n  📊 Toplam URL: ${allUrls.length}`);
    console.log(`  ✅ Daha önce gönderilen: ${completedSet.size}`);
    console.log(`  📤 Bu turda gönderilecek: ${pendingUrls.length}`);

    if (progress.lastRun) {
        console.log(`  📅 Son çalıştırma: ${progress.lastRun}`);
    }

    // Tier bazlı özet
    const tierCounts = {};
    pendingUrls.forEach(u => { tierCounts[u.tier] = (tierCounts[u.tier] || 0) + 1; });
    console.log('\n  📋 Bekleyen Dağılım:');
    Object.entries(tierCounts).forEach(([tier, count]) => {
        console.log(`     ${tier}: ${count} sayfa`);
    });
    console.log('\n' + '─'.repeat(70));

    if (pendingUrls.length === 0) {
        console.log('\n  🎉 Tüm URL\'ler zaten gönderilmiş! Sıfırlamak için: node google-index.js --reset\n');
        return;
    }

    let success = 0;
    let fail = 0;
    let currentTier = '';

    for (let i = 0; i < pendingUrls.length; i++) {
        const { url, tier } = pendingUrls[i];

        // Tier değiştiğinde başlık yazdır
        if (tier !== currentTier) {
            currentTier = tier;
            console.log(`\n  ${tier}`);
            console.log('  ' + '─'.repeat(60));
        }

        const result = await notifyGoogle(url);
        const shortUrl = url.replace(BASE_URL, '');

        if (result.success) {
            success++;
            progress.completedUrls.push(url);
            progress.totalSuccess++;
            console.log(`  \x1b[32m✔\x1b[0m [${completedSet.size + i + 1}/${allUrls.length}] ${shortUrl}`);
        } else if (result.quotaExceeded) {
            // Quota aşıldı — hemen dur ve ilerlemeyi kaydet
            console.log(`\n  \x1b[33m⚠ QUOTA AŞILDI!\x1b[0m Günlük limit doldu.`);
            console.log(`  📊 Bu turda ${success} URL başarıyla gönderildi.`);
            console.log(`  📤 Kalan ${pendingUrls.length - i} URL yarın gönderilecek.`);
            console.log(`\n  💡 Yarın tekrar çalıştırın: node google-index.js`);
            console.log(`     (Otomatik olarak kaldığı yerden devam eder)\n`);
            break;
        } else {
            fail++;
            progress.totalFail++;
            console.log(`  \x1b[31m✘\x1b[0m [${completedSet.size + i + 1}/${allUrls.length}] ${shortUrl}`);
            console.log(`     Hata: ${JSON.stringify(result.error).substring(0, 120)}`);
        }

        // İlerlemeyi her 10 URL'de kaydet
        if ((i + 1) % 10 === 0) {
            progress.lastRun = new Date().toISOString();
            saveProgress(progress);
        }

        // Rate limit koruması
        await new Promise(r => setTimeout(r, 300));
    }

    // Son ilerlemeyi kaydet
    progress.lastRun = new Date().toISOString();
    saveProgress(progress);

    console.log('\n' + '═'.repeat(70));
    console.log(`  📊 Sonuç Özeti`);
    console.log(`     Bu tur başarılı: \x1b[32m${success}\x1b[0m`);
    console.log(`     Bu tur başarısız: \x1b[31m${fail}\x1b[0m`);
    console.log(`     Toplam gönderilen: ${progress.completedUrls.length}/${allUrls.length}`);
    console.log(`     Kalan: ${allUrls.length - progress.completedUrls.length}`);
    console.log('═'.repeat(70) + '\n');
}

// ── CLI komutları ──
if (process.argv.includes('--dry-run')) {
    const allUrls = buildUrls();
    const progress = loadProgress();
    const completedSet = new Set(progress.completedUrls);

    console.log('\n🔍 DRY RUN — Gönderilecek URL listesi:\n');

    let currentTier = '';
    allUrls.forEach((u, i) => {
        if (u.tier !== currentTier) {
            currentTier = u.tier;
            console.log(`\n${u.tier}`);
            console.log('─'.repeat(60));
        }
        const status = completedSet.has(u.url) ? '\x1b[32m✔\x1b[0m' : '\x1b[33m◯\x1b[0m';
        console.log(`  ${status} ${(i + 1).toString().padStart(3)}. ${u.url.replace(BASE_URL, '')}`);
    });

    console.log(`\n📊 Toplam: ${allUrls.length} / 200 limit`);
    console.log(`✅ Gönderilmiş: ${completedSet.size}`);
    console.log(`📤 Bekleyen: ${allUrls.length - completedSet.size}`);

    const tierCounts = {};
    allUrls.forEach(u => { tierCounts[u.tier] = (tierCounts[u.tier] || 0) + 1; });
    console.log('\n📋 Dağılım:');
    Object.entries(tierCounts).forEach(([tier, count]) => {
        console.log(`  ${tier}: ${count} sayfa`);
    });
    console.log('');

} else if (process.argv.includes('--reset')) {
    if (fs.existsSync(PROGRESS_FILE)) {
        fs.unlinkSync(PROGRESS_FILE);
        console.log('🔄 İlerleme sıfırlandı. Tüm URL\'ler tekrar gönderilecek.');
    } else {
        console.log('ℹ Zaten ilerleme dosyası yok.');
    }

} else if (process.argv.includes('--status')) {
    const allUrls = buildUrls();
    const progress = loadProgress();
    console.log('\n📊 İndeksleme Durumu:');
    console.log(`   Toplam URL: ${allUrls.length}`);
    console.log(`   Gönderilmiş: ${progress.completedUrls.length}`);
    console.log(`   Kalan: ${allUrls.length - progress.completedUrls.length}`);
    console.log(`   Son çalıştırma: ${progress.lastRun || 'Henüz çalıştırılmadı'}`);
    console.log(`   Toplam başarılı: ${progress.totalSuccess}`);
    console.log(`   Toplam başarısız: ${progress.totalFail}\n`);

} else {
    indexAll();
}