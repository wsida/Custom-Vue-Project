<template>
  <a-row class="wsd-dashboard-row">
      <a-col :span="24">
        <simple-card
          :title="$t('dashboard.user_behavior')"
        >
          <wsd-charts
            :height="userBehavior.height"
            :loading="userBehavior.loading"
            :isNoData="userBehavior.isNoData"
            :isFailed="userBehavior.isFailed"
            :option="userBehavior.option"
          ></wsd-charts>
        </simple-card>
      </a-col>
    </a-row>
</template>

<script>
import SimpleCard from '@/components/SimpleCard'
import WsdCharts from '@/components/WsdCharts'
import { mapState } from 'vuex'
import {
  BASIC_SCATTER_OPTION
} from '@/config/charts'
import _ from 'lodash'

export default {
  name: 'UserBehaviorScatter',
  components: {
    SimpleCard,
    WsdCharts
  },

  data () {
    return {
      // 用户行为
      userBehavior: {
        height: 360,
        loading: false,
        isNoData: false,
        isFailed: false,
        option: {
          ..._.cloneDeep(BASIC_SCATTER_OPTION),
          series: []
        }
      }
    }
  },

  computed: {
    ...mapState({
      // userInfo: state => state.user.userInfo
    })
  },

  mounted () {
    this.getUserBehavior()
  },

  methods: {
    // 用户行为
    getUserBehavior () {
      this.userBehavior.loading = true
      this.$api['dashboard/userBehavior']().then(res => {
        this.userBehavior.isFailed = false
        if (res.data && res.data.code === '0' && res.data.data.length) {
          const charts = res.data.data
          this.userBehavior.isNoData = false
          this.userBehavior.option.xAxis.data = charts[0].data.map(item => item.name)
          charts.forEach(chart => {
            this.userBehavior.option.series.push({
              ..._.cloneDeep(BASIC_SCATTER_OPTION.series[0]),
              data: chart.data,
              name: chart.name
            })
          })
          console.log(this.userBehavior.option)
        } else {
          this.userBehavior.isNoData = true
          this.userBehavior.option.series = []
        }
      }).catch(_ => {
        this.userBehavior.isFailed = true
        this.userBehavior.isNoData = false
        this.userBehavior.option.series = []
      }).finally(_ => {
        this.userBehavior.loading = false
      })
    }
  }
}
</script>
