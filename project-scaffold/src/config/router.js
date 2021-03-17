/**
 * router 配置
 */
import NProgress from 'nprogress' // Progress 进度条
import staticRoutes from '@/routes/staticRoutes'
import store from '@/store'
import VueCookie from 'vue-cookie'
import {
  USER_TOKEN
} from '@/config/cookies'
import {
  GET_USER_INFO
} from '@/store/types'

const WHITE_ROUTES = [] // 必须指定路由名称
// 获取静态路由名称
const loopWhiteRoutes = (routes) => {
  routes.forEach(route => {
    WHITE_ROUTES.push(route.name)
    if (route.children) {
      loopWhiteRoutes(route.children)
    }
  })
}
loopWhiteRoutes(staticRoutes)

export const BASE_CONFIG = {
  mode: 'hash',
  base: '/',
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
}

export async function beforeEach (to, from, next) {
  NProgress.start()
  next()
  // 登录判断 - 否则跳转
  if (WHITE_ROUTES.indexOf(to.name) !== -1) {
    next()
  } else {
    const token = VueCookie.get(USER_TOKEN)
    if (!token) {
      next({ name: 'login' })
    } else if (!store.state.user.userInfo || JSON.stringify(store.state.user.userInfo) === '{}') {
      await store.dispatch(GET_USER_INFO, { token }).then(toLogin => {
        if (toLogin) {
          next({ name: 'login' })
        } else {
          // 目前只有加载所有路由 - 利用权限码判断
          // 菜单权限判断
          if (to.meta && to.meta.permitCode && store.getters.hasPagePermit(to.meta.permitCode)) {
            next()
          } else {
            next({ name: '403' })
          }
        }
      }).catch(err => {
        console.log(err)
        next(from)
      })
    } else {
      // 目前只有加载所有路由 - 利用权限码判断
      // 菜单权限判断
      if (to.meta && to.meta.permitCode && store.getters.hasPagePermit(to.meta.permitCode)) {
        next()
      } else {
        next({ name: '403' })
      }
    }
  }
}

export function afterEach (to, from) {
  NProgress.done()
}
