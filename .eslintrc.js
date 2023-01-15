module.exports = {
  parser: '@babel/eslint-parser',
  env: {
    es6: true,
    node: true,
  },
  plugins: ['functional'],
  extends: [
    'plugin:functional/external-recommended',
    'plugin:functional/recommended',
    'plugin:functional/stylistic',
    './node_modules/sanctuary-style/eslint-es6.json',
  ],
  rules: {
    semi: ['error', 'never'],
  },
}
