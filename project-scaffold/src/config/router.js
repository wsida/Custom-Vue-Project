/**
 * router 配置
 */
import NProgress from 'nprogress' // Progress 进度条

export const BASE_CONFIG = {
  mode: 'hash',
  base: '/',
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
}

export function beforeEach (to, from, next) {
  NProgress.start()
  next()
}

export function afterEach (to, from, next) {
  NProgress.done()
  next()
}
