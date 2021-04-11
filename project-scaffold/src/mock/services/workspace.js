import Mock from 'mockjs2'
import { builder, getBody } from '../utils'
import Monent from 'moment'

const REMINDS = Mock.mock({
  'data|30-50': [{
    'id|+1': 1,
    title: '@sentence',
    date: function () {
      const types = ['d', 'h']
      const type = types[parseInt(Math.random() * 1, 10)]
      const opt = parseInt(Math.random() * 3, 10) > 1
      return opt
        ? new Monent().add(parseInt(Math.random() * 30, 10), type).format('YYYY-MM-DD hh:mm:ss')
        : new Monent().subtract(parseInt(Math.random() * 30, 10), type).format('YYYY-MM-DD HH:mm:ss')
    }
  }]
}).data.map(remind => ({
  ...remind,
  start: remind.date,
  end: new Monent(remind.date).add(parseInt(Math.random() * 2 + 1, 10), 'h').format('YYYY-MM-DD HH:mm:ss')
}))

const _getReminds = (options) => {
  const body = getBody(options)
  const reminds = REMINDS.filter(remind => {
    return remind.start.startsWith(body.date)
  })

  const timeMap = {}
  for (let i = 0; i < reminds.length; i++) {
    const time = new Monent(reminds[i].start).format('YYYY-MM-DD')
    if (timeMap[time]) {
      timeMap[time].push(reminds[i])
    } else {
      timeMap[time] = [reminds[i]]
    }
  }
  const data = Object.keys(timeMap).map(key => ({
    date: key,
    list: timeMap[key]
  }))
  return builder({ code: '0', data }, 'success', 200)
}

const _addRemid = (options) => {
}

const _deleteRemind = (options) => {
}

const _updateRemind = (options) => {
}

export default {
  'post /workspace/remind/get': _getReminds,
  'post /workspace/remind/add': _addRemid,
  'post /workspace/remind/delete/:id': _deleteRemind,
  'post /workspace/remind/update/:id': _updateRemind
}
