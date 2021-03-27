<template>
  <div class="wsd-component-chart">
    <a-spin :spinning="loading">
      <!-- 图表实例 -->
      <div
        v-if="!isNoData && !isFailed"
        class="wsd-component-chart__instance"
        :id="localId"
        :style="{height: localHeight}"
      ></div>
      <!-- 处理结果 -->
      <div v-else class="wsd-component-chart__result">
        <template v-if="isNoData">
          <slot name="noData">
            <div class="wsd-component-chart__resultTitle">{{$t('common.noData')}}</div>
          </slot>
        </template>
        <template v-else-if="isFailed">
          <slot name="falied">
            <div class="wsd-component-chart__resultTitle">{{$t('common.failed')}}</div>
          </slot>
        </template>
      </div>
    </a-spin>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { addResizeListener, removeResizeListener } from '@/utils/resize-event'

let id = 1

export default {
  name: 'WsdCharts',
  props: {
    loading: Boolean,

    isFailed: Boolean,

    isNoData: Boolean,

    option: {
      type: Object,
      required: true
    },

    height: {
      type: [Number, String],
      default: 200
    },

    autoResize: Boolean
  },

  data () {
    return {
      id: id++,
      chartInstance: null
    }
  },

  computed: {
    localId () {
      return `wsd-charts-id-${this.id}`
    },

    localHeight () {
      return typeof this.height === 'string'
        ? this.height
        : `${this.height}px`
    },

    mergeOption () {
      const defaultOption = {}
      return {
        ...defaultOption,
        ...this.option
      }
    }
  },

  watch: {
    option: {
      handler () {
        this.init()
      },
      deep: true
    },

    height: {
      handler () {
        this.handleResize()
      },
      deep: true
    }
  },

  mounted () {
    this.init()
    addResizeListener(document.getElementById(this.localId), this.handleResize)
  },

  beforeDestroy () {
    removeResizeListener(document.getElementById(this.localId), this.handleResize)
  },

  methods: {
    init () {
      if (!this.chartInstance) {
        this.chartInstance = echarts.init(document.getElementById(this.localId))
      }
      this.chartInstance.setOption(this.mergeOption)
    },

    handleResize () {
      this.chartInstance && this.chartInstance.resize()
    }
  }
}
</script>
