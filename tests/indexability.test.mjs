import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { loadSource } from '../scripts/seo-quality-loader.mjs';
const q = loadSource('lib/indexability.ts');
const { vehicleDNAData } = loadSource('data/vehicle-dna.ts');
const { isSeoUrlIndexable } = loadSource('lib/seo-index-catalog.ts');
const vehicle = vehicleDNAData.find(q.isVehicleIndexable);

test('unmeasured OBD data fails closed; sources or measured specific content qualify', () => {
    const code = { isGeneric: true, description: 'a'.repeat(300) };
    const signal = { specificCauses: 3, specificChecks: 3, hasNearDuplicate: false };
    assert.equal(q.isObdIndexable(code), false);
    assert.equal(q.isObdIndexable(code, signal), true);
    assert.equal(q.isObdIndexable({ ...code, description: 'a'.repeat(299) }, signal), false);
    assert.equal(q.isObdIndexable(code, { ...signal, hasNearDuplicate: true }), false);
    assert.equal(q.isObdIndexable({}, { editorialRecord: true }), true);
});

test('engine-specific evidence qualifies only the matching sections', () => {
    const engine = { slug: 'existing-engine' };
    assert.equal(q.isEngineIndexable(vehicle, engine), false);
    assert.equal(q.isEngineIndexable(vehicle, engine, { uniqueIssueCount: 2 }), true);
    assert.equal(q.isEngineIndexable(vehicle, engine, { uniqueIssueCount: 2 }, 'artilar'), false);
    assert.equal(q.isEngineIndexable(vehicle, engine, { uniqueProsConsCount: 2 }, 'artilar'), true);
    assert.equal(q.isEngineIndexable(vehicle, engine, { uniqueIssueCount: 1 }), false);
});

test('dictionary measures visible characters and requires similarity measurements', () => {
    const signal = { hasNearDuplicate: false };
    assert.equal(q.isDictionaryIndexable({ description: '<b>' + 'a'.repeat(249) + '</b>' }, signal), false);
    assert.equal(q.isDictionaryIndexable({ description: 'a'.repeat(250) }, signal), true);
    assert.equal(q.isDictionaryIndexable({ description: 'a'.repeat(300) }), false);
});

test('near-duplicate article keeps one representative and does not count markup', () => {
    const guide = { title: 'Existing article' };
    const signal = { kind: 'article', text: 'a'.repeat(600), hasNearDuplicate: true };
    assert.equal(q.isGuideIndexable(guide, signal), false);
    assert.equal(q.isGuideIndexable(guide, { ...signal, isRepresentative: true }), true);
    assert.equal(q.isGuideIndexable(guide, { ...signal, text: '<b>short</b>', isRepresentative: true }), false);
});

test('noindex follows links for general and Googlebot directives', () => {
    const robots = q.indexabilityRobots(false);
    assert.equal(robots.index, false);
    assert.equal(robots.follow, true);
    assert.equal(robots.googleBot.index, false);
    assert.equal(robots.googleBot.follow, true);
});

test('URL registry rejects unqualified, noncanonical and unknown routes', () => {
    assert.equal(isSeoUrlIndexable('https://otosoz.com/obd/p0420'), true);
    assert.equal(isSeoUrlIndexable('https://otosoz.com/obd/p20ee'), false);
    assert.equal(isSeoUrlIndexable('https://otosoz.com/sozluk/abs'), false);
    assert.equal(isSeoUrlIndexable('https://otosoz.com/obd/P0420'), false);
    assert.equal(isSeoUrlIndexable('https://www.otosoz.com/obd/p0420'), false);
    assert.equal(isSeoUrlIndexable('https://otosoz.com/ajanda'), false);
    assert.equal(isSeoUrlIndexable('https://otosoz.com/unknown'), false);
});

test('curation preserves all thirteen existing OBD directory pages', () => {
    const { indexableObdCodes, obdDirectoryPageCount, getObdDirectoryPage } = loadSource('lib/obd-catalog.ts');
    assert.equal(indexableObdCodes.length, 5);
    assert.equal(obdDirectoryPageCount, 13);
    assert.ok(getObdDirectoryPage(13).length > 0);
});

test('approved duplicate action remains noindex with no new redirect', () => {
    const { articles } = loadSource('lib/article-catalog.ts');
    assert.equal(articles.filter(article => article.indexable).length, 49);
    assert.equal(articles.find(article => article.path.endsWith('--10029')).indexable, false);
    assert.equal(articles.find(article => article.path.endsWith('--10012')).indexable, true);
    assert.equal(fs.readFileSync('next.config.ts', 'utf8').includes('--10029'), false);
});
