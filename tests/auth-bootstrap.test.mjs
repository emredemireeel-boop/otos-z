import test from 'node:test';
import assert from 'node:assert/strict';
import {loadSource} from '../scripts/seo-quality-loader.mjs';
const {needsAuthRoute,hasPersistedAuth}=loadSource('lib/auth-bootstrap.ts');
const storage=entries=>({length:Object.keys(entries).length,key:i=>Object.keys(entries)[i],getItem:key=>entries[key]??null});
test('anonymous content navigation requires no auth bootstrap, account routes do',()=>{
    for(const route of ['/','/obd/p0420','/arac-dna/renault/clio','/forum/gercek-konu--12345678'])assert.equal(needsAuthRoute(route),false);
    for(const route of ['/giris','/profil','/admin/icerik','/mesajlar'])assert.equal(needsAuthRoute(route),true);
});
test('existing persistent sessions are restored without initially downloading Firebase',async()=>{
    globalThis.localStorage=storage({Otosoz_user:'{"id":"existing"}'});globalThis.sessionStorage=storage({});
    assert.equal(await hasPersistedAuth(),true);
    globalThis.localStorage=storage({});globalThis.sessionStorage=storage({'firebase:authUser:key:app':'{"uid":"session"}'});
    assert.equal(await hasPersistedAuth(),true);
    globalThis.localStorage=storage({});globalThis.sessionStorage=storage({});
    globalThis.indexedDB={databases:async()=>[]};assert.equal(await hasPersistedAuth(),false);
    delete globalThis.indexedDB;delete globalThis.localStorage;delete globalThis.sessionStorage;
});
test('display-only timestamps preserve exact SSR milliseconds and canonical forum slugs',()=>{
    const {displayTimestamp,getThreadSlugUrl}=loadSource('lib/forum-presentation.ts');
    const timestamp=displayTimestamp(1234567890);
    assert.equal(timestamp.toMillis(),1234567890);assert.equal(timestamp.toDate().getTime(),1234567890);
    assert.equal(getThreadSlugUrl({id:'firestore',title:'Gerçek Başlık',urlId:12345678}),'/forum/gercek-baslik--12345678');
});
