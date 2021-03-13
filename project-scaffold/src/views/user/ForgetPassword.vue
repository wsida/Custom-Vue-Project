<!-- 登录表单 -->
<template>
  <div class="wsd-forget-password-form">
    <div class="wsd-forget-password-form__title">
      <span>WSD - </span>
      <span class="is-strong">Forget password</span>
    </div>
    <div class="wsd-forget-password-form__content">
      <!-- 注册流程 -->
      <a-steps
        size="small"
        type="navigation"
        class="wsd-forget-password-form__steps"
        :current="currentStep"
      >
        <a-step title="Verification"></a-step>
        <a-step title="Modify password" />
        <a-step title="Result" />
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
                  Next step
                </a-button>
              </a-col>
            </a-row>
          </a-form-item>
          <a-form-item>
            perhaps <a-button type="link" class="wsd-register-form__link" @click="handleGoLogin">I remember it!</a-button>
          </a-form-item>
        </template>
        <template v-else-if="currentStep === 1">
          <a-form-item>
            <a-input
              placeholder="Old password"
              :type="!isShowOldPassword ? 'password' : 'text'"
              v-decorator="[
                'oldPassword',
                decorators.oldPassword,
              ]"
            >
              <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
              <a-icon slot="suffix" :type="isShowOldPassword ? 'eye' : 'eye-invisible'" style="color: rgba(0,0,0,.25)" @click="handleSwitchEye('isShowOldPassword')" />
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-input
              placeholder="New password"
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
              placeholder="Cconfirm password"
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
                  Confirm modify
                </a-button>
              </a-col>
            </a-row>
          </a-form-item>
          <a-form-item>
            perhaps <a-button type="link" class="wsd-register-form__link" @click="handleGoLogin">I remember it!</a-button>
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
                Go login
              </a-button>
              <a-button
                v-if="modifyResult.status === 'error'"
                type="danger"
                @click="handlePrevStep"
              >
                Prev step
              </a-button>
            </template>
          </a-result>
        </template>
      </a-form>
    </div>
  </div>
</template>

<script>
const DEFAULT_RESULT = {
  success: {
    status: 'success',
    title: 'Successfully registered!',
    subTitle: 'You can sign in directly with your account or mobile number.'
  },
  error: {
    status: 'error',
    title: 'Registered has failed!',
    subTitle: 'You can go back to the previous step to try again.'
  }
}
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
      // 登录模式
      currentStep: 0,
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
        oldPassword: {
          initialValue: '',
          rules: [
            { required: true, message: 'Please input your old password', type: 'string' },
            { min: 6, max: 24, message: 'Format error' }
          ]
        },
        password: {
          initialValue: '',
          rules: [
            { required: true, message: 'Please input your new password', type: 'string' },
            { min: 6, max: 24, message: 'Format error' }
          ]
        },
        confirmPassword: {
          initialValue: '',
          rules: [
            { required: true, message: 'Please input to confirm your new password', type: 'string' },
            { validator: validatorConfimPassword, message: 'Password do not match twice', trigger: 'change' }
          ]
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
          // this.validateLoading = true
          // TODO 验证成功缓存手机号码
          this.validatePhone = value.telphone
          // 登记账号信息
          this.currentStep += 1
        }
      })
    },

    // 提交事件
    handleSubmit () {
      this.form && this.form.validateFields(['oldPassword', 'password', 'confirmPassword'], (error, value) => {
        if (!error) {
          // this.submitLoading = true
          // TODO 加密密码
          // const formData = {
          //   ...this.formData,
          //   password: value.password // 加密密码， 确认密码不需要传
          // }
          // TODO调用接口返回注册结果
          this.modifyResult = DEFAULT_RESULT.success
          this.currentStep += 1
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
    handleSwitchEye (key) {
      this[key] = !this[key]
    },

    // 跳登录
    handleGoLogin () {
      this.$router.push({ name: 'login' })
    },

    // 返回上一步
    handlePrevStep () {
      this.currentStep -= 1
    }
  }
}
</script>
