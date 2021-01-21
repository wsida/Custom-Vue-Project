// import Mock from 'mockjs'
import { builder, getBody, getQueryParameters } from '../utils'

// const Mock = require('mockjs')
const _login = function (options) {
  // options url, type, body
  return {
    code: 200
  }
}

const _getUserInfo = function (options) {
  // options url, type, body
  console.log(options)
  return builder({ title: 'mock' }, 'success', 200)
}

export default {
  'post /user/login': _login,
  'get /user/info': _getUserInfo
}
