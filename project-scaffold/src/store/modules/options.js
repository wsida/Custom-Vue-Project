import i18n from '@/i18n'
import Vue from 'vue'

import {
  SET_RESOURCE_CLASS,
  GET_RESOURCE_CLASS
} from '../types'

const year = new Date().getFullYear()
const yearOptions = [
  {
    name: year + i18n.t('date.yearUnit'),
    value: year
  }
]
for (let y = 1; y <= 15; y++) {
  yearOptions.push({
    name: (year + y) + i18n.t('date.yearUnit'),
    value: year + y
  })
  yearOptions.unshift({
    name: (year - y) + i18n.t('date.yearUnit'),
    value: year - y
  })
}

// 全局字典值维护
const state = {
  // 系统默认年份 +15 -15
  year_options: yearOptions,
  // 月份
  month_options: [
    {
      name: i18n.t('date.jan'),
      value: 1
    }, {
      name: i18n.t('date.feb'),
      value: 2
    }, {
      name: i18n.t('date.mar'),
      value: 3
    }, {
      name: i18n.t('date.apr'),
      value: 4
    }, {
      name: i18n.t('date.may'),
      value: 5
    }, {
      name: i18n.t('date.jun'),
      value: 6
    }, {
      name: i18n.t('date.jul'),
      value: 7
    }, {
      name: i18n.t('date.aug'),
      value: 8
    }, {
      name: i18n.t('date.sep'),
      value: 9
    }, {
      name: i18n.t('date.oct'),
      value: 10
    }, {
      name: i18n.t('date.nov'),
      value: 11
    }, {
      name: i18n.t('date.dec'),
      value: 12
    }
  ],

  // 上传状态
  upload_status: [
    {
      name: i18n.t('options.audit'),
      value: '0'
    },
    {
      name: i18n.t('options.passed'),
      value: '1'
    },
    {
      name: i18n.t('options.failed'),
      value: '2'
    },
    {
      name: i18n.t('options.private'),
      value: '3'
    }
  ],

  // 资源状态
  resource_status: [
    {
      name: i18n.t('options.audit'),
      value: '0'
    },
    {
      name: i18n.t('options.passed'),
      value: '1'
    },
    {
      name: i18n.t('options.failed'),
      value: '2'
    },
    {
      name: i18n.t('options.unmounted'),
      value: '3'
    },
    {
      name: i18n.t('options.canceled'),
      value: '4'
    }
  ],

  // 下载方式
  download_type: [
    {
      name: i18n.t('options.freeDownload'),
      value: '0'
    },
    {
      name: i18n.t('options.pointsDownload'),
      value: '1'
    },
    {
      name: i18n.t('options.vipDownload'),
      value: '2'
    }
  ],

  // 默认分类
  resource_class: [],

  // 银行
  bank_options: [
    {
      name: i18n.t('options.bank_zs'),
      value: 'zs'
    },
    {
      name: i18n.t('options.bank_js'),
      value: 'js'
    },
    {
      name: i18n.t('options.bank_gs'),
      value: 'gs'
    },
    {
      name: i18n.t('options.bank_qz'),
      value: 'qz'
    },
    {
      name: i18n.t('options.bank_xm'),
      value: 'xm'
    },
    {
      name: i18n.t('options.bank_xy'),
      value: 'xy'
    },
    {
      name: i18n.t('options.bank_ny'),
      value: 'ny'
    },
    {
      name: i18n.t('options.bank_xys'),
      value: 'xys'
    }
  ],

  // 我的卡包
  pay_account_options: [
    {
      name: i18n.t('options.bank_zs') + '(9999)',
      value: 'zs-9999'
    },
    {
      name: i18n.t('options.bank_xy') + '(6666)',
      value: 'xy-6666'
    },
    {
      name: i18n.t('options.bank_js') + '(8888)',
      value: 'js-8888'
    }
  ],

  //
  repository_type: [
    {
      name: i18n.t('options.rpublic'),
      value: '1'
    },
    {
      name: i18n.t('options.rprivate'),
      value: '2'
    }
  ]
}
const getters = {}
const mutations = {
  [SET_RESOURCE_CLASS] (state, resourceClass) {
    state.resource_class = resourceClass
  }
}
const actions = {
  [GET_RESOURCE_CLASS] ({ commit }) {
    Vue.prototype.$api['public/getResourceClass']().then(res => {
      if (res.data && res.data.code === '0') {
        commit(SET_RESOURCE_CLASS, res.data.data)
      }
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
