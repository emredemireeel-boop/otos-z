import test from 'node:test';
import assert from 'node:assert/strict';
import {loadSource} from '../scripts/seo-quality-loader.mjs';
const {CATEGORIES,getLibraryCategoryRedirect,libraryCategoryPath}=loadSource('lib/library-categories.ts');
const {urlset,xmlEscape}=loadSource('lib/sitemap-xml.ts');
const {isSeoUrlIndexable}=loadSource('lib/seo-index-catalog.ts');
test('Every legacy category query resolves directly to a canonical route',()=>{
 for(const cat of CATEGORIES){assert.equal(getLibraryCategoryRedirect(cat.slug),libraryCategoryPath(cat.slug));assert.ok(!getLibraryCategoryRedirect(cat.slug).includes('?'));}
 assert.equal(getLibraryCategoryRedirect('ehliyet-sinifari'),'/kutuphane/kategori/ehliyet-siniflari');
 assert.equal(getLibraryCategoryRedirect('otoyol-ucretleri'),'/kutuphane/kategori/otoyol-ve-kopru-ucretleri');
 for(const value of ['', 'unknown','__proto__','constructor'])assert.equal(getLibraryCategoryRedirect(value),'/kutuphane');
});
test('The quality registry rejects query duplicates and retains category quality decisions',()=>{
 assert.equal(isSeoUrlIndexable('/kutuphane?kategori=ikinci-el-rehberi'),false);
 assert.equal(isSeoUrlIndexable('/kutuphane/kategori/ikinci-el-rehberi'),true);
 assert.equal(isSeoUrlIndexable('/kutuphane/kategori/otomotiv-sozluk'),false);
 assert.equal(isSeoUrlIndexable('/kutuphane/kategori/unknown'),false);
});
test('XML serialization escapes values and never invents dates or emits priority',()=>{
 const xml=urlset([{url:'https://otosoz.com/example?a=1&b=2'},{url:'https://otosoz.com/dated',lastModified:'2026-09-01'}]);
 assert.ok(xml.includes('?a=1&amp;b=2'));assert.equal((xml.match(/<lastmod>/g)||[]).length,1);
 assert.ok(!xml.includes('priority'));assert.ok(!xml.includes('changefreq'));assert.equal(xmlEscape('<x>"'), '&lt;x&gt;&quot;');
 assert.throws(()=>urlset(Array.from({length:50000},()=>({url:'https://otosoz.com'}))));
});
