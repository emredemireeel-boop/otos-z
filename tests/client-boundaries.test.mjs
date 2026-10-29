import test from 'node:test';
import assert from 'node:assert/strict';
import {ESLint} from 'eslint';

const eslint=new ESLint({overrideConfigFile:'eslint.client-boundaries.mjs'});
test('client imports reject all five heavy catalogues, including relative and dynamic paths',async()=>{
    for(const path of ['@/data/vehicle-dna','@/data/engine-dna','@/data/trim-levels','../../data/obd-codes.json','../data/kasko_deger.json']){
        const [result]=await eslint.lintText(`'use client'; import data from '${path}';`,{filePath:'components/BoundaryFixture.tsx'});
        assert.equal(result.errorCount,1,path);
    }
    const [dynamic]=await eslint.lintText(`'use client'; const read=()=>import('@/data/vehicle-dna');`,{filePath:'components/BoundaryFixture.tsx'});
    assert.equal(dynamic.errorCount,1);
});
test('server catalogue imports and small client presentation/type modules remain allowed',async()=>{
    const [server]=await eslint.lintText(`import data from '@/data/vehicle-dna';`,{filePath:'app/BoundaryFixture.tsx'});
    const [client]=await eslint.lintText(`'use client'; import {createSlug} from '@/lib/vehicle-presentation'; import type {VehicleDNA} from '@/lib/dna-types';`,{filePath:'components/BoundaryFixture.tsx'});
    assert.equal(server.errorCount,0);assert.equal(client.errorCount,0);
});
