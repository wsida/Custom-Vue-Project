import i18n from '@/i18n'
import Vue from 'vue'

import {
  SET_RESOURCE_CLASS,
  GET_RESOURCE_CLASS
} from '../types'

// 全局字典值维护
const state = {
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
  resource_class: []
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
