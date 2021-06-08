module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    // 在生产模式下不可以出现 console.xxx代码
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    // 在生产模式下不可以出现 定义变量不使用
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
  }
}
