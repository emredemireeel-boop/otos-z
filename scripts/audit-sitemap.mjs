import { writeFileSync } from 'node:fs';
import { load } from 'cheerio';
const args = process.argv.slice(2);
const requestBase = args.find(arg => !arg.startsWith('--')) || 'https://otosoz.com';
const option = (name, fallback) => args.find(arg => arg.startsWith(`--${name}=`))?.split('=').slice(1).join('=') || fallback;
const concurrency = Math.min(10, Math.max(1, Number(option('concurrency', '4')) || 4));
const checkHtml = args.includes('--html');
const prefix = option('prefix', '');
const limit = Number(option('limit', '0'));
async function runInBatches(items, worker) {
    const results = new Array(items.length);
    let cursor = 0;
    async function runner() {
        while (cursor < items.length) {
            const index = cursor++;
            results[index] = await worker(items[index]);
        }
    }
    await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, runner));
    return results;
}
const sitemapResponse = await fetch(new URL(option('sitemap', '/sitemap.xml'), requestBase), { signal: AbortSignal.timeout(30000) });
if (!sitemapResponse.ok) throw new Error(`Sitemap alınamadı: HTTP ${sitemapResponse.status}`);
const xml = await sitemapResponse.text();
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1].replaceAll('&amp;', '&'));
const duplicateUrls = [...Map.groupBy(urls, url => url).entries()].filter(([, group]) => group.length > 1).map(([url, group]) => ({ url, count: group.length }));
const selectedUrls = urls.filter(url => new URL(url).pathname.startsWith(prefix));
const checks = await runInBatches(limit > 0 ? selectedUrls.slice(0, limit) : selectedUrls, async productionUrl => {
    const source = new URL(productionUrl);
    const localUrl = new URL(`${source.pathname}${source.search}`, requestBase);
    try {
        const response = await fetch(localUrl, { method: checkHtml ? 'GET' : 'HEAD', redirect: 'manual', signal: AbortSignal.timeout(20000) });
        const issues = [];
        let canonical = '';
        if (response.status !== 200) issues.push(`HTTP ${response.status}`);
        if (/noindex|none/i.test(response.headers.get('x-robots-tag') || '')) issues.push('X-Robots-Tag noindex');
        if (checkHtml && response.status === 200) {
            const $ = load(await response.text());
            canonical = $('link[rel="canonical"]').attr('href') || '';
            if (!canonical) issues.push('Canonical eksik');
            else if (canonical.replace(/\/$/, '') !== productionUrl.replace(/\/$/, '')) issues.push('Canonical farklı');
            if ($('meta[name="robots"], meta[name="googlebot"]').toArray().some(meta => /noindex|none/i.test($(meta).attr('content') || ''))) issues.push('Meta noindex');
            if (!$('h1').text().trim()) issues.push('H1 eksik');
        }
        return { url: productionUrl, status: response.status, location: response.headers.get('location') || '', canonical, issues };
    } catch (error) {
        return { url: productionUrl, status: 0, error: error instanceof Error ? error.message : String(error), issues: ['İstek başarısız'] };
    }
});
const problematic = checks.filter(check => check.issues.length > 0);
const report = {
    checkedAt: new Date().toISOString(), requestBase, checkHtml,
    sitemapStatus: sitemapResponse.status, urlCount: urls.length, uniqueUrlCount: new Set(urls).size,
    duplicateCount: duplicateUrls.length, checkedCount: checks.length,
    lastModifiedCount: (xml.match(/<lastmod>/g) || []).length,
    statusCounts: Object.fromEntries([...Map.groupBy(checks, check => String(check.status)).entries()].map(([status, group]) => [status, group.length])),
    problematicCount: problematic.length, problematic, duplicateUrls,
};
const output = option('output', '');
if (output) writeFileSync(output, JSON.stringify(report, null, 2));
console.log(JSON.stringify({ ...report, problematic: problematic.slice(0, 60) }, null, 2));
if (problematic.length || duplicateUrls.length || !urls.length) process.exitCode = 1;
