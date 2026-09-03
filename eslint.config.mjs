import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import stencil from "@stencil-community/eslint-plugin";
import prettier from "eslint-config-prettier";

export default tseslint.config(
  {
    ignores: [
      "dist/",
      "www/",
      "loader/",
      "node_modules/",
      // Storybook is a separate npm project with its own toolchain.
      "storybook/",
      "src/interfaces/generated.ts",
      "src/components.d.ts",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["src/**/*.{ts,tsx}"],
    extends: [stencil.configs.flat.recommended],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      // Type-aware, and the only rule here that would need a TypeScript
      // program — which in turn needs the generated interfaces to exist.
      "@stencil-community/strict-boolean-conditions": "off",
      // JSDoc on every public member is more than this codebase documents by
      // convention: props are documented where the behaviour is non-obvious.
      "@stencil-community/required-jsdoc": "off",
      // Inline arrow handlers are the idiom throughout the components.
      "react/jsx-no-bind": "off",
      // Prettier preserves whichever line break the author wrote after a
      // decorator, so neither style is enforceable without a repo-wide rewrite.
      "@stencil-community/decorators-style": "off",
    },
  },
  {
    files: ["src/**/*.{ts,tsx}", "scripts/**/*.js"],
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          // `h` is the JSX pragma — imported for the compiler, never called.
          varsIgnorePattern: "^h$",
          argsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      // `condition && doThing()` is used throughout in place of an if.
      "@typescript-eslint/no-unused-expressions": [
        "error",
        { allowShortCircuit: true, allowTernary: true },
      ],
      // A warning, not an error: the `any`s left in the tree are visible debt,
      // held at their current count by `--max-warnings`.
      "@typescript-eslint/no-explicit-any": "warn",
      // Translations carry non-breaking spaces on purpose.
      "no-irregular-whitespace": [
        "error",
        { skipStrings: true, skipTemplates: true },
      ],
    },
  },
  {
    files: ["scripts/**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: globals.node,
    },
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  {
    files: ["**/*.test.{ts,tsx}", "**/*.spec.{ts,tsx}"],
    languageOptions: {
      globals: { ...globals.jest, ...globals.node },
    },
  },
  prettier,
);
