// user 模块
import axios from '@/plugins/axios'

import {
  SET_USER_INFO,
  SET_USER_PERMIT_FUNCS,
  SET_USER_PERMIT_MENUS,
  GET_USER_INFO
} from '../types'

export default {
  state: {
    userInfo: {},
    funcs: [],
    menus: []
  },

  getters: {
    hasPermit (state) {
      return (code) => {
        return code && state.menus.includes(code)
      }
    }
  },

  mutations: {
    [SET_USER_INFO] (state, userInfo) {
      state.userInfo = userInfo
    },
    [SET_USER_PERMIT_MENUS] (state, menus) {
      state.menus = menus
    },
    [SET_USER_PERMIT_FUNCS] (state, funcs) {
      state.funcs = funcs
    }
  },

  actions: {
    [GET_USER_INFO] ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        axios.post('/user/get', payload).then(res => {
          console.log(res)
          if (res.data && res.data.code === '0') {
            commit(SET_USER_INFO, res.data.data)
            commit(SET_USER_PERMIT_MENUS, res.data.data.menus)
            commit(SET_USER_PERMIT_FUNCS, res.data.data.funcs)
            resolve(false)
          } else {
            resolve(true)
          }
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}
