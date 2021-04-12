<template>
  <div class="wsd-step-form">
    <a-page-header :breadcrumb="{ props: { routes } }"/>
    <div class="wsd-form-container">
      <a-steps
        size="small"
        class="wsd-step-form__steps"
        :current="currentStep"
      >
        <a-step :title="$t('form.inputInfos')">
        </a-step>
        <a-step :title="$t('form.confirmInfos')">
        </a-step>
        <a-step :title="$t('form.result')">
        </a-step>
      </a-steps>
      <!-- 分布表单 -->
      <a-row>
        <a-col :span="16" :offset="4">
          <a-form
            :form="form"
            v-bind="formItemLayout"
          >
            <!-- 第一步 -->
            <template v-if="currentStep === 0">
              <h4 class="wsd-step-title">{{ $t('form.payee')}}</h4>
              <a-form-item :label="$t('form.accountName')">
                <a-input
                  v-decorator="[
                    'accountName',
                    {
                      rules: [
                        { required: true, message: 'Please input account name!' }
                      ],
                      initialValue: '张怀玉'
                    }
                  ]"
                  :max-length="64"
                  placeholder="Please input account name"
                >
                  <a-icon slot="suffix" type="user" />
                </a-input>
              </a-form-item>
              <a-form-item :label="$t('form.account')">
                <a-input
                  v-decorator="[
                    'account',
                    {
                      rules: [
                        { required: true, message: 'Please input account!' },
                        { pattern: /\d{19}/, message: $t('common.formatError') }
                      ],
                      initialValue: '6033617878761789817'
                    }
                  ]"
                  placeholder="Please input account"
                >
                  <a-icon slot="suffix" type="key" />
                </a-input>
              </a-form-item>
              <a-form-item :label="$t('form.bank')">
                <a-select
                  v-decorator="[
                    'bank',
                    {
                      rules: [
                        { required: true, message: 'Please select bank!' }
                      ],
                      initialValue: 'zs'
                    }
                  ]"
                  placeholder="Please select bank"
                >
                  <a-select-option
                    v-for="option in bankOptions"
                    :key="option.value"
                    :value="option.value"
                    :label="option.name"
                  >{{ option.name }}</a-select-option>
                </a-select>
              </a-form-item>
              <h4 class="wsd-step-title">{{ $t('form.pay')}}</h4>
              <a-form-item :label="$t('form.amount')">
                <a-input-number
                  v-decorator="[
                    'amount',
                    {
                      rules: [
                        { required: true, message: 'Please input transfer amount!' }
                      ],
                      initialValue: 10000
                    }
                  ]"
                  :min="1"
                  :max="100000"
                  :formatter="value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                  :parser="value => value.replace(/\¥\s?|(,*)/g, '')"
                  style="width: 100%;"
                  placeholder="Please input transfer amount"
                ></a-input-number>
              </a-form-item>
              <a-form-item :label="$t('form.payAccount')">
                <a-select
                  v-decorator="[
                    'payAccount',
                    {
                      rules: [
                        { required: true, message: 'Please select pay account!' }
                      ],
                      initialValue: 'zs-9999'
                    }
                  ]"
                  placeholder="Please select pay account"
                >
                  <a-select-option
                    v-for="option in payAccountOptions"
                    :key="option.value"
                    :value="option.value"
                    :label="option.name"
                  >{{ option.name }}</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item :label="$t('form.remark')">
                <a-input
                  v-decorator="[
                    'remark'
                  ]"
                  placeholder="Please input remark"
                  type="textarea"
                  :rows="4"
                  :auto-size="{maxRows: 4, minRows: 4}"
                  :max-length="100"
                ></a-input>
                <i class="wsd-remark-count">{{ formData.remark ? formData.remark.length : 0 }}/100</i>
              </a-form-item>
              <a-form-item :wrapper-col="{ span: 16, offset: 6 }">
                <a-button
                  type="primary"
                  @click="handleNext"
                >
                  {{ $t('common.nextStep') }}
                </a-button>
              </a-form-item>
            </template>
            <!-- 第二步 -->
            <template v-if="currentStep === 1">
              <div style="margin-bottom: 24px">
                <a-alert :message="$t('form.submitTips')" type="warning" show-icon />
              </div>
              <a-form-item class="wsd-step-info-form" :label="$t('form.accountName')">
                <span>{{ formData.accountName }}</span>
              </a-form-item>
              <a-form-item class="wsd-step-info-form"  :label="$t('form.account')">
                <span>{{ formData.account }}</span>
              </a-form-item>
              <a-form-item class="wsd-step-info-form"  :label="$t('form.payAccount')">
                <span>{{ formData.payAccount | getSelectionValue(payAccountOptions) }}</span>
              </a-form-item>
              <a-form-item class="wsd-step-info-form"  :label="$t('form.amount')">
                <span class="is-large">¥ {{ formData.amount ? formData.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '' }}</span>
              </a-form-item>
              <a-form-item class="wsd-step-info-form" :label="$t('form.remark')">
                <span>{{ formData.remark }}</span>
              </a-form-item>
              <a-divider type="horizontal" />
              <a-form-item :label="$t('form.cardPassword')">
                <a-input
                  v-decorator="[
                    'password',
                    {
                      rules: [
                        { required: true, message: 'Please input bank card password!' }
                      ]
                    }
                  ]"
                  type="password"
                  placeholder="Please input bank card password"
                  :max-length="24"
                ></a-input>
              </a-form-item>
              <a-form-item :wrapper-col="{ span: 16, offset: 6 }">
                <a-button
                  v-permit="'func:step-form-submit'"
                  type="primary"
                  :loading="submitLoading"
                  @click="handleSubmit"
                >
                  {{ $t('common.submit') }}
                </a-button>
                <a-button
                  @click="handlePrev"
                >
                  {{ $t('common.prevStep') }}
                </a-button>
              </a-form-item>
            </template>
            <!-- 第三步 -->
            <template v-if="currentStep === 2">
              <a-result
                status="success"
                :title="$t('form.titleSuccess')"
                :sub-title="$t('form.subTitleSuccess')"
              ></a-result>
              <a-form-item :wrapper-col="{ span: 16, offset: 6 }">
                <a-button
                  type="primary"
                  @click="handleAgain"
                >
                  {{ $t('form.again') }}
                </a-button>
                <a-button
                  @click="handleExit"
                >
                  {{ $t('form.exit') }}
                </a-button>
              </a-form-item>
            </template>
          </a-form>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'StepForm',
  data () {
    return {
      routes: [
        {
          path: '/form',
          breadcrumbName: this.$t('menu.form')
        },
        {
          path: '/form-step',
          breadcrumbName: this.$t('menu.stepForm')
        }
      ],
      currentStep: 0,
      submitLoading: false,
      formData: {
        remark: ''
      },
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 }
      }
    }
  },

  computed: {
    ...mapState({
      payAccountOptions: state => state.options.pay_account_options,
      bankOptions: state => state.options.bank_options
    })
  },

  filters: {
    getSelectionValue (val, options) {
      return options.find(option => option.value === val).name
    }
  },

  beforeCreate () {
    this.form = this.$form.createForm(this, {
      name: 'step_form',
      onValuesChange: (props, values) => { this.handleFormValuesChange(props, values) }
    })
  },

  methods: {
    // 表单值改变
    handleFormValuesChange (props, values) {
      this.formData = {
        ...this.formData,
        ...values
      }
    },

    // 下一步
    handleNext () {
      this.form && this.form.validateFields(
        ['account', 'accountName', 'bank', 'amount', 'payAccount', 'remark'],
        (err, values) => {
          if (!err) {
            this.currentStep += 1
            this.formData = {
              ...this.formData,
              ...values
            }
          }
        }
      )
    },

    // 上一步
    handlePrev () {
      this.currentStep -= 1
      // 重置输入
      this.$nextTick(() => {
        this.form && this.form.setFieldsValue(this.formData)
      })
    },

    // 提交
    handleSubmit () {
      this.form && this.form.validateFields(['password'], (err, values) => {
        if (!err) {
          this.submitLoading = true
          setTimeout(() => {
            this.currentStep += 1
            this.submitLoading = false
          }, 1500)
        }
      })
    },

    // 重新提交
    handleAgain () {
      this.currentStep = 0
    },

    // 退出
    handleExit () {
      this.$router.push('/detail-basic')
    }
  }
}
</script>
