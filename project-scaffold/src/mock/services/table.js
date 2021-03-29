import Mock from 'mockjs2'
import { builder, getBody } from '../utils'
import { RESOURCE_CLASS } from './public'

export const labels = [
  'Vuex', 'Redux', 'Vue-cli3', 'Webpack',
  'Nodejs', 'Rect', 'Angular', 'Vue-router', 'Axios',
  'Fetch', 'Vue', 'HTML', 'HTML5', 'javascript', 'Java',
  'C#', 'C++', 'Paython', '人工智能', 'MySQL', '大数据',
  '网络安全', '机器学校', 'C'
]
const downloadType = ['0', '1', '2']
const status = ['0', '1', '2', '3', '4']
const resourceClass = []

for (let i = 0; i < RESOURCE_CLASS.length; i++) {
  for (let j = 0; j < RESOURCE_CLASS[i].children.length; j++) {
    resourceClass.push(RESOURCE_CLASS[i].children[j].value)
  }
}

const BASIC_TABLE_DATA = Mock.mock({
  'data|50-100': [
    {
      'id|+1': 1,
      name: '@word',
      'label|1-5': labels,
      'classic|1': resourceClass,
      'downloadType|1': downloadType,
      description: '@sentence',
      datetime: '@datetime',
      'status|1': status
    }
  ]
}).data

const _getBasicTable = (options) => {
  const params = getBody(options)
  const page = parseInt(params.page, 10)
  const pageSize = parseInt(params.pageSize, 10)
  const list = BASIC_TABLE_DATA.filter(item => {
    if (!params.name && !params.year && !params.month) return true
    const date = new Date(item.datetime)
    return (params.name && item.name.indexOf(params.name) !== -1) ||
      (params.year && date.getFullYear() === parseInt(params.year)) ||
      (params.month && date.getMonth() === parseInt(params.month) - 1)
  })
  const star = (page - 1) * pageSize
  const data = {
    list: list.slice(star, star + pageSize),
    total: list.length
  }
  return builder({ code: '0', data: data }, 'success', 200)
}

const _getBasicTableStatus = () => {
  const data = [
    {
      type: '',
      num: BASIC_TABLE_DATA.length
    }
  ]

  status.forEach(type => {
    data.push({
      type,
      num: BASIC_TABLE_DATA.filter(item => item.status === type).length || 0
    })
  })

  return builder({ code: '0', data: data }, 'success', 200)
}

export default {
  'post /table/basic': _getBasicTable,
  'post /table/status': _getBasicTableStatus
}
