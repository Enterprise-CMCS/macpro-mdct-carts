import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import { defineConfig, globalIgnores } from "eslint/config";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import jest from "eslint-plugin-jest";
import cypress from "eslint-plugin-cypress";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig([
  globalIgnores([
    "cypress/plugins/**/*",
    "tests/cypress/plugins/**/*",
    "services/app-api/libs/authorization.ts",
  ]),
  {
    extends: compat.extends("eslint:recommended"),

    plugins: {
      "@typescript-eslint": typescriptEslint,
      jest,
      cypress,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...jest.environments.globals.globals,
        ...cypress.environments.globals.globals,
      },

      parser: tsParser,
      ecmaVersion: 6,
      sourceType: "module",

      parserOptions: {
        ecmaFeatures: {
          modules: true,
        },
      },
    },

    rules: {
      "no-const-assign": "error",
      "no-duplicate-imports": "error",
      "no-unreachable": "error",

      "no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
        },
      ],

      "no-console": "error",
      "no-empty": "error",
      "no-extra-semi": "error",
      "multiline-comment-style": ["error", "starred-block"],
    },
    ignorePatterns: [
      "cypress/plugins/**/*",
      "tests/cypress/plugins/**/*",
      "services/app-api/libs/authorization.ts",
    ],
  },
]);
