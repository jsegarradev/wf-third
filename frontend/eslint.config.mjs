// ESLint flat config — spring-boot-angular scaffold, frontend lint + style.
// Standard stack, no custom rule invention:
//   - typescript-eslint (recommended)  -> TS lint
//   - angular-eslint    (recommended)  -> Angular TS + template lint + a11y
//   - @stylistic        (recommended)  -> formatting (owns it; no Prettier)
// House overrides: 4-space indent, single quotes, 120 columns, semicolons,
// trailing commas. NOTE: @stylistic/recommended defaults to NO semicolons — but
// CLAUDE.md mandates them, so semi/comma-dangle are set explicitly here so the
// linter and the conventions doc agree (they contradicted before). @stylistic
// still owns everything else.
//
// Requires: npm i -D eslint typescript-eslint angular-eslint @stylistic/eslint-plugin

import tseslint from 'typescript-eslint';
import angular from 'angular-eslint';
import stylistic from '@stylistic/eslint-plugin';

export default tseslint.config(
    {
        ignores: ['dist/**', '.angular/**', 'coverage/**', 'node_modules/**', 'playwright-report/**', 'test-results/**'],
    },
    {
        files: ['**/*.ts'],
        extends: [
            ...tseslint.configs.recommended,
            ...angular.configs.tsRecommended,
            stylistic.configs.recommended,
        ],
        processor: angular.processInlineTemplates,
        rules: {
            '@stylistic/indent': ['error', 4],
            '@stylistic/quotes': ['error', 'single', { avoidEscape: true }],
            '@stylistic/semi': ['error', 'always'],            // recommended strips these; CLAUDE.md wants them
            '@stylistic/comma-dangle': ['error', 'always-multiline'],
            '@stylistic/max-len': ['error', {
                code: 120,
                ignoreUrls: true,
                ignoreStrings: true,
                ignoreTemplateLiterals: true,
            }],
        },
    },
    {
        files: ['**/*.html'],
        extends: [
            ...angular.configs.templateRecommended,
            ...angular.configs.templateAccessibility,
        ],
    },
);
