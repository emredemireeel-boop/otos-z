import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {robotsAllows} from '../scripts/seo-robots.mjs';
import {loadSource} from '../scripts/seo-quality-loader.mjs';
const {provenanceFromRecord}=loadSource('lib/content-provenance.ts');

test('Robots exceptions use the longest applicable path and correct agent group',()=>{
    const robots='User-agent: *\nAllow: /\nDisallow: /api/\nAllow: /api/og\nUser-agent: AhrefsBot\nDisallow: /';
    assert.equal(robotsAllows(robots,'/obd/p0420'),true);
    assert.equal(robotsAllows(robots,'/api/data'),false);
    assert.equal(robotsAllows(robots,'/api/og?title=OBD'),true);
    assert.equal(robotsAllows(robots,'/','AhrefsBot'),false);
});

test('Missing content dates stay unknown; valid record dates and sources are preserved',()=>{
    assert.equal(provenanceFromRecord({title:'No date'}).date,null);
    assert.equal(provenanceFromRecord({updatedAt:'invalid'}).date,null);
    assert.equal(provenanceFromRecord({updatedAt:'2999-01-01'}).date,null);
    const value=provenanceFromRecord({lastReviewed:'2026-09-18',sources:[{title:'Manufacturer',url:'https://example.com/manual'},{title:'Duplicate',url:'https://example.com/manual'},{url:'javascript:alert(1)'}]});
    assert.equal(value.date,'2026-09-18T00:00:00.000Z');
    assert.equal(value.sources.length,1);
});

test('Weekly inspection set has 50 distinct canonical-host URLs',()=>{
    const urls=JSON.parse(fs.readFileSync('docs/seo/critical-urls.json'));
    assert.equal(urls.length,50);assert.equal(new Set(urls).size,50);
    for(const value of urls)assert.equal(new URL(value).origin,'https://otosoz.com');
});
