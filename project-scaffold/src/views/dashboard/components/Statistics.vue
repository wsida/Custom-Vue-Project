<template>
  <a-row class="wsd-dashboard-row" :gutter="16">
    <!-- total resources -->
    <a-col :span="6">
      <count-card
        class="wsd-dashboard-count"
        large
        :unit="$t('dashboard.unit_ge')"
        :title="$t('dashboard.total_resources')"
        :value="stasticsCount.totalResources"
      ></count-card>
    </a-col>
    <!-- total download -->
    <a-col :span="6">
      <count-card
        class="wsd-dashboard-count"
        align="top"
        :title="$t('dashboard.total_download')"
        :value="stasticsCount.totalDownload[0]"
        :trend="stasticsCount.totalDownload"
      >
        <wsd-charts
          slot="icon"
          :height="72"
          :loading="weekDownload.loading"
          :isNoData="weekDownload.isNoData"
          :isFailed="weekDownload.isFailed"
          :option="weekDownload.option"
        ></wsd-charts>
      </count-card>
    </a-col>
    <a-col :span="6">
      <count-card
        class="wsd-dashboard-count"
        align="top"
        :title="$t('dashboard.total_likes')"
        :value="stasticsCount.totalLikes[0]"
        :trend="stasticsCount.totalLikes"
      >
        <wsd-charts
          slot="icon"
          :height="72"
          :loading="weekLikes.loading"
          :isNoData="weekLikes.isNoData"
          :isFailed="weekLikes.isFailed"
          :option="weekLikes.option"
        ></wsd-charts>
      </count-card>
    </a-col>
    <a-col :span="6">
      <count-card
        class="wsd-dashboard-count"
        align="top"
        :title="$t('dashboard.total_comments')"
        :value="stasticsCount.totalComments[0]"
        :trend="stasticsCount.totalComments"
      >
        <wsd-charts
          slot="icon"
          :height="72"
          :loading="weekComments.loading"
          :isNoData="weekComments.isNoData"
          :isFailed="weekComments.isFailed"
          :option="weekComments.option"
        ></wsd-charts>
      </count-card>
    </a-col>
  </a-row>
</template>

<script>
import CountCard from '@/components/CountCard'
import WsdCharts from '@/components/WsdCharts'
import { mapState } from 'vuex'
import {
  SIMPLE_AREA_LINE_OPTION
} from '@/config/charts'
import _ from 'lodash'

export default {
  name: 'Statistics',
  components: {
    CountCard,
    WsdCharts
  },

  data () {
    return {
      // 统计
      stasticsCount: {
        totalResources: 0,
        totalDownload: [0, 0],
        totalLikes: [0, 0],
        totalComments: [0, 0]
      },
      weekDownload: {
        loading: false,
        isNoData: false,
        isFailed: false,
        option: _.cloneDeep({
          ...SIMPLE_AREA_LINE_OPTION,
          tooltip: {
            ...SIMPLE_AREA_LINE_OPTION.tooltip,
            position: function (point, params, dom, rect, size) {
              return [point[0], point[1] + 20]
            }
          }
        })
      },
      weekLikes: {
        loading: false,
        isNoData: false,
        isFailed: false,
        option: {
          ...SIMPLE_AREA_LINE_OPTION,
          tooltip: _.cloneDeep({
            ...SIMPLE_AREA_LINE_OPTION.tooltip,
            position: function (point, params, dom, rect, size) {
              return [point[0], point[1] + 20]
            }
          })
        }
      },
      weekComments: {
        loading: false,
        isNoData: false,
        isFailed: false,
        option: _.cloneDeep({
          ...SIMPLE_AREA_LINE_OPTION,
          tooltip: {
            ...SIMPLE_AREA_LINE_OPTION.tooltip,
            position: function (point, params, dom, rect, size) {
              return [point[0], point[1] + 20]
            }
          }
        })
      }
    }
  },

  computed: {
    ...mapState({
      // userInfo: state => state.user.userInfo
    })
  },

  mounted () {
    this.getTotalStatistic()
  },

  methods: {
    // 仪表盘
    getTotalStatistic () {
      this.weekDownload.loading = true
      this.weekLikes.loading = true
      this.weekComments.loading = true
      this.$api['dashboard/totalStatistic']().then(res => {
        this.weekDownload.isFailed = false
        this.weekLikes.isFailed = false
        this.weekComments.isFailed = false
        if (res.data && res.data.code === '0') {
          const resData = res.data.data
          // console.log(resData)
          // 统计总数
          this.$set(this.stasticsCount, 'totalResources', resData.totalResources || 0)
          this.$set(this.stasticsCount.totalDownload, 0, resData.weekDownload.slice(-1)[0].value || 0)
          this.$set(this.stasticsCount.totalLikes, 0, resData.weekLikes.slice(-1)[0].value || 0)
          this.$set(this.stasticsCount.totalComments, 0, resData.weekComments.slice(-1)[0].value || 0)

          this.$set(this.stasticsCount.totalDownload, 1, resData.weekDownload.slice(-2, -1)[0].value || 0)
          this.$set(this.stasticsCount.totalLikes, 1, resData.weekLikes.slice(-2, -1)[0].value || 0)
          this.$set(this.stasticsCount.totalComments, 1, resData.weekComments.slice(-2, -1)[0].value || 0)

          // 图例
          this.weekDownload.isNoData = false
          this.weekLikes.isNoData = false
          this.weekComments.isNoData = false
          this.weekDownload.option.series[0].data = resData.weekDownload
          this.weekDownload.option.xAxis.data = resData.weekDownload.map(item => item.name)
          this.weekLikes.option.series[0].data = resData.weekLikes
          this.weekLikes.option.xAxis.data = resData.weekLikes.map(item => item.name)
          this.weekComments.option.series[0].data = resData.weekComments
          this.weekComments.option.xAxis.data = resData.weekComments.map(item => item.name)
        } else {
          this.weekDownload.isNoData = true
          this.weekLikes.isNoData = true
          this.weekComments.isNoData = true
          this.weekDownload.option.series[0].data = []
          this.weekLikes.option.series[0].data = []
          this.weekComments.option.series[0].data = []
        }
      }).catch(_ => {
        this.weekDownload.isFailed = true
        this.weekLikes.isFailed = true
        this.weekComments.isFailed = true
        this.weekDownload.isNoData = false
        this.weekLikes.isNoData = false
        this.weekComments.isNoData = false
        this.weekDownload.option.series[0].data = []
        this.weekLikes.option.series[0].data = []
        this.weekComments.option.series[0].data = []
      }).finally(_ => {
        this.weekDownload.loading = false
        this.weekLikes.loading = false
        this.weekComments.loading = false
      })
    }
  }
}
</script>
