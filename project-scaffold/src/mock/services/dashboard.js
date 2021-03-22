import Mock from 'mockjs2'
import { builder } from '../utils'
import { dateFormat, subDate } from '@/utils/date-formatter'

const _getPrevWeek = () => {
  const now = new Date()
  const week = []
  for (let i = 7; i > 0; i--) {
    week.unshift(dateFormat(subDate(now, `${7 - i}d`), 'MM-dd'))
  }
  return week
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

// 获取资源排行
const _getResourceRanking = () => {
  const data = Mock.mock({
    'value|4': [
      {
        'id|+1': 1,
        name: '@word',
        'profit|100-9999': 1,
        'ratio|0-0.1-6': 1
      }
    ]
  })
  return builder({ code: '0', data: data.value }, 'success', 200)
}

export default {
  'post /dashboard/todayVisits': _getTodayVisits,
  'post /dashboard/todayProfit': _getTodayProfit,
  'post /dashboard/resourceRanking': _getResourceRanking
}
