// TODO 解析services目录文件-获取api接口配置信息-提供全局$api方法调用接口
import axios from '@/plugins/axios'
const $api = {}

const isObject = function (data) {
  return Object.prototype.toString.call(data).toLowerCase() === '[object object]'
}
// 解析过程
// require.context(directory, useSubdirectories = false, regExp = /^.//);
// 参数： 1. 读取文件的路径 2. 是否遍历文件的子目录 3. 匹配文件的正则表达式
const modules = require.context('./modules', false, /\.js$/)
modules.keys().forEach(m => {
  const apis = modules(m).default
  const matchKey = m.match(/\.\/(.*)(\.js)/)
  const moduleName = matchKey[1]
  if (moduleName) {
    // 解析接口配置
    Object.keys(apis).forEach(key => {
      if (apis[key].url) {
        $api[`${moduleName}/${key}`] = function (data, config) {
          // 过滤参数-整合接口参数
          const _data = {} // 接口调用参数列表
          if (isObject(data)) {
            const _keys = Object.keys(data || {})
            const _defaultData = Object.assign({}, isObject(apis[key].data) ? apis[key].data : {})
            Object.keys(_defaultData).forEach(dk => {
              if (_keys.indexOf(dk) !== -1) {
                _data[dk] = data[dk] || _defaultData[dk] || undefined
              }
            })
          }
          // 替换 url :key
          const _url = apis[key].url.replace(/\/:([^/:]*)/g, function (reg, key, ind) {
            // 副作用 - 删除参数列表相应数据
            const val = _data[key] || ''
            delete _data[key]
            return val ? `/${val}` : ''
          })
          // 发起请求
          const _config = {
            url: _url,
            method: apis[key].method || 'get'
          }
          if (_config.method.toLowerCase() === 'get') {
            _config.params = _data
          } else {
            _config.data = _data
          }
          return axios({
            ..._config,
            ...config || {}
          })
        }
      }
    })
  }
})

// Vue.prototype.$api = $api
export default $api
