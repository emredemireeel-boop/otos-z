import fs from 'node:fs';
import { load } from 'cheerio';
import { loadSource } from './seo-quality-loader.mjs';

const base = process.argv[2] || 'http://127.0.0.1:3000';
const reportPath = process.argv[3] || 'docs/seo/step03-quality-content-check-20261029.json';
const { obdCodes, getObdCode, isObdCodeIndexable } = loadSource('lib/obd-catalog.ts');
const audit = JSON.parse(fs.readFileSync('docs/seo/quality-audit-applied-20261029.json', 'utf8'));
const checks = [];
const add = (name, passed, observed) => checks.push({ name, passed: Boolean(passed), observed });
async function get(path) {
    const response = await fetch(new URL(path, base), { redirect: 'manual',
        headers: { 'User-Agent': 'Googlebot' }, signal: AbortSignal.timeout(45000) });
    const html = await response.text();
    return { status: response.status, html, $: load(html), location: response.headers.get('location') };
}

const unsourcedWithChecks = obdCodes.find(code => !code.sources?.length && code.fixes.length > 0);
const examples = [...new Set(['/obd/p0420', '/obd/p20ee', `/obd/${unsourcedWithChecks.code.toLowerCase()}`])];
for (const path of examples) {
    const response = await get(path);
    const $ = response.$;
    $('script,style').remove();
    const text = $('main').text() || $.root().text();
    add(`${path} has no unsourced repair cost block`, !/Tahmini Onarım Bilgileri|Tahmini Onarım Maliyeti/i.test(text));
    const disallowedLinks = $('a[href^="/obd/"]').map((_, node) => $(node).attr('href'))
        .get().filter(href => { const code = getObdCode(href.split('/').at(-1)); return code && !isObdCodeIndexable(code); });
    add(`${path} promotes only qualified OBD codes`, disallowedLinks.length === 0, disallowedLinks);
    add(`${path} has no automatic links to short dictionary entries`, $('a[href^="/sozluk/"]').length === 0);
    if (path === `/obd/${unsourcedWithChecks.code.toLowerCase()}`) add('unsourced control suggestions are visibly labelled general information', text.includes('Genel bilgi: Kontrol ve Çözüm Önerileri'));
    if (path === '/obd/p20ee') add('unsourced causes are visibly labelled general information', text.includes('Genel bilgi: Olası Nedenler'));
}
const lossy = await get('/makale/arac-muayeneden-nasil-gecer-tuvturk-sirlari--10029');
add('user-selected duplicate remains 200, noindex and no redirect', lossy.status === 200
    && !lossy.location && /noindex/.test(lossy.$('meta[name="robots"]').attr('content') || ''));

const historical = audit.historicalObd.records.filter(row => row.exists === true || row.kind === 'brand-hub');
const results = [];
let next = 0;
await Promise.all(Array.from({ length: 4 }, async () => {
    while (next < historical.length) {
        const item = historical[next++];
        const url = new URL(item.url);
        const response = await get(url.pathname + url.search);
        const expectedStatus = item.kind === 'legacy-brand-code' ? 308 : 200;
        const destination = item.code ? `https://otosoz.com/obd/${item.code.toLowerCase()}` : null;
        const passed = response.status === expectedStatus && (expectedStatus === 308
            ? new URL(response.location || '', 'https://otosoz.com').href === destination
            : /noindex/.test(response.$('meta[name="robots"]').attr('content') || ''));
        results.push({ url: item.url, status: response.status, location: response.location, expectedStatus, passed });
    }
}));
add('all existing historically clicked OBD records remain accessible', results.every(row => row.passed),
    { checked: results.length, failed: results.filter(row => !row.passed).length });
const report = { checkedAt: new Date().toISOString(), base, total: checks.length,
    passed: checks.filter(row => row.passed).length, failed: checks.filter(row => !row.passed).length,
    historicalUrlsChecked: historical.length, historicalExistingRecordUrls: historical.filter(row => row.exists === true).length,
    historicalBrandHubs: historical.filter(row => row.kind === 'brand-hub').length,
    historicalMissingRecordsNotCreated: audit.historicalObd.records.filter(row => row.exists === false).length,
    checks, historicalResults: results };
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ ...report, historicalResults: undefined }, null, 2));
process.exitCode = report.failed ? 1 : 0;
