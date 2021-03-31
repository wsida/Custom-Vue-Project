/**
 * 基础公共配置
 */
module.exports = {
  lintOnSave: process.env.NODE_ENV !== 'prd',
  publicPath: '/',
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  }
}
