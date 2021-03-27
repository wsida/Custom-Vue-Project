// dashboard 模块相关接口
export default {
  todayVisits: {
    url: '/dashboard/todayVisits',
    method: 'post',
    description: '获取今日访问量',
    data: {
      token: ''
    }
  },
  todayProfit: {
    url: '/dashboard/todayProfit',
    method: 'post',
    description: '获取今日收益',
    data: {
      token: ''
    }
  },
  resourceRanking: {
    url: '/dashboard/resourceRanking',
    method: 'post',
    description: '获取资源排行',
    data: {
      token: ''
    }
  },
  downloadRanking: {
    url: '/dashboard/downloadRanking',
    method: 'post',
    description: '获取资源下载排行',
    data: {
      token: ''
    }
  },
  resourceTypeRatio: {
    url: '/dashboard/resourceTypeRatio',
    method: 'post',
    description: '获取资源类型占比',
    data: {
      token: ''
    }
  }
}
