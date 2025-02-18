// @ts-nocheck
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

import baseConfig from "@plobbo/eslint-config/base";
import reactConfig from "@plobbo/eslint-config/react";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

/** @type {import('typescript-eslint').Config} */
export default [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  ...baseConfig,
  ...reactConfig,
];
