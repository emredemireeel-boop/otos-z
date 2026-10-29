import fs from 'node:fs';
import { load } from 'cheerio';
import ts from 'typescript';
// Fail on newly introduced hand-built metadata, even on routes absent from sitemap.
function metadataSources(directory = 'app') {
    let definitions = 0;
    const manual = [];
    function scan(path) {
        for (const entry of fs.readdirSync(path, {withFileTypes:true})) {
            const file = `${path}/${entry.name}`;
            if (entry.isDirectory()) { scan(file); continue; }
            if (!/\.tsx?$/.test(file)) continue;
            const source = ts.createSourceFile(file, fs.readFileSync(file,'utf8'), ts.ScriptTarget.Latest, true);
            function visit(node) {
                if (ts.isVariableDeclaration(node) && node.name.getText(source)==='metadata' && node.initializer) {
                    definitions++;
                    if (ts.isObjectLiteralExpression(node.initializer)) manual.push(file);
                }
                if (ts.isFunctionDeclaration(node) && /Metadata$/.test(node.name?.text || '')) {
                    definitions++;
                    function returns(child) {
                        if (child!==node && ts.isFunctionLike(child)) return;
                        if (ts.isReturnStatement(child) && child.expression && ts.isObjectLiteralExpression(child.expression)
                            && child.expression.properties.some(prop=>['title','description','robots','alternates','openGraph'].includes(prop.name?.getText(source)))) {
                            manual.push(`${file}:${source.getLineAndCharacterOfPosition(child.getStart(source)).line+1}`);
                        }
                        ts.forEachChild(child,returns);
                    }
                    returns(node);
                }
                ts.forEachChild(node,visit);
            }
            visit(source);
        }
    }
    scan(directory);
    return {definitions, manual};
}
const base = process.argv[2] || 'http://127.0.0.1:3010', report = process.argv[3] || 'docs/seo/step07-metadata-audit.json';
async function urls(path) { const response = await fetch(new URL(path, base), { redirect: 'manual', signal: AbortSignal.timeout(45000) }); if (response.status !== 200)
    throw Error('Sitemap HTTP ' + response.status); const $ = load(await response.text(), { xmlMode: true }); const nested = $('sitemap > loc').map((_, n) => $(n).text()).get(); return nested.length ? (await Promise.all(nested.map(u => urls(new URL(u).pathname)))).flat() : $('url > loc').map((_, n) => $(n).text()).get(); }
const targets = await urls('/sitemap.xml');
const results = [];
let next = 0;
await Promise.all(Array.from({ length: 6 }, async () => {
    while (next < targets.length) {
        const url = targets[next++], u = new URL(url);
        try {
            const r = await fetch(new URL(u.pathname + u.search, base), { redirect: 'manual', headers: { 'User-Agent': 'Googlebot' }, signal: AbortSignal.timeout(45000) }), $ = load(await r.text()), title = $('title').text().trim(), description = $('meta[name=description]').attr('content') || '', canonical = $('link[rel=canonical]').attr('href'), robots = $('meta[name=robots],meta[name=googlebot]').map((_, n) => $(n).attr('content')).get(), errors = [];
            if (r.status !== 200)
                errors.push('HTTP ' + r.status);
            if (!title)
                errors.push('Missing title');
            if (!description)
                errors.push('Missing description');
            if ($('title').length!==1 || $('meta[name=description]').length!==1 || $('link[rel=canonical]').length!==1)
                errors.push('Metadata must occur exactly once');
            if (canonical !== url)
                errors.push('Canonical mismatch');
            if (robots.some(value => /noindex/.test(value)))
                errors.push('Sitemap noindex');
            const image = $('meta[property="og:image"]').attr('content');
            if (!image)
                errors.push('Missing OG image');
            if ($('meta[property="og:title"]').attr('content')!==title || $('meta[name="twitter:title"]').attr('content')!==title)
                errors.push('Social title mismatch');
            if ($('meta[property="og:description"]').attr('content')!==description || $('meta[name="twitter:description"]').attr('content')!==description)
                errors.push('Social description mismatch');
            if ($('meta[property="og:url"]').attr('content')!==url)
                errors.push('Social URL mismatch');
            if ($('meta[property="og:image:width"]').attr('content') !== '1200' || $('meta[property="og:image:height"]').attr('content') !== '630')
                errors.push('Wrong OG dimensions');
            const forbidden = $('meta[name]').map((_, n) => $(n).attr('name')).get().filter(n => /^(keywords|revisit-after|rating|distribution|language|geo\..*|author|publisher|copyright)$/.test(n));
            results.push({ url, status: r.status, title, titleLength: [...title].length, description, descriptionLength: [...description].length, canonical, robots, image, forbidden, errors });
        }
        catch (e) {
            results.push({ url, errors: [e.message] });
        }
    }
}));
const duplicates = field => {
    const groups=new Map();
    for(const row of results){if(!row[field])continue;const list=groups.get(row[field])||[];list.push(row);groups.set(row[field],list);}
    return [...groups].filter(([,rows])=>rows.length>1).map(([value,rows])=>({value,urls:rows.map(row=>row.url)}));
};
const titles = duplicates('title'), descriptions = duplicates('description'), longTitles = results.filter(r => r.titleLength > 60), shortDescriptions = results.filter(r => r.descriptionLength < 120 || r.descriptionLength > 158), failures = results.filter(r => r.errors.length);
const sources=metadataSources();
const duplicateDescriptionPages = descriptions.reduce((s, row) => s + row.urls.length, 0), out = { checkedAt: new Date().toISOString(), base, total: targets.length, duplicateTitles: titles.length, duplicateTitlePages: titles.reduce((s, row) => s + row.urls.length, 0), duplicateDescriptions: descriptions.length, duplicateDescriptionPercent: 100 * duplicateDescriptionPages / targets.length, longTitlePercent: 100 * longTitles.length / targets.length, descriptionLengthFailures: shortDescriptions.length, forbiddenTagPages: results.filter(row => row.forbidden?.length).length, failures: failures.length, sources, titles, descriptions, longTitles, shortDescriptions, results };
fs.writeFileSync(report, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify({ ...out, results: undefined, longTitles: longTitles.slice(0, 10), shortDescriptions: shortDescriptions.slice(0, 8) }, null, 2));
if (!process.argv.includes('--observe'))
    process.exitCode = titles.length || out.duplicateDescriptionPercent >= 2 || out.longTitlePercent >= 10 || failures.length || out.forbiddenTagPages || shortDescriptions.length || sources.manual.length ? 1 : 0;
