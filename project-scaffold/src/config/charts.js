// charts 相关配置
// 颜色盘
export const CHART_COLORS = ['#ae7bff', '#92ce22', '#ff8823', '#2a8ff7', '#59c4e6', '#ee5e37', '#edafda', '#a5e7f0', '#516b91']

// 默认tooltip样式
export const DEFAULT_TOOLTIP_STYLE = {
  textStyle: {
    fontSize: 12,
    color: 'rgba(0, 0, 0, .65)'
  },
  backgroundColor: '#fff'
}

// 默认类型坐标轴
export const DEFAULT_CATEGORY_AXIOS = {
  type: 'category',
  show: true,
  data: [],
  axisLine: {
    show: true,
    lineStyle: {
      color: '#d9d9d9'
    }
  },
  axisTick: {
    show: false
  },
  axisLabel: {
    show: true,
    color: 'rgba(0, 0, 0, .5)'
  },
  splitLine: {
    show: false
  }
}

// 默认数值坐标轴
export const DEFAULT_VALUE_AXIOS = {
  type: 'value',
  show: true,
  min: 0,
  axisLine: {
    show: false
  },
  axisTick: {
    show: false
  },
  axisLabel: {
    show: true,
    color: 'rgba(0, 0, 0, .5)'
  },
  splitLine: {
    show: true,
    lineStyle: {
      color: '#d9d9d9'
    }
  }
}

// 默认常规网格区域
export const DEFAULT_GRID = {
  top: 48,
  bottom: 24,
  left: 48,
  right: 12
}

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
  color: CHART_COLORS,
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    },
    ...DEFAULT_TOOLTIP_STYLE
  },
  xAxis: {
    ...DEFAULT_CATEGORY_AXIOS
  },
  yAxis: {
    ...DEFAULT_VALUE_AXIOS
  },
  grid: {
    ...DEFAULT_GRID
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
      },
      itemStyle: {
        borderRadius: [6, 6, 0, 0]
      },
      barMaxWidth: 24,
      barMinWidth: 12
    }
  ]
}

// Line
export const SIMPLE_LINE_OPTION = {
  color: CHART_COLORS,
  xAxis: {
    type: 'category',
    data: [],
    show: false
  },
  yAxis: {
    type: 'value',
    show: false,
    min: 0
  },
  tooltip: {
    trigger: 'axis',
    confine: true,
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

export const SIMPLE_AREA_LINE_OPTION = {
  color: CHART_COLORS,
  xAxis: {
    type: 'category',
    data: [],
    show: false
  },
  yAxis: {
    type: 'value',
    show: false,
    min: 0
  },
  tooltip: {
    trigger: 'axis',
    // confine: true,
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
        width: 2
      },
      areaStyle: {
        opacity: 0.5
      }
    }
  ]
}

export const BASIC_LINE_OPTION = {
  color: CHART_COLORS,
  tooltip: {
    trigger: 'axis',
    ...DEFAULT_TOOLTIP_STYLE,
    axisPointer: {
      show: true,
      type: 'cross',
      crossStyle: {
        type: 'dashed',
        color: '#d9d9d9',
        width: 1
      }
    }
  },
  xAxis: {
    ...DEFAULT_CATEGORY_AXIOS
  },
  yAxis: {
    ...DEFAULT_VALUE_AXIOS
  },
  grid: {
    ...DEFAULT_GRID,
    right: 32
  },
  series: [
    {
      type: 'line',
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
      },
      itemStyle: {
        borderRadius: [6, 6, 0, 0]
      },
      barMaxWidth: 24,
      barMinWidth: 12
    }
  ]
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

// scatter
export const BASIC_SCATTER_OPTION = {
  color: CHART_COLORS,
  tooltip: {
    trigger: 'item',
    ...DEFAULT_TOOLTIP_STYLE,
    axisPointer: {
      show: true,
      type: 'cross',
      crossStyle: {
        type: 'dashed',
        color: '#d9d9d9',
        width: 1
      }
    }
  },
  xAxis: {
    ...DEFAULT_CATEGORY_AXIOS
  },
  yAxis: {
    ...DEFAULT_VALUE_AXIOS
  },
  grid: {
    ...DEFAULT_GRID
  },
  series: [
    {
      type: 'scatter',
      emphasis: {
        focus: 'series'
      },
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
