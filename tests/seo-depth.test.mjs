import test from 'node:test';
import assert from 'node:assert/strict';
import {breadthFirstDepth} from '../scripts/seo-html-graph.mjs';
test('Only the homepage starts BFS; sitemap seeds and cycles cannot create false reachability',()=>{
    const graph=new Map([['/',new Set(['/hub','/model'])],['/hub',new Set(['/model','/'])],['/model',new Set(['/tab'])],['/tab',new Set(['/model'])],['/isolated',new Set(['/isolated-child'])]]);
    const depth=breadthFirstDepth(graph);
    assert.equal(depth.get('/'),0);assert.equal(depth.get('/model'),1);assert.equal(depth.get('/tab'),2);
    assert.equal(depth.has('/isolated'),false);assert.equal(depth.has('/isolated-child'),false);
});
