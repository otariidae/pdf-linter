const js = require("@eslint/js")
const { FlatCompat } = require("@eslint/eslintrc")
const typescriptParser = require("@typescript-eslint/parser")
const typescriptEslintPlugin = require("@typescript-eslint/eslint-plugin")
const eslintConfigPrettier = require("eslint-config-prettier")

const compat = new FlatCompat()

module.exports = [
  {
    ignores: [
      "dist",
      "public/textlint-worker.js",
      "vite.config.ts",
      "eslint.config.js",
    ],
  },
  js.configs.recommended,
  eslintConfigPrettier,
  ...compat.extends(
    "plugin:@typescript-eslint/strict-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
    "prettier",
  ),
  {
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: "tsconfig.json",
      },
    },
    plugins: [typescriptEslintPlugin],
    rules: {
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          fixStyle: "inline-type-imports",
        },
      ],
      "@typescript-eslint/strict-boolean-expressions": "error",
    },
  },
]
