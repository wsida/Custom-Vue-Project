import Vue from 'vue'
import Vuex from 'vuex'
// 模块引入
import user from './modules/user'

Vue.use(Vuex)

const store = new Vuex.Store({
  namespaced: true,
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

export default store
