import Vue from 'vue'
import VueRouter from 'vue-router'
import { beforeEach, afterEach } from '@/config/router'
import routes from '@/routes'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'hash', // 'history'
  base: '/', // base: '/app/',
  routes
})

router.beforeEach(beforeEach)
router.afterEach(afterEach)

export default router
