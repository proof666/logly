// ESLint flat config for React + TypeScript + Hooks with Prettier
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import prettier from "eslint-config-prettier";

export default tseslint.config(
    { ignores: ["dist", "build", "node_modules", "coverage"] },
    {
        languageOptions: {
            ecmaVersion: 2024,
            sourceType: "module",
            globals: { ...globals.browser, ...globals.node },
        },
        settings: {
            react: { version: "detect" },
        },
        linterOptions: { reportUnusedDisableDirectives: true },
    },
    js.configs.recommended,
    // TypeScript rules (non type-checked for speed)
    ...tseslint.configs.recommended,
    // React + Hooks
    reactPlugin.configs.flat.recommended,
    reactHooks.configs["recommended-latest"],
    // Disable rules that conflict with Prettier
    prettier,
    // Project-specific rule tweaks
    {
        rules: {
            "react/react-in-jsx-scope": "off",
            "react/jsx-uses-react": "off",
        },
    },
);
