import { builtinRules } from 'eslint/use-at-your-own-risk';
import parser from '@typescript-eslint/parser';
import reactHooks from 'eslint-plugin-react-hooks';

const restricted = builtinRules.get('no-restricted-imports');
const heavyPattern = '(?:^|/)data/(?:vehicle-dna|engine-dna|trim-levels|obd-codes|kasko_deger)(?:\\.(?:json|ts))?$';
const clientRule = {
    ...restricted,
    create(context) {
        const program = context.sourceCode.ast;
        if (!program.body.some(node => node.type === 'ExpressionStatement' && node.directive === 'use client')) return {};
        const visitor = restricted.create(context);
        return { ...visitor, ImportExpression(node) {
            if (node.source.type === 'Literal' && new RegExp(heavyPattern).test(String(node.source.value))) {
                context.report({node,message:'Tam katalog istemciye yüklenemez. Sunucu bileşeni, hafif indeks veya tek kayıt API kullanın.'});
            }
        } };
    },
};

export default [{
    files:['**/*.{ts,tsx,js,jsx}'],
    ignores:['.next/**','node_modules/**','scratch/**','out/**','build/**'],
    languageOptions:{parser,parserOptions:{ecmaFeatures:{jsx:true}}},
    linterOptions:{reportUnusedDisableDirectives:false},
    plugins:{'react-hooks':reactHooks,'client-boundary':{rules:{'no-restricted-imports':clientRule}}},
    rules:{'client-boundary/no-restricted-imports':['error',{patterns:[{regex:heavyPattern,
        message:'Tam katalog sadece sunucuda okunabilir. Küçük prop veya seçim indeksi aktarın.'}]}]},
}];
