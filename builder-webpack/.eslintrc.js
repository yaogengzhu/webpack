module.exports = {
  parser: '@babel/eslint-parser',
  parserOptions: {
    requireConfigFile: false,
    sourceType: 'module',
    allowImportExportEverywhere: false,
    ecmaFeatures: {
      // globalReturn: false,
    },
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: ['airbnb-base'],
  rules: {
    // indent: ['error', 4],
  }, // 针对规则进行修改
};
