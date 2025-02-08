// @ts-nocheck
import baseConfig from "@plobbo/eslint-config/base";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: ["packages/**/*", "apps/**/*", "tooling/**/*"],
    files: ["infra/**"],
  },
  ...baseConfig,
];
