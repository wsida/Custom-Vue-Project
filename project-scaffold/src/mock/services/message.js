
import Mock from 'mockjs2'
import { builder, getBody } from '../utils'

let isAllRead = false

const _getUnreadMessage = (options) => {
  const body = getBody(options)
  console.log(body.token)
  const list = Mock.mock({
    'data|1-5': [
      {
        id: '@tid',
        title: '@title',
        content: '@paragraph',
        time: '@datetime',
        status: '0' // 0-未读 1-已读
      }
    ]
  })
  return builder({ code: '0', data: !isAllRead ? list.data : [] }, 'success', 200)
}

const _setAllread = (options) => {
  const body = getBody(options)
  console.log(body.token)
  isAllRead = true
  return builder({ code: '0', data: {} }, 'success', 200)
}

export default {
  'post /message/unread': _getUnreadMessage,
  'post /message/read/all': _setAllread
}
