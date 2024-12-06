const globby = require('globby')

const globFiles = pattern =>
  globby.sync(pattern, {gitignore: true, ignore: ['**/node_modules/**']})
const projectFiles = globFiles(['**/tsconfig.json', '**/jsconfig.json'])

module.exports = {
  root: true,
  // parse proposal features like class fields
  parser: '@babel/eslint-parser',

  // https://eslint.org/docs/user-guide/configuring#specifying-parser-options
  parserOptions: {
    ecmaVersion: latest,
    sourceType: 'module',
    ecmaFeatures: {
      // Supports JSX syntax (not the same as supporting React).
      jsx: true,
    },
    requireConfigFile: false,
    babelOptions: {
      presets: ['@babel/preset-react'],
      plugins: ['@babel/plugin-proposal-class-properties'],
    },
    project: ['./tsconfig.json'],
  },

  // commonly used envs
  env: {
    browser: true,
    node: true,
    es6: true,
    jest: true,
  },

  // we use recommended configurations
  extends: [
    // https://eslint.org/docs/rules/
    'eslint:recommended',
    // https://github.com/yannickcr/eslint-plugin-react
    'plugin:react/recommended',
    // https://github.com/benmosher/eslint-plugin-import
    'plugin:import/recommended',
    // https://www.npmjs.com/package/eslint-plugin-jsx-a11y
    'plugin:jsx-a11y/recommended',
    // https://github.com/prettier/eslint-config-prettier
    // https://github.com/prettier/eslint-plugin-prettier
    'plugin:prettier/recommended',
  ],

  plugins: [
    'react',
    'react-hooks',
    'jsx-a11y',
    'es',
    'lodash',
    'eslint-plugin-import-helpers',
    '@typescript-eslint',
    'prettier',
  ],

  rules: {
    // disable nice-to-have rules for migrate convenience
    'react/prop-types': 'off',
    'react/no-find-dom-node': 'off',
    'react/display-name': 'off',

    // recommended rules
    'prefer-const': 'error',
    'no-var': 'error',
    'no-console': 'error',
    'no-use-before-define': ['error', 'nofunc'],

    // 目前正则表达式的 lookbehind 语法无法做 polyfill，且 safari 浏览器目前全版本不支持。为了避免引起故障，所以禁用掉
    'es/no-regexp-lookbehind-assertions': 'error',

    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error',

    // https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html#eslint
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',

    // http://wiki.in.zhihu.com/pages/viewpage.action?pageId=129349243
    'max-lines': ['error', {max: 500}],
    'max-lines-per-function': ['error', {max: 200}],

    // https://github.com/wix/eslint-plugin-lodash/blob/master/docs/rules/import-scope.md
    'lodash/import-scope': ['error', 'method'],
  },

  settings: {
    // https://github.com/yannickcr/eslint-plugin-react#configuration
    react: {
      version: '18',
    },

    'import/resolver': {
      // https://www.npmjs.com/package/eslint-import-resolver-typescript
      typescript: {
        alwaysTryTypes: true,
        // 此 resolver 没有做 gitignore 过滤，会查找所有文件目录
        project: projectFiles,
      },
    },
  },

  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      parserOptions: {
        project: projectFiles.filter(x => x.endsWith('tsconfig.json')),
      },
      extends: [
        // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/README.md#supported-rules
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:prettier/recommended',
      ],
      rules: {
        'prettier/prettier': 'error',
        // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-use-before-define.md#how-to-use
        'no-use-before-define': 'off',
        '@typescript-eslint/no-use-before-define': ['error', 'nofunc'],
        'no-unused-vars': 'on',
        '@typescript-eslint/no-unused-vars': [
          'warn',
          {vars: 'all', args: 'after-used', ignoreRestSiblings: true},
        ],
        // 已有返回值推断不再显式申明
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        // 不要求用 RegExp#exec 替换 String#match
        '@typescript-eslint/prefer-regexp-exec': 'off',
      },
    },
  ],
}
