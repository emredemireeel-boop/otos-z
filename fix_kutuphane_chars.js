const fs = require('fs');

function fix(filepath, replacements) {
    if (!fs.existsSync(filepath)) return;
    let content = fs.readFileSync(filepath, 'utf8');
    const startContent = content;

    for (const [bad, good] of replacements) {
        content = content.split(bad).join(good);
    }

    if (content !== startContent) {
        fs.writeFileSync(filepath, content, 'utf8');
        console.log(`[FIXED] ${filepath}`);
    } else {
        console.log(`[NO CHANGES] ${filepath}`);    
    }
}

const R = '\uFFFD';

fix('app/kutuphane/page.tsx', [
    [R + 'lgin' + R, 'İlginç'],
    ['K' + R + 't' + R + 'phane', 'Kütüphane'],
    [R + 'pu' + R + 'lar' + R, 'İpuçları'],
    ['G' + R + 'sterge', 'Gösterge'],
    ['Günl' + R + 'k', 'Günlük'],
    ['H' + R + 'zl' + R, 'Hızlı'],
    ['K' + R + 'r' + R + 'c' + R + 'lar', 'Kırıcılar'],
    ['bulunamad' + R, 'bulunamadı'],
    [R + 'nemli', 'Önemli'],
    ['Watermark ' + R, 'Watermark -'],
    ['Otosöz ' + R + ' Kopyalanamaz', 'Otosöz • Kopyalanamaz'],
    ['6 ' + R + ' 45', '6 - 45'],
    ['46 ' + R + ' 55', '46 - 55'],
    ['56 ' + R + ' 65', '56 - 65'],
    ['2.000 ' + R + ' 15.000', '2.000 - 15.000'],
    ['TRAF' + R + 'K ZORBALIĞI', 'TRAFİK ZORBALIĞI'],
    ['Uymay' + R + 'p', 'Uymayıp'],
    [R + 'oftor yok', 'Şoför yok'],
    ['Al' + R + 'nm' + R + R + 'ken', 'Alınmışken'],
    ['+' + R + 'letene', 'İşletene'],
    [R + R + 'letene', 'İşletene'],
    ['An' + R + 'nda Men', 'Anında Men'],
    [R + 'zin', 'İzin'],
    [R + 'i' + R + 'gal', 'işgal'],
    [R + 'işgal', 'işgal'],
    ['An' + R + 'nda ' + R + 'ek', 'Anında Çek'],
    ['Engelse ' + R + 'ekilir', 'Engelse Çekilir'],
    ['taraf' + R + 'nda', 'tarafından'],
    ['aras' + R + ' a', 'arası a'],
    [R, '-'] // any remaining  will become hyphen just in case, but let's test specifically for the ones we missed
]);

