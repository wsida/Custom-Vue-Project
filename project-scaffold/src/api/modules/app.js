// app 模块相关接口
export default {
  getUserInfo: {
    url: '/user/info',
    method: 'get',
    description: '获取用户信息',
    data: {
      id: ''
    }
  },
  updateUserInfo: {
    url: '/user/login',
    method: 'post',
    description: '登录',
    data: {
      username: '',
      password: ''
    }
  }
}
