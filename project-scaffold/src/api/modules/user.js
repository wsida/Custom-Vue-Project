// user 模块相关接口
export default {
  getCaptcha: {
    url: '/user/captcha/get',
    method: 'post',
    description: '获取验证码',
    data: {
      telphone: ''
    }
  },
  validateCaptcha: {
    url: '/user/captcha/validate',
    method: 'post',
    description: '验证验证码',
    data: {
      telphone: '',
      captcha: ''
    }
  },
  loginByAccount: {
    url: '/user/login/account',
    method: 'post',
    description: '账号密码登录',
    data: {
      username: '',
      password: ''
    }
  },
  loginByTelphone: {
    url: '/user/login/telphone',
    method: 'post',
    description: '手机验证码登录',
    data: {
      telphone: '',
      captcha: ''
    }
  },
  registerAccount: {
    url: '/user/register',
    method: 'post',
    description: '注册账号密码',
    data: {
      telphone: '',
      username: '',
      password: ''
    }
  },
  forgetPassword: {
    url: '/user/forget',
    method: 'post',
    description: '忘记密码修改',
    data: {
      telphone: '',
      password: '',
      oldPassword: ''
    }
  }
}
