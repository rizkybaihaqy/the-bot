module.exports = {
  parser: '@babel/eslint-parser',
  plugins: ['functional', 'jest'],
  env: {
    'es6': true,
    'node': true,
    'jest/globals': true,
  },
  extends: [
    'plugin:functional/external-recommended',
    'plugin:functional/recommended',
    'plugin:functional/stylistic',
    './node_modules/sanctuary-style/eslint-es6.json',
  ],
  overrides: [
    {
      files: ['src/**/*.js'],
      extends: ['plugin:jest/recommended', 'plugin:jest/style'],
      rules: {
        "functional/no-expression-statement": ['off'],
        "functional/functional-parameter": ['off']
      }
    },
  ],
  rules: {
    semi: ['error', 'never'],
  },
}
