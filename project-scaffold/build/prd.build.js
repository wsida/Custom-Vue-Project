/**
 * 生产环境 Webpack 配置
 */
const basicConfig = require('./basic.build')

module.exports = {
  ...basicConfig,
  assetsDir: 'assets'
  // 代理
  // devServer: {
  //   port: 9000,
  //   host: '',
  //   https: true
  // }
}