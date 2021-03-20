import Mock from 'mockjs2'

if (process.env.NODE_ENV === 'dev') {
  console.log('mock mounting...')
  let APIS = {}
  // 动态解析目录文件
  const modules = require.context('./services', false, /\.js$/)
  modules.keys().forEach(m => {
    // 只需要整合所以模块的mock接口，不需要模块名称
    const apis = modules(m).default
    APIS = {
      ...APIS,
      ...apis
    }
  })

  // console.log(APIS)

  const observer = function (apis) {
    if (!apis) return
    const BASE_URL = process.env.VUE_APP_API_URL
    for (const api of Object.keys(apis)) {
      const typeUrl = api.split(' ')
      const type = typeUrl[0]
      const url = typeUrl[1]
      console.log(new RegExp(`${BASE_URL}${url}`))
      Mock.mock(new RegExp(`${url}`), type, apis[api])
    }
  }

  // 拦截api
  observer(APIS)

  Mock.setup({
    timeout: 1000
  })
  console.log('mock mounted...')
}
