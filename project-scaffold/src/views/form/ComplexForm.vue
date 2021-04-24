<template>
  <div class="wsd-complex-form">
    <a-page-header :breadcrumb="{ props: { routes } }"/>
    <div class="wsd-form-container">
      <a-form
        :form="form"
        v-bind="formItemLayout"
        @submit="handleSubmit"
      >
        <!-- 仓库信息 -->
        <a-card :title="$t('form.repositoryInfo')">
          <a-row>
            <a-col :md="{ span: 12 }" :xxl="{ span: 8 }">
              <a-form-item :label="$t('form.repository')">
                <a-input
                  v-decorator="[
                    'repository',
                    {
                      rules: [{ required: true, message: 'Please input!' }],
                      initialValue: formData.repository
                    },
                  ]"
                  placeholder="Please input"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="{ span: 12 }" :xxl="{ span: 8 }">
              <a-form-item :label="$t('form.repositoryDomain')">
                <a-input
                  v-decorator="[
                    'domain',
                    {
                      rules: [{ required: true, message: 'Please input!' }],
                      initialValue: formData.domain
                    },
                  ]"
                  addon-before="http://"
                  addon-after=".com"
                  placeholder="Please input"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="{ span: 12 }" :xxl="{ span: 8 }">
              <a-form-item :label="$t('form.branch')">
                <a-input
                  v-decorator="[
                    'branch',
                    {
                      rules: [{ required: true, message: 'Please input!' }],
                      initialValue: formData.branch
                    },
                  ]"
                  placeholder="Please input"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="{ span: 12 }" :xxl="{ span: 8 }">
              <a-form-item :label="$t('form.repositoryType')">
                <a-select
                  v-decorator="[
                    'type',
                    {
                      initialValue: formData.type
                    },
                  ]"
                >
                  <a-select-option
                    v-for="item in repositoryType"
                    :key="item.value"
                    :value="item.value"
                  >{{ item.name }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="{ span: 12 }" :xxl="{ span: 8 }">
              <a-form-item v-if="formData.type === '2'" :label="$t('form.manager')">
                <a-select
                  v-decorator="[
                    'manager',
                    {
                      initialValue: formData.manager
                    },
                  ]"
                  placeholder="Please select"
                >
                  <a-select-option
                    key="1"
                    value="1"
                  >马红俊</a-select-option>
                  <a-select-option
                    key="2"
                    value="2"
                  >宁荣荣</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </a-card>
        <!-- 安全设置 -->
        <a-card :title="$t('form.repositorySecurity')">
          <a-row>
            <a-col :md="{ span: 12 }" :xxl="{ span: 8 }">
              <a-form-item :label="$t('form.enableSecurityPolicy')">
                <a-switch
                  v-decorator="[
                    'enableSecurityPolicy',
                    {
                      rules: [
                        { validator: validateSecurityPolicy, trigger: 'blur' }
                      ],
                      initialValue: formData.enableSecurityPolicy,
                      valuePropName: 'checked'
                    },
                  ]"
                  placeholder="Please input"
                ></a-switch>
                <template v-if="formData.enableSecurityPolicy">
                  <a style="margin-left: 12px;" href="javascript:" @click="handleClickSecurityPolicy">
                    {{ $t('form.setSecurityPolicy') }}
                  </a>
                </template>
              </a-form-item>
            </a-col>
            <a-col :md="{ span: 12 }" :xxl="{ span: 8 }">
              <a-form-item :label="$t('form.enableDependabotAlert')">
                <a-switch
                  v-decorator="[
                    'enableDependabotAlert',
                    {
                      initialValue: formData.enableDependabotAlert,
                      valuePropName: 'checked'
                    }
                  ]"
                ></a-switch>
              </a-form-item>
            </a-col>
            <a-col :md="{ span: 12 }" :xxl="{ span: 8 }">
              <a-form-item :label="$t('form.enableCodeScanAlert')">
                <a-switch
                  v-decorator="[
                    'enableCodeScanAlert',
                    {
                      initialValue: formData.enableCodeScanAlert,
                      valuePropName: 'checked'
                    },
                  ]"
                ></a-switch>
              </a-form-item>
            </a-col>
            <a-col :md="{ span: 12 }" :xxl="{ span: 8 }">
              <a-form-item :label="$t('form.securityNotice')">
                <a-input
                  type="textarea"
                  :rows="4"
                  v-decorator="[
                    'securityNotice',
                    {
                      initialValue: formData.securityNotice
                    },
                  ]"
                  :placeholder="$t('placeholder.securityNoticePlaceholder')"
                ></a-input>
              </a-form-item>
            </a-col>
          </a-row>
        </a-card>
        <!-- 协作者 -->
        <a-card :title="$t('form.collaborators')">
          <edit-table
            :max-length="10"
            :columns="editTableColumns"
            v-model="formData.collaborators"
          ></edit-table>
        </a-card>
        <!-- 提交按钮 -->
        <a-card>
          <a-space :span="16">
            <a-button
              v-permit="'func:complex-form-submit'"
              type="primary"
              html-type="submit"
              :loading="submitLoading"
            >
              {{ $t('common.submit') }}
            </a-button>
            <a-button>
              {{ $t('common.reset') }}
            </a-button>
          </a-space>
        </a-card>
      </a-form>
      <!-- 弹窗 -->
      <a-modal
        :title="securityPolicyModal.title"
        :visible="securityPolicyModal.visible"
        @ok="handleSecurityPolicyModalOk"
        @cancel="handleSecurityPolicyModalCancel"
      >
        <a-input
          type="textarea"
          v-model="securityPolicyModal.value"
          :rows="12"
          :auto-size="{ minRows: 12, maxRows: 12 }"
          :placeholder="$t('placeholder.securityPolicyPlaceholder')"
        ></a-input>
      </a-modal>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import EditTable from '@/components/EditTable'
const DEFAULTSecurityPolicy = '# Security Policy' +
  '\n## Supported Versions' +
  '\nUse this section to tell people about which versions of your project are' +
  '\ncurrently being supported with security updates.' +
  '\n' +
  '\n| Version | Supported          |' +
  '\n| ------- | ------------------ |' +
  '\n| 5.1.x   | :white_check_mark: |' +
  '\n| 5.0.x   | :x:                |' +
  '\n| 4.0.x   | :white_check_mark: |' +
  '\n| < 4.0   | :x:                |' +
  '\n' +
  '\n## Reporting a Vulnerability' +
  '\n' +
  '\nUse this section to tell people how to report a vulnerability.' +
  '\n' +
  '\nTell them where to go, how often they can expect to get an update on a' +
  '\nreported vulnerability, what to expect if the vulnerability is accepted or' +
  '\ndeclined, etc.'
const initForm = {
  // 仓库信息
  repository: '',
  domain: '',
  branch: '',
  type: '1',
  manager: undefined,
  // 安全设置
  enableSecurityPolicy: false,
  securityPolicy: '',
  securityNotice: '',
  enableDependabotAlert: false,
  enableCodeScanAlert: false,
  // 协作者
  collaborators: []
}
export default {
  name: 'ComplexForm',
  components: {
    EditTable
  },
  data () {
    return {
      routes: [
        {
          path: '/form',
          breadcrumbName: this.$t('menu.form')
        },
        {
          path: '/form-complex',
          breadcrumbName: this.$t('menu.complexForm')
        }
      ],
      // 编辑表格列配置
      editTableColumns: [
        {
          type: 'input',
          key: 'mail',
          rules: [
            { required: true, message: 'Please input account mail' }
          ],
          placeholder: this.$t('placeholder.memberMailPlaceholder'),
          title: this.$t('form.memberMail')
        }, {
          type: 'input',
          key: 'name',
          rules: [
            { required: true, message: 'Please input account name' }
          ],
          placeholder: this.$t('placeholder.memberNamePlaceholder'),
          title: this.$t('form.memberName')
        }, {
          type: 'select',
          key: 'permission',
          props: { mode: 'tags', maxTagCount: 1 }, // 控件属性
          options: [
            {
              label: 'branch:push',
              value: 'branch:push'
            },
            {
              label: 'branch:add',
              value: 'branch:add'
            },
            {
              label: 'branch:delete',
              value: 'branch:delete'
            },
            {
              label: 'branch:merge',
              value: 'branch:merge'
            }
          ], // 下拉选项
          initialValue: ['branch:push'],
          format: (val) => (val ? val.length : 0),
          placeholder: this.$t('placeholder.memberPermissionPlaceholder'),
          title: this.$t('form.memberPermission')
        }
      ],
      // 表单数据
      formData: {
        ...initForm
      },
      submitLoading: false,
      // 表单布局
      formItemLayout: {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 }
      },
      // 安全策略
      securityPolicyModal: {
        visible: false,
        title: this.$t('form.setSecurityPolicy'),
        value: ''
      }
    }
  },

  computed: {
    ...mapState({
      repositoryType: state => state.options.repository_type
    })
  },

  beforeCreate () {
    this.form = this.$form.createForm(this, {
      name: 'validate_other',
      onValuesChange: (props, values) => {
        this.formData = {
          ...this.formData,
          ...values
        }
      }
    })
  },

  methods: {
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.submitLoading = true
          console.log('Received values of form: ', values)
          setTimeout(() => {
            this.submitLoading = false
          }, 1500)
        }
      })
    },

    // 表单验证
    validateSecurityPolicy (rule, value, callback) {
      if (value && !this.formData.securityPolicy) {
        callback(new Error(this.$t('placeholder.securityPolicyPlaceholder')))
      }
      callback()
    },

    // 弹窗事件
    handleClickSecurityPolicy () {
      this.$set(this.securityPolicyModal, 'visible', true)
      this.$set(this.securityPolicyModal, 'value', this.formData.securityPolicy || DEFAULTSecurityPolicy)
    },

    handleSecurityPolicyModalOk () {
      this.formData.securityPolicy = this.securityPolicyModal.value
      this.handleSecurityPolicyModalCancel()
      this.$nextTick(() => {
        const fieldsValueAndErrors = this.formData.securityPolicy
          ? {}
          : { errors: [new Error(this.$t('placeholder.securityPolicyPlaceholder'))] }
        this.form && this.form.setFields({
          enableSecurityPolicy: fieldsValueAndErrors
        })
      })
    },

    handleSecurityPolicyModalCancel () {
      this.securityPolicyModal.visible = false
    }
  }
}
</script>
