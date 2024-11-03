/* eslint-disable n/no-unpublished-import */
import importPlugin from "eslint-plugin-import";
import prettierPlugin from "eslint-plugin-prettier/recommended";
import nodePlugin from "eslint-plugin-n";
// eslint-disable-next-line n/no-extraneous-import
import globals from "globals";
import eslint from "@eslint/js";
// eslint-disable-next-line import/no-unresolved
import tseslint from "typescript-eslint";
// eslint-disable-next-line import/no-unresolved
import tseslintParser from "@typescript-eslint/parser";
import unusedImports from "eslint-plugin-unused-imports";

export default [
  ...tseslint.config(eslint.configs.recommended, ...tseslint.configs.recommended),
  importPlugin.flatConfigs.recommended,
  prettierPlugin,
  nodePlugin.configs["flat/recommended-script"],
  {
    plugins: {
      "unused-imports": unusedImports
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      parser: tseslintParser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: "./"
      },
      globals: {
        ...globals.es2021,
        ...globals.node,
        ...globals.jest
      }
    },
    settings: {
      "import/resolver": {
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"]
        },
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.json"
        }
      },
      "import/parsers": {
        "@typescript-eslint/parser": [".js", ".jsx", ".ts", ".tsx"]
      }
    },
    ignores: ["eslint.config.js"],
    rules: {
      "comma-dangle": "off",
      "no-underscore-dangle": 1,
      "import/extensions": "off",
      "n/no-unsupported-features/es-syntax": "off",
      "n/no-missing-import": "off",
      "no-unused-expressions": [
        "error",
        {
          allowTernary: true
        }
      ],
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-vars": ["error", { vars: "local", args: "after-used", argsIgnorePattern: "^_" }],
      "unused-imports/no-unused-imports": "error",
      "no-ternary": "off",
      "no-console": "off",
      "no-return-await": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-explicit-any": 1,
      "@typescript-eslint/no-var-requires": 0,
      "import/no-unused-modules": 1,
      "no-shadow": 0,
      "import/order": [
        "warn",
        {
          "newlines-between": "always", //enforces new lines between import groups
          groups: [
            "builtin", //node "builtin" modules
            "external", // "external" modules
            "internal", // "internal" modules (if you have configured your path or webpack to handle your internal paths differently)
            "parent", // modules from a "parent" directory
            "sibling", // "sibling" modules from the same or a sibling's directory
            "index", // "index" of the current directory */,
            "type" // "type" imports
          ], // declare how groups will be ordered
          alphabetize: {
            order: "asc", // sort in ascending order. Options: ['ignore', 'asc', 'desc']
            caseInsensitive: true // ignore case. Options: [true, false]
          }
        }
      ]
    }
  }
];
