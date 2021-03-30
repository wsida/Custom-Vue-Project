<!-- 登录表单 -->
<template>
  <div :class="['wsd-register-form', currentStep === 2 && 'is-block']">
    <div class="wsd-register-form__title">
      <svg-icon icon-class="logo"></svg-icon>
      <span>WSD - </span>
      <span class="is-strong">{{$t('common.register')}}</span>
    </div>
    <div class="wsd-register-form__content">
      <!-- 注册流程 -->
      <a-steps
        size="small"
        class="wsd-register-form__steps"
        :current="currentStep"
      >
        <a-step :title="$t('common.verification')"></a-step>
        <a-step :title="$t('common.inputInformation')" />
        <a-step :title="$t('common.result')" />
      </a-steps>
      <a-form
        :form="form"
        layout="vertical"
      >
        <template v-if="currentStep === 0">
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
                :placeholder="$t('common.telphone')"
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
                  :placeholder="$t('common.captcha')"
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
                  {{ !captchaTimeout ? $t('common.getCaptcha') : $t('common.captchaCountdown', [captchaTimeout]) }}
                </a-button>
              </a-col>
            </a-row>
          </a-form-item>
          <!-- 下一步 -->
          <a-form-item>
            <a-row>
              <a-col :span="10">
                <a-button
                  block
                  type="primary"
                  class="wsd-register-form__submit"
                  :loading="validateLoading"
                  @click="handleNextStep"
                >
                  {{$t('common.nextStep')}}
                </a-button>
              </a-col>
            </a-row>
          </a-form-item>
          <a-form-item>
            {{$t('common.hasAccount')}} <a-button type="link" class="wsd-register-form__link" @click="handleGoLogin">{{$t('common.loginNow')}}</a-button>
          </a-form-item>
        </template>
        <template v-else-if="currentStep === 1">
          <a-form-item>
            <a-input
              :placeholder="$t('common.username')"
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
              :placeholder="$t('common.password')"
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
            <a-input
              :placeholder="$t('common.confirmPassword')"
              type="password"
              v-decorator="[
                'confirmPassword',
                decorators.confirmPassword,
              ]"
            >
              <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
            </a-input>
          </a-form-item>
          <!-- 保存登记信息 -->
          <a-form-item>
            <a-row>
              <a-col :span="10">
                <a-button
                  block
                  type="primary"
                  class="wsd-register-form__submit"
                  :loading="submitLoading"
                  @click="handleSubmit"
                >
                  {{$t('common.register')}}
                </a-button>
              </a-col>
            </a-row>
          </a-form-item>
          <a-form-item>
            {{$t('common.hasAccount')}} <a-button type="link" class="wsd-register-form__link" @click="handleGoLogin">{{$t('common.loginNow')}}</a-button>
          </a-form-item>
        </template>
        <template v-else-if="currentStep === 2">
          <a-result
            v-bind="registerResult"
          >
            <template #extra>
              <a-button
                v-if="registerResult.status === 'success'"
                type="primary"
                @click="handleGoLogin"
              >
                {{$t('common.goLogin')}}
              </a-button>
              <a-button
                v-if="registerResult.status === 'error' && !firstStep"
                type="danger"
                @click="handlePrevStep"
              >
                {{$t('common.prevStep')}}
              </a-button>
              <a-button
                v-if="registerResult.status === 'error' && firstStep"
                type="danger"
                @click="handleFirstStep"
              >
                {{$t('common.tryAgain')}}
              </a-button>
            </template>
          </a-result>
        </template>
      </a-form>
    </div>
  </div>
</template>

<script>
import { encrypt } from '@/utils/aes'
const DEFAULT_RESULT = (self) => ({
  success: {
    status: 'success',
    title: self.$t('common.register_success_title'),
    subTitle: self.$t('common.register_success_subtitle')
  },
  error: {
    status: 'error',
    title: self.$t('common.register_error_title'),
    subTitle: self.$t('common.register_error_subtitle')
  }
})
export default {
  name: 'Login',
  data () {
    const validatorConfimPassword = (rule, value, callback) => {
      if (this.form) {
        const password = this.form.getFieldValue('password')
        if (value !== password) {
          callback(new Error('Password do not match twice'))
        }
        callback()
      }
      callback()
    }

    return {
      DEFAULT_RESULT: DEFAULT_RESULT(this),
      // 登录模式
      currentStep: 0,
      firstStep: false,
      telphonePrefix: '+86',
      isShowPassword: false,
      // 按钮状态
      captchaTimeout: 0,
      captchaLoading: false, // 按钮-获取验证码
      validateLoading: false, // 按钮-验证手机验证码
      submitLoading: false, // 按钮-保存账号信息
      formData: {
        telphone: ''
      },
      // 表单验证
      decorators: {
        username: {
          initialValue: '',
          rules: [
            { required: true, message: this.$t('common.username_tips'), type: 'string' },
            { pattern: /^[a-zA-Z][\w_]{3,64}$/, message: this.$t('common.formatError'), trigger: 'change' }
          ]
        },
        password: {
          initialValue: '',
          rules: [
            { required: true, message: this.$t('common.password_tips'), type: 'string' },
            { min: 6, max: 24, message: this.$t('common.formatError') }
          ]
        },
        confirmPassword: {
          initialValue: '',
          rules: [
            { required: true, message: this.$t('common.confirmPassword_tips'), type: 'string' },
            { validator: validatorConfimPassword, message: this.$t('common.confirmPasswordError_tips'), trigger: 'change' }
          ]
        },
        telphone: {
          initialValue: '',
          rules: [
            { required: true, message: this.$t('common.telphone_tips'), type: 'string' },
            { pattern: /^1[3-9]\d{9}$/, message: this.$t('common.formatError'), trigger: 'change' }
          ]
        },
        captcha: {
          initialValue: '',
          rules: [
            { required: true, message: this.$t('common.captcha_tips'), type: 'string' },
            { pattern: /^(\d{4}|\d{6})$/, message: this.$t('common.formatError'), trigger: 'change' }
          ]
        }
      },
      // 注册结果
      registerResult: {}
    }
  },

  beforeCreate () {
    this.form = this.$form.createForm(this, { name: 'wsd-register-' })
  },

  beforeDestroy () {
    this.captchaInterval && clearInterval(this.captchaInterval)
  },

  methods: {
    // 下一步 - 验证验证码，保留手机号
    handleNextStep () {
      this.form && this.form.validateFields(['telphone', 'captcha'], (error, value) => {
        if (!error) {
          // this.validateLoading = true
          // TODO 验证成功缓存手机号码
          this.formData.telphone = value.telphone
          // 登记账号信息
          this.currentStep += 1
        }
      })
    },

    // 提交事件
    handleSubmit () {
      this.form && this.form.validateFields(['username', 'password', 'confirmPassword'], (error, value) => {
        if (!error) {
          this.submitLoading = true
          // TODO 加密密码
          const formData = {
            telphone: this.formData.telphone,
            username: value.username,
            password: encrypt(value.password) // 加密密码， 确认密码不需要传
          }
          // TODO调用接口返回注册结果
          this.$api['user/registerAccount'](formData).then(res => {
            if (res.data.code === '0') {
              this.registerResult = this.DEFAULT_RESULT.success
            } else if (res.data.code === '10040' || res.data.code === '10041') {
              this.registerResult = {
                ...this.DEFAULT_RESULT.error,
                ...res.data.data || {}
              }
            } else {
              this.registerResult = {
                ...this.DEFAULT_RESULT.error,
                ...res.data.data || {}
              }
            }
            if (res.data.code === '10041') {
              this.firstStep = true
            } else {
              this.firstStep = false
            }
            this.currentStep += 1
          }).finally(_ => {
            this.submitLoading = false
          })
        }
      })
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
            if (res.data.code === '0') {
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

    // 跳登录
    handleGoLogin () {
      this.$router.push({ name: 'login' })
    },

    // 返回上一步
    handlePrevStep () {
      this.form && this.form.resetFields(['password', 'confirmPassword'])
      this.$nextTick(() => {
        this.currentStep -= 1
      })
    },

    // 返回第一步
    handleFirstStep () {
      this.form && this.form.resetFields()
      this.$nextTick(() => {
        this.currentStep = 0
      })
    }
  }
}
</script>
