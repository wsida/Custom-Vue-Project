<template>
  <div class="wsd-edit-table">
    <div class="wsd-edit-table__content">
      <a-table
        :row-key="rowKey"
        :columns="localColumns"
        :data-source="data"
        :bordered="bordered"
        :pagination="pagination"
        :scroll="{ y: height }"
      >
        <template
          v-for="col in editColumns"
          :slot="col"
          slot-scope="text, record, index"
        >
          <div :key="col">
            <template v-if="editIndex === index">
              <!-- 输入框 -->
              <a-input
                v-if="typeColumns[col] === 'input'"
                v-bind="propsColumns[col]"
                :placeholder="placeholderColumns[col]"
                v-model="editForm[col]"
                @keyup.enter="handleSave"
              ></a-input>
              <!-- 下拉选择 -->
              <a-select
                v-else-if="typeColumns[col] === 'select'"
                v-bind="propsColumns[col]"
                style="width: 100%"
                :placeholder="placeholderColumns[col]"
                :options="optionsColumns[col]"
                v-model="editForm[col]"
              ></a-select>
            </template>
            <template v-else>
              {{ formatColumns[col] ? formatColumns[col](record[col]) : (record[col] || '') }}
            </template>
          </div>
        </template>
        <!-- 操作 -->
        <template slot="actions" slot-scope="text, record, index">
          <div class="editable-row-operations">
            <span v-if="index === editIndex">
              <a
                href="javascript:"
                @click="handleSave(index)"
              >{{ $t('common.save') }}</a>
              <a-divider type="vertical"></a-divider>
              <a-popconfirm :title="$t('message.cancelMessage')" @confirm="handleCancel(index)">
                <a href="javascript:" >{{ $t('common.cancel') }}</a>
              </a-popconfirm>
            </span>
            <span v-else>
              <a
                href="javascript:"
                :disabled="editIndex !== -1"
                @click="handleEdit(record, index)"
              >{{ $t('common.edit') }}</a>
              <a-divider type="vertical"></a-divider>
              <a-popconfirm :title="$t('message.deleteMessage')" @confirm="handleDelete(index)">
                <a :disabled="editIndex !== -1" href="javascript:" >{{ $t('common.delete') }}</a>
              </a-popconfirm>
            </span>
          </div>
        </template>
      </a-table>
    </div>
    <!-- 新增按钮 -->
    <div v-if="localShowButton" class="wsd-edit-table__button" style="margin-top: 12px;">
      <a-button
        block
        type="dashed"
        @click="handleAdd"
      >{{ buttonText || $t('common.add') }}</a-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EditTable',
  model: {
    prop: 'data',
    event: 'update:data'
  },

  props: {
    rowKey: {
      type: String,
      default: 'key'
    },

    columns: {
      type: Array,
      required: true
    },

    data: {
      type: Array,
      required: true
    },

    bordered: {
      type: Boolean,
      default: false
    },

    height: {
      type: Number,
      default: 360
    },

    pagination: {
      type: [Object, Boolean],
      default: false
    },

    showButton: {
      type: Boolean,
      default: true
    },

    buttonText: String,

    maxLength: Number
  },

  data () {
    return {
      editIndex: -1,
      editForm: {}
    }
  },

  computed: {
    localColumns () {
      if (!this.columns || !this.columns.length) return []
      return [
        ...this.columns.map(column => ({
          ...column,
          width: `${85 / this.columns.length}%`,
          scopedSlots: {
            customRender: column.key
          }
        })),
        {
          title: this.$t('table.actions'),
          dataIndex: 'actions',
          width: '15%',
          scopedSlots: { customRender: 'actions' }
        }
      ]
    },

    localShowButton () {
      return this.showButton && (!this.maxLength || this.maxLength > this.data.length)
    },

    editColumns () {
      return this.columns.map(column => column.key)
    },

    // 设置特殊展示的控件
    typeColumns () {
      const typeColumns = {}
      return this.columns.reduce((types, column) => {
        if (column.type) {
          types[column.key] = column.type
        }
        return types
      }, typeColumns)
    },

    // 设置特殊展示的控件
    propsColumns () {
      const propsColumns = {}
      return this.columns.reduce((props, column) => {
        props[column.key] = column.props || {}
        return props
      }, propsColumns)
    },

    // 设置默认值的控件
    initialFormData () {
      const initialFormData = {}
      return this.columns.reduce((form, column) => {
        const controlDefault = column.type === 'input' ? '' : undefined
        form[column.key] = column.initialValue || controlDefault
        return form
      }, initialFormData)
    },

    // 设置特殊展示的控件
    placeholderColumns () {
      const placeholderColumns = {}
      return this.columns.reduce((placeholders, column) => {
        if (column.placeholder) {
          placeholders[column.key] = column.placeholder || ''
        }
        return placeholders
      }, placeholderColumns)
    },

    // 设置特殊展示的控件
    optionsColumns () {
      const optionsColumns = {}
      return this.columns.reduce((options, column) => {
        if (column.options) {
          options[column.key] = column.options || []
        }
        return options
      }, optionsColumns)
    },

    // 设置验证的控件
    rulesColumns () {
      const rulesColumns = {}
      return this.columns.reduce((rules, column) => {
        if (column.rules) {
          rules[column.key] = column.rules || []
        }
        return rules
      }, rulesColumns)
    },

    // 设置特殊展示的控件
    formatColumns () {
      const formatColumns = {}
      return this.columns.reduce((format, column) => {
        const noop = (val) => (val)
        if (column.format && Object.prototype.toString.call(column.format).toLowerCase() === '[object function]') {
          format[column.key] = column.format || noop
        }
        return format
      }, formatColumns)
    }
  },

  methods: {
    // 验证
    validate (value, showMsg = true) {
      let valid = true
      let msg = ''
      for (const key in this.rulesColumns) {
        if (!valid) break
        const rules = this.rulesColumns[key]
        for (let i = 0; i < rules.length; i++) {
          const rule = rules[i]
          const ruleKeys = Object.keys(rule)
          // 解析规则
          // required
          if (ruleKeys.includes('required') && !value[key]) {
            valid = false
            msg = rule.message || this.$t('message.requiredValidateError', [key])
            break
          }
          // type
          if (ruleKeys.includes('type') && Object.prototype.toString.call(value[key]).toLowerCase() !== `[object ${rule.type}]`) {
            valid = false
            msg = rule.message || this.$t('message.defaultValidateError', [key, 'type'])
            break
          }
          // max
          if (ruleKeys.includes('max') && value[key] && value[key].length > rule.max) {
            valid = false
            msg = rule.message || this.$t('message.defaultValidateError', [key, 'length'])
            break
          }
          // min
          if (ruleKeys.includes('min') && value[key] && value[key].length < rule.min) {
            valid = false
            msg = rule.message || this.$t('message.defaultValidateError', [key, 'length'])
            break
          }
          // pattern
          if (ruleKeys.includes('pattern') && !rule.pattern.test(value[key])) {
            valid = false
            msg = rule.message || this.$t('message.defaultValidateError', [key, 'pattern'])
            break
          }
          // validator
          if (ruleKeys.includes('validator') && !rule.validator(rule, value[key])) {
            valid = false
            msg = rule.message || this.$t('message.defaultValidateError', [key, 'validator'])
            break
          }
        }
      }
      if (showMsg && msg) {
        this.$message.error(msg)
      }
      return valid
    },

    // 事件处理
    // 表格失焦
    handleTableBlur () {
      this.editIndex = -1
    },

    // 新增
    handleAdd () {
      if (this.editIndex === -1 || this.validate(this.editForm)) {
        const data = this.data
        const newRow = {
          ...this.initialFormData,
          add: true,
          [this.rowKey]: new Date().getTime()
        }
        // 默认保存正在编辑
        if (this.editIndex !== -1) {
          const saveForm = { ...this.editForm }
          delete saveForm.add
          data.splice(this.editIndex, 1, saveForm)
        }
        // 新增数据
        this.editIndex = data.length
        this.editForm = Object.assign({}, newRow)
        data.push(Object.assign({}, newRow))
        this.$emit('update:data', data)
        this.$nextTick(() => {
          const scrollDOM = this.$el.querySelector('.wsd-edit-table__content')
          scrollDOM.scrollTop = scrollDOM.scrollHeight
        })
      }
    },

    // 编辑
    handleEdit (record, index) {
      this.editIndex = index
      this.editForm = { ...record }
    },

    // 保存编辑
    handleSave (index) {
      if (this.validate(this.editForm)) {
        const saveForm = { ...this.editForm }
        delete saveForm.add
        this.updateData(index, saveForm)
        this.editIndex = -1
      }
    },

    // 取消编辑
    handleCancel (index) {
      if (this.data[index].add && !this.validate(this.data[index], false)) {
        this.updateData(index)
      }
      this.editIndex = -1
    },

    // 删除
    handleDelete (index) {
      if (this.editIndex !== -1) return
      this.updateData(index)
    },

    // 更新数据
    updateData (index, row) {
      const data = this.data
      if (row) {
        data.splice(index, 1, row)
      } else {
        data.splice(index, 1)
      }
      this.$emit('update:data', data)
    }
  }
}
</script>
