import baseConfig from "@plobbo/eslint-config/base";
import reactConfig from "@plobbo/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [{ ignores: ["dist/**"] }, ...baseConfig, ...reactConfig];
