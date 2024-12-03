module.exports = {
  bracketSpacing: false,
  semi: false,
  singleQuote: true,
  trailingComma: 'es5',
  arrowParens: 'avoid',
  overrides: [
    // yarn berry 配置文件使用双引号
    {
      files: ['.yarnrc.yml'],
      options: {
        singleQuote: false,
      },
    },
  ],
  plugins: ['prettier-plugin-organize-imports'],
}