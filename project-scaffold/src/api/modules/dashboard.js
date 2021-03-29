// dashboard 模块相关接口
export default {
  todayVisits: {
    url: '/dashboard/todayVisits',
    method: 'get',
    description: '获取今日访问量',
    data: {}
  },
  todayProfit: {
    url: '/dashboard/todayProfit',
    method: 'get',
    description: '获取今日收益',
    data: {}
  },
  resourceRanking: {
    url: '/dashboard/resourceRanking',
    method: 'get',
    description: '获取资源排行',
    data: {}
  },
  downloadRanking: {
    url: '/dashboard/downloadRanking',
    method: 'get',
    description: '获取资源下载排行',
    data: {}
  },
  resourceTypeRatio: {
    url: '/dashboard/resourceTypeRatio',
    method: 'get',
    description: '获取资源类型占比',
    data: {}
  },
  totalStatistic: {
    url: '/dashboard/totalStatistic',
    method: 'get',
    description: '获取总数统计数据',
    data: {}
  },
  typeStastics: {
    url: '/dashboard/typeStastics',
    method: 'get',
    description: '获取资源类型统计数据',
    data: {}
  },
  downloadTrend: {
    url: '/dashboard/downloadTrend',
    method: 'get',
    description: '获取下载趋势统计',
    data: {}
  },
  userBehavior: {
    url: '/dashboard/userBehavior',
    method: 'get',
    description: '获取用户行为趋势',
    data: {}
  }
}
