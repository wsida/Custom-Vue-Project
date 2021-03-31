<template>
  <div class="wsd-user-drawer__inner">
    <!-- 用户信息 -->
    <div class="wsd-user-drawer__content">
      <!-- 关闭按钮 -->
      <span class="wsd-user-drawer__span" @click="handleCloseDrawer">
        <a-icon type="close" />
      </span>
      <!-- 用户信息 -->
      <div class="wsd-user-drawer__header">
        <a-card class="wsd-user-drawer__info">
          <a-card-meta
            :border="false"
            :title="userInfo.username"
            :description="userInfo.description"
          >
            <template slot="avatar">
              <span class="wsd-user-drawer__avatarContent">
                <a-avatar
                  :src="userInfo.avatar"
                  :size="52"
                  icon="user"
                  class="wsd-user-drawer__avatar"
                  @click="handleChangeAvatar"
                />
                <span class="wsd-user-drawer__avatarMask">
                  {{$t('common.modifyAvatar')}}
                </span>
              </span>
            </template>
          </a-card-meta>
        </a-card>
        <div class="wsd-user-drawer__otherInfo">
          <!-- 手机 -->
          <div v-if="userInfo.telphone" class="wsd-user-drawer__otherInfoItem">
            <span class="wsd-user-drawer__otherInfoItem--icon" :title="$t('common.telphone')"><a-icon type="mobile" /></span>
            <span>{{userInfo.telphone}}</span>
          </div>
          <!-- 邮箱 -->
          <div v-if="userInfo.email" class="wsd-user-drawer__otherInfoItem">
            <span class="wsd-user-drawer__otherInfoItem--icon" :title="$t('common.email')"><a-icon type="mail" /></span>
            <span>{{userInfo.email}}</span>
          </div>
          <!-- 公司 -->
          <div v-if="userInfo.company" class="wsd-user-drawer__otherInfoItem">
            <span class="wsd-user-drawer__otherInfoItem--icon" :title="$t('common.company')"><a-icon type="bank" /></span>
            <span>{{userInfo.company}}</span>
          </div>
          <!-- 职位 -->
          <div v-if="userInfo.position" class="wsd-user-drawer__otherInfoItem">
            <span class="wsd-user-drawer__otherInfoItem--icon" :title="$t('common.position')"><a-icon type="user" /></span>
            <span>{{userInfo.position}}</span>
          </div>
          <!-- 地区 -->
          <div v-if="userInfo.region || userInfo.city" class="wsd-user-drawer__otherInfoItem">
            <span class="wsd-user-drawer__otherInfoItem--icon" :title="$t('common.region')"><a-icon type="environment" /></span>
            <span>{{userInfo.city ? userInfo.city + '-' : ''}}{{userInfo.region}}</span>
          </div>
        </div>
      </div>
      <!-- 主要内容 -->
      <div class="wsd-user-drawer__body">
        <!-- 广告牌 -->
        <!-- 快速入口 -->
        <div class="wsd-user-drawer__bodyChart">
          <div class="wsd-user-drawer__entrances">
            <div
              v-for="(entrance, index) in entrances"
              :key="index"
              class="wsd-user-drawer__entranceItem"
            >
              <div class="wsd-user-drawer__entranceIcon">
                <svg-icon :icon-class="entrance.ico" class-name="is-icon"></svg-icon>
              </div>
              <div class="wsd-user-drawer__entranceTitle">{{ entrance.title }}</div>
            </div>
          </div>
        </div>
        <!-- 今日访问量 -->
        <div class="wsd-user-drawer__bodyChart is-primary">
          <div class="wsd-user-drawer__title">
            <span>{{$t('chart.todayVisits')}}</span>
            <span>
              <a-tooltip placement="left" :title="$t('chart.todayVisits_tips')">
                <a-icon type="question-circle" />
              </a-tooltip>
            </span>
          </div>
          <div class="wsd-user-drawer__value">{{todayVisits.today | toThousand}}</div>
          <div class="wsd-user-drawer__chart">
            <wsd-charts
              autoresize
              height="120px"
              :option="todayVisits.option"
              :loading="todayVisits.loading"
              :isFailed="todayVisits.isFailed"
              :isNoData="todayVisits.isNoData"
            />
          </div>
        </div>
        <!-- 今日收益 -->
        <div class="wsd-user-drawer__bodyChart">
          <div class="wsd-user-drawer__title">
            <span>{{$t('chart.todayProfit')}}</span>
            <span>
              <a-tooltip placement="left" :title="$t('chart.todayProfit_tips')">
                <a-icon type="question-circle" />
              </a-tooltip>
            </span>
          </div>
          <div class="wsd-user-drawer__value">¥{{todayProfit.today | toThousand}}
          </div>
          <div class="wsd-user-drawer__chart">
            <wsd-charts
              autoresize
              height="120px"
              :option="todayProfit.option"
              :loading="todayProfit.loading"
              :isFailed="todayProfit.isFailed"
              :isNoData="todayProfit.isNoData"
            />
          </div>
        </div>
        <!-- 排行 -->
        <div class="wsd-user-drawer__bodyRanking" v-if="resourceRanking.length">
          <div class="wsd-user-drawer__rankingTitle">
            {{$t('chart.resourceRanking')}}
          </div>
          <template v-for="rank in resourceRanking">
            <div class="wsd-user-drawer__ranking" :key="rank.id">
              <div class="wsd-user-drawer__rankingLabel">
                <span class="wsd-user-drawer__rankingName">{{rank.name}}</span>
                <span class="wsd-user-drawer__rankingValue">
                  <span class="is-profit">¥{{rank.profit | toThousand}}</span>
                  <span class="is-ratio">{{rank.ratio | toPercentage}}</span>
                </span>
              </div>
              <div class="wsd-user-drawer__rankingBar">
                <a-progress
                  status="active"
                  :percent="rank.ratio | toPercentage(1, 0)"
                  :show-info="false"
                />
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
    <!-- 操作栏 -->
    <div class="wsd-user-drawer__footer">
      <a-button
        block
        @click="handleExit"
      >{{$t('common.logout')}}</a-button>
    </div>
  </div>
</template>

<script>
import WsdCharts from '@/components/WsdCharts'
import VueCookie from 'vue-cookie'
import { WSD_USER_TOKEN } from '@/config/cookies'
import { mapState } from 'vuex'
import { toThousand, toPercentage } from '@/utils/formatter'
import { SIMPLE_BAR_OPTION, SIMPLE_LINE_OPTION } from '@/config/charts'

export default {
  name: 'GlobalUserDrawer',
  components: {
    WsdCharts
  },

  props: {
    visible: Boolean
  },

  data () {
    return {
      entrances: [
        {
          ico: 'users-1',
          title: this.$t('operate.publish'),
          path: ''
        },
        {
          ico: 'users-2',
          title: this.$t('operate.upload'),
          path: ''
        },
        {
          ico: 'users-3',
          title: this.$t('operate.resources'),
          path: ''
        },
        {
          ico: 'users-4',
          title: this.$t('operate.information'),
          path: ''
        },
        {
          ico: 'users-5',
          title: this.$t('operate.modifyPassword'),
          path: ''
        },
        {
          ico: 'users-6',
          title: this.$t('operate.modifyPassword'),
          path: ''
        },
        {
          ico: 'users-7',
          title: this.$t('operate.modifyPassword'),
          path: ''
        },
        {
          ico: 'users-8',
          title: this.$t('operate.modifyPassword'),
          path: ''
        }
      ],
      // 图表
      // 今日访问量
      todayVisits: {
        loading: false,
        isFailed: false,
        isNoData: false,
        today: '-',
        option: {
          ...SIMPLE_BAR_OPTION,
          formatter: '{b}: {c}'
        }
      },

      // 今日收益
      todayProfit: {
        loading: false,
        isFailed: false,
        isNoData: false,
        today: '-',
        option: {
          ...SIMPLE_LINE_OPTION,
          tooltip: {
            ...SIMPLE_LINE_OPTION.tooltip,
            formatter: '{b}<br/>{a0}: ¥{c0}<br/>{a1}: ¥{c1}'
          }
        }
      },

      // 资源下载量排行
      resourceRanking: []
    }
  },

  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    })
  },

  filters: {
    toThousand,
    toPercentage
  },

  mounted () {
    this.getResourceRanking()
    this.getTodayVisits()
    this.getTodayProfit()
  },

  methods: {
    // 修改头像
    handleChangeAvatar () {

    },

    // 关闭drawer
    handleCloseDrawer () {
      this.$emit('update:visible', false)
    },

    // 退出登录
    handleExit () {
      VueCookie.delete(WSD_USER_TOKEN)
      window.location.reload()
    },

    // 获取今日访问量
    getTodayVisits () {
      const token = this.userInfo.token || ''
      this.todayVisits.loading = true
      this.$api['dashboard/todayVisits']({ token }).then(res => {
        if (res.data && res.data.code === '0') {
          this.todayVisits.today = res.data.data.today
          this.todayVisits.option.series = res.data.data.charts.map(chart => ({
            ...this.todayVisits.option.series[0],
            itemStyle: {
              color: '#fff'
            },
            barMinWidth: '8px',
            barMaxWidth: '18px',
            ...chart
          }))
          if (res.data.data.charts.length) {
            this.todayVisits.isNoData = false
          } else {
            this.todayVisits.isNoData = true
          }
          this.todayVisits.isFailed = false
        } else {
          this.todayVisits.isNoData = false
          this.todayVisits.isFailed = true
        }
      }).finally(_ => {
        this.todayVisits.loading = false
      })
    },

    // 获取今日收益
    getTodayProfit () {
      const token = this.userInfo.token || ''
      this.todayProfit.loading = true
      this.$api['dashboard/todayProfit']({ token }).then(res => {
        if (res.data && res.data.code === '0') {
          this.todayProfit.today = res.data.data.today
          if (res.data.data.charts.length) {
            this.todayProfit.option.xAxis.data = res.data.data.charts[0].data.map(item => item.name)
            this.todayProfit.option.series = res.data.data.charts.map(chart => ({
              ...this.todayProfit.option.series[0],
              ...chart
            }))
            this.todayProfit.isNoData = false
          } else {
            this.todayProfit.isNoData = true
          }
          this.todayProfit.isFailed = false
        } else {
          this.todayProfit.isNoData = false
          this.todayProfit.isFailed = true
        }
      }).finally(_ => {
        this.todayProfit.loading = false
      })
    },

    // 获取收益排行
    getResourceRanking () {
      const token = this.userInfo.token || ''
      this.$api['dashboard/resourceRanking']({ token }).then(res => {
        if (res.data && res.data.code === '0') {
          this.resourceRanking = res.data.data
        } else {
          this.resourceRanking = []
        }
      })
    }
  }
}
</script>
