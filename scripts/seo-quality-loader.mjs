import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import ts from 'typescript';

// Salt okunur veri/kalite modülleri için küçük TS yükleyici; Next render kodunu çalıştırmaz.
const modules = new Map();
export function loadSource(filename) {
    const absolute = path.resolve(filename);
    if (modules.has(absolute)) return modules.get(absolute).exports;
    if (absolute.endsWith('.json')) return JSON.parse(fs.readFileSync(absolute, 'utf8'));
    const module = { exports: {} };
    modules.set(absolute, module);
    const code = ts.transpileModule(fs.readFileSync(absolute, 'utf8'), { compilerOptions: {
        module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true,
    } }).outputText;
    const nativeRequire = createRequire(absolute);
    function localRequire(specifier) {
        // Build-time marker only; the audited registry has no server API calls.
        if (specifier === 'server-only') return {};
        if (!specifier.startsWith('.') && !specifier.startsWith('@/')) return nativeRequire(specifier);
        const root = specifier.startsWith('@/') ? path.resolve(specifier.slice(2)) : path.resolve(path.dirname(absolute), specifier);
        const resolved = ['', '.ts', '.tsx', '.json', '.js'].map(extension => root + extension).find(candidate => fs.existsSync(candidate) && fs.statSync(candidate).isFile());
        if (!resolved) throw new Error(`Cannot resolve ${specifier} from ${filename}`);
        return loadSource(resolved);
    }
    new Function('require', 'module', 'exports', '__filename', '__dirname', code)(localRequire, module, module.exports, absolute, path.dirname(absolute));
    return module.exports;
}
