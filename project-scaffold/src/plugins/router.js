import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from '@/routes'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'hash', // 'history'
  base: '/', // base: '/app/',
  routes
})

export default router
