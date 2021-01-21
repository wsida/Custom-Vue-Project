import Mock from 'mockjs2'
import user from './services/user'

if (process.env.NODE_ENV === 'dev') {
  console.log('mock mounting...')
  const APIS = {
    ...user
  }

  console.log(APIS)

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
