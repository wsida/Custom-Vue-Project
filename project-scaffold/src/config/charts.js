// charts 相关配置
const CHART_COLORS = ['#ae7bff', '#92ce22', '#ff8823', '#ee5e37', '#edafda', '#59c4e6', '#a5e7f0', '#516b91']

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
    textStyle: {
      fontSize: 12,
      color: 'rgba(0, 0, 0, .65)'
    },
    backgroundColor: '#fff'
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
    trigger: 'axis',
    textStyle: {
      fontSize: 12,
      color: 'rgba(0, 0, 0, .65)'
    },
    backgroundColor: '#fff'
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
}
