import nextVitals from 'eslint-config-next/core-web-vitals';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from "typescript-eslint";

const eslintConfig = defineConfig([
  ...nextVitals,
  {
    files: ["**/*.ts", "**/*.tsx"],
    ...tseslint.configs.recommended[0],
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    ...tseslint.configs.recommendedTypeChecked[0],
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    ...tseslint.configs.stylisticTypeChecked[0],
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
    rules: {
      "@typescript-eslint/array-type": "off",
      "@typescript-eslint/consistent-type-definitions": "off",
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/require-await": "off",
      "@typescript-eslint/no-misused-promises": [
        "error",
        { checksVoidReturn: { attributes: false } },
      ],
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
  },
  // Additional React rules configuration
  // Note: eslint-plugin-react is already included in next/core-web-vitals
  {
    files: ["**/*.tsx", "**/*.jsx"],
    settings: {
      react: {
        version: "detect", // Automatically detect React version
      },
    },
    rules: {
      // React rules are already enabled by next/core-web-vitals
      // Add any custom overrides here if needed
      "react/jsx-key": "error",
      // Allow unescaped entities for better readability in JSX text content
      // Common entities like apostrophes, quotes, and greater/less than symbols are acceptable
      "react/no-unescaped-entities": "off",
    },
  },
  // Override default ignores of eslint-config-next
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'e2e/**',
  ]),
]);

export default eslintConfig;
