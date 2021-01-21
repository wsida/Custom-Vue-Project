/**
 * router 配置
 */
export const BASE_CONFIG = {
  mode: 'hash',
  base: '/',
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
}

export function beforeEach (to, from, next) {
  next()
}

export function afterEach (to, from, next) {
  next()
}
