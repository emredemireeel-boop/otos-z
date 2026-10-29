import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import clientBoundaries from './eslint.client-boundaries.mjs';

export default defineConfig([
    ...nextVitals,
    ...clientBoundaries,
    globalIgnores([
        ".next/**",
        "node_modules/**",
        "out/**",
        "build/**",
        "next-env.d.ts",
    ]),
]);
