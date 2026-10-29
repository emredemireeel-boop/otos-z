import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import {spawn} from 'node:child_process';

test('SEO gate exits nonzero and stops later stages when HTTP regression is detected',async()=>{
    const output=fs.mkdtempSync(path.join(os.tmpdir(),'otosoz-seo-gate-'));
    const server=http.createServer((request,response)=>{response.statusCode=request.url==='/robots.txt'?200:503;response.end(request.url==='/robots.txt'?'User-agent: *\nAllow: /':'Unavailable');});
    await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
    try{
        const exit=await new Promise((resolve,reject)=>{const child=spawn(process.execPath,['scripts/seo-ci.mjs','--base',`http://127.0.0.1:${server.address().port}`,'--output',output],{stdio:'ignore'});child.on('error',reject);child.on('exit',resolve);});
        assert.equal(exit,1);
        const summary=JSON.parse(fs.readFileSync(path.join(output,'summary.json')));
        assert.equal(summary.passed,false);
        assert.deepEqual(summary.results.map(row=>row.name),['status']);
        assert.equal(summary.results[0].exitCode,1);
    }finally{await new Promise(resolve=>server.close(resolve));fs.rmSync(output,{recursive:true,force:true});}
});
