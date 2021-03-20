// import Mock from 'mockjs'
import Mock from 'mockjs2'
import { builder, getBody, decrypt, encrypt } from '../utils'

// 请求错误 code [xxyyz] xx-功能模块  yy-方法 z-错误类型
// 变量
const accounts = [
  {
    username: 'admin',
    description: '-',
    password: '888888',
    telphone: '18888888888'
  },
  {
    username: 'user',
    description: '-',
    password: '888888',
    telphone: '15888888888'
  }
]
const _captcha = {}
let _captchaInterval = null
const PAGES_PERMIT = [
  'page:dashboard',
  'page:form',
  'page:form-basic',
  'page:form-complex',
  'page:list',
  'page:list-basic',
  'page:list-infinite-scroll',
  'page:table',
  'page:table-basic',
  'page:table-complex'
]
const MENUS_PERMIT = [
  'menu:dashboard',
  'menu:form',
  'menu:form-basic',
  'menu:form-complex',
  'menu:list',
  'menu:list-basic',
  'menu:list-infinite-scroll',
  'menu:table',
  'menu:table-basic',
  'menu:table-complex'
]

const _getUserInfo = function (options) {
  const body = getBody(options)
  // options url, type, body
  const user = accounts.find(account => account.token === body.token) || accounts[0]
  if (user) {
    const userInfo = Mock.mock({
      data: {
        username: user.username,
        telphone: user.telphone,
        avatar: '@image',
        birthday: '@date',
        city: 'FuJian',
        region: 'China',
        email: '@email',
        company: 'XXX Company',
        position: 'Web Front-end Engineer',
        description: 'a web front-end engineer',
        funcs: [],
        pages: PAGES_PERMIT,
        menus: MENUS_PERMIT
      }
    }).data
    return builder({ code: '0', data: userInfo }, 'Success', 200)
  }
  return builder({ code: '10060', data: {} }, 'Error', 200)
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
  const _password = decrypt(body.password || '')
  const user = accounts.find(account => (account.username === body.username))
  if (user) {
    if (user.password === _password) {
      user.token = encrypt(user.username + user.telphone)
      return builder({ code: '0', data: user.token }, 'Success', 200)
    } else {
      return builder({ code: '10010' }, 'Wrong account or password!', 200)
    }
  }
  return builder({ code: '10011' }, 'Account not exist!', 200)
}

// 登录-手机号码
const _loginByTelphone = function (options) {
  const body = getBody(options)
  if (!_captcha[body.telphone]) {
    return builder({ code: '10021' }, 'The captcha is invalid!', 200)
  }
  const user = accounts.find(account => account.telphone === body.telphone)
  if (_captcha[body.telphone].toString() === body.captcha) {
    if (user) {
      user.token = encrypt(user.username + user.telphone)
      return builder({ code: '0', data: user.token }, 'Success', 200)
    } else {
      return builder({ code: '10022' }, 'Telphone not register!', 200)
    }
  }
  return builder({ code: '10020' }, 'Wrong captcha!', 200)
}

// 注册
const _register = function (options) {
  const body = getBody(options)
  if (accounts.find(account => account.username === body.username)) {
    return builder({ code: '10040', data: { title: 'The username already exists!', subTitle: 'You can change your username and try again.' } }, 'Error', 200)
  }
  if (accounts.find(account => account.telphone === body.telphone)) {
    return builder({ code: '10041', data: { title: 'The telphone already register!', subTitle: 'You need to register the account by using another telphone.' } }, 'Error', 200)
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
  let isExist = false
  accounts.forEach(account => {
    if (account.telphone === body.telphone) {
      isExist = true
      account.password = _password
    }
  })
  if (!isExist) {
    return builder({ code: '10051', data: { title: 'Account not exist!', subTitle: 'You need to confirm the account with this bounded telphone.' } }, 'Error', 200)
  }
  return builder({ code: '0' }, 'Success', 200)
}

export default {
  'post /user/get': _getUserInfo,
  'post /user/captcha/get': _getCaptcha,
  'post /user/captcha/validate': _validateCaptcha,
  'post /user/login/account': _loginByAccount,
  'post /user/login/telphone': _loginByTelphone,
  'post /user/register': _register,
  'post /user/forget': _modifyPassword
}
