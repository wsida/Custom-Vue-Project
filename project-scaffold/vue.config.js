/**
 * vue/cli3 配置
 * 自定义 Webpack 配置
 */
const config = require('./build')
module.exports = {
  lintOnSave: process.env.NODE_ENV !== 'prd',
  ...config[process.env.NODE_ENV]
}