module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react/jsx-runtime",
    ],
    overrides: [],
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
    },
    plugins: ["react"],
    rules: {
        "@typescript-eslint/no-var-requires": 0,
        "react/jsx-uses-react": "off", // 关闭旧模式校验
        "react/react-in-jsx-scope": "off", // 关闭旧模式校验
        "@typescript-eslint/no-explicit-any": 0,
    },
    settings: {
        react: {
            version: "detect",
        },
    },
};
