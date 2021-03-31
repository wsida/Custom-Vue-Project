<template>
  <a-row class="wsd-dashboard-row">
    <a-col :span="24">
      <simple-card
        :title="$t('dashboard.resource_type_ratio')"
      >
        <wsd-charts
          :height="typeRatioHeight"
          :option="typeRatio.option"
          :loading="typeRatio.loading"
          :isNoData="typeRatio.isNoData"
          :isFailed="typeRatio.isFailed"
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
  BASIC_PIE_OPTION
} from '@/config/charts'

export default {
  name: 'DownloadTypePie',
  components: {
    SimpleCard,
    WsdCharts
  },

  data () {
    return {
      // 资源类型
      typeRatio: {
        loading: false,
        isNoData: false,
        isFailed: false,
        option: {
          ...BASIC_PIE_OPTION
        }
      }
    }
  },

  computed: {
    typeRatioHeight () {
      return parseInt((window.innerWidth - 232) / 4, 10)
    },

    ...mapState({
      downloadType: state => state.options.download_type
      // userInfo: state => state.user.userInfo
    })
  },

  mounted () {
    this.getResourceTypeRatio()
  },

  methods: {
    // 下载类型统计
    getResourceTypeRatio () {
      this.typeRatio.loading = true
      this.$api['dashboard/resourceTypeRatio']().then(res => {
        this.typeRatio.isFailed = false
        if (res.data && res.data.code === '0') {
          this.typeRatio.isNoData = false
          this.typeRatio.option.series[0].data = res.data.data.map(item => {
            const type = item.type
            const typeItem = this.downloadType.find(dt => dt.value === type)
            return {
              name: typeItem.name,
              value: item.value
            }
          })
        } else {
          this.typeRatio.isNoData = true
          this.typeRatio.option.series[0].data = []
        }
      }).catch(_ => {
        this.typeRatio.isFailed = true
        this.typeRatio.isNoData = false
        this.typeRatio.option.series[0].data = []
      }).finally(_ => {
        this.typeRatio.loading = false
      })
    }
  }
}
</script>
