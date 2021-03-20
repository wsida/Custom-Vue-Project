// 根级别 mutations
import {
  SET_COLLAPSED,
  SET_OPENKEYS,
  SET_SELECTEDKEYS
} from './types'
export default {
  [SET_COLLAPSED] (state, collapsed) {
    state.collapsed = collapsed
  },
  [SET_OPENKEYS] (state, openKeys) {
    state.openKeys = openKeys
  },
  [SET_SELECTEDKEYS] (state, selectedKeys) {
    state.selectedKeys = selectedKeys
  }
}
