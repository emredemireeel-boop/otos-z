import test from 'node:test';
import assert from 'node:assert/strict';
import {loadSource} from '../scripts/seo-quality-loader.mjs';
const {communityHomeRedirect,communitySurvey}=loadSource('lib/community.ts');
const {isSeoUrlIndexable}=loadSource('lib/seo-index-catalog.ts');
const poll={title:'Sürücülerin gerçek anketi',status:'active',totalVotes:0,nominees:[{id:1,name:'Benzin',votes:0},{id:2,name:'Elektrik',votes:0}],voters:{privateUser:1}};
test('Community consolidation keeps canonical topic addresses and removes duplicate listings',()=>{
    assert.equal(communityHomeRedirect('/forum'),'/');
    assert.equal(communityHomeRedirect('/anket'),'/#anket');
    assert.equal(communityHomeRedirect('/uzmana-sor'),'/#uzmana-sor');
    assert.equal(communityHomeRedirect('/forum/real-topic--123'),null);
    for(const path of ['/forum','/anket','/uzmana-sor','/forum/kategori/genel'])assert.equal(isSeoUrlIndexable(path),false);
    assert.equal(isSeoUrlIndexable('/forum/real-topic--123',{indexableThreads:new Set(['real-topic--123'])}),true);
});
test('Only real visible polls are public; invented votes and voter identities never become home props',()=>{
    const result=communitySurvey('real-id',poll);
    assert.equal(result.totalVotes,0);assert.equal('voters' in result,false);
    for(const data of [{...poll,source:'curated'},{...poll,demo:true},{...poll,hidden:true},{...poll,status:'spam'},{...poll,nominees:[]},{...poll,totalVotes:-1}])assert.equal(communitySurvey('real-id',data),null);
    assert.equal(communitySurvey('curated-city-powertrain',poll),null);
    assert.equal(communitySurvey('real-id',{...poll,nominees:[{id:1,name:'A',votes:0},{id:1,name:'B',votes:0}]}),null);
});
