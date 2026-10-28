import fs from 'node:fs';
import path from 'node:path';
import { gzipSync } from 'node:zlib';
import { load } from 'cheerio';
import { loadSource } from './seo-quality-loader.mjs';

const stage = process.argv[2] || 'after';
const base = process.argv[3] || 'http://127.0.0.1:3000';
const model = '/arac-dna/renault/clio-5-nesil-2020-2025';
const {vehicleDNAData,createSlug}=loadSource('data/vehicle-dna.ts');
const {isVehicleIndexable}=loadSource('lib/indexability.ts');
const samples=['Fiat','Toyota'].map(brand=>vehicleDNAData.find(vehicle=>vehicle.brand===brand && isVehicleIndexable(vehicle)));
const modelPaths=samples.map(vehicle=>`/arac-dna/${createSlug(vehicle.brand)}/${createSlug(vehicle.model)}`);
const engines=loadSource('data/engine-dna.ts').engineDNAData;
const secondEngine=engines.find(record=>record.vehicleId===samples[0].id)?.engines[0];
const routes = [ '/arac-dna', '/arac-dna/renault', model,
    ...modelPaths,
    ...['kronik-sorunlar', 'neden-alinir', 'kullanici-deneyimleri', 'arac-paketleri'].map(section => `${model}/${section}`),
    `${model}/10-tce-90-hp-benzin-manuel-x-tronic`, `${modelPaths[0]}/${secondEngine.slug}`, '/arac-dna/kiyasla',
    '/karsilastirma', '/guvenmetre', '/etkinlikler', '/anket', '/iletisim', '/kullanim-sartlari', '/gizlilik-politikasi', '/piyasalar' ];
const measurements = [];
for (const route of routes) {
    const response = await fetch(new URL(route, base), { redirect: 'manual', headers: { 'User-Agent': 'Googlebot' } });
    const html = await response.text();
    const $ = load(html);
    const urls = [...new Set([...$('script[src]').map((_, node) => $(node).attr('src')).get(),
        ...$('link[as="script"],link[rel="modulepreload"]').map((_, node) => $(node).attr('href')).get()])]
        .filter(url => url.startsWith('/_next/static/') && url.endsWith('.js'));
    const scripts = urls.map(url => {
        const bytes = fs.readFileSync(path.join('.next', url.slice('/_next/'.length)));
        return { url, rawBytes: bytes.length, gzipBytes: gzipSync(bytes).length };
    });
    $('script,style').remove();
    measurements.push({ route, status: response.status, htmlBytes: Buffer.byteLength(html),
        textCharacters: $('main').text().replace(/\s+/g, ' ').trim().length,
        headings: $('h1,h2,h3').map((_, node) => $(node).text()).get(),
        firstLoadRawBytes: scripts.reduce((sum, script) => sum + script.rawBytes, 0),
        firstLoadGzipBytes: scripts.reduce((sum, script) => sum + script.gzipBytes, 0), scripts });
}
const report = { measuredAt: new Date().toISOString(), stage, base,
    definition: 'Unique external JS scripts and script preloads in the first HTTP HTML response; gzip calculated at default zlib settings. Next 16.3 build route table does not expose first-load byte sizes.', measurements };
fs.writeFileSync(`docs/seo/step04-${stage}.json`, JSON.stringify(report, null, 2) + '\n');
const lines = [report.definition, 'route\tHTTP\tJS raw bytes\tJS gzip bytes\tHTML bytes\tvisible main text characters',
    ...measurements.map(row => [row.route, row.status, row.firstLoadRawBytes, row.firstLoadGzipBytes, row.htmlBytes, row.textCharacters].join('\t'))];
fs.writeFileSync(`docs/seo/step04-${stage}.txt`, lines.join('\n') + '\n');
console.log(lines.join('\n'));
