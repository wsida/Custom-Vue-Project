// charts 相关配置
// 颜色盘
const CHART_COLORS = ['#ae7bff', '#92ce22', '#ff8823', '#ee5e37', '#edafda', '#59c4e6', '#a5e7f0', '#516b91']
// 默认tooltip样式
const DEFAULT_TOOLTIP_STYLE = {
  textStyle: {
    fontSize: 12,
    color: 'rgba(0, 0, 0, .65)'
  },
  backgroundColor: '#fff'
}
// 默认类型坐标轴
const DEFAULT_CATEGORY_AXIOS = {}
// 默认数值坐标轴
const DEFAULT_VALUE_AXIOS = {}

// Bar
export const SIMPLE_BAR_OPTION = {
  color: CHART_COLORS,
  xAxis: {
    type: 'category',
    show: false
  },
  yAxis: {
    type: 'value',
    show: false,
    min: 0
  },
  tooltip: {
    ...DEFAULT_TOOLTIP_STYLE
  },
  grid: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  series: [
    {
      type: 'bar',
      data: [],
      label: {
        normal: {
          show: false
        }
      },
      labelLine: {
        normal: {
          show: false
        }
      }
    }
  ]
}

export const BASIC_BAR_OPTION = {
  xAxis: {
    ...DEFAULT_CATEGORY_AXIOS
  },
  yAxis: {
    ...DEFAULT_VALUE_AXIOS
  }
}

// Line
export const SIMPLE_LINE_OPTION = {
  color: CHART_COLORS,
  xAxis: {
    type: 'category',
    show: false
  },
  yAxis: {
    type: 'value',
    show: false,
    min: 0
  },
  tooltip: {
    ...DEFAULT_TOOLTIP_STYLE
  },
  grid: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  series: [
    {
      type: 'line',
      data: [],
      smooth: true,
      symbol: 'none',
      label: {
        normal: {
          show: false
        }
      },
      labelLine: {
        normal: {
          show: false
        }
      },
      lineStyle: {
        width: 3,
        shadowBlur: 8,
        shadowColor: 'rgba(0, 0, 0, .25)',
        shadowOffsetX: -3,
        shadowOffsetY: 5
      }
    }
  ]
}

export const BASIC_LINE_OPTION = {
  xAxis: {
    ...DEFAULT_CATEGORY_AXIOS
  },
  yAxis: {
    ...DEFAULT_VALUE_AXIOS
  }
}

// Pie
export const BASIC_PIE_OPTION = {
  color: CHART_COLORS,
  tooltip: {
    ...DEFAULT_TOOLTIP_STYLE
  },
  series: [
    {
      type: 'pie',
      radius: ['55%', '90%'],
      center: ['50%', '50%'],
      data: [],
      label: {
        show: false,
        position: 'center'
      },
      labelLine: {
        normal: {
          show: false
        }
      },
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      emphasis: {
        focus: 'self',
        scale: false,
        label: {
          show: true,
          fontSize: 14,
          color: 'rgba(0, 0, 0, .65)'
        },
        itemStyle: {
          // borderWidth: 2,
          borderColor: 'rgba(0, 0, 0, .5)'
        }
      },
      blur: {
        itemStyle: {
          opacity: 0.5
        }
      }
    }
  ]
}
