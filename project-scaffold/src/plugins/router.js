import Vue from 'vue'
import VueRouter from 'vue-router'
import { beforeEach, afterEach } from '@/config/router'
import routes from '@/routes'
import getRoutes from '@/routes/asyncRoutes'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'hash', // 'history'
  base: '/', // base: '/app/',
  routes
})

// TODO 能在index.html直接返回 账号权限，使用动态路由
// 目前无法已进入获取账号权限，所以先设置所有路由，根据 permitCode 控制路由跳转
// getRoutes 不带参数，返回所有动态路由配置
// getRoutes 带参数（array），返回有权限的动态路由配置
// router.addRoute('', getRoutes()) // 支持router.addRoute 使用-推荐
router.addRoutes([getRoutes()]) // 不支持router.addRoute 使用

router.beforeEach(beforeEach)
router.afterEach(afterEach)

export default router
