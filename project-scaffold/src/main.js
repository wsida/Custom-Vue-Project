import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './plugins/router'
import Antd from 'ant-design-vue'
import '@/styles/index.less'
import './plugins/axios'
import './api'

// mock 接口数据模拟
import './mock'

// 使用插件
Vue.use(Antd)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
