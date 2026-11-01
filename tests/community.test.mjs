import test from 'node:test';
import assert from 'node:assert/strict';
import {loadSource} from '../scripts/seo-quality-loader.mjs';
const {communityHomeRedirect,communitySurvey}=loadSource('lib/community.ts');
const {isSeoUrlIndexable}=loadSource('lib/seo-index-catalog.ts');
const {createCommunityFeed}=loadSource('lib/community-feed.ts');
const poll={title:'Sürücülerin gerçek anketi',status:'active',totalVotes:0,nominees:[{id:1,name:'Benzin',votes:0},{id:2,name:'Elektrik',votes:0}],voters:{privateUser:1}};
test('Community consolidation keeps canonical topic addresses and removes duplicate listings',()=>{
    assert.equal(communityHomeRedirect('/forum'),'/');
    assert.equal(communityHomeRedirect('/anket'),'/');
    assert.equal(communityHomeRedirect('/uzmana-sor'),'/');
    assert.equal(communityHomeRedirect('/forum/real-topic--123'),null);
    for(const path of ['/forum','/anket','/uzmana-sor','/forum/kategori/genel'])assert.equal(isSeoUrlIndexable(path),false);
    assert.equal(isSeoUrlIndexable('/forum/real-topic--123',{indexableThreads:new Set(['real-topic--123'])}),true);
});
test('Polls and questions share topic categories, URLs and honest activity counters',()=>{
    const survey=communitySurvey('real-poll',{...poll,createdAt:'2026-10-01T10:00:00Z',totalVotes:3});
    const threads=[{id:'real-thread',title:'Gerçek soru',category:'Teknik',type:'expert',urlId:12345678,authorUsername:'driver',entryCount:3,views:0,createdAt:1000,lastEntryAt:2000}];
    const feed=createCommunityFeed(threads,[survey]);
    assert.equal(feed.length,2);assert.equal(feed[0].type,'expert');assert.equal(feed[0].category,'Teknik & Arıza');assert.equal(feed[0].entryCount,2);
    assert.equal(feed[1].type,'survey');assert.equal(feed[1].category,'Genel');assert.equal(feed[1].entryCount,3);assert.equal(feed[1].slugUrl,'/#anket-real-poll');
    assert.equal(feed[1].rawActivityAt,Date.parse('2026-10-01T10:00:00Z'));
    assert.equal(createCommunityFeed([{...threads[0],type:undefined,category:'Uzmana Sor'}],[])[0].type,'expert');
});
test('Only real visible polls are public; invented votes and voter identities never become home props',()=>{
    const result=communitySurvey('real-id',poll);
    assert.equal(result.totalVotes,0);assert.equal('voters' in result,false);
    for(const data of [{...poll,source:'curated'},{...poll,demo:true},{...poll,hidden:true},{...poll,status:'spam'},{...poll,nominees:[]},{...poll,totalVotes:-1}])assert.equal(communitySurvey('real-id',data),null);
    assert.equal(communitySurvey('curated-city-powertrain',poll),null);
    assert.equal(communitySurvey('real-id',{...poll,nominees:[{id:1,name:'A',votes:0},{id:1,name:'B',votes:0}]}),null);
});
