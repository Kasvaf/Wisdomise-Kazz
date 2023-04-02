// eslint-disable-next-line no-undef
module.exports = {
  settings: {
    react: { version: "detect" },
  },
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:@typescript-eslint/recommended",
    "plugin:jsx-a11y/recommended",
    // "plugin:prettier/recommended",
    // "plugin:tailwindcss/recommended",
  ],
  overrides: [],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react", "react-hooks", "@typescript-eslint", "simple-import-sort"],
  rules: {
    "jsx-a11y/no-static-element-interactions": "off",
    "jsx-a11y/click-events-have-key-events": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "jsx-a11y/no-noninteractive-element-interactions": "off",

    // "tailwindcss/no-custom-classname": [
    //   "error",
    //   {
    //     config: "./tailwind.config.cjs",
    //   },
    // ],
  },
};
