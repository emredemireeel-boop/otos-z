import fs from 'node:fs';

export function releaseTypeConfig(candidate,directories){
    if(!/^\.next-candidate-[a-zA-Z0-9-]+$/.test(candidate||''))throw Error('Expected an isolated .next-candidate-* build directory');
    return {extends:'./tsconfig.json',compilerOptions:{tsBuildInfoFile:`./${candidate}/typecheck.tsbuildinfo`},
        include:['next-env.d.ts','**/*.ts','**/*.tsx',`${candidate}/types/**/*.ts`],
        exclude:['node_modules','.next',...directories.filter(dir=>dir.startsWith('.next-candidate-')&&dir!==candidate)]};
}
if(process.argv[1]?.replace(/\\/g,'/').endsWith('/seo-release-config.mjs')){
    const config=releaseTypeConfig(process.env.OTOSOZ_DIST_DIR,fs.readdirSync('.',{withFileTypes:true}).filter(entry=>entry.isDirectory()).map(entry=>entry.name));
    fs.writeFileSync('.tsconfig-release.json',JSON.stringify(config,null,2)+'\n');
}
