<template>
  <div class="wsd-dashboard">
    <a-row :gutter="16" class="wsd-dashboard-row">
      <!-- left -->
      <a-col :span="18">
        <!-- count stastics -->
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
        <!-- resource type stastics -->
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
        <!-- download trend -->
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
        <!-- user behavior -->
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
      </a-col>
      <!-- right -->
      <a-col :span="6">
        <!-- type ratio -->
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
        <!-- download ranking -->
        <a-row class="wsd-dashboard-row">
          <a-col :span="24">
            <simple-card
              :title="$t('dashboard.download_ranking')"
            >
              <a-list
                :loading="downloadRanking.loading"
                :data-source="downloadRanking.list"
              >
                <div
                  slot="renderItem"
                  slot-scope="item, index"
                  :key="item.id"
                  class="wsd-dashboard-ranking__item"
                >
                  <span class="wsd-dashboard-ranking__index">{{ index + 1}}</span>
                  <span class="wsd-dashboard-ranking__name">{{ item.name }}</span>
                  <span class="wsd-dashboard-ranking__count">{{ item.count | toThousand }}</span>
                </div>
              </a-list>
            </simple-card>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import CountCard from '@/components/CountCard'
import SimpleCard from '@/components/SimpleCard'
import WsdCharts from '@/components/WsdCharts'
import axios from 'axios'
import { mapState } from 'vuex'
import { toThousand } from '@/utils/formatter'
import {
  CHART_COLORS,
  BASIC_PIE_OPTION,
  SIMPLE_AREA_LINE_OPTION,
  BASIC_LINE_OPTION,
  BASIC_BAR_OPTION,
  BASIC_SCATTER_OPTION
} from '@/config/charts'
import _ from 'lodash'

export default {
  name: 'Dashboard',
  components: {
    CountCard,
    SimpleCard,
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
      },
      // 下载排行
      downloadRanking: {
        list: [],
        loading: false
      },
      // 资源类型
      typeRatio: {
        loading: false,
        isNoData: false,
        isFailed: false,
        option: {
          ...BASIC_PIE_OPTION
        }
      },
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
      },
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
      },
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
    typeRatioHeight () {
      return parseInt((window.innerWidth - 232) / 4, 10)
    },

    ...mapState({
      downloadType: state => state.options.download_type
      // userInfo: state => state.user.userInfo
    })
  },

  filters: {
    toThousand
  },

  created () {
    axios.all([
      this.getResourceTypeRatio(),
      this.getDownloadRanking(),
      this.getTotalStatistic(),
      this.getTypeStastics(),
      this.getDownloadTrend(),
      this.getUserBehavior()
    ])
    // .then(axios.spread(() => {

    // }))
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
    },

    // 下载排行
    getDownloadRanking () {
      this.downloadRanking.loading = true
      this.$api['dashboard/downloadRanking']().then(res => {
        if (res.data && res.data.code === '0') {
          this.downloadRanking.list = res.data.data
        }
      }).finally(_ => {
        this.downloadRanking.loading = false
      })
    },

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
    },

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
    },

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
    },

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
