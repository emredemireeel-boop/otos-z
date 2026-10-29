import test from 'node:test';
import assert from 'node:assert/strict';
import {loadSource} from '../scripts/seo-quality-loader.mjs';
const {createPageMetadata, metadataTitle, metadataDescription, wordLimit} = loadSource('lib/seo.ts');

test('Canonical, social cards and noindex come from the same page definition', () => {
    const page = createPageMetadata({title:'Turbo arızası', description:'Turbo arızasının belirtilerini inceleyin.', path:'/sozluk/turbo/', index:false});
    assert.equal(page.alternates.canonical,'https://otosoz.com/sozluk/turbo');
    assert.equal(page.robots.index,false);
    assert.equal(page.robots.follow,true);
    assert.equal(page.robots.googleBot.index,false);
    assert.equal(page.openGraph.title,page.title);
    assert.equal(page.twitter.description,page.description);
    assert.equal(page.openGraph.images[0].width,1200);
    assert.equal(page.openGraph.images[0].height,630);
    assert.equal(new URL(page.openGraph.images[0].url).searchParams.get('title'),page.title);
    assert.equal(createPageMetadata({title:'Ana Sayfa',path:'/'}).alternates.canonical,'https://otosoz.com/');
    assert.throws(()=>createPageMetadata({title:'Başlık',path:'https://example.com/'}));
});

test('Brand suffix is applied once and complete words are preserved', () => {
    assert.equal(metadataTitle('Turbo | OtoSöz Otomotiv Sözlüğü'),'Turbo | OtoSöz');
    const long='Renault Clio 5 (2020-2025) Alınır mı? Kronik Sorunlar ve Motorlar';
    assert.ok(metadataTitle(long).length<=60);
    assert.ok(!metadataTitle(long).includes('| OtoSöz'));
    assert.equal(wordLimit('Birinci ikinci üçüncü kelime',18),'Birinci ikinci');
    assert.equal(wordLimit('Kronik sorunlar ve motor seçenekleri',20),'Kronik sorunlar');
    for (const value of ['Kısa açıklama.', 'Uzun açıklama '.repeat(30)]) {
        const description=metadataDescription(value,'Renault Clio Kronik Sorunları');
        assert.ok(description.length>=120&&description.length<=158);
    }
});

test('Publication dates are copied only from genuine, valid inputs', () => {
    const page=createPageMetadata({title:'Makale',path:'/makale/ornek',type:'article',publishedTime:'2026-01-01',modifiedTime:'invalid'});
    assert.equal(page.openGraph.publishedTime,'2026-01-01T00:00:00.000Z');
    assert.equal(page.openGraph.modifiedTime,undefined);
    assert.equal(createPageMetadata({title:'Makale',type:'article'}).openGraph.publishedTime,undefined);
});
