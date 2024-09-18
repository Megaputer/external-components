import globals from "globals";
import eslint from "@eslint/js";
import compat from "eslint-plugin-compat";
import importX from "eslint-plugin-import-x";
import jsdoc from 'eslint-plugin-jsdoc';
import promise from "eslint-plugin-promise";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import stylistic from "@stylistic/eslint-plugin";
import tseslint from "typescript-eslint";

const typeScriptExtensions = [".ts", ".tsx", ".cts", ".mts"];

const allExtensions = [
  ...typeScriptExtensions,
  ".js",
  ".jsx",
  ".cjs",
  ".mjs",
];

export default tseslint.config(
  {
    linterOptions: {
      reportUnusedDisableDirectives: "error"
    },
  },
  {
    ignores: [
      "**/eslint.config.mjs",
      "**/webpack.*.js",
    ]
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  compat.configs["flat/recommended"],
  importX.flatConfigs.errors,
  jsdoc.configs["flat/logical-typescript-error"],
  jsdoc.configs["flat/stylistic-typescript-error"],
  promise.configs["flat/recommended"],
  react.configs.flat.recommended,
  react.configs.flat["jsx-runtime"],
  {
    ...reactHooks.configs.recommended,
    plugins: {
      "react-hooks": reactHooks,
    },
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      promise,
      react,
      "@stylistic": stylistic,
      "@typescript-eslint": tseslint.plugin,
    },

    settings: {
      "import-x/extensions": allExtensions,
      "import-x/external-module-folders": ["node_modules", "node_modules/@types"],
      "import-x/parsers": {
        "@typescript-eslint/parser": typeScriptExtensions,
      },
      "import-x/resolver": {
        node: {
          extensions: allExtensions,
          paths: ["node_modules", "src"],
        },
      },

      polyfills: [
        "Object.hasOwn",
        "structuredClone"
      ],

      react: {
        pragma: "React",
        version: "detect",
      },
    },

    languageOptions: {
      globals: globals.browser,

      parser: tseslint.parser,
      ecmaVersion: 5,
      sourceType: "module",

      parserOptions: {
        project: true,

        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    rules: {
      "array-callback-return": "error",
      "capitalized-comments": "off",
      "no-empty": "off",
      "no-eval": "error",
      "no-irregular-whitespace": "error",
      "no-regex-spaces": "error",
      "prefer-const": [
        "error",
        {
          destructuring: "all",
        },
      ],
      radix: "error",
      "unicode-bom": ["error", "never"],

      "import-x/named": "off",
      "import-x/namespace": "off",
      "import-x/no-useless-path-segments": "error",

      "jsdoc/check-param-names": [
        "error",
        {
          "disableMissingParamChecks": true,
        }
      ],
      "jsdoc/check-tag-names": [
        "error",
        {
          "definedTags": ["usesuper"],
        }
      ],
      "jsdoc/lines-before-block": "off",

      "promise/always-return": "off",
      "promise/catch-or-return": "off",
      "promise/no-return-in-finally": "error",

      "react/display-name": "off",
      "react/no-unused-state": "error",
      "react/jsx-fragments": ["error", "syntax"],
      "react/jsx-no-useless-fragment": [
        "error",
        {
          allowExpressions: true,
        },
      ],
      "react/prop-types": "off",

      /** stylistic */
      "@stylistic/array-bracket-newline": "error",
      "@stylistic/array-bracket-spacing": "error",
      "@stylistic/array-element-newline": ["error", "consistent"],
      "@stylistic/arrow-parens": "off",
      "@stylistic/arrow-spacing": "error",
      "@stylistic/block-spacing": "error",
      "@stylistic/brace-style": [
        "error",
        "1tbs",
        {
          allowSingleLine: true,
        },
      ],
      "@stylistic/comma-dangle": "off",
      "@stylistic/comma-spacing": ["error"],
      "@stylistic/computed-property-spacing": "error",
      "@stylistic/dot-location": ["error", "property"],
      "@stylistic/eol-last": "error",
      "@stylistic/func-call-spacing": "error",
      "@stylistic/function-paren-newline": "error",
      "@stylistic/generator-star-spacing": "error",
      "@stylistic/implicit-arrow-linebreak": "error",
      "@stylistic/indent": [
        "error",
        2,
        {
          ignoredNodes: [
            "TSTypeParameterInstantiation",
            "TSIntersectionType",
            "TSUnionType",
          ],
          SwitchCase: 1,
        },
      ],
      "@stylistic/jsx-child-element-spacing": "error",
      "@stylistic/jsx-closing-bracket-location": ["error", "line-aligned"],
      "@stylistic/jsx-closing-tag-location": "error",
      "@stylistic/jsx-curly-spacing": "error",
      "@stylistic/jsx-equals-spacing": "error",
      "@stylistic/jsx-first-prop-new-line": "error",
      "@stylistic/jsx-indent": ["error", 2],
      "@stylistic/jsx-indent-props": ["error", 2],
      "@stylistic/jsx-max-props-per-line": [
        "error",
        {
          when: "multiline",
        },
      ],
      "@stylistic/jsx-one-expression-per-line": [
        "error",
        {
          allow: "single-child",
        },
      ],
      "@stylistic/jsx-quotes": ["error", "prefer-single"],
      "@stylistic/jsx-tag-spacing": [
        "error",
        {
          beforeSelfClosing: "always",
          beforeClosing: "never",
        },
      ],
      "@stylistic/jsx-wrap-multilines": "error",
      "@stylistic/key-spacing": "error",
      "@stylistic/keyword-spacing": [
        "error",
        {
          before: true,
          after: true,
        },
      ],
      "@stylistic/line-comment-position": "off",
      "@stylistic/linebreak-style": ["error", "windows"],
      "@stylistic/lines-between-class-members": "off",
      "@stylistic/max-len": [
        "error",
        {
          code: 120,
        },
      ],
      "@stylistic/member-delimiter-style": [
        "error",
        {
          multiline: {
            delimiter: "semi",
            requireLast: true,
          },

          singleline: {
            delimiter: "semi",
            requireLast: false,
          },
        },
      ],
      "@stylistic/multiline-ternary": ["error", "always-multiline"],
      "@stylistic/newline-per-chained-call": [
        "error",
        {
          ignoreChainWithDepth: 4,
        },
      ],
      "@stylistic/no-extra-semi": "error",
      "@stylistic/no-mixed-operators": "off",
      "@stylistic/no-mixed-spaces-and-tabs": "error",
      "@stylistic/no-multi-spaces": "error",
      "@stylistic/no-multiple-empty-lines": [
        "error",
        {
          max: 1,
          maxBOF: 0,
          maxEOF: 0,
        },
      ],
      "@stylistic/no-tabs": "error",
      "@stylistic/no-trailing-spaces": "error",
      "@stylistic/no-whitespace-before-property": "error",
      "@stylistic/nonblock-statement-body-position": ["error", "below"],
      "@stylistic/object-curly-newline": "error",
      "@stylistic/object-curly-spacing": ["error", "always"],
      "@stylistic/object-property-newline": [
        "error",
        {
          allowAllPropertiesOnSameLine: true,
        },
      ],
      "@stylistic/one-var-declaration-per-line": "error",
      "@stylistic/operator-linebreak": "error",
      "@stylistic/padded-blocks": ["error", "never"],
      "@stylistic/quotes": ["error", "single"],
      "@stylistic/rest-spread-spacing": "error",
      "@stylistic/semi": ["error", "always"],
      "@stylistic/semi-spacing": "error",
      "@stylistic/semi-style": "error",
      "@stylistic/space-before-blocks": "error",
      "@stylistic/space-before-function-paren": [
        "error",
        {
          anonymous: "always",
          named: "never",
          asyncArrow: "always",
        },
      ],
      "@stylistic/space-in-parens": "error",
      "@stylistic/space-infix-ops": "error",
      "@stylistic/space-unary-ops": "error",
      "@stylistic/spaced-comment": [
        "error",
        "always",
        {
          markers: ["/"],
        },
      ],
      "@stylistic/switch-colon-spacing": "error",
      "@stylistic/template-curly-spacing": "error",
      "@stylistic/template-tag-spacing": "error",
      "@stylistic/type-annotation-spacing": "error",
      /** stylistic */

      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/ban-tslint-comment": "error",
      "@typescript-eslint/explicit-member-accessibility": [
        "error",
        {
          accessibility: "no-public",
        },
      ],
      "@typescript-eslint/naming-convention": "warn",
      "@typescript-eslint/no-array-delete": "error",
      "@typescript-eslint/no-confusing-non-null-assertion": "error",
      "@typescript-eslint/no-empty-function": "off",

      "@typescript-eslint/no-empty-object-type": [
        "error",
        {
          allowInterfaces: "with-single-extends",
          allowObjectTypes: "always",
        },
      ],
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-extra-non-null-assertion": "error",
      "@typescript-eslint/no-non-null-asserted-nullish-coalescing": "error",
      "@typescript-eslint/no-non-null-asserted-optional-chain": "error",
      "@typescript-eslint/no-require-imports": "error",
      "@typescript-eslint/no-unsafe-function-type": "error",
      "@typescript-eslint/no-unnecessary-parameter-property-assignment": "error",
      "@typescript-eslint/no-unnecessary-type-assertion": "error",
      "@typescript-eslint/no-unused-expressions": "off",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-use-before-define": "warn",
      "no-useless-constructor": "off",
      "@typescript-eslint/no-useless-constructor": "error",
      "@typescript-eslint/no-wrapper-object-types": "error",
      "no-throw-literal": "off",
      "@typescript-eslint/only-throw-error": "error",
      "@typescript-eslint/prefer-find": "error",
      "prefer-promise-reject-errors": "off",
      "@typescript-eslint/prefer-promise-reject-errors": [
        "error",
        {
          allowEmptyReject: true,
        },
      ],
      "@typescript-eslint/prefer-string-starts-ends-with": [
        "error",
        {
          allowSingleElementEquality: "always",
        },
      ],
      "@typescript-eslint/require-array-sort-compare": [
        "error",
        {
          ignoreStringArrays: true,
        },
      ],
      "require-await": "off",
      "@typescript-eslint/require-await": "warn",
      "no-return-await": "off",
      "@typescript-eslint/return-await": "error",
      "@typescript-eslint/typedef": [
        "error",
        {
          arrowParameter: false,
          parameter: false,
          memberVariableDeclaration: false,
        },
      ],
    }
  }
);
