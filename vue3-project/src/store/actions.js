// store 根actions
import {
  SET_USER,
  SET_MENU,
  GET_USER,
  GET_MENU
} from './types'

export default {
  [GET_USER]({commin}, payload) {
    commin(SET_USER, payload)
  },
  [GET_MENU]({commin}, payload) {
    commin(SET_MENU, payload)
  }
};
