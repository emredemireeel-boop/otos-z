import test from 'node:test';
import assert from 'node:assert/strict';
import {forumStyleDecision} from '../scripts/seo-forum-style-check.mjs';
const css='.scope .forum-thread-actions button{min-height:40px}.scope .forum-thread-action-primary{background:#fff;color:#0f172a}';
test('missing CSS scope fails even when the stylesheet and reply action exist',()=>{
    const result=forumStyleDecision('<div><div class="forum-thread-actions"><button class="forum-thread-action-primary">Yanıt yaz</button></div></div>',[css]);
    assert.equal(result.passed,false);assert.equal(result.replyButtonMatches,0);
});
test('server HTML with the matching scope has usable reply-action styles before JS',()=>{
    const html='<div class="scope"><div class="forum-thread-actions"><button class="forum-thread-action-primary">Yanıt yaz</button></div></div>';
    assert.equal(forumStyleDecision(html,[css]).passed,true);
    assert.equal(forumStyleDecision(html,[]).passed,false);
});
