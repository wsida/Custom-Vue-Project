// user 模块
import Types from '../types'
const {
  SET_USER_INFO
} = Types

export default {
  state: {
    userInfo: {}
  },
  getters: {},
  mutations: {
    [SET_USER_INFO] (state, userInfo) {
      state.userInfo = userInfo
    }
  },
  actions: {}
}
