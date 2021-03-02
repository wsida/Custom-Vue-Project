/**
 * 本地环境 Webpack 配置
 */
module.exports = {
  publicPath: '/',
  // publicPath: '/dev',
  // 代理
  devServer: {
    port: 9000,
    host: 'localhost',
    https: false,
    open: true, // 运行自动开启
    /* proxy: {
      '/api': {
        target: process.env.VUE_APP_API_URL,
        ws: false,
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    } */
  }
}