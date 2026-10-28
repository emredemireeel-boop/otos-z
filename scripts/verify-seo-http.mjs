import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { writeFile } from 'node:fs/promises';

// Production sunucusunda gerçek GET/HEAD yanıtını ölçer; yönlendirmeleri izlemez.
// Kullanım: node scripts/verify-seo-http.mjs http://127.0.0.1:3100 [rapor.json]
// Canlı durumu değişiklik yapmadan kaydetmek için son argüman: --observe
const execFileAsync = promisify(execFile);
const curl = process.platform === 'win32' ? 'curl.exe' : 'curl';
const baseUrl = process.argv[2] || 'http://127.0.0.1:3100';
const reportPath = process.argv[3]?.startsWith('--') ? null : process.argv[3];
const observe = process.argv.includes('--observe');
const model = '/arac-dna/renault/clio-5-nesil-2020-2025';
const engine = `${model}/10-tce-90-hp-benzin-manuel-x-tronic`;
const fixtures = [
    { path: '/kutuphane?utm_source=seo-check', host: 'www.otosoz.com', status: 301,
        location: '/kutuphane?utm_source=seo-check',
        absoluteLocation: 'https://otosoz.com/kutuphane?utm_source=seo-check' },
    { path: '/kutuphane', host: 'invalid.example', status: 400 },
    { path: '/arac-dna/%E0%A4%A', status: 400 },
    { path: '/seo-yok-20261029', status: 404 },
    { path: '/obd/p9999', status: 404 },
    { path: '/obd/olmayan-marka-20261029', status: 404 },
    { path: '/arac-dna/olmayan-marka', status: 404 },
    { path: '/arac-dna/renault/olmayan-model', status: 404 },
    { path: `${model}/olmayan-motor`, status: 404 },
    { path: '/makale/olmayan-makale--999999', status: 404 },
    { path: '/sozluk/olmayan-terim-20261029', status: 404 },
    { path: '/acik-oto-pazari/olmayan-sehir', status: 404 },
    { path: '/forum', status: 308, location: '/' },
    { path: '/forum?utm_source=seo-check', status: 308, location: '/?utm_source=seo-check' },
    { path: `${model.toUpperCase()}/kronik-sorunlar?utm_source=seo-check`, status: 308,
        location: `${model}/kronik-sorunlar?utm_source=seo-check` },
    { path: `${model.replace('/renault/', '/RENAULT/').replace('/clio-', '/CLIO-')}/kronik-sorunlar`,
        status: 308, location: `${model}/kronik-sorunlar` },
    { path: engine.toUpperCase(), status: 308, location: engine },
    { path: `${engine}-begenilen-yonleri-ve-en-cok-sikayet-edilen-yonleri`, status: 308,
        location: `${model}/neden-alinir` },
    { path: `${engine}-arac-paketleri`, status: 308, location: `${model}/arac-paketleri` },
    { path: `${engine}-kullanici-deneyimleri`, status: 308, location: `${model}/kullanici-deneyimleri` },
    { path: '/kutuphane?kategori=olmayan-kategori', status: 308, location: '/kutuphane' },
    { path: '/kutuphane?kategori=__proto__', status: 308, location: '/kutuphane' },
    { path: '/kutuphane?kategori=', status: 308, location: '/kutuphane' },
    { path: '/kutuphane?kategori=makaleler', status: 308, location: '/kutuphane' },
    { path: '/kutuphane?kategori=otoyol-ucretleri', status: 308,
        location: '/kutuphane?kategori=otoyol-ve-kopru-ucretleri' },
    { path: '/kutuphane?kategori=ehliyet-sinifari', status: 308,
        location: '/kutuphane?kategori=ehliyet-siniflari' },
    { path: '/kutuphane?kategori=obd-ariza-kodlari', status: 308, location: '/obd' },
    { path: '/kutuphane?kategori=kasko-deger', status: 308, location: '/kutuphane/kasko-deger' },
    { path: '/kutuphane?kategori=trafik-cezalari', status: 308, location: '/trafik-cezasi' },
    { path: '/kutuphane', status: 200, canonical: 'https://otosoz.com/kutuphane' },
    { path: '/kutuphane?kategori=lastik-rehberi', status: 200,
        canonical: 'https://otosoz.com/kutuphane?kategori=lastik-rehberi' },
    { path: model, status: 200, canonical: `https://otosoz.com${model}` },
    { path: engine, status: 200, canonical: `https://otosoz.com${engine}` },
    { path: '/obd/p0300', status: 200, canonical: 'https://otosoz.com/obd/p0300' },
    { path: '/acik-oto-pazari/istanbul', status: 200,
        canonical: 'https://otosoz.com/acik-oto-pazari/istanbul' },
];
const profiles = [
    { method: 'GET', userAgent: 'Mozilla/5.0 Chrome/130.0.0.0 Safari/537.36' },
    { method: 'GET', userAgent: 'Googlebot' },
    { method: 'HEAD', userAgent: 'Googlebot' },
];
const results = [];
for (const profile of profiles) {
    // Düşük eşzamanlılık: canlı sunucuya gereksiz yük bindirme.
    for (let offset = 0; offset < fixtures.length; offset += 3) {
        const batch = await Promise.all(fixtures.slice(offset, offset + 3).map(async fixture => {
            const url = new URL(fixture.path, baseUrl).href;
            const args = ['--silent', '--show-error', '--max-time', '30', '--include',
                '--user-agent', profile.userAgent];
            if (profile.method === 'HEAD') args.push('--head');
            if (fixture.host) args.push('--header', `Host: ${fixture.host}`);
            args.push(url);
            try {
                const { stdout } = await execFileAsync(curl, args, { maxBuffer: 8 * 1024 * 1024 });
                // HTTPS proxy CONNECT başlığı varsa son HTTP başlık bloğunu kullan.
                const response = stdout.replace(/^HTTP\/1\.1 200 Connection established\r?\n\r?\n/i, '');
                const split = response.search(/\r?\n\r?\n/);
                const headers = split < 0 ? response : response.slice(0, split);
                const body = split < 0 ? '' : response.slice(split);
                const status = Number(headers.match(/^HTTP\/\S+ (\d+)/)?.[1]);
                const locationHeader = headers.match(/^location:\s*(.+)$/im)?.[1]?.trim();
                const locationUrl = locationHeader ? new URL(locationHeader, url) : null;
                const location = locationUrl ? locationUrl.pathname + locationUrl.search : null;
                const canonical = body.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i)?.[1]
                    ?.replaceAll('&amp;', '&') || null;
                const metaRefresh = /<meta[^>]+http-equiv="refresh"/i.test(body);
                const noindex = /<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i.test(body);
                const errors = [];
                if (status !== fixture.status) errors.push(`status ${status}, expected ${fixture.status}`);
                if (fixture.location && location !== fixture.location) errors.push(`location ${location}`);
                if (fixture.absoluteLocation && locationHeader !== fixture.absoluteLocation) {
                    errors.push(`absolute location ${locationHeader}`);
                }
                if (metaRefresh) errors.push('meta refresh');
                if (profile.method === 'GET' && fixture.status === 404 && !noindex) errors.push('missing noindex');
                if (profile.method === 'GET' && fixture.canonical && canonical !== fixture.canonical) {
                    errors.push(`canonical ${canonical}`);
                }
                return { path: fixture.path, host: fixture.host, ...profile, status, location,
                    locationHeader, canonical, noindex,
                    metaRefresh, passed: errors.length === 0, errors };
            } catch (error) {
                return { path: fixture.path, ...profile, passed: false, errors: [error.message] };
            }
        }));
        results.push(...batch);
    }
}
const failures = results.filter(result => !result.passed);
const report = { checkedAt: new Date().toISOString(), baseUrl, tool: curl,
    total: results.length, passed: results.length - failures.length, failed: failures.length, results };
if (reportPath) await writeFile(reportPath, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ baseUrl, total: report.total, passed: report.passed, failed: report.failed, failures }, null, 2));
if (failures.length && !observe) process.exitCode = 1;
