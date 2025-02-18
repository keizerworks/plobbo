/// <reference types="./types.d.ts" />
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import unusedImports from "eslint-plugin-unused-imports";
import globals from "globals";
import tseslint from "typescript-eslint";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

export default tseslint.config(
    ...compat.extends("next/core-web-vitals", "next/typescript"),
    {
        languageOptions: {
            globals: globals.builtin,
        },
        files: ["src/**/*.js", "src/**/*.ts", "src/**/*.tsx"],
        plugins: {
            import: importPlugin,
            "unused-imports": unusedImports,
            unicorn: eslintPluginUnicorn,
        },
        extends: [
            eslint.configs.recommended,
            eslintConfigPrettier,

            ...tseslint.configs.recommended,
            ...tseslint.configs.recommendedTypeChecked,
            ...tseslint.configs.stylisticTypeChecked,
        ],
        rules: {
            "@typescript-eslint/no-namespace": "off",
            "@next/next/no-duplicate-head": "off",
            "react/display-name": "off",

            "unused-imports/no-unused-imports": "error",
            "unused-imports/no-unused-vars": [
                "error",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                    caughtErrorsIgnorePattern: "^_",
                },
            ],

            "unicorn/filename-case": [
                "error",
                {
                    case: "kebabCase",
                },
            ],

            "@typescript-eslint/no-unused-vars": [
                "error",
                { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
            ],
            "@typescript-eslint/consistent-type-imports": [
                "warn",
                { prefer: "type-imports", fixStyle: "separate-type-imports" },
            ],
            "@typescript-eslint/no-misused-promises": [
                2,
                { checksVoidReturn: { attributes: false } },
            ],
            "@typescript-eslint/no-unnecessary-condition": [
                "error",
                {
                    allowConstantLoopConditions: true,
                },
            ],
            "@typescript-eslint/no-non-null-assertion": "error",
            "import/consistent-type-specifier-style": [
                "error",
                "prefer-top-level",
            ],
        },
    },
    {
        linterOptions: { reportUnusedDisableDirectives: true },
        languageOptions: { parserOptions: { projectService: true } },
    },
);
