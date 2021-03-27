import Mock from 'mockjs2'
import { builder, getBody } from '../utils'

const INFINITE_SCROLL_LIST = Mock.mock({
  'data|80-200': [
    {
      'id|+1': 1,
      title: '@title',
      href: '@href',
      description: '@sentence',
      'fileType|1': ['pdf', 'image', 'markdown', 'ppt', 'text', 'word', 'unknown', 'zip'],
      'status|1': ['0', '2', '3', '4'],
      'tags|1-3': ['@word'],
      author: '@name',
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
      author: '@name',
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
      author: '@name',
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

const COLLECTION_BASIC_LIST = Mock.mock({
  'data|6-20': [
    {
      'id|+1': 1,
      title: '@title',
      href: '@href',
      description: '@sentence',
      'fileType|1': ['pdf', 'image', 'markdown', 'ppt', 'text', 'word', 'unknown', 'zip'],
      'status|1': ['1'],
      'tags|1-3': ['@word'],
      author: '@name',
      class: '@word',
      datetime: '@datetime',
      'like|0-999': 1,
      'collect|0-999': 1,
      'comment|0-999': 1,
      'selfLike|1': true,
      selfCollect: true
    }
  ]
}).data

// 获取状态统计
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
  } else if (params.type === 'download') {
    data[0].num = DOWNLOAD_BASIC_LIST.length
    return builder({ code: '0', data: data }, 'success', 200)
  } else {
    data[0].num = COLLECTION_BASIC_LIST.length
    return builder({ code: '0', data: data }, 'success', 200)
  }
}

// 获取列表数据
const _getBasicList = (options) => {
  const params = getBody(options)
  // console.log(params)
  let list = []
  if (params.type === 'upload') {
    list = UPLOAD_BASIC_LIST.filter(item => !params.status || item.status === params.status)
  } else if (params.type === 'download') {
    list = DOWNLOAD_BASIC_LIST.filter(item => !params.status || item.status === params.status)
  } else if (params.type === 'collection') {
    list = COLLECTION_BASIC_LIST.filter(item => !params.status || item.status === params.status)
  }
  if (params.keyword) {
    list = list.filter(item => (item.title && item.title.indexOf(params.keyword) !== -1) || (item.author && item.author.indexOf(params.keyword) !== -1) || (item.tags && item.tags.filter(tag => tag.indexOf(params.keyword) !== -1).length > 0))
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

// 获取无限滚动数据
const __getInfiniteScrollList = (options) => {
  const params = getBody(options)
  // console.log(params)
  let list = []
  if (params.keyword) {
    list = INFINITE_SCROLL_LIST.filter(item => (item.title && item.title.indexOf(params.keyword) !== -1) || (item.author && item.author.indexOf(params.keyword) !== -1) || (item.tags && item.tags.filter(tag => tag.indexOf(params.keyword) !== -1).length > 0))
  } else {
    list = INFINITE_SCROLL_LIST
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

// 获取无限滚动数据统计
const __getInfiniteScrollListStatus = () => {
  const data = [
    {
      type: '',
      num: 0
    }
  ]
  const options = ['0', '2', '3', '4']
  data[0].num = INFINITE_SCROLL_LIST.length
  options.forEach(option => {
    data.push({
      type: option,
      num: INFINITE_SCROLL_LIST.filter(item => option === item.status).length || 0
    })
  })
  return builder({ code: '0', data: data }, 'success', 200)
}

export default {
  'post /list/status': _getBasicListStatus,
  'post /list/basic': _getBasicList,
  'post /list/infinite-scroll': __getInfiniteScrollList,
  'post /list/infinite-status': __getInfiniteScrollListStatus
}
