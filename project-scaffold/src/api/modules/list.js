// 列表相关
export default {
  getBasicList: {
    url: '/list/basic',
    method: 'post',
    description: '获取基本列表数据',
    data: {
      token: '',
      page: 1,
      pageSize: 10,
      type: 'upload',
      status: '',
      keyword: ''
    }
  },
  getBasicListStatus: {
    url: '/list/status',
    method: 'post',
    description: '获取基本列表数据状态统计',
    data: {
      token: '',
      type: 'upload'
    }
  },
  getInfiniteScrollList: {
    url: '/list/infinite-scroll',
    method: 'post',
    description: '获取无限滚动列表数据',
    data: {
      token: '',
      page: 1,
      pageSize: 10,
      keyword: ''
    }
  }
}
