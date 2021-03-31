<template>
  <a-row class="wsd-dashboard-row">
    <a-col :span="24">
      <simple-card
        :title="$t('dashboard.resource_type_statistic')"
      >
        <wsd-charts
          :height="typeStastics.height"
          :loading="typeStastics.loading"
          :isNoData="typeStastics.isNoData"
          :isFailed="typeStastics.isFailed"
          :option="typeStastics.option"
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
  BASIC_BAR_OPTION
} from '@/config/charts'
import _ from 'lodash'

export default {
  name: 'ResourceTypeBar',
  components: {
    SimpleCard,
    WsdCharts
  },

  data () {
    return {
      // 类型统计
      typeStastics: {
        height: 320,
        loading: false,
        isNoData: false,
        isFailed: false,
        option: {
          ..._.cloneDeep(BASIC_BAR_OPTION),
          color: [CHART_COLORS[3], CHART_COLORS[4]],
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
      downloadType: state => state.options.download_type
      // userInfo: state => state.user.userInfo
    })
  },

  mounted () {
    this.getTypeStastics()
  },

  methods: {
    // 标签统计
    getTypeStastics () {
      this.typeStastics.loading = true
      this.$api['dashboard/typeStastics']().then(res => {
        this.typeStastics.isFailed = false
        if (res.data && res.data.code === '0') {
          this.typeStastics.isNoData = false
          this.typeStastics.option.xAxis.data = res.data.data.map(item => item.name)
          this.typeStastics.option.series[0].data = res.data.data.map(item => item.value)
        } else {
          this.typeStastics.isNoData = true
          this.typeStastics.option.series[0].data = []
        }
      }).catch(_ => {
        this.typeStastics.isFailed = true
        this.typeStastics.isNoData = false
        this.typeStastics.option.series[0].data = []
      }).finally(_ => {
        this.typeStastics.loading = false
      })
    }
  }
}
</script>
