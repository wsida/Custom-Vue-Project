<!-- 登录表单 -->
<template>
  <div class="wsd-login-form">
    <div class="wsd-login-form__title">
      <span>WSD - </span>
      <span class="is-strong">Login</span>
    </div>
    <div class="wsd-login-form__content">
      <a-form
        :form="form"
        layout="vertical"
      >
        <!-- 切换登录方式 -->
        <a-tabs v-model="mode" @change="handleSwitchMode">
          <!-- 账号/密码 -->
          <a-tab-pane key="account" tab="Account">
            <a-form-item>
              <a-input
                placeholder="Username"
                :max-length="64"
                v-decorator="[
                  'username',
                  decorators.username,
                ]"
              >
                <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" />
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-input
                placeholder="Password"
                :type="!isShowPassword ? 'password' : 'text'"
                v-decorator="[
                  'password',
                  decorators.password,
                ]"
              >
                <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
                <a-icon slot="suffix" :type="isShowPassword ? 'eye' : 'eye-invisible'" style="color: rgba(0,0,0,.25)" @click="handleSwitchEye" />
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-row type="flex">
                <a-col :span="14">
                  <a-checkbox
                    v-decorator="[
                      'remember',
                      decorators.remember,
                    ]"
                  >
                    Remember
                  </a-checkbox>
                </a-col>
                <a-col :span="10" style="text-align: right;">
                  <a-button type="link" class="wsd-login-form__link" @click="handleForgetpassword">
                    Forgot password
                  </a-button>
                </a-col>
              </a-row>
            </a-form-item>
          </a-tab-pane>
          <!-- 手机验证码 -->
          <a-tab-pane key="captcha" tab="Telphone">
            <a-form-item>
              <a-input-group compact>
                <!-- 手机号前缀 -->
                <a-select v-model="telphonePrefix" style="width: 72px;">
                  <a-select-option value="+86">
                    +86
                  </a-select-option>
                </a-select>
                <!-- 手机号输入 -->
                <a-input
                  style="width: calc(100% - 72px);"
                  placeholder="Telphone"
                  v-decorator="[
                    'telphone',
                    decorators.telphone
                  ]"
                  :max-length="11"
                >
                  <a-icon slot="prefix" type="phone" style="color: rgba(0,0,0,.25)" />
                </a-input>
              </a-input-group>
            </a-form-item>
            <a-form-item>
              <a-row type="flex" :gutter="12">
                <a-col :span="12">
                  <a-input
                    clearable
                    placeholder="Captcha"
                    :max-length="6"
                    v-decorator="[
                      'captcha',
                      decorators.captcha
                    ]"
                  >
                    <a-icon slot="prefix" type="key" style="color: rgba(0,0,0,.25)" />
                  </a-input>
                </a-col>
                <a-col :span="12">
                  <a-button
                    block
                    type="primary"
                    :loading="captchaLoading"
                    :disabled="!!captchaTimeout"
                    @click="handleFetchCaptcha"
                  >
                    {{ !captchaTimeout ? 'Get Captcha' : captchaTimeout + 's to try again' }}
                  </a-button>
                </a-col>
              </a-row>
            </a-form-item>
          </a-tab-pane>
        </a-tabs>
        <a-form-item>
          <a-row>
            <a-col :span="10">
              <a-button
                block
                type="primary"
                class="wsd-login-form__submit"
                :loading="submitLoading"
                @click="handleSubmit"
              >
                Login
              </a-button>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item>
          Or <a-button type="link" class="wsd-login-form__link" @click="handleRegister">register now!</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script>
import { encrypt } from '@/utils/aes'
export default {
  name: 'Login',
  data () {
    return {
      // 登录模式
      mode: 'account', // 'captcha‘
      telphonePrefix: '+86',
      isShowPassword: false,
      // 按钮状态
      captchaLoading: false,
      captchaTimeout: 0,
      submitLoading: false,
      // 表单验证
      decorators: {
        username: {
          initialValue: '',
          rules: [
            { required: true, message: 'Please input your username', type: 'string' },
            { pattern: /^[a-zA-Z][\w_]{3,64}$/, message: 'Format error', trigger: 'change' }
          ]
        },
        password: {
          initialValue: '',
          rules: [
            { required: true, message: 'Please input your password', type: 'string' },
            { min: 6, max: 24, message: 'Format error' }
          ]
        },
        remember: {
          valuePropName: 'checked',
          initialValue: true
        },
        telphone: {
          initialValue: '',
          rules: [
            { required: true, message: 'Please input your phone number', type: 'string' },
            { pattern: /^1[3-9]\d{9}$/, message: 'Format error', trigger: 'change' }
          ]
        },
        captcha: {
          initialValue: '',
          rules: [
            { required: true, message: 'Please input captcha', type: 'string' },
            { pattern: /^(\d{4}|\d{6})$/, message: 'Format error', trigger: 'change' }
          ]
        }
      }
    }
  },

  beforeCreate () {
    this.form = this.$form.createForm(this, { name: 'wsd-login-' })
  },

  beforeDestroy () {
    this.captchaInterval && clearInterval(this.captchaInterval)
  },

  methods: {
    // 提交事件
    handleSubmit () {
      const validateFields = this.mode === 'account' ? ['username', 'password'] : ['telphone', 'captcha']
      this.form && this.form.validateFields(validateFields, (error, value) => {
        if (!error) {
          const formData = {
            ...value
          }
          this.submitLoading = true
          if (this.mode === 'account') {
            // TODO账号密码加密 mode=account
            formData.password = encrypt(formData.password).toString()
            this.$api['user/loginByAccount'](formData).then(res => {
              console.log(res)
              if (res.data && res.data.code === '0') {
                // TODO 登录跳转
                this.goHome()
              } else if (res.data && res.data.code === '10010') {
                this.form && this.form.setFields({
                  password: {
                    errors: [new Error(res.message)]
                  }
                })
              } else {
                this.$message.error(res.message || 'Login error!')
              }
            }).finally(_ => {
              this.submitLoading = false
            })
          } else {
            // TODO提交表单 mode=telphone 需要传送前缀
            this.$api['user/loginByTelphone'](formData).then(res => {
              console.log(res)
              if (res.data && res.data.code === '0') {
                // TODO 登录跳转
                this.goHome()
              } else if (res.data && (res.data.code === '10021' || res.data.code === '10020')) {
                this.form && this.form.setFields({
                  password: {
                    errors: [new Error(res.message)]
                  }
                })
              } else {
                this.$message.error(res.message || 'Login error!')
              }
            }).finally(_ => {
              this.submitLoading = false
            })
          }
        }
      })
    },

    // 登录模式切换
    handleSwitchMode (activeMode) {
      // TODO 重置表单状态
      if (activeMode === 'account') {
        this.form && this.form.resetFields(['username', 'password', 'remember'])
      } else {
        this.form && this.form.resetFields(['telphone', 'captcha'])
      }
    },

    // 请求验证码
    handleFetchCaptcha () {
      // TODO 手机号码输入验证
      this.form && this.form.validateFields(['telphone'], (error, value) => {
        if (!error) {
          this.captchaLoading = true
          // TODO 发起获取验证码
          this.$api['user/getCaptcha'](value).then(res => {
            console.log(res)
            if (res.data && res.data.code === '0') {
              // TODO 请求成功倒计时
              this.captchaTimeout = 59
              this.captchaInterval = setInterval(() => {
                if (!this.captchaTimeout) {
                  clearInterval(this.captchaInterval)
                  return
                }
                this.captchaTimeout -= 1
              }, 1000)
            }
          }).finally(_ => {
            this.captchaLoading = false
          })
        }
      })
    },

    // 切换密码显隐
    handleSwitchEye () {
      this.isShowPassword = !this.isShowPassword
    },

    // 注册
    handleRegister () {
      this.$router.push({ name: 'register' })
    },

    // 修改密码
    handleForgetpassword () {
      this.$router.push({ name: 'forget-password' })
    },

    // 跳转首页
    goHome () {
      this.$router.push({ name: 'home' })
    }
  }
}
</script>
