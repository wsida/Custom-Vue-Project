<template>
  <a-row class="wsd-dashboard-row">
    <a-col :span="24">
      <simple-card
        :title="$t('dashboard.download_trend')"
      >
        <wsd-charts
          :height="downloadTrend.height"
          :loading="downloadTrend.loading"
          :isNoData="downloadTrend.isNoData"
          :isFailed="downloadTrend.isFailed"
          :option="downloadTrend.option"
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
  CHART_COLORS,
  BASIC_LINE_OPTION
} from '@/config/charts'
import _ from 'lodash'

export default {
  name: 'DownloadTrendLine',
  components: {
    SimpleCard,
    WsdCharts
  },

  data () {
    return {
      // 下载趋势
      downloadTrend: {
        height: 320,
        loading: false,
        isNoData: false,
        isFailed: false,
        option: {
          ..._.cloneDeep(BASIC_LINE_OPTION),
          color: [CHART_COLORS[4], CHART_COLORS[5]],
          toolbox: {
            show: true,
            right: 0,
            top: 0,
            feature: {
              dataView: { show: true },
              dataZoom: { show: true },
              saveAsImage: { show: true }
            }
          }
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
    this.getDownloadTrend()
  },

  methods: {
    // 下载趋势
    getDownloadTrend () {
      this.downloadTrend.loading = true
      this.$api['dashboard/downloadTrend']().then(res => {
        this.downloadTrend.isFailed = false
        if (res.data && res.data.code === '0') {
          this.downloadTrend.isNoData = false
          this.downloadTrend.option.xAxis.data = res.data.data.map(item => item.name)
          this.downloadTrend.option.series[0].data = res.data.data.map(item => item.value)
        } else {
          this.downloadTrend.isNoData = true
          this.downloadTrend.option.series[0].data = []
        }
      }).catch(_ => {
        this.downloadTrend.isFailed = true
        this.downloadTrend.isNoData = false
        this.downloadTrend.option.series[0].data = []
      }).finally(_ => {
        this.downloadTrend.loading = false
      })
    }
  }
}
</script>
