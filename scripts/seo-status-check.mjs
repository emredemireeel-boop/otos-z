import { readFile, writeFile } from 'node:fs/promises';

// node scripts/seo-status-check.mjs [--base URL] [--cases FILE] [--sitemap] [--report FILE]
// GET yanıtlarını Googlebot ile ölçer. Yönlendirmeleri takip etmez.
const args = process.argv.slice(2);
function option(name, fallback) {
    const index = args.indexOf(name);
    if (index < 0) return fallback;
    if (!args[index + 1] || args[index + 1].startsWith('--')) throw new Error(`${name} requires a value`);
    return args[index + 1];
}
const base = new URL(option('--base', 'http://127.0.0.1:3000'));
const sitemapMode = args.includes('--sitemap');
const reportFile = option('--report', null);
const concurrency = Number(option('--concurrency', base.hostname === 'otosoz.com' ? '3' : '8'));
if (!Number.isSafeInteger(concurrency) || concurrency < 1 || concurrency > 16) {
    throw new Error('concurrency must be an integer between 1 and 16');
}
const userAgent = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';
const decodeXml = text => text.replace(/&(?:amp|lt|gt|quot|apos);/g, entity =>
    ({ '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&apos;': "'" })[entity]);
const routePath = value => {
    const url = new URL(value, base);
    return url.pathname + url.search;
};
const localUrl = value => new URL(routePath(value), base).href;

async function readSitemaps(path, visited = new Set()) {
    const url = localUrl(path);
    if (visited.has(url)) throw new Error(`Sitemap cycle: ${url}`);
    visited.add(url);
    const response = await fetch(url, { redirect: 'manual', headers: { 'User-Agent': userAgent },
        signal: AbortSignal.timeout(45000) });
    if (response.status !== 200) throw new Error(`Sitemap ${url}: HTTP ${response.status}`);
    const xml = await response.text();
    const urls = [...xml.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/g)].map(match => decodeXml(match[1].trim()));
    if (!urls.length) throw new Error(`No URLs in ${url}`);
    if (/<sitemapindex\b/.test(xml)) {
        const nested = [];
        for (const child of urls) nested.push(...await readSitemaps(child, visited));
        return nested;
    }
    if (!/<urlset\b/.test(xml)) throw new Error(`Invalid sitemap root: ${url}`);
    return urls;
}

async function check(fixture) {
    const url = localUrl(fixture.url);
    const startedAt = performance.now();
    try {
        const response = await fetch(url, { redirect: 'manual',
            headers: { 'User-Agent': userAgent }, signal: AbortSignal.timeout(45000) });
        const html = await response.text();
        const location = response.headers.get('location');
        const metaRefresh = /<meta\b[^>]*http-equiv\s*=\s*["']?refresh\b/i.test(html);
        const noindex = [...html.matchAll(/<meta\b[^>]*>/gi)].some(([tag]) =>
            /\bname\s*=\s*["']robots["']/i.test(tag) && /\bcontent\s*=\s*["'][^"']*\bnoindex\b/i.test(tag));
        const expectedStatus = fixture.status ?? 200;
        const errors = [];
        if (response.status !== expectedStatus) errors.push(`HTTP ${response.status}, expected ${expectedStatus}`);
        if ('location' in fixture) {
            const expected = fixture.location === null ? null : localUrl(fixture.location);
            const actual = location === null ? null : new URL(location, url).href;
            if (actual !== expected) errors.push(`Location ${location}, expected ${fixture.location}`);
        }
        if (metaRefresh) errors.push('meta refresh in response');
        if (expectedStatus === 404 && !noindex) errors.push('404 response is missing noindex');
        return { url: fixture.url, type: fixture.type, expectedStatus, status: response.status,
            location, metaRefresh, noindex, durationMs: Math.round(performance.now() - startedAt),
            passed: !errors.length, errors };
    } catch (error) {
        return { url: fixture.url, type: fixture.type, passed: false, errors: [error.message] };
    }
}

async function main() {
    const sitemapUrls = sitemapMode ? await readSitemaps(option('--sitemap-path', '/sitemap.xml')) : [];
    const fixtures = sitemapMode
        ? sitemapUrls.map(url => ({ url, status: 200, location: null }))
        : JSON.parse(await readFile(option('--cases', 'scripts/seo-status-cases.json'), 'utf8'));
    if (!Array.isArray(fixtures) || !fixtures.length) throw new Error('Empty or invalid URL list');
    for (const fixture of fixtures) {
        if (typeof fixture.url !== 'string' || !fixture.url
            || !Number.isInteger(fixture.status) || fixture.status < 100 || fixture.status > 599
            || !('location' in fixture) || (fixture.location !== null && typeof fixture.location !== 'string')) {
            throw new Error('Each case requires url, integer status, and location (string or null)');
        }
    }
    const results = new Array(fixtures.length);
    let cursor = 0;
    let completed = 0;
    async function worker() {
        while (cursor < fixtures.length) {
            const index = cursor++;
            results[index] = await check(fixtures[index]);
            completed++;
            if (completed % 250 === 0) console.log(`Checked ${completed}/${fixtures.length}`);
        }
    }
    await Promise.all(Array.from({ length: concurrency }, worker));
    const failures = results.filter(result => !result.passed);
    const statusCounts = {};
    for (const result of results) statusCounts[result.status || 'network-error'] = (statusCounts[result.status || 'network-error'] || 0) + 1;
    const report = { checkedAt: new Date().toISOString(), base: base.href,
        mode: sitemapMode ? 'sitemap' : 'cases', userAgent, followsRedirects: false,
        total: results.length, passed: results.length - failures.length, failed: failures.length,
        sitemapDuplicates: sitemapUrls.length - new Set(sitemapUrls).size,
        metaRefreshCount: results.filter(result => result.metaRefresh).length, statusCounts, results };
    if (reportFile) await writeFile(reportFile, JSON.stringify(report, null, 2) + '\n');
    console.log(JSON.stringify({ total: report.total, passed: report.passed, failed: report.failed,
        metaRefreshCount: report.metaRefreshCount, statusCounts, failures }, null, 2));
    if (failures.length || report.sitemapDuplicates) process.exitCode = 1;
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
