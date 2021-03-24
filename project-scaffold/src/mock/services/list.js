import Mock from 'mockjs2'
import { builder, getBody } from '../utils'

const UPLOAD_BASIC_LIST = Mock.mock({
  'data|20-99': [
    {
      'id|+1': 1,
      title: '@title',
      href: '@href',
      description: '@sentence',
      'fileType|1': ['pdf', 'image', 'markdown', 'ppt', 'text', 'word', 'unknown', 'zip'],
      'status|1': ['0', '1', '2', '3'],
      'tags|1-3': ['@word'],
      class: '@word',
      datetime: '@datetime',
      'like|0-999': 1,
      'collect|0-999': 1,
      'comment|0-999': 1,
      'selfLike|1': true,
      'selfCollect|1-9': true
    }
  ]
}).data

const DOWNLOAD_BASIC_LIST = Mock.mock({
  'data|6-20': [
    {
      'id|+1': 1,
      title: '@title',
      href: '@href',
      description: '@sentence',
      'fileType|1': ['pdf', 'image', 'markdown', 'ppt', 'text', 'word', 'unknown', 'zip'],
      'status|1': ['1'],
      'tags|1-3': ['@word'],
      class: '@word',
      datetime: '@datetime',
      'like|0-999': 1,
      'collect|0-999': 1,
      'comment|0-999': 1,
      'selfLike|1': true,
      'selfCollect|1-9': true
    }
  ]
}).data

const _getBasicListStatus = (options) => {
  const params = getBody(options)
  const data = [
    {
      type: '',
      num: 0
    }
  ]
  if (params.type === 'upload') {
    const options = ['0', '1', '2', '3']
    data[0].num = UPLOAD_BASIC_LIST.length
    options.forEach(option => {
      data.push({
        type: option,
        num: UPLOAD_BASIC_LIST.filter(item => option === item.status).length || 0
      })
    })
    return builder({ code: '0', data: data }, 'success', 200)
  }
  data[0].num = DOWNLOAD_BASIC_LIST.length
  return builder({ code: '0', data: data }, 'success', 200)
}

const _getBasicList = (options) => {
  const params = getBody(options)
  // console.log(params)
  let list = []
  if (params.type === 'upload') {
    list = UPLOAD_BASIC_LIST.filter(item => !params.status || item.status === params.status)
  } else if (params.type === 'download') {
    list = DOWNLOAD_BASIC_LIST.filter(item => !params.status || item.status === params.status)
  }
  const page = parseInt(params.page)
  const pageSize = parseInt(params.pageSize)
  const start = Math.max(0, (page - 1)) * pageSize
  const data = {
    list: list.slice(start, start + pageSize),
    total: list.length,
    page: page,
    pageSize: pageSize
  }
  // console.log(data)
  return builder({ code: '0', data: data }, 'success', 200)
}

export default {
  'post /list/status': _getBasicListStatus,
  'post /list/basic': _getBasicList
}
