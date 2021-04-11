<template>
  <div class="wsd-basic-table__search">
    <a-form
      layout="inline"
      :form="searchForm"
    >
      <a-form-item>
        <a-select
          style="width: 100px"
          v-model="searchForm.year"
          :title="$t('date.year')"
          :placeholder="$t('date.year')"
          :options="yearOptions"
        ></a-select>
      </a-form-item>
      <a-form-item>
        <a-select
          style="width: 100px"
          v-model="searchForm.month"
          :title="$t('date.month')"
          :placeholder="$t('date.month')"
          :options="monthOptions"
        ></a-select>
      </a-form-item>
      <a-form-item>
        <a-input
          v-model="searchForm.name"
          allowClear
          :placeholder="$t('table.resourceName')"
          @keyup.enter="handleSearch"
        />
      </a-form-item>
      <a-form-item>
        <a-button
          :loading="loading"
          type="primary"
          @click="handleSearch(true)"
        >搜索</a-button>
      </a-form-item>
      <a-form-item>
        <a-button
          :loading="loading"
          @click="handleReset"
        >重置</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'BasicTableSearch',
  props: {
    loading: Boolean
  },

  inject: ['eventBus'],

  data () {
    return {
      // 查询
      searchForm: {
        year: '',
        month: '',
        name: ''
      }
    }
  },

  computed: {
    // 年份选择
    yearOptions () {
      const options = [
        {
          label: this.$t('options.unlimited'),
          value: ''
        }
      ]
      const createtime = new Date(this.userInfo.createtime)
      for (let i = new Date().getFullYear(); i > createtime.getFullYear(); i--) {
        options.push({
          label: i,
          value: i
        })
      }
      return options
    },

    // 月份选择
    monthOptions () {
      const options = [
        {
          label: this.$t('options.unlimited'),
          value: ''
        }
      ]
      if (this.searchForm.year) {
        for (let i = 1; i <= 12; i++) {
          options.push({
            label: i + this.$t('table.month'),
            value: i
          })
        }
      }
      return options
    },

    ...mapState({
      userInfo: state => state.user.userInfo
    })
  },

  watch: {
    'searchForm.year' (newVal) {
      if (!newVal) {
        this.searchForm.month = ''
      }
    }
  },

  created () {
    this.eventBus.$on('refresh', this.handleSearch)
  },

  methods: {
    // 搜索
    handleSearch (init) {
      this.eventBus.$emit('search', this.searchForm, init)
    },

    // 重置
    handleReset () {
      this.$set(this.searchForm, 'year', '')
      this.$set(this.searchForm, 'month', '')
      this.$set(this.searchForm, 'name', '')
      this.handleSearch(true)
    }
  }
}
</script>
