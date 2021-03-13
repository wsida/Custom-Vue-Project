// import Mock from 'mockjs'
import Mock from 'mockjs2'
import { builder, getBody, decrypt } from '../utils'

// 请求错误 code [xxyyz] xx-功能模块  yy-方法 z-错误类型
// 变量
let accounts = [
  {
    username: 'admin',
    password: '888888',
    telphone: '18888888888'
  },
  {
    username: 'user',
    password: '888888',
    telphone: '15888888888'
  }
]
const _captcha = {}
let _captchaInterval = null

const _getUserInfo = function (options) {
  // options url, type, body
  console.log(options)
  return builder({ title: 'mock' }, 'Success', 200)
}

// 获取验证码
const _getCaptcha = function (options) {
  const body = getBody(options)
  const telphone = body.telphone
  _captcha[telphone] = Mock.mock({
    data: /(\d{4}|\d{6})/
  }).data
  if (telphone) {
    let count = 60
    _captchaInterval = setInterval(() => {
      if (count === 0) {
        _captcha[telphone] = ''
        clearInterval(_captchaInterval)
      }
      count -= 1
    }, 1000)
    const data = {
      code: '0',
      data: _captcha[telphone]
    }
    return builder(data, 'Success', 200)
  }
  return builder({ code: '10030' }, 'Error', 200)
}

// 验证验证吗
const _validateCaptcha = function (options) {
  const body = getBody(options)
  const telphone = body.telphone
  const captcha = body.captcha
  if (telphone && captcha) {
    if (_captcha[telphone] === captcha) {
      return builder({ code: '0' }, 'Success', 200)
    } else {
      return builder({ code: '10031' }, 'Wrong Captcha ', 200)
    }
  }

  return builder({ code: '10030' }, 'Error', 200)
}

// 登录-账号密码
const _loginByAccount = function (options) {
  const body = getBody(options)
  // TODO 解码获取密码
  const _password = decrypt(body.password)
  const user = accounts.find(account => (account.username === body.username && account.password === _password))
  if (user) {
    return builder({ code: '0', data: {} }, 'Success', 200)
  }
  return builder({ code: '10010' }, 'Wrong account or password!', 200)
}

// 登录-手机号码
const _loginByTelphone = function (options) {
  const body = getBody(options)
  if (!_captcha[body.telphone]) {
    return builder({ code: '10021' }, 'The captcha is invalid!', 200)
  }
  const user = accounts.find(account => account.telphone === body.telphone && _captcha[body.telphone].toString() === body.captcha)
  if (user) {
    return builder({ code: '0', data: {} }, 'Success', 200)
  }
  return builder({ code: '10020' }, 'Wrong captcha!', 200)
}

// 注册
const _register = function (options) {
  const body = getBody(options)
  if (accounts.find(account => account.username === body.username)) {
    return builder({ code: '10040', data: { title: 'The username already exists!' } }, 'Error', 200)
  }
  if (accounts.find(account => account.telphone === body.telphone)) {
    return builder({ code: '10041', data: { title: 'The telphone already register!' } }, 'Error', 200)
  }
  // TODO 解码获取密码
  const _password = decrypt(body.password)
  accounts.push({
    username: body.username,
    password: _password,
    telphone: body.telphone
  })
  return builder({ code: '0' }, 'Success', 200)
}

// 修改密码
const _modifyPassword = function (options) {
  const body = getBody(options)
  // TODO 解码获取密码
  const _password = decrypt(body.password)
  accounts = accounts.map(account => {
    if (account.telphone === body.telphone) {
      account.password = _password
    }
    return account
  })
  return builder({ code: '0' }, 'Success', 200)
}

export default {
  'get /user/info': _getUserInfo,
  'post /user/captcha/get': _getCaptcha,
  'post /user/captcha/validate': _validateCaptcha,
  'post /user/login/account': _loginByAccount,
  'post /user/login/telphone': _loginByTelphone,
  'post /user/register': _register,
  'post /user/forget': _modifyPassword
}
