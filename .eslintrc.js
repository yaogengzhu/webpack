module.exports = {
  parser: '@babel/eslint-parser',
  extends: 'airbnb',
  env: {
    browser: true,
    node: true,
  }, // 生效环境
  rules: {
    'import/no-extraneous-dependencies': [false, { packageDir: ['./webpack.prod.js'] }],
  }, // 针对规则进行修改
};
