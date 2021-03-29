import Mock from 'mockjs2'
import { builder } from '../utils'
import { dateFormat, subDate } from '@/utils/date-formatter'
import { labels } from './table'

const _getPrevWeek = () => {
  const now = new Date()
  const week = [dateFormat(now, 'MM-dd')]
  for (let i = 1; i <= 6; i++) {
    week.unshift(dateFormat(subDate(now, `${i}d`), 'MM-dd'))
  }
  return week
}

const _getPrev30Days = () => {
  const now = new Date()
  const days = [dateFormat(now, 'MM-dd')]
  for (let i = 1; i <= 29; i++) {
    days.unshift(dateFormat(subDate(now, `${i}d`), 'MM-dd'))
  }
  return days
}

// 获取今日访问量
const _getTodayVisits = () => {
  const week = _getPrevWeek()
  const charts = [
    {
      name: '近七天访问量',
      data: week.map(date => ({
        name: date,
        value: parseInt(Math.random() * 9999, 10) + 1
      }))
    }
  ]
  const data = {
    charts,
    today: parseInt(Math.random() * 9999, 10) + 1
  }
  return builder({ code: '0', data: data }, 'success', 200)
}

// 获取今日收益
const _getTodayProfit = () => {
  const week = _getPrevWeek()
  const charts = [
    {
      name: '今年',
      data: week.map(date => ({
        name: date,
        value: parseFloat((Math.random() * 9999).toFixed(1)) + 10
      }))
    }, {
      name: '去年',
      data: week.map(date => ({
        name: date,
        value: parseFloat((Math.random() * 9999).toFixed(1)) + 10
      }))
    }
  ]
  const data = {
    charts,
    today: parseFloat((Math.random() * 9999).toFixed(1)) + 10
  }
  return builder({ code: '0', data: data }, 'success', 200)
}

// 获取资源收益排行
const _getResourceRanking = () => {
  let data = Mock.mock({
    'data|4': [
      {
        'id|+1': 1,
        name: '@word',
        'profit|100-9999': 1
      }
    ]
  }).data.sort((a, b) => (b.profit - a.profit))
  const total = data.reduce((total, item) => (total += item.profit), 0) + parseInt(Math.random() * 400 + 100, 10)
  data = data.map(item => ({ ...item, ratio: item.profit / total }))
  return builder({ code: '0', data }, 'success', 200)
}

// 获取类型占比
const _getResourceTypeRatio = () => {
  const downloadType = ['0', '1', '2']
  const data = downloadType.map(type => ({ type, value: parseInt(Math.random() * 200 + 50, 10) }))
  return builder({ code: '0', data }, 'success', 200)
}

// 获取资源下载排行
const _getDownloadRanking = () => {
  const data = Mock.mock({
    'data|10': [
      {
        'id|+1': 1,
        name: '@word',
        'count|20-300': 1
      }
    ]
  }).data.sort((a, b) => (b.count - a.count))
  return builder({ code: '0', data }, 'success', 200)
}

const _getTotalStatistic = () => {
  const week = _getPrevWeek()
  const data = {
    totalResources: parseInt(Math.random() * 400 + 200, 10),
    // totalDownload: parseInt(Math.random() * 500 + 40, 10),
    // totalLikes: parseInt(Math.random() * 500 + 60, 10),
    // totalComments: parseInt(Math.random() * 500 + 50, 10),
    weekDownload: week.map(w => ({
      name: w,
      value: parseInt(Math.random() * 500 + 40, 10)
    })),
    weekLikes: week.map(w => ({
      name: w,
      value: parseInt(Math.random() * 500 + 60, 10)
    })),
    weekComments: week.map(w => ({
      name: w,
      value: parseInt(Math.random() * 500 + 50, 10)
    }))
  }
  return builder({ code: '0', data }, 'success', 200)
}

const _getTypeStastics = () => {
  const data = labels.map(label => ({
    name: label,
    value: parseInt(Math.random() * 100)
  }))
  return builder({ code: '0', data }, 'success', 200)
}

const _getDownloadTrend = () => {
  const data = _getPrev30Days().map(day => ({
    name: day,
    value: parseInt(Math.random() * 200, 10)
  }))
  return builder({ code: '0', data }, 'success', 200)
}

const _getUserBehavior = () => {
  const days = _getPrev30Days()
  const data = [
    {
      name: 'likes',
      data: []
    },
    {
      name: 'comments',
      data: []
    }
  ]
  days.forEach(day => {
    let likeUser = parseInt(Math.random() * 30, 10)
    let commentUser = parseInt(Math.random() * 20 + 5, 10)
    while (likeUser > 0) {
      data[0].data.push({
        name: day,
        value: parseInt(Math.random() * 300 + 10, 10)
      })
      likeUser--
    }

    while (commentUser > 0) {
      data[1].data.push({
        name: day,
        value: parseInt(Math.random() * 200, 10)
      })
      commentUser--
    }
  })
  return builder({ code: '0', data }, 'success', 200)
}

export default {
  'get /dashboard/todayVisits': _getTodayVisits,
  'get /dashboard/todayProfit': _getTodayProfit,
  'get /dashboard/resourceRanking': _getResourceRanking,
  'get /dashboard/resourceTypeRatio': _getResourceTypeRatio,
  'get /dashboard/downloadRanking': _getDownloadRanking,
  'get /dashboard/totalStatistic': _getTotalStatistic,
  'get /dashboard/typeStastics': _getTypeStastics,
  'get /dashboard/downloadTrend': _getDownloadTrend,
  'get /dashboard/userBehavior': _getUserBehavior
}
