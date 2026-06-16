import js from "@eslint/js";

export default [
    js.configs.recommended,
    {
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "module",
            globals: {
                document: "readonly",
                window: "readonly",
                console: "readonly",
                setTimeout: "readonly",
                requestAnimationFrame: "readonly",
                cancelAnimationFrame: "readonly",
                IntersectionObserver: "readonly",
                Math: "readonly",
                localStorage: "readonly",
                HTMLElement: "readonly"
            }
        },
        rules: {
            "no-unused-vars": "warn",
            "no-undef": "warn",
            "semi": ["error", "always"],
            "quotes": ["error", "single"]
        }
    }
];
