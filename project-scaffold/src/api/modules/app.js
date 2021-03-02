// app 模块相关接口
export default {
  getUserInfo: {
    url: '/api/user/get',
    method: 'get',
    description: '获取用户信息',
    data: {
      id: ''
    }
  },
  updateUserInfo: {
    url: '/api/user/:id',
    method: 'get',
    description: '更新用户信息',
    data: {
      id: '',
      name: '',
      phone: '',
      email: ''
    }
  }
}
