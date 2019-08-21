module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard',
    '@vue/typescript'
  ],
  rules: {
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-new-func': 'off',
    'no-use-before-define': 'off',
    'no-console': 'off'
  },
  parserOptions: {
    parser: '@typescript-eslint/parser'
  }
}
