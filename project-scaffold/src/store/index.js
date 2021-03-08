import Vue from 'vue'
import Vuex from 'vuex'
// 模块引入
import user from './modules/user'

Vue.use(Vuex)

export default new Vuex.Store({
  namespace: true,
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    user
  }
})
