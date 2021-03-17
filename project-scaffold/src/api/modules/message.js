// message 模块相关接口
export default {
  unread: {
    url: '/message/unread',
    method: 'post',
    description: '获取未读消息',
    data: {
      token: ''
    }
  },
  allread: {
    url: '/message/read/all',
    method: 'post',
    description: '全部已读消息',
    data: {
      token: ''
    }
  }
}
