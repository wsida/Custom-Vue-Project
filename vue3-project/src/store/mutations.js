// store 根mutations
import {
  SET_USER,
  SET_MENU
} from './types'

export default {
  [SET_USER](state, user) {
    state.user = user
  },
  [SET_MENU](state, menus) {
    state.menus = menus
  }
};
