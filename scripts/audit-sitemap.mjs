const requestBase = process.argv[2] || "https://otosoz.com";

async function runInBatches(items, concurrency, worker) {
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

const sitemapResponse = await fetch(new URL('/sitemap.xml', requestBase));
if (!sitemapResponse.ok) {
    throw new Error(`Sitemap alınamadı: HTTP ${sitemapResponse.status}`);
}

const xml = await sitemapResponse.text();
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map(match => match[1].replaceAll('&amp;', '&'));
const duplicateUrls = [...Map.groupBy(urls, url => url).entries()]
    .filter(([, group]) => group.length > 1)
    .map(([url, group]) => ({ url, count: group.length }));

const checks = await runInBatches(urls, 20, async productionUrl => {
    const source = new URL(productionUrl);
    const localUrl = new URL(`${source.pathname}${source.search}`, requestBase);

    try {
        const response = await fetch(localUrl, { method: 'HEAD', redirect: 'manual' });
        return {
            url: productionUrl,
            status: response.status,
            location: response.headers.get('location') || '',
        };
    } catch (error) {
        return {
            url: productionUrl,
            status: 0,
            location: '',
            error: error instanceof Error ? error.message : String(error),
        };
    }
});

const problematic = checks.filter(check => check.status !== 200);
console.log(JSON.stringify({
    sitemapStatus: sitemapResponse.status,
    urlCount: urls.length,
    uniqueUrlCount: new Set(urls).size,
    duplicateCount: duplicateUrls.length,
    lastModifiedCount: (xml.match(/<lastmod>/g) || []).length,
    statusCounts: Object.fromEntries(
        [...Map.groupBy(checks, check => String(check.status)).entries()]
            .map(([status, group]) => [status, group.length]),
    ),
    problematicCount: problematic.length,
    problematic: problematic.slice(0, 100),
    duplicateUrls: duplicateUrls.slice(0, 100),
}, null, 2));
