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
   function buildUrls() {
    const urls = [];

    // ═══════════════════════════════════════════════════════════
    // 1. ANA SAYFALAR — En Yüksek Öncelik
    // ═══════════════════════════════════════════════════════════
    const mainPages = [
        '/',
        '/forum',
        '/pazar',
        '/karsilastirma',
        '/arac-dna',
        '/uzmana-sor',
        '/kutuphane',
        '/sozluk',
        '/gosterge-paneli',
        '/piyasalar',
        '/anket',
        '/obd',
        '/etkinlikler',
        '/ajanda',
        '/haberler',
        '/altin-anahtar',
        '/guvenmetre',
        '/otohesap',
        '/hakkimizda',
        '/iletisim',
        '/gizlilik-politikasi',
        '/kullanim-sartlari',
        '/ikinci-el-rehberi',
        '/bakim-rehberi',
        '/trafik-cezasi',
        '/para-kazan',
        '/usta-ol',
        '/uzman-ol',
        '/premium',
    ];
    mainPages.forEach(p => urls.push({ url: `${BASE_URL}${p}`, tier: '🔴 T1-ANA' }));

    // ═══════════════════════════════════════════════════════════
    // 2. OTOHesap HESAPLAMA ARAÇLARI — Yüksek SEO değeri
    // ═══════════════════════════════════════════════════════════
    const otohesapModules = [
        'yakit-hesaplama',
        'mtv-hesaplama',
        'kasko-deger',
        'elektrikli-sarf-hesaplama',
        'tasit-kredisi',
        'kredi-karti-arac',
        'deger-kaybi',
        'arac-alim-hesap',
        'al-sat-karmarji',
        'yatirim-kiyaslama',
        'ev-maliyet',
        'dijital-senet-hesap',
        'otv-muafiyet',
        'lastik-ebat',
        'elektrikli-sarj',
    ];
    otohesapModules.forEach(m => urls.push({
        url: `${BASE_URL}/otohesap/${m}`,
        tier: '🔴 T1-HESAP'
    }));

    // ═══════════════════════════════════════════════════════════
    // 3. KÜTÜPHANE — Direkt Route Sayfaları
    // ═══════════════════════════════════════════════════════════
    const kutuphaneSections = [
        'trafik-cezalari',
        'obd-ariza-kodlari',
        'otomotiv-sozluk',
        'gosterge-isiklari',
        'ikinci-el-rehberi',
        'lastik-rehberi',
        'kaza-ilkyardim',
        'mevsimsel-bakim',
        'sigorta-rehberi',
        'ilginc-bilgiler',
        'makaleler',
        'kasko-deger',
        'hgs-siniflari',
        'bakim-zamanlari',
        'tuvturk',
        'kasa-segmentler',
        'plaka-kodlari',
        'noter-islemleri',
        'ehliyet-siniflari',
        'otoyol-ucretleri',
        'dolandiricilik-rehberi',
        'nereye-gitmeli',
        'efsane-avcilari',
    ];
    kutuphaneSections.forEach(s => urls.push({
        url: `${BASE_URL}/kutuphane/${s}`,
        tier: '🟠 T2-KÜTÜPHANE'
    }));

    // ═══════════════════════════════════════════════════════════
    // 4. ARAÇ DNA — Marka Sayfaları
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
    // 5. ARAÇ DNA — Model + Kronik Sorunlar Sayfaları
    // ═══════════════════════════════════════════════════════════
    const allModels = [
        { brand: 'Renault', model: 'Clio' },
        { brand: 'Renault', model: 'Megane' },
        { brand: 'Fiat', model: 'Egea' },
        { brand: 'Toyota', model: 'Corolla' },
        { brand: 'Honda', model: 'Civic' },
        { brand: 'Volkswagen', model: 'Passat' },
        { brand: 'Volkswagen', model: 'Golf' },
        { brand: 'Dacia', model: 'Duster' },
        { brand: 'Hyundai', model: 'i20' },
        { brand: 'Peugeot', model: '3008' },
        { brand: 'Opel', model: 'Corsa' },
        { brand: 'Togg', model: 'T10X' },
        { brand: 'Chery', model: 'Tiggo 8 Pro' },
        { brand: 'Ford', model: 'Focus' },
        { brand: 'BMW', model: '320i' },
        { brand: 'Mercedes-Benz', model: 'C180' },
        { brand: 'Nissan', model: 'Qashqai' },
        { brand: 'Kia', model: 'Sportage' },
        { brand: 'Citroen', model: 'C3' },
        { brand: 'Skoda', model: 'Octavia' },
        { brand: 'Seat', model: 'Leon' },
        { brand: 'Tesla', model: 'Model Y' },
        { brand: 'Audi', model: 'A3' },
    ];
    allModels.forEach(v => {
        const brandSlug = v.brand.toLowerCase().replace(/\s+/g, '-');
        const modelSlug = createSlug(v.model);
        urls.push({
            url: `${BASE_URL}/arac-dna/${brandSlug}/${modelSlug}`,
            tier: '🟡 T3-DNA-MODEL'
        });
        urls.push({
            url: `${BASE_URL}/arac-dna/${brandSlug}/${modelSlug}/kronik-sorunlar`,
            tier: '🟡 T3-DNA-KRONİK'
        });
    });

    // ═══════════════════════════════════════════════════════════
    // 6. ETKİNLİK DETAY SAYFALARI
    // ═══════════════════════════════════════════════════════════
    const eventIds = [
        'istanbul-kartal-otopazari',
        'ankara-pursaklar-otopazari',
        'izmir-kemalpasa-otopazari',
        'izmir-gaziemir-otopazari',
        'bursa-nilufer-otopazari',
    ];
    eventIds.forEach(id => urls.push({ url: `${BASE_URL}/etkinlikler/${id}`, tier: '🟢 T4-ETKİNLİK' }));

    // ═══════════════════════════════════════════════════════════
    // 7. GÖSTERGE IŞIKLARI — Detay Sayfaları
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
    // 8. MAKALELER — Detay Sayfaları
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
    // 9. OTOYOL ÜCRETLERİ — Detay Sayfaları
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
    // 10. KALAN SLOTLAR — İlginç Bilgiler, Trafik Cezaları, Sözlük
    // ═══════════════════════════════════════════════════════════
    const remainingUrls = [];

    // İlginç Bilgiler
    try {
        const interesting = JSON.parse(fs.readFileSync(path.join(__dirname, 'public', 'data', 'interesting_information.json'), 'utf8'));
        const facts = interesting.interestingFacts;
        
        const processArray = (arr, titleKey) => {
            if (!arr) return;
            arr.forEach(item => {
                remainingUrls.push({
                    url: `${BASE_URL}/kutuphane/ilginc/${createSlug(item[titleKey] || item.myth || item.text.slice(0, 40))}-${item.id}`,
                    tier: '🔵 T5-İLGİNÇ'
                });
            });
        };

        processArray(facts.dailyTips, 'title');
        processArray(facts.checklists, 'title');
        processArray(facts.doAndDont, 'title');
        processArray(facts.quickFacts, 'text');
        processArray(facts.mythBusters, 'myth');
    } catch (e) {
        console.error('⚠ İlginç bilgiler verisi okunamadı:', e.message);
    }

    // Trafik Cezaları
    try {
        const trafik = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'trafik_cezalari.json'), 'utf8'));
        trafik.categories.forEach(cat => {
            cat.rows.forEach(row => {
                if (row.slug) {
                    remainingUrls.push({
                        url: `${BASE_URL}/trafik-cezasi/${row.slug}`,
                        tier: '🔵 T5-CEZA'
                    });
                }
            });
        });
    } catch (e) {
        console.error('⚠ Trafik cezaları verisi okunamadı:', e.message);
    }

    // Sözlük
    try {
        const dictionaryContent = fs.readFileSync(path.join(__dirname, 'data', 'dictionary.ts'), 'utf8');
        const matches = dictionaryContent.match(/id:\s*[\"']([^\"']+)[\"']/g);
        if (matches) {
            matches.forEach(match => {
                const id = match.split(/[\"']/)[1];
                remainingUrls.push({
                    url: `${BASE_URL}/sozluk/${id}`,
                    tier: '🔵 T5-SÖZLÜK'
                });
            });
        }
    } catch (e) {
        console.error('⚠ Sözlük verisi okunamadı:', e.message);
    }

    // Sadece kalan limit (200 - mevcut) kadar ekle
    const limit = 200 - urls.length;
    let added = 0;
    
    for (const item of remainingUrls) {
        if (added >= limit) break;
        urls.push(item);
        added++;
    }

    return urls;
}Otoyol verisi okunamadı:', e.message);
    }

    // ═══════════════════════════════════════════════════════════
    // 10. İLGİNÇ BİLGİLER, SÖZLÜK VE TRAFİK CEZALARI — Kalan Slotlarla
    // ═══════════════════════════════════════════════════════════
    const remainingUrls = [];

    // İlginç Bilgiler
    try {
        const interesting = JSON.parse(fs.readFileSync(path.join(__dirname, 'public', 'data', 'interesting_information.json'), 'utf8'));
        const facts = interesting.interestingFacts;
        
        const processArray = (arr, titleKey) => {
            if (!arr) return;
            arr.forEach(item => {
                remainingUrls.push({
                    url: `${BASE_URL}/kutuphane/ilginc/${createSlug(item[titleKey] || item.myth || item.text.slice(0, 40))}-${item.id}`,
                    tier: '🔵 T5-İLGİNÇ'
                });
            });
        };

        processArray(facts.dailyTips, 'title');
        processArray(facts.checklists, 'title');
        processArray(facts.doAndDont, 'title');
        processArray(facts.quickFacts, 'text');
        processArray(facts.mythBusters, 'myth');
    } catch (e) {
        console.error('⚠ İlginç bilgiler verisi okunamadı:', e.message);
    }

    // Trafik Cezaları
    try {
        const trafik = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'trafik_cezalari.json'), 'utf8'));
        trafik.categories.forEach(cat => {
            cat.rows.forEach(row => {
                if (row.slug) {
                    remainingUrls.push({
                        url: `${BASE_URL}/trafik-cezasi/${row.slug}`,
                        tier: '🔵 T5-CEZA'
                    });
                }
            });
        });
    } catch (e) {
        console.error('⚠ Trafik cezaları verisi okunamadı:', e.message);
    }

    // Sözlük
    try {
        const dictionaryContent = fs.readFileSync(path.join(__dirname, 'data', 'dictionary.ts'), 'utf8');
        // Simple extraction since it's a TS file
        const matches = dictionaryContent.match(/id:\s*["']([^"']+)["']/g);
        if (matches) {
            matches.forEach(match => {
                const id = match.split(/["']/)[1];
                remainingUrls.push({
                    url: `${BASE_URL}/sozluk/${id}`,
                    tier: '🔵 T5-SÖZLÜK'
                });
            });
        }
    } catch (e) {
        console.error('⚠ Sözlük verisi okunamadı:', e.message);
    }

    // Sadece kalan limit (200 - mevcut) kadar ekle
    const limit = 200 - urls.length;
    let added = 0;
    
    for (const item of remainingUrls) {
        if (added >= limit) break;
        urls.push(item);
        added++;
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