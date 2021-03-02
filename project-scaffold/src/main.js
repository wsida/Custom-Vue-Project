import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './plugins/router'
import './plugins/axios'
import './api'

// mock 接口数据模拟
import './mock'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
