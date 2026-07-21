import fs from "node:fs";

const reportPath = process.argv[2];
const requestBase = process.argv[3] || "https://otosoz.com";

if (!reportPath) {
    console.error("Usage: node scripts/audit-search-console-canonicals.mjs <report.md> [request-base]");
    process.exit(1);
}

function parseReportUrls(markdown) {
    const urls = [];
    let pending = "";

    for (const line of markdown.split(/\r?\n/)) {
        const urlRow = line.match(/^\|(https:\/\/[^|]+)\|([^|]*)\|?$/);
        if (urlRow) {
            if (pending) urls.push(pending);
            pending = "";

            if (urlRow[2] === "2026-") pending = urlRow[1];
            else urls.push(urlRow[1]);
            continue;
        }

        if (!pending) continue;
        const continuationRow = line.match(/^\|([^|]+)\|([^|]*)\|?$/);
        if (!continuationRow || /^(---|URL)$/.test(continuationRow[1])) continue;

        pending += continuationRow[1];
        if (/^\d{2}-\d{2}$/.test(continuationRow[2])) {
            urls.push(pending);
            pending = "";
        }
    }

    if (pending) urls.push(pending);
    return [...new Set(urls)];
}

function getCanonical(html) {
    const canonicalTag = html.match(/<link\b[^>]*\brel=["']canonical["'][^>]*>/i)?.[0]
        || html.match(/<link\b[^>]*\bhref=["'][^"']+["'][^>]*\brel=["']canonical["'][^>]*>/i)?.[0];
    const href = canonicalTag?.match(/\bhref=["']([^"']+)["']/i)?.[1] || "";
    return href.replaceAll("&amp;", "&");
}

function getRouteGroup(url) {
    const segments = new URL(url).pathname.split("/").filter(Boolean);
    return segments[0] || "/";
}

async function auditUrl(sourceUrl) {
    const source = new URL(sourceUrl);
    const requestUrl = new URL(`${source.pathname}${source.search}`, requestBase);

    try {
        const response = await fetch(requestUrl, {
            redirect: "manual",
            headers: { "user-agent": "OtoSoz-Canonical-Audit/1.0" },
        });
        const html = await response.text();
        const canonical = getCanonical(html);
        const robots = html.match(/<meta\b[^>]*\bname=["']robots["'][^>]*\bcontent=["']([^"']+)["']/i)?.[1] || "";

        let redirectTarget = null;
        const location = response.headers.get("location") || "";
        if (response.status >= 300 && response.status < 400 && location) {
            const localTargetUrl = new URL(location, requestUrl);
            const targetResponse = await fetch(localTargetUrl, {
                redirect: "follow",
                headers: { "user-agent": "OtoSoz-Canonical-Audit/1.0" },
            });
            const targetHtml = await targetResponse.text();
            const productionTargetUrl = new URL(
                `${new URL(targetResponse.url).pathname}${new URL(targetResponse.url).search}`,
                "https://otosoz.com",
            ).toString();
            redirectTarget = {
                status: targetResponse.status,
                url: productionTargetUrl,
                canonical: getCanonical(targetHtml),
            };
        }

        return {
            sourceUrl,
            group: getRouteGroup(sourceUrl),
            status: response.status,
            location,
            canonical,
            robots,
            redirectTarget,
        };
    } catch (error) {
        return {
            sourceUrl,
            group: getRouteGroup(sourceUrl),
            status: 0,
            error: error instanceof Error ? error.message : String(error),
            location: "",
            canonical: "",
            robots: "",
        };
    }
}

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

const markdown = fs.readFileSync(reportPath, "utf8");
const urls = parseReportUrls(markdown);
const results = await runInBatches(urls, 20, auditUrl);

const statusCounts = Object.fromEntries(
    [...Map.groupBy(results, result => String(result.status)).entries()]
        .map(([status, group]) => [status, group.length]),
);
const routeCounts = Object.fromEntries(
    [...Map.groupBy(results, result => `${result.group}:${result.status}`).entries()]
        .map(([route, group]) => [route, group.length]),
);
const problematic = results.filter(result => {
    if (result.status >= 300 && result.status < 400) {
        return !result.location
            || result.redirectTarget?.status !== 200
            || !result.redirectTarget?.canonical
            || new URL(result.redirectTarget.canonical, "https://otosoz.com").toString() !== result.redirectTarget.url;
    }
    if (result.status !== 200) return true;
    return !result.canonical
        || /noindex/i.test(result.robots)
        || new URL(result.canonical, "https://otosoz.com").toString() !== new URL(result.sourceUrl).toString();
});
const canonicalizedAlternates = results.filter(result => (
    result.status === 200
    && result.canonical
    && new URL(result.canonical, "https://otosoz.com").toString() !== new URL(result.sourceUrl).toString()
));

console.log(JSON.stringify({
    reportUrlCount: urls.length,
    statusCounts,
    routeCounts,
    redirects: results.filter(result => result.status >= 300 && result.status < 400).length,
    selfCanonicalPages: results.filter(result => result.status === 200 && result.canonical && !/noindex/i.test(result.robots)).length,
    canonicalizedAlternateCount: canonicalizedAlternates.length,
    canonicalizedAlternates,
    problematicCount: problematic.length,
    problematic: problematic.slice(0, 100),
}, null, 2));
