<!-- 登录表单 -->
<template>
  <div :class="['wsd-forget-password-form', currentStep === 2 && 'is-block']">
    <div class="wsd-forget-password-form__title">
      <svg-icon icon-class="logo"></svg-icon>
      <span>WSD - </span>
      <span class="is-strong">{{$t('common.forgetPassword')}}</span>
    </div>
    <div class="wsd-forget-password-form__content">
      <!-- 注册流程 -->
      <a-steps
        size="small"
        class="wsd-forget-password-form__steps"
        :current="currentStep"
      >
        <a-step :title="$t('common.verification')"></a-step>
        <a-step :title="$t('common.modifyPassword')" />
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
                  class="wsd-forget-password-form__submit"
                  :loading="validateLoading"
                  @click="handleNextStep"
                >
                  {{$t('common.nextStep')}}
                </a-button>
              </a-col>
            </a-row>
          </a-form-item>
          <a-form-item>
            <a-button type="link" class="wsd-register-form__link" @click="handleGoLogin">{{$t('common.rememberIt')}}</a-button>
          </a-form-item>
        </template>
        <template v-else-if="currentStep === 1">
          <a-form-item>
            <a-input
              :placeholder="$t('common.newPassword')"
              :type="!isShowPassword ? 'password' : 'text'"
              v-decorator="[
                'password',
                decorators.password,
              ]"
            >
              <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
              <a-icon slot="suffix" :type="isShowPassword ? 'eye' : 'eye-invisible'" style="color: rgba(0,0,0,.25)" @click="handleSwitchEye('isShowPassword')" />
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
          <!-- 确认修改密码 -->
          <a-form-item>
            <a-row>
              <a-col :span="10">
                <a-button
                  block
                  type="primary"
                  class="wsd-forget-password-form__submit"
                  :loading="submitLoading"
                  @click="handleSubmit"
                >
                  {{$t('common.confirmModify')}}
                </a-button>
              </a-col>
            </a-row>
          </a-form-item>
          <a-form-item>
            <a-button type="link" class="wsd-register-form__link" @click="handleGoLogin">{{$t('common.rememberIt')}}</a-button>
          </a-form-item>
        </template>
        <template v-else-if="currentStep === 2">
          <a-result
            v-bind="modifyResult"
          >
            <template #extra>
              <a-button
                v-if="modifyResult.status === 'success'"
                type="primary"
                @click="handleGoLogin"
              >
                {{$t('common.goLogin')}}
              </a-button>
              <a-button
                v-if="modifyResult.status === 'error' && !firstStep"
                type="danger"
                @click="handlePrevStep"
              >
                {{$t('common.prevStep')}}
              </a-button>
              <a-button
                v-if="modifyResult.status === 'error' && firstStep"
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
    title: self.$t('common.modify_password_success_title'),
    subTitle: self.$t('common.modify_password_success_subtitle')
  },
  error: {
    status: 'error',
    title: self.$t('common.modify_password_error_title'),
    subTitle: self.$t('common.modify_password_error_subtitle')
  }
})
export default {
  name: 'ForgetPassword',
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
      isShowOldPassword: false,
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
        password: {
          initialValue: '',
          rules: [
            { required: true, message: this.$t('common.newPassword_tips'), type: 'string' },
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
      modifyResult: {}
    }
  },

  beforeCreate () {
    this.form = this.$form.createForm(this, { name: 'wsd-forget-password-' })
  },

  beforeDestroy () {
    this.captchaInterval && clearInterval(this.captchaInterval)
  },

  methods: {
    // 下一步 - 验证验证码，保留手机号
    handleNextStep () {
      this.form && this.form.validateFields(['telphone', 'captcha'], (error, value) => {
        if (!error) {
          this.validateLoading = true
          this.$api['user/validateCaptcha'](value).then(res => {
            if (res.data.code === '0') {
              // TODO 验证成功缓存手机号码
              this.formData.telphone = value.telphone
              // 登记账号信息
              this.currentStep += 1
            } else if (res.data.code === '10031') {
              // TODO 验证成功缓存手机号码
              this.form && this.form.setFields({
                captcha: {
                  value: value.captcha,
                  errors: [new Error(res.message)]
                }
              })
            } else {
              this.$message.error(res.message || 'Validate error!')
            }
          }).finally(_ => {
            this.validateLoading = false
          })
        }
      })
    },

    // 提交事件
    handleSubmit () {
      this.form && this.form.validateFields(['password', 'confirmPassword'], (error, value) => {
        if (!error) {
          this.submitLoading = true
          // TODO 加密密码
          const formData = {
            telphone: this.formData.telphone,
            password: encrypt(value.password) // 加密密码， 确认密码不需要传
          }
          this.$api['user/forgetPassword'](formData).then(res => {
            if (res.data.code === '0') {
              // TODO调用接口返回注册结果
              this.modifyResult = this.DEFAULT_RESULT.success
              this.currentStep += 1
            } else {
              // TODO调用接口返回注册结果
              this.modifyResult = {
                ...this.DEFAULT_RESULT.error,
                ...res.data.data || {}
              }
              this.currentStep += 1
            }
            if (res.data.code === '10051') {
              this.firstStep = true
            } else {
              this.firstStep = false
            }
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
    handleSwitchEye (key) {
      this[key] = !this[key]
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
