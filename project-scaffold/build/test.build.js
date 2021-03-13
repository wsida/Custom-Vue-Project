/**
 * 测试环境 Webpack 配置
 */
const basicConfig = require('./basic.build')

module.exports = {
  ...basicConfig,
  assetsDir: 'assets',
  filenameHashing: true
}