import fs from 'node:fs';
import { load } from 'cheerio';

// Redirect izlenmez. Sitemap'in tamamı ve önceki sitemap'ten çıkarılan URL'ler ölçülür.
const args = process.argv.slice(2);
const option = (name, fallback) => args.includes(name) ? args[args.indexOf(name) + 1] : fallback;
const base = option('--base', 'http://127.0.0.1:3000');
const reportPath = option('--report', 'docs/seo/step03-indexability-check-20261029.json');
const sitemap = await fetch(new URL('/sitemap.xml', base)).then(response => response.text());
const urls = [...sitemap.matchAll(/<loc>\s*([^<]+)<\/loc>/g)].map(match => match[1].replaceAll('&amp;', '&'));
if (urls.length < 200) throw new Error(`Only ${urls.length} sitemap URLs; expected at least 200`);
const canonicalKey = value => value === 'https://otosoz.com/' ? 'https://otosoz.com' : value;
const included = new Set(urls.map(canonicalKey));
const previous = JSON.parse(fs.readFileSync('docs/seo/step02-sitemap-check-20261029.json', 'utf8')).results.map(row => row.url);
const extra = JSON.parse(fs.readFileSync('scripts/seo-status-cases.json', 'utf8')).filter(row => row.status === 200 && !row.url.startsWith('/api/') && !row.url.endsWith('.xml')).map(row => canonicalKey(new URL(row.url, 'https://otosoz.com').href));
const targets = args.includes('--sitemap-only') ? urls : [...new Set([...urls, ...previous, ...extra])];
const results = [];
let next = 0;
function forbiddenTypes(value, found = []) {
    if (!value || typeof value !== 'object') return found;
    const types = Array.isArray(value['@type']) ? value['@type'] : [value['@type']];
    for (const type of types) if (['Article', 'NewsArticle', 'BlogPosting', 'FAQPage'].includes(type)) found.push(type);
    for (const child of Object.values(value)) if (typeof child === 'object') forbiddenTypes(child, found);
    return found;
}
async function check(url) {
    const source = new URL(url);
    const indexable = included.has(url);
    try {
        const response = await fetch(new URL(source.pathname + source.search, base), { redirect: 'manual',
            headers: { 'User-Agent': 'Googlebot' }, signal: AbortSignal.timeout(45000) });
        const html = await response.text();
        const $ = load(html);
        const robots = $('meta[name="robots"]').map((_, node) => $(node).attr('content')).get();
        const googlebot = $('meta[name="googlebot"]').map((_, node) => $(node).attr('content')).get();
        const canonical = $('link[rel="canonical"]').map((_, node) => $(node).attr('href')).get();
        const schemas = [];
        $('script[type="application/ld+json"]').each((_, node) => {
            try { forbiddenTypes(JSON.parse($(node).text()), schemas); } catch { schemas.push('invalid-json'); }
        });
        const errors = [];
        if (response.status !== 200) errors.push(`HTTP ${response.status}`);
        if ($('meta[http-equiv="refresh" i]').length) errors.push('meta refresh');
        const values = [...robots, ...googlebot];
        if (indexable) {
            if (!robots.length || values.some(value => /noindex/i.test(value))) errors.push('sitemap URL has noindex/missing robots');
            if (canonical.length !== 1 || canonical[0] !== url) errors.push(`non-self canonical: ${canonical.join(',')}`);
        } else {
            if (!robots.length || !robots.every(value => /noindex/i.test(value))) errors.push('excluded URL lacks robots noindex');
            if (googlebot.some(value => !/noindex/i.test(value))) errors.push('excluded URL has googlebot index');
            if (values.some(value => /nofollow/i.test(value))) errors.push('excluded URL has nofollow');
            if (schemas.length) errors.push(`noindex content schema: ${schemas.join(',')}`);
        }
        return { url, indexable, status: response.status, robots, googlebot, canonical, schemas, errors, passed: !errors.length };
    } catch (error) { return { url, indexable, errors: [error.message], passed: false }; }
}
await Promise.all(Array.from({ length: 6 }, async () => {
    while (next < targets.length) {
        const index = next++;
        results[index] = await check(targets[index]);
        if ((index + 1) % 200 === 0) console.log(`Checked ${index + 1}/${targets.length}`);
    }
}));
const sample = Array.from({ length: 200 }, (_, index) => results[Math.floor(index * urls.length / 200)]);
const failures = results.filter(row => !row.passed);
const byPrefix = {};
for (const url of urls) { const prefix = new URL(url).pathname.split('/')[1] || 'home'; byPrefix[prefix] = (byPrefix[prefix] || 0) + 1; }
const report = { checkedAt: new Date().toISOString(), base, sitemapCount: urls.length, byPrefix,
    checked: results.length, excludedChecked: results.filter(row => !row.indexable).length,
    sampleCount: sample.length, sampleFailures: sample.filter(row => !row.passed).length,
    failures: failures.length, results };
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ ...report, results: undefined, failureExamples: failures.slice(0, 15) }, null, 2));
process.exitCode = failures.length ? 1 : 0;
