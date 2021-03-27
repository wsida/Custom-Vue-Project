<template>
  <div class="wsd-dashboard">
    <a-row :gutter="16" class="wsd-dashboard-row">
      <!-- left -->
      <a-col :span="18">
        <!-- count stastics -->
        <!-- <a-row class="wsd-dashboard-row" :gutter="16">
          <a-col :span="6">
            <count-card
              class="wsd-dashboard-count"
              large
              :unit="$t('dashboard.unit_ge')"
              :title="$t('dashboard.total_resources')"
              :value="12000"
            ></count-card>
          </a-col>
          <a-col :span="6">
            <count-card
              class="wsd-dashboard-count"
              align="top"
              :title="$t('dashboard.total_download')"
              :value="12000"
            >
              <wsd-charts
                slot="icon"
                :height="80"
              ></wsd-charts>
            </count-card>
          </a-col>
          <a-col :span="6">
            <count-card
              class="wsd-dashboard-count"
              align="top"
              :title="$t('dashboard.total_likes')"
              :value="120000"
            >
              <wsd-charts
                slot="icon"
                :height="80"
              ></wsd-charts>
            </count-card>
          </a-col>
          <a-col :span="6">
            <count-card
              class="wsd-dashboard-count"
              align="top"
              :title="$t('dashboard.total_comments')"
              :value="12000000"
            >
              <wsd-charts
                slot="icon"
                :height="80"
              ></wsd-charts>
            </count-card>
          </a-col>
        </a-row> -->
        <!-- resource type stastics -->
        <a-row class="wsd-dashboard-row">
          <a-col :span="24">
            <simple-card
              :title="$t('dashboard.resource_type_statistic')"
            >
            </simple-card>
          </a-col>
        </a-row>
        <!-- download trend -->
        <a-row class="wsd-dashboard-row">
          <a-col :span="24">
            <simple-card
              :title="$t('dashboard.download_trend')"
            >
            </simple-card>
          </a-col>
        </a-row>
        <!-- user behavior -->
        <a-row class="wsd-dashboard-row">
          <a-col :span="24">
            <simple-card
              :title="$t('dashboard.user_behavior')"
            >
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
// import CountCard from '@/components/CountCard'
import SimpleCard from '@/components/SimpleCard'
import WsdCharts from '@/components/WsdCharts'
import axios from 'axios'
import { mapState } from 'vuex'
import { toThousand } from '@/utils/formatter'
import {
  BASIC_PIE_OPTION
} from '@/config/charts'

export default {
  name: 'Dashboard',
  components: {
    // CountCard,
    SimpleCard,
    WsdCharts
  },
  data () {
    return {
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
      }
    }
  },

  computed: {
    typeRatioHeight () {
      return parseInt((window.innerWidth - 232) / 4, 10)
    },

    ...mapState({
      downloadType: state => state.options.download_type,
      userInfo: state => state.user.userInfo
    })
  },

  filters: {
    toThousand
  },

  created () {
    axios.all([this.getResourceTypeRatio(), this.getDownloadRanking()])
    // .then(axios.spread(() => {

    // }))
  },

  methods: {
    getResourceTypeRatio () {
      this.typeRatio.loading = true
      const token = this.userInfo.token
      this.$api['dashboard/resourceTypeRatio']({ token }).then(res => {
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
          console.log(this.typeRatio.option)
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

    getDownloadRanking () {
      this.downloadRanking.loading = true
      const token = this.userInfo.token
      this.$api['dashboard/downloadRanking']({ token }).then(res => {
        if (res.data && res.data.code === '0') {
          this.downloadRanking.list = res.data.data
        }
      }).finally(_ => {
        this.downloadRanking.loading = false
      })
    }
  }
}
</script>
