<template>
  <div class="wsd-workspace">
    <a-page-header :breadcrumb="{ props: { routes } }"/>
    <!-- 日历 -->
    <div class="wsd-workspace__calendar">
      <a-spin :spinning="loading">
        <a-calendar
          v-model="selectedDay"
          mode="month"
        >
          <!-- 工具栏 -->
          <div slot="headerRender" class="wsd-workspace__toolbox">
            <a-row>
              <a-col :span="12">
                <a-select
                  style="width: 96px;"
                  class="is-margin-right"
                  v-model="selectedYear"
                  :options="year_options"
                  @change="handleYearChange"
                ></a-select>
                <a-select
                  style="width: 96px"
                  class="is-margin-right"
                  v-model="selectedMonth"
                  :options="month_options"
                  @change="handleMonthChange"
                ></a-select>
                <a-button-group>
                  <a-button @click="handleSetSelected('0d')">{{ $t('date.today') }}</a-button>
                  <a-button @click="handleSetSelected('-1d')">{{ $t('date.yesterday') }}</a-button>
                  <a-button @click="handleSetSelected('-2d')">{{ $t('date.lastYesterday') }}</a-button>
                </a-button-group>
              </a-col>
              <a-col :span="12" style="text-align:right">
                <a-button type="primary" @click="handleAddRemind" icon="plus">新增</a-button>
              </a-col>
            </a-row>
          </div>
          <div class="wsd-date-render" slot="dateFullCellRender" slot-scope="value">
            <div class="ant-fullcalendar-value">
              <span class="is-value">{{ value.date() }}</span>
            </div>
            <div class="ant-fullcalendar-content">
              <page-scrollable direction="vertical" :height="96">
                <page-scrollable-item v-for="remind in filteReminds(value)" :key="remind.id">
                  <div
                    :class="[
                      'wsd-workspace__remind',
                      `is-${remindStatus([remind.start, remind.end])}`,
                      remind.id === selectedRemind && 'is-selected'
                    ]"
                    @click="handleViewRemind(remind)"
                  >
                    {{ remind.title }}
                  </div>
                </page-scrollable-item>
              </page-scrollable>
            </div>
          </div>
        </a-calendar>
      </a-spin>
    </div>
  </div>
</template>

<script>
import Moment from 'moment'
import { mapState } from 'vuex'
export default {
  name: 'Workspace',
  data () {
    return {
      routes: [
        {
          path: '/workspace',
          breadcrumbName: this.$t('menu.workspace')
        }
      ],
      loading: false,
      selectedYear: new Moment().year(),
      selectedMonth: new Moment().month() + 1,
      selectedDay: new Moment(),
      reminds: [],
      selectedRemind: null
    }
  },

  computed: {
    ...mapState({
      year_options: state => state.options.year_options.map(item => ({ label: item.name, value: item.value })),
      month_options: state => state.options.month_options.map(item => ({ label: item.name, value: item.value }))
    })
  },

  watch: {
    selectedDay (newVal) {
      this.selectedYear = newVal.year()
      this.selectedMonth = newVal.month() + 1
    },

    selectedYear () {
      // 请求数据
      this.getReminds()
    },

    selectedMonth () {
      // 请求数据
      this.getReminds()
    }
  },

  mounted () {
    this.getReminds()
  },

  methods: {
    // 切换时间
    handleSetSelected (time) {
      const type = time.substr(-1)
      const value = parseInt(time.substr(0, time.length - 1), 10)
      if (value < 0) {
        this.selectedDay = new Moment().subtract(Math.abs(value), type)
      } else {
        this.selectedDay = new Moment().add(Math.abs(value), type)
      }
    },

    // 切换年份
    handleYearChange (value) {
      this.selectedDay = new Moment(this.selectedDay.year(value))
    },

    // 切换月份
    handleMonthChange (value) {
      this.selectedDay = new Moment(this.selectedDay.month(value - 1))
    },

    // 查看提醒任务
    getReminds () {
      this.loading = true
      const params = {
        date: (this.selectedDay || new Moment()).format('YYYY-MM')
      }
      this.$api['workspace/getReminds'](params).then(res => {
        console.log(res.data)
        if (res.data && res.data.code === '0') {
          this.reminds = res.data.data
        } else {
          this.reminds = []
        }
      }).catch(_ => {
        this.reminds = []
      }).finally(_ => {
        this.loading = false
      })
    },

    // 过滤指定日期的提醒事件
    filteReminds (value) {
      if (!value) return []
      const date = new Moment(value).format('YYYY-MM-DD')
      const remind = this.reminds.find(remind => remind.date === date)
      return remind ? remind.list : []
    },

    // 查看提醒事件状态
    remindStatus (range) {
      if (!range) return 'await'
      const _now = new Moment()
      const start = new Moment(range[0])
      const end = new Moment(range[1])
      if (_now.isBefore(start)) return 'await'
      if (_now.isAfter(end)) return 'finish'
      return 'active'
    },

    // 新增提醒事件
    handleAddRemind () {},

    // 查看提醒事件
    handleViewRemind (remind) {
      if (this.selectedRemind !== remind.id) {
        this.selectedRemind = remind.id
      } else {
        this.selectedRemind = null
      }
    }
  }
}
</script>
