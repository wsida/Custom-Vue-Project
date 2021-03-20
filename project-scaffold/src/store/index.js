import Vue from 'vue'
import Vuex from 'vuex'
// 根级别
import state from './state'
import getters from './getters'
import actions from './actions'
import mutations from './mutations'
// 模块引入
// 动态全局引入
const modules = {}
const modulesName = require.context('./modules', false, /\.js$/)
modulesName.keys().forEach(m => {
  // [完整匹配，第一个括号匹配，第二个括号匹配]
  const moduleKeys = m.match(/\.\/(.*)(\.js)/)
  modules[moduleKeys[1]] = modulesName(m).default
})
// import user from './modules/user'

Vue.use(Vuex)

const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  modules
})

export default store
