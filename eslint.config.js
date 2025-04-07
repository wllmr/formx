import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginPrettier from "eslint-plugin-prettier";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config([
  {
    files: ["**/*.{ts,tsx}"],
    ignores: ["node_modules/", "dist/", "build/", "coverage/", ".git/"],
    plugins: {
      prettier: eslintPluginPrettier,
    },
    extends: [
      "plugin:@typescript-eslint/recommended-type-checked",
      "plugin:@typescript-eslint/strict-type-checked",
      "plugin:@typescript-eslint/stylistic-type-checked",
      "plugin:prettier/recommended",
      eslintConfigPrettier,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        project: ["./tsconfig.json"],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "prettier/prettier": "error",
    },
  },

  {
    files: ["**/*.js", "**/*.mjs"],
    ignores: ["node_modules/", "dist/", "build/", "coverage/", ".git/"],
    plugins: {
      prettier: eslintPluginPrettier,
    },
    extends: [eslintConfigPrettier],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      "prettier/prettier": "error",
    },
  },
]);
