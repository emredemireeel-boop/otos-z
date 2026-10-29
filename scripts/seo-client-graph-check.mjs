import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const roots=['app','components','context','lib'];
function files(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?files(path.join(dir,entry.name)):/\.(?:ts|tsx|js|jsx)$/.test(entry.name)?[path.join(dir,entry.name)]:[]);}
const sourceFiles=roots.flatMap(files);
const entries=sourceFiles.filter(file=>/^\s*["']use client["']/.test(fs.readFileSync(file,'utf8').replace(/^\uFEFF/,'')));
const heavy=/[\/]data[\/](?:vehicle-dna|engine-dna|trim-levels|obd-codes|kasko_deger)\.(?:ts|json)$/;
const parsed=new Map();
function dependencies(file){
    if(parsed.has(file))return parsed.get(file);
    if(file.endsWith('.json'))return [];
    const raw=fs.readFileSync(file,'utf8');
    const code=ts.transpileModule(raw,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.Preserve}}).outputText;
    const tree=ts.createSourceFile(file,code,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX),imports=[];
    function visit(node){
        if((ts.isImportDeclaration(node)||ts.isExportDeclaration(node))&&node.moduleSpecifier&&ts.isStringLiteral(node.moduleSpecifier))imports.push(node.moduleSpecifier.text);
        if(ts.isCallExpression(node)&&node.expression.kind===ts.SyntaxKind.ImportKeyword&&node.arguments[0]&&ts.isStringLiteral(node.arguments[0]))imports.push(node.arguments[0].text);
        ts.forEachChild(node,visit);
    }visit(tree);
    const resolved=imports.filter(value=>value.startsWith('.')||value.startsWith('@/')).map(value=>{
        const base=value.startsWith('@/')?path.resolve(value.slice(2)):path.resolve(path.dirname(file),value);
        return ['', '.ts','.tsx','.js','.jsx','.json','/index.ts','/index.tsx'].map(suffix=>base+suffix).find(candidate=>fs.existsSync(candidate)&&fs.statSync(candidate).isFile());
    }).filter(Boolean);
    parsed.set(file,resolved);return resolved;
}
const violations=[];
for(const entry of entries){const seen=new Set();function walk(file,chain){if(seen.has(file))return;seen.add(file);if(heavy.test(file)){violations.push([...chain,file].map(value=>path.relative('.',value).replaceAll('\\','/')));return;}for(const child of dependencies(file))walk(child,[...chain,file]);}walk(path.resolve(entry),[]);}
const chunks=fs.existsSync('.next/static/chunks')?filesJs('.next/static/chunks'):[];
function filesJs(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?filesJs(path.join(dir,entry.name)):entry.name.endsWith('.js')?[path.join(dir,entry.name)]:[]);}
const clioMatches=chunks.filter(file=>fs.readFileSync(file,'utf8').includes('Clio')).map(file=>({file,context:fs.readFileSync(file,'utf8').match(/.{0,45}Clio.{0,90}/)?.[0]}));
const report={checkedAt:new Date().toISOString(),clientEntries:entries.length,checkedModules:parsed.size,
    forbiddenRuntimeImports:violations.length,violations,chunkCount:chunks.length,clioChunkMatches:clioMatches};
fs.writeFileSync('docs/seo/step04-client-graph.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
process.exitCode=violations.length || clioMatches.length ? 1 : 0;
