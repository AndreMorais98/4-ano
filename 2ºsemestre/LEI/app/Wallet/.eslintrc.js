// This is your .eslintrc.js file
module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["plugin:react/recommended", "airbnb", "prettier"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["react", "prettier"],
  rules: {
    "prefer-destructuring": "off",
    "react/prop-types": "off",
    "react/jsx-filename-extension": [1, { extensions: [".js", ".jsx"] }],
  },
};
