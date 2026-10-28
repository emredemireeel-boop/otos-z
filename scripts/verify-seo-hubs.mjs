import { loadSource } from './seo-quality-loader.mjs';
import { load } from 'cheerio';
import { writeFile } from 'node:fs/promises';

// İlk yanıt HTML'i incelenir; JavaScript çalıştırılmaz ve redirect takip edilmez.
// Kullanıcı mevcut 13 gerçek başlığı kabul etti. Yeni veri geldikçe eşik artırılabilir.
const base = process.argv[2] || 'http://127.0.0.1:3000';
const reportPath = process.argv[3] || 'docs/seo/step02-hub-checks-20261029.json';
const minimumThreads = Number(process.argv[4] || 13);
const expectedArticles = loadSource('lib/article-catalog.ts').articles.filter(article => article.indexable).length;
const checks = [];
const measurements = {};
const check = (name, passed, observed) => checks.push({ name, passed: Boolean(passed), observed });
async function get(path) {
    const response = await fetch(new URL(path, base), { redirect: 'manual',
        headers: { 'User-Agent': 'Googlebot' }, signal: AbortSignal.timeout(45000) });
    const html = await response.text();
    const $ = load(html);
    $('script, style').remove();
    return { status: response.status, html, $, canonical: $('link[rel="canonical"]').attr('href'),
        robots: $('meta[name="robots"]').attr('content') || '',
        googlebot: $('meta[name="googlebot"]').attr('content') || '',
        textLength: $('main').text().replace(/\s+/g, ' ').trim().length };
}

async function main() {
    const [forum, articles, sitemap, rss, robots, llms] = await Promise.all([
        get('/forum'), get('/makale'), get('/sitemap.xml'), get('/forum/feed.xml'), get('/robots.txt'), get('/llms.txt'),
    ]);
    const threadLinks = [...new Set(forum.$('a[data-forum-thread]').map((_, node) => forum.$(node).attr('href')).get())];
    const articleLinks = [...new Set(articles.$('a[data-article-link]').map((_, node) => articles.$(node).attr('href')).get())];
    measurements.forum = { status: forum.status, canonical: forum.canonical,
        h1Count: forum.$('h1').length, threadLinks: threadLinks.length, textLength: forum.textLength };
    measurements.articles = { status: articles.status, canonical: articles.canonical,
        h1Count: articles.$('h1').length, articleLinks: articleLinks.length };
    check('forum 200, self-canonical, one H1', forum.status === 200 && forum.canonical === 'https://otosoz.com/forum' && forum.$('h1').length === 1, measurements.forum);
    check('forum initial HTML has approved minimum of real distinct thread links', threadLinks.length >= minimumThreads, { required: minimumThreads, observed: threadLinks.length });
    check('forum main text exceeds 2000 characters', forum.textLength > 2000, forum.textLength);
    check('forum dates are in initial HTML', forum.$('li time[datetime]').length === threadLinks.length, forum.$('li time[datetime]').length);
    check('makale 200, self-canonical, one H1', articles.status === 200 && articles.canonical === 'https://otosoz.com/makale' && articles.$('h1').length === 1, measurements.articles);
    check('all quality-approved article links in initial HTML', articleLinks.length === expectedArticles, articleLinks.length);
    check('no hub meta refresh', !/http-equiv="refresh"/i.test(forum.html + articles.html));
    const sitemapUrls = [...sitemap.html.matchAll(/<loc>\s*([^<]+)<\/loc>/g)].map(match => match[1].replaceAll('&amp;', '&'));
    const threadSitemap = sitemapUrls.filter(url => url.startsWith('https://otosoz.com/forum/') && !/\/forum\/(kategori|sayfa)\//.test(url));
    check('both hubs in sitemap', sitemapUrls.includes('https://otosoz.com/forum') && sitemapUrls.includes('https://otosoz.com/makale'));
    measurements.forumSitemapThreads = threadSitemap.length;
    const categories = forum.$('nav[aria-label="Forum kategorileri"] a').map((_, node) => ({
        path: forum.$(node).attr('href'), count: Number(forum.$(node).text().match(/\((\d+)\)$/)?.[1]),
    })).get().filter(row => row.path.startsWith('/forum/kategori/'));
    measurements.categories = [];
    for (const category of categories) {
        const response = await get(category.path);
        const indexable = category.count >= 5;
        const noindex = response.robots.includes('noindex');
        const googleNoindex = response.googlebot.includes('noindex');
        const inSitemap = sitemapUrls.includes(`https://otosoz.com${category.path}`);
        const result = { ...category, status: response.status, noindex, googleNoindex, inSitemap };
        measurements.categories.push(result);
        check(`category policy ${category.path}`, response.status === 200
            && response.canonical === `https://otosoz.com${category.path}`
            && noindex === !indexable && googleNoindex === !indexable && inSitemap === indexable, result);
    }
    for (const path of threadLinks) {
        const response = await get(path);
        const inSitemap = sitemapUrls.includes(`https://otosoz.com${path}`);
        const indexable = !response.robots.includes('noindex');
        check(`thread metadata/sitemap agreement ${path}`, response.status === 200
            && response.canonical === `https://otosoz.com${path}` && inSitemap === indexable
            && response.googlebot.includes('noindex') === !indexable);
    }
    for (const path of articleLinks.slice(0, 3)) {
        const response = await get(path);
        const schemas = load(response.html)('script[type="application/ld+json"]').map((_, node) => {
            try { return JSON.parse(load(response.html)(node).text()); } catch { return null; }
        }).get().filter(Boolean);
        const breadcrumb = schemas.flatMap(schema => schema['@graph'] || [schema]).find(schema => schema['@type'] === 'BreadcrumbList');
        check(`article breadcrumb ${path}`, response.status === 200
            && breadcrumb?.itemListElement?.[1]?.item === 'https://otosoz.com/makale'
            && response.$('nav[aria-label="İçerik yolu"] a[href="/makale"]').length === 1);
    }
    check('RSS channel links to forum hub', /<channel>[\s\S]*?<link>https:\/\/otosoz\.com\/forum<\/link>/.test(rss.html));
    check('llms links both hubs', llms.html.includes('https://otosoz.com/forum') && llms.html.includes('https://otosoz.com/makale'));
    check('robots keeps the image exception and private disallows', robots.html.includes('Allow: /api/og') && robots.html.includes('Disallow: /admin/') && robots.html.includes('Disallow: /api/'));
    const failures = checks.filter(row => !row.passed);
    const report = { checkedAt: new Date().toISOString(), base, executesJavascript: false,
        approvedMinimumThreads: minimumThreads, total: checks.length, passed: checks.length - failures.length,
        failed: failures.length, measurements, checks };
    await writeFile(reportPath, JSON.stringify(report, null, 2) + '\n');
    console.log(JSON.stringify({ total: report.total, passed: report.passed, failed: report.failed, measurements, failures }, null, 2));
    if (failures.length) process.exitCode = 1;
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
