/**
 * vue/cli3 配置
 * 自定义 Webpack 配置
 */
const path = require('path')
function resolve(dir) {
 return path.join(__dirname, '.', dir)
}

const config = require('./build')

module.exports = {
  ...config[process.env.NODE_ENV],

  chainWebpack: config => {
    // svg loader
    config.module
      .rule('svg')
      .exclude
        .add(resolve('src/icons'))
        .end()
      // .uses.clear()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include
        .add(resolve('src/icons'))
        .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
  },

  configureWebpack: {}
}
