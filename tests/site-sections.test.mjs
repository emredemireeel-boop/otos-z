import test from 'node:test';
import assert from 'node:assert/strict';
import {loadSource} from '../scripts/seo-quality-loader.mjs';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {execFileSync} from 'node:child_process';
const {sectionHttpDecision, isPublishedPath,siteSections}=loadSource('lib/site-sections.ts');
const {isSeoUrlIndexable}=loadSource('lib/seo-index-catalog.ts');
test('Paused sections do not force visitors to a different project',{skip:Object.values(siteSections).some(Boolean)},()=>{
    assert.deepEqual(sectionHttpDecision('/arac-dna?x=1'),{status:404,location:null});
    assert.deepEqual(sectionHttpDecision('/ARAC-DNA/Renault/clio'),{status:404,location:null});
    for(const path of ['/kutuphane','/kutuphane?kategori=lastik-rehberi','/haberler/test','/makale/test','/api/arac-dna?ids=1','/data/news_posts.json','/news-sitemap.xml','/obd','/obd/p0420','/obd-kodlari/1','/api/obd']) assert.deepEqual(sectionHttpDecision(path),{status:404,location:null});
    for(const path of ['/','/forum','/otohesap','/acik-oto-pazari'])assert.equal(sectionHttpDecision(path),null);
    assert.equal(isPublishedPath('/arac-dnax'),true);
});
test('Publication state vetoes even otherwise quality-qualified sitemap candidates',{skip:Object.values(siteSections).some(Boolean)},()=>{
    for(const path of ['/arac-dna','/arac-dna/renault/clio-5-nesil-2020-2025','/kutuphane/kategori/ikinci-el-rehberi','/haberler','/makale'])assert.equal(isSeoUrlIndexable(path),false);
    assert.equal(isSeoUrlIndexable('/forum'),false);
});
test('Disconnected library helpers cannot override noindex through explicit metadata options',{skip:siteSections.library},()=>{
    const {createPageMetadata}=loadSource('lib/seo.ts');
    const path='/nasil-yapilir/patlak-lastik-nasil-degistirilir';
    assert.equal(sectionHttpDecision(path),null);
    assert.equal(isSeoUrlIndexable(path),false);
    assert.equal(createPageMetadata({path,title:'Lastik değiştirme',description:'Mevcut rehber.',index:true}).robots.index,false);
});
test('Hidden route sources can be restored and paused again byte for byte',()=>{
    const root=fs.mkdtempSync(path.join(os.tmpdir(),'otosoz-publication-'));
    const script=path.resolve('scripts/site-sections.mjs');
    try {
        fs.mkdirSync(path.join(root,'data'));
        fs.writeFileSync(path.join(root,'data/site-sections.json'),JSON.stringify({vehicleDna:false,library:false,news:false,obd:false}));
        const roots=['app/arac-dna','app/api/arac-dna','app/kutuphane','app/makale','app/haberler','app/news-sitemap.xml','app/obd','app/obd-kodlari','app/api/obd'];
        for(const dir of roots){fs.mkdirSync(path.join(root,dir),{recursive:true});fs.writeFileSync(path.join(root,dir,'page.paused.tsx'),'// preserved source\n');}
        execFileSync(process.execPath,[script,'restore','all'],{cwd:root});
        assert.ok(Object.values(JSON.parse(fs.readFileSync(path.join(root,'data/site-sections.json')))).every(Boolean));
        execFileSync(process.execPath,[script,'hide','all'],{cwd:root});
        for(const dir of roots)assert.equal(fs.readFileSync(path.join(root,dir,'page.paused.tsx'),'utf8'),'// preserved source\n');
    } finally {fs.rmSync(root,{recursive:true,force:true});}
});
